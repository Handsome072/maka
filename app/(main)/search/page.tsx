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
  const handleNavigate = (page: string) => {
    if (page === 'home' || page === 'logements') {
      router.push('/');
    } else {
      const path = getNavigationPath(page as any);
      router.push(path);
    }
  };

  // Nouvelle recherche depuis la page de résultats
  const handleSearch = (search: any) => {
    const searchQuery = new URLSearchParams({
      destination: search.destination || '',
      checkIn: search.checkInDate?.toISOString() || '',
      checkOut: search.checkOutDate?.toISOString() || '',
      adults: search.guestsCount?.adults?.toString() || '0',
      children: search.guestsCount?.children?.toString() || '0',
      babies: search.guestsCount?.babies?.toString() || '0',
      pets: search.guestsCount?.pets?.toString() || '0',
    });
    router.push(`/search?${searchQuery.toString()}`);
  };

  return (
    <SearchResults 
      onBack={handleBack} 
      onNavigate={handleNavigate}
      onSearch={handleSearch}
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

