/**
 * Règles de réservation partagées entre l'API (src/server) et les pages (src/app) :
 * politiques d'annulation, phases d'un séjour, jours d'arrivée et de départ.
 * Aucune dépendance : les dates de séjour sont des chaînes « AAAA-MM-JJ » traitées en UTC.
 */

const DAY_MS = 86_400_000;

// ─── Dates « AAAA-MM-JJ » ─────────────────────────────────────────────────────

function ymdToUtc(ymd: string): number {
  return Date.parse(`${ymd.slice(0, 10)}T00:00:00Z`);
}

function utcToYmd(time: number): string {
  return new Date(time).toISOString().slice(0, 10);
}

export function addDaysYmd(ymd: string, days: number): string {
  return utcToYmd(ymdToUtc(ymd) + days * DAY_MS);
}

export function nightsBetweenYmd(checkIn: string, checkOut: string): number {
  return Math.round((ymdToUtc(checkOut) - ymdToUtc(checkIn)) / DAY_MS);
}

/** « 17 octobre », ou « 17 octobre 2027 » avec l'année. */
export function formatDayFr(ymd: string, withYear = false): string {
  return new Date(ymdToUtc(ymd)).toLocaleDateString('fr-FR', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
    ...(withYear ? { year: 'numeric' } : {}),
  });
}

// ─── Politiques d'annulation ──────────────────────────────────────────────────

export type CancellationPolicy = 'flexible' | 'moderate' | 'strict';

export const CANCELLATION_POLICIES: CancellationPolicy[] = ['flexible', 'moderate', 'strict'];

export const CANCELLATION_POLICY_LABELS: Record<CancellationPolicy, string> = {
  flexible: 'Flexible',
  moderate: 'Modérée',
  strict: 'Stricte',
};

/** Règles générales, sans dates (annonce, création d'annonce). */
export const CANCELLATION_POLICY_RULES: Record<CancellationPolicy, string[]> = {
  flexible: [
    "Remboursement intégral en cas d'annulation jusqu'à 24 h avant l'arrivée.",
    "Moins de 24 h avant l'arrivée : la première nuit et les frais de service ne sont pas remboursés.",
  ],
  moderate: [
    "Remboursement intégral en cas d'annulation jusqu'à 5 jours avant l'arrivée.",
    'Ensuite : remboursement de 50 % du prix des nuits, frais de service non remboursés.',
  ],
  strict: [
    "Remboursement intégral en cas d'annulation dans les 48 h suivant la réservation, si l'arrivée est dans 14 jours ou plus.",
    "Jusqu'à 7 jours avant l'arrivée : remboursement de 50 % du prix des nuits.",
    "Moins de 7 jours avant l'arrivée : aucun remboursement.",
  ],
};

/** Accepte les anciennes valeurs (« Flexible », « Modérée », « Stricte »…) ; null si inconnue. */
export function normalizeCancellationPolicy(value: unknown): CancellationPolicy | null {
  const text = String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
  if (text === 'flexible') return 'flexible';
  if (text === 'moderate' || text === 'moderee') return 'moderate';
  if (text === 'strict' || text === 'stricte') return 'strict';
  return null;
}

const CLEANING_FEE_LINE = "Les frais de ménage sont remboursés si vous annulez avant l'arrivée.";

export type CancellationSummary = {
  policy: CancellationPolicy;
  label: string;
  /** Phrase courte : « Annulation gratuite jusqu'au 17 octobre ». */
  headline: string;
  /** Détail daté, palier par palier. */
  lines: string[];
};

/**
 * Conditions d'annulation datées d'un séjour.
 * `bookedAt` : moment de la réservation (maintenant si elle n'est pas encore faite).
 */
