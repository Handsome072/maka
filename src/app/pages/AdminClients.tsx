'use client';

import { useState, useMemo } from 'react';
import {
  Search, Eye, Trash2, Ban, PauseCircle, ChevronUp, ChevronDown, FileDown,
  Shield, ShieldCheck, Star, ChevronLeft, ChevronRight, X, SlidersHorizontal,
  Users, UserCheck, UserPlus, BadgeCheck, AlertTriangle, RotateCcw
} from 'lucide-react';
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
  averageRating: number;
  status: 'ACTIF' | 'SUSPENDU' | 'BANNI';
  isSuspect: boolean;
}

const clients: Client[] = [
  {
    id: 1001, name: 'Jean Dupont', email: 'jean.dupont@email.com', avatar: 'JD',
    phone: '+33 6 12 34 56 78', country: 'France', verified: true,
    totalBookings: 12, totalSpent: '8 320 $', totalSpentValue: 8320,
    joinDate: '15 jan. 2024', joinDateValue: 20240115, averageRating: 4.8, status: 'ACTIF', isSuspect: false
  },
  {
    id: 1002, name: 'Marie Simon', email: 'marie.simon@email.com', avatar: 'MS',
    phone: '+33 6 23 45 67 89', country: 'France', verified: true,
    totalBookings: 8, totalSpent: '5 140 $', totalSpentValue: 5140,
    joinDate: '03 fev. 2024', joinDateValue: 20240203, averageRating: 4.5, status: 'ACTIF', isSuspect: false
  },
  {
    id: 1003, name: 'Pierre Laurent', email: 'pierre.laurent@email.com', avatar: 'PL',
    phone: '+1 514 555 1234', country: 'Canada', verified: false,
    totalBookings: 3, totalSpent: '1 890 $', totalSpentValue: 1890,
    joinDate: '22 mar. 2024', joinDateValue: 20240322, averageRating: 3.9, status: 'ACTIF', isSuspect: false
  },
  {
    id: 1004, name: 'Sophie Martin', email: 'sophie.martin@email.com', avatar: 'SM',
    phone: '+33 6 45 67 89 01', country: 'France', verified: true,
    totalBookings: 21, totalSpent: '15 670 $', totalSpentValue: 15670,
    joinDate: '08 sep. 2023', joinDateValue: 20230908, averageRating: 4.9, status: 'ACTIF', isSuspect: false
  },
  {
    id: 1005, name: 'Thomas Dubois', email: 'thomas.dubois@email.com', avatar: 'TD',
    phone: '+32 2 123 45 67', country: 'Belgique', verified: true,
    totalBookings: 5, totalSpent: '3 250 $', totalSpentValue: 3250,
    joinDate: '17 nov. 2024', joinDateValue: 20241117, averageRating: 4.2, status: 'SUSPENDU', isSuspect: true
  },
  {
    id: 1006, name: 'Lucie Bernard', email: 'lucie.bernard@email.com', avatar: 'LB',
    phone: '+41 21 345 67 89', country: 'Suisse', verified: false,
    totalBookings: 1, totalSpent: '420 $', totalSpentValue: 420,
    joinDate: '05 jan. 2025', joinDateValue: 20250105, averageRating: 0, status: 'ACTIF', isSuspect: false
  },
  {
    id: 1007, name: 'Antoine Moreau', email: 'antoine.moreau@email.com', avatar: 'AM',
    phone: '+1 438 555 6789', country: 'Canada', verified: true,
    totalBookings: 15, totalSpent: '11 200 $', totalSpentValue: 11200,
    joinDate: '30 jun. 2023', joinDateValue: 20230630, averageRating: 4.7, status: 'ACTIF', isSuspect: false
  },
  {
    id: 1008, name: 'Camille Leroy', email: 'camille.leroy@email.com', avatar: 'CL',
    phone: '+33 6 89 01 23 45', country: 'France', verified: true,
    totalBookings: 0, totalSpent: '0 $', totalSpentValue: 0,
    joinDate: '20 fev. 2025', joinDateValue: 20250220, averageRating: 0, status: 'BANNI', isSuspect: true
  },
  {
    id: 1009, name: 'Romain Girard', email: 'romain.girard@email.com', avatar: 'RG',
    phone: '+33 6 90 12 34 56', country: 'France', verified: false,
    totalBookings: 7, totalSpent: '4 580 $', totalSpentValue: 4580,
    joinDate: '12 oct. 2024', joinDateValue: 20241012, averageRating: 3.6, status: 'ACTIF', isSuspect: false
  },
  {
    id: 1010, name: 'Isabelle Petit', email: 'isabelle.petit@email.com', avatar: 'IP',
    phone: '+1 613 555 4321', country: 'Canada', verified: true,
    totalBookings: 9, totalSpent: '6 730 $', totalSpentValue: 6730,
    joinDate: '28 avr. 2024', joinDateValue: 20240428, averageRating: 4.4, status: 'ACTIF', isSuspect: false
  },
  {
    id: 1011, name: 'Marc Fontaine', email: 'marc.fontaine@email.com', avatar: 'MF',
    phone: '+33 6 11 22 33 44', country: 'France', verified: true,
    totalBookings: 18, totalSpent: '13 450 $', totalSpentValue: 13450,
    joinDate: '10 avr. 2023', joinDateValue: 20230410, averageRating: 4.6, status: 'ACTIF', isSuspect: false
  },
  {
    id: 1012, name: 'Elena Rossi', email: 'elena.rossi@email.com', avatar: 'ER',
    phone: '+39 06 1234 5678', country: 'Italie', verified: true,
    totalBookings: 6, totalSpent: '4 210 $', totalSpentValue: 4210,
    joinDate: '14 jul. 2024', joinDateValue: 20240714, averageRating: 4.3, status: 'ACTIF', isSuspect: false
  },
  {
    id: 1013, name: 'Yves Tremblay', email: 'yves.tremblay@email.com', avatar: 'YT',
    phone: '+1 514 999 8877', country: 'Canada', verified: false,
    totalBookings: 2, totalSpent: '980 $', totalSpentValue: 980,
    joinDate: '02 fev. 2025', joinDateValue: 20250202, averageRating: 3.2, status: 'ACTIF', isSuspect: false
  },
  {
    id: 1014, name: 'Clara Muller', email: 'clara.muller@email.com', avatar: 'CM',
    phone: '+41 79 876 5432', country: 'Suisse', verified: true,
    totalBookings: 11, totalSpent: '9 870 $', totalSpentValue: 9870,
    joinDate: '19 mai 2023', joinDateValue: 20230519, averageRating: 4.9, status: 'ACTIF', isSuspect: false
  },
];

