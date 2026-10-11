'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Users, Home, DollarSign, Bell } from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { adminReservationsApi, type ReservationPhase } from '@/app/services/api';
import { ReservationStatusBadge } from '@/app/components/booking/ReservationStatusBadge';
import { formatMoney } from '@/app/components/booking/format';

type RecentBooking = { key: number; id: string; client: string; logement: string; date: string; montant: string; phase: ReservationPhase };

export function AdminDashboard() {
  const router = useRouter();
  // Les 5 dernières réservations créées
  const [recentBookings, setRecentBookings] = useState<RecentBooking[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminReservationsApi
      .getAll()
      .then((res) => {
        if (cancelled) return;
        setRecentBookings(
          res.reservations.slice(0, 5).map((r) => ({
            key: r.id,
            id: r.confirmation_code,
            client: r.guest ? `${r.guest.first_name} ${r.guest.last_name ?? ''}`.trim() : '—',
            logement: r.listing?.title ?? '—',
            date: new Date(r.created_at).toLocaleDateString('fr-FR'),
            montant: formatMoney(r.total_price, r.currency),
            phase: r.phase,
          })),
        );
      })
      .catch(() => !cancelled && setRecentBookings([]));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Dashboard général</h1>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] w-full sm:w-80"
              />
            </div>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">RÉSERVATIONS</span>
              <div className="w-10 h-10 bg-[#111827]/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>1,247</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500" style={{ fontWeight: 600 }}>+12.5%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">REVENUS</span>
              <div className="w-10 h-10 bg-[#111827]/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#111827]" />
              </div>
            </div>
            <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>342 890 €</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500" style={{ fontWeight: 600 }}>+18.2%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">TOTAL UTILISATEURS</span>
              <div className="w-10 h-10 bg-[#111827]/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#111827]" />
              </div>
            </div>
            <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>8,432</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500" style={{ fontWeight: 600 }}>+5.1%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">TOTAL CHALETS</span>
              <div className="w-10 h-10 bg-[#111827]/20 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-[#111827]" />
              </div>
            </div>
            <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>3,156</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500" style={{ fontWeight: 600 }}>+3.8%</span>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl" style={{ fontWeight: 600 }}>Réservations récentes</h2>
            <Link href="/admin/reservations" className="text-sm text-[#111827] hover:underline" style={{ fontWeight: 500 }}>
              Voir tout
            </Link>
          </div>

          {recentBookings !== null && recentBookings.length === 0 && (
            <p className="text-sm text-gray-500 py-6 text-center">Aucune réservation pour le moment.</p>
          )}

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs text-gray-600" style={{ fontWeight: 600 }}>ID</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600" style={{ fontWeight: 600 }}>CLIENT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600" style={{ fontWeight: 600 }}>LOGEMENT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATE</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600" style={{ fontWeight: 600 }}>MONTANT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {(recentBookings ?? []).map((booking) => (
                  <tr
                    key={booking.key}
                    onClick={() => router.push(`/admin/reservations?id=${booking.key}`)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-4 px-4 text-sm">{booking.id}</td>
                    <td className="py-4 px-4 text-sm">{booking.client}</td>
                    <td className="py-4 px-4 text-sm">{booking.logement}</td>
                    <td className="py-4 px-4 text-sm">{booking.date}</td>
                    <td className="py-4 px-4 text-sm" style={{ fontWeight: 600 }}>{booking.montant}</td>
                    <td className="py-4 px-4">
                      <ReservationStatusBadge phase={booking.phase} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {(recentBookings ?? []).map((booking) => (
              <Link
                key={booking.key}
                href={`/admin/reservations?id=${booking.key}`}
                className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-mono" style={{ fontWeight: 600, color: '#111827' }}>{booking.id}</span>
                  <ReservationStatusBadge phase={booking.phase} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Client</span>
                    <span className="text-sm" style={{ fontWeight: 600 }}>{booking.client}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Logement</span>
                    <span className="text-sm">{booking.logement}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Date</span>
                    <span className="text-xs">{booking.date}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">Montant</span>
                    <span className="text-base" style={{ fontWeight: 600, color: '#111827' }}>{booking.montant}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}