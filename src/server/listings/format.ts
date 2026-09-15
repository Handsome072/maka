import { avg, carbonJson, decimal, round } from '@/server/format';
import { photoUrl, profilePhotoFullUrl } from '@/server/storage';
import { chunk, db, fetchAll, must } from '@/server/supabase';
import { castListingAttribute, phpJson, type Row } from './casts';

/**
 * ListingController::formatListing / formatListingDetail de Laravel.
 */

/** Colonnes des photos nécessaires à formatListing (embed : `photos:listing_photos(id, path, order)`). */
export const LISTING_PHOTO_COLUMNS = 'id, path, order';
export const LISTING_WITH_PHOTOS = `*, photos:listing_photos(${LISTING_PHOTO_COLUMNS})`;

/** Relation Listing::photos() : orderBy('order') (id en départage). */
export function sortPhotos(photos: Row[] | null | undefined): Row[] {
  return [...(photos ?? [])].sort((a, b) => Number(a.order) - Number(b.order) || Number(a.id) - Number(b.id));
}

/** $listing->load('photos') */
export async function fetchListingPhotos(listingId: number): Promise<Row[]> {
  const photos = await fetchAll<Row>(() =>
    db().from('listing_photos').select(LISTING_PHOTO_COLUMNS).eq('listing_id', listingId).order('order').order('id'),
  );
  return sortPhotos(photos);
}

/** Listing::where('title', $title)->[where('id', '!=', $excludeId)]->exists() (title en citext). */
export async function listingTitleExists(title: unknown, excludeId?: number | null): Promise<boolean> {
  let query = db().from('listings').select('id').eq('title', title as string);
  if (excludeId !== undefined && excludeId !== null) {
    query = query.neq('id', excludeId);
  }
  const rows = must(await query.limit(1)) as Row[];
  return rows.length > 0;
}

export const LISTING_TITLE_TAKEN = "Ce titre d'annonce existe déjà. Veuillez en choisir un autre.";

/**
 * formatListing() : `listing` contient les attributs du modèle (ligne lue en base ou attributs en mémoire),
 * `photos` la relation chargée (déjà triée).
 */
export function formatListing(listing: Row, photos: Row[]): Row {
  const attr = (key: string) => castListingAttribute(key, listing[key]);
  return {
    id: listing.id,
    status: attr('status'),
    title: attr('title'),
    subtitle: attr('subtitle'),
    city: attr('city'),
    province: attr('province'),
    country: attr('country'),
    space_type: attr('space_type'),
    capacity: attr('capacity'),
    bathrooms: attr('bathrooms'),
    base_price: attr('base_price'),
    currency: attr('currency'),
    cancellation_policy: attr('cancellation_policy'),
    reservation_mode: attr('reservation_mode'),
    host_photo_url: listing.host_photo_path ? photoUrl(listing.host_photo_path) : null,
    photos: photos.map((photo) => ({
      id: photo.id,
      url: photoUrl(photo.path),
      order: photo.order,
    })),
    created_at: attr('created_at'),
    updated_at: attr('updated_at'),

    // Detail fields
    rental_frequency: attr('rental_frequency'),
    full_address: attr('full_address'),
    street: attr('street'),
    postal_code: attr('postal_code'),
    mrc: attr('mrc'),
    county: attr('county'),
    adults: attr('adults'),
    bedrooms_data: attr('bedrooms_data'),
    open_areas_data: attr('open_areas_data'),
    amenities: attr('amenities'),
    expectations: attr('expectations'),
    permissions: attr('permissions'),
    description: attr('description'),
    about_chalet: attr('about_chalet'),
    host_availability: attr('host_availability'),
    neighborhood: attr('neighborhood'),
    transport: attr('transport'),
    other_info: attr('other_info'),
    arrival_time: attr('arrival_time'),
    departure_time: attr('departure_time'),
    min_age: attr('min_age'),
    min_stay: attr('min_stay'),
    max_stay: attr('max_stay'),
    arrival_days: attr('arrival_days'),
    departure_days: attr('departure_days'),
    weekend_price: attr('weekend_price'),
    weekly_price: attr('weekly_price'),
    monthly_price: attr('monthly_price'),
    cleaning_fee: attr('cleaning_fee'),
    security_deposit: attr('security_deposit'),
    extra_guest_fee: attr('extra_guest_fee'),
    pet_fee: attr('pet_fee'),
    tax_registration: attr('tax_registration'),
    accepted_local_laws: attr('accepted_local_laws'),
    wifi_speed: attr('wifi_speed'),
    has_wifi: attr('has_wifi'),
    checkin_method: attr('checkin_method'),
    checkin_instructions: attr('checkin_instructions'),
    phone_number: attr('phone_number'),
    country_code: attr('country_code'),
    latitude: attr('latitude'),
    longitude: attr('longitude'),
  };
}

/**
 * Champs privés de l'hôte que Laravel renvoyait sans authentification sur /listings/public(/{id})
 * (adresse exacte, téléphone, instructions d'arrivée). Les clés restent présentes, à null ;
 * aucune page publique ne les lit.
 */
export const PUBLIC_REDACTED_LISTING_FIELDS = ['full_address', 'street', 'postal_code', 'phone_number', 'checkin_instructions'] as const;

