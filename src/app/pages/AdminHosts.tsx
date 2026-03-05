'use client';

import { useState, useMemo } from 'react';
import { Search, Eye, Trash2, Ban, PauseCircle, ChevronUp, ChevronDown, FileDown, Shield, ShieldCheck, Star } from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import Link from 'next/link';

interface Host {
  id: number;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  country: string;
  verified: boolean;
  properties: number;
  totalBookings: number;
  totalEarnings: string;
  totalEarningsValue: number;
  avgRating: number;
  joinDate: string;
  joinDateValue: number;
  status: 'ACTIF' | 'SUSPENDU' | 'BANNI';
}

const hosts: Host[] = [
  {
    id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', avatar: 'JD',
    phone: '+33 6 12 34 56 78', country: 'France', verified: true,
    properties: 12, totalBookings: 156, totalEarnings: '45 230 €', totalEarningsValue: 45230,
    avgRating: 4.8, joinDate: '15 jan. 2023', joinDateValue: 20230115, status: 'ACTIF'
  },
  {
    id: 2, name: 'Marie Simon', email: 'marie.simon@email.com', avatar: 'MS',
    phone: '+33 6 23 45 67 89', country: 'France', verified: true,
    properties: 8, totalBookings: 98, totalEarnings: '32 150 €', totalEarningsValue: 32150,
    avgRating: 4.6, joinDate: '03 fev. 2023', joinDateValue: 20230203, status: 'ACTIF'
  },
  {
    id: 3, name: 'Pierre Laurent', email: 'pierre.laurent@email.com', avatar: 'PL',
    phone: '+33 6 34 56 78 90', country: 'France', verified: false,
    properties: 15, totalBookings: 210, totalEarnings: '67 890 €', totalEarningsValue: 67890,
    avgRating: 4.3, joinDate: '22 mar. 2023', joinDateValue: 20230322, status: 'ACTIF'
  },
  {
    id: 4, name: 'Sophie Martin', email: 'sophie.martin@email.com', avatar: 'SM',
    phone: '+33 6 45 67 89 01', country: 'Belgique', verified: true,
    properties: 6, totalBookings: 72, totalEarnings: '18 450 €', totalEarningsValue: 18450,
    avgRating: 4.9, joinDate: '08 sep. 2023', joinDateValue: 20230908, status: 'ACTIF'
  },
  {
    id: 5, name: 'Thomas Dubois', email: 'thomas.dubois@email.com', avatar: 'TD',
    phone: '+32 2 123 45 67', country: 'Belgique', verified: true,
    properties: 9, totalBookings: 45, totalEarnings: '28 340 €', totalEarningsValue: 28340,
    avgRating: 3.9, joinDate: '17 nov. 2023', joinDateValue: 20231117, status: 'SUSPENDU'
  },
  {
    id: 6, name: 'Lucie Bernard', email: 'lucie.bernard@email.com', avatar: 'LB',
    phone: '+41 21 345 67 89', country: 'Suisse', verified: true,
    properties: 18, totalBookings: 312, totalEarnings: '89 120 €', totalEarningsValue: 89120,
    avgRating: 4.7, joinDate: '30 jun. 2022', joinDateValue: 20220630, status: 'ACTIF'
  },
  {
    id: 7, name: 'Antoine Moreau', email: 'antoine.moreau@email.com', avatar: 'AM',
    phone: '+1 438 555 6789', country: 'Canada', verified: true,
    properties: 25, totalBookings: 420, totalEarnings: '125 450 €', totalEarningsValue: 125450,
    avgRating: 4.5, joinDate: '12 avr. 2022', joinDateValue: 20220412, status: 'ACTIF'
  },
  {
    id: 8, name: 'Camille Leroy', email: 'camille.leroy@email.com', avatar: 'CL',
    phone: '+33 6 89 01 23 45', country: 'France', verified: false,
    properties: 4, totalBookings: 18, totalEarnings: '12 890 €', totalEarningsValue: 12890,
    avgRating: 4.1, joinDate: '20 fev. 2025', joinDateValue: 20250220, status: 'BANNI'
  },
  {
    id: 9, name: 'Romain Girard', email: 'romain.girard@email.com', avatar: 'RG',
    phone: '+33 6 90 12 34 56', country: 'France', verified: true,
    properties: 11, totalBookings: 134, totalEarnings: '56 780 €', totalEarningsValue: 56780,
    avgRating: 4.4, joinDate: '12 oct. 2023', joinDateValue: 20231012, status: 'ACTIF'
  },
  {
    id: 10, name: 'Isabelle Petit', email: 'isabelle.petit@email.com', avatar: 'IP',
    phone: '+1 613 555 4321', country: 'Canada', verified: true,
    properties: 3, totalBookings: 28, totalEarnings: '9 730 €', totalEarningsValue: 9730,
    avgRating: 4.2, joinDate: '28 avr. 2024', joinDateValue: 20240428, status: 'ACTIF'
  },
];

type SortField = 'name' | 'properties' | 'totalBookings' | 'totalEarningsValue' | 'avgRating' | 'joinDateValue';
type SortDirection = 'asc' | 'desc';

