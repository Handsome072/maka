'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PropertyDetails } from '@/app/pages/PropertyDetails';
import { publicListingsApi, ListingDetail } from '@/app/services/api';

interface Props {
  id: string;
}

export function PropertyDetailsClient({ id }: Props) {
  const router = useRouter();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    publicListingsApi.getOne(Number(id))
      .then(res => setListing(res.listing))
      .catch(err => setError(err.message || 'Erreur lors du chargement'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBack = () => {
    router.push('/');
  };

  const handleBook = (data: Record<string, unknown>) => {
    sessionStorage.setItem('bookingData', JSON.stringify(data));
    router.push('/booking');
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-6 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 pt-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-[400px] bg-gray-200 rounded-2xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-12">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-32 bg-gray-200 rounded mt-8"></div>
            </div>
            <div className="hidden lg:block">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Logement introuvable</h2>
          <p className="text-gray-600 mb-6">{error || 'Ce logement n\'existe pas ou n\'est plus disponible.'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <PropertyDetails
      listing={listing}
      onBack={handleBack}
      onBook={handleBook}
    />
  );
}
