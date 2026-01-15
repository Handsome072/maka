'use client';

import { useRouter } from 'next/navigation';
import { Experiences } from '@/app/pages/Experiences';
import { useScroll } from '@/app/hooks/ScrollContext';

/**
 * Page Expériences Next.js
 * Réutilise le composant Experiences existant pour garantir UI identique
 */
export default function ExperiencesPage() {
  const router = useRouter();
  const { isScrolled, handleNavigateScroll } = useScroll();

  // Handle experience click
  const handleExperienceClick = (id?: string) => {
    handleNavigateScroll();
    router.push(id ? `/experience/${id}` : '/experience/1');
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
    <Experiences
      isScrolled={isScrolled}
      onExperienceClick={handleExperienceClick}
      onSearch={handleSearch}
    />
  );
}

