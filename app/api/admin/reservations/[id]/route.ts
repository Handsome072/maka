import { authenticateAdmin } from '@/server/auth';
import { intParam, json, notFound, route } from '@/server/http';
import { type Row } from '@/server/listings';
import {
  ADMIN_RESERVATION_SELECT,
  conversationIds,
  expireStaleRequests,
  formatAdminReservation,
} from '@/server/reservations';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** Détail d'une réservation pour l'administration. */
export const GET = route<{ id: string }>(async (req, params) => {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'Reservation');

  await expireStaleRequests({ id });

  const reservation = must(
    await db().from('reservations').select(ADMIN_RESERVATION_SELECT).eq('id', id).maybeSingle(),
  ) as Row | null;
  if (!reservation) {
    notFound('Reservation', id);
  }

  const conversations = await conversationIds([id]);
  return json({ reservation: formatAdminReservation(reservation, conversations.get(id) ?? null) });
});
