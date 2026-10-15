import { PropertyCard } from '../components/PropertyCard';
import { PropertyCarousel } from '../components/PropertyCarousel';
import { SearchBar } from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import type { PublicListing } from '../services/api';
import { readRecentlyViewed, usePublicListings } from '../hooks/usePublicListings';
import { placeLabel, provinceName } from '@/shared/places';

interface HomeProps {
  onPropertyClick: (id?: string) => void;
  onSearch?: (params: any) => void;
}

function useWindowWidth() {
  const [width, setWidth] = useState(1200); // Always start with default value
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true and get actual window width on client
    setMounted(true);
    setWidth(window.innerWidth);

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { width, mounted };
}

function getCardWidth(windowWidth: number): string {
  if (windowWidth < 745) return '200px';
  if (windowWidth < 950) return 'calc((100vw - 80px - 32px) / 3)';
  if (windowWidth < 1127) return 'calc((100vw - 80px - 48px) / 4)';
  if (windowWidth < 1285) return 'calc((100vw - 96px - 64px) / 5)';
  return 'calc((100vw - 96px - 80px) / 6)';
}

/** Une rangée n'apparaît qu'à partir de ce nombre d'annonces. */
const MIN_SECTION_SIZE = 3;

interface Section {
  key: string;
  title: string;
  listings: PublicListing[];
  /** Destination ouverte par la flèche du titre ; '' = toutes les annonces. */
  destination?: string;
}

const price = (listing: PublicListing) => Number(listing.base_price || 0);

/** Rangées de l'accueil, toutes tirées des annonces actives de la base. */
function buildSections(listings: PublicListing[], recentIds: number[]): Section[] {
  const sections: Section[] = [{ key: 'all', title: 'Nos annonces', listings, destination: '' }];

  const byId = new Map(listings.map((listing) => [listing.id, listing]));
  const recent = recentIds.map((id) => byId.get(id)).filter((listing): listing is PublicListing => !!listing);
  if (recent.length > 0) {
    sections.push({ key: 'recent', title: 'Annonces consultées récemment', listings: recent });
  }

  const byProvince = new Map<string, PublicListing[]>();
  for (const listing of listings) {
    const province = provinceName(listing.province);
    if (province) byProvince.set(province, [...(byProvince.get(province) ?? []), listing]);
  }
  [...byProvince]
    .filter(([, group]) => group.length >= MIN_SECTION_SIZE)
    .sort(([a, groupA], [b, groupB]) => groupB.length - groupA.length || a.localeCompare(b, 'fr'))
    .forEach(([province, group]) => {
      sections.push({ key: `province-${province}`, title: `Logements · ${province}`, listings: group, destination: province });
    });

  const topRated = listings
    .filter((listing) => listing.reviews_count > 0)
    .sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0) || b.reviews_count - a.reviews_count);
  if (topRated.length >= MIN_SECTION_SIZE) {
    sections.push({ key: 'top-rated', title: 'Les mieux notés par les voyageurs', listings: topRated });
  }

  const groups = listings.filter((listing) => listing.capacity >= 8).sort((a, b) => b.capacity - a.capacity);
  if (groups.length >= MIN_SECTION_SIZE) {
    sections.push({ key: 'groups', title: 'Pour les groupes · 8 voyageurs et plus', listings: groups });
  }

  const affordable = listings.filter((listing) => price(listing) > 0 && price(listing) < 200).sort((a, b) => price(a) - price(b));
  if (affordable.length >= MIN_SECTION_SIZE) {
    sections.push({ key: 'affordable', title: 'Moins de 200 € la nuit', listings: affordable });
  }

  return sections;
}

function spaceTypeLabel(spaceType: string | null): string {
  if (spaceType === 'entire') return 'Logement entier';
  if (spaceType === 'private') return 'Chambre privée';
  return 'Logement';
}

export function Home({ onPropertyClick, onSearch }: HomeProps) {
  const { isAuthenticated } = useAuth();
  const { width: windowWidth, mounted } = useWindowWidth();
  // Use undefined during SSR to avoid inline styles, let CSS handle it
  const cardWidth = mounted ? getCardWidth(windowWidth) : undefined;

  // Annonces actives de la base
  const { listings, failed, retry } = usePublicListings();

  // Annonces consultées sur ce navigateur (affichées aux visiteurs connectés)
  const [recentIds, setRecentIds] = useState<number[]>([]);
  useEffect(() => {
    setRecentIds(readRecentlyViewed());
  }, []);

  const sections = useMemo(
    () => (listings ? buildSections(listings, isAuthenticated ? recentIds : []) : []),
    [listings, recentIds, isAuthenticated],
  );

  const showDestination = (destination: string) => {
    onSearch?.({ destination });
  };

  return (
    <>
      {/* Search bar - hidden on mobile ; elle défile avec la page */}
      <div className="hidden md:block bg-[#FCFCFC] border-b border-gray-100">
        <SearchBar onSearch={onSearch} />
      </div>

      <main className="pb-12">
        {/* Chargement */}
        {!listings && !failed && (
          <PropertyCarousel title="Nos annonces" showMoreLink={false}>
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} style={{ width: cardWidth }} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-gray-200 mb-3" />
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </PropertyCarousel>
        )}

        {failed && (
          <div className="px-4 sm:px-6 lg:px-12 py-16 text-center">
            <p className="text-gray-700 mb-4">Impossible de charger les annonces pour le moment.</p>
            <button
              onClick={retry}
              className="px-5 py-2.5 rounded-lg border border-gray-900 text-sm hover:bg-gray-50 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Réessayer
            </button>
          </div>
        )}

        {listings && listings.length === 0 && (
          <p className="px-4 sm:px-6 lg:px-12 py-16 text-center text-gray-600">
            Aucun logement n&apos;est publié pour le moment.
          </p>
        )}

        {listings && listings.length > 0 && sections.map((section) => (
          <PropertyCarousel
            key={section.key}
            title={section.title}
            showMoreLink={section.destination !== undefined}
            onShowMore={section.destination !== undefined ? () => showDestination(section.destination!) : undefined}
          >
            {section.listings.map((listing) => (
              <div key={listing.id} style={{ width: cardWidth }} className="transition-all duration-300">
                <PropertyCard
                  id={String(listing.id)}
                  image={listing.photos?.[0]?.url || ''}
                  title={listing.title || 'Logement'}
                  location={placeLabel(listing)}
                  date=""
                  price={`${price(listing).toFixed(0)} € / nuit`}
                  rating={listing.reviews_count > 0 ? listing.average_rating : null}
                  badge={listing.reviews_count >= 3 && (listing.average_rating ?? 0) >= 4.8 ? 'Coup de coeur' : undefined}
                  guests={`${spaceTypeLabel(listing.space_type)} · ${listing.capacity} voyageur${listing.capacity > 1 ? 's' : ''}`}
                  onClick={() => onPropertyClick(String(listing.id))}
                />
              </div>
            ))}
          </PropertyCarousel>
        ))}
      </main>
    </>
  );
}