export function cancellationSummary(policyValue: unknown, checkIn: string, bookedAt: Date = new Date()): CancellationSummary {
  const policy = normalizeCancellationPolicy(policyValue) ?? 'flexible';
  const label = CANCELLATION_POLICY_LABELS[policy];

  if (policy === 'flexible') {
    const until = formatDayFr(addDaysYmd(checkIn, -1));
    return {
      policy,
      label,
      headline: `Annulation gratuite jusqu'au ${until}`,
      lines: [
        `Annulez au plus tard le ${until} pour obtenir un remboursement intégral.`,
        'Après cette date, la première nuit et les frais de service ne sont pas remboursés.',
        CLEANING_FEE_LINE,
      ],
    };
  }

  if (policy === 'moderate') {
    const until = formatDayFr(addDaysYmd(checkIn, -5));
    return {
      policy,
      label,
      headline: `Annulation gratuite jusqu'au ${until}`,
      lines: [
        `Annulez au plus tard le ${until} pour obtenir un remboursement intégral.`,
        'Après cette date, 50 % du prix des nuits est remboursé ; les frais de service ne le sont pas.',
        CLEANING_FEE_LINE,
      ],
    };
  }

  const halfUntil = formatDayFr(addDaysYmd(checkIn, -7));
  const daysAhead = (ymdToUtc(checkIn) - bookedAt.getTime()) / DAY_MS;
  const lines: string[] = [];
  let headline: string;
  if (daysAhead >= 14) {
    const freeUntil = new Date(bookedAt.getTime() + 2 * DAY_MS).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
    });
    headline = `Annulation gratuite jusqu'au ${freeUntil}`;
    lines.push(`Annulez dans les 48 h, au plus tard le ${freeUntil}, pour obtenir un remboursement intégral.`);
  } else {
    headline = daysAhead >= 7 ? `Remboursement de 50 % jusqu'au ${halfUntil}` : 'Non remboursable';
  }
  if (daysAhead >= 7) {
    lines.push(`Jusqu'au ${halfUntil}, 50 % du prix des nuits est remboursé.`);
  }
  lines.push(`Moins de 7 jours avant l'arrivée, le prix des nuits n'est pas remboursé.`);
  lines.push(CLEANING_FEE_LINE);
  return { policy, label, headline, lines };
}

// ─── Remboursement à l'annulation ─────────────────────────────────────────────

/** Montants d'une réservation (chaînes décimales de l'API ou nombres). */
export type RefundInput = {
  total_price: unknown;
  service_fee: unknown;
  cleaning_fee: unknown;
  nights_count: unknown;
  check_in: string;
  created_at: string;
  cancellation_policy: unknown;
};

export type RefundBreakdown = {
  /** Remboursement intégral, partiel ou nul du prix des nuits. */
  tier: 'full' | 'partial' | 'none';
  refund: number;
  nights_refund: number;
  cleaning_refund: number;
  service_refund: number;
  /** Ce qui n'est pas remboursé. */
  retained: number;
  explanation: string;
};

