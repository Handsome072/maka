'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useFavorites } from '@/app/context/FavoritesContext';
import { favoritesApi, type PublicListing } from '@/app/services/api';
import { ListingResultCard, plural } from '@/app/components/ListingResultCard';

/** Annonces enregistrées d'un cœur, de la plus récente à la plus ancienne. */
export function ClientFavorites() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isFavorite, loaded } = useFavorites();
  const [listings, setListings] = useState<PublicListing[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    let cancelled = false;
    favoritesApi
      .list()
      .then((res) => !cancelled && setListings(res.listings))
      .catch(() => !cancelled && setError('Impossible de charger vos favoris. Réessayez dans un instant.'));
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading]);

  // Un cœur décoché sur cette page retire aussitôt la carte
  const shown = listings && loaded ? listings.filter((listing) => isFavorite(listing.id)) : listings;

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8 w-full">
      <div className="mb-8">
        <h2 className="text-lg md:text-2xl" style={{ fontWeight: 600, color: '#222222' }}>
          Favoris
        </h2>
        {shown && shown.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">{plural(shown.length, 'logement')} enregistré{shown.length > 1 ? 's' : ''}</p>
        )}
      </div>

      {!isLoading && !isAuthenticated && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-base mb-2" style={{ fontWeight: 600 }}>Connectez-vous pour voir vos favoris</p>
          <p className="text-sm text-gray-600 mb-6">Les logements que vous enregistrez d&apos;un cœur sont conservés dans votre compte.</p>
          <Link
            href="/login?redirect=/client-space/favorites"
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg"
            style={{ fontWeight: 600 }}
          >
            Se connecter
          </Link>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {isAuthenticated && !error && shown === null && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      )}

      {shown && shown.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <Heart className="w-8 h-8 mx-auto mb-4 text-gray-400" strokeWidth={1.5} />
          <p className="text-base mb-2" style={{ fontWeight: 600 }}>Aucun favori pour le moment</p>
          <p className="text-sm text-gray-600 mb-6">Touchez le cœur d&apos;un logement pour le retrouver ici.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg" style={{ fontWeight: 600 }}>
            Découvrir les logements
          </Link>
        </div>
      )}

      {shown && shown.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-10">
          {shown.map((listing) => (
            <ListingResultCard key={listing.id} listing={listing} href={`/property/${listing.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
