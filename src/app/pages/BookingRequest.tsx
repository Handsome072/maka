import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Star, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { reservationsApi, PriceBreakdown } from '../services/api';
import { getSavedPaymentMethods, SavedPaymentMethod } from '../components/client-space/ClientPayments';
import { GuestsPicker } from '../components/GuestsPicker';

interface BookingRequestProps {
  onBack: () => void;
  bookingData?: {
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
  };
}

// ─── Calendar helpers ─────────────────────────────────────────────────────────
const MONTH_NAMES_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const MONTH_SHORT_FR = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const DAY_NAMES_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function getDaysInMonth(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7;
  const days: (Date | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
  return days;
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isInDateRange(day: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  return day.getTime() > start.getTime() && day.getTime() < end.getTime();
}

function nightsBetween(start: Date, end: Date): number {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

function formatDateApi(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateShort(date: Date): string {
  return `${date.getDate()} ${MONTH_SHORT_FR[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateInput(date: Date | null): string {
  if (!date) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function parseApiDate(str: string): Date | null {
  if (!str) return null;
  const parts = str.split('-');
  if (parts.length !== 3) return null;
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

export function BookingRequest({ onBack, bookingData }: BookingRequestProps) {
  const [paymentTiming, setPaymentTiming] = useState<'now' | 'later'>('now');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'googlepay'>('card');
  const [message, setMessage] = useState('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedSavedIndex, setSelectedSavedIndex] = useState<number | null>(null);
  const [acceptedConditions, setAcceptedConditions] = useState(false);

  // ─── Editable dates & guests state ──────────────────────────────────────────
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0, babies: 0, pets: 0 });
  const [localPriceBreakdown, setLocalPriceBreakdown] = useState<PriceBreakdown | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const calendarRef = useRef<HTMLDivElement>(null);
  const guestsPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const methods = getSavedPaymentMethods();
    setSavedPaymentMethods(methods);
    if (methods.length > 0) {
      setSelectedSavedIndex(0);
      setPaymentMethod('card');
    }
  }, []);

  // Initialize dates & guests from bookingData
  useEffect(() => {
    if (bookingData) {
      const ci = parseApiDate(bookingData.checkIn);
      const co = parseApiDate(bookingData.checkOut);
      if (ci) setCheckInDate(ci);
      if (co) setCheckOutDate(co);
      if (ci) setCalendarMonth(new Date(ci.getFullYear(), ci.getMonth(), 1));
      setGuests({
        adults: bookingData.adults,
        children: bookingData.children,
        babies: bookingData.infants,
        pets: bookingData.pets,
      });
      if (bookingData.priceBreakdown) {
        setLocalPriceBreakdown(bookingData.priceBreakdown);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Recalculate price when dates or guests change
  useEffect(() => {
    if (!checkInDate || !checkOutDate || !bookingData?.listingId) {
      setLocalPriceBreakdown(null);
      return;
    }
    setPriceLoading(true);
    reservationsApi.calculatePrice({
      listing_id: bookingData.listingId,
      check_in: formatDateApi(checkInDate),
      check_out: formatDateApi(checkOutDate),
      adults: guests.adults,
      children: guests.children,
      pets: guests.pets,
    })
      .then(setLocalPriceBreakdown)
      .catch(() => setLocalPriceBreakdown(null))
      .finally(() => setPriceLoading(false));
  }, [checkInDate, checkOutDate, guests.adults, guests.children, guests.pets, bookingData?.listingId]);

  // Close calendar on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showCalendar]);

  // Close guests picker on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (guestsPickerRef.current && !guestsPickerRef.current.contains(e.target as Node)) {
        setShowGuestsPicker(false);
      }
    }
    if (showGuestsPicker) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showGuestsPicker]);

  const handleDateClick = useCallback((day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (day < today) return;
    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(day);
      setCheckOutDate(null);
    } else if (checkInDate && !checkOutDate) {
      if (day <= checkInDate) {
        setCheckInDate(day);
        setCheckOutDate(null);
      } else {
        setCheckOutDate(day);
      }
    }
  }, [checkInDate, checkOutDate]);

  const renderMonth = useCallback((year: number, month: number) => {
    const days = getDaysInMonth(year, month);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      <div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAY_NAMES_FR.map((day, i) => (
            <div key={i} className="text-center text-xs text-gray-600 py-2" style={{ fontWeight: 600 }}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0">
          {days.map((day, i) => {
            if (!day) return <div key={i} className="aspect-square" />;
            const isPast = day < today;
            const isStart = isSameDay(day, checkInDate);
            const isEnd = isSameDay(day, checkOutDate);
            const inRange = isInDateRange(day, checkInDate, checkOutDate);
            const isSelected = isStart || isEnd;
            return (
              <div key={i} className="aspect-square flex items-center justify-center relative" style={{ backgroundColor: inRange ? '#f0f0f0' : 'transparent' }}>
                <button
                  onClick={() => !isPast && handleDateClick(day)}
                  disabled={isPast}
                  className={`w-10 h-10 flex items-center justify-center text-sm rounded-full transition-colors ${isSelected ? 'bg-gray-900 text-white' : isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}
                  style={{ fontWeight: isSelected ? 600 : 400 }}
                >
                  {day.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [checkInDate, checkOutDate, handleDateClick]);

  const nights = checkInDate && checkOutDate ? nightsBetween(checkInDate, checkOutDate) : 0;
  const totalVoyageurs = guests.adults + guests.children;

  const data = bookingData || {
    listingId: 0,
    title: "Logement",
    image: "",
    rating: 0,
    location: "",
    checkIn: "",
    checkOut: "",
    checkInDisplay: "",
    checkOutDisplay: "",
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
    guests: 1,
    nights: 0,
    pricePerNight: 0,
    priceBreakdown: null,
    currency: 'CAD',
    hostName: '',
    hostPhoto: '',
    hostSince: '',
    cancellationPolicy: null,
  };

  const pb = localPriceBreakdown;
  const pricePerNight = pb?.price_per_night ?? data.pricePerNight;
  const subtotal = pb ? pb.base_total : nights * pricePerNight;
  const cleaningFee = pb?.cleaning_fee ?? 0;
  const extraGuestFee = pb?.extra_guest_fee ?? 0;
  const petFee = pb?.pet_fee ?? 0;
  const serviceFee = pb?.service_fee ?? 0;
  const total = pb ? pb.total : subtotal + cleaningFee + extraGuestFee + petFee + serviceFee;
  const capacity = data.capacity ?? 10;

  const handleSubmitReservation = async () => {
    if (!data.listingId || !checkInDate || !checkOutDate) return;
    setIsSubmitting(true);
    setReservationError(null);
    try {
      await reservationsApi.create({
        listing_id: data.listingId,
        check_in: formatDateApi(checkInDate),
        check_out: formatDateApi(checkOutDate),
        adults: guests.adults,
        children: guests.children,
        infants: guests.babies,
        pets: guests.pets,
        guest_message: message || undefined,
      });
      setReservationSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors de la réservation';
      setReservationError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepCompleted = (step: number) => completedSteps.includes(step);
  const isStepEditable = (step: number) => {
    if (step === 1) return true;
    return isStepCompleted(step - 1);
  };
  const isStepEditing = (step: number) => editingStep === step || (!isStepCompleted(step) && isStepEditable(step));

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    setEditingStep(null);
  };

  const editStep = (step: number) => {
    setEditingStep(step);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-50">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10 lg:px-20 py-5">
          <div className="flex items-center justify-center">
            <img
              src="/logo.png"
              alt="HOMIQIO Logo"
              className="w-[150px] h-auto"
            />
          </div>
        </div>
      </header>

      <div className="max-w-[1120px] mx-auto px-6 md:px-10 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-16">
          {/* Left Column - Form */}
          <div>
            <div className="flex items-center gap-8 -ml-20">
            {/* Back Button */}
            <button onClick={onBack} className="flex items-center gap-2 mb-8 hover:underline bg-gray-100 p-4 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Title */}
            <h1 className="text-[32px] mb-8" style={{ fontWeight: 600 }}>
              Demande de réservation
            </h1>
            </div>

            {/* Step 1: Choose payment timing */}
            <div className={`mb-6 ${isStepEditing(1) ? 'rounded-2xl p-6 shadow-lg' : 'rounded-2xl p-6 border border-gray-300'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px]" style={{ fontWeight: 600 }}>
                  1. Choisissez quand vous souhaitez payer
                </h2>
                {isStepCompleted(1) && !isStepEditing(1) && (
                  <button 
                    onClick={() => editStep(1)}
                    className="text-base underline"
                    style={{ fontWeight: 600 }}
                  >
                    Changer
                  </button>
                )}
              </div>

              {isStepEditing(1) && (
                <div className="space-y-4">
                  {/* Pay now option */}
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="payment-timing"
                      checked={paymentTiming === 'now'}
                      onChange={() => setPaymentTiming('now')}
                      className="mt-1 w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                    <div className="flex-1">
                      <p className="text-base mb-1" style={{ fontWeight: 600 }}>
                        Payer {total.toFixed(2)} C$ maintenant
                      </p>
                    </div>
                  </label>

                  {/* Pay later option */}
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="payment-timing"
                      checked={paymentTiming === 'later'}
                      onChange={() => setPaymentTiming('later')}
                      className="mt-1 w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                    <div className="flex-1">
                      <p className="text-base mb-2">
                        Payer une partie maintenant et l'autre plus tard
                      </p>
                      <p className="text-sm text-gray-600">
                        {(total / 2).toFixed(2)} C$ maintenant, {(total / 2).toFixed(2)} C$ à payer le 25 mars. Pas de frais supplémentaires.{' '}
                        <button className="underline" style={{ fontWeight: 600 }}>
                          Plus d'informations
                        </button>
                      </p>
                    </div>
                  </label>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => completeStep(1)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-base"
                      style={{ fontWeight: 600 }}
                    >
                      {isStepCompleted(1) ? 'Terminer' : 'Suivant'}
                    </button>
                  </div>
                </div>
              )}

              {isStepCompleted(1) && !isStepEditing(1) && (
                <p className="text-base">
                  Payer {total.toFixed(2)} C$ maintenant
                </p>
              )}
            </div>

            {/* Step 2: Payment method */}
            <div className={`mb-6 p-6 ${isStepCompleted(2) && !isStepEditing(2) ? 'border border-gray-300 rounded-2xl' : ' shadow-lg border border-gray-300 rounded-2xl'} ${!isStepEditable(2) ? 'pointer-events-none shadow-none' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px] font-bold" style={{ fontWeight: 600 }}>
                  2. Ajoutez un mode de paiement
                </h2>
                {isStepCompleted(2) && !isStepEditing(2) && (
                  <button 
                    onClick={() => editStep(2)}
                    className="text-base underline"
                    style={{ fontWeight: 600 }}
                  >
                    Changer
                  </button>
                )}
              </div>

              {isStepEditing(2) && (
                <div>
                  {/* Saved payment methods */}
                  {savedPaymentMethods.length > 0 && (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-3">Vos modes de paiement enregistrés</p>
                      <div className="space-y-3">
                        {savedPaymentMethods.map((m, i) => (
                          <label key={i} className="flex items-center justify-between p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                                <rect width="32" height="24" rx="3" fill="#1A1F71"/>
                                <rect x="6" y="8" width="20" height="8" rx="1" fill="#FF5F00"/>
                                <circle cx="12" cy="12" r="5" fill="#EB001B"/>
                                <circle cx="20" cy="12" r="5" fill="#F79E1B"/>
                              </svg>
                              <div>
                                <span className="text-sm" style={{ fontWeight: 600 }}>{m.brand} •••• {m.last4}</span>
                                <span className="text-xs text-gray-500 ml-2">{m.expiry}</span>
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="payment-method"
                              checked={selectedSavedIndex === i && paymentMethod === 'card'}
                              onChange={() => { setSelectedSavedIndex(i); setPaymentMethod('card'); }}
                              className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                            />
                          </label>
                        ))}
                      </div>
                      <button
                        onClick={() => { setSelectedSavedIndex(null); setPaymentMethod('card'); }}
                        className="text-sm underline mt-3"
                        style={{ fontWeight: 600 }}
                      >
                        Utiliser une autre carte
                      </button>
                    </div>
                  )}

                  <div className="rounded-2xl mb-4">
                    {/* New card option - show if no saved methods or user chose "autre carte" */}
                    {(savedPaymentMethods.length === 0 || selectedSavedIndex === null) && (
                      <>
                        {/* Card option */}
                        <label className="flex items-center justify-between mb-6 cursor-pointer pt-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                                <rect width="32" height="24" rx="3" fill="#1A1F71"/>
                                <rect x="6" y="8" width="20" height="8" rx="1" fill="#FF5F00"/>
                                <circle cx="12" cy="12" r="5" fill="#EB001B"/>
                                <circle cx="20" cy="12" r="5" fill="#F79E1B"/>
                              </svg>
                              <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                                <rect width="32" height="24" rx="3" fill="#0066B2"/>
                                <path d="M12 8h8v8h-8z" fill="#FFA500"/>
                              </svg>
                              <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                                <rect width="32" height="24" rx="3" fill="#00579F"/>
                                <path d="M14 8l4 8h-8l4-8z" fill="#FAA61A"/>
                              </svg>
                              <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                                <rect width="32" height="24" rx="3" fill="#E21836"/>
                              </svg>
                            </div>
                          </div>
                          <input
                            type="radio"
                            name="payment-method"
                            checked={paymentMethod === 'card' && selectedSavedIndex === null}
                            onChange={() => { setPaymentMethod('card'); setSelectedSavedIndex(null); }}
                            className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                          />
                        </label>

                        {paymentMethod === 'card' && selectedSavedIndex === null && (
                          <div className="space-y-4">
                            <p className="text-base mb-4" style={{ fontWeight: 600 }}>
                              Carte de crédit ou de débit
                            </p>

                            <input
                              type="text"
                              placeholder="Numéro de carte"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="Expiration"
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                              />
                              <input
                                type="text"
                                placeholder="Cryptogramme"
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                              />
                            </div>

                            <input
                              type="text"
                              placeholder="Code postal"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />

                            <div className="relative">
                              <input
                                type="text"
                                value="France"
                                readOnly
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                              />
                              <select className="absolute inset-0 opacity-0 cursor-pointer">
                                <option>France</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* PayPal */}
                  <label className="flex items-center justify-between py-4 border-t border-gray-300 rounded-lg mb-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#003087">
                        <path d="M20.905 9.5c.21-1.342.095-2.256-.432-3.016C19.628 5.397 17.983 5 15.634 5H8.849c-.51 0-.945.37-1.025.876l-3.015 19.13c-.06.38.227.732.613.732h4.458l1.12-7.1-.035.224c.08-.506.51-.876 1.025-.876h2.138c4.201 0 7.49-1.707 8.45-6.644.027-.138.048-.272.067-.402.362-2.324-.001-3.904-1.74-5.44z"/>
                      </svg>
                      <span className="text-base">PayPal</span>
                    </div>
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                  </label>

                  {/* Google Pay */}
                  <label className="flex items-center justify-between py-4 border-t border-gray-300 rounded-lg mb-6 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#4285F4"/>
                      </svg>
                      <span className="text-base">Google Pay</span>
                    </div>
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'googlepay'}
                      onChange={() => setPaymentMethod('googlepay')}
                      className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                  </label>

                  <div className="flex justify-end">
                    <button
                      onClick={() => completeStep(2)}
                      className={`px-6 py-3 text-white rounded-lg transition-colors text-base ${
                        paymentMethod === 'paypal' 
                          ? 'bg-[#0b3382] hover:bg-[#082a6b]' 
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {paymentMethod === 'paypal' 
                        ? 'Associer à PayPal' 
                        : (isStepCompleted(2) ? 'Terminer' : 'Suivant')
                      }
                    </button>
                  </div>
                </div>
              )}

              {isStepCompleted(2) && !isStepEditing(2) && (
                <p className="text-base flex items-center gap-2">
                  {paymentMethod === 'googlepay' && (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#4285F4">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                      </svg>
                      Google Pay
                    </>
                  )}
                  {paymentMethod === 'paypal' && (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#003087">
                        <path d="M20.905 9.5c.21-1.342.095-2.256-.432-3.016C19.628 5.397 17.983 5 15.634 5H8.849c-.51 0-.945.37-1.025.876l-3.015 19.13c-.06.38.227.732.613.732h4.458l1.12-7.1-.035.224c.08-.506.51-.876 1.025-.876h2.138c4.201 0 7.49-1.707 8.45-6.644.027-.138.048-.272.067-.402.362-2.324-.001-3.904-1.74-5.44z"/>
                      </svg>
                      PayPal
                    </>
                  )}
                  {paymentMethod === 'card' && selectedSavedIndex !== null && savedPaymentMethods[selectedSavedIndex] && (
                    <>
                      <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                        <rect width="32" height="24" rx="3" fill="#1A1F71"/>
                        <rect x="6" y="8" width="20" height="8" rx="1" fill="#FF5F00"/>
                        <circle cx="12" cy="12" r="5" fill="#EB001B"/>
                        <circle cx="20" cy="12" r="5" fill="#F79E1B"/>
                      </svg>
                      {savedPaymentMethods[selectedSavedIndex].brand} •••• {savedPaymentMethods[selectedSavedIndex].last4}
                    </>
                  )}
                  {paymentMethod === 'card' && selectedSavedIndex === null && (
                    <>
                      <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                        <rect width="32" height="24" rx="3" fill="#1A1F71"/>
                        <rect x="6" y="8" width="20" height="8" rx="1" fill="#FF5F00"/>
                        <circle cx="12" cy="12" r="5" fill="#EB001B"/>
                        <circle cx="20" cy="12" r="5" fill="#F79E1B"/>
                      </svg>
                      Carte de crédit ou de débit
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Step 3: Message to host */}
            <div className={`mb-6 rounded-2xl p-6 ${isStepCompleted(3) && !isStepEditing(3) ? 'border border-gray-300' : 'shadow-lg'} ${!isStepEditable(3) ? 'pointer-events-none shadow-none border border-gray-300 ' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px]" style={{ fontWeight: 600 }}>
                  3. Envoyez un message à l'hôte
                </h2>
                {isStepCompleted(3) && !isStepEditing(3) && (
                  <button 
                    onClick={() => editStep(3)}
                    className="text-base underline"
                    style={{ fontWeight: 600 }}
                  >
                    Changer
                  </button>
                )}
              </div>

              {isStepEditing(3) && (
                <div className="rounded-2xl">
                  <p className="text-sm text-gray-700 mb-4">
                    Avant de continuer, dites-lui un peu plus à {data.hostName || "l'hôte"} sur votre voyage et expliquez-lui pourquoi son logement est une bonne option.
                  </p>

                  {data.hostName && (
                    <div className="flex items-start gap-3 mb-4">
                      {data.hostPhoto ? (
                        <img src={data.hostPhoto} alt={data.hostName} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-lg" style={{ fontWeight: 600 }}>
                          {data.hostName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-base" style={{ fontWeight: 600 }}>{data.hostName}</p>
                        {data.hostSince && (
                          <p className="text-sm text-gray-600">Hôte depuis {new Date(data.hostSince).getFullYear()}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Par exemple: « Bonjour ${data.hostName || ''}, mon partenaire et moi allons au mariage d'un ami et votre logement est tout proche. »`}
                    className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 text-base"
                  />

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => completeStep(3)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-base"
                      style={{ fontWeight: 600 }}
                    >
                      {isStepCompleted(3) ? 'Terminer' : 'Suivant'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Verify request */}
            <div className={`mb-6 p-6 ${isStepEditable(4) ? 'shadow-lg p-6 rounded-2xl' : ''} ${!isStepEditable(4) ? 'pointer-events-none shadow-none rounded-2xl border border-gray-300 ' : ''}`}>
              <h2 className="text-[22px] mb-4" style={{ fontWeight: 600 }}>
                4. Vérifiez votre demande
              </h2>
              
              {isStepEditable(4) && (
                <div>
                  <p className="text-base text-gray-700 mb-4">
                    L&apos;hôte a 24 heures pour confirmer votre réservation. Nous vous débiterons une fois la demande acceptée.
                  </p>

                  <label className="flex items-start gap-3 mb-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedConditions}
                      onChange={(e) => setAcceptedConditions(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">
                      J&apos;accepte les{' '}
                      <button className="underline" style={{ fontWeight: 600 }}>
                        conditions de réservation
                      </button>
                      .
                    </span>
                  </label>

                  <button
                    onClick={handleSubmitReservation}
                    disabled={isSubmitting || !acceptedConditions}
                    className="w-full bg-gray-900 text-white rounded-lg py-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors text-base"
                    style={{ fontWeight: 600, opacity: (isSubmitting || !acceptedConditions) ? 0.5 : 1 }}
                  >
                    {isSubmitting ? 'Réservation en cours...' : 'Réserver'}
                  </button>

                  {reservationError && (
                    <p className="text-sm text-red-600 mt-3">{reservationError}</p>
                  )}

                  {reservationSuccess && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800" style={{ fontWeight: 600 }}>
                        Votre demande de réservation a été envoyée avec succès ! L&apos;hôte a 24 heures pour confirmer.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="border border-gray-200 rounded-2xl p-6 mt-20">
              {/* Property info */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg mb-2" style={{ fontWeight: 600 }}>
                    {data.title}
                  </h3>
                  {data.rating != null && (
                    <div className="flex items-center gap-1 text-sm mb-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span style={{ fontWeight: 600 }}>{data.rating.toFixed(2)}</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">{data.location}</p>
                </div>
              </div>

              {/* Cancellation */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-base mb-2" style={{ fontWeight: 600 }}>
                  Annulation gratuite
                </h4>
                <p className="text-sm text-gray-700">
                  {checkInDate
                    ? `Annulez avant le ${new Date(checkInDate.getTime() - 86400000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} pour recevoir un remboursement intégral.`
                    : 'Obtenez un remboursement intégral si vous changez d\'avis.'
                  }{' '}
                  <button className="underline" style={{ fontWeight: 600 }}>
                    Consulter les conditions complètes
                  </button>
                </p>
              </div>

              {/* Dates - inline editable */}
              <div className="mb-4 relative" ref={calendarRef}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base" style={{ fontWeight: 600 }}>Dates</h4>
                  <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="text-base underline"
                    style={{ fontWeight: 600 }}
                  >
                    Modifier
                  </button>
                </div>
                <p className="text-sm text-gray-700">
                  {checkInDate && checkOutDate
                    ? `${formatDateShort(checkInDate)} - ${formatDateShort(checkOutDate)}`
                    : 'Sélectionnez vos dates'}
                </p>

                {showCalendar && (
                  <div
                    className="absolute left-0 right-0 bg-white rounded-2xl z-50 mt-2 p-6"
                    style={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 6px 20px', width: '100%' }}
                  >
                    {/* Date inputs */}
                    <div className="border border-gray-300 rounded-lg mb-4">
                      <div className="grid grid-cols-2 divide-x divide-gray-300">
                        <div className="p-3">
                          <label className="text-[10px] block mb-0.5" style={{ fontWeight: 700, letterSpacing: '0.05em' }}>ARRIVÉE</label>
                          <span className="text-sm" style={{ color: '#222' }}>{checkInDate ? formatDateInput(checkInDate) : 'Ajouter'}</span>
                        </div>
                        <div className="p-3">
                          <label className="text-[10px] block mb-0.5" style={{ fontWeight: 700, letterSpacing: '0.05em' }}>DÉPART</label>
                          <span className="text-sm" style={{ color: '#222' }}>{checkOutDate ? formatDateInput(checkOutDate) : 'Ajouter'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Calendar navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h4 className="text-base" style={{ fontWeight: 600 }}>
                        {MONTH_NAMES_FR[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                      </h4>
                      <button
                        onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                    {renderMonth(calendarMonth.getFullYear(), calendarMonth.getMonth())}

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => { setCheckInDate(null); setCheckOutDate(null); }}
                        className="text-sm underline"
                        style={{ fontWeight: 600 }}
                      >
                        Effacer les dates
                      </button>
                      <button
                        onClick={() => setShowCalendar(false)}
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        Fermer
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Guests - inline editable */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 relative" ref={guestsPickerRef}>
                <div>
                  <h4 className="text-base" style={{ fontWeight: 600 }}>Voyageurs</h4>
                  <p className="text-sm text-gray-700">
                    {guests.adults} adulte{guests.adults > 1 ? 's' : ''}
                    {guests.children > 0 ? `, ${guests.children} enfant${guests.children > 1 ? 's' : ''}` : ''}
                    {guests.babies > 0 ? `, ${guests.babies} bébé${guests.babies > 1 ? 's' : ''}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => setShowGuestsPicker(!showGuestsPicker)}
                  className="text-base underline"
                  style={{ fontWeight: 600 }}
                >
                  Modifier
                </button>
                {showGuestsPicker && (
                  <GuestsPicker
                    onClose={() => setShowGuestsPicker(false)}
                    onGuestsChange={setGuests}
                    currentGuests={guests}
                    maxCapacity={capacity}
                    showCapacityInfo
                  />
                )}
              </div>

              {/* Price breakdown */}
              <h4 className="text-base mb-4" style={{ fontWeight: 600 }}>
                Détail du prix
              </h4>
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between text-base">
                  <span className="underline">{nights} nuit{nights > 1 ? 's' : ''} x {Number(pricePerNight).toFixed(2)} C$</span>
                  <span>{subtotal.toFixed(2)} C$</span>
                </div>
                {cleaningFee > 0 && (
                  <div className="flex items-center justify-between text-base">
                    <span className="underline">Frais de ménage</span>
                    <span>{cleaningFee.toFixed(2)} C$</span>
                  </div>
                )}
                {extraGuestFee > 0 && (
                  <div className="flex items-center justify-between text-base">
                    <span className="underline">Frais de voyageur supplémentaire</span>
                    <span>{extraGuestFee.toFixed(2)} C$</span>
                  </div>
                )}
                {petFee > 0 && (
                  <div className="flex items-center justify-between text-base">
                    <span className="underline">Frais d&apos;animaux</span>
                    <span>{petFee.toFixed(2)} C$</span>
                  </div>
                )}
                {serviceFee > 0 && (
                  <div className="flex items-center justify-between text-base">
                    <span className="underline">Frais de service HOMIQIO</span>
                    <span>{serviceFee.toFixed(2)} C$</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-base" style={{ fontWeight: 600 }}>Total {data.currency || 'CAD'}</span>
                <span className="text-base" style={{ fontWeight: 600 }}>{total.toFixed(2)} C$</span>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <svg className="w-5 h-5 flex-shrink-0 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-900">
                  Perle rare ! Les réservations pour ce logement sont fréquentes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10 lg:px-20 py-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700">
            <button className="hover:underline">Confidentialité</button>
            <span>·</span>
            <button className="hover:underline">Conditions générales</button>
            <span>·</span>
            <button className="hover:underline">Fonctionnement du site</button>
            <span>·</span>
            <button className="hover:underline">Infos sur l'entreprise</button>
          </div>
        </div>
      </footer>
    </div>
  );
}