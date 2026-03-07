'use client';

import { useState } from 'react';
import { HostSidebar } from '@/app/components/HostSidebar';
import {
  type RevenueSummary,
  type RevenueChartResponse,
  type RevenueStats,
  type Payout,
  type PayoutDetail,
  type RevenueListingOption,
} from '@/app/services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─── Constants ───────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin',
  'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTH_NAMES_FULL = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

const PAYOUT_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'En attente',  color: '#B45309', bg: '#FEF3C7' },
  scheduled: { label: 'Planifie',    color: '#1E40AF', bg: '#DBEAFE' },
  paid:      { label: 'Verse',       color: '#065F46', bg: '#D1FAE5' },
  failed:    { label: 'Echoue',      color: '#991B1B', bg: '#FEE2E2' },
};

type ActiveTab = 'overview' | 'upcoming' | 'history' | 'reports';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_SUMMARY: RevenueSummary = {
  revenue_this_month: 3430.00,
  revenue_this_year: 18750.50,
  revenue_total: 42680.00,
  revenue_estimated: 8500.00,
  currency: 'CAD',
};

const MOCK_CHART: RevenueChartResponse = {
  monthly: [
    { month: 1, revenue: 833, gross: 980, commission: 147 },
    { month: 2, revenue: 3289, gross: 3870, commission: 581 },
    { month: 3, revenue: 5950, gross: 7000, commission: 1050 },
    { month: 4, revenue: 2720, gross: 3200, commission: 480 },
    { month: 5, revenue: 3400, gross: 4000, commission: 600 },
    { month: 6, revenue: 4250, gross: 5000, commission: 750 },
    { month: 7, revenue: 5525, gross: 6500, commission: 975 },
    { month: 8, revenue: 5100, gross: 6000, commission: 900 },
    { month: 9, revenue: 3825, gross: 4500, commission: 675 },
    { month: 10, revenue: 2550, gross: 3000, commission: 450 },
    { month: 11, revenue: 2975, gross: 3500, commission: 525 },
    { month: 12, revenue: 1785, gross: 2100, commission: 315 },
  ],
  yearly: [
    { year: 2024, revenue: 28500 },
    { year: 2025, revenue: 38200 },
    { year: 2026, revenue: 18750 },
  ],
  selected_year: 2026,
};

const MOCK_STATS: RevenueStats = {
  total_nights: 186,
  avg_revenue_per_night: 229.46,
  avg_stay_duration: 4.2,
  total_reservations: 44,
};

