'use client';

import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

export function AdminHosts() {
  const hosts = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      username: 'jean.dupont@email.com',
      avatar: 'JD',
      phone: '+33 6 12 34 56 78',
      type: 'SUPER HOST',
      city: 'Paris',
      properties: 12,
      revenue: '€ 45,230',
      status: 'ACTIF'
    },
    {
      id: 2,
      name: 'Marie Simon',
      email: 'marie.simon@email.com',
      username: 'marie.simon@email.com',
      avatar: 'MS',
      phone: '+33 6 23 45 67 89',
      type: 'PARTICULIER',
      city: 'Lyon',
      properties: 8,
      revenue: '€ 32,150',
      status: 'ACTIF'
    },
    {
      id: 3,
      name: 'Pierre Laurent',
      email: 'pierre.laurent@email.com',
      username: 'pierre.laurent@email.com',
      avatar: 'PL',
      phone: '+33 6 34 56 78 90',
      type: 'PROFESSIONNEL',
      city: 'Marseille',
      properties: 15,
      revenue: '€ 67,890',
      status: 'EN ATTENTE'
    },
    {
      id: 4,
      name: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      username: 'sophie.martin@email.com',
      avatar: 'SM',
      phone: '+33 6 45 67 89 01',
      type: 'PARTICULIER',
      city: 'Nice',
      properties: 6,
      revenue: '€ 18,450',
      status: 'ACTIF'
    },
    {
      id: 5,
      name: 'Thomas Dubois',
      email: 'thomas.dubois@email.com',
      username: 'thomas.dubois@email.com',
      avatar: 'TD',
      phone: '+33 6 56 78 90 12',
      type: 'PROFESSIONNEL',
      city: 'Bordeaux',
      properties: 9,
      revenue: '€ 28,340',
      status: 'SUSPENDU'
    },
    {
      id: 6,
      name: 'Lucie Bernard',
      email: 'lucie.bernard@email.com',
      username: 'lucie.bernard@email.com',
      avatar: 'LB',
      phone: '+33 6 67 89 01 23',
      type: 'SUPER HOST',
      city: 'Toulouse',
      properties: 18,
      revenue: '€ 89,120',
      status: 'ACTIF'
    },
    {
      id: 7,
      name: 'Antoine Moreau',
      email: 'antoine.moreau@email.com',
      username: 'antoine.moreau@email.com',
      avatar: 'AM',
      phone: '+33 6 78 90 12 34',
      type: 'ENTREPRISE',
      city: 'Lille',
      properties: 25,
      revenue: '€ 125,450',
      status: 'ACTIF'
    },
    {
      id: 8,
      name: 'Camille Leroy',
      email: 'camille.leroy@email.com',
      username: 'camille.leroy@email.com',
      avatar: 'CL',
      phone: '+33 6 89 01 23 45',
      type: 'PARTICULIER',
      city: 'Strasbourg',
      properties: 4,
      revenue: '€ 12,890',
      status: 'EN ATTENTE'
    },
    {
      id: 9,
      name: 'Romain Girard',
      email: 'romain.girard@email.com',
      username: 'romain.girard@email.com',
      avatar: 'RG',
      phone: '+33 6 90 12 34 56',
      type: 'PROFESSIONNEL',
      city: 'Nantes',
      properties: 11,
      revenue: '€ 56,780',
      status: 'ACTIF'
    },
  ];

  const getTypeColor = (type: string) => {
    if (type === 'SUPER HOST') return 'bg-[#5EC6D8]/20 text-[#5EC6D8]';
    if (type === 'PARTICULIER') return 'bg-teal-100 text-teal-700';
    if (type === 'PROFESSIONNEL') return 'bg-orange-100 text-orange-700';
    if (type === 'ENTREPRISE') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    if (status === 'ACTIF') return 'bg-green-100 text-green-700';
    if (status === 'SUSPENDU') return 'bg-red-100 text-red-700';
    if (status === 'EN ATTENTE') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-3xl" style={{ fontWeight: 600 }}>Gestion des hôtes</h1>
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
              <span className="text-sm" style={{ fontWeight: 600 }}>Nouveau hôte</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">TOTAL HÔTES</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>1,247</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">HÔTES ACTIFS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>1,089</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">EN ATTENTE</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>98</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">SUSPENDUS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>60</div>
          </div>
        </div>

        {/* Hosts List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg md:text-xl" style={{ fontWeight: 600 }}>Liste des hôtes</h2>
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un hôte..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                  <option>Tous les statuts</option>
                  <option>Actif</option>
                  <option>Inactif</option>
                  <option>Suspendu</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                  <option>Tous les types</option>
                  <option>Hôte standard</option>
                  <option>Superhôte</option>
                  <option>Hôte Pro</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                  <option>Toutes les villes</option>
                  <option>Paris</option>
                  <option>Lyon</option>
                  <option>Marseille</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>HÔTE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>EMAIL</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>TÉLÉPHONE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>TYPE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>VILLE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>LOGEMENTS</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>REVENUS</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {hosts.map((host) => (
                  <tr key={host.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                          {host.avatar}
                        </div>
                        <div>
                          <div className="text-sm" style={{ fontWeight: 600 }}>{host.name}</div>
                          <div className="text-xs text-gray-500">{host.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">{host.email}</td>
                    <td className="py-4 px-6 text-sm">{host.phone}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getTypeColor(host.type)}`} style={{ fontWeight: 600 }}>
                        {host.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">{host.city}</td>
                    <td className="py-4 px-6 text-sm">{host.properties}</td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{host.revenue}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(host.status)}`} style={{ fontWeight: 600 }}>
                        {host.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
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
            {hosts.map((host) => (
              <div key={host.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ fontWeight: 600 }}>
                    {host.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{host.name}</div>
                    <div className="text-xs text-gray-500 truncate mb-2">{host.email}</div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getTypeColor(host.type)}`} style={{ fontWeight: 600 }}>
                        {host.type}
                      </span>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(host.status)}`} style={{ fontWeight: 600 }}>
                        {host.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Téléphone</div>
                    <div className="text-xs">{host.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Ville</div>
                    <div className="text-xs" style={{ fontWeight: 600 }}>{host.city}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Logements</div>
                    <div className="text-xs" style={{ fontWeight: 600 }}>{host.properties}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Revenus</div>
                    <div className="text-sm" style={{ fontWeight: 600, color: '#5EC6D8' }}>{host.revenue}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>Voir</span>
                  </button>
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Edit className="w-4 h-4 text-gray-600" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>Éditer</span>
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
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