import {
  Waves, Anchor, LifeBuoy, Thermometer, Activity, Fish, Droplets,
  Warehouse, Sunset, Flame, Ship, Fuel, Sparkles, Utensils, DoorOpen,
  Trees, Bed, Umbrella, Eye, CloudRain, Snowflake, Armchair,
  Wifi, Tv, Car, Bike, UtensilsCrossed, Coffee, Baby, Accessibility, Ban,
} from 'lucide-react';
import type { Step } from './types';

export const SUMMARY_CHALET_IMG =
  "https://images.unsplash.com/photo-1685475512320-eede8aea2b95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBjaGFsZXQlMjBleHRlcmlvciUyMGdyZWVuJTIwbmF0dXJlfGVufDF8fHx8MTc3MDk5NTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export const STEPS_LIST: Step[] = [
  'acceptance-condition',
  'reservation-type',
  'address-location',
  'capacity-details',
  'client-expectations',
  'amenities',
  'summary-review-1',
  'host-photo',
  'chalet-photos',
  'chalet-description',
  'summary-review-2',
  'permissions',
  'reservation-mode',
  'pricing',
  'fees',
  'calendar',
  'cancellation-policy',
  'laws-taxes',
  'local-laws',
  'guest-arrival',
  'phone-number',
  'summary-review-3',
  'verification',
  'signature',
];

export const AMENITIES_DATA = {
  'Attraits extérieurs': [
    { id: 'water_access', label: "Accès à l'eau", icon: Waves },
    { id: 'lounge_chairs', label: "Chaises longues", icon: Armchair },
    { id: 'dock', label: "Quai", icon: Anchor },
    { id: 'life_jackets', label: "Gilets de sauvetage", icon: LifeBuoy },
    { id: 'pool', label: "Piscine", icon: Droplets },
    { id: 'sauna', label: "Sauna", icon: Thermometer },
    { id: 'volleyball', label: "Filet de volley-ball", icon: Activity },
    { id: 'lake_front', label: "Au bord d'un lac", icon: Fish },
    { id: 'near_water', label: "Près de l'eau", icon: Waves },
    { id: 'garage', label: "Accès au garage", icon: Warehouse },
    { id: 'sea_front', label: "Au bord de la mer", icon: Sunset },
    { id: 'fire_pit', label: "Foyer extérieur", icon: Flame },
    { id: 'electric_boat', label: "Lac navigable (électrique)", icon: Ship },
    { id: 'propane', label: "Propane inclus", icon: Fuel },
    { id: 'spa', label: "Spa", icon: Sparkles },
    { id: 'bbq', label: "BBQ/Grill", icon: Utensils },
    { id: 'balcony', label: "Balcon/terrasse", icon: DoorOpen },
    { id: 'backyard', label: "Cour arrière", icon: Trees },
    { id: 'boat_dock', label: "Débarcadère bateaux", icon: Ship },
    { id: 'hammock', label: "Hamak", icon: Bed },
    { id: 'motor_boat', label: "Lac navigable (moteur)", icon: Ship },
    { id: 'beach', label: "Plage", icon: Umbrella },
    { id: 'view', label: "Vue", icon: Eye },
    { id: 'river_front', label: "Au bord d'une rivière", icon: CloudRain },
    { id: 'ski_in_out', label: "Ski-in/ski-out", icon: Snowflake },
  ],
  'Sports et activités à proximité': [
    { id: 'hiking', label: "Randonnée", icon: Trees },
    { id: 'cycling', label: "Piste cyclable", icon: Bike },
  ],
  'Attraits intérieurs': [
    { id: 'wifi', label: "Wi-Fi", icon: Wifi },
    { id: 'tv', label: "Télévision", icon: Tv },
  ],
  'Cuisine': [
    { id: 'kitchen_full', label: "Cuisine équipée", icon: UtensilsCrossed },
  ],
  'Café': [
    { id: 'coffee_maker', label: "Cafetière", icon: Coffee },
  ],
  'Attraits pour la famille': [
    { id: 'crib', label: "Lit pour bébé", icon: Baby },
  ],
  'Accessibilité': [
    { id: 'step_free', label: "Plain-pied", icon: Accessibility },
  ],
  'Services': [
    { id: 'parking', label: "Stationnement", icon: Car },
  ],
  'Exclusion': [
    { id: 'no_smoking', label: "Non fumeur", icon: Ban },
  ],
};

export const EXPECTATIONS_DATA = {
  client: [
    { id: 'noise', label: "Risque de bruit à proximité" },
    { id: 'bad_cell', label: "La réception cellulaire est mauvaise" },
    { id: '4x4_required', label: "Véhicule à 4 roues motrices nécessaires" },
    { id: 'non_potable_water', label: "Eau non potable" },
    { id: 'stairs_only', label: "Accès par escaliers seulement" },
  ],
  safety: [
    { id: 'smoke_detector', label: "Détecteur de fumée" },
    { id: 'co_detector', label: "Détecteur de monoxyde de carbone" },
    { id: 'first_aid', label: "Trousse de premiers soins" },
    { id: 'fire_extinguisher', label: "Extincteur de feu" },
    { id: 'door_lock', label: "Serrure de porte de chambre" },
  ],
};

export const PERMISSIONS_DATA = [
  { id: 'children', label: "Convient aux enfants (2-14 ans)" },
  { id: 'infants', label: "Convient aux bébés (moins de 2 ans)" },
  { id: 'pets', label: "Animaux permis" },
  { id: 'smoking', label: "Il est permis de fumer à l'intérieur" },
  { id: 'parties', label: "Tenue d'une fête autorisée" },
  { id: 'events', label: "Événements autorisés" },
  { id: 'outdoor_fire', label: "Possible de faire un feu à l'extérieur" },
];

export const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const BIG_STEPS = [
  { number: 1, label: "Commencez par la base" },
  { number: 2, label: "Décrivez l'environnement" },
  { number: 3, label: "Préparez l'accueil des invités" },
];
