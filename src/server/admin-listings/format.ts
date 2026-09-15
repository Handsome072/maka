import { fullName } from '@/server/auth';
import { carbonJson, decimal } from '@/server/format';
import { notFound } from '@/server/http';
import { photoUrl } from '@/server/storage';
import { db, must } from '@/server/supabase';

export type AdminListingRow = {
  id: number;
  user_id: number;
  status: string;
  title: string | null;
  city: string | null;
  created_at: string | null;
  updated_at: string | null;
  host_photo_path: string | null;
  photos: Array<{ id: number; path: string; order: number }> | null;
  user: { id: number; first_name: string; last_name: string; email: string } | null;
  [column: string]: any;
};

/** Listing::with(['photos', 'user']) */
export const ADMIN_LISTING_SELECT =
  '*,photos:listing_photos!listing_photos_listing_id_fkey(id,path,order),user:users!listings_user_id_fkey(id,first_name,last_name,email)';

/**
 * Cast Eloquent 'array' (json_decode(…, true) puis json_encode) : un objet vide ou indexé 0..n-1
 * devient une liste PHP et ressort en tableau JSON.
 */
export function phpArrayCast(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(phpArrayCast);
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.every(([key], index) => key === String(index))) {
      return entries.map(([, item]) => phpArrayCast(item));
    }
    return Object.fromEntries(entries.map(([key, item]) => [key, phpArrayCast(item)]));
  }
  return value;
}

/** Relation photos() : ->orderBy('order') (id en départage). */
function sortedPhotos(photos: AdminListingRow['photos']) {
  return [...(photos ?? [])].sort((a, b) => a.order - b.order || a.id - b.id);
}

/** AdminListingController::formatAdminListing */
export function formatAdminListing(listing: AdminListingRow) {
  const user = listing.user;

  return {
    id: listing.id,
    status: listing.status,
    title: listing.title,
    subtitle: listing.subtitle,
    city: listing.city,
    province: listing.province,
    country: listing.country,
    space_type: listing.space_type,
    capacity: listing.capacity,
    bathrooms: listing.bathrooms,
    base_price: decimal(listing.base_price, 2),
    currency: listing.currency,
    cancellation_policy: listing.cancellation_policy,
    reservation_mode: listing.reservation_mode,
    host_photo_url: photoUrl(listing.host_photo_path),
    photos: sortedPhotos(listing.photos).map((p) => ({
      id: p.id,
      url: photoUrl(p.path),
      order: p.order,
    })),
    created_at: carbonJson(listing.created_at),
    updated_at: carbonJson(listing.updated_at),
    host: user
      ? {
          id: user.id,
          name: fullName(user),
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        }
      : null,
    rental_frequency: listing.rental_frequency,
    full_address: listing.full_address,
    street: listing.street,
    postal_code: listing.postal_code,
    mrc: listing.mrc,
    county: listing.county,
    adults: listing.adults,
    bedrooms_data: phpArrayCast(listing.bedrooms_data),
    open_areas_data: phpArrayCast(listing.open_areas_data),
    amenities: phpArrayCast(listing.amenities),
    expectations: phpArrayCast(listing.expectations),
    permissions: phpArrayCast(listing.permissions),
    description: listing.description,
    about_chalet: listing.about_chalet,
    host_availability: listing.host_availability,
    neighborhood: listing.neighborhood,
    transport: listing.transport,
    other_info: listing.other_info,
    arrival_time: listing.arrival_time,
    departure_time: listing.departure_time,
    min_age: listing.min_age,
    min_stay: listing.min_stay,
    max_stay: listing.max_stay,
    arrival_days: phpArrayCast(listing.arrival_days),
    departure_days: phpArrayCast(listing.departure_days),
    weekend_price: decimal(listing.weekend_price, 2),
    weekly_price: decimal(listing.weekly_price, 2),
    monthly_price: decimal(listing.monthly_price, 2),
    cleaning_fee: decimal(listing.cleaning_fee, 2),
    security_deposit: decimal(listing.security_deposit, 2),
    extra_guest_fee: decimal(listing.extra_guest_fee, 2),
    pet_fee: decimal(listing.pet_fee, 2),
    tax_registration: phpArrayCast(listing.tax_registration),
    accepted_local_laws: listing.accepted_local_laws,
    wifi_speed: listing.wifi_speed,
    has_wifi: listing.has_wifi,
    checkin_method: listing.checkin_method,
    checkin_instructions: listing.checkin_instructions,
    phone_number: listing.phone_number,
    country_code: listing.country_code,
    rejection_reason: listing.rejection_reason ?? null,
  };
}

/**
 * ORDER BY created_at DESC (NULL en dernier comme MySQL).
 * MySQL renvoie les ex-æquo dans un ordre arbitraire : départage déterministe par id décroissant (le plus récent d'abord).
 */
export function compareCreatedAtDesc(a: AdminListingRow, b: AdminListingRow): number {
  const ta = a.created_at ? Date.parse(a.created_at) : null;
  const tb = b.created_at ? Date.parse(b.created_at) : null;
  if (ta !== tb) {
    if (ta === null) return 1;
    if (tb === null) return -1;
    return tb - ta;
  }
  return b.id - a.id;
}

/** Valeur de $request->reason telle qu'Eloquent l'enregistrerait dans une colonne texte. */
export function reasonColumnValue(value: unknown): string | null {
  if (value === null || value === undefined || typeof value === 'string') {
    return (value as string | null | undefined) ?? null;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  // Laravel : « Array to string conversion » → 500
  throw new Error('rejection_reason : valeur non scalaire');
}

type Transition = {
  from: string;
  to: string;
  refusal: string;
  success: string;
  /** Fournie pour reject/suspend : rejection_reason => $request->reason */
  reason?: () => Promise<unknown>;
};

/** approve / reject / suspend : findOrFail → contrôle du statut (422) → update → load(['photos', 'user']). */
export async function transitionListing(id: number, t: Transition) {
  const current = must(await db().from('listings').select('id,status').eq('id', id).maybeSingle()) as
    | { id: number; status: string }
    | null;
  if (!current) {
    notFound('Listing', id);
  }

  if (current.status !== t.from) {
    return { status: 422, body: { message: t.refusal } };
  }

  const changes: Record<string, unknown> = { status: t.to };
  if (t.reason) {
    changes.rejection_reason = reasonColumnValue(await t.reason());
  }

  const updated = must(
    await db().from('listings').update(changes).eq('id', id).select(ADMIN_LISTING_SELECT).maybeSingle(),
  ) as AdminListingRow | null;
  if (!updated) {
    notFound('Listing', id);
  }

  return { status: 200, body: { message: t.success, listing: formatAdminListing(updated) } };
}
