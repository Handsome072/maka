import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface HostOnboardingProps {
  onNavigate: (page: string, data?: any) => void;
  initialStep?: 'intro' | 'step1' | 'property-type' | 'space-type' | 'location' | 'confirm-address' | 'pin-location' | 'guest-info' | 'step2-intro' | 'amenities' | 'photos' | 'photo-upload' | 'photo-review' | 'title' | 'highlights' | 'description' | 'step3-intro' | 'reservation-settings' | 'pricing' | 'weekend-pricing' | 'discounts' | 'security' | 'final-details' | 'verification-points';
  onCompleteOnboarding?: () => void;
}

export function HostOnboarding({ onNavigate, initialStep = 'intro', onCompleteOnboarding }: HostOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'step1' | 'property-type' | 'space-type' | 'location' | 'confirm-address' | 'pin-location' | 'guest-info' | 'step2-intro' | 'amenities' | 'photos' | 'photo-upload' | 'photo-review' | 'title' | 'highlights' | 'description' | 'step3-intro' | 'reservation-settings' | 'pricing' | 'weekend-pricing' | 'discounts' | 'security' | 'final-details' | 'verification-points'>(initialStep);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSpaceType, setSelectedSpaceType] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('Madagascar - MG');
  const [street, setStreet] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showPreciseLocation, setShowPreciseLocation] = useState(false);
  const [guests, setGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [tempPhotos, setTempPhotos] = useState<string[]>([]);
  const [listingTitle, setListingTitle] = useState('');
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);
  const [listingDescription, setListingDescription] = useState('');
  const [reservationMode, setReservationMode] = useState<'manual' | 'instant' | null>(null);
  const [basePrice, setBasePrice] = useState(26);
  const [weekendSupplement, setWeekendSupplement] = useState(1);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [securityFeatures, setSecurityFeatures] = useState<string[]>([]);
  const [addressCountry, setAddressCountry] = useState('Madagascar');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressApartment, setAddressApartment] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressPostalCode, setAddressPostalCode] = useState('');
  const [legalEntity, setLegalEntity] = useState<'yes' | 'no' | null>(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPhotos: string[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPhotos.push(e.target.result as string);
          processed++;
          
          if (processed === files.length) {
            setTempPhotos([...tempPhotos, ...newPhotos]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeTempPhoto = (index: number) => {
    setTempPhotos(tempPhotos.filter((_, i) => i !== index));
  };

  const importPhotos = () => {
    setUploadedPhotos([...uploadedPhotos, ...tempPhotos]);
    setTempPhotos([]);
    setShowPhotoUploadModal(false);
    if (uploadedPhotos.length + tempPhotos.length >= 5) {
      setCurrentStep('photo-review');
    }
  };

  const removeUploadedPhoto = (index: number) => {
    setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== index));
  };

  const toggleHighlight = (highlight: string) => {
    if (selectedHighlights.includes(highlight)) {
      setSelectedHighlights(selectedHighlights.filter(h => h !== highlight));
    } else if (selectedHighlights.length < 2) {
      setSelectedHighlights([...selectedHighlights, highlight]);
    }
  };

  const toggleDiscount = (discount: string) => {
    if (selectedDiscounts.includes(discount)) {
      setSelectedDiscounts(selectedDiscounts.filter(d => d !== discount));
    } else {
      setSelectedDiscounts([...selectedDiscounts, discount]);
    }
  };

  const toggleSecurityFeature = (feature: string) => {
    if (securityFeatures.includes(feature)) {
      setSecurityFeatures(securityFeatures.filter(f => f !== feature));
    } else {
      setSecurityFeatures([...securityFeatures, feature]);
    }
  };

  // Intro page
  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-white flex">
        {/* Left side */}
        <div className="flex-1 flex items-center justify-center px-12">
          <div className="max-w-md">
            <h1 className="text-5xl mb-12" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.1' }}>
              Commencer sur HOMIQIO, c'est facile
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex items-center justify-center px-12 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-lg space-y-12">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-1">
                <div className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  1 Parlez-nous de votre logement
                </div>
                <p className="text-base" style={{ color: '#717171', lineHeight: '1.5' }}>
                  Donnez-nous quelques informations de base, par exemple indiquez-nous où il se trouve et combien de voyageurs il peut accueillir.
                </p>
              </div>
              <div className="w-24 h-24 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop" 
                  alt="Logement"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-1">
                <div className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  2 Faites en sorte de vous démarquer
                </div>
                <p className="text-base" style={{ color: '#717171', lineHeight: '1.5' }}>
                  Ajoutez au moins 5 photos, un titre et une description. Nous allons vous aider.
                </p>
              </div>
              <div className="w-24 h-24 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&h=200&fit=crop" 
                  alt="Photos"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-1">
                <div className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  3 Terminez et publiez
                </div>
                <p className="text-base" style={{ color: '#717171', lineHeight: '1.5' }}>
                  Choisissez un prix de départ, vérifiez quelques détails, puis publiez votre annonce.
                </p>
              </div>
              <div className="w-24 h-24 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop" 
                  alt="Publier"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#10B981" />
            </svg>
          </button>
          <button 
            onClick={() => onNavigate('logements')}
            className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Quitter
          </button>
        </div>

        {/* Footer button */}
        <div className="absolute bottom-0 right-0 px-8 py-8">
          <button
            onClick={() => setCurrentStep('step1')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Commencer
          </button>
        </div>
      </div>
    );
  }

  // Step 1: Introduction
  if (currentStep === 'step1') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex min-h-[calc(100vh-88px)]">
          {/* Left side */}
          <div className="flex-1 flex items-center justify-center px-12 py-16">
            <div className="max-w-lg">
              <p className="text-sm mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Étape 1
              </p>
              <h1 className="text-5xl mb-6" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.1' }}>
                Parlez-nous de votre logement
              </h1>
              <p className="text-lg" style={{ color: '#222222', lineHeight: '1.6' }}>
                Au cours de cette étape, nous allons vous demander quel type de logement vous proposez et si les voyageurs pourront le réserver dans son intégralité ou si vous ne louez qu'une chambre. Nous vous demanderons ensuite d'indiquer son emplacement et sa capacité d'accueil.
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex-1 flex items-center justify-center px-12 py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="w-full max-w-md">
              <img 
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=600&fit=crop" 
                alt="Logement 3D"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('intro')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('property-type')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Property type selection
  if (currentStep === 'property-type') {
    const propertyTypes = [
      { id: 'house', label: 'Maison', icon: '🏠' },
      { id: 'apartment', label: 'Appartement', icon: '🏢' },
      { id: 'barn', label: 'Grange', icon: '🚜' },
      { id: 'bnb', label: "Chambre d'hôtes", icon: '🛏️' },
      { id: 'boat', label: 'Bateau', icon: '⛵' },
      { id: 'cabin', label: 'Cabane', icon: '🏚️' },
      { id: 'rv', label: 'Caravane ou camping-car', icon: '🚐' },
      { id: 'casa', label: 'Casa particular', icon: '🏘️' },
      { id: 'castle', label: 'Château', icon: '🏰' },
      { id: 'cave', label: 'Maison troglodyte', icon: '⛰️' },
      { id: 'container', label: 'Conteneur maritime', icon: '📦' },
      { id: 'cycladic', label: 'Maison cycladique', icon: '🏛️' },
      { id: 'dammuso', label: 'Dammuso', icon: '🏠' },
      { id: 'dome', label: 'Dôme', icon: '⛺' },
      { id: 'earthhouse', label: 'Maison organique', icon: '🌍' },
      { id: 'farm', label: 'Ferme', icon: '🚜' },
      { id: 'guesthouse', label: "Maison d'hôtes", icon: '🏡' },
      { id: 'hotel', label: 'Hôtel', icon: '🏨' },
    ];

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-8 text-center" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Parmi les propositions suivantes, laquelle décrit le mieux votre logement ?
          </h1>

          <div className="grid grid-cols-3 gap-4 mb-24">
            {propertyTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-6 rounded-xl border-2 transition-all hover:border-gray-900 ${
                  selectedType === type.id
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-300 bg-white'
                }`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                  {type.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('step1')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            disabled={!selectedType}
            onClick={() => selectedType && setCurrentStep('space-type')}
            className={`px-8 py-3 text-white rounded-lg text-base transition-colors bg-[#000000] ${
              selectedType ? 'hover:bg-[#222222]' : 'opacity-40 cursor-not-allowed'
            }`}
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Space type selection
  if (currentStep === 'space-type') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Quel type de logement sera à la disposition des voyageurs ?
          </h1>

          <div className="space-y-4 mt-12">
            {/* Un logement entier */}
            <button
              onClick={() => setSelectedSpaceType('entire')}
              className={`w-full p-6 rounded-xl border-2 transition-all text-left flex items-start justify-between ${
                selectedSpaceType === 'entire'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-300 bg-white hover:border-gray-900'
              }`}
            >
              <div className="flex-1">
                <h3 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Un logement entier
                </h3>
                <p className="text-sm" style={{ color: '#717171', lineHeight: '1.5' }}>
                  Les voyageurs disposent du logement dans son intégralité.
                </p>
              </div>
              <svg className="w-8 h-8 flex-shrink-0 ml-4" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="12" width="24" height="16" stroke="#222222" strokeWidth="2" fill="none" />
                <path d="M4 12L16 4L28 12" stroke="#222222" strokeWidth="2" fill="none" />
                <rect x="12" y="18" width="8" height="10" fill="#222222" />
              </svg>
            </button>

            {/* Une chambre */}
            <button
              onClick={() => setSelectedSpaceType('room')}
              className={`w-full p-6 rounded-xl border-2 transition-all text-left flex items-start justify-between ${
                selectedSpaceType === 'room'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-300 bg-white hover:border-gray-900'
              }`}
            >
              <div className="flex-1">
                <h3 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Une chambre
                </h3>
                <p className="text-sm" style={{ color: '#717171', lineHeight: '1.5' }}>
                  Les voyageurs ont leur propre chambre dans un logement et ont accès à des espaces partagés.
                </p>
              </div>
              <svg className="w-8 h-8 flex-shrink-0 ml-4" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="16" width="24" height="2" fill="#222222" />
                <rect x="6" y="18" width="20" height="8" stroke="#222222" strokeWidth="2" fill="none" />
                <circle cx="24" cy="12" r="2" fill="#222222" />
              </svg>
            </button>

            {/* Une chambre partagée dans une auberge de jeunesse */}
            <button
              onClick={() => setSelectedSpaceType('shared')}
              className={`w-full p-6 rounded-xl border-2 transition-all text-left flex items-start justify-between ${
                selectedSpaceType === 'shared'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-300 bg-white hover:border-gray-900'
              }`}
            >
              <div className="flex-1">
                <h3 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Une chambre partagée dans une auberge de jeunesse
                </h3>
                <p className="text-sm" style={{ color: '#717171', lineHeight: '1.5' }}>
                  Les voyageurs dorment dans une chambre partagée dans une auberge de jeunesse gérée par un professionnel, avec du personnel sur place 24h/24, 7j/7.
                </p>
              </div>
              <svg className="w-8 h-8 flex-shrink-0 ml-4" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="12" width="24" height="16" stroke="#222222" strokeWidth="2" fill="none" />
                <path d="M4 12L16 4L28 12" stroke="#222222" strokeWidth="2" fill="none" />
                <line x1="16" y1="12" x2="16" y2="28" stroke="#222222" strokeWidth="2" />
                <circle cx="11" cy="18" r="1.5" fill="#222222" />
                <circle cx="21" cy="18" r="1.5" fill="#222222" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('property-type')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            disabled={!selectedSpaceType}
            onClick={() => selectedSpaceType && setCurrentStep('location')}
            className={`px-8 py-3 text-white rounded-lg text-base transition-colors bg-[#000000] ${
              selectedSpaceType ? 'hover:bg-[#222222]' : 'opacity-40 cursor-not-allowed'
            }`}
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Location
  if (currentStep === 'location') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Où est situé votre logement ?
          </h1>
          <p className="text-base text-center mb-8" style={{ color: '#717171' }}>
            Votre adresse est uniquement communiquée aux voyageurs une fois leur réservation effectuée.
          </p>

          {/* Map Container */}
          <div className="relative w-full h-96 rounded-xl overflow-hidden mb-6 bg-gray-100">
            {/* Google Maps iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2997801.4673498073!2d44.2517899!3d-18.9140019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21d1a4e3ea0a37c7%3A0x915885f3c0cfd75!2sMadagascar!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Search Bar Overlay */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-white rounded-lg shadow-lg flex items-center px-4 py-3">
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="#222222">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Saisissez votre adresse"
                  className="flex-1 text-sm focus:outline-none"
                  style={{ color: '#222222' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('space-type')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            disabled={!address}
            onClick={() => address && setCurrentStep('confirm-address')}
            className={`px-8 py-3 text-white rounded-lg text-base transition-colors bg-[#000000] ${
              address ? 'hover:bg-[#222222]' : 'opacity-40 cursor-not-allowed'
            }`}
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Confirm address
  if (currentStep === 'confirm-address') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Confirmez votre adresse
          </h1>
          <p className="text-base text-center mb-8" style={{ color: '#717171' }}>
            Votre adresse est uniquement communiquée aux voyageurs une fois leur réservation effectuée.
          </p>

          {/* Form */}
          <div className="space-y-4 mb-8">
            {/* Country */}
            <div>
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                Pays/région
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                style={{ color: '#222222' }}
              >
                <option value="Madagascar - MG">Madagascar - MG</option>
              </select>
            </div>

            {/* Street */}
            <div>
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                Numéro et nom de rue
              </label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Rue Stanislas Paul"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                style={{ color: '#222222' }}
              />
            </div>

            {/* Apartment */}
            <div>
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                Appartement, étage, immeuble (si applicable)
              </label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                style={{ color: '#222222' }}
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                Ville
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Antananarivo"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                style={{ color: '#222222' }}
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                Arrondissement/région (si applicable)
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Analamanga"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                style={{ color: '#222222' }}
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                Code postal
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="101"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                style={{ color: '#222222' }}
              />
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-start gap-4 mb-6 p-4 border-t border-gray-200 pt-6">
            <div className="flex-1">
              <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Afficher l'emplacement précis de votre logement
              </h3>
              <p className="text-xs" style={{ color: '#717171', lineHeight: '1.5' }}>
                Il aidera probablement les voyageurs à se repérer sur votre logement qui consigné, tandis que leur commune, plus leurs coordonnées approximatives n'est affichée qu'à interaction
                <a href="#" className="underline"> En savoir plus</a>
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowPreciseLocation(!showPreciseLocation)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  showPreciseLocation ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  showPreciseLocation ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Map */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15076.986269756775!2d47.5079055!3d-18.9100122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21f07e5e4c6c1b5f%3A0x6c3f9d5b8b4b8b4b!2sAntananarivo%2C%20Madagascar!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('location')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('pin-location')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Pin Location - "Le repère est-il au bon endroit ?"
  if (currentStep === 'pin-location') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Le repère est-il au bon endroit ?
          </h1>
          <p className="text-base text-center mb-8" style={{ color: '#717171' }}>
            Votre adresse est uniquement communiquée aux voyageurs une fois leur réservation effectuée.
          </p>

          {/* Map Container */}
          <div className="relative w-full h-[500px] rounded-xl overflow-hidden bg-gray-100 shadow-lg">
            {/* Google Maps iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.8896376584!2d47.5183249!3d-18.9141944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x21f07e5e4c6c1b5f%3A0x6c3f9d5b8b4b8b4b!2sRue%20Ranaivo%20Paul%2C%20Antananarivo%2C%20Madagascar!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Address Card Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-white rounded-lg shadow-xl px-4 py-3 flex items-center gap-3 min-w-[350px]">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <span className="text-sm" style={{ color: '#222222' }}>
                  Rue Ranaivo Paul, Antananarivo, Madagascar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('confirm-address')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('guest-info')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Guest Info - "Donnez les informations principales"
  if (currentStep === 'guest-info') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Donnez les informations principales concernant votre logement
          </h1>
          <p className="text-base text-center mb-12" style={{ color: '#717171' }}>
            Vous pourrez ajouter d'autres informations plus tard, comme les types de lits.
          </p>

          {/* Counter Items */}
          <div className="space-y-6">
            {/* Voyageurs */}
            <div className="flex items-center justify-between py-6 border-b border-gray-200">
              <span className="text-base" style={{ color: '#222222' }}>Voyageurs</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={guests <= 1}
                >
                  <span className="text-lg" style={{ color: '#717171' }}>−</span>
                </button>
                <span className="text-base w-8 text-center" style={{ color: '#222222' }}>{guests}</span>
                <button
                  onClick={() => setGuests(guests + 1)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  <span className="text-lg" style={{ color: '#717171' }}>+</span>
                </button>
              </div>
            </div>

            {/* Chambres */}
            <div className="flex items-center justify-between py-6 border-b border-gray-200">
              <span className="text-base" style={{ color: '#222222' }}>Chambres</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={bedrooms <= 1}
                >
                  <span className="text-lg" style={{ color: '#717171' }}>−</span>
                </button>
                <span className="text-base w-8 text-center" style={{ color: '#222222' }}>{bedrooms}</span>
                <button
                  onClick={() => setBedrooms(bedrooms + 1)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  <span className="text-lg" style={{ color: '#717171' }}>+</span>
                </button>
              </div>
            </div>

            {/* Lits */}
            <div className="flex items-center justify-between py-6 border-b border-gray-200">
              <span className="text-base" style={{ color: '#222222' }}>Lits</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBeds(Math.max(1, beds - 1))}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={beds <= 1}
                >
                  <span className="text-lg" style={{ color: '#717171' }}>−</span>
                </button>
                <span className="text-base w-8 text-center" style={{ color: '#222222' }}>{beds}</span>
                <button
                  onClick={() => setBeds(beds + 1)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  <span className="text-lg" style={{ color: '#717171' }}>+</span>
                </button>
              </div>
            </div>

            {/* Salles de bain */}
            <div className="flex items-center justify-between py-6 border-b border-gray-200">
              <span className="text-base" style={{ color: '#222222' }}>Salles de bain</span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={bathrooms <= 1}
                >
                  <span className="text-lg" style={{ color: '#717171' }}>−</span>
                </button>
                <span className="text-base w-8 text-center" style={{ color: '#222222' }}>{bathrooms}</span>
                <button
                  onClick={() => setBathrooms(bathrooms + 1)}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  <span className="text-lg" style={{ color: '#717171' }}>+</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('pin-location')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('step2-intro')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Step 2 Intro - "Faites sortir votre annonce du lot"
  if (currentStep === 'step2-intro') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex min-h-[calc(100vh-88px)]">
          {/* Left side */}
          <div className="flex-1 flex items-center justify-center px-12 py-16">
            <div className="max-w-lg">
              <p className="text-sm mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Étape 2
              </p>
              <h1 className="text-5xl mb-6" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.1' }}>
                Faites sortir votre annonce du lot
              </h1>
              <p className="text-lg" style={{ color: '#222222', lineHeight: '1.6' }}>
                Au cours de cette étape, nous pourrez ajouter certains des équipements proposés dans votre logement et au moins 5 photos. Vous pourrez ensuite ajouter un titre et une description.
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex-1 flex items-center justify-center px-12 py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="w-full max-w-md">
              <img 
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop" 
                alt="3D Apartment"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('guest-info')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('amenities')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Amenities - "Indiquez aux voyageurs quels sont les équipements"
  if (currentStep === 'amenities') {
    const essentialAmenities = [
      { id: 'wifi', label: 'Wifi', icon: '📶' },
      { id: 'tv', label: 'Télévision', icon: '📺' },
      { id: 'kitchen', label: 'Cuisine', icon: '🍳' },
      { id: 'washer', label: 'Lave-linge', icon: '🧺' },
      { id: 'free-parking', label: 'Parking gratuit sur place', icon: '🚗' },
      { id: 'paid-parking', label: 'Parking payant sur place', icon: '🅿️' },
      { id: 'ac', label: 'Climatisation', icon: '❄️' },
      { id: 'workspace', label: 'Espace de travail dédié', icon: '💼' },
    ];

    const standoutAmenities = [
      { id: 'pool', label: 'Piscine', icon: '🏊' },
      { id: 'hot-tub', label: 'Jacuzzi', icon: '🛁' },
      { id: 'patio', label: 'Patio', icon: '🏡' },
    ];

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Indiquez aux voyageurs quels sont les équipements de votre logement
          </h1>
          <p className="text-base mb-12" style={{ color: '#717171' }}>
            Vous pourrez ajouter des équipements une fois votre annonce publiée.
          </p>

          {/* Essential Amenities */}
          <div className="mb-12">
            <h2 className="text-base mb-6" style={{ fontWeight: 600, color: '#222222' }}>
              Qu'en est-il de ces équipements préférés des voyageurs ?
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {essentialAmenities.map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedAmenities.includes(amenity.id)
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-300 bg-white hover:border-gray-900'
                  }`}
                >
                  <div className="text-2xl mb-2">{amenity.icon}</div>
                  <div className="text-sm" style={{ fontWeight: 400, color: '#222222' }}>
                    {amenity.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Standout Amenities */}
          <div className="mb-24">
            <h2 className="text-base mb-6" style={{ fontWeight: 600, color: '#222222' }}>
              Possédez-vous des équipements hors du commun ?
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {standoutAmenities.map((amenity) => (
                <button
                  key={amenity.id}
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedAmenities.includes(amenity.id)
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-300 bg-white hover:border-gray-900'
                  }`}
                >
                  <div className="text-2xl mb-2">{amenity.icon}</div>
                  <div className="text-sm" style={{ fontWeight: 400, color: '#222222' }}>
                    {amenity.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('step2-intro')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('photos')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Photos - "Ajoutez quelques photos"
  if (currentStep === 'photos') {
    // Auto-redirect to photo-review if we have photos
    if (uploadedPhotos.length >= 5) {
      setCurrentStep('photo-review');
      return null;
    }

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Ajoutez quelques photos de votre maison
          </h1>
          <p className="text-base text-center mb-12" style={{ color: '#717171' }}>
            Pour commencer, vous aurez besoin de 5 photos. Vous pourrez en ajouter d'autres ou faire des modifications plus tard.
          </p>

          {/* Photo Upload Area */}
          <div className="relative w-full max-w-2xl mx-auto">
            <button
              onClick={() => setShowPhotoUploadModal(true)}
              className="w-full h-96 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-gray-400 transition-colors bg-gray-50"
            >
              <div className="mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop" 
                  alt="Camera"
                  className="w-32 h-32 object-contain opacity-60"
                />
              </div>
              <div className="px-8 py-3 rounded-lg text-sm border border-gray-900 bg-white hover:bg-gray-50 transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
                Ajoutez des photos
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('amenities')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            disabled={uploadedPhotos.length < 5}
            onClick={() => uploadedPhotos.length >= 5 && setCurrentStep('photo-review')}
            className={`px-8 py-3 rounded-lg text-base transition-colors ${
              uploadedPhotos.length >= 5 ? 'bg-[#000000] hover:bg-[#222222] text-white' : 'bg-[#E5E5E5] text-[#B0B0B0] cursor-not-allowed'
            }`}
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>

        {/* Photo Upload Modal */}
        {showPhotoUploadModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => {
            setShowPhotoUploadModal(false);
            setTempPhotos([]);
          }}>
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => {
                  setShowPhotoUploadModal(false);
                  setTempPhotos([]);
                }} className="hover:opacity-70">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="text-center">
                  <h2 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                    Ajoutez des photos
                  </h2>
                  {tempPhotos.length > 0 && (
                    <p className="text-xs" style={{ color: '#717171' }}>
                      {tempPhotos.length} élément{tempPhotos.length > 1 ? 's' : ''} sélectionné{tempPhotos.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                <label htmlFor="photo-upload-input" className="hover:opacity-70 cursor-pointer">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M12 5v14m7-7H5" />
                  </svg>
                </label>
                <input
                  id="photo-upload-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              {tempPhotos.length === 0 ? (
                <>
                  <p className="text-xs text-center mb-6" style={{ color: '#717171' }}>
                    Aucune sélection actuelle
                  </p>

                  {/* Upload Area */}
                  <label htmlFor="photo-upload-browse" className="block">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center bg-gray-50 mb-6 cursor-pointer hover:border-gray-400 transition-colors">
                      <div className="mb-4">
                        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                      <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                        Glissez-déposez un fichier
                      </h3>
                      <p className="text-sm mb-4" style={{ color: '#717171' }}>
                        ou recherchez des photos
                      </p>
                      <span className="px-6 py-3 rounded-lg text-sm bg-black text-white hover:opacity-90 transition-opacity" style={{ fontWeight: 600 }}>
                        Parcourir
                      </span>
                    </div>
                  </label>
                  <input
                    id="photo-upload-browse"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </>
              ) : (
                <>
                  {/* Photo Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6 max-h-96 overflow-y-auto">
                    {tempPhotos.map((photo, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={photo} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeTempPhoto(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M15 9l-6 6m0-6l6 6" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowPhotoUploadModal(false);
                    setTempPhotos([]);
                  }}
                  className="text-sm hover:underline"
                  style={{ color: '#222222', fontWeight: 600 }}
                >
                  Annuler
                </button>
                <button
                  onClick={importPhotos}
                  disabled={tempPhotos.length === 0}
                  className={`px-6 py-3 rounded-lg text-sm transition-opacity ${
                    tempPhotos.length > 0 ? 'bg-black text-white hover:opacity-90' : 'opacity-40 cursor-not-allowed bg-gray-200 text-gray-400'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  Importer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Photo Review - "Est voilà ! Est-ce que tout semble en ordre ?"
  if (currentStep === 'photo-review') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Et voilà ! Est-ce que tout semble en ordre ?
          </h1>
          <p className="text-base text-center mb-12" style={{ color: '#717171' }}>
            Faites glisser pour réorganiser
          </p>

          {/* Main Cover Photo */}
          {uploadedPhotos.length > 0 && (
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 group">
              <img src={uploadedPhotos[0]} alt="Photo de couverture" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1.5 shadow-md">
                <span className="text-xs" style={{ fontWeight: 600, color: '#222222' }}>
                  Photo de couverture
                </span>
              </div>
              <button
                onClick={() => removeUploadedPhoto(0)}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6m0-6l6 6" />
                </svg>
              </button>
            </div>
          )}

          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {uploadedPhotos.slice(1, 5).map((photo, index) => (
              <div key={index + 1} className="relative aspect-square rounded-xl overflow-hidden group">
                <img src={photo} alt={`Photo ${index + 2}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeUploadedPhoto(index + 1)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6m0-6l6 6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Additional Photos Grid */}
          {uploadedPhotos.length > 5 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {uploadedPhotos.slice(5).map((photo, index) => (
                <div key={index + 5} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={photo} alt={`Photo ${index + 6}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeUploadedPhoto(index + 5)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9l-6 6m0-6l6 6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add More Button */}
          <button
            onClick={() => setShowPhotoUploadModal(true)}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-gray-400 transition-colors bg-gray-50"
          >
            <svg className="w-12 h-12 mb-3" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M12 5v14m7-7H5" />
            </svg>
            <span className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
              Ajouter d'autres
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('photos')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('title')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Title - "À présent, donnez un titre à votre annonce"
  if (currentStep === 'title') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            À présent, donnez un titre à votre annonce (type : maison)
          </h1>
          <p className="text-base mb-12" style={{ color: '#717171' }}>
            Les titres courts sont généralement les plus efficaces. Ne vous inquiétez pas, vous pourrez toujours le modifier plus tard.
          </p>

          {/* Textarea */}
          <div className="relative mb-2">
            <textarea
              value={listingTitle}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setListingTitle(e.target.value);
                }
              }}
              placeholder=""
              className="w-full h-32 px-4 py-3 text-base border-2 border-gray-400 rounded-xl resize-none focus:outline-none focus:border-gray-900 transition-colors"
              style={{ fontWeight: 400, color: '#222222' }}
            />
            {listingTitle.length > 0 && (
              <button
                onClick={() => setListingTitle('')}
                className="absolute bottom-4 right-4 w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6m0-6l6 6" />
                </svg>
              </button>
            )}
          </div>
          <div className="text-sm" style={{ color: '#717171' }}>
            {listingTitle.length}/50
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('photo-review')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            disabled={listingTitle.trim().length === 0}
            onClick={() => listingTitle.trim().length > 0 && setCurrentStep('highlights')}
            className={`px-8 py-3 rounded-lg text-base transition-colors ${
              listingTitle.trim().length > 0 ? 'bg-[#000000] hover:bg-[#222222] text-white' : 'bg-[#E5E5E5] text-[#B0B0B0] cursor-not-allowed'
            }`}
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Highlights - "Passons maintenant à la description de votre logement"
  if (currentStep === 'highlights') {
    const highlights = [
      { id: 'peaceful', label: 'Paisible', icon: '🏛️' },
      { id: 'unique', label: 'Unique', icon: '🌟' },
      { id: 'family', label: 'Adapté aux familles', icon: '👨‍👩‍👧‍👦' },
      { id: 'elegant', label: 'Élégant', icon: '🏛️' },
      { id: 'central', label: 'Central', icon: '📍' },
      { id: 'spacious', label: 'Spacieux', icon: '⭐' },
    ];

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Passons maintenant à la description de votre logement (type : maison)
          </h1>
          <p className="text-base mb-12" style={{ color: '#717171' }}>
            Choisissez jusqu'à 2 points forts. Ils seront utiles pour commencer votre description.
          </p>

          {/* Highlights Grid */}
          <div className="grid grid-cols-3 gap-4 mb-16">
            {highlights.map((highlight) => (
              <button
                key={highlight.id}
                onClick={() => toggleHighlight(highlight.id)}
                disabled={!selectedHighlights.includes(highlight.id) && selectedHighlights.length >= 2}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedHighlights.includes(highlight.id)
                    ? 'border-gray-900 bg-gray-50'
                    : selectedHighlights.length >= 2
                    ? 'border-gray-200 bg-white opacity-50 cursor-not-allowed'
                    : 'border-gray-300 bg-white hover:border-gray-900'
                }`}
              >
                <div className="text-2xl mb-2">{highlight.icon}</div>
                <div className="text-sm" style={{ fontWeight: 400, color: '#222222' }}>
                  {highlight.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('title')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('description')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Description - "Créez votre description"
  if (currentStep === 'description') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Créez votre description
          </h1>
          <p className="text-base mb-12" style={{ color: '#717171' }}>
            Racontez ce qui rend votre logement unique.
          </p>

          {/* Textarea */}
          <div className="relative mb-2">
            <textarea
              value={listingDescription}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setListingDescription(e.target.value);
                }
              }}
              placeholder=""
              className="w-full h-48 px-4 py-3 text-base border-2 border-gray-400 rounded-xl resize-none focus:outline-none focus:border-gray-900 transition-colors"
              style={{ fontWeight: 400, color: '#222222' }}
            />
            {listingDescription.length > 0 && (
              <button
                onClick={() => setListingDescription('')}
                className="absolute bottom-4 right-4 w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6m0-6l6 6" />
                </svg>
              </button>
            )}
          </div>
          <div className="text-sm" style={{ color: '#717171' }}>
            {listingDescription.length}/500
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('highlights')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            disabled={listingDescription.trim().length === 0}
            onClick={() => listingDescription.trim().length > 0 && setCurrentStep('step3-intro')}
            className={`px-8 py-3 rounded-lg text-base transition-colors ${
              listingDescription.trim().length > 0 ? 'bg-[#000000] hover:bg-[#222222] text-white' : 'bg-[#E5E5E5] text-[#B0B0B0] cursor-not-allowed'
            }`}
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Step 3 Intro - "Terminez et publiez"
  if (currentStep === 'step3-intro') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="max-w-6xl w-full grid grid-cols-2 gap-16 items-center">
            {/* Left side - Text */}
            <div>
              <div className="text-sm mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Étape 3
              </div>
              <h1 className="text-5xl mb-6" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.1' }}>
                Terminez et publiez
              </h1>
              <p className="text-lg" style={{ color: '#717171' }}>
                Enfin, vous choisissez les paramètres de réservation, définissez votre tarification et publiez votre annonce.
              </p>
            </div>

            {/* Right side - Illustration */}
            <div className="flex items-center justify-center">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1631799200294-0f1212ae90f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" 
                alt="Maison 3D"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('description')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('reservation-settings')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Reservation Settings - "Choisissez vos paramètres de réservation"
  if (currentStep === 'reservation-settings') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Choisissez vos paramètres de réservation
          </h1>
          <p className="text-sm text-center mb-12" style={{ color: '#717171' }}>
            Vous pouvez modifier ce paramètre à tout moment. <span className="underline cursor-pointer">En savoir plus</span>
          </p>

          {/* Options */}
          <div className="space-y-4">
            {/* Manual approval option */}
            <button
              onClick={() => setReservationMode('manual')}
              className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                reservationMode === 'manual' ? 'border-gray-900 bg-gray-50' : 'border-gray-300 bg-white hover:border-gray-900'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                      Approuver mes 5 premières réservations manuellement
                    </h3>
                  </div>
                  <div className="inline-block px-2 py-0.5 rounded text-xs mb-2" style={{ backgroundColor: '#10B981', color: '#FFFFFF', fontWeight: 600 }}>
                    Recommandé
                  </div>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Vérifier mes premières demandes de réservation avant de les accepter peut passer à la réservation instantanée afin que les voyageurs puissent réserver plus rapidement.
                  </p>
                </div>
                <div className="ml-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </button>

            {/* Instant booking option */}
            <button
              onClick={() => setReservationMode('instant')}
              className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                reservationMode === 'instant' ? 'border-gray-900 bg-gray-50' : 'border-gray-300 bg-white hover:border-gray-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                    Utiliser la réservation instantanée
                  </h3>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Permettez à vos voyageurs de réserver automatiquement.
                  </p>
                </div>
                <div className="ml-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('step3-intro')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('pricing')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Pricing - "À présent, définissez un prix de base"
  if (currentStep === 'pricing') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            À présent, définissez un prix de base pour les jours de semaine
          </h1>
          <p className="text-sm text-center mb-16" style={{ color: '#717171' }}>
            Prix conseillé : $26. Vous fixerez ensuite un tarif week-end.
          </p>

          {/* Price Display */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <input
                type="number"
                value={basePrice}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  if (value >= 0 && value <= 9999) {
                    setBasePrice(value);
                  }
                }}
                className="text-8xl text-center border-none outline-none bg-transparent w-64"
                style={{ fontWeight: 600, color: '#222222' }}
              />
              <span className="absolute left-0 top-0 text-8xl" style={{ fontWeight: 600, color: '#222222' }}>
                $
              </span>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-24 bg-gray-300 animate-pulse"></div>
            </div>
          </div>

          {/* Price info */}
          <div className="text-center mb-16">
            <button className="text-sm hover:underline" style={{ color: '#717171' }}>
              Prix à payer par le voyageur (hors taxes): $30 
              <svg className="inline w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Similar listings link */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#E11D48" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <button className="hover:underline" style={{ color: '#222222', fontWeight: 600 }}>
              Afficher les annonces similaires
            </button>
          </div>

          <div className="mt-16 text-sm text-center">
            <button className="hover:underline" style={{ color: '#717171' }}>
              En savoir plus sur la tarification
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('reservation-settings')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('weekend-pricing')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Weekend Pricing - "Fixez un tarif week-end"
  if (currentStep === 'weekend-pricing') {
    const weekendPrice = Math.round(basePrice * (1 + weekendSupplement / 100));
    
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Fixez un tarif week-end
          </h1>
          <p className="text-sm text-center mb-16" style={{ color: '#717171' }}>
            Ajoutez un supplément pour les vendredis et samedis.
          </p>

          {/* Price Display */}
          <div className="flex items-center justify-center mb-4">
            <div className="text-8xl" style={{ fontWeight: 600, color: '#222222' }}>
              ${weekendPrice}
            </div>
          </div>

          {/* Prix à payer */}
          <div className="text-center mb-16">
            <button className="text-sm hover:underline inline-flex items-center gap-1" style={{ color: '#717171' }}>
              Prix à payer par le voyageur (hors taxes): ${Math.round(weekendPrice * 1.15)}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Slider Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Supplément week-end
                </h3>
                <p className="text-xs" style={{ color: '#717171' }}>
                  Conseil : essayez 1 %
                </p>
              </div>
              <div className="text-2xl" style={{ fontWeight: 600, color: '#222222' }}>
                {weekendSupplement}%
              </div>
            </div>

            {/* Slider */}
            <div className="relative">
              <style>
                {`
                  .custom-range::-webkit-slider-thumb {
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: white;
                    border: 2px solid #222222;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                  }
                  .custom-range::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    background: white;
                    border: 2px solid #222222;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                  }
                `}
              </style>
              <input
                type="range"
                min="0"
                max="99"
                value={weekendSupplement}
                onChange={(e) => setWeekendSupplement(parseInt(e.target.value))}
                className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer custom-range"
                style={{
                  background: `linear-gradient(to right, #222222 0%, #222222 ${weekendSupplement}%, #E5E5E5 ${weekendSupplement}%, #E5E5E5 100%)`
                }}
              />
              <div className="flex justify-between mt-2 text-xs" style={{ color: '#717171' }}>
                <span>0%</span>
                <span>99 %</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('pricing')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('discounts')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Discounts - "Ajoutez des réductions"
  if (currentStep === 'discounts') {
    const discountOptions = [
      { id: 'new-listing', percentage: '20%', title: 'Promotion Nouvelles annonces', description: 'Proposez une réduction de 20 % sur vos 3 premières réservations' },
      { id: 'last-minute', percentage: '4%', title: 'Réduction pour réservations de dernière minute', description: 'Pour les séjours réservés 14 jours ou moins avant l\'arrivée' },
      { id: 'weekly', percentage: '10%', title: 'Réduction à la semaine', description: 'Pour les séjours de 7 nuits ou plus' },
      { id: 'monthly', percentage: '20%', title: 'Réduction au mois', description: 'Pour les séjours de 28 nuits ou plus' },
    ];

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-2" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Ajoutez des réductions
          </h1>
          <p className="text-sm mb-12" style={{ color: '#717171' }}>
            Faites sortir votre logement du lot pour obtenir des réservations plus rapidement et recevoir vos premières évaluations.
          </p>

          {/* Discount Options */}
          <div className="space-y-4 mb-8">
            {discountOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-6 rounded-xl border border-gray-300 bg-white hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl" style={{ fontWeight: 600, color: '#222222' }}>
                    {option.percentage}
                  </div>
                  <div>
                    <h3 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                      {option.title}
                    </h3>
                    <p className="text-sm" style={{ color: '#717171' }}>
                      {option.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleDiscount(option.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    selectedDiscounts.includes(option.id)
                      ? 'bg-gray-900 border-gray-900'
                      : 'bg-white border-gray-400 hover:border-gray-900'
                  }`}
                >
                  {selectedDiscounts.includes(option.id) && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Footer link */}
          <div className="text-sm text-center">
            <span style={{ color: '#717171' }}>Une seule réduction sera appliquée par séjour. </span>
            <button className="underline hover:opacity-70" style={{ color: '#222222', fontWeight: 600 }}>
              En savoir plus
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('weekend-pricing')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('security')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Security - "Indiquez les informations liées à la sécurité"
  if (currentStep === 'security') {
    const securityOptions = [
      { id: 'camera-exterior', label: 'Présence d\'une caméra de surveillance à l\'extérieur' },
      { id: 'noise-detector', label: 'Présence d\'un sonomètre' },
      { id: 'weapons', label: 'Présence d\'une ou plusieurs armes dans le logement' },
    ];

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button 
              onClick={() => onNavigate('logements')}
              className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors border border-gray-300"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-8 py-16">
          <h1 className="text-3xl mb-12" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
            Indiquez les informations liées à la sécurité
          </h1>

          {/* Security questions */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                Votre logement possède-t-il ces éléments ?
              </h3>
              <button className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-900 transition-colors">
                <span className="text-xs" style={{ fontWeight: 600, color: '#717171' }}>i</span>
              </button>
            </div>

            <div className="space-y-4">
              {securityOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between py-4 border-b border-gray-200"
                >
                  <label htmlFor={option.id} className="text-base cursor-pointer" style={{ color: '#222222' }}>
                    {option.label}
                  </label>
                  <input
                    id={option.id}
                    type="checkbox"
                    checked={securityFeatures.includes(option.id)}
                    onChange={() => toggleSecurityFeature(option.id)}
                    className="w-6 h-6 rounded border-2 border-gray-400 cursor-pointer appearance-none checked:bg-gray-900 checked:border-gray-900 relative"
                    style={{
                      backgroundImage: securityFeatures.includes(option.id) 
                        ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'3\'%3E%3Cpath d=\'M5 12l5 5L20 7\'/%3E%3C/svg%3E")'
                        : 'none',
                      backgroundSize: '70%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Important information */}
          <div className="bg-gray-50 p-6 rounded-xl mb-8">
            <h3 className="text-base mb-3" style={{ fontWeight: 600, color: '#222222' }}>
              Choses importantes à savoir
            </h3>
            <p className="text-sm mb-3" style={{ color: '#717171', lineHeight: '1.5' }}>
              Les caméras de surveillance qui filment des espaces intérieurs ne sont pas autorisées, même si elles sont éteintes. La présence de caméras de surveillance situées à l'extérieur du logement doit être clairement communiquée.
            </p>
            <p className="text-sm mb-3" style={{ color: '#717171', lineHeight: '1.5' }}>
              Assurez-vous de respecter la législation locale et de prendre connaissance de la <button className="underline hover:opacity-70" style={{ color: '#222222' }}>Politique de non-discrimination</button> d'HOMIQIO ainsi que des informations concernant les <button className="underline hover:opacity-70" style={{ color: '#222222' }}>frais applicables aux voyageurs et aux hôtes</button>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep('discounts')}
            className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('final-details')}
            className="px-8 py-3 text-white rounded-lg text-base bg-[#000000] hover:bg-[#222222] transition-colors"
            style={{ fontWeight: 600 }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Final Details - "Ajoutez quelques dernières informations"
  if (currentStep === 'final-details') {
    const isFormValid = addressStreet.trim() !== '' && addressCity.trim() !== '' && legalEntity !== null;

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Des questions ?
            </button>
            <button className="px-4 py-2 text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl mb-2" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
              Ajoutez quelques dernières informations
            </h1>
            <p className="text-sm mb-8" style={{ color: '#717171' }}>
              Cette étape est obligatoire pour nous conformer aux réglementations financières et nous aider à lutter contre la fraude.
            </p>

            {/* Address Section */}
            <div className="mb-8">
              <h2 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                Quelle est votre adresse principale ?
              </h2>
              <p className="text-sm mb-4" style={{ color: '#717171' }}>
                Utilisez l'adresse figurant sur vos informations.
              </p>

              <div className="space-y-4">
                {/* Country */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                    Pays/région
                  </label>
                  <select
                    value={addressCountry}
                    onChange={(e) => setAddressCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900"
                    style={{ color: '#222222' }}
                  >
                    <option>Madagascar</option>
                  </select>
                </div>

                {/* Street */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                    Numéro et nom de rue
                  </label>
                  <input
                    type="text"
                    value={addressStreet}
                    onChange={(e) => setAddressStreet(e.target.value)}
                    placeholder="ILAC-CEBS Rue Barbers Paul"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* Apartment */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                    Appartement, étage, immeuble (si applicable)
                  </label>
                  <input
                    type="text"
                    value={addressApartment}
                    onChange={(e) => setAddressApartment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                    Ville/Collectivité/Province
                  </label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    placeholder="Antananarivo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                    Code postal (si applicable)
                  </label>
                  <input
                    type="text"
                    value={addressPostalCode}
                    onChange={(e) => setAddressPostalCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-gray-900"
                    style={{ color: '#222222' }}
                  />
                </div>
              </div>
            </div>

            {/* Legal Entity Question */}
            <div className="mb-8">
              <h2 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                Êtes-vous hôte dans le cadre d'une entreprise ?
              </h2>
              <p className="text-sm mb-4" style={{ color: '#717171' }}>
                Appuyez sur En savoir plus pour vérifier les critères selon lesquels un compte est considéré comme une entité juridique <button className="underline hover:opacity-70" style={{ color: '#222222' }}>En savoir plus</button>
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setLegalEntity('yes')}
                  className={`flex-1 px-6 py-3 rounded-lg border-2 text-base transition-all ${
                    legalEntity === 'yes'
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-300 hover:border-gray-900'
                  }`}
                  style={{ fontWeight: 600, color: '#222222' }}
                >
                  Oui
                </button>
                <button
                  onClick={() => setLegalEntity('no')}
                  className={`flex-1 px-6 py-3 rounded-lg border-2 text-base transition-all ${
                    legalEntity === 'no'
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-300 hover:border-gray-900'
                  }`}
                  style={{ fontWeight: 600, color: '#222222' }}
                >
                  Non
                </button>
              </div>
            </div>

            {/* Legal notice */}
            <div className="text-xs" style={{ color: '#717171', lineHeight: '1.5' }}>
              <p className="mb-2">
                En continuant, vous déclarez (a) vous conformer aux réglementations financières et nous nous mobiliser avec vous pour lutter contre la fraude et (b) avoir l'intention de ne pas utiliser vos informations personnelles à quelque autre fin.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-6 flex items-center justify-between">
          <button className="px-6 py-3 text-base hover:bg-gray-50 rounded-lg transition-colors underline" style={{ fontWeight: 600, color: '#222222' }}>
            Retour
          </button>
          <button
            disabled={!isFormValid}
            onClick={() => {
              if (isFormValid) {
                onCompleteOnboarding?.(); // Mark user as host
                onNavigate('annonces', { 
                  showConfirmationPopup: true,
                  uploadedPhotos: uploadedPhotos,
                  listingTitle: listingTitle
                });
              }
            }}
            className={`px-8 py-3 rounded-lg text-base transition-colors ${
              isFormValid ? 'bg-[#000000] hover:bg-[#222222] text-white' : 'bg-[#E5E5E5] text-[#B0B0B0] cursor-not-allowed'
            }`}
            style={{ fontWeight: 600 }}
          >
            Créer une annonce
          </button>
        </div>
      </div>
    );
  }

  // Verification Points - "Points importants à vérifier"
  if (currentStep === 'verification-points') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#222222" />
            </svg>
          </button>
          <div className="flex gap-3">
            <button className="text-sm hover:bg-gray-50 rounded-full transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Passer en mode voyageur
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white" style={{ fontWeight: 600 }}>
              M
            </button>
            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-12">
          <div className="max-w-4xl mx-auto flex gap-12">
            {/* Left side - Verification items */}
            <div className="flex-1">
              <h1 className="text-3xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
                Points importants à vérifier
              </h1>

              <div className="space-y-6">
                {/* Item 1 - Identity */}
                <button 
                  onClick={() => onNavigate('identity-verification')}
                  className="w-full p-6 border border-gray-300 rounded-xl hover:border-gray-900 transition-all text-left group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                        Procédez à la vérification de votre identité
                      </h3>
                      <p className="text-sm mb-1" style={{ color: '#717171' }}>
                        Nous récupérerons des informations pour vérifier votre identité.
                      </p>
                      <button className="text-sm underline hover:opacity-70" style={{ fontWeight: 600, color: '#222222' }}>
                        Obligatoire
                      </button>
                    </div>
                    <svg className="w-6 h-6 flex-shrink-0 ml-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>

                {/* Item 2 - Phone */}
                <button 
                  onClick={() => onNavigate('phone-verification')}
                  className="w-full p-6 border border-gray-300 rounded-xl hover:border-gray-900 transition-all text-left group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                        Confirmez votre numéro de téléphone
                      </h3>
                      <p className="text-sm mb-1" style={{ color: '#717171' }}>
                        Nous vous appellerons ou vous enverrons un SMS pour confirmer votre numéro. Les frais standards s'appliquent.
                      </p>
                      <button className="text-sm underline hover:opacity-70" style={{ fontWeight: 600, color: '#222222' }}>
                        Obligatoire
                      </button>
                    </div>
                    <svg className="w-6 h-6 flex-shrink-0 ml-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Right side - Listing preview */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop"
                    alt="Maison hôte calme"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                      Maison hôte calme
                    </h3>
                    <p className="text-sm" style={{ color: '#717171' }}>
                      Bar Hamlets Park, Aldwanstown, Mualguerria
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}