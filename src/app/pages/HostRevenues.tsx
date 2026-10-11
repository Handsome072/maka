'use client';

import { useEffect, useState } from 'react';
import { HostSidebar } from '@/app/components/HostSidebar';
import {
  hostRevenueApi,
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

// ─── Valeurs vides (avant le premier chargement, ou hôte sans versement) ─────

const EMPTY_SUMMARY: RevenueSummary = {
  revenue_this_month: 0,
  revenue_this_year: 0,
  revenue_total: 0,
  revenue_estimated: 0,
  currency: 'EUR',
};

const EMPTY_STATS: RevenueStats = {
  total_nights: 0,
  avg_revenue_per_night: 0,
  avg_stay_duration: 0,
  total_reservations: 0,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
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

  // Versements réels (host_payouts) : créés quand Séjoura encaisse un séjour, virés après l'arrivée
  const [summary, setSummary] = useState<RevenueSummary>(EMPTY_SUMMARY);
  const [chart, setChart] = useState<RevenueChartResponse>({ monthly: [], yearly: [], selected_year: selectedYear });
  const [stats, setStats] = useState<RevenueStats>(EMPTY_STATS);
  const [listings, setListings] = useState<RevenueListingOption[]>([]);
  const [allUpcoming, setAllUpcoming] = useState<Payout[]>([]);
  const [allHistory, setAllHistory] = useState<Payout[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      hostRevenueApi.getSummary(),
      hostRevenueApi.getStats(),
      hostRevenueApi.getListings(),
      hostRevenueApi.getUpcoming(),
      hostRevenueApi.getHistory(),
    ])
      .then(([summaryRes, statsRes, listingsRes, upcomingRes, historyRes]) => {
        if (cancelled) return;
        setSummary(summaryRes);
        setStats(statsRes);
        setListings(listingsRes.listings);
        setAllUpcoming(upcomingRes.payouts);
        setAllHistory(historyRes.payouts);
      })
      .catch(() => !cancelled && setLoadError('Impossible de charger vos revenus. Réessayez dans un instant.'));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    hostRevenueApi
      .getChart({ year: selectedYear, listing_id: selectedListing || undefined })
      .then((res) => !cancelled && setChart(res))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [selectedYear, selectedListing]);

  const upcoming = selectedListing ? allUpcoming.filter((p) => p.listing?.id === selectedListing) : allUpcoming;
  const history = selectedListing ? allHistory.filter((p) => p.listing?.id === selectedListing) : allHistory;

  const handlePayoutClick = async (payout: Payout) => {
    try {
      const res = await hostRevenueApi.getPayoutDetail(payout.id);
      setSelectedPayout(res.payout);
      setShowDetail(true);
    } catch {
      setLoadError('Impossible de charger ce versement.');
    }
  };

  const handleExport = async (type: 'monthly' | 'annual' | 'csv') => {
    const params =
      type === 'monthly'
        ? { year: selectedYear, month: new Date().getMonth() + 1 }
        : type === 'annual'
          ? { year: selectedYear }
          : undefined;
    const filename = `revenus-${type === 'monthly' ? `${selectedYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}` : type === 'annual' ? String(selectedYear) : 'complet'}.csv`;
    try {
      const blob = await hostRevenueApi.exportCSV(params);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setLoadError("L'export n'a pas pu être généré.");
    }
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

        {loadError && <p className="text-sm text-red-600 mb-4">{loadError}</p>}

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
                    <YAxis tick={{ fontSize: 12, fill: '#717171' }} axisLine={false} tickLine={false} tickFormatter={v => `${v} €`} />
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
