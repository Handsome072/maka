import type { NextRequest } from 'next/server';
import { authenticateAdmin } from '@/server/auth';
import { filled, input, intParam, json, notFound } from '@/server/http';
import { round } from '@/server/format';
import { db, fetchAll, must } from '@/server/supabase';
import {
  RESERVATION_STATUS,
  accountAge,
  ciEquals,
  decimalSum,
  euroOrZero,
  formatCurrency,
  frDate,
  hourMinute,
  initials,
  languageLabel,
  lookup,
  matchesSearch,
  mysqlAvgRating,
  numberFormat0,
  padId,
  personName,
  phoneLabel,
  randInt,
  ymdInt,
} from './php';
import { formatDocument, formatNote, notesAndDocuments, phpInt, uniqueTruthy, type IdParams } from './users';

/** Portage d'AdminHostController (index, show). suspend / ban / activate / addNote : voir users.ts. */

const LISTING_STATUS: Record<string, string> = {
  active: 'ACTIF',
  pending: 'EN ATTENTE',
  draft: 'BROUILLON',
  archived: 'INACTIF',
  rejected: 'REJETE',
};

const SPACE_TYPE: Record<string, string> = {
  entire: 'Logement entier',
  private: 'Chambre privee',
  shared: 'Chambre partagee',
};

const PAYOUT_STATUS: Record<string, string> = {
  paid: 'VERSE',
  pending: 'EN ATTENTE',
  scheduled: 'PLANIFIE',
  failed: 'ECHOUE',
};

type Name = { first_name: string | null; last_name: string | null } | null;

// ─── GET /api/admin/hosts ─────────────────────────────────────────────────────

type HostIndexRow = {
  id: number;
  role: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  phone_country_code: string | null;
  address_country: string | null;
  identity_verified: boolean;
  host_status: string | null;
  profile_photo_url: string | null;
  created_at: string | null;
  listings: Array<{ id: number; reservations: Array<{ count: number }>; reviews: Array<{ rating: number }> }>;
  host_payouts: Array<{ net_amount: number }>;
};

// whereHas('listings') = jointure !inner ; nombre de réservations, notes et versements payés embarqués par hôte
const HOST_INDEX_SELECT = [
  'id', 'role', 'first_name', 'last_name', 'email', 'phone', 'phone_country_code', 'address_country',
  'identity_verified', 'host_status', 'profile_photo_url', 'created_at',
  'listings:listings!listings_user_id_fkey!inner(id,reservations:reservations!reservations_listing_id_fkey(count),reviews:reviews!reviews_listing_id_fkey(rating))',
  'host_payouts:host_payouts!host_payouts_host_id_fkey(net_amount)',
].join(',');

export async function hostsIndexData(query: Record<string, any>) {
  const rows = await fetchAll<HostIndexRow>(() =>
    db()
      .from('users')
      .select(HOST_INDEX_SELECT)
      .neq('role', 'admin')
      .eq('host_payouts.status', 'paid')
      .order('created_at', { ascending: false, nullsFirst: false })
      .order('id', { ascending: false }),
  );

  // Filtres appliqués avec les règles de comparaison MySQL (utf8mb4_unicode_ci)
  const hosts = rows.filter((host) => {
    if (ciEquals(host.role, 'admin')) return false;
    if (filled(query.search) && !matchesSearch(host, query.search)) return false;
    if (filled(query.status) && !ciEquals(host.host_status, query.status)) return false;
    if (filled(query.verified) && host.identity_verified !== (query.verified === 'verified')) return false;
    if (filled(query.country) && !ciEquals(host.address_country, query.country)) return false;
    return true;
  });

  const hostsData = hosts.map((host) => {
    const totalBookings = host.listings.reduce((sum, listing) => sum + (listing.reservations[0]?.count ?? 0), 0);
    const totalEarnings = decimalSum(host.host_payouts.map((payout) => payout.net_amount));
    const avgRating = mysqlAvgRating(host.listings.flatMap((listing) => listing.reviews.map((review) => review.rating)));

    return {
      id: host.id,
      name: personName(host.first_name, host.last_name),
      first_name: host.first_name,
      last_name: host.last_name,
      email: host.email,
      avatar: initials(host.first_name, host.last_name),
      phone: phoneLabel(host.phone, host.phone_country_code, null),
      country: host.address_country,
      verified: Boolean(host.identity_verified),
      properties: host.listings.length,
      totalBookings,
      totalEarnings: formatCurrency(totalEarnings),
      totalEarningsValue: totalEarnings,
      avgRating,
      joinDate: frDate(host.created_at),
      joinDateValue: ymdInt(host.created_at),
      status: host.host_status ?? 'ACTIF',
      profile_photo_url: host.profile_photo_url,
    };
  });

  const stats = {
    totalHosts: hostsData.length,
    totalActive: hostsData.filter((h) => h.status === 'ACTIF').length,
    totalVerified: hostsData.filter((h) => h.verified === true).length,
    totalProperties: hostsData.reduce((sum, h) => sum + h.properties, 0),
    totalSuspended: hostsData.filter((h) => h.status === 'SUSPENDU' || h.status === 'BANNI').length,
    countries: uniqueTruthy(hostsData.map((h) => h.country)),
  };

  return { hosts: hostsData, stats };
}

