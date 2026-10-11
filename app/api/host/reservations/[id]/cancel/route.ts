import { authenticate } from '@/server/auth';
import { input, intParam, json, route } from '@/server/http';
import { cancelReservation, conversationIds, formatReservation, previewCancellation } from '@/server/reservations';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** Aperçu pour l'hôte : annulation possible ou non (le voyageur serait remboursé intégralement). */
export const GET = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Reservation');
  return json(await previewCancellation(id, user, 'host'));
});

/** L'hôte annule une réservation confirmée avant l'arrivée : motif obligatoire, voyageur remboursé intégralement. */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Reservation');
  const validated = await validate(await input(req), {
    reason: 'required|string|max:255',
    message: 'nullable|string|max:2000',
  });

  const reservation = await cancelReservation(id, user, 'host', {
    reason: validated.reason,
    message: validated.message ?? null,
  });
  const conversations = await conversationIds([id]);

  return json({
    message: 'Réservation annulée.',
    reservation: formatReservation(reservation, user.id, conversations.get(id) ?? null),
  });
});
