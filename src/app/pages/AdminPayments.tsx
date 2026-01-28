'use client';

import { Search } from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

export function AdminPayments() {
  const payments = [
    {
      id: '#PAY-12345',
      reservation: '#RES-9876',
      client: { name: 'Jean Dupont', email: 'jean.dupont@email.com', avatar: 'JD' },
      amount: '€ 1,250',
      method: 'Carte bancaire',
      date: '15/01/2025',
      status: 'RÉUSSI',
      statusColor: 'bg-teal-100 text-teal-700'
    },
    {
      id: '#PAY-12344',
      reservation: '#RES-9875',
      client: { name: 'Marie Simon', email: 'marie.simon@email.com', avatar: 'MS' },
      amount: '€ 890',
      method: 'PayPal',
      date: '14/01/2025',
      status: 'EN ATTENTE',
      statusColor: 'bg-orange-100 text-orange-700'
    },
    {
      id: '#PAY-12343',
      reservation: '#RES-9874',
      client: { name: 'Pierre Laurent', email: 'pierre.laurent@email.com', avatar: 'PL' },
      amount: '€ 2,100',
      method: 'Stripe',
      date: '13/01/2025',
      status: 'RÉUSSI',
      statusColor: 'bg-teal-100 text-teal-700'
    },
    {
      id: '#PAY-12342',
      reservation: '#RES-9873',
      client: { name: 'Sophie Martin', email: 'sophie.martin@email.com', avatar: 'SM' },
      amount: '€ 650',
      method: 'Carte bancaire',
      date: '12/01/2025',
      status: 'ÉCHOUÉ',
      statusColor: 'bg-red-100 text-red-700'
    },
    {
      id: '#PAY-12341',
      reservation: '#RES-9872',
      client: { name: 'Thomas Dubois', email: 'thomas.dubois@email.com', avatar: 'TD' },
      amount: '€ 1,450',
      method: 'Virement',
      date: '11/01/2025',
      status: 'RÉUSSI',
      statusColor: 'bg-teal-100 text-teal-700'
    },
    {
      id: '#PAY-12340',
      reservation: '#RES-9871',
      client: { name: 'Lucie Bernard', email: 'lucie.bernard@email.com', avatar: 'LB' },
      amount: '€ 900',
      method: 'PayPal',
      date: '10/01/2025',
      status: 'EN ATTENTE',
      statusColor: 'bg-orange-100 text-orange-700'
    },
    {
      id: '#PAY-12339',
      reservation: '#RES-9870',
      client: { name: 'Antoine Moreau', email: 'antoine.moreau@email.com', avatar: 'AM' },
      amount: '€ 1,750',
      method: 'Stripe',
      date: '09/01/2025',
      status: 'RÉUSSI',
      statusColor: 'bg-teal-100 text-teal-700'
    },
    {
      id: '#PAY-12338',
      reservation: '#RES-9869',
      client: { name: 'Camille Leroy', email: 'camille.leroy@email.com', avatar: 'CL' },
      amount: '€ 560',
      method: 'Carte bancaire',
      date: '08/01/2025',
      status: 'ÉCHOUÉ',
      statusColor: 'bg-red-100 text-red-700'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Gestion des paiements</h1>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm" style={{ fontWeight: 500 }}>Exporter</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">TOTAL PAIEMENTS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>1,189</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">RÉUSSIS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>1,156</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">EN ATTENTE</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>23</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">ÉCHOUÉS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>10</div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg md:text-xl" style={{ fontWeight: 600 }}>Liste des paiements</h2>
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un paiement..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                  <option>Tous les statuts</option>
                  <option>Complété</option>
                  <option>En attente</option>
                  <option>Échoué</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                  <option>Toutes les méthodes</option>
                  <option>Carte bancaire</option>
                  <option>PayPal</option>
                  <option>Virement</option>
                  <option>Stripe</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ID PAIEMENT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>RÉSERVATION</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>CLIENT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>MONTANT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>MÉTHODE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{payment.id}</td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600, color: '#5EC6D8' }}>{payment.reservation}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                          {payment.client.avatar}
                        </div>
                        <div>
                          <div className="text-sm" style={{ fontWeight: 600 }}>{payment.client.name}</div>
                          <div className="text-xs text-gray-500">{payment.client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{payment.amount}</td>
                    <td className="py-4 px-6 text-sm">{payment.method}</td>
                    <td className="py-4 px-6 text-sm">{payment.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${payment.statusColor}`} style={{ fontWeight: 600 }}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {payments.map((payment) => (
              <div key={payment.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm" style={{ fontWeight: 600, color: '#5EC6D8' }}>{payment.id}</span>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${payment.statusColor}`} style={{ fontWeight: 600 }}>
                    {payment.status}
                  </span>
                </div>
                
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ fontWeight: 600 }}>
                    {payment.client.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{payment.client.name}</div>
                    <div className="text-xs text-gray-500 truncate mb-2">{payment.client.email}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Réservation</div>
                    <div className="text-xs" style={{ fontWeight: 600, color: '#5EC6D8' }}>{payment.reservation}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Montant</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{payment.amount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Méthode</div>
                    <div className="text-xs">{payment.method}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Date</div>
                    <div className="text-xs">{payment.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-xs" style={{ fontWeight: 500 }}>Voir</span>
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-6 flex items-center justify-center gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-4 py-2 bg-[#5EC6D8] text-white rounded-lg" style={{ fontWeight: 600 }}>1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">4</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">5</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}