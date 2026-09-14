'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Eye, Filter, Download, X, ChevronLeft, ChevronRight, ChevronDown,
  CheckCircle, Clock, XCircle, DollarSign, TrendingUp, TrendingDown,
  CreditCard, AlertTriangle, RotateCcw, ArrowUpRight, ArrowDownRight,
  Banknote, Percent, BarChart3, Calendar
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { ROUTES } from '@/app/config/routes';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from 'recharts';

// ── Types ────────────────────────────────────────────────────────────────────

type PaymentStatus = 'Reussi' | 'En attente' | 'Echoue' | 'Rembourse' | 'Annule';
type PayoutStatus = 'Verse' | 'En attente' | 'Suspendu' | 'Echoue';
type PaymentMethod = 'Carte bancaire' | 'PayPal' | 'Stripe' | 'Virement';

interface Payment {
  id: string;
  reservationId: string;
  property: { name: string; id: number };
  client: { name: string; email: string; avatar: string; id: number };
  host: { name: string; email: string; avatar: string; id: number };
  totalAmount: number;
  commission: number;
  payoutAmount: number;
  method: PaymentMethod;
  paymentStatus: PaymentStatus;
  payoutStatus: PayoutStatus;
  date: string;
  isFlagged: boolean;
}

// ── Status Config ────────────────────────────────────────────────────────────

const paymentStatusConfig: Record<PaymentStatus, { bg: string; text: string }> = {
  'Reussi': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'En attente': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Echoue': { bg: 'bg-red-50', text: 'text-red-700' },
  'Rembourse': { bg: 'bg-blue-50', text: 'text-blue-700' },
  'Annule': { bg: 'bg-gray-100', text: 'text-gray-600' },
};

const payoutStatusConfig: Record<PayoutStatus, { bg: string; text: string }> = {
  'Verse': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'En attente': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Suspendu': { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Echoue': { bg: 'bg-red-50', text: 'text-red-700' },
};

// ── Mock Data ────────────────────────────────────────────────────────────────

