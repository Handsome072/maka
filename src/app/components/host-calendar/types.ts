import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWeekend,
  parseISO,
  isWithinInterval,
} from 'date-fns';

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

export interface CalendarListing {
  id: number;
  title: string;
  city: string;
  basePrice: number;
  weekendPrice: number | null;
  currency: string;
}

export interface DateUpdatePayload {
  listingId: number;
  dates: string[];
  customPrice?: number | null;
  status?: 'available' | 'blocked';
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

// ─── Mock listings ──────────────────────────────────────────────────────────────

export const MOCK_LISTINGS: CalendarListing[] = [
  {
    id: 1,
    title: 'Chalet Mont-Tremblant',
    city: 'Mont-Tremblant',
    basePrice: 350,
    weekendPrice: 420,
    currency: 'CAD',
  },
  {
    id: 2,
    title: 'Appartement Vieux-Montréal',
    city: 'Montréal',
    basePrice: 196,
    weekendPrice: 230,
    currency: 'CAD',
  },
];

// ─── Mock reservations ──────────────────────────────────────────────────────────

const MOCK_RESERVATIONS_BY_LISTING: Record<number, CalendarReservation[]> = {
  1: [
    {
      id: 'RES-001',
      guestName: 'Alexandre Leroy',
      checkIn: '2026-03-22',
      checkOut: '2026-03-29',
      status: 'confirmed',
    },
    {
      id: 'RES-003',
      guestName: 'Lucas Bouchard',
      checkIn: '2026-03-15',
      checkOut: '2026-03-20',
      status: 'confirmed',
    },
    {
      id: 'RES-007',
      guestName: 'Marc Rousseau',
      checkIn: '2026-03-28',
      checkOut: '2026-04-04',
      status: 'pending',
    },
    {
      id: 'RES-005',
      guestName: 'Thomas Dubois',
      checkIn: '2026-02-01',
      checkOut: '2026-02-08',
      status: 'confirmed',
    },
    {
      id: 'RES-010',
      guestName: 'Claire Fontaine',
      checkIn: '2026-04-10',
      checkOut: '2026-04-17',
      status: 'confirmed',
    },
  ],
  2: [
    {
      id: 'RES-002',
      guestName: 'Camille Bernard',
      checkIn: '2026-03-03',
      checkOut: '2026-03-08',
      status: 'confirmed',
    },
    {
      id: 'RES-006',
      guestName: 'Julie Martin',
      checkIn: '2026-02-20',
      checkOut: '2026-02-25',
      status: 'cancelled',
    },
    {
      id: 'RES-004',
      guestName: 'Sophie Moreau',
      checkIn: '2026-02-10',
      checkOut: '2026-02-14',
      status: 'confirmed',
    },
    {
      id: 'RES-008',
      guestName: 'Émilie Tremblay',
      checkIn: '2026-04-05',
      checkOut: '2026-04-12',
      status: 'pending',
    },
  ],
};

const BLOCKED_DATES_BY_LISTING: Record<number, string[]> = {
  1: [
    '2026-03-01', '2026-03-02', '2026-03-03',
    '2026-04-20', '2026-04-21', '2026-04-22', '2026-04-23',
  ],
  2: [
    '2026-03-14', '2026-03-15',
    '2026-04-01', '2026-04-02', '2026-04-03',
  ],
};

const CUSTOM_PRICES_BY_LISTING: Record<number, Record<string, number>> = {
  1: {
    '2026-03-07': 400,
    '2026-03-08': 400,
    '2026-03-14': 380,
  },
  2: {
    '2026-03-06': 220,
    '2026-03-07': 220,
    '2026-03-08': 220,
  },
};

// ─── Mock data generator ────────────────────────────────────────────────────────

export function generateMockCalendarData(
  listingId: number,
  year: number,
  month: number // 0-based
): { dates: CalendarDate[]; reservations: CalendarReservation[] } {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const reservations = (MOCK_RESERVATIONS_BY_LISTING[listingId] || []).filter((r) => {
    const checkIn = parseISO(r.checkIn);
    const checkOut = parseISO(r.checkOut);
    return (
      isWithinInterval(monthStart, { start: checkIn, end: checkOut }) ||
      isWithinInterval(monthEnd, { start: checkIn, end: checkOut }) ||
      isWithinInterval(checkIn, { start: monthStart, end: monthEnd }) ||
      isWithinInterval(checkOut, { start: monthStart, end: monthEnd })
    );
  });

  const blocked = new Set(BLOCKED_DATES_BY_LISTING[listingId] || []);
  const customPrices = CUSTOM_PRICES_BY_LISTING[listingId] || {};

  const dates: CalendarDate[] = days.map((day) => {
    const dateStr = format(day, 'yyyy-MM-dd');

    const matchingRes = reservations.find((r) => {
      const checkIn = parseISO(r.checkIn);
      const checkOut = parseISO(r.checkOut);
      return isWithinInterval(day, { start: checkIn, end: checkOut }) && dateStr !== r.checkOut;
    });

    let status: DateStatus = 'available';
    let reservationId: string | null = null;

    if (matchingRes && matchingRes.status !== 'cancelled') {
      status = 'reserved';
      reservationId = matchingRes.id;
    } else if (blocked.has(dateStr)) {
      status = 'blocked';
    }

    const listing = MOCK_LISTINGS.find((l) => l.id === listingId);
    let customPrice: number | null = customPrices[dateStr] ?? null;
    if (customPrice === null && listing?.weekendPrice && isWeekend(day)) {
      customPrice = listing.weekendPrice;
    }

    return { date: dateStr, status, customPrice, reservationId };
  });

  return { dates, reservations };
}
