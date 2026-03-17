import {
  Wifi, Tv, Snowflake, Flame, Fan, Droplets, Zap, Plug,
  Monitor, Armchair, Shirt, WashingMachine, Wind,
  UtensilsCrossed, Refrigerator, Thermometer, Microwave, CookingPot,
  Coffee, Blend, Utensils, CircleDot, GlassWater,
  CupSoda, Scissors, SprayCan, Table, Box, ChefHat, Sandwich, Grid3x3,
} from 'lucide-react';
import type { Step } from './types';

export const SUMMARY_CHALET_IMG =
  "https://images.unsplash.com/photo-1685475512320-eede8aea2b95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBjaGFsZXQlMjBleHRlcmlvciUyMGdyZWVuJTIwbmF0dXJlfGVufDF8fHx8MTc3MDk5NTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export const STEPS_LIST: Step[] = [
  'acceptance-condition',
  'reservation-type',
  'address-location',
  'capacity-details',

  'amenities',
  'summary-review-1',
  'host-photo',
  'chalet-photos',
  'chalet-description',
  'summary-review-2',

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
  'Connectivité et multimédia': [
    { id: 'wifi', label: "Wifi", icon: Wifi },
    { id: 'television', label: "Télévision", icon: Tv },
  ],
  'Confort et climatisation': [
    { id: 'climatisation', label: "Climatisation", icon: Snowflake },
    { id: 'chauffage', label: "Chauffage", icon: Flame },
    { id: 'ventilateur', label: "Ventilateur", icon: Fan },
    { id: 'eau_chaude', label: "Eau chaude", icon: Droplets },
    { id: 'eau_potable', label: "Eau potable", icon: GlassWater },
    { id: 'electricite', label: "Électricité", icon: Zap },
    { id: 'prises_lit', label: "Prises électriques près du lit", icon: Plug },
  ],
  'Espace de travail': [
    { id: 'bureau', label: "Bureau / espace de travail dédié", icon: Monitor },
    { id: 'chaise_bureau', label: "Chaise de bureau", icon: Armchair },
  ],
  'Entretien du linge': [
    { id: 'fer_repasser', label: "Fer à repasser", icon: Shirt },
    { id: 'planche_repasser', label: "Planche à repasser", icon: Grid3x3 },
    { id: 'machine_laver', label: "Machine à laver", icon: WashingMachine },
    { id: 'seche_linge', label: "Sèche-linge", icon: Wind },
    { id: 'etendoir', label: "Étendoir à linge", icon: Shirt },
  ],
  'Cuisine et électroménager': [
    { id: 'cuisine_equipee', label: "Cuisine équipée", icon: UtensilsCrossed },
    { id: 'refrigerateur', label: "Réfrigérateur", icon: Refrigerator },
    { id: 'congelateur', label: "Congélateur", icon: Thermometer },
    { id: 'four', label: "Four", icon: Box },
    { id: 'micro_ondes', label: "Four à micro-ondes", icon: Microwave },
    { id: 'plaques_cuisson', label: "Plaques de cuisson", icon: Flame },
    { id: 'bouilloire', label: "Bouilloire électrique", icon: CookingPot },
    { id: 'machine_cafe', label: "Machine à café", icon: Coffee },
    { id: 'grille_pain', label: "Grille-pain", icon: Sandwich },
    { id: 'mixeur', label: "Mixeur / Blender", icon: Blend },
  ],
  'Ustensiles et vaisselle': [
    { id: 'batterie_cuisine', label: "Batterie de cuisine", icon: CookingPot },
    { id: 'vaisselle_couverts', label: "Vaisselle et couverts", icon: Utensils },
    { id: 'assiettes', label: "Assiettes", icon: CircleDot },
    { id: 'verres', label: "Verres", icon: GlassWater },
    { id: 'tasses', label: "Tasses", icon: CupSoda },
    { id: 'ustensiles_cuisine', label: "Ustensiles de cuisine", icon: ChefHat },
    { id: 'planche_decouper', label: "Planche à découper", icon: Scissors },
    { id: 'eponge_produit', label: "Éponge et produit vaisselle", icon: SprayCan },
    { id: 'table_manger', label: "Table à manger", icon: Table },
  ],
};



export const BED_TYPE_LABELS: Record<string, string> = {
  simple: 'Lit simple',
  double: 'Lit double',
  queen: 'Lit Queen',
  king: 'Lit King',
  simple_bunk: 'Lit simple superposé',
  double_bunk: 'Lit double superposé',
  queen_bunk: 'Lit queen superposé',
  king_bunk: 'Lit king superposé',
  sofa_bed: 'Canapé-lit',
  other: "Matériel d'appoint",
};

export const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const BIG_STEPS = [
  { number: 1, label: "Commencez par la base" },
  { number: 2, label: "Décrivez l'environnement" },
  { number: 3, label: "Préparez l'accueil des invités" },
];
