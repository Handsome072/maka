'use client';

import { useRouter } from 'next/navigation';
import { ClientSpace } from '@/app/pages/ClientSpace';

/**
 * Client Space Page - Renders the full ClientSpace component
 * This component includes its own header, sidebar, and all client space functionality
 */
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

  return <ClientSpace onNavigate={handleNavigate} />;
}

