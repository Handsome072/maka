import { ymd } from '@/server/format';
import { input, json, route } from '@/server/http';
import { DAY_MS, parseCarbon, startOfDayUtc, type Row } from '@/server/listings';
import { blockedNights, expireStaleRequests } from '@/server/reservations';
import { db, fetchAll } from '@/server/supabase';
import { validate } from '@/server/validation';
import { BLOCKING_STATUSES } from '@/shared/booking';

export const dynamic = 'force-dynamic';

/** ReservationController::checkAvailability — nuits réservées, demandées ou bloquées par l'hôte dans l'intervalle (public). */
export const POST = route(async (req) => {
  const validated = await validate(await input(req), {
    listing_id: 'required|exists:listings,id',
    check_in: 'required|date',
    check_out: 'required|date|after:check_in',
  });

  // Une demande restée sans réponse au-delà de son échéance libère ses dates
  await expireStaleRequests({ listingId: Number(validated.listing_id) });

  const checkIn = parseCarbon(validated.check_in);
  const checkOut = parseCarbon(validated.check_out);

  // MySQL comparait les colonnes DATE à des datetimes ('Y-m-d H:i:s') :
  //   check_in < $checkOut  ⇔ check_in < jour suivant si $checkOut a une heure, sinon < jour de $checkOut
  //   check_out > $checkIn  ⇔ check_out > jour de $checkIn
  const checkOutDay = startOfDayUtc(checkOut);
  const checkInUpperBound =
    checkOut.getTime() > checkOutDay.getTime() ? new Date(checkOutDay.getTime() + DAY_MS) : checkOutDay;

  const conflicting = await fetchAll<Row>(() =>
    db()
      .from('reservations')
      .select('id, check_in, check_out')
      .eq('listing_id', validated.listing_id)
      .in('status', BLOCKING_STATUSES)
      .lt('check_in', ymd(checkInUpperBound))
      .gt('check_out', ymd(checkIn))
      .order('id'),
  );

  const conflictingDates: string[] = [];
  for (const reservation of conflicting) {
    const start = parseCarbon(reservation.check_in).getTime();
    const end = parseCarbon(reservation.check_out).getTime();

    let cursor = Math.max(start, checkIn.getTime());
    const limit = Math.min(end, checkOut.getTime());
    while (cursor < limit) {
      conflictingDates.push(ymd(new Date(cursor)) as string);
      cursor += DAY_MS;
    }
  }

  // Nuits bloquées par l'hôte dans son calendrier
  conflictingDates.push(
    ...(await blockedNights(Number(validated.listing_id), ymd(checkIn) as string, ymd(checkInUpperBound) as string)),
  );

  const dates = [...new Set(conflictingDates)].sort();

  return json({
    available: dates.length === 0,
    conflicting_dates: dates,
  });
});
