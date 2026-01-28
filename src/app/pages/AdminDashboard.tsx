'use client';

import { Search, TrendingUp, Users, Home, DollarSign, Bell } from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

export function AdminDashboard() {
  const recentBookings = [
    { id: '#12345', client: 'Jean Dupont', logement: 'Villa Toscane', date: '15/03/2025', montant: '€ 1,250', statut: 'CONFIRMÉE' },
    { id: '#12344', client: 'Marie Martin', logement: 'Appartement Paris', date: '14/03/2025', montant: '€ 690', statut: 'EN ATTENTE' },
    { id: '#12343', client: 'Pierre Durand', logement: 'Chalet Alpes', date: '13/03/2025', montant: '€ 2,300', statut: 'CONFIRMÉE' },
  ];

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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8] w-full sm:w-80"
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
              <div className="w-10 h-10 bg-[#5EC6D8]/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#5EC6D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div className="w-10 h-10 bg-[#5EC6D8]/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#5EC6D8]" />
              </div>
            </div>
            <div className="text-3xl mb-2" style={{ fontWeight: 600 }}>€ 342,890</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500" style={{ fontWeight: 600 }}>+18.2%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">CLIENTS ACTIFS</span>
              <div className="w-10 h-10 bg-[#5EC6D8]/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#5EC6D8]" />
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
              <span className="text-sm text-gray-600">LOGEMENTS</span>
              <div className="w-10 h-10 bg-[#5EC6D8]/20 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-[#5EC6D8]" />
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
            <button className="text-sm text-[#5EC6D8] hover:underline" style={{ fontWeight: 500 }}>
              Voir tout
            </button>
          </div>

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
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm">{booking.id}</td>
                    <td className="py-4 px-4 text-sm">{booking.client}</td>
                    <td className="py-4 px-4 text-sm">{booking.logement}</td>
                    <td className="py-4 px-4 text-sm">{booking.date}</td>
                    <td className="py-4 px-4 text-sm" style={{ fontWeight: 600 }}>{booking.montant}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                        booking.statut === 'CONFIRMÉE' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`} style={{ fontWeight: 600 }}>
                        {booking.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm" style={{ fontWeight: 600, color: '#5EC6D8' }}>{booking.id}</span>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${
                    booking.statut === 'CONFIRMÉE' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`} style={{ fontWeight: 600 }}>
                    {booking.statut}
                  </span>
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
                    <span className="text-base" style={{ fontWeight: 600, color: '#5EC6D8' }}>{booking.montant}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}