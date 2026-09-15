import { authenticate } from '@/server/auth';
import { input, json, route } from '@/server/http';
import { applyPeriod, periodBounds, phpTruthy } from '@/server/revenues/mysql';
import { formatPayout, PAYOUT_LIST_SELECT, type PayoutListRow } from '@/server/revenues/payouts';
import { db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** HostRevenueController::history */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);
  const data = await input(req);
  const year = data.year ?? null;
  const month = data.month ?? null;

  // if ($year) whereYear('paid_date', $year) ; if ($month && $year) whereMonth('paid_date', $month)
  const period = phpTruthy(year) ? periodBounds(year, month, 'date', phpTruthy(month)) : null;
  if (period === false) {
    return json({ payouts: [] });
  }

  const payouts = await fetchAll<PayoutListRow>(() => {
    let query = db()
      .from('host_payouts')
      .select(PAYOUT_LIST_SELECT)
      .eq('host_id', user.id)
      .in('status', ['paid', 'failed']);
    if (period) {
      query = applyPeriod(query, 'paid_date', period);
    }
    // MySQL place les NULL en dernier en ordre décroissant
    return query.order('paid_date', { ascending: false, nullsFirst: false }).order('id', { ascending: false });
  });

  return json({ payouts: payouts.map(formatPayout) });
});
