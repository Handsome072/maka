import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Heart, Star, ChevronLeft, ChevronRight, House } from 'lucide-react';
import { FiltersModal, MAX_PRICE, MIN_PRICE, type FilterState } from '../components/FiltersModal';
import { HeaderRightMenu } from '../components/HeaderRightMenu';
import { LanguageModal } from '../components/LanguageModal';
import { BecomeHostModal } from '../components/BecomeHostModal';
import { SearchBar } from '../components/SearchBar';
import { MobileSearchOverlay } from '../components/MobileSearchOverlay';
import { nightsBetween, startOfToday, toYmd } from '../components/booking/useStayDates';
import { publicListingsApi, type PublicListing } from '../services/api';
import { placeLabel } from '@/shared/places';

interface SearchResultsProps {
  onBack: () => void;
  onNavigate: (page: 'logements' | 'experiences' | 'services' | 'login') => void;
  /** Relance une recherche (mêmes paramètres que la barre de recherche de l'accueil). */
  onSearch: (params: any) => void;
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

// Équipements du filtre → valeurs enregistrées dans listings.amenities
const AMENITY_VALUES: Record<string, string[]> = {
  wifi: ['wifi'],
  kitchen: ['kitchen', 'cuisine_equipee'],
  washer: ['washer'],
  aircon: ['climatisation'],
  pool: ['pool'],
  parking: ['parking'],
};

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

const shortDate = (date: Date) => `${date.getDate()} ${MONTHS[date.getMonth()]}`;

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

function bedroomCount(listing: PublicListing): number {
  return Array.isArray(listing.bedrooms_data) ? listing.bedrooms_data.length : 0;
}

function bedCount(listing: PublicListing): number {
  return rooms(listing).reduce((total, room) => total + bedsInRoom(room), 0);
}

function nightlyPrice(listing: PublicListing): number {
  return Number(listing.base_price || 0);
}

function matchesFilters(listing: PublicListing, filters: FilterState | null): boolean {
  if (!filters) return true;
  const price = nightlyPrice(listing);
  if (price < filters.priceMin) return false;
  if (filters.priceMax < MAX_PRICE && price > filters.priceMax) return false;
  if (bedroomCount(listing) < filters.bedrooms) return false;
  if (bedCount(listing) < filters.beds) return false;
  if (Number(listing.bathrooms || 0) < filters.bathrooms) return false;
  if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(listing.space_type ?? '')) return false;
  const amenities = listing.amenities ?? [];
  return filters.amenities.every((id) => (AMENITY_VALUES[id] ?? [id]).some((value) => amenities.includes(value)));
}

function activeFilterCount(filters: FilterState | null): number {
  if (!filters) return 0;
  return (
    (filters.priceMin > MIN_PRICE || filters.priceMax < MAX_PRICE ? 1 : 0) +
    (filters.bedrooms > 0 ? 1 : 0) +
    (filters.beds > 0 ? 1 : 0) +
    (filters.bathrooms > 0 ? 1 : 0) +
    filters.propertyTypes.length +
    filters.amenities.length
  );
}

function plural(count: number, word: string): string {
  return `${count} ${word}${count > 1 ? 's' : ''}`;
}

function ListingResultCard({ listing, href }: { listing: PublicListing; href: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
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
            setIsFavorite(!isFavorite);
          }}
          aria-label="Ajouter aux favoris"
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

