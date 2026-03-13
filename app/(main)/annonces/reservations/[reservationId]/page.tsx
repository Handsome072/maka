import { HostReservationDetailClient } from './HostReservationDetailClient';

export function generateStaticParams() {
  return Array.from({ length: 5000 }, (_, i) => ({
    reservationId: `RES-${String(i + 1).padStart(3, '0')}`,
  }));
}

export default function HostReservationDetailPage() {
  return <HostReservationDetailClient />;
}
