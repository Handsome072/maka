/** Affichage des prix, dates et voyageurs d'une réservation. */

export function formatMoney(amount: number | string | null | undefined, currency = 'EUR'): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount ?? 0;
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency || 'EUR' }).format(
    Number.isFinite(value) ? value : 0,
  );
}

function ymdDate(ymd: string): Date {
  return new Date(`${ymd.slice(0, 10)}T00:00:00Z`);
}

/** « sam. 18 oct. 2026 » */
export function formatStayDay(ymd: string): string {
  return ymdDate(ymd).toLocaleDateString('fr-FR', {
    timeZone: 'UTC',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** « 18 oct. – 13 nov. 2026 », ou « 28 déc. 2026 – 3 janv. 2027 » d'une année à l'autre. */
export function formatStayRange(checkIn: string, checkOut: string): string {
  const start = ymdDate(checkIn);
  const end = ymdDate(checkOut);
  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const day = (date: Date, withYear: boolean) =>
    date.toLocaleDateString('fr-FR', {
      timeZone: 'UTC',
      day: 'numeric',
      month: 'short',
      ...(withYear ? { year: 'numeric' } : {}),
    });
  return `${day(start, !sameYear)} – ${day(end, true)}`;
}

/** Date et heure locales d'un horodatage : « 12 octobre à 16:10 ». */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  const day = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${day} à ${time}`;
}

/** « 2 adultes, 1 enfant, 1 bébé, 1 animal » */
export function formatGuestsDetail(guests: { adults: number; children: number; infants: number; pets: number }): string {
  const parts = [`${guests.adults} adulte${guests.adults > 1 ? 's' : ''}`];
  if (guests.children > 0) parts.push(`${guests.children} enfant${guests.children > 1 ? 's' : ''}`);
  if (guests.infants > 0) parts.push(`${guests.infants} bébé${guests.infants > 1 ? 's' : ''}`);
  if (guests.pets > 0) parts.push(`${guests.pets} ${guests.pets > 1 ? 'animaux' : 'animal'}`);
  return parts.join(', ');
}

/** « 14:00 » ou « 14h » tels que saisis par l'hôte ; repli sur l'horaire par défaut. */
export function formatHour(value: string | null | undefined, fallback: string): string {
  return value && value.trim() ? value.trim() : fallback;
}

/** Temps restant avant une échéance : « 5 h 12 », « 40 min » ; null si elle est dépassée. */
export function formatTimeLeft(iso: string | null | undefined, now: number = Date.now()): string | null {
  if (!iso) return null;
  const minutes = Math.floor((Date.parse(iso) - now) / 60_000);
  if (minutes <= 0) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `${hours} h ${String(rest).padStart(2, '0')}` : `${hours} h`;
}

/** Montant qui revient à l'hôte : total payé par le voyageur moins les frais de service Séjoura. */
export function hostAmount(reservation: { total_price: string | null; service_fee: string | null }): number {
  const total = parseFloat(reservation.total_price ?? '') || 0;
  const fee = parseFloat(reservation.service_fee ?? '') || 0;
  return Math.round((total - fee) * 100) / 100;
}