function amountOf(value: unknown): number {
  const parsed = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function cents(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Remboursement dû au voyageur s'il annule maintenant, avant son arrivée, selon la politique figée
 * sur la réservation. Une annulation par l'hôte (ou l'administration) est toujours remboursée intégralement.
 * Les « nuits » regroupent le prix des nuits et les suppléments voyageurs et animaux.
 */
export function computeRefund(
  reservation: RefundInput,
  now: Date = new Date(),
  cancelledBy: 'guest' | 'host' | 'admin' = 'guest',
): RefundBreakdown {
  const total = amountOf(reservation.total_price);
  const service = amountOf(reservation.service_fee);
  const cleaning = amountOf(reservation.cleaning_fee);
  const nightsAmount = Math.max(0, total - service - cleaning);
  const nights = Math.max(1, Math.trunc(amountOf(reservation.nights_count)));

  const result = (tier: RefundBreakdown['tier'], nightsRefund: number, serviceRefund: number, explanation: string) => {
    const refund = cents(nightsRefund + cleaning + serviceRefund);
    return {
      tier,
      refund,
      nights_refund: cents(nightsRefund),
      cleaning_refund: cents(cleaning),
      service_refund: cents(serviceRefund),
      retained: cents(total - refund),
      explanation,
    };
  };

  if (cancelledBy !== 'guest') {
    return result('full', nightsAmount, service, "Annulation par l'hôte : le voyageur est remboursé intégralement.");
  }

  const policy = normalizeCancellationPolicy(reservation.cancellation_policy) ?? 'flexible';
  const checkIn = reservation.check_in.slice(0, 10);
  const today = utcToYmd(now.getTime());

  if (policy === 'flexible') {
    if (today <= addDaysYmd(checkIn, -1)) {
      return result('full', nightsAmount, service, "Annulation au moins la veille de l'arrivée : remboursement intégral.");
    }
    return result(
      'partial',
      nightsAmount - nightsAmount / nights,
      0,
      "Annulation le jour de l'arrivée : la première nuit et les frais de service ne sont pas remboursés.",
    );
  }

  if (policy === 'moderate') {
    if (today <= addDaysYmd(checkIn, -5)) {
      return result('full', nightsAmount, service, "Annulation au moins 5 jours avant l'arrivée : remboursement intégral.");
    }
    return result(
      'partial',
      nightsAmount / 2,
      0,
      "Annulation moins de 5 jours avant l'arrivée : 50 % du prix des nuits est remboursé, les frais de service ne le sont pas.",
    );
  }

  const bookedAt = Date.parse(reservation.created_at);
  const withinGrace = now.getTime() - bookedAt <= 2 * DAY_MS;
  const bookedFarAhead = ymdToUtc(checkIn) - bookedAt >= 14 * DAY_MS;
  if (withinGrace && bookedFarAhead) {
    return result('full', nightsAmount, service, 'Annulation dans les 48 h suivant la réservation : remboursement intégral.');
  }
  if (today <= addDaysYmd(checkIn, -7)) {
    return result(
      'partial',
      nightsAmount / 2,
      0,
      "Annulation au moins 7 jours avant l'arrivée : 50 % du prix des nuits est remboursé, les frais de service ne le sont pas.",
    );
  }
  return result(
    'none',
    0,
    0,
    "Annulation moins de 7 jours avant l'arrivée : le prix des nuits et les frais de service ne sont pas remboursés.",
  );
}

// ─── Statuts et phases ────────────────────────────────────────────────────────

export type ReservationStatus =
  | 'awaiting_payment'
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'declined'
  | 'expired';

/**
 * Statuts qui occupent les dates du logement : paiement en cours (30 minutes au plus),
 * demande en attente (jusqu'à la réponse de l'hôte), réservation confirmée.
 */
export const BLOCKING_STATUSES: ReservationStatus[] = ['awaiting_payment', 'pending', 'confirmed', 'active'];

/** Délai de réponse de l'hôte à une demande. */
export const REQUEST_RESPONSE_HOURS = 24;

/** Échéance d'une demande : 24 h pour répondre, et au plus tard la fin du jour d'arrivée. */
export function requestDeadline(now: Date, checkIn: string): string {
  return new Date(
    Math.min(now.getTime() + REQUEST_RESPONSE_HOURS * 3_600_000, ymdToUtc(checkIn) + DAY_MS),
  ).toISOString();
}

/** Où en est le séjour, vu par le voyageur : le statut stocké, croisé avec les dates. */
export type TripPhase = 'pending' | 'upcoming' | 'ongoing' | 'past' | 'cancelled' | 'declined' | 'expired';

export const TRIP_PHASE_LABELS: Record<TripPhase, string> = {
  pending: "En attente de l'hôte",
  upcoming: 'Confirmée',
  ongoing: 'En cours',
  past: 'Terminée',
  cancelled: 'Annulée',
  declined: 'Refusée',
  expired: 'Expirée',
};

export function tripPhase(status: string, checkIn: string, checkOut: string, today: string): TripPhase {
  switch (status) {
    case 'awaiting_payment':
      return 'pending';
    case 'pending':
    case 'cancelled':
    case 'declined':
    case 'expired':
      return status;
    case 'completed':
      return 'past';
    default:
      if (today >= checkOut.slice(0, 10)) return 'past';
      if (today >= checkIn.slice(0, 10)) return 'ongoing';
      return 'upcoming';
  }
}

// ─── Règles de séjour de l'annonce ────────────────────────────────────────────

/** Clés des jours dans arrival_days / departure_days, dans l'ordre de Date.getDay(). */
const WEEKDAY_KEYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const WEEKDAY_NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

export function weekdayName(weekday: number): string {
  return WEEKDAY_NAMES[weekday];
}

/** Durées min / max (0 = pas de maximum), comme les lit la page de l'annonce. */
export function stayLimits(minStay: unknown, maxStay: unknown): { minStay: number; maxStay: number } {
  const min = Math.max(1, parseInt(String(minStay ?? ''), 10) || 1);
  const max = parseInt(String(maxStay ?? ''), 10) || 0;
  return { minStay: min, maxStay: max >= min ? max : 0 };
}

/**
 * Jour autorisé par arrival_days / departure_days ({ Lun: true, Sam: false, … }).
 * Pas de règle, ou aucun jour coché : tous les jours sont autorisés.
 */
export function weekdayAllowed(days: unknown, weekday: number): boolean {
  if (!days || typeof days !== 'object' || Array.isArray(days)) return true;
  const map = days as Record<string, unknown>;
  if (!Object.values(map).some((value) => value === true)) return true;
  return map[WEEKDAY_KEYS[weekday]] !== false;
}

/** Jour de la semaine d'une date « AAAA-MM-JJ » (0 = dimanche). */
export function weekdayOfYmd(ymd: string): number {
  return new Date(ymdToUtc(ymd)).getUTCDay();
}
