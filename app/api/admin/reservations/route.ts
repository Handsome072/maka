import { authenticateAdmin } from '@/server/auth';
import { json, route } from '@/server/http';
import { type Row } from '@/server/listings';
import {
  ADMIN_RESERVATION_SELECT,
  conversationIds,
  expireStaleRequests,
  formatAdminReservation,
} from '@/server/reservations';
import { chunk, db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** Toutes les réservations, les plus récentes d'abord, avec voyageur, hôte et logement. */
export const GET = route(async (req) => {
  await authenticateAdmin(req);

  await expireStaleRequests({});

  const reservations = await fetchAll<Row>(() =>
    db()
      .from('reservations')
      .select(ADMIN_RESERVATION_SELECT)
      .neq('status', 'awaiting_payment')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false }),
  );

  const conversations = new Map<number, number>();
  for (const ids of chunk(reservations.map((reservation) => reservation.id as number))) {
    for (const [reservationId, conversationId] of await conversationIds(ids)) {
      conversations.set(reservationId, conversationId);
    }
  }

  return json({
    reservations: reservations.map((reservation) =>
      formatAdminReservation(reservation, conversations.get(reservation.id) ?? null),
    ),
  });
});
