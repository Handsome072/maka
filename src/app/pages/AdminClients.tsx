'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search, Eye, Trash2, Ban, PauseCircle, ChevronUp, ChevronDown, FileDown,
  Shield, ShieldCheck, Star, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, SlidersHorizontal,
  Users, UserCheck, UserPlus, BadgeCheck, AlertTriangle, RotateCcw, Loader2
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminClientsApi, type AdminClient, type AdminClientsStats } from '@/app/services/api';

type Client = AdminClient;

type SortField = 'name' | 'totalBookings' | 'totalSpentValue' | 'joinDateValue' | 'averageRating';
type SortDirection = 'asc' | 'desc';

export function AdminClients() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<AdminClientsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminClientsApi.getAll();
      setClients(response.clients);
      setStats(response.stats);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des clients';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleSuspend = async (client: Client) => {
    try {
      if (client.status === 'SUSPENDU' || client.status === 'BANNI') {
        await adminClientsApi.activate(client.id);
      } else {
        await adminClientsApi.suspend(client.id);
      }
      setSuspendModal(null);
      fetchClients();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      alert(message);
    }
  };

  const handleDelete = async (client: Client) => {
    try {
      await adminClientsApi.delete(client.id);
      setDeleteModal(null);
      fetchClients();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      alert(message);
    }
  };

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
  }, [clients, search, statusFilter, verifiedFilter, countryFilter, dateFilter, bookingsFilter, spentFilter, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const countries = stats?.countries?.length ? [...stats.countries].sort() : [...new Set(clients.map(c => c.country).filter(Boolean))].sort();
  const totalActive = stats?.totalActive ?? clients.filter(c => c.status === 'ACTIF').length;
  const totalVerified = stats?.totalVerified ?? clients.filter(c => c.verified).length;
  const newThisMonth = stats?.newThisMonth ?? 0;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500">Chargement des clients...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <p className="text-sm text-red-600">{error}</p>
              <button onClick={fetchClients} className="px-4 py-2 bg-[#111827] text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reessayer
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => router.push(`/admin/clients/${client.id}`)}>
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
                              <AlertTriangle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
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
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-0.5">
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
                  <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => router.push(`/admin/clients/${client.id}`)}>
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
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => setSuspendModal(client)} className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors">
                          <PauseCircle className="w-4 h-4 text-orange-500" />
                        </button>
                        <button onClick={() => setDeleteModal(client)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
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
              <div key={client.id} className="p-4 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => router.push(`/admin/clients/${client.id}`)}>
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
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                  <button onClick={(e) => { e.stopPropagation(); setSuspendModal(client); }} className="px-3 py-2 border border-orange-200 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                    <PauseCircle className="w-4 h-4" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>Suspendre</span>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteModal(client); }} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors">
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
                  <ChevronsLeft className="w-4 h-4" />
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
                  <ChevronsRight className="w-4 h-4" />
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
                onClick={() => handleSuspend(suspendModal)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                style={{ fontWeight: 600 }}
              >
                {suspendModal.status === 'SUSPENDU' || suspendModal.status === 'BANNI' ? 'Reactiver' : 'Suspendre'}
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
                onClick={() => handleDelete(deleteModal)}
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
