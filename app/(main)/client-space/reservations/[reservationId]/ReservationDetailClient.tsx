'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, KeyRound, MapPin, MessageSquare, Users } from 'lucide-react';
import { reservationsApi, type CancellationCheck, type ReservationData } from '@/app/services/api';
import { ReservationStatusBadge } from '@/app/components/booking/ReservationStatusBadge';
import {
  formatDateTime,
  formatGuestsDetail,
  formatHour,
  formatMoney,
  formatStayDay,
} from '@/app/components/booking/format';
import { cancellationSummary } from '@/shared/booking';

function amount(value: string | null | undefined): number {
  const parsed = parseFloat(value ?? '');
  return Number.isFinite(parsed) ? parsed : 0;
}

function daysUntil(date: string): number {
  const today = new Date();
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((Date.parse(`${date.slice(0, 10)}T00:00:00Z`) - start) / 86_400_000);
}

/** État du paiement en ligne, en une phrase. */
function paymentLabel(reservation: ReservationData): string {
  const money = (value: string | null) => formatMoney(value, reservation.currency);
  switch (reservation.payment_status) {
    case 'awaiting':
      return 'Paiement non finalisé.';
    case 'authorized':
      return `Carte autorisée pour ${money(reservation.total_price)} : débitée seulement si l’hôte accepte la demande.`;
    case 'paid':
      return `Payé ${money(reservation.amount_paid)}${reservation.paid_at ? ` le ${formatDateTime(reservation.paid_at)}` : ''}.`;
    case 'released':
      return 'Autorisation annulée : rien ne vous a été débité.';
    case 'partially_refunded':
      return `Payé ${money(reservation.amount_paid)}, dont ${money(reservation.amount_refunded)} remboursés sur votre moyen de paiement.`;
    case 'refunded':
      return `Payé ${money(reservation.amount_paid)}, intégralement remboursé sur votre moyen de paiement.`;
    default:
      return '';
  }
}

