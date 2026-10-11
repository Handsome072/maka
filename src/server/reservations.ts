import { BLOCKING_STATUSES, computeRefund, tripPhase, type RefundBreakdown } from '@/shared/booking';
import { decimal, iso8601, todayUtc, ymd } from './format';
import { HttpError, notFound } from './http';
import { reservationToArray, sortPhotos, type Row } from './listings';
import { freshTimestamp } from './profile/update';
import {
  capturePayment,
  discardAbandonedCheckouts,
  hostShareAfterRefund,
  refundPayment,
  releasePayment,
} from './payments';
import { postReservationMessage, recordReservationEvent } from './reservation-events';
import { photoUrl, profilePhotoFullUrl } from './storage';
import { db, fetchAll, must, orValue } from './supabase';

/**
 * Parcours de réservation : expiration des demandes, conflits de dates, format des réponses
 * et conversation hôte ↔ voyageur ouverte à la réservation.
 */

/** Réservation avec son logement (photos, hôte) et son voyageur. */
export const RESERVATION_SELECT = [
  '*',
  'listing:listings!reservations_listing_id_fkey(id, user_id, title, city, province, country, arrival_time, departure_time, full_address, street, postal_code, checkin_method, checkin_instructions, host_photo_path, photos:listing_photos(id, path, order), host:users!listings_user_id_fkey(id, first_name, profile_photo_url, created_at))',
  'guest:users!reservations_guest_id_fkey(id, first_name, last_name, profile_photo_url, phone, phone_country_code, identity_verified, created_at)',
  'payouts:host_payouts!host_payouts_reservation_id_fkey(id, net_amount, status, scheduled_date, paid_date)',
].join(', ');

/** Statuts après lesquels le voyageur voit l'adresse exacte et les instructions d'arrivée. */
const CONFIRMED_STATUSES = new Set(['confirmed', 'active', 'completed']);

/**
 * Passe en « expirée » les demandes restées sans réponse, avec message automatique et emails.
 * Fait à chaque lecture, sans tâche planifiée : une demande échue ne bloque plus les dates
 * dès qu'on consulte le logement ou la réservation. Renvoie le nombre de demandes expirées.
 */
export async function expireStaleRequests(filter: {
  listingId?: number;
  listingIds?: number[];
  guestId?: number;
  id?: number;
}): Promise<number> {
  if (filter.listingIds && filter.listingIds.length === 0) return 0;
  await discardAbandonedCheckouts();
  const now = freshTimestamp();
  // Lignes créées sans échéance (ancien code) : 24 h après leur création
  const legacyCutoff = new Date(Date.parse(now) - 24 * 3_600_000).toISOString();
  let query = db()
    .from('reservations')
    .update({ status: 'expired', updated_at: now })
    .eq('status', 'pending')
    .or(`expires_at.lte.${orValue(now)},and(expires_at.is.null,created_at.lte.${orValue(legacyCutoff)})`);
  if (filter.listingId !== undefined) query = query.eq('listing_id', filter.listingId);
  if (filter.listingIds !== undefined) query = query.in('listing_id', filter.listingIds);
  if (filter.guestId !== undefined) query = query.eq('guest_id', filter.guestId);
  if (filter.id !== undefined) query = query.eq('id', filter.id);
  const expired = must(await query.select('id')) as Row[];
  for (const row of expired) {
    try {
      await releasePayment(row.id);
    } catch (error) {
      console.error('[stripe] libération de l’empreinte', row.id, error);
    }
    await recordReservationEvent(row.id, 'expired');
  }
  return expired.length;
}

/** Réservations qui occupent au moins une nuit de [checkIn, checkOut). */
export async function findConflicts(listingId: number, checkIn: string, checkOut: string): Promise<Row[]> {
  return fetchAll<Row>(() =>
    db()
      .from('reservations')
      .select('id, guest_id, check_in, check_out, status')
      .eq('listing_id', listingId)
      .in('status', BLOCKING_STATUSES)
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)
      .order('id'),
  );
}

