'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Eye, Edit, Trash2, Filter, Download, Plus, Star,
  ChevronLeft, ChevronRight, X, Home, CheckCircle, PauseCircle,
  XCircle, Clock, AlertTriangle, Building, MapPin, ChevronDown
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

type PropertyStatus = 'Actif' | 'En attente' | 'Suspendu' | 'Refuse';
type PropertyType = 'Villa' | 'Appartement' | 'Chalet' | 'Studio' | 'Maison' | 'Loft';

interface Property {
  id: number;
  photo: string;
  title: string;
  host: { name: string; avatar: string; id: number };
  city: string;
  country: string;
  pricePerNight: number;
  type: PropertyType;
  totalReservations: number;
  averageRating: number;
  totalReviews: number;
  status: PropertyStatus;
  createdAt: string;
}

const properties: Property[] = [
  {
    id: 1, photo: '/images/properties/villa-toscane.jpg', title: 'Villa Toscane',
    host: { name: 'Jean Dupont', avatar: 'JD', id: 1 }, city: 'Paris', country: 'France',
    pricePerNight: 250, type: 'Villa', totalReservations: 67, averageRating: 4.9, totalReviews: 54,
    status: 'Actif', createdAt: '2023-01-15'
  },
  {
    id: 2, photo: '/images/properties/apt-paris.jpg', title: 'Appartement Paris 8e',
    host: { name: 'Marie Simon', avatar: 'MS', id: 2 }, city: 'Paris', country: 'France',
    pricePerNight: 120, type: 'Appartement', totalReservations: 45, averageRating: 4.7, totalReviews: 38,
    status: 'Actif', createdAt: '2023-02-03'
  },
  {
    id: 3, photo: '/images/properties/chalet-alpes.jpg', title: 'Chalet des Alpes',
    host: { name: 'Pierre Laurent', avatar: 'PL', id: 3 }, city: 'Chamonix', country: 'France',
    pricePerNight: 180, type: 'Chalet', totalReservations: 32, averageRating: 4.8, totalReviews: 28,
    status: 'Actif', createdAt: '2023-03-20'
  },
  {
    id: 4, photo: '/images/properties/studio-moderne.jpg', title: 'Studio Moderne Centre',
    host: { name: 'Sophie Martin', avatar: 'SM', id: 4 }, city: 'Marseille', country: 'France',
    pricePerNight: 85, type: 'Studio', totalReservations: 23, averageRating: 4.5, totalReviews: 19,
    status: 'En attente', createdAt: '2024-11-10'
  },
  {
    id: 5, photo: '/images/properties/maison-mer.jpg', title: 'Maison Bord de Mer',
    host: { name: 'Thomas Dubois', avatar: 'TD', id: 5 }, city: 'Nice', country: 'France',
    pricePerNight: 320, type: 'Maison', totalReservations: 89, averageRating: 4.9, totalReviews: 72,
    status: 'Actif', createdAt: '2023-05-12'
  },
  {
    id: 6, photo: '/images/properties/apt-centre.jpg', title: 'Appartement Centre Historique',
    host: { name: 'Lucie Bernard', avatar: 'LB', id: 6 }, city: 'Bordeaux', country: 'France',
    pricePerNight: 95, type: 'Appartement', totalReservations: 18, averageRating: 4.3, totalReviews: 15,
    status: 'Actif', createdAt: '2023-06-18'
  },
  {
    id: 7, photo: '/images/properties/villa-luxe.jpg', title: 'Villa Luxe Croisette',
    host: { name: 'Antoine Moreau', avatar: 'AM', id: 7 }, city: 'Cannes', country: 'France',
    pricePerNight: 450, type: 'Villa', totalReservations: 41, averageRating: 4.8, totalReviews: 35,
    status: 'En attente', createdAt: '2024-12-01'
  },
  {
    id: 8, photo: '/images/properties/studio-cosy.jpg', title: 'Studio Cosy Capitole',
    host: { name: 'Camille Leroy', avatar: 'CL', id: 8 }, city: 'Toulouse', country: 'France',
    pricePerNight: 65, type: 'Studio', totalReservations: 12, averageRating: 4.2, totalReviews: 10,
    status: 'Suspendu', createdAt: '2023-09-05'
  },
  {
    id: 9, photo: '/images/properties/loft-industrial.jpg', title: 'Loft Industriel',
    host: { name: 'Jean Dupont', avatar: 'JD', id: 1 }, city: 'Lyon', country: 'France',
    pricePerNight: 140, type: 'Loft', totalReservations: 29, averageRating: 4.6, totalReviews: 24,
    status: 'Actif', createdAt: '2023-07-22'
  },
  {
    id: 10, photo: '/images/properties/maison-campagne.jpg', title: 'Maison de Campagne',
    host: { name: 'Marie Simon', avatar: 'MS', id: 2 }, city: 'Aix-en-Provence', country: 'France',
    pricePerNight: 175, type: 'Maison', totalReservations: 36, averageRating: 4.7, totalReviews: 30,
    status: 'Actif', createdAt: '2023-04-14'
  },
  {
    id: 11, photo: '/images/properties/chalet-savoie.jpg', title: 'Chalet Savoyard',
    host: { name: 'Pierre Laurent', avatar: 'PL', id: 3 }, city: 'Annecy', country: 'France',
    pricePerNight: 220, type: 'Chalet', totalReservations: 55, averageRating: 4.9, totalReviews: 48,
    status: 'Actif', createdAt: '2023-02-28'
  },
  {
    id: 12, photo: '/images/properties/apt-riviera.jpg', title: 'Appartement Riviera',
    host: { name: 'Sophie Martin', avatar: 'SM', id: 4 }, city: 'Monaco', country: 'Monaco',
    pricePerNight: 380, type: 'Appartement', totalReservations: 0, averageRating: 0, totalReviews: 0,
    status: 'Refuse', createdAt: '2025-01-15'
  },
];

