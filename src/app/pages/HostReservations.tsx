'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HostSidebar } from '@/app/components/HostSidebar';
import { Search, ChevronDown, Eye, Calendar, Users, Clock } from 'lucide-react';
import { hostReservationsApi, type ReservationData, type ReservationPhase } from '@/app/services/api';
import { HOST_PHASE_LABELS, ReservationStatusBadge } from '@/app/components/booking/ReservationStatusBadge';
import { formatDateTime, formatMoney, formatStayRange, formatTimeLeft, hostAmount } from '@/app/components/booking/format';

interface HostReservationsProps {
  onNavigate?: (page: string, data?: Record<string, any>) => void;
}

type FilterTab = 'all' | 'pending' | 'upcoming' | 'ongoing' | 'past' | 'closed';

const FILTER_TABS: { key: FilterTab; label: string; phases: ReservationPhase[] }[] = [
  { key: 'all', label: 'Toutes', phases: [] },
  { key: 'pending', label: 'À traiter', phases: ['pending'] },
  { key: 'upcoming', label: 'À venir', phases: ['upcoming'] },
  { key: 'ongoing', label: 'En cours', phases: ['ongoing'] },
  { key: 'past', label: 'Terminées', phases: ['past'] },
  { key: 'closed', label: 'Annulées / refusées', phases: ['cancelled', 'declined', 'expired'] },
];

