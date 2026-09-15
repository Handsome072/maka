/**
 * Reproduit la sérialisation JSON de Laravel/Carbon/PHP pour que les réponses restent identiques
 * à celles de l'ancienne API (application en UTC).
 *
 * Postgres (via PostgREST) renvoie les horodatages sous la forme "2026-03-03T10:00:00+00:00",
 * les dates "2026-03-07", les numeric en nombre JSON.
 */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (value: number, width = 2) => String(value).padStart(width, '0');

function toDate(value: string | Date): Date {
  if (value instanceof Date) {
    return value;
  }
  // Une date seule ("2026-03-07") est interprétée à minuit UTC, comme Carbon avec APP_TIMEZONE=UTC
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
}

function ymdParts(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function timeParts(d: Date): string {
  return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

/** Sérialisation JSON d'un Carbon / ->toISOString() : "2026-03-03T10:00:00.000000Z" */
export function carbonJson(value: string | Date | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  const d = toDate(value);
  return `${ymdParts(d)}T${timeParts(d)}.${pad(d.getUTCMilliseconds(), 3)}000Z`;
}

/** ->toIso8601String() : "2026-03-03T10:00:00+00:00" */
export function iso8601(value: string | Date | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  const d = toDate(value);
  return `${ymdParts(d)}T${timeParts(d)}+00:00`;
}

/** ->format('Y-m-d') / ->toDateString() */
export function ymd(value: string | Date | null | undefined): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  return ymdParts(toDate(value));
}

/** ->format('F Y') : "September 2026" */
export function monthYear(value: string | Date): string {
  const d = toDate(value);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Carbon::now()->year etc. */
export function nowUtc(): Date {
  return new Date();
}

/** Début de la journée UTC ("today" des règles de validation Laravel). */
export function todayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Cast Eloquent 'decimal:N' : chaîne avec N décimales ("150.00"), null conservé. */
export function decimal(value: number | string | null | undefined, places: number): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return round(Number(value), places).toFixed(places);
}

/**
 * Colonne DECIMAL non castée lue par PDO MySQL : chaîne avec l'échelle de la colonne
 * (ex. SUM(net_amount) → "1234.50").
 */
export const rawDecimal = decimal;

/** (float) $value */
export function float(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

/** round() de PHP : arrondi « half away from zero », sans erreur binaire sur 1.005. */
export function round(value: number, precision = 0): number {
  if (!Number.isFinite(value)) {
    return value;
  }
  const sign = value < 0 ? -1 : 1;
  const shifted = Math.round(Number(`${Math.abs(value)}e${precision}`));
  const result = sign * Number(`${shifted}e-${precision}`);
  return Object.is(result, -0) ? 0 : result;
}

/** Nombre de jours entiers entre deux dates (Carbon diffInDays, valeur absolue). */
export function diffInDays(from: string | Date, to: string | Date): number {
  const ms = Math.abs(toDate(to).getTime() - toDate(from).getTime());
  return Math.floor(ms / 86_400_000);
}

/** Moyenne d'une colonne comme Collection::avg() (ignore null), null si vide. */
export function avg(values: Array<number | string | null | undefined>): number | null {
  const numbers = values.filter((v) => v !== null && v !== undefined).map(Number);
  if (numbers.length === 0) {
    return null;
  }
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}
