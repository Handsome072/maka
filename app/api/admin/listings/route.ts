import {
  ADMIN_LISTING_SELECT,
  compareCreatedAtDesc,
  formatAdminListing,
  type AdminListingRow,
} from '@/server/admin-listings/format';
import { authenticateAdmin } from '@/server/auth';
import { filled, input, json, route } from '@/server/http';
import { mysqlEquals, mysqlLike, mysqlNumber } from '@/server/revenues/mysql';
import { db, fetchAll } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/**
 * AdminListingController::index
 * Laravel renvoie toutes les annonces (sans pagination) : elles sont chargées puis filtrées ici avec la
 * sémantique MySQL (LIKE et = insensibles à la casse et aux accents, `id = 'texte'` converti en nombre).
 */
export const GET = route(async (req) => {
  await authenticateAdmin(req);
  const data = await input(req);

  let listings = await fetchAll<AdminListingRow>(() =>
    db().from('listings').select(ADMIN_LISTING_SELECT).order('id'),
  );

  if (filled(data.status)) {
    listings = listings.filter((l) => mysqlEquals(l.status, data.status));
  }

  if (filled(data.search)) {
    const search = String(data.search);
    const searchId = mysqlNumber(search);
    listings = listings.filter((l) => mysqlLike(l.title, `%${search}%`) || l.id === searchId);
  }

  if (filled(data.city)) {
    listings = listings.filter((l) => mysqlEquals(l.city, data.city));
  }

  if (filled(data.host_id)) {
    const hostId = mysqlNumber(data.host_id);
    listings = listings.filter((l) => l.user_id === hostId);
  }

  listings.sort(compareCreatedAtDesc);

  return json({ listings: listings.map(formatAdminListing) });
});
