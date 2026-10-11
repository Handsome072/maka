import { authenticate } from '@/server/auth';
import { input, intParam, json, route } from '@/server/http';
import { cancelReservation, conversationIds, formatReservation, previewCancellation } from '@/server/reservations';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** Aperçu pour le voyageur : annulation possible ou non, et remboursement selon la politique. */
export const GET = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Reservation');
  return json(await previewCancellation(id, user, 'guest'));
});

/**
 * Le voyageur retire sa demande en attente (rien n'a été payé), ou annule une réservation confirmée
 * avant son arrivée : le montant remboursable est calculé selon la politique et enregistré.
 */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Reservation');
  const validated = await validate(await input(req), { reason: 'nullable|string|max:1000' });

  const reservation = await cancelReservation(id, user, 'guest', { reason: validated.reason ?? null });
  const conversations = await conversationIds([id]);

  return json({
    message: reservation.refund_amount === null ? 'Votre demande a été retirée.' : 'Votre réservation a été annulée.',
    reservation: formatReservation(reservation, user.id, conversations.get(id) ?? null),
  });
});
