'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Check, Clock, MapPin, MessageSquare, Phone, ShieldCheck, Users, X } from 'lucide-react';
import { HostSidebar } from '@/app/components/HostSidebar';
import { hostReservationsApi, reservationsApi, type ReservationData } from '@/app/services/api';
import { HOST_PHASE_LABELS, ReservationStatusBadge } from '@/app/components/booking/ReservationStatusBadge';
import {
  formatDateTime,
  formatGuestsDetail,
  formatHour,
  formatMoney,
  formatStayDay,
  formatTimeLeft,
  hostAmount,
} from '@/app/components/booking/format';
import { CANCELLATION_POLICY_LABELS, normalizeCancellationPolicy } from '@/shared/booking';

interface HostReservationDetailProps {
  reservationId: string;
}

/** Motifs d'annulation par l'hôte ; le motif choisi est montré au voyageur. */
const HOST_CANCEL_REASONS = [
  "Le logement n'est plus disponible à ces dates",
  'Travaux ou problème dans le logement',
  'Raison personnelle',
  'Autre raison',
];

/** Motifs de refus proposés ; le motif choisi est montré au voyageur. */
const DECLINE_REASONS = [
  'Les dates ne sont finalement pas disponibles',
  'Le logement ne convient pas à ce séjour',
  'Le nombre de voyageurs ne convient pas',
  'Autre raison',
];

/** Paiement du voyageur et versement à l'hôte, en une phrase. */
function hostPaymentNote(reservation: ReservationData): string {
  const payout = reservation.payout;
  const money = (value: string | null) => formatMoney(value, reservation.currency);
  switch (reservation.payment_status) {
    case null:
    case undefined:
      return "Réservation sans paiement en ligne : convenez du règlement avec le voyageur dans la messagerie.";
    case 'authorized':
      return 'Le paiement du voyageur est autorisé : Séjoura l’encaissera dès que vous accepterez la demande.';
    case 'released':
      return 'Autorisation annulée : rien n’a été débité au voyageur.';
    default:
      if (payout?.status === 'paid') {
        return `Versement de ${money(payout.net_amount)} effectué le ${formatStayDay(payout.paid_date ?? '')}${payout.reference ? ` (réf. ${payout.reference})` : ''}.`;
      }
      if (payout) {
        return `Paiement encaissé par Séjoura. Versement de ${money(payout.net_amount)} prévu le ${formatStayDay(payout.scheduled_date ?? '')}, par virement.`;
      }
      return 'Paiement encaissé par Séjoura ; aucun versement n’est dû pour cette réservation.';
  }
}

function amount(value: string | null | undefined): number {
  const parsed = parseFloat(value ?? '');
  return Number.isFinite(parsed) ? parsed : 0;
}

