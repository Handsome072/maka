import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ServiceCardProps {
  id?: string;
  image: string;
  badge?: 'Coup de coeur' | 'Originals' | 'Populaire' | 'Nouveau';
  title: string;
  host: string;
  price: string;
  rating: number;
  onClick?: (id?: string) => void;
}

export function ServiceCard({
  id,
  image,
  badge,
  title,
  host,
  price,
  rating,
  onClick
}: ServiceCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div className="group cursor-pointer flex-shrink-0 w-full" onClick={handleClick}>
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Bouton favori */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 hover:scale-110 transition-transform z-10"
        >
          <Heart
            className={`w-6 h-6 ${isFavorite ? 'fill-[#1E3A5F] text-[#1E3A5F]' : 'fill-black/50 text-white'} stroke-2`}
          />
        </button>

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-md shadow-sm flex items-center gap-1.5">
            {badge === 'Originals' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2L9.5 6.5L14 8L9.5 9.5L8 14L6.5 9.5L2 8L6.5 6.5L8 2Z" fill="#00A99D"/>
              </svg>
            )}
            <span className="text-xs" style={{ fontWeight: 600 }}>{badge}</span>
          </div>
        )}
      </div>

      <div className="space-y-0">
        <h3 className="text-[15px] line-clamp-2" style={{ fontWeight: 600 }}>{title}</h3>
        <p className="text-xs text-gray-600">{host}</p>
        <div>
          <span className="text-xs">{price}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 0L7.854 4.146L12 4.854L8.708 7.708L9.708 12L6 9.708L2.292 12L3.292 7.708L0 4.854L4.146 4.146L6 0Z"/>
          </svg>
          <span className="text-xs">{rating.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}