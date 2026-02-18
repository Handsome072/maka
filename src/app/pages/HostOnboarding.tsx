import { useState, useRef, useEffect } from 'react';
import { Logo } from '@/app/components/Logo';
import { 
  Check, ChevronRight, Minus, Plus, Pencil, X, ChevronDown, ChevronUp, ChevronLeft,
  Waves, Anchor, LifeBuoy, Thermometer, Activity, Fish, Droplets, 
  Warehouse, Sunset, Flame, Ship, Fuel, Sparkles, Utensils, DoorOpen, 
  Trees, Bed, Umbrella, Eye, CloudRain, Snowflake, Armchair,
  Wifi, Tv, Car, Bike, UtensilsCrossed, Coffee, Baby, Accessibility, Ban,
  MapPin, Upload, Info, Circle, HelpCircle, Calendar as CalendarIcon, ExternalLink, Globe, Lock, User
} from 'lucide-react';
import { toast } from 'sonner';

// Import images
const summaryChaletImg = "https://images.unsplash.com/photo-1685475512320-eede8aea2b95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBjaGFsZXQlMjBleHRlcmlvciUyMGdyZWVuJTIwbmF0dXJlfGVufDF8fHx8MTc3MDk5NTg1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

interface HostOnboardingProps {
  onNavigate: (page: string, data?: any) => void;
  initialStep?: Step;
  onCompleteOnboarding?: () => void;
  onStepChange?: (step: Step) => void;
}

type Step = 
  | 'acceptance-condition' 
  | 'reservation-type' 
  | 'address-location' 
  | 'capacity-details'
  | 'client-expectations'
  | 'amenities'
  | 'summary-review-1'
  | 'host-photo'
  | 'chalet-photos'
  | 'chalet-description'
  | 'summary-review-2'
  | 'permissions'
  | 'reservation-mode'
  | 'pricing'
  | 'fees'
  | 'calendar'
  | 'cancellation-policy'
  | 'laws-taxes'
  | 'local-laws'
  | 'guest-arrival'
  | 'phone-number'
  | 'summary-review-3'
  | 'verification'
  | 'signature';

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

// Amenities Data
const AMENITIES_DATA = {
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
  ]
};

// Expectations Data
const EXPECTATIONS_DATA = {
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
  ]
};

