import { ReservationDetailClient } from './ReservationDetailClient';

/**
 * Generate static params for reservation detail pages
 * These IDs correspond to mock reservations
 */
export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({
    reservationId: String(i + 1),
  }));
}

/**
 * Page Détail de réservation
 */
export default function ReservationDetailPage() {
  return <ReservationDetailClient />;
}

