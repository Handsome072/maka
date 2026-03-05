'use client';

import { useRouter } from 'next/navigation';
import { Annonces } from '@/app/pages/Annonces';
import { getNavigationPath } from '@/app/config/routes';

/**
 * Page Annonces Next.js
 * Réutilise le composant Annonces existant
 */
export default function AnnoncesPage() {
  const router = useRouter();

  // Handle navigation
  const handleNavigate = (page: string, data?: any) => {
    if (page === 'home' || page === 'logements') {
      router.push('/');
    } else if (page === 'edit-listing') {
      const params = new URLSearchParams();
      if (data?.listingId) params.set('id', data.listingId);
      if (data?.listingTitle) params.set('title', data.listingTitle);
      router.push(`/annonces/edit?${params.toString()}`);
    } else if (page === 'identity-verification') {
      router.push('/identity-verification');
    } else {
      const path = getNavigationPath(page as Parameters<typeof getNavigationPath>[0]);
      router.push(path);
    }
  };

  return (
    <Annonces 
      onNavigate={handleNavigate}
      showConfirmationPopup={false}
      onConfirmationComplete={() => {}}
      uploadedPhotos={[]}
      listingTitle="Mon annonce"
    />
  );
}

