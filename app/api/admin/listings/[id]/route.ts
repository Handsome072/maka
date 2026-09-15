import { ADMIN_LISTING_SELECT, formatAdminListing, type AdminListingRow } from '@/server/admin-listings/format';
import { authenticateAdmin } from '@/server/auth';
import { intParam, json, notFound, route } from '@/server/http';
import { deleteFiles } from '@/server/storage';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** AdminListingController::show */
export const GET = route<{ id: string }>(async (req, params) => {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'Listing');

  const listing = must(
    await db().from('listings').select(ADMIN_LISTING_SELECT).eq('id', id).maybeSingle(),
  ) as AdminListingRow | null;
  if (!listing) {
    notFound('Listing', id);
  }

  return json({ listing: formatAdminListing(listing) });
});

/** AdminListingController::destroy */
export const DELETE = route<{ id: string }>(async (req, params) => {
  await authenticateAdmin(req);
  const id = intParam(params.id, 'Listing');

  const listing = must(
    await db()
      .from('listings')
      .select('id,host_photo_path,photos:listing_photos!listing_photos_listing_id_fkey(path)')
      .eq('id', id)
      .maybeSingle(),
  ) as { id: number; host_photo_path: string | null; photos: Array<{ path: string }> | null } | null;
  if (!listing) {
    notFound('Listing', id);
  }

  // Fichiers d'abord, puis l'annonce (photos, réservations… supprimées en cascade)
  await deleteFiles([...(listing.photos ?? []).map((p) => p.path), listing.host_photo_path]);

  must(await db().from('listings').delete().eq('id', id));

  return json({ message: 'Annonce supprimée avec succès.' });
});
