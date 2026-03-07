'use client';

import { useParams } from 'next/navigation';
import { HostReservationDetail } from '@/app/components/host-reservations/HostReservationDetail';

export function HostReservationDetailClient() {
  const params = useParams();
  const reservationId = params.reservationId as string;

  return <HostReservationDetail reservationId={reservationId} />;
}
