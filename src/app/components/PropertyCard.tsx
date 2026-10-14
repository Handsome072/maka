import { Heart, House } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { RetryingImg } from './RetryingImg';

interface PropertyCardProps {
  id?: string;
  image: string;
  title: string;
  location: string;
  date: string;
  price: string;
  /** Note moyenne des avis ; null tant que le logement n'en a aucun. */
  rating: number | null;
  badge?: 'Coup de coeur' | 'Originals' | 'Populaire' | 'Nouveau';
  guests?: string;
  beds?: string;
  onClick?: (id?: string) => void;
}

export function PropertyCard({
  id,
  image,
  title,
  location,
  date,
  price,
  rating,
  badge,
  guests,
  beds,
  onClick
}: PropertyCardProps) {
  const { isFavorite: isSaved, toggleFavorite } = useFavorites();
  const listingId = id ? Number(id) : null;
  const isFavorite = listingId !== null && isSaved(listingId);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (listingId !== null) toggleFavorite(listingId);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div className="group cursor-pointer flex-shrink-0 w-full" onClick={handleClick}>
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        {image ? (
          <RetryingImg
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <House className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
          </div>
        )}
        <button
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={isFavorite}
          className="absolute top-3 right-3 hover:scale-110 transition-transform z-10"
        >
          <Heart
            className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-black/50 text-white'} stroke-2`}
          />
        </button>
        {badge && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 ${
            badge === 'Originals' ? 'bg-white' : 'bg-white'
          }`}>
            {badge === 'Originals' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="#00A99D"/>
              </svg>
            )}
            <span className="text-xs" style={{ fontWeight: 600 }}>{badge}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-start justify-between">
          <h3 className="text-sm line-clamp-1" style={{ fontWeight: 600 }}>{title}</h3>
        </div>
        <p className="text-xs text-gray-600">{location}</p>
        {guests && <p className="text-xs text-gray-600">{guests}</p>}
        {beds && <p className="text-xs text-gray-600">{beds}</p>}
        <div className="pt-1 flex items-center gap-1">
          <span className="text-xs text-gray-600">{price}</span>
          <span className="text-xs text-gray-600 mx-1">·</span>
          {rating === null ? (
            <span className="text-xs text-gray-600">Nouveau</span>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
                <path d="M6 0L7.854 4.146L12 4.854L8.708 7.708L9.708 12L6 9.708L2.292 12L3.292 7.708L0 4.854L4.146 4.146L6 0Z"/>
              </svg>
              <span className="text-xs text-gray-600">{rating.toFixed(2)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}