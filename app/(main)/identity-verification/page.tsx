'use client';

import { useRouter } from 'next/navigation';
import { IdentityVerification } from '@/app/pages/IdentityVerification';
import { getNavigationPath } from '@/app/config/routes';

/**
 * Page Identity Verification Next.js
 * Réutilise le composant IdentityVerification existant
 */
export default function IdentityVerificationPage() {
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
    <IdentityVerification 
      onNavigate={handleNavigate}
      listingTitle="Mon annonce"
    />
  );
}