/** Bandeau d'état en haut de la réservation, selon la phase du séjour. */
function StatusBanner({ reservation, hostName }: { reservation: ReservationData; hostName: string }) {
  const tone: Record<string, string> = {
    pending: 'bg-amber-50 border-amber-200',
    upcoming: 'bg-green-50 border-green-200',
    ongoing: 'bg-cyan-50 border-cyan-200',
    past: 'bg-gray-50 border-gray-200',
    cancelled: 'bg-red-50 border-red-200',
    declined: 'bg-red-50 border-red-200',
    expired: 'bg-gray-50 border-gray-200',
  };
  const days = daysUntil(reservation.check_in);
  let title = '';
  let text = '';
  switch (reservation.phase) {
    case 'pending':
      title = `En attente de la réponse de ${hostName}`;
      text = `Réponse au plus tard le ${formatDateTime(reservation.expires_at)}. Vos dates sont bloquées en attendant${
        reservation.payment_status === 'authorized'
          ? ' ; votre carte est autorisée mais ne sera débitée que si la demande est acceptée.'
          : ' et aucun montant ne vous a été débité.'
      }`;
      break;
    case 'upcoming':
      title = 'Réservation confirmée';
      text = days > 1 ? `Arrivée dans ${days} jours.` : days === 1 ? 'Arrivée demain.' : "Arrivée aujourd'hui.";
      break;
    case 'ongoing':
      title = 'Bon séjour !';
      text = `Départ le ${formatStayDay(reservation.check_out)} avant ${formatHour(reservation.listing?.departure_time, '11:00')}.`;
      break;
    case 'past':
      title = 'Séjour terminé';
      text = 'Merci d’avoir voyagé avec Séjoura.';
      break;
    case 'declined':
      title = `${hostName} n'a pas pu accepter votre demande`;
      text = `${reservation.cancellation_reason ? `« ${reservation.cancellation_reason} » ` : ''}Aucun montant ne vous a été débité.`;
      break;
    case 'expired':
      title = 'Demande expirée';
      text = `${hostName} n'a pas répondu dans les 24 heures. Vos dates ont été libérées et aucun montant ne vous a été débité.`;
      break;
    case 'cancelled': {
      title = reservation.cancelled_by === 'host' ? `${hostName} a annulé la réservation` : 'Réservation annulée';
      const refund = reservation.refund_amount !== null ? parseFloat(reservation.refund_amount) : null;
      text = `Annulée le ${formatDateTime(reservation.cancelled_at ?? reservation.updated_at)}${
        reservation.cancelled_by === 'guest' ? ' à votre demande' : ''
      }.${
        refund === null
          ? ' Rien ne vous a été débité.'
          : refund > 0
            ? reservation.payment_status
              ? ` ${formatMoney(refund, reservation.currency)} vous ${reservation.cancelled_by === 'guest' ? 'sont remboursés selon la politique d’annulation' : 'sont remboursés intégralement'}, sur votre moyen de paiement (5 à 10 jours ouvrés).`
              : ` Montant remboursable selon la politique d'annulation : ${formatMoney(refund, reservation.currency)}. Le paiement en ligne n'étant pas encore disponible, ce remboursement se règle directement avec l'hôte.`
            : " Selon la politique d'annulation, aucun montant n'est remboursable."
      }`;
      break;
    }
  }

  return (
    <div className={`p-5 rounded-xl border ${tone[reservation.phase]}`}>
      <p className="text-base mb-1" style={{ fontWeight: 600 }}>{title}</p>
      <p className="text-sm text-gray-700">{text}</p>
      {(reservation.phase === 'declined' || reservation.phase === 'expired') && (
        <Link href="/" className="inline-block mt-3 text-sm underline" style={{ fontWeight: 600 }}>
          Chercher un autre logement
        </Link>
      )}
    </div>
  );
}

export function ReservationDetailClient() {
  const params = useParams();
  const reservationId = Number(params.reservationId);
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [preview, setPreview] = useState<CancellationCheck | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    reservationsApi
      .getOne(reservationId)
      .then((res) => !cancelled && setReservation(res.reservation))
      .catch((err: { status?: number }) => {
        if (cancelled) return;
        setError(err?.status === 404 || err?.status === 403 ? 'Réservation introuvable.' : 'Impossible de charger la réservation.');
      });
    return () => {
      cancelled = true;
    };
  }, [reservationId]);

  /** Ouvre la fenêtre d'annulation avec le remboursement calculé par le serveur. */
  const openCancel = async () => {
    setCancelOpen(true);
    setPreview(null);
    setCancelReason('');
    setCancelError(null);
    try {
      setPreview(await reservationsApi.cancelPreview(reservationId));
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Impossible de vérifier l'annulation.");
    }
  };

  const submitCancel = async () => {
    setCancelling(true);
    setCancelError(null);
    try {
      const res = await reservationsApi.cancel(reservationId, cancelReason.trim() || undefined);
      setReservation(res.reservation);
      setCancelOpen(false);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "L'annulation a échoué.");
    } finally {
      setCancelling(false);
    }
  };

  const backLink = (
    <Link href="/client-space/reservations" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
      <ArrowLeft className="w-5 h-5" />
      Mes réservations
    </Link>
  );

  if (error) {
    return (
      <div>
        {backLink}
        <p className="text-gray-700">{error}</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  const listing = reservation.listing;
  const host = reservation.host;
  const hostName = host?.first_name || "l'hôte";
  const currency = reservation.currency;
  const nights = reservation.nights_count;
  const base = amount(reservation.price_per_night) * nights;
  const active = ['pending', 'upcoming', 'ongoing'].includes(reservation.phase);
  const cancellation = cancellationSummary(reservation.cancellation_policy, reservation.check_in, new Date(reservation.created_at));
  const priceLines: [string, number][] = [
    [`${formatMoney(reservation.price_per_night, currency)} x ${nights} nuit${nights > 1 ? 's' : ''}`, base],
    ['Frais de ménage', amount(reservation.cleaning_fee)],
    ['Voyageurs supplémentaires', amount(reservation.extra_guest_fee)],
    ['Animaux', amount(reservation.pet_fee)],
    ['Frais de service Séjoura', amount(reservation.service_fee)],
  ];

  return (
    <div>
      {backLink}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-4">
            {listing?.cover_photo_url && (
              <img src={listing.cover_photo_url} alt={listing.title} className="w-40 h-28 object-cover rounded-xl shrink-0" />
            )}
            <div className="min-w-0">
              <h1 className="text-xl font-semibold mb-1">{listing?.title}</h1>
              <p className="text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4 shrink-0" />
                {[listing?.city, listing?.province].filter(Boolean).join(', ')}
              </p>
              <ReservationStatusBadge phase={reservation.phase} className="mt-2" />
            </div>
          </div>

          <StatusBanner reservation={reservation} hostName={hostName} />

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">N° de réservation</p>
            <p className="text-lg font-mono font-semibold">{reservation.confirmation_code}</p>
          </div>

          {/* Voyage */}
          <div className="border rounded-xl p-6 space-y-5">
            <h2 className="font-semibold">Détails du voyage</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Arrivée
                </p>
                <p className="font-medium">{formatStayDay(reservation.check_in)}</p>
                <p className="text-sm text-gray-500">à partir de {formatHour(listing?.arrival_time, '14:00')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Départ
                </p>
                <p className="font-medium">{formatStayDay(reservation.check_out)}</p>
                <p className="text-sm text-gray-500">avant {formatHour(listing?.departure_time, '11:00')}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="w-4 h-4" />
                Voyageurs
              </p>
              <p className="font-medium">{formatGuestsDetail(reservation)}</p>
            </div>
            {active && (
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Adresse
                </p>
                {listing?.full_address ? (
                  <p className="font-medium">{listing.full_address}</p>
                ) : (
                  <p className="text-sm text-gray-600">L&apos;adresse exacte s&apos;affichera ici dès que la réservation sera confirmée.</p>
                )}
              </div>
            )}
            {active && (listing?.checkin_method || listing?.checkin_instructions) && (
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <KeyRound className="w-4 h-4" />
                  Instructions d&apos;arrivée
                </p>
                {listing.checkin_method && <p className="font-medium">{listing.checkin_method}</p>}
                {listing.checkin_instructions && (
                  <p className="text-sm text-gray-700 whitespace-pre-line mt-1">{listing.checkin_instructions}</p>
                )}
              </div>
            )}
          </div>

          {reservation.guest_message && (
            <div className="border rounded-xl p-6">
              <h2 className="font-semibold mb-2">Votre message à {hostName}</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">{reservation.guest_message}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {reservation.conversation_id && (
              <Link
                href={`/client-space/messages?conversation=${reservation.conversation_id}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 border rounded-lg hover:bg-gray-50"
              >
                <MessageSquare className="w-5 h-5" />
                Écrire à {hostName}
              </Link>
            )}
            {(reservation.phase === 'pending' || reservation.phase === 'upcoming') && (
              <button
                onClick={openCancel}
                className="flex-1 py-3 border border-red-200 text-red-700 rounded-lg hover:bg-red-50"
              >
                {reservation.phase === 'pending' ? 'Retirer ma demande' : 'Annuler la réservation'}
              </button>
            )}
          </div>
        </div>

        {/* Hôte, prix, annulation */}
        <div className="space-y-6">
          {host && (
            <div className="border rounded-xl p-6">
              <h3 className="font-semibold mb-4">Votre hôte</h3>
              <div className="flex items-center gap-3">
                {host.profile_photo_url ? (
                  <img src={host.profile_photo_url} alt={host.first_name} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl font-semibold">
                    {host.first_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium">{host.first_name}</p>
                  {host.member_since && (
                    <p className="text-sm text-gray-600">Hôte depuis {new Date(host.member_since).getFullYear()}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Détail du prix</h3>
            <div className="space-y-2">
              {priceLines
                .filter(([, value], index) => index === 0 || value > 0)
                .map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span>{label}</span>
                    <span>{formatMoney(value, currency)}</span>
                  </div>
                ))}
              <div className="flex justify-between gap-4 font-semibold pt-3 border-t">
                <span>Total</span>
                <span>{formatMoney(reservation.total_price, currency)}</span>
              </div>
            </div>
          </div>

          {reservation.payment_status && (
            <div className="border rounded-xl p-6">
              <h3 className="font-semibold mb-2">Paiement</h3>
              <p className="text-sm text-gray-700">{paymentLabel(reservation)}</p>
            </div>
          )}

          {active && (
            <div className="border rounded-xl p-6">
              <h3 className="font-semibold mb-1">Conditions d&apos;annulation</h3>
              <p className="text-sm text-gray-600 mb-3">Politique {cancellation.label.toLowerCase()}</p>
              <ul className="space-y-1 text-sm text-gray-700 list-disc pl-5">
                {cancellation.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Retrait de la demande ou annulation */}
      {cancelOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => !cancelling && setCancelOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {!preview && !cancelError && (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
              </div>
            )}

            {preview && !preview.allowed && (
              <>
                <h2 className="text-lg font-semibold mb-2">Annulation impossible</h2>
                <p className="text-sm text-gray-700 mb-6">{preview.message}</p>
              </>
            )}

            {preview?.allowed && preview.kind === 'withdraw' && (
              <>
                <h2 className="text-lg font-semibold mb-2">Retirer votre demande ?</h2>
                <p className="text-sm text-gray-700 mb-5">
                  {hostName} ne pourra plus l&apos;accepter et les dates seront libérées.{' '}
                  {reservation.payment_status === 'authorized'
                    ? 'L’autorisation sur votre carte sera annulée : rien ne vous sera débité.'
                    : 'Rien ne vous a été débité.'}
                </p>
              </>
            )}

            {preview?.allowed && preview.kind === 'cancel' && (
              <>
                <h2 className="text-lg font-semibold mb-2">Annuler votre réservation ?</h2>
                <p className="text-sm text-gray-700 mb-4">{preview.refund.explanation}</p>
                <div className="rounded-xl bg-gray-50 p-4 space-y-2 text-sm mb-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Total de la réservation</span>
                    <span>{formatMoney(reservation.total_price, currency)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-600">Non remboursable</span>
                    <span>{formatMoney(preview.refund.retained, currency)}</span>
                  </div>
                  <div className="flex justify-between gap-4 pt-2 border-t font-semibold">
                    <span>Montant remboursable</span>
                    <span>{formatMoney(preview.refund.refund, currency)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  {reservation.payment_status
                    ? 'Le remboursement est fait sur votre moyen de paiement : comptez 5 à 10 jours ouvrés.'
                    : `Le paiement en ligne n’étant pas encore disponible, ce remboursement se règle directement avec ${hostName}.`}
                </p>
              </>
            )}

            {preview?.allowed && (
              <label className="block mb-5">
                <span className="text-xs text-gray-600 block mb-1" style={{ fontWeight: 600 }}>
                  Motif (facultatif, transmis à {hostName})
                </span>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value.slice(0, 1000))}
                  rows={3}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </label>
            )}

            {cancelError && <p className="text-sm text-red-600 mb-4">{cancelError}</p>}

            <div className="flex justify-end gap-3">
              <button onClick={() => setCancelOpen(false)} disabled={cancelling} className="px-5 py-2.5 rounded-lg border hover:bg-gray-50">
                {preview?.allowed ? 'Garder ma réservation' : 'Fermer'}
              </button>
              {preview?.allowed && (
                <button
                  onClick={submitCancel}
                  disabled={cancelling}
                  className="px-5 py-2.5 rounded-lg bg-red-700 text-white hover:bg-red-800 disabled:opacity-60"
                >
                  {cancelling ? 'Envoi…' : preview.kind === 'withdraw' ? 'Retirer la demande' : 'Annuler la réservation'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
