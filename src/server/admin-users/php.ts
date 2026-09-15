import { avg, round } from '@/server/format';

/**
 * Comportements PHP / MySQL reproduits pour AdminHostController et AdminClientController
 * (formatDate, formatCurrency, number_format, agrégats MySQL, DateTime::diff, comparaisons utf8mb4_unicode_ci).
 */

type DateInput = string | Date;

const FR_MONTHS = ['jan.', 'fev.', 'mar.', 'avr.', 'mai', 'jun.', 'jul.', 'aou.', 'sep.', 'oct.', 'nov.', 'dec.'];

function toDate(value: DateInput | null | undefined): Date {
  if (value === null || value === undefined) {
    // PHP : ->day sur null lève une ErrorException → 500, comme Laravel
    throw new Error('admin-users: date attendue, null reçu');
  }
  if (value instanceof Date) {
    return value;
  }
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/** formatDate() des contrôleurs : sprintf('%02d %s %d', day, mois abrégé, year) → "03 mar. 2026" (UTC). */
export function frDate(value: DateInput | null | undefined): string {
  const d = toDate(value);
  return `${pad2(d.getUTCDate())} ${FR_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** ->format('H:i') */
export function hourMinute(value: DateInput | null | undefined): string {
  const d = toDate(value);
  return `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}`;
}

/** (int) ->format('Ymd') */
export function ymdInt(value: DateInput | null | undefined): number {
  const d = toDate(value);
  return d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
}

/** ->isCurrentMonth() (UTC) */
export function isCurrentMonth(value: DateInput | null | undefined, now: Date): boolean {
  const d = toDate(value);
  return d.getUTCFullYear() === now.getUTCFullYear() && d.getUTCMonth() === now.getUTCMonth();
}

/** trim() de PHP (espaces, \t, \n, \r, \0, \x0B uniquement). */
export function phpTrim(value: string): string {
  return value.replace(/^[ \t\n\r\0\x0B]+|[ \t\n\r\0\x0B]+$/g, '');
}

/** trim("{$first} {$last}") */
export function personName(first: string | null | undefined, last: string | null | undefined): string {
  return phpTrim(`${first ?? ''} ${last ?? ''}`);
}

/** Vérité PHP d'une valeur de colonne scalaire ("" et "0" sont faux). */
export function truthy(value: unknown): boolean {
  if (value === null || value === undefined || value === false) {
    return false;
  }
  if (typeof value === 'string') {
    return value !== '' && value !== '0';
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return true;
}

function firstCharacter(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  return String.fromCodePoint(value.codePointAt(0) as number);
}

/**
 * strtoupper(substr($first, 0, 1) . substr($last, 0, 1)).
 * Identique pour une initiale ASCII. PHP coupe un caractère multi-octet (É…) et json_encode échoue alors (500) :
 * ici on garde le caractère entier en majuscule.
 */
export function initials(first: string | null | undefined, last: string | null | undefined): string {
  return (firstCharacter(first) + firstCharacter(last)).toUpperCase();
}

/** $phone ? ($phone_country_code ?? '') . ' ' . $phone : $fallback */
export function phoneLabel<F>(phone: string | null | undefined, countryCode: string | null | undefined, fallback: F): string | F {
  return truthy(phone) ? `${countryCode ?? ''} ${phone}` : fallback;
}

/** number_format($value, 0, ',', ' ') */
export function numberFormat0(value: number | string): string {
  const rounded = round(Number(value), 0);
  const negative = rounded < 0;
  const digits = Math.abs(rounded).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${negative ? '-' : ''}${digits}`;
}

/** formatCurrency(float $amount) des contrôleurs. */
export function formatCurrency(amount: number | string): string {
  const value = Number(amount);
  if (value === 0) {
    return '0 €';
  }
  return `${numberFormat0(value)} €`;
}

/**
 * $value ? number_format($value, 0, ',', ' ') . ' €' : '0 €' sur une colonne decimal:2.
 * (En PHP "0.00" est vrai mais donne aussi "0 €".)
 */
