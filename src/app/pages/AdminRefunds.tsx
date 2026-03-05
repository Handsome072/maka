'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Eye, Filter, Download, X, ChevronLeft, ChevronRight, ChevronDown,
  CheckCircle, Clock, XCircle, AlertTriangle, RotateCcw, ArrowUpRight,
  ArrowDownRight, TrendingUp, Calendar, DollarSign, Check, Ban
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { ROUTES } from '@/app/config/routes';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// ── Types ────────────────────────────────────────────────────────────────────

type RefundStatus = 'Approuve' | 'En cours' | 'En attente' | 'Rejete' | 'Rembourse';
type RefundType = 'Total' | 'Partiel';
type RefundReason = 'Annulation client' | 'Annulation hote' | 'Probleme logement' | 'Erreur paiement' | 'Litige' | 'Force majeure';
type RefundMethod = 'Carte bancaire' | 'PayPal' | 'Virement' | 'Stripe';
type ResponsableRemboursement = 'Plateforme' | 'Hote' | 'Partage';

interface Refund {
  id: string;
  reservationId: string;
  property: { name: string; id: number };
  client: { name: string; email: string; avatar: string; id: number };
  host: { name: string; email: string; avatar: string; id: number };
  reason: RefundReason;
  refundAmount: number;
  reservationAmount: number;
  refundType: RefundType;
  status: RefundStatus;
  method: RefundMethod;
  responsable: ResponsableRemboursement;
  requestDate: string;
  processedDate: string | null;
}

// ── Status Config ────────────────────────────────────────────────────────────

