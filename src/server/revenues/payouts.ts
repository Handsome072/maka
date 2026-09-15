import { float, round, ymd } from '@/server/format';

/** Statuts comptés comme revenus (HostRevenueController). */
export const REVENUE_STATUSES = ['paid', 'scheduled', 'pending'];

export type PayoutListRow = {
  id: number;
  reservation_id: number;
  gross_amount: number;
  commission_amount: number;
  net_amount: number;
  currency: string;
  status: string;
  scheduled_date: string | null;
  paid_date: string | null;
  listing: { id: number; title: string | null; city: string | null } | null;
  reservation: { id: number; check_in: string | null; check_out: string | null } | null;
};

/** ->with(['reservation:id,check_in,check_out', 'listing:id,title,city']) */
export const PAYOUT_LIST_SELECT = [
  'id',
  'reservation_id',
  'gross_amount',
  'commission_amount',
  'net_amount',
  'currency',
  'status',
  'scheduled_date',
  'paid_date',
  'listing:listings!host_payouts_listing_id_fkey(id,title,city)',
  'reservation:reservations!host_payouts_reservation_id_fkey(id,check_in,check_out)',
].join(',');

/** HostRevenueController::formatPayout */
export function formatPayout(p: PayoutListRow) {
  return {
    id: p.id,
    reservation_id: p.reservation_id,
    listing: p.listing
      ? { id: p.listing.id, title: p.listing.title, city: p.listing.city }
      : null,
    reservation_dates: p.reservation
      ? { check_in: ymd(p.reservation.check_in), check_out: ymd(p.reservation.check_out) }
      : null,
    gross_amount: round(float(p.gross_amount), 2),
    commission_amount: round(float(p.commission_amount), 2),
    net_amount: round(float(p.net_amount), 2),
    currency: p.currency,
    status: p.status,
    scheduled_date: ymd(p.scheduled_date),
    paid_date: ymd(p.paid_date),
  };
}

/** Montant DECIMAL(10,2) en centimes entiers : les sommes restent exactes comme SUM() de MySQL. */
export function toCents(value: unknown): number {
  return Math.round(float(value) * 100);
}

/** round((float) SUM(col), 2) */
export function centsToRoundedFloat(cents: number): number {
  return round(cents / 100, 2);
}

/** SUM(decimal_col) lu par PDO sans cast : chaîne à deux décimales ("1234.50"). */
export function centsToDecimalString(cents: number): string {
  const abs = Math.abs(cents);
  return `${cents < 0 ? '-' : ''}${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, '0')}`;
}

/** Année et mois UTC d'un horodatage (YEAR()/MONTH() en UTC). */
export function utcYearMonth(value: string | null): { year: number; month: number } | null {
  if (!value) {
    return null;
  }
  const d = new Date(value);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
}
