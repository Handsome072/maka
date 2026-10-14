import { useState, useEffect, useRef } from 'react';
import { Logo } from '@/app/components/Logo';
import {
  Check, ChevronDown, ChevronLeft, ChevronRight, Pencil, X, Trash2, Plus,
  Wifi, Tv, Snowflake, Flame, Fan, Droplets, Zap, Plug,
  Monitor, Armchair, Shirt, WashingMachine, Wind,
  UtensilsCrossed, Refrigerator, Thermometer, Microwave, CookingPot,
  Coffee, Blend, Utensils, CircleDot, GlassWater,
  CupSoda, Scissors, SprayCan, Table, Box, ChefHat, Sandwich, Grid3x3,
  House, BedDouble, UsersRound, Sofa, ShieldCheck, Camera, ImagePlus, User,
  KeyRound, Smartphone, HandHeart, Building2, Info, CalendarDays, CircleCheck, Loader2, AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { listingsApi } from '@/app/services/api';
import { useAuth } from '@/app/context/AuthContext';
import {
  CANCELLATION_POLICIES,
  CANCELLATION_POLICY_LABELS,
  CANCELLATION_POLICY_RULES,
  normalizeCancellationPolicy,
  type CancellationPolicy,
} from '@/shared/booking';
import {
  AmountInput, CheckboxRow, CheckTile, Field, ListingPreview, NextChapterCard, OptionCard,
  RecapList, RecapRow, SectionTitle, SelectInput, StepHeader, StepperRow, Switch, YesNo,
  inputClass, textareaClass,
} from '@/app/components/host-onboarding/ui';
import { ActionBar, MobileProgress, OnboardingRail, type RailChapter } from '@/app/components/host-onboarding/OnboardingNav';

interface HostOnboardingProps {
  onNavigate: (page: string, data?: any) => void;
  initialStep?: Step;
  onCompleteOnboarding?: () => void;
  listingId?: number;
  /** Chemin des étapes (ex. /host-onboarding) : l'adresse de la page suit alors l'étape affichée. */
  stepBasePath?: string;
}

type Step =
  | 'acceptance-condition'
  | 'reservation-type'
  | 'address-location'
  | 'capacity-details'
  | 'amenities'
  | 'summary-review-1'
  | 'host-photo'
  | 'chalet-photos'
  | 'chalet-description'
  | 'summary-review-2'
  | 'reservation-mode'
  | 'pricing'
  | 'fees'
  | 'calendar'
  | 'cancellation-policy'
  | 'summary-review-3'
  | 'laws-taxes'
  | 'local-laws'
  | 'guest-arrival'
  | 'phone-number'
  | 'verification';

interface Bedroom {
  id: string;
  name: string;
  beds: {
    simple: number;
    double: number;
    queen: number;
    king: number;
    simple_bunk: number;
    double_bunk: number;
    queen_bunk: number;
    king_bunk: number;
    sofa_bed: number;
    other: number;
  };
}

type BedType = keyof Bedroom['beds'];

// Amenities Data
const AMENITIES_DATA = {
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

const AMENITY_LABELS: Record<string, string> = Object.fromEntries(
  Object.values(AMENITIES_DATA).flat().map((a) => [a.id, a.label]),
);

const MIN_AMENITIES = 8;
const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const FR_MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const BED_TYPES: { key: BedType; label: string; one: string; many: string }[] = [
  { key: 'simple', label: 'Lit simple', one: 'lit simple', many: 'lits simples' },
  { key: 'double', label: 'Lit double', one: 'lit double', many: 'lits doubles' },
  { key: 'queen', label: 'Lit queen', one: 'lit queen', many: 'lits queen' },
  { key: 'king', label: 'Lit king', one: 'lit king', many: 'lits king' },
  { key: 'simple_bunk', label: 'Lit simple superposé', one: 'lit simple superposé', many: 'lits simples superposés' },
  { key: 'double_bunk', label: 'Lit double superposé', one: 'lit double superposé', many: 'lits doubles superposés' },
  { key: 'queen_bunk', label: 'Lit queen superposé', one: 'lit queen superposé', many: 'lits queen superposés' },
  { key: 'king_bunk', label: 'Lit king superposé', one: 'lit king superposé', many: 'lits king superposés' },
  { key: 'sofa_bed', label: 'Canapé-lit', one: 'canapé-lit', many: 'canapés-lits' },
  { key: 'other', label: "Matériel d'appoint", one: "couchage d'appoint", many: "couchages d'appoint" },
];

const EMPTY_BEDS: Bedroom['beds'] = {
  simple: 0, double: 0, queen: 0, king: 0, simple_bunk: 0, double_bunk: 0, queen_bunk: 0, king_bunk: 0, sofa_bed: 0, other: 0,
};

// Former imported listings store beds as [{ type, count }] with « single » instead of « simple »
const BED_ALIASES: Record<string, BedType> = { single: 'simple', sofa: 'sofa_bed' };

function normalizeRoom(raw: any, index: number, prefix: string, fallbackName: string): Bedroom {
  const beds = { ...EMPTY_BEDS };
  const add = (type: string, count: unknown) => {
    const key = (BED_ALIASES[type] ?? type) as BedType;
    beds[key in beds ? key : 'other'] += Math.max(0, Math.trunc(Number(count)) || 0);
  };
  if (Array.isArray(raw?.beds)) raw.beds.forEach((bed: any) => add(String(bed?.type), bed?.count));
  else if (raw?.beds && typeof raw.beds === 'object') Object.entries(raw.beds).forEach(([type, count]) => add(type, count));
  return { id: raw?.id ? String(raw.id) : `${prefix}-${index + 1}`, name: raw?.name || `${fallbackName} ${index + 1}`, beds };
}

const SPACE_TYPES = [
  { id: 'entire', label: 'Logement entier', desc: 'Les voyageurs disposent du logement dans son intégralité.', icon: House },
  { id: 'private', label: 'Chambre privée', desc: 'Les voyageurs ont leur propre chambre pour dormir.', icon: BedDouble },
  { id: 'shared', label: 'Chambre partagée', desc: 'Les voyageurs dorment dans une chambre partagée.', icon: UsersRound },
] as const;

const RENTAL_FREQUENCIES = [
  { id: 'occasional', label: 'De temps en temps', desc: "C'est mon logement privé, que je loue occasionnellement." },
  { id: 'dedicated', label: "Toute l'année", desc: 'Le logement est exclusivement dédié à la location.' },
] as const;

const CHECKIN_METHODS = [
  { id: 'keybox', label: 'Boîte à clé sécurisée', desc: 'Les voyageurs récupèrent la clé dans une boîte à code.', icon: KeyRound },
  { id: 'smartlock', label: 'Serrure intelligente', desc: 'La porte s’ouvre avec un code ou une application.', icon: Smartphone },
  { id: 'meet', label: "Accueil par l'hôte", desc: 'Vous ou un proche accueillez les voyageurs sur place.', icon: HandHeart },
  { id: 'staff', label: "Personnel de l'immeuble", desc: 'La réception ou le concierge remet les clés.', icon: Building2 },
];

const INTERNET_SPEEDS = [
  { value: '50', label: 'Moins de 50 Mbps' },
  { value: '100', label: '50 à 100 Mbps' },
  { value: '500', label: '100 à 500 Mbps' },
  { value: '1000', label: 'Plus de 500 Mbps' },
];

const PROVINCES: Record<string, string> = { QC: 'Québec', ON: 'Ontario', NB: 'Nouveau-Brunswick', Other: 'Autre' };
const COUNTRIES: Record<string, string> = { CA: 'Canada', US: 'États-Unis', FR: 'France', Other: 'Autre' };

// Parcours : 5 chapitres. L'étape de fin de chapitre (récapitulatif) n'est pas numérotée.
const CHAPTERS: { title: string; summary: string; steps: Step[]; end?: Step }[] = [
  { title: 'Votre logement', summary: 'Type de location, adresse, capacité et équipements', steps: ['reservation-type', 'address-location', 'capacity-details', 'amenities'], end: 'summary-review-1' },
  { title: 'Votre annonce', summary: 'Photo de profil, photos du logement, titre et description', steps: ['host-photo', 'chalet-photos', 'chalet-description'], end: 'summary-review-2' },
  { title: 'Tarifs et réservations', summary: 'Règles de séjour, prix, frais, calendrier et annulation', steps: ['reservation-mode', 'pricing', 'fees', 'calendar', 'cancellation-policy'], end: 'summary-review-3' },
  { title: 'Règles et arrivée', summary: 'Enregistrement, lois locales, arrivée des voyageurs et téléphone', steps: ['laws-taxes', 'local-laws', 'guest-arrival', 'phone-number'] },
  { title: 'Vérification et envoi', summary: "Relecture de l'annonce et signature", steps: ['verification'] },
];

const ALL_STEPS: Step[] = ['acceptance-condition', ...CHAPTERS.flatMap((c) => (c.end ? [...c.steps, c.end] : c.steps))];

const STEP_LABELS: Record<Step, string> = {
  'acceptance-condition': 'Bienvenue',
  'reservation-type': 'Type de location',
  'address-location': 'Adresse',
  'capacity-details': 'Capacité et couchages',
  'amenities': 'Équipements',
  'summary-review-1': 'Fin du chapitre 1',
  'host-photo': 'Photo de profil',
  'chalet-photos': 'Photos du logement',
  'chalet-description': 'Titre et description',
  'summary-review-2': 'Fin du chapitre 2',
  'reservation-mode': 'Règles de séjour',
  'pricing': 'Prix par nuit',
  'fees': 'Frais',
  'calendar': 'Calendrier',
  'cancellation-policy': 'Annulation',
  'summary-review-3': 'Fin du chapitre 3',
  'laws-taxes': 'Enregistrement et taxes',
  'local-laws': 'Lois locales',
  'guest-arrival': 'Arrivée des voyageurs',
  'phone-number': 'Téléphone',
  'verification': 'Relecture et signature',
};

const DRAFT_VERSION = 1;

// --- HELPERS ---

function buildMapEmbedUrl(city?: string, country?: string): string {
  const query = encodeURIComponent([city, country].filter(Boolean).join(', ') || 'Canada');
  return `https://maps.google.com/maps?q=${query}&z=12&output=embed&hl=fr`;
}

const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`;

function parseAmount(value: string | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const n = parseFloat(String(value).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function formatAmount(value: string | null | undefined): string | null {
  const n = parseAmount(value);
  if (n === null) return null;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function countBeds(rooms: Bedroom[]): number {
  return rooms.reduce((sum, room) => sum + Object.values(room.beds).reduce((a, b) => a + b, 0), 0);
}

function describeBeds(beds: Bedroom['beds']): string {
  const parts = BED_TYPES.filter((t) => beds[t.key] > 0).map((t) => plural(beds[t.key], t.one, t.many));
  return parts.length > 0 ? parts.join(', ') : 'Aucun lit indiqué';
}

type TaxDate = { d: string; m: string; y: string };

function taxDateToInput(date?: TaxDate | null): string {
  if (!date?.d || !date.m || !date.y) return '';
  const month = FR_MONTHS.indexOf(date.m);
  if (month < 0) return '';
  return `${date.y}-${String(month + 1).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
}

function inputToTaxDate(value: string): TaxDate {
  if (!value) return { d: '', m: '', y: '' };
  const [y, m, d] = value.split('-');
  return { d: String(parseInt(d, 10)), m: FR_MONTHS[parseInt(m, 10) - 1] ?? '', y };
}

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

// --- MAIN COMPONENT ---

export function HostOnboarding({ onNavigate, initialStep = 'acceptance-condition', onCompleteOnboarding, listingId, stepBasePath }: HostOnboardingProps) {
  const isEditMode = !!listingId;
  const { user } = useAuth();
  const hasProfilePhoto = !!user?.profile_photo_url;

  // Skip host-photo if the user already has a profile photo, and the welcome screen when editing
  const stepsList = ALL_STEPS.filter(
    (s) => !(hasProfilePhoto && s === 'host-photo') && !(isEditMode && s === 'acceptance-condition'),
  );

  const [currentStep, setCurrentStep] = useState<Step>(() =>
    isEditMode && initialStep === 'acceptance-condition' ? 'reservation-type' : initialStep,
  );
  const [isLoadingListing, setIsLoadingListing] = useState(isEditMode);
  const [furthestIndex, setFurthestIndex] = useState(0);

  // -- STATE --

  // 1. Acceptance
  const [acceptedConditions, setAcceptedConditions] = useState(false);

  // 2. Reservation
  const [rentalFrequency, setRentalFrequency] = useState<'occasional' | 'dedicated' | null>(null);
  const [spaceType, setSpaceType] = useState<'entire' | 'private' | 'shared' | null>(null);

  // 3. Address
  const [addressData, setAddressData] = useState({
    fullAddress: '',
    city: '',
    address: '',
    postalCode: '',
    mrc: '',
    county: '',
    province: 'QC',
    country: 'CA'
  });

  // 4. Capacity
  const [capacityData, setCapacityData] = useState({
    capacity: 4,
    adults: 4,
    bathrooms: 1,
  });

  const [bedrooms, setBedrooms] = useState<Bedroom[]>([
    { id: '1', name: 'Chambre 1', beds: { ...EMPTY_BEDS, simple: 1 } }
  ]);

  const [openAreas, setOpenAreas] = useState<Bedroom[]>([]);

  // 5. Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // 7. Photos
  const [hostPhoto, setHostPhoto] = useState<string | null>(null);
  const [chaletPhotos, setChaletPhotos] = useState<string[]>([]);

  // 7.5. Description
  const [descriptionData, setDescriptionData] = useState({
    title: '',
    subtitle: '',
    description: '',
    aboutChalet: '',
    hostAvailability: '',
    neighborhood: '',
    transport: '',
    otherInfo: ''
  });
  const [titleExists, setTitleExists] = useState(false);
  const [checkingTitle, setCheckingTitle] = useState(false);
  const titleCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Check title uniqueness with debounce
  useEffect(() => {
    const title = descriptionData.title?.trim();
    if (!title) {
      setTitleExists(false);
      return;
    }

    if (titleCheckRef.current) clearTimeout(titleCheckRef.current);

    titleCheckRef.current = setTimeout(async () => {
      setCheckingTitle(true);
      try {
        const res = await listingsApi.checkTitle(title, listingId);
        setTitleExists(res.exists);
      } catch {
        setTitleExists(false);
      } finally {
        setCheckingTitle(false);
      }
    }, 500);

    return () => {
      if (titleCheckRef.current) clearTimeout(titleCheckRef.current);
    };
  }, [descriptionData.title, listingId]);

  // 8. Stay rules
  const [arrivalTime, setArrivalTime] = useState('17:00');
  const [departureTime, setDepartureTime] = useState('11:00');
  const [minAge, setMinAge] = useState("18");
  const [minStay, setMinStay] = useState("1");
  const [maxStay, setMaxStay] = useState("Aucun maximum");
  const [advancedStaySettingsOpen, setAdvancedStaySettingsOpen] = useState(false);
  const [departureDays, setDepartureDays] = useState<Record<string, boolean>>({
    'Lun': true, 'Mar': true, 'Mer': true, 'Jeu': true, 'Ven': true, 'Sam': false, 'Dim': true
  });
  const [arrivalDays, setArrivalDays] = useState<Record<string, boolean>>({
    'Lun': true, 'Mar': true, 'Mer': true, 'Jeu': true, 'Ven': true, 'Sam': false, 'Dim': true
  });

  // 10. Pricing
  const [currency, setCurrency] = useState('EUR');
  const [pricing, setPricing] = useState({
    base: '120',
    weekend: '',
    weekly: '',
    monthly: ''
  });

  // 11. Fees
  const [fees, setFees] = useState({
    cleaning: '50',
    security: '40',
  });
  const [extraGuestFeeOpen, setExtraGuestFeeOpen] = useState(false);
  const [petFeeOpen, setPetFeeOpen] = useState(false);
  const [extraGuestFee, setExtraGuestFee] = useState('');
  const [petFee, setPetFee] = useState('');

  // 12. Calendar preview (first day of the displayed month)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // 13. Cancellation Policy
  const [cancellationPolicy, setCancellationPolicy] = useState<CancellationPolicy>('flexible');

  // 14. Taxes & Laws
  const [taxRegistration, setTaxRegistration] = useState({
    type: 'CITQ',
    number: '',
    issueDate: { d: '', m: '', y: '' } as TaxDate,
    expDate: { d: '', m: '', y: '' } as TaxDate,
    taxesIncluded: null as boolean | null
  });

  // 15. Local Laws
  const [acceptedLocalLaws, setAcceptedLocalLaws] = useState(false);

  // 16. Guest Arrival
  const [guestArrival, setGuestArrival] = useState({
    internetSpeed: '',
    hasWifi: null as boolean | null,
    instructions: '',
    checkinMethod: ''
  });

  // 17. Phone Number
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [smsCode, setSmsCode] = useState('');

  // 18. Signature
  const [signatureName, setSignatureName] = useState('');
  const [isSigned, setIsSigned] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // -- MODAL STATE --
  const [editingItem, setEditingItem] = useState<{ item: Bedroom, type: 'bedroom' | 'openArea' } | null>(null);

  // -- FETCH EXISTING LISTING FOR EDIT MODE --
  useEffect(() => {
    if (!listingId) return;
    setIsLoadingListing(true);
    listingsApi.getListing(listingId)
      .then(({ listing }) => {
        // Map API response to form state
        if (listing.rental_frequency) setRentalFrequency(listing.rental_frequency as 'occasional' | 'dedicated');
        if (listing.space_type) setSpaceType(listing.space_type as 'entire' | 'private' | 'shared');

        setAddressData({
          fullAddress: listing.full_address || '',
          city: listing.city || '',
          address: listing.street || '',
          postalCode: listing.postal_code || '',
          mrc: listing.mrc || '',
          county: listing.county || '',
          province: listing.province || 'QC',
          country: listing.country || 'CA',
        });

        setCapacityData({
          capacity: listing.capacity ?? 4,
          adults: listing.adults ?? listing.capacity ?? 4,
          bathrooms: listing.bathrooms ?? 1,
        });

        if (Array.isArray(listing.bedrooms_data) && listing.bedrooms_data.length > 0) {
          setBedrooms(listing.bedrooms_data.map((room: any, i: number) => normalizeRoom(room, i, 'b', 'Chambre')));
        }
        if (Array.isArray(listing.open_areas_data) && listing.open_areas_data.length > 0) {
          setOpenAreas(listing.open_areas_data.map((room: any, i: number) => normalizeRoom(room, i, 'oa', 'Espace ouvert')));
        }

        if (listing.amenities) setSelectedAmenities(listing.amenities);

        if (listing.host_photo_url) setHostPhoto(listing.host_photo_url);
        if (listing.photos && listing.photos.length > 0) {
          setChaletPhotos(listing.photos.map(p => p.url));
        }

        setDescriptionData({
          title: listing.title || '',
          subtitle: listing.subtitle || '',
          description: listing.description || '',
          aboutChalet: listing.about_chalet || '',
          hostAvailability: listing.host_availability || '',
          neighborhood: listing.neighborhood || '',
          transport: listing.transport || '',
          otherInfo: listing.other_info || '',
        });

        if (listing.arrival_time) setArrivalTime(listing.arrival_time);
        if (listing.departure_time) setDepartureTime(listing.departure_time);
        if (listing.min_age) setMinAge(String(listing.min_age));
        if (listing.min_stay) setMinStay(listing.min_stay);
        if (listing.max_stay) setMaxStay(listing.max_stay);
        else setMaxStay('Aucun maximum');
        if (listing.arrival_days) setArrivalDays(listing.arrival_days);
        if (listing.departure_days) setDepartureDays(listing.departure_days);

        if (listing.currency) setCurrency(listing.currency);
        setPricing({
          base: listing.base_price || '120',
          weekend: listing.weekend_price || '',
          weekly: listing.weekly_price || '',
          monthly: listing.monthly_price || '',
        });

        setFees({
          cleaning: listing.cleaning_fee || '50',
          security: listing.security_deposit || '40',
        });
        if (listing.extra_guest_fee) { setExtraGuestFee(listing.extra_guest_fee); setExtraGuestFeeOpen(true); }
        if (listing.pet_fee) { setPetFee(listing.pet_fee); setPetFeeOpen(true); }

        if (listing.cancellation_policy) setCancellationPolicy(normalizeCancellationPolicy(listing.cancellation_policy) ?? 'flexible');
        if (listing.tax_registration) setTaxRegistration((prev) => ({ ...prev, ...listing.tax_registration }));
        if (listing.accepted_local_laws) setAcceptedLocalLaws(listing.accepted_local_laws);

        setGuestArrival({
          internetSpeed: listing.wifi_speed || '',
          hasWifi: listing.has_wifi ?? null,
          instructions: listing.checkin_instructions || '',
          checkinMethod: listing.checkin_method || '',
        });

        if (listing.phone_number) setPhoneNumber(listing.phone_number);
        if (listing.country_code) setCountryCode(listing.country_code);

        setAcceptedConditions(true);
      })
      .catch((err) => {
        toast.error(err.message || 'Impossible de charger les données de l\'annonce.');
      })
      .finally(() => setIsLoadingListing(false));
  }, [listingId]);

  // -- NAVIGATION --
  const currentStepIndex = stepsList.indexOf(currentStep);

  const goToStep = (step: Step) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
    if (stepBasePath) {
      const url = `${stepBasePath}/${step}/`;
      if (window.location.pathname !== url) window.history.pushState(null, '', url);
    }
  };

  // A step that is not part of this flow (e.g. host-photo when the account already has a photo)
  useEffect(() => {
    if (currentStepIndex !== -1) return;
    const fallback = currentStep === 'host-photo' ? 'chalet-photos' : stepsList[0];
    setCurrentStep(fallback);
    if (stepBasePath) window.history.replaceState(null, '', `${stepBasePath}/${fallback}/`);
  }, [currentStepIndex, currentStep, stepsList, stepBasePath]);

  // Canonical address on arrival (e.g. the former /signature/ step)
  useEffect(() => {
    if (!stepBasePath) return;
    const url = `${stepBasePath}/${currentStep}/`;
    if (window.location.pathname !== url) window.history.replaceState(null, '', url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Browser back/forward between steps
  useEffect(() => {
    if (!stepBasePath) return;
    const onPopState = () => {
      const segment = window.location.pathname.replace(/\/$/, '').split('/').pop() as Step;
      if (ALL_STEPS.includes(segment)) setCurrentStep(segment);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [stepBasePath]);

  useEffect(() => {
    if (isEditMode) setFurthestIndex(stepsList.length - 1);
    else if (currentStepIndex > 0) setFurthestIndex((prev) => Math.max(prev, currentStepIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, isEditMode]);

  // -- DRAFT (saved in this browser, new listings only) --
  const draftKey = !isEditMode && user?.id ? `homiqio_host_draft_${user.id}` : null;
  const draftLoadedRef = useRef(false);
  const [draftInfo, setDraftInfo] = useState<{ step: Step; savedAt: number } | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const buildDraft = (withPhotos: boolean) => ({
    v: DRAFT_VERSION,
    savedAt: Date.now(),
    step: currentStep,
    furthest: furthestIndex,
    acceptedConditions, rentalFrequency, spaceType, addressData, capacityData, bedrooms, openAreas,
    selectedAmenities, descriptionData, arrivalTime, departureTime, minStay, maxStay, departureDays, arrivalDays,
    currency, pricing, fees, extraGuestFee, petFee, cancellationPolicy, taxRegistration, acceptedLocalLaws,
    guestArrival, phoneNumber, countryCode,
    hostPhoto: withPhotos ? hostPhoto : null,
    chaletPhotos: withPhotos ? chaletPhotos : [],
  });

  const saveDraft = () => {
    if (!draftKey) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify(buildDraft(true)));
    } catch {
      // Photos can exceed the browser quota: keep the rest of the draft
      try { localStorage.setItem(draftKey, JSON.stringify(buildDraft(false))); } catch { return; }
    }
    setLastSavedAt(Date.now());
  };

  const clearDraft = () => {
    if (!draftKey) return;
    try { localStorage.removeItem(draftKey); } catch { /* storage unavailable */ }
  };

  useEffect(() => {
    if (!draftKey || draftLoadedRef.current) return;
    draftLoadedRef.current = true;
    let draft: any = null;
    try {
      const raw = localStorage.getItem(draftKey);
      draft = raw ? JSON.parse(raw) : null;
    } catch {
      draft = null;
    }
    if (!draft || draft.v !== DRAFT_VERSION) return;

    setAcceptedConditions(!!draft.acceptedConditions);
    if (draft.rentalFrequency) setRentalFrequency(draft.rentalFrequency);
    if (draft.spaceType) setSpaceType(draft.spaceType);
    if (draft.addressData) setAddressData(draft.addressData);
    if (draft.capacityData) setCapacityData(draft.capacityData);
    if (Array.isArray(draft.bedrooms)) setBedrooms(draft.bedrooms.map((room: any, i: number) => normalizeRoom(room, i, 'b', 'Chambre')));
    if (Array.isArray(draft.openAreas)) setOpenAreas(draft.openAreas.map((room: any, i: number) => normalizeRoom(room, i, 'oa', 'Espace ouvert')));
    if (Array.isArray(draft.selectedAmenities)) setSelectedAmenities(draft.selectedAmenities);
    if (draft.hostPhoto) setHostPhoto(draft.hostPhoto);
    if (Array.isArray(draft.chaletPhotos)) setChaletPhotos(draft.chaletPhotos);
    if (draft.descriptionData) setDescriptionData(draft.descriptionData);
    if (draft.arrivalTime) setArrivalTime(draft.arrivalTime);
    if (draft.departureTime) setDepartureTime(draft.departureTime);
    if (draft.minStay) setMinStay(draft.minStay);
    if (draft.maxStay) setMaxStay(draft.maxStay);
    if (draft.departureDays) setDepartureDays(draft.departureDays);
    if (draft.arrivalDays) setArrivalDays(draft.arrivalDays);
    if (draft.currency) setCurrency(draft.currency);
    if (draft.pricing) setPricing(draft.pricing);
    if (draft.fees) setFees(draft.fees);
    if (draft.extraGuestFee) { setExtraGuestFee(draft.extraGuestFee); setExtraGuestFeeOpen(true); }
    if (draft.petFee) { setPetFee(draft.petFee); setPetFeeOpen(true); }
    if (draft.cancellationPolicy) setCancellationPolicy(draft.cancellationPolicy);
    if (draft.taxRegistration) setTaxRegistration(draft.taxRegistration);
    setAcceptedLocalLaws(!!draft.acceptedLocalLaws);
    if (draft.guestArrival) setGuestArrival(draft.guestArrival);
    if (draft.phoneNumber) setPhoneNumber(draft.phoneNumber);
    if (draft.countryCode) setCountryCode(draft.countryCode);
    if (typeof draft.furthest === 'number') setFurthestIndex((prev) => Math.max(prev, draft.furthest));
    if (ALL_STEPS.includes(draft.step)) setDraftInfo({ step: draft.step, savedAt: draft.savedAt });
    setLastSavedAt(draft.savedAt ?? null);
  }, [draftKey]);

  // Autosave once the host has gone past the welcome screen
  useEffect(() => {
    if (!draftKey || furthestIndex === 0 || currentStep === 'acceptance-condition') return;
    const timer = setTimeout(saveDraft, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    draftKey, furthestIndex, currentStep, acceptedConditions, rentalFrequency, spaceType, addressData, capacityData,
    bedrooms, openAreas, selectedAmenities, hostPhoto, chaletPhotos, descriptionData, arrivalTime, departureTime,
    minStay, maxStay, departureDays, arrivalDays, currency, pricing, fees, extraGuestFee, petFee, cancellationPolicy,
    taxRegistration, acceptedLocalLaws, guestArrival, phoneNumber, countryCode,
  ]);

  // Also save when the tab is closed or reloaded before the autosave delay
  const saveDraftRef = useRef(saveDraft);
  saveDraftRef.current = () => {
    if (furthestIndex > 0 && currentStep !== 'acceptance-condition') saveDraft();
  };
  useEffect(() => {
    if (!draftKey) return;
    const onPageHide = () => saveDraftRef.current();
    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, [draftKey]);

  const handleSaveAndExit = () => {
    if (!isEditMode && furthestIndex > 0) {
      saveDraft();
      toast.success('Brouillon enregistré sur cet appareil');
    }
    onNavigate('annonces');
  };

  const restartFromScratch = () => {
    if (!window.confirm('Effacer le brouillon et recommencer une nouvelle annonce ?')) return;
    clearDraft();
    window.location.assign(`${stepBasePath ?? '/host-onboarding'}/acceptance-condition/`);
  };

  // -- PAYLOAD & SUBMIT --
  const buildListingPayload = () => ({
    rental_frequency: rentalFrequency,
    space_type:       spaceType,
    full_address:     addressData.fullAddress,
    street:           addressData.address,
    city:             addressData.city,
    postal_code:      addressData.postalCode,
    mrc:              addressData.mrc,
    county:           addressData.county,
    province:         addressData.province,
    country:          addressData.country,
    capacity:         capacityData.capacity,
    adults:           capacityData.adults,
    bathrooms:        capacityData.bathrooms,
    bedrooms_data:    bedrooms,
    open_areas_data:  openAreas,
    amenities:        selectedAmenities,
    host_photo:       hostPhoto,
    chalet_photos:    chaletPhotos,
    title:            descriptionData.title,
    subtitle:         descriptionData.subtitle,
    description:      descriptionData.description,
    about_chalet:     descriptionData.aboutChalet,
    host_availability: descriptionData.hostAvailability,
    neighborhood:     descriptionData.neighborhood,
    transport:        descriptionData.transport,
    other_info:       descriptionData.otherInfo,
    // Réservation toujours instantanée : plus de validation des demandes par l'hôte
    reservation_mode: 'instant',
    arrival_time:     arrivalTime,
    departure_time:   departureTime,
    min_age:          parseInt(minAge) || 18,
    min_stay:         minStay,
    max_stay:         maxStay === 'Aucun maximum' ? null : maxStay,
    arrival_days:     arrivalDays,
    departure_days:   departureDays,
    currency:         currency,
    base_price:       parseAmount(pricing.base) ?? 0,
    weekend_price:    parseAmount(pricing.weekend),
    weekly_price:     parseAmount(pricing.weekly),
    monthly_price:    parseAmount(pricing.monthly),
    cleaning_fee:     parseAmount(fees.cleaning) ?? 0,
    security_deposit: parseAmount(fees.security) ?? 0,
    extra_guest_fee:  parseAmount(extraGuestFee),
    pet_fee:          parseAmount(petFee),
    cancellation_policy: cancellationPolicy,
    tax_registration: taxRegistration,
    accepted_local_laws: acceptedLocalLaws,
    wifi_speed:       guestArrival.internetSpeed,
    has_wifi:         guestArrival.hasWifi,
    checkin_method:   guestArrival.checkinMethod,
    checkin_instructions: guestArrival.instructions,
    phone_number:     phoneNumber,
    country_code:     countryCode,
    signature_name:   signatureName,
    signed:           true,
  });

  const submitListing = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = buildListingPayload();
      if (isEditMode && listingId) {
        await listingsApi.updateListing(listingId, payload as Record<string, unknown>);
        toast.success("Annonce mise à jour avec succès !");
      } else {
        await listingsApi.createListing(payload as Record<string, unknown>);
        clearDraft();
        toast.success("Annonce soumise avec succès ! Elle sera examinée par notre équipe.");
      }
      if (onCompleteOnboarding) onCompleteOnboarding();
    } catch (error: any) {
      const message = error?.message || 'Une erreur est survenue. Veuillez réessayer.';
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // What still blocks the current step (shown next to the disabled button)
  const getBlockingReason = (): string | null => {
    switch (currentStep) {
      case 'reservation-type':
        if (!spaceType) return 'Choisissez ce que vous offrez aux voyageurs';
        if (!rentalFrequency) return 'Choisissez une fréquence de location';
        return null;
      case 'address-location':
        if (!addressData.address.trim()) return "Indiquez l'adresse du logement";
        if (!addressData.city.trim()) return 'Indiquez la ville';
        return null;
      case 'amenities': {
        const missing = MIN_AMENITIES - selectedAmenities.length;
        return missing > 0 ? `Encore ${plural(missing, 'équipement', 'équipements')} à sélectionner` : null;
      }
      case 'chalet-description':
        if (!descriptionData.title.trim()) return 'Donnez un titre à votre annonce';
        if (titleExists) return 'Ce titre est déjà utilisé';
        if (!descriptionData.description.trim()) return 'Ajoutez une description';
        return null;
      case 'pricing':
        return (parseAmount(pricing.base) ?? 0) > 0 ? null : 'Indiquez un prix par nuit';
      case 'local-laws':
        return acceptedLocalLaws ? null : 'Acceptez les conditions pour continuer';
      case 'guest-arrival':
        if (!guestArrival.checkinMethod) return 'Choisissez comment les voyageurs entrent';
        if (guestArrival.hasWifi === null) return 'Indiquez si le logement a le wifi';
        if (guestArrival.hasWifi && !guestArrival.internetSpeed) return 'Indiquez la vitesse de connexion';
        return null;
      case 'phone-number':
        return phoneNumber.trim() ? null : 'Indiquez votre numéro de téléphone';
      case 'verification':
        if (!isSigned) return 'Cochez la certification';
        if (!signatureName.trim()) return 'Signez avec votre nom complet';
        return null;
      default:
        return null;
    }
  };
  const blockingReason = getBlockingReason();

  const handleNext = () => {
    if (blockingReason) return;

    // Handle Phone Step Modal Trigger
    if (currentStep === 'phone-number') {
      setIsSmsModalOpen(true);
      return;
    }

    const next = stepsList[currentStepIndex + 1];
    if (next) goToStep(next);
    else submitListing();
  };

  const handleBack = () => {
    const prev = stepsList[currentStepIndex - 1];
    if (prev) goToStep(prev);
    else onNavigate('annonces');
  };

  // --- SUB-LOGIC ---
  const addBedroom = () => {
    setBedrooms([...bedrooms, { id: newId('b'), name: `Chambre ${bedrooms.length + 1}`, beds: { ...EMPTY_BEDS } }]);
  };

  const addOpenArea = () => {
    setOpenAreas([...openAreas, { id: newId('oa'), name: `Espace ouvert ${openAreas.length + 1}`, beds: { ...EMPTY_BEDS } }]);
  };

  const removeRoom = (id: string, type: 'bedroom' | 'openArea') => {
    if (type === 'bedroom') setBedrooms(bedrooms.filter(b => b.id !== id));
    else setOpenAreas(openAreas.filter(a => a.id !== id));
  };

  const updateItem = (updatedItem: Bedroom, type: 'bedroom' | 'openArea') => {
    if (type === 'bedroom') {
      setBedrooms(bedrooms.map(b => b.id === updatedItem.id ? updatedItem : b));
    } else {
      setOpenAreas(openAreas.map(b => b.id === updatedItem.id ? updatedItem : b));
    }
  };

  const setBedCount = (bedType: BedType, count: number) => {
    if (!editingItem) return;
    setEditingItem({
      ...editingItem,
      item: { ...editingItem.item, beds: { ...editingItem.item.beds, [bedType]: Math.max(0, count) } }
    });
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleHostPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHostPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChaletPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;
    const newPhotos: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push(reader.result as string);
        if (newPhotos.length === files.length) {
          setChaletPhotos(prev => [...prev, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => setChaletPhotos(chaletPhotos.filter((_, i) => i !== index));

  const makeCover = (index: number) => {
    const photo = chaletPhotos[index];
    setChaletPhotos([photo, ...chaletPhotos.filter((_, i) => i !== index)]);
  };

  // --- DERIVED DISPLAY VALUES ---
  const spaceLabel = SPACE_TYPES.find(s => s.id === spaceType)?.label;
  const frequencyLabel = RENTAL_FREQUENCIES.find(f => f.id === rentalFrequency)?.label;
  const allRooms = [...bedrooms, ...openAreas];
  const bedCount = countBeds(allRooms);
  const capacityLine = [
    plural(capacityData.capacity, 'voyageur', 'voyageurs'),
    plural(bedrooms.length, 'chambre', 'chambres'),
    plural(bedCount, 'lit', 'lits'),
    plural(capacityData.bathrooms, 'salle de bain', 'salles de bain'),
  ].join(' · ');
  const capacitySummary = [spaceLabel, capacityLine].filter(Boolean).join(' · ');
  const regionLabel = addressData.country === 'CA'
    ? (addressData.province !== 'Other' ? PROVINCES[addressData.province] : '')
    : (addressData.country !== 'Other' ? COUNTRIES[addressData.country] : '');
  const locationLabel = [addressData.city.trim(), regionLabel].filter(Boolean).join(', ') || undefined;
  const coverPhoto = chaletPhotos[0] ?? null;
  const basePriceLabel = formatAmount(pricing.base);
  const checkinLabel = CHECKIN_METHODS.find(m => m.id === guestArrival.checkinMethod)?.label;
  const amenityNames = selectedAmenities.map(id => AMENITY_LABELS[id]).filter(Boolean);

  // Chapters, numbering and progress
  const chapters = CHAPTERS.map(c => ({ ...c, steps: c.steps.filter(s => stepsList.includes(s)) }));
  const numberedSteps = chapters.flatMap(c => c.steps);
  const totalSteps = numberedSteps.length;
  const chapterIndex = chapters.findIndex(c => c.steps.includes(currentStep) || c.end === currentStep);
  const chapter = chapters[chapterIndex];
  const stepInChapter = chapter ? chapter.steps.indexOf(currentStep) + 1 : 0;
  const completedSteps = numberedSteps.filter(s => stepsList.indexOf(s) < currentStepIndex).length;
  const stepNumber = numberedSteps.indexOf(currentStep) + 1;
  const isChapterEnd = !!chapter && chapter.end === currentStep;
  const eyebrow = chapter ? `Chapitre ${chapterIndex + 1} · ${chapter.title}` : undefined;

  const railChapters: RailChapter[] = chapters.map((c, i) => {
    const doneCount = c.steps.filter(s => stepsList.indexOf(s) < currentStepIndex).length;
    const allDone = doneCount === c.steps.length;
    const expanded = i === chapterIndex;
    const status = allDone ? 'done' : expanded ? 'current' : 'todo';
    const firstIndex = stepsList.indexOf(c.steps[0]);
    return {
      number: i + 1,
      title: c.title,
      status,
      expanded,
      statusLabel: allDone
        ? 'Terminé'
        : expanded
          ? `Étape ${stepInChapter} sur ${c.steps.length}`
          : plural(c.steps.length, 'étape', 'étapes'),
      target: firstIndex <= furthestIndex ? c.steps[0] : undefined,
      steps: c.steps.map(s => {
        const index = stepsList.indexOf(s);
        return {
          id: s,
          label: STEP_LABELS[s],
          state: s === currentStep ? 'current' : index < currentStepIndex ? 'done' : 'todo',
          clickable: index <= furthestIndex,
        };
      }),
    };
  });

  const mobileSegments = chapters.map((c, i) => {
    const done = c.steps.filter(s => stepsList.indexOf(s) < currentStepIndex).length;
    const inProgress = i === chapterIndex && !isChapterEnd ? 0.5 : 0;
    return Math.min(1, (done + inProgress) / c.steps.length);
  });

  const nextLabel = isChapterEnd
    ? `Continuer vers le chapitre ${chapterIndex + 2}`
    : currentStep === 'verification'
      ? (isSubmitting ? 'Envoi en cours…' : isEditMode ? 'Enregistrer les modifications' : 'Envoyer pour vérification')
      : 'Continuer';

  const savedTime = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    : null;

  // Calendar preview: Monday-first grid of the displayed month
  const calendarCells = (() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (calendarMonth.getDay() + 6) % 7;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(year, month, i + 1);
        return { day: i + 1, past: date < today };
      }),
    ];
  })();
  const calendarTitle = calendarMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const isCurrentMonth = (() => {
    const now = new Date();
    return calendarMonth.getFullYear() === now.getFullYear() && calendarMonth.getMonth() === now.getMonth();
  })();

  // Layout widths: every step starts on the same left edge, inside a 1000px frame
  const NARROW = 'w-full max-w-[640px]';
  const WIDE = 'w-full max-w-[880px]';
  const WITH_ASIDE = 'w-full grid gap-10 lg:gap-14 lg:grid-cols-[minmax(0,1fr)_320px] items-start';
  const ASIDE = 'lg:sticky lg:top-6';

  const renderChapterEnd = (title: string, description: string, rows: React.ReactNode) => {
    const next = chapters[chapterIndex + 1];
    return (
      <div className="w-full max-w-[680px]">
        <StepHeader icon={Check} eyebrowOnMobile eyebrow={`Chapitre ${chapterIndex + 1} terminé`} title={title} description={description} />
        <RecapList>{rows}</RecapList>
        {next && <NextChapterCard number={chapterIndex + 2} title={next.title} summary={next.summary} count={next.steps.length} />}
      </div>
    );
  };

  if (isLoadingListing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="text-sm text-gray-500">Chargement de l'annonce...</p>
        </div>
      </div>
    );
  }

  // --- WELCOME SCREEN ---
  if (currentStep === 'acceptance-condition') {
    return (
      <div className="min-h-screen bg-white flex font-sans text-[#222222]">
        <div className="flex-1 min-w-0 flex flex-col px-5 sm:px-10 lg:px-16 pt-6 pb-14">
          <header className="flex items-center justify-between gap-4">
            <Logo className="h-[30px] w-auto" />
            <button
              type="button"
              onClick={() => onNavigate('annonces')}
              className="min-h-[44px] text-sm font-semibold underline underline-offset-[3px] hover:text-black"
            >
              Quitter
            </button>
          </header>

          <main className="w-full max-w-[600px] mx-auto mt-10 lg:mt-14 space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#0A6E85]">Devenir hôte</p>
              <h1 className="text-[32px] md:text-[40px] leading-[1.15] font-bold tracking-[-0.02em]">Proposez votre logement sur Séjoura</h1>
              <p className="text-[17px] leading-relaxed text-[#555555]">
                Cinq chapitres pour présenter votre logement. Notre équipe relit ensuite chaque annonce avant sa mise en ligne.
              </p>
            </div>

            {draftInfo && (
              <div className="rounded-2xl border border-[#E4E4E4] p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">Vous avez une annonce en cours</p>
                  <p className="text-sm text-[#6A6A6A]">
                    Enregistrée le {new Date(draftInfo.savedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} · {STEP_LABELS[draftInfo.step]}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={restartFromScratch}
                    className="min-h-[44px] px-4 rounded-xl border border-[#CFCFCF] text-sm font-semibold hover:border-[#222222]"
                  >
                    Recommencer
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStep(stepsList.includes(draftInfo.step) && draftInfo.step !== 'acceptance-condition' ? draftInfo.step : stepsList[1])}
                    className="min-h-[44px] px-5 rounded-xl bg-[#222222] text-white text-sm font-semibold hover:bg-black"
                  >
                    Reprendre
                  </button>
                </div>
              </div>
            )}

            <ol className="border-t border-[#EBEBEB]">
              {CHAPTERS.map((c, i) => (
                <li key={c.title} className="flex items-start gap-4 py-3.5 border-b border-[#EBEBEB]">
                  <span className="w-[30px] h-[30px] flex-shrink-0 rounded-full border-[1.5px] border-[#222222] flex items-center justify-center text-sm font-semibold">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-base font-semibold">{c.title}</span>
                    <span className="block text-sm text-[#6A6A6A]">{c.summary}</span>
                  </span>
                </li>
              ))}
            </ol>

            <section aria-labelledby="criteria-title" className="rounded-2xl bg-[#F7F7F7] p-6 space-y-4">
              <div className="space-y-1">
                <h2 id="criteria-title" className="text-[17px] font-semibold">Une sélection exigeante</h2>
                <p className="text-[15px] leading-relaxed text-[#555555]">
                  <strong className="text-[#222222]">82 % des demandes d'inscription sont refusées.</strong> Avant de commencer, vérifiez que votre logement répond à nos critères :
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: ShieldCheck, text: 'Des hôtes sérieux, engagés à offrir un service de qualité' },
                  { icon: House, text: 'Un logement unique et soigné' },
                  { icon: Camera, text: 'Des photos de qualité professionnelle' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-[15px]">
                    <span className="w-9 h-9 flex-shrink-0 rounded-[10px] bg-white text-[#0A6E85] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </section>

            <CheckboxRow id="accept-conditions" checked={acceptedConditions} onChange={setAcceptedConditions}>
              Je comprends que mon logement peut être refusé s'il ne répond pas à ces critères.
            </CheckboxRow>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-[#6A6A6A]">
                Une question ? <a href="mailto:contact@sejoura.com" className="font-medium text-[#0A6E85] hover:underline">contact@sejoura.com</a>
              </p>
              <button
                type="button"
                onClick={() => goToStep(stepsList[currentStepIndex + 1])}
                disabled={!acceptedConditions}
                className="min-h-[52px] px-8 rounded-xl text-base font-semibold bg-[#222222] text-white hover:bg-black transition-colors disabled:bg-[#E4E4E4] disabled:text-[#767676] disabled:cursor-not-allowed"
              >
                Commencer
              </button>
            </div>
          </main>
        </div>

        <div className="hidden lg:block w-[44%] max-w-[720px] flex-shrink-0">
          <div className="sticky top-0 h-screen">
            <img src="/assets/search-background.png" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#222222]">
      <OnboardingRail
        heading={isEditMode ? "Modifier l'annonce" : 'Nouvelle annonce'}
        chapters={railChapters}
        progress={Math.round((completedSteps / totalSteps) * 100)}
        progressLabel={stepNumber ? `Étape ${stepNumber} sur ${totalSteps}` : `${completedSteps} étapes sur ${totalSteps}`}
        onStepClick={(id) => goToStep(id as Step)}
        footer={
          <>
            {isEditMode ? (
              <p>Vos modifications sont enregistrées à la dernière étape.</p>
            ) : (
              <p className="flex items-start gap-2">
                <CircleCheck className="w-4 h-4 mt-px flex-shrink-0 text-[#0A6E85]" />
                {savedTime ? `Brouillon enregistré sur cet appareil à ${savedTime}` : 'Votre brouillon est enregistré sur cet appareil à chaque étape'}
              </p>
            )}
            <p>
              Une question ? <a href="mailto:contact@sejoura.com" className="font-medium text-[#0A6E85] hover:underline">contact@sejoura.com</a>
            </p>
          </>
        }
      />

      <div className="lg:pl-[300px]">
        <header className="flex items-center justify-between lg:justify-end gap-4 h-[72px] px-5 md:px-10">
          <div className="lg:hidden">
            <Logo className="h-7 w-auto" />
          </div>
          <button
            type="button"
            onClick={handleSaveAndExit}
            className="min-h-[44px] px-4 rounded-full border border-[#DDDDDD] text-sm font-semibold hover:bg-[#F7F7F7] transition-colors"
          >
            {isEditMode ? 'Quitter' : 'Enregistrer et quitter'}
          </button>
        </header>

        {chapter && (
          <MobileProgress
            chapterLabel={`Chapitre ${chapterIndex + 1} · ${chapter.title}`}
            stepLabel={isChapterEnd ? 'Terminé' : `Étape ${stepInChapter} sur ${chapter.steps.length}`}
            segments={mobileSegments}
          />
        )}

        <main className="px-5 md:px-10 pt-8 lg:pt-4 pb-40">
          <div className="mx-auto w-full max-w-[1000px] animate-in fade-in duration-300" key={currentStep}>

          {currentStep === 'reservation-type' && (
            <div className={WIDE}>
              <StepHeader eyebrow={eyebrow} title="Quel type de logement proposez-vous ?" description="Ces informations aident les voyageurs à trouver le séjour qui leur correspond." />
              <div className="space-y-10">
                <section aria-labelledby="space-title">
                  <SectionTitle id="space-title">Qu'offrez-vous aux voyageurs ?</SectionTitle>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {SPACE_TYPES.map(opt => (
                      <OptionCard key={opt.id} selected={spaceType === opt.id} onClick={() => setSpaceType(opt.id)} icon={opt.icon} title={opt.label} description={opt.desc} />
                    ))}
                  </div>
                </section>
                <section aria-labelledby="frequency-title">
                  <SectionTitle id="frequency-title">À quelle fréquence le louerez-vous ?</SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {RENTAL_FREQUENCIES.map(opt => (
                      <OptionCard key={opt.id} layout="row" selected={rentalFrequency === opt.id} onClick={() => setRentalFrequency(opt.id)} title={opt.label} description={opt.desc} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {currentStep === 'address-location' && (
            <div className={WITH_ASIDE}>
              <div>
                <StepHeader eyebrow={eyebrow} title="Où se situe votre logement ?" description="Seuls les voyageurs ayant une réservation confirmée verront l'adresse exacte." />
                <div className="space-y-5">
                  <Field label="Adresse" htmlFor="address-street">
                    <input id="address-street" type="text" autoComplete="street-address" className={inputClass} placeholder="Numéro et rue" value={addressData.address} onChange={e => setAddressData({ ...addressData, address: e.target.value })} />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Ville" htmlFor="address-city">
                      <input id="address-city" type="text" autoComplete="address-level2" className={inputClass} value={addressData.city} onChange={e => setAddressData({ ...addressData, city: e.target.value })} />
                    </Field>
                    <Field label="Code postal" htmlFor="address-postal" optional>
                      <input id="address-postal" type="text" autoComplete="postal-code" className={inputClass} value={addressData.postalCode} onChange={e => setAddressData({ ...addressData, postalCode: e.target.value })} />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Field label="Province ou État" htmlFor="address-province">
                      <SelectInput id="address-province" value={addressData.province} onChange={v => setAddressData({ ...addressData, province: v })}>
                        {Object.entries(PROVINCES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </SelectInput>
                    </Field>
                    <Field label="Pays" htmlFor="address-country">
                      <SelectInput id="address-country" value={addressData.country} onChange={v => setAddressData({ ...addressData, country: v })}>
                        {Object.entries(COUNTRIES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </SelectInput>
                    </Field>
                  </div>
                </div>
              </div>
              <div className={`${ASIDE} space-y-3`}>
                <p className="text-[13px] font-semibold text-[#6A6A6A]">Secteur</p>
                <div className="aspect-square rounded-2xl overflow-hidden border border-[#E4E4E4]">
                  <iframe
                    title="Carte du secteur"
                    src={buildMapEmbedUrl(addressData.city, addressData.country !== 'Other' ? COUNTRIES[addressData.country] : undefined)}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 'capacity-details' && (
            <div className={WITH_ASIDE}>
              <div>
                <StepHeader eyebrow={eyebrow} title="Combien de voyageurs pouvez-vous accueillir ?" description="Indiquez la capacité maximale, puis la répartition des lits." />
                <div className="rounded-2xl border border-[#E4E4E4] divide-y divide-[#E4E4E4]">
                  <StepperRow label="Voyageurs" help="Capacité maximale du logement" value={capacityData.capacity} min={1} max={20}
                    onChange={v => setCapacityData({ ...capacityData, capacity: v, adults: Math.min(capacityData.adults, v) })} />
                  <StepperRow label="Adultes" help="Nombre maximum d'adultes" value={capacityData.adults} min={1} max={capacityData.capacity}
                    onChange={v => setCapacityData({ ...capacityData, adults: v })} />
                  <StepperRow label="Salles de bain" value={capacityData.bathrooms} min={1} max={10}
                    onChange={v => setCapacityData({ ...capacityData, bathrooms: v })} />
                </div>

                <section aria-labelledby="rooms-title" className="mt-10">
                  <SectionTitle id="rooms-title" aside={plural(bedCount, 'lit', 'lits')}>Où dorment vos voyageurs ?</SectionTitle>
                  <div className="space-y-2.5">
                    {[...bedrooms.map(item => ({ item, type: 'bedroom' as const })), ...openAreas.map(item => ({ item, type: 'openArea' as const }))].map(({ item, type }) => {
                      const Icon = type === 'bedroom' ? BedDouble : Sofa;
                      const configured = Object.values(item.beds).some(v => v > 0);
                      return (
                        <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-[#E4E4E4] px-4 py-3.5">
                          <span className="w-11 h-11 flex-shrink-0 rounded-xl bg-[#F7F7F7] flex items-center justify-center">
                            <Icon className="w-[22px] h-[22px]" strokeWidth={1.75} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-semibold truncate">
                              {item.name}
                              {type === 'openArea' && <span className="font-normal text-[#6A6A6A]"> · espace ouvert</span>}
                            </p>
                            <p className={`text-sm ${configured ? 'text-[#6A6A6A]' : 'text-[#B54708]'}`}>{describeBeds(item.beds)}</p>
                          </div>
                          <button type="button" onClick={() => setEditingItem({ item, type })} className="min-h-[44px] px-3 text-sm font-semibold underline underline-offset-[3px] hover:text-black">
                            Modifier
                          </button>
                          <button type="button" onClick={() => removeRoom(item.id, type)} aria-label={`Supprimer ${item.name}`} className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-[#6A6A6A] hover:bg-[#F7F7F7] hover:text-[#222222]">
                            <Trash2 className="w-[18px] h-[18px]" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2.5 mt-4">
                    <button type="button" onClick={addBedroom} className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border border-[#CFCFCF] text-sm font-semibold hover:border-[#222222]">
                      <Plus className="w-4 h-4" /> Ajouter une chambre
                    </button>
                    <button type="button" onClick={addOpenArea} className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border border-[#CFCFCF] text-sm font-semibold hover:border-[#222222]">
                      <Plus className="w-4 h-4" /> Ajouter un espace ouvert
                    </button>
                  </div>
                </section>
              </div>
              <div className={ASIDE}>
                <ListingPreview photo={coverPhoto} title={descriptionData.title.trim()} location={locationLabel} details={capacitySummary}
                  note="L'aperçu se complète au fil des étapes : photos, titre puis prix." />
              </div>
            </div>
          )}

          {currentStep === 'amenities' && (
            <div className={WIDE}>
              <div className="flex flex-wrap items-end justify-between gap-x-6">
                <StepHeader eyebrow={eyebrow} title="Quels équipements proposez-vous ?" description={`Sélectionnez-en au moins ${MIN_AMENITIES}. Vous pourrez en ajouter après la publication.`} />
                <span
                  role="status"
                  className={`mb-10 inline-flex items-center gap-2 min-h-[40px] px-4 rounded-full text-sm font-semibold ${
                    selectedAmenities.length >= MIN_AMENITIES ? 'bg-[#E6F6F9] text-[#0A6E85]' : 'bg-[#F2F2F2] text-[#484848]'
                  }`}
                >
                  {selectedAmenities.length >= MIN_AMENITIES && <Check className="w-4 h-4" strokeWidth={2.5} />}
                  {selectedAmenities.length >= MIN_AMENITIES
                    ? `${selectedAmenities.length} sélectionnés · minimum atteint`
                    : `${selectedAmenities.length} sur ${MIN_AMENITIES} minimum`}
                </span>
              </div>
              <div className="space-y-9">
                {Object.entries(AMENITIES_DATA).map(([section, items]) => {
                  const count = items.filter(a => selectedAmenities.includes(a.id)).length;
                  return (
                    <section key={section} aria-label={section}>
                      <div className="flex items-baseline justify-between gap-3 pb-2.5 mb-3.5 border-b border-[#EBEBEB]">
                        <h2 className="text-[17px] font-semibold">{section}</h2>
                        <span className="text-[13px] text-[#6A6A6A]">{count > 0 ? plural(count, 'sélectionné', 'sélectionnés') : `${items.length} au choix`}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {items.map(amenity => (
                          <CheckTile key={amenity.id} selected={selectedAmenities.includes(amenity.id)} onClick={() => toggleAmenity(amenity.id)} label={amenity.label} icon={amenity.icon} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 'summary-review-1' && renderChapterEnd(
            'Votre logement est décrit',
            'Vérifiez ces informations avant de passer à votre annonce. Vous pourrez toujours les modifier.',
            <>
              <RecapRow label="Type de location" value={[spaceLabel, frequencyLabel?.toLowerCase()].filter(Boolean).join(' · ') || 'Non renseigné'} onEdit={() => goToStep('reservation-type')} />
              <RecapRow label="Adresse" value={addressData.address || 'Non renseignée'} sub={[addressData.postalCode, addressData.city].filter(Boolean).join(' ') || undefined} onEdit={() => goToStep('address-location')} />
              <RecapRow label="Capacité" value={capacityLine} onEdit={() => goToStep('capacity-details')} />
              <RecapRow label="Équipements" value={plural(selectedAmenities.length, 'équipement', 'équipements')}
                sub={amenityNames.length > 0 ? `${amenityNames.slice(0, 5).join(', ')}${amenityNames.length > 5 ? '…' : ''}` : undefined}
                onEdit={() => goToStep('amenities')} />
            </>
          )}

          {currentStep === 'host-photo' && (
            <div className={NARROW}>
              <StepHeader eyebrow={eyebrow} title="Ajoutez une photo de vous" description="Choisissez une photo où votre visage est bien visible : les voyageurs aiment savoir qui les accueille." />
              <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-[#E4E4E4] p-6">
                <div className="w-32 h-32 flex-shrink-0 rounded-full bg-[#F2F2F2] flex items-center justify-center overflow-hidden">
                  {hostPhoto ? <img src={hostPhoto} alt="Votre photo de profil" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-[#9A9A9A]" strokeWidth={1.5} />}
                </div>
                <div className="space-y-3 text-center sm:text-left">
                  <p className="text-sm text-[#6A6A6A]">Photo nette, de face, sans lunettes de soleil. Formats PNG, JPG ou WEBP.</p>
                  <label className="inline-flex items-center gap-2 min-h-[44px] px-5 rounded-xl border border-[#222222] text-sm font-semibold cursor-pointer hover:bg-[#F7F7F7] focus-within:ring-2 focus-within:ring-[#222222]">
                    <Camera className="w-4 h-4" />
                    {hostPhoto ? 'Changer de photo' : 'Choisir une photo'}
                    <input type="file" className="sr-only" accept="image/*" onChange={handleHostPhotoUpload} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'chalet-photos' && (
            <div className={WIDE}>
              <StepHeader eyebrow={eyebrow} title="Ajoutez des photos de votre logement"
                description="Ajoutez au moins une photo de chaque pièce : salon, cuisine, chambres, salles de bain, extérieur et environs. Nous recommandons au moins 5 photos." />
              <div className="relative rounded-2xl border-[1.5px] border-dashed border-[#CFCFCF] bg-[#FAFAFA] px-6 py-10 text-center transition-colors hover:border-[#222222] focus-within:border-[#222222]">
                <input type="file" multiple accept=".png,.jpg,.jpeg,.webp" onChange={handleChaletPhotoUpload} aria-label="Ajouter des photos du logement" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <ImagePlus className="w-8 h-8 mx-auto text-[#484848]" strokeWidth={1.75} />
                <p className="mt-3 text-[15px] font-semibold">Glissez vos photos ici</p>
                <p className="text-sm text-[#6A6A6A]">ou <span className="font-semibold text-[#222222] underline underline-offset-[3px]">parcourez vos fichiers</span> · PNG, JPG ou WEBP</p>
              </div>

              {chaletPhotos.length > 0 && (
                <section aria-labelledby="photos-title" className="mt-8">
                  <SectionTitle id="photos-title" aside={chaletPhotos.length < 5 ? `${chaletPhotos.length} sur 5 recommandées` : plural(chaletPhotos.length, 'photo', 'photos')}>
                    Vos photos
                  </SectionTitle>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {chaletPhotos.map((photo, index) => (
                      <div key={index} className={`group relative rounded-xl overflow-hidden bg-[#F2F2F2] ${index === 0 ? 'col-span-2 row-span-2' : ''}`}>
                        <img src={photo} alt={`Photo ${index + 1} du logement`} className="w-full h-full min-h-[140px] aspect-[4/3] object-cover" />
                        {index === 0 && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white text-xs font-semibold shadow">Photo de couverture</span>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1.5">
                          {index > 0 && (
                            <button type="button" onClick={() => makeCover(index)} className="h-8 px-2.5 rounded-full bg-white text-xs font-semibold shadow sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-opacity">
                              Mettre en couverture
                            </button>
                          )}
                          <button type="button" onClick={() => removePhoto(index)} aria-label={`Retirer la photo ${index + 1}`} className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}

          {currentStep === 'chalet-description' && (
            <div className={WITH_ASIDE}>
              <div>
                <StepHeader eyebrow={eyebrow} title="Présentez votre logement" description="Un titre accrocheur et une description claire aident les voyageurs à se projeter." />
                <div className="space-y-6">
                  <Field
                    label="Titre de l'annonce"
                    htmlFor="listing-title"
                    hint={checkingTitle ? 'Vérification du titre…' : 'Mettez en avant ce qui rend votre logement unique.'}
                    error={titleExists ? (
                      <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 flex-shrink-0" /> Ce titre existe déjà. Choisissez-en un autre.</span>
                    ) : undefined}
                  >
                    <input id="listing-title" type="text" value={descriptionData.title} maxLength={255}
                      onChange={(e) => setDescriptionData({ ...descriptionData, title: e.target.value })}
                      placeholder="Ex. : Appartement lumineux près du marché"
                      className={`${inputClass} ${titleExists ? 'border-[#B42318] focus:border-[#B42318] focus:ring-[#B42318]' : ''}`} />
                  </Field>
                  <Field label="Sous-titre" htmlFor="listing-subtitle" optional hint="Résumez les principaux atouts du logement en une phrase.">
                    <input id="listing-subtitle" type="text" value={descriptionData.subtitle} onChange={(e) => setDescriptionData({ ...descriptionData, subtitle: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Description" htmlFor="listing-description" hint="Présentez le logement, les activités à proximité et le village ou le quartier.">
                    <textarea id="listing-description" value={descriptionData.description} onChange={(e) => setDescriptionData({ ...descriptionData, description: e.target.value })} className={`${textareaClass} min-h-[160px]`} />
                  </Field>
                </div>

                <section aria-labelledby="extra-info-title" className="mt-10 pt-8 border-t border-[#EBEBEB]">
                  <SectionTitle id="extra-info-title" aside="Facultatif">Informations complémentaires</SectionTitle>
                  <div className="space-y-6">
                    {[
                      { key: 'aboutChalet', label: 'Le logement', hint: 'Tout autre détail qui aide les voyageurs à savoir à quoi s’attendre.' },
                      { key: 'hostAvailability', label: 'Vos disponibilités', hint: 'Dites aux voyageurs comment vous joindre pendant le séjour. Pour votre sécurité, ne donnez ni téléphone ni e-mail avant la réservation.' },
                      { key: 'neighborhood', label: 'Le quartier', hint: 'Un café, un parc ou un lieu que vous aimez à proximité.' },
                      { key: 'transport', label: 'Transport', hint: 'Transports en commun, stationnement, itinéraires à pied.' },
                      { key: 'otherInfo', label: 'Autres informations', hint: undefined },
                    ].map(({ key, label, hint }) => (
                      <Field key={key} label={label} htmlFor={`extra-${key}`} hint={hint}>
                        <textarea id={`extra-${key}`} value={descriptionData[key as keyof typeof descriptionData]}
                          onChange={(e) => setDescriptionData({ ...descriptionData, [key]: e.target.value })}
                          className={`${textareaClass} min-h-[100px]`} />
                      </Field>
                    ))}
                  </div>
                </section>
              </div>
              <div className={ASIDE}>
                <ListingPreview photo={coverPhoto} title={descriptionData.title.trim()} location={locationLabel} details={capacitySummary} />
              </div>
            </div>
          )}

          {currentStep === 'summary-review-2' && renderChapterEnd(
            'Votre annonce prend forme',
            'Vérifiez vos photos et votre texte avant de fixer vos tarifs.',
            <>
              <RecapRow label="Photo de profil"
                value={hostPhoto ? 'Ajoutée' : hasProfilePhoto ? 'Photo de votre compte' : 'Aucune photo'}
                onEdit={stepsList.includes('host-photo') ? () => goToStep('host-photo') : undefined} />
              <RecapRow label="Photos" value={plural(chaletPhotos.length, 'photo', 'photos')}
                sub={chaletPhotos.length > 0 ? (
                  <span className="flex gap-1.5 mt-1.5">
                    {chaletPhotos.slice(0, 6).map((photo, i) => <img key={i} src={photo} alt="" className="w-12 h-12 rounded-lg object-cover" />)}
                  </span>
                ) : 'Ajoutez au moins 5 photos pour une annonce complète'}
                onEdit={() => goToStep('chalet-photos')} />
              <RecapRow label="Titre" value={descriptionData.title || 'Non renseigné'} sub={descriptionData.subtitle || undefined} onEdit={() => goToStep('chalet-description')} />
              <RecapRow label="Description"
                value={descriptionData.description ? `${descriptionData.description.slice(0, 140)}${descriptionData.description.length > 140 ? '…' : ''}` : 'Non renseignée'}
                onEdit={() => goToStep('chalet-description')} />
            </>
          )}

          {currentStep === 'reservation-mode' && (
            <div className={NARROW}>
              <StepHeader eyebrow={eyebrow} title="Définissez vos règles de séjour" description="Les voyageurs réservent directement, sans validation de votre part : gardez votre calendrier à jour." />
              <div className="space-y-10">
                <section aria-labelledby="hours-title">
                  <SectionTitle id="hours-title">Horaires</SectionTitle>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Arrivée à partir de" htmlFor="arrival-time">
                      <SelectInput id="arrival-time" value={arrivalTime} onChange={setArrivalTime}>
                        {['15:00', '16:00', '17:00', '18:00', '19:00'].map(t => <option key={t} value={t}>{t}</option>)}
                      </SelectInput>
                    </Field>
                    <Field label="Départ avant" htmlFor="departure-time">
                      <SelectInput id="departure-time" value={departureTime} onChange={setDepartureTime}>
                        {['10:00', '11:00', '12:00', '13:00'].map(t => <option key={t} value={t}>{t}</option>)}
                      </SelectInput>
                    </Field>
                  </div>
                </section>

                <section aria-labelledby="stay-title">
                  <SectionTitle id="stay-title">Durée du séjour</SectionTitle>
                  <div className="rounded-2xl border border-[#E4E4E4]">
                    <StepperRow label="Durée minimale" help="En nombre de nuits" value={parseInt(minStay) || 1} min={1} max={30} onChange={v => setMinStay(String(v))} unit="nuits" />
                  </div>
                  <div className="mt-5">
                    <Field label="Durée maximale" htmlFor="max-stay">
                      <SelectInput id="max-stay" value={maxStay} onChange={setMaxStay}>
                        <option value="Aucun maximum">Aucun maximum</option>
                        {['7', '14', '28'].map(n => <option key={n} value={n}>{n} nuits</option>)}
                      </SelectInput>
                    </Field>
                  </div>
                </section>

                <section className="border-t border-[#EBEBEB] pt-6">
                  <button type="button" onClick={() => setAdvancedStaySettingsOpen(!advancedStaySettingsOpen)} aria-expanded={advancedStaySettingsOpen} className="w-full flex items-center justify-between gap-4 min-h-[44px] text-left">
                    <span>
                      <span className="block text-[17px] font-semibold">Jours d'arrivée et de départ</span>
                      <span className="block text-sm text-[#6A6A6A]">Limitez les jours où les séjours peuvent commencer ou se terminer.</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 text-[#6A6A6A] transition-transform ${advancedStaySettingsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {advancedStaySettingsOpen && (
                    <div className="pt-6 space-y-6">
                      {[
                        { label: 'Arrivées possibles le', days: arrivalDays, set: setArrivalDays },
                        { label: 'Départs possibles le', days: departureDays, set: setDepartureDays },
                      ].map(({ label, days, set }) => (
                        <div key={label} role="group" aria-label={label} className="space-y-3">
                          <p className="text-sm font-semibold">{label}</p>
                          <div className="flex flex-wrap gap-2">
                            {DAYS_OF_WEEK.map(day => (
                              <button key={day} type="button" aria-pressed={!!days[day]} onClick={() => set(prev => ({ ...prev, [day]: !prev[day] }))}
                                className={`w-14 h-11 rounded-xl border text-sm font-semibold transition-colors ${days[day] ? 'bg-[#222222] border-[#222222] text-white' : 'bg-white border-[#CFCFCF] text-[#484848] hover:border-[#222222]'}`}>
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {currentStep === 'pricing' && (
            <div className={WITH_ASIDE}>
              <div>
                <StepHeader eyebrow={eyebrow} title="Fixez votre prix par nuit" description="Vous pourrez le modifier à tout moment depuis votre espace hôte." />
                <div className="space-y-2.5">
                  <label htmlFor="base-price" className="block text-[15px] font-semibold">Prix de base</label>
                  <div className="flex items-center gap-2.5 rounded-2xl border border-[#CFCFCF] px-6 py-4 focus-within:border-[#222222] focus-within:ring-1 focus-within:ring-[#222222]">
                    <input id="base-price" type="text" inputMode="decimal" value={pricing.base} onChange={(e) => setPricing({ ...pricing, base: e.target.value })}
                      style={{ width: `${Math.max(pricing.base.length, 2) + 0.2}ch` }}
                      className="max-w-full min-w-0 bg-transparent text-[44px] md:text-[56px] font-bold tracking-[-0.02em] tabular-nums focus:outline-none" />
                    <span className="text-[36px] md:text-[44px] font-bold">€</span>
                    <span className="ml-auto text-base text-[#6A6A6A]">par nuit</span>
                  </div>
                  <p className="text-[13px] text-[#6A6A6A]">Devise : euro (EUR)</p>
                </div>

                <section aria-labelledby="optional-rates-title" className="mt-10">
                  <SectionTitle id="optional-rates-title" aside="Facultatif">Tarifs particuliers</SectionTitle>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Nuit de week-end" htmlFor="rate-weekend" hint="Vendredi et samedi">
                      <AmountInput id="rate-weekend" value={pricing.weekend} onChange={v => setPricing({ ...pricing, weekend: v })} />
                    </Field>
                    <Field label="Semaine" htmlFor="rate-weekly" hint="Pour 7 nuits">
                      <AmountInput id="rate-weekly" value={pricing.weekly} onChange={v => setPricing({ ...pricing, weekly: v })} />
                    </Field>
                    <Field label="Mois" htmlFor="rate-monthly" hint="Pour 28 nuits">
                      <AmountInput id="rate-monthly" value={pricing.monthly} onChange={v => setPricing({ ...pricing, monthly: v })} />
                    </Field>
                  </div>
                </section>
              </div>
              <div className={ASIDE}>
                <ListingPreview photo={coverPhoto} title={descriptionData.title.trim()} location={locationLabel} details={capacitySummary} price={basePriceLabel}
                  note="C'est ainsi que votre annonce apparaîtra dans les résultats de recherche." />
              </div>
            </div>
          )}

          {currentStep === 'fees' && (
            <div className={NARROW}>
              <StepHeader eyebrow={eyebrow} title="Ajoutez vos frais" description="Indiquez les montants demandés en plus du prix des nuits." />
              <div className="space-y-5">
                <Field label="Frais de ménage" htmlFor="fee-cleaning" hint="Facturés une fois par séjour.">
                  <AmountInput id="fee-cleaning" value={fees.cleaning} onChange={v => setFees({ ...fees, cleaning: v })} />
                </Field>
                <Field label="Dépôt de sécurité" htmlFor="fee-security">
                  <AmountInput id="fee-security" value={fees.security} onChange={v => setFees({ ...fees, security: v })} />
                </Field>
              </div>

              <section aria-labelledby="optional-fees-title" className="mt-10">
                <SectionTitle id="optional-fees-title" aside="Facultatif">Frais supplémentaires</SectionTitle>
                <div className="rounded-2xl border border-[#E4E4E4] divide-y divide-[#E4E4E4]">
                  {[
                    { label: 'Voyageur supplémentaire', help: 'Par voyageur supplémentaire et par nuit', open: extraGuestFeeOpen, setOpen: setExtraGuestFeeOpen, value: extraGuestFee, setValue: setExtraGuestFee, id: 'fee-extra-guest' },
                    { label: 'Animaux', help: 'Par nuit, lorsque des animaux accompagnent les voyageurs', open: petFeeOpen, setOpen: setPetFeeOpen, value: petFee, setValue: setPetFee, id: 'fee-pet' },
                  ].map(fee => (
                    <div key={fee.id} className="px-5 py-4 space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold">{fee.label}</p>
                          <p className="text-sm text-[#6A6A6A]">{fee.help}</p>
                        </div>
                        <Switch checked={fee.open} label={`Frais : ${fee.label}`} onChange={(on) => { fee.setOpen(on); if (!on) fee.setValue(''); }} />
                      </div>
                      {fee.open && (
                        <div className="max-w-[240px]">
                          <label htmlFor={fee.id} className="sr-only">Montant : {fee.label}</label>
                          <AmountInput id={fee.id} value={fee.value} onChange={fee.setValue} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {currentStep === 'calendar' && (
            <div className={WIDE}>
              <StepHeader eyebrow={eyebrow} title="Gardez votre calendrier à jour"
                description="Les voyageurs réservent directement les nuits libres. Après la publication, bloquez les nuits où le logement n'est pas disponible depuis votre calendrier hôte." />
              <div className="flex items-start gap-3 rounded-2xl bg-[#E6F6F9] px-5 py-4 text-sm leading-relaxed text-[#0A6E85] mb-8">
                <Info className="w-5 h-5 flex-shrink-0 mt-px" />
                <p>Annuler un séjour à la dernière minute entraîne des pénalités : vérifiez vos disponibilités avant la mise en ligne.</p>
              </div>
              <section aria-labelledby="calendar-title" className="rounded-2xl border border-[#E4E4E4] overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#E4E4E4]">
                  <h2 id="calendar-title" className="text-[17px] font-semibold capitalize">{calendarTitle}</h2>
                  <div className="flex gap-1">
                    <button type="button" aria-label="Mois précédent" disabled={isCurrentMonth}
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F7F7F7] disabled:opacity-30 disabled:hover:bg-transparent">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button type="button" aria-label="Mois suivant"
                      onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F7F7F7]">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 bg-[#FAFAFA] border-b border-[#E4E4E4]">
                  {DAYS_OF_WEEK.map(day => <div key={day} className="py-2 text-center text-xs font-semibold text-[#6A6A6A]">{day}</div>)}
                </div>
                <div className="grid grid-cols-7">
                  {calendarCells.map((cell, i) => (
                    <div key={i} className={`min-h-[64px] md:min-h-[84px] p-2 border-b border-r border-[#F0F0F0] ${(i + 1) % 7 === 0 ? 'border-r-0' : ''}`}>
                      {cell && (
                        <div className="h-full flex flex-col justify-between">
                          <span className={`text-sm ${cell.past ? 'text-[#BDBDBD] line-through' : 'font-semibold text-[#222222]'}`}>{cell.day}</span>
                          {!cell.past && basePriceLabel && <span className="hidden sm:block text-xs text-[#6A6A6A]">{basePriceLabel}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
              <p className="mt-3 flex items-center gap-2 text-[13px] text-[#6A6A6A]">
                <CalendarDays className="w-4 h-4" />
                Toutes les nuits à venir sont ouvertes à la réservation au prix de base.
              </p>
            </div>
          )}

          {currentStep === 'cancellation-policy' && (
            <div className={NARROW}>
              <StepHeader eyebrow={eyebrow} title="Choisissez votre politique d'annulation" description="Elle s'affiche sur votre annonce et s'applique à chaque réservation." />
              <div className="space-y-3">
                {CANCELLATION_POLICIES.map(policy => (
                  <OptionCard key={policy} layout="row" selected={cancellationPolicy === policy} onClick={() => setCancellationPolicy(policy)}
                    title={CANCELLATION_POLICY_LABELS[policy]} description={CANCELLATION_POLICY_RULES[policy].join(' ')} />
                ))}
              </div>
            </div>
          )}

          {currentStep === 'summary-review-3' && renderChapterEnd(
            'Vos tarifs sont prêts',
            'Vérifiez vos règles et vos prix avant les dernières informations pratiques.',
            <>
              <RecapRow label="Règles de séjour" value={`Arrivée dès ${arrivalTime} · départ avant ${departureTime}`}
                sub={`${plural(parseInt(minStay) || 1, 'nuit', 'nuits')} minimum · ${maxStay === 'Aucun maximum' ? 'pas de maximum' : `${maxStay} nuits maximum`}`}
                onEdit={() => goToStep('reservation-mode')} />
              <RecapRow label="Prix" value={basePriceLabel ? `${basePriceLabel} par nuit` : 'Non renseigné'}
                sub={[
                  formatAmount(pricing.weekend) && `week-end ${formatAmount(pricing.weekend)}`,
                  formatAmount(pricing.weekly) && `semaine ${formatAmount(pricing.weekly)}`,
                  formatAmount(pricing.monthly) && `mois ${formatAmount(pricing.monthly)}`,
                ].filter(Boolean).join(' · ') || undefined}
                onEdit={() => goToStep('pricing')} />
              <RecapRow label="Frais" value={`Ménage ${formatAmount(fees.cleaning) ?? '0 €'} · dépôt ${formatAmount(fees.security) ?? '0 €'}`}
                sub={[
                  formatAmount(extraGuestFee) && `voyageur supplémentaire ${formatAmount(extraGuestFee)}`,
                  formatAmount(petFee) && `animaux ${formatAmount(petFee)}`,
                ].filter(Boolean).join(' · ') || undefined}
                onEdit={() => goToStep('fees')} />
              <RecapRow label="Annulation" value={CANCELLATION_POLICY_LABELS[cancellationPolicy]} onEdit={() => goToStep('cancellation-policy')} />
            </>
          )}

          {currentStep === 'laws-taxes' && (
            <div className={NARROW}>
              <StepHeader eyebrow={eyebrow} title="Enregistrement et taxes" description="Si votre secteur exige un numéro d'enregistrement ou un permis de location à court terme, indiquez-le ici." />
              <div className="space-y-5">
                <Field label="Type d'enregistrement" htmlFor="tax-type">
                  <SelectInput id="tax-type" value={taxRegistration.type} onChange={v => setTaxRegistration({ ...taxRegistration, type: v })}>
                    <option value="CITQ">CITQ</option>
                    <option value="Other">Autre</option>
                  </SelectInput>
                </Field>
                <Field label={taxRegistration.type === 'CITQ' ? "Numéro d'enregistrement CITQ" : "Numéro d'enregistrement"} htmlFor="tax-number" hint="Laissez vide si votre secteur n'en exige pas.">
                  <input id="tax-number" type="text" value={taxRegistration.number} onChange={(e) => setTaxRegistration({ ...taxRegistration, number: e.target.value })} className={inputClass} />
                </Field>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Date de délivrance" htmlFor="tax-issue" optional>
                    <input id="tax-issue" type="date" value={taxDateToInput(taxRegistration.issueDate)} onChange={(e) => setTaxRegistration({ ...taxRegistration, issueDate: inputToTaxDate(e.target.value) })} className={inputClass} />
                  </Field>
                  <Field label="Date d'expiration" htmlFor="tax-expiry" optional>
                    <input id="tax-expiry" type="date" value={taxDateToInput(taxRegistration.expDate)} onChange={(e) => setTaxRegistration({ ...taxRegistration, expDate: inputToTaxDate(e.target.value) })} className={inputClass} />
                  </Field>
                </div>
              </div>

              <section aria-labelledby="taxes-title" className="mt-10 pt-8 border-t border-[#EBEBEB]">
                <SectionTitle id="taxes-title">Taxes</SectionTitle>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-[15px] text-[#484848]">Vos prix incluent-ils déjà les taxes (TPS, TVQ) ?</p>
                  <YesNo label="Taxes incluses dans le prix" value={taxRegistration.taxesIncluded} onChange={v => setTaxRegistration({ ...taxRegistration, taxesIncluded: v })} />
                </div>
              </section>
            </div>
          )}

          {currentStep === 'local-laws' && (
            <div className={NARROW}>
              <StepHeader eyebrow={eyebrow} title="Respectez les lois de votre secteur" description="Avant de publier votre annonce, informez-vous sur les règles en vigueur dans votre ville." />
              <div className="rounded-2xl bg-[#F7F7F7] p-6 space-y-4 text-[15px] leading-relaxed text-[#484848]">
                <p>
                  La plupart des villes encadrent la location de logements (urbanisme, zonage, code du bâtiment, etc.). Le plus souvent, vous devez vous enregistrer et obtenir une autorisation avant de louer votre logement ou d'accueillir des voyageurs.
                </p>
                <p>
                  Vous pouvez aussi devoir percevoir et reverser certaines taxes. Dans certains secteurs, la location de courte durée est interdite.
                </p>
                <p>
                  Vous êtes responsable de votre décision de louer votre logement : il vous appartient de connaître les règles applicables avant d'utiliser Séjoura.
                </p>
              </div>
              <div className="mt-8">
                <CheckboxRow id="accept-local-laws" checked={acceptedLocalLaws} onChange={setAcceptedLocalLaws}>
                  J'accepte les <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-[3px]">conditions générales</a> de Séjoura et je m'engage à respecter les lois locales en vigueur là où se trouve mon logement.
                </CheckboxRow>
              </div>
            </div>
          )}

          {currentStep === 'guest-arrival' && (
            <div className={NARROW}>
              <StepHeader eyebrow={eyebrow} title="Préparez l'arrivée des voyageurs" description="Ces informations sont communiquées aux voyageurs une fois leur réservation confirmée." />
              <div className="space-y-10">
                <section aria-labelledby="checkin-title">
                  <SectionTitle id="checkin-title">Comment les voyageurs entrent-ils dans le logement ?</SectionTitle>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {CHECKIN_METHODS.map(method => (
                      <OptionCard key={method.id} selected={guestArrival.checkinMethod === method.id} onClick={() => setGuestArrival({ ...guestArrival, checkinMethod: method.id })}
                        icon={method.icon} title={method.label} description={method.desc} />
                    ))}
                  </div>
                </section>

                <Field label="Instructions et règlement intérieur" htmlFor="checkin-instructions" optional hint="Code d'accès, stationnement, règles de la maison…">
                  <textarea id="checkin-instructions" value={guestArrival.instructions} onChange={(e) => setGuestArrival({ ...guestArrival, instructions: e.target.value })} className={`${textareaClass} min-h-[120px]`} />
                </Field>

                <section aria-labelledby="internet-title">
                  <SectionTitle id="internet-title">Internet</SectionTitle>
                  <div className="rounded-2xl border border-[#E4E4E4] divide-y divide-[#E4E4E4]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4">
                      <p className="text-[15px] font-medium">Le logement a-t-il le wifi ?</p>
                      <YesNo label="Wifi disponible" value={guestArrival.hasWifi}
                        onChange={v => setGuestArrival({ ...guestArrival, hasWifi: v, internetSpeed: v ? guestArrival.internetSpeed : '' })} />
                    </div>
                    {guestArrival.hasWifi && (
                      <div className="px-5 py-4">
                        <Field label="Vitesse de connexion" htmlFor="internet-speed">
                          <SelectInput id="internet-speed" value={guestArrival.internetSpeed} onChange={v => setGuestArrival({ ...guestArrival, internetSpeed: v })}>
                            <option value="">Choisissez une vitesse</option>
                            {INTERNET_SPEEDS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                          </SelectInput>
                        </Field>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}

          {currentStep === 'phone-number' && (
            <div className={NARROW}>
              <StepHeader eyebrow={eyebrow} title="Ajoutez votre numéro de téléphone"
                description="Nous vous enverrons les réservations, les rappels et d'autres notifications. Ce numéro doit pouvoir recevoir des SMS ou des appels." />
              <Field label="Téléphone portable" htmlFor="phone-number">
                <div className="flex rounded-xl border border-[#CFCFCF] bg-white overflow-hidden focus-within:border-[#222222] focus-within:ring-1 focus-within:ring-[#222222]">
                  <div className="relative border-r border-[#E4E4E4]">
                    <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} aria-label="Indicatif du pays"
                      className="h-12 pl-4 pr-9 appearance-none bg-transparent text-[15px] font-medium cursor-pointer focus:outline-none">
                      <option value="+1">🇨🇦 +1</option>
                      <option value="+1US">🇺🇸 +1</option>
                      <option value="+33">🇫🇷 +33</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A6A6A] pointer-events-none" />
                  </div>
                  <input id="phone-number" type="tel" autoComplete="tel-national" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="(000) 000-0000" className="flex-1 min-w-0 h-12 px-4 text-[15px] placeholder:text-[#8A8A8A] focus:outline-none" />
                </div>
              </Field>
            </div>
          )}

          {currentStep === 'verification' && (
            <div className={WITH_ASIDE}>
              <div>
                <StepHeader eyebrow={`Chapitre ${chapterIndex + 1} · Dernière étape`}
                  title={isEditMode ? 'Relisez vos modifications' : 'Relisez et envoyez votre annonce'}
                  description={isEditMode ? 'Vos modifications seront enregistrées sur votre annonce.' : 'Notre équipe examinera votre annonce avant sa mise en ligne.'} />

                <div className="rounded-2xl border border-[#E4E4E4] divide-y divide-[#E4E4E4]">
                  {[
                    {
                      title: '1 · Votre logement', target: 'reservation-type' as Step,
                      lines: [
                        [spaceLabel, frequencyLabel?.toLowerCase(), locationLabel].filter(Boolean).join(' · '),
                        `${capacityLine} · ${plural(selectedAmenities.length, 'équipement', 'équipements')}`,
                      ],
                    },
                    {
                      title: '2 · Votre annonce', target: 'chalet-photos' as Step,
                      lines: [
                        `« ${descriptionData.title || 'Sans titre'} » · ${plural(chaletPhotos.length, 'photo', 'photos')}`,
                        descriptionData.description ? `${descriptionData.description.slice(0, 90)}${descriptionData.description.length > 90 ? '…' : ''}` : 'Pas encore de description',
                      ],
                    },
                    {
                      title: '3 · Tarifs et réservations', target: 'reservation-mode' as Step,
                      lines: [
                        `${basePriceLabel ?? '—'} par nuit · ménage ${formatAmount(fees.cleaning) ?? '0 €'} · dépôt ${formatAmount(fees.security) ?? '0 €'}`,
                        `Arrivée dès ${arrivalTime}, départ avant ${departureTime} · ${plural(parseInt(minStay) || 1, 'nuit', 'nuits')} minimum · annulation ${CANCELLATION_POLICY_LABELS[cancellationPolicy].toLowerCase()}`,
                      ],
                    },
                    {
                      title: '4 · Règles et arrivée', target: 'laws-taxes' as Step,
                      lines: [
                        [taxRegistration.number ? `${taxRegistration.type === 'CITQ' ? 'CITQ' : 'Enregistrement'} n° ${taxRegistration.number}` : "Pas de numéro d'enregistrement", acceptedLocalLaws ? 'lois locales acceptées' : null].filter(Boolean).join(' · '),
                        [checkinLabel, guestArrival.hasWifi ? 'wifi' : guestArrival.hasWifi === false ? 'sans wifi' : null, phoneNumber ? `${countryCode.replace('US', '')} ${phoneNumber}` : null].filter(Boolean).join(' · '),
                      ],
                    },
                  ].map(group => (
                    <div key={group.title} className="px-5 py-4 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-base font-semibold">{group.title}</h2>
                        <button type="button" onClick={() => goToStep(group.target)} aria-label={`Modifier : ${group.title}`} className="inline-flex items-center gap-1.5 min-h-[40px] text-sm font-semibold underline underline-offset-[3px] hover:text-black">
                          <Pencil className="w-3.5 h-3.5" /> Modifier
                        </button>
                      </div>
                      {group.lines.filter(Boolean).map((line, i) => <p key={i} className="text-sm leading-relaxed text-[#484848]">{line}</p>)}
                    </div>
                  ))}
                </div>

                <section aria-labelledby="signature-title" className="mt-8 rounded-2xl bg-[#F7F7F7] p-6 space-y-5">
                  <h2 id="signature-title" className="text-[17px] font-semibold">Signature</h2>
                  <CheckboxRow id="certify" checked={isSigned} onChange={setIsSigned}>
                    <span className="text-sm text-[#484848]">
                      Je certifie que ces informations sont exactes et conformes à la réalité. Je comprends qu'une fausse déclaration peut entraîner la suspension de mon annonce, et j'accepte les <a href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#222222] underline underline-offset-[3px]">conditions d'utilisation</a> de Séjoura.
                    </span>
                  </CheckboxRow>
                  <Field label="Votre nom complet" htmlFor="signature-name" hint="Fait office de signature électronique.">
                    <input id="signature-name" type="text" autoComplete="name" value={signatureName} onChange={(e) => setSignatureName(e.target.value)}
                      placeholder="Prénom Nom" className={`${inputClass} h-14 font-serif italic text-xl`} />
                  </Field>
                  {submitError && (
                    <p role="alert" className="flex items-start gap-2 text-sm text-[#B42318]">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {submitError}
                    </p>
                  )}
                </section>
              </div>
              <div className={`${ASIDE} space-y-4`}>
                <ListingPreview label="Ce que verront les voyageurs" photo={coverPhoto} title={descriptionData.title.trim()} location={locationLabel} details={capacitySummary} price={basePriceLabel} />
                {!isEditMode && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-[#E6F6F9] p-3.5 text-[13px] leading-relaxed text-[#0A6E85]">
                    <Info className="w-[18px] h-[18px] flex-shrink-0" />
                    Après l'envoi, votre annonce reste modifiable depuis votre espace hôte.
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </main>

        <ActionBar
          onBack={handleBack}
          onNext={handleNext}
          nextLabel={nextLabel}
          disabled={!!blockingReason}
          hint={blockingReason}
          loading={isSubmitting}
        />
      </div>

      {/* MODAL: SMS Verification Code */}
      {isSmsModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSmsModalOpen(false)} />
          <div role="dialog" aria-modal="true" aria-labelledby="sms-title" className="relative z-10 w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 mb-5">
              <h3 id="sms-title" className="text-xl font-bold">Confirmez votre numéro</h3>
              <button type="button" onClick={() => setIsSmsModalOpen(false)} aria-label="Fermer" className="w-9 h-9 -mr-2 -mt-1 rounded-full flex items-center justify-center hover:bg-[#F7F7F7]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[15px] text-[#484848]">Saisissez le code envoyé par SMS au <strong className="text-[#222222] whitespace-nowrap">{countryCode.replace('US', '')} {phoneNumber}</strong>.</p>
            <label htmlFor="sms-code" className="sr-only">Code de vérification</label>
            <input id="sms-code" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="123456" value={smsCode} onChange={(e) => setSmsCode(e.target.value)}
              className="mt-5 w-full h-14 rounded-xl border border-[#CFCFCF] text-center text-2xl font-bold tracking-[0.3em] focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-[#222222]" />
            <p className="mt-3 text-sm text-[#6A6A6A]">
              Vous ne l'avez pas reçu ? <button type="button" className="font-semibold text-[#222222] underline underline-offset-[3px]">Renvoyer le code</button>
            </p>
            <div className="mt-7 flex gap-3">
              <button type="button" onClick={() => setIsSmsModalOpen(false)} className="flex-1 min-h-[48px] rounded-xl border border-[#CFCFCF] font-semibold hover:border-[#222222]">
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  // Verify code logic here (mock)
                  setIsSmsModalOpen(false);
                  goToStep(stepsList[currentStepIndex + 1]);
                }}
                className="flex-1 min-h-[48px] rounded-xl bg-[#222222] text-white font-semibold hover:bg-black"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bedroom/Open Area Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditingItem(null)} />
          <div role="dialog" aria-modal="true" aria-labelledby="room-title" className="relative z-10 w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#EBEBEB]">
              <h2 id="room-title" className="text-lg font-bold truncate">{editingItem.item.name || 'Espace'}</h2>
              <button type="button" onClick={() => setEditingItem(null)} aria-label="Fermer" className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center hover:bg-[#F7F7F7]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <Field label="Nom de l'espace" htmlFor="room-name">
                <input id="room-name" type="text" value={editingItem.item.name}
                  onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, name: e.target.value } })}
                  className={inputClass} />
              </Field>
              <div>
                <p className="text-sm font-semibold mb-2">Lits</p>
                <div className="rounded-2xl border border-[#E4E4E4] divide-y divide-[#E4E4E4]">
                  {BED_TYPES.map(bed => (
                    <StepperRow key={bed.key} dense label={bed.label} value={editingItem.item.beds[bed.key]} min={0} max={10} onChange={(v) => setBedCount(bed.key, v)} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-[#EBEBEB]">
              <button type="button" onClick={() => setEditingItem(null)} className="flex-1 min-h-[48px] rounded-xl border border-[#CFCFCF] font-semibold hover:border-[#222222]">
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  updateItem(editingItem.item, editingItem.type);
                  setEditingItem(null);
                }}
                className="flex-1 min-h-[48px] rounded-xl bg-[#222222] text-white font-semibold hover:bg-black"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
