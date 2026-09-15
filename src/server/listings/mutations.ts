import {
  LISTING_FILLABLE,
  LISTING_HOST_PROTECTED,
  listingAttributeEquivalent,
  phpTruthy,
  type Row,
} from './casts';

/**
 * Affectation des attributs de ListingController::store / update (sans accès base, testable).
 */

/** Tableau passé à Listing::create() dans store() ($request->x vaut null si absent). */
export function buildListingStoreAttributes(data: Row, userId: number, now: string): Row {
  const value = (key: string) => data[key] ?? null;
  // $request->x ?: null
  const truthyOrNull = (key: string) => (phpTruthy(data[key]) ? data[key] : null);

  return {
    user_id: userId,
    status: 'pending',
    rental_frequency: value('rental_frequency'),
    space_type: value('space_type'),
    full_address: value('full_address'),
    street: value('street'),
    city: value('city'),
    postal_code: value('postal_code'),
    mrc: value('mrc'),
    county: value('county'),
    province: data.province ?? 'QC',
    country: data.country ?? 'CA',
    capacity: value('capacity'),
    adults: value('adults'),
    bathrooms: data.bathrooms ?? 1,
    bedrooms_data: value('bedrooms_data'),
    open_areas_data: value('open_areas_data'),
    amenities: value('amenities'),
    expectations: value('expectations'),
    permissions: value('permissions'),
    title: value('title'),
    subtitle: value('subtitle'),
    description: value('description'),
    about_chalet: value('about_chalet'),
    host_availability: value('host_availability'),
    neighborhood: value('neighborhood'),
    transport: value('transport'),
    other_info: value('other_info'),
    reservation_mode: data.reservation_mode ?? 'request',
    arrival_time: value('arrival_time'),
    departure_time: value('departure_time'),
    min_age: data.min_age ?? 18,
    min_stay: value('min_stay'),
    max_stay: value('max_stay'),
    arrival_days: value('arrival_days'),
    departure_days: value('departure_days'),
    currency: data.currency ?? 'EUR',
    base_price: value('base_price'),
    weekend_price: truthyOrNull('weekend_price'),
    weekly_price: truthyOrNull('weekly_price'),
    monthly_price: truthyOrNull('monthly_price'),
    cleaning_fee: data.cleaning_fee ?? 0,
    security_deposit: data.security_deposit ?? 0,
    extra_guest_fee: truthyOrNull('extra_guest_fee'),
    pet_fee: truthyOrNull('pet_fee'),
    cancellation_policy: value('cancellation_policy'),
    tax_registration: value('tax_registration'),
    taxes_included: value('taxes_included'),
    accepted_local_laws: data.accepted_local_laws ?? false,
    wifi_speed: value('wifi_speed'),
    has_wifi: value('has_wifi'),
    checkin_method: value('checkin_method'),
    checkin_instructions: value('checkin_instructions'),
    phone_number: value('phone_number'),
    country_code: value('country_code'),
    signature_name: value('signature_name'),
    signed_at: phpTruthy(data.signed) ? now : null,
  };
}

/**
 * $listing->fill($request->except(['host_photo', 'chalet_photos', '_method'])) dans update() :
 * - filled : colonnes $fillable affectées (hors LISTING_HOST_PROTECTED), valeurs brutes ;
 * - dirty : celles qu'Eloquent considère modifiées (seules écrites en base) ;
 * - attributes : attributs du modèle en mémoire (ligne + valeurs affectées), servant à la réponse.
 */
export function fillListingForUpdate(data: Row, listing: Row): { filled: Row; dirty: Row; attributes: Row } {
  const filled: Row = {};
  for (const [key, value] of Object.entries(data)) {
    if (key === 'host_photo' || key === 'chalet_photos' || key === '_method') {
      continue;
    }
    if (LISTING_FILLABLE.has(key) && !LISTING_HOST_PROTECTED.has(key)) {
      filled[key] = value;
    }
  }

  const dirty: Row = {};
  for (const [key, value] of Object.entries(filled)) {
    if (!listingAttributeEquivalent(key, value, listing[key])) {
      dirty[key] = value;
    }
  }

  return { filled, dirty, attributes: { ...listing, ...filled } };
}
