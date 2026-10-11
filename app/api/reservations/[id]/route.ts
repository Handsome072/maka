import { authenticate } from '@/server/auth';
import { intParam, json, notFound, route } from '@/server/http';
import { type Row } from '@/server/listings';
import { conversationIds, expireStaleRequests, formatReservation, RESERVATION_SELECT } from '@/server/reservations';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** Réservation visible par le voyageur ou l'hôte du logement. */
export const GET = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Reservation');

  await expireStaleRequests({ id });

  const reservation = must(
    await db().from('reservations').select(RESERVATION_SELECT).eq('id', id).maybeSingle(),
  ) as Row | null;
  if (!reservation) {
    notFound('Reservation', id);
  }

  if (user.id !== reservation.guest_id && user.id !== reservation.listing?.user_id) {
    return json({ message: 'Unauthorized.' }, 403);
  }

  const conversations = await conversationIds([id]);
  return json({ reservation: formatReservation(reservation, user.id, conversations.get(id) ?? null) });
});
