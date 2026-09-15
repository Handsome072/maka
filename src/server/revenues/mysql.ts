/**
 * Conversions implicites de PHP et de MySQL (collation utf8mb4_unicode_ci) reproduites en TypeScript,
 * pour que les filtres calculés côté serveur renvoient les mêmes lignes que l'ancienne API Laravel.
 * (Générique : utilisé aussi par src/server/admin-listings.)
 */

const NUMERIC_PREFIX = /^[ \t\n\r\v\f]*[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/;

function numericPrefix(value: string): number {
  const match = value.match(NUMERIC_PREFIX);
  return match ? Number(match[0]) : 0;
}

/** $request->input($key, $default) : le défaut ne sert que si la clé est absente (une valeur null est gardée). */
export function inputValue(data: Record<string, unknown>, key: string, fallback: unknown = null): unknown {
  return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : fallback;
}

/** Vérité PHP (if ($value)) : null, false, 0, "" et "0" sont faux. */
export function phpTruthy(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return !(value === null || value === undefined || value === false || value === 0 || value === '' || value === '0');
}

/** (int) $value */
export function phpInt(value: unknown): number {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  const n = typeof value === 'number' ? value : numericPrefix(String(value));
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}

/**
 * Valeur liée comparée par MySQL à une colonne numérique (`id = '12abc'`) : la chaîne est convertie
 * en nombre (préfixe numérique, sinon 0). null : aucune ligne ne correspond.
 */
export function mysqlNumber(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'boolean') {
    return value ? 1 : 0; // Connection::prepareBindings convertit les booléens en entiers
  }
  if (typeof value === 'string') {
    return numericPrefix(value);
  }
  return null;
}

/** whereYear($col, $value) : année entière comparable, ou null si MySQL ne renverrait aucune ligne. */
export function mysqlYear(value: unknown): number | null {
  const n = mysqlNumber(value);
  return n !== null && Number.isInteger(n) && n >= 1 && n <= 9999 ? n : null;
}

/** whereMonth($col, $value) passe par sprintf('%02d') : mois 1–12, ou null si aucune ligne ne correspond. */
export function mysqlMonth(value: unknown): number | null {
  const m = phpInt(value);
  return m >= 1 && m <= 12 ? m : null;
}

export type Period = { from: string; to: string | null };

const pad = (value: number, width: number) => String(value).padStart(width, '0');

/**
 * whereYear($col, $year) [+ whereMonth($col, $month)] traduits en bornes [from, to) (UTC).
 * false : la condition MySQL ne peut être vraie pour aucune ligne.
 */
export function periodBounds(year: unknown, month: unknown, kind: 'date' | 'timestamp', withMonth: boolean): Period | false {
  const y = mysqlYear(year);
  if (y === null) {
    return false;
  }
  const suffix = kind === 'timestamp' ? 'T00:00:00Z' : '';
  const nextYear = y < 9999 ? `${pad(y + 1, 4)}-01-01${suffix}` : null;

  if (!withMonth) {
    return { from: `${pad(y, 4)}-01-01${suffix}`, to: nextYear };
  }
  const m = mysqlMonth(month);
  if (m === null) {
    return false;
  }
  return {
    from: `${pad(y, 4)}-${pad(m, 2)}-01${suffix}`,
    to: m === 12 ? nextYear : `${pad(y, 4)}-${pad(m + 1, 2)}-01${suffix}`,
  };
}

/** Applique des bornes de période à une requête supabase-js. */
export function applyPeriod<Q extends { gte: (c: string, v: string) => Q; lt: (c: string, v: string) => Q }>(
  query: Q,
  column: string,
  period: Period,
): Q {
  let q = query.gte(column, period.from);
  if (period.to) {
    q = q.lt(column, period.to);
  }
  return q;
}

// ─── Collation utf8mb4_unicode_ci ─────────────────────────────────────────────

// Sensibilité « base » : ni la casse ni les accents ne comptent, comme utf8mb4_unicode_ci
const collator = new Intl.Collator('und', { sensitivity: 'base' });

// PAD SPACE : les espaces finaux sont ignorés par = et ORDER BY (pas par LIKE)
const unpad = (value: string) => value.replace(/ +$/, '');

/** `col = ?` sur une colonne texte (null ne correspond jamais). */
export function mysqlEquals(column: unknown, value: unknown): boolean {
  if (column === null || column === undefined || value === null || value === undefined) {
    return false;
  }
  return collator.compare(unpad(String(column)), unpad(String(value))) === 0;
}

/** ORDER BY col ASC sur une colonne texte (NULL en premier). */
export function mysqlCompare(a: string | null | undefined, b: string | null | undefined): number {
  if (a === null || a === undefined) {
    return b === null || b === undefined ? 0 : -1;
  }
  if (b === null || b === undefined) {
    return 1;
  }
  return collator.compare(unpad(a), unpad(b));
}

/** Pliage caractère par caractère (casse et accents) utilisé pour LIKE. */
function fold(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/\p{M}+/gu, '');
}

const escapeRegex = (char: string) => char.replace(/[\\^$.*+?()[\]{}|/]/g, '\\$&');

/** `col LIKE ?` : % et _ jokers, \ caractère d'échappement, insensible à la casse et aux accents. */
export function mysqlLike(column: unknown, pattern: string): boolean {
  if (column === null || column === undefined) {
    return false;
  }
  const chars = Array.from(fold(pattern));
  let source = '';
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (char === '\\' && i + 1 < chars.length) {
      source += escapeRegex(chars[++i]);
    } else if (char === '%') {
      if (!source.endsWith('.*') || source.endsWith('\\.*')) {
        source += '.*';
      }
    } else if (char === '_') {
      source += '.';
    } else {
      source += escapeRegex(char);
    }
  }
  return new RegExp(`^${source}$`, 'su').test(fold(String(column)));
}