export function euroOrZero(value: number | string | null | undefined): string {
  return value === null || value === undefined ? '0 €' : `${numberFormat0(value)} €`;
}

/** str_pad($id, $length, '0', STR_PAD_LEFT) */
export function padId(id: number, length: number): string {
  return String(id).padStart(length, '0');
}

/** rand($min, $max) */
export function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** $map[$key] sans tomber sur les propriétés du prototype JS. */
export function lookup(map: Record<string, string>, key: string | null | undefined): string | undefined {
  return key !== null && key !== undefined && Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined;
}

// ─── Agrégats ─────────────────────────────────────────────────────────────────

/**
 * Builder::sum() sur une colonne DECIMAL(10,2) : somme exacte MySQL (chaîne) puis `?: 0`,
 * renvoyée comme le ferait (float) sur cette chaîne.
 */
export function decimalSum(values: Array<number | string | null | undefined>): number {
  let cents = 0;
  for (const value of values) {
    if (value !== null && value !== undefined) {
      cents += Math.round(Number(value) * 100);
    }
  }
  return cents / 100;
}

/** Collection::sum() : additions flottantes successives, null compte pour 0. */
export function floatSum(values: Array<number | string | null | undefined>): number {
  return values.reduce<number>((sum, value) => sum + (value === null || value === undefined ? 0 : Number(value)), 0);
}

/**
 * Builder::avg('rating') sur DECIMAL(2,1) : MySQL renvoie une moyenne exacte à 5 décimales
 * (échelle 1 + div_precision_increment 4, arrondie), puis `$avg ? round($avg, 1) : 0`.
 */
export function mysqlAvgRating(ratings: Array<number | string | null | undefined>): number {
  const tenths = ratings.filter((v) => v !== null && v !== undefined).map((v) => Math.round(Number(v) * 10));
  if (tenths.length === 0) {
    return 0;
  }
  const n = tenths.length;
  const scaled = tenths.reduce((sum, t) => sum + t, 0) * 10000; // moyenne × 10^5
  const avg5 = Math.floor((2 * scaled + n) / (2 * n)); // arrondi au plus proche, demi vers le haut
  return round(avg5 / 100000, 1);
}

/** Collection::avg('rating') (valeurs castées decimal:1) puis `$avg ? round($avg, 1) : 0`. */
export function collectionAvgRating(ratings: Array<number | string | null | undefined>): number {
  const value = avg(ratings);
  return value ? round(value, 1) : 0;
}

// ─── DateTime::diff (timelib, fuseau UTC) ─────────────────────────────────────

function rangeLimit(start: number, end: number, adj: number, a: number, b: number): [number, number] {
  if (a < start) {
    const k = Math.trunc((start - a - 1) / adj) + 1;
    b -= k;
    a += adj * k;
  }
  if (a >= end) {
    const k = Math.trunc(a / adj);
    b += k;
    a -= adj * k;
  }
  return [a, b];
}

const daysInMonth = (year: number, month: number) => new Date(Date.UTC(year, month, 0)).getUTCDate();

function utcParts(d: Date): number[] {
  return [
    d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(),
    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds() * 1000,
  ];
}

/** $from->diff($to) : composantes y, m, d de l'intervalle (vérifié contre PHP sur 40 000 paires de dates). */
export function phpDiff(from: DateInput, to: DateInput): { y: number; m: number; d: number } {
  let one = utcParts(toDate(from));
  let two = utcParts(toDate(to));
  let invert = false;
  for (let k = 0; k < 7; k++) {
    if (one[k] !== two[k]) {
      if (one[k] > two[k]) {
        [one, two] = [two, one];
        invert = true;
      }
      break;
    }
  }

  let [y, m, d, h, i, s, us] = two.map((value, k) => value - one[k]);
  if (us < 0) {
    us += 1_000_000;
    s -= 1;
  }
  [s, i] = rangeLimit(0, 60, 60, s, i);
  [i, h] = rangeLimit(0, 60, 60, i, h);
  [h, d] = rangeLimit(0, 24, 24, h, d);
  [m, y] = rangeLimit(0, 12, 12, m, y);

  const base = invert ? one : two;
  let year = base[0];
  let month = base[1];
  if (!invert) {
    while (d < 0) {
      month -= 1;
      if (month < 1) {
        month += 12;
        year -= 1;
      }
      d += daysInMonth(year, month);
      m -= 1;
    }
  } else {
    while (d < 0) {
      d += daysInMonth(year, month);
      m -= 1;
      month += 1;
      if (month > 12) {
        month -= 12;
        year += 1;
      }
    }
  }
  [m, y] = rangeLimit(0, 12, 12, m, y);
  return { y, m, d };
}

