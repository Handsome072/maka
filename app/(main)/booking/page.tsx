'use client';

import { useRouter } from 'next/navigation';
import { BookingRequest } from '@/app/pages/BookingRequest';
import { useEffect, useState } from 'react';

/**
 * Page Booking Request Next.js
 * Réutilise le composant BookingRequest existant
 */
export default function BookingPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    // Retrieve booking data from sessionStorage
    const storedData = sessionStorage.getItem('bookingData');
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    }
  }, []);

  // Handle back navigation
  const handleBack = () => {
    router.push('/property/1');
  };

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <p>Chargement des données de réservation...</p>
      </div>
    );
  }

  return (
    <BookingRequest 
      onBack={handleBack}
      bookingData={bookingData}
    />
  );
}

