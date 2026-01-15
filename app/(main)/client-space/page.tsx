'use client';

import { useRouter } from 'next/navigation';
import { ClientSpace } from '@/app/pages/ClientSpace';
import { getNavigationPath } from '@/app/config/routes';

/**
 * Page Client Space Next.js
 * Réutilise le composant ClientSpace existant
 */
export default function ClientSpacePage() {
  const router = useRouter();

  // Handle navigation
  const handleNavigate = (page: string, data?: any) => {
    if (page === 'home' || page === 'logements') {
      router.push('/');
    } else {
      const path = getNavigationPath(page as any);
      router.push(path);
    }
  };

  return <ClientSpace onNavigate={handleNavigate} />;
}

