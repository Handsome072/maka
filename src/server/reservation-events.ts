import { after } from 'next/server';
import { formatDayFr } from '@/shared/booking';
import { reservationMail, type ReservationMailOptions } from './emails';
import { ymd } from './format';
import type { Row } from './listings';
import { sendMail } from './mail';
import { createMessage, touchConversation } from './messaging/conversations';
import { freshTimestamp } from './profile/update';
import { db, must } from './supabase';

/**
 * Événements d'une réservation : message automatique dans la conversation hôte ↔ voyageur,
 * et emails aux personnes concernées, envoyés après la réponse HTTP.
 */

export type ReservationEvent =
  | 'requested'
  | 'booked'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'withdrawn'
  | 'cancelled_by_guest'
  | 'cancelled_by_host'
  | 'cancelled_by_admin';

/** Événements dont le voyageur est l'auteur (les autres viennent de l'hôte). */
const GUEST_EVENTS = new Set<ReservationEvent>(['requested', 'booked', 'expired', 'withdrawn', 'cancelled_by_guest']);

const EVENT_SELECT = [
  'id, confirmation_code, listing_id, guest_id, check_in, check_out, guests_count, total_price, service_fee, currency',
  'cancellation_reason, refund_amount, guest_message, payment_status, amount_paid',
  'listing:listings!reservations_listing_id_fkey(id, title, user_id, host:users!listings_user_id_fkey(id, email, first_name))',
  'guest:users!reservations_guest_id_fkey(id, email, first_name, last_name)',
].join(', ');

/**
 * Conversation de la réservation : celle qui lui est liée, sinon la question posée à l'hôte avant de réserver
 * (rattachée et désarchivée), sinon une nouvelle. Renvoie son id.
 */
export async function ensureConversation(
  reservation: { id: number; listing_id: number; guest_id: number },
  hostId: number,
): Promise<number> {
  const linked = must(
    await db()
      .from('conversations')
      .select('id')
      .eq('reservation_id', reservation.id)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ) as { id: number } | null;
  if (linked) return linked.id;

  const now = freshTimestamp();
  const inquiry = must(
    await db()
      .from('conversations')
      .select('id')
      .eq('listing_id', reservation.listing_id)
      .eq('host_id', hostId)
      .eq('guest_id', reservation.guest_id)
      .eq('is_admin_conversation', false)
      .is('reservation_id', null)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ) as { id: number } | null;
  if (inquiry) {
    must(
      await db()
        .from('conversations')
        .update({ reservation_id: reservation.id, host_archived: false, guest_archived: false, updated_at: now })
        .eq('id', inquiry.id),
    );
    return inquiry.id;
  }

  const created = must(
    await db()
      .from('conversations')
      .insert({
        reservation_id: reservation.id,
        listing_id: reservation.listing_id,
        host_id: hostId,
        guest_id: reservation.guest_id,
        created_at: now,
        updated_at: now,
      })
      .select('id')
      .single(),
  ) as { id: number };
  return created.id;
}

/** Publie un message écrit par un participant dans la conversation de la réservation. */
export async function postReservationMessage(
  reservation: { id: number; listing_id: number; guest_id: number },
  hostId: number,
  sender: { id: number; role: string },
  text: string,
): Promise<number> {
  const conversationId = await ensureConversation(reservation, hostId);
  await createMessage({ conversation_id: conversationId, sender_id: sender.id, text }, sender.role);
  await touchConversation(conversationId);
  return conversationId;
}

async function loadEventData(id: number): Promise<Row | null> {
  return must(await db().from('reservations').select(EVENT_SELECT).eq('id', id).maybeSingle()) as Row | null;
}

function guestsLabel(count: number): string {
  return `${count} voyageur${count > 1 ? 's' : ''}`;
}

function stayLabel(r: Row): string {
  return `${formatDayFr(ymd(r.check_in) as string)} → ${formatDayFr(ymd(r.check_out) as string, true)} · ${guestsLabel(r.guests_count)}`;
}

