import { authenticate } from '@/server/auth';
import { intParam, json, notFound, route } from '@/server/http';
import { reservationToArray, type Row } from '@/server/listings';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** ReservationController::show — réservation visible par le voyageur ou l'hôte de l'annonce. */
export const GET = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Reservation');

  const reservation = must(
    await db()
      .from('reservations')
      .select('*, listing:listings!reservations_listing_id_fkey(*)')
      .eq('id', id)
      .maybeSingle(),
  ) as Row | null;
  if (!reservation) {
    notFound('Reservation', id);
  }

  if (user.id !== reservation.guest_id && user.id !== reservation.listing?.user_id) {
    return json({ message: 'Unauthorized.' }, 403);
  }

  return json({ reservation: reservationToArray(reservation, reservation.listing ?? null) });
});
