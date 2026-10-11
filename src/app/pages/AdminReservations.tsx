'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search, Eye, Filter, Download, X, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle,
  CalendarDays, Home, DollarSign, TrendingUp, Ban, ArrowLeft, Mail, Phone, MessageSquare, Users,
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { adminReservationsApi, type AdminReservation, type CancellationCheck, type ReservationPhase } from '@/app/services/api';
import { ReservationStatusBadge } from '@/app/components/booking/ReservationStatusBadge';
import { formatDateTime, formatGuestsDetail, formatMoney, hostAmount } from '@/app/components/booking/format';
import { CANCELLATION_POLICY_LABELS, normalizeCancellationPolicy, TRIP_PHASE_LABELS } from '@/shared/booking';

const ITEMS_PER_PAGE = 10;

const PAYMENT_LABELS: Record<string, string> = {
  awaiting: 'Paiement en cours',
  authorized: 'Carte autorisée',
  paid: 'Payé',
  released: 'Autorisation annulée',
  partially_refunded: 'Remboursé en partie',
  refunded: 'Remboursé',
};

const STATUS_PILLS: { key: 'all' | ReservationPhase; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'En attente' },
  { key: 'upcoming', label: 'À venir' },
  { key: 'ongoing', label: 'En cours' },
  { key: 'past', label: 'Terminées' },
  { key: 'cancelled', label: 'Annulées' },
  { key: 'declined', label: 'Refusées' },
  { key: 'expired', label: 'Expirées' },
];

/** Séjours confirmés (à venir, en cours ou passés) : ceux qui comptent dans les montants. */
const CONFIRMED_PHASES: ReservationPhase[] = ['upcoming', 'ongoing', 'past'];

function amount(value: string | null | undefined): number {
  const parsed = parseFloat(value ?? '');
  return Number.isFinite(parsed) ? parsed : 0;
}

function fullName(person: AdminReservation['guest']): string {
  return person ? `${person.first_name} ${person.last_name ?? ''}`.trim() : '—';
}

function initials(person: AdminReservation['guest']): string {
  return person ? `${person.first_name.charAt(0)}${(person.last_name ?? '').charAt(0)}`.toUpperCase() : '?';
}

