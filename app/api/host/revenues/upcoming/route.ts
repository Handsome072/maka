import { authenticate } from '@/server/auth';
import { json, route } from '@/server/http';
import { formatPayout, PAYOUT_LIST_SELECT, type PayoutListRow } from '@/server/revenues/payouts';
import { db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** HostRevenueController::upcoming */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  const payouts = await fetchAll<PayoutListRow>(() =>
    db()
      .from('host_payouts')
      .select(PAYOUT_LIST_SELECT)
      .eq('host_id', user.id)
      .in('status', ['pending', 'scheduled'])
      // MySQL place les NULL en premier en ordre croissant
      .order('scheduled_date', { ascending: true, nullsFirst: true })
      .order('id', { ascending: true }),
  );

  return json({ payouts: payouts.map(formatPayout) });
});
