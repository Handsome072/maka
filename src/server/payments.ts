import Stripe from 'stripe';
import { addDaysYmd, requestDeadline, type RefundBreakdown } from '@/shared/booking';
import { float, ymd } from './format';
import type { Row } from './listings';
import { freshTimestamp } from './profile/update';
import { postReservationMessage, recordReservationEvent } from './reservation-events';
import { db, must } from './supabase';

/**
 * Paiement en ligne avec Stripe (Embedded Checkout).
 * - Demande de réservation : la carte est autorisée (empreinte), débitée quand l'hôte accepte, libérée sinon.
 * - Réservation instantanée : débit immédiat.
 * - Annulation : remboursement Stripe du montant calculé selon la politique.
 * - Versements aux hôtes : manuels, suivis dans host_payouts (0 % de commission hôte).
 * Sans clés Stripe, le site fonctionne sans paiement en ligne (comportement des lots précédents).
 */

/** Minutes pendant lesquelles les dates restent retenues pendant le paiement (Stripe impose 30 au minimum). */
export const CHECKOUT_MINUTES = 31;

let client: Stripe | undefined;

export function paymentsEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Variable d’environnement manquante : STRIPE_SECRET_KEY');
  }
  client ??= new Stripe(key);
  return client;
}

function cents(value: unknown): number {
  return Math.round(float(value) * 100);
}

function euros(amountInCents: number): number {
  return Math.round(amountInCents) / 100;
}

function plural(count: number, word: string): string {
  return `${count} ${word}${count > 1 ? 's' : ''}`;
}

// ─── Session de paiement ──────────────────────────────────────────────────────

/** Lignes du paiement, identiques au détail du prix affiché au voyageur. */
function lineItems(reservation: Row, title: string): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const currency = String(reservation.currency || 'EUR').toLowerCase();
  const nights = Number(reservation.nights_count);
  const parts: [string, number][] = [
    [`${plural(nights, 'nuit')} · ${title}`, cents(float(reservation.price_per_night) * nights)],
    ['Frais de ménage', cents(reservation.cleaning_fee)],
    ['Voyageurs supplémentaires', cents(reservation.extra_guest_fee)],
    ['Animaux', cents(reservation.pet_fee)],
    ['Frais de service Séjoura', cents(reservation.service_fee)],
  ];
  const items = parts.filter(([, amount]) => amount > 0);
  const total = cents(reservation.total_price);
  // Le détail doit tomber juste au centime ; sinon une seule ligne au montant total
  const usable = items.reduce((sum, [, amount]) => sum + amount, 0) === total ? items : [[`Séjour · ${title}`, total] as [string, number]];
  return usable.map(([name, amount]) => ({
    quantity: 1,
    price_data: { currency, unit_amount: amount, product_data: { name } },
  }));
}

/**
 * Ouvre la session de paiement intégrée d'une réservation « awaiting_payment ».
 * Renvoie le secret client que la page de réservation passe au formulaire Stripe.
 */
export async function createCheckoutSession(
  reservation: Row,
  listing: Row,
  guest: { email: string },
  site: string,
): Promise<{ sessionId: string; clientSecret: string }> {
  const instant = reservation.reservation_mode === 'instant';
  const title = String(listing.title ?? 'Logement');
  const stay = `${ymd(reservation.check_in)} → ${ymd(reservation.check_out)}`;
  const session = await stripe().checkout.sessions.create(
    {
      ui_mode: 'embedded_page',
      mode: 'payment',
      locale: 'fr',
      customer_email: guest.email,
      client_reference_id: String(reservation.id),
      line_items: lineItems(reservation, title),
      payment_intent_data: {
        // Demande : simple autorisation, encaissée quand l'hôte accepte
        capture_method: instant ? 'automatic' : 'manual',
        description: `Séjoura ${reservation.confirmation_code} · ${title} · ${stay}`,
        metadata: { reservation_id: String(reservation.id), confirmation_code: reservation.confirmation_code },
      },
      metadata: { reservation_id: String(reservation.id) },
      return_url: `${site}/booking/confirmation/${reservation.id}/?session_id={CHECKOUT_SESSION_ID}`,
      expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_MINUTES * 60,
    },
    { idempotencyKey: `checkout-${reservation.id}-${reservation.confirmation_code}` },
  );
  if (!session.client_secret) {
    throw new Error('Session Stripe sans client_secret');
  }
  return { sessionId: session.id, clientSecret: session.client_secret };
}

