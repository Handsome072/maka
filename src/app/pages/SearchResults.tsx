import { useState } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { FiltersModal } from '../components/FiltersModal';

interface SearchResultsProps {
  onBack: () => void;
  onNavigate: (page: 'logements' | 'experiences' | 'services') => void;
  searchParams: {
    destination: string;
    checkInDate: Date | null;
    checkOutDate: Date | null;
    guestsCount: {
      adults: number;
      children: number;
      babies: number;
      pets: number;
    };
  };
}

interface Property {
  id: number;
  images: string[];
  badge?: 'Coup de coeur' | 'Originals' | 'Populaire' | 'Nouveau';
  title: string;
  rating: number;
  reviews: number;
  description: string;
  bedrooms: string;
  beds: string;
  price: number;
  originalPrice?: number;
}

const properties: Property[] = [
  {
    id: 1,
    images: [
      'https://images.unsplash.com/photo-1578266848416-c291bc0b2940?w=800',
      'https://images.unsplash.com/photo-1595040398700-85ddd233d6f6?w=800',
      'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?w=800',
    ],
    title: 'Appartement · Khet...',
    rating: 4.92,
    reviews: 36,
    description: 'Chambre un lit/confortable maison...',
    bedrooms: '1 chambre',
    beds: '2 lits',
    price: 744,
  },
  {
    id: 2,
    images: [
      'https://images.unsplash.com/photo-1594904578869-c011783103c7?w=800',
      'https://images.unsplash.com/photo-1633505765486-e404bbbec654?w=800',
    ],
    badge: 'Populaire',
    title: 'Appartement · Khet...',
    rating: 4.92,
    reviews: 36,
    description: 'ESHERS superloft appartement 1...',
    bedrooms: '1 chambre',
    beds: '2 lits',
    price: 744,
  },
  {
    id: 3,
    images: [
      'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?w=800',
      'https://images.unsplash.com/photo-1654506012740-09321c969dc2?w=800',
    ],
    badge: 'Coup de coeur',
    title: 'Appartement en rés...',
    rating: 4.91,
    reviews: 32,
    description: 'Appartement moderne studio',
    bedrooms: '1 chambre',
    beds: '1 lit queen size',
    price: 868,
  },
  {
    id: 4,
    images: [
      'https://images.unsplash.com/photo-1633505765486-e404bbbec654?w=800',
      'https://images.unsplash.com/photo-1578266848416-c291bc0b2940?w=800',
    ],
    badge: 'Coup de coeur',
    title: 'Appartement · Huai...',
    rating: 5.0,
    reviews: 8,
    description: 'Rama9-XT Huikhwang loft appartement',
    bedrooms: '1 chambre',
    beds: '1 lit',
    price: 860,
    originalPrice: 1106,
  },
  {
    id: 5,
    images: [
      'https://images.unsplash.com/photo-1594904578869-c011783103c7?w=800',
      'https://images.unsplash.com/photo-1595040398700-85ddd233d6f6?w=800',
    ],
    title: 'Appartement · Khet...',
    rating: 5.0,
    reviews: 5,
    description: 'Location au mois/42 m²/salle...',
    bedrooms: '1 chambre',
    beds: '1 lit',
    price: 720,
    originalPrice: 984,
  },
  {
    id: 6,
    images: [
      'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?w=800',
      'https://images.unsplash.com/photo-1654506012740-09321c969dc2?w=800',
    ],
    badge: 'Originals',
    title: 'Appartement · Khet...',
    rating: 5.0,
    reviews: 5,
    description: 'Appartement Loft Rama9 au...',
    bedrooms: '1 chambre',
    beds: '1 lit',
    price: 1016,
    originalPrice: 1378,
  },
  {
    id: 7,
    images: [
      'https://images.unsplash.com/photo-1654506012740-09321c969dc2?w=800',
      'https://images.unsplash.com/photo-1633505765486-e404bbbec654?w=800',
    ],
    title: 'Appartement en rés...',
    rating: 4.86,
    reviews: 7,
    description: 'Bangkok Bel appartement près d...',
    bedrooms: '1 chambre',
    beds: '1 lit',
    price: 651,
  },
  {
    id: 8,
    images: [
      'https://images.unsplash.com/photo-1578266848416-c291bc0b2940?w=800',
      'https://images.unsplash.com/photo-1594904578869-c011783103c7?w=800',
    ],
    title: 'Appartement · Ratchathewi',
    rating: 4.67,
    reviews: 3,
    description: 'Une chambre/Station de métro...',
    bedrooms: '1 chambre',
    beds: '1 lit queen size',
    price: 895,
  },
  {
    id: 9,
    images: [
      'https://images.unsplash.com/photo-1633505765486-e404bbbec654?w=800',
      'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?w=800',
    ],
    badge: 'Nouveau',
    title: 'Appartement · Khlon...',
    rating: 4.67,
    reviews: 3,
    description: 'Condo de luxe moderne au centr...',
    bedrooms: '1 chambre',
    beds: '1 lit queen size',
    price: 1438,
    originalPrice: 1746,
  },
];

