'use client';

import { Search, Eye, MessageCircle } from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

export function AdminSupport() {
  const tickets = [
    {
      id: '#TIC-001',
      user: 'Jean Dupont',
      avatar: 'JD',
      email: 'jean.dupont@email.com',
      subject: 'Probleme de connexion a mon compte',
      date: '15/02/2025',
      status: 'OUVERT',
      messages: 3
    },
    {
      id: '#TIC-002',
      user: 'Marie Simon',
      avatar: 'MS',
      email: 'marie.simon@email.com',
      subject: 'Demande de modification de reservation',
      date: '14/02/2025',
      status: 'EN COURS',
      messages: 5
    },
    {
      id: '#TIC-003',
      user: 'Pierre Laurent',
      avatar: 'PL',
      email: 'pierre.laurent@email.com',
      subject: 'Question sur les frais de service',
      date: '12/02/2025',
      status: 'RESOLU',
      messages: 4
    },
    {
      id: '#TIC-004',
      user: 'Sophie Martin',
      avatar: 'SM',
      email: 'sophie.martin@email.com',
      subject: 'Signalement d\'un logement non conforme',
      date: '10/02/2025',
      status: 'OUVERT',
      messages: 2
    },
    {
      id: '#TIC-005',
      user: 'Thomas Dubois',
      avatar: 'TD',
      email: 'thomas.dubois@email.com',
      subject: 'Probleme avec le paiement',
      date: '08/02/2025',
      status: 'EN COURS',
      messages: 6
    },
    {
      id: '#TIC-006',
      user: 'Lucie Bernard',
      avatar: 'LB',
      email: 'lucie.bernard@email.com',
      subject: 'Demande de remboursement',
      date: '05/02/2025',
      status: 'RESOLU',
      messages: 3
    },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'OUVERT') return 'bg-red-100 text-red-700';
    if (status === 'EN COURS') return 'bg-orange-100 text-orange-700';
    if (status === 'RESOLU') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Support</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">TOTAL TICKETS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>156</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">OUVERTS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>23</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">EN COURS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>18</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">RESOLUS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>115</div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg md:text-xl" style={{ fontWeight: 600 }}>Tickets de support</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un ticket..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option>Tous les statuts</option>
                  <option>Ouvert</option>
                  <option>En cours</option>
                  <option>Resolu</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>TICKET</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>UTILISATEUR</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>SUJET</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>MESSAGES</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{ticket.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                          {ticket.avatar}
                        </div>
                        <div>
                          <div className="text-sm" style={{ fontWeight: 600 }}>{ticket.user}</div>
                          <div className="text-xs text-gray-500">{ticket.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm max-w-xs">{ticket.subject}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{ticket.messages}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">{ticket.date}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`} style={{ fontWeight: 600 }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800 transition-colors" style={{ fontWeight: 600 }}>
                          Repondre
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
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm" style={{ fontWeight: 600 }}>{ticket.id}</span>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`} style={{ fontWeight: 600 }}>
                    {ticket.status}
                  </span>
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                    {ticket.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm" style={{ fontWeight: 600 }}>{ticket.user}</div>
                    <div className="text-xs text-gray-500 truncate">{ticket.email}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{ticket.subject}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{ticket.date}</span>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">{ticket.messages}</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800 transition-colors" style={{ fontWeight: 600 }}>
                    Repondre
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
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg" style={{ fontWeight: 600 }}>1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
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
