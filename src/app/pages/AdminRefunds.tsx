'use client';

import { Search } from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

export function AdminRefunds() {
  const refunds = [
    {
      id: '#REF-001',
      reservation: '#RES-005',
      client: { name: 'Thomas Dubois', email: 'thomas.dubois@email.com', avatar: 'TD' },
      host: { name: 'Thomas Dubois', avatar: 'TD' },
      amount: '€ 1,350',
      reason: 'Annulation client - Problème imprévu',
      date: '10/02/2025',
      status: 'COMPLÉTÉ',
      statusColor: 'bg-teal-100 text-teal-700'
    },
    {
      id: '#REF-002',
      reservation: '#RES-019',
      client: { name: 'Alexandre Leroy', email: 'alex.leroy@email.com', avatar: 'AL' },
      host: { name: 'Jean Dupont', avatar: 'JD' },
      amount: '€ 1,750',
      reason: 'Problème logement - Non conforme à la description',
      date: '18/02/2025',
      status: 'EN COURS',
      statusColor: 'bg-orange-100 text-orange-700'
    },
    {
      id: '#REF-003',
      reservation: '#RES-008',
      client: { name: 'Camille Bernard', email: 'camille.bernard@email.com', avatar: 'CB' },
      host: { name: 'Marie Simon', avatar: 'MS' },
      amount: '€ 980',
      reason: 'Annulation hôte - Dégât technique',
      date: '22/02/2025',
      status: 'COMPLÉTÉ',
      statusColor: 'bg-teal-100 text-teal-700'
    },
    {
      id: '#REF-004',
      reservation: '#RES-015',
      client: { name: 'Lucas Bouchard', email: 'lucas.bouchard@email.com', avatar: 'LB' },
      host: { name: 'Pierre Laurent', avatar: 'PL' },
      amount: '€ 2,100',
      reason: 'Demande client - Paiement en double',
      date: '25/02/2025',
      status: 'EN ATTENTE',
      statusColor: 'bg-[#5EC6D8]/20 text-[#5EC6D8]'
    },
    {
      id: '#REF-005',
      reservation: '#RES-020',
      client: { name: 'Sophie Moreau', email: 'sophie.moreau@email.com', avatar: 'SM' },
      host: { name: 'Sophie Martin', avatar: 'SM' },
      amount: '€ 560',
      reason: 'Annulation client - Force majeure',
      date: '28/02/2025',
      status: 'REJETÉ',
      statusColor: 'bg-red-100 text-red-700'
    },
    {
      id: '#REF-006',
      reservation: '#RES-022',
      client: { name: 'Julie Martin', email: 'julie.martin@email.com', avatar: 'JM' },
      host: { name: 'Jean Dupont', avatar: 'JD' },
      amount: '€ 1,120',
      reason: 'Problème logement - Équipements défectueux',
      date: '01/03/2025',
      status: 'EN COURS',
      statusColor: 'bg-orange-100 text-orange-700'
    },
    {
      id: '#REF-007',
      reservation: '#RES-035',
      client: { name: 'Marc Rousseau', email: 'marc.rousseau@email.com', avatar: 'MR' },
      host: { name: 'Marie Simon', avatar: 'MS' },
      amount: '€ 1,890',
      reason: 'Annulation hôte - Non disponible',
      date: '03/03/2025',
      status: 'COMPLÉTÉ',
      statusColor: 'bg-teal-100 text-teal-700'
    },
    {
      id: '#REF-008',
      reservation: '#RES-030',
      client: { name: 'Claire Lefebvre', email: 'claire.lefebvre@email.com', avatar: 'CL' },
      host: { name: 'Pierre Laurent', avatar: 'PL' },
      amount: '€ 720',
      reason: 'Demande client - Service non conforme',
      date: '08/03/2025',
      status: 'EN ATTENTE',
      statusColor: 'bg-[#5EC6D8]/20 text-[#5EC6D8]'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-3xl" style={{ fontWeight: 600 }}>Gestion des remboursements</h1>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm" style={{ fontWeight: 500 }}>Exporter</span>
            </button>
            <button className="px-4 py-2 bg-[#5EC6D8] text-white rounded-lg hover:bg-[#4db5c7] transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm" style={{ fontWeight: 600 }}>Nouveau remboursement</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">TOTAL REMBOURSEMENTS</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>89</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">EN COURS</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>12</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">COMPLÉTÉS</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>74</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">REJETÉS</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>3</div>
          </div>
        </div>

        {/* Refunds List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg md:text-xl" style={{ fontWeight: 600 }}>Liste des remboursements</h2>
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un remboursement..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                  <option>Tous les statuts</option>
                  <option>Complété</option>
                  <option>En cours</option>
                  <option>En attente</option>
                  <option>Rejeté</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                  <option>Toutes les raisons</option>
                  <option>Annulation client</option>
                  <option>Annulation hôte</option>
                  <option>Problème logement</option>
                  <option>Demande client</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>N° REMBOURSEMENT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>RÉSERVATION</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>CLIENT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>HÔTE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>MONTANT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>RAISON</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund) => (
                  <tr key={refund.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{refund.id}</td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600, color: '#5EC6D8' }}>{refund.reservation}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                          {refund.client.avatar}
                        </div>
                        <div>
                          <div className="text-sm" style={{ fontWeight: 600 }}>{refund.client.name}</div>
                          <div className="text-xs text-gray-500">{refund.client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                          {refund.host.avatar}
                        </div>
                        <span className="text-sm">{refund.host.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{refund.amount}</td>
                    <td className="py-4 px-6">
                      <div className="text-xs max-w-[200px]">{refund.reason}</div>
                    </td>
                    <td className="py-4 px-6 text-sm">{refund.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${refund.statusColor}`} style={{ fontWeight: 600 }}>
                        {refund.status}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
            {refunds.map((refund) => (
              <div key={refund.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm" style={{ fontWeight: 600, color: '#5EC6D8' }}>{refund.id}</span>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${refund.statusColor}`} style={{ fontWeight: 600 }}>
                    {refund.status}
                  </span>
                </div>
                
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ fontWeight: 600 }}>
                    {refund.client.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{refund.client.name}</div>
                    <div className="text-xs text-gray-500 truncate mb-2">{refund.client.email}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="text-xs text-gray-600 mb-1">Raison</div>
                  <div className="text-sm" style={{ fontWeight: 600 }}>{refund.reason}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Réservation</div>
                    <div className="text-xs" style={{ fontWeight: 600, color: '#5EC6D8' }}>{refund.reservation}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Montant</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{refund.amount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Hôte</div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                        {refund.host.avatar}
                      </div>
                      <span className="text-xs" style={{ fontWeight: 600 }}>{refund.host.name}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Date</div>
                    <div className="text-xs" style={{ fontWeight: 600 }}>{refund.date}</div>
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
                  <button className="flex-1 px-3 py-2 bg-[#5EC6D8] text-white rounded-lg hover:bg-[#4db5c7] transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs" style={{ fontWeight: 600 }}>Approuver</span>
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