/** Texte du message automatique, lu par l'hôte comme par le voyageur. */
function systemText(event: ReservationEvent, r: Row): string {
  const reason = r.cancellation_reason ? ` (${r.cancellation_reason})` : '';
  switch (event) {
    case 'requested':
      return `Demande de réservation envoyée · ${stayLabel(r)}. L'hôte a 24 heures pour répondre.`;
    case 'booked':
      return `Réservation confirmée · ${stayLabel(r)}`;
    case 'accepted':
      return 'Demande acceptée : la réservation est confirmée.';
    case 'declined':
      return `Demande refusée${reason}. Les dates ont été libérées.`;
    case 'expired':
      return 'La demande a expiré sans réponse dans les 24 heures. Les dates ont été libérées.';
    case 'withdrawn':
      return 'Le voyageur a retiré sa demande. Les dates ont été libérées.';
    case 'cancelled_by_guest':
      return `Réservation annulée par le voyageur${reason}.`;
    case 'cancelled_by_host':
      return `Réservation annulée par l'hôte${reason}. Remboursement intégral pour le voyageur.`;
    case 'cancelled_by_admin':
      return r.refund_amount === null
        ? `Demande annulée par l'équipe Séjoura${reason}. Les dates ont été libérées.`
        : `Réservation annulée par l'équipe Séjoura${reason}. Remboursement intégral pour le voyageur.`;
  }
}

/**
 * Enregistre un événement : message automatique dans la conversation (tout de suite) puis emails
 * (après la réponse). Ni l'un ni l'autre ne fait échouer l'action qui l'a déclenché.
 * `actorId` : auteur du message s'il n'est ni le voyageur ni l'hôte (administrateur).
 */
export async function recordReservationEvent(id: number, event: ReservationEvent, actorId?: number): Promise<void> {
  try {
    const r = await loadEventData(id);
    if (!r?.listing) return;
    const hostId = r.listing.user_id as number;
    const conversationId = await ensureConversation(r as { id: number; listing_id: number; guest_id: number }, hostId);
    await createMessage(
      {
        conversation_id: conversationId,
        sender_id: actorId ?? (GUEST_EVENTS.has(event) ? r.guest_id : hostId),
        text: systemText(event, r),
        is_system: true,
      },
      'user',
    );
    await touchConversation(conversationId);
  } catch (error) {
    console.error('[api] message automatique de la réservation', id, event, error);
  }
  scheduleEmails(id, event);
}

// ─── Emails ───────────────────────────────────────────────────────────────────

function scheduleEmails(id: number, event: ReservationEvent): void {
  const site = (process.env.FRONTEND_URL ?? '').replace(/\/$/, '');
  if (!site) {
    console.warn('[mail] FRONTEND_URL manquant : emails de réservation non envoyés', id, event);
    return;
  }
  const send = () =>
    sendEventEmails(id, event, site).catch((error) => console.error('[mail] réservation', id, event, error));
  try {
    after(send);
  } catch {
    // Hors d'une requête (script) : envoi immédiat
    void send();
  }
}

function money(value: unknown, currency: string): string {
  const amount = parseFloat(String(value ?? '')) || 0;
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency || 'EUR' }).format(amount);
}

