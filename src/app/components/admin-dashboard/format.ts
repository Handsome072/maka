/** Formats du dashboard admin (montants arrondis, axes compacts, libellés des tranches). */

export type Granularity = 'day' | 'week' | 'month';

export function moneyRounded(value: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

export function moneyExact(value: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(value);
}

/** « 1,6 k € », « 12 » : graduations de l'axe */
export function compact(value: number, currency?: string): string {
  return new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    maximumFractionDigits: 1,
    ...(currency ? { style: 'currency', currency } : {}),
  }).format(value);
}

export function integer(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

/** Variation par rapport à la période précédente ; null quand elle n'a pas de sens (base nulle) */
export function deltaPercent(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function percent(value: number): string {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(value) + ' %';
}

function utc(ymd: string): Date {
  return new Date(`${ymd.slice(0, 10)}T00:00:00Z`);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

/** Graduation de l'axe des temps : « 14 oct. » ou « oct. 26 » */
export function tickLabel(ymd: string, granularity: Granularity): string {
  const date = utc(ymd);
  return granularity === 'month'
    ? date.toLocaleDateString('fr-FR', { timeZone: 'UTC', month: 'short', year: '2-digit' })
    : date.toLocaleDateString('fr-FR', { timeZone: 'UTC', day: 'numeric', month: 'short' });
}

/** Tranche complète : « mer. 14 oct. 2026 », « 8 – 14 oct. 2026 », « octobre 2026 » */
export function bucketLabel(ymd: string, granularity: Granularity): string {
  const date = utc(ymd);
  if (granularity === 'month') {
    return date.toLocaleDateString('fr-FR', { timeZone: 'UTC', month: 'long', year: 'numeric' });
  }
  if (granularity === 'day') {
    return date.toLocaleDateString('fr-FR', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }
  return rangeLabel(date, addDays(date, 6));
}

/** « 15 sept. – 14 oct. 2026 » (dernier jour inclus) */
export function rangeLabel(start: Date, lastDay: Date): string {
  const sameYear = start.getUTCFullYear() === lastDay.getUTCFullYear();
  const sameMonth = sameYear && start.getUTCMonth() === lastDay.getUTCMonth();
  const first = start.toLocaleDateString('fr-FR', {
    timeZone: 'UTC',
    day: 'numeric',
    ...(sameMonth ? {} : { month: 'short' }),
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const last = lastDay.toLocaleDateString('fr-FR', { timeZone: 'UTC', day: 'numeric', month: 'short', year: 'numeric' });
  return `${first} – ${last}`;
}

/** Période couverte par une liste de débuts de tranches, `end` exclu */
export function spanLabel(firstStart: string, endExclusive: string): string {
  return rangeLabel(utc(firstStart), addDays(utc(endExclusive), -1));
}
