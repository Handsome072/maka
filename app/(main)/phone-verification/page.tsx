'use client';

import { useRouter } from 'next/navigation';
import { PhoneVerification } from '@/app/pages/PhoneVerification';
import { getNavigationPath } from '@/app/config/routes';

/**
 * Page Phone Verification Next.js
 * Réutilise le composant PhoneVerification existant
 */
export default function PhoneVerificationPage() {
  const router = useRouter();

  // Handle navigation
  const handleNavigate = (page: string, data?: any) => {
    if (page === 'annonces') {
      router.push('/annonces');
    } else if (page === 'home' || page === 'logements') {
      router.push('/');
    } else {
      const path = getNavigationPath(page as any);
      router.push(path);
    }
  };

  return (
    <PhoneVerification 
      onNavigate={handleNavigate}
    />
  );
}

