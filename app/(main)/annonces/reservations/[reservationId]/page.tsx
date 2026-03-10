import { HostReservationDetailClient } from './HostReservationDetailClient';

export function generateStaticParams() {
  return Array.from({ length: 5000 }, (_, i) => ({
    reservationId: String(i + 1),
  }));
}

export default function HostReservationDetailPage() {
  return <HostReservationDetailClient />;
}
