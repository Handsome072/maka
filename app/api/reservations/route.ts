import { authenticate } from '@/server/auth';
import { ymd } from '@/server/format';
import { input, json, notFound, route } from '@/server/http';
import { computePrice, nowTimestamp, parseCarbon, reservationToArray, type Row } from '@/server/listings';
import { db, fetchAll, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

const RESERVATION_WITH_LISTING = '*, listing:listings!reservations_listing_id_fkey(*)';

/** ReservationController::store */
export const POST = route(async (req) => {
  const { user } = await authenticate(req);

  const validated = await validate(await input(req), {
    listing_id: 'required|exists:listings,id',
    check_in: 'required|date|after_or_equal:today',
    check_out: 'required|date|after:check_in',
    adults: 'integer|min:1',
    children: 'integer|min:0',
    infants: 'integer|min:0',
    pets: 'integer|min:0',
    guest_message: 'nullable|string|max:1000',
  });

  const adults = validated.adults ?? 1;
  const children = validated.children ?? 0;
  const infants = validated.infants ?? 0;
  const pets = validated.pets ?? 0;

  const listing = must(await db().from('listings').select('*').eq('id', validated.listing_id).maybeSingle()) as Row | null;
  if (!listing) {
    notFound('Listing', validated.listing_id);
  }

  const price = computePrice(
    listing,
    validated.check_in,
    validated.check_out,
    Number(adults),
    Number(children),
    Number(pets),
  );

  const now = nowTimestamp();
  // Attributs dans l'ordre de Reservation::create() puis timestamps (updated_at, created_at) et id
  const attributes: Row = {
    guest_id: user.id,
    listing_id: listing.id,
    check_in: ymd(parseCarbon(validated.check_in)),
    check_out: ymd(parseCarbon(validated.check_out)),
    adults,
    children,
    infants,
    pets,
    guests_count: Number(adults) + Number(children),
    nights_count: price.nights,
    price_per_night: price.price_per_night,
    cleaning_fee: price.cleaning_fee,
    service_fee: price.service_fee,
    total_price: price.total,
    currency: listing.currency,
    status: 'pending',
    guest_message: validated.guest_message ?? null,
    updated_at: now,
    created_at: now,
  };

  const created = must(await db().from('reservations').insert(attributes).select('id').single()) as Row;
  const reservation: Row = { ...attributes, id: created.id };

  // $reservation->load('listing') : la ligne lue ci-dessus
  return json(
    {
      message: 'Réservation créée avec succès.',
      reservation: reservationToArray(reservation, listing, Object.keys(reservation)),
    },
    201,
  );
});

/** ReservationController::guestReservations */
export const GET = route(async (req) => {
  const { user } = await authenticate(req);

  const reservations = await fetchAll<Row>(() =>
    db()
      .from('reservations')
      .select(RESERVATION_WITH_LISTING)
      .eq('guest_id', user.id)
      .order('check_in', { ascending: false })
      .order('id', { ascending: false }),
  );

  return json({
    reservations: reservations.map((reservation) => reservationToArray(reservation, reservation.listing ?? null)),
  });
});
