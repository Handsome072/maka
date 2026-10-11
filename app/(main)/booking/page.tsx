'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { BookingRequest, type BookingData } from '@/app/pages/BookingRequest';

const LOGIN_URL = '/login?redirect=/booking';

/**
 * Page de réservation : le séjour choisi sur l'annonce arrive par sessionStorage.
 * Il faut être connecté (retour ici après la connexion) ; sans séjour choisi, retour à l'accueil.
 */
export default function BookingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  // undefined : pas encore lu ; null : rien à réserver
  const [bookingData, setBookingData] = useState<BookingData | null | undefined>(undefined);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('bookingData');
      setBookingData(stored ? (JSON.parse(stored) as BookingData) : null);
    } catch {
      setBookingData(null);
    }
  }, []);

  useEffect(() => {
    if (bookingData === null) {
      router.replace('/');
    } else if (bookingData && !isLoading && !isAuthenticated) {
      router.replace(LOGIN_URL);
    }
  }, [bookingData, isLoading, isAuthenticated, router]);

  if (!bookingData || isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BookingRequest
      bookingData={bookingData}
      onBack={() => router.push(`/property/${bookingData.listingId}`)}
      onBooked={(reservation) => {
        sessionStorage.removeItem('bookingData');
        // replace : le bouton retour ne ramène pas au formulaire déjà envoyé
        router.replace(`/booking/confirmation/${reservation.id}`);
      }}
      onLoginRequired={() => router.push(LOGIN_URL)}
    />
  );
}
