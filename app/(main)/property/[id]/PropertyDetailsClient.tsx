'use client';

import { useRouter } from 'next/navigation';
import { PropertyDetails } from '@/app/pages/PropertyDetails';

/**
 * Client component for Property Details page
 */
export function PropertyDetailsClient() {
  const router = useRouter();

  // Handle back navigation
  const handleBack = () => {
    router.push('/');
  };

  // Handle booking
  const handleBook = (data: any) => {
    // Store booking data in sessionStorage for the booking page
    sessionStorage.setItem('bookingData', JSON.stringify(data));
    router.push('/booking');
  };

  return (
    <PropertyDetails 
      onBack={handleBack} 
      onBook={handleBook}
    />
  );
}

