'use client';

import { useMemo, useCallback, useRef, useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  parseISO,
  isBefore,
  isAfter,
  isSameDay,
  differenceInCalendarDays,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CalendarDate,
  CalendarReservation,
  DATE_STATUS_CONFIG,
  RESERVATION_BAR_COLORS,
  WEEKDAY_LABELS,
} from './types';

interface CalendarGridProps {
  currentMonth: Date;
  calendarDates: CalendarDate[];
  reservations: CalendarReservation[];
  selectedDates: Set<string>;
  basePrice: number;
  currency: string;
  onDateClick: (date: string, shiftKey: boolean) => void;
  onDateRangeSelect: (startDate: string, endDate: string) => void;
}

export function CalendarGrid({
  currentMonth,
  calendarDates,
  reservations,
  selectedDates,
  basePrice,
  currency,
  onDateClick,
  onDateRangeSelect,
}: CalendarGridProps) {
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragEnd, setDragEnd] = useState<string | null>(null);
  const isDragging = useRef(false);

  // Build the 6-week grid (Mon-based)
  const gridDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  // Map dates for O(1) lookup
  const dateMap = useMemo(() => {
    const map = new Map<string, CalendarDate>();
    calendarDates.forEach((d) => map.set(d.date, d));
    return map;
  }, [calendarDates]);

  // Group grid into weeks (rows of 7)
  const weeks = useMemo(() => {
    const rows: Date[][] = [];
    for (let i = 0; i < gridDays.length; i += 7) {
      rows.push(gridDays.slice(i, i + 7));
    }
    return rows;
  }, [gridDays]);

  // Compute dragging range for visual feedback
  const dragRange = useMemo(() => {
    if (!dragStart || !dragEnd) return new Set<string>();
    const start = parseISO(dragStart);
    const end = parseISO(dragEnd);
    const [from, to] = isBefore(start, end) ? [start, end] : [end, start];
    return new Set(
      eachDayOfInterval({ start: from, end: to }).map((d) => format(d, 'yyyy-MM-dd'))
    );
  }, [dragStart, dragEnd]);

  // Reservation bars for a given week row
  const getReservationBarsForWeek = useCallback(
    (weekDays: Date[]) => {
      const weekStart = weekDays[0];
      const weekEnd = weekDays[6];
      const bars: {
        reservation: CalendarReservation;
        startCol: number;
        span: number;
      }[] = [];

      reservations.forEach((res) => {
        if (res.status === 'cancelled') return;
        const checkIn = parseISO(res.checkIn);
        const checkOut = parseISO(res.checkOut);

        // Does this reservation overlap with this week?
        if (isAfter(checkIn, weekEnd) || isBefore(checkOut, weekStart)) return;

        const barStart = isBefore(checkIn, weekStart) ? weekStart : checkIn;
        const barEnd = isAfter(checkOut, weekEnd)
          ? weekEnd
          : // checkOut is exclusive, so show bar up to day before checkOut
            new Date(checkOut.getTime() - 86400000);

        if (isBefore(barEnd, barStart)) return;

        const startCol = differenceInCalendarDays(barStart, weekStart);
        const span = differenceInCalendarDays(barEnd, barStart) + 1;

        bars.push({ reservation: res, startCol, span });
      });

      return bars;
    },
    [reservations]
  );

  const handleMouseDown = useCallback(
    (dateStr: string, e: React.MouseEvent) => {
      if (e.shiftKey) {
        onDateClick(dateStr, true);
        return;
      }
      isDragging.current = true;
      setDragStart(dateStr);
      setDragEnd(dateStr);
    },
    [onDateClick]
  );

  const handleMouseEnter = useCallback((dateStr: string) => {
    if (isDragging.current) {
      setDragEnd(dateStr);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isDragging.current && dragStart) {
      isDragging.current = false;
      const end = dragEnd || dragStart;
      if (dragStart === end) {
        onDateClick(dragStart, false);
      } else {
        const s = parseISO(dragStart);
        const e = parseISO(end);
        const [from, to] = isBefore(s, e) ? [dragStart, end] : [end, dragStart];
        onDateRangeSelect(from, to);
      }
      setDragStart(null);
      setDragEnd(null);
    }
  }, [dragStart, dragEnd, onDateClick, onDateRangeSelect]);

  const formatPrice = (price: number) => {
    return `${price} $`;
  };

  return (
    <div
      className="select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center py-2 text-xs"
            style={{ color: '#717171', fontWeight: 600 }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Week rows */}
      {weeks.map((week, weekIdx) => {
        const bars = getReservationBarsForWeek(week);
        return (
          <div key={weekIdx} className="relative grid grid-cols-7">
            {/* Day cells */}
            {week.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const inMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);
              const calDate = dateMap.get(dateStr);
              const status = calDate?.status || 'available';
              const isSelected = selectedDates.has(dateStr);
              const isDragHighlight = dragRange.has(dateStr);
              const price = calDate?.customPrice ?? basePrice;
              const isCustomPrice = calDate?.customPrice !== null && calDate?.customPrice !== undefined;
              const statusConfig = DATE_STATUS_CONFIG[status];

              return (
                <div
                  key={dateStr}
                  onMouseDown={(e) => inMonth && handleMouseDown(dateStr, e)}
                  onMouseEnter={() => inMonth && handleMouseEnter(dateStr)}
                  className={`
                    relative border border-gray-100 transition-colors
                    h-14 sm:h-20 lg:h-24 p-1 sm:p-1.5
                    ${inMonth ? 'cursor-pointer' : 'pointer-events-none'}
                    ${today ? 'border-2 border-gray-900' : ''}
                    ${isSelected ? 'ring-2 ring-gray-900 ring-inset z-10' : ''}
                    ${isDragHighlight && !isSelected ? 'ring-2 ring-gray-400 ring-inset z-10' : ''}
                  `}
                  style={{
                    backgroundColor: isSelected
                      ? '#F9FAFB'
                      : isDragHighlight
                        ? '#F3F4F6'
                        : inMonth
                          ? statusConfig.cellBg
                          : '#FAFAFA',
                  }}
                >
                  {/* Day number */}
                  <span
                    className={`
                      text-xs sm:text-sm leading-none
                      ${status === 'blocked' && inMonth ? 'line-through' : ''}
                    `}
                    style={{
                      fontWeight: today ? 700 : 500,
                      color: !inMonth ? '#D1D5DB' : today ? '#222222' : '#222222',
                    }}
                  >
                    {format(day, 'd')}
                  </span>

                  {/* Price (hidden on very small screens) */}
                  {inMonth && (
                    <span
                      className="hidden sm:block absolute bottom-1 right-1.5 text-[10px] lg:text-xs"
                      style={{
                        fontWeight: isCustomPrice ? 600 : 400,
                        color: isCustomPrice ? '#222222' : '#9CA3AF',
                      }}
                    >
                      {formatPrice(price)}
                    </span>
                  )}

                  {/* Status dot for blocked (mobile) */}
                  {inMonth && status === 'blocked' && (
                    <span className="sm:hidden absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-red-400" />
                  )}
                </div>
              );
            })}

            {/* Reservation bars overlaying the week row */}
            {bars.map((bar) => {
              const barColor = RESERVATION_BAR_COLORS[bar.reservation.status];
              const leftPercent = (bar.startCol / 7) * 100;
              const widthPercent = (bar.span / 7) * 100;
              const firstName = bar.reservation.guestName.split(' ')[0];

              return (
                <div
                  key={bar.reservation.id + '-' + weekIdx}
                  className="absolute pointer-events-none flex items-center px-1.5 sm:px-2 truncate"
                  style={{
                    left: `calc(${leftPercent}% + 4px)`,
                    width: `calc(${widthPercent}% - 8px)`,
                    bottom: '6px',
                    height: '18px',
                    borderRadius: '9px',
                    backgroundColor: barColor,
                    zIndex: 5,
                  }}
                >
                  {bar.span >= 2 && (
                    <span
                      className="text-white truncate text-[9px] sm:text-[10px] lg:text-xs leading-none"
                      style={{ fontWeight: 600 }}
                    >
                      {bar.span >= 3 ? firstName : firstName.charAt(0)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
