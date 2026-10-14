'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck,
  Flag,
  Home,
  RotateCw,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { ActivityCard, VIZ } from '@/app/components/admin-dashboard/ActivityCard';
import { integer, moneyExact, moneyRounded, spanLabel } from '@/app/components/admin-dashboard/format';
import { ReservationStatusBadge } from '@/app/components/booking/ReservationStatusBadge';
import { formatMoney } from '@/app/components/booking/format';
import { adminOverviewApi, type AdminOverview, type AdminOverviewPeriod } from '@/app/services/api';
import { TRIP_PHASE_LABELS } from '@/shared/booking';

const PERIODS: { key: AdminOverviewPeriod; label: string }[] = [
  { key: '7d', label: '7 jours' },
  { key: '30d', label: '30 jours' },
  { key: '3m', label: '3 mois' },
  { key: '12m', label: '12 mois' },
];

const LISTING_STATUS_LABELS: Record<keyof AdminOverview['listings']['by_status'], string> = {
  active: 'Actifs',
  pending: 'En attente',
  draft: 'Brouillons',
  rejected: 'Refusés',
  archived: 'Archivés',
};

function Card({ title, subtitle, action, children, className = '' }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`bg-white rounded-xl shadow-sm ring-1 ring-black/5 p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{title}</h2>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Barre fine d'une seule teinte : longueur = valeur, libellé et valeur en texte */
function BarRow({ label, value, max, display }: { label: string; value: number; max: number; display?: string }) {
  const width = max > 0 ? Math.max((value / max) * 100, value > 0 ? 2 : 0) : 0;
  return (
    <div className="py-1.5">
      <div className="flex items-center justify-between gap-3 text-sm mb-1">
        <span className={`truncate min-w-0 ${value > 0 ? 'text-gray-700' : 'text-gray-400'}`} title={label}>{label}</span>
        <span className={`tabular-nums whitespace-nowrap flex-shrink-0 ${value > 0 ? 'text-gray-900' : 'text-gray-400'}`} style={{ fontWeight: 600 }}>{display ?? integer(value)}</span>
      </div>
      <div className="h-2 rounded-r" aria-hidden>
        {width > 0 && <div className="h-2 rounded-r" style={{ width: `${width}%`, background: VIZ.accent }} />}
      </div>
    </div>
  );
}

type Todo = { key: string; icon: typeof Clock; label: string; detail?: string; count: number; href: string; urgent?: boolean };

function TodoCard({ todo, currency }: { todo: AdminOverview['todo']; currency: string }) {
  const items: Todo[] = [
    { key: 'requests', icon: Clock, label: 'Demandes en attente', detail: "Réponse de l'hôte sous 24 h", count: todo.pending_requests, href: '/admin/reservations', urgent: true },
    {
      key: 'payouts',
      icon: Wallet,
      label: 'Versements aux hôtes',
      detail:
        todo.payouts_due.count > 0
          ? `${moneyExact(todo.payouts_due.amount, currency)}${todo.payouts_due.next_date ? ` · prochain le ${new Date(`${todo.payouts_due.next_date}T00:00:00Z`).toLocaleDateString('fr-FR', { timeZone: 'UTC', day: 'numeric', month: 'short' })}` : ''}`
          : 'Aucun versement prévu',
      count: todo.payouts_due.count,
      href: '/admin/reservations',
    },
    { key: 'arrivals', icon: CalendarCheck, label: 'Arrivées sous 7 jours', detail: 'Réservations confirmées', count: todo.arrivals_7d, href: '/admin/reservations' },
    { key: 'listings', icon: Home, label: 'Annonces à valider', count: todo.listings_pending, href: '/admin/properties', urgent: true },
    { key: 'documents', icon: FileCheck, label: "Documents d'hôtes à vérifier", count: todo.host_documents_pending, href: '/admin/hosts', urgent: true },
    { key: 'reports', icon: Flag, label: 'Signalements ouverts', count: todo.client_reports_open, href: '/admin/clients', urgent: true },
    { key: 'suspects', icon: ShieldAlert, label: 'Comptes suspects', count: todo.suspect_users, href: '/admin/fraud', urgent: true },
  ];
  const urgent = items.filter((item) => item.urgent && item.count > 0).reduce((sum, item) => sum + item.count, 0);

  return (
    <Card
      title="À traiter"
      subtitle="État actuel, toutes périodes"
      action={
        urgent > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-800" style={{ fontWeight: 600 }}>
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
            {urgent} en attente
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-50 text-green-800" style={{ fontWeight: 600 }}>
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
            Tout est à jour
          </span>
        )
      }
    >
      <ul className="-mx-2">
        {items.map(({ key, icon: Icon, label, detail, count, href, urgent: isUrgent }) => {
          const highlight = isUrgent && count > 0;
          return (
            <li key={key}>
              <Link href={href} className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'}`}
                  aria-hidden
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm truncate ${count > 0 ? 'text-gray-900' : 'text-gray-500'}`} style={{ fontWeight: count > 0 ? 500 : 400 }}>{label}</span>
                  {detail && <span className="block text-xs text-gray-500 truncate">{detail}</span>}
                </span>
                <span className={`text-sm tabular-nums ${count > 0 ? 'text-gray-900' : 'text-gray-400'}`} style={{ fontWeight: 600 }}>{integer(count)}</span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl text-gray-900" style={{ fontWeight: 600 }}>{value}</div>
      {note && <div className="text-xs text-gray-500 mt-0.5">{note}</div>}
    </div>
  );
}

export function AdminDashboard() {
  const router = useRouter();
  const [period, setPeriod] = useState<AdminOverviewPeriod>('30d');
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    adminOverviewApi
      .get(period)
      .then((overview) => !cancelled && setData(overview))
      .catch(() => !cancelled && setLoadError(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [period, attempt]);

  // Fin affichée : aujourd'hui, même quand le mois en cours n'est pas terminé
  const tomorrow = new Date();
  tomorrow.setUTCHours(0, 0, 0, 0);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const shownEnd = data ? new Date(Math.min(Date.parse(data.to), tomorrow.getTime())).toISOString() : null;
  const count = data ? data.buckets.length / 2 : 0;
  const statusTotal = data ? data.statuses.reduce((sum, s) => sum + s.count, 0) : 0;
  const statusMax = data ? Math.max(...data.statuses.map((s) => s.count)) : 0;
  const cityMax = data ? Math.max(0, ...data.listings.top_cities.map((c) => c.count)) : 0;
  const topMax = data ? Math.max(0, ...data.top_listings.map((l) => l.volume)) : 0;
  const verifiedShare = data && data.community.users > 0 ? data.community.verified / data.community.users : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* En-tête */}
        <div className="flex flex-col gap-1 mb-5 mt-16 lg:mt-0">
          <h1 className="text-2xl md:text-3xl text-gray-900" style={{ fontWeight: 600 }}>Dashboard général</h1>
          <p className="text-sm text-gray-500">
            Toute l'activité de Séjoura
            {data && ` · mis à jour à ${new Date(data.generated_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
          </p>
        </div>

        {/* Période : s'applique à tout ce qui suit, sauf « À traiter » (état actuel) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
          <div role="radiogroup" aria-label="Période" className="inline-flex p-1 bg-white rounded-lg ring-1 ring-black/10 shadow-sm">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                role="radio"
                aria-checked={period === p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${period === p.key ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                style={{ fontWeight: 500 }}
              >
                {p.label}
              </button>
            ))}
          </div>
          {data && shownEnd && (
            <span className="text-sm text-gray-500">
              {spanLabel(data.buckets[count], shownEnd)}
              <span className="text-gray-400"> · comparé au {spanLabel(data.buckets[0], data.current_from)}</span>
            </span>
          )}
          <button
            onClick={() => setAttempt((n) => n + 1)}
            className="ml-auto inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
            aria-label="Actualiser"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
        </div>

        {loadError && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl ring-1 ring-red-100 px-5 py-4">
            <p className="text-sm text-gray-700">
              {data ? 'Impossible de mettre à jour le tableau de bord, les chiffres affichés peuvent être anciens.' : 'Impossible de charger le tableau de bord.'}
            </p>
            <button
              onClick={() => setAttempt((n) => n + 1)}
              className="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ fontWeight: 500 }}
            >
              Réessayer
            </button>
          </div>
        )}

        {!data && !loadError && (
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 py-24 text-center text-sm text-gray-500">Chargement du tableau de bord…</div>
        )}

        {data && (
          // Pendant un rechargement, l'affichage précédent reste en place, atténué
          <div className={`space-y-6 transition-opacity ${loading ? 'opacity-60' : ''}`} aria-busy={loading}>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <ActivityCard data={data} />
              </div>
              <TodoCard todo={data.todo} currency={data.currency} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <Card title="Réservations par statut" subtitle={`${integer(statusTotal)} demande${statusTotal > 1 ? 's' : ''} créée${statusTotal > 1 ? 's' : ''} sur la période`}>
                {data.statuses.map((s) => (
                  <BarRow key={s.phase} label={TRIP_PHASE_LABELS[s.phase]} value={s.count} max={statusMax} />
                ))}
              </Card>

              <Card title="Communauté" subtitle="Comptes voyageurs et hôtes">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <Stat label="Utilisateurs" value={integer(data.community.users)} note={`+${integer(data.community.new_in_period)} sur la période`} />
                  <Stat label="Hôtes" value={integer(data.community.hosts)} note="avec au moins une annonce" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-700">Identité vérifiée</span>
                    <span className="text-gray-900 tabular-nums" style={{ fontWeight: 600 }}>
                      {integer(data.community.verified)} / {integer(data.community.users)}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: '#cde2fb' }}
                    role="meter"
                    aria-label="Comptes à l'identité vérifiée"
                    aria-valuemin={0}
                    aria-valuemax={data.community.users}
                    aria-valuenow={data.community.verified}
                  >
                    <div className="h-full rounded-full" style={{ width: `${verifiedShare * 100}%`, background: VIZ.accent }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1.5">{Math.round(verifiedShare * 100)} % des comptes</div>
                </div>
              </Card>

              <Card title="Logements" subtitle={`${integer(data.listings.total)} annonces · +${integer(data.listings.new_in_period)} sur la période`} className="md:col-span-2 xl:col-span-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(Object.keys(LISTING_STATUS_LABELS) as (keyof typeof LISTING_STATUS_LABELS)[]).map((status) => (
                    <span
                      key={status}
                      className={`text-xs px-2.5 py-1 rounded-full ${data.listings.by_status[status] > 0 ? 'bg-gray-100 text-gray-800' : 'bg-gray-50 text-gray-400'}`}
                    >
                      {LISTING_STATUS_LABELS[status]} <span className="tabular-nums" style={{ fontWeight: 600 }}>{integer(data.listings.by_status[status])}</span>
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Villes avec le plus d'annonces actives</div>
                {data.listings.top_cities.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">Aucune annonce active.</p>
                ) : (
                  data.listings.top_cities.map((c) => <BarRow key={c.city} label={c.city} value={c.count} max={cityMax} />)
                )}
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card title="Meilleurs logements" subtitle="Volume confirmé sur la période">
                {data.top_listings.length === 0 ? (
                  <p className="text-sm text-gray-500 py-6 text-center">Aucune réservation confirmée sur la période.</p>
                ) : (
                  data.top_listings.map((l) => (
                    <Link key={l.id} href={`/admin/properties/${l.id}`} className="block -mx-2 px-2 rounded-lg hover:bg-gray-50">
                      <BarRow
                        label={`${l.title ?? 'Sans titre'}${l.city ? ` · ${l.city}` : ''}`}
                        value={l.volume}
                        max={topMax}
                        display={moneyRounded(l.volume, data.currency)}
                      />
                    </Link>
                  ))
                )}
              </Card>

              <Card
                title="Réservations récentes"
                className="xl:col-span-2"
                action={
                  <Link href="/admin/reservations" className="text-sm text-gray-900 hover:underline" style={{ fontWeight: 500 }}>
                    Voir tout
                  </Link>
                }
              >
                {data.recent.length === 0 ? (
                  <p className="text-sm text-gray-500 py-6 text-center">Aucune réservation pour le moment.</p>
                ) : (
                  <>
                    <div className="hidden md:block overflow-x-auto -mx-5">
                      <table className="w-full">
                        <thead>
                          <tr className="border-y border-gray-100 bg-gray-50/60">
                            {['Voyageur', 'Logement', 'Créée le', 'Montant', 'Statut'].map((h, i) => (
                              <th key={h} className={`py-2.5 px-3 first:pl-5 last:pr-5 text-xs text-gray-500 ${i === 3 ? 'text-right' : 'text-left'}`} style={{ fontWeight: 600 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.recent.map((r) => (
                            <tr key={r.id} onClick={() => router.push(`/admin/reservations?id=${r.id}`)} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer">
                              <td className="py-3 pl-5 pr-3 max-w-[180px]">
                                <div className="text-sm text-gray-900 truncate">{r.guest ?? '—'}</div>
                                <div className="text-xs font-mono text-gray-500">{r.confirmation_code}</div>
                              </td>
                              <td className="py-3 px-3 text-sm text-gray-700 max-w-[220px] truncate" title={r.listing ?? undefined}>{r.listing ?? '—'}</td>
                              <td className="py-3 px-3 text-sm text-gray-500 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</td>
                              <td className="py-3 px-3 text-sm text-right tabular-nums text-gray-900 whitespace-nowrap" style={{ fontWeight: 600 }}>{formatMoney(r.total_price, r.currency)}</td>
                              <td className="py-3 pl-3 pr-5"><ReservationStatusBadge phase={r.phase} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="md:hidden space-y-3">
                      {data.recent.map((r) => (
                        <Link key={r.id} href={`/admin/reservations?id=${r.id}`} className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <span className="text-sm font-mono text-gray-900" style={{ fontWeight: 600 }}>{r.confirmation_code}</span>
                            <ReservationStatusBadge phase={r.phase} />
                          </div>
                          <div className="text-sm text-gray-900">{r.guest ?? '—'}</div>
                          <div className="text-sm text-gray-500 truncate">{r.listing ?? '—'}</div>
                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100 text-sm">
                            <span className="text-gray-500">{new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                            <span className="text-gray-900" style={{ fontWeight: 600 }}>{formatMoney(r.total_price, r.currency)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
