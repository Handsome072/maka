import { HostReservationDetailClient } from './HostReservationDetailClient';

export function generateStaticParams() {
  return [
    'RES-001', 'RES-002', 'RES-003', 'RES-004', 'RES-005',
    'RES-006', 'RES-007', 'RES-008', 'RES-009',
  ].map(id => ({ reservationId: id }));
}

export default function HostReservationDetailPage() {
  return <HostReservationDetailClient />;
}
