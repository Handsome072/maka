'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, Users } from 'lucide-react';
import { reservationsApi, type ReservationData, type ReservationPhase } from '@/app/services/api';
import { ReservationStatusBadge } from '@/app/components/booking/ReservationStatusBadge';
import { formatDateTime, formatMoney, formatStayRange } from '@/app/components/booking/format';

/** Sections de la page, dans l'ordre d'affichage. */
const SECTIONS: { title: string; phases: ReservationPhase[]; muted?: boolean }[] = [
  { title: "EN ATTENTE DE L'HÔTE", phases: ['pending'] },
  { title: 'À VENIR', phases: ['ongoing', 'upcoming'] },
  { title: 'PASSÉES', phases: ['past'], muted: true },
  { title: 'ANNULÉES, REFUSÉES OU EXPIRÉES', phases: ['cancelled', 'declined', 'expired'], muted: true },
];

/** Jours entre aujourd'hui et une date de séjour (l'API la sérialise « 2026-10-18T00:00:00.000000Z »). */
function daysUntil(date: string): number {
  const today = new Date();
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((Date.parse(`${date.slice(0, 10)}T00:00:00Z`) - start) / 86_400_000);
}

function ReservationCard({ reservation, muted }: { reservation: ReservationData; muted?: boolean }) {
  const listing = reservation.listing;
  const days = daysUntil(reservation.check_in);
  const hint =
    reservation.phase === 'pending'
      ? `Réponse attendue avant le ${formatDateTime(reservation.expires_at)}`
      : reservation.phase === 'upcoming'
        ? days <= 1
          ? days === 1 ? 'Arrivée demain' : "Arrivée aujourd'hui"
          : `Arrivée dans ${days} jours`
        : null;

  return (
    <Link
      href={`/client-space/reservations/${reservation.id}`}
      className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow ${
        muted ? 'opacity-80' : ''
      }`}
    >
      {listing?.cover_photo_url ? (
        <img
          src={listing.cover_photo_url}
          alt={listing.title}
          className={`w-full md:w-48 h-40 md:h-32 object-cover rounded-lg flex-shrink-0 ${muted ? 'grayscale-[40%]' : ''}`}
        />
      ) : (
        <div className="w-full md:w-48 h-40 md:h-32 rounded-lg bg-gray-100 flex-shrink-0" />
      )}

      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h4 className="text-base font-medium" style={{ color: muted ? '#6B7280' : '#4A5B8C' }}>
            {listing?.title ?? 'Logement'}
          </h4>
          <ReservationStatusBadge phase={reservation.phase} className="shrink-0" />
        </div>
        <p className="text-xs text-gray-500 mb-3">{[listing?.city, listing?.province].filter(Boolean).join(', ')}</p>
        <div className="flex items-center gap-4 flex-wrap text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {formatStayRange(reservation.check_in, reservation.check_out)} · {reservation.nights_count} nuit
            {reservation.nights_count > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {reservation.guests_count} voyageur{reservation.guests_count > 1 ? 's' : ''}
          </span>
          <span className="font-mono">{reservation.confirmation_code}</span>
        </div>
        {hint && <p className="text-xs mt-3" style={{ fontWeight: 600, color: '#222222' }}>{hint}</p>}
      </div>

      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 md:min-w-[120px]">
        <span className="text-[10px] text-gray-500 uppercase" style={{ fontWeight: 600 }}>Total</span>
        <span className="text-lg" style={{ fontWeight: 700, color: muted ? '#6B7280' : '#222222' }}>
          {formatMoney(reservation.total_price, reservation.currency)}
        </span>
      </div>
    </Link>
  );
}

export function ClientReservations() {
  const [reservations, setReservations] = useState<ReservationData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    reservationsApi
      .getMyReservations()
      .then((res) => !cancelled && setReservations(res.reservations))
      .catch(() => !cancelled && setError('Impossible de charger vos réservations. Réessayez dans un instant.'));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8 w-full">
      <div className="mb-8">
        <h2 className="text-lg md:text-2xl" style={{ fontWeight: 600, color: '#222222' }}>
          Mes réservations
        </h2>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!error && reservations === null && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      )}

      {reservations && reservations.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-base mb-2" style={{ fontWeight: 600 }}>Aucune réservation pour le moment</p>
          <p className="text-sm text-gray-600 mb-6">Vos séjours réservés et vos demandes en cours apparaîtront ici.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg" style={{ fontWeight: 600 }}>
            Trouver un logement
          </Link>
        </div>
      )}

      {reservations &&
        SECTIONS.map((section) => {
          const items = reservations
            .filter((reservation) => section.phases.includes(reservation.phase))
            // À venir et en attente : la plus proche d'abord ; passées et annulées : la plus récente d'abord
            .sort((a, b) =>
              section.muted ? b.check_in.localeCompare(a.check_in) : a.check_in.localeCompare(b.check_in),
            );
          if (items.length === 0) return null;
          return (
            <div key={section.title} className="mb-8">
              <h3
                className="text-xs mb-4"
                style={{ fontWeight: 700, color: section.muted ? '#9CA3AF' : '#4A5B8C', letterSpacing: '0.5px' }}
              >
                {section.title}
              </h3>
              <div className="space-y-4">
                {items.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} muted={section.muted} />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}
