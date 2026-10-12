import { authenticate } from '@/server/auth';
import { intParam, json, notFound, route } from '@/server/http';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** Ajoute une annonce en ligne aux favoris (sans effet si elle y est déjà). */
export const PUT = route<{ listingId: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const listingId = intParam(params.listingId, 'Listing');

  const listing = must(
    await db().from('listings').select('id').eq('id', listingId).eq('status', 'active').maybeSingle(),
  );
  if (!listing) {
    notFound('Listing', listingId);
  }

  must(
    await db()
      .from('favorites')
      .upsert({ user_id: user.id, listing_id: listingId }, { onConflict: 'user_id,listing_id', ignoreDuplicates: true }),
  );

  return json({ message: 'Ajouté à vos favoris.', listing_id: listingId });
});

/** Retire une annonce des favoris (sans effet si elle n'y est pas). */
export const DELETE = route<{ listingId: string }>(async (req, params) => {
  const { user } = await authenticate(req);
  const listingId = intParam(params.listingId, 'Listing');

  must(await db().from('favorites').delete().eq('user_id', user.id).eq('listing_id', listingId));

  return json({ message: 'Retiré de vos favoris.', listing_id: listingId });
});
