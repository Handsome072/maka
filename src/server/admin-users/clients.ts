import type { NextRequest } from 'next/server';
import { authenticateAdmin } from '@/server/auth';
import { filled, input, intParam, json, notFound } from '@/server/http';
import { db, fetchAll, must } from '@/server/supabase';
import {
  RESERVATION_STATUS,
  ciEquals,
  collectionAvgRating,
  decimalSum,
  floatSum,
  formatCurrency,
  frDate,
  hourMinute,
  initials,
  isCurrentMonth,
  languageLabel,
  lookup,
  matchesSearch,
  mysqlAvgRating,
  padId,
  personName,
  phoneLabel,
  randInt,
  truthy,
  ymdInt,
} from './php';
import { findUser, formatDocument, formatNote, notesAndDocuments, phpInt, uniqueTruthy, type IdParams } from './users';

/** Portage d'AdminClientController (index, show, toggleSuspect, destroy). suspend / ban / activate / addNote : voir users.ts. */

const SPENT_STATUSES = ['confirmed', 'active', 'completed'];

const PAYMENT_STATUS: Record<string, string> = {
  completed: 'REUSSI',
  confirmed: 'REUSSI',
  active: 'REUSSI',
  pending: 'EN ATTENTE',
  cancelled: 'REMBOURSE',
};

type Name = { first_name: string | null; last_name: string | null } | null;

// ─── GET /api/admin/clients ───────────────────────────────────────────────────

type ClientIndexRow = {
  id: number;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  phone_country_code: string | null;
  address_country: string | null;
  identity_verified: boolean;
  client_status: string | null;
  is_suspect: boolean;
  created_at: string | null;
  reservations: Array<{ status: string; total_price: number | null }>;
  guest_reviews: Array<{ rating: number }>;
};

const CLIENT_INDEX_SELECT = [
  'id', 'role', 'first_name', 'last_name', 'email', 'phone', 'phone_country_code', 'address_country',
  'identity_verified', 'client_status', 'is_suspect', 'created_at',
  'reservations:reservations!reservations_guest_id_fkey(status,total_price)',
  'guest_reviews:guest_reviews!guest_reviews_guest_id_fkey(rating)',
].join(',');

export async function clientsIndexData(query: Record<string, any>) {
  const rows = await fetchAll<ClientIndexRow>(() =>
    db()
      .from('users')
      .select(CLIENT_INDEX_SELECT)
      .neq('role', 'admin')
      .order('created_at', { ascending: false, nullsFirst: false })
      .order('id', { ascending: false }),
  );

  // Filtres appliqués avec les règles de comparaison MySQL (utf8mb4_unicode_ci)
  const users = rows.filter((user) => {
    if (ciEquals(user.role, 'admin')) return false;
    if (filled(query.search) && !matchesSearch(user, query.search)) return false;
    if (filled(query.status) && !ciEquals(user.client_status, query.status)) return false;
    if (filled(query.verified) && user.identity_verified !== (query.verified === 'verified')) return false;
    if (filled(query.country) && !ciEquals(user.address_country, query.country)) return false;
    if (filled(query.suspect) && user.is_suspect !== (query.suspect === 'true')) return false;
    return true;
  });

  const clientsData = users.map((user) => {
    const totalBookings = user.reservations.length;
    const totalSpent = decimalSum(
      user.reservations.filter((r) => SPENT_STATUSES.includes(r.status)).map((r) => r.total_price),
    );
    const avgRating = mysqlAvgRating(user.guest_reviews.map((review) => review.rating));

    return {
      id: user.id,
      name: personName(user.first_name, user.last_name),
      email: user.email,
      avatar: initials(user.first_name, user.last_name ?? ''),
      phone: phoneLabel(user.phone, user.phone_country_code, ''),
      country: user.address_country ?? '',
      verified: Boolean(user.identity_verified),
      totalBookings,
      totalSpent: formatCurrency(totalSpent),
      totalSpentValue: totalSpent,
      joinDate: frDate(user.created_at),
      joinDateValue: ymdInt(user.created_at),
      averageRating: avgRating,
      status: user.client_status ?? 'ACTIF',
      isSuspect: Boolean(user.is_suspect),
    };
  });

  const now = new Date();
  const stats = {
    totalClients: clientsData.length,
    totalActive: clientsData.filter((c) => c.status === 'ACTIF').length,
    totalVerified: clientsData.filter((c) => c.verified === true).length,
    newThisMonth: users.filter((u) => isCurrentMonth(u.created_at, now)).length,
    totalSuspended: clientsData.filter((c) => c.status === 'SUSPENDU' || c.status === 'BANNI').length,
    totalSuspect: clientsData.filter((c) => c.isSuspect === true).length,
    countries: uniqueTruthy(clientsData.map((c) => c.country)),
  };

  return { clients: clientsData, stats };
}

