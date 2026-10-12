import { avg, round, ymd } from '@/server/format';
import { json, route } from '@/server/http';
import { formatListing, LISTING_WITH_PHOTOS, redactPublicListing, sortPhotos, type Row } from '@/server/listings';
import { expireStaleRequests } from '@/server/reservations';
import { chunk, db, fetchAll } from '@/server/supabase';
import { validate } from '@/server/validation';
import { BLOCKING_STATUSES, nightsBetweenYmd, stayLimits, weekdayAllowed, weekdayOfYmd } from '@/shared/booking';
import { matchesDestination } from '@/shared/places';

export const dynamic = 'force-dynamic';

/**
 * ListingController::publicIndex — annonces actives, sans authentification.
 * Filtres facultatifs de la page de recherche :
 *   destination          ville, région, province ou pays (« Mont-Tremblant, Québec »)
 *   check_in, check_out  séjour « AAAA-MM-JJ » : seules les annonces réservables sur ces dates
 *   guests               adultes + enfants (bébés non compris), comparé à la capacité
 */
export const GET = route(async (req) => {
  const query: Row = {};
  for (const [key, value] of req.nextUrl.searchParams) {
    if (value.trim() !== '') query[key] = value.trim();
  }
  const filters = await validate(query, {
    destination: 'sometimes|string|max:255',
    check_in: 'sometimes|date',
    check_out: 'sometimes|date|after:check_in',
    guests: 'sometimes|integer|min:1',
  });

  let listings = await fetchAll<Row>(() =>
    db()
      .from('listings')
      .select(LISTING_WITH_PHOTOS)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false }),
  );

  if (filters.destination) {
    listings = listings.filter((listing) => matchesDestination(listing, filters.destination));
  }
  if (filters.guests) {
    const guests = Number(filters.guests);
    listings = listings.filter((listing) => {
      const capacity = Math.trunc(Number(listing.capacity ?? 0));
      return capacity <= 0 || guests <= capacity;
    });
  }
  if (filters.check_in && filters.check_out) {
    listings = await bookableFor(listings, ymd(filters.check_in) as string, ymd(filters.check_out) as string);
  }

  const ratings = await reviewStats(listings.map((listing) => listing.id));

  return json({
    listings: listings.map((listing) => ({
      ...redactPublicListing(formatListing(listing, sortPhotos(listing.photos))),
      reviews_count: ratings.get(listing.id)?.count ?? 0,
      average_rating: ratings.get(listing.id)?.average ?? null,
    })),
  });
});

/** Annonces réservables sur [checkIn, checkOut) : mêmes règles que POST /reservations. */
async function bookableFor(listings: Row[], checkIn: string, checkOut: string): Promise<Row[]> {
  const nights = nightsBetweenYmd(checkIn, checkOut);
  const arrival = weekdayOfYmd(checkIn);
  const departure = weekdayOfYmd(checkOut);
  const candidates = listings.filter((listing) => {
    const { minStay, maxStay } = stayLimits(listing.min_stay, listing.max_stay);
    return (
      nights >= minStay &&
      (maxStay === 0 || nights <= maxStay) &&
      weekdayAllowed(listing.arrival_days, arrival) &&
      weekdayAllowed(listing.departure_days, departure)
    );
  });
  if (candidates.length === 0) return [];

  // Une demande restée sans réponse au-delà de son échéance libère ses dates
  await expireStaleRequests({ listingIds: candidates.map((listing) => listing.id) });

  const unavailable = new Set<number>();
  for (const ids of chunk(candidates.map((listing) => listing.id))) {
    const [reserved, blocked] = await Promise.all([
      fetchAll<Row>(() =>
        db()
          .from('reservations')
          .select('id, listing_id')
          .in('listing_id', ids)
          .in('status', BLOCKING_STATUSES)
          .lt('check_in', checkOut)
          .gt('check_out', checkIn)
          .order('id'),
      ),
      fetchAll<Row>(() =>
        db()
          .from('listing_blocked_dates')
          .select('listing_id, date')
          .in('listing_id', ids)
          .gte('date', checkIn)
          .lt('date', checkOut)
          .order('listing_id')
          .order('date'),
      ),
    ]);
    for (const row of [...reserved, ...blocked]) unavailable.add(Number(row.listing_id));
  }

  return candidates.filter((listing) => !unavailable.has(Number(listing.id)));
}

/** Nombre d'avis et note moyenne (2 décimales, comme reviews_summary) par annonce. */
async function reviewStats(listingIds: number[]): Promise<Map<number, { count: number; average: number }>> {
  const byListing = new Map<number, number[]>();
  for (const ids of chunk(listingIds)) {
    const reviews = await fetchAll<Row>(() =>
      db().from('reviews').select('id, listing_id, rating').in('listing_id', ids).order('id'),
    );
    for (const review of reviews) {
      const ratings = byListing.get(Number(review.listing_id)) ?? [];
      ratings.push(Number(review.rating));
      byListing.set(Number(review.listing_id), ratings);
    }
  }

  const stats = new Map<number, { count: number; average: number }>();
  for (const [listingId, ratings] of byListing) {
    stats.set(listingId, { count: ratings.length, average: round(avg(ratings) ?? 0, 2) });
  }
  return stats;
}
