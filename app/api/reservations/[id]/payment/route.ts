import { authenticate } from '@/server/auth';
import { HttpError, intParam, json, notFound, route } from '@/server/http';
import { type Row } from '@/server/listings';
import { finalizeCheckout, paymentsEnabled } from '@/server/payments';
import { conversationIds, formatReservation, RESERVATION_SELECT } from '@/server/reservations';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/**
 * Retour du voyageur après le paiement : vérifie la session auprès de Stripe et termine la réservation,
 * une seule fois même si la page est rechargée.
 */
export const POST = route<{ id: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Reservation');

  const current = must(
    await db().from('reservations').select('id, guest_id, status, stripe_checkout_session_id').eq('id', id).maybeSingle(),
  ) as Row | null;
  if (!current) {
    notFound('Reservation', id);
  }
  if (current.guest_id !== user.id) {
    throw new HttpError(403, { message: 'Unauthorized.' });
  }

  let state: string = 'already';
  if (current.status === 'awaiting_payment' && current.stripe_checkout_session_id && paymentsEnabled()) {
    state = await finalizeCheckout(current.stripe_checkout_session_id);
  }

  const reservation = must(await db().from('reservations').select(RESERVATION_SELECT).eq('id', id).maybeSingle()) as Row | null;
  if (!reservation) {
    // Session expirée : la réservation a été abandonnée et ses dates libérées
    return json({ state: 'expired', reservation: null });
  }
  const conversations = await conversationIds([id]);
  return json({ state, reservation: formatReservation(reservation, user.id, conversations.get(id) ?? null) });
});