const FINALIZE_SELECT =
  'id, status, guest_id, listing_id, check_in, reservation_mode, guest_message, total_price, payment_status, stripe_checkout_session_id, listing:listings!reservations_listing_id_fkey(user_id)';

/**
 * Termine le paiement d'une session, sans risque de doublon : au retour du voyageur sur la confirmation,
 * ou au nettoyage des paiements en cours s'il a quitté le site avant d'y revenir.
 * Demande → « pending » avec carte autorisée ; instantanée → « confirmed » et payée, versement planifié.
 * Puis message automatique, message du voyageur et emails. Une session expirée libère les dates.
 */
export async function finalizeCheckout(sessionId: string): Promise<'finalized' | 'already' | 'open' | 'expired' | 'orphan'> {
  const session = await stripe().checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });
  const reservation = must(
    await db().from('reservations').select(FINALIZE_SELECT).eq('stripe_checkout_session_id', sessionId).maybeSingle(),
  ) as Row | null;

  if (session.status === 'expired') {
    if (reservation?.status === 'awaiting_payment') {
      must(await db().from('reservations').delete().eq('id', reservation.id).eq('status', 'awaiting_payment'));
    }
    return 'expired';
  }

  const intent = session.payment_intent as Stripe.PaymentIntent | null;
  const authorized = intent?.status === 'requires_capture';
  const paid = intent?.status === 'succeeded';
  if (session.status !== 'complete' || !intent || (!authorized && !paid)) {
    return 'open';
  }

  if (!reservation || reservation.status !== 'awaiting_payment') {
    if (reservation && reservation.payment_status !== 'awaiting') {
      return 'already';
    }
    // Paiement reçu pour une réservation qui n'existe plus (abandonnée entre-temps) : on rend l'argent
    if (authorized) {
      await stripe().paymentIntents.cancel(intent.id);
    } else {
      await stripe().refunds.create({ payment_intent: intent.id }, { idempotencyKey: `orphan-${intent.id}` });
    }
    return 'orphan';
  }

  const now = freshTimestamp();
  const instant = reservation.reservation_mode === 'instant';
  const changes: Row = {
    stripe_payment_intent_id: intent.id,
    payment_status: paid ? 'paid' : 'authorized',
    amount_paid: paid ? euros(intent.amount_received) : null,
    paid_at: paid ? now : null,
    updated_at: now,
    ...(instant
      ? { status: 'confirmed', confirmed_at: now, expires_at: null }
      : { status: 'pending', expires_at: requestDeadline(new Date(now), ymd(reservation.check_in) as string) }),
  };
  const updated = must(
    await db().from('reservations').update(changes).eq('id', reservation.id).eq('status', 'awaiting_payment').select('id'),
  ) as Row[];
  if (updated.length === 0) {
    return 'already';
  }

  if (paid && instant) {
    await scheduleHostPayout(reservation.id);
  }
  await recordReservationEvent(reservation.id, instant ? 'booked' : 'requested');
  if (reservation.guest_message) {
    try {
      await postReservationMessage(
        reservation as { id: number; listing_id: number; guest_id: number },
        reservation.listing?.user_id,
        { id: reservation.guest_id, role: 'user' },
        reservation.guest_message,
      );
    } catch (error) {
      console.error('[api] message du voyageur sur la réservation', reservation.id, error);
    }
  }
  return 'finalized';
}