export function SearchResults({ onBack, onNavigate, onSearch, searchParams }: SearchResultsProps) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);
  const [showSearchEditor, setShowSearchEditor] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [filters, setFilters] = useState<FilterState | null>(null);

  const destination = searchParams.destination.trim();
  const { adults, children, babies, pets } = searchParams.guestsCount;
  const guests = adults + children;

  // Séjour retenu : au moins une nuit, à partir d'aujourd'hui ; sinon recherche sans dates
  const { checkInDate, checkOutDate } = searchParams;
  const stayValid = !!checkInDate && !!checkOutDate && checkOutDate > checkInDate && checkInDate >= startOfToday();
  const checkIn = stayValid ? toYmd(checkInDate!) : undefined;
  const checkOut = stayValid ? toYmd(checkOutDate!) : undefined;
  const nights = stayValid ? nightsBetween(checkInDate!, checkOutDate!) : 0;
  const datesIgnored = (!!checkInDate || !!checkOutDate) && !stayValid;

  const [listings, setListings] = useState<PublicListing[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setListings(null);
    setFailed(false);
    publicListingsApi
      .getAll({
        destination: destination || undefined,
        check_in: checkIn,
        check_out: checkOut,
        guests: guests > 0 ? guests : undefined,
      })
      .then((res) => {
        if (!cancelled) setListings(res.listings);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [destination, checkIn, checkOut, guests, attempt]);

  const results = useMemo(
    () => (listings ?? []).filter((listing) => matchesFilters(listing, filters)),
    [listings, filters],
  );
  const filterCount = activeFilterCount(filters);

  // Lien vers l'annonce : le séjour et les voyageurs choisis sont repris dans le bloc de réservation
  const stayQuery = useMemo(() => {
    const query = new URLSearchParams();
    if (checkIn && checkOut) {
      query.set('check_in', checkIn);
      query.set('check_out', checkOut);
    }
    if (guests > 0) {
      query.set('adults', String(Math.max(1, adults)));
      if (children > 0) query.set('children', String(children));
    }
    if (babies > 0) query.set('babies', String(babies));
    if (pets > 0) query.set('pets', String(pets));
    const qs = query.toString();
    return qs ? `?${qs}` : '';
  }, [checkIn, checkOut, guests, adults, children, babies, pets]);

  const dateRangeText = stayValid ? `${shortDate(checkInDate!)} - ${shortDate(checkOutDate!)}` : 'Dates flexibles';

  const totalGuests = guests + babies;
  const guestsText = totalGuests > 0
    ? `${totalGuests} voyageur${totalGuests > 1 ? 's' : ''}`
    : 'Ajouter des voyageurs';

  const summary = [
    listings ? plural(results.length, 'logement') : null,
    destination || null,
    stayValid ? `${dateRangeText} (${plural(nights, 'nuit')})` : null,
  ].filter(Boolean).join(' · ');

  const editSearch = () => {
    if (window.innerWidth < 768) {
      setShowMobileSearch(true);
    } else {
      setShowSearchEditor((open) => !open);
    }
  };

  const runSearch = (params: any) => {
    setShowSearchEditor(false);
    onSearch(params);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with search bar - combined for seamless positioning */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        {/* Main header row */}
        <div className="px-4 sm:px-6 lg:px-20 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={onBack}
              className="flex items-center gap-1 flex-shrink-0 hover:opacity-80 transition-opacity duration-200 border-0"
            >
              <img
                src="/sejoura_logo.png"
                alt="Séjoura Logo"
                className="w-[150px] h-auto border-0"
              />
            </button>

            {/* Right Menu */}
            <HeaderRightMenu
              showMenuDropdown={showMenuDropdown}
              setShowMenuDropdown={setShowMenuDropdown}
              setShowLanguageModal={setShowLanguageModal}
              setShowBecomeHostModal={setShowBecomeHostModal}
              onAuthClick={() => onNavigate('login')}
            />
          </div>
        </div>

        {/* Compact search bar row */}
        <div className="bg-white py-3 px-4 sm:px-6 lg:px-20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Compact search info : ouvre la barre de recherche pour modifier la recherche */}
              <button
                onClick={editSearch}
                aria-label="Modifier la recherche"
                className="flex items-center min-w-0 border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow bg-white pl-6 pr-2 py-2"
              >
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 6.5V14.5H10V11C10 10.4477 9.55228 10 9 10H7C6.44772 10 6 10.4477 6 11V14.5H2.5V6.5" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M0.5 8L8 1.5L15.5 8" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="text-sm px-4 truncate" style={{ fontWeight: 600, color: '#222222' }}>
                  {destination || 'N\'importe où'}
                </div>

                <div className="hidden sm:block w-px h-6 bg-gray-300"></div>

                <div className="hidden sm:block text-sm px-4 whitespace-nowrap" style={{ fontWeight: 600, color: '#222222' }}>
                  {dateRangeText}
                </div>

                <div className="hidden sm:block w-px h-6 bg-gray-300"></div>

                <div className="hidden sm:block text-sm px-4 whitespace-nowrap" style={{ color: '#717171' }}>
                  {guestsText}
                </div>

                <div className="bg-[#5EC6D8] text-white p-2.5 rounded-full flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 13L10.1 10.1M11.6667 6.33333C11.6667 9.27885 9.27885 11.6667 6.33333 11.6667C3.38781 11.6667 1 9.27885 1 6.33333C1 3.38781 3.38781 1 6.33333 1C9.27885 1 11.6667 3.38781 11.6667 6.33333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Filters button */}
            <button
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-colors flex-shrink-0 ${filterCount > 0 ? 'border-gray-900' : 'border-gray-300 hover:border-gray-400'}`}
              onClick={() => setShowFilterModal(true)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 4H14.5M3.5 8H12.5M6 12H10" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[12px]" style={{ fontWeight: 600, color: '#222222' }}>
                Filtres{filterCount > 0 ? ` (${filterCount})` : ''}
              </span>
            </button>
          </div>
        </div>

        {/* Barre de recherche complète, pour modifier la recherche (ordinateur) */}
        {showSearchEditor && (
          <div className="hidden md:block border-t border-gray-100 pb-4">
            <SearchBar onSearch={runSearch} />
          </div>
        )}
      </header>

      {/* Main content */}
      <div className="flex">
        {/* Results grid */}
        <div className="flex-1 px-4 sm:px-6 lg:px-20 py-6">
          {datesIgnored && (
            <p className="text-[14px] mb-3 px-4 py-3 rounded-xl bg-[#F7F7F7]" style={{ color: '#222222' }}>
              Les dates choisies ne forment pas un séjour valide (au moins une nuit, à partir d&apos;aujourd&apos;hui) :
              tous les logements sont affichés, sans vérifier leurs disponibilités.
            </p>
          )}

          {summary && (
            <p className="text-[14px] mb-6" style={{ color: '#717171' }}>
              {summary}
            </p>
          )}

          {/* Chargement */}
          {!listings && !failed && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square rounded-xl bg-gray-200 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {failed && (
            <div className="py-16 text-center">
              <p className="text-[15px] mb-4" style={{ color: '#222222' }}>
                Impossible de charger les logements pour le moment.
              </p>
              <button
                onClick={() => setAttempt((n) => n + 1)}
                className="px-6 py-3 border border-gray-900 rounded-lg text-[15px] hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Réessayer
              </button>
            </div>
          )}

          {listings && results.length === 0 && (
            <div className="py-16 text-center max-w-md mx-auto">
              <h2 className="text-[22px] mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                Aucun logement ne correspond
              </h2>
              <p className="text-[15px] mb-6" style={{ color: '#717171' }}>
                {filterCount > 0
                  ? 'Essayez de retirer certains filtres.'
                  : stayValid
                    ? 'Aucun logement n’est disponible sur ces dates pour cette recherche. Essayez d’autres dates ou une autre destination.'
                    : 'Essayez une autre destination ou un nombre de voyageurs différent.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {filterCount > 0 && (
                  <button
                    onClick={() => setFilters(null)}
                    className="px-6 py-3 border border-gray-900 rounded-lg text-[15px] hover:bg-gray-50 transition-colors"
                    style={{ fontWeight: 600, color: '#222222' }}
                  >
                    Retirer les filtres
                  </button>
                )}
                <button
                  onClick={() => runSearch({})}
                  className="px-6 py-3 bg-[#222222] text-white rounded-lg text-[15px] hover:bg-black transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Voir tous les logements
                </button>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 mb-16">
              {results.map((listing) => (
                <ListingResultCard key={listing.id} listing={listing} href={`/property/${listing.id}${stayQuery}`} />
              ))}
            </div>
          )}

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
                      Mettez votre logement sur Séjoura
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Proposez votre expérience sur Séjoura
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-[14px] hover:underline" style={{ color: '#222222' }}>
                      Proposez votre service sur Séjoura
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

              {/* Séjoura */}
              <div>
                <h3 className="text-[14px] mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  Séjoura
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
                      Séjours d'urgence Séjoura.org
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer bottom */}
            <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 text-[14px]" style={{ color: '#222222' }}>
                <span>© 2025 Séjoura, Inc.</span>
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
                    <circle cx="8" cy="8" r="7" stroke="#222222" strokeWidth="1.5" />
                    <path d="M3 8H13M8 3C6.5 4.5 6 6 6 8C6 10 6.5 11.5 8 13M8 3C9.5 4.5 10 6 10 8C10 10 9.5 11.5 8 13" stroke="#222222" strokeWidth="1.5" />
                  </svg>
                  Français (FR)
                </button>
                <button className="flex items-center gap-2 text-[14px] hover:underline" style={{ fontWeight: 600, color: '#222222' }}>
                  € EUR
                </button>
                <div className="flex items-center gap-3">
                  <a href="#" className="hover:opacity-70 transition-opacity">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M18 9C18 4.02943 13.9706 0 9 0C4.02943 0 0 4.02943 0 9C0 13.4921 3.29115 17.2155 7.59375 17.8907V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.93742 3.51562 10.9932 3.51562C11.9776 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.755 5.90625 10.4062 6.60006 10.4062 7.3125V9H12.9023L12.5033 11.6016H10.4062V17.8907C14.7088 17.2155 18 13.4921 18 9Z" fill="#222222" />
                    </svg>
                  </a>
                  <a href="#" className="hover:opacity-70 transition-opacity">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M5.67 18C12.47 18 16.19 11.42 16.19 5.66C16.19 5.47 16.19 5.28 16.18 5.09C16.91 4.54 17.53 3.87 18 3.11C17.33 3.41 16.61 3.61 15.86 3.7C16.63 3.22 17.21 2.47 17.49 1.58C16.77 2.02 15.97 2.34 15.12 2.51C14.44 1.76 13.46 1.31 12.38 1.31C10.28 1.31 8.58 3.04 8.58 5.17C8.58 5.46 8.61 5.74 8.67 6.01C5.67 5.86 3.02 4.34 1.23 2.03C0.92 2.56 0.74 3.22 0.74 3.91C0.74 5.21 1.4 6.36 2.4 7.03C1.79 7.02 1.21 6.85 0.72 6.58C0.72 6.59 0.72 6.61 0.72 6.62C0.72 8.5 2.02 10.07 3.74 10.41C3.44 10.49 3.12 10.54 2.79 10.54C2.56 10.54 2.34 10.51 2.12 10.47C2.57 12.02 3.96 13.15 5.61 13.18C4.32 14.22 2.69 14.85 0.92 14.85C0.61 14.85 0.3 14.83 0 14.8C1.67 15.9 3.65 16.54 5.79 16.54" fill="#222222" />
                    </svg>
                  </a>
                  <a href="#" className="hover:opacity-70 transition-opacity">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 0C4.02943 0 0 4.02943 0 9C0 13.9706 4.02943 18 9 18C13.9706 18 18 13.9706 18 9C18 4.02943 13.9706 0 9 0ZM13.5 6.75C13.5071 6.87857 13.5071 7.00714 13.5071 7.13571C13.5071 10.5857 10.9286 14.5714 6.21429 14.5714C4.74643 14.5714 3.38571 14.1429 2.25 13.3929C2.45357 13.4143 2.65714 13.4286 2.87143 13.4286C4.07143 13.4286 5.17857 12.9857 6.05357 12.2357C4.92857 12.2143 3.97857 11.4571 3.66429 10.4143C3.81429 10.4357 3.96429 10.4571 4.11429 10.4571C4.32857 10.4571 4.54286 10.4286 4.74643 10.3714C3.65357 10.1357 2.82857 9.15 2.82857 7.97143V7.94286C3.16071 8.12143 3.53571 8.23929 3.93214 8.25C3.27857 7.80714 2.83929 7.05 2.83929 6.18214C2.83929 5.72143 2.96786 5.30357 3.19286 4.94786C4.34286 6.41571 6.07143 7.41429 8.03571 7.53214C7.99286 7.35357 7.97143 7.175 7.97143 6.98571C7.97143 5.64286 9.06429 4.53929 10.4286 4.53929C11.1214 4.53929 11.7536 4.83214 12.1929 5.30357C12.7393 5.19643 13.2643 4.98214 13.7321 4.69286C13.5536 5.27143 13.1643 5.72143 12.6536 5.99786C13.1429 5.94643 13.6179 5.81071 14.0571 5.61071C13.7321 6.07143 13.3214 6.46786 13.5 6.75Z" fill="#222222" />
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
        onApplyFilters={(applied) => setFilters(activeFilterCount(applied) > 0 ? applied : null)}
      />

      {/* Mobile search */}
      {showMobileSearch && (
        <MobileSearchOverlay
          isOpen={showMobileSearch}
          onClose={() => setShowMobileSearch(false)}
          currentPage="logements"
          onNavigate={(page) => onNavigate(page)}
          onSearch={runSearch}
        />
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <LanguageModal
          isOpen={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {/* Become Host Modal */}
      {showBecomeHostModal && (
        <BecomeHostModal
          isOpen={showBecomeHostModal}
          onClose={() => setShowBecomeHostModal(false)}
        />
      )}

    </div>
  );
}
