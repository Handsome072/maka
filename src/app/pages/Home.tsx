import { PropertyCard } from '../components/PropertyCard';
import { PropertyCarousel } from '../components/PropertyCarousel';
import { SearchBar } from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { publicListingsApi, type Listing } from '../services/api';

interface HomeProps {
  isScrolled: boolean;
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

export function Home({ isScrolled, onPropertyClick, onSearch }: HomeProps) {
  const { isAuthenticated } = useAuth();
  const { width: windowWidth, mounted } = useWindowWidth();
  // Use undefined during SSR to avoid inline styles, let CSS handle it
  const cardWidth = mounted ? getCardWidth(windowWidth) : undefined;

  // Fetch real active listings from API
  const [publicListings, setPublicListings] = useState<Listing[]>([]);
  const [listingsLoaded, setListingsLoaded] = useState(false);

  useEffect(() => {
    publicListingsApi.getAll()
      .then(res => setPublicListings(res.listings))
      .catch(() => {})
      .finally(() => setListingsLoaded(true));
  }, []);

  // Photos from DB listings - first photo of each listing
  // Emily (57): 253=Sainte-Adele, 254=Charlevoix, 255=Sutton, 256=Stoneham, 257=Ile d'Orleans
  // Pascal (58): 258=Saint-Sauveur, 259=Mont-Tremblant, 260=Whistler, 261=Chelsea, 262=Muskoka
  // Lucas (59): 263=Tremblant, 264=Banff, 265=Tofino, 266=Lac-Saint-Jean, 267=Quebec
  // Romeo (60): 268=Charlevoix, 269=Tofino, 270=Canmore, 271=Val-des-Monts, 272=Lac-Saint-Jean
  const img = {
    253: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    254: 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=800&q=80',
    255: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=800&q=80',
    256: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    257: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80',
    258: 'https://images.unsplash.com/photo-1520984032042-162d526883e0?w=800&q=80',
    259: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    260: 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800&q=80',
    261: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&q=80',
    262: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
    263: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80',
    264: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80',
    265: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=800&q=80',
    266: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&q=80',
    267: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80',
    268: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    269: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
    270: 'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80',
    271: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
    272: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  } as Record<number, string>;

  // Annonces consultees recemment
  const recentlyViewedProperties = [
    { id: '253', image: img[253], title: 'Chalet bois rond · Sainte-Adele', location: 'Emily Hote', date: '', price: '195 C$ / nuit', rating: 4.95, badge: 'Coup de coeur' as const },
    { id: '258', image: img[258], title: 'Chalet rustique · Saint-Sauveur', location: 'Pascal Hote', date: '', price: '295 C$ / nuit', rating: 4.90, badge: 'Coup de coeur' as const },
    { id: '263', image: img[263], title: 'Cabane dans les arbres · Tremblant', location: 'Lucas Hote', date: '', price: '189 C$ / nuit', rating: 5.0, badge: 'Coup de coeur' as const },
    { id: '268', image: img[268], title: 'Chalet grand luxe · Charlevoix', location: 'Romeo Hote', date: '', price: '495 C$ / nuit', rating: 5.0, badge: 'Coup de coeur' as const },
    { id: '257', image: img[257], title: 'Maison champetre · Ile d\'Orleans', location: 'Emily Hote', date: '', price: '220 C$ / nuit', rating: 4.85, badge: undefined },
    { id: '259', image: img[259], title: 'Chalet spa · Mont-Tremblant', location: 'Pascal Hote', date: '', price: '320 C$ / nuit', rating: 4.88, badge: 'Nouveau' as const },
  ];

  // Chalets populaires · Laurentides (Emily 253, Pascal 258, Lucas 263, Romeo 268/270)
  const laurentidesProperties = [
    { id: '253', image: img[253], title: 'Chalet bois rond · Sainte-Adele', location: 'Emily Hote', date: '', price: '195 C$ / nuit', rating: 4.93, badge: 'Coup de coeur' as const },
    { id: '258', image: img[258], title: 'Chalet rustique · Saint-Sauveur', location: 'Pascal Hote', date: '', price: '295 C$ / nuit', rating: 4.92, badge: 'Coup de coeur' as const },
    { id: '263', image: img[263], title: 'Cabane dans les arbres · Tremblant', location: 'Lucas Hote', date: '', price: '189 C$ / nuit', rating: 4.96, badge: 'Populaire' as const },
    { id: '270', image: img[270], title: 'Chalet alpin · Canmore', location: 'Romeo Hote', date: '', price: '310 C$ / nuit', rating: 4.96, badge: 'Coup de coeur' as const },
    { id: '255', image: img[255], title: 'Refuge forestier · Sutton', location: 'Emily Hote', date: '', price: '155 C$ / nuit', rating: 4.90, badge: undefined },
    { id: '259', image: img[259], title: 'Chalet spa · Mont-Tremblant', location: 'Pascal Hote', date: '', price: '320 C$ / nuit', rating: 5.0, badge: 'Coup de coeur' as const },
    { id: '266', image: img[266], title: 'Chalet du Lac-Saint-Jean · Alma', location: 'Lucas Hote', date: '', price: '165 C$ / nuit', rating: 4.92, badge: 'Nouveau' as const },
  ];

  // Chalets a la une · Charlevoix
  const charlevoixProperties = [
    { id: '268', image: img[268], title: 'Chalet grand luxe · La Malbaie', location: 'Romeo Hote', date: '', price: '495 C$ / nuit', rating: 4.95, badge: 'Populaire' as const },
    { id: '254', image: img[254], title: 'Chalet vue fleuve · Baie-Saint-Paul', location: 'Emily Hote', date: '', price: '275 C$ / nuit', rating: 4.88, badge: 'Nouveau' as const },
    { id: '260', image: img[260], title: 'Chalet ski alpin · Whistler', location: 'Pascal Hote', date: '', price: '450 C$ / nuit', rating: 5.0, badge: 'Coup de coeur' as const },
    { id: '264', image: img[264], title: 'Chalet de montagne · Banff', location: 'Lucas Hote', date: '', price: '380 C$ / nuit', rating: 4.89, badge: undefined },
    { id: '269', image: img[269], title: 'Cabane ocean · Tofino', location: 'Romeo Hote', date: '', price: '295 C$ / nuit', rating: 4.92, badge: 'Populaire' as const },
    { id: '256', image: img[256], title: 'Grand chalet ski · Stoneham', location: 'Emily Hote', date: '', price: '345 C$ / nuit', rating: 4.77, badge: undefined },
    { id: '261', image: img[261], title: 'Chalet familial · Chelsea', location: 'Pascal Hote', date: '', price: '215 C$ / nuit', rating: 4.85, badge: 'Nouveau' as const },
  ];

  // Chalets disponibles · Cantons-de-l'Est
  const cantonsProperties = [
    { id: '265', image: img[265], title: 'Refuge cotier · Tofino', location: 'Lucas Hote', date: '', price: '265 C$ / nuit', rating: 4.90, badge: 'Nouveau' as const },
    { id: '271', image: img[271], title: 'Maison champetre · Val-des-Monts', location: 'Romeo Hote', date: '', price: '185 C$ / nuit', rating: 5.0, badge: 'Coup de coeur' as const },
    { id: '255', image: img[255], title: 'Refuge forestier · Sutton', location: 'Emily Hote', date: '', price: '155 C$ / nuit', rating: 4.90, badge: 'Populaire' as const },
    { id: '258', image: img[258], title: 'Chalet rustique · Saint-Sauveur', location: 'Pascal Hote', date: '', price: '295 C$ / nuit', rating: 4.89, badge: undefined },
    { id: '266', image: img[266], title: 'Chalet du lac · Alma', location: 'Lucas Hote', date: '', price: '165 C$ / nuit', rating: 4.90, badge: 'Coup de coeur' as const },
    { id: '272', image: img[272], title: 'Chalet de peche · Roberval', location: 'Romeo Hote', date: '', price: '175 C$ / nuit', rating: 4.84, badge: undefined },
    { id: '254', image: img[254], title: 'Chalet vue fleuve · Charlevoix', location: 'Emily Hote', date: '', price: '275 C$ / nuit', rating: 5.0, badge: 'Nouveau' as const },
  ];

  // Chalets · Muskoka
  const muskokaProperties = [
    { id: '262', image: img[262], title: 'Chalet sur le lac · Bracebridge', location: 'Pascal Hote', date: '', price: '285 C$ / nuit', rating: 5.0, badge: 'Coup de coeur' as const },
    { id: '263', image: img[263], title: 'Cabane dans les arbres · Tremblant', location: 'Lucas Hote', date: '', price: '189 C$ / nuit', rating: 4.91, badge: 'Populaire' as const },
    { id: '268', image: img[268], title: 'Chalet grand luxe · Charlevoix', location: 'Romeo Hote', date: '', price: '495 C$ / nuit', rating: 4.88, badge: undefined },
    { id: '253', image: img[253], title: 'Chalet bois rond · Sainte-Adele', location: 'Emily Hote', date: '', price: '195 C$ / nuit', rating: 4.95, badge: 'Nouveau' as const },
    { id: '261', image: img[261], title: 'Chalet familial · Chelsea', location: 'Pascal Hote', date: '', price: '215 C$ / nuit', rating: 4.92, badge: undefined },
    { id: '264', image: img[264], title: 'Chalet de montagne · Banff', location: 'Lucas Hote', date: '', price: '380 C$ / nuit', rating: 4.88, badge: 'Coup de coeur' as const },
    { id: '272', image: img[272], title: 'Chalet de peche · Roberval', location: 'Romeo Hote', date: '', price: '175 C$ / nuit', rating: 4.90, badge: 'Populaire' as const },
  ];

  // Chalets disponibles · Mont-Tremblant
  const tremblantProperties = [
    { id: '256', image: img[256], title: 'Grand chalet ski · Stoneham', location: 'Emily Hote', date: '', price: '345 C$ / nuit', rating: 4.97, badge: 'Populaire' as const },
    { id: '259', image: img[259], title: 'Chalet spa · Lac-Tremblant', location: 'Pascal Hote', date: '', price: '320 C$ / nuit', rating: 4.86, badge: undefined },
    { id: '265', image: img[265], title: 'Refuge cotier · Tofino', location: 'Lucas Hote', date: '', price: '265 C$ / nuit', rating: 4.91, badge: 'Nouveau' as const },
    { id: '268', image: img[268], title: 'Chalet grand luxe · Charlevoix', location: 'Romeo Hote', date: '', price: '495 C$ / nuit', rating: 5.0, badge: 'Coup de coeur' as const },
    { id: '257', image: img[257], title: 'Maison champetre · Ile d\'Orleans', location: 'Emily Hote', date: '', price: '220 C$ / nuit', rating: 4.89, badge: undefined },
    { id: '262', image: img[262], title: 'Chalet sur le lac · Muskoka', location: 'Pascal Hote', date: '', price: '285 C$ / nuit', rating: 4.90, badge: 'Populaire' as const },
    { id: '267', image: img[267], title: 'Loft heritage · Vieux-Quebec', location: 'Lucas Hote', date: '', price: '225 C$ / nuit', rating: 4.95, badge: 'Nouveau' as const },
  ];

  // Chalets · Whistler
  const whistlerProperties = [
    { id: '270', image: img[270], title: 'Chalet alpin · Canmore', location: 'Romeo Hote', date: '', price: '310 C$ / nuit', rating: 4.94, badge: 'Coup de coeur' as const },
    { id: '253', image: img[253], title: 'Chalet bois rond · Sainte-Adele', location: 'Emily Hote', date: '', price: '195 C$ / nuit', rating: 5.0, badge: 'Populaire' as const },
    { id: '260', image: img[260], title: 'Chalet ski alpin · Whistler', location: 'Pascal Hote', date: '', price: '450 C$ / nuit', rating: 4.93, badge: undefined },
    { id: '264', image: img[264], title: 'Chalet de montagne · Banff', location: 'Lucas Hote', date: '', price: '380 C$ / nuit', rating: 4.88, badge: 'Nouveau' as const },
    { id: '269', image: img[269], title: 'Cabane ocean · Tofino', location: 'Romeo Hote', date: '', price: '295 C$ / nuit', rating: 4.92, badge: 'Coup de coeur' as const },
    { id: '255', image: img[255], title: 'Refuge forestier · Sutton', location: 'Emily Hote', date: '', price: '155 C$ / nuit', rating: 4.85, badge: undefined },
    { id: '259', image: img[259], title: 'Chalet spa · Mont-Tremblant', location: 'Pascal Hote', date: '', price: '320 C$ / nuit', rating: 4.91, badge: 'Nouveau' as const },
  ];

  // Chalets disponibles · Quebec
  const quebecProperties = [
    { id: '267', image: img[267], title: 'Loft heritage · Vieux-Quebec', location: 'Lucas Hote', date: '', price: '225 C$ / nuit', rating: 4.88, badge: 'Populaire' as const },
    { id: '271', image: img[271], title: 'Maison champetre · Val-des-Monts', location: 'Romeo Hote', date: '', price: '185 C$ / nuit', rating: 4.78, badge: undefined },
    { id: '256', image: img[256], title: 'Grand chalet ski · Stoneham', location: 'Emily Hote', date: '', price: '345 C$ / nuit', rating: 4.86, badge: 'Nouveau' as const },
    { id: '258', image: img[258], title: 'Chalet rustique · Saint-Sauveur', location: 'Pascal Hote', date: '', price: '295 C$ / nuit', rating: 4.90, badge: undefined },
    { id: '263', image: img[263], title: 'Cabane dans les arbres · Tremblant', location: 'Lucas Hote', date: '', price: '189 C$ / nuit', rating: 4.95, badge: 'Coup de coeur' as const },
    { id: '268', image: img[268], title: 'Chalet grand luxe · Charlevoix', location: 'Romeo Hote', date: '', price: '495 C$ / nuit', rating: 5.0, badge: 'Populaire' as const },
    { id: '257', image: img[257], title: 'Maison champetre · Ile d\'Orleans', location: 'Emily Hote', date: '', price: '220 C$ / nuit', rating: 4.86, badge: undefined },
  ];

  // Chalets · Banff
  const banffProperties = [
    { id: '260', image: img[260], title: 'Chalet ski alpin · Whistler', location: 'Pascal Hote', date: '', price: '450 C$ / nuit', rating: 4.98, badge: 'Coup de coeur' as const },
    { id: '264', image: img[264], title: 'Chalet de montagne · Banff', location: 'Lucas Hote', date: '', price: '380 C$ / nuit', rating: 4.94, badge: 'Nouveau' as const },
    { id: '270', image: img[270], title: 'Chalet alpin · Canmore', location: 'Romeo Hote', date: '', price: '310 C$ / nuit', rating: 5.0, badge: 'Populaire' as const },
    { id: '254', image: img[254], title: 'Chalet vue fleuve · Charlevoix', location: 'Emily Hote', date: '', price: '275 C$ / nuit', rating: 4.89, badge: undefined },
    { id: '259', image: img[259], title: 'Chalet spa · Mont-Tremblant', location: 'Pascal Hote', date: '', price: '320 C$ / nuit', rating: 4.92, badge: 'Coup de coeur' as const },
    { id: '266', image: img[266], title: 'Chalet du lac · Alma', location: 'Lucas Hote', date: '', price: '165 C$ / nuit', rating: 4.80, badge: undefined },
    { id: '269', image: img[269], title: 'Cabane ocean · Tofino', location: 'Romeo Hote', date: '', price: '295 C$ / nuit', rating: 4.95, badge: 'Nouveau' as const },
  ];

  // Chalets a decouvrir · Tofino
  const tofinoProperties = [
    { id: '257', image: img[257], title: 'Maison champetre · Ile d\'Orleans', location: 'Emily Hote', date: '', price: '220 C$ / nuit', rating: 4.94, badge: 'Populaire' as const },
    { id: '262', image: img[262], title: 'Chalet sur le lac · Muskoka', location: 'Pascal Hote', date: '', price: '285 C$ / nuit', rating: 4.90, badge: undefined },
    { id: '265', image: img[265], title: 'Refuge cotier · Tofino', location: 'Lucas Hote', date: '', price: '265 C$ / nuit', rating: 4.88, badge: 'Nouveau' as const },
    { id: '269', image: img[269], title: 'Cabane ocean · Tofino', location: 'Romeo Hote', date: '', price: '295 C$ / nuit', rating: 5.0, badge: 'Coup de coeur' as const },
    { id: '253', image: img[253], title: 'Chalet bois rond · Sainte-Adele', location: 'Emily Hote', date: '', price: '195 C$ / nuit', rating: 4.85, badge: undefined },
    { id: '261', image: img[261], title: 'Chalet familial · Chelsea', location: 'Pascal Hote', date: '', price: '215 C$ / nuit', rating: 4.92, badge: 'Populaire' as const },
    { id: '267', image: img[267], title: 'Loft heritage · Vieux-Quebec', location: 'Lucas Hote', date: '', price: '225 C$ / nuit', rating: 4.96, badge: 'Nouveau' as const },
  ];

  // Chalets populaires · Gatineau
  const gatineauProperties = [
    { id: '271', image: img[271], title: 'Maison champetre · Val-des-Monts', location: 'Romeo Hote', date: '', price: '185 C$ / nuit', rating: 4.93, badge: 'Coup de coeur' as const },
    { id: '255', image: img[255], title: 'Refuge forestier · Sutton', location: 'Emily Hote', date: '', price: '155 C$ / nuit', rating: 4.85, badge: 'Nouveau' as const },
    { id: '261', image: img[261], title: 'Chalet familial · Chelsea', location: 'Pascal Hote', date: '', price: '215 C$ / nuit', rating: 4.88, badge: 'Populaire' as const },
    { id: '264', image: img[264], title: 'Chalet de montagne · Banff', location: 'Lucas Hote', date: '', price: '380 C$ / nuit', rating: 4.92, badge: undefined },
    { id: '268', image: img[268], title: 'Chalet grand luxe · Charlevoix', location: 'Romeo Hote', date: '', price: '495 C$ / nuit', rating: 4.90, badge: 'Coup de coeur' as const },
    { id: '254', image: img[254], title: 'Chalet vue fleuve · Charlevoix', location: 'Emily Hote', date: '', price: '275 C$ / nuit', rating: 4.78, badge: undefined },
    { id: '261', image: img[261], title: 'Chalet Parc Gatineau · Chelsea', location: 'Pascal Hote', date: '', price: '215 C$ / nuit', rating: 4.95, badge: 'Nouveau' as const },
  ];

  // Chalets · Lac-Saint-Jean
  const lacStJeanProperties = [
    { id: '266', image: img[266], title: 'Chalet du lac · Alma', location: 'Lucas Hote', date: '', price: '165 C$ / nuit', rating: 5.0, badge: 'Populaire' as const },
    { id: '272', image: img[272], title: 'Chalet de peche · Roberval', location: 'Romeo Hote', date: '', price: '175 C$ / nuit', rating: 4.89, badge: undefined },
    { id: '256', image: img[256], title: 'Grand chalet ski · Stoneham', location: 'Emily Hote', date: '', price: '345 C$ / nuit', rating: 4.86, badge: 'Nouveau' as const },
    { id: '259', image: img[259], title: 'Chalet spa · Mont-Tremblant', location: 'Pascal Hote', date: '', price: '320 C$ / nuit', rating: 4.90, badge: undefined },
    { id: '265', image: img[265], title: 'Refuge cotier · Tofino', location: 'Lucas Hote', date: '', price: '265 C$ / nuit', rating: 4.88, badge: 'Coup de coeur' as const },
    { id: '272', image: img[272], title: 'Chalet peche · Lac-Saint-Jean', location: 'Romeo Hote', date: '', price: '175 C$ / nuit', rating: 4.93, badge: 'Populaire' as const },
    { id: '257', image: img[257], title: 'Maison champetre · Ile d\'Orleans', location: 'Emily Hote', date: '', price: '220 C$ / nuit', rating: 4.82, badge: undefined },
  ];

  return (
    <>
      {/* Search bar - hidden on mobile and when scrolled */}
      <div className={`hidden md:block transition-all duration-300 ${isScrolled ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-40 opacity-100'}`}>
        <SearchBar onSearch={onSearch} />
      </div>

      <main className="pb-12">
        {/* Annonces publiées (real data from API) */}
        {listingsLoaded && publicListings.length > 0 && (
          <PropertyCarousel
            title="Nos annonces"
            showMoreLink={true}
          >
            {publicListings.map((listing) => (
              <div key={listing.id} style={{ width: cardWidth }} className="transition-all duration-300">
                <PropertyCard
                  id={String(listing.id)}
                  image={listing.photos?.[0]?.url || 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=400'}
                  title={`${listing.title || 'Logement'} · ${listing.city || ''}`}
                  location={listing.space_type === 'entire' ? 'Logement entier' : listing.space_type === 'private' ? 'Chambre privée' : 'Logement'}
                  date=""
                  price={`${Number(listing.base_price || 0).toFixed(0)} C$ / nuit`}
                  rating={0}
                  badge="Nouveau"
                  guests={`${listing.capacity} voyageurs`}
                  onClick={() => onPropertyClick(String(listing.id))}
                />
              </div>
            ))}
          </PropertyCarousel>
        )}

        {/* Annonces consultées récemment - visible only when authenticated */}
        {isAuthenticated && (
          <PropertyCarousel
            title="Annonces consultées récemment"
            showMoreLink={true}
          >
            {recentlyViewedProperties.map((property, index) => (
              <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
                <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
              </div>
            ))}
          </PropertyCarousel>
        )}

        {/* Chalets populaires · Laurentides */}
        <PropertyCarousel
          title="Chalets populaires · Laurentides"
          showMoreLink={true}
        >
          {laurentidesProperties.map((property, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Chalets à la une · Charlevoix */}
        <PropertyCarousel
          title="Chalets à la une · Charlevoix"
          showMoreLink={true}
        >
          {charlevoixProperties.map((property, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Chalets disponibles · Cantons-de-l'Est */}
        <PropertyCarousel
          title="Chalets disponibles · Cantons-de-l'Est"
          showMoreLink={true}
        >
          {cantonsProperties.map((property, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Chalets · Muskoka */}
        <PropertyCarousel
          title="Chalets · Muskoka"
          showMoreLink={true}
        >
          {muskokaProperties.map((property, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Chalets disponibles · Mont-Tremblant */}
        <PropertyCarousel
          title="Chalets disponibles · Mont-Tremblant"
          showMoreLink={true}
        >
          {tremblantProperties.map((property, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Chalets · Whistler */}
        <PropertyCarousel
          title="Chalets · Whistler"
          showMoreLink={true}
        >
          {whistlerProperties.map((property, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Chalets disponibles · Québec */}
        <PropertyCarousel
          title="Chalets disponibles · Québec"
          showMoreLink={true}
        >
          {quebecProperties.map((property, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Chalets · Banff */}
        <PropertyCarousel
          title="Chalets · Banff"
          showMoreLink={true}
        >
          {banffProperties.map((property, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Chalets à découvrir · Tofino */}
        <PropertyCarousel
          title="Chalets à découvrir · Tofino"
          showMoreLink={true}
        >
          {tofinoProperties.map((property, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Chalets populaires · Gatineau */}
        <PropertyCarousel
          title="Chalets populaires · Gatineau"
          showMoreLink={true}
        >
          {gatineauProperties.map((property, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Chalets · Lac-Saint-Jean */}
        <PropertyCarousel
          title="Chalets · Lac-Saint-Jean"
          showMoreLink={true}
        >
          {lacStJeanProperties.map((property, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <PropertyCard {...property} onClick={() => onPropertyClick(property.id)} />
            </div>
          ))}
        </PropertyCarousel>
      </main>
    </>
  );
}