import { carbonJson, decimal, ymd } from '@/server/format';

/**
 * Émulation des modèles Eloquent Listing et Reservation : ordre des colonnes MySQL, $casts,
 * comparaison « dirty » d'Eloquent et sémantique PHP (vérité, json_decode/json_encode).
 */

export type Row = Record<string, any>;

// ─── Sémantique PHP ─────────────────────────────────────────────────────────────

/** Vérité PHP : null, false, 0, 0.0, "", "0" et [] sont faux. */
export function phpTruthy(value: unknown): boolean {
  if (value === null || value === undefined || value === false) {
    return false;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    return value !== '' && value !== '0';
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'object' && !(value instanceof Blob)) {
    return Object.keys(value).length > 0;
  }
  return true;
}

/** is_numeric() de PHP 8 (espaces autour autorisés). */
export function isNumericPhp(value: unknown): boolean {
  if (typeof value === 'number') {
    return true;
  }
  return typeof value === 'string' && /^[ \t\n\r\v\f]*[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?[ \t\n\r\v\f]*$/.test(value);
}

/**
 * Aller-retour json_decode($json, true) / json_encode de PHP : un objet vide devient [],
 * un objet aux clés "0".."n-1" devient une liste.
 */
export function phpJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(phpJson);
  }
  if (value !== null && typeof value === 'object' && !(value instanceof Blob)) {
    const entries = Object.entries(value);
    if (entries.every(([key], index) => key === String(index))) {
      return entries.map(([, item]) => phpJson(item));
    }
    return Object.fromEntries(entries.map(([key, item]) => [key, phpJson(item)]));
  }
  return value;
}

/** freshTimestamp() d'Eloquent : maintenant, tronqué à la seconde (format 'Y-m-d H:i:s'). */
export function nowTimestamp(): string {
  const now = new Date();
  now.setUTCMilliseconds(0);
  return now.toISOString();
}

/** MySQL convertit une chaîne en nombre via son préfixe numérique ("12abc" → 12, "abc" → 0). */
export function mysqlNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }
  const match = String(value ?? '').match(/^\s*[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?/);
  return match ? Number(match[0]) : 0;
}

// ─── Listing ───────────────────────────────────────────────────────────────────

/** Colonnes de la table listings dans l'ordre de MySQL (SELECT *). */
export const LISTING_COLUMNS = [
  'id', 'user_id', 'status', 'rejection_reason', 'rental_frequency', 'space_type', 'full_address', 'street',
  'city', 'postal_code', 'mrc', 'county', 'province', 'country', 'latitude', 'longitude', 'capacity', 'adults',
  'bathrooms', 'bedrooms_data', 'open_areas_data', 'amenities', 'expectations', 'permissions', 'title',
  'subtitle', 'description', 'about_chalet', 'host_availability', 'neighborhood', 'transport', 'other_info',
  'reservation_mode', 'arrival_time', 'departure_time', 'min_age', 'min_stay', 'max_stay', 'arrival_days',
  'departure_days', 'currency', 'base_price', 'weekend_price', 'weekly_price', 'monthly_price', 'cleaning_fee',
  'security_deposit', 'extra_guest_fee', 'pet_fee', 'cancellation_policy', 'tax_registration', 'taxes_included',
  'accepted_local_laws', 'wifi_speed', 'has_wifi', 'checkin_method', 'checkin_instructions', 'phone_number',
  'country_code', 'signature_name', 'signed_at', 'host_photo_path', 'created_at', 'updated_at',
] as const;

/** Listing::$fillable */
export const LISTING_FILLABLE = new Set([
  'user_id', 'status', 'rejection_reason', 'rental_frequency', 'space_type', 'full_address', 'street', 'city',
  'postal_code', 'mrc', 'county', 'province', 'country', 'latitude', 'longitude', 'capacity', 'adults',
  'bathrooms', 'bedrooms_data', 'open_areas_data', 'amenities', 'expectations', 'permissions', 'title',
  'subtitle', 'description', 'about_chalet', 'host_availability', 'neighborhood', 'transport', 'other_info',
  'reservation_mode', 'arrival_time', 'departure_time', 'min_age', 'min_stay', 'max_stay', 'arrival_days',
  'departure_days', 'currency', 'base_price', 'weekend_price', 'weekly_price', 'monthly_price', 'cleaning_fee',
  'security_deposit', 'extra_guest_fee', 'pet_fee', 'cancellation_policy', 'tax_registration', 'taxes_included',
  'accepted_local_laws', 'wifi_speed', 'has_wifi', 'checkin_method', 'checkin_instructions', 'phone_number',
  'country_code', 'signature_name', 'signed_at', 'host_photo_path',
]);

/**
 * Colonnes fillable qu'un hôte ne peut pas modifier via PUT /listings/{id}
 * (Laravel les acceptait : auto-approbation, transfert d'annonce…). Le frontend ne les envoie jamais.
 */
export const LISTING_HOST_PROTECTED = new Set(['user_id', 'status', 'rejection_reason', 'host_photo_path', 'signed_at']);

