import { authenticate } from '@/server/auth';
import { json, route } from '@/server/http';
import { formatPublicListings, LISTING_WITH_PHOTOS, type Row } from '@/server/listings';
import { chunk, db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/**
 * Favoris de l'utilisateur connecté, du plus récent au plus ancien :
 *   listing_ids  toutes les annonces enregistrées (état des cœurs)
 *   listings     celles qui sont encore en ligne, au format de la liste publique
 */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  const favorites = await fetchAll<Row>(() =>
    db()
      .from('favorites')
      .select('listing_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .order('listing_id', { ascending: false }),
  );
  const listingIds = favorites.map((favorite) => Number(favorite.listing_id));

  const active = new Map<number, Row>();
  for (const ids of chunk(listingIds)) {
    const rows = await fetchAll<Row>(() =>
      db().from('listings').select(LISTING_WITH_PHOTOS).in('id', ids).eq('status', 'active').order('id'),
    );
    for (const row of rows) active.set(Number(row.id), row);
  }
  const ordered = listingIds.map((id) => active.get(id)).filter((row): row is Row => !!row);

  return json({ listing_ids: listingIds, listings: await formatPublicListings(ordered) });
});
