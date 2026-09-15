import { float, round } from '@/server/format';
import type { Row } from './casts';

/**
 * ReservationController::computePrice et utilitaires de dates (Carbon 3, application en UTC).
 */

export const DAY_MS = 86_400_000;

/** Carbon::parse() en UTC : "Y-m-d" à minuit, "Y-m-d H:i[:s]" sans fuseau en UTC. */
export function parseCarbon(value: unknown): Date {
  const text = String(value ?? '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return new Date(`${text}T00:00:00Z`);
  }
  const match = text.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)$/);
  if (match) {
    return new Date(`${match[1]}T${match[2]}Z`);
  }
  return new Date(text);
}

/** ->startOfDay() en UTC */
export function startOfDayUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** Carbon 3 : $from->diffInDays($to) renvoie un float signé (fraction de jour comprise). */
export function carbonDiffInDays(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / DAY_MS;
}

export type PriceBreakdown = {
  nights: number;
  price_per_night: number;
  base_total: number;
  cleaning_fee: number;
  extra_guest_fee: number;
  pet_fee: number;
  service_fee: number;
  total: number;
};

/** computePrice($listing, $checkIn, $checkOut, $adults, $children, $pets) */
export function computePrice(
  listing: Row,
  checkIn: unknown,
  checkOut: unknown,
  adults: number,
  children: number,
  pets: number,
): PriceBreakdown {
  const nights = carbonDiffInDays(parseCarbon(checkIn), parseCarbon(checkOut));

  const pricePerNight = float(listing.base_price);
  const baseTotal = nights * pricePerNight;
  const cleaningFee = float(listing.cleaning_fee ?? 0);
  const extraGuestFee =
    Math.max(0, adults + children - Math.trunc(Number(listing.capacity ?? 0))) * float(listing.extra_guest_fee ?? 0) * nights;
  const petFee = pets > 0 ? float(listing.pet_fee ?? 0) * nights : 0;
  const serviceFee = round(baseTotal * 0.12, 2);
  const total = round(baseTotal + cleaningFee + extraGuestFee + petFee + serviceFee, 2);

  return {
    nights,
    price_per_night: pricePerNight,
    base_total: baseTotal,
    cleaning_fee: cleaningFee,
    extra_guest_fee: extraGuestFee,
    pet_fee: petFee,
    service_fee: serviceFee,
    total,
  };
}