/** Nuits bloquées par l'hôte dans [checkIn, checkOut). */
export async function blockedNights(listingId: number, checkIn: string, checkOut: string): Promise<string[]> {
  const rows = await fetchAll<Row>(() =>
    db()
      .from('listing_blocked_dates')
      .select('date')
      .eq('listing_id', listingId)
      .gte('date', checkIn)
      .lt('date', checkOut)
      .order('date'),
  );
  return rows.map((row) => ymd(row.date) as string);
}

/** Nuits occupées par ces réservations, limitées à [checkIn, checkOut). */
export function occupiedNights(reservations: Row[], checkIn: string, checkOut: string): string[] {
  const nights = new Set<string>();
  for (const reservation of reservations) {
    let cursor = Math.max(Date.parse(`${ymd(reservation.check_in)}T00:00:00Z`), Date.parse(`${checkIn}T00:00:00Z`));
    const end = Math.min(Date.parse(`${ymd(reservation.check_out)}T00:00:00Z`), Date.parse(`${checkOut}T00:00:00Z`));
    for (; cursor < end; cursor += 86_400_000) {
      nights.add(new Date(cursor).toISOString().slice(0, 10));
    }
  }
  return [...nights].sort();
}

function formatPayout(payouts: Row[] | Row | null | undefined): Row | null {
  const payout = Array.isArray(payouts) ? payouts[0] : payouts;
  if (!payout) return null;
  return {
    id: payout.id,
    net_amount: decimal(payout.net_amount, 2),
    status: payout.status,
    scheduled_date: ymd(payout.scheduled_date),
    paid_date: ymd(payout.paid_date),
    reference: payout.reference ?? null,
  };
}

/** Conversation de chaque réservation (la plus récente si plusieurs). */
export async function conversationIds(reservationIds: number[]): Promise<Map<number, number>> {
  const map = new Map<number, number>();
  if (reservationIds.length === 0) return map;
  const rows = must(
    await db().from('conversations').select('id, reservation_id').in('reservation_id', reservationIds).order('id'),
  ) as Row[];
  for (const row of rows) map.set(row.reservation_id, row.id);
  return map;
}

/**
 * Réservation telle que la voient le voyageur et l'hôte : colonnes de la table, phase du séjour,
 * logement, hôte et voyageur. L'adresse exacte et les instructions d'arrivée ne sont données au voyageur
 * qu'une fois la réservation confirmée.
 */
export function formatReservation(row: Row, viewerId: number, conversationId: number | null): Row {
  const { listing, guest, payouts, ...attributes } = row;
  const isHost = listing?.user_id === viewerId;
  const confirmed = CONFIRMED_STATUSES.has(row.status);
  const reveal = isHost || confirmed;
  const photos = sortPhotos(listing?.photos);
  const host = listing?.host ?? null;
  const today = ymd(todayUtc()) as string;

  return {
    ...reservationToArray(attributes),
    phase: tripPhase(row.status, ymd(row.check_in) as string, ymd(row.check_out) as string, today),
    viewer_role: isHost ? 'host' : 'guest',
    conversation_id: conversationId,
    // Versement à l'hôte (manuel), visible par l'hôte seulement
    payout: isHost ? formatPayout(payouts) : null,
    listing: listing
      ? {
          id: listing.id,
          title: listing.title,
          city: listing.city,
          province: listing.province,
          country: listing.country,
          cover_photo_url: photos.length > 0 ? photoUrl(photos[0].path) : null,
          arrival_time: listing.arrival_time,
          departure_time: listing.departure_time,
          full_address: reveal ? listing.full_address : null,
          street: reveal ? listing.street : null,
          postal_code: reveal ? listing.postal_code : null,
          checkin_method: reveal ? listing.checkin_method : null,
          checkin_instructions: reveal ? listing.checkin_instructions : null,
        }
      : null,
    host: host
      ? {
          id: host.id,
          first_name: host.first_name,
          profile_photo_url: listing.host_photo_path
            ? photoUrl(listing.host_photo_path)
            : profilePhotoFullUrl(host.profile_photo_url),
          member_since: iso8601(host.created_at),
        }
      : null,
    // L'hôte ne voit que le prénom du voyageur avant la confirmation ; nom complet et téléphone ensuite
    guest: guest
      ? {
          id: guest.id,
          first_name: guest.first_name,
          last_name: !isHost || confirmed ? guest.last_name : null,
          profile_photo_url: profilePhotoFullUrl(guest.profile_photo_url),
          phone: isHost && confirmed && guest.phone ? `${guest.phone_country_code ?? ''} ${guest.phone}`.trim() : null,
          identity_verified: Boolean(guest.identity_verified),
          member_since: iso8601(guest.created_at),
        }
      : null,
  };
}

