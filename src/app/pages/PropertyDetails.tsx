import { Heart, Share, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ImageCarouselModal } from '../components/ImageCarouselModal';
import { ListingDetail, reviewsApi, messagesApi } from '../services/api';
import { BED_TYPE_LABELS } from '../components/host-onboarding/constants';

// ─── Helper functions ────────────────────────────────────────────────────────

function formatHostExperience(memberSince: string): string {
  const start = new Date(memberSince);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (months < 1) return "moins d'un mois";
  if (months < 12) return `${months} mois`;
  const years = Math.floor(months / 12);
  return `${years} an${years > 1 ? 's' : ''}`;
}

function formatMemberYears(memberSince: string): string {
  const start = new Date(memberSince);
  const now = new Date();
  const years = Math.floor((now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  if (years < 1) return "moins d'1 an sur HOMIQIO";
  return `${years} an${years > 1 ? 's' : ''} sur HOMIQIO`;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "aujourd'hui";
  if (diffDays === 1) return 'Il y a 1 jour';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return 'Il y a 1 semaine';
  if (diffWeeks < 5) return `Il y a ${diffWeeks} semaines`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return 'Il y a 1 mois';
  return `Il y a ${diffMonths} mois`;
}

function countTotalBeds(bedroomsData?: unknown[] | null, openAreasData?: unknown[] | null): number {
  let total = 0;
  const countFromAreas = (areas: unknown[] | null | undefined) => {
    if (!areas || !Array.isArray(areas)) return;
    for (const area of areas) {
      const a = area as { beds?: unknown };
      if (!a.beds) continue;
      if (Array.isArray(a.beds)) {
        for (const bed of a.beds) {
          total += (bed as { count?: number }).count || 1;
        }
      } else if (typeof a.beds === 'object') {
        for (const count of Object.values(a.beds as Record<string, number>)) {
          if (typeof count === 'number' && count > 0) {
            total += count;
          }
        }
      }
    }
  };
  countFromAreas(bedroomsData);
  countFromAreas(openAreasData);
  return total || 1;
}

function buildMapEmbedUrl(lat?: number | null, lng?: number | null, city?: string | null, country?: string | null): string {
  if (lat && lng) {
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sfr`;
  }
  const query = encodeURIComponent(`${city || ''}, ${country || ''}`);
  return `https://www.google.com/maps/embed/v1/place?key=&q=${query}`;
}

function formatPrice(price: string | number | null, currency?: string): string {
  if (!price) return '$0';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (currency === 'EUR') return `${num.toFixed(0)} €`;
  return `$${num.toFixed(0)}`;
}

function formatRating(rating: number | null): string {
  if (!rating) return '0';
  return rating.toFixed(2).replace('.', ',');
}

// ─── Amenity icon mapping ────────────────────────────────────────────────────

const AMENITY_CONFIG: Record<string, { label: string; icon: string }> = {
  cuisine:          { label: 'Cuisine',                    icon: 'kitchen' },
  wifi:             { label: 'Wifi',                       icon: 'wifi' },
  television:       { label: 'Télévision',                 icon: 'tv' },
  seche_cheveux:    { label: 'Sèche-cheveux',              icon: 'dryer' },
  espace_travail:   { label: 'Espace de travail dédié',    icon: 'workspace' },
  animaux_acceptes: { label: 'Animaux acceptés',           icon: 'pets' },
  refrigerateur:    { label: 'Réfrigérateur',              icon: 'fridge' },
  micro_ondes:      { label: 'Four à micro-ondes',         icon: 'microwave' },
  climatisation:    { label: 'Climatisation',              icon: 'ac' },
  chauffage:        { label: 'Chauffage',                  icon: 'heating' },
  lave_linge:       { label: 'Lave-linge',                 icon: 'washer' },
  seche_linge:      { label: 'Sèche-linge',               icon: 'dryer' },
  parking:          { label: 'Parking gratuit',            icon: 'parking' },
  piscine:          { label: 'Piscine',                    icon: 'pool' },
  jacuzzi:          { label: 'Jacuzzi',                    icon: 'jacuzzi' },
  fer_repasser:     { label: 'Fer à repasser',             icon: 'iron' },
  cintres:          { label: 'Cintres',                    icon: 'hangers' },
  draps:            { label: 'Draps',                      icon: 'sheets' },
  oreillers:        { label: 'Oreillers et couvertures',   icon: 'pillows' },
  detecteur_fumee:  { label: 'Détecteur de fumée',         icon: 'smoke' },
  detecteur_co:     { label: 'Détecteur de monoxyde de carbone', icon: 'co' },
  extincteur:       { label: 'Extincteur',                 icon: 'extinguisher' },
  trousse_secours:  { label: 'Trousse de premiers secours', icon: 'firstaid' },
};

function AmenityIcon({ type }: { type: string }) {
  const iconMap: Record<string, JSX.Element> = {
    kitchen: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h4l3 9 4-18 3 9h4" />
      </svg>
    ),
    wifi: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
    tv: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    dryer: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    workspace: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    pets: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    fridge: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    microwave: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  };

  const defaultIcon = (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
    </svg>
  );

  return iconMap[type] || defaultIcon;
}

// Detect safety amenities that should be shown as absent (crossed out)
const SAFETY_AMENITIES = ['detecteur_fumee', 'detecteur_co'];

// ─── Review gradient colors ──────────────────────────────────────────────────

const REVIEW_COLORS = [
  'from-blue-400 to-purple-500',
  'from-pink-400 to-orange-500',
  'from-green-400 to-teal-500',
  'from-indigo-400 to-blue-500',
  'from-yellow-400 to-red-500',
  'from-cyan-400 to-blue-500',
];

// ─── Rating category icons ──────────────────────────────────────────────────

function RatingCategoryIcon({ index }: { index: number }) {
  const icons = [
    // Propreté
    <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>,
    // Précision
    <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    // Arrivée
    <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>,
    // Communication
    <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>,
    // Emplacement
    <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
    // Qualité-prix
    <svg key="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
  ];
  return <div className="w-6 h-6 text-gray-700">{icons[index]}</div>;
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface PropertyDetailsProps {
  listing: ListingDetail;
  onBack: () => void;
  onBook?: (data: Record<string, unknown>) => void;
  onReviewAdded?: () => void;
  onNavigate?: (path: string) => void;
}

export function PropertyDetails({ listing, onBack, onBook, onReviewAdded, onNavigate }: PropertyDetailsProps) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [hostMessage, setHostMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const sleepScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollSleepLeft, setCanScrollSleepLeft] = useState(false);
  const [canScrollSleepRight, setCanScrollSleepRight] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const container = sleepScrollRef.current;
    if (!container) return;
    const checkSleepScroll = () => {
      setCanScrollSleepLeft(container.scrollLeft > 0);
      setCanScrollSleepRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    };
    checkSleepScroll();
    container.addEventListener('scroll', checkSleepScroll);
    window.addEventListener('resize', checkSleepScroll);
    return () => {
      container.removeEventListener('scroll', checkSleepScroll);
      window.removeEventListener('resize', checkSleepScroll);
    };
  }, []);

  const scrollSleep = (direction: 'left' | 'right') => {
    const container = sleepScrollRef.current;
    if (!container) return;
    const scrollAmount = 300;
    container.scrollTo({
      left: container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount),
      behavior: 'smooth',
    });
  };

  // Derive data from listing
  const images = listing.photos?.map(p => p.url) || [];
  const title = listing.title || 'Logement';
  const subtitle = listing.subtitle || title;
  const spaceType = listing.space_type || 'Logement entier';
  const location = [listing.city, listing.country].filter(Boolean).join(', ');
  const capacity = listing.capacity || 1;
  const bathrooms = listing.bathrooms || 1;
  const normalizeBeds = (beds: unknown): { type: string; count: number }[] => {
    if (Array.isArray(beds)) return beds;
    if (beds && typeof beds === 'object') {
      const entries = Object.entries(beds as Record<string, unknown>);
      if (entries.length > 0 && typeof entries[0][1] === 'number') {
        return entries
          .filter(([, count]) => (count as number) > 0)
          .map(([key, count]) => ({
            type: BED_TYPE_LABELS[key] || key,
            count: count as number,
          }));
      }
      return Object.values(beds as Record<string, unknown>) as { type: string; count: number }[];
    }
    return [];
  };
  const bedroomsData = (Array.isArray(listing.bedrooms_data) ? listing.bedrooms_data : []) as { name?: string; beds?: unknown }[];
  const openAreasData = (Array.isArray(listing.open_areas_data) ? listing.open_areas_data : []) as { name?: string; beds?: unknown }[];
  const allSleepingAreas = [
    ...bedroomsData.map((b, i) => ({ ...b, image: images[i + 2], areaType: 'bedroom' as const })),
    ...openAreasData.map((a) => ({ ...a, image: images[1], areaType: 'open_area' as const })),
  ];
  const bedroomsCount = bedroomsData?.length || 0;
  const totalBeds = countTotalBeds(bedroomsData, openAreasData);
  const amenities = listing.amenities || [];
  const description = listing.description || '';
  const aboutChalet = listing.about_chalet || '';
  const basePrice = listing.base_price ? parseFloat(listing.base_price) : 0;
  const currency = listing.currency || 'CAD';
  const cancellationPolicy = listing.cancellation_policy;
  const arrivalTime = listing.arrival_time || '14:00';
  const departureTime = listing.departure_time || '11:00';
  const host = listing.host;
  const reviewsSummary = listing.reviews_summary;
  const reviews = listing.reviews || [];

  // Check which safety amenities are missing
  const hasSmoke = amenities.includes('detecteur_fumee');
  const hasCo = amenities.includes('detecteur_co');
  // Display amenities (excluding safety ones that will be shown separately)
  const displayAmenities = amenities.filter(a => !SAFETY_AMENITIES.includes(a));

  const ratingCategories = [
    { label: 'Propreté', rating: reviewsSummary.cleanliness_avg },
    { label: 'Précision', rating: reviewsSummary.accuracy_avg },
    { label: 'Arrivée', rating: reviewsSummary.checkin_avg },
    { label: 'Communication', rating: reviewsSummary.communication_avg },
    { label: 'Emplacement', rating: reviewsSummary.location_avg },
    { label: 'Qualité-prix', rating: reviewsSummary.value_avg },
  ];

  const openCarousel = (index: number) => {
    setCarouselStartIndex(index);
    setShowCarousel(true);
  };

  const bookingData = {
    title: subtitle,
    image: images[0],
    rating: reviewsSummary.average_rating,
    location: reviewsSummary.is_guest_favorite ? "Coup de cœur voyageurs" : location,
    checkIn: "3-4",
    checkOut: "avr. 2026",
    guests: 1,
    nights: 2,
    pricePerNight: basePrice,
  };

  return (
    <>
      {/* Image Carousel Modal */}
      <ImageCarouselModal
        images={images}
        isOpen={showCarousel}
        initialIndex={carouselStartIndex}
        onClose={() => setShowCarousel(false)}
        showFavorite={true}
        isFavorite={isFavorite}
        onFavoriteToggle={() => setIsFavorite(!isFavorite)}
      />

      {/* Main Content */}
      <div className="bg-white min-h-screen pb-24 md:pb-0">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 pointer-events-none">
          <button
            onClick={onBack}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm pointer-events-auto hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-3 pointer-events-auto">
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors">
              <Share className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title and Actions Section - Desktop Only */}
        <div className="hidden md:block max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 pt-6">
          <div className="flex flex-wrap items-start justify-between mb-4 gap-4">
            <h1 className="text-xl md:text-3xl flex-1 min-w-[200px]" style={{ fontWeight: 600 }}>
              {title}
            </h1>
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              <button className="flex items-center gap-2 px-2 py-2 md:px-3 md:py-2 rounded-lg transition-colors hover:bg-gray-100">
                <Share className="w-4 h-4" />
                <span className="text-sm underline hidden md:inline" style={{ fontWeight: 600 }}>Partager</span>
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex items-center gap-2 px-2 py-2 md:px-3 md:py-2 rounded-lg transition-colors hover:bg-gray-100"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="text-sm underline hidden md:inline" style={{ fontWeight: 600 }}>Enregistrer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-[1280px] mx-auto md:px-6 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:rounded-2xl overflow-hidden h-[300px] md:h-[400px] relative">
            {/* Large image */}
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden">
              {images[0] && (
                <img
                  src={images[0]}
                  alt="Property main"
                  className="w-full h-full object-cover cursor-pointer transition-all"
                  onClick={() => openCarousel(0)}
                />
              )}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>

              <div className="md:hidden absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-xs font-semibold">
                1 / {images.length}
              </div>
            </div>

            {/* Small images */}
            {images.slice(1, 5).map((img, index) => (
              <div key={index} className="hidden md:block relative group overflow-hidden">
                <img
                  src={img}
                  alt={`Property ${index + 2}`}
                  className="w-full h-full object-cover cursor-pointer transition-all"
                  onClick={() => openCarousel(index + 1)}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
              </div>
            ))}

            {/* Show all photos button */}
            {images.length > 5 && (
              <button
                onClick={() => openCarousel(0)}
                className="hidden md:flex absolute bottom-4 right-4 md:bottom-4 md:right-4 lg:bottom-6 lg:right-6 bg-white px-4 py-2 rounded-lg border border-gray-900 hover:bg-gray-50 transition-colors items-center gap-2 shadow-sm z-10 text-sm whitespace-nowrap"
                style={{ fontWeight: 600 }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="flex-shrink-0">
                  <path d="M3 3h4v4H3V3zm6 0h4v4H9V3zM3 9h4v4H3V9zm6 0h4v4H9V9z" />
                </svg>
                <span>Afficher toutes les photos</span>
              </button>
            )}
          </div>

          {/* Mobile Title Section */}
          <div className="md:hidden px-4 pt-5 pb-2">
             <h1 className="text-2xl font-semibold mb-1">
               {title}
             </h1>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-6 md:mt-12 pb-16 px-4 md:px-0">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Property Info Section */}
              <div className="pb-6 border-b border-gray-200">
                <h2 className="text-xl md:text-2xl mb-2" style={{ fontWeight: 600 }}>
                  {subtitle}
                </h2>
                <div className="flex items-center gap-1 text-sm">
                  <span>{spaceType}</span>
                  <span className="text-gray-400">·</span>
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span>{capacity} voyageur{capacity > 1 ? 's' : ''}</span>
                  <span className="text-gray-400">·</span>
                  <span>{bedroomsCount} chambre{bedroomsCount > 1 ? 's' : ''}</span>
                  <span className="text-gray-400">·</span>
                  <span>{totalBeds} lit{totalBeds > 1 ? 's' : ''}</span>
                  <span className="text-gray-400">·</span>
                  <span>{bathrooms} salle de bain</span>
                </div>
              </div>

              {/* Ce que propose ce logement */}
              <div className="py-8 border-b border-gray-200">
                <h3 className="text-xl mb-6" style={{ fontWeight: 600 }}>Ce que propose ce logement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayAmenities.map((amenityKey, index) => {
                    const config = AMENITY_CONFIG[amenityKey];
                    const label = config?.label || amenityKey;
                    const iconType = config?.icon || 'default';
                    return (
                      <div key={index} className="flex items-center gap-4 py-3">
                        <AmenityIcon type={iconType} />
                        <span className="text-base">{label}</span>
                      </div>
                    );
                  })}

                  {/* Show absent safety amenities as crossed out */}
                  {!hasCo && (
                    <div className="flex items-center gap-4 py-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <line x1="18" y1="6" x2="6" y2="18" strokeWidth={2} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-base line-through text-black">Détecteur de monoxyde de carbone</span>
                    </div>
                  )}

                  {!hasSmoke && (
                    <div className="flex items-center gap-4 py-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <line x1="18" y1="6" x2="6" y2="18" strokeWidth={2} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                      <span className="text-base line-through text-black">Détecteur de fumée</span>
                    </div>
                  )}
                </div>

                {amenities.length > 8 && (
                  <button className="mt-6 px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-300 transition-colors text-base" style={{ fontWeight: 600 }}>
                    Afficher les {amenities.length} équipements
                  </button>
                )}
              </div>

              {/* Description */}
              <div className="py-8 border-b border-gray-200">
                <div className="text-base leading-relaxed text-gray-900">
                  <p className={showFullDescription ? '' : 'line-clamp-4'}>
                    {description}
                  </p>
                  {!showFullDescription && description.length > 200 && (
                    <button
                      onClick={() => setShowFullDescription(true)}
                      className="text-sm mt-2 underline"
                      style={{ fontWeight: 600 }}
                    >
                      Lire la suite
                    </button>
                  )}
                </div>

                {showFullDescription && aboutChalet && (
                  <>
                    <h3 className="text-xl mt-8 mb-4" style={{ fontWeight: 600 }}>Le logement...</h3>
                    <p className="text-base leading-relaxed text-gray-900">
                      {aboutChalet}
                    </p>
                  </>
                )}
              </div>

              {/* Where you'll sleep */}
              <div className="py-8 border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl" style={{ fontWeight: 600 }}>Où vous dormirez</h3>
                  {allSleepingAreas.length > 2 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => scrollSleep('left')}
                        disabled={!canScrollSleepLeft}
                        className={`p-2 border border-gray-300 rounded-full transition-all ${!canScrollSleepLeft ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-md'}`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => scrollSleep('right')}
                        disabled={!canScrollSleepRight}
                        className={`p-2 border border-gray-300 rounded-full transition-all ${!canScrollSleepRight ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-md'}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {allSleepingAreas.length <= 2 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allSleepingAreas.map((area, index) => (
                      <div key={index} className="rounded-xl">
                        {area.image && (
                          <img src={area.image} alt={area.name || (area.areaType === 'bedroom' ? 'Chambre' : 'Espace commun')} className="w-full h-64 object-cover rounded-lg mb-4" />
                        )}
                        <h4 className="text-base" style={{ fontWeight: 600 }}>{area.name || (area.areaType === 'bedroom' ? 'Chambre' : 'Espace commun')}</h4>
                        {normalizeBeds(area.beds).map((bed, bi) => (
                          <p key={bi} className="text-sm text-gray-600 mt-1">{bed.count || 1} {bed.type || 'lit'}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    ref={sleepScrollRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {allSleepingAreas.map((area, index) => (
                      <div key={index} className="flex-shrink-0 w-[280px] rounded-xl">
                        {area.image && (
                          <img src={area.image} alt={area.name || (area.areaType === 'bedroom' ? 'Chambre' : 'Espace commun')} className="w-full h-64 object-cover rounded-lg mb-4" />
                        )}
                        <h4 className="text-base" style={{ fontWeight: 600 }}>{area.name || (area.areaType === 'bedroom' ? 'Chambre' : 'Espace commun')}</h4>
                        {normalizeBeds(area.beds).map((bed, bi) => (
                          <p key={bi} className="text-sm text-gray-600 mt-1">{bed.count || 1} {bed.type || 'lit'}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Highlights */}
              <div className="py-8 border-t border-gray-200 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="text-2xl">🏆</div>
                  </div>
                  <div>
                    <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>
                      Ce logement fait partie des 10 % de logements préférés sur HOMIQIO
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ce logement est très bien classé, d&apos;après ses évaluations, ses commentaires et la fiabilité de l&apos;hôte pour répondre aux questions des voyageurs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>
                      Procédure d&apos;arrivée exceptionnelle
                    </h3>
                    <p className="text-sm text-gray-600">
                      Les voyageurs récents ont attribué 5 étoiles à la procédure d&apos;arrivée.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>
                      Annulation gratuite
                    </h3>
                    <p className="text-sm text-gray-600">
                      Obtenez un remboursement intégral si vous changez d&apos;avis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Calendar Section */}
              <div className="py-8 border-t border-gray-200">
                <h3 className="text-xl mb-2" style={{ fontWeight: 600 }}>2 nuits à {listing.city || 'destination'}</h3>
                <p className="text-sm text-gray-600 mb-6">3 avr. 2026 - 5 avr. 2026</p>

                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="flex gap-12">
                      <h4 className="text-base" style={{ fontWeight: 600 }}>Avril 2026</h4>
                      <h4 className="text-base" style={{ fontWeight: 600 }}>Mai 2026</h4>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                    {/* April Calendar */}
                    <div>
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                          <div key={i} className="text-center text-xs text-gray-600 py-2" style={{ fontWeight: 600 }}>
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {[null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((day, i) => (
                          <div
                            key={i}
                            className={`aspect-square flex items-center justify-center text-sm ${day === 3 || day === 5
                              ? 'bg-gray-900 text-white rounded-full'
                              : day === 4
                                ? 'bg-gray-200'
                                : day
                                  ? 'hover:bg-gray-100 rounded-full cursor-pointer'
                                  : ''
                              }`}
                          >
                            {day || ''}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* May Calendar */}
                    <div>
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                          <div key={i} className="text-center text-xs text-gray-600 py-2" style={{ fontWeight: 600 }}>
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {[null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day, i) => (
                          <div
                            key={i}
                            className={`aspect-square flex items-center justify-center text-sm ${day ? 'hover:bg-gray-100 rounded-full cursor-pointer' : ''
                              }`}
                          >
                            {day || ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-2 mt-6 pt-6 border-t border-gray-200">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <button className="text-sm underline" style={{ fontWeight: 600 }}>
                      Effacer les dates
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Reservation Card */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <div className="border border-gray-200 rounded-2xl p-6 shadow-xl">
                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl" style={{ fontWeight: 600 }}>{formatPrice(basePrice * 2, currency)}</span>
                    <span className="text-base text-gray-600">pour 2 nuits</span>
                  </div>

                  {/* Rare badge */}
                  {reviewsSummary.is_guest_favorite && (
                    <div className="flex items-start gap-2 mb-6 p-3 bg-green-50 rounded-lg">
                      <div className="text-green-600 mt-0.5">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm" style={{ fontWeight: 600 }}>
                          Perle rare ! Les réservations pour ce logement sont fréquentes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Date inputs */}
                  <div className="border border-gray-300 rounded-lg mb-4">
                    <div className="grid grid-cols-2 divide-x divide-gray-300">
                      <div className="p-3">
                        <label className="text-xs block mb-1" style={{ fontWeight: 600 }}>ARRIVÉE</label>
                        <input type="text" value="03/04/2026" readOnly className="text-sm w-full outline-none" />
                      </div>
                      <div className="p-3">
                        <label className="text-xs block mb-1" style={{ fontWeight: 600 }}>DÉPART</label>
                        <input type="text" value="05/04/2026" readOnly className="text-sm w-full outline-none" />
                      </div>
                    </div>
                    <div className="border-t border-gray-300 p-3">
                      <label className="text-xs block mb-1" style={{ fontWeight: 600 }}>VOYAGEURS</label>
                      <button className="text-sm w-full text-left flex items-center justify-between">
                        <span>1 voyageur</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Reserve button */}
                  <button
                    onClick={() => onBook?.(bookingData)}
                    className="w-full py-3 rounded-full text-white text-base mb-4 transition-colors hover:opacity-90"
                    style={{
                      fontWeight: 600,
                      backgroundColor: '#000000'
                    }}
                  >
                    Réserver
                  </button>

                  <p className="text-center text-sm text-gray-600 mb-4">
                    Aucun montant ne vous sera débité pour le moment
                  </p>

                  {/* Cancellation policy */}
                  {cancellationPolicy && (
                    <div className="text-center pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Annulation gratuite
                      </p>
                    </div>
                  )}

                  {/* Report listing */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button className="flex items-center gap-2 text-sm underline mx-auto">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      Signaler cette annonce
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Full Width */}
        {reviewsSummary.count > 0 && (
          <div className="max-w-[1280px] border-t border-gray-200 py-10 md:py-16 mx-auto px-4 sm:px-6 lg:px-20">
            {/* Hero Rating */}
            <div className="text-center mb-8 md:mb-12">
              <div className="flex items-center justify-center gap-2 md:gap-4 mb-2 md:mb-4">
                <span className="text-3xl md:text-6xl">🏅</span>
                <h2 className="text-5xl md:text-7xl" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{formatRating(reviewsSummary.average_rating)}</h2>
                <span className="text-3xl md:text-6xl">🏅</span>
              </div>
              {reviewsSummary.is_guest_favorite && (
                <>
                  <h3 className="text-lg md:text-2xl mb-2 md:mb-3" style={{ fontWeight: 600 }}>Coup de cœur voyageurs</h3>
                  <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
                    Ce logement fait partie des <span style={{ fontWeight: 600 }}>10 % de logements préférés</span> sur HOMIQIO parmi les logements éligibles, à partir des évaluations, des commentaires et de la fiabilité des annonces selon les voyageurs.
                  </p>
                </>
              )}
            </div>

            {/* Rating Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8 md:gap-4 pb-8 mb-12 border-b border-gray-200">
              {/* Evaluation globale */}
              <div className="md:col-span-2 lg:col-span-1">
                <p className="text-sm mb-3" style={{ fontWeight: 600 }}>Évaluation globale</p>
                <div className="">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviewsSummary.rating_distribution[rating] || 0;
                    const percentage = reviewsSummary.count > 0 ? (count / reviewsSummary.count) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-2">{rating}</span>
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-900 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual ratings */}
              <div className="md:col-span-5 lg:col-span-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {ratingCategories.map((item, index) => (
                  <div key={index} className="flex flex-col justify-between md:border-l border-gray-200 md:pl-6 h-24">
                    <div>
                      <p className="text-sm mb-1" style={{ fontWeight: 600 }}>{item.label}</p>
                      <p className="text-lg" style={{ fontWeight: 600 }}>{item.rating?.toFixed(1) || '-'}</p>
                    </div>
                    <RatingCategoryIcon index={index} />
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {reviews.map((review, index) => (
                <div key={review.id} className={`${index < reviews.length - 2 ? 'border-b border-gray-200' : ''} pb-8`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${REVIEW_COLORS[index % REVIEW_COLORS.length]} rounded-full flex items-center justify-center text-white text-lg`} style={{ fontWeight: 600 }}>
                      {review.user.profile_photo_url ? (
                        <img src={review.user.profile_photo_url} alt={review.user.first_name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        review.user.first_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="text-base" style={{ fontWeight: 600 }}>{review.user.first_name}</h4>
                      <p className="text-sm text-gray-600">{formatMemberYears(review.user.member_since)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <Star key={star} className={`w-3 h-3 ${star < Math.round(Number(review.rating)) ? 'fill-current' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">· {formatRelativeTime(review.created_at)} · Séjour de quelques nuits</span>
                  </div>
                  <p className="text-base text-gray-900 leading-relaxed mb-3">
                    {review.text && review.text.length > 200 ? `${review.text.substring(0, 200)}...` : review.text}
                  </p>
                  {review.text && review.text.length > 200 && (
                    <button className="text-sm underline" style={{ fontWeight: 600 }}>Lire la suite</button>
                  )}
                </div>
              ))}
            </div>

            {/* Show all reviews button */}
            {reviewsSummary.count > 6 && (
              <div className="text-center flex self-start">
                <button className="px-6 py-3 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-base" style={{ fontWeight: 600 }}>
                  Afficher les {reviewsSummary.count} commentaires
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add a comment - Always visible */}
        <div className="max-w-[1280px] border-t border-gray-200 py-10 md:py-16 mx-auto px-4 sm:px-6 lg:px-20">
          <h3 className="text-lg mb-4" style={{ fontWeight: 600 }}>Laisser un commentaire</h3>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            {/* Star rating */}
            <div className="flex items-center gap-1 mb-4">
              <span className="text-sm mr-2" style={{ color: '#717171', fontWeight: 500 }}>Votre note :</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setCommentRating(star)}
                  className="transition-colors"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= (hoverRating || commentRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              {commentRating > 0 && (
                <span className="text-sm ml-2" style={{ fontWeight: 600 }}>{commentRating}/5</span>
              )}
            </div>
            {/* Comment textarea */}
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Partagez votre expérience avec les autres voyageurs..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-gray-900 transition-colors"
              rows={4}
              style={{ color: '#222222' }}
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs" style={{ color: '#9CA3AF' }}>
                {commentText.length}/500 caractères
              </p>
              <button
                onClick={async () => {
                  if (!commentText.trim() || commentRating === 0 || isSubmittingReview) return;
                  setIsSubmittingReview(true);
                  setReviewError(null);
                  try {
                    await reviewsApi.create(listing.id, {
                      rating: commentRating,
                      text: commentText.trim(),
                    });
                    setCommentText('');
                    setCommentRating(0);
                    onReviewAdded?.();
                  } catch (err: unknown) {
                    const message = err instanceof Error ? err.message : 'Erreur lors de la publication';
                    setReviewError(message);
                  } finally {
                    setIsSubmittingReview(false);
                  }
                }}
                disabled={!commentText.trim() || commentRating === 0 || isSubmittingReview}
                className="px-6 py-2.5 rounded-lg text-sm text-white transition-opacity"
                style={{
                  fontWeight: 600,
                  backgroundColor: '#000000',
                  opacity: !commentText.trim() || commentRating === 0 || isSubmittingReview ? 0.4 : 1,
                  cursor: !commentText.trim() || commentRating === 0 || isSubmittingReview ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmittingReview ? 'Publication...' : 'Publier'}
              </button>
            </div>
            {reviewError && (
              <p className="text-sm text-red-600 mt-2">{reviewError}</p>
            )}
          </div>
        </div>

        {/* Location Section - Full Width */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 py-10 md:py-16 border-t border-gray-200">
          <h3 className="text-xl md:text-2xl mb-4 md:mb-6" style={{ fontWeight: 600 }}>Où se situe le logement</h3>
          <p className="text-base text-gray-600 mb-6">{[listing.city, listing.county || listing.province, listing.country].filter(Boolean).join(', ')}</p>

          {/* Map */}
          <div className="relative w-full h-[240px] md:h-[480px] rounded-xl overflow-hidden mb-6 bg-gray-100">
            <iframe
              src={buildMapEmbedUrl(listing.latitude, listing.longitude, listing.city, listing.country)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <p className="text-base text-gray-600">
            L&apos;adresse exacte sera communiquée après la réservation.
          </p>
        </div>

        {/* Host Information Section - Full Width */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 py-6 lg:py-8 border-t border-gray-200">
          <h3 className="text-xl lg:text-[26px] mb-6 lg:mb-8" style={{ fontWeight: 600 }}>Faites connaissance avec votre hôte</h3>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Left - Host Card */}
            <div className="w-full lg:w-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center border border-gray-200 rounded-3xl pt-4 shadow-xl bg-white w-full lg:w-[520px] py-4">
                <div className="flex flex-col items-center text-center mb-8 col-span-2 mt-4">
                  <div className="relative mb-2">
                    {host.profile_photo_url ? (
                      <img
                        src={host.profile_photo_url}
                        alt={host.first_name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-semibold">
                        {host.first_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {host.identity_verified && (
                      <div className="absolute bottom-0 right-0 bg-[#10B981] rounded-full p-2.5">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <h4 className="text-[36px] mb-1" style={{ fontWeight: 600 }}>{host.first_name}</h4>
                  <p className="text-base text-gray-600">Hôte</p>
                </div>

                <div className="grid grid-cols-3 md:grid-rows-3 md:grid-cols-1 gap-4 px-6 md:px-0">
                  <div className="text-start border-b border-gray-200 pb-2 md:pb-0">
                    <p className="text-[20px] lg:text-[22px] mb-1" style={{ fontWeight: 600 }}>{host.reviews_count}</p>
                    <p className="text-xs lg:text-sm font-bold leading-tight text-gray-600">évaluations</p>
                  </div>
                  <div className="flex flex-col items-start text-start border-b border-gray-200 pb-2 md:pb-0">
                    <div className="flex items-center justify-center gap-0.5 mb-1">
                      <span className="text-[20px] lg:text-[22px]" style={{ fontWeight: 600 }}>{formatRating(host.average_rating)}</span>
                      <Star className="w-3.5 h-3.5 fill-current -mt-1" />
                    </div>
                    <p className="text-xs lg:text-sm font-bold leading-tight text-gray-600">en note globale</p>
                  </div>
                  <div className="text-start pb-2 md:pb-0">
                    <p className="text-[20px] lg:text-[22px] mb-1" style={{ fontWeight: 600 }}>{formatHostExperience(host.member_since).split(' ')[0]}</p>
                    <p className="text-xs lg:text-sm font-bold leading-tight text-gray-600">{formatHostExperience(host.member_since).split(' ').slice(1).join(' ')} d&apos;expérience<br className="hidden md:block" />en tant qu&apos;hôte</p>
                  </div>
                </div>
              </div>

              {/* Info below card */}
              <div className="mt-6 space-y-4 max-w-md">
                {host.profession && (
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-base">Ma profession : {host.profession}</p>
                    </div>
                  </div>
                )}

                {host.interests && host.interests.length > 0 && (
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-base">Passions : {host.interests.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Host Info */}
            <div className="space-y-6 flex-1">
              <div>
                <h4 className="text-xl lg:text-[22px] mb-4 lg:mb-6" style={{ fontWeight: 600 }}>Informations sur l&apos;hôte</h4>
                <div className="space-y-2 mb-8">
                  {host.response_rate && <p className="text-base">Taux de réponse : {host.response_rate} %</p>}
                  {host.response_time && <p className="text-base">Répond {host.response_time}</p>}
                </div>

                <button
                  onClick={() => setShowMessageModal(true)}
                  className="w-full md:w-auto py-3 px-6 bg-gray-100 rounded-lg text-base mb-6 cursor-pointer hover:bg-gray-200 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Envoyer un message à l&apos;hôte
                </button>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                <button className="underline hover:text-gray-900 transition-colors" style={{ fontWeight: 600 }}>
                  Ce logement est proposé par un particulier. En savoir plus
                </button>
              </p>

              <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-[#10B981]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z" />
                  </svg>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  Afin de protéger votre paiement, utilisez toujours HOMIQIO pour envoyer de l&apos;argent et communiquer avec les hôtes.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Things to Know Section - Full Width */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 mt-4 lg:mt-8 py-8 lg:py-16 border-t border-gray-50">
          <h3 className="text-xl lg:text-2xl mb-6 lg:mb-8" style={{ fontWeight: 600 }}>À savoir</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Cancellation Policy */}
            <div>
              <div className="flex flex-col items-start gap-3 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h4 className="text-base" style={{ fontWeight: 600 }}>Conditions d&apos;annulation</h4>
              </div>
              <p className="text-sm mb-3 text-[#6C6C6C]">
                {cancellationPolicy
                  ? `Politique d'annulation : ${cancellationPolicy}. Consultez les conditions complètes de cet hôte pour en savoir plus.`
                  : 'Consultez les conditions complètes de cet hôte pour en savoir plus.'
                }
              </p>
              <button className="text-sm underline" style={{ fontWeight: 600 }}>
                En savoir plus
              </button>
            </div>

            {/* House Rules */}
            <div>
              <div className="flex flex-col items-start gap-3 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="text-base" style={{ fontWeight: 600 }}>Règlement intérieur</h4>
              </div>
              <div className="space-y-2 text-sm mb-3 text-[#6C6C6C]">
                <p>Arrivée à partir de {arrivalTime}</p>
                <p>Départ avant {departureTime}</p>
                <p>{capacity} voyageur{capacity > 1 ? 's' : ''} maximum</p>
              </div>
              <button className="text-sm underline" style={{ fontWeight: 600 }}>
                En savoir plus
              </button>
            </div>

            {/* Safety & Property */}
            <div>
              <div className="flex flex-col items-start gap-3 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h4 className="text-base" style={{ fontWeight: 600 }}>Sécurité et logement</h4>
              </div>
              <div className="space-y-2 text-sm text-[#6C6C6C] mb-3">
                {!hasCo && <p>Aucune indication de la présence d&apos;un détecteur de monoxyde de carbone</p>}
                {!hasSmoke && <p>Aucune indication de la présence d&apos;un détecteur de fumée</p>}
                {hasCo && hasSmoke && <p>Détecteurs de fumée et de monoxyde de carbone présents</p>}
              </div>
              <button className="text-sm underline" style={{ fontWeight: 600 }}>
                En savoir plus
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-6 z-40 md:hidden flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-lg">{formatPrice(basePrice, currency)}</span>
            <span className="text-gray-600 text-sm"> / nuit</span>
          </div>
          <div className="text-xs underline font-semibold mt-0.5">3-5 avr.</div>
        </div>
        <button
          onClick={() => onBook?.(bookingData)}
          className="bg-black text-white px-8 py-3 rounded-lg font-semibold text-base hover:opacity-90 transition-opacity"
        >
          Réserver
        </button>
      </div>
      {/* Message Host Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMessageModal(false)} />
          <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Envoyer un message à {host?.first_name || 'l\'hôte'}</h2>
              <button onClick={() => setShowMessageModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <textarea
                value={hostMessage}
                onChange={(e) => setHostMessage(e.target.value)}
                placeholder={`Bonjour ${host?.first_name || ''}, je suis intéressé(e) par votre logement...`}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-gray-900 transition-colors"
                rows={5}
                style={{ color: '#222222' }}
              />
              {messageError && (
                <p className="text-sm text-red-600 mt-2">{messageError}</p>
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={async () => {
                    if (!hostMessage.trim() || isSendingMessage) return;
                    setIsSendingMessage(true);
                    setMessageError(null);
                    try {
                      const result = await messagesApi.startConversation(listing.id, hostMessage.trim());
                      setHostMessage('');
                      setShowMessageModal(false);
                      if (onNavigate) {
                        onNavigate(`/client-space/messages?conversation=${result.conversation_id}`);
                      }
                    } catch (err: unknown) {
                      const message = err instanceof Error ? err.message : 'Erreur lors de l\'envoi';
                      setMessageError(message);
                    } finally {
                      setIsSendingMessage(false);
                    }
                  }}
                  disabled={!hostMessage.trim() || isSendingMessage}
                  className="px-6 py-2.5 rounded-lg text-sm text-white transition-opacity"
                  style={{
                    fontWeight: 600,
                    backgroundColor: '#000000',
                    opacity: !hostMessage.trim() || isSendingMessage ? 0.4 : 1,
                    cursor: !hostMessage.trim() || isSendingMessage ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSendingMessage ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
