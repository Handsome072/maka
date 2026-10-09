'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const MONTH_NAMES_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const DAY_NAMES_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

function monthDays(year: number, month: number): (Date | null)[] {
  const leading = (new Date(year, month, 1).getDay() + 6) % 7; // lundi = 0
  const count = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = Array(leading).fill(null);
  for (let d = 1; d <= count; d++) days.push(new Date(year, month, d));
  return days;
}

function sameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && a.getTime() === b.getTime();
}

interface DateRangeCalendarProps {
  /** Premier mois affiché (le 1er du mois). */
  month: Date;
  onMonthChange: (month: Date) => void;
  checkIn: Date | null;
  checkOut: Date | null;
  /** Le prochain clic choisit le départ : le survol prévisualise la plage depuis l'arrivée. */
  selectingCheckOut: boolean;
  isSelectable: (day: Date) => boolean;
  onSelect: (day: Date) => void;
}

/** Deux mois côte à côte (un seul sur mobile), jours indisponibles barrés, comme sur Airbnb. */
export function DateRangeCalendar({
  month,
  onMonthChange,
  checkIn,
  checkOut,
  selectingCheckOut,
  isSelectable,
  onSelect,
}: DateRangeCalendarProps) {
  const [hovered, setHovered] = useState<Date | null>(null);

  const now = new Date();
  const canGoBack = month > new Date(now.getFullYear(), now.getMonth(), 1);
  const preview =
    selectingCheckOut && checkIn && hovered && hovered > checkIn && isSelectable(hovered) ? hovered : null;
  const rangeEnd = preview ?? checkOut;
  const hasRange = !!checkIn && !!rangeEnd && rangeEnd > checkIn;
  const months = [month, new Date(month.getFullYear(), month.getMonth() + 1, 1)];

  const shift = (delta: number) => onMonthChange(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <div className="relative w-full md:w-fit" onMouseLeave={() => setHovered(null)}>
      <button
        type="button"
        onClick={() => shift(-1)}
        disabled={!canGoBack}
        aria-label="Mois précédent"
        className="absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center text-[#222] hover:bg-[#F7F7F7] disabled:text-[#DDDDDD] disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
      </button>
      <button
        type="button"
        onClick={() => shift(1)}
        aria-label="Mois suivant"
        className="absolute right-0 top-0 w-9 h-9 rounded-full flex items-center justify-center text-[#222] hover:bg-[#F7F7F7]"
      >
        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
      </button>

      <div className="flex gap-x-8">
        {months.map((m, index) => (
          <div key={`${m.getFullYear()}-${m.getMonth()}`} className={`w-full md:w-[294px] ${index === 1 ? 'hidden md:block' : ''}`}>
            <h4 className="h-9 flex items-center justify-center text-base text-[#222]" style={{ fontWeight: 600 }}>
              {MONTH_NAMES_FR[m.getMonth()]} {m.getFullYear()}
            </h4>
            <div className="grid grid-cols-7 mt-3">
              {DAY_NAMES_FR.map((name, i) => (
                <div key={i} className="h-8 flex items-center justify-center text-xs text-[#6A6A6A]" style={{ fontWeight: 600 }}>
                  {name}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-0.5">
              {monthDays(m.getFullYear(), m.getMonth()).map((day, i) => {
                if (!day) return <div key={i} className="aspect-square" />;

                const isStart = sameDay(day, checkIn);
                const isEnd = sameDay(day, rangeEnd);
                const inRange = hasRange && day > checkIn! && day < rangeEnd!;
                const selectable = isSelectable(day);
                const filled = isStart || (isEnd && !preview);
                const outlined = isEnd && !!preview;
                const blocked = !selectable && !filled && !outlined;

                return (
                  <div key={i} className="relative aspect-square">
                    {hasRange && (inRange || isStart || isEnd) && (
                      <span
                        className={`absolute inset-y-0 bg-[#F7F7F7] ${
                          isStart ? 'left-1/2 right-0' : isEnd ? 'left-0 right-1/2' : 'inset-x-0'
                        }`}
                      />
                    )}
                    <button
                      type="button"
                      aria-disabled={!selectable}
                      aria-pressed={isStart || (isEnd && !preview)}
                      aria-label={`${day.getDate()} ${MONTH_NAMES_FR[day.getMonth()]} ${day.getFullYear()}`}
                      onMouseEnter={() => setHovered(day)}
                      onClick={() => selectable && onSelect(day)}
                      className={`relative w-full h-full rounded-full text-sm border-[1.5px] transition-colors ${
                        filled
                          ? 'bg-[#222] border-[#222] text-white'
                          : outlined
                            ? 'border-[#222] text-[#222]'
                            : blocked
                              ? 'border-transparent text-[#B0B0B0] line-through cursor-not-allowed'
                              : 'border-transparent text-[#222] hover:border-[#222]'
                      } ${blocked ? '' : 'cursor-pointer'}`}
                      style={{ fontWeight: blocked ? 400 : 600 }}
                    >
                      {day.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
