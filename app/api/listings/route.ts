import { authenticate } from '@/server/auth';
import { input, json, route } from '@/server/http';
import {
  buildListingStoreAttributes,
  fetchListingPhotos,
  formatListing,
  LISTING_TITLE_TAKEN,
  LISTING_WITH_PHOTOS,
  listingDbValues,
  listingTitleExists,
  nowTimestamp,
  phpTruthy,
  sortPhotos,
  storeListingImage,
  type Row,
} from '@/server/listings';
import { db, fetchAll, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** ListingController::index — annonces de l'utilisateur connecté. */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  const listings = await fetchAll<Row>(() =>
    db()
      .from('listings')
      .select(LISTING_WITH_PHOTOS)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false }),
  );

  return json({
    listings: listings.map((listing) => formatListing(listing, sortPhotos(listing.photos))),
  });
});

/** ListingController::store — création d'une annonce (formulaire complet + photos). */
export const POST = route(async (req) => {
  const { user } = await authenticate(req);
  const data = await input(req);

  await validate(data, {
    title: 'required|string|max:255',
    city: 'required|string|max:255',
    capacity: 'required|integer|min:1',
    base_price: 'required|numeric|min:0',
  });

  if (await listingTitleExists(data.title)) {
    return json({ message: LISTING_TITLE_TAKEN }, 422);
  }

  const now = nowTimestamp();
  const attributes = buildListingStoreAttributes(data, user.id, now);

  const created = must(
    await db()
      .from('listings')
      .insert({ ...listingDbValues(attributes), updated_at: now, created_at: now })
      .select('id')
      .single(),
  ) as Row;

  // Attributs du modèle en mémoire (la réponse Laravel ne relit pas la ligne)
  const listing: Row = { ...attributes, updated_at: now, created_at: now, id: created.id };

  // Photo de l'hôte
  if (phpTruthy(data.host_photo)) {
    const hostPhotoPath = await storeListingImage(data.host_photo, `listings/${listing.id}/host`, user.auth_id);
    if (hostPhotoPath) {
      const updatedAt = nowTimestamp();
      must(await db().from('listings').update({ host_photo_path: hostPhotoPath, updated_at: updatedAt }).eq('id', listing.id));
      listing.host_photo_path = hostPhotoPath;
      listing.updated_at = updatedAt;

      // Photo de profil de l'utilisateur si elle n'est pas encore définie
      if (!phpTruthy(user.profile_photo_url)) {
        must(
          await db()
            .from('users')
            .update({ profile_photo_url: `/storage/${hostPhotoPath}`, updated_at: nowTimestamp() })
            .eq('id', user.id),
        );
      }
    }
  }

  // Photos du chalet (base64 ou références d'envoi direct), order = index dans le tableau
  if (phpTruthy(data.chalet_photos) && data.chalet_photos !== null && typeof data.chalet_photos === 'object') {
    const entries = (Array.isArray(data.chalet_photos) ? [...data.chalet_photos.entries()] : Object.entries(data.chalet_photos))
      .filter(([index]) => /^\d+$/.test(String(index)))
      .map(([index, photo]) => [Number(index), photo] as const);

    const paths = await Promise.all(
      entries.map(([, photo]) => storeListingImage(photo, `listings/${listing.id}`, user.auth_id)),
    );
    const photosAt = nowTimestamp();
    const rows = entries.flatMap(([index], i) =>
      paths[i] ? [{ listing_id: listing.id, path: paths[i], order: index, created_at: photosAt, updated_at: photosAt }] : [],
    );
    if (rows.length > 0) {
      must(await db().from('listing_photos').insert(rows));
    }
  }

  const photos = await fetchListingPhotos(listing.id);

  return json(
    {
      message: 'Annonce créée avec succès. Elle sera examinée par notre équipe.',
      listing: formatListing(listing, photos),
    },
    201,
  );
});
