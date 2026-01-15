'use client';

import { useRouter } from 'next/navigation';
import { ServiceDetails } from '@/app/pages/ServiceDetails';

/**
 * Client component for Service Details page
 */
export function ServiceDetailsClient() {
  const router = useRouter();

  // Handle back navigation
  const handleBack = () => {
    router.push('/services');
  };

  return (
    <ServiceDetails 
      onBack={handleBack}
    />
  );
}

