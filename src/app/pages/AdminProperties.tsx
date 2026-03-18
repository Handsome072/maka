'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, Eye, Edit, Trash2, Filter, Download, Plus, Star,
  ChevronLeft, ChevronRight, X, Home, CheckCircle, PauseCircle,
  XCircle, Clock, AlertTriangle, Building, MapPin, ChevronDown, Loader2
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { adminListingsApi, type AdminListing } from '@/app/services/api';
import { toast } from 'sonner';

type StatusKey = 'pending' | 'active' | 'rejected' | 'archived';

const STATUS_LABELS: Record<StatusKey, string> = {
  pending: 'En attente',
  active: 'Actif',
  rejected: 'Refuse',
  archived: 'Suspendu',
};

const SPACE_TYPE_LABELS: Record<string, string> = {
  entire: 'Entier',
  private: 'Prive',
  shared: 'Partage',
};

export function AdminProperties() {
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [hostFilter, setHostFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState<number | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const itemsPerPage = 8;

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminListingsApi.getAll();
      setListings(response.listings);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du chargement des annonces');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const cities = useMemo(() => [...new Set(listings.map(p => p.city).filter(Boolean))].sort() as string[], [listings]);
  const hosts = useMemo(() => {
    const unique = new Map<number, string>();
    listings.forEach(p => {
      if (p.host) unique.set(p.host.id, p.host.name);
    });
    return Array.from(unique.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [listings]);

  const filtered = useMemo(() => {
    return listings.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!(p.title?.toLowerCase().includes(q)) && !String(p.id).includes(q)) return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (cityFilter !== 'all' && p.city !== cityFilter) return false;
      if (hostFilter !== 'all' && p.host?.id !== Number(hostFilter)) return false;
      if (priceFilter !== 'all') {
        const price = Number(p.base_price) || 0;
        if (priceFilter === '0-100' && price > 100) return false;
        if (priceFilter === '100-200' && (price < 100 || price > 200)) return false;
        if (priceFilter === '200-300' && (price < 200 || price > 300)) return false;
        if (priceFilter === '300+' && price < 300) return false;
      }
      return true;
    });
  }, [listings, searchQuery, statusFilter, cityFilter, hostFilter, priceFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => ({
    total: listings.length,
    actif: listings.filter(p => p.status === 'active').length,
    enAttente: listings.filter(p => p.status === 'pending').length,
    suspendu: listings.filter(p => p.status === 'archived').length,
    refuse: listings.filter(p => p.status === 'rejected').length,
  }), [listings]);

  const activeFiltersCount = [statusFilter, cityFilter, hostFilter, priceFilter]
    .filter(f => f !== 'all').length;

  const clearFilters = () => {
    setStatusFilter('all');
    setCityFilter('all');
    setHostFilter('all');
    setPriceFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    try {
      setActionLoading(true);
      await adminListingsApi.delete(id);
      toast.success('Annonce supprimee avec succes');
      setShowDeleteModal(null);
      setListings(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async (id: number) => {
    try {
      setActionLoading(true);
      const res = await adminListingsApi.suspend(id, suspendReason);
      toast.success('Annonce suspendue');
      setShowSuspendModal(null);
      setSuspendReason('');
      setListings(prev => prev.map(p => p.id === id ? res.listing : p));
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suspension');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, label: 'Actif' };
      case 'pending': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, label: 'En attente' };
      case 'archived': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: PauseCircle, label: 'Suspendu' };
      case 'rejected': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle, label: 'Refuse' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: status };
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatPrice = (price: string | null, _currency: string) => {
    if (!price) return '--';
    return `${Number(price).toFixed(0)} C$`;
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <div>
            <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Gestion des logements</h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} logement{filtered.length > 1 ? 's' : ''} trouves</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchListings} className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
          <button onClick={() => { setStatusFilter('all'); setCurrentPage(1); }} className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border transition-all hover:shadow-md ${statusFilter === 'all' ? 'border-[#111827] ring-1 ring-[#111827]' : 'border-transparent'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Total logements</div>
          </button>
          <button onClick={() => { setStatusFilter('active'); setCurrentPage(1); }} className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border transition-all hover:shadow-md ${statusFilter === 'active' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-transparent'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl text-emerald-700" style={{ fontWeight: 600 }}>{stats.actif}</div>
            <div className="text-xs text-gray-500 mt-1">Actifs</div>
          </button>
          <button onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }} className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border transition-all hover:shadow-md ${statusFilter === 'pending' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-transparent'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl text-amber-700" style={{ fontWeight: 600 }}>{stats.enAttente}</div>
            <div className="text-xs text-gray-500 mt-1">En attente</div>
          </button>
          <button onClick={() => { setStatusFilter('archived'); setCurrentPage(1); }} className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border transition-all hover:shadow-md ${statusFilter === 'archived' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-transparent'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <PauseCircle className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl text-orange-700" style={{ fontWeight: 600 }}>{stats.suspendu}</div>
            <div className="text-xs text-gray-500 mt-1">Suspendus</div>
          </button>
          <button onClick={() => { setStatusFilter('rejected'); setCurrentPage(1); }} className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border transition-all hover:shadow-md col-span-2 md:col-span-1 ${statusFilter === 'rejected' ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl text-red-700" style={{ fontWeight: 600 }}>{stats.refuse}</div>
            <div className="text-xs text-gray-500 mt-1">Refuses</div>
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Search & Filters Header */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par titre ou ID..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 focus:border-[#111827] transition-all text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2.5 border rounded-xl transition-colors flex items-center gap-2 text-sm ${showFilters ? 'bg-[#111827] text-white border-[#111827]' : 'border-gray-200 hover:bg-gray-50'}`}
                    style={{ fontWeight: 500 }}
                  >
                    <Filter className="w-4 h-4" />
                    Filtres
                    {activeFiltersCount > 0 && (
                      <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${showFilters ? 'bg-white text-[#111827]' : 'bg-[#111827] text-white'}`} style={{ fontWeight: 600 }}>
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-2.5 text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Effacer
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Statut</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm"
                    >
                      <option value="all">Tous</option>
                      <option value="active">Actif</option>
                      <option value="pending">En attente</option>
                      <option value="archived">Suspendu</option>
                      <option value="rejected">Refuse</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Ville</label>
                    <select
                      value={cityFilter}
                      onChange={(e) => { setCityFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm"
                    >
                      <option value="all">Toutes</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Hote</label>
                    <select
                      value={hostFilter}
                      onChange={(e) => { setHostFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm"
                    >
                      <option value="all">Tous</option>
                      {hosts.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Prix / nuit</label>
                    <select
                      value={priceFilter}
                      onChange={(e) => { setPriceFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm"
                    >
                      <option value="all">Tous</option>
                      <option value="0-100">0 - 100$</option>
                      <option value="100-200">100 - 200$</option>
                      <option value="200-300">200 - 300$</option>
                      <option value="300+">300+$</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              <p className="text-sm text-gray-500">Chargement des annonces...</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden xl:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>ID</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Logement</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Hote</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Localisation</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Prix/nuit</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Type</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Capacite</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Date creation</th>
                      <th className="text-right py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((listing) => {
                      const statusConfig = getStatusConfig(listing.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <tr key={listing.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                          <td className="py-3.5 px-4">
                            <span className="text-xs text-gray-400 font-mono">#{listing.id}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 flex-shrink-0 overflow-hidden">
                                {listing.photos.length > 0 ? (
                                  <img src={listing.photos[0].url} alt="" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <Home className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <Link href={`/admin/properties/${listing.id}`} className="text-sm hover:text-[#111827] hover:underline transition-colors block truncate max-w-[180px]" style={{ fontWeight: 600 }}>
                                  {listing.title || 'Sans titre'}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-sm text-gray-600">
                              {listing.host?.name || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{listing.city || 'N/A'}, {listing.province}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-sm" style={{ fontWeight: 600 }}>{formatPrice(listing.base_price, listing.currency)}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-sm text-gray-600">
                              {listing.space_type ? (SPACE_TYPE_LABELS[listing.space_type] || listing.space_type) : '--'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-sm" style={{ fontWeight: 500 }}>{listing.capacity}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-xs text-gray-500">{formatDate(listing.created_at)}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link href={`/admin/properties/${listing.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voir">
                                <Eye className="w-4 h-4 text-gray-500" />
                              </Link>
                              {listing.status === 'active' && (
                                <button onClick={() => setShowSuspendModal(listing.id)} className="p-2 hover:bg-orange-50 rounded-lg transition-colors" title="Suspendre">
                                  <PauseCircle className="w-4 h-4 text-orange-500" />
                                </button>
                              )}
                              <button onClick={() => setShowDeleteModal(listing.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {paginated.length === 0 && (
                      <tr>
                        <td colSpan={10} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <Search className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="text-sm text-gray-500">Aucun logement trouve</div>
                            <button onClick={clearFilters} className="text-sm text-[#111827] hover:underline" style={{ fontWeight: 500 }}>
                              Effacer les filtres
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Tablet Table View */}
              <div className="hidden md:block xl:hidden overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Logement</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Hote</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Prix</th>
                      <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                      <th className="text-right py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((listing) => {
                      const statusConfig = getStatusConfig(listing.status);
                      const StatusIcon = statusConfig.icon;
                      return (
                        <tr key={listing.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 flex-shrink-0 overflow-hidden">
                                {listing.photos.length > 0 ? (
                                  <img src={listing.photos[0].url} alt="" className="w-full h-full object-cover rounded-lg" />
                                ) : (
                                  <Home className="w-4 h-4" />
                                )}
                              </div>
                              <div>
                                <Link href={`/admin/properties/${listing.id}`} className="text-sm hover:underline block" style={{ fontWeight: 600 }}>
                                  {listing.title || 'Sans titre'}
                                </Link>
                                <div className="text-xs text-gray-500">{listing.city || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-sm text-gray-600">{listing.host?.name || 'N/A'}</td>
                          <td className="py-3.5 px-4 text-sm" style={{ fontWeight: 600 }}>{formatPrice(listing.base_price, listing.currency)}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/admin/properties/${listing.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Eye className="w-4 h-4 text-gray-500" />
                              </Link>
                              <button onClick={() => setShowDeleteModal(listing.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-50">
                {paginated.map((listing) => {
                  const statusConfig = getStatusConfig(listing.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <div key={listing.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 flex-shrink-0 overflow-hidden">
                          {listing.photos.length > 0 ? (
                            <img src={listing.photos[0].url} alt="" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Home className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/admin/properties/${listing.id}`} className="text-sm hover:underline block truncate" style={{ fontWeight: 600 }}>
                            {listing.title || 'Sans titre'}
                          </Link>
                          <div className="text-xs text-gray-500 mb-2">#{listing.id} - {listing.host?.name || 'N/A'}</div>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                        <div>
                          <div className="text-gray-500 mb-0.5">Localisation</div>
                          <div style={{ fontWeight: 500 }}>{listing.city || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-0.5">Prix/nuit</div>
                          <div style={{ fontWeight: 600 }}>{formatPrice(listing.base_price, listing.currency)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-0.5">Capacite</div>
                          <div style={{ fontWeight: 500 }}>{listing.capacity} pers.</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        <Link href={`/admin/properties/${listing.id}`} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                          <Eye className="w-3.5 h-3.5" />
                          Voir
                        </Link>
                        <button onClick={() => setShowDeleteModal(listing.id)} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {paginated.length === 0 && (
                  <div className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="w-8 h-8 text-gray-300" />
                      <div className="text-sm text-gray-500">Aucun logement trouve</div>
                      <button onClick={clearFilters} className="text-sm text-[#111827] hover:underline" style={{ fontWeight: 500 }}>
                        Effacer les filtres
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    Affichage {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} sur {filtered.length}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm transition-colors ${page === currentPage ? 'bg-[#111827] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                        style={{ fontWeight: page === currentPage ? 600 : 400 }}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>Supprimer le logement</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Etes-vous sur de vouloir supprimer ce logement ? Cette action est irreversible et supprimera toutes les donnees associees.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }} disabled={actionLoading}>
                Annuler
              </button>
              <button onClick={() => handleDelete(showDeleteModal)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2" style={{ fontWeight: 600 }} disabled={actionLoading}>
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {showSuspendModal !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSuspendModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PauseCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>Suspendre le logement</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Le logement ne sera plus visible par les utilisateurs. L&apos;hote sera notifie de la suspension.
            </p>
            <textarea
              placeholder="Raison de la suspension (optionnel)..."
              rows={3}
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm resize-none mb-4"
            />
            <div className="flex items-center gap-3">
              <button onClick={() => { setShowSuspendModal(null); setSuspendReason(''); }} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }} disabled={actionLoading}>
                Annuler
              </button>
              <button onClick={() => handleSuspend(showSuspendModal)} className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-sm flex items-center justify-center gap-2" style={{ fontWeight: 600 }} disabled={actionLoading}>
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Suspendre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
