import { TRIP_PHASE_LABELS, type TripPhase } from '@/shared/booking';

const PHASE_STYLES: Record<TripPhase, string> = {
  pending: 'bg-amber-100 text-amber-800',
  upcoming: 'bg-green-100 text-green-800',
  ongoing: 'bg-cyan-100 text-cyan-800',
  past: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-50 text-red-700',
  declined: 'bg-red-50 text-red-700',
  expired: 'bg-gray-100 text-gray-600',
};

/** Libellés vus par l'hôte : une demande en attente est à traiter de son côté. */
export const HOST_PHASE_LABELS: Record<TripPhase, string> = {
  ...TRIP_PHASE_LABELS,
  pending: 'Demande à traiter',
  upcoming: 'À venir',
};

export function ReservationStatusBadge({
  phase,
  label,
  className = '',
}: {
  phase: TripPhase;
  /** Remplace le libellé du voyageur (ex. HOST_PHASE_LABELS). */
  label?: string;
  className?: string;
}) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs whitespace-nowrap ${PHASE_STYLES[phase]} ${className}`} style={{ fontWeight: 600 }}>
      {label ?? TRIP_PHASE_LABELS[phase]}
    </span>
  );
}
