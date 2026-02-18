'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Step, Bedroom } from './types';
import { EXPECTATIONS_DATA } from './constants';
import { STEPS_LIST } from './constants';

const emptyBedroomBeds = {
  simple: 0, double: 0, queen: 0, king: 0,
  simple_bunk: 0, double_bunk: 0, queen_bunk: 0, king_bunk: 0,
  sofa_bed: 0, other: 0,
};

export interface UseHostOnboardingStateProps {
  initialStep?: Step;
  onNavigate: (page: string, data?: any) => void;
  onCompleteOnboarding?: () => void;
  onStepChange?: (step: Step) => void;
}

export function useHostOnboardingState({
  initialStep = 'acceptance-condition',
  onNavigate,
  onCompleteOnboarding,
  onStepChange,
}: UseHostOnboardingStateProps) {
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);

  useEffect(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  const changeStep = (newStep: Step) => {
    if (onStepChange) {
      onStepChange(newStep);
    } else {
      setCurrentStep(newStep);
    }
  };

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
    country: 'CA',
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
      beds: { ...emptyBedroomBeds, simple: 1 },
    },
  ]);

  const [openAreas, setOpenAreas] = useState<Bedroom[]>([]);

  // 5. Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [expandedAmenities, setExpandedAmenities] = useState<Record<string, boolean>>({
    'Attraits extérieurs': true,
  });

  // 6. Expectations
  const [expectations, setExpectations] = useState<Record<string, 'yes' | 'no' | null>>(() => {
    const defaults: Record<string, 'yes' | 'no' | null> = {};
    EXPECTATIONS_DATA.client.forEach((item) => (defaults[item.id] = 'yes'));
    EXPECTATIONS_DATA.safety.forEach((item) => (defaults[item.id] = 'yes'));
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
    otherInfo: '',
  });

  // 8. Reservation Mode & Stay Duration
  const [reservationMode, setReservationMode] = useState<'request' | 'instant'>('request');
  const [arrivalTime, setArrivalTime] = useState('17:00');
  const [departureTime, setDepartureTime] = useState('11:00');
  const [minAge, setMinAge] = useState('18');
  const [permissions, setPermissions] = useState<Record<string, 'yes' | 'no' | null>>({});

  const [minStay, setMinStay] = useState('1');
  const [maxStay, setMaxStay] = useState('Aucun maximum');
  const [advancedStaySettingsOpen, setAdvancedStaySettingsOpen] = useState(true);
  const [departureDays, setDepartureDays] = useState<Record<string, boolean>>({
    Lun: true, Mar: true, Mer: true, Jeu: true, Ven: true, Sam: false, Dim: true,
  });
  const [arrivalDays, setArrivalDays] = useState<Record<string, boolean>>({
    Lun: true, Mar: true, Mer: true, Jeu: true, Ven: true, Sam: false, Dim: true,
  });

  // 10. Pricing
  const [currency, setCurrency] = useState('CAD (C$)');
  const [pricing, setPricing] = useState({
    base: '120',
    weekend: '',
    weekly: '',
    monthly: '',
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
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'rates' | 'blocks'>('rates');

  const [rateModalMinStay, setRateModalMinStay] = useState('1');
  const [rateModalMaxStay, setRateModalMaxStay] = useState('Aucun maximum');
  const [rateModalNote, setRateModalNote] = useState('');

  const [isBlockEnabled, setIsBlockEnabled] = useState(true);
  const [blockModalNote, setBlockModalNote] = useState('');

  // 13. Cancellation Policy
  const [cancellationPolicy, setCancellationPolicy] = useState('Flexible');

  // 14. Taxes & Laws
  const [taxRegistration, setTaxRegistration] = useState({
    type: 'CITQ',
    number: '',
    issueDate: { d: '1', m: 'Janvier', y: '2027' },
    expDate: { d: '1', m: 'Janvier', y: '2027' },
    taxesIncluded: null as boolean | null,
  });

  // 15. Local Laws
  const [acceptedLocalLaws, setAcceptedLocalLaws] = useState(false);

  // 16. Guest Arrival
  const [guestArrival, setGuestArrival] = useState({
    internetSpeed: '',
    hasWifi: null as boolean | null,
    guideFile: null as string | null,
    instructions: '',
    checkinMethod: '',
  });

  // 17. Phone Number
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [smsCode, setSmsCode] = useState('');

  // 18. Signature
  const [signatureName, setSignatureName] = useState('');
  const [isSigned, setIsSigned] = useState(false);

  // Modal state
  const [editingItem, setEditingItem] = useState<{ item: Bedroom; type: 'bedroom' | 'openArea' } | null>(null);

  // Helpers
  const currentStepIndex = STEPS_LIST.indexOf(currentStep);
  const progressPercentage = ((currentStepIndex + 1) / STEPS_LIST.length) * 100;

  const getCurrentBigStep = () => {
    if (['acceptance-condition', 'reservation-type', 'address-location', 'capacity-details', 'client-expectations', 'amenities', 'summary-review-1'].includes(currentStep)) return 1;
    if (['host-photo', 'chalet-photos', 'chalet-description', 'summary-review-2'].includes(currentStep)) return 2;
    return 3;
  };
  const currentBigStep = getCurrentBigStep();

  const addBedroom = () => {
    const newId = (bedrooms.length + 1).toString();
    setBedrooms([
      ...bedrooms,
      { id: newId, name: `Chambre #${newId}`, beds: { ...emptyBedroomBeds } },
    ]);
  };

  const addOpenArea = () => {
    const newId = `oa-${openAreas.length + 1}`;
    setOpenAreas([
      ...openAreas,
      { id: newId, name: `Aire ouverte #${openAreas.length + 1}`, beds: { ...emptyBedroomBeds } },
    ]);
  };

  const removeBedroom = () => {
    if (bedrooms.length > 0) setBedrooms(bedrooms.slice(0, -1));
  };

  const removeOpenArea = () => {
    if (openAreas.length > 0) setOpenAreas(openAreas.slice(0, -1));
  };

  const updateItem = (updatedItem: Bedroom, type: 'bedroom' | 'openArea') => {
    if (type === 'bedroom') {
      setBedrooms(bedrooms.map((b) => (b.id === updatedItem.id ? updatedItem : b)));
    } else {
      setOpenAreas(openAreas.map((b) => (b.id === updatedItem.id ? updatedItem : b)));
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
        beds: { ...editingItem.item.beds, [bedType]: newCount },
      },
    });
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSection = (section: string) => {
    setExpandedAmenities((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const setExpectationValue = (id: string, value: 'yes' | 'no') => {
    setExpectations((prev) => ({ ...prev, [id]: value }));
  };

  const setPermissionValue = (id: string, value: 'yes' | 'no') => {
    setPermissions((prev) => ({ ...prev, [id]: value }));
  };

  const handleHostPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setHostPhoto(reader.result as string);
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
            setChaletPhotos((prev) => [...prev, ...newPhotos]);
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

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (currentStep === 'phone-number') {
      setIsSmsModalOpen(true);
      return;
    }
    if (nextIndex < STEPS_LIST.length) {
      changeStep(STEPS_LIST[nextIndex]);
      window.scrollTo(0, 0);
    } else {
      if (onCompleteOnboarding) onCompleteOnboarding();
      else toast.success("Inscription terminée !");
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      changeStep(STEPS_LIST[prevIndex]);
      window.scrollTo(0, 0);
    } else {
      onNavigate('logements');
    }
  };

  const jumpToStep = (step: Step) => {
    changeStep(step);
    window.scrollTo(0, 0);
  };

  return {
    currentStep,
    changeStep,
    currentStepIndex,
    progressPercentage,
    currentBigStep,
    stepsList: STEPS_LIST,
    onNavigate,
    onCompleteOnboarding,
    acceptedConditions,
    setAcceptedConditions,
    rentalFrequency,
    setRentalFrequency,
    spaceType,
    setSpaceType,
    addressData,
    setAddressData,
    capacityData,
    setCapacityData,
    bedrooms,
    setBedrooms,
    openAreas,
    setOpenAreas,
    selectedAmenities,
    expandedAmenities,
    expectations,
    hostPhoto,
    chaletPhotos,
    setChaletPhotos,
    descriptionData,
    setDescriptionData,
    reservationMode,
    setReservationMode,
    arrivalTime,
    setArrivalTime,
    departureTime,
    setDepartureTime,
    minAge,
    setMinAge,
    permissions,
    minStay,
    setMinStay,
    maxStay,
    setMaxStay,
    advancedStaySettingsOpen,
    setAdvancedStaySettingsOpen,
    departureDays,
    setDepartureDays,
    arrivalDays,
    setArrivalDays,
    currency,
    setCurrency,
    pricing,
    setPricing,
    fees,
    setFees,
    extraGuestFeeOpen,
    setExtraGuestFeeOpen,
    petFeeOpen,
    setPetFeeOpen,
    extraGuestFee,
    setExtraGuestFee,
    petFee,
    setPetFee,
    isImportModalOpen,
    setIsImportModalOpen,
    isRateModalOpen,
    setIsRateModalOpen,
    isBlockModalOpen,
    setIsBlockModalOpen,
    activeTab,
    setActiveTab,
    rateModalMinStay,
    setRateModalMinStay,
    rateModalMaxStay,
    setRateModalMaxStay,
    rateModalNote,
    setRateModalNote,
    isBlockEnabled,
    setIsBlockEnabled,
    blockModalNote,
    setBlockModalNote,
    cancellationPolicy,
    setCancellationPolicy,
    taxRegistration,
    setTaxRegistration,
    acceptedLocalLaws,
    setAcceptedLocalLaws,
    guestArrival,
    setGuestArrival,
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    isSmsModalOpen,
    setIsSmsModalOpen,
    smsCode,
    setSmsCode,
    signatureName,
    setSignatureName,
    isSigned,
    setIsSigned,
    editingItem,
    setEditingItem,
    addBedroom,
    addOpenArea,
    removeBedroom,
    removeOpenArea,
    updateItem,
    handleBedCountChange,
    toggleAmenity,
    toggleSection,
    setExpectationValue,
    setPermissionValue,
    handleHostPhotoUpload,
    handleChaletPhotoUpload,
    isNextDisabled,
    handleNext,
    handleBack,
    jumpToStep,
  };
}
