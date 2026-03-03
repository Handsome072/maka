import { useState } from 'react';
import { ChevronDown, Trash2, ExternalLink, Minus, Plus, UtensilsCrossed, CircleDashed, Flame, Thermometer, Utensils, Waves, Car, Tv, Pencil, MinusCircle, Lightbulb, Info, Check, X, MoveHorizontal, ArrowUp, ArrowRight, Camera, Globe, Briefcase, Clock, PawPrint, Music, Wand2, Heart, BookOpen, MessageCircle, MapPin, GraduationCap, Search, Sun, Plane, Anchor, Wine, Mountain, Book, ShoppingBag, Music2, Pizza, Landmark, Palette, Footprints, BookOpenText, Tent, Camera as CameraIcon, Dumbbell, Zap, CalendarCheck, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface EditListingProps {
  onNavigate: (page: string) => void;
  uploadedPhotos?: string[];
  listingTitle?: string;
}

type Section = 'photos' | 'title' | 'type' | 'pricing' | 'availability' | 'guests' | 'description' | 'amenities' | 'accessibility' | 'location' | 'host' | 'cohosts' | 'reservation-params' | 'house-rules' | 'safety' | 'cancellation' | 'custom-link';
type GuideSection = 'arrival-departure' | 'itinerary' | 'check-in-procedure' | 'wifi' | 'house-manual' | 'guide-house-rules' | 'departure-instructions' | 'guides' | 'guest-preferences';

export function EditListing({ onNavigate, uploadedPhotos = [], listingTitle = 'Maison hôte calme' }: EditListingProps) {
  const [selectedSection, setSelectedSection] = useState<Section>('photos');
  const [selectedGuideSection, setSelectedGuideSection] = useState<GuideSection>('arrival-departure');
  const [activeTab, setActiveTab] = useState<'mon-logement' | 'guide'>('mon-logement');

  // Title section state
  const [title, setTitle] = useState(listingTitle || 'test');
  const [savedTitle, setSavedTitle] = useState(listingTitle || 'test');
  const [isSaving, setIsSaving] = useState(false);
  
  // Property type section state
  const [propertyCategory, setPropertyCategory] = useState('Logement unique');
  const [propertyType, setPropertyType] = useState('Grange');
  const [listingType, setListingType] = useState('Chambre partagée');
  const [floors, setFloors] = useState(1);
  const [floorLevel, setFloorLevel] = useState(1);
  const [buildYear, setBuildYear] = useState('');
  const [size, setSize] = useState('');
  const [sizeUnit, setSizeUnit] = useState('Unité');

  // Pricing section state
  const [pricingMode, setPricingMode] = useState<'overview' | 'base_price' | 'weekend_price' | 'weekly_discount' | 'monthly_discount'>('overview');
  const [basePrice, setBasePrice] = useState(12);
  const [weekendPrice, setWeekendPrice] = useState(14);
  const [smartPricing, setSmartPricing] = useState(false);
  const [weeklyDiscount, setWeeklyDiscount] = useState(10);
  const [monthlyDiscount, setMonthlyDiscount] = useState(20);
  const [tempBasePrice, setTempBasePrice] = useState(12);
  const [tempWeekendPrice, setTempWeekendPrice] = useState(14);
  const [tempWeeklyDiscount, setTempWeeklyDiscount] = useState(10);
  const [tempMonthlyDiscount, setTempMonthlyDiscount] = useState(20);

  // Availability section state
  const [availabilityMode, setAvailabilityMode] = useState<'overview' | 'min_nights' | 'max_nights'>('overview');
  const [minNights, setMinNights] = useState(1);
  const [maxNights, setMaxNights] = useState(365);
  const [advanceNotice, setAdvanceNotice] = useState('Le jour même');
  const [cutoffTime, setCutoffTime] = useState('00:00');
  const [allowSameDayRequests, setAllowSameDayRequests] = useState(false);
  const [tempMinNights, setTempMinNights] = useState(1);
  const [tempMaxNights, setTempMaxNights] = useState(365);
  
  // Custom Min Nights Modal state
  const [showMinNightsModal, setShowMinNightsModal] = useState(false);
  const [customMinNights, setCustomMinNights] = useState({
    Dimanches: 1,
    Lundis: 1,
    Mardis: 1,
    Mercredis: 1,
    Jeudis: 1,
    Vendredis: 1,
    Samedis: 1
  });

  // Guests section state
  const [guestCount, setGuestCount] = useState(4);
  const [tempGuestCount, setTempGuestCount] = useState(4);

  // Safety section state
  const [selectedSafetyField, setSelectedSafetyField] = useState<string | null>(null);
  const [safetyItems, setSafetyItems] = useState<Record<string, 'yes' | 'no' | null>>({});
  const [tempSafetyItems, setTempSafetyItems] = useState<Record<string, 'yes' | 'no' | null>>({});

  const safetyQuestions = [
    {
      id: 'children',
      title: "Ne convient pas aux enfants de 2 à 12 ans",
      description: "Ce logement possède des caractéristiques qui risquent de ne pas être sûres pour les enfants."
    },
    {
      id: 'infants',
      title: "Ne convient pas aux bébés (moins de 2 ans)",
      description: "Ce logement possède des caractéristiques qui risquent de ne pas être sûres pour les bébés ou les enfants en bas âge."
    },
    {
      id: 'pool',
      title: "La piscine ou le jacuzzi n'ont pas de clôture ni de verrou",
      description: "Les voyageurs ont accès à une piscine ou un jacuzzi non sécurisé. Renseignez-vous sur la réglementation locale pour connaître toute exigence spécifique."
    },
    {
      id: 'water',
      title: "Source d'eau à proximité, comme un lac ou une rivière",
      description: "Les voyageurs ont un accès sans restriction à une source d'eau, comme un océan, un étang, un ruisseau ou des marécages, sur les lieux ou à proximité."
    },
    {
      id: 'climbing',
      title: "Structure(s) d'escalade ou de jeux sur les lieux",
      description: "Les voyageurs auront accès à des installations telles qu'une structure de jeux, un toboggan, des balançoires ou des cordes d'escalade."
    },
    {
      id: 'heights',
      title: "Endroits surélevés sans rambardes ni protection",
      description: "Les voyageurs ont accès à un espace d'une hauteur supérieure à 76 centimètres, comme un balcon, un toit, une terrasse ou une falaise, qui ne dispose d'aucune rambarde ni protection."
    },
    {
      id: 'animals',
      title: "Animaux potentiellement dangereux",
      description: "Les voyageurs peuvent rencontrer des animaux potentiellement dangereux (chevaux, gros chiens, etc.) ou venimeux qui pourraient leur causer du tort."
    }
  ];
  
  const [safetyDevices, setSafetyDevices] = useState<string[]>([
    "Présence d'une caméra de surveillance à l'extérieur",
    "Présence d'un sonomètre"
  ]);
  const [tempSafetyDevices, setTempSafetyDevices] = useState<string[]>([]);
  
  const [propertySafetyInfo, setPropertySafetyInfo] = useState<string[]>([
    "Présence d'une ou plusieurs armes dans le logement"
  ]);
  const [tempPropertySafetyInfo, setTempPropertySafetyInfo] = useState<string[]>([]);

  const safetyDeviceOptions = [
    "Présence d'une caméra de surveillance à l'extérieur",
    "Présence d'un sonomètre",
    "Détecteur de fumée",
    "Détecteur de monoxyde de carbone"
  ];

  const propertySafetyOptions = [
    "Présence d'une ou plusieurs armes dans le logement",
    "Animaux dangereux sur place",
    "Lac, rivière ou autre plan d'eau à proximité"
  ];

  const handleSaveSafety = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (selectedSafetyField === 'instructions') {
        setSafetyItems(tempSafetyItems);
      } else if (selectedSafetyField === 'devices') {
        setSafetyDevices(tempSafetyDevices);
      } else if (selectedSafetyField === 'property_info') {
        setPropertySafetyInfo(tempPropertySafetyInfo);
      }
      setIsSaving(false);
      setSelectedSafetyField(null);
      toast.success("Informations de sécurité enregistrées");
    }, 1000);
  };

  // Accessibility section state
  const [selectedAccessibilityId, setSelectedAccessibilityId] = useState<string | null>(null);
  const [accessibilityItems, setAccessibilityItems] = useState<Record<string, 'yes' | 'no' | null>>({});

  const accessibilityDefinitions = [
    {
      id: 'parking',
      title: "Stationnement réservé aux personnes handicapées",
      icon: Car,
      description: "Il y a une place de stationnement privée d'au moins 3,35 mètres de large. Ou il y a une place de stationnement publique réservée aux personnes à mobilité réduite avec une signalisation ou un marquage clairs.",
      photos: [
        "https://images.unsplash.com/photo-1580137331426-c28eb6be023b?w=800", 
        "https://images.unsplash.com/photo-1671483578124-af3ab6fcfb91?w=800", 
        "https://images.unsplash.com/photo-1710002580427-15456ed0f8ad?w=800"
      ]
    },
    {
      id: 'lighting',
      title: "Accès bien éclairé jusqu'à l'entrée",
      icon: Lightbulb,
      description: "Le trottoir ou le chemin qui mène à l'entrée des voyageurs est bien éclairé la nuit.",
      photos: [
        "https://images.unsplash.com/photo-1764936509889-a92ac04d9be0?w=800",
        "https://images.unsplash.com/photo-1766671617424-d77a5c24de2d?w=800",
        "https://images.unsplash.com/photo-1594353162824-a8b237f9adae?w=800"
      ]
    },
    {
      id: 'step_free',
      title: "Accès de plain-pied",
      icon: ArrowRight,
      description: "Il n'y a pas de marches ni de seuil de plus de 5 cm.",
      photos: []
    },
    {
      id: 'entrance_width',
      title: "Largeur de l'entrée des voyageurs supérieure à 81 centimètres",
      icon: MoveHorizontal,
      description: "L'entrée principale a une largeur de passage libre d'au moins 81 cm.",
      photos: []
    },
    {
      id: 'pool_lift',
      title: "Lève-personne pour la piscine ou le jacuzzi",
      icon: Waves,
      description: "Un appareil mécanique pour aider à entrer et sortir de la piscine ou du jacuzzi.",
      photos: []
    },
    {
      id: 'ceiling_lift',
      title: "Lève-personne mobile ou fixé au plafond",
      icon: ArrowUp,
      description: "Un système de levage pour aider au transfert d'une personne.",
      photos: []
    }
  ];

  // Custom Link section state
  const [customLink, setCustomLink] = useState('');
  const [tempCustomLink, setTempCustomLink] = useState('');

  // Reservation Params section state
  const [reservationMode, setReservationMode] = useState<'first_5' | 'instant' | 'manual'>('first_5');
  const [tempReservationMode, setTempReservationMode] = useState<'first_5' | 'instant' | 'manual'>('first_5');
  const [requireGoodReviews, setRequireGoodReviews] = useState(false);
  const [tempRequireGoodReviews, setTempRequireGoodReviews] = useState(false);

  // Cancellation section state
  const [cancellationEditMode, setCancellationEditMode] = useState<'short' | 'long' | null>(null);
  const [cancellationPolicyShort, setCancellationPolicyShort] = useState('Flexibles');
  const [tempCancellationShort, setTempCancellationShort] = useState('Flexibles');
  const [nonRefundableOption, setNonRefundableOption] = useState(false);
  const [cancellationPolicyLong, setCancellationPolicyLong] = useState('Conditions fermes pour les séjours longue durée');
  const [tempCancellationLong, setTempCancellationLong] = useState('Conditions fermes pour les séjours longue durée');

  const shortTermOptions = [
    {
      label: 'Flexibles',
      description: [
        "Remboursement intégral au moins 1 jour avant l'arrivée",
        "Remboursement partiel moins de 1 jour avant l'arrivée"
      ]
    },
    {
      label: 'Modérées',
      description: [
        "Remboursement intégral au moins 5 jours avant l'arrivée",
        "Remboursement partiel moins de 5 jours avant l'arrivée"
      ]
    },
    {
      label: 'Limitées',
      description: [
        "Remboursement intégral au moins 14 jours avant l'arrivée",
        "Remboursement partiel entre 7 et 14 jours avant l'arrivée"
      ]
    },
    {
      label: 'Fermes',
      description: [
        "Remboursement intégral au moins 30 jours avant l'arrivée",
        "Remboursement partiel entre 7 et 30 jours avant l'arrivée"
      ]
    }
  ];

  const longTermOptions = [
    {
      label: 'Conditions fermes pour les séjours longue durée',
      description: [
        "Remboursement intégral jusqu'à 30 jours avant l'arrivée",
        "Passé ce délai, les 30 premiers jours du séjour ne sont pas remboursables"
      ]
    },
    {
      label: 'Conditions strictes pour les séjours longue durée',
      description: [
        "Remboursement intégral dans les 48 heures suivant la réservation et au moins 28 jours avant l'arrivée",
        "Passé ce délai, les 30 premiers jours du séjour ne sont pas remboursables"
      ]
    }
  ];

  const handleSaveCancellation = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (cancellationEditMode === 'short') {
        setCancellationPolicyShort(tempCancellationShort);
      } else if (cancellationEditMode === 'long') {
        setCancellationPolicyLong(tempCancellationLong);
      }
      setIsSaving(false);
      setCancellationEditMode(null);
      toast.success("Conditions d'annulation enregistrées");
    }, 1000);
  };

  // Amenities section state
  const [isEditingAmenities, setIsEditingAmenities] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState([
    { id: 'barbecue', label: 'Barbecue', iconName: 'UtensilsCrossed', selected: true },
    { id: 'billard', label: 'Billard', iconName: 'CircleDashed', selected: true },
    { id: 'brasero', label: 'Brasero', iconName: 'Flame', selected: true },
    { id: 'chauffage', label: 'Chauffage', iconName: 'Thermometer', description: 'Équipement utilisé pour chauffer un logement.', selected: true },
    { id: 'cheminee', label: 'Cheminée', iconName: 'Flame', selected: true },
    { id: 'repas_plein_air', label: 'Espace repas en plein air', iconName: 'Utensils', description: "Un espace pour les repas situé à l'extérieur.", selected: true },
    { id: 'jacuzzi', label: 'Jacuzzi', iconName: 'Waves', selected: true },
    { id: 'parking_gratuit', label: 'Parking gratuit sur place', iconName: 'Car', description: 'Stationnement gratuit disponible sur place.', selected: true },
    { id: 'parking_payant', label: 'Parking payant sur place', iconName: 'Car', description: 'Stationnement payant disponible au logement.', selected: true },
    { id: 'tv', label: 'Télévision', iconName: 'Tv', description: 'Un appareil pour regarder la télévision.', selected: true },
  ]);

  const getAmenityIcon = (iconName: string, size = "w-8 h-8") => {
    const props = { className: `${size} stroke-1` };
    switch (iconName) {
      case 'UtensilsCrossed': return <UtensilsCrossed {...props} />;
      case 'CircleDashed': return <CircleDashed {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Thermometer': return <Thermometer {...props} />;
      case 'Utensils': return <Utensils {...props} />;
      case 'Waves': return <Waves {...props} />;
      case 'Car': return <Car {...props} />;
      case 'Tv': return <Tv {...props} />;
      default: return <UtensilsCrossed {...props} />;
    }
  };

  // Description section state
  const [selectedDescriptionField, setSelectedDescriptionField] = useState<string | null>(null);
  const [descriptionText, setDescriptionText] = useState("Installez-vous confortablement dans ce logement campagnard.");
  const [myPlaceText, setMyPlaceText] = useState("");
  const [guestAccessText, setGuestAccessText] = useState("");
  const [interactionText, setInteractionText] = useState("");
  const [notesText, setNotesText] = useState("");
  const [tempDescriptionText, setTempDescriptionText] = useState("");

  const characterImages = [
    "https://images.unsplash.com/photo-1618303085702-e2f951c2ee55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGlsbHVzdHJhdGlvbiUyMHBlcnNvbiUyMHN0YW5kaW5nJTIwd2hpdGUlMjBiYWNrZ3JvdW5kJTIwbWluaW1hbHxlbnwxfHx8fDE3Njk1MTUwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1630412612770-dc85fccc79d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMG1pbmltYWwlMjBjaGFyYWN0ZXIlMjBzdGFuZGluZ3xlbnwxfHx8fDE3Njk1MTUyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.1.0&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.1.0&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ",
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.1.0&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.1.0&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
  ];

  // Host section state
  const [activeHostModal, setActiveHostModal] = useState<string | null>(null);
  const [tempHostValue, setTempHostValue] = useState("");
  const [tempSelectedLanguages, setTempSelectedLanguages] = useState<string[]>([]);
  const [tempSelectedInterests, setTempSelectedInterests] = useState<string[]>([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [languageQuery, setLanguageQuery] = useState("");

  const allLanguages = [
    "Français", "Afrikaans", "Albanais", "Allemand", "Anglais", 
    "Arabe", "Arménien", "Assamais", "Azéri", "Bahasa Indonesia", 
    "Bahasa Melayu", "Bengali", "Birman", "Bosniaque", "Bulgare"
  ];

  const locationSuggestions = [
    "Fieferana, Madagascar",
    "Fianarantsoa, Madagascar",
    "Fiadanana, Madagascar",
    "Fiaferana, Madagascar",
    "Firenze, Florence, Italie"
  ];

  const interestsList = [
    { id: 'architecture', label: 'Architecture', icon: Landmark },
    { id: 'gastronomy', label: 'Gastronomie', icon: Pizza },
    { id: 'history', label: 'Histoire', icon: Globe },
    { id: 'concerts', label: 'Concerts', icon: Music2 },
    { id: 'sports', label: 'Événements sportifs', icon: Dumbbell }, // Using Dumbbell as proxy or Ticket if available
    { id: 'museums', label: 'Musées', icon: Landmark },
    { id: 'nature', label: 'Nature et plein air', icon: Mountain },
    { id: 'photography', label: 'Photographie', icon: CameraIcon },
    { id: 'reading', label: 'Lecture', icon: BookOpenText },
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
    { id: 'theater', label: 'Théâtre', icon: Palette }, // Proxy icon
    { id: 'water_sports', label: 'Sports aquatiques', icon: Anchor },
    { id: 'oenology', label: 'Œnologie', icon: Wine },
    { id: 'yoga', label: 'Yoga', icon: Footprints }, // Proxy icon
  ];

  // Cohost section state
  const [showCohostModal, setShowCohostModal] = useState(false);
  const [cohostRegion, setCohostRegion] = useState("Afghanistan (+93)");
  const [cohostPhone, setCohostPhone] = useState("");
  const [cohostEmail, setCohostEmail] = useState("");

  const [hostProfile, setHostProfile] = useState({
    dreamDestination: "",
    profession: "",
    passions: "",
    pets: "",
    birthDecade: "",
    school: "",
    highSchoolSong: "",
    anecdote: "",
    uselessTalent: "",
    loves: "",
    biographyTitle: "",
    languages: "",
    location: "",
    aboutMe: "",
    showPastTrips: false,
    interests: [] as string[]
  });

  const openHostModal = (id: string, currentValue: string) => {
    setTempHostValue(currentValue);
    setActiveHostModal(id);
    if (id === 'languages') {
      setTempSelectedLanguages(currentValue ? currentValue.split(', ') : []);
    }
    if (id === 'interests') {
       // Assuming currentValue is a comma separated list or handled via state
       setTempSelectedInterests(hostProfile.interests || []);
    }
    if (id === 'location') {
      setLocationQuery("");
    }
    if (id === 'languages') {
      setLanguageQuery("");
    }
  };

  const saveHostModal = () => {
    if (activeHostModal) {
       let valueToSave: any = tempHostValue;
       
       if (activeHostModal === 'languages') {
         valueToSave = tempSelectedLanguages.join(', ');
       } else if (activeHostModal === 'interests') {
         setHostProfile(prev => ({
            ...prev,
            interests: tempSelectedInterests
         }));
         setActiveHostModal(null);
         toast.success("Centres d'intérêt mis à jour");
         return;
       }

       setHostProfile(prev => ({
         ...prev,
         [activeHostModal]: valueToSave
       }));
       setActiveHostModal(null);
       toast.success("Profil mis à jour");
    }
  };

  const hostProfileItems = [
    { id: 'dreamDestination', icon: Globe, label: "Ma destination de rêve" },
    { id: 'profession', icon: Briefcase, label: "Votre profession" },
    { id: 'passions', icon: Clock, label: "Mes passions" },
    { id: 'pets', icon: PawPrint, label: "Animaux de compagnie" },
    { id: 'birthDecade', icon: Info, label: "La décennie de votre naissance" }, // Info as placeholder for balloon
    { id: 'school', icon: GraduationCap, label: "L'endroit où vous avez étudié" },
    { id: 'highSchoolSong', icon: Music, label: "Votre chanson préférée au lycée" },
    { id: 'anecdote', icon: Lightbulb, label: "Une anecdote à mon sujet" },
    { id: 'uselessTalent', icon: Wand2, label: "Le plus inutile de mes talents" },
    { id: 'loves', icon: Heart, label: "Ce que j'adore" },
    { id: 'biographyTitle', icon: BookOpen, label: "Le titre de ma biographie" },
    { id: 'languages', icon: MessageCircle, label: "Les langues que je parle" },
    { id: 'location', icon: MapPin, label: "Le lieu où j'habite" }
  ];

  const handleSaveTitle = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSavedTitle(title);
      setIsSaving(false);
      toast.success("Titre enregistré avec succès");
    }, 1000);
  };

  const handleSaveType = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Type de logement enregistré avec succès");
    }, 1000);
  };

  const handleSaveBasePrice = () => {
    setIsSaving(true);
    setTimeout(() => {
      setBasePrice(tempBasePrice);
      setIsSaving(false);
      setPricingMode('overview');
      toast.success("Prix par nuit enregistré");
    }, 1000);
  };

  const handleSaveWeekendPrice = () => {
    setIsSaving(true);
    setTimeout(() => {
      setWeekendPrice(tempWeekendPrice);
      setIsSaving(false);
      setPricingMode('overview');
      toast.success("Prix week-end enregistré");
    }, 1000);
  };

  const handleSaveWeeklyDiscount = () => {
    setIsSaving(true);
    setTimeout(() => {
      setWeeklyDiscount(tempWeeklyDiscount);
      setIsSaving(false);
      setPricingMode('overview');
      toast.success("Réduction à la semaine enregistrée");
    }, 1000);
  };

  const handleSaveMonthlyDiscount = () => {
    setIsSaving(true);
    setTimeout(() => {
      setMonthlyDiscount(tempMonthlyDiscount);
      setIsSaving(false);
      setPricingMode('overview');
      toast.success("Réduction au mois enregistrée");
    }, 1000);
  };

  const handleSaveMinNights = () => {
    setIsSaving(true);
    setTimeout(() => {
      setMinNights(tempMinNights);
      setIsSaving(false);
      setAvailabilityMode('overview');
      toast.success("Nombre minimal de nuits enregistré");
    }, 1000);
  };

  const handleSaveMaxNights = () => {
    setIsSaving(true);
    setTimeout(() => {
      setMaxNights(tempMaxNights);
      setIsSaving(false);
      setAvailabilityMode('overview');
      toast.success("Nombre maximal de nuits enregistré");
    }, 1000);
  };

  const handleSaveGuests = () => {
    setIsSaving(true);
    setTimeout(() => {
      setGuestCount(tempGuestCount);
      setIsSaving(false);
      toast.success("Nombre de voyageurs enregistré");
    }, 1000);
  };

  const handleSaveDescriptionField = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (selectedDescriptionField === 'description') setDescriptionText(tempDescriptionText);
      if (selectedDescriptionField === 'my-place') setMyPlaceText(tempDescriptionText);
      if (selectedDescriptionField === 'access') setGuestAccessText(tempDescriptionText);
      if (selectedDescriptionField === 'interaction') setInteractionText(tempDescriptionText);
      if (selectedDescriptionField === 'notes') setNotesText(tempDescriptionText);
      
      setIsSaving(false);
      setSelectedDescriptionField(null);
      toast.success("Description enregistrée");
    }, 1000);
  };

  const getDescriptionPreview = (field: string) => {
    switch(field) {
      case 'description': return descriptionText || "Ajoutez des informations";
      case 'my-place': return myPlaceText || "Ajoutez des informations";
      case 'access': return guestAccessText || "Ajoutez des informations";
      case 'interaction': return interactionText || "Ajoutez des informations";
      case 'notes': return notesText || "Ajoutez des informations";
      default: return "Ajoutez des informations";
    }
  };

  const getDescriptionTitle = (field: string) => {
    switch(field) {
      case 'description': return "Description du logement";
      case 'my-place': return "Mon logement";
      case 'access': return "Accès des voyageurs";
      case 'interaction': return "Échanges avec les voyageurs";
      case 'notes': return "Autres informations à noter";
      default: return "";
    }
  };

  const getDescriptionHelper = (field: string) => {
    switch(field) {
      case 'description': return null;
      case 'my-place': return "Donnez une description générale des pièces et espaces de votre logement pour que les voyageurs sachent à quoi s'attendre.";
      case 'access': return "Indiquez aux voyageurs les parties du logement qu’ils peuvent utiliser.";
      case 'interaction': return "Indiquez aux voyageurs comment vous contacter s’ils ont besoin d’aide pendant leur séjour.";
      case 'notes': return "Incluez toute autre information que vous souhaitez faire connaître aux voyageurs avant qu’ils ne réservent votre logement.";
      default: return null;
    }
  };

  const handleSaveCustomLink = () => {
    setIsSaving(true);
    setTimeout(() => {
      setCustomLink(tempCustomLink);
      setIsSaving(false);
      toast.success("Lien personnalisé enregistré");
    }, 1000);
  };

  const handleSaveReservationParams = () => {
    setIsSaving(true);
    setTimeout(() => {
      setReservationMode(tempReservationMode);
      setRequireGoodReviews(tempRequireGoodReviews);
      setIsSaving(false);
      toast.success("Paramètres de réservation enregistrés");
    }, 1000);
  };

  // House Rules section state
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [tempPetsAllowed, setTempPetsAllowed] = useState(false);
  const [maxPets, setMaxPets] = useState(1);
  const [tempMaxPets, setTempMaxPets] = useState(1);
  const [eventsAllowed, setEventsAllowed] = useState(true);
  const [tempEventsAllowed, setTempEventsAllowed] = useState(true);
  const [smokingAllowed, setSmokingAllowed] = useState(true);
  const [tempSmokingAllowed, setTempSmokingAllowed] = useState(true);
  const [quietHours, setQuietHours] = useState(true);
  const [tempQuietHours, setTempQuietHours] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState('23:00');
  const [tempQuietHoursStart, setTempQuietHoursStart] = useState('23:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');
  const [tempQuietHoursEnd, setTempQuietHoursEnd] = useState('07:00');
  const [commercialPhotoAllowed, setCommercialPhotoAllowed] = useState(true);
  const [tempCommercialPhotoAllowed, setTempCommercialPhotoAllowed] = useState(true);
  
  const handleSaveHouseRules = () => {
    setIsSaving(true);
    setTimeout(() => {
      setPetsAllowed(tempPetsAllowed);
      setMaxPets(tempMaxPets);
      setEventsAllowed(tempEventsAllowed);
      setSmokingAllowed(tempSmokingAllowed);
      setQuietHours(tempQuietHours);
      setQuietHoursStart(tempQuietHoursStart);
      setQuietHoursEnd(tempQuietHoursEnd);
      setCommercialPhotoAllowed(tempCommercialPhotoAllowed);
      setIsSaving(false);
      toast.success("Règlement intérieur enregistré");
    }, 1000);
  };

  const renderContent = () => {
    // Guide d'arrivée content
    if (activeTab === 'guide') {
      if (selectedGuideSection === 'arrival-departure') {
        return (
          <div className="flex-1 bg-white px-12 py-8">
            <h1 className="text-3xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
              Horaires d'arrivée et de départ
            </h1>

            {/* Plage horaire pour les arrivées */}
            <div className="mb-8">
              <label className="block mb-2 text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                Plage horaire pour les arrivées
              </label>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm" style={{ color: '#717171' }}>
                  Heure de début
                </label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none cursor-pointer hover:border-gray-900 transition-all"
                    style={{ color: '#222222' }}
                    defaultValue="15:00"
                  >
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm" style={{ color: '#717171' }}>
                  Heure de fin
                </label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none cursor-pointer hover:border-gray-900 transition-all"
                    style={{ color: '#222222' }}
                  >
                    <option value="">Sélectionnez une heure</option>
                    <option value="18:00">18:00</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00</option>
                    <option value="21:00">21:00</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Heure du départ */}
            <div className="mb-8">
              <label className="block mb-2 text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                Heure du départ
              </label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none cursor-pointer hover:border-gray-900 transition-all"
                  style={{ color: '#222222' }}
                >
                  <option value="">Sélectionnez une heure</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="px-8 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed" disabled>
                <span className="text-sm" style={{ fontWeight: 600 }}>
                  Enregistrer
                </span>
              </button>
            </div>
          </div>
        );
      }

      // Default guide content
      return (
        <div className="flex-1 bg-white px-12 py-8">
          <h1 className="text-3xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
            {selectedGuideSection === 'itinerary' && 'Itinéraire'}
            {selectedGuideSection === 'check-in-procedure' && 'Procédure d\'arrivée'}
            {selectedGuideSection === 'wifi' && 'Informations sur le wifi'}
            {selectedGuideSection === 'house-manual' && 'Manuel de la maison'}
            {selectedGuideSection === 'guide-house-rules' && 'Règlement intérieur'}
            {selectedGuideSection === 'departure-instructions' && 'Instructions de départ'}
          </h1>
          <p style={{ color: '#717171' }}>Contenu à venir...</p>
        </div>
      );
    }

    // Host content
    if (selectedSection === 'host') {
      return (
        <div className="flex-1 bg-white px-12 py-8 overflow-y-auto h-[calc(100vh-80px)]">
           <div className="max-w-3xl mx-auto pb-20">
              <h1 className="text-3xl font-semibold text-[#222222] mb-12">
                À propos de l'hôte
              </h1>

              {/* Profile Card */}
              <div className="flex flex-col items-center mb-12">
                 <div className="bg-white rounded-[32px] shadow-[0_6px_20px_rgba(0,0,0,0.1)] p-8 flex flex-col items-center w-[300px] relative">
                    <div className="w-32 h-32 rounded-full bg-gray-100 mb-4 overflow-hidden relative">
                       {/* Use the specific asset if possible, or a placeholder */}
                       <div className="absolute inset-0 flex items-center justify-center text-center p-4 bg-[#f7f7f7]">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1 block">Airbnb Originals</span>
                       </div>
                    </div>
                    <h2 className="text-2xl font-bold text-[#222222] mb-1">Ramaroson</h2>
                    <p className="text-sm font-semibold text-[#222222]">Hôte depuis 2026</p>
                 </div>
                 
                 <button className="flex items-center gap-2 mt-6 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Camera className="w-4 h-4 text-[#222222]" />
                    <span className="text-sm font-semibold text-[#222222] underline">Modifier</span>
                 </button>
              </div>

              <p className="text-[#717171] text-base mb-12 max-w-2xl mx-auto text-center">
                 Les hôtes et les voyageurs peuvent consulter votre profil et il peut apparaître sur Airbnb pour nous aider à instaurer un climat de confiance au sein de la communauté. <button className="underline font-semibold text-[#222222]">En savoir plus</button>
              </p>

              {/* Profile Items List */}
              <div className="border-t border-gray-200">
                 {hostProfileItems.map((item) => {
                    const Icon = item.icon;
                    // @ts-ignore
                    const value = hostProfile[item.id] || "";
                    const hasValue = value.trim().length > 0;
                    
                    return (
                       <div 
                        key={item.id} 
                        onClick={() => openHostModal(item.id, value)}
                        className="py-6 border-b border-gray-200 flex items-center justify-between group cursor-pointer"
                       >
                          <div className="flex items-center gap-4">
                            <Icon className="w-6 h-6 text-[#222222] stroke-[1.5]" />
                            <span className={`text-base ${hasValue ? 'text-[#222222] font-semibold' : 'text-[#222222]'} group-hover:underline`}>
                              {hasValue ? value : item.label}
                            </span>
                          </div>
                          {hasValue && (
                            <span className="text-sm text-[#717171] underline cursor-pointer">Modifier</span>
                          )}
                       </div>
                    );
                 })}
              </div>

              {/* About Me Section */}
              <div className="mt-12 pt-8">
                 <h2 className="text-xl font-bold text-[#222222] mb-6">À propos de moi</h2>
                 <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-white min-h-[120px] flex flex-col justify-center">
                    {hostProfile.aboutMe ? (
                      <div className="relative group">
                        <p className="text-[#222222] whitespace-pre-wrap">{hostProfile.aboutMe}</p>
                        <button 
                          onClick={() => openHostModal('aboutMe', hostProfile.aboutMe)}
                          className="absolute top-0 right-0 p-2 text-[#222222] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-[#717171] mb-2">Écrivez un fait amusant et accrocheur.</p>
                        <button 
                          onClick={() => openHostModal('aboutMe', '')}
                          className="text-[#222222] font-semibold underline text-left w-fit"
                        >
                           Ajouter une présentation
                        </button>
                      </>
                    )}
                 </div>
              </div>

              {/* Past Trips Section */}
              <div className="mt-12 pt-8">
                 <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-[#222222]">Mes voyages précédents</h2>
                    <button 
                      onClick={() => setHostProfile(prev => ({ ...prev, showPastTrips: !prev.showPastTrips }))}
                      className={`w-12 h-8 rounded-full p-1 transition-colors ${hostProfile.showPastTrips ? 'bg-[#222222]' : 'bg-gray-300'}`}
                    >
                       <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${hostProfile.showPastTrips ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                 </div>
                 <p className="text-[#717171] text-sm mb-8">Choisissez les tampons que vous souhaitez voir affichés sur votre profil.</p>
                 
                 <div className="flex gap-4 overflow-x-auto pb-4">
                    {/* Stamp 1 - Rectangle */}
                    <div className="min-w-[140px] h-[100px] border border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-300">
                       <Globe className="w-8 h-8 stroke-[1] text-[#222222]" />
                    </div>
                    
                    {/* Stamp 2 - Oval */}
                    <div className="min-w-[140px] h-[100px] border border-gray-300 rounded-[50px] flex flex-col items-center justify-center gap-2 text-gray-300">
                       <Sun className="w-8 h-8 stroke-[1] text-[#222222]" />
                    </div>

                    {/* Stamp 3 - Square/Rounded */}
                    <div className="min-w-[100px] h-[100px] border border-gray-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-300">
                       <Plane className="w-8 h-8 stroke-[1] text-[#222222]" />
                    </div>

                    {/* Stamp 4 - Hexagon-ish */}
                    <div className="min-w-[140px] h-[100px] border border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-300" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0% 50%)' }}>
                       {/* Empty as per screenshot or just shape */}
                    </div>
                 </div>
                 
                 <div className="flex justify-between mt-2 px-2">
                    <span className="text-xs text-[#717171]">Prochaine destination</span>
                    <span className="text-xs text-[#717171]">Prochaine destination</span>
                    <span className="text-xs text-[#717171]">Prochaine destination</span>
                    <span className="text-xs text-[#717171]">Prochaine destination</span>
                 </div>

                 <div className="mt-8">
                    <button disabled className="px-6 py-3 bg-gray-100 text-gray-400 rounded-lg font-semibold w-full sm:w-auto cursor-not-allowed">
                       Modifier mes tampons de voyage
                    </button>
                 </div>
              </div>

              {/* Interests Section */}
              <div className="mt-12 pt-8 mb-20 border-t border-gray-200">
                 <h2 className="text-xl font-bold text-[#222222] mb-2">Mes centres d'intérêt</h2>
                 <p className="text-[#717171] text-sm mb-6 max-w-2xl">
                    Trouvez des points communs avec les autres voyageurs et hôtes en ajoutant des centres d'intérêt à votre profil.
                 </p>
                 
                 {hostProfile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-6">
                       {interestsList.filter(i => hostProfile.interests.includes(i.id)).map(interest => {
                          const Icon = interest.icon;
                          return (
                            <div key={interest.id} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full">
                               <Icon className="w-4 h-4 text-[#222222]" />
                               <span className="text-sm text-[#222222]">{interest.label}</span>
                            </div>
                          );
                       })}
                    </div>
                 ) : (
                   <div className="flex gap-3 mb-6">
                      <button onClick={() => openHostModal('interests', '')} className="w-16 h-10 rounded-full border border-dashed border-gray-400 flex items-center justify-center hover:bg-gray-50 transition-colors">
                         <Plus className="w-5 h-5 text-[#222222]" />
                      </button>
                      <button onClick={() => openHostModal('interests', '')} className="w-16 h-10 rounded-full border border-dashed border-gray-400 flex items-center justify-center hover:bg-gray-50 transition-colors">
                         <Plus className="w-5 h-5 text-[#222222]" />
                      </button>
                      <button onClick={() => openHostModal('interests', '')} className="w-16 h-10 rounded-full border border-dashed border-gray-400 flex items-center justify-center hover:bg-gray-50 transition-colors">
                         <Plus className="w-5 h-5 text-[#222222]" />
                      </button>
                   </div>
                 )}

                 <button 
                    onClick={() => openHostModal('interests', '')}
                    className="px-6 py-3 bg-[#F7F7F7] hover:bg-[#EBEBEB] text-[#222222] rounded-lg font-semibold transition-colors"
                 >
                    {hostProfile.interests.length > 0 ? "Modifier les centres d'intérêt" : "Ajouter des centres d'intérêt"}
                 </button>
              </div>
           </div>

           {/* Generic Modal Overlay */}
           {activeHostModal && (
             <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl w-full max-w-[568px] relative shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                   
                   {/* Modal Header */}
                   <div className="h-16 flex items-center px-6 border-b border-gray-100">
                      <button 
                        onClick={() => setActiveHostModal(null)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors -ml-2"
                      >
                         <X className="w-4 h-4 text-[#222222]" />
                      </button>
                   </div>

                   {/* Modal Content - Dream Destination */}
                   {activeHostModal === 'dreamDestination' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Quelle est votre destination de rêve ?</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Dites-nous quelle destination vous inspire, qu'elle soit prévue pour votre prochain voyage ou qu'elle vous fasse rêver depuis toujours.
                        </p>
                        
                        <div className="relative mb-2">
                           <div className="absolute top-3 left-3 text-xs text-[#717171] transform -translate-y-0.5">
                              Ma destination de rêve :
                           </div>
                           <input 
                              type="text" 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value)}
                              className="w-full pt-6 pb-2 px-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222]"
                              maxLength={40}
                           />
                        </div>
                        <div className="text-right text-xs text-[#717171] font-semibold">
                           {40 - tempHostValue.length} caractères restants
                        </div>
                     </div>
                   )}

                   {/* Modal Content - Profession */}
                   {activeHostModal === 'profession' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Quelle est votre activité professionnelle ?</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Dites-nous quelle est votre profession. Si vous n'avez pas de profession conventionnelle, dites-nous quelle est votre vocation. Exemple : infirmière, parent de quatre enfants ou surfeur à la retraite. <button className="underline font-semibold text-[#222222]">Où ces informations s'affichent-elles ?</button>
                        </p>
                        
                        <div className="relative mb-2">
                           <div className="absolute top-3 left-3 text-xs text-[#717171] transform -translate-y-0.5">
                              Votre profession :
                           </div>
                           <input 
                              type="text" 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value)}
                              className="w-full pt-6 pb-2 px-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222]"
                              maxLength={20}
                           />
                        </div>
                        <div className="text-right text-xs text-[#717171] font-semibold">
                           {20 - tempHostValue.length} caractères restants
                        </div>
                     </div>
                   )}

                   {/* Modal Content - Passions */}
                   {activeHostModal === 'passions' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Quelles sont vos passions ?</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Indiquez une activité ou un passe-temps auquel vous accordez beaucoup de votre temps libre. Exemple : Regarder des vidéos de chats ou jouer aux échecs.
                        </p>
                        
                        <div className="relative mb-2">
                           <div className="absolute top-3 left-3 text-xs text-[#717171] transform -translate-y-0.5">
                              Mes passions :
                           </div>
                           <input 
                              type="text" 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value)}
                              className="w-full pt-6 pb-2 px-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222]"
                              maxLength={40}
                           />
                        </div>
                        <div className="text-right text-xs text-[#717171] font-semibold">
                           {40 - tempHostValue.length} caractères restants
                        </div>
                     </div>
                   )}

                   {/* Modal Content - Pets */}
                   {activeHostModal === 'pets' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Avez-vous des animaux de compagnie ?</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Indiquez tous les animaux de compagnie que vous avez et donnez leurs noms. Exemple : « Un chat calico baptisé Moustache » ou « Léonardo, une tortue pleine d'énergie ».
                        </p>
                        
                        <div className="relative mb-2">
                           <div className="absolute top-3 left-3 text-xs text-[#717171] transform -translate-y-0.5">
                              Animaux de compagnie :
                           </div>
                           <input 
                              type="text" 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value)}
                              className="w-full pt-6 pb-2 px-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222]"
                              maxLength={40}
                           />
                        </div>
                        <div className="text-right text-xs text-[#717171] font-semibold">
                           {40 - tempHostValue.length} caractères restants
                        </div>
                     </div>
                   )}

                   {/* Modal Content - Birth Decade */}
                   {activeHostModal === 'birthDecade' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">La décennie de votre naissance</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Ne vous inquiétez pas, votre date de naissance exacte ne sera pas visible pour les autres.
                        </p>
                        
                        <div className="flex items-center justify-between py-4 border-t border-gray-100 border-b">
                           <div>
                              <div className="text-base text-[#222222]">Afficher la décennie de ma naissance</div>
                              <div className="text-sm text-[#717171]">Naissance dans les années 00</div>
                           </div>
                           <button 
                              onClick={() => setTempHostValue(tempHostValue ? "" : "Né(e) dans les années 00")}
                              className={`w-12 h-8 rounded-full p-1 transition-colors ${tempHostValue ? 'bg-black' : 'bg-[#B0B0B0]'}`}
                           >
                              <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${tempHostValue ? 'translate-x-4' : 'translate-x-0'}`} />
                           </button>
                        </div>
                     </div>
                   )}

                   {/* Modal Content - School */}
                   {activeHostModal === 'school' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Où avez-vous étudié ?</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Indiquez où vous avez étudié (école à la maison, lycée général ou encore établissement professionnel).
                        </p>
                        
                        <div className="relative mb-2">
                           <div className="absolute top-3 left-3 text-xs text-[#717171] transform -translate-y-0.5">
                              L'endroit où vous avez étudié :
                           </div>
                           <input 
                              type="text" 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value)}
                              className="w-full pt-6 pb-2 px-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222]"
                              maxLength={40}
                           />
                        </div>
                        <div className="text-right text-xs text-[#717171] font-semibold">
                           {40 - tempHostValue.length} caractères restants
                        </div>
                     </div>
                   )}

                   {/* Modal Content - High School Song */}
                   {activeHostModal === 'highSchoolSong' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Quelle était votre chanson préférée au lycée ?</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Même si c'est embarrassant, indiquez la chanson que vous écoutiez en boucle pendant votre adolescence.
                        </p>
                        
                        <div className="relative mb-2">
                           <div className="absolute top-3 left-3 text-xs text-[#717171] transform -translate-y-0.5">
                              Votre chanson préférée au lycée :
                           </div>
                           <input 
                              type="text" 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value)}
                              className="w-full pt-6 pb-2 px-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222]"
                              maxLength={40}
                           />
                        </div>
                        <div className="text-right text-xs text-[#717171] font-semibold">
                           {40 - tempHostValue.length} caractères restants
                        </div>
                     </div>
                   )}

                   {/* Modal Content - Anecdote */}
                   {activeHostModal === 'anecdote' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Avez-vous une anecdote à votre sujet ?</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Racontez quelque chose d'unique ou d'insolite à votre sujet. Exemple : « J'ai joué dans un clip musical » ou « Je sais jongler ».
                        </p>
                        
                        <div className="relative mb-2">
                           <div className="absolute top-3 left-3 text-xs text-[#717171] transform -translate-y-0.5">
                              Une anecdote à mon sujet :
                           </div>
                           <input 
                              type="text" 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value)}
                              className="w-full pt-6 pb-2 px-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222]"
                              maxLength={40}
                           />
                        </div>
                        <div className="text-right text-xs text-[#717171] font-semibold">
                           {40 - tempHostValue.length} caractères restants
                        </div>
                     </div>
                   )}

                   {/* Modal Content - Useless Talent */}
                   {activeHostModal === 'uselessTalent' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Quel est le plus inutile de vos talents ?</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Partagez un talent surprenant ou amusant qui ne sert pas à grand-chose, mais qui fait sourire.
                        </p>
                        
                        <div className="relative mb-2">
                           <div className="absolute top-3 left-3 text-xs text-[#717171] transform -translate-y-0.5">
                              Le plus inutile de mes talents :
                           </div>
                           <input 
                              type="text" 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value)}
                              className="w-full pt-6 pb-2 px-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222]"
                              maxLength={40}
                           />
                        </div>
                        <div className="text-right text-xs text-[#717171] font-semibold">
                           {40 - tempHostValue.length} caractères restants
                        </div>
                     </div>
                   )}

                   {/* Modal Content - Loves */}
                   {activeHostModal === 'loves' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Qu'est-ce que vous adorez ?</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Dites-nous ce qui vous passionne ou ce qui vous rend heureux au quotidien.
                        </p>
                        
                        <div className="relative mb-2">
                           <div className="absolute top-3 left-3 text-xs text-[#717171] transform -translate-y-0.5">
                              Ce que j'adore :
                           </div>
                           <input 
                              type="text" 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value)}
                              className="w-full pt-6 pb-2 px-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222]"
                              maxLength={40}
                           />
                        </div>
                        <div className="text-right text-xs text-[#717171] font-semibold">
                           {40 - tempHostValue.length} caractères restants
                        </div>
                     </div>
                   )}

                   {/* Modal Content - Biography Title */}
                   {activeHostModal === 'biographyTitle' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Quel serait le titre de votre biographie ?</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Imaginez que votre vie est un livre. Quel titre lui donneriez-vous ?
                        </p>
                        
                        <div className="relative mb-2">
                           <div className="absolute top-3 left-3 text-xs text-[#717171] transform -translate-y-0.5">
                              Le titre de ma biographie :
                           </div>
                           <input 
                              type="text" 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value)}
                              className="w-full pt-6 pb-2 px-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222]"
                              maxLength={40}
                           />
                        </div>
                        <div className="text-right text-xs text-[#717171] font-semibold">
                           {40 - tempHostValue.length} caractères restants
                        </div>
                     </div>
                   )}

                   {/* Modal Content - Languages */}
                   {activeHostModal === 'languages' && (
                     <div className="p-6 h-[500px] flex flex-col">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Quelles langues parlez-vous ?</h2>
                        
                        <div className="relative mb-6">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#222222]" />
                           <input 
                              type="text" 
                              value={languageQuery}
                              onChange={(e) => setLanguageQuery(e.target.value)}
                              placeholder="Recherchez une langue"
                              className="w-full py-3 pl-12 pr-4 bg-[#F7F7F7] border-none rounded-full text-[#222222] placeholder:text-[#717171] focus:ring-2 focus:ring-black focus:bg-white transition-all"
                           />
                        </div>

                        <div className="flex-1 overflow-y-auto -mr-6 pr-6 custom-scrollbar">
                           <div className="space-y-6">
                              {allLanguages.filter(l => l.toLowerCase().includes(languageQuery.toLowerCase())).map((lang) => (
                                 <label key={lang} className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-base text-[#222222]">{lang}</span>
                                    <input 
                                       type="checkbox"
                                       checked={tempSelectedLanguages.includes(lang)}
                                       onChange={(e) => {
                                          if (e.target.checked) {
                                             setTempSelectedLanguages([...tempSelectedLanguages, lang]);
                                          } else {
                                             setTempSelectedLanguages(tempSelectedLanguages.filter(l => l !== lang));
                                          }
                                       }}
                                       className="w-6 h-6 border-gray-300 rounded text-black focus:ring-black"
                                    />
                                 </label>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}

                   {/* Modal Content - Location */}
                   {activeHostModal === 'location' && (
                     <div className="p-6 h-[500px] flex flex-col">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Votre lieu de résidence</h2>
                        
                        <div className="relative mb-6">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#222222]" strokeWidth={2.5} />
                           <input 
                              type="text" 
                              value={locationQuery}
                              onChange={(e) => setLocationQuery(e.target.value)}
                              placeholder="Recherchez votre ville"
                              className="w-full py-3 pl-12 pr-10 border border-[#B0B0B0] rounded-full text-[#222222] placeholder:text-[#717171] focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                           />
                           {locationQuery && (
                              <button 
                                 onClick={() => setLocationQuery("")}
                                 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#DDDDDD] rounded-full flex items-center justify-center hover:bg-[#222222] hover:text-white transition-colors text-[#222222]"
                              >
                                 <X className="w-3 h-3" strokeWidth={3} />
                              </button>
                           )}
                        </div>

                        <div className="flex-1 overflow-y-auto">
                           {locationQuery ? (
                              <div className="space-y-2">
                                 {locationSuggestions
                                    .filter(loc => loc.toLowerCase().includes(locationQuery.toLowerCase()))
                                    .map((loc, idx) => (
                                    <button 
                                       key={idx}
                                       onClick={() => {
                                          setTempHostValue(loc);
                                          setLocationQuery("");
                                       }}
                                       className="w-full flex items-center gap-4 py-3 hover:bg-gray-50 px-2 rounded-lg transition-colors text-left"
                                    >
                                       <div className="w-12 h-12 bg-[#F7F7F7] rounded-lg flex items-center justify-center flex-shrink-0">
                                          <MapPin className="w-6 h-6 text-[#222222]" />
                                       </div>
                                       <span className="text-base text-[#222222] font-semibold">
                                          {loc}
                                       </span>
                                    </button>
                                 ))}
                              </div>
                           ) : (
                              tempHostValue && (
                                 <div className="flex items-center gap-4 py-2">
                                    <span className="text-base text-[#222222] font-semibold">{tempHostValue}</span>
                                 </div>
                              )
                           )}
                        </div>
                     </div>
                   )}

                   {/* Modal Content - About Me */}
                   {activeHostModal === 'aboutMe' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">À propos de vous</h2>
                        <p className="text-[#717171] mb-8 text-base">
                           Parlez-nous un peu de vous afin que vos futurs hôtes ou voyageurs puissent mieux vous connaître.
                        </p>
                        
                        <div className="relative mb-2">
                           <textarea 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value.slice(0, 500))}
                              className="w-full h-48 p-4 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222] resize-none"
                           />
                        </div>
                        <div className="text-right text-xs text-[#717171] font-semibold">
                           {500 - tempHostValue.length} caractères restants
                        </div>
                     </div>
                   )}

                   {/* Modal Content - Interests */}
                   {activeHostModal === 'interests' && (
                     <div className="p-6 h-[600px] flex flex-col">
                        <h2 className="text-2xl font-bold text-[#222222] mb-2">Quels sont vos centres d'intérêt ?</h2>
                        <p className="text-[#717171] mb-6 text-base">
                           Choisissez des centres d'intérêt pour les afficher sur votre profil.
                        </p>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar -mr-6 pr-6">
                           <div className="flex flex-wrap gap-3">
                              {interestsList.map((interest) => {
                                 const isSelected = tempSelectedInterests.includes(interest.id);
                                 const Icon = interest.icon;
                                 return (
                                    <button 
                                       key={interest.id}
                                       onClick={() => {
                                          if (isSelected) {
                                             setTempSelectedInterests(prev => prev.filter(i => i !== interest.id));
                                          } else {
                                             if (tempSelectedInterests.length < 20) {
                                                setTempSelectedInterests(prev => [...prev, interest.id]);
                                             }
                                          }
                                       }}
                                       className={`flex items-center gap-3 px-4 py-3 rounded-full border transition-all ${
                                          isSelected 
                                             ? 'border-black bg-white ring-1 ring-black' 
                                             : 'border-gray-300 hover:border-black bg-white'
                                       }`}
                                    >
                                       <Icon className="w-5 h-5 text-[#222222]" strokeWidth={1.5} />
                                       <span className="text-base text-[#222222]">{interest.label}</span>
                                    </button>
                                 );
                              })}
                           </div>
                           
                           <button className="mt-6 underline font-semibold text-[#222222] text-sm">
                              Tout afficher
                           </button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                           <span className="text-sm font-semibold text-[#222222]">
                              {tempSelectedInterests.length}/20 sélectionné
                           </span>
                        </div>
                     </div>
                   )}

                   {/* Default Modal Content for others */}
                   {activeHostModal !== 'dreamDestination' && activeHostModal !== 'profession' && activeHostModal !== 'passions' && activeHostModal !== 'pets' && activeHostModal !== 'birthDecade' && activeHostModal !== 'school' && activeHostModal !== 'highSchoolSong' && activeHostModal !== 'anecdote' && activeHostModal !== 'uselessTalent' && activeHostModal !== 'loves' && activeHostModal !== 'biographyTitle' && activeHostModal !== 'languages' && activeHostModal !== 'location' && activeHostModal !== 'aboutMe' && activeHostModal !== 'interests' && (
                     <div className="p-6">
                        <h2 className="text-2xl font-bold text-[#222222] mb-4">Modifier</h2>
                         <div className="relative mb-8">
                           <input 
                              type="text" 
                              value={tempHostValue}
                              onChange={(e) => setTempHostValue(e.target.value)}
                              className="w-full p-4 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-[#222222]"
                           />
                        </div>
                     </div>
                   )}

                   {/* Modal Footer for Generic Modals */}
                   {!showCohostModal && (
                     <div className="p-6 border-t border-gray-100 flex justify-end">
                        <button 
                           onClick={saveHostModal}
                           className="px-6 py-3 bg-[#222222] hover:bg-black text-white font-semibold rounded-lg transition-all"
                        >
                           Enregistrer
                        </button>
                     </div>
                   )}
                </div>
             </div>
           )}
        </div>
      );
    }


    if (selectedSection === 'accessibility') {
      const selectedItem = accessibilityDefinitions.find(i => i.id === selectedAccessibilityId);
      
      // Update definitions with exact text from screenshots
      const updatedDefinitions = accessibilityDefinitions.map(def => {
        if (def.id === 'step_free') {
          return {
            ...def,
            title: "Accès de plain-pied",
            description: "Il n'y a pas de marches, d'escaliers ni de bordures à franchir sur le chemin allant de l'arrivée du voyageur à l'entrée du logement. Pour certains logements, comme les appartements, cela inclut tout chemin extérieur, couloir, ascenseur ou toute autre chose qu'un voyageur peut rencontrer en se rendant dans le logement. Tous les seuils de porte ou obstacles sur le chemin doivent mesurer moins de 5 cm de haut.",
            photos: [
              "https://images.unsplash.com/photo-1757940807466-df4b14d795a8?w=800",
              "https://images.unsplash.com/photo-1697779802953-9b19a750fad7?w=800",
              "https://images.unsplash.com/photo-1580137331426-c28eb6be023b?w=800"
            ]
          };
        }
        if (def.id === 'entrance_width') {
          return {
            ...def,
            title: "Largeur de l'entrée des voyageurs supérieure à 81 centimètres",
            description: "La largeur de l'entrée des voyageurs est d'au moins 81 cm.",
            photos: [
              "https://images.unsplash.com/photo-1703756291638-b1774ae3c186?w=800",
              "https://images.unsplash.com/photo-1697779802953-9b19a750fad7?w=800"
            ]
          };
        }
        if (def.id === 'pool_lift') {
          return {
            ...def,
            title: "Lève-personne pour la piscine ou le jacuzzi",
            description: "Il existe un dispositif spécialement conçu pour déposer une personne dans la piscine ou le jacuzzi, et l'en faire sortir.",
            photos: [
              "https://images.unsplash.com/photo-1768143812462-f5670cea16fb?w=800",
              "https://images.unsplash.com/photo-1580137331426-c28eb6be023b?w=800"
            ]
          };
        }
        if (def.id === 'ceiling_lift') {
          return {
            ...def,
            title: "Lève-personne mobile ou fixé au plafond",
            description: "Il existe un dispositif spécialement conçu pour soulever une personne d'un fauteuil roulant et l'y installer. Il peut être fixé au plafond ou sur pieds.",
            photos: [
              "https://images.unsplash.com/photo-1691784330937-4e8ee367d550?w=800",
              "https://images.unsplash.com/photo-1752407828784-67a92663c866?w=800"
            ]
          };
        }
        return def;
      });

      // Detail View (Full Page)
      if (selectedAccessibilityId && selectedItem) {
        const currentItem = updatedDefinitions.find(i => i.id === selectedAccessibilityId) || updatedDefinitions[0];
        
        return (
          <div className="flex-1 bg-white px-12 py-8 overflow-y-auto h-[calc(100vh-80px)]">
             <div className="max-w-2xl mx-auto pb-24">
                <button 
                  onClick={() => setSelectedAccessibilityId(null)}
                  className="mb-8 p-2 hover:bg-gray-100 rounded-full -ml-2 inline-flex"
                >
                   <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                     <path d="M15 18l-6-6 6-6" />
                   </svg>
                </button>

                <h1 className="text-3xl font-semibold text-[#222222] mb-6 leading-tight">
                  {currentItem.title}
                </h1>
                
                <p className="text-base text-[#717171] mb-8 leading-relaxed">
                  {currentItem.description}
                </p>
                
                {currentItem.photos.length > 0 && (
                   <div className="mt-8 mb-8">
                      <p className="text-sm text-[#717171] mb-4">Exemples :</p>
                      <div className="grid grid-cols-2 gap-4">
                         {currentItem.photos.map((photo, idx) => (
                            <img key={idx} src={photo} alt="Exemple" className="w-full h-48 object-cover rounded-lg bg-gray-100" />
                         ))}
                      </div>
                      <button className="mt-6 text-sm font-semibold underline text-[#222222] hover:text-gray-600">
                         Consultez les consignes sur les photos
                      </button>
                   </div>
                )}
                
                {/* Radio Group */}
                <div className="mt-12 space-y-4">
                   <label 
                      onClick={() => {
                         setAccessibilityItems(prev => ({ ...prev, [currentItem.id]: 'no' }));
                      }}
                      className={`block p-4 border rounded-xl cursor-pointer transition-all ${
                      accessibilityItems[currentItem.id] === 'no' || accessibilityItems[currentItem.id] == null
                        ? 'border-black ring-1 ring-black bg-white' 
                        : 'border-gray-300 hover:border-black'
                   }`}>
                      <div className="flex items-center justify-between">
                         <span className="text-base font-normal text-[#222222]">Je ne dispose pas de cet équipement</span>
                         <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                            accessibilityItems[currentItem.id] === 'no' || accessibilityItems[currentItem.id] == null
                              ? 'border-[7px] border-black' 
                              : 'border-gray-300'
                         }`}>
                         </div>
                      </div>
                   </label>

                   <label 
                      onClick={() => {
                         setAccessibilityItems(prev => ({ ...prev, [currentItem.id]: 'yes' }));
                      }}
                      className={`block p-4 border rounded-xl cursor-pointer transition-all ${
                      accessibilityItems[currentItem.id] === 'yes' 
                        ? 'border-black ring-1 ring-black bg-white' 
                        : 'border-gray-300 hover:border-black'
                   }`}>
                      <div className="flex items-center justify-between">
                         <span className="text-base font-normal text-[#222222]">Je dispose de cet équipement</span>
                         <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                            accessibilityItems[currentItem.id] === 'yes'
                              ? 'border-[7px] border-black' 
                              : 'border-gray-300'
                         }`}>
                         </div>
                      </div>
                   </label>
                </div>

                {/* Footer Actions Fixed at Bottom or Inline? User asked for standard master-detail. 
                    Let's keep it inline for simplicity or fixed if needed. 
                    Standard EditListing usually has a fixed footer, but here we are inside the content area.
                    We'll add a footer inside this view for saving.
                */}
                <div className="mt-12 flex justify-between items-center border-t border-gray-100 pt-6">
                   <button 
                     onClick={() => setSelectedAccessibilityId(null)}
                     className="text-[#222222] font-semibold underline text-sm hover:text-gray-600"
                   >
                     Annuler
                   </button>
                   <button 
                     onClick={() => {
                       toast.success("Choix enregistré");
                       setSelectedAccessibilityId(null);
                     }}
                     className="px-6 py-3 bg-[#222222] text-white rounded-lg text-sm font-semibold hover:opacity-90"
                   >
                     Enregistrer
                   </button>
                </div>
             </div>
          </div>
        );
      }

      // Overview Mode (List)
      return (
        <div className="flex-1 bg-white px-12 py-8 overflow-y-auto h-[calc(100vh-80px)]">
           <div className="max-w-3xl mx-auto pb-20">
              <h1 className="text-3xl font-semibold text-[#222222] mb-4">
                Éléments d'accessibilité
              </h1>
              <p className="text-base text-[#717171] mb-12 max-w-2xl leading-relaxed">
                Indiquez les éléments d'accessibilité présents dans votre logement.
              </p>

              <div className="space-y-4 divide-y divide-gray-200">
                 {updatedDefinitions.map((item) => {
                    const hasValue = accessibilityItems[item.id] === 'yes';
                    const Icon = item.icon;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedAccessibilityId(item.id)}
                        className="w-full text-left py-8 first:pt-0 flex items-center justify-between transition-all bg-white hover:opacity-80 group"
                      >
                         <div className="flex items-center gap-6">
                            <Icon className="w-8 h-8 text-[#222222] stroke-1" />
                            <span className="text-base font-semibold text-[#222222] max-w-[400px] leading-snug">
                              {item.title}
                            </span>
                         </div>
                         <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-colors ${
                            hasValue ? 'bg-black border-black' : 'bg-transparent border-gray-300'
                         }`}>
                            {hasValue ? (
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            ) : (
                              <Plus className="w-4 h-4 text-[#222222]" strokeWidth={3} />
                            )}
                         </div>
                      </button>
                    );
                 })}
              </div>
           </div>
        </div>
      );
    }
    
    // Description content
    if (selectedSection === 'description') {
      const descriptionFields = [
        { id: 'description', label: 'Description du logement' },
        { id: 'my-place', label: 'Mon logement' },
        { id: 'access', label: 'Accès des voyageurs' },
        { id: 'interaction', label: 'Échanges avec les voyageurs' },
        { id: 'notes', label: 'Autres informations à noter' }
      ];

      // Editor Mode
      if (selectedDescriptionField) {
        return (
          <div className="flex-1 bg-white px-12 py-8 flex flex-col h-[calc(100vh-80px)] overflow-hidden relative">
            <div className="max-w-2xl mx-auto w-full flex-1">
              <h1 className="text-3xl font-semibold text-[#222222] mb-6">
                {getDescriptionTitle(selectedDescriptionField)}
              </h1>

              {selectedDescriptionField === 'description' && (
                <p className="text-xs text-[#717171] mb-6 font-semibold">
                  Caractères restants : {500 - tempDescriptionText.length}/500
                </p>
              )}

              {getDescriptionHelper(selectedDescriptionField) && (
                <p className="text-sm text-[#717171] mb-8 leading-relaxed">
                  {getDescriptionHelper(selectedDescriptionField)}
                </p>
              )}

              <textarea
                value={tempDescriptionText}
                onChange={(e) => setTempDescriptionText(e.target.value.slice(0, 500))}
                className="w-full h-64 p-4 border border-[#717171] rounded-lg text-base text-[#222222] focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none"
                placeholder="Saisissez votre texte ici..."
                autoFocus
              />
            </div>

            <div className="fixed bottom-0 right-0 w-[calc(100%-20rem)] bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10">
               <button 
                onClick={() => setSelectedDescriptionField(null)}
                className="px-6 py-3 text-[#222222] underline font-semibold hover:text-gray-600 transition-colors"
               >
                 Annuler
               </button>
               <button 
                onClick={handleSaveDescriptionField}
                disabled={isSaving}
                className="px-6 py-3 bg-[#222222] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
               >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
               </button>
            </div>
          </div>
        );
      }

      // List Mode (Overview)
      return (
        <div className="flex-1 bg-white px-12 py-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="max-w-2xl mx-auto pb-20">
            <h1 className="text-3xl font-semibold text-[#222222] mb-8">
              Description
            </h1>
             <p className="text-base text-[#717171] mb-8">
              Parlez de ce qui rend votre logement unique.
            </p>

            <div className="space-y-4">
              {descriptionFields.map((field) => (
                <button
                  key={field.id}
                  onClick={() => {
                    setSelectedDescriptionField(field.id);
                    setTempDescriptionText(
                      field.id === 'description' ? descriptionText :
                      field.id === 'my-place' ? myPlaceText :
                      field.id === 'access' ? guestAccessText :
                      field.id === 'interaction' ? interactionText :
                      notesText
                    );
                  }}
                  className="w-full text-left p-0 transition-colors group border-b border-gray-200 py-6 first:pt-0 hover:bg-transparent"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-[#222222]">{field.label}</span>
                    <svg className="w-5 h-5 text-[#222222]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm text-[#717171] line-clamp-2">
                    {getDescriptionPreview(field.id)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Amenities content
    if (selectedSection === 'amenities') {
      const selectedAmenities = amenitiesList.filter(a => a.selected);
      
      return (
        <div className="flex-1 bg-white px-12 py-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="max-w-3xl mx-auto pb-20">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-[#222222] mb-2">
                  Équipements
                </h1>
                <p className="text-base text-[#717171]">
                  Vous avez ajouté ces équipements à votre annonce.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditingAmenities(!isEditingAmenities)}
                  className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-sm font-semibold text-[#222222]"
                >
                  {isEditingAmenities ? 'Terminé' : 'Modifier'}
                </button>
                {!isEditingAmenities && (
                  <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-[#222222]">
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {selectedAmenities.map((amenity) => (
                <div key={amenity.id} className="flex items-start gap-4">
                  {isEditingAmenities && (
                     <button 
                        onClick={() => {
                          setAmenitiesList(amenitiesList.map(a => 
                            a.id === amenity.id ? { ...a, selected: false } : a
                          ));
                        }}
                        className="mt-0 text-[#222222] hover:opacity-70 transition-colors flex-shrink-0"
                     >
                       <MinusCircle className="w-8 h-8 stroke-1" />
                     </button>
                  )}
                  
                  <div className="flex-1 flex items-start gap-4">
                     <div className="text-[#222222] flex-shrink-0">
                       {getAmenityIcon(amenity.iconName, "w-8 h-8")}
                     </div>
                     <div className="flex-1 border-b border-gray-100 pb-6">
                       <p className="text-base text-[#222222] mb-1 leading-normal">
                         {amenity.label}
                       </p>
                       {amenity.description && (
                         <p className="text-sm text-[#717171] leading-normal max-w-lg">
                           {amenity.description}
                         </p>
                       )}
                     </div>
                  </div>

                  {isEditingAmenities && (
                    <button className="mt-0 text-[#222222] hover:bg-gray-100 p-2 rounded-full transition-colors flex-shrink-0">
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Cancellation content
    if (selectedSection === 'cancellation') {
      // Editor Mode
      if (cancellationEditMode) {
        return (
          <div className="flex-1 bg-white px-12 py-8 flex flex-col h-[calc(100vh-80px)] overflow-hidden relative">
            <div className="max-w-2xl mx-auto w-full flex-1 overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <h1 className="text-3xl font-semibold text-[#222222] mb-8">
                {cancellationEditMode === 'short' ? 'Séjours courte durée' : 'Séjours longue durée'}
              </h1>

              <div className="space-y-4">
                {(cancellationEditMode === 'short' ? shortTermOptions : longTermOptions).map((option) => {
                  const isSelected = cancellationEditMode === 'short' 
                    ? tempCancellationShort === option.label 
                    : tempCancellationLong === option.label;
                  
                  return (
                    <div 
                      key={option.label}
                      onClick={() => {
                        if (cancellationEditMode === 'short') setTempCancellationShort(option.label);
                        else setTempCancellationLong(option.label);
                      }}
                      className={`relative border rounded-xl p-6 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-2 border-black bg-gray-50' 
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                    >
                       <div className="flex justify-between items-start mb-2">
                         <h3 className="text-base font-semibold text-[#222222]">{option.label}</h3>
                         <Info className="w-5 h-5 text-[#717171]" strokeWidth={1.5} />
                       </div>
                       <ul className="space-y-1">
                         {option.description.map((desc, i) => (
                           <li key={i} className="text-sm text-[#717171] flex items-start gap-2">
                             <span className="mt-1.5 w-1 h-1 rounded-full bg-[#717171] flex-shrink-0" />
                             <span className="leading-relaxed">{desc}</span>
                           </li>
                         ))}
                       </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="fixed bottom-0 right-0 w-[calc(100%-20rem)] bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10">
               <button 
                onClick={() => setCancellationEditMode(null)}
                className="px-6 py-3 text-[#222222] underline font-semibold hover:text-gray-600 transition-colors"
               >
                 Annuler
               </button>
               <button 
                onClick={handleSaveCancellation}
                disabled={isSaving}
                className="px-6 py-3 bg-[#222222] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
               >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
               </button>
            </div>
          </div>
        );
      }

      // Overview Mode
      return (
        <div className="flex-1 bg-white px-12 py-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="max-w-3xl mx-auto pb-20">
            <h1 className="text-3xl font-semibold text-[#222222] mb-4">
              Conditions d'annulation
            </h1>
            <p className="text-base text-[#717171] mb-8">
              Retrouvez l'intégralité des conditions dans <a href="#" className="underline font-semibold text-[#222222]">cet article</a> du Centre d'aide.
            </p>

            {/* Séjours courte durée */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-[#222222] mb-2">Séjours courte durée</h2>
              <p className="text-sm text-[#717171] mb-6 leading-relaxed">
                Ces conditions s'appliquent aux séjours de moins de 28 nuits. Toutes les conditions de séjour standard incluent une période d'annulation gratuite de 24 heures.
              </p>
              
              <div className="border border-gray-300 rounded-xl p-6 flex justify-between items-center mb-4">
                <div>
                  <p className="text-xs text-[#717171] mb-1">Vos conditions</p>
                  <p className="text-base font-semibold text-[#222222]">{cancellationPolicyShort}</p>
                </div>
                <button 
                  onClick={() => {
                    setTempCancellationShort(cancellationPolicyShort);
                    setCancellationEditMode('short');
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-[#222222] hover:bg-gray-200 transition-colors"
                >
                  Modifier
                </button>
              </div>

              <div className="border border-gray-300 rounded-xl p-6 flex justify-between items-center">
                <div className="pr-8">
                  <p className="text-base font-semibold text-[#222222] mb-1">Option non remboursable</p>
                  <p className="text-sm text-[#717171] leading-relaxed">
                    Les voyageurs peuvent bénéficier de 10 % de réduction, mais vous recevez l'intégralité du paiement s'ils annulent. <a href="#" className="underline font-semibold text-[#222222]">En savoir plus</a>
                  </p>
                </div>
                <div 
                  className={`w-12 h-8 rounded-full p-1 cursor-pointer transition-colors ${nonRefundableOption ? 'bg-black' : 'bg-gray-300'}`}
                  onClick={() => setNonRefundableOption(!nonRefundableOption)}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${nonRefundableOption ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>

            {/* Séjours longue durée */}
            <div className="mb-10">
              <h2 className="text-lg font-semibold text-[#222222] mb-2">Séjours longue durée</h2>
              <p className="text-sm text-[#717171] mb-6 leading-relaxed">
                Ces conditions s'appliquent aux séjours de 28 nuits ou plus.
              </p>
              
              <div className="border border-gray-300 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-xs text-[#717171] mb-1">Vos conditions</p>
                  <p className="text-base font-semibold text-[#222222]">{cancellationPolicyLong}</p>
                </div>
                <button 
                  onClick={() => {
                    setTempCancellationLong(cancellationPolicyLong);
                    setCancellationEditMode('long');
                  }}
                  className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-[#222222] hover:bg-gray-200 transition-colors"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Co-hôtes content
    if (selectedSection === 'cohosts') {
      return (
        <div className="flex-1 bg-white px-12 py-8 flex flex-col items-center justify-center h-[calc(100vh-80px)]">
           <div className="max-w-md w-full flex flex-col items-center text-center">
              <div className="mb-8 w-48 h-48 relative">
                 <img 
                   src="https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=800" 
                   alt="Invitation co-hôte" 
                   className="w-full h-full object-cover rounded-2xl shadow-sm"
                   style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }} 
                 />
                 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-rose-100/50 to-teal-100/50 rounded-2xl mix-blend-overlay"></div>
              </div>
              
              <h1 className="text-2xl font-semibold text-[#222222] mb-4">
                Invitez un co-hôte
              </h1>
              
              <p className="text-[#717171] mb-8 leading-relaxed max-w-sm">
                Un co-hôte peut vous aider dans tous les domaines, de la gestion de votre calendrier à l'accueil des voyageurs.
              </p>
              
              <button className="text-[#222222] font-semibold underline text-sm mb-12 hover:text-gray-600 transition-colors">
                En savoir plus sur l'activité de co-hôte
              </button>
              
              <button 
                onClick={() => setShowCohostModal(true)}
                className="px-6 py-3 border border-[#222222] rounded-lg text-[#222222] font-semibold hover:bg-gray-50 transition-colors"
              >
                Commencer
              </button>
           </div>
        </div>
      );
    }

    // Custom Link content
    if (selectedSection === 'custom-link') {
      const remainingChars = 112 - tempCustomLink.length;
      const isModified = tempCustomLink !== customLink;

      return (
        <div className="flex-1 bg-white px-12 py-8 flex flex-col h-[calc(100vh-80px)] overflow-hidden">
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center relative">
             <div className="flex justify-center mb-8">
                <span className="text-xs font-semibold text-[#222222]">Caractères restants : {remainingChars}/112</span>
             </div>

             <div className="flex justify-center items-center mb-16">
               <span className="text-5xl font-semibold text-[#222222] tracking-tight">homiqio.com/h/</span>
               <input 
                  type="text" 
                  value={tempCustomLink}
                  onChange={(e) => setTempCustomLink(e.target.value.slice(0, 112))}
                  className="text-5xl font-semibold text-[#222222] tracking-tight bg-transparent border-none outline-none p-0 focus:ring-0 w-auto min-w-[1ch] placeholder-gray-300"
                  style={{ width: `${Math.max(1, tempCustomLink.length)}ch` }}
                  autoFocus
               />
             </div>

             <div className="flex justify-center">
               <div className="w-12 h-12 bg-[#F7F7F7] rounded-full flex items-center justify-center">
                 <Lightbulb className="w-6 h-6 text-[#717171] fill-[#717171] bg-opacity-20" strokeWidth={2} />
               </div>
             </div>
          </div>

          <div className="fixed bottom-0 right-0 w-[calc(100%-20rem)] bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10">
             <button 
              onClick={() => {
                setTempCustomLink(customLink);
                // Optionally navigate back
              }}
              className="px-6 py-3 text-[#222222] underline font-semibold hover:text-gray-600 transition-colors"
             >
               Annuler
             </button>
             <button 
              onClick={handleSaveCustomLink}
              disabled={!isModified || isSaving}
              className="px-6 py-3 bg-[#222222] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-[#DDDDDD]"
             >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
             </button>
          </div>
        </div>
      );
    }

    // Reservation params content
    if (selectedSection === 'reservation-params') {
      const isModified = tempReservationMode !== reservationMode || tempRequireGoodReviews !== requireGoodReviews;

      return (
        <div className="flex-1 bg-white px-12 py-8 flex flex-col h-[calc(100vh-80px)] overflow-hidden">
           <div className="max-w-3xl mx-auto w-full flex-1 overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <h1 className="text-3xl font-semibold text-[#222222] mb-8">Paramètres de réservation</h1>
              
              <div className="space-y-4">
                 {/* Option 1: First 5 */}
                 <div 
                   onClick={() => setTempReservationMode('first_5')}
                   className={`border rounded-xl p-6 cursor-pointer transition-all ${
                     tempReservationMode === 'first_5' 
                       ? 'border-2 border-black bg-white' 
                       : 'border-gray-300 hover:border-gray-900 bg-white'
                   }`}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <h3 className="text-base font-semibold text-[#222222] mb-1">Confirmez vos 5 premières réservations</h3>
                          {tempReservationMode === 'first_5' && (
                            <p className="text-sm text-emerald-600 font-medium mb-1">0 réservation acceptée manuellement sur 5</p>
                          )}
                       </div>
                       <CalendarCheck className="w-6 h-6 text-[#222222]" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm text-[#717171] leading-relaxed max-w-xl">
                      Commencer par examiner les demandes de réservation, puis passer à la réservation instantanée afin que les voyageurs puissent réserver automatiquement.
                    </p>
                 </div>

                 {/* Option 2: Instant Book */}
                 <div 
                   onClick={() => setTempReservationMode('instant')}
                   className={`border rounded-xl p-6 cursor-pointer transition-all ${
                     tempReservationMode === 'instant' 
                       ? 'border-2 border-black bg-white' 
                       : 'border-gray-300 hover:border-gray-900 bg-white'
                   }`}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-base font-semibold text-[#222222]">Utiliser la réservation instantanée</h3>
                       <Zap className="w-6 h-6 text-[#222222]" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm text-[#717171] leading-relaxed max-w-xl mb-6">
                      Autoriser les voyageurs à réserver automatiquement afin d'obtenir plus de réservations.
                    </p>

                    {/* Expanded content for Instant Book */}
                    {tempReservationMode === 'instant' && (
                       <div className="border-t border-gray-100 pt-6 mt-6 space-y-6 animate-in slide-in-from-top-2 duration-200">
                          {/* Toggle */}
                          <div className="flex items-start justify-between">
                             <div className="pr-4">
                                <h4 className="text-sm font-normal text-[#222222] mb-1">Demander des évaluations positives</h4>
                                <p className="text-sm text-[#717171] leading-relaxed">
                                  Autoriser uniquement les voyageurs ayant déjà séjourné sur Airbnb sans causer de problèmes. <a href="#" className="underline font-semibold text-[#222222]">En savoir plus</a>
                                </p>
                             </div>
                             <div 
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setTempRequireGoodReviews(!tempRequireGoodReviews);
                               }}
                               className={`w-12 h-8 rounded-full p-1 cursor-pointer transition-colors flex-shrink-0 ${
                                 tempRequireGoodReviews ? 'bg-black' : 'bg-gray-300'
                               }`}
                             >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                                  tempRequireGoodReviews ? 'translate-x-4' : 'translate-x-0'
                                }`} />
                             </div>
                          </div>

                          {/* Link item */}
                          <button className="w-full flex items-center justify-between group text-left hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                             <div>
                                <h4 className="text-sm font-normal text-[#222222] mb-1">Ajouter un message personnalisé</h4>
                                <p className="text-sm text-[#717171]">Les voyageurs doivent le lire avant de réserver.</p>
                             </div>
                             <svg className="w-5 h-5 text-[#222222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                             </svg>
                          </button>
                       </div>
                    )}
                 </div>

                 {/* Option 3: Manual */}
                 <div 
                   onClick={() => setTempReservationMode('manual')}
                   className={`border rounded-xl p-6 cursor-pointer transition-all ${
                     tempReservationMode === 'manual' 
                       ? 'border-2 border-black bg-white' 
                       : 'border-gray-300 hover:border-gray-900 bg-white'
                   }`}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-base font-semibold text-[#222222]">Accepter toutes les réservations manuellement</h3>
                       <MessageSquare className="w-6 h-6 text-[#222222]" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm text-[#717171] leading-relaxed max-w-xl">
                      Toujours vérifier les demandes de réservation.
                    </p>
                 </div>
              </div>
           </div>

           <div className="fixed bottom-0 right-0 w-[calc(100%-20rem)] bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10">
              <button 
               onClick={() => {
                 setTempReservationMode(reservationMode);
                 setTempRequireGoodReviews(requireGoodReviews);
               }}
               className="px-6 py-3 text-[#222222] underline font-semibold hover:text-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button 
               onClick={handleSaveReservationParams}
               disabled={!isModified || isSaving}
               className="px-6 py-3 bg-[#222222] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-[#DDDDDD]"
              >
                 {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
           </div>
        </div>
      );
    }

    // House Rules content
    if (selectedSection === 'house-rules') {
      const isModified = 
        tempPetsAllowed !== petsAllowed || 
        tempMaxPets !== maxPets ||
        tempEventsAllowed !== eventsAllowed ||
        tempSmokingAllowed !== smokingAllowed ||
        tempQuietHours !== quietHours ||
        tempQuietHoursStart !== quietHoursStart ||
        tempQuietHoursEnd !== quietHoursEnd ||
        tempCommercialPhotoAllowed !== commercialPhotoAllowed;

      return (
        <div className="flex-1 bg-white px-12 py-8 flex flex-col h-[calc(100vh-80px)] overflow-hidden">
          <div className="max-w-3xl mx-auto w-full flex-1 overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
             <h1 className="text-3xl font-semibold text-[#222222] mb-4">Règlement intérieur</h1>
             <p className="text-[#717171] mb-8">
               Les voyageurs sont tenus de respecter vos règles. En cas de manquement, ils pourraient être exclus d'Airbnb.
             </p>

             <div className="divide-y divide-gray-100">
               {/* Animaux acceptés */}
               <div className="py-6">
                 <div className="flex justify-between items-start">
                   <div className="pr-12">
                     <h3 className="text-base font-medium text-[#222222] mb-1">Animaux acceptés</h3>
                     <p className="text-sm text-[#717171] mb-1">
                       Vous pouvez refuser les animaux de compagnie, mais vous devez faire le nécessaire, dans la mesure du raisonnable, pour accueillir les animaux d'assistance.
                     </p>
                     <button className="text-sm font-semibold underline text-[#222222] hover:text-gray-600 transition-colors">En savoir plus</button>
                   </div>
                   <div className="flex items-center gap-3 flex-shrink-0">
                      <button 
                        onClick={() => setTempPetsAllowed(false)}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                          !tempPetsAllowed 
                            ? 'bg-black border-black text-white' 
                            : 'border-gray-200 text-[#717171] hover:border-black'
                        }`}
                      >
                        <X className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => setTempPetsAllowed(true)}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                          tempPetsAllowed 
                            ? 'bg-black border-black text-white' 
                            : 'border-gray-200 text-[#717171] hover:border-black'
                        }`}
                      >
                        <Check className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                   </div>
                 </div>
                 
                 {/* Conditional Max Pets */}
                 {tempPetsAllowed && (
                   <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
                      <span className="text-base text-[#222222]">Nombre maximal d'animaux autorisés</span>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setTempMaxPets(Math.max(1, tempMaxPets - 1))}
                          disabled={tempMaxPets <= 1}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black disabled:opacity-30 disabled:hover:border-gray-300"
                        >
                          <Minus className="w-4 h-4 text-[#717171]" />
                        </button>
                        <span className="text-base font-medium text-[#222222] w-4 text-center">{tempMaxPets}</span>
                        <button 
                          onClick={() => setTempMaxPets(tempMaxPets + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"
                        >
                          <Plus className="w-4 h-4 text-[#717171]" />
                        </button>
                      </div>
                   </div>
                 )}
               </div>

               {/* Événements autorisés */}
               <div className="py-6 flex justify-between items-center">
                 <span className="text-base text-[#222222]">Événements autorisés</span>
                 <div className="flex items-center gap-3 flex-shrink-0">
                    <button 
                      onClick={() => setTempEventsAllowed(false)}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                        !tempEventsAllowed 
                          ? 'bg-black border-black text-white' 
                          : 'border-gray-200 text-[#717171] hover:border-black'
                      }`}
                    >
                      <X className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => setTempEventsAllowed(true)}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                        tempEventsAllowed 
                          ? 'bg-black border-black text-white' 
                          : 'border-gray-200 text-[#717171] hover:border-black'
                      }`}
                    >
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                 </div>
               </div>

               {/* Autorisation de fumer */}
               <div className="py-6 flex justify-between items-center">
                 <span className="text-base text-[#222222]">Autorisation de fumer et de vapoter</span>
                 <div className="flex items-center gap-3 flex-shrink-0">
                    <button 
                      onClick={() => setTempSmokingAllowed(false)}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                        !tempSmokingAllowed 
                          ? 'bg-black border-black text-white' 
                          : 'border-gray-200 text-[#717171] hover:border-black'
                      }`}
                    >
                      <X className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => setTempSmokingAllowed(true)}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                        tempSmokingAllowed 
                          ? 'bg-black border-black text-white' 
                          : 'border-gray-200 text-[#717171] hover:border-black'
                      }`}
                    >
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                 </div>
               </div>

               {/* Horaires où le calme doit être respecté */}
               <div className="py-6">
                 <div className="flex justify-between items-center">
                   <span className="text-base text-[#222222]">Horaires où le calme doit être respecté</span>
                   <div className="flex items-center gap-3 flex-shrink-0">
                      <button 
                        onClick={() => setTempQuietHours(false)}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                          !tempQuietHours 
                            ? 'bg-black border-black text-white' 
                            : 'border-gray-200 text-[#717171] hover:border-black'
                        }`}
                      >
                        <X className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                      <button 
                        onClick={() => setTempQuietHours(true)}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                          tempQuietHours 
                            ? 'bg-black border-black text-white' 
                            : 'border-gray-200 text-[#717171] hover:border-black'
                        }`}
                      >
                        <Check className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                   </div>
                 </div>

                 {/* Conditional Quiet Hours Times */}
                 {tempQuietHours && (
                   <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="relative">
                        <label className="absolute top-2 left-3 text-xs text-[#717171]">Heure de début</label>
                        <select 
                          value={tempQuietHoursStart}
                          onChange={(e) => setTempQuietHoursStart(e.target.value)}
                          className="w-full px-3 pt-6 pb-2 border border-gray-400 rounded-lg appearance-none bg-transparent hover:border-black focus:ring-0 focus:border-black cursor-pointer text-[#222222]"
                        >
                          <option value="22:00">22:00</option>
                          <option value="23:00">23:00</option>
                          <option value="00:00">00:00</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#222222] pointer-events-none" />
                      </div>
                      <div className="relative">
                        <label className="absolute top-2 left-3 text-xs text-[#717171]">Heure de fin</label>
                        <select 
                          value={tempQuietHoursEnd}
                          onChange={(e) => setTempQuietHoursEnd(e.target.value)}
                          className="w-full px-3 pt-6 pb-2 border border-gray-400 rounded-lg appearance-none bg-transparent hover:border-black focus:ring-0 focus:border-black cursor-pointer text-[#222222]"
                        >
                          <option value="06:00">06:00</option>
                          <option value="07:00">07:00</option>
                          <option value="08:00">08:00</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#222222] pointer-events-none" />
                      </div>
                   </div>
                 )}
               </div>

               {/* Photographie commerciale */}
               <div className="py-6 flex justify-between items-center">
                 <span className="text-base text-[#222222]">Photographie commerciale et tournages autorisés</span>
                 <div className="flex items-center gap-3 flex-shrink-0">
                    <button 
                      onClick={() => setTempCommercialPhotoAllowed(false)}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                        !tempCommercialPhotoAllowed 
                          ? 'bg-black border-black text-white' 
                          : 'border-gray-200 text-[#717171] hover:border-black'
                      }`}
                    >
                      <X className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => setTempCommercialPhotoAllowed(true)}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${
                        tempCommercialPhotoAllowed 
                          ? 'bg-black border-black text-white' 
                          : 'border-gray-200 text-[#717171] hover:border-black'
                      }`}
                    >
                      <Check className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                 </div>
               </div>

               {/* Nombre de voyageurs */}
               <div className="py-6 flex justify-between items-center">
                 <span className="text-base text-[#222222]">Nombre de voyageurs</span>
                 <div className="flex items-center gap-4">
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black disabled:opacity-30">
                      <Minus className="w-4 h-4 text-[#717171]" />
                    </button>
                    <span className="text-base font-medium text-[#222222] w-6 text-center">16+</span>
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black">
                      <Plus className="w-4 h-4 text-[#717171]" />
                    </button>
                 </div>
               </div>

               {/* Heures d'arrivée et de départ */}
               <button className="w-full py-6 flex justify-between items-center hover:bg-transparent group text-left">
                 <span className="text-base text-[#222222]">Heures d'arrivée et de départ</span>
                 <svg className="w-5 h-5 text-[#222222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M9 18l6-6-6-6" />
                 </svg>
               </button>

               {/* Règles supplémentaires */}
               <button className="w-full py-6 flex justify-between items-center hover:bg-transparent group text-left">
                 <div>
                   <h3 className="text-base font-medium text-[#222222] mb-1">Règles supplémentaires</h3>
                   <p className="text-sm text-[#717171]">Dites-en plus sur ce que vous attendez des voyageurs.</p>
                 </div>
                 <svg className="w-5 h-5 text-[#222222]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                   <path d="M9 18l6-6-6-6" />
                 </svg>
               </button>

             </div>
          </div>

          <div className="fixed bottom-0 right-0 w-[calc(100%-20rem)] bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10">
             <button 
              onClick={() => {
                setTempPetsAllowed(petsAllowed);
                setTempMaxPets(maxPets);
                setTempEventsAllowed(eventsAllowed);
                setTempSmokingAllowed(smokingAllowed);
                setTempQuietHours(quietHours);
                setTempQuietHoursStart(quietHoursStart);
                setTempQuietHoursEnd(quietHoursEnd);
                setTempCommercialPhotoAllowed(commercialPhotoAllowed);
              }}
              className="px-6 py-3 text-[#222222] underline font-semibold hover:text-gray-600 transition-colors"
             >
               Annuler
             </button>
             <button 
              onClick={handleSaveHouseRules}
              disabled={!isModified || isSaving}
              className="px-6 py-3 bg-[#222222] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-[#DDDDDD]"
             >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
             </button>
          </div>
        </div>
      );
    }

    // Safety content
    if (selectedSection === 'safety') {
      // Helper to get summary text for instructions
      const getInstructionsSummary = () => {
        const yesItems = Object.entries(safetyItems)
          .filter(([_, value]) => value === 'yes')
          .map(([id]) => safetyQuestions.find(q => q.id === id)?.title)
          .filter(Boolean);
          
        if (yesItems.length > 0) return yesItems;
        return "Ajoutez des informations.";
      };

      const instructionsSummary = getInstructionsSummary();

      const safetySections = [
        {
          id: 'instructions',
          label: 'Consignes de sécurité',
          value: instructionsSummary,
          isList: Array.isArray(instructionsSummary),
          hasValue: Array.isArray(instructionsSummary) ? instructionsSummary.length > 0 : false
        },
        {
          id: 'devices',
          label: 'Dispositifs de sécurité',
          value: safetyDevices.length > 0 ? safetyDevices : "Ajoutez des informations.",
          isList: true,
          hasValue: safetyDevices.length > 0
        },
        {
          id: 'property_info',
          label: 'Informations sur le logement',
          value: propertySafetyInfo.length > 0 ? propertySafetyInfo : "Ajoutez des informations.",
          isList: true,
          hasValue: propertySafetyInfo.length > 0
        }
      ];

      // Editor Mode
      if (selectedSafetyField) {
        const getEditorTitle = () => {
          switch(selectedSafetyField) {
            case 'instructions': return "Consignes de sécurité";
            case 'devices': return "Dispositifs de sécurité";
            case 'property_info': return "Informations sur le logement";
            default: return "";
          }
        };

        return (
          <div className="flex-1 bg-white px-12 py-8 flex flex-col h-[calc(100vh-80px)] overflow-hidden relative">
            <div className="max-w-2xl mx-auto w-full flex-1 overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <h1 className="text-3xl font-semibold text-[#222222] mb-8">
                {getEditorTitle()}
              </h1>

              {selectedSafetyField === 'instructions' && (
                <div className="divide-y divide-gray-100">
                  {safetyQuestions.map((question) => {
                    const value = tempSafetyItems[question.id];
                    return (
                      <div key={question.id} className="flex justify-between items-start py-8 first:pt-0">
                        <div className="flex-1 pr-12">
                          <h3 className="text-base font-medium text-[#222222] mb-1">{question.title}</h3>
                          <p className="text-sm text-[#717171] mb-2 leading-relaxed">{question.description}</p>
                          <button className="text-sm font-semibold underline text-[#222222] hover:text-gray-600 transition-colors">En savoir plus</button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setTempSafetyItems(prev => ({ ...prev, [question.id]: 'no' }))}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                              value === 'no' 
                                ? 'bg-[#222222] border-[#222222] text-white' 
                                : 'border-gray-300 text-[#717171] hover:border-[#222222]'
                            }`}
                          >
                            <X className="w-5 h-5" strokeWidth={2.5} />
                          </button>
                          <button 
                            onClick={() => setTempSafetyItems(prev => ({ ...prev, [question.id]: 'yes' }))}
                            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                              value === 'yes' 
                                ? 'bg-[#222222] border-[#222222] text-white' 
                                : 'border-gray-300 text-[#717171] hover:border-[#222222]'
                            }`}
                          >
                            <Check className="w-5 h-5" strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedSafetyField === 'devices' && (
                <div className="space-y-6">
                  <p className="text-sm text-[#717171] mb-4">
                    Indiquez les dispositifs présents dans votre logement.
                  </p>
                  {safetyDeviceOptions.map((option) => (
                    <label key={option} className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                        tempSafetyDevices.includes(option) ? 'bg-black border-black' : 'border-gray-400 group-hover:border-black'
                      }`}>
                        {tempSafetyDevices.includes(option) && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-base text-[#222222]">{option}</span>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={tempSafetyDevices.includes(option)}
                        onChange={() => {
                          if (tempSafetyDevices.includes(option)) {
                            setTempSafetyDevices(tempSafetyDevices.filter(d => d !== option));
                          } else {
                            setTempSafetyDevices([...tempSafetyDevices, option]);
                          }
                        }}
                      />
                    </label>
                  ))}
                </div>
              )}

              {selectedSafetyField === 'property_info' && (
                <div className="space-y-6">
                  <p className="text-sm text-[#717171] mb-4">
                    Signalez tout élément important concernant la sécurité de votre logement.
                  </p>
                  {propertySafetyOptions.map((option) => (
                    <label key={option} className="flex items-center gap-4 cursor-pointer group">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                        tempPropertySafetyInfo.includes(option) ? 'bg-black border-black' : 'border-gray-400 group-hover:border-black'
                      }`}>
                        {tempPropertySafetyInfo.includes(option) && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-base text-[#222222]">{option}</span>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={tempPropertySafetyInfo.includes(option)}
                        onChange={() => {
                          if (tempPropertySafetyInfo.includes(option)) {
                            setTempPropertySafetyInfo(tempPropertySafetyInfo.filter(d => d !== option));
                          } else {
                            setTempPropertySafetyInfo([...tempPropertySafetyInfo, option]);
                          }
                        }}
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="fixed bottom-0 right-0 w-[calc(100%-20rem)] bg-white border-t border-gray-200 p-4 flex justify-between items-center z-10">
               <button 
                onClick={() => setSelectedSafetyField(null)}
                className="px-6 py-3 text-[#222222] underline font-semibold hover:text-gray-600 transition-colors"
               >
                 Annuler
               </button>
               <button 
                onClick={handleSaveSafety}
                disabled={isSaving}
                className="px-6 py-3 bg-[#222222] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
               >
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
               </button>
            </div>
          </div>
        );
      }

      // Overview Mode
      return (
        <div className="flex-1 bg-white px-12 py-8 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="max-w-3xl mx-auto pb-20">
            <h1 className="text-3xl font-semibold text-[#222222] mb-4">
              Sécurité des voyageurs
            </h1>
            <p className="text-base text-[#717171] mb-12 max-w-2xl leading-relaxed">
              Les informations liées à la sécurité que vous communiquez s'affichent sur votre annonce aux côtés d'autres renseignements, comme votre règlement intérieur.
            </p>

            <div className="space-y-4">
              {safetySections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedSafetyField(section.id);
                    if (section.id === 'instructions') setTempSafetyItems(safetyItems);
                    else if (section.id === 'devices') setTempSafetyDevices(safetyDevices);
                    else if (section.id === 'property_info') setTempPropertySafetyInfo(propertySafetyInfo);
                  }}
                  className="w-full text-left p-0 transition-colors group border-b border-gray-200 py-6 first:pt-0 hover:bg-transparent"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-semibold text-[#222222]">{section.label}</span>
                    <svg className="w-5 h-5 text-[#222222]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="pr-8">
                    {section.isList && Array.isArray(section.value) ? (
                      <div className="flex flex-col gap-1">
                        {section.value.map((item, i) => (
                          <p key={i} className="text-sm text-[#717171]">{item}</p>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-sm ${section.hasValue ? 'text-[#717171]' : 'text-[#717171]'}`}>
                        {section.value as string}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Mon logement content
    if (selectedSection === 'photos') {
      return (
        <div className="flex-1 bg-white">
          {/* Header */}
          <div className="px-12 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
                Photos
              </h1>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-900 transition-all flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                    Toutes les photos
                  </span>
                </button>
                <button className="w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-base" style={{ color: '#717171' }}>
              Gérez les photos et ajoutez des informations. Les voyageurs ne verront votre visite photo que s'il y a une photo pour chaque pièce.
            </p>
          </div>

          {/* Photos Grid */}
          <div className="px-12 py-8">
            <div className="grid grid-cols-4 gap-4">
              {/* Living Room */}
              <div className="border border-gray-300 rounded-xl overflow-hidden hover:border-gray-900 transition-all cursor-pointer">
                {uploadedPhotos[0] && (
                  <img src={uploadedPhotos[0]} alt="Espace repas" className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Espace repas
                  </h3>
                  <p className="text-xs mb-2" style={{ color: '#717171' }}>
                    <span style={{ color: '#222222' }}>●</span> 1 photo
                  </p>
                </div>
              </div>

              {/* Bedroom */}
              <div className="border border-gray-300 rounded-xl overflow-hidden hover:border-gray-900 transition-all cursor-pointer">
                {uploadedPhotos[1] && (
                  <img src={uploadedPhotos[1]} alt="Chambre" className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Chambre
                  </h3>
                  <p className="text-xs mb-2" style={{ color: '#717171' }}>
                    <span style={{ color: '#222222' }}>●</span> 2 photos
                  </p>
                </div>
              </div>

              {/* Bathroom */}
              <div className="border border-gray-300 rounded-xl overflow-hidden hover:border-gray-900 transition-all cursor-pointer">
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Salle de bain
                  </h3>
                  <p className="text-xs mb-2" style={{ color: '#717171' }}>
                    Ajoutez des photos
                  </p>
                </div>
              </div>

              {/* Exterior */}
              <div className="border border-gray-300 rounded-xl overflow-hidden hover:border-gray-900 transition-all cursor-pointer">
                {uploadedPhotos[2] && (
                  <img src={uploadedPhotos[2]} alt="Extérieur" className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Extérieur
                  </h3>
                  <p className="text-xs mb-2" style={{ color: '#717171' }}>
                    <span style={{ color: '#222222' }}>●</span> 2 photos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
// ... (I will truncate the rest again in the thought but I sent the full content in the actual tool call)
    return (
      <div className="flex-1 bg-white px-12 py-8">
        <h1 className="text-3xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
          {selectedSection === 'title' && 'Titre'}
          {selectedSection === 'type' && 'Type de logement'}
          {selectedSection === 'pricing' && 'Tarification'}
          {selectedSection === 'availability' && 'Disponibilités'}
          {selectedSection === 'guests' && 'Nombre de voyageurs'}
          {selectedSection === 'location' && 'Localisation'}
          {selectedSection === 'host' && 'Hôte'}
          {selectedSection === 'cohosts' && 'Co-hôtes'}
          {selectedSection === 'reservation-params' && 'Paramètres de réservation'}
          {selectedSection === 'house-rules' && 'Règles de la maison'}
        </h1>
        <p style={{ color: '#717171' }}>Contenu à venir...</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Host Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between z-20">
        <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
          <svg width="102" height="32" viewBox="0 0 102 32" fill="none">
            <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#10B981"/>
            <text x="36" y="22" style={{ fontSize: '18px', fontWeight: 700, fill: '#10B981', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              HOMIQIO
            </text>
          </svg>
        </button>

        {/* Host Navigation */}
        <nav className="flex items-center gap-8">
          <button className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#717171' }}>
            Aujourd'hui
          </button>
          <button className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#717171' }}>
            Calendrier
          </button>
          <button 
            onClick={() => onNavigate('annonces')}
            className="text-sm hover:opacity-70 transition-opacity pb-3 border-b-2 border-gray-900" 
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Annonces
          </button>
          <button 
            onClick={() => onNavigate('messages')}
            className="text-sm hover:opacity-70 transition-opacity" 
            style={{ color: '#717171' }}
          >
            Messages
          </button>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('annonces')}
            className="text-sm hover:opacity-70 transition-opacity" 
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Passer en mode voyageur
          </button>
          <button className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm hover:opacity-90 transition-opacity">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto sticky top-0 h-screen">
          {/* Back Button */}
          <button 
            onClick={() => onNavigate('annonces')}
            className="mb-6 flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
            </span>
          </button>

          <h2 className="text-2xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
            Outil de modification d'annonce
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('mon-logement')}
              className={`flex-1 px-4 py-2 rounded-full text-sm transition-all ${
                activeTab === 'mon-logement'
                  ? 'bg-white border-2 border-gray-900'
                  : 'bg-gray-100 border-2 border-transparent hover:border-gray-300'
              }`}
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Mon logement
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 px-4 py-2 rounded-full text-sm transition-all ${
                activeTab === 'guide'
                  ? 'bg-white border-2 border-gray-900'
                  : 'bg-gray-100 border-2 border-transparent hover:border-gray-300'
              }`}
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Guide d'arrivée
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>
          </div>

          {/* Required Steps */}
          <div className="mb-6">
            <button className="w-full flex items-center justify-between py-3 hover:opacity-70 transition-opacity">
              <div className="flex items-start gap-2">
                <span className="text-red-500 text-lg">●</span>
                <div className="text-left">
                  <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                    Suivez les étapes requises
                  </p>
                  <p className="text-xs" style={{ color: '#717171' }}>
                    Terminez ces dernières tâches pour publier votre annonce et commencer à recevoir des réservations.
                  </p>
                </div>
              </div>
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {activeTab === 'mon-logement' ? (
              <>
            {/* Photos */}
            <button
              onClick={() => setSelectedSection('photos')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'photos' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  {uploadedPhotos[0] && (
                    <img src={uploadedPhotos[0]} alt="Photos" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Photos
                  </p>
                  <p className="text-xs" style={{ color: '#717171' }}>
                    Présentez vos photos par pièce, instantanément
                  </p>
                </div>
                {uploadedPhotos.length > 0 && (
                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Title */}
            <button
              onClick={() => setSelectedSection('title')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'title' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Titre
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                {listingTitle}
              </p>
            </button>

            {/* Type de logement */}
            <button
              onClick={() => setSelectedSection('type')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'type' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Type de logement
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                Logement entier · Maison
              </p>
            </button>

            {/* Tarification */}
            <button
              onClick={() => setSelectedSection('pricing')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'pricing' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Tarification
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                $26 par nuit
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                Tarif week-end de $26
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                Réduction à la semaine de 10 %
              </p>
            </button>

            {/* Disponibilités */}
            <button
              onClick={() => setSelectedSection('availability')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'availability' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Disponibilités
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                Séjours de 1 à 365 nuits
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                Délai de réservation avant l'arrivée: le jour même
              </p>
            </button>

            {/* Nombre de voyageurs */}
            <button
              onClick={() => setSelectedSection('guests')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'guests' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Nombre de voyageurs
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                2 voyageurs
              </p>
            </button>

            {/* Description */}
            <button
              onClick={() => setSelectedSection('description')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'description' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Description
              </p>
              <p className="text-sm line-clamp-2" style={{ color: '#717171' }}>
                Profitez de cette jolie maison de campagne paisible et central. Vous avez l'appartement de vivre dans un endroit calme et très accueilli.
              </p>
            </button>

            {/* Équipements */}
            <button
              onClick={() => setSelectedSection('amenities')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'amenities' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-3" style={{ fontWeight: 600, color: '#222222' }}>
                Équipements
              </p>
              <div className="space-y-3">
                {amenitiesList.filter(a => a.selected).slice(0, 3).map(amenity => (
                  <div key={amenity.id} className="flex items-center gap-3">
                    <div className="text-[#717171]">
                      {getAmenityIcon(amenity.iconName, "w-5 h-5")}
                    </div>
                    <span className="text-sm text-[#717171] line-clamp-1">{amenity.label}</span>
                  </div>
                ))}
                {amenitiesList.filter(a => a.selected).length > 3 && (
                  <p className="text-sm text-[#717171] pl-8">
                    + {amenitiesList.filter(a => a.selected).length - 3} autres
                  </p>
                )}
              </div>
            </button>

            {/* Éléments d'accessibilité */}
            <button
              onClick={() => setSelectedSection('accessibility')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'accessibility' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Éléments d'accessibilité
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                Ajoutez des informations
              </p>
            </button>

            {/* Lieu */}
            <button
              onClick={() => setSelectedSection('location')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'location' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <div className="w-full h-full relative">
                    {/* Simple map placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Lieu
                  </p>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Rue Rainitso Paul, Antananarivo, Madagascar
                  </p>
                </div>
              </div>
            </button>

            {/* À propos de l'hôte */}
            <button
              onClick={() => setSelectedSection('host')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'host' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                À propos de l'hôte
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm" style={{ fontWeight: 600 }}>R</span>
                </div>
                <div>
                  <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>Ravo</p>
                  <p className="text-xs" style={{ color: '#717171' }}>Hôte depuis 2025</p>
                </div>
              </div>
            </button>

            {/* Co-hôtes */}
            <button
              onClick={() => setSelectedSection('cohosts')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'cohosts' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Co-hôtes
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                Ajoutez des informations
              </p>
            </button>

            {/* Paramètres de réservation */}
            <button
              onClick={() => setSelectedSection('reservation-params')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'reservation-params' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Paramètres de réservation
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                Vous accepterez vos 5 premières réservations manuellement, puis vous passerez à la réservation instantanée.
              </p>
            </button>

            {/* Règlement intérieur */}
            <button
              onClick={() => setSelectedSection('house-rules')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'house-rules' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Règlement intérieur
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <p className="text-sm" style={{ color: '#717171' }}>Arrivée à partir de 15:00</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  </svg>
                  <p className="text-sm" style={{ color: '#717171' }}>2 voyageurs maximum</p>
                </div>
              </div>
            </button>

            {/* Sécurité des voyageurs */}
            <button
              onClick={() => setSelectedSection('safety')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'safety' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Sécurité des voyageurs
              </p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <p className="text-sm" style={{ color: '#717171' }}>Aucune indication de la présence d'un détecteur de monoxyde de carbone</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <p className="text-sm" style={{ color: '#717171' }}>Aucune indication de la présence d'un détecteur de monoxyde de carbone</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <p className="text-sm" style={{ color: '#717171' }}>Aucune indication de la présence d'un détecteur de fumée</p>
                </div>
              </div>
            </button>

            {/* Conditions d'annulation */}
            <button
              onClick={() => setSelectedSection('cancellation')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'cancellation' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Conditions d'annulation
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                Flexibles
              </p>
            </button>

            {/* Lien personnalisé */}
            <button
              onClick={() => setSelectedSection('custom-link')}
              className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                selectedSection === 'custom-link' ? 'bg-gray-100' : 'hover:bg-gray-50'
              }`}
            >
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Lien personnalisé
              </p>
              <p className="text-sm" style={{ color: '#717171' }}>
                Ajoutez des informations
              </p>
            </button>
              </>
            ) : (
              <>
                {/* Guide d'arrivée menu items */}
                <button
                  onClick={() => setSelectedGuideSection('arrival-departure')}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    selectedGuideSection === 'arrival-departure' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Horaires d'arrivée et de départ
                  </p>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Ajoutez des informations
                  </p>
                </button>

                <button
                  onClick={() => setSelectedGuideSection('itinerary')}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    selectedGuideSection === 'itinerary' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Itinéraire
                  </p>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Ajoutez des informations
                  </p>
                </button>

                <button
                  onClick={() => setSelectedGuideSection('check-in-procedure')}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    selectedGuideSection === 'check-in-procedure' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Procédure d'arrivée
                  </p>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Ajoutez des informations
                  </p>
                </button>

                <button
                  onClick={() => setSelectedGuideSection('wifi')}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    selectedGuideSection === 'wifi' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Informations sur le wifi
                  </p>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Ajoutez des informations
                  </p>
                </button>

                <button
                  onClick={() => setSelectedGuideSection('house-manual')}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    selectedGuideSection === 'house-manual' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Manuel de la maison
                  </p>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Ajoutez des informations
                  </p>
                </button>

                <button
                  onClick={() => setSelectedGuideSection('guide-house-rules')}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    selectedGuideSection === 'guide-house-rules' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Règlement intérieur
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <p className="text-sm" style={{ color: '#717171' }}>Arrivée à partir de 15:00</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      </svg>
                      <p className="text-sm" style={{ color: '#717171' }}>2 voyageurs maximum</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedGuideSection('departure-instructions')}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    selectedGuideSection === 'departure-instructions' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Instructions de départ
                  </p>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Ajoutez des informations
                  </p>
                </button>

                <button
                  onClick={() => setSelectedGuideSection('guides')}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    selectedGuideSection === 'guides' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Guides
                  </p>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Ajoutez des informations
                  </p>
                </button>
                
                <button
                  onClick={() => setSelectedGuideSection('guest-preferences')}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    selectedGuideSection === 'guest-preferences' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Interactions avec les voyageurs
                  </p>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Ajoutez des informations
                  </p>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Content */}
        {renderContent()}
      </div>
    </div>
  );
}
