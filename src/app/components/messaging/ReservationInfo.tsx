import { CalendarDays, Users, MessageSquare } from 'lucide-react';
import type { ConversationReservation } from '@/app/services/api';

interface ReservationInfoProps {
  reservation: ConversationReservation | null;
  listing?: { id: number; title: string; photo_url: string | null } | null;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: '#92400E', bg: '#FEF3C7' },
  confirmed: { label: 'Confirmée', color: '#065F46', bg: '#D1FAE5' },
  active: { label: 'En cours', color: '#1E40AF', bg: '#DBEAFE' },
  completed: { label: 'Terminée', color: '#374151', bg: '#F3F4F6' },
  cancelled: { label: 'Annulée', color: '#991B1B', bg: '#FEE2E2' },
};

export function ReservationInfo({ reservation, listing }: ReservationInfoProps) {
  // Direct message (no reservation)
  if (!reservation) {
    const directListing = listing;
    return (
      <div className="border-l border-gray-200 w-[300px] flex-shrink-0 hidden xl:flex flex-col bg-white">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: '#717171' }}>
            MESSAGE DIRECT
          </h3>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {directListing && (
            <div>
              {directListing.photo_url && (
                <img
                  src={directListing.photo_url}
                  alt={directListing.title}
                  className="w-full h-36 object-cover rounded-xl mb-3"
                />
              )}
              <h4 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                {directListing.title}
              </h4>
            </div>
          )}
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#717171' }} />
            <p className="text-sm" style={{ color: '#717171' }}>
              Conversation sans réservation
            </p>
          </div>
        </div>
      </div>
    );
  }

  const status = STATUS_LABELS[reservation.status] || STATUS_LABELS.pending;

  return (
    <div className="border-l border-gray-200 w-[300px] flex-shrink-0 hidden xl:flex flex-col bg-white">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: '#717171' }}>
          DÉTAILS DE LA RÉSERVATION
        </h3>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Listing */}
        <div>
          {reservation.listing.photo_url && (
            <img
              src={reservation.listing.photo_url}
              alt={reservation.listing.title}
              className="w-full h-36 object-cover rounded-xl mb-3"
            />
          )}
          <h4 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
            {reservation.listing.title}
          </h4>
        </div>

        {/* Status */}
        <div>
          <span
            className="inline-block px-3 py-1 rounded-full text-xs"
            style={{ fontWeight: 600, color: status.color, backgroundColor: status.bg }}
          >
            {status.label}
          </span>
        </div>

        {/* Dates */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CalendarDays className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#717171' }} />
            <div>
              <p className="text-xs" style={{ color: '#717171', fontWeight: 500 }}>
                Arrivée
              </p>
              <p className="text-sm" style={{ color: '#222222', fontWeight: 500 }}>
                {formatDate(reservation.check_in)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#717171' }} />
            <div>
              <p className="text-xs" style={{ color: '#717171', fontWeight: 500 }}>
                Départ
              </p>
              <p className="text-sm" style={{ color: '#222222', fontWeight: 500 }}>
                {formatDate(reservation.check_out)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#717171' }} />
            <div>
              <p className="text-xs" style={{ color: '#717171', fontWeight: 500 }}>
                Voyageurs
              </p>
              <p className="text-sm" style={{ color: '#222222', fontWeight: 500 }}>
                {reservation.guests_count} voyageur{reservation.guests_count > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
