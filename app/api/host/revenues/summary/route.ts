import { authenticate } from '@/server/auth';
import { json, route } from '@/server/http';
import { centsToRoundedFloat, REVENUE_STATUSES, toCents, utcYearMonth } from '@/server/revenues/payouts';
import { db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** HostRevenueController::summary */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;

  const payouts = await fetchAll<{ id: number; net_amount: number; status: string; created_at: string | null }>(() =>
    db()
      .from('host_payouts')
      .select('id,net_amount,status,created_at')
      .eq('host_id', user.id)
      .in('status', REVENUE_STATUSES)
      .order('id'),
  );

  let thisMonth = 0;
  let thisYear = 0;
  let total = 0;
  let estimated = 0;

  for (const p of payouts) {
    const cents = toCents(p.net_amount);
    const created = utcYearMonth(p.created_at);
    if (created?.year === year) {
      thisYear += cents;
      if (created.month === month) {
        thisMonth += cents;
      }
    }
    if (p.status === 'paid') {
      total += cents;
    } else {
      estimated += cents; // pending, scheduled
    }
  }

  return json({
    revenue_this_month: centsToRoundedFloat(thisMonth),
    revenue_this_year: centsToRoundedFloat(thisYear),
    revenue_total: centsToRoundedFloat(total),
    revenue_estimated: centsToRoundedFloat(estimated),
    currency: 'EUR',
  });
});
