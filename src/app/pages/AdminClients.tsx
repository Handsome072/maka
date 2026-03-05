'use client';

import { useState, useMemo } from 'react';
import { Search, Eye, Trash2, Ban, PauseCircle, ChevronUp, ChevronDown, FileDown, Shield, ShieldCheck } from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import Link from 'next/link';

interface Client {
  id: number;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  country: string;
  verified: boolean;
  totalBookings: number;
  totalSpent: string;
  totalSpentValue: number;
  joinDate: string;
  joinDateValue: number;
  status: 'ACTIF' | 'SUSPENDU' | 'BANNI';
}

const clients: Client[] = [
  {
    id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', avatar: 'JD',
    phone: '+33 6 12 34 56 78', country: 'France', verified: true,
    totalBookings: 12, totalSpent: '8 320 $', totalSpentValue: 8320,
    joinDate: '15 jan. 2024', joinDateValue: 20240115, status: 'ACTIF'
  },
  {
    id: 2, name: 'Marie Simon', email: 'marie.simon@email.com', avatar: 'MS',
    phone: '+33 6 23 45 67 89', country: 'France', verified: true,
    totalBookings: 8, totalSpent: '5 140 $', totalSpentValue: 5140,
    joinDate: '03 fev. 2024', joinDateValue: 20240203, status: 'ACTIF'
  },
  {
    id: 3, name: 'Pierre Laurent', email: 'pierre.laurent@email.com', avatar: 'PL',
    phone: '+1 514 555 1234', country: 'Canada', verified: false,
    totalBookings: 3, totalSpent: '1 890 $', totalSpentValue: 1890,
    joinDate: '22 mar. 2024', joinDateValue: 20240322, status: 'ACTIF'
  },
  {
    id: 4, name: 'Sophie Martin', email: 'sophie.martin@email.com', avatar: 'SM',
    phone: '+33 6 45 67 89 01', country: 'France', verified: true,
    totalBookings: 21, totalSpent: '15 670 $', totalSpentValue: 15670,
    joinDate: '08 sep. 2023', joinDateValue: 20230908, status: 'ACTIF'
  },
  {
    id: 5, name: 'Thomas Dubois', email: 'thomas.dubois@email.com', avatar: 'TD',
    phone: '+32 2 123 45 67', country: 'Belgique', verified: true,
    totalBookings: 5, totalSpent: '3 250 $', totalSpentValue: 3250,
    joinDate: '17 nov. 2024', joinDateValue: 20241117, status: 'SUSPENDU'
  },
  {
    id: 6, name: 'Lucie Bernard', email: 'lucie.bernard@email.com', avatar: 'LB',
    phone: '+41 21 345 67 89', country: 'Suisse', verified: false,
    totalBookings: 1, totalSpent: '420 $', totalSpentValue: 420,
    joinDate: '05 jan. 2025', joinDateValue: 20250105, status: 'ACTIF'
  },
  {
    id: 7, name: 'Antoine Moreau', email: 'antoine.moreau@email.com', avatar: 'AM',
    phone: '+1 438 555 6789', country: 'Canada', verified: true,
    totalBookings: 15, totalSpent: '11 200 $', totalSpentValue: 11200,
    joinDate: '30 jun. 2023', joinDateValue: 20230630, status: 'ACTIF'
  },
  {
    id: 8, name: 'Camille Leroy', email: 'camille.leroy@email.com', avatar: 'CL',
    phone: '+33 6 89 01 23 45', country: 'France', verified: true,
    totalBookings: 0, totalSpent: '0 $', totalSpentValue: 0,
    joinDate: '20 fev. 2025', joinDateValue: 20250220, status: 'BANNI'
  },
  {
    id: 9, name: 'Romain Girard', email: 'romain.girard@email.com', avatar: 'RG',
    phone: '+33 6 90 12 34 56', country: 'France', verified: false,
    totalBookings: 7, totalSpent: '4 580 $', totalSpentValue: 4580,
    joinDate: '12 oct. 2024', joinDateValue: 20241012, status: 'ACTIF'
  },
  {
    id: 10, name: 'Isabelle Petit', email: 'isabelle.petit@email.com', avatar: 'IP',
    phone: '+1 613 555 4321', country: 'Canada', verified: true,
    totalBookings: 9, totalSpent: '6 730 $', totalSpentValue: 6730,
    joinDate: '28 avr. 2024', joinDateValue: 20240428, status: 'ACTIF'
  },
];

type SortField = 'name' | 'totalBookings' | 'totalSpentValue' | 'joinDateValue';
type SortDirection = 'asc' | 'desc';

