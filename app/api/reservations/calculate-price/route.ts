import { input, json, notFound, route } from '@/server/http';
import { computePrice, type Row } from '@/server/listings';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** ReservationController::calculatePrice — détail du prix sans créer de réservation (public). */
export const POST = route(async (req) => {
  const validated = await validate(await input(req), {
    listing_id: 'required|exists:listings,id',
    check_in: 'required|date|after_or_equal:today',
    check_out: 'required|date|after:check_in',
    adults: 'integer|min:1',
    children: 'integer|min:0',
    pets: 'integer|min:0',
  });

  const adults = Number(validated.adults ?? 1);
  const children = Number(validated.children ?? 0);
  const pets = Number(validated.pets ?? 0);

  const listing = must(await db().from('listings').select('*').eq('id', validated.listing_id).maybeSingle()) as Row | null;
  if (!listing) {
    notFound('Listing', validated.listing_id);
  }

  const price = computePrice(listing, validated.check_in, validated.check_out, adults, children, pets);

  return json({
    currency: listing.currency,
    nights: price.nights,
    price_per_night: price.price_per_night,
    base_total: price.base_total,
    cleaning_fee: price.cleaning_fee,
    extra_guest_fee: price.extra_guest_fee,
    pet_fee: price.pet_fee,
    service_fee: price.service_fee,
    total: price.total,
  });
});
