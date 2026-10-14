'use client';

import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, LineChart as LineChartIcon, Table2 } from 'lucide-react';
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AdminOverview } from '@/app/services/api';
import { bucketLabel, compact, deltaPercent, integer, moneyExact, moneyRounded, percent, tickLabel } from './format';

/** Couleurs du graphique : série actuelle en accent, période précédente en gris de contexte */
export const VIZ = {
  accent: '#2a78d6',
  previous: '#898781',
  grid: '#e1e0d9',
  axis: '#c3c2b7',
  muted: '#898781',
  up: '#006300',
  down: '#d03b3b',
};

export type MetricKey = keyof AdminOverview['metrics'];

const METRICS: { key: MetricKey; label: string; money: boolean; hint: string }[] = [
  { key: 'volume', label: "Volume d'affaires", money: true, hint: 'Montant des réservations confirmées' },
  { key: 'revenue', label: 'Revenus Séjoura', money: true, hint: 'Frais de service perçus' },
  { key: 'bookings', label: 'Réservations', money: false, hint: 'Réservations confirmées' },
  { key: 'signups', label: 'Inscriptions', money: false, hint: 'Nouveaux comptes' },
];

type ChartRow = { key: string; previousKey: string; current: number; previous: number };

/** Graduations rondes (pas de 1, 2, 2,5 ou 5 × 10ⁿ) couvrant `max` en 4 intervalles environ */
function niceTicks(max: number, integerOnly: boolean): number[] {
  const fallback = integerOnly ? 4 : 100;
  const top = max > 0 ? max : fallback;
  const raw = top / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  let step = [1, 2, 2.5, 5, 10].map((f) => f * magnitude).find((candidate) => candidate >= raw) ?? 10 * magnitude;
  if (integerOnly) step = Math.max(1, Math.ceil(step));
  const ticks: number[] = [];
  for (let value = 0; ticks.length === 0 || ticks[ticks.length - 1] < top; value += step) ticks.push(value);
  return ticks;
}

function Delta({ current, previous }: { current: number; previous: number }) {
  const delta = deltaPercent(current, previous);
  if (delta === null) {
    return <span style={{ color: VIZ.muted }}>{current > 0 ? 'Pas de comparaison' : '—'}</span>;
  }
  const up = delta > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className="inline-flex items-center gap-0.5" style={{ color: delta === 0 ? VIZ.muted : up ? VIZ.up : VIZ.down, fontWeight: 600 }}>
      {delta !== 0 && <Icon className="w-3.5 h-3.5" aria-hidden />}
      {percent(delta)}
      <span className="sr-only">{up ? 'en hausse' : 'en baisse'} par rapport à la période précédente</span>
    </span>
  );
}

function ActivityTooltip({
  active,
  payload,
  granularity,
  format,
}: {
  active?: boolean;
  payload?: { payload: ChartRow }[];
  granularity: AdminOverview['granularity'];
  format: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="bg-white rounded-lg shadow-lg ring-1 ring-black/10 px-3 py-2.5 text-xs min-w-[200px]">
      <div className="text-gray-500 mb-2">{bucketLabel(row.key, granularity)}</div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-0.5 rounded-full" style={{ background: VIZ.accent }} aria-hidden />
        <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{format(row.current)}</span>
        <span className="text-gray-500">Période actuelle</span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="w-3 h-0.5 rounded-full" style={{ background: VIZ.previous }} aria-hidden />
        <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{format(row.previous)}</span>
        <span className="text-gray-500">{bucketLabel(row.previousKey, granularity)}</span>
      </div>
    </div>
  );
}