export async function index(req: NextRequest): Promise<Response> {
  await authenticateAdmin(req);
  return json(await clientsIndexData(await input(req)));
}

// ─── GET /api/admin/clients/{id} ──────────────────────────────────────────────

type ReservationRow = {
  id: number;
  listing_id: number;
  status: string;
  total_price: number | null;
  check_in: string;
  check_out: string;
  cancellation_reason: string | null;
  created_at: string | null;
  updated_at: string | null;
  listing: { title: string | null; user: Name } | null;
};

type GuestReviewRow = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string | null;
  host: Name;
  listing: { title: string | null } | null;
};

type ReportRow = {
  id: number;
  reason: string;
  description: string | null;
  status: string;
  created_at: string | null;
  reporter: Name;
};

type ActivityRow = {
  id: number;
  action: string;
  detail: string | null;
  ip: string | null;
  created_at: string | null;
};

export async function clientShowData(id: number) {
  const client = must(await db().from('users').select('*').eq('id', id).maybeSingle());
  if (!client) {
    notFound('User', id);
  }

  const [[notes, documents], reportsResult, reservations, reviewsLeftResult, guestReviews, activityResult] = await Promise.all([
    notesAndDocuments(id),
    db()
      .from('client_reports')
      .select('id,reason,description,status,created_at,reporter:users!client_reports_reporter_id_fkey(first_name,last_name)')
      .eq('client_id', id)
      .order('id'),
    fetchAll<ReservationRow>(() =>
      db()
        .from('reservations')
        .select(
          'id,listing_id,status,total_price,check_in,check_out,cancellation_reason,created_at,updated_at,listing:listings!reservations_listing_id_fkey(title,user:users!listings_user_id_fkey(first_name,last_name))',
        )
        .eq('guest_id', id)
        .order('created_at', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false }),
    ),
    db().from('reviews').select('id', { count: 'exact', head: true }).eq('user_id', id),
    fetchAll<GuestReviewRow>(() =>
      db()
        .from('guest_reviews')
        .select(
          'id,rating,comment,created_at,host:users!guest_reviews_host_id_fkey(first_name,last_name),listing:listings!guest_reviews_listing_id_fkey(title)',
        )
        .eq('guest_id', id)
        .order('created_at', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false }),
    ),
    db()
      .from('activity_logs')
      .select('id,action,detail,ip,created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false, nullsFirst: false })
      .order('id', { ascending: false })
      .limit(20),
  ]);

  if (reviewsLeftResult.error) {
    throw reviewsLeftResult.error;
  }
  const reports = must(reportsResult) as unknown as ReportRow[];
  const activity = must(activityResult) as ActivityRow[];

  const totalBookings = reservations.length;
  const cancellations = reservations.filter((r) => r.status === 'cancelled').length;
  const totalSpent = floatSum(reservations.filter((r) => SPENT_STATUSES.includes(r.status)).map((r) => r.total_price));
  const reviewsLeft = reviewsLeftResult.count ?? 0;
  const avgRating = collectionAvgRating(guestReviews.map((review) => review.rating));

  const bookingsData = reservations.map((res) => ({
    property: res.listing?.title ?? `Logement #${res.listing_id}`,
    host: res.listing && res.listing.user ? personName(res.listing.user.first_name, res.listing.user.last_name) : 'Inconnu',
    dates: `${frDate(res.check_in)} - ${frDate(res.check_out)}`,
    amount: truthy(res.total_price) ? formatCurrency(res.total_price as number) : '0 €',
    status: lookup(RESERVATION_STATUS, res.status) ?? res.status,
  }));

  const paymentsData = reservations
    .filter((res) => (res.total_price ?? 0) > 0)
    .map((res) => ({
      id: `PAY-${padId(res.id, 3)}`,
      amount: formatCurrency(res.total_price as number),
      status: lookup(PAYMENT_STATUS, res.status) ?? 'REUSSI',
      date: frDate(res.created_at),
    }));

  const disputesData = reservations
    .filter((res) => res.status === 'cancelled' && truthy(res.cancellation_reason))
    .map((res) => ({
      id: `DIS-${padId(res.id, 3)}`,
      property: res.listing?.title ?? `Logement #${res.listing_id}`,
      status: 'RESOLU',
      date: frDate(res.updated_at),
      description: res.cancellation_reason,
    }));

  const reviewsData = guestReviews.map((review) => ({
    id: review.id,
    hostName: review.host ? personName(review.host.first_name, review.host.last_name) : 'Inconnu',
    hostAvatar: review.host ? initials(review.host.first_name, review.host.last_name ?? '') : '??',
    property: review.listing?.title ?? 'Logement',
    rating: Number(review.rating),
    comment: review.comment ?? '',
    date: frDate(review.created_at),
  }));

  const reportsData = reports.map((report) => ({
    id: report.id,
    reporter: report.reporter ? `${personName(report.reporter.first_name, report.reporter.last_name)} (Hote)` : 'Inconnu',
    reason: report.reason,
    description: report.description ?? '',
    date: frDate(report.created_at),
    status: report.status,
  }));

  const activityData = activity.map((log) => ({
    id: log.id,
    action: log.action,
    detail: log.detail ?? '',
    date: `${frDate(log.created_at)} ${hourMinute(log.created_at)}`,
    ip: log.ip ?? '',
  }));

  const refundsData = reservations
    .filter((res) => res.status === 'cancelled' && (res.total_price ?? 0) > 0)
    .map((res) => ({
      id: `REM-${padId(res.id, 3)}`,
      reservationId: `RES-${padId(res.id, 3)}`,
      amount: formatCurrency(res.total_price as number),
      reason: res.cancellation_reason ?? 'Annulation voyageur',
      status: 'EFFECTUE',
      date: frDate(res.updated_at),
    }));

  const documentsData = documents.map(formatDocument);
  const notesData = notes.map(formatNote);
  const now = new Date();

  return {
    client: {
      id: client.id,
      name: personName(client.first_name, client.last_name),
      email: client.email,
      avatar: initials(client.first_name, client.last_name ?? ''),
      phone: phoneLabel(client.phone, client.phone_country_code, ''),
      country: client.address_country ?? '',
      verified: Boolean(client.identity_verified),
      joinDate: frDate(client.created_at),
      language: languageLabel(client.preferred_language),
      status: client.client_status ?? 'ACTIF',
      isSuspect: Boolean(client.is_suspect),
      averageRating: avgRating,
      totalSpent: formatCurrency(totalSpent),
      verificationDate: client.verification_date ? frDate(client.verification_date) : null,
      documents: documentsData,
      totalBookings,
      cancellations,
      reviewsLeft,
      reviewsReceived: guestReviews.length,
      bookings: bookingsData,
      payments: paymentsData,
      disputes: disputesData,
      reviews: reviewsData,
      reports: reportsData,
      activityLog: activityData,
      refunds: refundsData,
      notes: notesData,
      risk: {
        lastLogin: client.last_login_at
          ? `${frDate(client.last_login_at)} a ${hourMinute(client.last_login_at)}`
          : `${frDate(now)} a ${hourMinute(now)}`,
        ip: client.last_login_ip ?? `192.168.1.${randInt(1, 254)}`,
        device: client.last_login_device ?? 'Chrome / macOS',
        fraudScore: phpInt(client.fraud_score ?? 5),
        loginCount: phpInt(client.login_count ?? 0),
        failedLogins: phpInt(client.failed_logins ?? 0),
      },
    },
  };
}