function formatDay(date: string): string {
  return new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString('fr-FR', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function guestName(reservation: ReservationData): string {
  const guest = reservation.guest;
  if (!guest) return 'Voyageur';
  return [guest.first_name, guest.last_name].filter(Boolean).join(' ');
}

function GuestAvatar({ reservation, size = 'w-9 h-9' }: { reservation: ReservationData; size?: string }) {
  const guest = reservation.guest;
  if (guest?.profile_photo_url) {
    return <img src={guest.profile_photo_url} alt={guest.first_name} className={`${size} rounded-full object-cover flex-shrink-0`} />;
  }
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center text-white text-xs flex-shrink-0`}
      style={{ fontWeight: 600, backgroundColor: '#222222' }}
    >
      {(guest?.first_name ?? 'V').charAt(0).toUpperCase()}
      {(guest?.last_name ?? '').charAt(0).toUpperCase()}
    </div>
  );
}

export function HostReservations(_props: HostReservationsProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState<number | 'all'>('all');
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [reservations, setReservations] = useState<ReservationData[] | null>(null);
  const [listings, setListings] = useState<{ id: number; title: string | null }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    hostReservationsApi
      .getAll()
      .then((res) => {
        if (cancelled) return;
        setReservations(res.reservations);
        setListings(res.listings);
      })
      .catch(() => !cancelled && setError('Impossible de charger vos réservations. Réessayez dans un instant.'));
    return () => {
      cancelled = true;
    };
  }, []);

  const all = useMemo(() => reservations ?? [], [reservations]);
  const pendingRequests = useMemo(
    () =>
      all
        .filter((r) => r.phase === 'pending')
        // L'échéance la plus proche d'abord
        .sort((a, b) => String(a.expires_at).localeCompare(String(b.expires_at))),
    [all],
  );

  const filtered = useMemo(() => {
    const tab = FILTER_TABS.find((t) => t.key === activeFilter)!;
    const q = searchQuery.trim().toLowerCase();
    return all.filter((r) => {
      if (tab.phases.length > 0 && !tab.phases.includes(r.phase)) return false;
      if (propertyFilter !== 'all' && r.listing_id !== propertyFilter) return false;
      if (q) {
        const haystack = [guestName(r), r.listing?.title ?? '', r.confirmation_code].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [all, activeFilter, propertyFilter, searchQuery]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tab of FILTER_TABS) {
      counts[tab.key] = tab.phases.length === 0 ? all.length : all.filter((r) => tab.phases.includes(r.phase)).length;
    }
    return counts;
  }, [all]);

  const openReservation = (id: number) => router.push(`/annonces/reservations/${id}`);

  return (
    <div className="min-h-screen bg-gray-50">
      <HostSidebar activePage="host-reservations" />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl mb-6 md:mb-8 mt-16 lg:mt-0" style={{ fontWeight: 600, color: '#222222' }}>
          Réservations
        </h1>

        {error && <p className="text-sm text-red-600 mb-6">{error}</p>}

        {!error && reservations === null && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        )}

        {/* Demandes à traiter */}
        {pendingRequests.length > 0 && (
          <section className="mb-8">
            <h2 className="text-base mb-3" style={{ fontWeight: 600, color: '#222222' }}>
              {pendingRequests.length} demande{pendingRequests.length > 1 ? 's' : ''} à traiter
            </h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {pendingRequests.map((r) => {
                const left = formatTimeLeft(r.expires_at);
                return (
                  <button
                    key={r.id}
                    onClick={() => openReservation(r.id)}
                    className="text-left bg-white border border-amber-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <GuestAvatar reservation={r} size="w-10 h-10" />
                        <div className="min-w-0">
                          <p className="text-sm truncate" style={{ fontWeight: 600, color: '#222222' }}>{guestName(r)}</p>
                          <p className="text-xs truncate" style={{ color: '#717171' }}>{r.listing?.title}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-amber-800 whitespace-nowrap" style={{ fontWeight: 600 }}>
                        <Clock className="w-3.5 h-3.5" />
                        {left ? `${left} pour répondre` : 'Délai dépassé'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: '#222222' }}>
                        {formatStayRange(r.check_in, r.check_out)} · {r.guests_count} voyageur{r.guests_count > 1 ? 's' : ''}
                      </span>
                      <span style={{ fontWeight: 600, color: '#222222' }}>{formatMoney(hostAmount(r), r.currency)}</span>
                    </div>
                    {r.guest_message && (
                      <p className="text-xs mt-2 line-clamp-2" style={{ color: '#717171' }}>« {r.guest_message} »</p>
                    )}
                    <p className="text-xs mt-3" style={{ color: '#9CA3AF' }}>
                      Répondez avant le {formatDateTime(r.expires_at)}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {reservations !== null && (
          <>
            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un voyageur, une annonce, un n° de réservation…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900 bg-white"
                  style={{ color: '#222222' }}
                />
              </div>

              {listings.length > 1 && (
                <div className="relative">
                  <button
                    onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white hover:border-gray-400 transition-colors"
                    style={{ color: '#222222', fontWeight: 500 }}
                  >
                    <span className="truncate max-w-[220px]">
                      {propertyFilter === 'all' ? 'Toutes les annonces' : listings.find((l) => l.id === propertyFilter)?.title}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  {showPropertyDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[220px]">
                      <button
                        onClick={() => {
                          setPropertyFilter('all');
                          setShowPropertyDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                        style={{ fontWeight: propertyFilter === 'all' ? 600 : 400, color: '#222222' }}
                      >
                        Toutes les annonces
                      </button>
                      {listings.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => {
                            setPropertyFilter(l.id);
                            setShowPropertyDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-t border-gray-100"
                          style={{ fontWeight: propertyFilter === l.id ? 600 : 400, color: '#222222' }}
                        >
                          {l.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Onglets */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {FILTER_TABS.map((tab) => (
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
                  {tabCounts[tab.key] > 0 && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: activeFilter === tab.key ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
                        color: activeFilter === tab.key ? 'white' : '#6B7280',
                        fontWeight: 600,
                      }}
                    >
                      {tabCounts[tab.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-24">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  Aucune réservation
                </h2>
                <p className="text-sm" style={{ color: '#717171' }}>
                  {searchQuery || propertyFilter !== 'all' || activeFilter !== 'all'
                    ? 'Aucun résultat pour ces filtres.'
                    : 'Les réservations de vos voyageurs apparaîtront ici.'}
                </p>
              </div>
            )}

            {filtered.length > 0 && (
              <>
                {/* Tableau (ordinateur) */}
                <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {['Voyageur', 'Annonce', 'Arrivée', 'Départ', 'Voyageurs', 'Montant hôte', 'Statut', 'N°', ''].map((label, i) => (
                          <th
                            key={label || i}
                            className={`px-5 py-3 text-xs ${i === 4 ? 'text-center' : i === 5 ? 'text-right' : 'text-left'}`}
                            style={{ fontWeight: 600, color: '#6B7280' }}
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r) => (
                        <tr
                          key={r.id}
                          onClick={() => openReservation(r.id)}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <GuestAvatar reservation={r} />
                              <span className="text-sm truncate max-w-[120px]" style={{ fontWeight: 500, color: '#222222' }}>
                                {guestName(r)}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm truncate max-w-[180px]" style={{ fontWeight: 500, color: '#222222' }}>
                              {r.listing?.title}
                            </p>
                            <p className="text-xs" style={{ color: '#717171' }}>{r.listing?.city}</p>
                          </td>
                          <td className="px-5 py-4 text-sm" style={{ color: '#222222' }}>{formatDay(r.check_in)}</td>
                          <td className="px-5 py-4 text-sm" style={{ color: '#222222' }}>{formatDay(r.check_out)}</td>
                          <td className="px-5 py-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Users className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm" style={{ color: '#222222' }}>{r.guests_count}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                            {formatMoney(hostAmount(r), r.currency)}
                          </td>
                          <td className="px-5 py-4">
                            <ReservationStatusBadge phase={r.phase} label={HOST_PHASE_LABELS[r.phase]} />
                          </td>
                          <td className="px-5 py-4 text-xs font-mono" style={{ color: '#717171' }}>{r.confirmation_code}</td>
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openReservation(r.id);
                              }}
                              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                              title="Voir les détails"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cartes (mobile) */}
                <div className="md:hidden space-y-3">
                  {filtered.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => openReservation(r.id)}
                      className="w-full text-left bg-white border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <GuestAvatar reservation={r} size="w-10 h-10" />
                          <div className="min-w-0">
                            <p className="text-sm truncate" style={{ fontWeight: 600, color: '#222222' }}>{guestName(r)}</p>
                            <p className="text-xs" style={{ color: '#717171' }}>
                              {r.guests_count} voyageur{r.guests_count > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <ReservationStatusBadge phase={r.phase} label={HOST_PHASE_LABELS[r.phase]} />
                      </div>
                      <p className="text-sm mb-2" style={{ fontWeight: 500, color: '#222222' }}>{r.listing?.title}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ color: '#717171' }}>{formatStayRange(r.check_in, r.check_out)}</span>
                        <span style={{ fontWeight: 600, color: '#222222' }}>{formatMoney(hostAmount(r), r.currency)}</span>
                      </div>
                      <p className="text-xs mt-2 font-mono" style={{ color: '#9CA3AF' }}>{r.confirmation_code}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-4 text-sm" style={{ color: '#717171' }}>
                  {filtered.length} réservation{filtered.length > 1 ? 's' : ''}
                  {activeFilter !== 'all' && ` · ${FILTER_TABS.find((t) => t.key === activeFilter)?.label}`}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
