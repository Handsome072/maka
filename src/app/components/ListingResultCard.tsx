import Link from 'next/link';
import { useState } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight, House } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import type { PublicListing } from '../services/api';
import { placeLabel } from '@/shared/places';

// Lits d'une pièce : [{ type, count }] (annonces importées) ou { double: 2, simple: 1 } (parcours hôte)
type Room = { beds?: { count?: number }[] | Record<string, number> };

function rooms(listing: PublicListing): Room[] {
  return [listing.bedrooms_data, listing.open_areas_data].flatMap((list) => (Array.isArray(list) ? (list as Room[]) : []));
}

function bedsInRoom(room: Room): number {
  const beds = room?.beds;
  if (Array.isArray(beds)) return beds.reduce((sum, bed) => sum + (Number(bed?.count) || 0), 0);
  if (beds && typeof beds === 'object') return Object.values(beds).reduce((sum, count) => sum + (Number(count) || 0), 0);
  return 0;
}

export function bedroomCount(listing: PublicListing): number {
  return Array.isArray(listing.bedrooms_data) ? listing.bedrooms_data.length : 0;
}

export function bedCount(listing: PublicListing): number {
  return rooms(listing).reduce((total, room) => total + bedsInRoom(room), 0);
}

export function nightlyPrice(listing: PublicListing): number {
  return Number(listing.base_price || 0);
}

export function plural(count: number, word: string): string {
  return `${count} ${word}${count > 1 ? 's' : ''}`;
}

/** Carte d'annonce des listes (recherche, favoris) : carrousel de photos, lieu, note, prix par nuit. */
export function ListingResultCard({ listing, href }: { listing: PublicListing; href: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isFavorite: isSaved, toggleFavorite } = useFavorites();
  const isFavorite = isSaved(listing.id);
  const images = (listing.photos ?? []).map((photo) => photo.url);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const details = [
    listing.space_type === 'private' ? 'Chambre privée' : 'Logement entier',
    plural(listing.capacity, 'voyageur'),
    bedroomCount(listing) > 0 ? plural(bedroomCount(listing), 'chambre') : null,
    bedCount(listing) > 0 ? plural(bedCount(listing), 'lit') : null,
  ].filter(Boolean);

  return (
    <Link href={href} className="group block">
      {/* Image carousel */}
      <div className="relative aspect-square mb-3 rounded-xl overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={listing.title || 'Logement'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <House className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
          </div>
        )}

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Photo précédente"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Photo suivante"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.slice(0, 5).map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${index === Math.min(currentImageIndex, 4)
                    ? 'bg-white'
                    : 'bg-white/60'
                  }`}
              />
            ))}
          </div>
        )}

        {/* Badge */}
        {listing.reviews_count >= 3 && (listing.average_rating ?? 0) >= 4.8 && (
          <div className="absolute top-3 left-3">
            <span className="text-[13px] px-3 py-1 bg-white rounded-full" style={{ fontWeight: 600 }}>
              Coup de coeur
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(listing.id);
          }}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={isFavorite}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-6 h-6 ${isFavorite
                ? 'fill-red-500 stroke-red-500'
                : 'fill-black/50 stroke-white'
              }`}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Property info */}
      <div>
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-[15px] truncate" style={{ fontWeight: 600, color: '#222222' }}>
            {placeLabel(listing) || listing.title || 'Logement'}
          </h3>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            {listing.reviews_count > 0 ? (
              <>
                <Star className="w-3 h-3 fill-current" style={{ color: '#222222' }} />
                <span className="text-[15px]" style={{ fontWeight: 400, color: '#222222' }}>
                  {(listing.average_rating ?? 0).toFixed(2)}
                </span>
                <span className="text-[15px]" style={{ color: '#717171' }}>
                  ({listing.reviews_count})
                </span>
              </>
            ) : (
              <span className="text-[15px]" style={{ color: '#222222' }}>Nouveau</span>
            )}
          </div>
        </div>

        <p className="text-[15px] mb-1 truncate" style={{ color: '#717171' }}>
          {listing.title || 'Logement'}
        </p>
        <p className="text-[15px] mb-1 truncate" style={{ color: '#717171' }}>
          {details.join(' · ')}
        </p>

        <div className="flex items-baseline gap-1.5">
          <span className="text-[15px]" style={{ fontWeight: 600, color: '#222222' }}>
            {nightlyPrice(listing).toFixed(0)} €
          </span>
          <span className="text-[15px]" style={{ color: '#717171' }}>
            par nuit
          </span>
        </div>
      </div>
    </Link>
  );
}
