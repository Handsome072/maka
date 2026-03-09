'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Search, Eye, PauseCircle, ChevronUp, ChevronDown, FileDown,
  Shield, ShieldCheck, Star, ChevronLeft, ChevronRight, X, SlidersHorizontal,
  Users, UserCheck, UserX, BadgeCheck, Home, DollarSign, TrendingUp, BarChart3,
  Loader2
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import Link from 'next/link';
import { adminHostsApi, type AdminHost, type AdminHostsStats } from '@/app/services/api';

type SortField = 'name' | 'properties' | 'totalBookings' | 'totalEarningsValue' | 'avgRating' | 'joinDateValue';
type SortDirection = 'asc' | 'desc';

export function AdminHosts() {
  const [hosts, setHosts] = useState<AdminHost[]>([]);
  const [stats, setStats] = useState<AdminHostsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [propertiesFilter, setPropertiesFilter] = useState('');
  const [earningsFilter, setEarningsFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('joinDateValue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  // Fetch hosts from API
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminHostsApi.getAll();
        setHosts(response.hosts);
        setStats(response.stats);
      } catch (err: any) {
        console.error('Error fetching hosts:', err);
        setError(err.message || 'Erreur lors du chargement des hôtes');
      } finally {
        setLoading(false);
      }
    };

    fetchHosts();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'ACTIF') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (status === 'SUSPENDU') return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (status === 'BANNI') return 'bg-red-50 text-red-700 border border-red-200';
    return 'bg-gray-50 text-gray-700 border border-gray-200';
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
      result = result.filter(h =>
        h.name.toLowerCase().includes(s) ||
        h.email.toLowerCase().includes(s) ||
        h.id.toString().includes(s)
      );
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
    if (earningsFilter) {
      if (earningsFilter === '0-10000') result = result.filter(h => h.totalEarningsValue <= 10000);
      else if (earningsFilter === '10000-30000') result = result.filter(h => h.totalEarningsValue > 10000 && h.totalEarningsValue <= 30000);
      else if (earningsFilter === '30000-60000') result = result.filter(h => h.totalEarningsValue > 30000 && h.totalEarningsValue <= 60000);
      else if (earningsFilter === '60000+') result = result.filter(h => h.totalEarningsValue > 60000);
    }
    if (dateFilter) {
      if (dateFilter === '2025') result = result.filter(h => h.joinDateValue >= 20250101);
      else if (dateFilter === '2024') result = result.filter(h => h.joinDateValue >= 20240101 && h.joinDateValue < 20250101);
      else if (dateFilter === '2023') result = result.filter(h => h.joinDateValue >= 20230101 && h.joinDateValue < 20240101);
      else if (dateFilter === '2022') result = result.filter(h => h.joinDateValue < 20230101);
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
  }, [hosts, search, statusFilter, verifiedFilter, countryFilter, propertiesFilter, earningsFilter, dateFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredHosts.length / itemsPerPage));
  const paginatedHosts = filteredHosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const countries = useMemo(() => stats?.countries || [...new Set(hosts.map(h => h.country).filter(Boolean))], [stats, hosts]);
  const totalActive = stats?.totalActive ?? hosts.filter(h => h.status === 'ACTIF').length;
  const totalVerified = stats?.totalVerified ?? hosts.filter(h => h.verified).length;
  const totalSuspended = stats?.totalSuspended ?? hosts.filter(h => h.status === 'SUSPENDU' || h.status === 'BANNI').length;
  const totalProperties = stats?.totalProperties ?? hosts.reduce((sum, h) => sum + h.properties, 0);

  const activeFiltersCount = [statusFilter, verifiedFilter, countryFilter, propertiesFilter, earningsFilter, dateFilter].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearch('');
    setStatusFilter('');
    setVerifiedFilter('');
    setCountryFilter('');
    setPropertiesFilter('');
    setEarningsFilter('');
    setDateFilter('');
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
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
            <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 700 }}>Gestion des hotes</h1>
            <p className="text-sm text-gray-500 mt-1">Supervisez et gerez tous les hotes de la plateforme</p>
          </div>
          <button className="px-4 py-2.5 border border-gray-200 bg-white rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
            <FileDown className="w-4 h-4" />
            <span className="text-sm" style={{ fontWeight: 500 }}>Exporter</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-4.5 h-4.5 text-blue-600" />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Total hotes</div>
            </div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 700 }}>{loading ? '—' : hosts.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Actifs</div>
            </div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 700 }}>{loading ? '—' : totalActive}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center">
                <BadgeCheck className="w-4.5 h-4.5 text-violet-600" />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Verifies</div>
            </div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 700 }}>{loading ? '—' : totalVerified}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                <Home className="w-4.5 h-4.5 text-amber-600" />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Logements</div>
            </div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 700 }}>{loading ? '—' : totalProperties}</div>
          </div>
          <div className="col-span-2 lg:col-span-1 bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-rose-50 rounded-lg flex items-center justify-center">
                <UserX className="w-4.5 h-4.5 text-rose-600" />
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Suspendus / Bannis</div>
            </div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 700 }}>{loading ? '—' : totalSuspended}</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
            <p className="text-sm text-gray-500">Chargement des hotes...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-sm hover:bg-[#1f2937] transition-colors"
              style={{ fontWeight: 500 }}
            >
              Reessayer
            </button>
          </div>
        )}

        {/* Hosts List */}
        {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Search & Filters Header */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>Liste des hotes</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{filteredHosts.length} resultat{filteredHosts.length > 1 ? 's' : ''}</span>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearAllFilters} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 transition-colors" style={{ fontWeight: 500 }}>
                      <X className="w-3 h-3" />
                      Effacer les filtres ({activeFiltersCount})
                    </button>
                  )}
                </div>
              </div>

              {/* Search + Filter Toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email ou ID..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent text-sm bg-gray-50 placeholder:text-gray-400"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 border rounded-xl transition-colors flex items-center justify-center gap-2 text-sm ${
                    showFilters || activeFiltersCount > 0
                      ? 'border-[#111827] bg-[#111827] text-white'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">Filtres</span>
                  {activeFiltersCount > 0 && (
                    <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                      showFilters || activeFiltersCount > 0 ? 'bg-white text-[#111827]' : 'bg-[#111827] text-white'
                    }`} style={{ fontWeight: 600 }}>
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Filter Dropdowns */}
              {showFilters && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm bg-gray-50"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="ACTIF">Actif</option>
                    <option value="SUSPENDU">Suspendu</option>
                    <option value="BANNI">Banni</option>
                  </select>
                  <select
                    value={verifiedFilter}
                    onChange={(e) => { setVerifiedFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm bg-gray-50"
                  >
                    <option value="">Verification</option>
                    <option value="verified">Verifie</option>
                    <option value="unverified">Non verifie</option>
                  </select>
                  <select
                    value={countryFilter}
                    onChange={(e) => { setCountryFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm bg-gray-50"
                  >
                    <option value="">Tous les pays</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={propertiesFilter}
                    onChange={(e) => { setPropertiesFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm bg-gray-50"
                  >
                    <option value="">Nb logements</option>
                    <option value="1-5">1 - 5</option>
                    <option value="6-10">6 - 10</option>
                    <option value="11-20">11 - 20</option>
                    <option value="20+">20+</option>
                  </select>
                  <select
                    value={earningsFilter}
                    onChange={(e) => { setEarningsFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm bg-gray-50"
                  >
                    <option value="">Revenus generes</option>
                    <option value="0-10000">0 - 10 000 €</option>
                    <option value="10000-30000">10 000 - 30 000 €</option>
                    <option value="30000-60000">30 000 - 60 000 €</option>
                    <option value="60000+">60 000+ €</option>
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm bg-gray-50"
                  >
                    <option value="">Date inscription</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022 et avant</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>ID</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('name')} className="flex items-center hover:text-[#111827] transition-colors">
                      Hote <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Contact</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Pays</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Verification</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('properties')} className="flex items-center hover:text-[#111827] transition-colors">
                      Logements <SortIcon field="properties" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('totalBookings')} className="flex items-center hover:text-[#111827] transition-colors">
                      Reservations <SortIcon field="totalBookings" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('totalEarningsValue')} className="flex items-center hover:text-[#111827] transition-colors">
                      Revenus <SortIcon field="totalEarningsValue" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    <button onClick={() => handleSort('avgRating')} className="flex items-center hover:text-[#111827] transition-colors">
                      Note <SortIcon field="avgRating" />
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHosts.map((host) => (
                  <tr key={host.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-400 font-mono">#{host.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#111827] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                          {host.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm truncate" style={{ fontWeight: 600 }}>{host.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-sm text-gray-600 truncate max-w-[180px]">{host.email}</div>
                      <div className="text-xs text-gray-400">{host.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-600">{host.country}</td>
                    <td className="py-3.5 px-4">
                      {host.verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200" style={{ fontWeight: 500 }}>
                          <ShieldCheck className="w-3 h-3" /> Verifie
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-50 text-gray-500 border border-gray-200" style={{ fontWeight: 500 }}>
                          <Shield className="w-3 h-3" /> Non verifie
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm" style={{ fontWeight: 600 }}>{host.properties}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm" style={{ fontWeight: 600 }}>{host.totalBookings}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm" style={{ fontWeight: 700, color: '#111827' }}>{host.totalEarnings}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm" style={{ fontWeight: 600 }}>{host.avgRating}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(host.status)}`} style={{ fontWeight: 600 }}>
                        {host.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/hosts/${host.id}`} className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" title="Voir le profil">
                          <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        </Link>
                        <button className="p-2 hover:bg-amber-50 rounded-lg transition-colors group" title="Suspendre">
                          <PauseCircle className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedHosts.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-gray-400 text-sm">Aucun hote trouve</div>
                        {activeFiltersCount > 0 && (
                          <button onClick={clearAllFilters} className="text-sm text-[#111827] hover:underline" style={{ fontWeight: 500 }}>
                            Effacer les filtres
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tablet Table View (md to xl) */}
          <div className="hidden md:block xl:hidden overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Hote</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Pays</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Verif.</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Logements</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Revenus</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Note</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedHosts.map((host) => (
                  <tr key={host.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#111827] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                          {host.avatar}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm truncate" style={{ fontWeight: 600 }}>{host.name}</div>
                          <div className="text-xs text-gray-400 truncate">#{host.id} · {host.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{host.country}</td>
                    <td className="py-3 px-4">
                      {host.verified ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Shield className="w-4 h-4 text-gray-400" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm" style={{ fontWeight: 600 }}>{host.properties}</td>
                    <td className="py-3 px-4 text-sm" style={{ fontWeight: 700 }}>{host.totalEarnings}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm" style={{ fontWeight: 600 }}>{host.avgRating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColor(host.status)}`} style={{ fontWeight: 600 }}>
                        {host.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/hosts/${host.id}`} className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                        </Link>
                        <button className="p-1.5 hover:bg-amber-50 rounded-lg transition-colors">
                          <PauseCircle className="w-4 h-4 text-gray-400 hover:text-amber-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedHosts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-gray-400 text-sm">
                      Aucun hote trouve
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {paginatedHosts.map((host) => (
              <div key={host.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                {/* Header: Avatar + Info + Status */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 bg-[#111827] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                    {host.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm" style={{ fontWeight: 600 }}>{host.name}</span>
                      <span className="text-xs text-gray-400 font-mono">#{host.id}</span>
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">{host.email}</div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColor(host.status)}`} style={{ fontWeight: 600 }}>
                        {host.status}
                      </span>
                      {host.verified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200" style={{ fontWeight: 500 }}>
                          <ShieldCheck className="w-3 h-3" /> Verifie
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-50 text-gray-500 border border-gray-200" style={{ fontWeight: 500 }}>
                          <Shield className="w-3 h-3" /> Non verifie
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-3 bg-gray-50/80 rounded-xl p-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-0.5">Logements</div>
                    <div className="text-sm" style={{ fontWeight: 700 }}>{host.properties}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-0.5">Revenus</div>
                    <div className="text-sm" style={{ fontWeight: 700 }}>{host.totalEarnings}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-0.5">Note</div>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-sm" style={{ fontWeight: 700 }}>{host.avgRating}</span>
                    </div>
                  </div>
                </div>

                {/* Extra Info */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <span>{host.phone}</span>
                  </div>
                  <div className="text-right text-gray-500">
                    {host.country} · {host.totalBookings} reserv.
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Link href={`/admin/hosts/${host.id}`} className="flex-1 px-3 py-2 bg-[#111827] text-white rounded-xl hover:bg-[#1f2937] transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs" style={{ fontWeight: 600 }}>Voir le profil</span>
                  </Link>
                  <button className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-amber-50 hover:border-amber-200 transition-colors flex items-center justify-center gap-2">
                    <PauseCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>Suspendre</span>
                  </button>
                </div>
              </div>
            ))}
            {paginatedHosts.length === 0 && (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-gray-400 text-sm">Aucun hote trouve</div>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearAllFilters} className="text-sm text-[#111827] hover:underline" style={{ fontWeight: 500 }}>
                      Effacer les filtres
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 md:p-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500 order-2 sm:order-1">
                  Affichage {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredHosts.length)} sur {filteredHosts.length}
                </div>
                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {getPageNumbers().map((page, i) => (
                    typeof page === 'string' ? (
                      <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg transition-colors text-sm ${
                          page === currentPage
                            ? 'bg-[#111827] text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
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
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        )}
      </main>
    </div>
  );
}
