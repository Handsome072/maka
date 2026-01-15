'use client';

import { useRouter } from 'next/navigation';
import { Services } from '@/app/pages/Services';
import { useScroll } from '@/app/hooks/ScrollContext';

/**
 * Page Services Next.js
 * Réutilise le composant Services existant pour garantir UI identique
 */
export default function ServicesPage() {
  const router = useRouter();
  const { isScrolled, handleNavigateScroll } = useScroll();

  // Handle service click
  const handleServiceClick = (id?: string) => {
    handleNavigateScroll();
    router.push(id ? `/service/${id}` : '/service/1');
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
    <Services
      isScrolled={isScrolled}
      onServiceClick={handleServiceClick}
      onSearch={handleSearch}
    />
  );
}