/**
 * Abandonne les paiements non terminés à temps : la réservation est supprimée et ses dates libérées.
 * Une session payée dont le voyageur n'est pas revenu sur le site est finalisée au lieu d'être supprimée.
 */
export async function discardAbandonedCheckouts(): Promise<void> {
  if (!paymentsEnabled()) return;
  const cutoff = new Date(Date.now() - 2 * 60_000).toISOString();
  const stale = must(
    await db()
      .from('reservations')
      .select('id, stripe_checkout_session_id')
      .eq('status', 'awaiting_payment')
      .lt('expires_at', cutoff),
  ) as Row[];
  for (const row of stale) {
    try {
      if (row.stripe_checkout_session_id) {
        const result = await finalizeCheckout(row.stripe_checkout_session_id);
        if (result === 'open') {
          await stripe().checkout.sessions.expire(row.stripe_checkout_session_id);
          must(await db().from('reservations').delete().eq('id', row.id).eq('status', 'awaiting_payment'));
        }
      } else {
        must(await db().from('reservations').delete().eq('id', row.id).eq('status', 'awaiting_payment'));
      }
    } catch (error) {
      console.error('[stripe] paiement abandonné', row.id, error);
    }
  }
}

/** Le voyageur relance le paiement : ses paiements en cours sur ce logement sont abandonnés. */
export async function discardOwnPendingCheckouts(guestId: number, listingId: number): Promise<void> {
  const rows = must(
    await db()
      .from('reservations')
      .select('id, stripe_checkout_session_id')
      .eq('guest_id', guestId)
      .eq('listing_id', listingId)
      .eq('status', 'awaiting_payment'),
  ) as Row[];
  for (const row of rows) {
    if (row.stripe_checkout_session_id) {
      try {
        await stripe().checkout.sessions.expire(row.stripe_checkout_session_id);
      } catch {
        // Déjà expirée ou terminée : la suppression ci-dessous suffit
      }
    }
    must(await db().from('reservations').delete().eq('id', row.id).eq('status', 'awaiting_payment'));
  }
}

// ─── Encaissement, libération, remboursement ──────────────────────────────────

const PAYMENT_SELECT = 'id, payment_status, stripe_payment_intent_id, amount_paid, amount_refunded';

async function paymentOf(id: number): Promise<Row | null> {
  return must(await db().from('reservations').select(PAYMENT_SELECT).eq('id', id).maybeSingle()) as Row | null;
}

/** Encaisse le montant autorisé quand l'hôte accepte la demande, puis planifie le versement. */
export async function capturePayment(id: number): Promise<void> {
  const payment = await paymentOf(id);
  if (!payment?.stripe_payment_intent_id) return;
  if (payment.payment_status === 'authorized') {
    const intent = await stripe().paymentIntents.capture(payment.stripe_payment_intent_id, {}, { idempotencyKey: `capture-${id}` });
    const now = freshTimestamp();
    must(
      await db()
        .from('reservations')
        .update({ payment_status: 'paid', amount_paid: euros(intent.amount_received), paid_at: now, updated_at: now })
        .eq('id', id),
    );
  } else if (payment.payment_status !== 'paid') {
    return;
  }
  await scheduleHostPayout(id);
}

/** Libère l'empreinte bancaire d'une demande refusée, expirée ou retirée (rien n'est débité). */
export async function releasePayment(id: number): Promise<void> {
  const payment = await paymentOf(id);
  if (!payment?.stripe_payment_intent_id) return;
  if (payment.payment_status === 'authorized') {
    await stripe().paymentIntents.cancel(payment.stripe_payment_intent_id);
    must(await db().from('reservations').update({ payment_status: 'released', updated_at: freshTimestamp() }).eq('id', id));
  } else if (payment.payment_status === 'paid') {
    await refundPayment(id, float(payment.amount_paid), 0);
  }
}