const LISTING_JSON = new Set([
  'bedrooms_data', 'open_areas_data', 'amenities', 'expectations', 'permissions', 'arrival_days', 'departure_days',
  'tax_registration',
]);
const LISTING_BOOLEAN = new Set(['taxes_included', 'accepted_local_laws', 'has_wifi']);
const LISTING_DECIMAL: Record<string, number> = {
  base_price: 2, weekend_price: 2, weekly_price: 2, monthly_price: 2, cleaning_fee: 2, security_deposit: 2,
  extra_guest_fee: 2, pet_fee: 2, latitude: 7, longitude: 7,
};
const LISTING_DATETIME = new Set(['signed_at', 'created_at', 'updated_at']);

/** Lecture d'un attribut Listing avec ses $casts (valeur venant de la base ou d'une saisie en mémoire). */
export function castListingAttribute(key: string, value: unknown): unknown {
  if (value === null || value === undefined) {
    return null;
  }
  if (LISTING_JSON.has(key)) {
    return phpJson(value);
  }
  if (LISTING_BOOLEAN.has(key)) {
    return phpTruthy(value);
  }
  if (key in LISTING_DECIMAL) {
    return decimal(value as number | string, LISTING_DECIMAL[key]);
  }
  if (LISTING_DATETIME.has(key)) {
    return carbonJson(value as string);
  }
  return value;
}

/** Valeur envoyée à la base pour une colonne listings (les colonnes JSON reçoivent ce que PHP aurait encodé). */
export function listingDbValue(key: string, value: unknown): unknown {
  if (value === undefined) {
    return null;
  }
  return LISTING_JSON.has(key) && value !== null ? phpJson(value) : value;
}

export function listingDbValues(attributes: Row): Row {
  return Object.fromEntries(Object.entries(attributes).map(([key, value]) => [key, listingDbValue(key, value)]));
}

/** $listing->toArray() : toutes les colonnes présentes, dans l'ordre MySQL, casts appliqués. */
export function listingToArray(row: Row): Row {
  const out: Row = {};
  for (const key of LISTING_COLUMNS) {
    if (key in row) {
      out[key] = castListingAttribute(key, row[key]);
    }
  }
  return out;
}

/**
 * HasAttributes::originalIsEquivalent() pour Listing : `next` est la valeur saisie (avant cast),
 * `original` la valeur lue en base.
 */
export function listingAttributeEquivalent(key: string, next: unknown, original: unknown): boolean {
  if (original === undefined) {
    return false;
  }
  if (next === original) {
    return true;
  }
  if (next === null || next === undefined) {
    return false;
  }
  if (LISTING_DATETIME.has(key)) {
    return carbonJson(next as string) === carbonJson(original as string);
  }
  if (LISTING_JSON.has(key)) {
    // Comparaison PHP === sur les tableaux décodés : mêmes clés, même ordre, mêmes types
    return original !== null && JSON.stringify(phpJson(next)) === JSON.stringify(phpJson(original));
  }
  if (LISTING_BOOLEAN.has(key)) {
    return original !== null && phpTruthy(next) === phpTruthy(original);
  }
  if (key in LISTING_DECIMAL) {
    if (!isNumericPhp(next)) {
      return false;
    }
    return original !== null && decimal(next as number | string, LISTING_DECIMAL[key]) === decimal(original as number | string, LISTING_DECIMAL[key]);
  }
  return isNumericPhp(next) && isNumericPhp(original) && String(next) === String(original);
}

// ─── Reservation ───────────────────────────────────────────────────────────────

/** Colonnes de la table reservations dans l'ordre de MySQL (SELECT *). */
export const RESERVATION_COLUMNS = [
  'id', 'guest_id', 'listing_id', 'check_in', 'check_out', 'guests_count', 'adults', 'children', 'infants', 'pets',
  'status', 'total_price', 'service_fee', 'cleaning_fee', 'nights_count', 'price_per_night', 'currency',
  'guest_message', 'cancellation_reason', 'created_at', 'updated_at',
] as const;

const RESERVATION_DATE = new Set(['check_in', 'check_out']);
const RESERVATION_INTEGER = new Set(['adults', 'children', 'infants', 'pets', 'nights_count']);
const RESERVATION_DECIMAL = new Set(['price_per_night', 'cleaning_fee', 'service_fee', 'total_price']);
const RESERVATION_DATETIME = new Set(['created_at', 'updated_at']);

export function castReservationAttribute(key: string, value: unknown): unknown {
  if (value === null || value === undefined) {
    return null;
  }
  if (RESERVATION_DATE.has(key)) {
    return carbonJson(ymd(value as string));
  }
  if (RESERVATION_INTEGER.has(key)) {
    return Math.trunc(Number(value));
  }
  if (RESERVATION_DECIMAL.has(key)) {
    return decimal(value as number | string, 2);
  }
  if (RESERVATION_DATETIME.has(key)) {
    return carbonJson(value as string);
  }
  return value;
}

/**
 * $reservation->toArray() : attributs (dans l'ordre `keys`, par défaut celui de MySQL) puis,
 * si `listing` est fourni (relation chargée), la clé listing.
 */
export function reservationToArray(
  attributes: Row,
  listing?: Row | null,
  keys: readonly string[] = RESERVATION_COLUMNS,
): Row {
  const out: Row = {};
  for (const key of keys) {
    if (key in attributes) {
      out[key] = castReservationAttribute(key, attributes[key]);
    }
  }
  if (listing !== undefined) {
    out.listing = listing ? listingToArray(listing) : null;
  }
  return out;
}
