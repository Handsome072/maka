import { intParam, json, notFound, route } from '@/server/http';
import {
  formatListingDetail,
  LISTING_HOST_COLUMNS,
  LISTING_WITH_PHOTOS,
  redactPublicListing,
  sortPhotos,
  type Row,
} from '@/server/listings';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** ListingController::publicShow — annonce active avec hôte et avis, sans authentification. */
export const GET = route<{ id: string }>(async (_req, params) => {
  const id = intParam(params.id, 'Listing');

  const listing = must(
    await db()
      .from('listings')
      .select(`${LISTING_WITH_PHOTOS}, user:users!listings_user_id_fkey(${LISTING_HOST_COLUMNS})`)
      .eq('status', 'active')
      .eq('id', id)
      .maybeSingle(),
  ) as Row | null;
  if (!listing) {
    notFound('Listing', id);
  }

  const detail = await formatListingDetail(listing, sortPhotos(listing.photos), listing.user);

  return json({ listing: redactPublicListing(detail) });
});