export async function index(req: NextRequest): Promise<Response> {
  await authenticateAdmin(req);
  return json(await hostsIndexData(await input(req)));
}

// ─── GET /api/admin/hosts/{id} ────────────────────────────────────────────────

type ListingRow = {
  id: number;
  title: string | null;
  city: string | null;
  base_price: number | null;
  status: string;
  space_type: string | null;
};

type BookingRow = {
  id: number;
  listing_id: number;
  check_in: string;
  check_out: string;
  total_price: number | null;
  status: string;
  listing: { title: string | null } | null;
  guest: Name;
};

type PayoutRow = {
  id: number;
  listing_id: number;
  gross_amount: number;
  commission_amount: number;
  net_amount: number;
  paid_date: string | null;
  scheduled_date: string | null;
  status: string;
  listing: { title: string | null } | null;
};

type RefundRow = {
  id: number;
  total_price: number | null;
  cancellation_reason: string | null;
  updated_at: string | null;
  guest: Name;
};

type ReviewRow = {
  listing_id: number;
  rating: number;
  text: string | null;
  created_at: string | null;
  user: Name;
  listing: { title: string | null } | null;
};

export async function hostShowData(id: number) {
  const host = must(await db().from('users').select('*').eq('id', id).maybeSingle());
  if (!host) {
    notFound('User', id);
  }

  // Réservations et avis des logements de l'hôte : jointure !inner sur listings.user_id (= whereIn listing_id)
  const [listingsResult, [notes, documents], reservations, reviews, paidPayouts, bookings, payouts, refunds, recentReviews] =
    await Promise.all([
      db().from('listings').select('id,title,city,base_price,status,space_type').eq('user_id', id).order('id'),
      notesAndDocuments(id),
      fetchAll<{ id: number; listing_id: number; status: string }>(() =>
        db()
          .from('reservations')
          .select('id,listing_id,status,listing:listings!reservations_listing_id_fkey!inner(user_id)')
          .eq('listing.user_id', id)
          .order('id'),
      ),
      fetchAll<{ id: number; listing_id: number; rating: number }>(() =>
        db()
          .from('reviews')
          .select('id,listing_id,rating,listing:listings!reviews_listing_id_fkey!inner(user_id)')
          .eq('listing.user_id', id)
          .order('id'),
      ),
      fetchAll<{ net_amount: number }>(() =>
        db().from('host_payouts').select('id,net_amount').eq('host_id', id).eq('status', 'paid').order('id'),
      ),
      db()
        .from('reservations')
        .select(
          'id,listing_id,check_in,check_out,total_price,status,listing:listings!reservations_listing_id_fkey!inner(title,user_id),guest:users!reservations_guest_id_fkey(first_name,last_name)',
        )
        .eq('listing.user_id', id)
        .order('created_at', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false })
        .limit(10),
      db()
        .from('host_payouts')
        .select(
          'id,listing_id,gross_amount,commission_amount,net_amount,paid_date,scheduled_date,status,listing:listings!host_payouts_listing_id_fkey(title)',
        )
        .eq('host_id', id)
        .order('created_at', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false })
        .limit(10),
      db()
        .from('reservations')
        .select(
          'id,total_price,cancellation_reason,updated_at,guest:users!reservations_guest_id_fkey(first_name,last_name),listing:listings!reservations_listing_id_fkey!inner(user_id)',
        )
        .eq('listing.user_id', id)
        .eq('status', 'cancelled')
        .order('created_at', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false })
        .limit(10),
      db()
        .from('reviews')
        .select(
          'id,listing_id,rating,text,created_at,user:users!reviews_user_id_fkey(first_name,last_name),listing:listings!reviews_listing_id_fkey!inner(title,user_id)',
        )
        .eq('listing.user_id', id)
        .order('created_at', { ascending: false, nullsFirst: false })
        .order('id', { ascending: false })
        .limit(10),
    ]);

  const listings = must(listingsResult) as ListingRow[];

  // --- Stats ---
  const totalBookings = reservations.length;
  const completedBookings = reservations.filter((r) => r.status === 'completed').length;
  const cancelledBookings = reservations.filter((r) => r.status === 'cancelled').length;
  const totalEarnings = decimalSum(paidPayouts.map((p) => p.net_amount));
  const avgRating = mysqlAvgRating(reviews.map((r) => r.rating));
  const totalReviews = reviews.length;

  const cancellationRate = totalBookings > 0 ? `${round((cancelledBookings / totalBookings) * 100)}%` : '0%';
  const occupancyRate =
    totalBookings > 0 ? `${Math.min(99, round((completedBookings / Math.max(totalBookings, 1)) * 100))}%` : '0%';
  const responseRate = `${randInt(85, 99)}%`;

  // --- Properties ---
  const bookingsByListing = new Map<number, number>();
  reservations.forEach((r) => bookingsByListing.set(r.listing_id, (bookingsByListing.get(r.listing_id) ?? 0) + 1));
  const ratingsByListing = new Map<number, number[]>();
  reviews.forEach((r) => ratingsByListing.set(r.listing_id, [...(ratingsByListing.get(r.listing_id) ?? []), r.rating]));

  const propertiesData = listings.map((listing) => ({
    id: listing.id,
    name: listing.title ?? `Logement #${listing.id}`,
    city: listing.city ?? 'Non defini',
    pricePerNight: euroOrZero(listing.base_price),
    status: lookup(LISTING_STATUS, listing.status) ?? listing.status,
    rating: mysqlAvgRating(ratingsByListing.get(listing.id) ?? []),
    totalBookings: bookingsByListing.get(listing.id) ?? 0,
    type: lookup(SPACE_TYPE, listing.space_type) ?? listing.space_type ?? 'Logement',
  }));

  // --- Bookings (last 10) ---
  const bookingsData = (must(bookings) as unknown as BookingRow[]).map((res) => ({
    property: res.listing?.title ?? `Logement #${res.listing_id}`,
    guest: res.guest ? personName(res.guest.first_name, res.guest.last_name) : 'Inconnu',
    dates: `${frDate(res.check_in)} - ${frDate(res.check_out)}`,
    amount: euroOrZero(res.total_price),
    status: lookup(RESERVATION_STATUS, res.status) ?? res.status,
  }));

  // --- Payments (last 10) ---
  const paymentsData = (must(payouts) as unknown as PayoutRow[]).map((payout) => ({
    id: `PAY-${padId(payout.id, 4)}`,
    property: payout.listing?.title ?? `Logement #${payout.listing_id}`,
    amount: `${numberFormat0(payout.gross_amount)} €`,
    commission: `${numberFormat0(payout.commission_amount)} €`,
    net: `${numberFormat0(payout.net_amount)} €`,
    date: payout.paid_date
      ? frDate(payout.paid_date)
      : payout.scheduled_date
        ? frDate(payout.scheduled_date)
        : '-',
    status: lookup(PAYOUT_STATUS, payout.status) ?? payout.status,
  }));

  // --- Refunds (cancelled bookings) ---
  const refundsData = (must(refunds) as unknown as RefundRow[]).map((res) => ({
    id: `REF-${padId(res.id, 3)}`,
    guest: res.guest ? personName(res.guest.first_name, res.guest.last_name) : 'Inconnu',
    amount: euroOrZero(res.total_price),
    reason: res.cancellation_reason ?? 'Annulation voyageur',
    date: frDate(res.updated_at),
    status: 'EFFECTUE',
  }));

  // --- Reviews (last 10) ---
  const reviewsData = (must(recentReviews) as unknown as ReviewRow[]).map((review) => ({
    guest: review.user ? personName(review.user.first_name, review.user.last_name) : 'Inconnu',
    property: review.listing?.title ?? `Logement #${review.listing_id}`,
    rating: Number(review.rating),
    comment: review.text ?? '',
    date: frDate(review.created_at),
  }));

  const documentsData = documents.map(formatDocument);
  const notesData = notes.map(formatNote);

  const now = new Date();
  const subHours = (hours: number) => new Date(now.getTime() - hours * 3_600_000);
  const age = accountAge(host.created_at, now);

  return {
    host: {
      id: host.id,
      name: personName(host.first_name, host.last_name),
      email: host.email,
      avatar: initials(host.first_name, host.last_name),
      phone: phoneLabel(host.phone, host.phone_country_code, null),
      country: host.address_country,
      city: host.city ?? host.address_city,
      verified: Boolean(host.identity_verified),
      joinDate: frDate(host.created_at),
      language: languageLabel(host.preferred_language),
      status: host.host_status ?? 'ACTIF',
      verificationDate: host.verification_date ? frDate(host.verification_date) : null,
      documents: documentsData,
      addressVerified: Boolean(host.address_verified),
      bankVerified: Boolean(host.bank_verified),
      emailVerified: host.email_verified_at !== null,
      phoneVerified: Boolean(host.phone_verified),
      properties: propertiesData,
      stats: {
        totalBookings,
        totalEarnings: formatCurrency(totalEarnings),
        totalEarningsValue: totalEarnings,
        occupancyRate,
        avgRating,
        responseRate,
        cancellationRate,
        totalProperties: listings.length,
        totalReviews,
      },
      bookings: bookingsData,
      payments: paymentsData,
      refunds: refundsData,
      reviews: reviewsData,
      disputes: [],
      signals: [],
      notes: notesData,
      risk: {
        lastLogin: host.last_login_at
          ? `${frDate(host.last_login_at)} a ${hourMinute(host.last_login_at)}`
          : `${frDate(subHours(randInt(1, 48)))} a ${hourMinute(subHours(randInt(1, 48)))}`,
        ip: host.last_login_ip ?? `192.168.1.${randInt(1, 254)}`,
        device: host.last_login_device ?? 'Chrome / macOS',
        fraudScore: phpInt(host.fraud_score ?? 5),
        accountAge: age,
      },
    },
  };
}

export async function show(req: NextRequest, params: IdParams): Promise<Response> {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'User');
  return json(await hostShowData(id));
}
