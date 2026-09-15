import { authenticate } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { inputValue, mysqlNumber, mysqlYear, phpInt, phpTruthy } from '@/server/revenues/mysql';
import {
  centsToDecimalString,
  centsToRoundedFloat,
  REVENUE_STATUSES,
  toCents,
  utcYearMonth,
} from '@/server/revenues/payouts';
import { db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

type Row = {
  id: number;
  listing_id: number;
  net_amount: number;
  gross_amount: number;
  commission_amount: number;
  created_at: string | null;
};

/** HostRevenueController::chart */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);
  const data = await input(req);
  const year = inputValue(data, 'year', new Date().getUTCFullYear());
  const listingId = inputValue(data, 'listing_id');

  const payouts = await fetchAll<Row>(() =>
    db()
      .from('host_payouts')
      .select('id,listing_id,net_amount,gross_amount,commission_amount,created_at')
      .eq('host_id', user.id)
      .in('status', REVENUE_STATUSES)
      .order('id'),
  );

  // whereYear('created_at', $year) [+ where('listing_id', $listingId)], groupé par MONTH(created_at)
  const selectedYear = mysqlYear(year);
  const listingFilter = phpTruthy(listingId) ? mysqlNumber(listingId) : undefined;
  const byMonth = new Map<number, { revenue: number; gross: number; commission: number }>();

  for (const p of payouts) {
    const created = utcYearMonth(p.created_at);
    if (selectedYear === null || created?.year !== selectedYear) {
      continue;
    }
    if (listingFilter !== undefined && p.listing_id !== listingFilter) {
      continue;
    }
    const sums = byMonth.get(created.month) ?? { revenue: 0, gross: 0, commission: 0 };
    sums.revenue += toCents(p.net_amount);
    sums.gross += toCents(p.gross_amount);
    sums.commission += toCents(p.commission_amount);
    byMonth.set(created.month, sums);
  }

  const monthly = Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const sums = byMonth.get(m);
    return {
      month: m,
      revenue: sums ? centsToRoundedFloat(sums.revenue) : 0,
      gross: sums ? centsToRoundedFloat(sums.gross) : 0,
      commission: sums ? centsToRoundedFloat(sums.commission) : 0,
    };
  });

  // Totaux par YEAR(created_at), ORDER BY year ASC (NULL en premier), LIMIT 5
  const byYear = new Map<number | null, number>();
  for (const p of payouts) {
    const key = utcYearMonth(p.created_at)?.year ?? null;
    byYear.set(key, (byYear.get(key) ?? 0) + toCents(p.net_amount));
  }
  const yearly = [...byYear.entries()]
    .sort(([a], [b]) => (a === null ? -1 : b === null ? 1 : a - b))
    .slice(0, 5)
    .map(([y, cents]) => ({ year: y, revenue: centsToDecimalString(cents) }));

  return json({
    monthly,
    yearly,
    selected_year: phpInt(year),
  });
});