const refundStatusConfig: Record<RefundStatus, { bg: string; text: string; icon: typeof CheckCircle }> = {
  'Approuve': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  'En cours': { bg: 'bg-orange-50', text: 'text-orange-700', icon: Clock },
  'En attente': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  'Rejete': { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
  'Rembourse': { bg: 'bg-blue-50', text: 'text-blue-700', icon: RotateCcw },
};

// ── Mock Data ────────────────────────────────────────────────────────────────

const refunds: Refund[] = [
  {
    id: 'REM-001', reservationId: 'RES-2401',
    property: { name: 'Villa Toscane', id: 1 },
    client: { name: 'Alexandre Leroy', email: 'alex.leroy@email.com', avatar: 'AL', id: 10 },
    host: { name: 'Jean Dupont', email: 'jean.dupont@email.com', avatar: 'JD', id: 1 },
    reason: 'Annulation client', refundAmount: 1750, reservationAmount: 2012,
    refundType: 'Total', status: 'Rembourse', method: 'Carte bancaire',
    responsable: 'Plateforme', requestDate: '2025-02-10', processedDate: '2025-02-12',
  },
  {
    id: 'REM-002', reservationId: 'RES-2405',
    property: { name: 'Maison Bord de Mer', id: 5 },
    client: { name: 'Thomas Petit', email: 'thomas.petit@email.com', avatar: 'TP', id: 14 },
    host: { name: 'Thomas Dubois', email: 'thomas.dubois@email.com', avatar: 'TD', id: 5 },
    reason: 'Probleme logement', refundAmount: 1200, reservationAmount: 2597,
    refundType: 'Partiel', status: 'En cours', method: 'Stripe',
    responsable: 'Hote', requestDate: '2025-02-18', processedDate: null,
  },
  {
    id: 'REM-003', reservationId: 'RES-2408',
    property: { name: 'Chalet des Alpes', id: 3 },
    client: { name: 'Camille Bernard', email: 'camille.bernard@email.com', avatar: 'CB', id: 11 },
    host: { name: 'Marie Simon', email: 'marie.simon@email.com', avatar: 'MS', id: 2 },
    reason: 'Annulation hote', refundAmount: 980, reservationAmount: 980,
    refundType: 'Total', status: 'Rembourse', method: 'Carte bancaire',
    responsable: 'Hote', requestDate: '2025-02-22', processedDate: '2025-02-24',
  },
  {
    id: 'REM-004', reservationId: 'RES-2415',
    property: { name: 'Loft Marais', id: 6 },
    client: { name: 'Lucas Bouchard', email: 'lucas.bouchard@email.com', avatar: 'LB', id: 15 },
    host: { name: 'Pierre Laurent', email: 'pierre.laurent@email.com', avatar: 'PL', id: 4 },
    reason: 'Erreur paiement', refundAmount: 2100, reservationAmount: 2100,
    refundType: 'Total', status: 'En attente', method: 'PayPal',
    responsable: 'Plateforme', requestDate: '2025-02-25', processedDate: null,
  },
  {
    id: 'REM-005', reservationId: 'RES-2420',
    property: { name: 'Studio Cannes', id: 7 },
    client: { name: 'Sophie Moreau', email: 'sophie.moreau@email.com', avatar: 'SM', id: 16 },
    host: { name: 'Sophie Martin', email: 'sophie.martin@email.com', avatar: 'SM', id: 6 },
    reason: 'Force majeure', refundAmount: 560, reservationAmount: 1120,
    refundType: 'Partiel', status: 'Rejete', method: 'Carte bancaire',
    responsable: 'Partage', requestDate: '2025-02-28', processedDate: '2025-03-02',
  },
  {
    id: 'REM-006', reservationId: 'RES-2422',
    property: { name: 'Appartement Paris 8e', id: 2 },
    client: { name: 'Julie Martin', email: 'julie.martin@email.com', avatar: 'JM', id: 17 },
    host: { name: 'Jean Dupont', email: 'jean.dupont@email.com', avatar: 'JD', id: 1 },
    reason: 'Probleme logement', refundAmount: 1120, reservationAmount: 1120,
    refundType: 'Total', status: 'En cours', method: 'Virement',
    responsable: 'Hote', requestDate: '2025-03-01', processedDate: null,
  },
  {
    id: 'REM-007', reservationId: 'RES-2435',
    property: { name: 'Mas Provencal', id: 8 },
    client: { name: 'Marc Rousseau', email: 'marc.rousseau@email.com', avatar: 'MR', id: 18 },
    host: { name: 'Marie Simon', email: 'marie.simon@email.com', avatar: 'MS', id: 2 },
    reason: 'Annulation hote', refundAmount: 1890, reservationAmount: 1890,
    refundType: 'Total', status: 'Rembourse', method: 'Carte bancaire',
    responsable: 'Hote', requestDate: '2025-03-03', processedDate: '2025-03-05',
  },
  {
    id: 'REM-008', reservationId: 'RES-2430',
    property: { name: 'Penthouse Lyon', id: 9 },
    client: { name: 'Claire Lefebvre', email: 'claire.lefebvre@email.com', avatar: 'CL', id: 19 },
    host: { name: 'Pierre Laurent', email: 'pierre.laurent@email.com', avatar: 'PL', id: 4 },
    reason: 'Annulation client', refundAmount: 720, reservationAmount: 1440,
    refundType: 'Partiel', status: 'En attente', method: 'Stripe',
    responsable: 'Plateforme', requestDate: '2025-03-08', processedDate: null,
  },
  {
    id: 'REM-009', reservationId: 'RES-2440',
    property: { name: 'Villa Cote d\'Azur', id: 10 },
    client: { name: 'Antoine Girard', email: 'antoine.girard@email.com', avatar: 'AG', id: 20 },
    host: { name: 'Thomas Dubois', email: 'thomas.dubois@email.com', avatar: 'TD', id: 5 },
    reason: 'Litige', refundAmount: 3200, reservationAmount: 4500,
    refundType: 'Partiel', status: 'En cours', method: 'Carte bancaire',
    responsable: 'Partage', requestDate: '2025-03-10', processedDate: null,
  },
  {
    id: 'REM-010', reservationId: 'RES-2445',
    property: { name: 'Gite Bretagne', id: 11 },
    client: { name: 'Emma Dupuis', email: 'emma.dupuis@email.com', avatar: 'ED', id: 21 },
    host: { name: 'Sophie Martin', email: 'sophie.martin@email.com', avatar: 'SM', id: 6 },
    reason: 'Annulation client', refundAmount: 450, reservationAmount: 450,
    refundType: 'Total', status: 'Approuve', method: 'PayPal',
    responsable: 'Plateforme', requestDate: '2025-03-12', processedDate: null,
  },
  {
    id: 'REM-011', reservationId: 'RES-2450',
    property: { name: 'Appartement Bordeaux', id: 12 },
    client: { name: 'Paul Mercier', email: 'paul.mercier@email.com', avatar: 'PM', id: 22 },
    host: { name: 'Jean Dupont', email: 'jean.dupont@email.com', avatar: 'JD', id: 1 },
    reason: 'Probleme logement', refundAmount: 890, reservationAmount: 890,
    refundType: 'Total', status: 'Approuve', method: 'Carte bancaire',
    responsable: 'Hote', requestDate: '2025-03-14', processedDate: null,
  },
  {
    id: 'REM-012', reservationId: 'RES-2455',
    property: { name: 'Studio Montpellier', id: 13 },
    client: { name: 'Laura Petit', email: 'laura.petit@email.com', avatar: 'LP', id: 23 },
    host: { name: 'Pierre Laurent', email: 'pierre.laurent@email.com', avatar: 'PL', id: 4 },
    reason: 'Erreur paiement', refundAmount: 650, reservationAmount: 650,
    refundType: 'Total', status: 'Rembourse', method: 'Virement',
    responsable: 'Plateforme', requestDate: '2025-03-15', processedDate: '2025-03-17',
  },
];

// ── Chart Data ──────────────────────────────────────────────────────────────

const monthlyRefundData = [
  { month: 'Oct', montant: 4200, nombre: 8 },
  { month: 'Nov', montant: 5800, nombre: 12 },
  { month: 'Dec', montant: 7100, nombre: 15 },
  { month: 'Jan', montant: 6300, nombre: 11 },
  { month: 'Fev', montant: 8900, nombre: 18 },
  { month: 'Mar', montant: 7500, nombre: 14 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const ITEMS_PER_PAGE = 8;

// ── Component ────────────────────────────────────────────────────────────────

export function AdminRefunds() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [reasonFilter, setReasonFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [hostFilter, setHostFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showApproveModal, setShowApproveModal] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  // Unique values for filters
  const uniqueClients = useMemo(() => [...new Set(refunds.map(r => r.client.name))], []);
  const uniqueHosts = useMemo(() => [...new Set(refunds.map(r => r.host.name))], []);

  // Filtered data
  const filtered = useMemo(() => {
    return refunds.filter(r => {
      if (search) {
        const q = search.toLowerCase();
        if (!r.id.toLowerCase().includes(q) && !r.reservationId.toLowerCase().includes(q) &&
            !r.client.name.toLowerCase().includes(q) && !r.host.name.toLowerCase().includes(q) &&
            !r.property.name.toLowerCase().includes(q)) return false;
      }
      if (statusFilter && r.status !== statusFilter) return false;
      if (reasonFilter && r.reason !== reasonFilter) return false;
      if (typeFilter && r.refundType !== typeFilter) return false;
      if (clientFilter && r.client.name !== clientFilter) return false;
      if (hostFilter && r.host.name !== hostFilter) return false;
      if (dateFrom && r.requestDate < dateFrom) return false;
      if (dateTo && r.requestDate > dateTo) return false;
      if (amountMin && r.refundAmount < parseFloat(amountMin)) return false;
      if (amountMax && r.refundAmount > parseFloat(amountMax)) return false;
      return true;
    });
  }, [search, statusFilter, reasonFilter, typeFilter, clientFilter, hostFilter, dateFrom, dateTo, amountMin, amountMax]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Stats
  const stats = useMemo(() => {
    const totalAmount = refunds.reduce((s, r) => s + r.refundAmount, 0);
    const enAttente = refunds.filter(r => r.status === 'En attente').length;
    const enCours = refunds.filter(r => r.status === 'En cours' || r.status === 'Approuve').length;
    const rembourses = refunds.filter(r => r.status === 'Rembourse').length;
    const rejetes = refunds.filter(r => r.status === 'Rejete').length;
    return { totalAmount, enAttente, enCours, rembourses, rejetes, total: refunds.length };
  }, []);

  const activeFilterCount = [statusFilter, reasonFilter, typeFilter, clientFilter, hostFilter, dateFrom, dateTo, amountMin, amountMax].filter(Boolean).length;

  function clearFilters() {
    setStatusFilter(''); setReasonFilter(''); setTypeFilter('');
    setClientFilter(''); setHostFilter('');
    setDateFrom(''); setDateTo('');
    setAmountMin(''); setAmountMax('');
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <div>
            <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Gestion des remboursements</h1>
            <p className="text-sm text-gray-500 mt-1">Gerez les demandes de remboursement liees aux reservations</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="text-sm" style={{ fontWeight: 500 }}>Exporter CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-gray-600" />
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-600" style={{ fontWeight: 500 }}>
                <ArrowUpRight className="w-3 h-3" /> +12%
              </span>
            </div>
            <div className="text-2xl mb-1" style={{ fontWeight: 600 }}>{formatCurrency(stats.totalAmount)}</div>
            <div className="text-xs text-gray-500">Montant total rembourse</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl mb-1" style={{ fontWeight: 600 }}>{stats.enAttente}</div>
            <div className="text-xs text-gray-500">En attente</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-2xl mb-1" style={{ fontWeight: 600 }}>{stats.enCours}</div>
            <div className="text-xs text-gray-500">En cours / Approuves</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl mb-1" style={{ fontWeight: 600 }}>{stats.rembourses}</div>
            <div className="text-xs text-gray-500">Rembourses</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="text-2xl mb-1" style={{ fontWeight: 600 }}>{stats.rejetes}</div>
            <div className="text-xs text-gray-500">Rejetes</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 md:mb-8">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-base" style={{ fontWeight: 600 }}>Evolution des remboursements</h2>
          </div>
          <div className="p-5">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRefundData}>
                  <defs>
                    <linearGradient id="refundGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#111827" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                    formatter={(value: number) => [formatCurrency(value), 'Montant']}
                  />
                  <Area type="monotone" dataKey="montant" stroke="#111827" fill="url(#refundGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Refunds List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Search & Filters Header */}
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    placeholder="Rechercher par ID, reservation, client, hote, logement..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${showFilters ? 'bg-[#111827] text-white border-[#111827]' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm" style={{ fontWeight: 500 }}>Filtres</span>
                  {activeFilterCount > 0 && (
                    <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${showFilters ? 'bg-white text-[#111827]' : 'bg-[#111827] text-white'}`} style={{ fontWeight: 600 }}>
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Statut</label>
                    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]">
                      <option value="">Tous les statuts</option>
                      <option value="En attente">En attente</option>
                      <option value="Approuve">Approuve</option>
                      <option value="En cours">En cours</option>
                      <option value="Rembourse">Rembourse</option>
                      <option value="Rejete">Rejete</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Motif</label>
                    <select value={reasonFilter} onChange={(e) => { setReasonFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]">
                      <option value="">Tous les motifs</option>
                      <option value="Annulation client">Annulation client</option>
                      <option value="Annulation hote">Annulation hote</option>
                      <option value="Probleme logement">Probleme logement</option>
                      <option value="Erreur paiement">Erreur paiement</option>
                      <option value="Litige">Litige</option>
                      <option value="Force majeure">Force majeure</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Type</label>
                    <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]">
                      <option value="">Tous les types</option>
                      <option value="Total">Total</option>
                      <option value="Partiel">Partiel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Client</label>
                    <select value={clientFilter} onChange={(e) => { setClientFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]">
                      <option value="">Tous les clients</option>
                      {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Hote</label>
                    <select value={hostFilter} onChange={(e) => { setHostFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]">
                      <option value="">Tous les hotes</option>
                      {uniqueHosts.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Date du</label>
                    <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Date au</label>
                    <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Montant min</label>
                      <input type="number" value={amountMin} onChange={(e) => { setAmountMin(e.target.value); setCurrentPage(1); }}
                        placeholder="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>Montant max</label>
                      <input type="number" value={amountMax} onChange={(e) => { setAmountMax(e.target.value); setCurrentPage(1); }}
                        placeholder="10000" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]" />
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                      <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1" style={{ fontWeight: 500 }}>
                        <X className="w-4 h-4" /> Effacer les filtres
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Result count */}
          <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">{filtered.length} remboursement{filtered.length > 1 ? 's' : ''} trouve{filtered.length > 1 ? 's' : ''}</span>
          </div>

          {/* Desktop Table */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>ID</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>RESERVATION</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>LOGEMENT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>CLIENT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>HOTE</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>MOTIF</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>MONTANT</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>TYPE</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>METHODE</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>DATE DEMANDE</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>DATE TRAITEMENT</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="text-sm" style={{ fontWeight: 600 }}>{r.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm text-indigo-600" style={{ fontWeight: 500 }}>{r.reservationId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm">{r.property.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#111827] rounded-full flex items-center justify-center text-white text-[10px]" style={{ fontWeight: 600 }}>
                          {r.client.avatar}
                        </div>
                        <div>
                          <div className="text-sm" style={{ fontWeight: 500 }}>{r.client.name}</div>
                          <div className="text-[11px] text-gray-400">{r.client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center text-white text-[10px]" style={{ fontWeight: 600 }}>
                          {r.host.avatar}
                        </div>
                        <span className="text-sm">{r.host.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-600">{r.reason}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(r.refundAmount)}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] ${r.refundType === 'Total' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`} style={{ fontWeight: 600 }}>
                        {r.refundType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] ${refundStatusConfig[r.status].bg} ${refundStatusConfig[r.status].text}`} style={{ fontWeight: 600 }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-600">{r.method}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-600">{formatDate(r.requestDate)}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs text-gray-600">{r.processedDate ? formatDate(r.processedDate) : '—'}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/refunds/${r.id}`}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Voir detail">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Link>
                        {(r.status === 'En attente' || r.status === 'En cours') && (
                          <>
                            <button onClick={() => setShowApproveModal(r.id)}
                              className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors" title="Approuver">
                              <Check className="w-4 h-4 text-emerald-600" />
                            </button>
                            <button onClick={() => setShowRejectModal(r.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Refuser">
                              <Ban className="w-4 h-4 text-red-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet Table */}
          <div className="hidden md:block xl:hidden overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>ID / RESERVATION</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>CLIENT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>MOTIF</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>MONTANT</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="text-sm" style={{ fontWeight: 600 }}>{r.id}</div>
                      <div className="text-xs text-indigo-600">{r.reservationId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#111827] rounded-full flex items-center justify-center text-white text-[10px]" style={{ fontWeight: 600 }}>
                          {r.client.avatar}
                        </div>
                        <div className="text-sm" style={{ fontWeight: 500 }}>{r.client.name}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-gray-600">{r.reason}</div>
                      <div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] ${r.refundType === 'Total' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`} style={{ fontWeight: 600 }}>
                        {r.refundType}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(r.refundAmount)}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] ${refundStatusConfig[r.status].bg} ${refundStatusConfig[r.status].text}`} style={{ fontWeight: 600 }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/refunds/${r.id}`}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Link>
                        {(r.status === 'En attente' || r.status === 'En cours') && (
                          <>
                            <button onClick={() => setShowApproveModal(r.id)}
                              className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors">
                              <Check className="w-4 h-4 text-emerald-600" />
                            </button>
                            <button onClick={() => setShowRejectModal(r.id)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                              <Ban className="w-4 h-4 text-red-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {paginated.map((r) => (
              <div key={r.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-sm" style={{ fontWeight: 600 }}>{r.id}</span>
                    <span className="text-xs text-indigo-600 ml-2">{r.reservationId}</span>
                  </div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] ${refundStatusConfig[r.status].bg} ${refundStatusConfig[r.status].text}`} style={{ fontWeight: 600 }}>
                    {r.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#111827] rounded-full flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>
                    {r.client.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm" style={{ fontWeight: 600 }}>{r.client.name}</div>
                    <div className="text-xs text-gray-400 truncate">{r.client.email}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="text-xs text-gray-500 mb-1">Motif</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{r.reason}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Montant</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(r.refundAmount)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Type</div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${r.refundType === 'Total' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`} style={{ fontWeight: 600 }}>
                      {r.refundType}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Hote</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center text-white text-[8px]" style={{ fontWeight: 600 }}>{r.host.avatar}</div>
                      <span className="text-xs">{r.host.name}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Date</div>
                    <div className="text-xs" style={{ fontWeight: 500 }}>{formatDate(r.requestDate)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Link href={`/admin/refunds/${r.id}`}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>Voir</span>
                  </Link>
                  {(r.status === 'En attente' || r.status === 'En cours') && (
                    <>
                      <button onClick={() => setShowApproveModal(r.id)}
                        className="flex-1 px-3 py-2 bg-[#111827] text-white rounded-lg hover:bg-[#1f2937] transition-colors flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        <span className="text-xs" style={{ fontWeight: 600 }}>Approuver</span>
                      </button>
                      <button onClick={() => setShowRejectModal(r.id)}
                        className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                        <Ban className="w-4 h-4" />
                        <span className="text-xs" style={{ fontWeight: 500 }}>Refuser</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <div className="text-sm text-gray-500" style={{ fontWeight: 500 }}>Aucun remboursement trouve</div>
              <div className="text-xs text-gray-400 mt-1">Modifiez vos filtres pour voir plus de resultats</div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 md:p-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Page {currentPage} sur {totalPages} ({filtered.length} resultats)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3.5 py-2 rounded-lg text-sm transition-colors ${page === currentPage ? 'bg-[#111827] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                    style={{ fontWeight: page === currentPage ? 600 : 400 }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowApproveModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-center text-lg mb-2" style={{ fontWeight: 600 }}>Approuver le remboursement ?</h3>
              <p className="text-center text-sm text-gray-500 mb-6">
                Le remboursement {showApproveModal} sera approuve et traite dans les meilleurs delais.
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowApproveModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>
                  Annuler
                </button>
                <button onClick={() => setShowApproveModal(null)} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors" style={{ fontWeight: 500 }}>
                  Approuver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowRejectModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-center text-lg mb-2" style={{ fontWeight: 600 }}>Refuser le remboursement ?</h3>
              <p className="text-center text-sm text-gray-500 mb-6">
                Le remboursement {showRejectModal} sera rejete. Cette action peut etre contestee.
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowRejectModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>
                  Annuler
                </button>
                <button onClick={() => setShowRejectModal(null)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors" style={{ fontWeight: 500 }}>
                  Refuser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