// Permissions Data
const PERMISSIONS_DATA = [
  { id: 'children', label: "Convient aux enfants (2-14 ans)" },
  { id: 'infants', label: "Convient aux bébés (moins de 2 ans)" },
  { id: 'pets', label: "Animaux permis" },
  { id: 'smoking', label: "Il est permis de fumer à l'intérieur" },
  { id: 'parties', label: "Tenue d'une fête autorisée" },
  { id: 'events', label: "Événements autorisés" },
  { id: 'outdoor_fire', label: "Possible de faire un feu à l'extérieur" },
];

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// --- MOCK MAP COMPONENT ---
function MockMap() {
  return (
    <div className="w-full h-full relative bg-[#E5E3DF] overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#999" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <path d="M0 100 Q 150 50 300 150 T 600 100" stroke="#fff" strokeWidth="15" fill="none" />
        <path d="M100 0 Q 150 300 100 600" stroke="#fff" strokeWidth="12" fill="none" />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full drop-shadow-lg">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center relative z-10">
          <MapPin className="w-5 h-5 text-white" fill="white" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rotate-45 transform origin-center z-[-1]" />
        </div>
        <div className="w-4 h-1.5 bg-black/20 rounded-[100%] absolute -bottom-2 left-1/2 -translate-x-1/2 blur-[2px]" />
      </div>
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-700 font-bold transition-colors border border-gray-100">
          <Plus className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-700 font-bold transition-colors border border-gray-100">
          <Minus className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] text-gray-600 bg-white/80 px-2 py-1 rounded pointer-events-none backdrop-blur-sm">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---

export function HostOnboarding({ onNavigate, initialStep = 'acceptance-condition', onCompleteOnboarding, onStepChange }: HostOnboardingProps) {
  // Linearize steps
  const stepsList: Step[] = [
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
    'signature'
  ];

  const [currentStep, setCurrentStep] = useState<Step>(initialStep);

  // Sync currentStep with initialStep when it changes (for URL-based navigation)
  useEffect(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  // Helper to change steps - uses onStepChange if provided for URL sync
  const changeStep = (newStep: Step) => {
    if (onStepChange) {
      onStepChange(newStep);
    } else {
      setCurrentStep(newStep);
    }
  };
  
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
    {
      id: '1',
      name: 'Chambre #1',
      beds: { simple: 1, double: 0, queen: 0, king: 0, simple_bunk: 0, double_bunk: 0, queen_bunk: 0, king_bunk: 0, sofa_bed: 0, other: 0 }
    }
  ]);

  const [openAreas, setOpenAreas] = useState<Bedroom[]>([]);

  // 5. Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [expandedAmenities, setExpandedAmenities] = useState<Record<string, boolean>>({
    'Attraits extérieurs': true // Default expanded
  });

  // 6. Expectations
  // Initialize with 'yes' for all items by default
  const [expectations, setExpectations] = useState<Record<string, 'yes' | 'no' | null>>(() => {
    const defaults: Record<string, 'yes' | 'no' | null> = {};
    EXPECTATIONS_DATA.client.forEach(item => defaults[item.id] = 'yes');
    EXPECTATIONS_DATA.safety.forEach(item => defaults[item.id] = 'yes');
    return defaults;
  });

  // 7. Photos
  const [hostPhoto, setHostPhoto] = useState<string | null>(null);
  const [chaletPhotos, setChaletPhotos] = useState<string[]>([]);

  // 7.5. Description
  const [descriptionData, setDescriptionData] = useState({
    title: 'Chalet Calme',
    subtitle: '',
    description: '',
    aboutChalet: '',
    hostAvailability: '',
    neighborhood: '',
    transport: '',
    otherInfo: ''
  });

  // 8. Reservation Mode & Stay Duration
  const [reservationMode, setReservationMode] = useState<'request' | 'instant'>('request');
  const [arrivalTime, setArrivalTime] = useState('17:00');
  const [departureTime, setDepartureTime] = useState('11:00');
  const [minAge, setMinAge] = useState("18");
  const [permissions, setPermissions] = useState<Record<string, 'yes' | 'no' | null>>({});

  // Stay Duration (Merged into Reservation Mode)
  const [minStay, setMinStay] = useState("1");
  const [maxStay, setMaxStay] = useState("Aucun maximum");
  const [advancedStaySettingsOpen, setAdvancedStaySettingsOpen] = useState(true);
  const [departureDays, setDepartureDays] = useState<Record<string, boolean>>({
    'Lun': true, 'Mar': true, 'Mer': true, 'Jeu': true, 'Ven': true, 'Sam': false, 'Dim': true
  });
  const [arrivalDays, setArrivalDays] = useState<Record<string, boolean>>({
    'Lun': true, 'Mar': true, 'Mer': true, 'Jeu': true, 'Ven': true, 'Sam': false, 'Dim': true
  });

  // 10. Pricing
  const [currency, setCurrency] = useState('CAD (C$)');
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

  // 12. Calendar & Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false); // New Block Modal
  const [activeTab, setActiveTab] = useState<'rates' | 'blocks'>('rates');
  
  // Rate Modal State
  const [rateModalMinStay, setRateModalMinStay] = useState("1");
  const [rateModalMaxStay, setRateModalMaxStay] = useState("Aucun maximum");
  const [rateModalNote, setRateModalNote] = useState("");

  // Block Modal State
  const [isBlockEnabled, setIsBlockEnabled] = useState(true);
  const [blockModalNote, setBlockModalNote] = useState("");

  // 13. Cancellation Policy
  const [cancellationPolicy, setCancellationPolicy] = useState('Flexible');

  // 14. Taxes & Laws
  const [taxRegistration, setTaxRegistration] = useState({
    type: 'CITQ',
    number: '',
    issueDate: { d: '1', m: 'Janvier', y: '2027' },
    expDate: { d: '1', m: 'Janvier', y: '2027' },
    taxesIncluded: null as boolean | null
  });

  // 15. Local Laws (New)
  const [acceptedLocalLaws, setAcceptedLocalLaws] = useState(false);

  // 16. Guest Arrival (New)
  const [guestArrival, setGuestArrival] = useState({
    internetSpeed: '',
    hasWifi: null as boolean | null,
    guideFile: null as string | null,
    instructions: '',
    checkinMethod: ''
  });

  // 17. Phone Number (New)
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [smsCode, setSmsCode] = useState('');

  // 18. Signature (New)
  const [signatureName, setSignatureName] = useState('');
  const [isSigned, setIsSigned] = useState(false);

  // -- MODAL STATE --
  const [editingItem, setEditingItem] = useState<{ item: Bedroom, type: 'bedroom' | 'openArea' } | null>(null);

  // -- HELPERS --
  const currentStepIndex = stepsList.indexOf(currentStep);
  const progressPercentage = ((currentStepIndex + 1) / stepsList.length) * 100;

  const getCurrentBigStep = () => {
    // Group 1: Base + Summary
    if ([
      'acceptance-condition', 'reservation-type', 'address-location', 
      'capacity-details', 'client-expectations', 'amenities', 'summary-review-1'
    ].includes(currentStep)) return 1;
    
    // Group 2: Environment (Photos, Description, Summary)
    if (['host-photo', 'chalet-photos', 'chalet-description', 'summary-review-2'].includes(currentStep)) return 2;
    
    // Group 3: Welcome (Permissions, Reservation, Pricing, Fees, Calendar, Policy, Laws, Local Laws, Guest Arrival, Phone, Review 3, Verification, Signature)
    return 3;
  };
  const currentBigStep = getCurrentBigStep();

  const bigSteps = [
    { number: 1, label: "Commencez par la base" },
    { number: 2, label: "Décrivez l'environnement" },
    { number: 3, label: "Préparez l'accueil des invités" }
  ];

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    
    // Handle Phone Step Modal Trigger
    if (currentStep === 'phone-number') {
      setIsSmsModalOpen(true);
      return;
    }

    if (nextIndex < stepsList.length) {
      changeStep(stepsList[nextIndex]);
      window.scrollTo(0, 0);
    } else {
      if (onCompleteOnboarding) onCompleteOnboarding();
      else toast.success("Inscription terminée !");
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      changeStep(stepsList[prevIndex]);
      window.scrollTo(0, 0);
    } else {
      onNavigate('logements');
    }
  };

  const jumpToStep = (step: Step) => {
    changeStep(step);
    window.scrollTo(0, 0);
  };

  // --- SUB-LOGIC ---
  const addBedroom = () => {
    const newId = (bedrooms.length + 1).toString();
    setBedrooms([...bedrooms, {
      id: newId,
      name: `Chambre #${newId}`,
      beds: { simple: 0, double: 0, queen: 0, king: 0, simple_bunk: 0, double_bunk: 0, queen_bunk: 0, king_bunk: 0, sofa_bed: 0, other: 0 }
    }]);
  };

  const addOpenArea = () => {
    const newId = `oa-${openAreas.length + 1}`;
    setOpenAreas([...openAreas, {
      id: newId,
      name: `Aire ouverte #${openAreas.length + 1}`,
      beds: { simple: 0, double: 0, queen: 0, king: 0, simple_bunk: 0, double_bunk: 0, queen_bunk: 0, king_bunk: 0, sofa_bed: 0, other: 0 }
    }]);
  };

  const removeBedroom = () => {
    if (bedrooms.length > 0) setBedrooms(bedrooms.slice(0, -1));
  };

  const removeOpenArea = () => {
    if (openAreas.length > 0) setOpenAreas(openAreas.slice(0, -1));
  };

  const updateItem = (updatedItem: Bedroom, type: 'bedroom' | 'openArea') => {
    if (type === 'bedroom') {
      setBedrooms(bedrooms.map(b => b.id === updatedItem.id ? updatedItem : b));
    } else {
      setOpenAreas(openAreas.map(b => b.id === updatedItem.id ? updatedItem : b));
    }
  };

  const handleBedCountChange = (bedType: keyof Bedroom['beds'], change: number) => {
    if (!editingItem) return;
    const currentCount = editingItem.item.beds[bedType];
    const newCount = Math.max(0, currentCount + change);
    setEditingItem({
      ...editingItem,
      item: {
        ...editingItem.item,
        beds: {
          ...editingItem.item.beds,
          [bedType]: newCount
        }
      }
    });
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSection = (section: string) => {
    setExpandedAmenities(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const setExpectationValue = (id: string, value: 'yes' | 'no') => {
    setExpectations(prev => ({ ...prev, [id]: value }));
  };

  const setPermissionValue = (id: string, value: 'yes' | 'no') => {
    setPermissions(prev => ({ ...prev, [id]: value }));
  };

  const handleHostPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHostPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChaletPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          if (newPhotos.length === files.length) {
            setChaletPhotos(prev => [...prev, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 'acceptance-condition' && !acceptedConditions) return true;
    if (currentStep === 'reservation-type' && (!rentalFrequency || !spaceType)) return true;
    if (currentStep === 'local-laws' && !acceptedLocalLaws) return true;
    if (currentStep === 'guest-arrival' && (!guestArrival.internetSpeed || guestArrival.hasWifi === null || !guestArrival.checkinMethod)) return true;
    if (currentStep === 'phone-number' && !phoneNumber) return true;
    if (currentStep === 'signature' && (!signatureName || !isSigned)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50 h-20 border-b border-gray-100 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
        </div>
        
        <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2 space-x-4">
          {bigSteps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center gap-2 ${currentBigStep >= step.number ? 'opacity-100' : 'opacity-40'}`}>
                {currentBigStep > step.number ? (
                   <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                     <Check className="w-4 h-4 text-white" />
                   </div>
                ) : (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentBigStep === step.number ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number}
                  </div>
                )}
                <span className="text-sm font-medium text-[#222222] whitespace-nowrap">{step.label}</span>
              </div>
              {index < bigSteps.length - 1 && (
                 <ChevronRight className="w-4 h-4 text-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="px-4 py-2 text-sm font-medium text-[#222222] border border-gray-200 rounded-full hover:bg-gray-50 transition-colors hidden sm:block"
            onClick={() => onNavigate('logements')}
          >
            <span className="mr-2">✓</span>
            Enregistrer et quitter
          </button>
          <button className="text-sm font-medium text-[#222222]">En</button>
        </div>

        <div className="absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }} />
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-32 pb-40 px-6 md:px-12 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
        
        {currentStep === 'acceptance-condition' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-[#222222]">
                Important: Conditions d'acceptation de votre logement
              </h1>
              <h2 className="text-xl font-semibold text-[#222222] underline decoration-2 underline-offset-4">
                82% des demandes d'inscription sont refusées en raison de nos normes de gestion.
              </h2>
              <div className="space-y-4 text-[#717171] text-base leading-relaxed">
                <p>Avant de commencer votre processus d'inscription, lire la note suivante.</p>
                <p>Depuis 2015, HOMIQIO s'engage à améliorer les normes de gestion et la qualité des produits proposés.</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Des propriétaires sérieux, engagés à fournir un service de qualité.</li>
                  <li>Une propriété unique et distinguée.</li>
                  <li>Des photographies de haute qualité prises par un professionnel.</li>
                </ul>
                <p>Si vous avez des doutes, contactez-nous à <a href="mailto:info@homiqio.com" className="underline">info@homiqio.com</a>.</p>
              </div>
            </div>
            <div className="pt-8">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div 
                  className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                    acceptedConditions ? 'bg-black border-black' : 'border-gray-300 bg-white group-hover:border-black'
                  }`}
                  onClick={(e) => { e.preventDefault(); setAcceptedConditions(!acceptedConditions); }}
                >
                  {acceptedConditions && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </div>
                <div className="select-none" onClick={() => setAcceptedConditions(!acceptedConditions)}>
                  <span className="text-[#222222] font-medium italic">Je comprends que ma propriété peut potentiellement être refusée</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {currentStep === 'reservation-type' && (
          <div className="max-w-4xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-[#222222]">Type de réservation</h1>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#222222]">À quelle fréquence louerez-vous votre logement ?</h3>
              <div className="space-y-3">
                {[
                  { id: 'occasional', label: "C'est un logement privé que je loue occasionnellement" },
                  { id: 'dedicated', label: "C'est un logement exclusivement dédié à la location" }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                        rentalFrequency === opt.id ? 'border-black' : 'border-gray-300 group-hover:border-black'
                      }`}
                      onClick={() => setRentalFrequency(opt.id as any)}
                    >
                       {rentalFrequency === opt.id && <div className="w-3 h-3 bg-black rounded-full" />}
                    </div>
                    <span className="text-[#717171] group-hover:text-[#222222] transition-colors">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="w-16 h-px bg-gray-200" />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#222222]">Qu'offrez-vous aux invités ?</h3>
              <div className="space-y-6">
                {[
                  { id: 'entire', label: 'Logement entier', desc: "Les voyageurs disposent du logement dans son intégralité." },
                  { id: 'private', label: 'Chambre privée', desc: "Les invités ont leur propre chambre privée pour dormir." },
                  { id: 'shared', label: 'Chambre partagée', desc: "Les invités dorment dans une chambre partagée." }
                ].map(opt => (
                  <div key={opt.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => setSpaceType(opt.id as any)}>
                    <div 
                      className={`w-5 h-5 mt-1 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                        spaceType === opt.id ? 'border-black' : 'border-gray-300 group-hover:border-black'
                      }`}
                    >
                       {spaceType === opt.id && <div className="w-3 h-3 bg-black rounded-full" />}
                    </div>
                    <div>
                      <span className="block text-[#222222] font-medium mb-1 group-hover:text-black">{opt.label}</span>
                      <span className="block text-[#717171] text-sm leading-relaxed">{opt.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 'address-location' && (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="flex-1 space-y-8">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-[#222222]">Saisir votre adresse</h1>
                <p className="text-[#717171]">Seuls les voyageurs qui disposent d'une réservation confirmée pourront voir votre adresse.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#222222]">Ville *</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="Ville" value={addressData.city} onChange={e => setAddressData({...addressData, city: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#222222]">Adresse *</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="Adresse" value={addressData.address} onChange={e => setAddressData({...addressData, address: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#222222]">Code postal *</label>
                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="Code postal" value={addressData.postalCode} onChange={e => setAddressData({...addressData, postalCode: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#222222]">MRC (Optionnel)</label>
                    <div className="relative">
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black appearance-none bg-white"><option value="">-</option></select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#222222]">Comté (Optionnel)</label>
                  <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="Comté" value={addressData.county} onChange={e => setAddressData({...addressData, county: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#222222]">Province / État</label>
                    <div className="relative">
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black appearance-none bg-white" value={addressData.province} onChange={e => setAddressData({...addressData, province: e.target.value})}>
                        <option value="QC">Québec</option>
                        <option value="ON">Ontario</option>
                        <option value="NB">Nouveau-Brunswick</option>
                        <option value="Other">Autre</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#222222]">Pays</label>
                    <div className="relative">
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black appearance-none bg-white" value={addressData.country} onChange={e => setAddressData({...addressData, country: e.target.value})}>
                        <option value="CA">Canada</option>
                        <option value="US">États-Unis</option>
                        <option value="FR">France</option>
                        <option value="Other">Autre</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
               <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200">
                  <MockMap />
               </div>
            </div>
          </div>
        )}

        {currentStep === 'capacity-details' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <h1 className="text-2xl font-bold text-[#222222]">Capacité d'accueil du chalet</h1>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#222222]">Capacité d'accueil *</label>
                  <div className="relative">
                    <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white" value={capacityData.capacity} onChange={(e) => setCapacityData({...capacityData, capacity: parseInt(e.target.value)})}>
                      {[...Array(20)].map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#222222]">Nombre maximum d'adultes *</label>
                  <div className="relative">
                    <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white" value={capacityData.adults} onChange={(e) => setCapacityData({...capacityData, adults: parseInt(e.target.value)})}>
                      {[...Array(20)].map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#222222]">Salles de bain *</label>
                  <div className="relative">
                    <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white" value={capacityData.bathrooms} onChange={(e) => setCapacityData({...capacityData, bathrooms: parseInt(e.target.value)})}>
                      {[...Array(10)].map((_, i) => <option key={i} value={i+1}>{i+1}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-[#222222] font-medium">Chambres à coucher</span>
                  <div className="flex items-center gap-4">
                    <button onClick={removeBedroom} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"><Minus className="w-4 h-4" /></button>
                    <span className="text-base font-medium w-6 text-center">{bedrooms.length}</span>
                    <button onClick={addBedroom} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="space-y-3">
                  {bedrooms.map((bedroom) => (
                    <div key={bedroom.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[#222222]">{bedroom.name}</h3>
                        <p className="text-sm text-[#717171]">{Object.values(bedroom.beds).some(v => v > 0) ? 'Lits configurés' : 'Aucun lit configuré'}</p>
                      </div>
                      <button onClick={() => setEditingItem({ item: bedroom, type: 'bedroom' })} className="flex items-center gap-2 text-sm font-medium hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><Pencil className="w-4 h-4" /> Modifier</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-[#222222] font-medium">Chambres à aire ouverte</span>
                  <div className="flex items-center gap-4">
                    <button onClick={removeOpenArea} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"><Minus className="w-4 h-4" /></button>
                    <span className="text-base font-medium w-6 text-center">{openAreas.length}</span>
                    <button onClick={addOpenArea} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="space-y-3">
                  {openAreas.map((area) => (
                    <div key={area.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[#222222]">{area.name}</h3>
                        <p className="text-sm text-[#717171]">{Object.values(area.beds).some(v => v > 0) ? 'Lits configurés' : 'Aucun lit configuré'}</p>
                      </div>
                      <button onClick={() => setEditingItem({ item: area, type: 'openArea' })} className="flex items-center gap-2 text-sm font-medium hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><Pencil className="w-4 h-4" /> Modifier</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'client-expectations' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-[#222222] mb-8 text-center">Attentes du client et sécurité</h1>
            <div className="space-y-6">
               {EXPECTATIONS_DATA.client.map((item) => (
                 <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-4">
                   <span className="text-[#222222]">{item.label}</span>
                   <div className="flex items-center gap-4">
                     <button 
                       onClick={() => setExpectationValue(item.id, 'yes')} 
                       className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                         expectations[item.id] === 'yes' ? 'bg-black border-black text-white' : 'border-gray-300 bg-white text-gray-300'
                       }`}
                     >
                       <Check className="w-5 h-5" />
                     </button>
                     <button 
                       onClick={() => setExpectationValue(item.id, 'no')} 
                       className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                         expectations[item.id] === 'no' ? 'bg-red-500 border-red-500 text-white' : 'border-red-200 text-red-500 bg-white'
                       }`}
                     >
                       <X className="w-5 h-5" />
                     </button>
                   </div>
                 </div>
               ))}
            </div>
            <div className="w-full h-px bg-gray-100" />
            <div className="space-y-6">
               {EXPECTATIONS_DATA.safety.map((item) => (
                 <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-4">
                   <span className="text-[#222222]">{item.label}</span>
                   <div className="flex items-center gap-4">
                     <button 
                       onClick={() => setExpectationValue(item.id, 'yes')} 
                       className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                         expectations[item.id] === 'yes' ? 'bg-black border-black text-white' : 'border-gray-300 bg-white text-gray-300'
                       }`}
                     >
                       <Check className="w-5 h-5" />
                     </button>
                     <button 
                       onClick={() => setExpectationValue(item.id, 'no')} 
                       className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                         expectations[item.id] === 'no' ? 'bg-red-500 border-red-500 text-white' : 'border-red-200 text-red-500 bg-white'
                       }`}
                     >
                       <X className="w-5 h-5" />
                     </button>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {currentStep === 'amenities' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-[#222222] mb-6">Commodités</h1>
            <div className="space-y-6">
              {Object.entries(AMENITIES_DATA).map(([section, items]) => (
                <div key={section} className="border-b border-gray-100 pb-6">
                   <button onClick={() => toggleSection(section)} className="flex items-center justify-between w-full py-2">
                     <h3 className="text-lg font-bold text-[#222222]">{section}</h3>
                     <ChevronDown className={`w-5 h-5 text-gray-500 ${expandedAmenities[section] ? 'rotate-180' : ''}`} />
                   </button>
                   {expandedAmenities[section] && (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 mt-4">
                        {items.map((amenity) => (
                          <label key={amenity.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleAmenity(amenity.id)}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selectedAmenities.includes(amenity.id) ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}>
                              {selectedAmenities.includes(amenity.id) && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div className="flex items-center gap-2">
                              <amenity.icon className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" />
                              <span className="text-sm">{amenity.label}</span>
                            </div>
                          </label>
                        ))}
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'summary-review-1' && (
          <div className="max-w-6xl mx-auto">
             <div className="flex flex-col lg:flex-row gap-16 items-start">
               <div className="flex-1 w-full space-y-8">
                 <h1 className="text-3xl font-bold text-[#222222]">Vous y êtes presque!</h1>
                 
                 <div className="space-y-4">
                    {/* Stage 1 - Expanded */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                       <div className="p-6 flex items-center justify-between border-b border-gray-100">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-[#222222] font-bold text-lg bg-white">1</div>
                             <div>
                                <h3 className="font-bold text-[#222222]">Commencez par la base</h3>
                                <p className="text-sm text-gray-500">Lits, salles de bain, commodités...</p>
                             </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                             <Check className="w-5 h-5 text-white" />
                          </div>
                       </div>
                       <div className="bg-white">
                          {[
                            { label: "Type de réservation", step: 'reservation-type' },
                            { label: "Saisir votre adresse", step: 'address-location' },
                            { label: "Capacité d'accueil du chalet", step: 'capacity-details' },
                            { label: "Attentes des invités et sécurité", step: 'client-expectations' },
                            { label: "Commodités", step: 'amenities' }
                          ].map((item, idx) => (
                             <div key={idx} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                <span className="text-[#222222] font-medium text-sm">{item.label}</span>
                                <button onClick={() => jumpToStep(item.step as Step)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                   <Pencil className="w-4 h-4 text-gray-500" />
                                </button>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Stage 2 - Next */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-[#222222] font-bold text-lg">2</div>
                          <div>
                             <h3 className="font-bold text-[#222222]">Décrivez l'environnement</h3>
                             <p className="text-sm text-gray-500">Décrivez l'environnement</p>
                          </div>
                       </div>
                    </div>

                    {/* Stage 3 - Locked */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between opacity-50">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 font-bold text-lg">3</div>
                          <div>
                             <h3 className="font-bold text-gray-400">Préparez l'accueil des invités</h3>
                             <p className="text-sm text-gray-400">Préparez l'accueil des invités</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8">
                   <button onClick={handleNext} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity">
                     Continuer
                   </button>
                 </div>
               </div>
               <div className="flex-1 w-full lg:h-[700px] rounded-2xl overflow-hidden shadow-lg hidden lg:block sticky top-32">
                 <img src={summaryChaletImg} className="w-full h-full object-cover" />
               </div>
             </div>
          </div>
        )}

        {currentStep === 'host-photo' && (
          <div className="max-w-2xl mx-auto space-y-10">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-[#222222]">Ajoutez une photo de vous</h1>
              <p className="text-[#717171] max-w-lg mx-auto">
                Assurez-vous que votre photo montre clairement votre visage, afin que les voyageurs puissent facilement vous identifier en tant qu’hôte.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                   {hostPhoto ? (
                     <img src={hostPhoto} alt="Host" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-10 h-10 text-gray-400" />
                   )}
                </div>
                <label className="cursor-pointer">
                   <div className="flex items-center gap-2 px-6 py-3 bg-white border border-black rounded-full hover:bg-gray-50 transition-colors shadow-sm">
                     <Upload className="w-4 h-4" />
                     <span className="font-medium">Ajouter une photo</span>
                   </div>
                   <input type="file" className="hidden" accept="image/*" onChange={handleHostPhotoUpload} />
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'chalet-photos' && (
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-[#222222]">Photos du chalet</h1>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-[#222222] mb-1">Astuces pour les photos</h3>
                  <p className="text-sm text-gray-500">Nous vous suggérons de télécharger au moins 5 photos des différentes pièces et espaces à l'intérieur et à l'extérieur du chalet.</p>
                </div>
                <div>
                  <h3 className="font-bold text-[#222222] mb-1">Quels types de photos dois-je télécharger?</h3>
                  <p className="text-sm text-gray-500">Veuillez télécharger au moins une photo de chaque pièce du chalet, y compris le salon, la cuisine, les chambre(s), les salle(s) de bains, l’extérieur et les environs.</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div key={index} className="w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden group border border-gray-200">
                     {chaletPhotos[index] ? (
                       <>
                         <img src={chaletPhotos[index]} alt={`Chalet ${index + 1}`} className="w-full h-full object-cover" />
                         <button 
                            onClick={() => {
                              const newPhotos = [...chaletPhotos];
                              newPhotos.splice(index, 1);
                              setChaletPhotos(newPhotos);
                            }}
                            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                           <X className="w-3 h-3" />
                         </button>
                       </>
                     ) : (
                       <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center">
                         <Plus className="w-4 h-4 text-black" />
                       </div>
                     )}
                  </div>
                ))}
              </div>

              <div className="relative cursor-pointer group">
                 <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" multiple accept=".png, .jpg, .jpeg, .webp" onChange={handleChaletPhotoUpload} />
                 <div className="text-center">
                   <p className="text-[#222222] font-medium text-sm group-hover:underline">Faites glisser vos images ici, ou <span className="underline">Parcourir</span></p>
                   <p className="text-gray-400 text-xs mt-1">Formats acceptés: PNG, JPG, WEBP</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'chalet-description' && (
          <div className="max-w-3xl mx-auto space-y-10">
             <h1 className="text-3xl font-bold text-[#222222] text-center mb-8">Description du chalet</h1>
             
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="block text-sm font-bold text-[#222222]">Titre de l'annonce *</label>
                   <input 
                      type="text" 
                      value={descriptionData.title}
                      onChange={(e) => setDescriptionData({...descriptionData, title: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                   />
                   <div className="flex items-start gap-2 text-gray-500 text-xs">
                     <Info className="w-3 h-3 mt-0.5" />
                     <p>Astuce: Suscitez l'intérêt des voyageurs avec un titre accrocheur qui souligne ce qui rend votre chalet unique.</p>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="block text-sm font-bold text-[#222222]">Sous-titre descriptif de l'annonce <span className="text-gray-400 font-normal">(Optionnel)</span></label>
                   <input 
                      type="text" 
                      placeholder="Sous-titre descriptif de l'annonce"
                      value={descriptionData.subtitle}
                      onChange={(e) => setDescriptionData({...descriptionData, subtitle: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                   />
                   <div className="flex items-start gap-2 text-gray-500 text-xs">
                     <Info className="w-3 h-3 mt-0.5" />
                     <p>Astuce: Décrivez les principaux atouts de votre chalet afin d'attirer l'attention des voyageurs.</p>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="block text-sm font-bold text-[#222222]">Description *</label>
                   <textarea 
                      value={descriptionData.description}
                      onChange={(e) => setDescriptionData({...descriptionData, description: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[150px]"
                   />
                   <div className="flex items-start gap-2 text-gray-500 text-xs">
                     <Info className="w-3 h-3 mt-0.5" />
                     <p>Conseil: Rédigez une courte description qui présente votre chalet, les activités à proximité et le village dans lequel il se trouve.</p>
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                   <h3 className="font-bold text-gray-500 text-sm uppercase">Ajoutez des informations supplémentaires sur votre chalet (Optionnel)</h3>
                   
                   <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#222222]">Le chalet</label>
                      <textarea 
                         value={descriptionData.aboutChalet}
                         onChange={(e) => setDescriptionData({...descriptionData, aboutChalet: e.target.value})}
                         placeholder="Tapez ici..."
                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[100px]"
                      />
                      <div className="flex items-start gap-2 text-gray-500 text-xs">
                        <Info className="w-3 h-3 mt-0.5" />
                        <p>Conseil: Incluez tout autre détail qui peut aider les invités à définir leurs attentes pour leur séjour.</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#222222]">Disponibilités de l'hôte</label>
                      <textarea 
                         value={descriptionData.hostAvailability}
                         onChange={(e) => setDescriptionData({...descriptionData, hostAvailability: e.target.value})}
                         placeholder="Tapez ici..."
                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[100px]"
                      />
                      <div className="flex items-start gap-2 text-gray-500 text-xs">
                        <Info className="w-3 h-3 mt-0.5" />
                        <p>Conseil: Informez les invités de votre disponibilité pendant leur séjour. Pour votre sécurité, ne communiquez pas votre numéro de téléphone ou votre adresse électronique avant d'avoir confirmé une réservation.</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#222222]">Le quartier</label>
                      <textarea 
                         value={descriptionData.neighborhood}
                         onChange={(e) => setDescriptionData({...descriptionData, neighborhood: e.target.value})}
                         placeholder="Tapez ici..."
                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[100px]"
                      />
                      <div className="flex items-start gap-2 text-gray-500 text-xs">
                        <Info className="w-3 h-3 mt-0.5" />
                        <p>Conseil: Présentez ce qui rend votre quartier unique, comme votre café, votre parc préféré ou d'autres lieux qui peuvent susciter l'intérêt des touristes.</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#222222]">Transport</label>
                      <textarea 
                         value={descriptionData.transport}
                         onChange={(e) => setDescriptionData({...descriptionData, transport: e.target.value})}
                         placeholder="Tapez ici..."
                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[100px]"
                      />
                      <div className="flex items-start gap-2 text-gray-500 text-xs">
                        <Info className="w-3 h-3 mt-0.5" />
                        <p>Conseil: Indiquez aux invités ce qu'ils doivent savoir sur votre quartier, comme les moyens de transport courants à proximité, les conseils en matière de circulation ou les itinéraires à faire à pied.</p>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#222222]">Autres informations pertinentes</label>
                      <textarea 
                         value={descriptionData.otherInfo}
                         onChange={(e) => setDescriptionData({...descriptionData, otherInfo: e.target.value})}
                         placeholder="Tapez ici..."
                         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[100px]"
                      />
                   </div>
                </div>
             </div>
          </div>
        )}

        {currentStep === 'summary-review-2' && (
          <div className="max-w-6xl mx-auto">
             <div className="flex flex-col lg:flex-row gap-16 items-start">
               <div className="flex-1 w-full space-y-8">
                 <h1 className="text-3xl font-bold text-[#222222]">Vous y êtes presque!</h1>
                 
                 <div className="space-y-4">
                    {/* Stage 1 - Completed/Collapsed */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">1</div>
                          <div>
                             <h3 className="font-bold text-[#222222]">Commencez par la base</h3>
                          </div>
                       </div>
                       <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                       </div>
                    </div>

                    {/* Stage 2 - Expanded */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                       <div className="p-6 flex items-center justify-between border-b border-gray-100">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-[#222222] font-bold text-lg bg-white">2</div>
                             <div>
                                <h3 className="font-bold text-[#222222]">Décrivez l'environnement</h3>
                                <p className="text-sm text-gray-500">Décrivez l'environnement</p>
                             </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                             <Check className="w-5 h-5 text-white" />
                          </div>
                       </div>
                       <div className="bg-white">
                          {[
                            { label: "Photo de l'hôte", step: 'host-photo' },
                            { label: "Photos du chalet", step: 'chalet-photos' },
                            { label: "Description du chalet", step: 'chalet-description' }
                          ].map((item, idx) => (
                             <div key={idx} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                <span className="text-[#222222] font-medium text-sm">{item.label}</span>
                                <button onClick={() => jumpToStep(item.step as Step)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                   <Pencil className="w-4 h-4 text-gray-500" />
                                </button>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Stage 3 - Next/Locked */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-[#222222] font-bold text-lg">3</div>
                          <div>
                             <h3 className="font-bold text-[#222222]">Préparez l'accueil des invités</h3>
                             <p className="text-sm text-gray-500">Préparez l'accueil des invités</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8">
                   <button onClick={handleNext} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity">
                     Continuer
                   </button>
                 </div>
               </div>
               <div className="flex-1 w-full lg:h-[700px] rounded-2xl overflow-hidden shadow-lg hidden lg:block sticky top-32">
                 <img src={summaryChaletImg} className="w-full h-full object-cover" />
               </div>
             </div>
          </div>
        )}

        {currentStep === 'permissions' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-[#222222]">Permissions</h1>
            <div className="space-y-6">
              {PERMISSIONS_DATA.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <span className="text-[#222222]">{item.label}</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setPermissionValue(item.id, 'yes')} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        permissions[item.id] === 'yes' ? 'bg-black border-black text-white ring-2 ring-black ring-offset-2' : 'border-gray-300 bg-white'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setPermissionValue(item.id, 'no')} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        permissions[item.id] === 'no' ? 'bg-red-500 border-red-500 text-white ring-2 ring-red-500 ring-offset-2' : 'border-red-200 text-red-500 bg-white'
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="flex items-center justify-between border-b border-gray-50 pb-4 pt-2">
                 <span className="text-[#222222] font-medium">Age minimum pour louer</span>
                 <div className="relative w-24">
                   <select 
                     value={minAge} 
                     onChange={(e) => setMinAge(e.target.value)} 
                     className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white text-center font-medium focus:outline-none focus:border-black"
                   >
                     {[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(age => (
                       <option key={age} value={age}>{age} ans</option>
                     ))}
                   </select>
                   <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                 </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'reservation-mode' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-[#222222]">Définissez le mode de réservation</h1>
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#222222]">Indiquez aux invités comment réserver votre chalet</h3>
              <div className="space-y-4">
                <label className="flex items-start gap-4 cursor-pointer group">
                  <div className="mt-1 relative">
                    <input type="radio" name="reservationMode" className="peer sr-only" checked={reservationMode === 'request'} onChange={() => setReservationMode('request')} />
                    <div className="w-5 h-5 rounded-full border border-gray-300 peer-checked:border-black peer-checked:border-[6px] transition-all" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1"><span className="font-medium text-[#222222]">Demande de réservation</span><Info className="w-4 h-4 text-gray-400" /></div>
                    <p className="text-[#717171] text-sm leading-relaxed">Les locations seront approuvées par l'équipe de HOMIQIO. Il est essentiel de maintenir vos calendriers de disponibilité à jour en tout temps.</p>
                  </div>
                </label>
                <label className="flex items-start gap-4 cursor-pointer group opacity-75">
                  <div className="mt-1 relative">
                    <input type="radio" name="reservationMode" className="peer sr-only" checked={reservationMode === 'instant'} onChange={() => setReservationMode('instant')} />
                    <div className="w-5 h-5 rounded-full border border-gray-300 peer-checked:border-black peer-checked:border-[6px] transition-all" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1"><span className="font-medium text-[#222222]">Réservation instantanée</span><span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">À venir</span></div>
                    <p className="text-[#717171] text-sm leading-relaxed">Vous pourrez louer votre chalet de façon instantanée, sans avoir à répondre à chaque demande individuelle.</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="w-full h-px bg-gray-100" />
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#222222]">Indiquez aux invités l'heure d'arrivée et de départ</h3>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#222222]">Heure d'arrivée</label>
                  <div className="relative">
                    <select value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
                      {['15:00', '16:00', '17:00', '18:00', '19:00'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#222222]">Heure de départ</label>
                  <div className="relative">
                    <select value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
                      {['10:00', '11:00', '12:00', '13:00'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-px bg-gray-100" />
            <div className="space-y-8">
               <h2 className="text-lg font-bold text-[#222222]">Durée du séjour</h2>
               <div className="space-y-2">
                 <label className="block text-xs font-medium text-gray-500 uppercase">Durée minimum d'un séjour</label>
                 <div className="relative">
                    <select value={minStay} onChange={(e) => setMinStay(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
                      {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="block text-xs font-medium text-gray-500 uppercase">Durée maximale d'un séjour</label>
                 <div className="relative">
                    <select value={maxStay} onChange={(e) => setMaxStay(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
                      <option value="Aucun maximum">Aucun maximum</option>
                      {[7, 14, 28].map(n => <option key={n} value={n}>{n} jours</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                 </div>
               </div>
               <div className="pt-4 border-t border-gray-100">
                  <button onClick={() => setAdvancedStaySettingsOpen(!advancedStaySettingsOpen)} className="flex items-center justify-between w-full py-2">
                    <span className="font-medium text-[#222222]">Paramètres avancés</span>
                    {advancedStaySettingsOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                  </button>
                  {advancedStaySettingsOpen && (
                    <div className="pt-6 space-y-8 animate-in slide-in-from-top-2 duration-200">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2"><label className="text-sm font-medium text-[#222222]">Sélectionnez les jours de départ</label><HelpCircle className="w-4 h-4 text-gray-400" /></div>
                        <div className="flex flex-wrap gap-2">{DAYS_OF_WEEK.map((day) => (<label key={day} className="flex flex-col items-center gap-2 cursor-pointer"><span className="text-sm text-gray-500">{day}</span><div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${departureDays[day] ? 'bg-black border-black' : 'border-gray-300 bg-white'}`} onClick={() => setDepartureDays(prev => ({ ...prev, [day]: !prev[day] }))}>{departureDays[day] && <Check className="w-4 h-4 text-white" />}</div></label>))}</div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2"><label className="text-sm font-medium text-[#222222]">Sélectionnez les jours d'arrivée</label><HelpCircle className="w-4 h-4 text-gray-400" /></div>
                        <div className="flex flex-wrap gap-2">{DAYS_OF_WEEK.map((day) => (<label key={day} className="flex flex-col items-center gap-2 cursor-pointer"><span className="text-sm text-gray-500">{day}</span><div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${arrivalDays[day] ? 'bg-black border-black' : 'border-gray-300 bg-white'}`} onClick={() => setArrivalDays(prev => ({ ...prev, [day]: !prev[day] }))}>{arrivalDays[day] && <Check className="w-4 h-4 text-white" />}</div></label>))}</div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-2"><label className="text-sm font-medium text-[#222222]">Durée minimale du séjour en fonction du jour</label><HelpCircle className="w-4 h-4 text-gray-400" /></div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{['Lundi', 'Mardi', 'Mercredi'].map(day => (<div key={day} className="space-y-2"><label className="text-xs font-medium text-gray-500">{day}</label><div className="relative"><select className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white"><option>-</option>{[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}</select><ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" /></div></div>))}</div>
                      </div>
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {currentStep === 'pricing' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-[#222222] text-center mb-8">Définissez vos prix</h1>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#222222]">Sélectionnez la devise monétaire de votre pays *</label>
                <div className="relative">
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
                    <option value="CAD (C$)">CAD (C$)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500">Choisissez une devise pour indiquer vos prix</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#222222]">Tarif de base *</label>
                  <input type="text" value={pricing.base} onChange={(e) => setPricing({...pricing, base: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="0" />
                  <p className="text-xs text-gray-500">Ce prix sera le tarif par défaut pour chaque nuit.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#222222]">Tarif d'une nuit de week-end</label>
                  <input type="text" value={pricing.weekend} onChange={(e) => setPricing({...pricing, weekend: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="CAD (C$)" />
                  <p className="text-xs text-gray-500">Ce prix sera le prix par défaut pour le week-end.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#222222]">Tarif hebdomadaire</label>
                  <input type="text" value={pricing.weekly} onChange={(e) => setPricing({...pricing, weekly: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="CAD (C$)" />
                  <p className="text-xs text-gray-500">Ce prix sera le tarif par défaut pour une période de 7 jours.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#222222]">Tarif mensuel</label>
                  <input type="text" value={pricing.monthly} onChange={(e) => setPricing({...pricing, monthly: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="CAD (C$)" />
                  <p className="text-xs text-gray-500">Ce prix sera le tarif appliqué pour des périodes de 28 jours.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'fees' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-[#222222] text-center mb-8">Ajoutez des frais de base</h1>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2"><label className="block text-sm font-bold text-[#222222]">Frais de nettoyage</label><HelpCircle className="w-4 h-4 text-gray-400" /></div>
                <input type="text" value={fees.cleaning} onChange={(e) => setFees({...fees, cleaning: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2"><label className="block text-sm font-bold text-[#222222]">Dépôt de sécurité</label><HelpCircle className="w-4 h-4 text-gray-400" /></div>
                <input type="text" value={fees.security} onChange={(e) => setFees({...fees, security: e.target.value})} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
              </div>
              <div className="border-t border-gray-100 pt-6">
                <button onClick={() => setExtraGuestFeeOpen(!extraGuestFeeOpen)} className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-[#222222]">Frais pour invité supplémentaire <span className="text-gray-400 font-normal">(Optionnel)</span></span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${extraGuestFeeOpen ? 'rotate-180' : ''}`} />
                </button>
                {extraGuestFeeOpen && (
                  <div className="mt-4 pl-4 animate-in slide-in-from-top-2">
                     <div className="space-y-2 max-w-xs"><label className="text-sm font-medium">Frais par invité</label><input type="text" placeholder="CAD (C$)" value={extraGuestFee} onChange={(e) => setExtraGuestFee(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" /></div>
                  </div>
                )}
              </div>
              <div>
                <button onClick={() => setPetFeeOpen(!petFeeOpen)} className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-[#222222]">Frais pour animaux <span className="text-gray-400 font-normal">(Optionnel)</span></span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${petFeeOpen ? 'rotate-180' : ''}`} />
                </button>
                {petFeeOpen && (
                  <div className="mt-4 pl-4 animate-in slide-in-from-top-2">
                     <div className="space-y-2 max-w-xs"><label className="text-sm font-medium">Frais par animal</label><input type="text" placeholder="CAD (C$)" value={petFee} onChange={(e) => setPetFee(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" /></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- CALENDAR STEP --- */}
        {currentStep === 'calendar' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-[#FFF8E6] border border-[#FFE0B2] p-4 rounded-lg flex items-center gap-3">
              <div className="p-1 bg-[#FF9800] rounded text-white"><CalendarIcon className="w-4 h-4" /></div>
              <span className="text-[#B7791F] font-semibold text-sm">Un hébergement réussi commence avec un calendrier à jour</span>
            </div>

            <div className="text-sm text-[#717171] leading-relaxed max-w-3xl">
              Votre calendrier est votre meilleur allié pour assurer à vos invités la meilleure expérience possible. Assurez-vous que votre calendrier demeure à jour afin de recevoir des demandes de réservation uniquement lorsque votre chalet est disponible. Annuler un séjour à la dernière minute entraîne des pénalités.
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#222222]">Calendrier externe iCals</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50"><Upload className="w-4 h-4" /> Exporter</button>
                  <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"><Plus className="w-4 h-4" /> Ajouter</button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg py-8 text-center border border-gray-100 text-sm text-[#717171]">
                Aucun iCal externe n'a encore été ajouté
              </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
               <span className="flex items-center gap-1 text-sm font-semibold text-[#B7791F] whitespace-nowrap"><Sparkles className="w-4 h-4" /> Périodes automatiques</span>
               {['Hiver', 'Semaine de relâche', 'Printemps', 'Pâques', 'Fête de la reine', 'Été', 'Semaines de la construction', 'Haute saison - Été', 'Automne', 'Fête du travail'].map((period) => (
                 <button key={period} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-black whitespace-nowrap shadow-sm flex items-center gap-2">
                   {period} <span className="text-xs">🔥</span>
                 </button>
               ))}
               <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0"><ChevronRight className="w-4 h-4" /></button>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col lg:flex-row h-[600px]">
               <div className="w-full lg:w-72 border-r border-gray-200 bg-white flex flex-col">
                  <div className="flex border-b border-gray-200">
                    <button 
                      onClick={() => setActiveTab('rates')}
                      className={`flex-1 py-4 text-sm font-medium text-center relative ${activeTab === 'rates' ? 'text-black' : 'text-gray-500'}`}
                    >
                      Tarifs spécifiques
                      {activeTab === 'rates' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
                    </button>
                    <button 
                      onClick={() => setActiveTab('blocks')}
                      className={`flex-1 py-4 text-sm font-medium text-center relative ${activeTab === 'blocks' ? 'text-black' : 'text-gray-500'}`}
                    >
                      Blocages
                      {activeTab === 'blocks' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
                    </button>
                  </div>
                  
                  {activeTab === 'rates' && (
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl text-[#222222]">Tarifs spécifiques</h3>
                        <button 
                           onClick={() => setIsRateModalOpen(true)}
                           className="text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50"
                        >
                          + Ajouter
                        </button>
                      </div>
                      <div className="text-sm text-gray-500 italic">Aucun tarif spécifique ajouté</div>
                    </div>
                  )}

                  {activeTab === 'blocks' && (
                    <div className="p-6 flex-1 flex flex-col">
                       <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl text-[#222222]">Blocages</h3>
                        <button 
                           onClick={() => setIsBlockModalOpen(true)}
                           className="text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50"
                        >
                          + Ajouter
                        </button>
                      </div>
                       <div className="text-sm text-gray-500 italic">Aucun blocage de période ajouté</div>
                    </div>
                  )}
               </div>

               <div className="flex-1 bg-white flex flex-col">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Fixer un tarif spécifique</button>
                    <div className="flex items-center gap-4">
                      <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
                      <span className="font-bold text-lg">Février 2026</span>
                      <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                    <div className="flex gap-2">
                       <button className="px-4 py-2 bg-[#1B1F2E] text-white rounded-lg text-sm font-medium hover:opacity-90">Importer</button>
                       <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"><Upload className="w-4 h-4" /> Exporter</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                    {['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'].map(day => (
                      <div key={day} className="py-2 text-center text-xs font-medium text-gray-500">{day}</div>
                    ))}
                  </div>
                  <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-white">
                     {[...Array(6)].map((_, i) => <div key={`empty-${i}`} className="border-b border-r border-gray-100 min-h-[100px]" />)}
                     {[...Array(28)].map((_, i) => (
                       <div key={i} className="border-b border-r border-gray-100 min-h-[100px] p-2 relative hover:bg-gray-50 cursor-pointer group transition-colors">
                          <span className="text-xs text-gray-400 absolute top-2 right-2">{i + 1}</span>
                          <div className="flex flex-col items-center justify-center h-full gap-1">
                             <span className="text-sm font-medium text-gray-400 group-hover:text-black">C$120</span>
                          </div>
                       </div>
                     ))}
                     {[...Array(8)].map((_, i) => <div key={`empty-end-${i}`} className="border-b border-r border-gray-100 min-h-[100px]" />)}
                  </div>
               </div>
            </div>
          </div>
        )}

        {currentStep === 'cancellation-policy' && (
          <div className="max-w-2xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-[#222222]">Politique d'annulation</h1>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#222222]">Politique d'annulation</label>
              <div className="relative">
                <select value={cancellationPolicy} onChange={(e) => setCancellationPolicy(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
                   <option value="Flexible">Flexible</option>
                   <option value="Modérée">Modérée</option>
                   <option value="Stricte">Stricte</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm space-y-3">
                <p><span className="font-semibold text-[#222222]">Annulation jusqu'à 10 jours avant l'arrivée:</span><br/>Remboursement complet.</p>
                <p><span className="font-semibold text-[#222222]">Moins de 10 jours avant l'arrivée :</span><br/>Perte de 30% du montant total.</p>
                <p><span className="font-semibold text-[#222222]">Moins de 2 jours avant l'arrivée :</span><br/>Aucun remboursement (sauf dépôt de sécurité)</p>
              </div>
            </div>
          </div>
        )}

        {/* --- NEW STEP: TAXES AND LAWS --- */}
        {currentStep === 'laws-taxes' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-[#222222] text-center">Indiquez les taxes et lois applicables</h1>
            
            <p className="text-[#717171] text-center max-w-xl mx-auto">
              Si vous avez l'obligation de détenir un numéro d'enregistrement ou un permis de location à court terme dans votre secteur, indiquez-le ci-dessus.
            </p>

            <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6 shadow-sm">
               <div className="space-y-2">
                 <label className="block text-sm font-bold text-[#222222]">Type d'enregistrement *</label>
                 <div className="relative">
                   <select 
                     value={taxRegistration.type}
                     onChange={(e) => setTaxRegistration({...taxRegistration, type: e.target.value})}
                     className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black"
                   >
                     <option value="CITQ">CITQ</option>
                     <option value="Other">Autre</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="block text-sm font-bold text-[#222222]">Numéro d'enregistrement CITQ *</label>
                 <input 
                   type="text" 
                   placeholder="Tapez ici" 
                   value={taxRegistration.number}
                   onChange={(e) => setTaxRegistration({...taxRegistration, number: e.target.value})}
                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                 />
               </div>

               <div className="space-y-2">
                 <label className="block text-sm font-bold text-[#222222]">Date de délivrance</label>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="relative">
                      <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>1</option></select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>Janvier</option></select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>2027</option></select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="block text-sm font-bold text-[#222222]">Date d'expiration</label>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="relative">
                      <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>1</option></select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>Janvier</option></select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>2027</option></select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="block text-sm font-bold text-[#222222]">Image du certificat</label>
                 <button className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-2 text-[#222222] font-medium hover:bg-gray-50 transition-colors">
                   <Upload className="w-4 h-4" /> Téléverser
                 </button>
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="font-bold text-xl text-[#222222]">Taxes</h3>
               <p className="text-[#717171] text-sm">Si les taxes (i.e.: TPS, TVQ) ne sont pas déjà incluses dans votre prix de base, ajoutez-les ici.</p>
               
               <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                 <span className="text-[#222222]">Souhaitez-vous inclure les taxes à votre prix?</span>
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setTaxRegistration({...taxRegistration, taxesIncluded: true})}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        taxRegistration.taxesIncluded === true 
                          ? 'bg-black border-black text-white' 
                          : 'border-gray-300 bg-transparent text-black hover:border-black'
                      }`}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setTaxRegistration({...taxRegistration, taxesIncluded: false})}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                        taxRegistration.taxesIncluded === false 
                          ? 'bg-red-500 border-red-500 text-white' 
                          : 'border-gray-300 bg-transparent text-red-500 hover:border-red-500'
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* --- NEW STEP: LOCAL LAWS --- */}
        {currentStep === 'local-laws' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-[#222222] text-center">Prenez connaissance des lois et des taxes locales</h1>
            
            <div className="space-y-6 text-[#717171] text-base leading-relaxed">
              <p>
                Vous devez toujours vous informer sur les lois en vigueur dans votre ville avant de publier votre annonce.
              </p>
              <p>
                La plupart des villes réglementent le partage de logement et les codes applicables de différents endroits (droit de l'urbanisme, plan d'occupation des sols, code du bâtiment, règlement de zonage, etc.) Le plus souvent, vous devez vous enregistrer et obtenir une autorisation avant de pouvoir louer votre chalet ou accepter des voyageurs. Vous pouvez également être responsable de la collecte et du versement de certaines taxes. Dans certains endroits, les locations à court terme sont totalement interdites.
              </p>
              <p>
                Vous êtes responsable de votre propre décision de louer ou de réserver un chalet, il vous incombe donc de connaître les règles applicables avant d'utiliser HOMIQIO.
              </p>
              <p>
                Pour commencer, nous vous proposons quelques ressources utiles dans la section «Réglementation de votre ville».
              </p>
              <p>
                En acceptant nos conditions générales et en publiant une annonce, vous vous engagez à respecter les lois et règlements de votre pays.
              </p>
            </div>

            <div className="pt-4">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div 
                  className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${
                    acceptedLocalLaws ? 'bg-black border-black' : 'border-gray-300 bg-white group-hover:border-black'
                  }`}
                  onClick={(e) => { e.preventDefault(); setAcceptedLocalLaws(!acceptedLocalLaws); }}
                >
                  {acceptedLocalLaws && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </div>
                <div className="select-none" onClick={() => setAcceptedLocalLaws(!acceptedLocalLaws)}>
                  <span className="text-[#222222] font-medium leading-normal">
                    J'accepte les <span className="underline text-blue-600">termes et conditions</span> de la plateforme, ainsi que de respecter les lois locales en vigueur qui s'appliquent à l'endroit où j'effectue la location de mon chalet.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* --- NEW STEP: GUEST ARRIVAL --- */}
        {currentStep === 'guest-arrival' && (
          <div className="max-w-3xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold text-[#222222] text-center">Facilitez l'arrivée de vos invités avec ces derniers détails</h1>
            
            <div className="space-y-8">
              {/* Internet Section */}
              <div className="space-y-6">
                 <h3 className="text-lg font-bold text-[#222222]">Internet</h3>
                 
                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-[#222222]">Quelle est la vitesse de votre connexion Internet? *</label>
                   <div className="relative">
                     <select 
                       value={guestArrival.internetSpeed}
                       onChange={(e) => setGuestArrival({...guestArrival, internetSpeed: e.target.value})}
                       className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black"
                     >
                       <option value="">Choisissez-en un</option>
                       <option value="50">Moins de 50 Mbps</option>
                       <option value="100">50 à 100 Mbps</option>
                       <option value="500">100 à 500 Mbps</option>
                       <option value="1000">Plus de 500 Mbps</option>
                     </select>
                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                   </div>
                 </div>

                 <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                   <span className="text-[#222222] font-medium">Avez-vous une connexion au wifi?</span>
                   <div className="flex items-center gap-4">
                     <button 
                       onClick={() => setGuestArrival({...guestArrival, hasWifi: true})} 
                       className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                         guestArrival.hasWifi === true 
                           ? 'bg-transparent border-black text-black' 
                           : 'border-gray-300 bg-transparent text-gray-400 hover:border-gray-400'
                       }`}
                     >
                       <Check className="w-5 h-5" />
                     </button>
                     <button 
                       onClick={() => setGuestArrival({...guestArrival, hasWifi: false})} 
                       className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                         guestArrival.hasWifi === false 
                           ? 'bg-transparent border-red-500 text-red-500' 
                           : 'border-gray-300 bg-transparent text-gray-400 hover:border-gray-400'
                       }`}
                     >
                       <X className="w-5 h-5" />
                     </button>
                   </div>
                 </div>
              </div>

              {/* Guide Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#222222]">Guide du chalet</h3>
                <button className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-2 text-[#222222] font-medium hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" /> Téléverser
                </button>
              </div>

              {/* Instructions Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#222222]">Instructions et règlements par rapport à la propriété</h3>
                <textarea 
                  value={guestArrival.instructions}
                  onChange={(e) => setGuestArrival({...guestArrival, instructions: e.target.value})}
                  placeholder="Tapez ici..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[120px] resize-none"
                />
              </div>

              {/* Arrival Method Section */}
              <div className="space-y-2">
                 <label className="block text-sm font-bold text-[#222222]">Arrivée | Méthode d'enregistrement *</label>
                 <div className="relative">
                   <select 
                     value={guestArrival.checkinMethod}
                     onChange={(e) => setGuestArrival({...guestArrival, checkinMethod: e.target.value})}
                     className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black"
                   >
                     <option value="">-</option>
                     <option value="keybox">Boîte à clé sécurisée</option>
                     <option value="smartlock">Serrure intelligente</option>
                     <option value="meet">Hôte vous accueille</option>
                     <option value="staff">Personnel de l'immeuble</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* --- NEW STEP: PHONE NUMBER --- */}
        {currentStep === 'phone-number' && (
          <div className="max-w-2xl mx-auto space-y-10">
            <div className="text-center space-y-4">
               <h1 className="text-3xl font-bold text-[#222222]">Ajoutez votre numéro de téléphone</h1>
               <p className="text-[#717171]">
                 Nous vous enverrons des demandes de réservation, des rappels et d'autres notifications. Ce numéro doit pouvoir recevoir des SMS ou des appels.
               </p>
            </div>
            
            <div className="space-y-2">
               <label className="block text-sm font-bold text-[#222222]">Numéro de téléphone portable *</label>
               <div className="relative flex items-center">
                  <div className="absolute left-3 flex items-center gap-2 pr-2 border-r border-gray-300">
                     <div className="relative">
                        <select 
                          value={countryCode} 
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="appearance-none bg-transparent font-medium text-[#222222] pr-6 focus:outline-none cursor-pointer"
                        >
                          <option value="+1">🇨🇦 +1</option>
                          <option value="+1US">🇺🇸 +1</option>
                          <option value="+33">🇫🇷 +33</option>
                        </select>
                        <ChevronDown className="w-3 h-3 text-[#222222] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                     </div>
                  </div>
                  <input 
                    type="tel" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 pl-28 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    placeholder="(000) 000-0000"
                  />
               </div>
            </div>
          </div>
        )}

        {/* --- NEW STEP: SUMMARY REVIEW 3 --- */}
        {currentStep === 'summary-review-3' && (
          <div className="max-w-6xl mx-auto">
             <div className="flex flex-col lg:flex-row gap-16 items-start">
               <div className="flex-1 w-full space-y-8">
                 <h1 className="text-3xl font-bold text-[#222222]">Vous y êtes presque!</h1>
                 
                 <div className="space-y-4">
                    {/* Stage 1 - Completed/Collapsed */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">1</div>
                          <div>
                             <h3 className="font-bold text-[#222222]">Commencez par la base</h3>
                          </div>
                       </div>
                       <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                       </div>
                    </div>

                    {/* Stage 2 - Completed/Collapsed */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">2</div>
                          <div>
                             <h3 className="font-bold text-[#222222]">Décrivez l'environnement</h3>
                          </div>
                       </div>
                       <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                       </div>
                    </div>

                    {/* Stage 3 - Expanded */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
                       <div className="p-6 flex items-center justify-between border-b border-gray-100">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-[#222222] font-bold text-lg bg-white">3</div>
                             <div>
                                <h3 className="font-bold text-[#222222]">Préparez l'accueil des invités</h3>
                                <p className="text-sm text-gray-500">Préparez l'accueil des invités</p>
                             </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                             <Check className="w-5 h-5 text-white" />
                          </div>
                       </div>
                       <div className="bg-white">
                          {[
                            { label: "Permissions", step: 'permissions' },
                            { label: "Mode de réservation", step: 'reservation-mode' },
                            { label: "Tarification", step: 'pricing' },
                            { label: "Frais", step: 'fees' },
                            { label: "Calendrier", step: 'calendar' },
                            { label: "Politique d'annulation", step: 'cancellation-policy' },
                            { label: "Taxes et lois", step: 'laws-taxes' },
                            { label: "Lois locales", step: 'local-laws' },
                            { label: "Arrivée des invités", step: 'guest-arrival' },
                            { label: "Numéro de téléphone", step: 'phone-number' }
                          ].map((item, idx) => (
                             <div key={idx} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                <span className="text-[#222222] font-medium text-sm">{item.label}</span>
                                <button onClick={() => jumpToStep(item.step as Step)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                   <Pencil className="w-4 h-4 text-gray-500" />
                                </button>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="mt-8">
                   <button onClick={handleNext} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity">
                     Continuer
                   </button>
                 </div>
               </div>
               <div className="flex-1 w-full lg:h-[700px] rounded-2xl overflow-hidden shadow-lg hidden lg:block sticky top-32">
                 <img src={summaryChaletImg} className="w-full h-full object-cover" />
               </div>
             </div>
          </div>
        )}

        {/* --- NEW STEP: VERIFICATION --- */}
        {currentStep === 'verification' && (
          <div className="max-w-4xl mx-auto space-y-10">
             <h1 className="text-3xl font-bold text-[#222222] text-center mb-8">Vérifiez vos informations</h1>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Info */}
                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                   <h3 className="font-bold text-lg text-[#222222] border-b border-gray-200 pb-2">Général</h3>
                   <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Adresse:</span> {addressData.address}, {addressData.city}</p>
                      <p><span className="font-semibold">Capacité:</span> {capacityData.capacity} personnes</p>
                      <p><span className="font-semibold">Chambres:</span> {bedrooms.length}</p>
                      <p><span className="font-semibold">Salles de bain:</span> {capacityData.bathrooms}</p>
                   </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                   <h3 className="font-bold text-lg text-[#222222] border-b border-gray-200 pb-2">Tarification</h3>
                   <div className="space-y-2 text-sm">
                      <p><span className="font-semibold">Prix de base:</span> {pricing.base} {currency}</p>
                      <p><span className="font-semibold">Frais de ménage:</span> {fees.cleaning} {currency}</p>
                      <p><span className="font-semibold">Dépôt de sécurité:</span> {fees.security} {currency}</p>
                      <p><span className="font-semibold">Politique d'annulation:</span> {cancellationPolicy}</p>
                   </div>
                </div>

                {/* Photos */}
                <div className="bg-gray-50 p-6 rounded-xl space-y-4 md:col-span-2">
                   <h3 className="font-bold text-lg text-[#222222] border-b border-gray-200 pb-2">Photos</h3>
                   <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {chaletPhotos.length > 0 ? chaletPhotos.map((photo, i) => (
                        <div key={i} className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                           <img src={photo} className="w-full h-full object-cover" />
                        </div>
                      )) : (
                        <p className="text-sm text-gray-500 italic">Aucune photo ajoutée</p>
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* --- NEW STEP: SIGNATURE --- */}
        {currentStep === 'signature' && (
          <div className="max-w-2xl mx-auto space-y-10">
             <div className="text-center space-y-4">
               <h1 className="text-3xl font-bold text-[#222222]">Confirmation et soumission</h1>
               <p className="text-[#717171]">
                 Veuillez confirmer l'exactitude des informations et signer ci-dessous pour soumettre votre annonce.
               </p>
             </div>

             <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
                <div className="space-y-4">
                   <label className="flex items-start gap-3 cursor-pointer group">
                      <div 
                        className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${
                          isSigned ? 'bg-black border-black' : 'border-gray-300 bg-white group-hover:border-black'
                        }`}
                        onClick={() => setIsSigned(!isSigned)}
                      >
                        {isSigned && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                      </div>
                      <div className="text-sm text-[#717171] leading-relaxed select-none" onClick={() => setIsSigned(!isSigned)}>
                        Je certifie que toutes les informations fournies sont exactes et conformes à la réalité. Je comprends que toute fausse déclaration pourrait entraîner la suspension de mon annonce. J'accepte les conditions d'utilisation de HOMIQIO.
                      </div>
                   </label>
                </div>

                <div className="space-y-2">
                   <label className="block text-sm font-bold text-[#222222]">Signature électronique (Nom complet) *</label>
                   <input 
                     type="text" 
                     placeholder="Votre nom complet"
                     value={signatureName}
                     onChange={(e) => setSignatureName(e.target.value)}
                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-serif italic text-lg"
                   />
                </div>
             </div>

             <div className="flex justify-center gap-4">
                <button 
                  onClick={handleBack}
                  className="w-full py-4 border border-gray-300 rounded-full font-bold text-lg text-[#222222] hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
                <button 
                  onClick={handleNext}
                  disabled={!isSigned || !signatureName}
                  className={`w-full py-4 rounded-full font-bold text-lg text-white transition-all ${
                    !isSigned || !signatureName ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:opacity-90'
                  }`}
                >
                  Soumettre votre annonce
                </button>
             </div>
          </div>
        )}

      </main>

      {/* Footer Navigation */}
      {!currentStep.includes('summary-review') && currentStep !== 'signature' && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 md:px-12 z-50">
           <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
              {currentStep !== 'acceptance-condition' && (
                 <button 
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-200 rounded-full text-[#222222] font-semibold hover:bg-gray-50 transition-colors shadow-sm min-w-[120px]"
                 >
                   Retour
                 </button>
              )}
              <div className={currentStep === 'acceptance-condition' ? 'ml-auto' : ''}>
                <button 
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className={`px-8 py-3 rounded-full text-white font-semibold transition-all shadow-md min-w-[120px] ${
                    isNextDisabled() ? 'bg-gray-800 opacity-50 cursor-not-allowed' : 'bg-[#222222] hover:bg-black'
                  }`}
                >
                  Suivant
                </button>
              </div>
           </div>
        </footer>
      )}

      {currentStep.includes('summary-review') && (
         <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 md:px-12 z-50">
            <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
               <button 
                onClick={handleBack}
                className="px-6 py-3 border border-gray-200 rounded-full text-[#222222] font-semibold hover:bg-gray-50 transition-colors shadow-sm min-w-[120px]"
               >
                 Retour
               </button>
            </div>
         </footer>
      )}

      {/* MODAL: SMS Verification Code */}
      {isSmsModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSmsModalOpen(false)} />
           <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 p-8 shadow-2xl">
             <div className="flex justify-between items-start mb-6">
               <h3 className="text-xl font-bold text-[#222222]">Entrez votre code de sécurité</h3>
               <button onClick={() => setIsSmsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="space-y-6">
               <div className="space-y-2">
                 <p className="font-medium text-[#222222]">Nous avons envoyé le code par SMS {countryCode.replace('US', '')} {phoneNumber}</p>
                 <p className="text-sm text-[#717171] leading-relaxed">
                   Nous vous enverrons des demandes de réservation, des rappels et d'autres notifications. Ce numéro doit pouvoir recevoir des messages texte ou des appels.
                 </p>
               </div>

               <div className="flex items-center justify-end gap-2 text-sm">
                 <span className="text-[#717171]">Vous ne l'avez pas reçu?</span>
                 <button className="font-bold underline text-[#222222] hover:text-black">Essayez à nouveau</button>
               </div>

               <div className="pt-2">
                  <input 
                    type="text" 
                    placeholder="Code de vérification (ex: 123456)"
                    className="w-full p-4 border border-gray-300 rounded-lg text-center text-xl font-bold tracking-widest focus:outline-none focus:border-black"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                  />
               </div>

               <div className="flex items-center justify-between gap-4 pt-4">
                 <button 
                   onClick={() => setIsSmsModalOpen(false)}
                   className="flex-1 py-3 border border-gray-300 rounded-full font-bold text-[#222222] hover:bg-gray-50 transition-colors"
                 >
                   Annuler
                 </button>
                 <button 
                   onClick={() => {
                     // Verify code logic here (mock)
                     setIsSmsModalOpen(false);
                     changeStep('verification'); // Manually advance step from modal
                     window.scrollTo(0,0);
                   }}
                   className="flex-1 py-3 bg-[#333] text-white rounded-full font-bold hover:bg-black transition-colors"
                 >
                   Confirmer
                 </button>
               </div>
             </div>
           </div>
        </div>
      )}

      {/* MODAL: Import iCal (Existing) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsImportModalOpen(false)} />
           <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
             <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
               <h3 className="font-bold text-lg text-[#222222]">Importer et visualiser vos réservations à partir d'autres plateformes</h3>
               <button onClick={() => setIsImportModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             <div className="p-8 space-y-8">
               <p className="text-[#222222] font-medium">Quelle plateforme de réservation souhaitez-vous importer dans HOMIQIO?</p>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Booking.com', bg: 'bg-[#003580]', color: 'text-white', icon: 'B.' },
                    { name: 'Airbnb.com', bg: 'bg-[#FF5A5F]', color: 'text-white', icon: 'A' },
                    { name: 'Vrbo.com', bg: 'bg-[#2c3e50]', color: 'text-white', icon: 'V' },
                    { name: 'GlampingHub', bg: 'bg-[#27ae60]', color: 'text-white', icon: 'G' },
                  ].map((platform) => (
                    <button key={platform.name} className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-black transition-colors group">
                       <div className={`w-12 h-12 rounded-lg ${platform.bg} ${platform.color} flex items-center justify-center font-bold text-xl`}>{platform.icon}</div>
                       <span className="text-xs text-gray-500 group-hover:text-black">Importer de {platform.name}</span>
                    </button>
                  ))}
               </div>
               <div className="relative">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                 <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">ou</span></div>
               </div>
               <button className="w-full py-3 border border-gray-300 rounded-full text-[#222222] font-medium hover:border-black transition-colors">Importer d'une autre plateforme</button>
             </div>
             <div className="px-6 py-4 border-t border-gray-100 flex gap-4 justify-end">
               <button onClick={() => setIsImportModalOpen(false)} className="px-6 py-3 border border-gray-300 rounded-full text-[#222222] font-medium hover:bg-gray-50">Cancel</button>
               <button className="px-6 py-3 bg-[#333] text-white rounded-full font-medium hover:bg-black">Importer</button>
             </div>
           </div>
        </div>
      )}

      {/* MODAL: Add Rate (Updated) */}
      {isRateModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsRateModalOpen(false)} />
           <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 duration-200">
             <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
               <h3 className="font-bold text-lg text-[#222222]">Tarif spécifique</h3>
               <button onClick={() => setIsRateModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             <div className="p-8 space-y-6">
                {/* Existing Rate Fields */}
                <div className="space-y-2">
                   <label className="text-sm font-bold text-[#222222]">Période *</label>
                   <div className="relative">
                     <input type="text" placeholder="Sélectionner les dates" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
                     <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                   </div>
                </div>
                
                <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:border-black transition-colors">
                  + Ajouter une période à ce tarif
                </button>

                <div className="space-y-2">
                   <label className="text-sm font-bold text-[#222222]">Nom de période *</label>
                   <input type="text" placeholder="Tapez ici" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-[#222222]">Tarif de base *</label>
                     <input type="text" placeholder="CAD (C$)" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
                     <p className="text-[10px] text-gray-400">Ce prix sera le tarif par défaut pour chaque nuit.</p>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-[#222222]">Tarif d'une nuit de week-end</label>
                     <input type="text" placeholder="CAD (C$)" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
                     <p className="text-[10px] text-gray-400">Ce prix sera le prix par défaut pour le week-end.</p>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-[#222222]">Tarif hebdomadaire</label>
                     <input type="text" placeholder="CAD (C$)" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
                     <p className="text-[10px] text-gray-400">Ce prix sera le tarif par défaut pour une période de 7 jours.</p>
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-bold text-[#222222]">Tarif mensuel</label>
                     <input type="text" placeholder="CAD (C$)" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
                     <p className="text-[10px] text-gray-400">Ce prix sera le tarif appliqué pour des périodes de 28 jours.</p>
                   </div>
                </div>

                {/* Updated Durée du séjour Section */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <h4 className="font-bold text-[#222222] text-lg">Durée du séjour</h4>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#222222]">Durée minimum d'un séjour</label>
                    <div className="relative">
                      <select 
                        value={rateModalMinStay} 
                        onChange={(e) => setRateModalMinStay(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#222222]">Durée maximale d'un séjour</label>
                    <div className="relative">
                      <select 
                        value={rateModalMaxStay} 
                        onChange={(e) => setRateModalMaxStay(e.target.value)} 
                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black"
                      >
                        <option value="Aucun maximum">Aucun maximum</option>
                        {[7, 14, 28].map(n => <option key={n} value={n}>{n} jours</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#222222]">Note à vous-même</label>
                    <textarea 
                      value={rateModalNote}
                      onChange={(e) => setRateModalNote(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none h-24"
                    />
                    <p className="text-right text-xs text-gray-400">{rateModalNote.length}/300</p>
                  </div>
                </div>
             </div>
             <div className="px-6 py-4 border-t border-gray-100 flex gap-4 justify-end sticky bottom-0 bg-white">
               <button onClick={() => setIsRateModalOpen(false)} className="px-6 py-3 border border-gray-300 rounded-full text-[#222222] font-medium hover:bg-gray-50">Annuler</button>
               <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800">Sauvegarder</button>
             </div>
           </div>
        </div>
      )}

      {/* MODAL: Block Period (New) */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsBlockModalOpen(false)} />
           <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 duration-200">
             <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
               <h3 className="font-bold text-lg text-[#222222]">Blocages</h3>
               <button onClick={() => setIsBlockModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             <div className="p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-sm font-bold text-[#222222]">Période *</label>
                   <div className="relative">
                     <input type="text" placeholder="Sélectionner les dates" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
                     <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-sm font-bold text-[#222222]">Nom de période *</label>
                   <input type="text" placeholder="Tapez ici" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
                </div>

                <div className="flex items-start gap-4">
                   <button 
                     onClick={() => setIsBlockEnabled(!isBlockEnabled)}
                     className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${isBlockEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                   >
                     <div className={`absolute top-1 bottom-1 w-4 h-4 bg-white rounded-full transition-transform ${isBlockEnabled ? 'left-[calc(100%-1.25rem)]' : 'left-1'}`} />
                   </button>
                   <div>
                     <span className={`block font-bold text-sm mb-1 ${isBlockEnabled ? 'text-blue-600' : 'text-gray-500'}`}>Bloquer la période</span>
                     <p className="text-xs text-[#717171]">L'activation du blocage signifie qu'aucune demande de réservation ne pourra être fait aux dates indiquées.</p>
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#222222]">Note à vous-même</label>
                  <textarea 
                    value={blockModalNote}
                    onChange={(e) => setBlockModalNote(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none h-24"
                  />
                  <p className="text-right text-xs text-gray-400">{blockModalNote.length}/300</p>
                </div>
             </div>
             <div className="px-6 py-4 border-t border-gray-100 flex gap-4 justify-end sticky bottom-0 bg-white">
               <button onClick={() => setIsBlockModalOpen(false)} className="px-6 py-3 border border-gray-300 rounded-full text-[#222222] font-medium hover:bg-gray-50">Annuler</button>
               <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800">Sauvegarder</button>
             </div>
           </div>
        </div>
      )}

      {/* Bedroom/Open Area Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditingItem(null)} />
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#222222]">{editingItem.item.name}</h2>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-[#222222]" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#222222]">Nom de l'espace *</label>
                <input 
                  type="text" 
                  value={editingItem.item.name}
                  onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, name: e.target.value } })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="space-y-6">
                {[
                  { key: 'simple', label: 'Lit simple' },
                  { key: 'double', label: 'Lit double' },
                  { key: 'queen', label: 'Lit Queen' },
                  { key: 'king', label: 'Lit King' },
                  { key: 'simple_bunk', label: 'Lit simple superposé' },
                  { key: 'double_bunk', label: 'Lit double superposé' },
                  { key: 'queen_bunk', label: 'Lit queen superposé' },
                  { key: 'king_bunk', label: 'Lit king superposé' },
                  { key: 'sofa_bed', label: "Canapé-lit" },
                  { key: 'other', label: "Matériel d'appoint" },
                ].map((bed) => (
                  <div key={bed.key} className="flex items-center justify-between">
                    <span className="text-[#222222]">{bed.label}</span>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleBedCountChange(bed.key as keyof Bedroom['beds'], -1)}
                        disabled={editingItem.item.beds[bed.key as keyof Bedroom['beds']] === 0}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black disabled:opacity-30"
                      >
                        <Minus className="w-4 h-4 text-[#717171]" />
                      </button>
                      <span className="text-base font-medium text-[#222222] w-6 text-center">{editingItem.item.beds[bed.key as keyof Bedroom['beds']]}</span>
                      <button 
                        onClick={() => handleBedCountChange(bed.key as keyof Bedroom['beds'], 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"
                      >
                        <Plus className="w-4 h-4 text-[#717171]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100">
              <button 
                onClick={() => {
                  updateItem(editingItem.item, editingItem.type);
                  setEditingItem(null);
                }}
                className="w-full bg-black text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
