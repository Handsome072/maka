'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { addMonths, subMonths, format, parseISO, isBefore, eachDayOfInterval, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { HostSidebar } from '@/app/components/HostSidebar';
import { CalendarGrid } from '@/app/components/host-calendar/CalendarGrid';
import { DateSidePanel } from '@/app/components/host-calendar/DateSidePanel';
import { DateBottomSheet } from '@/app/components/host-calendar/DateBottomSheet';
import { buildCalendarDates, type CalendarReservation } from '@/app/components/host-calendar/types';
import { hostCalendarApi, type HostCalendarData } from '@/app/services/api';

export function HostCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [listings, setListings] = useState<HostCalendarData['listings'] | null>(null);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [reservations, setReservations] = useState<CalendarReservation[]>([]);
  const [blockedDates, setBlockedDates] = useState<Set<string>>(() => new Set());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [lastClickedDate, setLastClickedDate] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedListing = useMemo(
    () => listings?.find((l) => l.id === selectedListingId) ?? null,
    [listings, selectedListingId],
  );

  // Réservations et nuits bloquées du mois affiché
  useEffect(() => {
    let cancelled = false;
    const from = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const to = format(addMonths(startOfMonth(currentMonth), 1), 'yyyy-MM-dd');
    hostCalendarApi
      .get({ listingId: selectedListingId, from, to })
      .then((data) => {
        if (cancelled) return;
        setLoadError(null);
        setListings(data.listings);
        if (data.listing_id !== selectedListingId) setSelectedListingId(data.listing_id);
        setReservations(
          data.reservations.map((r) => ({
            id: String(r.id),
            guestName: r.guest_first_name || 'Voyageur',
            checkIn: r.check_in,
            checkOut: r.check_out,
            status: r.status === 'pending' ? 'pending' : 'confirmed',
          })),
        );
        setBlockedDates(new Set(data.blocked_dates));
      })
      .catch(() => !cancelled && setLoadError('Impossible de charger le calendrier. Réessayez dans un instant.'));
    return () => {
      cancelled = true;
    };
  }, [currentMonth, selectedListingId, reloadKey]);

  // Nouvelle annonce ou nouveau mois : la sélection repart de zéro
  useEffect(() => {
    setSelectedDates(new Set());
    setIsPanelOpen(false);
  }, [currentMonth, selectedListingId]);

  const calendarDates = useMemo(
    () => buildCalendarDates(currentMonth, reservations, blockedDates),
    [currentMonth, reservations, blockedDates],
  );

  const handleDateClick = useCallback(
    (dateStr: string, shiftKey: boolean) => {
      if (shiftKey && lastClickedDate) {
        const start = parseISO(lastClickedDate);
        const end = parseISO(dateStr);
        const [from, to] = isBefore(start, end) ? [start, end] : [end, start];
        const range = eachDayOfInterval({ start: from, end: to });
        setSelectedDates(new Set(range.map((d) => format(d, 'yyyy-MM-dd'))));
      } else {
        setSelectedDates(new Set([dateStr]));
        setLastClickedDate(dateStr);
      }
      setIsPanelOpen(true);
    },
    [lastClickedDate],
  );

  const handleDateRangeSelect = useCallback((startDate: string, endDate: string) => {
    const range = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) });
    setSelectedDates(new Set(range.map((d) => format(d, 'yyyy-MM-dd'))));
    setLastClickedDate(endDate);
    setIsPanelOpen(true);
  }, []);

  /** Bloque (ou débloque) les nuits sélectionnées qui peuvent l'être, puis recharge le mois. */
  const updateBlocked = useCallback(
    async (blocked: boolean) => {
      if (!selectedListingId) return;
      const today = format(new Date(), 'yyyy-MM-dd');
      const statusWanted = blocked ? 'available' : 'blocked';
      const dates = calendarDates
        .filter((d) => selectedDates.has(d.date) && d.status === statusWanted && (!blocked || d.date >= today))
        .map((d) => d.date);
      if (dates.length === 0) {
        toast.error(blocked ? 'Aucune nuit disponible à bloquer dans la sélection (les dates passées ne se bloquent pas).' : 'Aucune nuit bloquée dans la sélection.');
        return;
      }
      setSaving(true);
      try {
        const res = await hostCalendarApi.setBlocked(selectedListingId, dates, blocked);
        toast.success(res.message);
        setReloadKey((k) => k + 1);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "L'enregistrement a échoué.");
        setReloadKey((k) => k + 1);
      } finally {
        setSaving(false);
      }
    },
    [selectedListingId, calendarDates, selectedDates],
  );

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedDates(new Set());
  }, []);

  const monthLabel = format(currentMonth, 'MMMM yyyy', { locale: fr });
  const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
  const basePrice = selectedListing?.base_price ?? 0;
  const currency = selectedListing?.currency ?? 'EUR';

  const panelProps = {
    selectedDates,
    calendarDates,
    reservations,
    basePrice,
    currency,
    listingId: selectedListingId,
    busy: saving,
    onBlock: () => updateBlocked(true),
    onUnblock: () => updateBlocked(false),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HostSidebar activePage="host-calendar" />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
            Calendrier
          </h1>

          {listings && listings.length > 1 && (
            <div className="relative">
              <select
                value={selectedListingId ?? ''}
                onChange={(e) => setSelectedListingId(Number(e.target.value))}
                className="appearance-none w-full sm:w-72 px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
                style={{ fontWeight: 500, color: '#222222' }}
              >
                {listings.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {listing.title}
                    {listing.city ? ` — ${listing.city}` : ''}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-4 h-4" style={{ color: '#9CA3AF' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {loadError && <p className="text-sm text-red-600 mb-4">{loadError}</p>}

        {listings === null && !loadError && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        )}

        {listings && listings.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <CalendarDays className="w-8 h-8" style={{ color: '#9CA3AF' }} />
            </div>
            <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
              Aucune annonce
            </h2>
            <p className="text-sm mb-6" style={{ color: '#717171' }}>
              Créez une annonce pour commencer à gérer votre calendrier.
            </p>
            <Link href="/host-onboarding" className="px-5 py-2.5 rounded-lg text-sm text-white" style={{ backgroundColor: '#222222', fontWeight: 600 }}>
              Créer une annonce
            </Link>
          </div>
        )}

        {listings && listings.length > 0 && (
          <>
            {/* Navigation entre les mois */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Mois précédent"
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: '#222222' }} />
                </button>
                <h2 className="text-lg min-w-[180px] text-center" style={{ fontWeight: 600, color: '#222222' }}>
                  {capitalizedMonth}
                </h2>
                <button
                  onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Mois suivant"
                >
                  <ChevronRight className="w-5 h-5" style={{ color: '#222222' }} />
                </button>
              </div>

              <button
                onClick={() => setCurrentMonth(startOfMonth(new Date()))}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Aujourd&apos;hui
              </button>
            </div>

            {/* Légende */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm border border-gray-200" style={{ backgroundColor: '#ffffff' }} />
                <span className="text-xs" style={{ color: '#717171' }}>Disponible</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#EBF5FF' }} />
                <span className="text-xs" style={{ color: '#717171' }}>Réservé</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#B45309' }} />
                <span className="text-xs" style={{ color: '#717171' }}>Demande en attente</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#FEF2F2' }} />
                <span className="text-xs" style={{ color: '#717171' }}>Bloqué par vous</span>
              </div>
            </div>

            <div
              className="bg-white rounded-xl border border-gray-200 overflow-hidden p-2 sm:p-3 lg:p-4"
              style={{ transition: 'margin-right 300ms ease' }}
            >
              <CalendarGrid
                currentMonth={currentMonth}
                calendarDates={calendarDates}
                reservations={reservations}
                selectedDates={selectedDates}
                basePrice={basePrice}
                currency={currency}
                onDateClick={handleDateClick}
                onDateRangeSelect={handleDateRangeSelect}
              />
            </div>
            <p className="text-xs mt-3" style={{ color: '#9CA3AF' }}>
              Sélectionnez une ou plusieurs dates (glisser, ou Maj + clic) pour les bloquer : les voyageurs ne pourront plus les réserver.
            </p>
          </>
        )}
      </main>

      <DateSidePanel isOpen={isPanelOpen && selectedDates.size > 0} onClose={handleClosePanel} {...panelProps} />
      <DateBottomSheet isOpen={isPanelOpen && selectedDates.size > 0} onClose={handleClosePanel} {...panelProps} />
    </div>
  );
}
