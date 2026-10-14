import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// ─── Types ──────────────────────────────────────────────────────────────────────

export type DateStatus = 'available' | 'reserved' | 'blocked';

export interface CalendarDate {
  date: string; // 'YYYY-MM-DD'
  status: DateStatus;
  customPrice: number | null;
  reservationId: string | null;
}

export interface CalendarReservation {
  id: string;
  guestName: string;
  checkIn: string; // 'YYYY-MM-DD'
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// ─── Style constants ────────────────────────────────────────────────────────────

export const DATE_STATUS_CONFIG: Record<
  DateStatus,
  { label: string; bg: string; color: string; cellBg: string }
> = {
  available: { label: 'Disponible', bg: '#F0FDF4', color: '#166534', cellBg: '#ffffff' },
  reserved: { label: 'Réservé', bg: '#EBF5FF', color: '#1E40AF', cellBg: '#EBF5FF' },
  blocked: { label: 'Bloqué', bg: '#FEF2F2', color: '#991B1B', cellBg: '#FEF2F2' },
};

export const RESERVATION_BAR_COLORS: Record<CalendarReservation['status'], string> = {
  confirmed: '#222222',
  pending: '#B45309',
  cancelled: '#9CA3AF',
};

export const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// ─── Jours du mois ──────────────────────────────────────────────────────────────

/**
 * Statut de chaque jour du mois : réservé si une réservation (en attente ou confirmée) occupe la nuit
 * (arrivée incluse, départ exclu), bloqué si l'hôte a bloqué la nuit. Pas de prix par date : null.
 */
export function buildCalendarDates(
  month: Date,
  reservations: CalendarReservation[],
  blockedDates: Set<string>,
): CalendarDate[] {
  const days = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) });
  return days.map((day) => {
    const date = format(day, 'yyyy-MM-dd');
    const reservation = reservations.find(
      (r) => r.status !== 'cancelled' && date >= r.checkIn && date < r.checkOut,
    );
    if (reservation) {
      return { date, status: 'reserved', customPrice: null, reservationId: reservation.id };
    }
    return { date, status: blockedDates.has(date) ? 'blocked' : 'available', customPrice: null, reservationId: null };
  });
}
