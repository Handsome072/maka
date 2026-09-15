import { json, route } from '@/server/http';
import { formatListing, LISTING_WITH_PHOTOS, redactPublicListing, sortPhotos, type Row } from '@/server/listings';
import { db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** ListingController::publicIndex — annonces actives, sans authentification. */
export const GET = route(async () => {
  const listings = await fetchAll<Row>(() =>
    db()
      .from('listings')
      .select(LISTING_WITH_PHOTOS)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false }),
  );

  return json({
    listings: listings.map((listing) => redactPublicListing(formatListing(listing, sortPhotos(listing.photos)))),
  });
});
