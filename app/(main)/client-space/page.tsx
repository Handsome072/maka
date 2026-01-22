'use client';

import { useRouter } from 'next/navigation';
import { ClientSpace } from '@/app/pages/ClientSpace';

export default function ClientSpacePage() {
  const router = useRouter();

  const handleNavigate = (page: 'logements' | 'messages' | 'annonces' | 'host-onboarding') => {
    switch (page) {
      case 'logements':
        router.push('/');
        break;
      case 'messages':
        router.push('/messages');
        break;
      case 'annonces':
        router.push('/annonces');
        break;
      case 'host-onboarding':
        router.push('/host-onboarding');
        break;
    }
  };

  return <ClientSpace onNavigate={handleNavigate} initialSection="reservations" />;
}