/**
 * Réponse de l'hôte à une demande en attente : acceptée (confirmée) ou refusée.
 * `reason` : motif du refus, montré au voyageur ; `message` : mot publié dans la conversation.
 * Renvoie la réservation à jour ; HttpError si la demande n'existe pas, n'est pas à cet hôte ou n'est plus en attente.
 */
export async function respondToRequest(
  id: number,
  host: { id: number; role: string },
  decision: 'accept' | 'decline',
  options: { reason?: string | null; message?: string | null } = {},
): Promise<Row> {
  await expireStaleRequests({ id });

  const current = must(
    await db()
      .from('reservations')
      .select('id, guest_id, listing_id, status, listing:listings!reservations_listing_id_fkey(user_id)')
      .eq('id', id)
      .maybeSingle(),
  ) as Row | null;
  if (!current) {
    notFound('Reservation', id);
  }
  if (current.listing?.user_id !== host.id) {
    throw new HttpError(403, { message: 'Unauthorized.' });
  }
  if (current.status !== 'pending') {
    const message =
      current.status === 'expired'
        ? "Cette demande a expiré : le délai de 24 heures est dépassé. Le voyageur doit refaire une demande."
        : 'Cette demande a déjà reçu une réponse ou a été retirée par le voyageur.';
    throw new HttpError(422, { message, status: current.status });
  }

  // Acceptation : le montant autorisé est encaissé d'abord ; s'il ne peut pas l'être, rien ne change
  if (decision === 'accept') {
    try {
      await capturePayment(id);
    } catch (error) {
      console.error('[stripe] encaissement de la demande', id, error);
      throw new HttpError(502, {
        message: "Le paiement du voyageur n'a pas pu être encaissé : la demande reste en attente. Réessayez dans un instant.",
      });
    }
  }

  const now = freshTimestamp();
  const changes: Row =
    decision === 'accept'
      ? { status: 'confirmed', confirmed_at: now, updated_at: now }
      : { status: 'declined', declined_at: now, cancellation_reason: options.reason ?? null, updated_at: now };
  // Garde sur le statut : la demande a pu expirer ou être retirée à l'instant
  const updated = must(
    await db().from('reservations').update(changes).eq('id', id).eq('status', 'pending').select('id'),
  ) as Row[];
  if (updated.length === 0) {
    if (decision === 'accept') {
      // Encaissé pour une demande qui vient de changer d'état : le voyageur est remboursé
      await releasePayment(id).catch((error) => console.error('[stripe] remboursement après conflit', id, error));
    }
    throw new HttpError(409, { message: "Cette demande n'est plus en attente." });
  }
  if (decision === 'decline') {
    await releasePayment(id).catch((error) => console.error('[stripe] libération de l’empreinte', id, error));
  }

  await recordReservationEvent(id, decision === 'accept' ? 'accepted' : 'declined');
  await postOptionalMessage(current, host.id, host, options.message);

  return must(await db().from('reservations').select(RESERVATION_SELECT).eq('id', id).single()) as Row;
}

