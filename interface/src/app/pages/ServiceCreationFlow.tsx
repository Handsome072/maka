import { useState, useMemo, useCallback, memo } from "react";
import { X, MapPin, Navigation, Minus, Plus, Trash2, Link, Info, Calendar, MapPinned, MinusCircle, Pencil, ChevronUp, ChevronDown, ChevronRight, Heart } from "lucide-react";
const coachingImg = "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max";
const introImg = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max";
const editPriceIcon = "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=100&h=100&fit=crop"; // Placeholder

interface ServiceCreationFlowProps {
  onNavigate: (page: string) => void;
}

export function ServiceCreationFlow({ onNavigate }: ServiceCreationFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [showCityModal, setShowCityModal] = useState(false);
  const [experienceYears, setExperienceYears] = useState(12);
  
  // Qualifications
  const [experienceText, setExperienceText] = useState("");
  const [diplomaText, setDiplomaText] = useState("");
  const [careerHighlight, setCareerHighlight] = useState("");
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showDiplomaModal, setShowDiplomaModal] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [tempExperienceText, setTempExperienceText] = useState("");
  const [tempDiplomaText, setTempDiplomaText] = useState("");
  const [tempCareerText, setTempCareerText] = useState("");
  
  // Online Profiles
  const [websiteLinks, setWebsiteLinks] = useState<string[]>([]);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [websiteLink, setWebsiteLink] = useState("");
  
  // Address Info
  const [country, setCountry] = useState("Madagascar");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [commune, setCommune] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isBusinessHost, setIsBusinessHost] = useState<string | null>(null);

  // Service Location (Step 7)
  const [showServiceAreaModal, setShowServiceAreaModal] = useState(false);
  const [showMeetingPointModal, setShowMeetingPointModal] = useState(false);
  const [serviceAreaAddress, setServiceAreaAddress] = useState("");
  const [meetingPointAddress, setMeetingPointAddress] = useState("");
  const [isServiceAreaFocused, setIsServiceAreaFocused] = useState(false);
  const [isMeetingPointFocused, setIsMeetingPointFocused] = useState(false);
  const [showServiceAreaMap, setShowServiceAreaMap] = useState(false);
  const [showConfirmLocationModal, setShowConfirmLocationModal] = useState(false);
  const [showConfirmPinModal, setShowConfirmPinModal] = useState(false);
  const [locationDetails, setLocationDetails] = useState({
    country: "Madagascar",
    street: "Fianarantsoa",
    apartment: "",
    city: "Fianarantsoa",
    province: "Haute Matsiatra",
    postalCode: "303",
    placeName: ""
  });

  // Photos (Step 8)
  const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [tempPhotos, setTempPhotos] = useState<string[]>([]);

  // Title (Step 9)
  const [serviceTitle, setServiceTitle] = useState("");

  // Description (Step 10)
  const [serviceDescription, setServiceDescription] = useState("");

  // Offers (Step 12)
  const [showAddOfferModal, setShowAddOfferModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showChoosePhotoModal, setShowChoosePhotoModal] = useState(false);
  const [showAddInfoModal, setShowAddInfoModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showServiceTypeModal, setShowServiceTypeModal] = useState(false);
  const [showPriceTypeModal, setShowPriceTypeModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showPriceAdviceModal, setShowPriceAdviceModal] = useState(false);
  const [showPriceInfoModal, setShowPriceInfoModal] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerPhoto, setOfferPhoto] = useState<string | null>(null);
  const [selectedOfferPhoto, setSelectedOfferPhoto] = useState<string | null>(null);
  const [offerDescription, setOfferDescription] = useState("");

  // Schedule (Step 13)
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDaysDropdown, setShowDaysDropdown] = useState(false);
  const [editingScheduleIndex, setEditingScheduleIndex] = useState<number | null>(null);
  const [scheduleType, setScheduleType] = useState<'weekdays' | 'custom'>('weekdays');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);
  const [savedSchedules, setSavedSchedules] = useState<Array<{
    days: string[];
    startTime: string;
    endTime: string;
  }>>([
    {
      days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
      startTime: '08:00',
      endTime: '17:00'
    }
  ]);

  // Discounts (Step between 12 and 13)
  const [showLimitedTimeModal, setShowLimitedTimeModal] = useState(false);
  const [showEarlyBookingModal, setShowEarlyBookingModal] = useState(false);
  const [showGroupDiscountModal, setShowGroupDiscountModal] = useState(false);
  const [limitedTimeDiscount, setLimitedTimeDiscount] = useState(0);
  const [earlyBookingApplied, setEarlyBookingApplied] = useState(false);
  const [groupMinTravelers, setGroupMinTravelers] = useState('');
  const [groupDiscount, setGroupDiscount] = useState('');

  const [offerServiceType, setOfferServiceType] = useState("");
  const [offerPriceType, setOfferPriceType] = useState("Par voyageur");
  const [offerPrice, setOfferPrice] = useState("");
  const [offerDurationHours, setOfferDurationHours] = useState(0);
  const [offerDurationMinutes, setOfferDurationMinutes] = useState(0);
  const [offerGuests, setOfferGuests] = useState(1);
  const [savedOffers, setSavedOffers] = useState<Array<{
    title: string;
    serviceType: string;
    price: string;
    priceType: string;
    guests: number;
    durationHours: number;
    durationMinutes: number;
    description: string;
  }>>([]);

  // Helper function to format selected days display
  const formatSelectedDays = (days: string[]): string => {
    if (days.length === 0) return 'Sélectionner';
    
    const allDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    
    // Check if all 7 days are selected
    if (days.length === 7 && allDays.every(day => days.includes(day))) {
      return 'Lundi – Dimanche';
    }
    
    // Check if only weekdays are selected
    if (days.length === 5 && weekDays.every(day => days.includes(day)) && !days.includes('Samedi') && !days.includes('Dimanche')) {
      return 'Lundi – Vendredi';
    }
    
    // Check for other consecutive ranges
    const dayIndices = days.map(day => allDays.indexOf(day)).sort((a, b) => a - b);
    const isConsecutive = dayIndices.every((val, i, arr) => i === 0 || val === arr[i - 1] + 1);
    
    if (isConsecutive && days.length > 2) {
      return `${allDays[dayIndices[0]]} – ${allDays[dayIndices[dayIndices.length - 1]]}`;
    }
    
    // Otherwise, list all days
    return days.join(', ');
  };

  // Save schedule function
  const handleSaveSchedule = () => {
    if (selectedDays.length === 0) return;

    if (editingScheduleIndex !== null) {
      // Update existing schedule
      const updatedSchedules = [...savedSchedules];
      updatedSchedules[editingScheduleIndex] = {
        days: selectedDays,
        startTime: startTime,
        endTime: endTime
      };
      setSavedSchedules(updatedSchedules);
    } else {
      // Add new schedule
      setSavedSchedules([...savedSchedules, {
        days: selectedDays,
        startTime: startTime,
        endTime: endTime
      }]);
    }

    // Reset and close modal
    setShowScheduleModal(false);
    setShowDaysDropdown(false);
    setEditingScheduleIndex(null);
  };

  // Delete schedule function
  const handleDeleteSchedule = () => {
    if (editingScheduleIndex !== null && savedSchedules.length > 1) {
      const updatedSchedules = savedSchedules.filter((_, index) => index !== editingScheduleIndex);
      setSavedSchedules(updatedSchedules);
    }
    setShowScheduleModal(false);
    setShowDaysDropdown(false);
    setEditingScheduleIndex(null);
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          if (newPhotos.length === files.length) {
            setTempPhotos(prev => [...prev, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }, []);

  const removeTempPhoto = (index: number) => {
    setTempPhotos(tempPhotos.filter((_, i) => i !== index));
  };

  const removeUploadedPhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  const addPhotosToUploaded = () => {
    setUploadedPhotos([...uploadedPhotos, ...tempPhotos]);
    setTempPhotos([]);
    setShowAddPhotosModal(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPhotos.push(reader.result as string);
            if (newPhotos.length === Array.from(files).filter(f => f.type.startsWith('image/')).length) {
              setTempPhotos([...tempPhotos, ...newPhotos]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const services = [
    {
      id: "chef",
      label: "Chef privé",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=200&h=200&fit=crop",
    },
    {
      id: "coaching",
      label: "Coaching privé",
      image: coachingImg,
    },
    {
      id: "coiffure",
      label: "Coiffure",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&h=200&fit=crop",
    },
    {
      id: "mani-pedi",
      label: "Mani-pédi",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop",
    },
    {
      id: "maquillage",
      label: "Maquillage",
      image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=200&fit=crop",
    },
    {
      id: "massage",
      label: "Massage",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200&h=200&fit=crop",
    },
    {
      id: "photographie",
      label: "Photographie",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200&h=200&fit=crop",
    },
    {
      id: "plats-prepares",
      label: "Plats préparés",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
    },
    {
      id: "traiteur",
      label: "Service de traiteur",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=200&h=200&fit=crop",
    },
    {
      id: "bien-etre",
      label: "Soins de bien-être",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&h=200&fit=crop",
    },
  ];

  const cities = [
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Nice",
    "Nantes",
    "Bordeaux",
  ];

  const handleNext = () => {
    console.log("handleNext called, current step:", step);
    if (step === 1 && selectedService) {
      setStep(2);
    } else if (step === 2 && city) {
      setStep(3);
    } else if (step === 6) {
      console.log("Moving from step 6 to step 7");
      setStep(7);
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setShowCityModal(false);
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);

  // Steps 1-2: Initial setup with fixed header/footer
  if (step <= 2) {
    return (
      <>
        <div className="min-h-screen bg-white flex flex-col">
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
              {/* Logo */}
              <button
                onClick={() => onNavigate("annonces")}
                className="hover:opacity-80 transition-opacity"
              >
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z"
                    fill="#10B981"
                  />
                </svg>
              </button>

              {/* Right - Retour button */}
              <button
                onClick={() => onNavigate("annonces")}
                className="text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                Retour
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 pt-20">
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="min-h-[calc(100vh-160px)] flex items-center py-12">
                <div className="w-full max-w-5xl mx-auto px-6 lg:px-20">
                  <h1
                    className="text-3xl lg:text-4xl mb-12 text-center"
                    style={{ fontWeight: 600 }}
                  >
                    Quel service souhaitez-vous proposer ?
                  </h1>

                  {/* Services Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`p-6 border-2 rounded-xl text-center transition-all hover:border-gray-900 flex flex-col items-center gap-4 ${
                          selectedService === service.id
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="w-10 h-10">
                          <img
                            src={service.image}
                            alt={service.label}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-sm" style={{ fontWeight: 500 }}>
                          {service.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div className="min-h-[calc(100vh-160px)] flex items-center py-12">
                <div className="w-full max-w-5xl mx-auto px-6 lg:px-20">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Form */}
                    <div>
                      <h1
                        className="text-3xl lg:text-4xl mb-8"
                        style={{ fontWeight: 600 }}
                      >
                        Où proposerez-vous votre service ?
                      </h1>

                      {/* City Input */}
                      <div
                        onClick={() => setShowCityModal(true)}
                        className="border-2 border-gray-300 rounded-xl px-4 py-4 flex items-center gap-3 cursor-pointer hover:border-gray-900 transition-colors"
                      >
                        <MapPin className="w-5 h-5 text-gray-600" />
                        <input
                          type="text"
                          value={city}
                          readOnly
                          placeholder="Saisir une ville"
                          className="flex-1 outline-none text-base bg-transparent cursor-pointer"
                          style={{ fontWeight: 400 }}
                        />
                      </div>
                    </div>

                    {/* Right - Service Card */}
                    <div className="flex justify-center">
                      <div className="bg-white rounded-2xl shadow-lg p-8 w-64">
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 mb-4">
                            <img
                              src={selectedServiceData?.image}
                              alt={selectedServiceData?.label}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div
                            className="text-base text-center"
                            style={{ fontWeight: 600 }}
                          >
                            {selectedServiceData?.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="px-6 lg:px-20 h-20 flex items-center justify-end">
              <button
                onClick={handleNext}
                disabled={(step === 1 && !selectedService) || (step === 2 && !city)}
                className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                  ((step === 1 && !selectedService) || (step === 2 && !city))
                    ? "bg-gray-900 text-white opacity-50 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                Suivant
              </button>
            </div>
          </footer>
        </div>

        {/* City Selection Modal */}
        {showCityModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowCityModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                <h2 className="text-base" style={{ fontWeight: 600 }}>
                  Saisir une ville
                </h2>
                <button
                  onClick={() => setShowCityModal(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Search Input */}
                <div className="border-2 border-gray-300 rounded-xl px-4 py-3 flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Rechercher des villes"
                    className="flex-1 outline-none text-base"
                    style={{ fontWeight: 400 }}
                    autoFocus
                  />
                </div>

                {/* Use Current Location */}
                <button
                  onClick={() => handleCitySelect("Ma position actuelle")}
                  className="w-full px-4 py-4 hover:bg-gray-50 flex items-center gap-3 rounded-lg transition-colors"
                >
                  <Navigation className="w-5 h-5 text-gray-700" />
                  <span className="text-sm" style={{ fontWeight: 400 }}>
                    Utiliser ma position actuelle
                  </span>
                </button>

                {/* Cities List */}
                <div className="mt-2 max-h-80 overflow-y-auto">
                  {cities.map((cityName) => (
                    <button
                      key={cityName}
                      onClick={() => handleCitySelect(cityName)}
                      className="w-full px-4 py-3 hover:bg-gray-50 flex items-start gap-3 text-left rounded-lg transition-colors"
                    >
                      <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div
                          className="text-sm text-gray-900"
                          style={{ fontWeight: 400 }}
                        >
                          {cityName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Step 3: Intro page
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => onNavigate("annonces")}
              className="hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-8 h-8"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z"
                  fill="#10B981"
                />
              </svg>
            </button>

            {/* Right - Retour button */}
            <button
              onClick={() => onNavigate("annonces")}
              className="text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
            >
              Retour
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-6xl mx-auto px-6 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left - Text */}
              <div>
                <h1
                  className="text-4xl lg:text-5xl mb-6"
                  style={{ fontWeight: 600 }}
                >
                  Créez votre annonce
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Parlez-nous de vous et du service que vous proposez.
                  <br />
                  Nous vérifierons que votre annonce répond à nos critères.
                </p>
              </div>

              {/* Right - Service Card */}
              <div className="flex justify-center">
                <div className="bg-white rounded-3xl shadow-xl p-10 w-80 transform rotate-3">
                  <div className="flex flex-col items-center">
                    <div className="w-40 h-40 mb-6">
                      <img
                        src={selectedServiceData?.image}
                        alt={selectedServiceData?.label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div
                      className="text-xl text-center mb-2"
                      style={{ fontWeight: 600 }}
                    >
                      {selectedServiceData?.label}
                    </div>
                    <div className="text-sm text-gray-500">{city}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 lg:px-20 py-6 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Activer Windows
              <br />
              Accédez aux paramètres pour activer Windows
            </p>
            <button
              onClick={() => setStep(4)}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Commencer
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // Step 4: Qualifications
  if (step === 4) {
    return (
      <>
        <div className="min-h-screen bg-white flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200">
            <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
              {/* Logo */}
              <button
                onClick={() => onNavigate("annonces")}
                className="hover:opacity-80 transition-opacity"
              >
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z"
                    fill="#10B981"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-6">
                <p className="text-sm" style={{ color: "#717171" }}>
                  À propos de vous{" "}
                  <span style={{ color: "#222222", fontWeight: 600 }}>
                    Étape 1 sur 5
                  </span>
                </p>
                <button
                  onClick={() => onNavigate("annonces")}
                  className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ fontWeight: 600, color: "#222222" }}
                >
                  Enregistrer et quitter
                </button>
              </div>
            </div>
          </header>

          {/* Sidebar + Content */}
          <div className="flex flex-1">
            {/* Left Sidebar - Progress */}
            <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#222222"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-12 px-6">
              <div className="w-full max-w-2xl mx-auto">
                {/* Icon */}
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#222222"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 3v18M3 9h18M3 15h18M15 3v18" />
                    </svg>
                  </div>
                </div>

                <h1
                  className="text-3xl lg:text-4xl mb-4 text-center"
                  style={{ fontWeight: 600 }}
                >
                  Décrivez vos qualifications
                </h1>

                <p
                  className="text-center text-gray-500 mb-12 text-sm"
                  style={{ fontWeight: 400 }}
                >
                  Aidez les voyageurs à mieux vous conna��tre.
                </p>

                {/* Qualification Cards */}
                <div className="space-y-4">
                  {/* Experience Card */}
                  <button
                    onClick={() => {
                      setTempExperienceText(experienceText);
                      setShowExperienceModal(true);
                    }}
                    className="w-full bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Plus className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-base mb-1">
                          Expérience
                        </div>
                        <div className="text-sm text-gray-500">
                          {experienceText || "Ajoutez votre emploi le plus important"}
                        </div>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>

                  {/* Diploma Card */}
                  <button
                    onClick={() => {
                      setTempDiplomaText(diplomaText);
                      setShowDiplomaModal(true);
                    }}
                    className="w-full bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Plus className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-base mb-1">
                          Diplôme
                        </div>
                        <div className="text-sm text-gray-500">
                          {diplomaText || "Ajoutez votre diplôme ou votre formation"}
                        </div>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>

                  {/* Career Highlight Card */}
                  <button
                    onClick={() => {
                      setTempCareerText(careerHighlight);
                      setShowCareerModal(true);
                    }}
                    className="w-full bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Plus className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-base mb-1">
                          Moment fort de votre carrière{" "}
                          <span className="text-gray-400 font-normal">(facultatif)</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {careerHighlight || "Ajoutez vos distinctions ou réputations dans les médias"}
                        </div>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200">
            <div className="px-6 lg:px-20 py-5">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="text-sm hover:bg-gray-100 rounded-lg transition-colors underline"
                  style={{ fontWeight: 600 }}
                >
                  Obtenir des conseils
                </button>
                <p className="text-xs text-gray-400 text-right leading-tight">
                  Activer Windows
                  <br />
                  Accédez aux paramètres pour activer Windows
                </p>
                <button
                  onClick={() => setStep(5)}
                  className="px-8 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          </footer>
        </div>

        {/* Experience Modal */}
        {showExperienceModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowExperienceModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>
                  Ajoutez votre emploi le plus important
                </h2>
                <button
                  onClick={() => setShowExperienceModal(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <textarea
                  value={tempExperienceText}
                  onChange={(e) => setTempExperienceText(e.target.value)}
                  placeholder="J'étais esthéticienne en chef au Ski Semsss, un spa de complexe hôtelier 5 étoiles à Bali"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-gray-900 transition-colors"
                  style={{ fontWeight: 400, minHeight: "120px" }}
                  maxLength={500}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2 text-right">
                  Caractères restants : {500 - tempExperienceText.length}/500
                </p>

                {/* Modal Footer */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => setShowExperienceModal(false)}
                    className="text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      setExperienceText(tempExperienceText);
                      setShowExperienceModal(false);
                    }}
                    disabled={!tempExperienceText.trim()}
                    className={`px-6 py-2 text-sm rounded-lg font-semibold transition-colors ${
                      tempExperienceText.trim()
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diploma Modal */}
        {showDiplomaModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowDiplomaModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>
                  Ajoutez votre diplôme ou votre formation
                </h2>
                <button
                  onClick={() => setShowDiplomaModal(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <textarea
                  value={tempDiplomaText}
                  onChange={(e) => setTempDiplomaText(e.target.value)}
                  placeholder="J'ai obtenu le CIDESCO, diplôme référence pour les soins de la peau, à la Betux Academy"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-gray-900 transition-colors"
                  style={{ fontWeight: 400, minHeight: "120px" }}
                  maxLength={500}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2 text-right">
                  Caractères restants : {500 - tempDiplomaText.length}/500
                </p>

                {/* Modal Footer */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => setShowDiplomaModal(false)}
                    className="text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      setDiplomaText(tempDiplomaText);
                      setShowDiplomaModal(false);
                    }}
                    disabled={!tempDiplomaText.trim()}
                    className={`px-6 py-2 text-sm rounded-lg font-semibold transition-colors ${
                      tempDiplomaText.trim()
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Career Highlight Modal */}
        {showCareerModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowCareerModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>
                  Ajoutez vos distinctions ou apparitions dans les médias
                </h2>
                <button
                  onClick={() => setShowCareerModal(false)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <textarea
                  value={tempCareerText}
                  onChange={(e) => setTempCareerText(e.target.value)}
                  placeholder="Ajoutez vos distinctions ou apparitions dans les médias"
                  className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-gray-900 transition-colors"
                  style={{ fontWeight: 400, minHeight: "120px" }}
                  maxLength={90}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2 text-right">
                  Caractères restants : {90 - tempCareerText.length}/90
                </p>

                {/* Modal Footer */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => setShowCareerModal(false)}
                    className="text-sm font-semibold hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      setCareerHighlight(tempCareerText);
                      setShowCareerModal(false);
                    }}
                    disabled={!tempCareerText.trim()}
                    className={`px-6 py-2 text-sm rounded-lg font-semibold transition-colors ${
                      tempCareerText.trim()
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Step 5: Online Profiles
  if (step === 5) {
    return (
      <>
        <div className="min-h-screen bg-white flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200">
            <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
              {/* Logo */}
              <button
                onClick={() => onNavigate("annonces")}
                className="hover:opacity-80 transition-opacity"
              >
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z"
                    fill="#10B981"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-6">
                <p className="text-sm" style={{ color: "#717171" }}>
                  À propos de vous{" "}
                  <span style={{ color: "#222222", fontWeight: 600 }}>
                    Étape 1 sur 5
                  </span>
                </p>
                <button
                  onClick={() => onNavigate("annonces")}
                  className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ fontWeight: 600, color: "#222222" }}
                >
                  Enregistrer et quitter
                </button>
              </div>
            </div>
          </header>

          {/* Sidebar + Content */}
          <div className="flex flex-1">
            {/* Left Sidebar - Progress */}
            <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-12 px-6">
              <div className="w-full max-w-2xl mx-auto">
                <h1
                  className="text-5xl mb-6 text-center"
                  style={{ fontWeight: 600, color: "#222222" }}
                >
                  Ajoutez vos profils
                  <br />
                  en ligne
                </h1>

                <p
                  className="text-base mb-12 max-w-xl mx-auto text-center"
                  style={{ color: "#717171" }}
                >
                  Pour nous aider à confirmer vos compétences, ajoutez des liens
                  vers vos commentaires, les articles de presse que vous avez reçus
                  et votre site web. Les voyageurs ne les verront pas.
                </p>

                {/* Saved Links */}
                {websiteLinks.length > 0 && (
                  <div className="mb-8 space-y-3">
                    {websiteLinks.map((link, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-4"
                      >
                        <Link className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <span className="flex-1 text-sm" style={{ color: "#222222" }}>
                          {link}
                        </span>
                        <button
                          onClick={() => {
                            const newLinks = websiteLinks.filter((_, i) => i !== index);
                            setWebsiteLinks(newLinks);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Another Link Button */}
                {websiteLinks.length > 0 && (
                  <div className="flex justify-center mb-12">
                    <button
                      onClick={() => setShowAddLinkModal(true)}
                      className="text-sm hover:underline"
                      style={{ fontWeight: 600, color: "#222222" }}
                    >
                      Ajouter un autre lien
                    </button>
                  </div>
                )}

                {/* Social Platform Cards - Only show when no links */}
                {websiteLinks.length === 0 && (
                  <>
                    <div className="flex justify-center gap-6 mb-12">
                {/* Facebook */}
                <div className="w-32 h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                  <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" fill="#1877F2" />
                    <path
                      d="M29.5 15.5H26.5C25.119 15.5 24 16.619 24 18V21H29.5L28.5 26H24V38H19V26H15.5V21H19V17.5C19 14.462 21.462 12 24.5 12H29.5V15.5Z"
                      fill="white"
                    />
                  </svg>
                </div>

                {/* Google */}
                <div className="w-32 h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                  <svg className="w-16 h-16" viewBox="0 0 48 48">
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                </div>

                {/* Yelp */}
                <div className="w-32 h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                  <svg className="w-16 h-16" viewBox="0 0 48 48">
                    <path
                      fill="#D32323"
                      d="M24.7,33.8l-5.5,9.4c-0.4,0.7-1.4,0.8-1.9,0.2l-2.3-2.3c-0.5-0.5-0.5-1.4,0.1-1.9l5.5-4.8c0.8-0.7,2-0.1,2,0.9L24.7,33.8z"
                    />
                    <path
                      fill="#D32323"
                      d="M24.3,30.2c-0.8,0.1-1.5-0.5-1.5-1.3l-0.8-8.3c-0.1-0.8,0.7-1.5,1.5-1.3l3.9,0.9c0.8,0.2,1.3,1,1,1.8l-2.6,7.4C25.6,29.9,25,30.1,24.3,30.2z"
                    />
                    <path
                      fill="#D32323"
                      d="M20.5,28.1c-0.7-0.4-0.8-1.4-0.3-2l4.4-6c0.5-0.7,1.5-0.7,2,0l1.9,2.6c0.5,0.7,0.3,1.6-0.4,2l-6.2,3.7C21.4,28.7,21,28.5,20.5,28.1z"
                    />
                    <path
                      fill="#D32323"
                      d="M29.8,20.3l7.8-3.5c0.7-0.3,1.5,0.2,1.5,1l-0.1,2.9c0,0.7-0.6,1.3-1.3,1.2l-7.1-0.4c-1,0-1.4-1.2-0.7-1.8L29.8,20.3z"
                    />
                    <path
                      fill="#D32323"
                      d="M18.5,7.5l-0.9,12.8c0,0.9-1.1,1.3-1.7,0.6l-5.2-6.1c-0.6-0.7-0.4-1.8,0.4-2.2l9.5-4.8c0.9-0.5,1.9,0.3,1.7,1.3L18.5,7.5z"
                    />
                  </svg>
                </div>
              </div>

              {/* Add Profile Button */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAddLinkModal(true)}
                  className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
                  style={{ fontWeight: 600, backgroundColor: "#222222" }}
                >
                  Ajouter un profil
                </button>
              </div>
                  </>
                )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 lg:px-20 py-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(4)}
                className="text-sm hover:bg-gray-100 rounded-lg transition-colors underline"
                style={{ fontWeight: 600 }}
              >
                Retour
              </button>
              <p className="text-xs text-gray-400 text-right leading-tight">
                Activer Windows
                <br />
                Accédez aux paramètres pour activer Windows
              </p>
              <button
                onClick={() => setStep(6)}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Add Link Modal */}
      {showAddLinkModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowAddLinkModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowAddLinkModal(false);
                setWebsiteLink("");
              }}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2
              className="text-2xl text-center mb-6"
              style={{ fontWeight: 600, color: "#222222" }}
            >
              Ajoutez un lien
            </h2>

            <input
              type="text"
              value={websiteLink}
              onChange={(e) => setWebsiteLink(e.target.value)}
              placeholder="https://www.exemple.com"
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-sm focus:border-gray-900 focus:outline-none transition-colors mb-4"
              style={{ color: "#222222" }}
              autoFocus
            />

            <div className="flex justify-end items-center gap-3">
              <button
                onClick={() => {
                  if (websiteLink.trim()) {
                    setWebsiteLinks([...websiteLinks, websiteLink.trim()]);
                    setWebsiteLink("");
                  }
                  setShowAddLinkModal(false);
                }}
                className="px-6 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                style={{
                  fontWeight: 600,
                  color: "#222222",
                  backgroundColor: "#F5F5F5",
                }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  }

  // Step 6: Address Info
  if (step === 6) {
  return (
    <>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => onNavigate("annonces")}
              className="hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-8 h-8"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z"
                  fill="#10B981"
                />
              </svg>
            </button>

            <div className="flex items-center gap-6">
              <p className="text-sm" style={{ color: "#717171" }}>
                À propos de vous{" "}
                <span style={{ color: "#222222", fontWeight: 600 }}>
                  Étape 1 sur 5
                </span>
              </p>
              <button
                onClick={() => onNavigate("annonces")}
                className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Enregistrer et quitter
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar - Progress */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#222222">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto py-12 px-6">
            <div className="w-full max-w-2xl mx-auto">
              <h1
                className="text-4xl mb-12 text-center"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Parlez-nous un peu de vous
              </h1>

              {/* Address Form */}
              <div className="space-y-6 mb-12">
                {/* Question Header */}
                <div className="mb-6">
                  <h3 className="text-base mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                    Quelle est votre adresse résidentielle ?
                  </h3>
                  <p className="text-sm" style={{ color: "#717171" }}>
                    Les voyageurs ne verront pas ces informations
                  </p>
                </div>

                {/* Country */}
                <div>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:border-gray-900 focus:outline-none transition-colors"
                    style={{ color: "#222222" }}
                  >
                    <option value="Madagascar">Madagascar</option>
                    <option value="France">France</option>
                    <option value="États-Unis">États-Unis</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm mb-2" style={{ fontWeight: 400, color: "#222222" }}>
                    Adresse du domicile ou de la rue
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Adresse"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:border-gray-900 focus:outline-none transition-colors"
                    style={{ color: "#222222" }}
                  />
                </div>

                {/* Apartment */}
                <div>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Appartement, étage, immeuble (si applicable)"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:border-gray-900 focus:outline-none transition-colors"
                    style={{ color: "#222222" }}
                  />
                </div>

                {/* Commune */}
                <div>
                  <label className="block text-sm mb-2" style={{ fontWeight: 400, color: "#222222" }}>
                    Commune
                  </label>
                  <input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder="Commune"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:border-gray-900 focus:outline-none transition-colors"
                    style={{ color: "#222222" }}
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm mb-2" style={{ fontWeight: 400, color: "#222222" }}>
                    Province/État/Territoire (si applicable)
                  </label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Province"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:border-gray-900 focus:outline-none transition-colors"
                    style={{ color: "#222222" }}
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm mb-2" style={{ fontWeight: 400, color: "#222222" }}>
                    Code postal (si applicable)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Code postal"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:border-gray-900 focus:outline-none transition-colors"
                    style={{ color: "#222222" }}
                  />
                </div>
              </div>

              {/* Business Host Question */}
              <div className="border-t border-gray-200 pt-12">
                <h2
                  className="text-2xl mb-4"
                  style={{ fontWeight: 600, color: "#222222" }}
                >
                  Êtes-vous hôte dans le cadre d'une entreprise ?
                </h2>
                <p className="text-sm mb-6" style={{ color: "#717171" }}>
                  Cela signifie que votre entreprise est probablement enregistrée auprès du gouvernement ou des autorités locales.{" "}
                  <a href="#" className="underline hover:text-gray-900 transition-colors">
                    En savoir plus
                  </a>
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsBusinessHost("yes")}
                    className={`flex-1 border-2 rounded-xl px-6 py-4 text-center text-sm transition-colors ${ 
                      isBusinessHost === "yes"
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-300 hover:border-gray-900"
                    }`}
                    style={{ fontWeight: 500, color: "#222222" }}
                  >
                    Oui
                  </button>
                  <button
                    onClick={() => setIsBusinessHost("no")}
                    className={`flex-1 border-2 rounded-xl px-6 py-4 text-center text-sm transition-colors ${
                      isBusinessHost === "no"
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-300 hover:border-gray-900"
                    }`}
                    style={{ fontWeight: 500, color: "#222222" }}
                  >
                    Non
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 lg:px-20 py-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(5)}
                className="text-sm hover:bg-gray-100 rounded-lg transition-colors underline"
                style={{ fontWeight: 600 }}
              >
                Retour
              </button>
              <p className="text-xs text-gray-400 text-right leading-tight">
                Activer Windows
                <br />
                Accédez aux paramètres pour activer Windows
              </p>
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold transition-colors hover:bg-gray-800"
              >
                Suivant
              </button>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
  }

  // Step 7: Service Location
  if (step === 7) {
  const addressSuggestions = [
    "Paris, France",
    "Paris 16e Arrondissement, France",
    "Paris 8e Arrondissement, France",
    "Parisot, France"
  ];

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={() => setStep(6)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="#222222"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-6">
              <p className="text-sm" style={{ color: "#717171" }}>
                Lieu · <span style={{ color: "#222222", fontWeight: 600 }}>Étape 2 sur 6</span>
              </p>
              <button
                onClick={() => onNavigate("annonces")}
                className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Enregistrer et quitter
              </button>
            </div>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar - Progress */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto py-12 px-6">
            <div className="w-full max-w-2xl mx-auto">
              <h1
                className="text-4xl mb-3 text-center"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Où fournissez-vous votre service ?
              </h1>
              
              <p className="text-center text-gray-600 mb-12">
                Sélectionnez une option ou les deux.
              </p>

              {/* Service Options */}
              <div className="space-y-4">
                {/* Option 1: You join travelers */}
                <button
                  onClick={() => setShowServiceAreaModal(true)}
                  className={`w-full p-6 border-2 rounded-xl transition-colors text-left flex items-start justify-between ${
                    serviceAreaAddress 
                      ? 'border-gray-900 bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-900'
                  }`}
                >
                  <div className="flex-1">
                    <h3
                      className="text-lg mb-1"
                      style={{ fontWeight: 600, color: "#222222" }}
                    >
                      Vous rejoignez les voyageurs
                    </h3>
                    <p className="text-sm" style={{ color: "#717171" }}>
                      {serviceAreaAddress || "Définissez votre zone de service"}
                    </p>
                  </div>
                  {serviceAreaAddress && (
                    <svg className="w-6 h-6 flex-shrink-0 ml-3" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Option 2: Travelers join you */}
                <button
                  onClick={() => setShowMeetingPointModal(true)}
                  className={`w-full p-6 border-2 rounded-xl transition-colors text-left flex items-start justify-between ${
                    meetingPointAddress 
                      ? 'border-gray-900 bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-900'
                  }`}
                >
                  <div className="flex-1">
                    <h3
                      className="text-lg mb-1"
                      style={{ fontWeight: 600, color: "#222222" }}
                    >
                      Les voyageurs vous rejoignent
                    </h3>
                    <p className="text-sm" style={{ color: "#717171" }}>
                      {meetingPointAddress 
                        ? `${locationDetails.city}, ${locationDetails.city}, ${locationDetails.province} ${locationDetails.postalCode}, ${locationDetails.country}`
                        : "Ajouter un lieu de rencontre"
                      }
                    </p>
                  </div>
                  {meetingPointAddress && (
                    <svg className="w-6 h-6 flex-shrink-0 ml-3" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-end">
            <button
              onClick={() => {
                setStep(8);
              }}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Suivant
            </button>
          </div>
        </footer>
      </div>

      {/* Service Area Modal */}
      {showServiceAreaModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          onClick={() => {
            setShowServiceAreaModal(false);
            setServiceAreaAddress("");
            setIsServiceAreaFocused(false);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowServiceAreaModal(false);
                setServiceAreaAddress("");
                setIsServiceAreaFocused(false);
              }}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2
              className="text-2xl text-center mb-3"
              style={{ fontWeight: 600, color: "#222222" }}
            >
              Définissez votre zone de service
            </h2>

            <p className="text-center text-sm mb-8" style={{ color: "#717171" }}>
              Saisissez l'adresse où se trouve votre taxi, ou où vous pourriez être au départ. Ensuite, choisissez votre temps de trajet maximal.
            </p>

            {!showServiceAreaMap ? (
              <>
                <div className="relative">
                  {/* Search input */}
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5" fill="none" stroke="#717171" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" strokeWidth="2" />
                        <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={serviceAreaAddress}
                      onChange={(e) => setServiceAreaAddress(e.target.value)}
                      onFocus={() => setIsServiceAreaFocused(true)}
                      onBlur={() => {
                        // Delay to allow click on "use current location" button
                        setTimeout(() => setIsServiceAreaFocused(false), 200);
                      }}
                      placeholder="Saisissez votre adresse de départ"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-sm focus:border-gray-900 focus:outline-none transition-colors"
                      style={{ color: "#222222" }}
                      autoFocus
                    />
                  </div>

                  {/* Use current location button - below input */}
                  {isServiceAreaFocused && !serviceAreaAddress && (
                    <button
                      className="mt-3 flex items-center gap-2 text-sm hover:underline"
                      style={{ color: "#222222", fontWeight: 500 }}
                      onClick={() => {
                        setServiceAreaAddress("Ma position actuelle");
                        setIsServiceAreaFocused(false);
                      }}
                    >
                      <Navigation className="w-4 h-4" />
                      Utiliser ma position actuelle
                    </button>
                  )}

                  {/* Address suggestions */}
                  {serviceAreaAddress && isServiceAreaFocused && (
                    <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                      {addressSuggestions
                        .filter(suggestion => 
                          suggestion.toLowerCase().includes(serviceAreaAddress.toLowerCase())
                        )
                        .map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setServiceAreaAddress(suggestion);
                              setIsServiceAreaFocused(false);
                              setShowServiceAreaMap(true);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                          >
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span className="text-sm" style={{ color: "#222222" }}>
                              {suggestion}
                            </span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Map View */}
                <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden mb-4">
                  {/* Mock map with selected address */}
                  <div className="absolute inset-0 bg-[#E5E3DF]">
                    {/* Simple map illustration */}
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
                    {/* Pin marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                      <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" fill="white" />
                      </div>
                    </div>
                    {/* Map attribution */}
                    <div className="absolute bottom-2 right-2 text-xs text-gray-600 bg-white bg-opacity-80 px-2 py-1 rounded">
                      © OpenStreetMap
                    </div>
                    {/* Zoom controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center hover:bg-gray-50">
                        +
                      </button>
                      <button className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center hover:bg-gray-50">
                        −
                      </button>
                    </div>
                  </div>
                  {/* Selected address display */}
                  <div className="absolute top-4 left-4 right-16 bg-white rounded-lg shadow-md px-4 py-3 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm flex-1" style={{ color: "#222222" }}>
                      {serviceAreaAddress}
                    </span>
                    <button 
                      className="p-1 hover:bg-gray-100 rounded"
                      onClick={() => {
                        setServiceAreaAddress("");
                        setShowServiceAreaMap(false);
                        setIsServiceAreaFocused(false);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setShowServiceAreaModal(false);
                      setShowServiceAreaMap(false);
                      setIsServiceAreaFocused(false);
                    }}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    Enregistrer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Meeting Point Modal */}
      {showMeetingPointModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          onClick={() => {
            setShowMeetingPointModal(false);
            setMeetingPointAddress("");
            setIsMeetingPointFocused(false);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowMeetingPointModal(false);
                setMeetingPointAddress("");
                setIsMeetingPointFocused(false);
              }}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2
              className="text-2xl text-center mb-3"
              style={{ fontWeight: 600, color: "#222222" }}
            >
              Où les voyageurs doivent-ils vous retrouver ?
            </h2>

            <p className="text-center text-sm mb-8" style={{ color: "#717171" }}>
              Les voyageurs verront cette adresse sur votre annonce.
            </p>

            <div className="relative">
              {/* Search input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5" fill="none" stroke="#717171" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={meetingPointAddress}
                  onChange={(e) => setMeetingPointAddress(e.target.value)}
                  onFocus={() => setIsMeetingPointFocused(true)}
                  onBlur={() => {
                    // Delay to allow click on "use current location" button
                    setTimeout(() => setIsMeetingPointFocused(false), 200);
                  }}
                  placeholder="Saisir une adresse"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-sm focus:border-gray-900 focus:outline-none transition-colors"
                  style={{ color: "#222222" }}
                  autoFocus
                />
              </div>

              {/* Use current location button - below input */}
              {isMeetingPointFocused && !meetingPointAddress && (
                <button
                  className="mt-3 flex items-center gap-2 text-sm hover:underline"
                  style={{ color: "#222222", fontWeight: 500 }}
                  onClick={() => {
                    setMeetingPointAddress("Ma position actuelle");
                    setIsMeetingPointFocused(false);
                  }}
                >
                  <Navigation className="w-4 h-4" />
                  Utiliser ma position actuelle
                </button>
              )}

              {/* Address suggestions */}
              {meetingPointAddress && isMeetingPointFocused && (
                <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                  {addressSuggestions
                    .filter(suggestion => 
                      suggestion.toLowerCase().includes(meetingPointAddress.toLowerCase())
                    )
                    .map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setMeetingPointAddress(suggestion);
                          setIsMeetingPointFocused(false);
                          setShowMeetingPointModal(false);
                          setShowConfirmLocationModal(true);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="text-sm" style={{ color: "#222222" }}>
                          {suggestion}
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => {
                  setShowMeetingPointModal(false);
                  setIsMeetingPointFocused(false);
                }}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Location Modal (Photo 2) */}
      {showConfirmLocationModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          onClick={() => {
            setShowConfirmLocationModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div className="flex-shrink-0 px-8 pt-8 pb-4">
              <button
                onClick={() => {
                  setShowConfirmLocationModal(false);
                }}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2
                className="text-2xl text-center mb-3"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Confirmez le lieu
              </h2>

              <p className="text-center text-sm" style={{ color: "#717171" }}>
                Assurez-vous que cette adresse est correcte. Vous ne pourrez plus la modifier une fois votre annonce créée.
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-4">
              {/* Country/Region */}
              <div className="mb-4">
                <label className="block text-sm mb-2" style={{ color: "#222222", fontWeight: 500 }}>
                  Pays/région
                </label>
                <select
                  value={locationDetails.country}
                  onChange={(e) => setLocationDetails({...locationDetails, country: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none bg-gray-50"
                  style={{ color: "#222222" }}
                >
                  <option value="Madagascar">Madagascar</option>
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                </select>
              </div>

              {/* Street Address */}
              <div className="mb-4">
                <label className="block text-sm mb-2" style={{ color: "#222222", fontWeight: 500 }}>
                  Adresse/nom de rue
                </label>
                <input
                  type="text"
                  value={locationDetails.street}
                  onChange={(e) => setLocationDetails({...locationDetails, street: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
                  style={{ color: "#222222" }}
                />
              </div>

              {/* Apartment */}
              <div className="mb-4">
                <label className="block text-sm mb-2" style={{ color: "#222222", fontWeight: 500 }}>
                  Appartement, étage, immeuble (si applicable)
                </label>
                <input
                  type="text"
                  value={locationDetails.apartment}
                  onChange={(e) => setLocationDetails({...locationDetails, apartment: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
                  style={{ color: "#222222" }}
                />
              </div>

              {/* City */}
              <div className="mb-4">
                <label className="block text-sm mb-2" style={{ color: "#222222", fontWeight: 500 }}>
                  Ville
                </label>
                <input
                  type="text"
                  value={locationDetails.city}
                  onChange={(e) => setLocationDetails({...locationDetails, city: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
                  style={{ color: "#222222" }}
                />
              </div>

              {/* Province */}
              <div className="mb-4">
                <label className="block text-sm mb-2" style={{ color: "#222222", fontWeight: 500 }}>
                  Province/territoire (si applicable)
                </label>
                <input
                  type="text"
                  value={locationDetails.province}
                  onChange={(e) => setLocationDetails({...locationDetails, province: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
                  style={{ color: "#222222" }}
                />
              </div>

              {/* Postal Code */}
              <div className="mb-4">
                <label className="block text-sm mb-2" style={{ color: "#222222", fontWeight: 500 }}>
                  Code postal (si applicable)
                </label>
                <input
                  type="text"
                  value={locationDetails.postalCode}
                  onChange={(e) => setLocationDetails({...locationDetails, postalCode: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
                  style={{ color: "#222222" }}
                />
              </div>

              {/* Place Name */}
              <div className="mb-4">
                <label className="block text-sm mb-2" style={{ color: "#717171" }}>
                  Nom du lieu (facultatif)
                </label>
                <input
                  type="text"
                  value={locationDetails.placeName}
                  onChange={(e) => setLocationDetails({...locationDetails, placeName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
                  style={{ color: "#222222" }}
                />
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 px-8 py-6 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowConfirmLocationModal(false);
                    setShowConfirmPinModal(true);
                  }}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Pin Location Modal (Photo 3) */}
      {showConfirmPinModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          onClick={() => {
            setShowConfirmPinModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowConfirmPinModal(false);
              }}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2
              className="text-2xl text-center mb-6"
              style={{ fontWeight: 600, color: "#222222" }}
            >
              Le repère est-il au bon endroit ?
            </h2>

            {/* Map View */}
            <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden mb-6">
              {/* Mock map */}
              <div className="absolute inset-0 bg-[#E5E3DF]">
                {/* Simple map illustration with lighter grid */}
                <div className="absolute inset-0 opacity-10">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#999" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid2)" />
                  </svg>
                </div>
                {/* Pin marker in center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" fill="white" />
                  </div>
                </div>
                {/* Map attribution */}
                <div className="absolute bottom-2 right-2 text-xs text-gray-600 bg-white bg-opacity-80 px-2 py-1 rounded">
                  © OpenStreetMap
                </div>
                {/* Instruction overlay */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
                  <div className="bg-gray-700 text-white px-4 py-2 rounded-full text-sm whitespace-nowrap">
                    Déplacez la carte pour repositionner le repère
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowConfirmPinModal(false);
                }}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  }

  // Step 8: Photos
  if (step === 8) {
    return (
      <>
        <div className="min-h-screen bg-white flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200">
            <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
              {/* Back button */}
              <button
                onClick={() => setStep(7)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="#222222"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex items-center gap-6">
                <p className="text-sm" style={{ color: "#717171" }}>
                  Photos · <span style={{ color: "#222222", fontWeight: 600 }}>Étape 3 sur 6</span>
                </p>
                <button
                  onClick={() => onNavigate("annonces")}
                  className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                  style={{ fontWeight: 600, color: "#222222" }}
                >
                  Enregistrer et quitter
                </button>
              </div>
            </div>
          </header>

          {/* Sidebar + Content */}
          <div className="flex flex-1">
            {/* Left Sidebar - Progress */}
            <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto px-6 flex items-center justify-center">
              <div className="w-full max-w-2xl mx-auto text-center py-12">
                <h1
                  className="text-4xl mb-3"
                  style={{ fontWeight: 600, color: "#222222" }}
                >
                  Ajoutez des photos qui mettent en valeur vos compétences
                </h1>
                
                <p className="text-gray-600 mb-12">
                  Ajoutez au moins 5 photos.
                </p>

                {uploadedPhotos.length === 0 ? (
                  <>
                    {/* Photo Preview - Initial State */}
                    <div className="mb-8 flex items-center justify-center">
                      <div className="relative">
                        {/* Background photo */}
                        <div className="relative z-10">
                          <img 
                            src="https://images.unsplash.com/photo-1647462741268-e5724e5886c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                            alt="Service"
                            className="w-64 h-48 object-cover rounded-2xl shadow-lg"
                          />
                        </div>
                        {/* Foreground photo - overlapping */}
                        <div className="absolute top-12 -right-16 z-20">
                          <img 
                            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300"
                            alt="Service"
                            className="w-48 h-36 object-cover rounded-2xl shadow-xl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={() => setShowAddPhotosModal(true)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      Ajouter
                    </button>
                  </>
                ) : (
                  <>
                    {/* Photos Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {uploadedPhotos.map((photo, index) => (
                        <div key={index} className="relative aspect-square group">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover rounded-xl"
                            style={{ backgroundColor: "#f0f0f0" }}
                          />
                          <button
                            onClick={() => removeUploadedPhoto(index)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {/* Add More Button */}
                      <button
                        onClick={() => setShowAddPhotosModal(true)}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-gray-900 transition-colors"
                      >
                        <Plus className="w-8 h-8 text-gray-400" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200">
            <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
              <button
                className="text-sm hover:underline"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Obtenir des conseils
              </button>
              <button
                disabled={uploadedPhotos.length < 5}
                onClick={() => {
                  setStep(9);
                }}
                className={`px-8 py-3 rounded-lg text-sm transition-colors ${
                  uploadedPhotos.length >= 5
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                style={{ fontWeight: 600 }}
              >
                Suivant
              </button>
            </div>
          </footer>
        </div>

        {/* Add Photos Modal */}
        {showAddPhotosModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
            onClick={() => {
              setShowAddPhotosModal(false);
              setTempPhotos([]);
            }}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full relative flex flex-col"
              style={{ maxHeight: '85vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hidden File Input */}
              <input
                type="file"
                id="photo-upload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
                <button
                  onClick={() => {
                    setShowAddPhotosModal(false);
                    setTempPhotos([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center flex-1">
                  <h2
                    className="text-lg"
                    style={{ fontWeight: 600, color: "#222222" }}
                  >
                    Ajouter des photos
                  </h2>
                  <p className="text-sm" style={{ color: "#717171" }}>
                    {tempPhotos.length > 0 ? `${tempPhotos.length} photos sélectionnées` : 'Jusqu\'à 0 sur 20'}
                  </p>
                </div>

                <button
                  onClick={() => document.getElementById('photo-upload')?.click()}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div 
                className="flex-1 overflow-y-auto px-8 py-8"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {tempPhotos.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      {/* Photo Icon */}
                      <div className="mb-6 flex justify-center">
                        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
                          <rect x="8" y="12" width="48" height="40" rx="4" stroke="#222222" strokeWidth="2"/>
                          <circle cx="20" cy="24" r="4" stroke="#222222" strokeWidth="2"/>
                          <path d="M8 44l12-12 8 8 16-16 12 12" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>

                      <h3
                        className="text-lg mb-2"
                        style={{ fontWeight: 600, color: "#222222" }}
                      >
                        Glissez-déposez un fichier
                      </h3>

                      <p className="text-sm mb-6" style={{ color: "#717171" }}>
                        ou recherchez des photos
                      </p>

                      <button
                        onClick={() => document.getElementById('photo-upload')?.click()}
                        className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        Parcourir
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {tempPhotos.map((photo, index) => (
                      <div key={index} className="relative aspect-square group">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl"
                          style={{ backgroundColor: "#f0f0f0" }}
                        />
                        <button
                          onClick={() => removeTempPhoto(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-md"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {/* Add More Card */}
                    <button
                      onClick={() => document.getElementById('photo-upload')?.click()}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-gray-900 transition-colors gap-2"
                    >
                      <Plus className="w-8 h-8 text-gray-400" />
                      <span className="text-sm" style={{ color: "#717171" }}>
                        Ajouter une photo sur
                      </span>
                      <span className="text-sm" style={{ color: "#717171" }}>
                        ces derniers
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowAddPhotosModal(false);
                    setTempPhotos([]);
                  }}
                  className="text-sm hover:underline"
                  style={{ fontWeight: 600, color: "#222222" }}
                >
                  Annuler
                </button>

                <button
                  disabled={tempPhotos.length === 0}
                  onClick={addPhotosToUploaded}
                  className={`px-6 py-3 rounded-lg text-sm transition-colors ${
                    tempPhotos.length > 0
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Step 9: Service Title
  if (step === 9) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 lg:px-20 h-16 flex items-center justify-between">
            <button
              onClick={() => setStep(8)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="text-center">
              <p className="text-sm" style={{ fontWeight: 600, color: "#222222" }}>
                Service
              </p>
              <p className="text-xs" style={{ color: "#717171" }}>
                Étape 4 sur 6
              </p>
            </div>

            <button 
              className="text-sm hover:underline" 
              style={{ fontWeight: 600, color: "#222222" }}
              onClick={() => onNavigate("annonces")}
            >
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar - Progress */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto text-center py-12">
              <h1
                className="text-4xl mb-12"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Donnez un titre à votre service
              </h1>

              <textarea
                value={serviceTitle}
                onChange={(e) => {
                  if (e.target.value.length <= 60) {
                    setServiceTitle(e.target.value);
                  }
                }}
                placeholder="Magnifiques tresses par Lori"
                className="w-full px-6 py-4 border-b-2 border-gray-300 focus:border-gray-900 outline-none text-center text-2xl resize-none"
                style={{ color: "#222222", fontWeight: 400 }}
                rows={2}
              />

              <p className="text-sm mt-4" style={{ color: "#717171" }}>
                Caractères restants: {serviceTitle.length}/60
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
            <button
              className="text-sm hover:underline"
              style={{ fontWeight: 600, color: "#222222" }}
            >
              Obtenir des conseils
            </button>
            <button
              disabled={serviceTitle.trim().length === 0}
              onClick={() => setStep(10)}
              className={`px-8 py-3 rounded-lg text-sm transition-colors ${
                serviceTitle.trim().length > 0
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              style={{ fontWeight: 600 }}
            >
              Suivant
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // Step 10: Service Description
  if (step === 10) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 lg:px-20 h-16 flex items-center justify-between">
            <button
              onClick={() => setStep(9)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="text-center">
              <p className="text-sm" style={{ fontWeight: 600, color: "#222222" }}>
                Service
              </p>
              <p className="text-xs" style={{ color: "#717171" }}>
                Étape 4 sur 6
              </p>
            </div>

            <button 
              className="text-sm hover:underline" 
              style={{ fontWeight: 600, color: "#222222" }}
              onClick={() => onNavigate("annonces")}
            >
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar - Progress */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto text-center py-12">
              <h1
                className="text-4xl mb-12"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Mettez en avant votre expertise
              </h1>

              {/* Display Service Title */}
              {serviceTitle && (
                <h2
                  className="text-3xl mb-8"
                  style={{ fontWeight: 600, color: "#222222" }}
                >
                  {serviceTitle}
                </h2>
              )}

              <textarea
                value={serviceDescription}
                onChange={(e) => {
                  if (e.target.value.length <= 300) {
                    setServiceDescription(e.target.value);
                  }
                }}
                placeholder="Présentez vos atouts. Par exemple : « Je ferai en salon ou je peux me rendre chez vous pour la coiffure et mon amour des tresses créatifs. »"
                className="w-full px-6 py-4 border-b-2 border-gray-300 focus:border-gray-900 outline-none text-center text-2xl resize-none placeholder:text-gray-400"
                style={{ color: "#222222", fontWeight: 400 }}
                rows={3}
              />

              <p className="text-sm mt-4" style={{ color: "#717171" }}>
                Caractères restants: {serviceDescription.length}/300
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
            <button
              className="text-sm hover:underline"
              style={{ fontWeight: 600, color: "#222222" }}
            >
              Obtenir des conseils
            </button>
            <button
              disabled={serviceDescription.trim().length === 0}
              onClick={() => setStep(11)}
              className={`px-8 py-3 rounded-lg text-sm transition-colors ${
                serviceDescription.trim().length > 0
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              style={{ fontWeight: 600 }}
            >
              Suivant
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // Step 11: Create Offers
  if (step === 11) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 lg:px-20 h-16 flex items-center justify-between">
            <button
              onClick={() => setStep(10)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="invisible">
              <p className="text-sm" style={{ fontWeight: 600, color: "#222222" }}>
                Service
              </p>
            </div>

            <button 
              className="text-sm hover:underline" 
              style={{ fontWeight: 600, color: "#222222" }}
              onClick={() => onNavigate("annonces")}
            >
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar - Progress */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 flex items-center justify-center">
            <div className="w-full max-w-4xl mx-auto text-center py-12">
              {/* Floating Cards - Centered */}
              <div className="flex gap-4 justify-center mb-12" style={{ transform: 'rotate(-8deg)' }}>
                <div className="bg-white rounded-2xl shadow-xl p-4 w-48" style={{ transform: 'rotate(5deg)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1522336552288-a9cc74a8dfd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300"
                    alt="Brushing"
                    className="w-full h-28 object-cover rounded-xl mb-3"
                  />
                  <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                    Brushing
                  </h3>
                  <p className="text-xs" style={{ color: "#717171" }}>
                    75 € au total
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-4 w-48" style={{ transform: 'rotate(-3deg)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1583170607643-9fcaba85073c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300"
                    alt="Chignon"
                    className="w-full h-28 object-cover rounded-xl mb-3"
                  />
                  <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                    Chignon
                  </h3>
                  <p className="text-xs" style={{ color: "#717171" }}>
                    75 € au total
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-4 w-48" style={{ transform: 'rotate(8deg)' }}>
                  <img 
                    src="https://images.unsplash.com/photo-1606251706444-d069cd266189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300"
                    alt="Coiffure de mariée"
                    className="w-full h-28 object-cover rounded-xl mb-3"
                  />
                  <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                    Coiffure de mariée
                  </h3>
                  <p className="text-xs" style={{ color: "#717171" }}>
                    775 € au total
                  </p>
                </div>
              </div>

              {/* Center Text */}
              <div className="max-w-2xl mx-auto">
                <h1
                  className="text-5xl mb-6"
                  style={{ fontWeight: 600, color: "#222222" }}
                >
                  Créez vos offres
                </h1>

                <p className="text-lg max-w-xl mx-auto" style={{ color: "#717171", lineHeight: 1.6 }}>
                  Il s'agit de ce que les voyageurs réserveront. Vous ajouterez une photo, quelques informations et un prix.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-end">
            <button
              onClick={() => setStep(12)}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Suivant
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // Step 12: Vos offres
  if (step === 12) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
            <button 
              onClick={() => setStep(11)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" style={{ color: "#222222" }} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ fontWeight: 600, color: "#222222" }}>
                Offres
              </span>
              <span className="text-sm" style={{ color: "#717171" }}>
                Étape 5 sur 6
              </span>
            </div>
            <button
              className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
              style={{ fontWeight: 600, color: "#222222" }}
              onClick={() => onNavigate("annonces")}
            >
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Progress */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 flex items-start justify-center pt-16">
            <div className="w-full max-w-2xl mx-auto">
              <h1
                className="text-5xl mb-4 text-center"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Vos offres
              </h1>
              
              <p className="text-center mb-12" style={{ color: "#717171", fontSize: "16px" }}>
                Ajoutez au moins une option. Commencez par une option abordable pour attirer plus de voyageurs.
              </p>

              {/* Liste des offres enregistrées */}
              <div className="space-y-4 mb-4">
                {savedOffers.map((offer, index) => (
                  <div 
                    key={index}
                    className="border border-gray-300 rounded-xl p-4 flex items-center gap-3 hover:border-gray-400 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                    </div>
                    <span className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                      {offer.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add offer button */}
              <button
                onClick={() => setShowAddOfferModal(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-colors flex items-center justify-center gap-3"
              >
                <Plus className="w-5 h-5" style={{ color: "#222222" }} />
                <span className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  {savedOffers.length > 0 ? "Ajouter une autre offre" : "Ajouter ma première offre"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
            <button 
              onClick={() => setStep(11)}
              className="text-sm underline hover:no-underline" 
              style={{ color: "#222222", fontWeight: 600 }}
            >
              Retour
            </button>
            <button
              onClick={() => {
                if (savedOffers.length > 0) {
                  setStep(13);
                }
              }}
              disabled={savedOffers.length === 0}
              className={`px-6 py-3 rounded-lg text-sm transition-colors ${
                savedOffers.length > 0
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              style={{ fontWeight: 600 }}
            >
              Suivant
            </button>
          </div>
        </footer>

        {/* Add Offer Modal */}
        {showAddOfferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Ajoutez une photo et un titre
                </h2>
                <button 
                  onClick={() => {
                    setShowAddOfferModal(false);
                    setOfferTitle("");
                    setOfferPhoto(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Photo Upload */}
                <div className="mb-6">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    {selectedOfferPhoto ? (
                      <img 
                        src={selectedOfferPhoto} 
                        alt="Selected" 
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                      />
                    ) : (
                      <div className="w-full h-full border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <button 
                      onClick={() => setShowChoosePhotoModal(true)}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={offerTitle}
                    onChange={(e) => {
                      if (e.target.value.length <= 32) {
                        setOfferTitle(e.target.value);
                      }
                    }}
                    placeholder="Brushing"
                    className="w-full border-b-2 border-gray-300 focus:border-gray-900 outline-none pb-2 text-center text-2xl placeholder:text-gray-300"
                    style={{ color: "#222222", fontWeight: 400 }}
                  />
                  
                  <p className="text-xs text-center mt-2" style={{ color: "#717171" }}>
                    Caractères restants: {offerTitle.length}/32
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                <button
                  onClick={() => setShowTipsModal(true)}
                  className="text-sm underline hover:no-underline"
                  style={{ color: "#222222", fontWeight: 600 }}
                >
                  Découvrez nos conseils
                </button>
                <button
                  onClick={() => {
                    if (offerTitle.trim()) {
                      setShowAddOfferModal(false);
                      setShowAddInfoModal(true);
                    }
                  }}
                  disabled={!offerTitle.trim()}
                  className={`px-6 py-2 rounded-lg text-sm transition-colors ${
                    offerTitle.trim()
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tips Modal */}
        {showTipsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative flex-shrink-0">
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Découvrez nos conseils
                </h2>
                <button 
                  onClick={() => setShowTipsModal(false)}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto flex-1 scrollbar-hide">
                <div className="p-6">
                  <h3 className="text-2xl mb-6" style={{ fontWeight: 600, color: "#222222" }}>
                    Comment donner<br />un titre à votre offre
                  </h3>

                {/* Tips */}
                <div className="space-y-6 mb-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4M12 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Faites simple
                      </h4>
                      <p className="text-sm" style={{ color: "#717171" }}>
                        Choisissez des titres clairs et descriptifs. Évitez les noms de marque et les acronymes.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Facilitez la lecture des informations
                      </h4>
                      <p className="text-sm" style={{ color: "#717171" }}>
                        Choisissez des titres qui aident les voyageurs à différencier facilement les options.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Proposez différentes catégories
                      </h4>
                      <p className="text-sm" style={{ color: "#717171" }}>
                        Créez des titres pour les offres de base, intermédiaires et supérieures, en appliquant des prix adaptés.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inspiration Section */}
                <div className="mb-8">
                  <h4 className="text-sm mb-4" style={{ fontWeight: 600, color: "#222222" }}>
                    Inspiration
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <img 
                        src="https://images.unsplash.com/photo-1522336552288-a9cc74a8dfd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
                        alt="Brushing"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h5 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                          Brushing
                        </h5>
                        <p className="text-xs" style={{ color: "#717171" }}>
                          75 € au total
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <img 
                        src="https://images.unsplash.com/photo-1583170607643-9fcaba85073c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
                        alt="Chignon"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h5 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                          Chignon
                        </h5>
                        <p className="text-xs" style={{ color: "#717171" }}>
                          75 € au total
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <img 
                        src="https://images.unsplash.com/photo-1606251706444-d069cd266189?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
                        alt="Tresses"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h5 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                          Tresses
                        </h5>
                        <p className="text-xs" style={{ color: "#717171" }}>
                          175 € au total
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* En savoir plus Section */}
                <div>
                  <h4 className="text-sm mb-4" style={{ fontWeight: 600, color: "#222222" }}>
                    En savoir plus
                  </h4>
                  
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <img 
                      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
                      alt="Comment créer des offres qui se démarquent"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h5 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Comment créer des offres qui se démarquent
                      </h5>
                      <p className="text-xs" style={{ color: "#717171" }}>
                        Temps de lecture : 3 min
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Choose Photo Modal */}
        {showChoosePhotoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-xl relative max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative flex-shrink-0">
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Choisissez une photo
                </h2>
                <button 
                  onClick={() => setShowChoosePhotoModal(false)}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto flex-1 p-6 scrollbar-hide">
                {uploadedPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {uploadedPhotos.map((photo, index) => (
                      <div 
                        key={index}
                        className={`relative cursor-pointer rounded-xl overflow-hidden border-4 transition-all ${
                          selectedOfferPhoto === photo 
                            ? 'border-gray-900' 
                            : 'border-transparent hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedOfferPhoto(photo)}
                      >
                        <img 
                          src={photo} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                        {selectedOfferPhoto === photo && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p style={{ color: "#717171" }}>
                      Aucune photo disponible. Ajoutez des photos à l'étape précédente.
                    </p>
                  </div>
                )}

                {/* Upload more photos button */}
                <button className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-colors flex items-center justify-center gap-3">
                  <Plus className="w-5 h-5" style={{ color: "#222222" }} />
                  <span className="text-sm" style={{ fontWeight: 600, color: "#222222" }}>
                    Ajouter une autre photo
                  </span>
                </button>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex-shrink-0">
                <button
                  onClick={() => setShowChoosePhotoModal(false)}
                  disabled={!selectedOfferPhoto}
                  className={`w-full py-3 rounded-lg text-sm transition-colors ${
                    selectedOfferPhoto
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Info Modal */}
        {showAddInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[80] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative flex-shrink-0">
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Ajoutez des informations
                </h2>
                <button 
                  onClick={() => {
                    setShowAddInfoModal(false);
                    setShowAddOfferModal(true);
                  }}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto flex-1 scrollbar-hide p-6">
                {/* Photo and Title */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-20 h-20 mb-4">
                    {selectedOfferPhoto ? (
                      <img 
                        src={selectedOfferPhoto} 
                        alt="Offer" 
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <button 
                      onClick={() => {
                        setShowAddInfoModal(false);
                        setShowAddOfferModal(true);
                      }}
                      className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-2xl" style={{ fontWeight: 400, color: "#222222" }}>
                    {offerTitle || "Sans titre"}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-3">
                  {/* Description */}
                  <button
                    onClick={() => {
                      setShowAddInfoModal(false);
                      setShowDescriptionModal(true);
                    }}
                    className="w-full border border-gray-300 rounded-lg p-4 flex items-start justify-between hover:border-gray-400 transition-colors"
                  >
                    <div className="text-left flex-1">
                      <p className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Description
                      </p>
                      <p className="text-xs" style={{ color: "#717171" }}>
                        {offerDescription || "Ajoutez une description"}
                      </p>
                    </div>
                  </button>

                  {/* Type de service */}
                  <button
                    onClick={() => {
                      setShowAddInfoModal(false);
                      setShowServiceTypeModal(true);
                    }}
                    className="w-full border border-gray-300 rounded-lg p-4 flex items-center justify-between hover:border-gray-400 transition-colors"
                  >
                    <p className="text-sm" style={{ fontWeight: 600, color: "#222222" }}>
                      Type de service
                    </p>
                    <span className="text-sm" style={{ color: offerServiceType ? "#222222" : "#717171", fontWeight: 600 }}>
                      {offerServiceType || "Sélectionner"}
                    </span>
                  </button>

                  {/* Prix */}
                  <div
                    onClick={() => {
                      setShowPriceModal(true);
                    }}
                    className="w-full border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm" style={{ fontWeight: 600, color: "#222222" }}>
                        Prix
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddInfoModal(false);
                          setShowPriceTypeModal(true);
                        }}
                        className="text-sm border-none outline-none hover:underline bg-transparent" 
                        style={{ color: "#717171" }}
                      >
                        {offerPriceType}
                      </button>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl mr-2" style={{ color: "#717171", fontWeight: 400 }}>$</span>
                      <span className="text-2xl" style={{ color: offerPrice ? "#222222" : "#717171", fontWeight: 400 }}>
                        {offerPrice || "0"}
                      </span>
                    </div>
                  </div>

                  {/* Nombre de voyageurs */}
                  <button
                    onClick={() => {
                      setShowAddInfoModal(false);
                      setShowGuestsModal(true);
                    }}
                    className="w-full border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors text-left"
                  >
                    <p className="text-sm mb-2" style={{ fontWeight: 600, color: "#222222" }}>
                      Nombre de voyageurs
                    </p>
                    <p className="text-sm" style={{ color: "#717171" }}>
                      {offerGuests === 1 ? "Précisez un nombre maximal" : `${offerGuests} voyageurs`}
                    </p>
                  </button>

                  {/* Durée */}
                  <button
                    onClick={() => {
                      setShowAddInfoModal(false);
                      setShowDurationModal(true);
                    }}
                    className="w-full border border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors text-left"
                  >
                    <p className="text-sm mb-2" style={{ fontWeight: 600, color: "#222222" }}>
                      Durée
                    </p>
                    <p className="text-sm" style={{ color: "#717171" }}>
                      {offerDurationHours === 0 && offerDurationMinutes === 0 
                        ? "Définissez une durée" 
                        : `${offerDurationHours}h ${offerDurationMinutes}min`}
                    </p>
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex-shrink-0">
                <button
                  onClick={() => {
                    // Sauvegarder l'offre
                    setSavedOffers([...savedOffers, {
                      title: offerTitle || "test",
                      serviceType: offerServiceType,
                      price: offerPrice,
                      priceType: offerPriceType,
                      guests: offerGuests,
                      durationHours: offerDurationHours,
                      durationMinutes: offerDurationMinutes,
                      description: offerDescription
                    }]);
                    // Réinitialiser les champs
                    setOfferTitle("");
                    setOfferServiceType("");
                    setOfferPrice("");
                    setOfferGuests(1);
                    setOfferDurationHours(0);
                    setOfferDurationMinutes(0);
                    setOfferDescription("");
                    // Fermer le modal et passer à l'étape 12
                    setShowAddInfoModal(false);
                    setStep(12);
                  }}
                  className={`w-full py-3 rounded-lg text-sm transition-colors ${
                    offerServiceType && 
                    offerPrice && 
                    offerGuests > 1 && 
                    (offerDurationHours > 0 || offerDurationMinutes > 0)
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ fontWeight: 600 }}
                  disabled={
                    !offerServiceType || 
                    !offerPrice || 
                    offerGuests <= 1 || 
                    (offerDurationHours === 0 && offerDurationMinutes === 0)
                  }
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Description Modal */}
        {showDescriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[90] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative">
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Décrivez votre offre
                </h2>
                <button 
                  onClick={() => {
                    setShowDescriptionModal(false);
                    setShowAddInfoModal(true);
                  }}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <textarea
                  value={offerDescription}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setOfferDescription(e.target.value);
                    }
                  }}
                  placeholder="Indiquez aux voyageurs ce qui est inclus. Par exemple : « Faites votre choix parmi différentes coiffures, comme des cheveux lisses ou des boucles naturelles... »"
                  className="w-full border border-gray-300 rounded-lg p-4 outline-none focus:border-gray-900 resize-none"
                  rows={8}
                  style={{ color: "#222222", fontSize: "14px" }}
                />
                <p className="text-xs text-right mt-2" style={{ color: "#717171" }}>
                  Caractères restants: {500 - offerDescription.length}/500
                </p>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowDescriptionModal(false);
                    setShowAddInfoModal(true);
                  }}
                  className="text-sm underline hover:no-underline"
                  style={{ color: "#222222", fontWeight: 600 }}
                >
                  Découvrir nos conseils
                </button>
                <button
                  onClick={() => {
                    setShowDescriptionModal(false);
                    setShowAddInfoModal(true);
                  }}
                  className={`px-6 py-2 rounded-lg text-sm transition-colors ${
                    offerDescription.trim() 
                      ? 'bg-gray-900 text-white hover:bg-gray-800' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Service Type Modal */}
        {showServiceTypeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[90] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative flex-shrink-0">
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Choisissez un type de coiffure
                </h2>
                <button 
                  onClick={() => {
                    setShowServiceTypeModal(false);
                    setShowAddInfoModal(true);
                  }}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto flex-1 p-6 scrollbar-hide">
                <div className="space-y-3">
                  {[
                    { name: "Brushing", icon: "💇" },
                    { name: "Coiffage à sec", icon: "✂️" },
                    { name: "Chignons", icon: "👸" },
                    { name: "Tresses", icon: "🎀" },
                    { name: "Coloration des cheveux", icon: "🎨" },
                    { name: "Coupe de cheveux", icon: "✂️" },
                    { name: "Extensions", icon: "💁" }
                  ].map((service) => (
                    <button
                      key={service.name}
                      onClick={() => {
                        setOfferServiceType(service.name);
                        setShowServiceTypeModal(false);
                        setShowAddInfoModal(true);
                      }}
                      className={`w-full border rounded-lg p-4 flex items-center gap-3 hover:border-gray-900 transition-colors ${
                        offerServiceType === service.name ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <span className="text-sm" style={{ fontWeight: 600, color: "#222222" }}>
                        {service.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex-shrink-0">
                <button
                  onClick={() => {
                    setShowServiceTypeModal(false);
                    setShowAddInfoModal(true);
                  }}
                  className="w-full py-3 rounded-lg text-sm bg-gray-200 text-gray-400 transition-colors hover:bg-gray-300"
                  style={{ fontWeight: 600 }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Price Type Modal */}
        {showPriceTypeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative">
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Choisissez une option tarifaire
                </h2>
                <button 
                  onClick={() => {
                    setShowPriceTypeModal(false);
                    setShowAddInfoModal(true);
                  }}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Prix par voyageur */}
                  <button
                    onClick={() => {
                      setOfferPriceType("Par voyageur");
                      setShowPriceTypeModal(false);
                      setShowAddInfoModal(true);
                    }}
                    className={`w-full border rounded-lg p-4 text-left hover:border-gray-900 transition-colors ${
                      offerPriceType === "Par voyageur" ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                    }`}
                  >
                    <p className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                      Prix par voyageur
                    </p>
                    <p className="text-xs" style={{ color: "#717171" }}>
                      Fixez un prix que paie chaque personne et utilisez prix minimum par réservation.
                    </p>
                  </button>

                  {/* Prix fixe */}
                  <button
                    onClick={() => {
                      setOfferPriceType("Prix fixe");
                      setShowPriceTypeModal(false);
                      setShowAddInfoModal(true);
                    }}
                    className={`w-full border rounded-lg p-4 text-left hover:border-gray-900 transition-colors ${
                      offerPriceType === "Prix fixe" ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                    }`}
                  >
                    <p className="text-sm mb-1">
                      <span className="inline-block border border-gray-300 rounded px-2 py-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Prix fixe
                      </span>
                    </p>
                    <p className="text-xs" style={{ color: "#717171" }}>
                      Fixez un prix qu'importe le nombre de voyageurs (jusqu'à votre nombre maximum de voyageurs).
                    </p>
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={() => {
                    setShowPriceTypeModal(false);
                    setShowAddInfoModal(true);
                  }}
                  className="w-full py-3 rounded-lg text-sm bg-gray-900 text-white transition-colors hover:bg-gray-800"
                  style={{ fontWeight: 600 }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Duration Modal */}
        {showDurationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative">
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Définissez une durée
                </h2>
                <button 
                  onClick={() => {
                    setShowDurationModal(false);
                    setShowAddInfoModal(true);
                  }}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Hours */}
                  <div>
                    <label className="text-xs mb-2 block" style={{ color: "#717171" }}>
                      Heures
                    </label>
                    <select 
                      value={offerDurationHours}
                      onChange={(e) => setOfferDurationHours(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-gray-900"
                      style={{ color: "#222222" }}
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>

                  {/* Minutes */}
                  <div>
                    <label className="text-xs mb-2 block" style={{ color: "#717171" }}>
                      Minutes
                    </label>
                    <select 
                      value={offerDurationMinutes}
                      onChange={(e) => setOfferDurationMinutes(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-gray-900"
                      style={{ color: "#222222" }}
                    >
                      {[0, 15, 30, 45].map((min) => (
                        <option key={min} value={min}>{min}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={() => {
                    setShowDurationModal(false);
                    setShowAddInfoModal(true);
                  }}
                  className={`w-full py-3 rounded-lg text-sm transition-colors ${
                    offerDurationHours > 0 || offerDurationMinutes > 0
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ fontWeight: 600 }}
                  disabled={offerDurationHours === 0 && offerDurationMinutes === 0}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guests Modal */}
        {showGuestsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm relative">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative">
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Nombre de voyageurs
                </h2>
                <button 
                  onClick={() => {
                    setShowGuestsModal(false);
                    setShowAddInfoModal(true);
                  }}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 flex flex-col items-center">
                <div className="flex items-center gap-6 mb-6">
                  <button
                    onClick={() => setOfferGuests(Math.max(1, offerGuests - 1))}
                    disabled={offerGuests <= 1}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                      offerGuests <= 1 
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                        : 'border-gray-400 text-gray-600 hover:border-gray-600'
                    }`}
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="text-6xl" style={{ fontWeight: 300, color: "#222222", minWidth: "80px", textAlign: "center" }}>
                    {offerGuests}
                  </div>

                  <button
                    onClick={() => setOfferGuests(Math.min(100, offerGuests + 1))}
                    disabled={offerGuests >= 100}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                      offerGuests >= 100 
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                        : 'border-gray-400 text-gray-600 hover:border-gray-600'
                    }`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs text-center" style={{ color: "#717171" }}>
                  Vous pouvez accueillir jusqu'à 10 voyageurs
                </p>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={() => {
                    setShowGuestsModal(false);
                    setShowAddInfoModal(true);
                  }}
                  className={`w-full py-3 rounded-lg text-sm transition-colors ${
                    offerGuests > 1
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ fontWeight: 600 }}
                  disabled={offerGuests <= 1}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Prix fixe */}
        {showPriceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[90] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm relative">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative">
                <button
                  onClick={() => setShowPriceInfoModal(true)}
                  className="absolute left-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Information"
                >
                  <Info className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Prix fixe
                </h2>
                <button 
                  onClick={() => {
                    setShowPriceModal(false);
                  }}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Prix principal */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center gap-1">
                    <span className="text-5xl" style={{ color: "#222222", fontWeight: 600 }}>$</span>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      placeholder="35"
                      className="text-5xl outline-none border-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ color: "#222222", fontWeight: 600, width: "auto", minWidth: "60px", maxWidth: "150px", MozAppearance: "textfield" }}
                    />
                    <Pencil className="w-5 h-5" style={{ color: "#717171" }} />
                  </div>
                </div>

                {/* Détails du prix */}
                {showPriceDetails && (
                  <div className="mb-4 border border-gray-900 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "#222222" }}>Prix de base</span>
                      <span className="text-sm" style={{ color: "#222222", fontWeight: 600 }}>
                        ${offerPrice || "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "#222222" }}>Frais de service Airbnb</span>
                      <span className="text-sm" style={{ color: "#222222", fontWeight: 600 }}>
                        -${offerPrice ? Math.round(parseFloat(offerPrice) * 0.17) : "0"}
                      </span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 flex items-center justify-between">
                      <span className="text-sm" style={{ color: "#222222", fontWeight: 600 }}>Vous gagnez</span>
                      <span className="text-sm" style={{ color: "#222222", fontWeight: 600 }}>
                        ${offerPrice ? Math.round(parseFloat(offerPrice) * 0.83) : "0"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Toggle Afficher plus/moins */}
                <button
                  onClick={() => setShowPriceDetails(!showPriceDetails)}
                  className="w-full flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-colors mb-4"
                >
                  <span className="text-sm" style={{ color: "#222222" }}>
                    {showPriceDetails ? "Afficher moins" : `Vous gagnez $${offerPrice ? Math.round(parseFloat(offerPrice) * 0.83) : "0"}`}
                  </span>
                  {showPriceDetails ? (
                    <ChevronUp className="w-4 h-4" style={{ color: "#222222" }} />
                  ) : (
                    <ChevronDown className="w-4 h-4" style={{ color: "#222222" }} />
                  )}
                </button>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setShowPriceAdviceModal(true)}
                    className="text-sm hover:underline"
                    style={{ color: "#222222", fontWeight: 600 }}
                  >
                    Obtenir des conseils
                  </button>
                  <button
                    onClick={() => {
                      setShowPriceModal(false);
                    }}
                    className={`px-6 py-3 rounded-lg text-sm transition-colors ${
                      offerPrice && parseFloat(offerPrice) > 0
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    style={{ fontWeight: 600 }}
                    disabled={!offerPrice || parseFloat(offerPrice) <= 0}
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Découvrez nos conseils */}
        {showPriceAdviceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative">
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Découvrez nos conseils
                </h2>
                <button 
                  onClick={() => setShowPriceAdviceModal(false)}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <h3 className="text-2xl mb-6" style={{ fontWeight: 600, color: "#222222" }}>
                  Comment fixer<br />vos prix sur Airbnb
                </h3>

                <div className="space-y-6">
                  {/* Conseil 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center">
                        <Calendar className="w-5 h-5" style={{ color: "#222222" }} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Tenez compte de vos dépenses
                      </h4>
                      <p className="text-sm" style={{ color: "#717171" }}>
                        Prenez en compte vos frais de déplacement et les frais de service pour chaque nouvelle visite.
                      </p>
                    </div>
                  </div>

                  {/* Conseil 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center">
                        <MapPinned className="w-5 h-5" style={{ color: "#222222" }} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Comparez les services similaires
                      </h4>
                      <p className="text-sm" style={{ color: "#717171" }}>
                        Découvrez les prix pratiqués dans votre zone géographique.
                      </p>
                    </div>
                  </div>

                  {/* Conseil 3 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center">
                        <MinusCircle className="w-5 h-5" style={{ color: "#222222" }} />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Proposez une réduction
                      </h4>
                      <p className="text-sm" style={{ color: "#717171" }}>
                        Les offres spéciales sont un excellent moyen d'attirer de nouveaux voyageurs et d'obtenir de bons commentaires.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Article section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs mb-3" style={{ color: "#717171" }}>
                    En savoir plus
                  </p>
                  <div className="flex gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=80&h=80&fit=crop"
                      alt="Article"
                      className="w-16 h-16 rounded-lg object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <h5 className="text-sm mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Comment fixer vos prix sur Airbnb
                      </h5>
                      <p className="text-xs" style={{ color: "#717171" }}>
                        Temps de lecture : 3 min
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal À propos de la tarification */}
        {showPriceInfoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md relative max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative flex-shrink-0">
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  À propos de la tarification
                </h2>
                <button 
                  onClick={() => setShowPriceInfoModal(false)}
                  className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="overflow-y-auto flex-1 p-6 scrollbar-hide">
                <p className="text-sm mb-6" style={{ color: "#222222" }}>
                  Vous fixez votre propre prix et pouvez le modifier à tout moment.
                </p>

                <div className="space-y-6">
                  {/* Section 1 */}
                  <div>
                    <h4 className="text-sm mb-2" style={{ fontWeight: 600, color: "#222222" }}>
                      Détails du prix à payer par le voyageur
                    </h4>
                    <p className="text-sm" style={{ color: "#717171" }}>
                      Lorsque le prix est affiché, les frais de service applicables aux voyageurs de frais texte ne sont pas affichés, les frais de service applicables aux voyageurs de 18% texte, c est pourquoi peuvent varier en fonction de spécificités de chaque réservation (par exemple, la durée du voyage).
                    </p>
                  </div>

                  {/* Section 2 */}
                  <div>
                    <h4 className="text-sm mb-2" style={{ fontWeight: 600, color: "#222222" }}>
                      Frais de service Airbnb
                    </h4>
                    <p className="text-sm" style={{ color: "#717171" }}>
                      Les frais de service que vous payez dépendent du tarifs propres. Les frais de service correspondent à un pourcentage du total de la réservation ou à un montant minimum. En savoir plus
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Step 13: Ajoutez des réductions
  if (step === 13) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
            <button 
              onClick={() => setStep(12)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" style={{ color: "#222222" }} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ fontWeight: 600, color: "#222222" }}>
                Offres
              </span>
              <span className="text-sm" style={{ color: "#717171" }}>
                Étape 5 sur 6
              </span>
            </div>
            <button
              className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
              style={{ fontWeight: 600, color: "#222222" }}
              onClick={() => onNavigate("annonces")}
            >
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Progress */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto py-12">
              <h1
                className="text-5xl mb-4 text-center"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Ajoutez des réductions
              </h1>
              
              <p className="text-center mb-12" style={{ color: "#717171", fontSize: "16px" }}>
                Si une réservation remplit les critères pour plusieurs réductions, nous appliquerons automatiquement la plus avantageuse.
              </p>

              {/* Section 1: Durée limitée */}
              <div className="mb-8">
                <button
                  onClick={() => setShowLimitedTimeModal(true)}
                  className="w-full border border-gray-300 rounded-xl p-4 hover:border-gray-400 transition-colors text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-base mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Durée limitée
                      </p>
                      <p className="text-sm" style={{ color: "#717171" }}>
                        Proposez une offre pour les 90 prochains jours afin d'encourager vos premiers voyageurs à réserver.
                      </p>
                    </div>
                    <Plus className="w-5 h-5 ml-3 flex-shrink-0" style={{ color: "#222222" }} />
                  </div>
                </button>
              </div>

              {/* Section 2: Réservation anticipée */}
              <div className="mb-8">
                <button
                  onClick={() => setShowEarlyBookingModal(true)}
                  className="w-full border border-gray-300 rounded-xl p-4 hover:border-gray-400 transition-colors text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-base mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                        Réservation anticipée
                      </p>
                      <p className="text-sm" style={{ color: "#717171" }}>
                        Proposez un prix avantageux aux voyageurs qui réservent plus de 7 semaines à l'avance.
                      </p>
                    </div>
                    <Plus className="w-5 h-5 ml-3 flex-shrink-0" style={{ color: "#222222" }} />
                  </div>
                </button>
              </div>

              {/* Section 3: Réductions pour les grands groupes */}
              <div>
                <h2 className="text-xl mb-2" style={{ fontWeight: 600, color: "#222222" }}>
                  Réductions pour les grands groupes
                </h2>
                <p className="text-sm mb-4" style={{ color: "#717171" }}>
                  Attirez les groupes de taille importante en leur offrant une réduction.
                </p>
                <button 
                  onClick={() => setShowGroupDiscountModal(true)}
                  className="w-full border border-gray-300 rounded-xl p-4 hover:border-gray-400 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base" style={{ fontWeight: 400, color: "#222222" }}>
                      Ajouter une réduction
                    </span>
                    <Plus className="w-5 h-5" style={{ color: "#222222" }} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
            <button 
              onClick={() => setStep(12)}
              className="text-sm underline hover:no-underline" 
              style={{ color: "#222222", fontWeight: 600 }}
            >
              Retour
            </button>
            <button
              onClick={() => setStep(15)}
              className="px-6 py-3 rounded-lg text-sm bg-gray-900 text-white transition-colors hover:bg-gray-800"
              style={{ fontWeight: 600 }}
            >
              Suivant
            </button>
          </div>
        </footer>

        {/* Limited Time Discount Modal */}
        {showLimitedTimeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative">
                <button
                  onClick={() => setShowLimitedTimeModal(false)}
                  className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
                <div className="text-center">
                  <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                    Réduction à durée limitée
                  </h2>
                  <p className="text-xs mt-1" style={{ color: "#717171" }}>
                    Applies to all bookings made in the first 90 days
                  </p>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-12 flex items-center justify-center">
                <div className="flex items-center justify-center gap-2">
                  <input
                    type="number"
                    value={limitedTimeDiscount}
                    onChange={(e) => setLimitedTimeDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="text-8xl text-center outline-none w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{ fontWeight: 600, color: "#222222" }}
                    min="0"
                    max="100"
                  />
                  <span className="text-8xl" style={{ fontWeight: 600, color: "#222222" }}>%</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    setLimitedTimeDiscount(0);
                    setShowLimitedTimeModal(false);
                  }}
                  className="text-sm"
                  style={{ color: "#717171", fontWeight: 400 }}
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowLimitedTimeModal(false)}
                  className="px-6 py-2 rounded-lg text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Early Booking Modal */}
        {showEarlyBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative">
                <button
                  onClick={() => setShowEarlyBookingModal(false)}
                  className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
                <div className="text-center">
                  <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                    Réduction en cas de réservation anticipée
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2" style={{ fontWeight: 600, color: "#222222" }}>
                    20 % de
                  </div>
                  <div className="text-6xl" style={{ fontWeight: 600, color: "#222222" }}>
                    réduction
                  </div>
                  <p className="text-sm mt-6" style={{ color: "#717171" }}>
                    Applicable à toutes les réservations effectuées plus de 7 semaines à l'avance.
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    setEarlyBookingApplied(false);
                    setShowEarlyBookingModal(false);
                  }}
                  className="text-sm"
                  style={{ color: "#717171", fontWeight: 400 }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setEarlyBookingApplied(true);
                    setShowEarlyBookingModal(false);
                  }}
                  className="px-6 py-2 rounded-lg text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Appliquer la réduction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Group Discount Modal */}
        {showGroupDiscountModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative">
                <button
                  onClick={() => setShowGroupDiscountModal(false)}
                  className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
                <div className="text-center">
                  <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                    Réduction pour les grands groupes
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Nombre minimum de voyageurs */}
                <div className="mb-6">
                  <label className="block mb-2">
                    <span className="text-sm" style={{ color: "#717171" }}>
                      Nombre minimum de voyageurs
                    </span>
                  </label>
                  <input
                    type="number"
                    value={groupMinTravelers}
                    onChange={(e) => setGroupMinTravelers(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base outline-none focus:border-gray-900 transition-colors"
                    style={{ color: "#222222" }}
                    placeholder=""
                    min="1"
                  />
                </div>

                {/* Réduction */}
                <div>
                  <label className="block mb-2">
                    <span className="text-sm" style={{ color: "#717171" }}>
                      Réduction
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={groupDiscount}
                      onChange={(e) => setGroupDiscount(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-base outline-none focus:border-gray-900 transition-colors"
                      style={{ color: "#222222" }}
                      placeholder=""
                      min="0"
                      max="100"
                    />
                    <span 
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base"
                      style={{ color: "#717171" }}
                    >
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    setGroupMinTravelers('');
                    setGroupDiscount('');
                    setShowGroupDiscountModal(false);
                  }}
                  className="text-sm underline hover:no-underline"
                  style={{ color: "#717171", fontWeight: 400 }}
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowGroupDiscountModal(false)}
                  className="px-6 py-2 rounded-lg text-sm bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  style={{ fontWeight: 600 }}
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

  // Step 14: Définissez vos horaires de disponibilité
  if (step === 14) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
            <button 
              onClick={() => setStep(13)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" style={{ color: "#222222" }} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ fontWeight: 600, color: "#222222" }}>
                Offres
              </span>
              <span className="text-sm" style={{ color: "#717171" }}>
                Étape 5 sur 6
              </span>
            </div>
            <button
              className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
              style={{ fontWeight: 600, color: "#222222" }}
              onClick={() => onNavigate("annonces")}
            >
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Progress */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 flex items-start justify-center pt-16">
          <div className="w-full max-w-2xl mx-auto">
            <h1
              className="text-5xl mb-4 text-center"
              style={{ fontWeight: 600, color: "#222222" }}
            >
              Définissez vos horaires de disponibilité
            </h1>
            
            <p className="text-center mb-12" style={{ color: "#717171", fontSize: "16px" }}>
              Vos horaires s'appliquent à toutes vos offres. Vous pouvez définir ultérieurement des horaires personnalisés pour chaque offre.
            </p>

            {/* Schedule Boxes - Dynamic */}
            {savedSchedules.map((schedule, index) => (
              <div 
                key={index}
                onClick={() => {
                  setSelectedDays(schedule.days);
                  setStartTime(schedule.startTime);
                  setEndTime(schedule.endTime);
                  setEditingScheduleIndex(index);
                  setShowScheduleModal(true);
                }}
                className="border border-gray-300 rounded-xl p-4 flex items-center justify-between hover:border-gray-400 transition-colors cursor-pointer mb-4"
              >
                <div>
                  <p className="text-base mb-1" style={{ fontWeight: 600, color: "#222222" }}>
                    {formatSelectedDays(schedule.days)}
                  </p>
                  <p className="text-sm" style={{ color: "#717171" }}>
                    {schedule.startTime} - {schedule.endTime}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5" style={{ color: "#222222" }} />
              </div>
            ))}

            {/* Add Hours Button */}
            <button
              onClick={() => {
                setScheduleType('custom');
                setSelectedDays([]);
                setStartTime('09:00');
                setEndTime('17:00');
                setEditingScheduleIndex(null);
                setShowScheduleModal(true);
              }}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-colors flex items-center justify-center gap-3"
            >
              <Plus className="w-5 h-5" style={{ color: "#222222" }} />
              <span className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                Ajouter d'autres heures
              </span>
            </button>
          </div>
          </div>
        </div>

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              {/* Modal Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-center relative">
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setShowDaysDropdown(false);
                  }}
                  className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" style={{ color: "#222222" }} />
                </button>
                <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
                  Horaires disponibles
                </h2>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {/* Days Dropdown */}
                <div className="relative">
                  <label className="block text-sm mb-2" style={{ fontWeight: 600, color: "#222222" }}>
                    Jours
                  </label>
                  <button
                    onClick={() => setShowDaysDropdown(!showDaysDropdown)}
                    className="w-full border border-gray-300 rounded-lg p-3 flex items-center justify-between hover:border-gray-400 transition-colors"
                  >
                    <span className="text-base" style={{ color: scheduleType === 'custom' && selectedDays.length === 0 ? "#717171" : "#222222" }}>
                      {formatSelectedDays(selectedDays)}
                    </span>
                    <ChevronRight 
                      className="w-5 h-5" 
                      style={{ 
                        color: "#222222",
                        transform: showDaysDropdown ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  </button>

                  {/* Days Dropdown Panel */}
                  {showDaysDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4">
                      <div className="mb-4">
                        <p className="text-xs mb-3" style={{ color: "#717171", fontWeight: 600 }}>
                          Jours
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((day) => (
                            <button
                              key={day}
                              onClick={() => {
                                setScheduleType('custom');
                                setSelectedDays(prev => 
                                  prev.includes(day) 
                                    ? prev.filter(d => d !== day)
                                    : [...prev, day]
                                );
                              }}
                              className={`px-4 py-2 rounded-full text-sm transition-all ${
                                selectedDays.includes(day)
                                  ? 'bg-black text-white'
                                  : 'bg-white border border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ fontWeight: 600 }}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setScheduleType('custom');
                              setSelectedDays(prev => 
                                prev.includes('Samedi') 
                                  ? prev.filter(d => d !== 'Samedi')
                                  : [...prev, 'Samedi']
                              );
                            }}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                              selectedDays.includes('Samedi')
                                ? 'bg-black text-white'
                                : 'bg-white border border-gray-300 hover:border-gray-400'
                            }`}
                            style={{ fontWeight: 600 }}
                          >
                            Samedi
                          </button>
                          <button
                            onClick={() => {
                              setScheduleType('custom');
                              setSelectedDays(prev => 
                                prev.includes('Dimanche') 
                                  ? prev.filter(d => d !== 'Dimanche')
                                  : [...prev, 'Dimanche']
                              );
                            }}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                              selectedDays.includes('Dimanche')
                                ? 'bg-black text-white'
                                : 'bg-white border border-gray-300 hover:border-gray-400'
                            }`}
                            style={{ fontWeight: 600 }}
                          >
                            Dimanche
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Start Time Dropdown */}
                <div className="relative">
                  <label className="block text-sm mb-2" style={{ fontWeight: 600, color: "#222222" }}>
                    De
                  </label>
                  <button
                    onClick={() => {
                      setShowStartTimeDropdown(!showStartTimeDropdown);
                      setShowEndTimeDropdown(false);
                    }}
                    className="w-full border border-gray-300 rounded-lg p-3 flex items-center justify-between hover:border-gray-400 transition-colors"
                  >
                    <span className="text-base" style={{ color: startTime ? "#222222" : "#717171" }}>
                      {startTime || 'Choisir'}
                    </span>
                    <ChevronRight 
                      className="w-5 h-5" 
                      style={{ 
                        color: "#222222",
                        transform: showStartTimeDropdown ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  </button>

                  {/* Time Options */}
                  {showStartTimeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return [`${hour}:00`, `${hour}:15`, `${hour}:30`, `${hour}:45`];
                      }).flat().map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setStartTime(time);
                            setShowStartTimeDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors text-sm"
                          style={{ color: "#222222" }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* End Time Dropdown */}
                <div className="relative">
                  <label className="block text-sm mb-2" style={{ fontWeight: 600, color: "#222222" }}>
                    À
                  </label>
                  <button
                    onClick={() => {
                      setShowEndTimeDropdown(!showEndTimeDropdown);
                      setShowStartTimeDropdown(false);
                    }}
                    className="w-full border border-gray-300 rounded-lg p-3 flex items-center justify-between hover:border-gray-400 transition-colors"
                  >
                    <span className="text-base" style={{ color: endTime ? "#222222" : "#717171" }}>
                      {endTime || 'Choisir'}
                    </span>
                    <ChevronRight 
                      className="w-5 h-5" 
                      style={{ 
                        color: "#222222",
                        transform: showEndTimeDropdown ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }} 
                    />
                  </button>

                  {/* Time Options */}
                  {showEndTimeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return [`${hour}:00`, `${hour}:15`, `${hour}:30`, `${hour}:45`];
                      }).flat().map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setEndTime(time);
                            setShowEndTimeDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors text-sm"
                          style={{ color: "#222222" }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-4 flex items-center justify-between">
                <button
                  onClick={handleDeleteSchedule}
                  className="text-sm underline hover:no-underline"
                  style={{ color: "#222222", fontWeight: 600 }}
                >
                  Supprimer
                </button>
                <button
                  onClick={handleSaveSchedule}
                  disabled={selectedDays.length === 0}
                  className={`px-6 py-2 rounded-lg text-sm transition-colors ${
                    selectedDays.length === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-between">
            <button 
              onClick={() => setStep(13)}
              className="text-sm underline hover:no-underline" 
              style={{ color: "#222222", fontWeight: 600 }}
            >
              Retour
            </button>
            <button
              onClick={() => setStep(15)}
              className="px-6 py-3 rounded-lg text-sm bg-gray-900 text-white transition-colors hover:bg-gray-800"
              style={{ fontWeight: 600 }}
            >
              Suivant
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // Step 15: Consultez les critères
  if (step === 15) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
            <button 
              onClick={() => setStep(14)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" style={{ color: "#222222" }} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ fontWeight: 600, color: "#222222" }}>
                Détails
              </span>
              <span className="text-sm" style={{ color: "#717171" }}>
                Étape 6 sur 6
              </span>
            </div>
            <button
              className="px-4 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
              style={{ fontWeight: 600, color: "#222222" }}
              onClick={() => onNavigate("annonces")}
            >
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Progress */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-6 flex items-center justify-center">
            <div className="w-full max-w-2xl mx-auto py-12">
              <h1
                className="text-5xl mb-4 text-center"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Consultez les critères
              </h1>
              
              <p className="text-center mb-12" style={{ color: "#717171", fontSize: "16px" }}>
                Confirmez que votre annonce répond à nos conditions et critères.
              </p>

              <div className="space-y-6" style={{ color: "#222222", fontSize: "16px", lineHeight: "1.6" }}>
                <p>
                  Vous avez lu, compris et acceptez les <a href="#" className="underline hover:no-underline">Conditions relatives aux services</a>, la <a href="#" className="underline hover:no-underline">Politique en cas d'annulation</a> par l'hôte d'expériences et de services, et les <a href="#" className="underline hover:no-underline">conditions d'annulation</a> relatives aux services et aux expériences. Vous acceptez également la <a href="#" className="underline hover:no-underline">Politique de confidentialité</a>.
                </p>
                
                <p>
                  En sélectionnant J'accepte, vous autorisez Airbnb à procéder à des <a href="#" className="underline hover:no-underline">contrôles de qualité et de conformité</a> et d'envoyer des informations concernant tous les services et expériences proposés aux voyageurs et votre profil d'hôte à certaines parties tierces impliquées dans les préférences et les services que vous conservez tous les arrangements, autorisations et assurances appropriées.
                </p>
                
                <p>
                  Vous attestez que vous vous conformez aux <a href="#" className="underline hover:no-underline">conditions et critères relatifs aux services</a>, ainsi qu'à toutes les autres lois et obligations liées à votre offre, notamment celles de l'appartement à ce que vos…
                </p>
                
                <p>
                  Proposer <a href="#" className="underline hover:no-underline">des services de main-d'œil</a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-end">
            <button
              onClick={() => setStep(16)}
              className="px-6 py-3 rounded-lg text-sm bg-gray-900 text-white transition-colors hover:bg-gray-800"
              style={{ fontWeight: 600 }}
            >
              J'accepte
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // Step 16: Review - Envoyez votre annonce
  if (step === 16) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Header */}
        <header className="bg-black border-b border-gray-800">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <path d="M16 2l-8 8h5v12h6V10h5z" fill="#10B981"/>
              </svg>
              <span className="text-xl font-semibold text-white">HOMIQIO</span>
            </div>
            <button
              className="px-4 py-2 text-sm hover:bg-gray-800 rounded-lg transition-colors text-white"
              style={{ fontWeight: 600 }}
              onClick={() => onNavigate("annonces")}
            >
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Content */}
          <div className="flex-1 overflow-y-auto px-6 lg:px-20 py-12">
            <div className="max-w-2xl">
              <h1
                className="text-5xl mb-4"
                style={{ fontWeight: 600, color: "#FFFFFF" }}
              >
                Envoyez votre annonce
              </h1>
              
              <p className="mb-12" style={{ color: "#B0B0B0", fontSize: "16px" }}>
                Vérifiez les informations, puis envoyez-les quand tout est prêt.
              </p>

              {/* Review Sections */}
              <div className="space-y-4">
                {/* À propos de vous */}
                <button
                  onClick={() => {
                    setStep(4);
                    window.scrollTo(0, 0);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-900 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-base font-semibold text-white">À propos de vous</div>
                      <div className="text-sm text-gray-400">Vos coordonnées</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Lieu */}
                <button
                  onClick={() => {
                    setStep(7);
                    window.scrollTo(0, 0);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-900 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-base font-semibold text-white">Lieu</div>
                      <div className="text-sm text-gray-400">
                        {locationDetails.street || locationDetails.city || "Non défini"}
                        {locationDetails.city && `, ${locationDetails.city}`}
                      </div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Photos */}
                <button
                  onClick={() => {
                    setStep(8);
                    window.scrollTo(0, 0);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-900 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-700">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-base font-semibold text-white">Photos</div>
                      <div className="text-sm text-gray-400">
                        {uploadedPhotos.length > 0 ? `${uploadedPhotos.length} photo${uploadedPhotos.length > 1 ? 's' : ''}` : 'Aucune photo'}
                      </div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Service */}
                <button
                  onClick={() => {
                    setStep(9);
                    window.scrollTo(0, 0);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-900 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-base font-semibold text-white">Service</div>
                      <div className="text-sm text-gray-400">
                        {serviceTitle || "Sans titre"}
                      </div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Offres */}
                <button
                  onClick={() => {
                    setStep(12);
                    window.scrollTo(0, 0);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-900 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-700">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-base font-semibold text-white">Offres</div>
                      <div className="text-sm text-gray-400">
                        {offerTitle || "Non configurée"}
                      </div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Détails */}
                <button
                  onClick={() => {
                    setStep(14);
                    window.scrollTo(0, 0);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-900 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center group-hover:bg-gray-700">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-base font-semibold text-white">Détails</div>
                      <div className="text-sm text-gray-400">Aucune</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Footer link */}
              <div className="mt-8">
                <p className="text-sm" style={{ color: "#B0B0B0" }}>
                  Vous faites partie d'une organisation partenaire ?{" "}
                  <a href="#" className="underline hover:no-underline">
                    Saisir un code d'invitation
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:w-96 bg-black p-6 lg:p-12 flex items-center justify-center border-l border-gray-800">
            <div className="bg-white rounded-3xl shadow-xl max-w-xs w-full overflow-hidden">
              {/* Preview Image Section */}
              <div className="relative">
                <div className="aspect-[4/3] bg-gray-400 relative">
                  {uploadedPhotos.length > 0 ? (
                    <img src={uploadedPhotos[0]} alt="Service" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gray-400 flex items-center justify-center">
                      {/* Mini preview card overlay */}
                      <div className="bg-white rounded-lg shadow-lg p-3 max-w-[120px]">
                        <div className="bg-gray-200 h-20 rounded mb-2"></div>
                        <div className="space-y-1">
                          <div className="bg-gray-300 h-2 rounded"></div>
                          <div className="bg-gray-300 h-2 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Avatar circle at bottom center */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" strokeWidth="2" />
                      <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <div className="pt-10 pb-8 px-6 text-center">
                <h3 className="text-2xl" style={{ fontWeight: 600, color: "#222222" }}>
                  {serviceTitle || "test"}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <footer className="bg-black border-t border-gray-800">
          <div className="px-6 lg:px-20 h-20 flex items-center justify-end">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-400">
                En sélectionnant le bouton, j'accepte les{" "}
                <a href="#" className="underline hover:no-underline text-white">
                  Conditions relatives aux services
                </a>
                .
              </p>
              <button
                onClick={() => onNavigate("annonces")}
                className="px-6 py-3 rounded-lg text-sm transition-colors"
                style={{ fontWeight: 600, backgroundColor: "#10B981", color: "white" }}
              >
                Envoyer pour vérification
              </button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Return null if no step matches
  return null;
}