function formatDay(date: string): string {
  return new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString('fr-FR', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function Avatar({ person, size = 'w-8 h-8' }: { person: AdminReservation['guest']; size?: string }) {
  if (person?.profile_photo_url) {
    return <img src={person.profile_photo_url} alt={person.first_name} className={`${size} rounded-full object-cover flex-shrink-0`} />;
  }
  return (
    <div className={`${size} bg-[#111827] rounded-full flex items-center justify-center text-white text-xs flex-shrink-0`} style={{ fontWeight: 600 }}>
      {initials(person)}
    </div>
  );
}

/** Export CSV (séparateur « ; » et BOM pour Excel en français). */
function exportCsv(rows: AdminReservation[]) {
  const header = [
    'N°', 'Statut', 'Logement', 'Voyageur', 'E-mail voyageur', 'Hôte', 'E-mail hôte', 'Arrivée', 'Départ',
    'Nuits', 'Voyageurs', 'Total', 'Frais de service', 'Montant hôte', 'Remboursable', 'Créée le',
  ];
  const lines = rows.map((r) => [
    r.confirmation_code,
    TRIP_PHASE_LABELS[r.phase],
    r.listing?.title ?? '',
    fullName(r.guest),
    r.guest?.email ?? '',
    fullName(r.host),
    r.host?.email ?? '',
    r.check_in.slice(0, 10),
    r.check_out.slice(0, 10),
    String(r.nights_count),
    String(r.guests_count),
    r.total_price,
    r.service_fee ?? '',
    hostAmount(r).toFixed(2),
    r.refund_amount ?? '',
    r.created_at.slice(0, 10),
  ]);
  const csv = [header, ...lines]
    .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\r\n');
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reservations-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminReservations() {
  const [reservations, setReservations] = useState<AdminReservation[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Liste
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReservationPhase>('all');
  const [hostFilter, setHostFilter] = useState('all');
  const [guestFilter, setGuestFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [amountFilter, setAmountFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Détail et annulation
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelPreview, setCancelPreview] = useState<CancellationCheck | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [payoutFilter, setPayoutFilter] = useState('all');
  const [payoutReference, setPayoutReference] = useState('');
  const [markingPaid, setMarkingPaid] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminReservationsApi
      .getAll()
      .then((res) => {
        if (cancelled) return;
        setReservations(res.reservations);
        // Lien direct : /admin/reservations?id=12
        const id = Number(new URLSearchParams(window.location.search).get('id'));
        if (Number.isInteger(id) && res.reservations.some((r) => r.id === id)) setSelectedId(id);
      })
      .catch(() => !cancelled && setLoadError('Impossible de charger les réservations.'));
    return () => {
      cancelled = true;
    };
  }, []);

  const all = useMemo(() => reservations ?? [], [reservations]);
  const selected = all.find((r) => r.id === selectedId) ?? null;

  const hosts = useMemo(() => {
    const unique = new Map<number, string>();
    all.forEach((r) => r.host && unique.set(r.host.id, fullName(r.host)));
    return [...unique.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [all]);

  const guests = useMemo(() => {
    const unique = new Map<number, string>();
    all.forEach((r) => r.guest && unique.set(r.guest.id, fullName(r.guest)));
    return [...unique.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [all]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)).toISOString().slice(0, 7);
    const today = now.toISOString().slice(0, 10);
    return all.filter((r) => {
      if (q) {
        const haystack = [
          r.confirmation_code, r.listing?.title, fullName(r.guest), r.guest?.email, fullName(r.host), r.host?.email,
        ].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (statusFilter !== 'all' && r.phase !== statusFilter) return false;
      if (hostFilter !== 'all' && r.host?.id !== Number(hostFilter)) return false;
      if (guestFilter !== 'all' && r.guest?.id !== Number(guestFilter)) return false;
      if (payoutFilter === 'to-pay' && !(r.payout && r.payout.status !== 'paid')) return false;
      if (payoutFilter === 'paid' && r.payout?.status !== 'paid') return false;
      const total = amount(r.total_price);
      if (amountFilter === '0-500' && total > 500) return false;
      if (amountFilter === '500-1000' && (total < 500 || total > 1000)) return false;
      if (amountFilter === '1000-2000' && (total < 1000 || total > 2000)) return false;
      if (amountFilter === '2000+' && total < 2000) return false;
      const checkIn = r.check_in.slice(0, 10);
      if (dateFilter === 'this-month' && checkIn.slice(0, 7) !== thisMonth) return false;
      if (dateFilter === 'next-month' && checkIn.slice(0, 7) !== nextMonth) return false;
      if (dateFilter === 'past' && checkIn >= today) return false;
      if (dateFilter === 'upcoming' && checkIn < today) return false;
      return true;
    });
  }, [all, searchQuery, statusFilter, hostFilter, guestFilter, dateFilter, amountFilter, payoutFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const stats = useMemo(() => {
    const confirmed = all.filter((r) => CONFIRMED_PHASES.includes(r.phase));
    const counts: Record<string, number> = { all: all.length };
    all.forEach((r) => (counts[r.phase] = (counts[r.phase] ?? 0) + 1));
    const toPay = all.filter((r) => r.payout && r.payout.status !== 'paid');
    return {
      counts,
      confirmedTotal: confirmed.reduce((sum, r) => sum + amount(r.total_price), 0),
      serviceFees: confirmed.reduce((sum, r) => sum + amount(r.service_fee), 0),
      payoutsToPay: toPay.length,
      payoutsToPayTotal: toPay.reduce((sum, r) => sum + amount(r.payout?.net_amount), 0),
    };
  }, [all]);

  const activeFiltersCount = [hostFilter, guestFilter, dateFilter, amountFilter, payoutFilter].filter((f) => f !== 'all').length;

  const clearFilters = () => {
    setStatusFilter('all');
    setHostFilter('all');
    setGuestFilter('all');
    setDateFilter('all');
    setAmountFilter('all');
    setPayoutFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const openCancel = async (id: number) => {
    setCancelOpen(true);
    setCancelPreview(null);
    setCancelReason('');
    setCancelError(null);
    try {
      setCancelPreview(await adminReservationsApi.cancelPreview(id));
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Impossible de vérifier l'annulation.");
    }
  };

  const submitCancel = async () => {
    if (!selected || !cancelReason.trim()) return;
    setCancelling(true);
    setCancelError(null);
    try {
      const res = await adminReservationsApi.cancel(selected.id, cancelReason.trim());
      setReservations((prev) => (prev ?? []).map((r) => (r.id === res.reservation.id ? res.reservation : r)));
      setCancelOpen(false);
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "L'annulation a échoué.");
    } finally {
      setCancelling(false);
    }
  };

  const markPayoutPaid = async () => {
    if (!selected?.payout) return;
    setMarkingPaid(true);
    setPayoutError(null);
    try {
      const reference = payoutReference.trim() || undefined;
      await adminReservationsApi.markPayoutPaid(selected.payout.id, reference);
      const paidDate = new Date().toISOString().slice(0, 10);
      setReservations((prev) =>
        (prev ?? []).map((r) =>
          r.id === selected.id && r.payout
            ? { ...r, payout: { ...r.payout, status: 'paid', paid_date: paidDate, reference: reference ?? null } }
            : r,
        ),
      );
      setPayoutReference('');
    } catch (err) {
      setPayoutError(err instanceof Error ? err.message : "Le versement n'a pas pu être enregistré.");
    } finally {
      setMarkingPaid(false);
    }
  };

  const shell = (content: React.ReactNode) => (
    <div className="min-h-screen bg-gray-50/50">
      <AdminSidebar />
      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">{content}</main>
    </div>
  );

  if (loadError || reservations === null) {
    return shell(
      <div className="mt-16 lg:mt-0">
        <h1 className="text-2xl md:text-3xl mb-6" style={{ fontWeight: 600 }}>Gestion des réservations</h1>
        {loadError ? (
          <p className="text-sm text-red-600">{loadError}</p>
        ) : (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </div>
        )}
      </div>,
    );
  }

  // ── Détail ────────────────────────────────────────────────────────────────

  if (selected) {
    const r = selected;
    const currency = r.currency;
    const nights = r.nights_count;
    const policy = normalizeCancellationPolicy(r.cancellation_policy);
    const cancellable = r.phase === 'pending' || r.phase === 'upcoming' || r.phase === 'ongoing';
    const cancelledBy = { guest: 'par le voyageur', host: "par l'hôte", admin: "par l'équipe Séjoura" } as const;

    const timeline: { date: string; label: string; icon: typeof CalendarDays; color: string }[] = [
      { date: r.created_at, label: r.reservation_mode === 'instant' ? 'Réservation instantanée' : 'Demande envoyée', icon: CalendarDays, color: 'text-gray-500' },
    ];
    if (r.confirmed_at) timeline.push({ date: r.confirmed_at, label: r.reservation_mode === 'instant' ? 'Confirmée' : "Acceptée par l'hôte", icon: CheckCircle, color: 'text-emerald-500' });
    if (r.declined_at) timeline.push({ date: r.declined_at, label: "Refusée par l'hôte", icon: XCircle, color: 'text-red-500' });
    if (r.phase === 'expired' && r.expires_at) timeline.push({ date: r.expires_at, label: 'Expirée sans réponse', icon: Clock, color: 'text-gray-500' });
    if (r.cancelled_at) timeline.push({ date: r.cancelled_at, label: `Annulée ${r.cancelled_by ? cancelledBy[r.cancelled_by] : ''}`, icon: Ban, color: 'text-red-500' });
    if (r.phase === 'ongoing' || r.phase === 'past') timeline.push({ date: r.check_in, label: 'Arrivée', icon: Home, color: 'text-blue-500' });
    if (r.phase === 'past') timeline.push({ date: r.check_out, label: 'Départ', icon: Home, color: 'text-gray-500' });

    const priceLines: [string, number][] = [
      [`${formatMoney(r.price_per_night, currency)} x ${nights} nuit${nights > 1 ? 's' : ''}`, amount(r.price_per_night) * nights],
      ['Frais de ménage', amount(r.cleaning_fee)],
      ['Voyageurs supplémentaires', amount(r.extra_guest_fee)],
      ['Animaux', amount(r.pet_fee)],
    ];

    const personCard = (title: string, person: AdminReservation['guest'], profileHref: string | null) => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
        <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4" style={{ fontWeight: 600 }}>{title}</h2>
        <div className="flex items-center gap-3 mb-4">
          <Avatar person={person} size="w-11 h-11" />
          <div>
            <div className="text-sm" style={{ fontWeight: 600 }}>{fullName(person)}</div>
            {person && <div className="text-xs text-gray-500">Compte #{person.id}</div>}
          </div>
        </div>
        {person && (
          <div className="space-y-2.5">
            <a href={`mailto:${person.email}`} className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-gray-900">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{person.email}</span>
            </a>
            {person.phone && (
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {person.phone}
              </div>
            )}
          </div>
        )}
        {profileHref && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link href={profileHref} className="block w-full px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs text-center" style={{ fontWeight: 500 }}>
              Voir le profil
            </Link>
          </div>
        )}
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-50/50">
        <AdminSidebar />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          <div className="mb-6 mt-16 lg:mt-0">
            <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Retour aux réservations
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl font-mono" style={{ fontWeight: 600 }}>{r.confirmation_code}</h1>
                  <ReservationStatusBadge phase={r.phase} />
                </div>
                <p className="text-sm text-gray-500">Créée le {formatDateTime(r.created_at)}</p>
              </div>
              {cancellable && (
                <button
                  onClick={() => openCancel(r.id)}
                  className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2 text-sm self-start"
                  style={{ fontWeight: 500 }}
                >
                  <Ban className="w-4 h-4" />
                  {r.phase === 'pending' ? 'Annuler la demande' : 'Annuler la réservation'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Séjour */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-lg mb-5" style={{ fontWeight: 600 }}>Séjour</h2>
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                  {r.listing?.cover_photo_url ? (
                    <img src={r.listing.cover_photo_url} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                      <Home className="w-6 h-6" />
                    </div>
                  )}
                  <div className="min-w-0">
                    {r.listing ? (
                      <Link href={`/admin/properties/${r.listing.id}`} className="text-sm mb-0.5 truncate block hover:underline" style={{ fontWeight: 600 }}>
                        {r.listing.title}
                      </Link>
                    ) : (
                      <div className="text-sm" style={{ fontWeight: 600 }}>Logement supprimé</div>
                    )}
                    <div className="text-xs text-gray-500">
                      {r.listing?.full_address || [r.listing?.city, r.listing?.province].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Arrivée</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{formatDay(r.check_in)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Départ</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{formatDay(r.check_out)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Nuits</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{nights}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Voyageurs</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{formatGuestsDetail(r)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Mode</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{r.reservation_mode === 'instant' ? 'Instantanée' : 'Sur demande'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Annulation</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{policy ? CANCELLATION_POLICY_LABELS[policy] : '—'}</div>
                  </div>
                </div>
              </div>

              {/* Montants */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg" style={{ fontWeight: 600 }}>Montants</h2>
                  {r.stripe_payment_intent_id ? (
                    <a
                      href={`https://dashboard.stripe.com/${r.stripe_payment_intent_id.startsWith('pi_') && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test') ? 'test/' : ''}payments/${r.stripe_payment_intent_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs underline text-gray-600"
                    >
                      {PAYMENT_LABELS[r.payment_status ?? 'awaiting']} · voir dans Stripe
                    </a>
                  ) : (
                    <span className="text-xs text-gray-500">Sans paiement en ligne</span>
                  )}
                </div>
                <div className="space-y-3">
                  {priceLines
                    .filter(([, value], index) => index === 0 || value > 0)
                    .map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{label}</span>
                        <span className="text-sm">{formatMoney(value, currency)}</span>
                      </div>
                    ))}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Frais de service Séjoura</span>
                    <span className="text-sm text-emerald-600" style={{ fontWeight: 600 }}>{formatMoney(r.service_fee, currency)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span className="text-sm" style={{ fontWeight: 600 }}>Total voyageur</span>
                    <span className="text-base" style={{ fontWeight: 600 }}>{formatMoney(r.total_price, currency)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Montant hôte</span>
                    <span className="text-sm" style={{ fontWeight: 600 }}>{formatMoney(hostAmount(r), currency)}</span>
                  </div>
                  {r.amount_paid !== null && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Encaissé</span>
                      <span className="text-sm" style={{ fontWeight: 600 }}>{formatMoney(r.amount_paid, currency)}</span>
                    </div>
                  )}
                  {r.amount_refunded !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Remboursé via Stripe</span>
                      <span className="text-sm text-red-600" style={{ fontWeight: 600 }}>{formatMoney(r.amount_refunded, currency)}</span>
                    </div>
                  )}
                  {r.refund_amount !== null && !r.payment_status && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-gray-600">Remboursable au voyageur (selon la politique)</span>
                      <span className="text-sm text-red-600" style={{ fontWeight: 600 }}>{formatMoney(r.refund_amount, currency)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Versement à l'hôte */}
              {r.payout && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                  <h2 className="text-lg mb-4" style={{ fontWeight: 600 }}>Versement à l&apos;hôte</h2>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Montant à virer</span>
                    <span className="text-base" style={{ fontWeight: 600 }}>{formatMoney(r.payout.net_amount, currency)}</span>
                  </div>
                  {r.payout.status === 'paid' ? (
                    <p className="text-sm text-emerald-700">
                      Versé le {formatDay(r.payout.paid_date ?? '')}
                      {r.payout.reference ? ` · réf. ${r.payout.reference}` : ''}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 mb-4">
                        Prévu le {formatDay(r.payout.scheduled_date ?? '')} (lendemain de l&apos;arrivée), par virement à{' '}
                        {fullName(r.host)}.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          value={payoutReference}
                          onChange={(e) => setPayoutReference(e.target.value.slice(0, 255))}
                          placeholder="Référence du virement (facultatif)"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]/20"
                        />
                        <button
                          onClick={markPayoutPaid}
                          disabled={markingPaid}
                          className="px-4 py-2 bg-[#111827] text-white rounded-lg text-sm disabled:opacity-50"
                          style={{ fontWeight: 600 }}
                        >
                          {markingPaid ? 'Enregistrement…' : 'Marquer comme versé'}
                        </button>
                      </div>
                      {payoutError && <p className="text-sm text-red-600 mt-2">{payoutError}</p>}
                    </>
                  )}
                </div>
              )}

              {/* Chronologie */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-lg mb-5" style={{ fontWeight: 600 }}>Chronologie</h2>
                <div>
                  {timeline.map((event, i) => {
                    const Icon = event.icon;
                    const isDay = event.date.length <= 10 || event.label === 'Arrivée' || event.label === 'Départ';
                    return (
                      <div key={`${event.label}-${i}`} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-50 ${event.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {i < timeline.length - 1 && <div className="w-px h-6 bg-gray-200 my-1" />}
                        </div>
                        <div className="pb-4">
                          <div className="text-sm" style={{ fontWeight: 500 }}>{event.label}</div>
                          <div className="text-xs text-gray-500">{isDay ? formatDay(event.date) : formatDateTime(event.date)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {r.cancellation_reason && (
                  <p className="text-sm text-gray-600 mt-2">
                    Motif : <span style={{ fontWeight: 500 }}>{r.cancellation_reason}</span>
                  </p>
                )}
              </div>

              {r.guest_message && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                  <h2 className="text-lg mb-3 flex items-center gap-2" style={{ fontWeight: 600 }}>
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    Message du voyageur à l&apos;hôte
                  </h2>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{r.guest_message}</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {personCard('Voyageur', r.guest, r.guest ? `/admin/clients/${r.guest.id}` : null)}
              {personCard('Hôte', r.host, r.host ? `/admin/hosts/${r.host.id}` : null)}
            </div>
          </div>
        </main>

        {/* Annulation par l'administration */}
        {cancelOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !cancelling && setCancelOpen(false)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>
                {r.phase === 'pending' ? 'Annuler la demande' : 'Annuler la réservation'}
              </h3>
              {!cancelPreview && !cancelError && (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                </div>
              )}
              {cancelPreview && !cancelPreview.allowed && <p className="text-sm text-gray-600 text-center mb-4">{cancelPreview.message}</p>}
              {cancelPreview?.allowed && (
                <>
                  <p className="text-sm text-gray-500 text-center mb-4">
                    {cancelPreview.kind === 'cancel'
                      ? `Le voyageur et l'hôte seront prévenus par e-mail. Le voyageur aura droit au remboursement intégral (${formatMoney(cancelPreview.refund.refund, currency)}), à régler hors ligne tant que le paiement en ligne n'existe pas.`
                      : "Le voyageur et l'hôte seront prévenus par e-mail. Rien n'a été débité pour cette demande."}
                  </p>
                  <textarea
                    placeholder="Motif de l'annulation (transmis au voyageur et à l'hôte)…"
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value.slice(0, 255))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm resize-none mb-4"
                  />
                </>
              )}
              {cancelError && <p className="text-sm text-red-600 mb-4">{cancelError}</p>}
              <div className="flex items-center gap-3">
                <button onClick={() => setCancelOpen(false)} disabled={cancelling} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>
                  Fermer
                </button>
                {cancelPreview?.allowed && (
                  <button
                    onClick={submitCancel}
                    disabled={cancelling || !cancelReason.trim()}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                    style={{ fontWeight: 600 }}
                  >
                    {cancelling ? 'Annulation…' : "Confirmer l'annulation"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Liste ─────────────────────────────────────────────────────────────────

  const statCards = [
    {
      label: `Versements à faire (${stats.payoutsToPay})`,
      value: formatMoney(stats.payoutsToPayTotal),
      icon: CalendarDays,
      tone: 'bg-gray-100 text-gray-600',
      text: '',
    },
    { label: 'Demandes en attente', value: String(stats.counts.pending ?? 0), icon: Clock, tone: 'bg-amber-50 text-amber-600', text: 'text-amber-700' },
    { label: 'Séjours confirmés', value: formatMoney(stats.confirmedTotal), icon: DollarSign, tone: 'bg-emerald-50 text-emerald-600', text: 'text-emerald-700' },
    { label: 'Frais de service Séjoura', value: formatMoney(stats.serviceFees), icon: TrendingUp, tone: 'bg-blue-50 text-blue-600', text: 'text-blue-700' },
  ];

  return shell(
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
        <div>
          <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Gestion des réservations</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} réservation{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => exportCsv(filtered)}
          disabled={filtered.length === 0}
          className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm self-start disabled:opacity-50"
          style={{ fontWeight: 500 }}
        >
          <Download className="w-4 h-4" />
          Exporter (CSV)
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${card.tone}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className={`text-xl md:text-2xl ${card.text}`} style={{ fontWeight: 600 }}>{card.value}</div>
              <div className="text-xs text-gray-500 mt-1">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_PILLS.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setStatusFilter(item.key);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              statusFilter === item.key ? 'bg-[#111827] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            style={{ fontWeight: statusFilter === item.key ? 600 : 500 }}
          >
            {item.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-md ${statusFilter === item.key ? 'bg-white/20' : 'bg-gray-100'}`}>
              {stats.counts[item.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par n°, logement, voyageur, hôte, e-mail…"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 focus:border-[#111827] transition-all text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 border rounded-xl transition-colors flex items-center gap-2 text-sm ${
                    showFilters ? 'bg-[#111827] text-white border-[#111827]' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  <Filter className="w-4 h-4" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <span
                      className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${showFilters ? 'bg-white text-[#111827]' : 'bg-[#111827] text-white'}`}
                      style={{ fontWeight: 600 }}
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
                {(activeFiltersCount > 0 || statusFilter !== 'all' || searchQuery) && (
                  <button onClick={clearFilters} className="px-3 py-2.5 text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
                    <X className="w-3.5 h-3.5" />
                    Effacer
                  </button>
                )}
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                {[
                  { label: 'Hôte', value: hostFilter, set: setHostFilter, options: hosts.map(([id, name]) => [String(id), name]) },
                  { label: 'Voyageur', value: guestFilter, set: setGuestFilter, options: guests.map(([id, name]) => [String(id), name]) },
                  {
                    label: 'Arrivée',
                    value: dateFilter,
                    set: setDateFilter,
                    options: [['this-month', 'Ce mois'], ['next-month', 'Mois prochain'], ['upcoming', 'À venir'], ['past', 'Passées']],
                  },
                  {
                    label: 'Versement hôte',
                    value: payoutFilter,
                    set: setPayoutFilter,
                    options: [['to-pay', 'À faire'], ['paid', 'Effectué']],
                  },
                  {
                    label: 'Montant',
                    value: amountFilter,
                    set: setAmountFilter,
                    options: [['0-500', '0 – 500 €'], ['500-1000', '500 – 1 000 €'], ['1000-2000', '1 000 – 2 000 €'], ['2000+', '2 000 € et plus']],
                  },
                ].map((filter) => (
                  <div key={filter.label}>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>{filter.label}</label>
                    <select
                      value={filter.value}
                      onChange={(e) => {
                        filter.set(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm"
                    >
                      <option value="all">Tous</option>
                      {filter.options.map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-sm text-gray-500">
            {all.length === 0 ? 'Aucune réservation pour le moment.' : 'Aucune réservation pour ces filtres.'}
          </div>
        ) : (
          <>
            {/* Tableau (grand écran) */}
            <div className="hidden xl:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {['N°', 'Logement', 'Voyageur', 'Hôte', 'Séjour', 'Total', 'Statut', 'Créée le', ''].map((label, i) => (
                      <th
                        key={label || i}
                        className={`py-3 px-4 text-xs text-gray-500 uppercase tracking-wider ${i === 5 ? 'text-right' : 'text-left'}`}
                        style={{ fontWeight: 600 }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r) => (
                    <tr key={r.id} onClick={() => setSelectedId(r.id)} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                      <td className="py-3 px-4 text-xs font-mono text-gray-600">{r.confirmation_code}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {r.listing?.cover_photo_url ? (
                            <img src={r.listing.cover_photo_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Home className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-sm truncate max-w-[180px]" style={{ fontWeight: 500 }}>{r.listing?.title ?? '—'}</div>
                            <div className="text-xs text-gray-500">{r.listing?.city}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar person={r.guest} />
                          <span className="text-sm truncate max-w-[120px]">{fullName(r.guest)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar person={r.host} />
                          <span className="text-sm truncate max-w-[120px]">{fullName(r.host)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{formatDay(r.check_in)} → {formatDay(r.check_out)}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          {r.nights_count} nuit{r.nights_count > 1 ? 's' : ''} · <Users className="w-3 h-3" /> {r.guests_count}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-sm" style={{ fontWeight: 600 }}>{formatMoney(r.total_price, r.currency)}</td>
                      <td className="py-3 px-4">
                        <ReservationStatusBadge phase={r.phase} />
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{formatDay(r.created_at)}</td>
                      <td className="py-3 px-4">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cartes (tablette et mobile) */}
            <div className="xl:hidden divide-y divide-gray-100">
              {paginated.map((r) => (
                <button key={r.id} onClick={() => setSelectedId(r.id)} className="w-full text-left p-4 hover:bg-gray-50/50">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="text-sm truncate" style={{ fontWeight: 600 }}>{r.listing?.title ?? '—'}</div>
                      <div className="text-xs text-gray-500 font-mono">{r.confirmation_code}</div>
                    </div>
                    <ReservationStatusBadge phase={r.phase} />
                  </div>
                  <div className="text-xs text-gray-600 mb-1">
                    {fullName(r.guest)} chez {fullName(r.host)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{formatDay(r.check_in)} → {formatDay(r.check_out)}</span>
                    <span style={{ fontWeight: 600 }}>{formatMoney(r.total_price, r.currency)}</span>
                  </div>
                </button>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Page {currentPage} sur {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Page précédente"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Page suivante"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>,
  );
}
