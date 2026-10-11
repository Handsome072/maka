'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Check, CheckCircle2, Clock, Info } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { reservationsApi, type ReservationData } from '@/app/services/api';
import { ReservationStatusBadge } from '@/app/components/booking/ReservationStatusBadge';
import { formatDateTime, formatGuestsDetail, formatHour, formatMoney, formatStayDay } from '@/app/components/booking/format';
import { cancellationSummary } from '@/shared/booking';

type Step = { title: string; text: string; done?: boolean };

function nextSteps(reservation: ReservationData, hostName: string): Step[] {
  const arrival = formatHour(reservation.listing?.arrival_time, '14:00');
  if (reservation.phase === 'pending') {
    return [
      { title: 'Demande envoyée', text: `Le ${formatDateTime(reservation.created_at)}.`, done: true },
      {
        title: `Réponse de ${hostName}`,
        text: `Au plus tard le ${formatDateTime(reservation.expires_at)}. Vous pouvez lui écrire en attendant.`,
      },
      {
        title: 'Réservation confirmée',
        text: 'Dès que la demande est acceptée, votre réservation apparaît comme confirmée dans « Mes réservations ».',
      },
      {
        title: 'Avant votre arrivée',
        text: "L'adresse exacte et les instructions d'arrivée seront visibles dans votre réservation.",
      },
    ];
  }
  return [
    { title: 'Réservation confirmée', text: `Le ${formatDateTime(reservation.confirmed_at ?? reservation.created_at)}.`, done: true },
    { title: `Échangez avec ${hostName}`, text: 'Posez vos questions et convenez du règlement dans la messagerie.' },
    {
      title: 'Le jour de votre arrivée',
      text: `Arrivée le ${formatStayDay(reservation.check_in)} à partir de ${arrival}. L'adresse et les instructions sont dans votre réservation.`,
    },
  ];
}