export function ActivityCard({ data }: { data: AdminOverview }) {
  const [selected, setSelected] = useState<MetricKey>('volume');
  const [showTable, setShowTable] = useState(false);
  const metric = METRICS.find((m) => m.key === selected)!;
  const series = data.metrics[selected];
  const count = series.current.length;

  const rows: ChartRow[] = useMemo(
    () =>
      series.current.map((current, i) => ({
        key: data.buckets[count + i],
        previousKey: data.buckets[i],
        current,
        previous: series.previous[i],
      })),
    [series, data.buckets, count],
  );

  const exact = (value: number) => (metric.money ? moneyExact(value, data.currency) : integer(value));
  const empty = series.total === 0 && series.previous_total === 0;
  const ticks = useMemo(
    () => niceTicks(Math.max(0, ...series.current, ...series.previous), !metric.money),
    [series, metric.money],
  );

  return (
    <section className="bg-white rounded-xl shadow-sm ring-1 ring-black/5 overflow-hidden" aria-labelledby="activity-title">
      <h2 id="activity-title" className="sr-only">Activité</h2>

      {/* Indicateurs : chaque onglet choisit la courbe affichée */}
      <div role="tablist" aria-label="Indicateur affiché" className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-100">
        {METRICS.map((m) => {
          const s = data.metrics[m.key];
          const isSelected = m.key === selected;
          return (
            <button
              key={m.key}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelected(m.key)}
              className={`text-left px-5 py-4 border-t-2 transition-colors focus:outline-none focus-visible:bg-gray-50 ${
                isSelected ? 'bg-white' : 'border-t-transparent bg-gray-50/60 hover:bg-gray-50'
              }`}
              style={isSelected ? { borderTopColor: VIZ.accent } : undefined}
            >
              <div className="text-xs text-gray-500 mb-1.5" style={{ fontWeight: 500 }}>{m.label}</div>
              <div className="text-2xl text-gray-900 mb-1 whitespace-nowrap" style={{ fontWeight: 600 }}>
                {m.money ? moneyRounded(s.total, data.currency) : integer(s.total)}
              </div>
              <div className="text-xs">
                <Delta current={s.total} previous={s.previous_total} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-sm text-gray-900" style={{ fontWeight: 600 }}>{metric.label}</div>
            <div className="text-xs text-gray-500">{metric.hint}, par {data.granularity === 'month' ? 'mois' : data.granularity === 'week' ? 'semaine' : 'jour'}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-xs text-gray-600" aria-label="Légende">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-0.5 rounded-full" style={{ background: VIZ.accent }} aria-hidden />
                Période actuelle
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-4 h-0.5 rounded-full" style={{ background: VIZ.previous }} aria-hidden />
                Période précédente
              </span>
            </div>
            <button
              onClick={() => setShowTable((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
              style={{ fontWeight: 500 }}
              aria-pressed={showTable}
            >
              {showTable ? <LineChartIcon className="w-3.5 h-3.5" aria-hidden /> : <Table2 className="w-3.5 h-3.5" aria-hidden />}
              {showTable ? 'Courbe' : 'Tableau'}
            </button>
          </div>
        </div>

        {showTable ? (
          <div className="max-h-[280px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-200 text-xs text-gray-500">
                  <th className="text-left py-2 pr-4" style={{ fontWeight: 600 }}>Période</th>
                  <th className="text-right py-2 px-4" style={{ fontWeight: 600 }}>Actuelle</th>
                  <th className="text-right py-2 pl-4" style={{ fontWeight: 600 }}>Précédente</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {rows.map((row) => (
                  <tr key={row.key} className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-700">{bucketLabel(row.key, data.granularity)}</td>
                    <td className="py-2 px-4 text-right text-gray-900" style={{ fontWeight: 600 }}>{exact(row.current)}</td>
                    <td className="py-2 pl-4 text-right text-gray-500">{exact(row.previous)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="relative">
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} accessibilityLayer>
                <CartesianGrid vertical={false} stroke={VIZ.grid} />
                <XAxis
                  dataKey="key"
                  tickFormatter={(value: string) => tickLabel(value, data.granularity)}
                  tickLine={false}
                  axisLine={{ stroke: VIZ.axis }}
                  tick={{ fill: VIZ.muted, fontSize: 12 }}
                  minTickGap={28}
                  interval="preserveStartEnd"
                  tickMargin={8}
                />
                <YAxis
                  tickFormatter={(value: number) => compact(value, metric.money ? data.currency : undefined)}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: VIZ.muted, fontSize: 12 }}
                  width={64}
                  ticks={ticks}
                  domain={[0, ticks[ticks.length - 1]]}
                  interval={0}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                />
                <Tooltip
                  cursor={{ stroke: VIZ.axis, strokeWidth: 1 }}
                  content={<ActivityTooltip granularity={data.granularity} format={exact} />}
                  isAnimationActive={false}
                />
                <Line
                  dataKey="previous"
                  type="linear"
                  stroke={VIZ.previous}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={false}
                  activeDot={{ r: 4, fill: VIZ.previous, stroke: '#fff', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="current"
                  type="linear"
                  stroke={VIZ.accent}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill={VIZ.accent}
                  fillOpacity={0.1}
                  dot={false}
                  activeDot={{ r: 5, fill: VIZ.accent, stroke: '#fff', strokeWidth: 2 }}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
            {empty && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm text-gray-500 bg-white/90 px-3 py-1.5 rounded-md">Aucune donnée sur ces deux périodes</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
