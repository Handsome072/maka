import { authenticate } from '@/server/auth';
import { json, route } from '@/server/http';
import { type Row } from '@/server/listings';
import { conversationIds, expireStaleRequests, formatReservation, RESERVATION_SELECT } from '@/server/reservations';
import { chunk, db, fetchAll, must } from '@/server/supabase';

export const dynamic = 'force-dynamic';

/** Réservations des logements de l'hôte connecté, toutes phases confondues, arrivée la plus lointaine d'abord. */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  const listings = must(await db().from('listings').select('id, title').eq('user_id', user.id).order('id')) as Row[];
  const listingIds = listings.map((listing) => listing.id as number);
  await expireStaleRequests({ listingIds });

  const reservations: Row[] = [];
  for (const ids of chunk(listingIds)) {
    reservations.push(
      ...(await fetchAll<Row>(() =>
        db()
          .from('reservations')
          .select(RESERVATION_SELECT)
          .in('listing_id', ids)
          .neq('status', 'awaiting_payment')
          .order('check_in', { ascending: false })
          .order('id', { ascending: false }),
      )),
    );
  }
  reservations.sort((a, b) => String(b.check_in).localeCompare(String(a.check_in)) || b.id - a.id);

  const conversations = new Map<number, number>();
  for (const ids of chunk(reservations.map((reservation) => reservation.id as number))) {
    for (const [reservationId, conversationId] of await conversationIds(ids)) {
      conversations.set(reservationId, conversationId);
    }
  }

  return json({
    listings: listings.map((listing) => ({ id: listing.id, title: listing.title })),
    reservations: reservations.map((reservation) =>
      formatReservation(reservation, user.id, conversations.get(reservation.id) ?? null),
    ),
  });
});