/** Mot facultatif de l'hôte ou du voyageur, publié après le message automatique de l'événement. */
async function postOptionalMessage(
  reservation: Row,
  hostId: number,
  sender: { id: number; role: string },
  message: string | null | undefined,
): Promise<void> {
  if (!message) return;
  try {
    await postReservationMessage(
      reservation as { id: number; listing_id: number; guest_id: number },
      hostId,
      sender,
      message,
    );
  } catch (error) {
    console.error('[api] message joint à la réservation', reservation.id, error);
  }
}

/** Qui annule : le voyageur, l'hôte, ou l'équipe Séjoura depuis l'administration. */
export type Canceller = 'guest' | 'host' | 'admin';

const CANCEL_SELECT =
  'id, guest_id, listing_id, status, check_in, check_out, created_at, total_price, service_fee, cleaning_fee, nights_count, cancellation_policy, listing:listings!reservations_listing_id_fkey(user_id)';

export type CancellationCheck =
  | { allowed: true; kind: 'withdraw'; refund: null }
  | { allowed: true; kind: 'cancel'; refund: RefundBreakdown }
  | { allowed: false; message: string };

/** Ce que donnerait l'annulation maintenant : possible ou non, et remboursement selon la politique. */
function checkCancellation(reservation: Row, by: Canceller): CancellationCheck {
  if (reservation.status === 'awaiting_payment') {
    return { allowed: false, message: "Le paiement de cette réservation n'est pas terminé." };
  }
  if (reservation.status === 'pending') {
    return by === 'host'
      ? { allowed: false, message: 'Pour une demande en attente, utilisez « Refuser ».' }
      : { allowed: true, kind: 'withdraw', refund: null };
  }
  if (!CONFIRMED_STATUSES.has(reservation.status) || reservation.status === 'completed') {
    return { allowed: false, message: 'Cette réservation est déjà annulée, refusée, expirée ou terminée.' };
  }
  const checkIn = ymd(reservation.check_in) as string;
  const today = ymd(todayUtc()) as string;
  // L'administration peut encore annuler un séjour en cours (problème grave), pas un séjour terminé
  if (by === 'admin' ? (ymd(reservation.check_out) as string) <= today : checkIn < today) {
    return {
      allowed: false,
      message:
        by === 'admin'
          ? 'Le séjour est terminé : il ne peut plus être annulé.'
          : "Le séjour a déjà commencé : il ne peut plus être annulé en ligne. Écrivez-nous à contact@sejoura.com.",
    };
  }
  return {
    allowed: true,
    kind: 'cancel',
    refund: computeRefund(
      {
        total_price: reservation.total_price,
        service_fee: reservation.service_fee,
        cleaning_fee: reservation.cleaning_fee,
        nights_count: reservation.nights_count,
        check_in: checkIn,
        created_at: reservation.created_at,
        cancellation_policy: reservation.cancellation_policy,
      },
      new Date(),
      by,
    ),
  };
}

/** Réservation à annuler ; le voyageur et l'hôte ne peuvent agir que sur les leurs (l'admin est vérifié par la route). */
async function loadForCancellation(id: number, actor: { id: number }, by: Canceller): Promise<Row> {
  await expireStaleRequests({ id });
  const reservation = must(await db().from('reservations').select(CANCEL_SELECT).eq('id', id).maybeSingle()) as Row | null;
  if (!reservation) {
    notFound('Reservation', id);
  }
  if (by !== 'admin') {
    const owner = by === 'guest' ? reservation.guest_id : reservation.listing?.user_id;
    if (owner !== actor.id) {
      throw new HttpError(403, { message: 'Unauthorized.' });
    }
  }
  return reservation;
}

/** Aperçu avant d'annuler : l'annulation est-elle possible, et combien serait remboursé. */
export async function previewCancellation(id: number, actor: { id: number }, by: Canceller): Promise<CancellationCheck> {
  return checkCancellation(await loadForCancellation(id, actor, by), by);
}

/**
 * Annulation par le voyageur (retrait d'une demande, ou réservation confirmée avant l'arrivée,
 * remboursée selon la politique), par l'hôte (réservation confirmée, voyageur remboursé intégralement)
 * ou par l'administration (demande ou réservation non terminée, voyageur remboursé intégralement).
 */