const MOCK_UPCOMING: Payout[] = [
  {
    id: 1,
    reservation_id: 1,
    listing: { id: 1, title: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    reservation_dates: { check_in: '2026-03-22', check_out: '2026-03-29' },
    gross_amount: 2450,
    commission_amount: 367.50,
    net_amount: 2082.50,
    currency: 'CAD',
    status: 'scheduled',
    scheduled_date: '2026-03-30',
    paid_date: null,
  },
  {
    id: 2,
    reservation_id: 3,
    listing: { id: 2, title: 'Appartement Vieux-Montreal', city: 'Montreal' },
    reservation_dates: { check_in: '2026-03-15', check_out: '2026-03-20' },
    gross_amount: 1750,
    commission_amount: 262.50,
    net_amount: 1487.50,
    currency: 'CAD',
    status: 'pending',
    scheduled_date: '2026-03-21',
    paid_date: null,
  },
  {
    id: 3,
    reservation_id: 7,
    listing: { id: 1, title: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    reservation_dates: { check_in: '2026-03-28', check_out: '2026-04-04' },
    gross_amount: 2800,
    commission_amount: 420,
    net_amount: 2380,
    currency: 'CAD',
    status: 'pending',
    scheduled_date: '2026-04-05',
    paid_date: null,
  },
  {
    id: 8,
    reservation_id: 12,
    listing: { id: 3, title: 'Condo Lac-Beauport', city: 'Quebec' },
    reservation_dates: { check_in: '2026-04-10', check_out: '2026-04-15' },
    gross_amount: 1200,
    commission_amount: 180,
    net_amount: 1020,
    currency: 'CAD',
    status: 'pending',
    scheduled_date: '2026-04-16',
    paid_date: null,
  },
];

const MOCK_HISTORY: Payout[] = [
  {
    id: 4,
    reservation_id: 4,
    listing: { id: 2, title: 'Appartement Vieux-Montreal', city: 'Montreal' },
    reservation_dates: { check_in: '2026-02-10', check_out: '2026-02-14' },
    gross_amount: 720,
    commission_amount: 108,
    net_amount: 612,
    currency: 'CAD',
    status: 'paid',
    scheduled_date: '2026-02-15',
    paid_date: '2026-02-15',
  },
  {
    id: 5,
    reservation_id: 5,
    listing: { id: 1, title: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    reservation_dates: { check_in: '2026-02-01', check_out: '2026-02-08' },
    gross_amount: 3150,
    commission_amount: 472.50,
    net_amount: 2677.50,
    currency: 'CAD',
    status: 'paid',
    scheduled_date: '2026-02-09',
    paid_date: '2026-02-09',
  },
  {
    id: 6,
    reservation_id: 2,
    listing: { id: 2, title: 'Appartement Vieux-Montreal', city: 'Montreal' },
    reservation_dates: { check_in: '2026-01-15', check_out: '2026-01-20' },
    gross_amount: 980,
    commission_amount: 147,
    net_amount: 833,
    currency: 'CAD',
    status: 'paid',
    scheduled_date: '2026-01-21',
    paid_date: '2026-01-21',
  },
  {
    id: 7,
    reservation_id: 8,
    listing: { id: 3, title: 'Condo Lac-Beauport', city: 'Quebec' },
    reservation_dates: { check_in: '2025-12-20', check_out: '2025-12-27' },
    gross_amount: 2100,
    commission_amount: 315,
    net_amount: 1785,
    currency: 'CAD',
    status: 'paid',
    scheduled_date: '2025-12-28',
    paid_date: '2025-12-28',
  },
  {
    id: 9,
    reservation_id: 10,
    listing: { id: 1, title: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
    reservation_dates: { check_in: '2025-11-15', check_out: '2025-11-22' },
    gross_amount: 3500,
    commission_amount: 525,
    net_amount: 2975,
    currency: 'CAD',
    status: 'paid',
    scheduled_date: '2025-11-23',
    paid_date: '2025-11-23',
  },
];

const MOCK_LISTINGS: RevenueListingOption[] = [
  { id: 1, title: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
  { id: 2, title: 'Appartement Vieux-Montreal', city: 'Montreal' },
  { id: 3, title: 'Condo Lac-Beauport', city: 'Quebec' },
];

const MOCK_PAYOUT_DETAIL: PayoutDetail = {
  id: 1,
  reservation_id: 1,
  listing: { id: 1, title: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant' },
  reservation: { id: 1, check_in: '2026-03-22', check_out: '2026-03-29', total_price: '2450.00', guests_count: 4 },
  gross_amount: 2450,
  cleaning_fee: 150,
  commission_rate: 15,
  commission_amount: 367.50,
  taxes: 48.90,
  net_amount: 2033.60,
  currency: 'CAD',
  status: 'scheduled',
  scheduled_date: '2026-03-30',
  paid_date: null,
  reference: null,
  created_at: '2026-03-10T10:00:00Z',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number, currency = 'CAD'): string {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Component ───────────────────────────────────────────────────────────────

export function HostRevenues() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [chartView, setChartView] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedListing, setSelectedListing] = useState<number | ''>('');
  const [selectedPayout, setSelectedPayout] = useState<PayoutDetail | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Mock data (TODO: replace with API calls when backend is ready)
  const summary = MOCK_SUMMARY;
  const chart = MOCK_CHART;
  const stats = MOCK_STATS;
  const listings = MOCK_LISTINGS;
  const upcoming = selectedListing
    ? MOCK_UPCOMING.filter(p => p.listing?.id === selectedListing)
    : MOCK_UPCOMING;
  const history = selectedListing
    ? MOCK_HISTORY.filter(p => p.listing?.id === selectedListing)
    : MOCK_HISTORY;

  const handlePayoutClick = (payout: Payout) => {
    setSelectedPayout({
      ...MOCK_PAYOUT_DETAIL,
      id: payout.id,
      reservation_id: payout.reservation_id,
      gross_amount: payout.gross_amount,
      commission_amount: payout.commission_amount,
      net_amount: payout.net_amount,
      status: payout.status,
      listing: payout.listing,
      scheduled_date: payout.scheduled_date,
      paid_date: payout.paid_date,
      reservation: payout.reservation_dates ? {
        id: payout.reservation_id,
        check_in: payout.reservation_dates.check_in,
        check_out: payout.reservation_dates.check_out,
        total_price: String(payout.gross_amount),
        guests_count: MOCK_PAYOUT_DETAIL.reservation?.guests_count ?? 2,
      } : MOCK_PAYOUT_DETAIL.reservation,
    });
    setShowDetail(true);
  };

  const handleExport = (type: 'monthly' | 'annual' | 'csv') => {
    // TODO: Replace with API call when backend is ready
    // hostRevenueApi.exportCSV(params)
    const filename = `revenus-${type === 'monthly' ? `${selectedYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}` : type === 'annual' ? String(selectedYear) : 'complet'}.csv`;
    alert(`Export "${filename}" sera disponible quand le backend sera connecte.`);
  };

  const chartData = chartView === 'monthly'
    ? chart.monthly.map(m => ({
        name: MONTH_NAMES[m.month - 1],
        revenue: m.revenue,
      }))
    : chart.yearly.map(y => ({
        name: String(y.year),
        revenue: y.revenue,
      }));

  const TABS: { key: ActiveTab; label: string }[] = [
    { key: 'overview', label: 'Vue d\'ensemble' },
    { key: 'upcoming', label: 'Paiements a venir' },
    { key: 'history', label: 'Historique' },
    { key: 'reports', label: 'Rapports' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HostSidebar activePage="host-revenues" />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl mb-6 md:mb-8 mt-16 lg:mt-0" style={{ fontWeight: 600, color: '#222222' }}>
          Revenus
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-2 rounded-full text-sm whitespace-nowrap border transition-colors"
              style={{
                fontWeight: 600,
                backgroundColor: activeTab === tab.key ? '#222222' : 'white',
                color: activeTab === tab.key ? 'white' : '#222222',
                borderColor: activeTab === tab.key ? '#222222' : '#DDDDDD',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard label="Revenus ce mois" value={formatCurrency(summary.revenue_this_month)} />
              <SummaryCard label="Revenus cette annee" value={formatCurrency(summary.revenue_this_year)} />
              <SummaryCard label="Revenus totaux" value={formatCurrency(summary.revenue_total)} />
              <SummaryCard label="Revenus estimes" value={formatCurrency(summary.revenue_estimated)} subtitle="Reservations futures" />
            </div>

            {/* Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-lg" style={{ fontWeight: 600, color: '#222222' }}>Revenus</h2>
                <div className="flex flex-wrap gap-3">
                  {/* Chart view toggle */}
                  <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setChartView('monthly')}
                      className="px-3 py-1.5 text-xs transition-colors"
                      style={{
                        fontWeight: 600,
                        backgroundColor: chartView === 'monthly' ? '#222222' : 'white',
                        color: chartView === 'monthly' ? 'white' : '#717171',
                      }}
                    >
                      Mensuel
                    </button>
                    <button
                      onClick={() => setChartView('yearly')}
                      className="px-3 py-1.5 text-xs transition-colors"
                      style={{
                        fontWeight: 600,
                        backgroundColor: chartView === 'yearly' ? '#222222' : 'white',
                        color: chartView === 'yearly' ? 'white' : '#717171',
                      }}
                    >
                      Annuel
                    </button>
                  </div>
                  {/* Year selector */}
                  {chartView === 'monthly' && (
                    <select
                      value={selectedYear}
                      onChange={e => setSelectedYear(Number(e.target.value))}
                      className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                      style={{ fontWeight: 500 }}
                    >
                      {[2024, 2025, 2026].map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  )}
                  {/* Listing filter */}
                  <select
                    value={selectedListing}
                    onChange={e => setSelectedListing(e.target.value === '' ? '' : Number(e.target.value))}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white"
                    style={{ fontWeight: 500 }}
                  >
                    <option value="">Toutes les annonces</option>
                    {listings.map(l => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={chartView === 'monthly' ? 32 : 48}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#717171' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#717171' }} axisLine={false} tickLine={false} tickFormatter={v => `${v} $`} />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Revenu net']}
                      contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }}
                    />
                    <Bar dataKey="revenue" fill="#222222" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>Statistiques de performance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatItem label="Nuits reservees" value={String(stats.total_nights)} />
                <StatItem label="Revenu moyen / nuit" value={formatCurrency(stats.avg_revenue_per_night)} />
                <StatItem label="Duree moyenne des sejours" value={`${stats.avg_stay_duration} nuits`} />
              </div>
            </div>
          </div>
        )}

        {/* UPCOMING PAYOUTS TAB */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            <h2 className="text-lg" style={{ fontWeight: 600, color: '#222222' }}>
              Paiements a venir
            </h2>
            {upcoming.length === 0 ? (
              <EmptyState icon="dollar" message="Aucun paiement a venir pour le moment." />
            ) : (
              <PayoutTable payouts={upcoming} onPayoutClick={handlePayoutClick} />
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-lg" style={{ fontWeight: 600, color: '#222222' }}>
              Historique des paiements
            </h2>
            {history.length === 0 ? (
              <EmptyState icon="clock" message="Aucun paiement envoye pour le moment." />
            ) : (
              <PayoutTable payouts={history} onPayoutClick={handlePayoutClick} showPaidDate />
            )}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-lg" style={{ fontWeight: 600, color: '#222222' }}>
              Rapports financiers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ReportCard
                title="Rapport mensuel"
                description={`${MONTH_NAMES_FULL[new Date().getMonth()]} ${selectedYear}`}
                onClick={() => handleExport('monthly')}
              />
              <ReportCard
                title="Rapport annuel"
                description={`Annee ${selectedYear}`}
                onClick={() => handleExport('annual')}
              />
              <ReportCard
                title="Exporter en CSV"
                description="Toutes les donnees"
                onClick={() => handleExport('csv')}
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm mb-4" style={{ fontWeight: 600, color: '#222222' }}>Parametres d'export</h3>
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
                  style={{ fontWeight: 500 }}
                >
                  {[2024, 2025, 2026].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Payout Detail Modal */}
        {showDetail && selectedPayout && (
          <PayoutDetailModal payout={selectedPayout} onClose={() => setShowDetail(false)} />
        )}
      </main>
    </div>
  );
}

// ─── Sub Components ──────────────────────────────────────────────────────────

function SummaryCard({ label, value, subtitle }: { label: string; value: string; subtitle?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs mb-1" style={{ color: '#717171', fontWeight: 500 }}>{label}</p>
      <p className="text-2xl" style={{ fontWeight: 600, color: '#222222' }}>{value}</p>
      {subtitle && <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{subtitle}</p>}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs mb-1" style={{ color: '#717171', fontWeight: 500 }}>{label}</p>
      <p className="text-xl" style={{ fontWeight: 600, color: '#222222' }}>{value}</p>
    </div>
  );
}

function PayoutTable({ payouts, onPayoutClick, showPaidDate }: {
  payouts: Payout[];
  onPayoutClick: (p: Payout) => void;
  showPaidDate?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-5 py-3 text-xs" style={{ color: '#717171', fontWeight: 600 }}>Reservation</th>
              <th className="text-left px-5 py-3 text-xs" style={{ color: '#717171', fontWeight: 600 }}>Annonce</th>
              <th className="text-right px-5 py-3 text-xs" style={{ color: '#717171', fontWeight: 600 }}>Montant brut</th>
              <th className="text-right px-5 py-3 text-xs" style={{ color: '#717171', fontWeight: 600 }}>Commission</th>
              <th className="text-right px-5 py-3 text-xs" style={{ color: '#717171', fontWeight: 600 }}>Revenu net</th>
              <th className="text-left px-5 py-3 text-xs" style={{ color: '#717171', fontWeight: 600 }}>
                {showPaidDate ? 'Date paiement' : 'Date prevue'}
              </th>
              <th className="text-left px-5 py-3 text-xs" style={{ color: '#717171', fontWeight: 600 }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => {
              const statusInfo = PAYOUT_STATUS_CONFIG[p.status] || PAYOUT_STATUS_CONFIG.pending;
              return (
                <tr
                  key={p.id}
                  onClick={() => onPayoutClick(p)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>RES-{String(p.reservation_id).padStart(3, '0')}</p>
                    {p.reservation_dates && (
                      <p className="text-xs" style={{ color: '#717171' }}>
                        {formatDate(p.reservation_dates.check_in)} - {formatDate(p.reservation_dates.check_out)}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm" style={{ color: '#222222' }}>{p.listing?.title || '-'}</p>
                    <p className="text-xs" style={{ color: '#717171' }}>{p.listing?.city || ''}</p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <p className="text-sm" style={{ color: '#222222' }}>{formatCurrency(p.gross_amount)}</p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <p className="text-sm" style={{ color: '#991B1B' }}>-{formatCurrency(p.commission_amount)}</p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <p className="text-sm" style={{ fontWeight: 600, color: '#065F46' }}>{formatCurrency(p.net_amount)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm" style={{ color: '#222222' }}>
                      {formatDate(showPaidDate ? p.paid_date : p.scheduled_date)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs"
                      style={{ fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color }}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {payouts.map(p => {
          const statusInfo = PAYOUT_STATUS_CONFIG[p.status] || PAYOUT_STATUS_CONFIG.pending;
          return (
            <div
              key={p.id}
              onClick={() => onPayoutClick(p)}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>RES-{String(p.reservation_id).padStart(3, '0')}</p>
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs"
                  style={{ fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color }}
                >
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-sm mb-1" style={{ color: '#717171' }}>{p.listing?.title || '-'}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: '#717171' }}>
                  {formatDate(showPaidDate ? p.paid_date : p.scheduled_date)}
                </p>
                <p className="text-sm" style={{ fontWeight: 600, color: '#065F46' }}>{formatCurrency(p.net_amount)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PayoutDetailModal({ payout, onClose }: { payout: PayoutDetail; onClose: () => void }) {
  const statusInfo = PAYOUT_STATUS_CONFIG[payout.status] || PAYOUT_STATUS_CONFIG.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg" style={{ fontWeight: 600, color: '#222222' }}>Detail du paiement</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Listing info */}
          {payout.listing && (
            <div className="mb-6 pb-4 border-b border-gray-200">
              <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{payout.listing.title}</p>
              <p className="text-xs" style={{ color: '#717171' }}>{payout.listing.city}</p>
              {payout.reservation && (
                <p className="text-xs mt-1" style={{ color: '#717171' }}>
                  {formatDate(payout.reservation.check_in)} - {formatDate(payout.reservation.check_out)}
                  {' '} ({payout.reservation.guests_count} voyageur{payout.reservation.guests_count > 1 ? 's' : ''})
                </p>
              )}
            </div>
          )}

          {/* Breakdown */}
          <div className="space-y-3">
            <DetailRow label="Prix total de la reservation" value={formatCurrency(payout.gross_amount)} />
            {payout.cleaning_fee > 0 && (
              <DetailRow label="Frais de menage" value={formatCurrency(payout.cleaning_fee)} included />
            )}
            <DetailRow
              label={`Commission plateforme (${payout.commission_rate}%)`}
              value={`-${formatCurrency(payout.commission_amount)}`}
              negative
            />
            {payout.taxes > 0 && (
              <DetailRow label="Taxes" value={`-${formatCurrency(payout.taxes)}`} negative />
            )}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>Revenu net pour l'hote</p>
                <p className="text-lg" style={{ fontWeight: 600, color: '#065F46' }}>{formatCurrency(payout.net_amount)}</p>
              </div>
            </div>
          </div>

          {/* Status & dates */}
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: '#717171' }}>Statut</p>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs"
                style={{ fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color }}
              >
                {statusInfo.label}
              </span>
            </div>
            {payout.scheduled_date && (
              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: '#717171' }}>Date prevue de versement</p>
                <p className="text-sm" style={{ color: '#222222' }}>{formatDate(payout.scheduled_date)}</p>
              </div>
            )}
            {payout.paid_date && (
              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: '#717171' }}>Date de paiement</p>
                <p className="text-sm" style={{ color: '#222222' }}>{formatDate(payout.paid_date)}</p>
              </div>
            )}
            {payout.reference && (
              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: '#717171' }}>Reference</p>
                <p className="text-xs font-mono" style={{ color: '#222222' }}>{payout.reference}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, negative, included }: {
  label: string;
  value: string;
  negative?: boolean;
  included?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm" style={{ color: '#717171' }}>
        {label}
        {included && <span className="text-xs ml-1">(inclus)</span>}
      </p>
      <p className="text-sm" style={{ fontWeight: 500, color: negative ? '#991B1B' : '#222222' }}>
        {value}
      </p>
    </div>
  );
}

function ReportCard({ title, description, onClick }: { title: string; description: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md hover:border-gray-300 transition-all w-full"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="1.5">
            <path d="M12 10v6m0 0l-3-3m3 3l3-3" />
            <path d="M3 17v2a2 2 0 002 2h14a2 2 0 002-2v-2" />
            <path d="M14 3H5a2 2 0 00-2 2v10" />
            <path d="M14 3l5 5m-5-5v4a1 1 0 001 1h4" />
          </svg>
        </div>
        <div>
          <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{title}</p>
          <p className="text-xs mt-0.5" style={{ color: '#717171' }}>{description}</p>
        </div>
      </div>
    </button>
  );
}

function EmptyState({ icon, message }: { icon: 'dollar' | 'clock'; message: string }) {
  return (
    <div className="text-center py-24">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        {icon === 'dollar' ? (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9.5C15 8.12 13.66 7 12 7s-3 1.12-3 2.5S10.34 12 12 12s3 1.12 3 2.5S13.66 17 12 17s-3-1.12-3-2.5" />
            <path d="M12 5.5V7m0 10v1.5" />
          </svg>
        ) : (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        )}
      </div>
      <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
        Aucun paiement
      </h2>
      <p className="text-sm" style={{ color: '#717171' }}>{message}</p>
    </div>
  );
}