export function HostReservationDetail({ reservationId }: HostReservationDetailProps) {
  const router = useRouter();
  const id = Number(reservationId);
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [action, setAction] = useState<'accept' | 'decline' | 'cancel' | null>(null);
  const [cancelReason, setCancelReason] = useState(HOST_CANCEL_REASONS[0]);
  const [replyMessage, setReplyMessage] = useState('');
  const [declineReason, setDeclineReason] = useState(DECLINE_REASONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    reservationsApi
      .getOne(id)
      .then((res) => {
        if (cancelled) return;
        if (res.reservation.viewer_role !== 'host') {
          setError('Réservation introuvable.');
          return;
        }
        setReservation(res.reservation);
      })
      .catch((err: { status?: number }) => {
        if (cancelled) return;
        setError(err?.status === 404 || err?.status === 403 ? 'Réservation introuvable.' : 'Impossible de charger la réservation.');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const openAction = (next: 'accept' | 'decline' | 'cancel') => {
    setAction(next);
    setReplyMessage('');
    setDeclineReason(DECLINE_REASONS[0]);
    setCancelReason(HOST_CANCEL_REASONS[0]);
    setActionError(null);
  };

  const submitAction = async () => {
    if (!action) return;
    setSubmitting(true);
    setActionError(null);
    try {
      const message = replyMessage.trim() || undefined;
      const res =
        action === 'accept'
          ? await hostReservationsApi.accept(id, message)
          : action === 'decline'
            ? await hostReservationsApi.decline(id, { reason: declineReason, message })
            : await hostReservationsApi.cancel(id, { reason: cancelReason, message });
      setReservation(res.reservation);
      setAction(null);
      // Pastille « demandes à traiter » du menu
      window.dispatchEvent(new Event('host-reservations-changed'));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'La réponse n’a pas pu être enregistrée.');
    } finally {
      setSubmitting(false);
    }
  };

  const backButton = (
    <button
      onClick={() => router.push('/annonces/reservations')}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 mt-16 lg:mt-0"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="text-sm" style={{ fontWeight: 500 }}>Retour aux réservations</span>
    </button>
  );

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HostSidebar activePage="host-reservations" />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          {backButton}
          {error ? (
            <div className="text-center py-24">
              <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>{error}</h2>
              <p className="text-sm" style={{ color: '#717171' }}>Cette réservation n&apos;existe pas ou ne concerne pas vos logements.</p>
            </div>
          ) : (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
          )}
        </main>
      </div>
    );
  }

  const guest = reservation.guest;
  const guestFirstName = guest?.first_name || 'Le voyageur';
  const guestFullName = [guest?.first_name, guest?.last_name].filter(Boolean).join(' ') || 'Voyageur';
  const listing = reservation.listing;
  const currency = reservation.currency;
  const nights = reservation.nights_count;
  const pending = reservation.phase === 'pending';
  const confirmed = reservation.phase === 'upcoming' || reservation.phase === 'ongoing';
  const timeLeft = formatTimeLeft(reservation.expires_at);
  const policy = normalizeCancellationPolicy(reservation.cancellation_policy);
  const inboxHref = reservation.conversation_id ? `/annonces/inbox?conversation=${reservation.conversation_id}` : '/annonces/inbox';
  const priceLines: [string, number][] = [
    [`${formatMoney(reservation.price_per_night, currency)} x ${nights} nuit${nights > 1 ? 's' : ''}`, amount(reservation.price_per_night) * nights],
    ['Frais de ménage', amount(reservation.cleaning_fee)],
    ['Voyageurs supplémentaires', amount(reservation.extra_guest_fee)],
    ['Animaux', amount(reservation.pet_fee)],
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HostSidebar activePage="host-reservations" />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {backButton}

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
              {pending ? `Demande de ${guestFirstName}` : `Réservation de ${guestFullName}`}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#717171' }}>
              N° <span className="font-mono">{reservation.confirmation_code}</span> · {pending ? 'Demandée' : 'Réservée'} le{' '}
              {formatDateTime(reservation.created_at)}
            </p>
          </div>
          <ReservationStatusBadge phase={reservation.phase} label={HOST_PHASE_LABELS[reservation.phase]} className="self-start text-sm" />
        </div>

        {/* Demande à traiter */}
        {pending && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <p className="text-base mb-1" style={{ fontWeight: 600, color: '#78350F' }}>
              {guestFirstName} souhaite réserver du {formatStayDay(reservation.check_in)} au {formatStayDay(reservation.check_out)}
            </p>
            <p className="text-sm mb-4 flex items-center gap-1.5" style={{ color: '#92400E' }}>
              <Clock className="w-4 h-4" />
              {timeLeft
                ? `Répondez avant le ${formatDateTime(reservation.expires_at)} (il reste ${timeLeft}). Sans réponse, la demande expire et les dates sont libérées.`
                : 'Le délai de réponse est dépassé.'}
            </p>
            {reservation.guest_message && (
              <blockquote className="bg-white border border-amber-100 rounded-lg p-4 mb-4 text-sm whitespace-pre-line" style={{ color: '#222222' }}>
                {reservation.guest_message}
              </blockquote>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => openAction('accept')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white transition-colors hover:opacity-90"
                style={{ fontWeight: 600, backgroundColor: '#065F46' }}
              >
                <Check className="w-5 h-5" />
                Accepter la demande
              </button>
              <button
                onClick={() => openAction('decline')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white transition-colors hover:opacity-90"
                style={{ fontWeight: 600, backgroundColor: '#991B1B' }}
              >
                <X className="w-5 h-5" />
                Refuser
              </button>
              <Link
                href={inboxHref}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                <MessageSquare className="w-5 h-5" />
                Poser une question
              </Link>
            </div>
          </div>
        )}

        {reservation.phase === 'declined' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 text-sm" style={{ color: '#374151' }}>
            Vous avez refusé cette demande le {formatDateTime(reservation.declined_at)}
            {reservation.cancellation_reason ? ` (« ${reservation.cancellation_reason} »)` : ''}. Les dates ont été libérées.
          </div>
        )}
        {reservation.phase === 'expired' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 text-sm" style={{ color: '#374151' }}>
            Cette demande a expiré sans réponse dans les 24 heures. Les dates ont été libérées.
          </div>
        )}
        {reservation.phase === 'cancelled' && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 text-sm space-y-1" style={{ color: '#374151' }}>
            <p>
              Réservation annulée le {formatDateTime(reservation.cancelled_at ?? reservation.updated_at)}
              {reservation.cancelled_by === 'guest' ? ' par le voyageur' : reservation.cancelled_by === 'host' ? ' par vous' : ''}
              {reservation.cancellation_reason ? ` (« ${reservation.cancellation_reason} »)` : ''}. Les dates ont été libérées.
            </p>
            {reservation.refund_amount !== null && (
              <p>
                {parseFloat(reservation.refund_amount) > 0
                  ? reservation.payment_status
                    ? `Séjoura a remboursé ${formatMoney(reservation.refund_amount, currency)} au voyageur selon la politique d'annulation ; votre versement a été ajusté.`
                    : `Montant à rembourser au voyageur selon la politique d'annulation : ${formatMoney(reservation.refund_amount, currency)}. Le paiement en ligne n'étant pas encore disponible, ce remboursement se règle directement avec le voyageur.`
                  : "Selon la politique d'annulation, aucun remboursement n'est dû au voyageur."}
              </p>
            )}
          </div>
        )}
        {reservation.phase === 'upcoming' && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => openAction('cancel')}
              className="px-4 py-2 rounded-lg border border-red-200 text-sm text-red-700 bg-white hover:bg-red-50"
              style={{ fontWeight: 600 }}
            >
              Annuler la réservation
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Séjour */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base mb-5" style={{ fontWeight: 600, color: '#222222' }}>Séjour</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{listing?.title}</p>
                    <p className="text-sm" style={{ color: '#717171' }}>
                      {listing?.full_address || [listing?.city, listing?.province].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs" style={{ color: '#717171' }}>Arrivée</p>
                      <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{formatStayDay(reservation.check_in)}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>à partir de {formatHour(listing?.arrival_time, '14:00')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs" style={{ color: '#717171' }}>Départ</p>
                      <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{formatStayDay(reservation.check_out)}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>avant {formatHour(listing?.departure_time, '11:00')}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs" style={{ color: '#717171' }}>Durée</p>
                      <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{nights} nuit{nights > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs" style={{ color: '#717171' }}>Voyageurs</p>
                      <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{formatGuestsDetail(reservation)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Voyageur */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base mb-5" style={{ fontWeight: 600, color: '#222222' }}>Voyageur</h2>
              <div className="flex items-center gap-4 mb-5">
                {guest?.profile_photo_url ? (
                  <img src={guest.profile_photo_url} alt={guestFirstName} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
                    style={{ fontWeight: 600, backgroundColor: '#222222' }}
                  >
                    {guestFirstName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-base" style={{ fontWeight: 600, color: '#222222' }}>{guestFullName}</p>
                  {guest?.member_since && (
                    <p className="text-sm" style={{ color: '#717171' }}>Membre depuis {new Date(guest.member_since).getFullYear()}</p>
                  )}
                </div>
              </div>
              <div className="space-y-3 text-sm" style={{ color: '#222222' }}>
                {guest?.identity_verified && (
                  <p className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-700" />
                    Identité vérifiée
                  </p>
                )}
                {guest?.phone ? (
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {guest.phone}
                  </p>
                ) : (
                  !confirmed &&
                  pending && (
                    <p style={{ color: '#717171' }}>Le nom complet et le téléphone du voyageur s&apos;afficheront une fois la demande acceptée.</p>
                  )
                )}
              </div>
              {!pending && reservation.guest_message && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-xs mb-1" style={{ color: '#717171' }}>Message joint à la demande</p>
                  <p className="text-sm whitespace-pre-line" style={{ color: '#222222' }}>{reservation.guest_message}</p>
                </div>
              )}
              {!pending && (
                <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
                  <Link
                    href={inboxHref}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                    style={{ fontWeight: 600, color: '#222222' }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Écrire à {guestFirstName}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Montants */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base mb-5" style={{ fontWeight: 600, color: '#222222' }}>Montants</h2>
              <div className="space-y-3 text-sm">
                {priceLines
                  .filter(([, value], index) => index === 0 || value > 0)
                  .map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span style={{ color: '#717171' }}>{label}</span>
                      <span style={{ color: '#222222' }}>{formatMoney(value, currency)}</span>
                    </div>
                  ))}
                <div className="flex justify-between gap-4 pt-3 border-t border-gray-200">
                  <span style={{ fontWeight: 600, color: '#222222' }}>Montant hôte</span>
                  <span className="text-base" style={{ fontWeight: 700, color: '#065F46' }}>{formatMoney(hostAmount(reservation), currency)}</span>
                </div>
                <div className="flex justify-between gap-4" style={{ color: '#9CA3AF' }}>
                  <span>Frais de service Séjoura, payés par le voyageur</span>
                  <span>{formatMoney(reservation.service_fee, currency)}</span>
                </div>
              </div>
              <p className="text-xs mt-4 p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB', color: '#6B7280' }}>
                {hostPaymentNote(reservation)}
              </p>
            </div>

            {/* Résumé */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222' }}>Résumé</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <span style={{ color: '#717171' }}>N° de réservation</span>
                  <span className="font-mono" style={{ fontWeight: 500, color: '#222222' }}>{reservation.confirmation_code}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span style={{ color: '#717171' }}>Mode</span>
                  <span style={{ color: '#222222' }}>{reservation.reservation_mode === 'instant' ? 'Instantanée' : 'Sur demande'}</span>
                </div>
                {policy && (
                  <div className="flex justify-between gap-4">
                    <span style={{ color: '#717171' }}>Annulation</span>
                    <span style={{ color: '#222222' }}>{CANCELLATION_POLICY_LABELS[policy]}</span>
                  </div>
                )}
                {reservation.confirmed_at && (
                  <div className="flex justify-between gap-4">
                    <span style={{ color: '#717171' }}>Confirmée le</span>
                    <span style={{ color: '#222222' }}>{formatDateTime(reservation.confirmed_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Accepter / refuser */}
      {action && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !submitting && setAction(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
              {action === 'accept'
                ? `Accepter la demande de ${guestFirstName} ?`
                : action === 'decline'
                  ? `Refuser la demande de ${guestFirstName} ?`
                  : `Annuler la réservation de ${guestFirstName} ?`}
            </h3>
            <p className="text-sm mb-5" style={{ color: '#717171' }}>
              {action === 'accept'
                ? `La réservation sera confirmée et ${guestFirstName} verra l'adresse et les instructions d'arrivée.${
                    reservation.payment_status === 'authorized' ? ` Séjoura encaissera le paiement (${formatMoney(reservation.total_price, currency)}).` : ''
                  }`
                : action === 'decline'
                  ? 'Les dates seront libérées. Le motif choisi sera indiqué au voyageur.'
                  : `Annuler une réservation confirmée met le voyageur en difficulté : ne le faites qu'en dernier recours. ${guestFirstName} recevra un e-mail avec le motif choisi et aura droit au remboursement intégral (${formatMoney(reservation.total_price, currency)}).`}
            </p>

            {action === 'cancel' && (
              <label className="block mb-4">
                <span className="text-xs block mb-1" style={{ color: '#717171', fontWeight: 600 }}>Motif</span>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {HOST_CANCEL_REASONS.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </label>
            )}

            {action === 'decline' && (
              <label className="block mb-4">
                <span className="text-xs block mb-1" style={{ color: '#717171', fontWeight: 600 }}>Motif</span>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {DECLINE_REASONS.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </label>
            )}

            <label className="block mb-5">
              <span className="text-xs block mb-1" style={{ color: '#717171', fontWeight: 600 }}>
                Message à {guestFirstName} (facultatif)
              </span>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value.slice(0, 2000))}
                rows={4}
                placeholder={action === 'accept' ? 'Bienvenue ! Voici quelques informations pour votre arrivée…' : 'Merci pour votre demande…'}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <span className="text-xs" style={{ color: '#9CA3AF' }}>Envoyé dans votre conversation avec le voyageur.</span>
            </label>

            {actionError && <p className="text-sm text-red-600 mb-4">{actionError}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => setAction(null)}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Retour
              </button>
              <button
                onClick={submitAction}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg text-sm text-white transition-colors disabled:opacity-60"
                style={{ fontWeight: 600, backgroundColor: action === 'accept' ? '#065F46' : '#991B1B' }}
              >
                {submitting ? 'Envoi…' : action === 'accept' ? 'Accepter' : action === 'decline' ? 'Refuser' : 'Annuler la réservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
