import { authenticateAdmin } from '@/server/auth';
import { input, intParam, json, route } from '@/server/http';
import { type Row } from '@/server/listings';
import {
  ADMIN_RESERVATION_SELECT,
  cancelReservation,
  conversationIds,
  formatAdminReservation,
  previewCancellation,
} from '@/server/reservations';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** Aperçu : annulation possible ou non par l'administration (voyageur remboursé intégralement). */
export const GET = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticateAdmin(req);
  const id = intParam(params.id, 'Reservation');
  return json(await previewCancellation(id, user, 'admin'));
});

/**
 * L'administration annule une demande ou une réservation non terminée : motif obligatoire,
 * transmis au voyageur et à l'hôte ; une réservation confirmée est remboursée intégralement.
 */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticateAdmin(req);
  const id = intParam(params.id, 'Reservation');
  const validated = await validate(await input(req), { reason: 'required|string|max:255' });

  await cancelReservation(id, user, 'admin', { reason: validated.reason });

  const reservation = must(await db().from('reservations').select(ADMIN_RESERVATION_SELECT).eq('id', id).single()) as Row;
  const conversations = await conversationIds([id]);
  return json({
    message: 'Réservation annulée.',
    reservation: formatAdminReservation(reservation, conversations.get(id) ?? null),
  });
});
