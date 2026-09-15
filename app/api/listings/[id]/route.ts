import { authenticate } from '@/server/auth';
import { input, intParam, json, notFound, route } from '@/server/http';
import {
  fetchListingPhotos,
  fillListingForUpdate,
  formatListing,
  LISTING_PHOTO_COLUMNS,
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
import { deleteFiles, isUploadRef } from '@/server/storage';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

type Params = { id: string };

/** ListingController::show — annonce de l'utilisateur connecté. */
export const GET = route<Params>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Listing');

  const listing = must(
    await db().from('listings').select(LISTING_WITH_PHOTOS).eq('user_id', user.id).eq('id', id).maybeSingle(),
  ) as Row | null;
  if (!listing) {
    notFound('Listing', id);
  }

  return json({ listing: formatListing(listing, sortPhotos(listing.photos)) });
});

/** ListingController::update */
export const PUT = route<Params>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Listing');

  const listing = must(
    await db().from('listings').select('*').eq('user_id', user.id).eq('id', id).maybeSingle(),
  ) as Row | null;
  if (!listing) {
    notFound('Listing', id);
  }

  const data = await input(req);

  // Unicité du titre (hors annonce courante)
  if ('title' in data && phpTruthy(data.title)) {
    if (await listingTitleExists(data.title, listing.id)) {
      return json({ message: LISTING_TITLE_TAKEN }, 422);
    }
  }

  // $listing->update($request->except(['host_photo', 'chalet_photos', '_method'])) : seules les colonnes
  // $fillable sont affectées, sauf celles réservées à l'administration / au système (LISTING_HOST_PROTECTED)
  const { dirty, attributes } = fillListingForUpdate(data, listing);

  // Eloquent n'écrit (et ne touche updated_at) que si un attribut a changé
  if (Object.keys(dirty).length > 0) {
    const updatedAt = nowTimestamp();
    must(await db().from('listings').update({ ...listingDbValues(dirty), updated_at: updatedAt }).eq('id', listing.id));
    attributes.updated_at = updatedAt;
  }

  // Nouvelle photo de l'hôte (base64 data: ou référence d'envoi direct)
  const hostPhoto = data.host_photo;
  if (typeof hostPhoto === 'string' && phpTruthy(hostPhoto) && (hostPhoto.startsWith('data:') || isUploadRef(hostPhoto))) {
    const directory = `listings/${listing.id}/host`;
    let hostPhotoPath: string | null;

    if (isUploadRef(hostPhoto)) {
      // Référence invalide : on garde l'ancienne photo
      hostPhotoPath = await storeListingImage(hostPhoto, directory, user.auth_id);
      if (hostPhotoPath && phpTruthy(attributes.host_photo_path)) {
        await deleteFiles([attributes.host_photo_path]);
      }
    } else {
      if (phpTruthy(attributes.host_photo_path)) {
        await deleteFiles([attributes.host_photo_path]);
      }
      hostPhotoPath = await storeListingImage(hostPhoto, directory, user.auth_id);
    }

    if (hostPhotoPath) {
      const updatedAt = nowTimestamp();
      must(await db().from('listings').update({ host_photo_path: hostPhotoPath, updated_at: updatedAt }).eq('id', listing.id));
      attributes.host_photo_path = hostPhotoPath;
      attributes.updated_at = updatedAt;

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

  const photos = await fetchListingPhotos(listing.id);

  return json({
    message: 'Annonce mise à jour avec succès.',
    listing: formatListing(attributes, photos),
  });
});

/** ListingController::destroy — supprime l'annonce et ses fichiers. */
export const DELETE = route<Params>(async (req, params) => {
  const { user } = await authenticate(req);
  const id = intParam(params.id, 'Listing');

  const listing = must(
    await db()
      .from('listings')
      .select(`id, host_photo_path, photos:listing_photos(${LISTING_PHOTO_COLUMNS})`)
      .eq('user_id', user.id)
      .eq('id', id)
      .maybeSingle(),
  ) as Row | null;
  if (!listing) {
    notFound('Listing', id);
  }

  const files: string[] = sortPhotos(listing.photos).map((photo) => photo.path);
  if (phpTruthy(listing.host_photo_path)) {
    files.push(listing.host_photo_path);
  }
  await deleteFiles(files);

  // Les photos, réservations, avis et conversations suivent par ON DELETE CASCADE
  must(await db().from('listings').delete().eq('id', listing.id));

  return json({ message: 'Annonce supprimée avec succès.' });
});