export async function show(req: NextRequest, params: IdParams): Promise<Response> {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'User');
  return json(await clientShowData(id));
}

// ─── POST /api/admin/clients/{id}/suspect ─────────────────────────────────────

export async function toggleSuspect(req: NextRequest, params: IdParams): Promise<Response> {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'User');
  const client = await findUser<{ id: number; is_suspect: boolean }>(id, 'id,is_suspect');
  const isSuspect = !client.is_suspect;
  must(await db().from('users').update({ is_suspect: isSuspect }).eq('id', id));

  return json({ message: isSuspect ? 'Client marque comme suspect.' : 'Client retire des suspects.' });
}

// ─── DELETE /api/admin/clients/{id} ───────────────────────────────────────────

export async function destroy(req: NextRequest, params: IdParams): Promise<Response> {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'User');
  const client = await findUser<{ id: number; auth_id: string | null }>(id, 'id,auth_id');

  // Les clés étrangères suppriment en cascade les données liées, comme sous MySQL
  must(await db().from('users').delete().eq('id', id));

  if (client.auth_id) {
    const { error } = await db().auth.admin.deleteUser(client.auth_id);
    if (error) {
      console.error(`[admin/clients] compte Supabase Auth ${client.auth_id} non supprimé`, error);
    }
  }

  return json({ message: 'Client supprime avec succes.' });
}
