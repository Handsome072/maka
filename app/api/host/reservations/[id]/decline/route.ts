import { authenticate } from '@/server/auth';
import { input, intParam, json, route } from '@/server/http';
import { conversationIds, formatReservation, respondToRequest } from '@/server/reservations';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** L'hôte refuse une demande en attente : les dates sont libérées, le voyageur voit le motif. */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Reservation');
  const validated = await validate(await input(req), {
    reason: 'nullable|string|max:255',
    message: 'nullable|string|max:2000',
  });

  const reservation = await respondToRequest(id, user, 'decline', {
    reason: validated.reason ?? null,
    message: validated.message ?? null,
  });
  const conversations = await conversationIds([id]);

  return json({
    message: 'Demande refusée.',
    reservation: formatReservation(reservation, user.id, conversations.get(id) ?? null),
  });
});
