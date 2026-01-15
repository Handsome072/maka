'use client';

import { useRouter } from 'next/navigation';
import { Messages } from '@/app/pages/Messages';
import { getNavigationPath } from '@/app/config/routes';

/**
 * Page Messages Next.js
 * Réutilise le composant Messages existant
 */
export default function MessagesPage() {
  const router = useRouter();

  // Handle navigation
  const handleNavigate = (page: string) => {
    if (page === 'home' || page === 'logements') {
      router.push('/');
    } else {
      const path = getNavigationPath(page as any);
      router.push(path);
    }
  };

  return <Messages onNavigate={handleNavigate} />;
}