/** Bloc « Account age » d'AdminHostController::show. */
export function accountAge(createdAt: DateInput | null | undefined, now: Date): string {
  const diff = phpDiff(toDate(createdAt), now);
  const parts: string[] = [];
  if (diff.y > 0) parts.push(`${diff.y} an${diff.y > 1 ? 's' : ''}`);
  if (diff.m > 0) parts.push(`${diff.m} mois`);
  if (parts.length === 0) parts.push(`${diff.d} jours`);
  return parts.join(', ');
}

// ─── Comparaisons MySQL (collation utf8mb4_unicode_ci) ────────────────────────

/** Approximation de la collation : insensible à la casse et aux accents. */
function fold(value: string): string {
  return value.normalize('NFD').replace(/\p{Mn}/gu, '').toLowerCase();
}

/** `colonne = ?` sur une chaîne (PAD SPACE : espaces finaux ignorés). */
export function ciEquals(column: string | null | undefined, value: unknown): boolean {
  if (column === null || column === undefined || value === null || value === undefined) {
    return false;
  }
  return fold(column).replace(/ +$/, '') === fold(String(value)).replace(/ +$/, '');
}

const escapeRegExp = (c: string) => c.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');

/** `colonne LIKE ?` (% et _ jokers, \ échappement). */
export function mysqlLike(column: string | null | undefined, pattern: string): boolean {
  if (column === null || column === undefined) {
    return false;
  }
  const chars = [...fold(pattern)];
  let source = '';
  for (let k = 0; k < chars.length; k++) {
    const c = chars[k];
    if (c === '\\' && k + 1 < chars.length) {
      source += escapeRegExp(chars[++k]);
    } else if (c === '%') {
      source += '.*';
    } else if (c === '_') {
      source += '.';
    } else {
      source += escapeRegExp(c);
    }
  }
  return new RegExp(`^${source}$`, 'su').test(fold(column));
}

/** Valeur numérique d'une chaîne comparée à une colonne entière par MySQL ("12abc" → 12, "abc" → 0). */
export function mysqlNumber(value: unknown): number {
  const match = String(value ?? '').match(/^\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)/);
  return match ? Number(match[1]) : 0;
}

/** where(first_name like %s% or last_name like %s% or email like %s% or id = s) des deux index. */
export function matchesSearch(
  user: { id: number; first_name: string | null; last_name: string | null; email: string | null },
  search: unknown,
): boolean {
  const pattern = `%${String(search)}%`;
  return (
    mysqlLike(user.first_name, pattern) ||
    mysqlLike(user.last_name, pattern) ||
    mysqlLike(user.email, pattern) ||
    user.id === mysqlNumber(search)
  );
}

// ─── Tables de correspondance des contrôleurs ─────────────────────────────────

export const LANG_MAP: Record<string, string> = {
  fr: 'Francais', en: 'Anglais', es: 'Espagnol',
  de: 'Allemand', it: 'Italien', pt: 'Portugais',
  nl: 'Neerlandais', ar: 'Arabe',
};

/** $langMap[$user->preferred_language ?? 'fr'] ?? 'Francais' */
export function languageLabel(preferred: string | null | undefined): string {
  return lookup(LANG_MAP, preferred ?? 'fr') ?? 'Francais';
}

export const RESERVATION_STATUS: Record<string, string> = {
  pending: 'EN ATTENTE',
  confirmed: 'CONFIRMEE',
  active: 'EN COURS',
  completed: 'TERMINEE',
  cancelled: 'ANNULEE',
};
