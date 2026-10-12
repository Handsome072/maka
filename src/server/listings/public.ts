import { avg, round } from '@/server/format';
import { chunk, db, fetchAll } from '@/server/supabase';
import type { Row } from './casts';
import { formatListing, redactPublicListing, sortPhotos } from './format';

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

/**
 * Annonces lues avec LISTING_WITH_PHOTOS, au format de la liste publique :
 * champs privés de l'hôte masqués, nombre d'avis et note moyenne ajoutés.
 */
export async function formatPublicListings(listings: Row[]): Promise<Row[]> {
  const ratings = await reviewStats(listings.map((listing) => Number(listing.id)));
  return listings.map((listing) => ({
    ...redactPublicListing(formatListing(listing, sortPhotos(listing.photos))),
    reviews_count: ratings.get(Number(listing.id))?.count ?? 0,
    average_rating: ratings.get(Number(listing.id))?.average ?? null,
  }));
}
