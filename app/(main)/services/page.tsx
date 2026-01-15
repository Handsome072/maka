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

  return (
    <Services
      isScrolled={isScrolled}
      onServiceClick={handleServiceClick}
    />
  );
}

