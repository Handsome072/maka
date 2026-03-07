'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { addMonths, subMonths, format, parseISO, isBefore, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { HostSidebar } from '@/app/components/HostSidebar';
import { CalendarGrid } from '@/app/components/host-calendar/CalendarGrid';
import { DateSidePanel } from '@/app/components/host-calendar/DateSidePanel';
import { DateBottomSheet } from '@/app/components/host-calendar/DateBottomSheet';
import {
  MOCK_LISTINGS,
  generateMockCalendarData,
  CalendarDate,
  CalendarReservation,
  CalendarListing,
} from '@/app/components/host-calendar/types';

export function HostCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedListingId, setSelectedListingId] = useState<number>(MOCK_LISTINGS[0].id);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [lastClickedDate, setLastClickedDate] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelPrice, setPanelPrice] = useState<string>('');
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
  const [reservations, setReservations] = useState<CalendarReservation[]>([]);

  const selectedListing = useMemo(
    () => MOCK_LISTINGS.find((l) => l.id === selectedListingId) || MOCK_LISTINGS[0],
    [selectedListingId]
  );

  // Load calendar data when month or listing changes
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const data = generateMockCalendarData(selectedListingId, year, month);
    setCalendarDates(data.dates);
    setReservations(data.reservations);
    setSelectedDates(new Set());
    setIsPanelOpen(false);
    setPanelPrice('');
  }, [currentMonth, selectedListingId]);

  // Update panel price when selection changes
  useEffect(() => {
    if (selectedDates.size === 0) return;
    const dateMap = new Map(calendarDates.map((d) => [d.date, d]));
    const firstSelected = Array.from(selectedDates).sort()[0];
    const cd = dateMap.get(firstSelected);
    const price = cd?.customPrice ?? selectedListing.basePrice;
    setPanelPrice(String(price));
  }, [selectedDates, calendarDates, selectedListing.basePrice]);

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
    [lastClickedDate]
  );

  const handleDateRangeSelect = useCallback((startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const range = eachDayOfInterval({ start, end });
    setSelectedDates(new Set(range.map((d) => format(d, 'yyyy-MM-dd'))));
    setLastClickedDate(endDate);
    setIsPanelOpen(true);
  }, []);

  const handleApplyPrice = useCallback(() => {
    const price = parseFloat(panelPrice);
    if (isNaN(price) || price < 0) {
      toast.error('Veuillez entrer un prix valide');
      return;
    }
    setCalendarDates((prev) =>
      prev.map((d) =>
        selectedDates.has(d.date) && d.status !== 'reserved'
          ? { ...d, customPrice: price }
          : d
      )
    );
    toast.success(
      `Prix mis à jour : ${price} $ pour ${selectedDates.size} date${selectedDates.size > 1 ? 's' : ''}`
    );
  }, [panelPrice, selectedDates]);

  const handleResetPrice = useCallback(() => {
    setCalendarDates((prev) =>
      prev.map((d) =>
        selectedDates.has(d.date) && d.status !== 'reserved'
          ? { ...d, customPrice: null }
          : d
      )
    );
    setPanelPrice(String(selectedListing.basePrice));
    toast.success('Prix réinitialisé au tarif de base');
  }, [selectedDates, selectedListing.basePrice]);

  const handleBlock = useCallback(() => {
    setCalendarDates((prev) =>
      prev.map((d) =>
        selectedDates.has(d.date) && d.status === 'available'
          ? { ...d, status: 'blocked' as const }
          : d
      )
    );
    toast.success(
      `${selectedDates.size} date${selectedDates.size > 1 ? 's' : ''} bloquée${selectedDates.size > 1 ? 's' : ''}`
    );
  }, [selectedDates]);

  const handleUnblock = useCallback(() => {
    setCalendarDates((prev) =>
      prev.map((d) =>
        selectedDates.has(d.date) && d.status === 'blocked'
          ? { ...d, status: 'available' as const }
          : d
      )
    );
    toast.success(
      `${selectedDates.size} date${selectedDates.size > 1 ? 's' : ''} débloquée${selectedDates.size > 1 ? 's' : ''}`
    );
  }, [selectedDates]);

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
    setSelectedDates(new Set());
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  const monthLabel = format(currentMonth, 'MMMM yyyy', { locale: fr });
  const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  // Shared panel props
  const panelProps = {
    selectedDates,
    calendarDates,
    reservations,
    basePrice: selectedListing.basePrice,
    currency: selectedListing.currency,
    panelPrice,
    onPanelPriceChange: setPanelPrice,
    onApplyPrice: handleApplyPrice,
    onResetPrice: handleResetPrice,
    onBlock: handleBlock,
    onUnblock: handleUnblock,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HostSidebar activePage="host-calendar" />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mt-16 lg:mt-0">
          <h1
            className="text-2xl md:text-3xl"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Calendrier
          </h1>

          {/* Listing selector */}
          {MOCK_LISTINGS.length > 1 && (
            <div className="relative">
              <select
                value={selectedListingId}
                onChange={(e) => setSelectedListingId(Number(e.target.value))}
                className="appearance-none w-full sm:w-72 px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent cursor-pointer"
                style={{ fontWeight: 500, color: '#222222' }}
              >
                {MOCK_LISTINGS.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {listing.title} — {listing.city}
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

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" style={{ color: '#222222' }} />
            </button>
            <h2
              className="text-lg min-w-[180px] text-center"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              {capitalizedMonth}
            </h2>
            <button
              onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#222222' }} />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs hover:bg-gray-50 transition-colors"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Aujourd&apos;hui
          </button>
        </div>

        {/* Legend */}
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
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#FEF2F2' }} />
            <span className="text-xs" style={{ color: '#717171' }}>Bloqué</span>
          </div>
        </div>

        {/* Calendar grid */}
        <div
          className="bg-white rounded-xl border border-gray-200 overflow-hidden p-2 sm:p-3 lg:p-4"
          style={{ transition: 'margin-right 300ms ease' }}
        >
          <CalendarGrid
            currentMonth={currentMonth}
            calendarDates={calendarDates}
            reservations={reservations}
            selectedDates={selectedDates}
            basePrice={selectedListing.basePrice}
            currency={selectedListing.currency}
            onDateClick={handleDateClick}
            onDateRangeSelect={handleDateRangeSelect}
          />
        </div>

        {/* Empty state hint */}
        {calendarDates.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <CalendarDays className="w-8 h-8" style={{ color: '#9CA3AF' }} />
            </div>
            <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
              Aucune annonce
            </h2>
            <p className="text-sm" style={{ color: '#717171' }}>
              Créez une annonce pour commencer à gérer votre calendrier.
            </p>
          </div>
        )}
      </main>

      {/* Desktop side panel */}
      <DateSidePanel
        isOpen={isPanelOpen && selectedDates.size > 0}
        onClose={handleClosePanel}
        {...panelProps}
      />

      {/* Mobile bottom sheet */}
      <DateBottomSheet
        isOpen={isPanelOpen && selectedDates.size > 0}
        onClose={handleClosePanel}
        {...panelProps}
      />
    </div>
  );
}
