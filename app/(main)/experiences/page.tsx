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

  return (
    <Experiences
      isScrolled={isScrolled}
      onExperienceClick={handleExperienceClick}
    />
  );
}

