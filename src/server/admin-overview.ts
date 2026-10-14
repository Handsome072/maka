import { tripPhase, type TripPhase } from '@/shared/booking';
import { todayUtc, ymd } from './format';
import { type Row } from './listings';
import { expireStaleRequests } from './reservations';
import { db, fetchAll, must } from './supabase';

/**
 * Synthèse du dashboard admin : indicateurs de la période choisie comparés à la période précédente
 * de même durée, état de la plateforme et tâches en attente.
 */

export type OverviewPeriod = '7d' | '30d' | '3m' | '12m';
export type Granularity = 'day' | 'week' | 'month';

const PERIODS: Record<OverviewPeriod, { granularity: Granularity; count: number }> = {
  '7d': { granularity: 'day', count: 7 },
  '30d': { granularity: 'day', count: 30 },
  '3m': { granularity: 'week', count: 13 },
  '12m': { granularity: 'month', count: 12 },
};

export function overviewPeriod(value: string | null): OverviewPeriod {
  return value && value in PERIODS ? (value as OverviewPeriod) : '30d';
}

/** Statuts qui comptent comme réservation acquise (payée ou acceptée) */
const BOOKED_STATUSES = new Set(['confirmed', 'active', 'completed']);

const PHASE_ORDER: TripPhase[] = ['pending', 'upcoming', 'ongoing', 'past', 'cancelled', 'declined', 'expired'];

function shift(date: Date, granularity: Granularity, n: number): Date {
  const next = new Date(date);
  if (granularity === 'month') next.setUTCMonth(next.getUTCMonth() + n);
  else next.setUTCDate(next.getUTCDate() + (granularity === 'week' ? 7 * n : n));
  return next;
}

/**
 * Débuts des tranches : `count` tranches de la période précédente, `count` de la période actuelle,
 * puis la fin (exclue). Jours et semaines glissants jusqu'à aujourd'hui inclus, mois calendaires.
 */
export function bucketStarts(period: OverviewPeriod, today: Date = todayUtc()): { granularity: Granularity; count: number; starts: Date[] } {
  const { granularity, count } = PERIODS[period];
  const last =
    granularity === 'month'
      ? new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
      : granularity === 'week'
        ? shift(today, 'day', -6)
        : today;
  const starts = Array.from({ length: 2 * count + 1 }, (_, i) => shift(last, granularity, i - (2 * count - 1)));
  return { granularity, count, starts };
}

/** Indice de la tranche contenant `at`, -1 en dehors des deux périodes */
function bucketIndex(starts: number[], at: number): number {
  if (at < starts[0] || at >= starts[starts.length - 1]) return -1;
  let i = 0;
  while (at >= starts[i + 1]) i++;
  return i;
}

const money = (value: unknown) => {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};
const cents = (value: number) => Math.round(value * 100) / 100;

