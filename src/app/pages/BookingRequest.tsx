import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Lock, Star, X } from 'lucide-react';
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from '@stripe/react-stripe-js';
import { getStripe, PAYMENTS_ENABLED } from '../config/payments';
import { reservationsApi, type ListingDetail, type PriceBreakdown, type ReservationData } from '../services/api';
import { BookingGuestsDropdown, formatGuestsLabel, type StayGuests } from '../components/booking/BookingGuestsDropdown';
import { DateRangeCalendar } from '../components/booking/DateRangeCalendar';
import { toYmd, useStayDates } from '../components/booking/useStayDates';
import { formatHour, formatMoney, formatStayRange } from '../components/booking/format';
import { cancellationSummary, stayLimits } from '@/shared/booking';

/** Séjour choisi sur la page de l'annonce, transmis par sessionStorage. */
export interface BookingData {
  listingId: number;
  title: string;
  image: string;
  rating: number | null;
  location: string;
  checkIn: string;
  checkOut: string;
  checkInDisplay: string;
  checkOutDisplay: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  guests: number;
  nights: number;
  pricePerNight: number;
  priceBreakdown: PriceBreakdown | null;
  currency: string;
  hostName: string;
  hostPhoto: string;
  hostSince: string;
  cancellationPolicy: string | null;
  capacity?: number;
}

interface BookingRequestProps {
  bookingData: BookingData;
  onBack: () => void;
  /** Réservation créée : la page affiche alors sa confirmation. */
  onBooked: (reservation: ReservationData) => void;
  /** Session expirée pendant la saisie. */
  onLoginRequired: () => void;
}

const MESSAGE_MAX = 1000;

function parseYmd(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
}

function firstOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function BookingRequest({ bookingData, onBack, onBooked, onLoginRequired }: BookingRequestProps) {
  // ─── Annonce telle qu'enregistrée : ses règles s'appliquent, même si la page venait de la démo ──
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [listingError, setListingError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    reservationsApi
      .getBookableListing(bookingData.listingId)
      .then((res) => {
        if (!cancelled) setListing(res.listing);
      })
      .catch((err: { status?: number }) => {
        if (cancelled) return;
        setListingError(
          err?.status === 404
            ? "Ce logement n'est plus disponible à la réservation."
            : 'Impossible de charger ce logement. Réessayez dans un instant.',
        );
      });
    return () => {
      cancelled = true;
    };
  }, [bookingData.listingId]);

  // ─── Séjour ─────────────────────────────────────────────────────────────────
  const { minStay, maxStay } = stayLimits(listing?.min_stay, listing?.max_stay);
  const stay = useStayDates(bookingData.listingId, minStay, maxStay, {
    arrivalDays: listing?.arrival_days,
    departureDays: listing?.departure_days,
    initialCheckIn: parseYmd(bookingData.checkIn),
    initialCheckOut: parseYmd(bookingData.checkOut),
  });
  const checkIn = stay.checkIn ? toYmd(stay.checkIn) : null;
  const checkOut = stay.checkOut ? toYmd(stay.checkOut) : null;

  const [guests, setGuests] = useState<StayGuests>({
    adults: Math.max(1, bookingData.adults || 1),
    children: bookingData.children || 0,
    babies: bookingData.infants || 0,
    pets: bookingData.pets || 0,
  });
  const capacity = listing?.capacity ?? bookingData.capacity ?? 1;
  const guestsIssue =
    capacity > 0 && guests.adults + guests.children > capacity
      ? `Ce logement accueille au maximum ${capacity} voyageur${capacity > 1 ? 's' : ''} (bébés non compris).`
      : null;

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => firstOfMonth(stay.checkIn ?? new Date()));
  const [showGuests, setShowGuests] = useState(false);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showGuests) return;
    const close = (e: MouseEvent) => {
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) setShowGuests(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [showGuests]);

  useEffect(() => {
    if (!showCalendar) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowCalendar(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showCalendar]);

  // ─── Prix calculé par le serveur ────────────────────────────────────────────
  const [price, setPrice] = useState<PriceBreakdown | null>(bookingData.priceBreakdown);
  const [priceLoading, setPriceLoading] = useState(false);

  useEffect(() => {
    if (!checkIn || !checkOut) {
      setPrice(null);
      return;
    }
    let cancelled = false;
    setPriceLoading(true);
    reservationsApi
      .calculatePrice({
        listing_id: bookingData.listingId,
        check_in: checkIn,
        check_out: checkOut,
        adults: guests.adults,
        children: guests.children,
        pets: guests.pets,
      })
      .then((res) => !cancelled && setPrice(res))
      .catch(() => !cancelled && setPrice(null))
      .finally(() => !cancelled && setPriceLoading(false));
    return () => {
      cancelled = true;
    };
  }, [bookingData.listingId, checkIn, checkOut, guests.adults, guests.children, guests.pets]);

  // ─── Envoi ──────────────────────────────────────────────────────────────────
  const [message, setMessage] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [existingReservationId, setExistingReservationId] = useState<number | null>(null);
  /** Paiement Stripe ouvert : secret de la session ; à la fin, Stripe renvoie sur la page de confirmation. */
  const [checkoutSecret, setCheckoutSecret] = useState<string | null>(null);

  const hostName = listing?.host?.first_name || bookingData.hostName || "l'hôte";
  const hostPhoto = listing?.host_photo_url || listing?.host?.profile_photo_url || bookingData.hostPhoto;
  const hostSince = listing?.host?.member_since || bookingData.hostSince;
  const stayIssue = checkIn && checkOut ? stay.issue : 'Choisissez vos dates d’arrivée et de départ.';
  const canSubmit = !!listing && !stayIssue && !guestsIssue && !!price && !priceLoading && accepted && !submitting && !booked;

  const handleSubmit = async () => {
    if (!canSubmit || !checkIn || !checkOut) return;
    setSubmitting(true);
    setSubmitError(null);
    setExistingReservationId(null);
    try {
      const res = await reservationsApi.create({
        listing_id: bookingData.listingId,
        check_in: checkIn,
        check_out: checkOut,
        adults: guests.adults,
        children: guests.children,
        infants: guests.babies,
        pets: guests.pets,
        guest_message: message.trim() || undefined,
      });
      if (res.checkout?.client_secret) {
        // Les dates sont retenues pendant le paiement ; un nouvel essai remplace celui-ci
        setCheckoutSecret(res.checkout.client_secret);
        return;
      }
      setBooked(true);
      onBooked(res.reservation);
    } catch (err) {
      const error = err as Error & { status?: number; data?: { reservation_id?: number } };
      if (error.status === 401) {
        onLoginRequired();
        return;
      }
      if (error.status === 409) {
        if (error.data?.reservation_id) {
          setExistingReservationId(error.data.reservation_id);
        } else {
          // Dates prises entre-temps : le calendrier les barre et le séjour choisi est signalé
          stay.reloadBooked();
        }
      }
      setSubmitError(error.message || 'La réservation a échoué. Réessayez dans un instant.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Rendu ──────────────────────────────────────────────────────────────────
  const header = (
    <header className="border-b border-gray-100 sticky top-0 bg-white z-40">
      <div className="max-w-[1480px] mx-auto px-6 md:px-10 lg:px-20 py-5 flex items-center justify-center">
        <Link href="/" aria-label="Accueil Séjoura">
          <img src="/sejoura_logo.png" alt="Séjoura" className="w-[150px] h-auto" />
        </Link>
      </div>
    </header>
  );

  if (listingError) {
    return (
      <div className="min-h-screen bg-white">
        {header}
        <div className="max-w-md mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl mb-3" style={{ fontWeight: 600 }}>Réservation impossible</h1>
          <p className="text-gray-600 mb-8">{listingError}</p>
          <button onClick={onBack} className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800" style={{ fontWeight: 600 }}>
            Retour au logement
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white">
        {header}
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const currency = price?.currency || listing.currency || bookingData.currency || 'EUR';
  const cover = listing.photos?.[0]?.url || bookingData.image;
  const location = [listing.city, listing.province].filter(Boolean).join(', ');
  const rating = listing.reviews_summary?.average_rating ?? null;
  const cancellation = checkIn ? cancellationSummary(listing.cancellation_policy, checkIn) : null;

  return (
    <div className="min-h-screen bg-white">
      {header}

      <div className="max-w-[1120px] mx-auto px-6 md:px-10 py-8 md:py-12">
        <div className="flex items-center gap-4 lg:gap-8 mb-8 lg:-ml-20">
          <button onClick={onBack} aria-label="Retour au logement" className="shrink-0 bg-gray-100 hover:bg-gray-200 p-4 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-[26px] md:text-[32px]" style={{ fontWeight: 600 }}>
            Confirmer et réserver
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-16">
          {/* ─── Colonne de gauche ─── */}
          <div className="min-w-0">
            {/* Votre voyage */}
            <section className="py-8 border-b border-gray-200">
              <h2 className="text-[22px] mb-6" style={{ fontWeight: 600 }}>Votre voyage</h2>

              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base" style={{ fontWeight: 600 }}>Dates</h3>
                  <p className="text-base text-gray-700">
                    {checkIn && checkOut ? `${formatStayRange(checkIn, checkOut)} · ${stay.nights} nuit${stay.nights > 1 ? 's' : ''}` : 'Ajoutez vos dates'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCalendarMonth(firstOfMonth(stay.checkIn ?? new Date()));
                    setShowCalendar(true);
                  }}
                  className="text-base underline shrink-0"
                  style={{ fontWeight: 600 }}
                >
                  Modifier
                </button>
              </div>

              <div className="relative" ref={guestsRef}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base" style={{ fontWeight: 600 }}>Voyageurs</h3>
                    <p className="text-base text-gray-700">{formatGuestsLabel(guests)}</p>
                  </div>
                  <button onClick={() => setShowGuests((v) => !v)} className="text-base underline shrink-0" style={{ fontWeight: 600 }}>
                    Modifier
                  </button>
                </div>
                {showGuests && (
                  <BookingGuestsDropdown guests={guests} onChange={setGuests} capacity={capacity} onClose={() => setShowGuests(false)} />
                )}
              </div>

              {(stayIssue || guestsIssue) && (
                <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-900">{stayIssue || guestsIssue}</p>
                </div>
              )}
            </section>

            {/* Message à l'hôte */}
            <section className="py-8 border-b border-gray-200">
              <h2 className="text-[22px] mb-2" style={{ fontWeight: 600 }}>Écrivez à {hostName}</h2>
              <p className="text-sm text-gray-600 mb-5">
                Facultatif : présentez-vous et dites-lui ce qui vous amène, ou posez une question sur le logement.
              </p>
              <div className="flex items-center gap-3 mb-4">
                {hostPhoto ? (
                  <img src={hostPhoto} alt={hostName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-lg" style={{ fontWeight: 600 }}>
                    {hostName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-base" style={{ fontWeight: 600 }}>{hostName}</p>
                  {hostSince && <p className="text-sm text-gray-600">Hôte depuis {new Date(hostSince).getFullYear()}</p>}
                </div>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
                placeholder={`Bonjour ${listing.host?.first_name ?? ''}, nous venons en famille pour…`}
                className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 text-base"
              />
              <p className="text-xs text-gray-500 text-right mt-1">{message.length}/{MESSAGE_MAX}</p>
            </section>

            {/* Paiement */}
            <section className="py-8 border-b border-gray-200">
              <h2 className="text-[22px] mb-2" style={{ fontWeight: 600 }}>Paiement</h2>
              {PAYMENTS_ENABLED ? (
                <p className="text-base text-gray-700">
                  {`Votre carte sera débitée${price ? ` de ${formatMoney(price.total, currency)}` : ''} et votre réservation confirmée immédiatement.`}
                  <span className="flex items-center gap-1.5 text-sm text-gray-500 mt-2">
                    <Lock className="w-3.5 h-3.5" />
                    Paiement sécurisé par Stripe : Séjoura ne voit jamais votre numéro de carte.
                  </span>
                </p>
              ) : (
                <p className="text-base text-gray-700">
                  Aucun paiement n&apos;est demandé maintenant : le paiement en ligne n&apos;est pas encore disponible sur Séjoura.
                  {` ${hostName} vous indiquera dans la messagerie comment régler votre séjour.`}
                </p>
              )}
            </section>

            {/* Conditions d'annulation */}
            {cancellation && (
              <section className="py-8 border-b border-gray-200">
                <h2 className="text-[22px] mb-2" style={{ fontWeight: 600 }}>Conditions d&apos;annulation</h2>
                <p className="text-base mb-3">
                  <span style={{ fontWeight: 600 }}>{cancellation.headline}.</span>{' '}
                  <span className="text-gray-600">Politique {cancellation.label.toLowerCase()} de l&apos;hôte.</span>
                </p>
                <ul className="space-y-1 text-sm text-gray-700 list-disc pl-5">
                  {cancellation.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Règles */}
            <section className="py-8 border-b border-gray-200">
              <h2 className="text-[22px] mb-4" style={{ fontWeight: 600 }}>Règles du logement</h2>
              <ul className="space-y-2 text-base text-gray-700">
                <li>Arrivée à partir de {formatHour(listing.arrival_time, '14:00')}</li>
                <li>Départ avant {formatHour(listing.departure_time, '11:00')}</li>
                {listing.min_age ? <li>Le voyageur qui réserve doit avoir au moins {listing.min_age} ans</li> : null}
              </ul>
            </section>

            {/* Validation */}
            <section className="py-8">
              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-700">
                  J&apos;accepte le règlement du logement, les conditions d&apos;annulation et les{' '}
                  <Link href="/terms" target="_blank" className="underline" style={{ fontWeight: 600 }}>
                    conditions générales de Séjoura
                  </Link>
                  .
                </span>
              </label>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full bg-gray-900 text-white rounded-lg py-4 hover:bg-gray-800 transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontWeight: 600 }}
              >
                {submitting || booked
                  ? PAYMENTS_ENABLED
                    ? 'Préparation du paiement…'
                    : 'Réservation en cours…'
                  : PAYMENTS_ENABLED
                    ? 'Continuer vers le paiement'
                    : 'Réserver'}
              </button>

              {submitError && (
                <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">{submitError}</p>
                  {existingReservationId && (
                    <Link
                      href={`/client-space/reservations/${existingReservationId}`}
                      className="inline-block mt-2 text-sm underline text-red-800"
                      style={{ fontWeight: 600 }}
                    >
                      Voir ma réservation
                    </Link>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* ─── Récapitulatif ─── */}
          <div className="lg:sticky lg:top-28 h-fit order-first lg:order-none">
            <div className="border border-gray-200 rounded-2xl p-6">
              <div className="flex gap-4 pb-6 border-b border-gray-200">
                {cover && <img src={cover} alt={listing.title ?? ''} className="w-24 h-24 rounded-lg object-cover shrink-0" />}
                <div className="min-w-0">
                  <h3 className="text-base mb-1 line-clamp-2" style={{ fontWeight: 600 }}>{listing.title}</h3>
                  {location && <p className="text-sm text-gray-600">{location}</p>}
                  {rating != null && rating > 0 && (
                    <div className="flex items-center gap-1 text-sm mt-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span style={{ fontWeight: 600 }}>{rating.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              <h4 className="text-base mt-6 mb-4" style={{ fontWeight: 600 }}>Détail du prix</h4>
              {price ? (
                <div className={`space-y-3 pb-6 border-b border-gray-200 ${priceLoading ? 'opacity-50' : ''}`}>
                  <div className="flex justify-between gap-4 text-base">
                    <span>{price.nights} nuit{price.nights > 1 ? 's' : ''} x {formatMoney(price.price_per_night, currency)}</span>
                    <span>{formatMoney(price.base_total, currency)}</span>
                  </div>
                  {price.cleaning_fee > 0 && (
                    <div className="flex justify-between gap-4 text-base">
                      <span>Frais de ménage</span>
                      <span>{formatMoney(price.cleaning_fee, currency)}</span>
                    </div>
                  )}
                  {price.extra_guest_fee > 0 && (
                    <div className="flex justify-between gap-4 text-base">
                      <span>Voyageurs supplémentaires</span>
                      <span>{formatMoney(price.extra_guest_fee, currency)}</span>
                    </div>
                  )}
                  {price.pet_fee > 0 && (
                    <div className="flex justify-between gap-4 text-base">
                      <span>Animaux</span>
                      <span>{formatMoney(price.pet_fee, currency)}</span>
                    </div>
                  )}
                  {price.service_fee > 0 && (
                    <div className="flex justify-between gap-4 text-base">
                      <span>Frais de service Séjoura</span>
                      <span>{formatMoney(price.service_fee, currency)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-600 pb-6 border-b border-gray-200">
                  {priceLoading ? 'Calcul du prix…' : 'Choisissez vos dates pour voir le prix.'}
                </p>
              )}

              <div className="flex justify-between gap-4 mt-6">
                <span className="text-base" style={{ fontWeight: 600 }}>Total</span>
                <span className="text-base" style={{ fontWeight: 600 }}>{price ? formatMoney(price.total, currency) : '—'}</span>
              </div>

              {cancellation && <p className="text-sm text-gray-600 mt-4">{cancellation.headline}.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Paiement Stripe intégré : à la fin, Stripe renvoie sur la page de confirmation */}
      {checkoutSecret && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          {/* 1040 px : assez large pour que Stripe passe sur deux colonnes et tienne sans défilement */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Paiement"
            className="bg-white rounded-2xl w-full max-w-[1040px] max-h-[calc(100dvh-2rem)] overflow-auto"
          >
            <div className="flex items-start gap-2 px-4 pt-4">
              {/* Site de démonstration : Stripe reste en mode test, seule la carte de test passe */}
              <div className="flex-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span style={{ fontWeight: 600 }}>Site de démonstration : aucun vrai paiement.</span>
                <span>
                  Carte de test{' '}
                  <span className="font-mono text-base tracking-wider select-all" style={{ fontWeight: 600 }}>
                    4242 4242 4242 4242
                  </span>
                </span>
                <span>· date future (ex. 12/34) · CVC au choix (ex. 123)</span>
              </div>
              <button onClick={() => setCheckoutSecret(null)} aria-label="Fermer le paiement" className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-2 pb-2">
              <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret: checkoutSecret }}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            </div>
          </div>
        </div>
      )}

      {/* Calendrier */}
      {showCalendar && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onMouseDown={() => setShowCalendar(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-[720px] max-h-[90vh] overflow-auto" onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-[22px]" style={{ fontWeight: 600 }}>
                  {checkIn && checkOut ? `${stay.nights} nuit${stay.nights > 1 ? 's' : ''}` : stay.selectingCheckOut ? 'Choisissez le départ' : "Choisissez l'arrivée"}
                </h2>
                <p className="text-sm text-gray-600">
                  {minStay > 1 ? `Séjour de ${minStay} nuits minimum` : 'Séjour d’une nuit minimum'}
                  {maxStay ? `, ${maxStay} nuits maximum` : ''}
                </p>
              </div>
              <button onClick={() => setShowCalendar(false)} aria-label="Fermer" className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center">
              <DateRangeCalendar
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                checkIn={stay.checkIn}
                checkOut={stay.checkOut}
                selectingCheckOut={stay.selectingCheckOut}
                isSelectable={stay.isSelectable}
                onSelect={stay.select}
              />
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button onClick={stay.clear} className="text-sm underline" style={{ fontWeight: 600 }}>
                Effacer les dates
              </button>
              <button
                onClick={() => setShowCalendar(false)}
                disabled={!stay.checkIn || !stay.checkOut}
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-40"
                style={{ fontWeight: 600 }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10 lg:px-20 py-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700">
            <Link href="/privacy" className="hover:underline">Confidentialité</Link>
            <span>·</span>
            <Link href="/terms" className="hover:underline">Conditions générales</Link>
            <span>·</span>
            <Link href="/how-it-works" className="hover:underline">Fonctionnement du site</Link>
            <span>·</span>
            <Link href="/company-info" className="hover:underline">Infos sur l&apos;entreprise</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
