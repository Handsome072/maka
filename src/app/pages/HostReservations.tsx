'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { HostSidebar } from '@/app/components/HostSidebar';
import { Search, ChevronDown, Eye, Calendar, Users } from 'lucide-react';

interface HostReservationsProps {
  onNavigate: (page: string, data?: Record<string, any>) => void;
}

type ReservationStatus = 'pending' | 'confirmed' | 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
type FilterTab = 'all' | ReservationStatus;

interface HostReservation {
  id: string;
  guest: {
    name: string;
    avatar: string;
    photo?: string;
  };
  property: { id: string; name: string; city: string };
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: string;
  status: ReservationStatus;
  bookedAt: string;
}

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  pending:     { label: 'En attente',  color: '#7C3AED', bg: '#F3E8FF' },
  confirmed:   { label: 'Confirmée',   color: '#B45309', bg: '#FEF3C7' },
  upcoming:    { label: 'À venir',     color: '#1E40AF', bg: '#DBEAFE' },
  in_progress: { label: 'En cours',    color: '#065F46', bg: '#D1FAE5' },
  completed:   { label: 'Terminée',    color: '#4B5563', bg: '#F3F4F6' },
  cancelled:   { label: 'Annulée',     color: '#991B1B', bg: '#FEE2E2' },
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',         label: 'Toutes' },
  { key: 'pending',     label: 'En attente' },
  { key: 'confirmed',   label: 'Confirmées' },
  { key: 'upcoming',    label: 'À venir' },
  { key: 'in_progress', label: 'En cours' },
  { key: 'completed',   label: 'Terminées' },
  { key: 'cancelled',   label: 'Annulées' },
];

// ─── Date helpers ────────────────────────────────────────────────────────────

function formatDisplayDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Compute the effective display status based on the original status and dates.
 * - pending, confirmed, cancelled → unchanged (not date-dependent)
 * - upcoming / in_progress / completed → recalculated from dates:
 *   - check-in in the future → upcoming
 *   - today between check-in and check-out → in_progress
 *   - after check-out → completed
 *
 * "confirmed" = paiement recemment valide (statut explicite de l'hote/systeme)
 * "upcoming"  = sejour futur deja planifie (derive automatiquement des dates)
 */
function computeEffectiveStatus(status: ReservationStatus, checkIn: string, checkOut: string): ReservationStatus {
  if (status === 'pending' || status === 'confirmed' || status === 'cancelled') return status;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ciDate = new Date(checkIn + 'T00:00:00');
  const coDate = new Date(checkOut + 'T00:00:00');

  if (today > coDate) return 'completed';
  if (today >= ciDate && today <= coDate) return 'in_progress';
  return 'upcoming';
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

// Dates calibrées par rapport à aujourd'hui (7 mars 2026) pour que chaque statut soit visible.
const MOCK_RESERVATIONS: HostReservation[] = [
  // ── En attente (pending) — demande envoyée, pas encore acceptée ──
  {
    id: 'RES-008',
    guest: { name: 'Élodie Tremblay', avatar: 'ET' },
    property: { id: 'P1', name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    checkIn: '2026-04-10',
    checkOut: '2026-04-15',
    guests: 3,
    amount: '1 890 C$',
    status: 'pending',
    bookedAt: '2026-03-06',
  },
  {
    id: 'RES-009',
    guest: { name: 'Hugo Lavoie', avatar: 'HL' },
    property: { id: 'P2', name: 'Appartement Vieux-Montréal', city: 'Montréal' },
    checkIn: '2026-04-18',
    checkOut: '2026-04-22',
    guests: 2,
    amount: '760 C$',
    status: 'pending',
    bookedAt: '2026-03-07',
  },
  // ── Confirmée (confirmed) — paiement validé récemment ──
  {
    id: 'RES-001',
    guest: { name: 'Alexandre Leroy', avatar: 'AL' },
    property: { id: 'P1', name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    checkIn: '2026-03-22',
    checkOut: '2026-03-29',
    guests: 4,
    amount: '2 450 C$',
    status: 'confirmed',
    bookedAt: '2026-03-05',
  },
  {
    id: 'RES-003',
    guest: { name: 'Lucas Bouchard', avatar: 'LB' },
    property: { id: 'P1', name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    checkIn: '2026-03-15',
    checkOut: '2026-03-20',
    guests: 6,
    amount: '1 750 C$',
    status: 'confirmed',
    bookedAt: '2026-02-28',
  },
  // ── À venir (upcoming) — confirmée, séjour futur planifié ──
  {
    id: 'RES-007',
    guest: { name: 'Marc Rousseau', avatar: 'MR' },
    property: { id: 'P1', name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    checkIn: '2026-03-28',
    checkOut: '2026-04-04',
    guests: 4,
    amount: '2 800 C$',
    status: 'upcoming',
    bookedAt: '2026-03-01',
  },
  {
    id: 'RES-010',
    guest: { name: 'Nathalie Gagnon', avatar: 'NG' },
    property: { id: 'P2', name: 'Appartement Vieux-Montréal', city: 'Montréal' },
    checkIn: '2026-03-20',
    checkOut: '2026-03-25',
    guests: 2,
    amount: '1 150 C$',
    status: 'upcoming',
    bookedAt: '2026-02-15',
  },
  // ── En cours (in_progress) — voyageur dans le logement (7 mars entre 5 et 10 mars) ──
  {
    id: 'RES-002',
    guest: { name: 'Camille Bernard', avatar: 'CB' },
    property: { id: 'P2', name: 'Appartement Vieux-Montréal', city: 'Montréal' },
    checkIn: '2026-03-05',
    checkOut: '2026-03-10',
    guests: 2,
    amount: '980 C$',
    status: 'in_progress',
    bookedAt: '2026-02-20',
  },
  {
    id: 'RES-011',
    guest: { name: 'Pierre Côté', avatar: 'PC' },
    property: { id: 'P1', name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    checkIn: '2026-03-04',
    checkOut: '2026-03-11',
    guests: 5,
    amount: '3 200 C$',
    status: 'in_progress',
    bookedAt: '2026-02-18',
  },
  // ── Terminée (completed) — séjour passé ──
  {
    id: 'RES-004',
    guest: { name: 'Sophie Moreau', avatar: 'SM' },
    property: { id: 'P2', name: 'Appartement Vieux-Montréal', city: 'Montréal' },
    checkIn: '2026-02-10',
    checkOut: '2026-02-14',
    guests: 2,
    amount: '720 C$',
    status: 'completed',
    bookedAt: '2026-01-25',
  },
  {
    id: 'RES-005',
    guest: { name: 'Thomas Dubois', avatar: 'TD' },
    property: { id: 'P1', name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    checkIn: '2026-02-01',
    checkOut: '2026-02-08',
    guests: 5,
    amount: '3 150 C$',
    status: 'completed',
    bookedAt: '2026-01-15',
  },
  // ── Annulée (cancelled) ──
  {
    id: 'RES-006',
    guest: { name: 'Julie Martin', avatar: 'JM' },
    property: { id: 'P2', name: 'Appartement Vieux-Montréal', city: 'Montréal' },
    checkIn: '2026-02-20',
    checkOut: '2026-02-25',
    guests: 3,
    amount: '1 120 C$',
    status: 'cancelled',
    bookedAt: '2026-02-05',
  },
  {
    id: 'RES-012',
    guest: { name: 'François Bélanger', avatar: 'FB' },
    property: { id: 'P1', name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    checkIn: '2026-03-01',
    checkOut: '2026-03-05',
    guests: 4,
    amount: '1 400 C$',
    status: 'cancelled',
    bookedAt: '2026-02-10',
  },
];

const PROPERTIES = [...new Map(MOCK_RESERVATIONS.map(r => [r.property.id, r.property])).values()];

export function HostReservations({ onNavigate }: HostReservationsProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [reservations] = useState(MOCK_RESERVATIONS);

  // Compute effective statuses based on dates
  const reservationsWithStatus = useMemo(() => {
    return reservations.map(r => ({
      ...r,
      effectiveStatus: computeEffectiveStatus(r.status, r.checkIn, r.checkOut),
    }));
  }, [reservations]);

  const filtered = useMemo(() => {
    return reservationsWithStatus.filter(r => {
      if (activeFilter !== 'all' && r.effectiveStatus !== activeFilter) return false;
      if (propertyFilter !== 'all' && r.property.id !== propertyFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !r.guest.name.toLowerCase().includes(q) &&
          !r.property.name.toLowerCase().includes(q) &&
          !r.id.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [reservationsWithStatus, activeFilter, propertyFilter, searchQuery]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: reservationsWithStatus.length };
    for (const r of reservationsWithStatus) {
      counts[r.effectiveStatus] = (counts[r.effectiveStatus] || 0) + 1;
    }
    return counts;
  }, [reservationsWithStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HostSidebar activePage="host-reservations" />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl mb-6 md:mb-8 mt-16 lg:mt-0" style={{ fontWeight: 600, color: '#222222' }}>
          Réservations
        </h1>

        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un voyageur, une annonce..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900 bg-white"
              style={{ color: '#222222' }}
            />
          </div>

          {/* Property filter */}
          <div className="relative">
            <button
              onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 transition-colors"
              style={{ color: '#222222', fontWeight: 500 }}
            >
              <span>{propertyFilter === 'all' ? 'Toutes les annonces' : PROPERTIES.find(p => p.id === propertyFilter)?.name}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showPropertyDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[220px]">
                <button
                  onClick={() => { setPropertyFilter('all'); setShowPropertyDropdown(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                  style={{ fontWeight: propertyFilter === 'all' ? 600 : 400, color: '#222222' }}
                >
                  Toutes les annonces
                </button>
                {PROPERTIES.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setPropertyFilter(p.id); setShowPropertyDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-t border-gray-100"
                    style={{ fontWeight: propertyFilter === p.id ? 600 : 400, color: '#222222' }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className="px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors flex items-center gap-1.5"
              style={{
                fontWeight: 600,
                backgroundColor: activeFilter === tab.key ? '#222222' : 'white',
                color: activeFilter === tab.key ? 'white' : '#222222',
                borderColor: activeFilter === tab.key ? '#222222' : '#DDDDDD',
              }}
            >
              {tab.label}
              {(tabCounts[tab.key] || 0) > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: activeFilter === tab.key ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
                    color: activeFilter === tab.key ? 'white' : '#6B7280',
                    fontWeight: 600,
                  }}
                >
                  {tabCounts[tab.key] || 0}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
              Aucune réservation
            </h2>
            <p className="text-sm" style={{ color: '#717171' }}>
              {searchQuery || propertyFilter !== 'all'
                ? 'Aucun résultat pour ces filtres.'
                : 'Les réservations de vos voyageurs apparaîtront ici.'}
            </p>
          </div>
        )}

        {/* Reservations table - desktop */}
        {filtered.length > 0 && (
          <>
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs" style={{ fontWeight: 600, color: '#6B7280' }}>Voyageur</th>
                    <th className="text-left px-5 py-3 text-xs" style={{ fontWeight: 600, color: '#6B7280' }}>Annonce</th>
                    <th className="text-left px-5 py-3 text-xs" style={{ fontWeight: 600, color: '#6B7280' }}>Check-in</th>
                    <th className="text-left px-5 py-3 text-xs" style={{ fontWeight: 600, color: '#6B7280' }}>Check-out</th>
                    <th className="text-center px-5 py-3 text-xs" style={{ fontWeight: 600, color: '#6B7280' }}>Voyageurs</th>
                    <th className="text-right px-5 py-3 text-xs" style={{ fontWeight: 600, color: '#6B7280' }}>Montant</th>
                    <th className="text-left px-5 py-3 text-xs" style={{ fontWeight: 600, color: '#6B7280' }}>Statut</th>
                    <th className="text-left px-5 py-3 text-xs" style={{ fontWeight: 600, color: '#6B7280' }}>Réservé le</th>
                    <th className="text-center px-5 py-3 text-xs" style={{ fontWeight: 600, color: '#6B7280' }}>Détails</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(reservation => {
                    const statusInfo = STATUS_CONFIG[reservation.effectiveStatus];
                    return (
                      <tr
                        key={reservation.id}
                        onClick={() => router.push(`/annonces/reservations/${reservation.id}`)}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {/* Guest */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                              style={{ fontWeight: 600, backgroundColor: '#222222' }}
                            >
                              {reservation.guest.avatar}
                            </div>
                            <span className="text-sm truncate max-w-[100px]" style={{ fontWeight: 500, color: '#222222' }}>
                              {reservation.guest.name}
                            </span>
                          </div>
                        </td>

                        {/* Property */}
                        <td className="px-5 py-4">
                          <div className="min-w-0">
                            <p className="text-sm truncate max-w-[160px]" style={{ fontWeight: 500, color: '#222222' }}>
                              {reservation.property.name}
                            </p>
                            <p className="text-xs" style={{ color: '#717171' }}>{reservation.property.city}</p>
                          </div>
                        </td>

                        {/* Check-in */}
                        <td className="px-5 py-4">
                          <span className="text-sm" style={{ color: '#222222' }}>{formatDisplayDate(reservation.checkIn)}</span>
                        </td>

                        {/* Check-out */}
                        <td className="px-5 py-4">
                          <span className="text-sm" style={{ color: '#222222' }}>{formatDisplayDate(reservation.checkOut)}</span>
                        </td>

                        {/* Guests count */}
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm" style={{ color: '#222222' }}>{reservation.guests}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4 text-right">
                          <span className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{reservation.amount}</span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className="inline-block px-2.5 py-1 rounded-full text-xs"
                            style={{ fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color }}
                          >
                            {statusInfo.label}
                          </span>
                        </td>

                        {/* Booked at */}
                        <td className="px-5 py-4">
                          <span className="text-sm" style={{ color: '#717171' }}>{formatDisplayDate(reservation.bookedAt)}</span>
                        </td>

                        {/* Détails */}
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/annonces/reservations/${reservation.id}`); }}
                            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Reservations cards - mobile */}
            <div className="md:hidden space-y-3">
              {filtered.map(reservation => {
                const statusInfo = STATUS_CONFIG[reservation.effectiveStatus];
                return (
                  <div
                    key={reservation.id}
                    className="bg-white border border-gray-200 rounded-xl p-4"
                  >
                    {/* Header: guest + status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                          style={{ fontWeight: 600, backgroundColor: '#222222' }}
                        >
                          {reservation.guest.avatar}
                        </div>
                        <div>
                          <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{reservation.guest.name}</p>
                          <p className="text-xs" style={{ color: '#717171' }}>{reservation.guests} voyageur{reservation.guests > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-xs"
                        style={{ fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Property */}
                    <p className="text-sm mb-2" style={{ fontWeight: 500, color: '#222222' }}>
                      {reservation.property.name}
                    </p>

                    {/* Dates & amount */}
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span style={{ color: '#717171' }}>
                        {formatDisplayDate(reservation.checkIn)} → {formatDisplayDate(reservation.checkOut)}
                      </span>
                      <span style={{ fontWeight: 600, color: '#222222' }}>{reservation.amount}</span>
                    </div>

                    <p className="text-xs mb-3" style={{ color: '#9CA3AF' }}>Réservé le {formatDisplayDate(reservation.bookedAt)}</p>

                    {/* Action */}
                    <button
                      onClick={() => router.push(`/annonces/reservations/${reservation.id}`)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                      style={{ fontWeight: 600, color: '#222222' }}
                    >
                      <Eye className="w-4 h-4" />
                      Voir détails
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-4 text-sm" style={{ color: '#717171' }}>
              {filtered.length} réservation{filtered.length > 1 ? 's' : ''}
              {activeFilter !== 'all' && ` · ${FILTER_TABS.find(t => t.key === activeFilter)?.label}`}
            </div>
          </>
        )}
      </main>

    </div>
  );
}