async function countOf(query: PromiseLike<{ count: number | null; error: unknown }>): Promise<number> {
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

type Metric = { current: number[]; previous: number[]; total: number; previous_total: number };

function metric(values: number[], count: number): Metric {
  const previous = values.slice(0, count).map(cents);
  const current = values.slice(count).map(cents);
  const sum = (list: number[]) => cents(list.reduce((a, b) => a + b, 0));
  return { current, previous, total: sum(current), previous_total: sum(previous) };
}

export async function adminOverview(period: OverviewPeriod) {
  await expireStaleRequests({});

  const today = todayUtc();
  const { granularity, count, starts } = bucketStarts(period, today);
  const startTimes = starts.map((d) => d.getTime());
  const from = starts[0].toISOString();
  const currentFrom = starts[count].toISOString();
  const to = starts[2 * count].toISOString();
  const todayYmd = ymd(today) as string;
  const inSevenDays = ymd(shift(today, 'day', 7)) as string;

  const [
    reservations,
    signups,
    listings,
    usersTotal,
    verifiedUsers,
    suspectUsers,
    pendingRequests,
    arrivals,
    payoutsDue,
    documentsPending,
    reportsOpen,
    recent,
  ] = await Promise.all([
    fetchAll<Row>(() =>
      db()
        .from('reservations')
        .select('id, listing_id, status, created_at, check_in, check_out, total_price, service_fee')
        .neq('status', 'awaiting_payment')
        .gte('created_at', from)
        .lt('created_at', to)
        .order('id'),
    ),
    fetchAll<Row>(() =>
      db().from('users').select('id, created_at').neq('role', 'admin').gte('created_at', from).lt('created_at', to).order('id'),
    ),
    fetchAll<Row>(() => db().from('listings').select('id, user_id, title, city, status, created_at').order('id')),
    countOf(db().from('users').select('id', { count: 'exact', head: true }).neq('role', 'admin')),
    countOf(db().from('users').select('id', { count: 'exact', head: true }).neq('role', 'admin').eq('identity_verified', true)),
    countOf(db().from('users').select('id', { count: 'exact', head: true }).eq('is_suspect', true)),
    countOf(db().from('reservations').select('id', { count: 'exact', head: true }).eq('status', 'pending')),
    countOf(
      db()
        .from('reservations')
        .select('id', { count: 'exact', head: true })
        .in('status', ['confirmed', 'active'])
        .gte('check_in', todayYmd)
        .lte('check_in', inSevenDays),
    ),
    fetchAll<Row>(() =>
      db().from('host_payouts').select('id, net_amount, scheduled_date').in('status', ['pending', 'scheduled']).order('id'),
    ),
    countOf(db().from('host_documents').select('id', { count: 'exact', head: true }).eq('status', 'EN ATTENTE')),
    countOf(db().from('client_reports').select('id', { count: 'exact', head: true }).eq('status', 'OUVERT')),
    db()
      .from('reservations')
      .select(
        'id, confirmation_code, status, created_at, check_in, check_out, total_price, currency, listing:listings!reservations_listing_id_fkey(title), guest:users!reservations_guest_id_fkey(first_name, last_name)',
      )
      .neq('status', 'awaiting_payment')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(5)
      .then((result) => must(result) as Row[]),
  ]);

  // ─── Séries ────────────────────────────────────────────────────────────────
  const size = 2 * count;
  const volume = new Array<number>(size).fill(0);
  const revenue = new Array<number>(size).fill(0);
  const bookings = new Array<number>(size).fill(0);
  const signupCounts = new Array<number>(size).fill(0);
  const phases = new Map<TripPhase, number>();
  const byListing = new Map<number, { volume: number; bookings: number }>();
  const currentStart = startTimes[count];

  for (const row of reservations) {
    const at = Date.parse(row.created_at);
    const i = bucketIndex(startTimes, at);
    if (i < 0) continue;
    if (at >= currentStart) {
      const phase = tripPhase(row.status, ymd(row.check_in) as string, ymd(row.check_out) as string, todayYmd);
      phases.set(phase, (phases.get(phase) ?? 0) + 1);
    }
    if (!BOOKED_STATUSES.has(row.status)) continue;
    volume[i] += money(row.total_price);
    revenue[i] += money(row.service_fee);
    bookings[i] += 1;
    if (at >= currentStart) {
      const entry = byListing.get(row.listing_id) ?? { volume: 0, bookings: 0 };
      entry.volume += money(row.total_price);
      entry.bookings += 1;
      byListing.set(row.listing_id, entry);
    }
  }
  for (const row of signups) {
    const i = bucketIndex(startTimes, Date.parse(row.created_at));
    if (i >= 0) signupCounts[i] += 1;
  }

  // ─── Logements ─────────────────────────────────────────────────────────────
  const listingStatus: Record<string, number> = { active: 0, pending: 0, draft: 0, rejected: 0, archived: 0 };
  const cities = new Map<string, number>();
  const hosts = new Set<number>();
  let newListings = 0;
  for (const listing of listings) {
    listingStatus[listing.status] = (listingStatus[listing.status] ?? 0) + 1;
    hosts.add(listing.user_id);
    if (listing.created_at && Date.parse(listing.created_at) >= currentStart) newListings++;
    if (listing.status === 'active' && listing.city) {
      const city = String(listing.city).trim();
      cities.set(city, (cities.get(city) ?? 0) + 1);
    }
  }
  const titles = new Map(listings.map((l) => [l.id as number, l]));

  const nextPayout = payoutsDue
    .map((p) => ymd(p.scheduled_date))
    .filter((d): d is string => !!d)
    .sort()[0] ?? null;

  return {
    period,
    granularity,
    generated_at: new Date().toISOString(),
    current_from: currentFrom,
    to,
    buckets: starts.slice(0, size).map((d) => ymd(d) as string),
    currency: 'EUR',
    metrics: {
      volume: metric(volume, count),
      revenue: metric(revenue, count),
      bookings: metric(bookings, count),
      signups: metric(signupCounts, count),
    },
    statuses: PHASE_ORDER.map((phase) => ({ phase, count: phases.get(phase) ?? 0 })),
    top_listings: [...byListing.entries()]
      .sort((a, b) => b[1].volume - a[1].volume || b[1].bookings - a[1].bookings)
      .slice(0, 5)
      .map(([id, stats]) => ({
        id,
        title: titles.get(id)?.title ?? null,
        city: titles.get(id)?.city ?? null,
        volume: cents(stats.volume),
        bookings: stats.bookings,
      })),
    community: {
      users: usersTotal,
      hosts: hosts.size,
      verified: verifiedUsers,
      new_in_period: signupCounts.slice(count).reduce((a, b) => a + b, 0),
    },
    listings: {
      total: listings.length,
      by_status: listingStatus,
      new_in_period: newListings,
      top_cities: [...cities.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'fr'))
        .slice(0, 5)
        .map(([city, n]) => ({ city, count: n })),
    },
    todo: {
      pending_requests: pendingRequests,
      arrivals_7d: arrivals,
      payouts_due: {
        count: payoutsDue.length,
        amount: cents(payoutsDue.reduce((sum, p) => sum + money(p.net_amount), 0)),
        next_date: nextPayout,
      },
      listings_pending: listingStatus.pending,
      host_documents_pending: documentsPending,
      client_reports_open: reportsOpen,
      suspect_users: suspectUsers,
    },
    recent: recent.map((row) => ({
      id: row.id,
      confirmation_code: row.confirmation_code,
      guest: row.guest ? `${row.guest.first_name ?? ''} ${row.guest.last_name ?? ''}`.trim() : null,
      listing: row.listing?.title ?? null,
      created_at: row.created_at,
      total_price: money(row.total_price),
      currency: row.currency ?? 'EUR',
      phase: tripPhase(row.status, ymd(row.check_in) as string, ymd(row.check_out) as string, todayYmd),
    })),
  };
}
