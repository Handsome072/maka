import { ymd } from '@/server/format';
import { input, json, route } from '@/server/http';
import { DAY_MS, parseCarbon, startOfDayUtc, type Row } from '@/server/listings';
import { db, fetchAll } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/** ReservationController::checkAvailability — dates déjà réservées dans l'intervalle demandé (public). */
export const POST = route(async (req) => {
  const validated = await validate(await input(req), {
    listing_id: 'required|exists:listings,id',
    check_in: 'required|date',
    check_out: 'required|date|after:check_in',
  });

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
      .in('status', ['pending', 'confirmed', 'active'])
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

  const dates = [...new Set(conflictingDates)].sort();

  return json({
    available: dates.length === 0,
    conflicting_dates: dates,
  });
});
