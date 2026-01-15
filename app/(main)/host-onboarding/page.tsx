'use client';

import { useRouter } from 'next/navigation';
import { HostOnboarding } from '@/app/pages/HostOnboarding';
import { getNavigationPath } from '@/app/config/routes';

/**
 * Page Host Onboarding Next.js
 * Réutilise le composant HostOnboarding existant
 */
export default function HostOnboardingPage() {
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

  // Handle complete onboarding
  const handleCompleteOnboarding = () => {
    // In a real app, this would update user state in a global store or context
    router.push('/annonces');
  };

  return (
    <HostOnboarding 
      onNavigate={handleNavigate} 
      onCompleteOnboarding={handleCompleteOnboarding}
    />
  );
}