/**
 * Rembourse `amount` sur le moyen de paiement du voyageur et ramène le versement de l'hôte
 * à `hostShare` (ce qui lui revient après l'annulation). Sans paiement en ligne : rien à faire.
 */
export async function refundPayment(id: number, amount: number, hostShare: number): Promise<void> {
  const payment = await paymentOf(id);
  if (payment?.payment_status !== 'paid' || !payment.stripe_payment_intent_id) return;
  const refundCents = Math.min(cents(amount), cents(payment.amount_paid) - cents(payment.amount_refunded ?? 0));
  if (refundCents > 0) {
    await stripe().refunds.create(
      { payment_intent: payment.stripe_payment_intent_id, amount: refundCents },
      { idempotencyKey: `refund-${id}-${refundCents}` },
    );
    const refunded = euros(cents(payment.amount_refunded ?? 0) + refundCents);
    must(
      await db()
        .from('reservations')
        .update({
          amount_refunded: refunded,
          payment_status: cents(refunded) >= cents(payment.amount_paid) ? 'refunded' : 'partially_refunded',
          updated_at: freshTimestamp(),
        })
        .eq('id', id),
    );
  }
  await adjustHostPayout(id, hostShare);
}

/** Part de l'hôte qui reste due après une annulation remboursée selon `refund`. */
export function hostShareAfterRefund(reservation: Row, refund: RefundBreakdown): number {
  const nightsAmount = float(reservation.total_price) - float(reservation.service_fee) - float(reservation.cleaning_fee);
  const share = nightsAmount - refund.nights_refund + (float(reservation.cleaning_fee) - refund.cleaning_refund);
  return Math.max(0, Math.round(share * 100) / 100);
}

// ─── Versements aux hôtes (manuels) ───────────────────────────────────────────

/** Versement planifié au lendemain de l'arrivée : total payé moins les frais de service (0 % de commission hôte). */
export async function scheduleHostPayout(id: number): Promise<void> {
  const r = must(
    await db()
      .from('reservations')
      .select('id, listing_id, check_in, total_price, service_fee, cleaning_fee, currency, listing:listings!reservations_listing_id_fkey(user_id)')
      .eq('id', id)
      .single(),
  ) as Row;
  const net = Math.round((float(r.total_price) - float(r.service_fee)) * 100) / 100;
  const now = freshTimestamp();
  must(
    await db()
      .from('host_payouts')
      .upsert(
        {
          host_id: r.listing?.user_id,
          reservation_id: r.id,
          listing_id: r.listing_id,
          gross_amount: net,
          commission_rate: 0,
          commission_amount: 0,
          cleaning_fee: float(r.cleaning_fee),
          taxes: 0,
          net_amount: net,
          currency: r.currency || 'EUR',
          status: 'scheduled',
          scheduled_date: addDaysYmd(ymd(r.check_in) as string, 1),
          created_at: now,
          updated_at: now,
        },
        { onConflict: 'reservation_id', ignoreDuplicates: true },
      ),
  );
}

/** Après une annulation : versement réduit à la part restante de l'hôte, ou supprimé s'il ne reste rien. */
async function adjustHostPayout(id: number, hostShare: number): Promise<void> {
  const payout = must(
    await db().from('host_payouts').select('id, status').eq('reservation_id', id).maybeSingle(),
  ) as Row | null;
  if (!payout) return;
  if (payout.status === 'paid') {
    console.warn('[payout] réservation annulée après le versement à l’hôte : régularisation manuelle', id);
    return;
  }
  if (hostShare <= 0) {
    must(await db().from('host_payouts').delete().eq('id', payout.id));
  } else {
    must(
      await db()
        .from('host_payouts')
        .update({ gross_amount: hostShare, net_amount: hostShare, updated_at: freshTimestamp() })
        .eq('id', payout.id),
    );
  }
}
