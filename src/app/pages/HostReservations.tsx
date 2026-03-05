import { useState } from 'react';

interface HostReservationsProps {
  onNavigate: (page: string, data?: Record<string, any>) => void;
}

type ReservationStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
type FilterTab = 'all' | ReservationStatus;

interface HostReservation {
  id: string;
  guest: { name: string; avatar: string };
  property: { name: string; city: string };
  dates: { arrival: string; departure: string };
  guests: number;
  amount: string;
  status: ReservationStatus;
}

const STATUS_CONFIG: Record<ReservationStatus, { label: string; color: string; bg: string }> = {
  upcoming:    { label: 'À venir',    color: '#B45309', bg: '#FEF3C7' },
  in_progress: { label: 'En cours',   color: '#065F46', bg: '#D1FAE5' },
  completed:   { label: 'Terminée',   color: '#4B5563', bg: '#F3F4F6' },
  cancelled:   { label: 'Annulée',    color: '#991B1B', bg: '#FEE2E2' },
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',         label: 'Toutes' },
  { key: 'upcoming',    label: 'À venir' },
  { key: 'in_progress', label: 'En cours' },
  { key: 'completed',   label: 'Terminées' },
  { key: 'cancelled',   label: 'Annulées' },
];

const MOCK_RESERVATIONS: HostReservation[] = [
  {
    id: 'RES-001',
    guest: { name: 'Alexandre Leroy', avatar: 'AL' },
    property: { name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    dates: { arrival: '22 mars 2026', departure: '29 mars 2026' },
    guests: 4,
    amount: '2 450 $',
    status: 'upcoming',
  },
  {
    id: 'RES-002',
    guest: { name: 'Camille Bernard', avatar: 'CB' },
    property: { name: 'Appartement Vieux-Montréal', city: 'Montréal' },
    dates: { arrival: '3 mars 2026', departure: '8 mars 2026' },
    guests: 2,
    amount: '980 $',
    status: 'in_progress',
  },
  {
    id: 'RES-003',
    guest: { name: 'Lucas Bouchard', avatar: 'LB' },
    property: { name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    dates: { arrival: '15 mars 2026', departure: '20 mars 2026' },
    guests: 6,
    amount: '1 750 $',
    status: 'upcoming',
  },
  {
    id: 'RES-004',
    guest: { name: 'Sophie Moreau', avatar: 'SM' },
    property: { name: 'Appartement Vieux-Montréal', city: 'Montréal' },
    dates: { arrival: '10 fév. 2026', departure: '14 fév. 2026' },
    guests: 2,
    amount: '720 $',
    status: 'completed',
  },
  {
    id: 'RES-005',
    guest: { name: 'Thomas Dubois', avatar: 'TD' },
    property: { name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    dates: { arrival: '1 fév. 2026', departure: '8 fév. 2026' },
    guests: 5,
    amount: '3 150 $',
    status: 'completed',
  },
  {
    id: 'RES-006',
    guest: { name: 'Julie Martin', avatar: 'JM' },
    property: { name: 'Appartement Vieux-Montréal', city: 'Montréal' },
    dates: { arrival: '20 fév. 2026', departure: '25 fév. 2026' },
    guests: 3,
    amount: '1 120 $',
    status: 'cancelled',
  },
  {
    id: 'RES-007',
    guest: { name: 'Marc Rousseau', avatar: 'MR' },
    property: { name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    dates: { arrival: '28 mars 2026', departure: '4 avr. 2026' },
    guests: 4,
    amount: '2 800 $',
    status: 'upcoming',
  },
];

export function HostReservations({ onNavigate }: HostReservationsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filtered = activeFilter === 'all'
    ? MOCK_RESERVATIONS
    : MOCK_RESERVATIONS.filter(r => r.status === activeFilter);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between z-20">
        <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
          <img src="/logo.png" alt="HOMIQIO Logo" className="w-[120px] h-auto" />
        </button>
        <div className="flex items-center gap-8">
          <nav className="flex gap-8">
            <button
              className="text-sm hover:opacity-70 transition-opacity"
              style={{ fontWeight: 600, color: '#717171' }}
              onClick={() => onNavigate('host-dashboard')}
            >
              Aujourd&apos;hui
            </button>
            <button className="text-sm border-b-2 border-gray-900 pb-3" style={{ fontWeight: 600, color: '#222222' }}>
              Réservations
            </button>
            <button
              className="text-sm hover:opacity-70 transition-opacity"
              style={{ fontWeight: 600, color: '#717171' }}
              onClick={() => onNavigate('annonces')}
            >
              Annonces
            </button>
            <button
              className="text-sm hover:opacity-70 transition-opacity"
              style={{ fontWeight: 600, color: '#717171' }}
              onClick={() => onNavigate('messages')}
            >
              Boîte de réception
            </button>
            <button
              className="text-sm hover:opacity-70 transition-opacity"
              style={{ fontWeight: 600, color: '#717171' }}
              onClick={() => onNavigate('host-calendar')}
            >
              Calendrier
            </button>
          </nav>
          <button
            onClick={() => onNavigate('logements')}
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Passer en mode voyageur
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white" style={{ fontWeight: 600 }}>
            H
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-3xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
          Vos réservations
        </h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className="px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors"
              style={{
                fontWeight: 600,
                backgroundColor: activeFilter === tab.key ? '#222222' : 'white',
                color: activeFilter === tab.key ? 'white' : '#222222',
                borderColor: activeFilter === tab.key ? '#222222' : '#DDDDDD',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
              Aucune réservation
            </h2>
            <p className="text-sm" style={{ color: '#717171' }}>
              Les réservations de vos voyageurs apparaîtront ici.
            </p>
          </div>
        )}

        {/* Reservations List */}
        {filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map(reservation => {
              const statusInfo = STATUS_CONFIG[reservation.status];
              return (
                <div
                  key={reservation.id}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Guest info */}
                    <div className="flex items-center gap-3 md:w-52 flex-shrink-0">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0"
                        style={{ fontWeight: 600, backgroundColor: '#222222' }}
                      >
                        {reservation.guest.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm truncate" style={{ fontWeight: 600, color: '#222222' }}>
                          {reservation.guest.name}
                        </p>
                        <p className="text-xs" style={{ color: '#717171' }}>
                          {reservation.guests} voyageur{reservation.guests > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Property */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ fontWeight: 600, color: '#222222' }}>
                        {reservation.property.name}
                      </p>
                      <p className="text-xs" style={{ color: '#717171' }}>
                        {reservation.property.city}
                      </p>
                    </div>

                    {/* Dates */}
                    <div className="md:w-56 flex-shrink-0">
                      <p className="text-sm" style={{ color: '#222222' }}>
                        {reservation.dates.arrival}
                        <span style={{ color: '#717171' }}> → </span>
                        {reservation.dates.departure}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="md:w-24 flex-shrink-0 md:text-right">
                      <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                        {reservation.amount}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="md:w-24 flex-shrink-0">
                      <span
                        className="inline-block px-3 py-1 rounded-full text-xs"
                        style={{ fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onNavigate('messages')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-xs hover:border-gray-900 transition-colors"
                        style={{ fontWeight: 600, color: '#222222' }}
                      >
                        Contacter
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
