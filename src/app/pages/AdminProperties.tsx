'use client';

import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

export function AdminProperties() {
  const properties = [
    {
      id: 1,
      name: 'Villa Toscane',
      code: '#VT-001',
      avatar: 'VT',
      type: 'VILLA',
      city: 'Paris',
      host: 'Jean Dupont',
      price: '€ 250',
      status: 'DISPONIBLE'
    },
    {
      id: 2,
      name: 'Appartement Paris',
      code: '#LOG-002',
      avatar: 'AP',
      type: 'APPARTEMENT',
      city: 'Paris',
      host: 'Marie Simon',
      price: '€ 120',
      status: 'RÉSERVÉ'
    },
    {
      id: 3,
      name: 'Chalet Alpes',
      code: '#LOG-003',
      avatar: 'CA',
      type: 'CHALET',
      city: 'Lyon',
      host: 'Pierre Laurent',
      price: '€ 180',
      status: 'DISPONIBLE'
    },
    {
      id: 4,
      name: 'Studio Moderne',
      code: '#LOG-004',
      avatar: 'SM',
      type: 'STUDIO',
      city: 'Marseille',
      host: 'Sophie Martin',
      price: '€ 85',
      status: 'DISPONIBLE'
    },
    {
      id: 5,
      name: 'Maison Bord de Mer',
      code: '#LOG-005',
      avatar: 'MB',
      type: 'MAISON',
      city: 'Nice',
      host: 'Thomas Dubois',
      price: '€ 320',
      status: 'RÉSERVÉ'
    },
    {
      id: 6,
      name: 'Appartement Centre',
      code: '#LOG-006',
      avatar: 'AC',
      type: 'APPARTEMENT',
      city: 'Bordeaux',
      host: 'Lucie Bernard',
      price: '€ 95',
      status: 'DISPONIBLE'
    },
    {
      id: 7,
      name: 'Villa Luxe',
      code: '#LOG-007',
      avatar: 'VL',
      type: 'VILLA',
      city: 'Cannes',
      host: 'Antoine Moreau',
      price: '€ 450',
      status: 'EN ATTENTE'
    },
    {
      id: 8,
      name: 'Studio Cosy',
      code: '#LOG-008',
      avatar: 'SC',
      type: 'STUDIO',
      city: 'Toulouse',
      host: 'Camille Leroy',
      price: '€ 65',
      status: 'DISPONIBLE'
    },
  ];

  const getTypeColor = (type: string) => {
    if (type === 'VILLA') return 'bg-[#5EC6D8]/20 text-[#5EC6D8]';
    if (type === 'APPARTEMENT') return 'bg-teal-100 text-teal-700';
    if (type === 'CHALET') return 'bg-orange-100 text-orange-700';
    if (type === 'STUDIO') return 'bg-[#5EC6D8]/20 text-[#5EC6D8]';
    if (type === 'MAISON') return 'bg-teal-100 text-teal-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    if (status === 'DISPONIBLE') return 'bg-teal-100 text-teal-700';
    if (status === 'RÉSERVÉ') return 'bg-orange-100 text-orange-700';
    if (status === 'EN ATTENTE') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-3xl" style={{ fontWeight: 600 }}>Gestion des logements</h1>
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
              <span className="text-sm" style={{ fontWeight: 600 }}>Nouveau logement</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">TOTAL LOGEMENTS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>3,156</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">DISPONIBLES</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>2,890</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">RÉSERVÉS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>266</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">EN ATTENTE</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>0</div>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg md:text-xl" style={{ fontWeight: 600 }}>Liste des logements</h2>
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un logement..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]"
                  />
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                  <option>Tous les statuts</option>
                  <option>Disponible</option>
                  <option>Réservé</option>
                  <option>En attente</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                  <option>Tous les types</option>
                  <option>Villa</option>
                  <option>Appartement</option>
                  <option>Chalet</option>
                  <option>Studio</option>
                  <option>Maison</option>
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
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>LOGEMENT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>TYPE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>VILLE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>HÔTE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>PRIX/NUIT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                          {property.avatar}
                        </div>
                        <div>
                          <div className="text-sm" style={{ fontWeight: 600 }}>{property.name}</div>
                          <div className="text-xs text-gray-500">{property.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getTypeColor(property.type)}`} style={{ fontWeight: 600 }}>
                        {property.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">{property.city}</td>
                    <td className="py-4 px-6 text-sm">{property.host}</td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{property.price}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(property.status)}`} style={{ fontWeight: 600 }}>
                        {property.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-600" />
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
            {properties.map((property) => (
              <div key={property.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ fontWeight: 600 }}>
                    {property.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{property.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{property.code}</div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getTypeColor(property.type)}`} style={{ fontWeight: 600 }}>
                        {property.type}
                      </span>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(property.status)}`} style={{ fontWeight: 600 }}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Ville</div>
                    <div className="text-xs" style={{ fontWeight: 600 }}>{property.city}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Hôte</div>
                    <div className="text-xs">{property.host}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Prix par nuit</div>
                    <div className="text-base" style={{ fontWeight: 600, color: '#5EC6D8' }}>{property.price}</div>
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