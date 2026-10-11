import { authenticate } from '@/server/auth';
import { json, route } from '@/server/http';
import { type Row } from '@/server/listings';
import { expireStaleRequests } from '@/server/reservations';
import { db, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** Nombre de demandes de réservation qui attendent la réponse de l'hôte (pastille du menu). */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  const listings = must(await db().from('listings').select('id').eq('user_id', user.id)) as Row[];
  const listingIds = listings.map((listing) => listing.id as number);
  if (listingIds.length === 0) {
    return json({ pending_count: 0 });
  }
  await expireStaleRequests({ listingIds });

  const { count, error } = await db()
    .from('reservations')
    .select('id', { count: 'exact', head: true })
    .in('listing_id', listingIds)
    .eq('status', 'pending');
  if (error) {
    throw error;
  }

  return json({ pending_count: count ?? 0 });
});