async function sendEventEmails(id: number, event: ReservationEvent, site: string): Promise<void> {
  const r = await loadEventData(id);
  if (!r?.listing) return;

  const title: string = r.listing.title ?? 'votre logement';
  const host = r.listing.host as Row | null;
  const guest = r.guest as Row | null;
  const hostName: string = host?.first_name || "L'hôte";
  const guestName: string = guest?.first_name || 'Le voyageur';
  const currency: string = r.currency || 'EUR';
  const checkIn = ymd(r.check_in) as string;
  const checkOut = ymd(r.check_out) as string;
  const refund = money(r.refund_amount, currency);
  const hasRefund = (parseFloat(String(r.refund_amount ?? '')) || 0) > 0;
  // Paiement en ligne (Stripe) ou réservation d'avant le paiement en ligne (règlement entre voyageur et hôte)
  const online = r.payment_status !== null && r.payment_status !== undefined;
  const offline = online
    ? 'Le remboursement est fait sur le moyen de paiement utilisé : comptez 5 à 10 jours ouvrés pour le voir sur le compte.'
    : `Le paiement en ligne n'étant pas encore disponible sur Séjoura, ce remboursement se règle directement entre le voyageur et l'hôte.`;
  const total = money(r.total_price, currency);
  const paidAmount = money(r.amount_paid ?? r.total_price, currency);
  const hostAmountLabel = money((parseFloat(r.total_price) || 0) - (parseFloat(r.service_fee) || 0), currency);
  const reason = r.cancellation_reason ? { label: 'Motif', text: String(r.cancellation_reason) } : null;
  const guestMessage = r.guest_message ? { label: `Message de ${guestName}`, text: String(r.guest_message) } : null;

  const guestUrl = `${site}/client-space/reservations/${id}/`;
  const hostUrl = `${site}/annonces/reservations/${id}/`;
  const searchUrl = `${site}/`;

  const common = (rows: [string, string][]): [string, string][] => [
    ['Logement', title],
    ['Arrivée', formatDayFr(checkIn, true)],
    ['Départ', formatDayFr(checkOut, true)],
    ...rows,
    ['N° de réservation', r.confirmation_code],
  ];
  const guestSummary = common([
    ['Voyageurs', guestsLabel(r.guests_count)],
    ['Total', money(r.total_price, currency)],
  ]);
  const hostSummary = common([
    ['Voyageur', `${guestName} · ${guestsLabel(r.guests_count)}`],
    ['Montant hôte', money((parseFloat(r.total_price) || 0) - (parseFloat(r.service_fee) || 0), currency)],
  ]);

  type Mail = Omit<ReservationMailOptions, 'site' | 'summary' | 'footerNote'>;
  const toGuest: Mail[] = [];
  const toHost: Mail[] = [];

  switch (event) {
    case 'requested':
      toGuest.push({
        subject: `Demande envoyée · ${title}`,
        preheader: `${hostName} a 24 heures pour répondre.`,
        heading: 'Votre demande est envoyée',
        paragraphs: [
          online
            ? `${hostName} a 24 heures pour accepter votre demande. Votre carte est autorisée pour ${total}, mais elle ne sera débitée que si la demande est acceptée ; sinon l'autorisation est annulée.`
            : `${hostName} a 24 heures pour accepter votre demande. Vos dates sont bloquées en attendant et aucun montant ne vous a été débité.`,
          'Nous vous écrirons dès que vous aurez une réponse.',
        ],
        button: { url: guestUrl, label: 'Voir ma demande' },
      });
      toHost.push({
        subject: `Nouvelle demande de réservation de ${guestName}`,
        preheader: 'Vous avez 24 heures pour répondre.',
        heading: `${guestName} souhaite réserver ${title}`,
        paragraphs: [
          'Vous avez 24 heures pour accepter ou refuser cette demande. Sans réponse, elle expire et les dates sont libérées.',
          ...(online ? ['Le paiement du voyageur est autorisé : il sera encaissé par Séjoura dès que vous accepterez.'] : []),
        ],
        quote: guestMessage,
        button: { url: hostUrl, label: 'Répondre à la demande' },
      });
      break;
    case 'booked':
      toGuest.push({
        subject: `Réservation confirmée · ${title}`,
        preheader: 'Votre séjour est réservé.',
        heading: 'Votre séjour est réservé',
        paragraphs: [
          `${online ? `Votre paiement de ${paidAmount} est confirmé. ` : ''}Votre réservation est confirmée. L'adresse exacte et les instructions d'arrivée sont disponibles dans votre réservation.`,
          `Vous pouvez écrire à ${hostName} depuis la messagerie Séjoura.`,
        ],
        button: { url: guestUrl, label: 'Voir ma réservation' },
      });
      toHost.push({
        subject: `Nouvelle réservation : ${guestName} arrive le ${formatDayFr(checkIn)}`,
        preheader: 'Réservation instantanée confirmée.',
        heading: `${guestName} a réservé ${title}`,
        paragraphs: [
          'Cette réservation instantanée est confirmée. Les dates sont bloquées dans votre calendrier.',
          ...(online ? [`Le paiement est encaissé par Séjoura ; votre versement de ${hostAmountLabel} est prévu le lendemain de l'arrivée.`] : []),
        ],
        quote: guestMessage,
        button: { url: hostUrl, label: 'Voir la réservation' },
      });
      break;
    case 'accepted':
      toGuest.push({
        subject: `Demande acceptée · ${title}`,
        preheader: `${hostName} a accepté votre demande.`,
        heading: 'Votre réservation est confirmée',
        paragraphs: [
          `${hostName} a accepté votre demande.${online ? ` Votre carte a été débitée de ${paidAmount}.` : ''} L'adresse exacte et les instructions d'arrivée sont maintenant disponibles dans votre réservation.`,
        ],
        button: { url: guestUrl, label: 'Voir ma réservation' },
      });
      break;
    case 'declined':
      toGuest.push({
        subject: `Demande non acceptée · ${title}`,
        preheader: 'Vos dates ont été libérées.',
        heading: "Votre demande n'a pas été acceptée",
        paragraphs: [
          `${hostName} n'a pas pu accepter votre demande. Vos dates ont été libérées et aucun montant ne vous a été débité.`,
          "D'autres logements vous attendent sur Séjoura.",
        ],
        quote: reason,
        button: { url: searchUrl, label: 'Trouver un autre logement' },
      });
      break;
    case 'expired':
      toGuest.push({
        subject: `Demande expirée · ${title}`,
        preheader: 'Aucun montant ne vous a été débité.',
        heading: 'Votre demande a expiré',
        paragraphs: [
          `${hostName} n'a pas répondu dans les 24 heures. Votre demande a expiré, les dates ont été libérées et aucun montant ne vous a été débité.`,
        ],
        button: { url: searchUrl, label: 'Trouver un autre logement' },
      });
      toHost.push({
        subject: `Demande expirée : ${guestName}`,
        preheader: 'Une demande est restée sans réponse.',
        heading: 'Une demande a expiré sans réponse',
        paragraphs: [
          `La demande de ${guestName} pour ${title} n'a pas reçu de réponse dans les 24 heures : elle a expiré et les dates sont de nouveau disponibles.`,
          'Répondre rapidement aux demandes aide les voyageurs à choisir votre logement.',
        ],
        button: { url: `${site}/annonces/reservations/`, label: 'Voir mes réservations' },
      });
      break;
    case 'withdrawn':
      toHost.push({
        subject: `Demande retirée : ${guestName}`,
        preheader: 'Les dates sont de nouveau disponibles.',
        heading: `${guestName} a retiré sa demande`,
        paragraphs: ['Les dates de cette demande sont de nouveau disponibles dans votre calendrier.'],
        button: { url: `${site}/annonces/reservations/`, label: 'Voir mes réservations' },
      });
      break;
    case 'cancelled_by_guest':
      toGuest.push({
        subject: `Réservation annulée · ${title}`,
        preheader: 'Votre annulation est enregistrée.',
        heading: 'Votre réservation est annulée',
        paragraphs: [
          hasRefund
            ? `Selon la politique d'annulation, ${refund} vous ${online ? 'sont remboursés' : 'sont remboursables'}. ${offline}`
            : online && r.payment_status === 'released'
              ? "L'autorisation sur votre carte a été annulée : aucun montant ne vous a été débité."
              : "Selon la politique d'annulation, aucun montant n'est remboursable pour cette annulation.",
        ],
        button: { url: guestUrl, label: 'Voir la réservation' },
      });
      toHost.push({
        subject: `Réservation annulée par ${guestName}`,
        preheader: 'Les dates sont de nouveau disponibles.',
        heading: `${guestName} a annulé sa réservation`,
        paragraphs: [
          'Les dates sont de nouveau disponibles dans votre calendrier.',
          hasRefund
            ? online
              ? `Selon la politique d'annulation, ${refund} sont remboursés au voyageur par Séjoura ; votre versement est ajusté en conséquence.`
              : `Selon la politique d'annulation, ${refund} sont à rembourser au voyageur. ${offline}`
            : "Selon la politique d'annulation, aucun remboursement n'est dû au voyageur.",
        ],
        quote: reason,
        button: { url: hostUrl, label: 'Voir la réservation' },
      });
      break;
    case 'cancelled_by_host':
      toGuest.push({
        subject: `Réservation annulée par ${hostName} · ${title}`,
        preheader: 'Remboursement intégral de votre séjour.',
        heading: `${hostName} a annulé votre réservation`,
        paragraphs: [
          `Nous sommes désolés : ${hostName} ne peut plus vous accueillir. ${online ? `Le montant intégral de votre séjour (${refund}) vous est remboursé.` : `Vous avez droit au remboursement intégral de votre séjour (${refund}).`} ${offline}`,
          "D'autres logements vous attendent sur Séjoura.",
        ],
        quote: reason,
        button: { url: searchUrl, label: 'Trouver un autre logement' },
      });
      toHost.push({
        subject: `Vous avez annulé la réservation de ${guestName}`,
        preheader: 'Les dates sont de nouveau disponibles.',
        heading: 'Réservation annulée',
        paragraphs: [
          online
            ? `Les dates sont de nouveau disponibles. Séjoura rembourse intégralement ${guestName} (${refund}) et votre versement pour ce séjour est annulé.`
            : `Les dates sont de nouveau disponibles. ${guestName} a droit au remboursement intégral (${refund}). ${offline}`,
        ],
        button: { url: hostUrl, label: 'Voir la réservation' },
      });
      break;
  }

  if (event === 'cancelled_by_admin') {
    const wasConfirmed = r.refund_amount !== null;
    const adminRefund = online
      ? `Le montant intégral (${refund}) est remboursé sur le moyen de paiement utilisé : comptez 5 à 10 jours ouvrés.`
      : `Vous avez droit au remboursement intégral de votre séjour (${refund}). ${offline}`;
    toGuest.push({
      subject: `${wasConfirmed ? 'Réservation annulée' : 'Demande annulée'} par Séjoura · ${title}`,
      preheader: wasConfirmed ? 'Remboursement intégral de votre séjour.' : 'Aucun montant ne vous a été débité.',
      heading: wasConfirmed ? 'Votre réservation a été annulée' : 'Votre demande a été annulée',
      paragraphs: [
        wasConfirmed
          ? `L'équipe Séjoura a dû annuler votre réservation. ${adminRefund}`
          : "L'équipe Séjoura a dû annuler votre demande de réservation. Aucun montant ne vous a été débité.",
        'Pour toute question, répondez simplement à cet e-mail.',
      ],
      quote: reason,
      button: { url: searchUrl, label: 'Trouver un autre logement' },
    });
    toHost.push({
      subject: `${wasConfirmed ? 'Réservation annulée' : 'Demande annulée'} par Séjoura : ${guestName}`,
      preheader: 'Les dates sont de nouveau disponibles.',
      heading: wasConfirmed ? 'Une réservation a été annulée par Séjoura' : 'Une demande a été annulée par Séjoura',
      paragraphs: [
        `L'équipe Séjoura a annulé ${wasConfirmed ? 'la réservation' : 'la demande'} de ${guestName} pour ${title}. Les dates sont de nouveau disponibles dans votre calendrier.`,
        ...(wasConfirmed
          ? [online ? `Séjoura rembourse intégralement ${guestName} (${refund}) et votre versement pour ce séjour est annulé.` : `${guestName} a droit au remboursement intégral (${refund}). ${offline}`]
          : []),
        'Pour toute question, répondez simplement à cet e-mail.',
      ],
      quote: reason,
      button: { url: hostUrl, label: 'Voir la réservation' },
    });
  }

  const deliveries: { to: string | null | undefined; mail: ReservationMailOptions }[] = [
    ...toGuest.map((mail) => ({
      to: guest?.email,
      mail: { ...mail, site, summary: guestSummary, footerNote: 'Vous recevez cet e-mail car vous avez une réservation sur Séjoura.' },
    })),
    ...toHost.map((mail) => ({
      to: host?.email,
      mail: { ...mail, site, summary: hostSummary, footerNote: 'Vous recevez cet e-mail car vous êtes hôte sur Séjoura.' },
    })),
  ];

  for (const { to, mail } of deliveries) {
    if (!to) continue;
    try {
      const { subject, html } = reservationMail(mail);
      await sendMail(to, subject, html);
    } catch (error) {
      console.error('[mail] réservation', id, event, to.replace(/^(.).*@/, '$1…@'), error);
    }
  }
}
