'use client';

import { useRouter } from 'next/navigation';
import { HostReservations } from '@/app/pages/HostReservations';
import { getNavigationPath } from '@/app/config/routes';

export default function HostReservationsPage() {
  const router = useRouter();

  const handleNavigate = (page: string, data?: any) => {
    if (page === 'home' || page === 'logements') {
      router.push('/');
    } else {
      const path = getNavigationPath(page as Parameters<typeof getNavigationPath>[0]);
      router.push(path);
    }
  };

  return <HostReservations onNavigate={handleNavigate} />;
}
