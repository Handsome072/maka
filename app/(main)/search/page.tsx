'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SearchResults } from '@/app/pages/SearchResults';
import { getNavigationPath } from '@/app/config/routes';
import { Suspense } from 'react';

/**
 * Component interne pour les résultats de recherche
 */
function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse search params
  const params = {
    destination: searchParams.get('destination') || '',
    checkInDate: searchParams.get('checkIn') ? new Date(searchParams.get('checkIn')!) : null,
    checkOutDate: searchParams.get('checkOut') ? new Date(searchParams.get('checkOut')!) : null,
    guestsCount: {
      adults: parseInt(searchParams.get('adults') || '0'),
      children: parseInt(searchParams.get('children') || '0'),
      babies: parseInt(searchParams.get('babies') || '0'),
      pets: parseInt(searchParams.get('pets') || '0'),
    },
  };

  // Handle back navigation
  const handleBack = () => {
    router.push('/');
  };

  // Handle navigation
  const handleNavigate = (page: string, data?: any) => {
    if (page === 'property-details') {
      router.push('/property/1');
    } else if (page === 'home' || page === 'logements') {
      router.push('/');
    } else {
      const path = getNavigationPath(page as any);
      router.push(path);
    }
  };

  return (
    <SearchResults 
      onBack={handleBack} 
      onNavigate={handleNavigate}
      searchParams={params}
    />
  );
}

/**
 * Page Search Results Next.js
 * Réutilise le composant SearchResults existant
 */
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><p>Chargement...</p></div>}>
      <SearchResultsContent />
    </Suspense>
  );
}

