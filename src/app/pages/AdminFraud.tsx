'use client';

import { Search, Eye, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

export function AdminFraud() {
  const [activeTab, setActiveTab] = useState<'host' | 'client'>('host');

  const hostIncidents = [
    {
      id: '#INC-H-001',
      name: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      avatar: 'JD',
      type: 'Paiement suspect',
      description: 'Multiples transactions suspectes avec différentes cartes',
      date: '15/03/2025',
      risk: 'Élevé',
      status: 'ENQUÊTE EN COURS'
    },
    {
      id: '#INC-H-002',
      name: 'Marie Simon',
      email: 'marie.simon@email.com',
      avatar: 'MS',
      type: 'Faux logement',
      description: 'Photos volées, adresse invalide',
      date: '18/03/2025',
      risk: 'Critique',
      status: 'ENQUÊTE EN COURS'
    },
    {
      id: '#INC-H-003',
      name: 'Pierre Laurent',
      email: 'pierre.laurent@email.com',
      avatar: 'PL',
      type: 'Comportement suspect',
      description: 'Annulations répétées sans justification',
      date: '20/03/2025',
      risk: 'Moyen',
      status: 'RÉSOLU'
    },
    {
      id: '#INC-H-004',
      name: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      avatar: 'SM',
      type: 'Identité suspecte',
      description: 'Documents d\'identité frauduleux',
      date: '22/03/2025',
      risk: 'Élevé',
      status: 'EN ATTENTE'
    },
  ];

  const clientIncidents = [
    {
      id: '#INC-C-001',
      name: 'Alexandre Leroy',
      email: 'alexandre.leroy@email.com',
      avatar: 'AL',
      type: 'Carte volée',
      description: 'Utilisation de carte bancaire signalée comme volée',
      date: '16/03/2025',
      risk: 'Critique',
      status: 'ENQUÊTE EN COURS'
    },
    {
      id: '#INC-C-002',
      name: 'Camille Bernard',
      email: 'camille.bernard@email.com',
      avatar: 'CB',
      type: 'Compte multiple',
      description: 'Plusieurs comptes avec mêmes informations',
      date: '19/03/2025',
      risk: 'Moyen',
      status: 'RÉSOLU'
    },
    {
      id: '#INC-C-003',
      name: 'Lucas Bouchard',
      email: 'lucas.bouchard@email.com',
      avatar: 'LB',
      type: 'Paiement frauduleux',
      description: 'Tentatives de paiement avec cartes expirées/invalides',
      date: '21/03/2025',
      risk: 'Élevé',
      status: 'ENQUÊTE EN COURS'
    },
  ];

  const getRiskColor = (risk: string) => {
    if (risk === 'Critique') return 'text-red-600';
    if (risk === 'Élevé') return 'text-orange-600';
    return 'text-yellow-600';
  };

  const getStatusColor = (status: string) => {
    if (status === 'RÉSOLU') return 'bg-green-100 text-green-700';
    if (status === 'ENQUÊTE EN COURS') return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-3xl" style={{ fontWeight: 600 }}>Gestion de la fraude</h1>
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
              <span className="text-sm" style={{ fontWeight: 600 }}>Nouveau rapport</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">ALERTES ACTIVES</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>7</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">ENQUÊTES</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>3</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">RÉSOLUES</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>4</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">FAUX POSITIFS</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>0</div>
          </div>
        </div>

        {/* Fraud Reports */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl" style={{ fontWeight: 600 }}>Rapports de fraude</h2>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une alerte..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                <option>Tous les types</option>
                <option>Paiement suspect</option>
                <option>Faux logement</option>
                <option>Identité suspecte</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                <option>Tous les statuts</option>
                <option>Enquête en cours</option>
                <option>Résolu</option>
                <option>En attente</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5EC6D8]">
                <option>Tous les niveaux de risque</option>
                <option>Critique</option>
                <option>Élevé</option>
                <option>Moyen</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex items-center gap-4 md:gap-6 px-4 md:px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('host')}
                className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'host'
                    ? 'border-[#5EC6D8] text-[#5EC6D8]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-sm mr-2" style={{ fontWeight: 600 }}>Incidents Hôte</span>
                <span className="inline-block px-2 py-1 bg-[#5EC6D8]/20 text-[#5EC6D8] rounded text-xs" style={{ fontWeight: 600 }}>
                  4
                </span>
              </button>
              <button
                onClick={() => setActiveTab('client')}
                className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'client'
                    ? 'border-[#5EC6D8] text-[#5EC6D8]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-sm mr-2" style={{ fontWeight: 600 }}>Incidents Client</span>
                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs" style={{ fontWeight: 600 }}>
                  3
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>N° INCIDENT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>{activeTab === 'host' ? 'HÔTE' : 'CLIENT'}</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>TYPE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DESCRIPTION</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>NIVEAU DE RISQUE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'host' ? hostIncidents : clientIncidents).map((incident) => (
                  <tr key={incident.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <span className="text-sm text-[#5EC6D8]" style={{ fontWeight: 600 }}>{incident.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                          {incident.avatar}
                        </div>
                        <div>
                          <div className="text-sm" style={{ fontWeight: 600 }}>{incident.name}</div>
                          <div className="text-xs text-gray-500">{incident.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">{incident.type}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 max-w-xs">{incident.description}</td>
                    <td className="py-4 px-6 text-sm">{incident.date}</td>
                    <td className="py-4 px-6">
                      <span className={`text-sm ${getRiskColor(incident.risk)}`} style={{ fontWeight: 600 }}>
                        {incident.risk}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(incident.status)}`} style={{ fontWeight: 600 }}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-600" />
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
            {(activeTab === 'host' ? hostIncidents : clientIncidents).map((incident) => (
              <div key={incident.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm text-[#5EC6D8]" style={{ fontWeight: 600 }}>{incident.id}</span>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(incident.status)}`} style={{ fontWeight: 600 }}>
                    {incident.status}
                  </span>
                </div>
                
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ fontWeight: 600 }}>
                    {incident.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{incident.name}</div>
                    <div className="text-xs text-gray-500 truncate mb-2">{incident.email}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="text-xs text-gray-600 mb-1">Type d'incident</div>
                  <div className="text-sm mb-2" style={{ fontWeight: 600 }}>{incident.type}</div>
                  <div className="text-xs text-gray-600 mb-1">Description</div>
                  <div className="text-sm text-gray-700">{incident.description}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Date</div>
                    <div className="text-xs" style={{ fontWeight: 600 }}>{incident.date}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Niveau de risque</div>
                    <div className={`text-sm ${getRiskColor(incident.risk)}`} style={{ fontWeight: 600 }}>
                      {incident.risk}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>Détails</span>
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