export function AdminClients() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('joinDateValue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getStatusColor = (status: string) => {
    if (status === 'ACTIF') return 'bg-green-100 text-green-700';
    if (status === 'SUSPENDU') return 'bg-orange-100 text-orange-700';
    if (status === 'BANNI') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={`w-3 h-3 -mb-1 ${sortField === field && sortDirection === 'asc' ? 'text-[#111827]' : 'text-gray-300'}`} />
      <ChevronDown className={`w-3 h-3 ${sortField === field && sortDirection === 'desc' ? 'text-[#111827]' : 'text-gray-300'}`} />
    </span>
  );

  const filteredClients = useMemo(() => {
    let result = [...clients];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s));
    }
    if (statusFilter) {
      result = result.filter(c => c.status === statusFilter);
    }
    if (verifiedFilter) {
      result = result.filter(c => verifiedFilter === 'verified' ? c.verified : !c.verified);
    }
    if (countryFilter) {
      result = result.filter(c => c.country === countryFilter);
    }
    if (dateFilter) {
      const now = 20250305;
      if (dateFilter === 'month') result = result.filter(c => c.joinDateValue >= 20250201);
      else if (dateFilter === '3months') result = result.filter(c => c.joinDateValue >= 20241205);
      else if (dateFilter === 'year') result = result.filter(c => c.joinDateValue >= 20240305);
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [search, statusFilter, verifiedFilter, countryFilter, dateFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const countries = [...new Set(clients.map(c => c.country))];
  const totalActive = clients.filter(c => c.status === 'ACTIF').length;
  const totalVerified = clients.filter(c => c.verified).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Gestion des clients</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <FileDown className="w-4 h-4" />
              <span className="text-sm" style={{ fontWeight: 500 }}>Exporter</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">TOTAL CLIENTS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{clients.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">CLIENTS ACTIFS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{totalActive}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">NOUVEAUX CE MOIS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{clients.filter(c => c.joinDateValue >= 20250201).length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">CLIENTS VERIFIES</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{totalVerified}</div>
          </div>
        </div>

        {/* Clients List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg md:text-xl" style={{ fontWeight: 600 }}>Liste des clients</h2>
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                >
                  <option value="">Tous les statuts</option>
                  <option value="ACTIF">Actif</option>
                  <option value="SUSPENDU">Suspendu</option>
                  <option value="BANNI">Banni</option>
                </select>
                <select
                  value={verifiedFilter}
                  onChange={(e) => { setVerifiedFilter(e.target.value); setCurrentPage(1); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                >
                  <option value="">Verification</option>
                  <option value="verified">Verifie</option>
                  <option value="unverified">Non verifie</option>
                </select>
                <select
                  value={countryFilter}
                  onChange={(e) => { setCountryFilter(e.target.value); setCurrentPage(1); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                >
                  <option value="">Tous les pays</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={dateFilter}
                  onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                >
                  <option value="">Date d&apos;inscription</option>
                  <option value="month">Ce mois</option>
                  <option value="3months">3 derniers mois</option>
                  <option value="year">Cette annee</option>
                </select>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('name')} className="flex items-center hover:text-[#111827]">
                      CLIENT <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>EMAIL</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>TELEPHONE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>PAYS</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>VERIFICATION</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('totalBookings')} className="flex items-center hover:text-[#111827]">
                      RESERVATIONS <SortIcon field="totalBookings" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('totalSpentValue')} className="flex items-center hover:text-[#111827]">
                      DEPENSES <SortIcon field="totalSpentValue" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('joinDateValue')} className="flex items-center hover:text-[#111827]">
                      INSCRIPTION <SortIcon field="joinDateValue" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#111827] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                          {client.avatar}
                        </div>
                        <div className="text-sm" style={{ fontWeight: 600 }}>{client.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{client.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{client.phone}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{client.country}</td>
                    <td className="py-4 px-6">
                      {client.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                          <ShieldCheck className="w-3 h-3" /> Verifie
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600" style={{ fontWeight: 600 }}>
                          <Shield className="w-3 h-3" /> Non verifie
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{client.totalBookings}</td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{client.totalSpent}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{client.joinDate}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(client.status)}`} style={{ fontWeight: 600 }}>
                        {client.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/clients/${client.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voir le profil">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </Link>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Suspendre">
                          <PauseCircle className="w-4 h-4 text-orange-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Bannir">
                          <Ban className="w-4 h-4 text-red-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedClients.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400 text-sm">
                      Aucun client trouve
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {paginatedClients.map((client) => (
              <div key={client.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#111827] rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ fontWeight: 600 }}>
                    {client.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{client.name}</div>
                    <div className="text-xs text-gray-500 truncate mb-2">{client.email}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(client.status)}`} style={{ fontWeight: 600 }}>
                        {client.status}
                      </span>
                      {client.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                          <ShieldCheck className="w-3 h-3" /> Verifie
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600" style={{ fontWeight: 600 }}>
                          <Shield className="w-3 h-3" /> Non verifie
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Telephone</div>
                    <div className="text-xs">{client.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Pays</div>
                    <div className="text-xs" style={{ fontWeight: 600 }}>{client.country}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Reservations</div>
                    <div className="text-xs" style={{ fontWeight: 600 }}>{client.totalBookings}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Depenses</div>
                    <div className="text-sm" style={{ fontWeight: 600, color: '#111827' }}>{client.totalSpent}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Inscription</div>
                    <div className="text-xs">{client.joinDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Link href={`/admin/clients/${client.id}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>Voir</span>
                  </Link>
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <PauseCircle className="w-4 h-4 text-orange-500" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>Suspendre</span>
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
            {paginatedClients.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-sm">
                Aucun client trouve
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="p-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  page === currentPage
                    ? 'bg-[#111827] text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
                style={page === currentPage ? { fontWeight: 600 } : {}}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
            >
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
