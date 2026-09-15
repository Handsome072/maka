import { authenticate } from '@/server/auth';
import { float, round } from '@/server/format';
import { json, route } from '@/server/http';
import { REVENUE_STATUSES } from '@/server/revenues/payouts';
import { chunk, db, fetchAll, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** Carbon 3 : $checkIn->diffInDays($checkOut) est signé (négatif si check_out précède check_in). */
function signedDiffInDays(from: string, to: string): number {
  return (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000;
}

/** HostRevenueController::stats */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  const payouts = await fetchAll<{ id: number; reservation_id: number; net_amount: number }>(() =>
    db()
      .from('host_payouts')
      .select('id,reservation_id,net_amount')
      .eq('host_id', user.id)
      .in('status', REVENUE_STATUSES)
      .order('id'),
  );

  const reservationIds = [...new Set(payouts.map((p) => p.reservation_id))];
  const reservations: Array<{ id: number; check_in: string; check_out: string }> = [];
  for (const ids of chunk(reservationIds)) {
    reservations.push(...(must(await db().from('reservations').select('id,check_in,check_out').in('id', ids)) ?? []));
  }

  const totalNights = reservations.reduce((sum, r) => sum + signedDiffInDays(r.check_in, r.check_out), 0);

  // Collection::sum sur les chaînes decimal:2 : addition flottante PHP, dans l'ordre des lignes
  const totalNetRevenue = payouts.reduce((sum, p) => sum + float(p.net_amount), 0);
  const avgPerNight = totalNights > 0 ? round(totalNetRevenue / totalNights, 2) : 0;

  const totalReservations = reservations.length;
  const avgStayDuration = totalReservations > 0 ? round(totalNights / totalReservations, 1) : 0;

  return json({
    total_nights: totalNights,
    avg_revenue_per_night: avgPerNight,
    avg_stay_duration: avgStayDuration,
    total_reservations: totalReservations,
  });
});