export function BookingConfirmationClient() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const { isAuthenticated, isLoading } = useAuth();
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=/booking/confirmation/${params.id}`);
    }
  }, [isLoading, isAuthenticated, router, params.id]);

  // Paiement en cours ou retour de Stripe (?session_id=…) : le serveur vérifie la session et termine la réservation
  const [paymentState, setPaymentState] = useState<'ok' | 'open' | 'expired'>('ok');

  useEffect(() => {
    if (!isAuthenticated || !Number.isInteger(id)) return;
    let cancelled = false;
    const load = async () => {
      const returningFromPayment = new URLSearchParams(window.location.search).has('session_id');
      if (returningFromPayment) {
        sessionStorage.removeItem('bookingData');
      }
      let current = (await reservationsApi.getOne(id)).reservation;
      if (returningFromPayment || current.status === 'awaiting_payment') {
        const synced = await reservationsApi.syncPayment(id);
        if (!synced.reservation) {
          if (!cancelled) setPaymentState('expired');
          return;
        }
        current = synced.reservation;
        if (!cancelled) setPaymentState(current.status === 'awaiting_payment' ? 'open' : 'ok');
      }
      if (!cancelled) setReservation(current);
    };
    load().catch((err: { status?: number }) => {
      if (cancelled) return;
      setError(err?.status === 404 || err?.status === 403 ? 'Réservation introuvable.' : 'Impossible de charger la réservation.');
    });
    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated]);

  const header = (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10 lg:px-20 py-5 flex items-center justify-center">
        <Link href="/" aria-label="Accueil Séjoura">
          <img src="/sejoura_logo.png" alt="Séjoura" className="w-[150px] h-auto" />
        </Link>
      </div>
    </header>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        {header}
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <p className="text-gray-700 mb-8">{error}</p>
          <Link href="/client-space/reservations" className="px-6 py-3 bg-gray-900 text-white rounded-lg" style={{ fontWeight: 600 }}>
            Mes réservations
          </Link>
        </div>
      </div>
    );
  }

  // Paiement non abouti (formulaire fermé, carte refusée, délai dépassé)
  if (paymentState !== 'ok') {
    return (
      <div className="min-h-screen bg-white">
        {header}
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl mb-3" style={{ fontWeight: 600 }}>Paiement non finalisé</h1>
          <p className="text-gray-600 mb-8">
            {paymentState === 'expired'
              ? "Le délai de paiement est dépassé : rien n'a été débité et les dates ont été libérées."
              : "Votre paiement n'a pas abouti et rien n'a été débité. Les dates restent retenues quelques minutes : vous pouvez réessayer."}
          </p>
          <Link
            href={reservation?.listing ? `/property/${reservation.listing.id}` : '/'}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg"
            style={{ fontWeight: 600 }}
          >
            {reservation?.listing ? 'Revenir au logement' : "Retour à l'accueil"}
          </Link>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-white">
        {header}
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const hostName = reservation.host?.first_name || "l'hôte";
  const listing = reservation.listing;
  const pending = reservation.phase === 'pending';
  const confirmed = reservation.phase === 'upcoming' || reservation.phase === 'ongoing';
  const closed = !pending && !confirmed;
  const cancellation = cancellationSummary(reservation.cancellation_policy, reservation.check_in, new Date(reservation.created_at));
  const steps = closed ? [] : nextSteps(reservation, hostName);

  return (
    <div className="min-h-screen bg-white">
      {header}

      <main className="max-w-[720px] mx-auto px-6 py-10 md:py-14">
        {/* En-tête */}
        <div className="text-center mb-10">
          <div
            className={`w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center ${
              confirmed ? 'bg-green-100 text-green-700' : pending ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {confirmed ? <CheckCircle2 className="w-8 h-8" /> : pending ? <Clock className="w-8 h-8" /> : <Info className="w-8 h-8" />}
          </div>
          <h1 className="text-[28px] md:text-[32px] mb-3" style={{ fontWeight: 600 }}>
            {confirmed ? 'Réservation confirmée !' : pending ? 'Demande envoyée !' : 'Votre réservation'}
          </h1>
          <p className="text-base text-gray-600 max-w-[520px] mx-auto">
            {confirmed &&
              `${reservation.payment_status === 'paid' ? `Votre paiement de ${formatMoney(reservation.amount_paid, reservation.currency)} est confirmé. ` : ''}Votre séjour${listing?.city ? ` à ${listing.city}` : ''} est réservé. L'adresse exacte et les instructions d'arrivée sont dans votre réservation.`}
            {pending &&
              `${hostName} a jusqu'au ${formatDateTime(reservation.expires_at)} pour répondre. ${
                reservation.payment_status === 'authorized'
                  ? `Votre carte est autorisée pour ${formatMoney(reservation.total_price, reservation.currency)} : elle ne sera débitée que si la demande est acceptée.`
                  : 'Aucun montant ne vous a été débité.'
              }`}
            {closed && <ReservationStatusBadge phase={reservation.phase} />}
          </p>
        </div>

        {/* Récapitulatif */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-8">
          <div className="flex gap-4 p-5 border-b border-gray-200">
            {listing?.cover_photo_url && (
              <img src={listing.cover_photo_url} alt={listing.title} className="w-24 h-24 rounded-lg object-cover shrink-0" />
            )}
            <div className="min-w-0">
              <h2 className="text-lg mb-1 line-clamp-2" style={{ fontWeight: 600 }}>{listing?.title}</h2>
              <p className="text-sm text-gray-600">{[listing?.city, listing?.province].filter(Boolean).join(', ')}</p>
              <p className="text-sm text-gray-600 mt-2">
                N° de réservation <span className="font-mono text-gray-900" style={{ fontWeight: 600 }}>{reservation.confirmation_code}</span>
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 p-5 text-sm">
            <div>
              <dt className="text-gray-600">Arrivée</dt>
              <dd style={{ fontWeight: 600 }}>{formatStayDay(reservation.check_in)}</dd>
              <dd className="text-gray-600">à partir de {formatHour(listing?.arrival_time, '14:00')}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Départ</dt>
              <dd style={{ fontWeight: 600 }}>{formatStayDay(reservation.check_out)}</dd>
              <dd className="text-gray-600">avant {formatHour(listing?.departure_time, '11:00')}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Voyageurs</dt>
              <dd style={{ fontWeight: 600 }}>{formatGuestsDetail(reservation)}</dd>
            </div>
            <div>
              <dt className="text-gray-600">Total ({reservation.nights_count} nuit{reservation.nights_count > 1 ? 's' : ''})</dt>
              <dd style={{ fontWeight: 600 }}>{formatMoney(reservation.total_price, reservation.currency)}</dd>
            </div>
          </dl>
          {!closed && (
            <p className="px-5 pb-5 text-sm text-gray-600">
              {cancellation.headline}. Politique {cancellation.label.toLowerCase()}.
            </p>
          )}
        </div>

        {/* Prochaines étapes */}
        {steps.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[22px] mb-5" style={{ fontWeight: 600 }}>Et maintenant ?</h2>
            <ol className="relative">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4 pb-6 last:pb-0 relative">
                  {index < steps.length - 1 && <span className="absolute left-[15px] top-8 bottom-0 w-px bg-gray-200" />}
                  <span
                    className={`relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      step.done ? 'bg-gray-900 text-white' : 'bg-white border-2 border-gray-300 text-gray-500'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {step.done ? <Check className="w-4 h-4" /> : index + 1}
                  </span>
                  <div className="pt-1">
                    <p className="text-base" style={{ fontWeight: 600 }}>{step.title}</p>
                    <p className="text-sm text-gray-600">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/client-space/reservations/${reservation.id}`}
            className="flex-1 text-center px-6 py-3.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            style={{ fontWeight: 600 }}
          >
            Voir ma réservation
          </Link>
          {reservation.conversation_id && (
            <Link
              href={`/client-space/messages?conversation=${reservation.conversation_id}`}
              className="flex-1 text-center px-6 py-3.5 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Écrire à {hostName}
            </Link>
          )}
        </div>
        <p className="text-center mt-6">
          <Link href="/" className="text-sm underline text-gray-700">
            Retour à l&apos;accueil
          </Link>
        </p>
      </main>
    </div>
  );
}
