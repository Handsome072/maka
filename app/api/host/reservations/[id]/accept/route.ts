import { authenticate } from '@/server/auth';
import { input, intParam, json, route } from '@/server/http';
import { conversationIds, formatReservation, respondToRequest } from '@/server/reservations';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** L'hôte accepte une demande en attente : la réservation est confirmée et les dates restent bloquées. */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Reservation');
  const validated = await validate(await input(req), { message: 'nullable|string|max:2000' });

  const reservation = await respondToRequest(id, user, 'accept', { message: validated.message ?? null });
  const conversations = await conversationIds([id]);

  return json({
    message: 'Réservation confirmée.',
    reservation: formatReservation(reservation, user.id, conversations.get(id) ?? null),
  });
});
