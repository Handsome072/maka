'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { X, Lock, Unlock, CalendarDays } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  CalendarDate,
  CalendarReservation,
  DATE_STATUS_CONFIG,
  DateStatus,
} from './types';

export interface PanelContentProps {
  selectedDates: Set<string>;
  calendarDates: CalendarDate[];
  reservations: CalendarReservation[];
  basePrice: number;
  currency: string;
  /** Logement affiché : lien vers la modification de son tarif. */
  listingId: number | null;
  /** Blocage en cours d'enregistrement. */
  busy?: boolean;
  onBlock: () => void;
  onUnblock: () => void;
}

export function PanelContent({
  selectedDates,
  calendarDates,
  reservations,
  basePrice,
  currency,
  listingId,
  busy = false,
  onBlock,
  onUnblock,
}: PanelContentProps) {
  const sortedDates = useMemo(
    () => Array.from(selectedDates).sort(),
    [selectedDates]
  );

  const dateMap = useMemo(() => {
    const map = new Map<string, CalendarDate>();
    calendarDates.forEach((d) => map.set(d.date, d));
    return map;
  }, [calendarDates]);

  // Determine common status
  const statuses = useMemo(() => {
    const set = new Set<DateStatus>();
    sortedDates.forEach((d) => {
      const cd = dateMap.get(d);
      if (cd) set.add(cd.status);
    });
    return set;
  }, [sortedDates, dateMap]);

  const commonStatus: DateStatus | 'mixed' =
    statuses.size === 1 ? Array.from(statuses)[0] : 'mixed';

  const hasOnlyReserved = statuses.size === 1 && statuses.has('reserved');

  // Find overlapping reservation
  const overlappingReservation = useMemo(() => {
    const resIds = new Set<string>();
    sortedDates.forEach((d) => {
      const cd = dateMap.get(d);
      if (cd?.reservationId) resIds.add(cd.reservationId);
    });
    if (resIds.size === 0) return null;
    return reservations.find((r) => resIds.has(r.id)) || null;
  }, [sortedDates, dateMap, reservations]);

  // Format date range header
  const headerText = useMemo(() => {
    const count = sortedDates.length;
    if (count === 0) return '';
    if (count === 1) {
      return format(parseISO(sortedDates[0]), 'd MMMM yyyy', { locale: fr });
    }
    const first = format(parseISO(sortedDates[0]), 'd MMM', { locale: fr });
    const last = format(parseISO(sortedDates[count - 1]), 'd MMM yyyy', { locale: fr });
    return `${first} — ${last}`;
  }, [sortedDates]);

  const selectionLabel = sortedDates.length === 1
    ? '1 date sélectionnée'
    : `${sortedDates.length} dates sélectionnées`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs mb-1" style={{ color: '#717171', fontWeight: 500 }}>
          {selectionLabel}
        </p>
        <p className="text-sm" style={{ color: '#222222', fontWeight: 600 }}>
          {headerText}
        </p>
      </div>

      {/* Status section */}
      <div className="space-y-3">
        <p className="text-xs" style={{ color: '#717171', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Statut
        </p>
        {commonStatus === 'mixed' ? (
          <span
            className="inline-block px-3 py-1 rounded-full text-xs"
            style={{ fontWeight: 600, backgroundColor: '#F3F4F6', color: '#6B7280' }}
          >
            Statuts mixtes
          </span>
        ) : (
          <span
            className="inline-block px-3 py-1 rounded-full text-xs"
            style={{
              fontWeight: 600,
              backgroundColor: DATE_STATUS_CONFIG[commonStatus].bg,
              color: DATE_STATUS_CONFIG[commonStatus].color,
            }}
          >
            {DATE_STATUS_CONFIG[commonStatus].label}
          </span>
        )}

        {/* Block / Unblock buttons */}
        {!hasOnlyReserved && (
          <div className="flex gap-2">
            {(commonStatus === 'available' || commonStatus === 'mixed') && (
              <button
                onClick={onBlock}
                disabled={busy}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors hover:bg-red-50 disabled:opacity-50"
                style={{ fontWeight: 600, color: '#991B1B', borderColor: '#FECACA' }}
              >
                <Lock className="w-4 h-4" />
                Bloquer
              </button>
            )}
            {(commonStatus === 'blocked' || commonStatus === 'mixed') && (
              <button
                onClick={onUnblock}
                disabled={busy}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-colors hover:bg-green-50 disabled:opacity-50"
                style={{ fontWeight: 600, color: '#166534', borderColor: '#BBF7D0' }}
              >
                <Unlock className="w-4 h-4" />
                Débloquer
              </button>
            )}
          </div>
        )}
      </div>

      {/* Prix : le tarif de base de l'annonce s'applique à toutes les nuits */}
      {!hasOnlyReserved && (
        <div className="space-y-2">
          <p className="text-xs" style={{ color: '#717171', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Prix par nuit
          </p>
          <p className="text-sm" style={{ color: '#222222', fontWeight: 600 }}>
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency || 'EUR' }).format(basePrice)}
          </p>
          <p className="text-xs" style={{ color: '#717171' }}>
            Tarif de base de l&apos;annonce, appliqué à toutes les nuits.
          </p>
          {listingId && (
            <Link href={`/annonces/edit?id=${listingId}`} className="text-xs underline" style={{ color: '#222222', fontWeight: 600 }}>
              Modifier le tarif dans l&apos;annonce
            </Link>
          )}
        </div>
      )}

      {/* Reservation info (read-only) */}
      {overlappingReservation && (
        <div className="space-y-3">
          <p className="text-xs" style={{ color: '#717171', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Réservation
          </p>
          <div
            className="rounded-xl border p-4 space-y-2"
            style={{ borderColor: '#E5E7EB' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                style={{ fontWeight: 600, backgroundColor: '#222222' }}
              >
                {overlappingReservation.guestName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                  {overlappingReservation.guestName}
                </p>
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-[10px] mt-0.5"
                  style={{
                    fontWeight: 600,
                    backgroundColor:
                      overlappingReservation.status === 'confirmed'
                        ? '#D1FAE5'
                        : overlappingReservation.status === 'pending'
                          ? '#FEF3C7'
                          : '#F3F4F6',
                    color:
                      overlappingReservation.status === 'confirmed'
                        ? '#065F46'
                        : overlappingReservation.status === 'pending'
                          ? '#B45309'
                          : '#4B5563',
                  }}
                >
                  {overlappingReservation.status === 'confirmed'
                    ? 'Confirmée'
                    : overlappingReservation.status === 'pending'
                      ? 'En attente'
                      : 'Annulée'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: '#717171' }}>
              <CalendarDays className="w-3.5 h-3.5" />
              <span>
                {format(parseISO(overlappingReservation.checkIn), 'd MMM', { locale: fr })}
                {' → '}
                {format(parseISO(overlappingReservation.checkOut), 'd MMM yyyy', { locale: fr })}
              </span>
            </div>
            <Link
              href={`/annonces/reservations/${overlappingReservation.id}`}
              className="inline-block text-xs underline pt-1"
              style={{ color: '#222222', fontWeight: 600 }}
            >
              {overlappingReservation.status === 'pending' ? 'Répondre à la demande' : 'Voir la réservation'}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Desktop side panel wrapper ─────────────────────────────────────────────────

interface DateSidePanelProps extends PanelContentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DateSidePanel({ isOpen, onClose, ...contentProps }: DateSidePanelProps) {
  return (
    <div
      className={`
        hidden lg:block fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg
        transition-transform duration-300 z-30
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="p-6 h-full overflow-y-auto">
        {/* Close button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
            Détails
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" style={{ color: '#717171' }} />
          </button>
        </div>

        <PanelContent {...contentProps} />
      </div>
    </div>
  );
}
