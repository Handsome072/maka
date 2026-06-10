/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DEMO STATIQUE — données d'annonces figées pour la démo Vercel
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Ce fichier permet d'afficher toute l'interface SANS backend (api-homiqio).
 * Les photos sont des URLs Unsplash statiques (non reliées à l'API).
 *
 * ⚠️  TEMPORAIRE — pour remettre le site en mode "API réelle" :
 *      mettre `DEMO_MODE = false` ci-dessous (ou supprimer ce fichier et
 *      restaurer les appels API dans `publicListingsApi` de `services/api.ts`).
 *
 * Voir `services/api.ts` → `publicListingsApi` pour le branchement.
 */

import type {
  Listing,
  ListingDetail,
  ListingPhoto,
  ListingHost,
  ReviewsSummary,
  Review,
} from '../services/api';

/** Interrupteur global de la démo statique. */
export const DEMO_MODE = true;

// ─── Table de base des annonces (cohérente avec les carrousels du Home) ──────

interface DemoBase {
  id: number;
  name: string;          // titre du logement (sans la ville)
  city: string;
  province: string;
  cover: string;         // photo Unsplash (= image du carrousel Home)
  host: string;          // prénom de l'hôte
  price: number;         // prix de base / nuit (C$)
  rating: number;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  space_type: 'entire' | 'private';
  favorite?: boolean;
}

const BASE: DemoBase[] = [
  { id: 253, name: 'Chalet bois rond', city: 'Sainte-Adèle', province: 'Québec', cover: 'photo-1464822759023-fed622ff2c3b', host: 'Emily', price: 195, rating: 4.95, capacity: 6, bedrooms: 3, bathrooms: 2, space_type: 'entire', favorite: true },
  { id: 254, name: 'Chalet vue fleuve', city: 'Baie-Saint-Paul', province: 'Québec', cover: 'photo-1518732714860-b62714ce0c59', host: 'Emily', price: 275, rating: 4.88, capacity: 8, bedrooms: 4, bathrooms: 2, space_type: 'entire' },
  { id: 255, name: 'Refuge forestier', city: 'Sutton', province: 'Québec', cover: 'photo-1537225228614-56cc3556d7ed', host: 'Emily', price: 155, rating: 4.90, capacity: 4, bedrooms: 2, bathrooms: 1, space_type: 'entire' },
  { id: 256, name: 'Grand chalet ski', city: 'Stoneham', province: 'Québec', cover: 'photo-1506744038136-46273834b3fb', host: 'Emily', price: 345, rating: 4.77, capacity: 10, bedrooms: 5, bathrooms: 3, space_type: 'entire' },
  { id: 257, name: 'Maison champêtre', city: "Île d'Orléans", province: 'Québec', cover: 'photo-1600573472550-8090b5e0745e', host: 'Emily', price: 220, rating: 4.85, capacity: 6, bedrooms: 3, bathrooms: 2, space_type: 'entire' },
  { id: 258, name: 'Chalet rustique', city: 'Saint-Sauveur', province: 'Québec', cover: 'photo-1520984032042-162d526883e0', host: 'Pascal', price: 295, rating: 4.90, capacity: 8, bedrooms: 4, bathrooms: 2, space_type: 'entire', favorite: true },
  { id: 259, name: 'Chalet spa', city: 'Mont-Tremblant', province: 'Québec', cover: 'photo-1512917774080-9991f1c4c750', host: 'Pascal', price: 320, rating: 4.88, capacity: 8, bedrooms: 4, bathrooms: 3, space_type: 'entire', favorite: true },
  { id: 260, name: 'Chalet ski alpin', city: 'Whistler', province: 'Colombie-Britannique', cover: 'photo-1499696010180-025ef6e1a8f9', host: 'Pascal', price: 450, rating: 5.0, capacity: 12, bedrooms: 6, bathrooms: 4, space_type: 'entire', favorite: true },
  { id: 261, name: 'Chalet familial', city: 'Chelsea', province: 'Québec', cover: 'photo-1505843513577-22bb7d21e455', host: 'Pascal', price: 215, rating: 4.85, capacity: 6, bedrooms: 3, bathrooms: 2, space_type: 'entire' },
  { id: 262, name: 'Chalet du lac', city: 'Muskoka', province: 'Ontario', cover: 'photo-1552321554-5fefe8c9ef14', host: 'Pascal', price: 260, rating: 4.83, capacity: 7, bedrooms: 3, bathrooms: 2, space_type: 'entire' },
  { id: 263, name: 'Cabane dans les arbres', city: 'Tremblant', province: 'Québec', cover: 'photo-1596178065887-1198b6148b2b', host: 'Lucas', price: 189, rating: 5.0, capacity: 2, bedrooms: 1, bathrooms: 1, space_type: 'entire', favorite: true },
  { id: 264, name: 'Chalet de montagne', city: 'Banff', province: 'Alberta', cover: 'photo-1542718610-a1d656d1884c', host: 'Lucas', price: 380, rating: 4.89, capacity: 10, bedrooms: 5, bathrooms: 3, space_type: 'entire' },
  { id: 265, name: 'Refuge côtier', city: 'Tofino', province: 'Colombie-Britannique', cover: 'photo-1604014237800-1c9102c219da', host: 'Lucas', price: 265, rating: 4.90, capacity: 4, bedrooms: 2, bathrooms: 2, space_type: 'entire' },
  { id: 266, name: 'Chalet du lac', city: 'Alma', province: 'Québec', cover: 'photo-1544984243-ec57ea16fe25', host: 'Lucas', price: 165, rating: 5.0, capacity: 6, bedrooms: 3, bathrooms: 1, space_type: 'entire', favorite: true },
  { id: 267, name: 'Maison de ville', city: 'Québec', province: 'Québec', cover: 'photo-1560185007-cde436f6a4d0', host: 'Lucas', price: 240, rating: 4.86, capacity: 5, bedrooms: 2, bathrooms: 2, space_type: 'entire' },
  { id: 268, name: 'Chalet grand luxe', city: 'La Malbaie', province: 'Québec', cover: 'photo-1520250497591-112f2f40a3f4', host: 'Roméo', price: 495, rating: 5.0, capacity: 12, bedrooms: 6, bathrooms: 4, space_type: 'entire', favorite: true },
  { id: 269, name: 'Cabane océan', city: 'Tofino', province: 'Colombie-Britannique', cover: 'photo-1570129477492-45c003edd2be', host: 'Roméo', price: 295, rating: 4.92, capacity: 4, bedrooms: 2, bathrooms: 1, space_type: 'entire', favorite: true },
  { id: 270, name: 'Chalet alpin', city: 'Canmore', province: 'Alberta', cover: 'photo-1630699144867-37acec97df5a', host: 'Roméo', price: 310, rating: 4.96, capacity: 8, bedrooms: 4, bathrooms: 3, space_type: 'entire', favorite: true },
  { id: 271, name: 'Maison champêtre', city: 'Val-des-Monts', province: 'Québec', cover: 'photo-1600047509807-ba8f99d2cdde', host: 'Roméo', price: 185, rating: 5.0, capacity: 6, bedrooms: 3, bathrooms: 2, space_type: 'entire', favorite: true },
  { id: 272, name: 'Chalet de pêche', city: 'Roberval', province: 'Québec', cover: 'photo-1600585154340-be6161a56a0c', host: 'Roméo', price: 175, rating: 4.89, capacity: 5, bedrooms: 2, bathrooms: 1, space_type: 'entire' },
];

// Pool d'images Unsplash supplémentaires (intérieurs/extérieurs de chalet)
// pour garnir les galeries des pages détail.
const GALLERY_POOL = [
  'photo-1449158743715-0a90ebb6d2d8',
  'photo-1586105251261-72a756497a11',
  'photo-1505693416388-ac5ce068fe85',
  'photo-1502672260266-1c1ef2d93688',
  'photo-1556912173-3bb406ef7e77',
  'photo-1507089947368-19c1da9775ae',
  'photo-1564013799919-ab600027ffc6',
  'photo-1582268611958-ebfd161ef9cf',
];

// Photos de profil des hôtes (Unsplash, statiques).
const HOST_PHOTOS: Record<string, string> = {
  Emily: 'photo-1494790108377-be9c29b29330',
  Pascal: 'photo-1500648767791-00dcc994a43e',
  Lucas: 'photo-1507003211169-0a1dd7228f2d',
  Roméo: 'photo-1506794778202-cad84cf45f1d',
};

const u = (slug: string, w = 1200) =>
  `https://images.unsplash.com/${slug}?w=${w}&q=80&auto=format&fit=crop`;

function buildPhotos(b: DemoBase): ListingPhoto[] {
  const slugs = [b.cover];
  for (let i = 0; i < 4; i++) {
    slugs.push(GALLERY_POOL[(b.id + i) % GALLERY_POOL.length]);
  }
  return slugs.map((slug, order) => ({ id: b.id * 10 + order, url: u(slug), order }));
}

const AMENITIES = [
  'wifi', 'kitchen', 'free_parking', 'fireplace', 'hot_tub',
  'washer', 'heating', 'tv', 'bbq', 'lake_access',
];

function buildListing(b: DemoBase): Listing {
  return {
    id: b.id,
    status: 'active',
    title: b.name,
    subtitle: `${b.city}, ${b.province}`,
    city: b.city,
    province: b.province,
    country: 'Canada',
    space_type: b.space_type,
    capacity: b.capacity,
    bathrooms: b.bathrooms,
    base_price: String(b.price),
    currency: 'CAD',
    cancellation_policy: 'flexible',
    reservation_mode: 'instant',
    host_photo_url: u(HOST_PHOTOS[b.host] || HOST_PHOTOS.Emily, 200),
    photos: buildPhotos(b),
    created_at: '2025-01-15T10:00:00.000Z',
    updated_at: '2025-02-01T10:00:00.000Z',
  };
}

function buildHost(b: DemoBase): ListingHost {
  return {
    id: 5700 + b.id,
    first_name: b.host,
    profile_photo_url: u(HOST_PHOTOS[b.host] || HOST_PHOTOS.Emily, 200),
    profession: 'Hôte Superhost',
    interests: ['Randonnée', 'Cuisine', 'Voyage'],
    languages_spoken: ['Français', 'Anglais'],
    identity_verified: true,
    phone_verified: true,
    member_since: '2021-06-01T00:00:00.000Z',
    reviews_count: 128,
    average_rating: 4.92,
    response_rate: 100,
    response_time: "moins d'une heure",
  };
}

function buildReviewsSummary(b: DemoBase): ReviewsSummary {
  const count = 24;
  return {
    count,
    average_rating: b.rating,
    cleanliness_avg: 4.9,
    accuracy_avg: 4.8,
    checkin_avg: 5.0,
    communication_avg: 4.9,
    location_avg: 4.8,
    value_avg: 4.7,
    rating_distribution: { 5: 20, 4: 3, 3: 1, 2: 0, 1: 0 },
    is_guest_favorite: !!b.favorite || b.rating >= 4.95,
  };
}

const SAMPLE_REVIEWS: Array<{ name: string; text: string; photo: string }> = [
  { name: 'Sophie', text: "Endroit magnifique, calme et parfaitement équipé. On reviendra sans hésiter !", photo: 'photo-1438761681033-6461ffad8d80' },
  { name: 'Marc', text: "Accueil chaleureux et vue imprenable. Le chalet est encore plus beau que sur les photos.", photo: 'photo-1633332755192-727a05c4013d' },
  { name: 'Julie', text: "Super séjour en famille. Propreté impeccable et hôte très réactif.", photo: 'photo-1494790108377-be9c29b29330' },
  { name: 'Antoine', text: "Le spa après une journée de ski, un vrai bonheur. Je recommande vivement.", photo: 'photo-1500648767791-00dcc994a43e' },
];

function buildReviews(b: DemoBase): Review[] {
  return SAMPLE_REVIEWS.map((r, i) => ({
    id: b.id * 100 + i,
    rating: 5,
    text: r.text,
    created_at: `2025-0${(i % 5) + 1}-12T10:00:00.000Z`,
    user: {
      first_name: r.name,
      profile_photo_url: u(r.photo, 120),
      member_since: '2020-01-01T00:00:00.000Z',
    },
  }));
}

function buildListingDetail(b: DemoBase): ListingDetail {
  return {
    ...buildListing(b),
    latitude: 46.8 + (b.id % 10) * 0.05,
    longitude: -71.2 - (b.id % 10) * 0.05,
    amenities: AMENITIES,
    description:
      `Bienvenue dans ce ${b.name.toLowerCase()} situé à ${b.city}. ` +
      `Un cadre idéal pour se ressourcer en pleine nature, avec tout le confort moderne. ` +
      `Profitez d'un espace chaleureux pouvant accueillir jusqu'à ${b.capacity} voyageurs.`,
    about_chalet:
      `${b.bedrooms} chambres, ${b.bathrooms} salle(s) de bain, foyer, et un accès privilégié à la nature environnante.`,
    neighborhood: `Quartier paisible de ${b.city}, à proximité des sentiers, lacs et commerces locaux.`,
    host: buildHost(b),
    reviews_summary: buildReviewsSummary(b),
    reviews: buildReviews(b),
  };
}

// ─── API publique de la démo ─────────────────────────────────────────────────

/** Toutes les annonces (pour Home « Nos annonces », Annonces, Search). */
export function getDemoListings(): Listing[] {
  return BASE.map(buildListing);
}

/**
 * Détail d'une annonce. Renvoie toujours un résultat valide :
 * si l'id n'existe pas dans la table, on en synthétise un à partir d'une
 * entrée existante pour que toute page /property/[id] reste affichable.
 */
export function getDemoListingDetail(id: number): ListingDetail {
  const found = BASE.find((b) => b.id === id);
  if (found) return buildListingDetail(found);
  const fallback = BASE[id % BASE.length];
  return buildListingDetail({ ...fallback, id });
}