function PropertyCard({ property }: { property: Property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="group cursor-pointer">
      {/* Image carousel */}
      <div className="relative aspect-square mb-3 rounded-xl overflow-hidden">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation buttons */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            >
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentImageIndex
                    ? 'bg-white'
                    : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Badge */}
        {property.badge && (
          <div className="absolute top-3 left-3">
            <span className="text-[13px] px-3 py-1 bg-white rounded-full" style={{ fontWeight: 600 }}>
              {property.badge}
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite
                ? 'fill-[#FF385C] stroke-[#FF385C]'
                : 'fill-black/50 stroke-white'
            }`}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Property info */}
      <div>
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-[15px]" style={{ fontWeight: 600, color: '#222222' }}>
            {property.title}
          </h3>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <Star className="w-3 h-3 fill-current" style={{ color: '#222222' }} />
            <span className="text-[15px]" style={{ fontWeight: 400, color: '#222222' }}>
              {property.rating.toFixed(2)}
            </span>
            <span className="text-[15px]" style={{ color: '#717171' }}>
              ({property.reviews})
            </span>
          </div>
        </div>

        <p className="text-[15px] mb-1 truncate" style={{ color: '#717171' }}>
          {property.description}
        </p>
        <p className="text-[15px] mb-1 truncate" style={{ color: '#717171' }}>
          {property.bedrooms} · {property.beds}
        </p>

        <div className="flex items-baseline gap-1.5">
          {property.originalPrice && (
            <span className="text-[15px] line-through" style={{ color: '#717171' }}>
              {property.originalPrice} €
            </span>
          )}
          <span className="text-[15px]" style={{ fontWeight: 600, color: '#222222' }}>
            {property.price} €
          </span>
          <span className="text-[15px]" style={{ color: '#717171' }}>
            par mois
          </span>
        </div>
      </div>
    </div>
  );
}

export function SearchResults({ onBack, onNavigate, searchParams }: SearchResultsProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);

  const formatDateRange = () => {
    if (!searchParams.checkInDate) return 'Dates flexibles';

    const monthNames = [
      'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
      'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
    ];
    
    const checkInStr = `${searchParams.checkInDate.getDate()} ${monthNames[searchParams.checkInDate.getMonth()]}`;
    
    if (!searchParams.checkOutDate) return checkInStr;
    
    const checkOutStr = `${searchParams.checkOutDate.getDate()} ${monthNames[searchParams.checkOutDate.getMonth()]}`;
    return `${checkInStr} - ${checkOutStr}`;
  };

  const totalGuests =
    searchParams.guestsCount.adults +
    searchParams.guestsCount.children +
    searchParams.guestsCount.babies;

  const guestsText = totalGuests > 0
    ? `${totalGuests} voyageur${totalGuests > 1 ? 's' : ''}`
    : 'Ajouter des voyageurs';

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={onBack}
              className="flex items-center gap-1 flex-shrink-0 hover:opacity-80 transition-opacity duration-200"
            >
              <svg
                className="w-8 h-8"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z"
                  fill="#10B981"
                />
              </svg>
              <span
                className="text-[#10B981] text-xl ml-1 hidden sm:block"
                style={{ fontWeight: 600 }}
              >
                HOMIQIO
              </span>
            </button>

            {/* Right side placeholder */}
            <div className="flex items-center gap-4">
              <button className="text-sm px-4 py-2 hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600 }}>
                Devenir hôte
              </button>
              <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#222222" strokeWidth="1.5"/>
                  <path d="M3 8H13M8 3C6.5 4.5 6 6 6 8C6 10 6.5 11.5 8 13M8 3C9.5 4.5 10 6 10 8C10 10 9.5 11.5 8 13" stroke="#222222" strokeWidth="1.5"/>
                </svg>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full hover:shadow-md transition-shadow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4H14M2 8H14M2 12H14" stroke="#222222" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="#717171"/>
                  <path d="M12 2C14.21 2 16 3.79 16 6C16 8.21 14.21 10 12 10C9.79 10 8 8.21 8 6C8 3.79 9.79 2 12 2ZM12 22C7.03 22 3 19.42 3 16.25C3 13.08 7.03 10.5 12 10.5C16.97 10.5 21 13.08 21 16.25C21 19.42 16.97 22 12 22Z" fill="#FFF"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky compact search bar - moved below header */}
      <div className="sticky top-[80px] z-40 bg-white border-b border-gray-200 py-3 px-4 sm:px-6 lg:px-20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Compact search info */}
            <button className="flex items-center border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow bg-white pl-6 pr-2 py-2">
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 6.5V14.5H10V11C10 10.4477 9.55228 10 9 10H7C6.44772 10 6 10.4477 6 11V14.5H2.5V6.5" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M0.5 8L8 1.5L15.5 8" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="text-sm px-4" style={{ fontWeight: 600, color: '#222222' }}>
                {searchParams.destination || 'N\'importe où'}
              </div>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <div className="text-sm px-4" style={{ fontWeight: 600, color: '#222222' }}>
                {formatDateRange()}
              </div>
              
              <div className="w-px h-6 bg-gray-300"></div>
              
              <div className="text-sm px-4" style={{ color: '#717171' }}>
                {guestsText}
              </div>
              
              <div className="bg-[#10B981] text-white p-2.5 rounded-full">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 13L10.1 10.1M11.6667 6.33333C11.6667 9.27885 9.27885 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27885 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27885 1 11.6667 3.38781 11.6667 6.33333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>

          {/* Filters button */}
          <button
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl hover:border-gray-400 transition-colors"
            onClick={() => setShowFilterModal(true)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 4H14.5M3.5 8H12.5M6 12H10" stroke="#222222" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[12px]" style={{ fontWeight: 600, color: '#222222' }}>
              Filtres
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex">
        {/* Results grid */}
        <div className="flex-1 px-4 sm:px-6 lg:px-20 py-6">
          <p className="text-[14px] mb-6" style={{ color: '#717171' }}>
            {searchParams.destination || 'Bangkok'} : Plus de 1000 logements
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {properties.map((property) => (
              <div key={property.id}>
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          {/* Similar dates section */}
          <div className="mt-16 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[22px]" style={{ fontWeight: 600, color: '#222222' }}>
                Disponibles à des dates similaires
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[14px]" style={{ color: '#222222' }}>1 / 2</span>
                <button className="p-2 border border-gray-300 rounded-full hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" style={{ color: '#222222' }} />
                </button>
                <button className="p-2 border border-gray-300 rounded-full hover:border-gray-400 transition-colors">
                  <ChevronRight className="w-4 h-4" style={{ color: '#222222' }} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {properties.slice(3, 7).map((property) => (
                <div
                  key={property.id}
                  className="relative"
                >
                  {/* Date badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[13px] px-3 py-1.5 bg-white rounded-full" style={{ fontWeight: 600 }}>
                      12 janv. – 17 févr.
                    </span>
                  </div>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            <button className="mt-6 px-6 py-3 border border-gray-900 rounded-lg text-[16px] hover:bg-gray-50 transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Rechercher à des dates similaires
            </button>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12 mb-16">
            <button className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-[14px]" style={{ fontWeight: 600 }}>
              1
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-900 flex items-center justify-center text-[14px] transition-colors" style={{ fontWeight: 600 }}>
              2
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-900 flex items-center justify-center text-[14px] transition-colors" style={{ fontWeight: 600 }}>
              3
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-900 flex items-center justify-center text-[14px] transition-colors" style={{ fontWeight: 600 }}>
              4
            </button>
            <span className="px-2 text-gray-400">...</span>
            <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-900 flex items-center justify-center text-[14px] transition-colors" style={{ fontWeight: 600 }}>
              15
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-900 flex items-center justify-center text-[14px] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-gray-50 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Assistance */}
              <div>
                <h3 className="text-[14px] mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  Assistance
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Centre d'aide
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Assistance sécurité
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      AirCover
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Lutte contre la discrimination
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Assistance handicap
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Options d'annulation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      J'ai un problème de voisinage
                    </a>
                  </li>
                </ul>
              </div>

              {/* Accueil de voyageurs */}
              <div>
                <h3 className="text-[14px] mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  Accueil de voyageurs
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Mettez votre logement sur Airbnb
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Proposez votre expérience sur Airbnb
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Proposez votre service sur Airbnb
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      AirCover pour les hôtes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Ressources pour les hôtes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Forum de la communauté
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Hébergement responsable
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Participez à un cours gratuit pour les nouveaux hôtes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Trouver un co-hôte
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Parrainer un hôte
                    </a>
                  </li>
                </ul>
              </div>

              {/* Airbnb */}
              <div>
                <h3 className="text-[14px] mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  Airbnb
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Édition été 2025
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Newsroom
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Carrières
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Investisseurs
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Cartes cadeaux
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Séjours d'urgence Airbnb.org
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer bottom */}
            <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 text-[14px]" style={{ color: '#222222' }}>
                <span>© 2025 HOMIQIO, Inc.</span>
                <span>·</span>
                <a href="#" className="hover:underline">Confidentialité</a>
                <span>·</span>
                <a href="#" className="hover:underline">Conditions</a>
                <span>·</span>
                <a href="#" className="hover:underline">Plan du site</a>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-[14px] hover:underline" style={{ fontWeight: 600, color: '#222222' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#222222" strokeWidth="1.5"/>
                    <path d="M3 8H13M8 3C6.5 4.5 6 6 6 8C6 10 6.5 11.5 8 13M8 3C9.5 4.5 10 6 10 8C10 10 9.5 11.5 8 13" stroke="#222222" strokeWidth="1.5"/>
                  </svg>
                  Français (FR)
                </button>
                <button className="flex items-center gap-2 text-[14px] hover:underline" style={{ fontWeight: 600, color: '#222222' }}>
                  € EUR
                </button>
                <div className="flex items-center gap-3">
                  <a href="#" className="hover:opacity-70 transition-opacity">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M18 9C18 4.02943 13.9706 0 9 0C4.02943 0 0 4.02943 0 9C0 13.4921 3.29115 17.2155 7.59375 17.8907V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.93742 3.51562 10.9932 3.51562C11.9776 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.755 5.90625 10.4062 6.60006 10.4062 7.3125V9H12.9023L12.5033 11.6016H10.4062V17.8907C14.7088 17.2155 18 13.4921 18 9Z" fill="#222222"/>
                    </svg>
                  </a>
                  <a href="#" className="hover:opacity-70 transition-opacity">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M5.67 18C12.47 18 16.19 11.42 16.19 5.66C16.19 5.47 16.19 5.28 16.18 5.09C16.91 4.54 17.53 3.87 18 3.11C17.33 3.41 16.61 3.61 15.86 3.7C16.63 3.22 17.21 2.47 17.49 1.58C16.77 2.02 15.97 2.34 15.12 2.51C14.44 1.76 13.46 1.31 12.38 1.31C10.28 1.31 8.58 3.04 8.58 5.17C8.58 5.46 8.61 5.74 8.67 6.01C5.67 5.86 3.02 4.34 1.23 2.03C0.92 2.56 0.74 3.22 0.74 3.91C0.74 5.21 1.4 6.36 2.4 7.03C1.79 7.02 1.21 6.85 0.72 6.58C0.72 6.59 0.72 6.61 0.72 6.62C0.72 8.5 2.02 10.07 3.74 10.41C3.44 10.49 3.12 10.54 2.79 10.54C2.56 10.54 2.34 10.51 2.12 10.47C2.57 12.02 3.96 13.15 5.61 13.18C4.32 14.22 2.69 14.85 0.92 14.85C0.61 14.85 0.3 14.83 0 14.8C1.67 15.9 3.65 16.54 5.79 16.54" fill="#222222"/>
                    </svg>
                  </a>
                  <a href="#" className="hover:opacity-70 transition-opacity">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 0C4.02943 0 0 4.02943 0 9C0 13.9706 4.02943 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02943 13.9706 0 9 0ZM13.5 6.75C13.5071 6.87857 13.5071 7.00714 13.5071 7.13571C13.5071 10.5857 10.9286 14.5714 6.21429 14.5714C4.74643 14.5714 3.38571 14.1429 2.25 13.3929C2.45357 13.4143 2.65714 13.4286 2.87143 13.4286C4.07143 13.4286 5.17857 12.9857 6.05357 12.2357C4.92857 12.2143 3.97857 11.4571 3.66429 10.4143C3.81429 10.4357 3.96429 10.4571 4.11429 10.4571C4.32857 10.4571 4.54286 10.4286 4.74643 10.3714C3.65357 10.1357 2.82857 9.15 2.82857 7.97143V7.94286C3.16071 8.12143 3.53571 8.23929 3.93214 8.25C3.27857 7.80714 2.83929 7.05 2.83929 6.18214C2.83929 5.72143 2.96786 5.30357 3.19286 4.94786C4.34286 6.41571 6.07143 7.41429 8.03571 7.53214C7.99286 7.35357 7.97143 7.175 7.97143 6.98571C7.97143 5.64286 9.06429 4.53929 10.4286 4.53929C11.1214 4.53929 11.7536 4.83214 12.1929 5.30357C12.7393 5.19643 13.2643 4.98214 13.7321 4.69286C13.5536 5.27143 13.1643 5.72143 12.6536 5.99786C13.1429 5.94643 13.6179 5.81071 14.0571 5.61071C13.7321 6.07143 13.3214 6.46786 13.5 6.75Z" fill="#222222"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Filters Modal */}
      <FiltersModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
      />
    </div>
  );
}