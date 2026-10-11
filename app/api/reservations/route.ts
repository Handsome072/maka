import { authenticate } from '@/server/auth';
import { ymd } from '@/server/format';
import { input, json, notFound, route } from '@/server/http';
import { computePrice, parseCarbon, type Row } from '@/server/listings';
import { freshTimestamp } from '@/server/profile/update';
import {
  blockedNights,
  conversationIds,
  expireStaleRequests,
  findConflicts,
  formatReservation,
  occupiedNights,
  RESERVATION_SELECT,
} from '@/server/reservations';
import { frontendUrl } from '@/server/mail';
import { CHECKOUT_MINUTES, createCheckoutSession, discardOwnPendingCheckouts, paymentsEnabled } from '@/server/payments';
import { postReservationMessage, recordReservationEvent } from '@/server/reservation-events';
import { db, fetchAll, must } from '@/server/supabase';
import { validate } from '@/server/validation';
import {
  nightsBetweenYmd,
  normalizeCancellationPolicy,
  requestDeadline,
  stayLimits,
  weekdayAllowed,
  weekdayName,
  weekdayOfYmd,
} from '@/shared/booking';

export const dynamic = 'force-dynamic';

/** Erreur de règle de réservation, au format des erreurs de validation (422 { message, errors }). */
function refuse(field: string, message: string): Response {
  return json({ message, errors: { [field]: [message] } }, 422);
}

/**
 * Réservation d'un logement. Réservation instantanée : confirmée tout de suite.
 * Sinon demande en attente : l'hôte a 24 h pour répondre et les dates restent bloquées jusque-là.
 */