export function redactPublicListing<T extends Row>(formatted: T): T {
  const copy: Row = { ...formatted };
  for (const key of PUBLIC_REDACTED_LISTING_FIELDS) {
    if (key in copy) {
      copy[key] = null;
    }
  }
  return copy as T;
}

/** Colonnes de l'hôte utilisées par formatListingDetail (embed : `user:users!listings_user_id_fkey(...)`). */
export const LISTING_HOST_COLUMNS =
  'id, first_name, profile_photo_url, profession, interests, languages_spoken, identity_verified, phone_verified, created_at';

const REVIEW_COLUMNS =
  'id, user_id, rating, text, cleanliness_rating, accuracy_rating, checkin_rating, communication_rating, location_rating, value_rating, created_at';

/** Utilisateur d'un avis tel que renvoyé par l'API. */
export function formatReviewUser(user: Row): Row {
  return {
    first_name: user.first_name,
    profile_photo_url: profilePhotoFullUrl(user.profile_photo_url),
    member_since: carbonJson(user.created_at),
  };
}

export function formatReview(review: Row, user: Row): Row {
  return {
    id: review.id,
    rating: decimal(review.rating, 1),
    text: review.text,
    created_at: carbonJson(review.created_at),
    user: formatReviewUser(user),
  };
}

const timeOf = (value: string | null | undefined) => (value ? new Date(value).getTime() : 0);

/** formatListingDetail() : formatListing + host, reviews_summary, reviews (6 derniers). */
export async function formatListingDetail(listing: Row, photos: Row[], host: Row): Promise<Row> {
  const base = formatListing(listing, photos);

  const [hostReviews, reviews] = await Promise.all([
    // Review::whereIn('listing_id', <annonces de l'hôte>) : count() et avg('rating')
    fetchAll<Row>(() =>
      db().from('reviews').select('id, rating, listings!inner(user_id)').eq('listings.user_id', host.id).order('id'),
    ),
    // $listing->reviews (ordre de l'index MySQL listing_id, created_at)
    fetchAll<Row>(() =>
      db().from('reviews').select(REVIEW_COLUMNS).eq('listing_id', listing.id).order('created_at').order('id'),
    ),
  ]);

  const hostReviewsCount = hostReviews.length;
  // AVG() MySQL sur DECIMAL(2,1) : calcul exact en dixièmes
  const hostAvgRating =
    hostReviewsCount > 0
      ? round(hostReviews.reduce((sum, r) => sum + Math.round(Number(r.rating) * 10), 0) / (hostReviewsCount * 10), 2)
      : null;

  base.host = {
    id: host.id,
    first_name: host.first_name,
    profile_photo_url:
      profilePhotoFullUrl(host.profile_photo_url) ?? (listing.host_photo_path ? photoUrl(listing.host_photo_path) : null),
    profession: host.profession,
    interests: host.interests === null || host.interests === undefined ? null : phpJson(host.interests),
    languages_spoken:
      host.languages_spoken === null || host.languages_spoken === undefined ? null : phpJson(host.languages_spoken),
    identity_verified: host.identity_verified ?? false,
    phone_verified: host.phone_verified ?? false,
    member_since: carbonJson(host.created_at),
    reviews_count: hostReviewsCount,
    average_rating: hostAvgRating,
    response_rate: 92,
    response_time: "dans l'heure",
  };

  const reviewsCount = reviews.length;
  const column = (name: string) => reviews.map((r) => (r[name] === null || r[name] === undefined ? null : Number(r[name])));
  // round(null, 1) vaut 0 en PHP quand aucune note de ce critère n'existe
  const subAverage = (name: string) => (reviewsCount > 0 ? round(avg(column(name)) ?? 0, 1) : null);
  const avgRating = reviewsCount > 0 ? round(avg(column('rating')) ?? 0, 2) : null;

  const ratingDistribution: Record<number, number> = {};
  for (let i = 5; i >= 1; i--) {
    ratingDistribution[i] = reviews.filter((r) => round(Number(r.rating)) === i).length;
  }

  base.reviews_summary = {
    count: reviewsCount,
    average_rating: avgRating,
    cleanliness_avg: subAverage('cleanliness_rating'),
    accuracy_avg: subAverage('accuracy_rating'),
    checkin_avg: subAverage('checkin_rating'),
    communication_avg: subAverage('communication_rating'),
    location_avg: subAverage('location_rating'),
    value_avg: subAverage('value_rating'),
    rating_distribution: ratingDistribution,
    is_guest_favorite: avgRating !== null && avgRating >= 4.9,
  };

  // sortByDesc('created_at') : départage déterministe par id décroissant
  const latest = [...reviews]
    .sort((a, b) => timeOf(b.created_at) - timeOf(a.created_at) || Number(b.id) - Number(a.id))
    .slice(0, 6);
  const userIds = [...new Set(latest.map((r) => r.user_id))];
  const users = new Map<number, Row>();
  for (const ids of chunk(userIds)) {
    const rows = must(await db().from('users').select('id, first_name, profile_photo_url, created_at').in('id', ids)) as Row[];
    rows.forEach((user) => users.set(user.id, user));
  }

  base.reviews = latest.map((review) => {
    const user = users.get(review.user_id);
    if (!user) {
      throw new Error(`Utilisateur ${review.user_id} de l'avis ${review.id} introuvable`);
    }
    return formatReview(review, user);
  });

  return base;
}
