'use client';

import { useRouter } from 'next/navigation';
import { ExperienceOnboarding } from '@/app/pages/ExperienceOnboarding';
import { getNavigationPath } from '@/app/config/routes';

/**
 * Page Experience Onboarding Next.js
 * Réutilise le composant ExperienceOnboarding existant
 */
export default function ExperienceOnboardingPage() {
  const router = useRouter();

  // Handle navigation
  const handleNavigate = (page: string, data?: any) => {
    if (page === 'home' || page === 'logements') {
      router.push('/');
    } else if (page === 'annonces') {
      router.push('/annonces');
    } else {
      const path = getNavigationPath(page as any);
      router.push(path);
    }
  };

  return (
    <ExperienceOnboarding 
      onNavigate={handleNavigate}
    />
  );
}

