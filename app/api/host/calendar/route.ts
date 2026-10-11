import { authenticate } from '@/server/auth';
import { float, ymd } from '@/server/format';
import { HttpError, input, json, route, toBoolean } from '@/server/http';
import { type Row } from '@/server/listings';
import { expireStaleRequests, occupiedNights } from '@/server/reservations';
import { db, fetchAll, must } from '@/server/supabase';
import { validate } from '@/server/validation';
import { addDaysYmd, BLOCKING_STATUSES } from '@/shared/booking';

export const dynamic = 'force-dynamic';

const YMD = /^\d{4}-\d{2}-\d{2}$/;

/** Logements de l'hôte connecté (sélecteur du calendrier). */
async function hostListings(userId: number): Promise<Row[]> {
  return must(
    await db().from('listings').select('id, title, city, base_price, currency, status').eq('user_id', userId).order('id'),
  ) as Row[];
}

function ownedListing(listings: Row[], listingId: number): Row {
  const listing = listings.find((item) => item.id === listingId);
  if (!listing) {
    throw new HttpError(404, { message: 'Logement introuvable.' });
  }
  return listing;
}

/**
 * Calendrier d'un logement de l'hôte sur [from, to) : réservations qui l'occupent (en attente, confirmées,
 * passées) et nuits bloquées. Sans listing_id : le premier logement de l'hôte.
 */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);
  const query = await input(req);

  const listings = await hostListings(user.id);
  const summary = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    city: listing.city,
    status: listing.status,
    base_price: float(listing.base_price),
    currency: listing.currency,
  }));
  if (listings.length === 0) {
    return json({ listings: [], listing_id: null, reservations: [], blocked_dates: [] });
  }

  const listing = query.listing_id ? ownedListing(listings, Number(query.listing_id)) : listings[0];
  const from = YMD.test(String(query.from ?? '')) ? String(query.from) : (ymd(new Date()) as string);
  const to = YMD.test(String(query.to ?? '')) && String(query.to) > from ? String(query.to) : addDaysYmd(from, 62);

  await expireStaleRequests({ listingId: listing.id });

  const reservations = await fetchAll<Row>(() =>
    db()
      .from('reservations')
      .select('id, check_in, check_out, status, guests_count, guest:users!reservations_guest_id_fkey(first_name)')
      .eq('listing_id', listing.id)
      // Un paiement en cours n'est pas encore une réservation : il n'apparaît pas (ses dates restent retenues)
      .in('status', ['pending', 'confirmed', 'active', 'completed'])
      .lt('check_in', to)
      .gt('check_out', from)
      .order('check_in'),
  );
  const blocked = await fetchAll<Row>(() =>
    db()
      .from('listing_blocked_dates')
      .select('date')
      .eq('listing_id', listing.id)
      .gte('date', from)
      .lt('date', to)
      .order('date'),
  );

  return json({
    listings: summary,
    listing_id: listing.id,
    reservations: reservations.map((reservation) => ({
      id: reservation.id,
      guest_first_name: reservation.guest?.first_name ?? null,
      check_in: ymd(reservation.check_in),
      check_out: ymd(reservation.check_out),
      status: reservation.status,
      guests_count: reservation.guests_count,
    })),
    blocked_dates: blocked.map((row) => ymd(row.date)),
  });
});

/** Bloque ou débloque des nuits. Une nuit réservée (ou demandée) ne peut pas être bloquée. */
export const POST = route(async (req) => {
  const { user } = await authenticate(req);
  const data = await input(req);
  const validated = await validate(data, {
    listing_id: 'required|integer',
    dates: 'required|array',
    blocked: 'required|boolean',
  });

  const listing = ownedListing(await hostListings(user.id), Number(validated.listing_id));
  const dates = [...new Set((validated.dates as unknown[]).map(String))].sort();
  if (dates.length === 0 || dates.length > 366 || dates.some((date) => !YMD.test(date))) {
    throw new HttpError(422, { message: 'Dates invalides.' });
  }

  if (!toBoolean(validated.blocked)) {
    must(await db().from('listing_blocked_dates').delete().eq('listing_id', listing.id).in('date', dates));
    return json({ message: `${dates.length} nuit${dates.length > 1 ? 's' : ''} débloquée${dates.length > 1 ? 's' : ''}.` });
  }

  const today = ymd(new Date()) as string;
  if (dates[0] < today) {
    throw new HttpError(422, { message: 'Impossible de bloquer une date passée.' });
  }

  await expireStaleRequests({ listingId: listing.id });
  const first = dates[0];
  const end = addDaysYmd(dates[dates.length - 1], 1);
  const reservations = await fetchAll<Row>(() =>
    db()
      .from('reservations')
      .select('id, check_in, check_out')
      .eq('listing_id', listing.id)
      .in('status', BLOCKING_STATUSES)
      .lt('check_in', end)
      .gt('check_out', first)
      .order('id'),
  );
  const taken = new Set(occupiedNights(reservations, first, end));
  const conflicts = dates.filter((date) => taken.has(date));
  if (conflicts.length > 0) {
    throw new HttpError(409, {
      message: 'Certaines de ces nuits sont réservées ou demandées par un voyageur : elles ne peuvent pas être bloquées.',
      conflicting_dates: conflicts,
    });
  }

  must(
    await db()
      .from('listing_blocked_dates')
      .upsert(
        dates.map((date) => ({ listing_id: listing.id, date })),
        { onConflict: 'listing_id,date', ignoreDuplicates: true },
      ),
  );
  return json({ message: `${dates.length} nuit${dates.length > 1 ? 's' : ''} bloquée${dates.length > 1 ? 's' : ''}.` });
});