export async function cancelReservation(
  id: number,
  actor: { id: number; role: string },
  by: Canceller,
  options: { reason?: string | null; message?: string | null } = {},
): Promise<Row> {
  const reservation = await loadForCancellation(id, actor, by);
  const check = checkCancellation(reservation, by);
  if (!check.allowed) {
    throw new HttpError(422, { message: check.message });
  }

  // Argent d'abord : empreinte libérée ou remboursement Stripe ; en cas d'échec la réservation ne change pas
  try {
    if (check.kind === 'withdraw') {
      await releasePayment(id);
    } else {
      await refundPayment(id, check.refund.refund, hostShareAfterRefund(reservation, check.refund));
    }
  } catch (error) {
    console.error('[stripe] remboursement de l’annulation', id, error);
    throw new HttpError(502, {
      message: "Le remboursement n'a pas pu être effectué : la réservation n'a pas été annulée. Réessayez dans un instant.",
    });
  }

  const now = freshTimestamp();
  const updated = must(
    await db()
      .from('reservations')
      .update({
        status: 'cancelled',
        cancelled_at: now,
        cancelled_by: by,
        cancellation_reason: options.reason ?? null,
        refund_amount: check.refund?.refund ?? null,
        updated_at: now,
      })
      .eq('id', id)
      .eq('status', reservation.status)
      .select('id'),
  ) as Row[];
  if (updated.length === 0) {
    throw new HttpError(409, { message: "La réservation vient de changer d'état. Rechargez la page." });
  }

  if (by === 'admin') {
    // Message automatique signé par l'administrateur : non lu pour le voyageur comme pour l'hôte
    await recordReservationEvent(id, 'cancelled_by_admin', actor.id);
  } else {
    const event = check.kind === 'withdraw' ? 'withdrawn' : by === 'guest' ? 'cancelled_by_guest' : 'cancelled_by_host';
    await recordReservationEvent(id, event);
    await postOptionalMessage(reservation, reservation.listing?.user_id, actor, options.message);
  }

  return must(await db().from('reservations').select(RESERVATION_SELECT).eq('id', id).single()) as Row;
}

// ─── Administration ───────────────────────────────────────────────────────────

/** Réservation vue par l'administration : coordonnées complètes du voyageur et de l'hôte. */
export const ADMIN_RESERVATION_SELECT = [
  '*',
  'listing:listings!reservations_listing_id_fkey(id, title, city, province, full_address, photos:listing_photos(id, path, order), host:users!listings_user_id_fkey(id, first_name, last_name, email, phone, phone_country_code, profile_photo_url))',
  'guest:users!reservations_guest_id_fkey(id, first_name, last_name, email, phone, phone_country_code, profile_photo_url)',
  'payouts:host_payouts!host_payouts_reservation_id_fkey(id, net_amount, status, scheduled_date, paid_date, reference)',
].join(', ');

function adminPerson(user: Row | null | undefined): Row | null {
  if (!user) return null;
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone ? `${user.phone_country_code ?? ''} ${user.phone}`.trim() : null,
    profile_photo_url: profilePhotoFullUrl(user.profile_photo_url),
  };
}

export function formatAdminReservation(row: Row, conversationId: number | null): Row {
  const { listing, guest, payouts, ...attributes } = row;
  const photos = sortPhotos(listing?.photos);
  return {
    ...reservationToArray(attributes),
    stripe_payment_intent_id: row.stripe_payment_intent_id ?? null,
    payout: formatPayout(payouts),
    phase: tripPhase(row.status, ymd(row.check_in) as string, ymd(row.check_out) as string, ymd(todayUtc()) as string),
    conversation_id: conversationId,
    listing: listing
      ? {
          id: listing.id,
          title: listing.title,
          city: listing.city,
          province: listing.province,
          full_address: listing.full_address,
          cover_photo_url: photos.length > 0 ? photoUrl(photos[0].path) : null,
        }
      : null,
    host: adminPerson(listing?.host),
    guest: adminPerson(guest),
  };
}