type SortField = 'name' | 'totalBookings' | 'totalSpentValue' | 'joinDateValue' | 'averageRating';
type SortDirection = 'asc' | 'desc';

export function AdminClients() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [bookingsFilter, setBookingsFilter] = useState('');
  const [spentFilter, setSpentFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('joinDateValue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [suspendModal, setSuspendModal] = useState<Client | null>(null);
  const [deleteModal, setDeleteModal] = useState<Client | null>(null);
  const itemsPerPage = 8;

  const getStatusColor = (status: string) => {
    if (status === 'ACTIF') return 'bg-green-50 text-green-700';
    if (status === 'SUSPENDU') return 'bg-orange-50 text-orange-700';
    if (status === 'BANNI') return 'bg-red-50 text-red-700';
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

  const RatingStars = ({ rating }: { rating: number }) => {
    if (rating === 0) return <span className="text-xs text-gray-400">N/A</span>;
    return (
      <div className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        <span className="text-sm" style={{ fontWeight: 600 }}>{rating.toFixed(1)}</span>
      </div>
    );
  };

  const activeFiltersCount = [statusFilter, verifiedFilter, countryFilter, dateFilter, bookingsFilter, spentFilter].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('');
    setVerifiedFilter('');
    setCountryFilter('');
    setDateFilter('');
    setBookingsFilter('');
    setSpentFilter('');
    setCurrentPage(1);
  };

  const filteredClients = useMemo(() => {
    let result = [...clients];

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.id.toString().includes(s)
      );
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
      if (dateFilter === 'month') result = result.filter(c => c.joinDateValue >= 20250201);
      else if (dateFilter === '3months') result = result.filter(c => c.joinDateValue >= 20241205);
      else if (dateFilter === '6months') result = result.filter(c => c.joinDateValue >= 20240905);
      else if (dateFilter === 'year') result = result.filter(c => c.joinDateValue >= 20240305);
    }
    if (bookingsFilter) {
      if (bookingsFilter === '0') result = result.filter(c => c.totalBookings === 0);
      else if (bookingsFilter === '1-5') result = result.filter(c => c.totalBookings >= 1 && c.totalBookings <= 5);
      else if (bookingsFilter === '6-10') result = result.filter(c => c.totalBookings >= 6 && c.totalBookings <= 10);
      else if (bookingsFilter === '11-20') result = result.filter(c => c.totalBookings >= 11 && c.totalBookings <= 20);
      else if (bookingsFilter === '20+') result = result.filter(c => c.totalBookings > 20);
    }
    if (spentFilter) {
      if (spentFilter === '0-1000') result = result.filter(c => c.totalSpentValue <= 1000);
      else if (spentFilter === '1000-5000') result = result.filter(c => c.totalSpentValue > 1000 && c.totalSpentValue <= 5000);
      else if (spentFilter === '5000-10000') result = result.filter(c => c.totalSpentValue > 5000 && c.totalSpentValue <= 10000);
      else if (spentFilter === '10000+') result = result.filter(c => c.totalSpentValue > 10000);
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
  }, [search, statusFilter, verifiedFilter, countryFilter, dateFilter, bookingsFilter, spentFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const countries = [...new Set(clients.map(c => c.country))].sort();
  const totalActive = clients.filter(c => c.status === 'ACTIF').length;
  const totalVerified = clients.filter(c => c.verified).length;
  const newThisMonth = clients.filter(c => c.joinDateValue >= 20250201).length;
  const totalSpentAll = clients.reduce((sum, c) => sum + c.totalSpentValue, 0);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <div>
            <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Gestion des clients</h1>
            <p className="text-sm text-gray-500 mt-1">Gerez les utilisateurs voyageurs de la plateforme</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <FileDown className="w-4 h-4" />
              <span className="text-sm" style={{ fontWeight: 500 }}>Exporter</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>TOTAL CLIENTS</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{clients.length}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>CLIENTS ACTIFS</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{totalActive}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>NOUVEAUX CE MOIS</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{newThisMonth}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <BadgeCheck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>CLIENTS VERIFIES</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{totalVerified}</div>
          </div>
          <div className="col-span-2 lg:col-span-1 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>DEPENSES TOTALES</div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{totalSpentAll.toLocaleString('fr-FR')} $</div>
          </div>
        </div>

        {/* Clients List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Search & Filters Header */}
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <h2 className="text-lg md:text-xl" style={{ fontWeight: 600 }}>
                  Liste des clients
                  <span className="text-sm text-gray-400 ml-2" style={{ fontWeight: 400 }}>({filteredClients.length})</span>
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 border rounded-lg transition-colors flex items-center justify-center gap-2 sm:w-auto ${
                    showFilters || activeFiltersCount > 0 ? 'border-[#111827] bg-gray-50' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-sm" style={{ fontWeight: 500 }}>Filtres</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 bg-[#111827] text-white rounded-full text-xs flex items-center justify-center" style={{ fontWeight: 600 }}>
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou ID..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm"
                />
                {search && (
                  <button onClick={() => { setSearch(''); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Filter dropdowns */}
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 pt-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="ACTIF">Actif</option>
                    <option value="SUSPENDU">Suspendu</option>
                    <option value="BANNI">Banni</option>
                  </select>
                  <select
                    value={verifiedFilter}
                    onChange={(e) => { setVerifiedFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm"
                  >
                    <option value="">Verification</option>
                    <option value="verified">Verifie</option>
                    <option value="unverified">Non verifie</option>
                  </select>
                  <select
                    value={countryFilter}
                    onChange={(e) => { setCountryFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm"
                  >
                    <option value="">Tous les pays</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={bookingsFilter}
                    onChange={(e) => { setBookingsFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm"
                  >
                    <option value="">Reservations</option>
                    <option value="0">Aucune</option>
                    <option value="1-5">1 - 5</option>
                    <option value="6-10">6 - 10</option>
                    <option value="11-20">11 - 20</option>
                    <option value="20+">Plus de 20</option>
                  </select>
                  <select
                    value={spentFilter}
                    onChange={(e) => { setSpentFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm"
                  >
                    <option value="">Montant depense</option>
                    <option value="0-1000">0 - 1 000 $</option>
                    <option value="1000-5000">1 000 - 5 000 $</option>
                    <option value="5000-10000">5 000 - 10 000 $</option>
                    <option value="10000+">Plus de 10 000 $</option>
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm"
                  >
                    <option value="">Date d&apos;inscription</option>
                    <option value="month">Ce mois</option>
                    <option value="3months">3 derniers mois</option>
                    <option value="6months">6 derniers mois</option>
                    <option value="year">Cette annee</option>
                  </select>
                </div>
              )}

              {/* Active filters pills */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {statusFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs" style={{ fontWeight: 500 }}>
                      Statut: {statusFilter}
                      <button onClick={() => { setStatusFilter(''); setCurrentPage(1); }}><X className="w-3 h-3 text-gray-500 hover:text-gray-700" /></button>
                    </span>
                  )}
                  {verifiedFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs" style={{ fontWeight: 500 }}>
                      {verifiedFilter === 'verified' ? 'Verifie' : 'Non verifie'}
                      <button onClick={() => { setVerifiedFilter(''); setCurrentPage(1); }}><X className="w-3 h-3 text-gray-500 hover:text-gray-700" /></button>
                    </span>
                  )}
                  {countryFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs" style={{ fontWeight: 500 }}>
                      Pays: {countryFilter}
                      <button onClick={() => { setCountryFilter(''); setCurrentPage(1); }}><X className="w-3 h-3 text-gray-500 hover:text-gray-700" /></button>
                    </span>
                  )}
                  {bookingsFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs" style={{ fontWeight: 500 }}>
                      Reservations: {bookingsFilter}
                      <button onClick={() => { setBookingsFilter(''); setCurrentPage(1); }}><X className="w-3 h-3 text-gray-500 hover:text-gray-700" /></button>
                    </span>
                  )}
                  {spentFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs" style={{ fontWeight: 500 }}>
                      Depense: {spentFilter}
                      <button onClick={() => { setSpentFilter(''); setCurrentPage(1); }}><X className="w-3 h-3 text-gray-500 hover:text-gray-700" /></button>
                    </span>
                  )}
                  {dateFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs" style={{ fontWeight: 500 }}>
                      Inscription: {dateFilter === 'month' ? 'Ce mois' : dateFilter === '3months' ? '3 mois' : dateFilter === '6months' ? '6 mois' : 'Annee'}
                      <button onClick={() => { setDateFilter(''); setCurrentPage(1); }}><X className="w-3 h-3 text-gray-500 hover:text-gray-700" /></button>
                    </span>
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-full text-xs transition-colors"
                    style={{ fontWeight: 500 }}
                  >
                    <RotateCcw className="w-3 h-3" />
                    Effacer tout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>ID</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('name')} className="flex items-center hover:text-[#111827]">
                      CLIENT <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>CONTACT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>PAYS</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>VERIFICATION</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('totalBookings')} className="flex items-center hover:text-[#111827]">
                      RESERV. <SortIcon field="totalBookings" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('totalSpentValue')} className="flex items-center hover:text-[#111827]">
                      DEPENSES <SortIcon field="totalSpentValue" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('averageRating')} className="flex items-center hover:text-[#111827]">
                      NOTE <SortIcon field="averageRating" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('joinDateValue')} className="flex items-center hover:text-[#111827]">
                      INSCRIPTION <SortIcon field="joinDateValue" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 whitespace-nowrap" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-xs text-gray-400 font-mono">#{client.id}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#111827] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                          {client.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm truncate" style={{ fontWeight: 600 }}>{client.name}</span>
                            {client.isSuspect && (
                              <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" title="Suspect" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600 truncate max-w-[180px]">{client.email}</div>
                      <div className="text-xs text-gray-400">{client.phone}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{client.country}</td>
                    <td className="py-4 px-4">
                      {client.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700" style={{ fontWeight: 600 }}>
                          <ShieldCheck className="w-3 h-3" /> Verifie
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-500" style={{ fontWeight: 600 }}>
                          <Shield className="w-3 h-3" /> Non verifie
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-center" style={{ fontWeight: 600 }}>{client.totalBookings}</td>
                    <td className="py-4 px-4 text-sm" style={{ fontWeight: 600 }}>{client.totalSpent}</td>
                    <td className="py-4 px-4"><RatingStars rating={client.averageRating} /></td>
                    <td className="py-4 px-4 text-sm text-gray-500 whitespace-nowrap">{client.joinDate}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(client.status)}`} style={{ fontWeight: 600 }}>
                        {client.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-0.5">
                        <Link href={`/admin/clients/${client.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Voir le profil">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Link>
                        <button onClick={() => setSuspendModal(client)} className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors" title="Suspendre">
                          <PauseCircle className="w-4 h-4 text-orange-500" />
                        </button>
                        <button onClick={() => setDeleteModal(client)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedClients.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-16 text-center">
                      <div className="text-gray-400 text-sm">Aucun client trouve</div>
                      <div className="text-gray-300 text-xs mt-1">Essayez de modifier vos filtres</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tablet Table View (lg only) */}
          <div className="hidden lg:block xl:hidden overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>CLIENT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>PAYS</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>VERIF.</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>RESERV.</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>DEPENSES</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#111827] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                          {client.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm" style={{ fontWeight: 600 }}>{client.name}</span>
                            {client.isSuspect && <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
                          </div>
                          <div className="text-xs text-gray-400 truncate">#{client.id} - {client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{client.country}</td>
                    <td className="py-4 px-4">
                      {client.verified ? (
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <Shield className="w-4 h-4 text-gray-300" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-center" style={{ fontWeight: 600 }}>{client.totalBookings}</td>
                    <td className="py-4 px-4 text-sm" style={{ fontWeight: 600 }}>{client.totalSpent}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(client.status)}`} style={{ fontWeight: 600 }}>
                        {client.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-0.5">
                        <Link href={`/admin/clients/${client.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Link>
                        <button onClick={() => setSuspendModal(client)} className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors">
                          <PauseCircle className="w-4 h-4 text-orange-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedClients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">Aucun client trouve</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {paginatedClients.map((client) => (
              <div key={client.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 bg-[#111827] rounded-full flex items-center justify-center text-white flex-shrink-0 text-xs" style={{ fontWeight: 600 }}>
                    {client.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm" style={{ fontWeight: 600 }}>{client.name}</span>
                      {client.isSuspect && <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-gray-400 mb-2">#{client.id} - {client.email}</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(client.status)}`} style={{ fontWeight: 600 }}>
                        {client.status}
                      </span>
                      {client.verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-50 text-green-700" style={{ fontWeight: 600 }}>
                          <ShieldCheck className="w-3 h-3" /> Verifie
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-500" style={{ fontWeight: 600 }}>
                          <Shield className="w-3 h-3" /> Non verifie
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Telephone</div>
                    <div className="text-xs" style={{ fontWeight: 500 }}>{client.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Pays</div>
                    <div className="text-xs" style={{ fontWeight: 500 }}>{client.country}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Reservations</div>
                    <div className="text-xs" style={{ fontWeight: 600 }}>{client.totalBookings}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Depenses</div>
                    <div className="text-sm" style={{ fontWeight: 600, color: '#111827' }}>{client.totalSpent}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Note</div>
                    <RatingStars rating={client.averageRating} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Inscription</div>
                    <div className="text-xs">{client.joinDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Link href={`/admin/clients/${client.id}`} className="flex-1 px-3 py-2 bg-[#111827] text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs" style={{ fontWeight: 600 }}>Voir profil</span>
                  </Link>
                  <button onClick={() => setSuspendModal(client)} className="px-3 py-2 border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                    <PauseCircle className="w-4 h-4" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>Suspendre</span>
                  </button>
                  <button onClick={() => setDeleteModal(client)} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
            {paginatedClients.length === 0 && (
              <div className="p-12 text-center">
                <div className="text-gray-400 text-sm">Aucun client trouve</div>
                <div className="text-gray-300 text-xs mt-1">Essayez de modifier vos filtres</div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="p-4 md:p-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Affichage {filteredClients.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredClients.length)} sur {filteredClients.length} clients
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed hidden sm:block"
                  title="Premiere page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <ChevronLeft className="w-4 h-4 -ml-3" />
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {getPageNumbers().map((page, i) => (
                  typeof page === 'string' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-gray-400 hidden sm:inline">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg transition-colors text-sm ${
                        page === currentPage
                          ? 'bg-[#111827] text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                      style={page === currentPage ? { fontWeight: 600 } : {}}
                    >
                      {page}
                    </button>
                  )
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed hidden sm:block"
                  title="Derniere page"
                >
                  <ChevronRight className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4 -ml-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Suspend Modal */}
      {suspendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSuspendModal(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <PauseCircle className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg" style={{ fontWeight: 600 }}>Suspendre le compte</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Etes-vous sur de vouloir suspendre le compte de <span style={{ fontWeight: 600 }}>{suspendModal.name}</span> ?
              L&apos;utilisateur ne pourra plus acceder a la plateforme.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setSuspendModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                style={{ fontWeight: 500 }}
              >
                Annuler
              </button>
              <button
                onClick={() => setSuspendModal(null)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                style={{ fontWeight: 600 }}
              >
                Suspendre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteModal(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg" style={{ fontWeight: 600 }}>Supprimer le compte</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Etes-vous sur de vouloir supprimer le compte de <span style={{ fontWeight: 600 }}>{deleteModal.name}</span> ?
            </p>
            <p className="text-xs text-red-500 mb-6" style={{ fontWeight: 500 }}>
              Cette action est irreversible. Toutes les donnees seront supprimees.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                style={{ fontWeight: 500 }}
              >
                Annuler
              </button>
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                style={{ fontWeight: 600 }}
              >
                Supprimer definitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
