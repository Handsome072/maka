'use client';

import { useRouter } from 'next/navigation';
import { ExperienceDetails } from '@/app/pages/ExperienceDetails';

/**
 * Client component for Experience Details page
 */
export function ExperienceDetailsClient() {
  const router = useRouter();

  // Handle back navigation
  const handleBack = () => {
    router.push('/experiences');
  };

  return (
    <ExperienceDetails 
      onBack={handleBack}
    />
  );
}