export function AdminProperties() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [hostFilter, setHostFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [showSuspendModal, setShowSuspendModal] = useState<number | null>(null);
  const itemsPerPage = 8;

  const cities = useMemo(() => [...new Set(properties.map(p => p.city))].sort(), []);
  const hosts = useMemo(() => {
    const unique = new Map<number, string>();
    properties.forEach(p => unique.set(p.host.id, p.host.name));
    return Array.from(unique.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, []);

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !String(p.id).includes(q)) return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      if (cityFilter !== 'all' && p.city !== cityFilter) return false;
      if (hostFilter !== 'all' && p.host.id !== Number(hostFilter)) return false;
      if (ratingFilter !== 'all') {
        const min = Number(ratingFilter);
        if (p.averageRating < min) return false;
      }
      if (priceFilter !== 'all') {
        if (priceFilter === '0-100' && p.pricePerNight > 100) return false;
        if (priceFilter === '100-200' && (p.pricePerNight < 100 || p.pricePerNight > 200)) return false;
        if (priceFilter === '200-300' && (p.pricePerNight < 200 || p.pricePerNight > 300)) return false;
        if (priceFilter === '300+' && p.pricePerNight < 300) return false;
      }
      return true;
    });
  }, [searchQuery, statusFilter, typeFilter, cityFilter, hostFilter, ratingFilter, priceFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => ({
    total: properties.length,
    actif: properties.filter(p => p.status === 'Actif').length,
    enAttente: properties.filter(p => p.status === 'En attente').length,
    suspendu: properties.filter(p => p.status === 'Suspendu').length,
    refuse: properties.filter(p => p.status === 'Refuse').length,
  }), []);

  const activeFiltersCount = [statusFilter, typeFilter, cityFilter, hostFilter, ratingFilter, priceFilter]
    .filter(f => f !== 'all').length;

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setCityFilter('all');
    setHostFilter('all');
    setRatingFilter('all');
    setPriceFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getStatusConfig = (status: PropertyStatus) => {
    switch (status) {
      case 'Actif': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle };
      case 'En attente': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock };
      case 'Suspendu': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: PauseCircle };
      case 'Refuse': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle };
    }
  };

  const getTypeConfig = (type: PropertyType) => {
    switch (type) {
      case 'Villa': return { bg: 'bg-purple-50', text: 'text-purple-700' };
      case 'Appartement': return { bg: 'bg-blue-50', text: 'text-blue-700' };
      case 'Chalet': return { bg: 'bg-amber-50', text: 'text-amber-700' };
      case 'Studio': return { bg: 'bg-gray-100', text: 'text-gray-700' };
      case 'Maison': return { bg: 'bg-teal-50', text: 'text-teal-700' };
      case 'Loft': return { bg: 'bg-indigo-50', text: 'text-indigo-700' };
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
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
            <button className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
            <button className="px-4 py-2.5 bg-[#111827] text-white rounded-xl hover:bg-[#1f2937] transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau logement</span>
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
          <button onClick={() => { setStatusFilter('Actif'); setCurrentPage(1); }} className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border transition-all hover:shadow-md ${statusFilter === 'Actif' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-transparent'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl text-emerald-700" style={{ fontWeight: 600 }}>{stats.actif}</div>
            <div className="text-xs text-gray-500 mt-1">Actifs</div>
          </button>
          <button onClick={() => { setStatusFilter('En attente'); setCurrentPage(1); }} className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border transition-all hover:shadow-md ${statusFilter === 'En attente' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-transparent'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl text-amber-700" style={{ fontWeight: 600 }}>{stats.enAttente}</div>
            <div className="text-xs text-gray-500 mt-1">En attente</div>
          </button>
          <button onClick={() => { setStatusFilter('Suspendu'); setCurrentPage(1); }} className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border transition-all hover:shadow-md ${statusFilter === 'Suspendu' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-transparent'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <PauseCircle className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl text-orange-700" style={{ fontWeight: 600 }}>{stats.suspendu}</div>
            <div className="text-xs text-gray-500 mt-1">Suspendus</div>
          </button>
          <button onClick={() => { setStatusFilter('Refuse'); setCurrentPage(1); }} className={`bg-white rounded-xl p-4 md:p-5 shadow-sm border transition-all hover:shadow-md col-span-2 md:col-span-1 ${statusFilter === 'Refuse' ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent'}`}>
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Statut</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm"
                    >
                      <option value="all">Tous</option>
                      <option value="Actif">Actif</option>
                      <option value="En attente">En attente</option>
                      <option value="Suspendu">Suspendu</option>
                      <option value="Refuse">Refuse</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm"
                    >
                      <option value="all">Tous</option>
                      <option value="Villa">Villa</option>
                      <option value="Appartement">Appartement</option>
                      <option value="Chalet">Chalet</option>
                      <option value="Studio">Studio</option>
                      <option value="Maison">Maison</option>
                      <option value="Loft">Loft</option>
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
                      <option value="0-100">0 - 100 EUR</option>
                      <option value="100-200">100 - 200 EUR</option>
                      <option value="200-300">200 - 300 EUR</option>
                      <option value="300+">300+ EUR</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Note min.</label>
                    <select
                      value={ratingFilter}
                      onChange={(e) => { setRatingFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm"
                    >
                      <option value="all">Toutes</option>
                      <option value="4.5">4.5+</option>
                      <option value="4">4+</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
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
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Logement</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Hote</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Localisation</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Prix/nuit</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Type</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Reserv.</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Note</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Date creation</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((property) => {
                  const statusConfig = getStatusConfig(property.status);
                  const typeConfig = getTypeConfig(property.type);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={property.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-gray-400 font-mono">#{property.id}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 flex-shrink-0 overflow-hidden">
                            <Home className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <Link href={`/admin/properties/${property.id}`} className="text-sm hover:text-[#111827] hover:underline transition-colors block truncate max-w-[180px]" style={{ fontWeight: 600 }}>
                              {property.title}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Link href={`/admin/hosts/${property.host.id}`} className="text-sm text-gray-600 hover:text-[#111827] hover:underline transition-colors">
                          {property.host.name}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{property.city}, {property.country}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm" style={{ fontWeight: 600 }}>{property.pricePerNight} EUR</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs ${typeConfig.bg} ${typeConfig.text}`} style={{ fontWeight: 600 }}>
                          {property.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm" style={{ fontWeight: 500 }}>{property.totalReservations}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {property.averageRating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-sm" style={{ fontWeight: 600 }}>{property.averageRating}</span>
                            <span className="text-xs text-gray-400">({property.totalReviews})</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">--</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                          <StatusIcon className="w-3 h-3" />
                          {property.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-gray-500">{formatDate(property.createdAt)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/properties/${property.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voir">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Link>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Modifier">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          {property.status === 'Actif' && (
                            <button onClick={() => setShowSuspendModal(property.id)} className="p-2 hover:bg-orange-50 rounded-lg transition-colors" title="Suspendre">
                              <PauseCircle className="w-4 h-4 text-orange-500" />
                            </button>
                          )}
                          <button onClick={() => setShowDeleteModal(property.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-16 text-center">
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
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Note</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((property) => {
                  const statusConfig = getStatusConfig(property.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={property.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 flex-shrink-0">
                            <Home className="w-4 h-4" />
                          </div>
                          <div>
                            <Link href={`/admin/properties/${property.id}`} className="text-sm hover:underline block" style={{ fontWeight: 600 }}>
                              {property.title}
                            </Link>
                            <div className="text-xs text-gray-500">{property.city} - {property.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-600">{property.host.name}</td>
                      <td className="py-3.5 px-4 text-sm" style={{ fontWeight: 600 }}>{property.pricePerNight} EUR</td>
                      <td className="py-3.5 px-4">
                        {property.averageRating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-sm" style={{ fontWeight: 600 }}>{property.averageRating}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">--</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                          <StatusIcon className="w-3 h-3" />
                          {property.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/properties/${property.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </Link>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          <button onClick={() => setShowDeleteModal(property.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
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
            {paginated.map((property) => {
              const statusConfig = getStatusConfig(property.status);
              const typeConfig = getTypeConfig(property.type);
              const StatusIcon = statusConfig.icon;
              return (
                <div key={property.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 flex-shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/admin/properties/${property.id}`} className="text-sm hover:underline block truncate" style={{ fontWeight: 600 }}>
                        {property.title}
                      </Link>
                      <div className="text-xs text-gray-500 mb-2">#{property.id} - {property.host.name}</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                          <StatusIcon className="w-3 h-3" />
                          {property.status}
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded-md text-xs ${typeConfig.bg} ${typeConfig.text}`} style={{ fontWeight: 600 }}>
                          {property.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
                    <div>
                      <div className="text-gray-500 mb-0.5">Localisation</div>
                      <div style={{ fontWeight: 500 }}>{property.city}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-0.5">Prix/nuit</div>
                      <div style={{ fontWeight: 600 }}>{property.pricePerNight} EUR</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-0.5">Note</div>
                      <div className="flex items-center gap-1">
                        {property.averageRating > 0 ? (
                          <>
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span style={{ fontWeight: 600 }}>{property.averageRating}</span>
                          </>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <Link href={`/admin/properties/${property.id}`} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                      <Eye className="w-3.5 h-3.5" />
                      Voir
                    </Link>
                    <button className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                      <Edit className="w-3.5 h-3.5" />
                      Modifier
                    </button>
                    <button onClick={() => setShowDeleteModal(property.id)} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors">
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
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm" style={{ fontWeight: 600 }}>
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm resize-none mb-4"
            />
            <div className="flex items-center gap-3">
              <button onClick={() => setShowSuspendModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={() => setShowSuspendModal(null)} className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-sm" style={{ fontWeight: 600 }}>
                Suspendre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