export function AdminHosts() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [propertiesFilter, setPropertiesFilter] = useState('');
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

  const filteredHosts = useMemo(() => {
    let result = [...hosts];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(h => h.name.toLowerCase().includes(s) || h.email.toLowerCase().includes(s));
    }
    if (statusFilter) {
      result = result.filter(h => h.status === statusFilter);
    }
    if (verifiedFilter) {
      result = result.filter(h => verifiedFilter === 'verified' ? h.verified : !h.verified);
    }
    if (countryFilter) {
      result = result.filter(h => h.country === countryFilter);
    }
    if (propertiesFilter) {
      if (propertiesFilter === '1-5') result = result.filter(h => h.properties >= 1 && h.properties <= 5);
      else if (propertiesFilter === '6-10') result = result.filter(h => h.properties >= 6 && h.properties <= 10);
      else if (propertiesFilter === '11-20') result = result.filter(h => h.properties >= 11 && h.properties <= 20);
      else if (propertiesFilter === '20+') result = result.filter(h => h.properties > 20);
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
  }, [search, statusFilter, verifiedFilter, countryFilter, propertiesFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredHosts.length / itemsPerPage));
  const paginatedHosts = filteredHosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const countries = [...new Set(hosts.map(h => h.country))];
  const totalActive = hosts.filter(h => h.status === 'ACTIF').length;
  const totalVerified = hosts.filter(h => h.verified).length;
  const totalSuspended = hosts.filter(h => h.status === 'SUSPENDU' || h.status === 'BANNI').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Gestion des hotes</h1>
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
            <div className="text-sm text-gray-600 mb-2">TOTAL HOTES</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{hosts.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">HOTES ACTIFS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{totalActive}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">HOTES VERIFIES</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{totalVerified}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">SUSPENDUS / BANNIS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{totalSuspended}</div>
          </div>
        </div>

        {/* Hosts List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg md:text-xl" style={{ fontWeight: 600 }}>Liste des hotes</h2>
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
                  value={propertiesFilter}
                  onChange={(e) => { setPropertiesFilter(e.target.value); setCurrentPage(1); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]"
                >
                  <option value="">Nb logements</option>
                  <option value="1-5">1 - 5</option>
                  <option value="6-10">6 - 10</option>
                  <option value="11-20">11 - 20</option>
                  <option value="20+">20+</option>
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
                      HOTE <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>EMAIL</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>TELEPHONE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>PAYS</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>VERIFICATION</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('properties')} className="flex items-center hover:text-[#111827]">
                      LOGEMENTS <SortIcon field="properties" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('totalBookings')} className="flex items-center hover:text-[#111827]">
                      RESERVATIONS <SortIcon field="totalBookings" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('totalEarningsValue')} className="flex items-center hover:text-[#111827]">
                      REVENUS <SortIcon field="totalEarningsValue" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('avgRating')} className="flex items-center hover:text-[#111827]">
                      NOTE <SortIcon field="avgRating" />
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
                {paginatedHosts.map((host) => (
                  <tr key={host.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#111827] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                          {host.avatar}
                        </div>
                        <div className="text-sm" style={{ fontWeight: 600 }}>{host.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{host.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{host.phone}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{host.country}</td>
                    <td className="py-4 px-6">
                      {host.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                          <ShieldCheck className="w-3 h-3" /> Verifie
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600" style={{ fontWeight: 600 }}>
                          <Shield className="w-3 h-3" /> Non verifie
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{host.properties}</td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{host.totalBookings}</td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{host.totalEarnings}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm" style={{ fontWeight: 600 }}>{host.avgRating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{host.joinDate}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(host.status)}`} style={{ fontWeight: 600 }}>
                        {host.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/hosts/${host.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voir le profil">
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
                {paginatedHosts.length === 0 && (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-gray-400 text-sm">
                      Aucun hote trouve
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {paginatedHosts.map((host) => (
              <div key={host.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#111827] rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ fontWeight: 600 }}>
                    {host.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{host.name}</div>
                    <div className="text-xs text-gray-500 truncate mb-2">{host.email}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(host.status)}`} style={{ fontWeight: 600 }}>
                        {host.status}
                      </span>
                      {host.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                          <ShieldCheck className="w-3 h-3" /> Verifie
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600" style={{ fontWeight: 600 }}>
                          <Shield className="w-3 h-3" /> Non verifie
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {host.avgRating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Telephone</div>
                    <div className="text-xs">{host.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Pays</div>
                    <div className="text-xs" style={{ fontWeight: 600 }}>{host.country}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Logements</div>
                    <div className="text-xs" style={{ fontWeight: 600 }}>{host.properties}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Reservations</div>
                    <div className="text-xs" style={{ fontWeight: 600 }}>{host.totalBookings}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Revenus</div>
                    <div className="text-sm" style={{ fontWeight: 600, color: '#111827' }}>{host.totalEarnings}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Inscription</div>
                    <div className="text-xs">{host.joinDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Link href={`/admin/hosts/${host.id}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
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
            {paginatedHosts.length === 0 && (
              <div className="p-8 text-center text-gray-400 text-sm">
                Aucun hote trouve
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
