'use client';

import { useRouter } from 'next/navigation';
import { Home } from '@/app/pages/Home';
import { useScroll } from '@/app/hooks/ScrollContext';
import { ROUTES } from '@/app/config/routes';

/**
 * Page d'accueil Next.js
 * Réutilise le composant Home existant pour garantir UI identique
 * Utilise le contexte de scroll partagé avec le layout
 */
export default function HomePage() {
  const router = useRouter();
  const { isScrolled, handleNavigateScroll } = useScroll();

  // Handle property click
  const handlePropertyClick = (id?: string) => {
    handleNavigateScroll();
    router.push(id ? `/property/${id}` : '/property/1');
  };

  // Handle search
  const handleSearch = (params: any) => {
    const searchQuery = new URLSearchParams({
      destination: params.destination || '',
      checkIn: params.checkInDate?.toISOString() || '',
      checkOut: params.checkOutDate?.toISOString() || '',
      adults: params.guestsCount?.adults?.toString() || '0',
      children: params.guestsCount?.children?.toString() || '0',
      babies: params.guestsCount?.babies?.toString() || '0',
      pets: params.guestsCount?.pets?.toString() || '0',
    });
    handleNavigateScroll();
    router.push(`/search?${searchQuery.toString()}`);
  };

  return (
    <Home
      isScrolled={isScrolled}
      onPropertyClick={handlePropertyClick}
      onSearch={handleSearch}
    />
  );
}