const payments: Payment[] = [
  {
    id: 'PAY-10001', reservationId: 'RES-2401',
    property: { name: 'Villa Toscane', id: 1 },
    client: { name: 'Alexandre Leroy', email: 'alex.leroy@email.com', avatar: 'AL', id: 10 },
    host: { name: 'Jean Dupont', email: 'jean.dupont@email.com', avatar: 'JD', id: 1 },
    totalAmount: 1750, commission: 262.50, payoutAmount: 1487.50,
    method: 'Carte bancaire', paymentStatus: 'Reussi', payoutStatus: 'Verse',
    date: '2025-03-15', isFlagged: false,
  },
  {
    id: 'PAY-10002', reservationId: 'RES-2402',
    property: { name: 'Appartement Paris 8e', id: 2 },
    client: { name: 'Camille Bernard', email: 'camille.bernard@email.com', avatar: 'CB', id: 11 },
    host: { name: 'Marie Simon', email: 'marie.simon@email.com', avatar: 'MS', id: 2 },
    totalAmount: 840, commission: 126, payoutAmount: 714,
    method: 'PayPal', paymentStatus: 'En attente', payoutStatus: 'En attente',
    date: '2025-03-14', isFlagged: false,
  },
  {
    id: 'PAY-10003', reservationId: 'RES-2403',
    property: { name: 'Chalet des Alpes', id: 3 },
    client: { name: 'Lucas Bouchard', email: 'lucas.bouchard@email.com', avatar: 'LB', id: 12 },
    host: { name: 'Pierre Laurent', email: 'pierre.laurent@email.com', avatar: 'PL', id: 3 },
    totalAmount: 1260, commission: 189, payoutAmount: 1071,
    method: 'Stripe', paymentStatus: 'Reussi', payoutStatus: 'Verse',
    date: '2025-03-12', isFlagged: false,
  },
  {
    id: 'PAY-10004', reservationId: 'RES-2404',
    property: { name: 'Studio Moderne Centre', id: 4 },
    client: { name: 'Sophie Moreau', email: 'sophie.moreau@email.com', avatar: 'SO', id: 13 },
    host: { name: 'Sophie Martin', email: 'sophie.martin@email.com', avatar: 'SM', id: 4 },
    totalAmount: 595, commission: 89.25, payoutAmount: 505.75,
    method: 'Carte bancaire', paymentStatus: 'Echoue', payoutStatus: 'Echoue',
    date: '2025-03-10', isFlagged: false,
  },
  {
    id: 'PAY-10005', reservationId: 'RES-2405',
    property: { name: 'Maison Bord de Mer', id: 5 },
    client: { name: 'Thomas Petit', email: 'thomas.petit@email.com', avatar: 'TP', id: 14 },
    host: { name: 'Thomas Dubois', email: 'thomas.dubois@email.com', avatar: 'TD', id: 5 },
    totalAmount: 2240, commission: 336, payoutAmount: 1904,
    method: 'Stripe', paymentStatus: 'Rembourse', payoutStatus: 'Suspendu',
    date: '2025-03-08', isFlagged: true,
  },
  {
    id: 'PAY-10006', reservationId: 'RES-2406',
    property: { name: 'Appartement Centre Historique', id: 6 },
    client: { name: 'Julie Martin', email: 'julie.martin@email.com', avatar: 'JM', id: 15 },
    host: { name: 'Lucie Bernard', email: 'lucie.bernard@email.com', avatar: 'LB', id: 6 },
    totalAmount: 665, commission: 99.75, payoutAmount: 565.25,
    method: 'Carte bancaire', paymentStatus: 'Reussi', payoutStatus: 'Verse',
    date: '2025-03-06', isFlagged: false,
  },
  {
    id: 'PAY-10007', reservationId: 'RES-2407',
    property: { name: 'Loft Industriel', id: 7 },
    client: { name: 'Emma Lefebvre', email: 'emma.lefebvre@email.com', avatar: 'EL', id: 16 },
    host: { name: 'Antoine Moreau', email: 'antoine.moreau@email.com', avatar: 'AM', id: 7 },
    totalAmount: 980, commission: 147, payoutAmount: 833,
    method: 'PayPal', paymentStatus: 'Reussi', payoutStatus: 'En attente',
    date: '2025-03-05', isFlagged: false,
  },
  {
    id: 'PAY-10008', reservationId: 'RES-2408',
    property: { name: 'Villa Provencale', id: 8 },
    client: { name: 'Hugo Roux', email: 'hugo.roux@email.com', avatar: 'HR', id: 17 },
    host: { name: 'Camille Leroy', email: 'camille.leroy@email.com', avatar: 'CL', id: 8 },
    totalAmount: 3200, commission: 480, payoutAmount: 2720,
    method: 'Virement', paymentStatus: 'En attente', payoutStatus: 'En attente',
    date: '2025-03-04', isFlagged: false,
  },
  {
    id: 'PAY-10009', reservationId: 'RES-2409',
    property: { name: 'Maison de Charme', id: 9 },
    client: { name: 'Lea Garnier', email: 'lea.garnier@email.com', avatar: 'LG', id: 18 },
    host: { name: 'Nicolas Faure', email: 'nicolas.faure@email.com', avatar: 'NF', id: 9 },
    totalAmount: 1120, commission: 168, payoutAmount: 952,
    method: 'Stripe', paymentStatus: 'Reussi', payoutStatus: 'Verse',
    date: '2025-03-03', isFlagged: false,
  },
  {
    id: 'PAY-10010', reservationId: 'RES-2410',
    property: { name: 'Penthouse Vue Mer', id: 10 },
    client: { name: 'Nathan Blanc', email: 'nathan.blanc@email.com', avatar: 'NB', id: 19 },
    host: { name: 'Isabelle Perrin', email: 'isabelle.perrin@email.com', avatar: 'IP', id: 10 },
    totalAmount: 4500, commission: 675, payoutAmount: 3825,
    method: 'Carte bancaire', paymentStatus: 'Annule', payoutStatus: 'Suspendu',
    date: '2025-03-01', isFlagged: true,
  },
  {
    id: 'PAY-10011', reservationId: 'RES-2411',
    property: { name: 'Studio Montmartre', id: 11 },
    client: { name: 'Clara Duval', email: 'clara.duval@email.com', avatar: 'CD', id: 20 },
    host: { name: 'Jean Dupont', email: 'jean.dupont@email.com', avatar: 'JD', id: 1 },
    totalAmount: 490, commission: 73.50, payoutAmount: 416.50,
    method: 'PayPal', paymentStatus: 'Reussi', payoutStatus: 'Verse',
    date: '2025-02-28', isFlagged: false,
  },
  {
    id: 'PAY-10012', reservationId: 'RES-2412',
    property: { name: 'Chalet Megeve', id: 12 },
    client: { name: 'Paul Mercier', email: 'paul.mercier@email.com', avatar: 'PM', id: 21 },
    host: { name: 'Marie Simon', email: 'marie.simon@email.com', avatar: 'MS', id: 2 },
    totalAmount: 5600, commission: 840, payoutAmount: 4760,
    method: 'Virement', paymentStatus: 'Reussi', payoutStatus: 'Verse',
    date: '2025-02-25', isFlagged: false,
  },
];