export const POST = route(async (req) => {
  const { user } = await authenticate(req);

  const validated = await validate(await input(req), {
    listing_id: 'required|exists:listings,id',
    check_in: 'required|date|after_or_equal:today',
    check_out: 'required|date|after:check_in',
    adults: 'integer|min:1',
    children: 'integer|min:0',
    infants: 'integer|min:0',
    pets: 'integer|min:0',
    guest_message: 'nullable|string|max:1000',
  });

  const adults = Number(validated.adults ?? 1);
  const children = Number(validated.children ?? 0);
  const infants = Number(validated.infants ?? 0);
  const pets = Number(validated.pets ?? 0);
  const checkIn = ymd(parseCarbon(validated.check_in)) as string;
  const checkOut = ymd(parseCarbon(validated.check_out)) as string;
  const nights = nightsBetweenYmd(checkIn, checkOut);

  const listing = must(await db().from('listings').select('*').eq('id', validated.listing_id).maybeSingle()) as Row | null;
  if (!listing) {
    notFound('Listing', validated.listing_id);
  }

  // ─── Règles du logement ─────────────────────────────────────────────────────
  if (listing.status !== 'active') {
    return refuse('listing_id', "Ce logement n'est pas disponible à la réservation.");
  }
  if (listing.user_id === user.id) {
    return refuse('listing_id', 'Vous ne pouvez pas réserver votre propre logement.');
  }
  const capacity = Math.trunc(Number(listing.capacity ?? 0));
  if (capacity > 0 && adults + children > capacity) {
    return refuse('adults', `Ce logement accueille au maximum ${capacity} voyageur${capacity > 1 ? 's' : ''} (bébés non compris).`);
  }
  const { minStay, maxStay } = stayLimits(listing.min_stay, listing.max_stay);
  if (nights < minStay) {
    return refuse('check_out', `Ce logement demande un séjour d'au moins ${minStay} nuit${minStay > 1 ? 's' : ''}.`);
  }
  if (maxStay > 0 && nights > maxStay) {
    return refuse('check_out', `Ce logement accepte au maximum ${maxStay} nuits.`);
  }
  if (!weekdayAllowed(listing.arrival_days, weekdayOfYmd(checkIn))) {
    return refuse('check_in', `Les arrivées ne sont pas possibles le ${weekdayName(weekdayOfYmd(checkIn))} dans ce logement.`);
  }
  if (!weekdayAllowed(listing.departure_days, weekdayOfYmd(checkOut))) {
    return refuse('check_out', `Les départs ne sont pas possibles le ${weekdayName(weekdayOfYmd(checkOut))} dans ce logement.`);
  }

  // ─── Disponibilité ──────────────────────────────────────────────────────────
  const payOnline = paymentsEnabled();
  if (payOnline) {
    // Paiement relancé (formulaire fermé, retour arrière) : l'essai précédent libère ses dates
    await discardOwnPendingCheckouts(user.id, listing.id);
  }
  await expireStaleRequests({ listingId: listing.id });
  const unavailable = async (): Promise<Response> => {
    const conflicts = await findConflicts(listing.id, checkIn, checkOut);
    const blocked = await blockedNights(listing.id, checkIn, checkOut);
    const own = conflicts.find((reservation) => reservation.guest_id === user.id);
    if (own) {
      return json(
        { message: 'Vous avez déjà une réservation pour ce logement sur ces dates.', reservation_id: own.id },
        409,
      );
    }
    return json(
      {
        message: "Ces dates ne sont plus disponibles. Choisissez d'autres dates.",
        conflicting_dates: [...new Set([...occupiedNights(conflicts, checkIn, checkOut), ...blocked])].sort(),
      },
      409,
    );
  };
  if (
    (await findConflicts(listing.id, checkIn, checkOut)).length > 0 ||
    (await blockedNights(listing.id, checkIn, checkOut)).length > 0
  ) {
    return unavailable();
  }

  // ─── Création ───────────────────────────────────────────────────────────────
  const price = computePrice(listing, checkIn, checkOut, adults, children, pets);
  const instant = listing.reservation_mode === 'instant';
  const now = freshTimestamp();
  // Paiement en ligne : dates retenues le temps du paiement. Sinon l'hôte a 24 h pour répondre à une demande.
  const expiresAt = payOnline
    ? new Date(Date.parse(now) + CHECKOUT_MINUTES * 60_000).toISOString()
    : instant
      ? null
      : requestDeadline(new Date(now), checkIn);

  const attributes: Row = {
    guest_id: user.id,
    listing_id: listing.id,
    check_in: checkIn,
    check_out: checkOut,
    adults,
    children,
    infants,
    pets,
    guests_count: adults + children,
    nights_count: nights,
    price_per_night: price.price_per_night,
    cleaning_fee: price.cleaning_fee,
    extra_guest_fee: price.extra_guest_fee,
    pet_fee: price.pet_fee,
    service_fee: price.service_fee,
    total_price: price.total,
    currency: listing.currency,
    status: payOnline ? 'awaiting_payment' : instant ? 'confirmed' : 'pending',
    payment_status: payOnline ? 'awaiting' : null,
    reservation_mode: instant ? 'instant' : 'request',
    cancellation_policy: normalizeCancellationPolicy(listing.cancellation_policy) ?? 'flexible',
    expires_at: expiresAt,
    confirmed_at: instant && !payOnline ? now : null,
    guest_message: validated.guest_message ?? null,
    created_at: now,
    updated_at: now,
  };

  const inserted = await db().from('reservations').insert(attributes).select('id').single();
  // Deux voyageurs sur les mêmes dates au même instant : la contrainte de non-chevauchement tranche
  if (inserted.error && (inserted.error as { code?: string }).code === '23P01') {
    return unavailable();
  }
  const reservationId = (must(inserted) as Row).id as number;

  if (payOnline) {
    // La réservation devient une demande (ou est confirmée) quand le paiement aboutit : voir finalizeCheckout
    const created = must(await db().from('reservations').select('*').eq('id', reservationId).single()) as Row;
    let checkout: { sessionId: string; clientSecret: string };
    try {
      checkout = await createCheckoutSession(created, listing, user, frontendUrl(req));
    } catch (error) {
      console.error('[stripe] création de la session de paiement', reservationId, error);
      must(await db().from('reservations').delete().eq('id', reservationId));
      return json({ message: "Le paiement n'a pas pu être préparé. Réessayez dans un instant." }, 502);
    }
    must(
      await db().from('reservations').update({ stripe_checkout_session_id: checkout.sessionId }).eq('id', reservationId),
    );
    const reservation = must(
      await db().from('reservations').select(RESERVATION_SELECT).eq('id', reservationId).single(),
    ) as Row;
    return json(
      {
        message: 'Paiement à finaliser.',
        reservation: formatReservation(reservation, user.id, null),
        checkout: { client_secret: checkout.clientSecret },
      },
      201,
    );
  }

  // Message automatique dans la conversation (ouverte au besoin), emails au voyageur et à l'hôte
  await recordReservationEvent(reservationId, instant ? 'booked' : 'requested');
  if (attributes.guest_message) {
    try {
      await postReservationMessage(
        { id: reservationId, listing_id: listing.id, guest_id: user.id },
        listing.user_id,
        user,
        attributes.guest_message,
      );
    } catch (error) {
      // La réservation est faite ; le message reste lisible dans guest_message
      console.error('[api] message du voyageur sur la réservation', reservationId, error);
    }
  }
  const conversationId = (await conversationIds([reservationId])).get(reservationId) ?? null;

  const reservation = must(
    await db().from('reservations').select(RESERVATION_SELECT).eq('id', reservationId).single(),
  ) as Row;

  return json(
    {
      message: instant ? 'Réservation confirmée.' : 'Demande de réservation envoyée.',
      reservation: formatReservation(reservation, user.id, conversationId),
    },
    201,
  );
});

/** Réservations du voyageur connecté, de la plus lointaine à la plus ancienne. */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  await expireStaleRequests({ guestId: user.id });

  const reservations = await fetchAll<Row>(() =>
    db()
      .from('reservations')
      .select(RESERVATION_SELECT)
      .eq('guest_id', user.id)
      .neq('status', 'awaiting_payment')
      .order('check_in', { ascending: false })
      .order('id', { ascending: false }),
  );
  const conversations = await conversationIds(reservations.map((reservation) => reservation.id));

  return json({
    reservations: reservations.map((reservation) =>
      formatReservation(reservation, user.id, conversations.get(reservation.id) ?? null),
    ),
  });
});