// ── Chart Data ───────────────────────────────────────────────────────────────

const revenueData = [
  { month: 'Sep', revenus: 18500, commissions: 2775 },
  { month: 'Oct', revenus: 22300, commissions: 3345 },
  { month: 'Nov', revenus: 19800, commissions: 2970 },
  { month: 'Dec', revenus: 31200, commissions: 4680 },
  { month: 'Jan', revenus: 28400, commissions: 4260 },
  { month: 'Feb', revenus: 25600, commissions: 3840 },
  { month: 'Mar', revenus: 34100, commissions: 5115 },
];

const payoutData = [
  { month: 'Sep', payouts: 15725, pending: 2100 },
  { month: 'Oct', payouts: 18955, pending: 1800 },
  { month: 'Nov', payouts: 16830, pending: 2500 },
  { month: 'Dec', payouts: 26520, pending: 3200 },
  { month: 'Jan', payouts: 24140, pending: 2800 },
  { month: 'Feb', payouts: 21760, pending: 1900 },
  { month: 'Mar', payouts: 28985, pending: 3400 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ── Component ────────────────────────────────────────────────────────────────

export function AdminPayments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('');
  const [filterPayoutStatus, setFilterPayoutStatus] = useState<string>('');
  const [filterMethod, setFilterMethod] = useState<string>('');
  const [filterClient, setFilterClient] = useState<string>('');
  const [filterHost, setFilterHost] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundType, setRefundType] = useState<'total' | 'partial'>('total');
  const [refundAmount, setRefundAmount] = useState('');
  const [activeChart, setActiveChart] = useState<'revenus' | 'payouts'>('revenus');

  // Unique clients and hosts for filter dropdowns
  const uniqueClients = useMemo(() =>
    [...new Map(payments.map(p => [p.client.id, p.client.name])).values()], []
  );
  const uniqueHosts = useMemo(() =>
    [...new Map(payments.map(p => [p.host.id, p.host.name])).values()], []
  );

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!p.id.toLowerCase().includes(q) && !p.reservationId.toLowerCase().includes(q) &&
            !p.client.name.toLowerCase().includes(q) && !p.host.name.toLowerCase().includes(q) &&
            !p.property.name.toLowerCase().includes(q)) return false;
      }
      if (filterPaymentStatus && p.paymentStatus !== filterPaymentStatus) return false;
      if (filterPayoutStatus && p.payoutStatus !== filterPayoutStatus) return false;
      if (filterMethod && p.method !== filterMethod) return false;
      if (filterClient && p.client.name !== filterClient) return false;
      if (filterHost && p.host.name !== filterHost) return false;
      if (filterDateFrom && p.date < filterDateFrom) return false;
      if (filterDateTo && p.date > filterDateTo) return false;
      if (filterAmountMin && p.totalAmount < parseFloat(filterAmountMin)) return false;
      if (filterAmountMax && p.totalAmount > parseFloat(filterAmountMax)) return false;
      return true;
    });
  }, [searchQuery, filterPaymentStatus, filterPayoutStatus, filterMethod, filterClient, filterHost, filterDateFrom, filterDateTo, filterAmountMin, filterAmountMax]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Stats
  const stats = useMemo(() => {
    const total = payments.reduce((s, p) => s + p.totalAmount, 0);
    const totalCommissions = payments.reduce((s, p) => s + p.commission, 0);
    const totalPayouts = payments.reduce((s, p) => s + p.payoutAmount, 0);
    const successful = payments.filter(p => p.paymentStatus === 'Reussi').length;
    const pending = payments.filter(p => p.paymentStatus === 'En attente').length;
    const failed = payments.filter(p => p.paymentStatus === 'Echoue').length;
    const pendingPayouts = payments.filter(p => p.payoutStatus === 'En attente' || p.payoutStatus === 'Suspendu').length;
    return { total, totalCommissions, totalPayouts, successful, pending, failed, pendingPayouts };
  }, []);

  const activeFiltersCount = [filterPaymentStatus, filterPayoutStatus, filterMethod, filterClient, filterHost, filterDateFrom, filterDateTo, filterAmountMin, filterAmountMax].filter(Boolean).length;

  function clearFilters() {
    setFilterPaymentStatus('');
    setFilterPayoutStatus('');
    setFilterMethod('');
    setFilterClient('');
    setFilterHost('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterAmountMin('');
    setFilterAmountMax('');
    setCurrentPage(1);
  }

  function openRefundModal(payment: Payment) {
    setSelectedPayment(payment);
    setRefundType('total');
    setRefundAmount(payment.totalAmount.toString());
    setShowRefundModal(true);
  }

  function handleRefund() {
    // API call placeholder
    setShowRefundModal(false);
    setSelectedPayment(null);
  }

  const selectClass = "px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827] bg-white";

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <div>
            <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Gestion des paiements</h1>
            <p className="text-sm text-gray-500 mt-1">Supervision des transactions, commissions et payouts</p>
          </div>
          <button className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 bg-white shadow-sm">
            <Download className="w-4 h-4" />
            <span className="text-sm" style={{ fontWeight: 500 }}>Exporter CSV</span>
          </button>
        </div>

        {/* ── Stats Cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-600" style={{ fontWeight: 500 }}>
                <ArrowUpRight className="w-3.5 h-3.5" /> +12.5%
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>REVENUS TOTAUX</div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{formatCurrency(stats.total)}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Percent className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="flex items-center gap-1 text-xs text-emerald-600" style={{ fontWeight: 500 }}>
                <ArrowUpRight className="w-3.5 h-3.5" /> +8.3%
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>COMMISSIONS</div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{formatCurrency(stats.totalCommissions)}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Banknote className="w-5 h-5 text-blue-600" />
              </div>
              <span className="flex items-center gap-1 text-xs text-amber-600" style={{ fontWeight: 500 }}>
                {stats.pendingPayouts} en attente
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>PAYOUTS HOTES</div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{formatCurrency(stats.totalPayouts)}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>TAUX DE SUCCES</div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>
              {payments.length > 0 ? Math.round((stats.successful / payments.length) * 100) : 0}%
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />{stats.successful} reussis</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />{stats.pending} en attente</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />{stats.failed} echoues</span>
            </div>
          </div>
        </div>

        {/* ── Revenue Charts ─────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-base" style={{ fontWeight: 600 }}>Statistiques financieres</h2>
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setActiveChart('revenus')}
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors ${activeChart === 'revenus' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  style={{ fontWeight: 500 }}
                >
                  Revenus & Commissions
                </button>
                <button
                  onClick={() => setActiveChart('payouts')}
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors ${activeChart === 'payouts' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  style={{ fontWeight: 500 }}
                >
                  Payouts
                </button>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'revenus' ? (
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#111827" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#111827" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCommissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [formatCurrency(value)]}
                    />
                    <Area type="monotone" dataKey="revenus" stroke="#111827" strokeWidth={2} fill="url(#colorRevenus)" name="Revenus" />
                    <Area type="monotone" dataKey="commissions" stroke="#10b981" strokeWidth={2} fill="url(#colorCommissions)" name="Commissions" />
                  </AreaChart>
                ) : (
                  <BarChart data={payoutData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => [formatCurrency(value)]}
                    />
                    <Bar dataKey="payouts" fill="#111827" radius={[4, 4, 0, 0]} name="Payouts verses" />
                    <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="En attente" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-3">
              {activeChart === 'revenus' ? (
                <>
                  <span className="flex items-center gap-2 text-xs text-gray-500"><span className="w-3 h-0.5 bg-[#111827] rounded" />Revenus</span>
                  <span className="flex items-center gap-2 text-xs text-gray-500"><span className="w-3 h-0.5 bg-emerald-500 rounded" />Commissions</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2 text-xs text-gray-500"><span className="w-3 h-3 bg-[#111827] rounded" />Payouts verses</span>
                  <span className="flex items-center gap-2 text-xs text-gray-500"><span className="w-3 h-3 bg-amber-500 rounded" />En attente</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Transaction Table ───────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Search & Filters Header */}
          <div className="p-4 md:p-5 border-b border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Transactions ({filteredPayments.length})</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${showFilters ? 'bg-[#111827] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
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
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par ID, reservation, client, hote, logement..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>

              {/* Expandable Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Client</label>
                    <select value={filterClient} onChange={(e) => { setFilterClient(e.target.value); setCurrentPage(1); }} className={selectClass + ' w-full'}>
                      <option value="">Tous les clients</option>
                      {uniqueClients.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Hote</label>
                    <select value={filterHost} onChange={(e) => { setFilterHost(e.target.value); setCurrentPage(1); }} className={selectClass + ' w-full'}>
                      <option value="">Tous les hotes</option>
                      {uniqueHosts.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Statut paiement</label>
                    <select value={filterPaymentStatus} onChange={(e) => { setFilterPaymentStatus(e.target.value); setCurrentPage(1); }} className={selectClass + ' w-full'}>
                      <option value="">Tous les statuts</option>
                      <option value="Reussi">Reussi</option>
                      <option value="En attente">En attente</option>
                      <option value="Echoue">Echoue</option>
                      <option value="Rembourse">Rembourse</option>
                      <option value="Annule">Annule</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Statut payout</label>
                    <select value={filterPayoutStatus} onChange={(e) => { setFilterPayoutStatus(e.target.value); setCurrentPage(1); }} className={selectClass + ' w-full'}>
                      <option value="">Tous les statuts</option>
                      <option value="Verse">Verse</option>
                      <option value="En attente">En attente</option>
                      <option value="Suspendu">Suspendu</option>
                      <option value="Echoue">Echoue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Mode paiement</label>
                    <select value={filterMethod} onChange={(e) => { setFilterMethod(e.target.value); setCurrentPage(1); }} className={selectClass + ' w-full'}>
                      <option value="">Toutes les methodes</option>
                      <option value="Carte bancaire">Carte bancaire</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Stripe">Stripe</option>
                      <option value="Virement">Virement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Date debut</label>
                    <input type="date" value={filterDateFrom} onChange={(e) => { setFilterDateFrom(e.target.value); setCurrentPage(1); }} className={selectClass + ' w-full'} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Date fin</label>
                    <input type="date" value={filterDateTo} onChange={(e) => { setFilterDateTo(e.target.value); setCurrentPage(1); }} className={selectClass + ' w-full'} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Montant</label>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="Min" value={filterAmountMin} onChange={(e) => { setFilterAmountMin(e.target.value); setCurrentPage(1); }} className={selectClass + ' w-full'} />
                      <span className="text-gray-400 text-xs">-</span>
                      <input type="number" placeholder="Max" value={filterAmountMax} onChange={(e) => { setFilterAmountMax(e.target.value); setCurrentPage(1); }} className={selectClass + ' w-full'} />
                    </div>
                  </div>
                  {activeFiltersCount > 0 && (
                    <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                      <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        <X className="w-4 h-4" /> Reinitialiser les filtres
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>ID</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>RESERVATION</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>LOGEMENT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>CLIENT</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>HOTE</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>TOTAL</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>COMMISSION</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>PAYOUT</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>METHODE</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>PAIEMENT</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>PAYOUT</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>DATE</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((p) => (
                  <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${p.isFlagged ? 'bg-red-50/30' : ''}`}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {p.isFlagged && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                        <span className="text-sm" style={{ fontWeight: 600 }}>{p.id}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm text-indigo-600" style={{ fontWeight: 500 }}>{p.reservationId}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm text-gray-700 truncate max-w-[140px] block">{p.property.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#111827] rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0" style={{ fontWeight: 600 }}>
                          {p.client.avatar}
                        </div>
                        <span className="text-sm truncate max-w-[120px]" style={{ fontWeight: 500 }}>{p.client.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0" style={{ fontWeight: 600 }}>
                          {p.host.avatar}
                        </div>
                        <span className="text-sm truncate max-w-[120px]" style={{ fontWeight: 500 }}>{p.host.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(p.totalAmount)}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm text-emerald-600" style={{ fontWeight: 500 }}>{formatCurrency(p.commission)}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-sm text-gray-600">{formatCurrency(p.payoutAmount)}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-xs text-gray-600">{p.method}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] ${paymentStatusConfig[p.paymentStatus].bg} ${paymentStatusConfig[p.paymentStatus].text}`} style={{ fontWeight: 600 }}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] ${payoutStatusConfig[p.payoutStatus].bg} ${payoutStatusConfig[p.payoutStatus].text}`} style={{ fontWeight: 600 }}>
                        {p.payoutStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-xs text-gray-500">{formatDate(p.date)}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/payments/${p.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Voir le detail">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Link>
                        {p.paymentStatus === 'Reussi' && (
                          <button onClick={() => openRefundModal(p)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Rembourser">
                            <RotateCcw className="w-4 h-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet Table (medium screens) */}
          <div className="hidden md:block xl:hidden overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>TRANSACTION</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>CLIENT / HOTE</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>MONTANTS</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>STATUTS</th>
                  <th className="text-center py-3 px-4 text-xs text-gray-500" style={{ fontWeight: 600 }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPayments.map((p) => (
                  <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${p.isFlagged ? 'bg-red-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {p.isFlagged && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                        <span className="text-sm" style={{ fontWeight: 600 }}>{p.id}</span>
                      </div>
                      <div className="text-xs text-indigo-600" style={{ fontWeight: 500 }}>{p.reservationId}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{p.property.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{formatDate(p.date)} · {p.method}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 bg-[#111827] rounded-full flex items-center justify-center text-white text-[9px] flex-shrink-0" style={{ fontWeight: 600 }}>{p.client.avatar}</div>
                        <span className="text-xs" style={{ fontWeight: 500 }}>{p.client.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-[9px] flex-shrink-0" style={{ fontWeight: 600 }}>{p.host.avatar}</div>
                        <span className="text-xs text-gray-500">{p.host.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(p.totalAmount)}</div>
                      <div className="text-xs text-emerald-600 mt-0.5">{formatCurrency(p.commission)}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{formatCurrency(p.payoutAmount)}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${paymentStatusConfig[p.paymentStatus].bg} ${paymentStatusConfig[p.paymentStatus].text}`} style={{ fontWeight: 600 }}>{p.paymentStatus}</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${payoutStatusConfig[p.payoutStatus].bg} ${payoutStatusConfig[p.payoutStatus].text}`} style={{ fontWeight: 600 }}>{p.payoutStatus}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/admin/payments/${p.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Link>
                        {p.paymentStatus === 'Reussi' && (
                          <button onClick={() => openRefundModal(p)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                            <RotateCcw className="w-4 h-4 text-red-500" />
                          </button>
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
            {paginatedPayments.map((p) => (
              <div key={p.id} className={`p-4 ${p.isFlagged ? 'bg-red-50/30' : ''}`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {p.isFlagged && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                      <span className="text-sm" style={{ fontWeight: 600 }}>{p.id}</span>
                    </div>
                    <div className="text-xs text-indigo-600 mt-0.5" style={{ fontWeight: 500 }}>{p.reservationId}</div>
                  </div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] ${paymentStatusConfig[p.paymentStatus].bg} ${paymentStatusConfig[p.paymentStatus].text}`} style={{ fontWeight: 600 }}>
                    {p.paymentStatus}
                  </span>
                </div>

                {/* Property */}
                <div className="text-sm text-gray-700 mb-3" style={{ fontWeight: 500 }}>{p.property.name}</div>

                {/* Client & Host */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-[#111827] rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0" style={{ fontWeight: 600 }}>{p.client.avatar}</div>
                    <div className="min-w-0">
                      <div className="text-xs" style={{ fontWeight: 500 }}>{p.client.name}</div>
                      <div className="text-[10px] text-gray-400">Client</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0" style={{ fontWeight: 600 }}>{p.host.avatar}</div>
                    <div className="min-w-0">
                      <div className="text-xs" style={{ fontWeight: 500 }}>{p.host.name}</div>
                      <div className="text-[10px] text-gray-400">Hote</div>
                    </div>
                  </div>
                </div>

                {/* Amounts */}
                <div className="grid grid-cols-3 gap-2 mb-3 bg-gray-50 rounded-lg p-3">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Total</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(p.totalAmount)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Commission</div>
                    <div className="text-sm text-emerald-600" style={{ fontWeight: 600 }}>{formatCurrency(p.commission)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Payout</div>
                    <div className="text-sm" style={{ fontWeight: 500 }}>{formatCurrency(p.payoutAmount)}</div>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{formatDate(p.date)}</span>
                    <span>{p.method}</span>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${payoutStatusConfig[p.payoutStatus].bg} ${payoutStatusConfig[p.payoutStatus].text}`} style={{ fontWeight: 600 }}>
                    Payout: {p.payoutStatus}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Link href={`/admin/payments/${p.id}`} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-xs" style={{ fontWeight: 500 }}>Voir detail</span>
                  </Link>
                  {p.paymentStatus === 'Reussi' && (
                    <button onClick={() => openRefundModal(p)} className="px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                      <RotateCcw className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-red-600" style={{ fontWeight: 500 }}>Rembourser</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPayments.length === 0 && (
            <div className="py-16 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Aucune transaction trouvee</p>
              <button onClick={clearFilters} className="mt-2 text-sm text-[#111827] hover:underline" style={{ fontWeight: 500 }}>
                Reinitialiser les filtres
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 md:p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                Affichage {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredPayments.length)} sur {filteredPayments.length} transactions
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .reduce<(number | string)[]>((acc, page, idx, arr) => {
                    if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push('...');
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((page, idx) =>
                    typeof page === 'string' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm transition-colors ${currentPage === page ? 'bg-[#111827] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                        style={{ fontWeight: currentPage === page ? 600 : 400 }}
                      >
                        {page}
                      </button>
                    )
                  )}
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

      {/* ── Refund Modal ─────────────────────────────────────────── */}
      {showRefundModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowRefundModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg" style={{ fontWeight: 600 }}>Remboursement</h3>
                <button onClick={() => setShowRefundModal(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Transaction Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Transaction</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{selectedPayment.id}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Client</span>
                  <span className="text-sm" style={{ fontWeight: 500 }}>{selectedPayment.client.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Montant total</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(selectedPayment.totalAmount)}</span>
                </div>
              </div>

              {/* Refund Type */}
              <div className="mb-5">
                <label className="block text-sm mb-2" style={{ fontWeight: 500 }}>Type de remboursement</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setRefundType('total'); setRefundAmount(selectedPayment.totalAmount.toString()); }}
                    className={`p-3 rounded-xl border-2 transition-colors text-left ${refundType === 'total' ? 'border-[#111827] bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-sm" style={{ fontWeight: 600 }}>Total</div>
                    <div className="text-xs text-gray-500 mt-0.5">{formatCurrency(selectedPayment.totalAmount)}</div>
                  </button>
                  <button
                    onClick={() => { setRefundType('partial'); setRefundAmount(''); }}
                    className={`p-3 rounded-xl border-2 transition-colors text-left ${refundType === 'partial' ? 'border-[#111827] bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="text-sm" style={{ fontWeight: 600 }}>Partiel</div>
                    <div className="text-xs text-gray-500 mt-0.5">Montant personnalise</div>
                  </button>
                </div>
              </div>

              {/* Partial Amount */}
              {refundType === 'partial' && (
                <div className="mb-5">
                  <label className="block text-sm mb-2" style={{ fontWeight: 500 }}>Montant du remboursement</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EUR</span>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      max={selectedPayment.totalAmount}
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                  </div>
                  {parseFloat(refundAmount) > selectedPayment.totalAmount && (
                    <p className="text-xs text-red-500 mt-1">Le montant ne peut pas depasser {formatCurrency(selectedPayment.totalAmount)}</p>
                  )}
                </div>
              )}

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Cette action est irreversible. Le remboursement sera traite selon le mode de paiement original du client.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100 flex items-center gap-3">
              <button onClick={() => setShowRefundModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button
                onClick={handleRefund}
                disabled={refundType === 'partial' && (!refundAmount || parseFloat(refundAmount) <= 0 || parseFloat(refundAmount) > selectedPayment.totalAmount)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontWeight: 500 }}
              >
                Confirmer le remboursement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
