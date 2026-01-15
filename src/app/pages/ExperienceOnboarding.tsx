import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Logo } from '@/app/components/Logo';

interface ExperienceOnboardingProps {
  onNavigate: (page: string) => void;
}

type ExperienceCategory = 'art-design' | 'cuisine' | 'fitness' | 'histoire' | 'nature' | null;
type ExperienceType = 'visite-archi' | 'atelier-art' | 'visite-galeries' | 'shopping-mode' | null;

export function ExperienceOnboarding({ onNavigate }: ExperienceOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<'category' | 'type' | 'location' | 'intro' | 'experience-years' | 'qualifications' | 'online-profiles' | 'address-info' | 'meeting-location' | 'confirm-location' | 'map-marker' | 'photos' | 'title' | 'describe' | 'program-intro' | 'program'>('category');
  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory>(null);
  const [selectedType, setSelectedType] = useState<ExperienceType>(null);
  const [location, setLocation] = useState('');
  const [experienceYears, setExperienceYears] = useState(10);
  const [presentation, setPresentation] = useState('');
  const [expertise, setExpertise] = useState('');
  const [distinction, setDistinction] = useState('');
  const [websiteLinks, setWebsiteLinks] = useState<string[]>([]);
  const [tempLinkInput, setTempLinkInput] = useState('');
  
  // Address form fields
  const [country, setCountry] = useState('Madagascar');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [commune, setCommune] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // Meeting location
  const [meetingLocation, setMeetingLocation] = useState('');
  
  // Confirm location fields
  const [confirmCountry, setConfirmCountry] = useState('Madagascar');
  const [siteAddress, setSiteAddress] = useState('');
  const [siteApartment, setSiteApartment] = useState('');
  const [siteCommune, setSiteCommune] = useState('');
  const [siteProvince, setSiteProvince] = useState('');
  const [sitePostalCode, setSitePostalCode] = useState('');
  const [siteName, setSiteName] = useState('');
  
  // Photos
  const [photos, setPhotos] = useState<string[]>([]);
  
  // Modal states
  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showExpertiseModal, setShowExpertiseModal] = useState(false);
  const [showDistinctionModal, setShowDistinctionModal] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [websiteLink, setWebsiteLink] = useState('');
  
  // Photo modals
  const [showPhotoTipsModal, setShowPhotoTipsModal] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [uploadedPhotosTemp, setUploadedPhotosTemp] = useState<string[]>([]);
  
  // Title
  const [experienceTitle, setExperienceTitle] = useState('');
  const [showTitleTipsModal, setShowTitleTipsModal] = useState(false);
  
  // Description
  const [experienceDescription, setExperienceDescription] = useState('');
  
  // Program
  const [programActivities, setProgramActivities] = useState<string[]>([]);
  
  // Activity modal states
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityModalStep, setActivityModalStep] = useState<'title' | 'tips' | 'description' | 'duration' | 'photo'>('title');
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number | null>(null);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [activityDuration, setActivityDuration] = useState(60);
  const [activityPhoto, setActivityPhoto] = useState('');
  const [activities, setActivities] = useState<Array<{ title: string; description: string; duration: number; photo: string }>>([]);

  // Pricing states
  const [maxParticipants, setMaxParticipants] = useState(1);
  const [pricePerPerson, setPricePerPerson] = useState(7);
  const [showPricingBreakdown, setShowPricingBreakdown] = useState(false);
  const [pricingStep, setPricingStep] = useState<'participants' | 'price'>('participants');

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('experienceOnboarding');
    if (savedData) {
      const data = JSON.parse(savedData);
      if (data.selectedCategory) setSelectedCategory(data.selectedCategory);
      if (data.selectedType) setSelectedType(data.selectedType);
      if (data.location) setLocation(data.location);
      if (data.experienceYears) setExperienceYears(data.experienceYears);
      if (data.presentation) setPresentation(data.presentation);
      if (data.expertise) setExpertise(data.expertise);
      if (data.distinction) setDistinction(data.distinction);
      if (data.websiteLinks) setWebsiteLinks(data.websiteLinks);
      if (data.country) setCountry(data.country);
      if (data.streetAddress) setStreetAddress(data.streetAddress);
      if (data.apartment) setApartment(data.apartment);
      if (data.commune) setCommune(data.commune);
      if (data.province) setProvince(data.province);
      if (data.postalCode) setPostalCode(data.postalCode);
      if (data.meetingLocation) setMeetingLocation(data.meetingLocation);
      if (data.confirmCountry) setConfirmCountry(data.confirmCountry);
      if (data.siteAddress) setSiteAddress(data.siteAddress);
      if (data.siteApartment) setSiteApartment(data.siteApartment);
      if (data.siteCommune) setSiteCommune(data.siteCommune);
      if (data.siteProvince) setSiteProvince(data.siteProvince);
      if (data.sitePostalCode) setSitePostalCode(data.sitePostalCode);
      if (data.siteName) setSiteName(data.siteName);
      // photos not loaded from localStorage (too large)
      if (data.experienceTitle) setExperienceTitle(data.experienceTitle);
      if (data.experienceDescription) setExperienceDescription(data.experienceDescription);
      if (data.programActivities) setProgramActivities(data.programActivities);
    }
  }, []);

  // Save data whenever it changes (excluding photos to avoid localStorage quota)
  useEffect(() => {
    const dataToSave = {
      selectedCategory,
      selectedType,
      location,
      experienceYears,
      presentation,
      expertise,
      distinction,
      websiteLinks,
      country,
      streetAddress,
      apartment,
      commune,
      province,
      postalCode,
      meetingLocation,
      confirmCountry,
      siteAddress,
      siteApartment,
      siteCommune,
      siteProvince,
      sitePostalCode,
      siteName,
      // photos excluded - too large for localStorage
      experienceTitle,
      experienceDescription,
      programActivities
    };
    try {
      localStorage.setItem('experienceOnboarding', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [selectedCategory, selectedType, location, experienceYears, presentation, expertise, distinction, websiteLinks, country, streetAddress, apartment, commune, province, postalCode, meetingLocation, confirmCountry, siteAddress, siteApartment, siteCommune, siteProvince, sitePostalCode, siteName, experienceTitle, experienceDescription, programActivities]);

  const getCategoryLabel = (category: ExperienceCategory): string => {
    const labels = {
      'art-design': 'Art et design',
      'cuisine': 'Cuisine et boissons',
      'fitness': 'Fitness et bien-être',
      'histoire': 'Histoire et culture',
      'nature': 'Nature et plein air'
    };
    return category ? labels[category] : '';
  };

  // Photo handling functions
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const readerPromises = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises).then(results => {
      setUploadedPhotosTemp([...uploadedPhotosTemp, ...results]);
    }).catch(error => {
      console.error('Error reading files:', error);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (!files) return;

    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
    const readerPromises = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises).then(results => {
      setUploadedPhotosTemp([...uploadedPhotosTemp, ...results]);
    }).catch(error => {
      console.error('Error reading dropped files:', error);
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotosTemp(uploadedPhotosTemp.filter((_, i) => i !== index));
  };

  const handleAddPhotos = () => {
    try {
      const newPhotos = [...photos, ...uploadedPhotosTemp];
      setPhotos(newPhotos);
      setUploadedPhotosTemp([]);
      setShowAddPhotoModal(false);
    } catch (error) {
      console.error('Error adding photos:', error);
    }
  };

  const handleCancelPhotoModal = () => {
    setUploadedPhotosTemp([]);
    setShowAddPhotoModal(false);
  };

  const handleCategorySelect = (category: ExperienceCategory) => {
    setSelectedCategory(category);
  };

  const handleCategoryNext = () => {
    if (selectedCategory) {
      setCurrentStep('type');
    }
  };

  const handleTypeSelect = (type: ExperienceType) => {
    setSelectedType(type);
  };

  const handleTypeNext = () => {
    if (selectedType) {
      setCurrentStep('location');
    }
  };

  const handleLocationNext = () => {
    if (location.trim()) {
      setCurrentStep('intro');
    }
  };

  const tips = [
    {
      title: 'Artisan du cuir',
      items: [
        {
          icon: '🎓',
          title: 'Utilisez un intitulé professionnel',
          description: 'Indiquez aux voyageurs ce que vous faites, par exemple danseur de salon ou guide nature.'
        },
        {
          icon: '📝',
          title: 'Donnez des précisions',
          description: 'Partagez ce qui rend votre profil unique, par exemple, rédacteur culturel ou historienne médiévale.'
        },
        {
          icon: '⭐',
          title: 'Mettez en avant ce qui vous distingue',
          description: 'Insistez sur l\'aspect local ou une réalisation particulière, par exemple, fondateur d\'une association ou auteur publié.'
        }
      ]
    },
    {
      title: 'Styliste de mode',
      items: [
        {
          icon: '✨',
          title: 'Présentez votre expertise',
          description: 'Expliquez votre parcours professionnel et vos domaines de spécialité.'
        }
      ]
    },
    {
      title: 'Illustratrice et peintre',
      items: [
        {
          icon: '🎨',
          title: 'Partagez votre passion',
          description: 'Racontez ce qui vous passionne dans votre art et votre démarche créative.'
        }
      ]
    }
  ];

  // Render modals functions
  const renderPresentationModal = () => {
    if (!showPresentationModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
          <button
            onClick={() => setShowPresentationModal(false)}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl text-center mb-6" style={{ fontWeight: 600, color: '#222222' }}>
            Comment vous présentez-vous ?
          </h2>

          <textarea
            value={presentation}
            onChange={(e) => setPresentation(e.target.value)}
            placeholder="Artisan du cuir"
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-base focus:border-gray-900 focus:outline-none transition-colors resize-none mb-4"
            rows={6}
            maxLength={400}
            style={{ color: '#222222' }}
          />

          <p className="text-sm text-right mb-6" style={{ color: '#717171' }}>
            Caractères restants : {400 - presentation.length}/400
          </p>

          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setShowPresentationModal(false);
                setShowTipsModal(true);
              }}
              className="text-sm hover:underline"
              style={{ color: '#222222', fontWeight: 600 }}
            >
              Découvrir nos conseils
            </button>
            <button
              onClick={() => setShowPresentationModal(false)}
              className="px-6 py-2 rounded-lg text-sm"
              style={{ fontWeight: 600, color: '#717171', backgroundColor: '#F5F5F5' }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTipsModal = () => {
    if (!showTipsModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative">
          <button
            onClick={() => setShowTipsModal(false)}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-sm text-center mb-6" style={{ color: '#717171' }}>
            Découvrir nos conseils
          </h3>

          <h2 className="text-3xl text-center mb-8" style={{ fontWeight: 600, color: '#222222' }}>
            Comment créer<br />votre présentation
          </h2>

          <div className="space-y-6 mb-8">
            {tips[currentTipIndex].items.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 text-2xl">{item.icon}</div>
                <div>
                  <h4 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    {item.title}
                  </h4>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>Inspiration</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentTipIndex(Math.max(0, currentTipIndex - 1))}
                  disabled={currentTipIndex === 0}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentTipIndex(Math.min(tips.length - 1, currentTipIndex + 1))}
                  disabled={currentTipIndex === tips.length - 1}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {tips.map((tip, idx) => (
                <div
                  key={idx}
                  className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    idx === currentTipIndex ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                  }`}
                  onClick={() => setCurrentTipIndex(idx)}
                >
                  <p className="text-sm whitespace-nowrap" style={{ fontWeight: 500, color: '#222222' }}>
                    {tip.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExpertiseModal = () => {
    if (!showExpertiseModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
          <button
            onClick={() => setShowExpertiseModal(false)}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl text-center mb-6" style={{ fontWeight: 600, color: '#222222' }}>
            Mettez en avant votre expérience
          </h2>

          <textarea
            value={expertise}
            onChange={(e) => setExpertise(e.target.value)}
            placeholder="Indiquez les étapes qui ont marqué votre parcours. Par exemple : « Artisan du cuir et fondateur de R. Atelier, je crée... »"
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-sm focus:border-gray-900 focus:outline-none transition-colors resize-none mb-4"
            rows={6}
            maxLength={1150}
            style={{ color: '#222222' }}
          />

          <p className="text-sm text-right mb-6" style={{ color: '#717171' }}>
            Caractères requis : {expertise.length}/1150
          </p>

          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setShowExpertiseModal(false);
                setShowTipsModal(true);
              }}
              className="text-sm hover:underline"
              style={{ color: '#222222', fontWeight: 600 }}
            >
              Découvrir nos conseils
            </button>
            <button
              onClick={() => setShowExpertiseModal(false)}
              className="px-6 py-2 rounded-lg text-sm"
              style={{ fontWeight: 600, color: '#717171', backgroundColor: '#F5F5F5' }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDistinctionModal = () => {
    if (!showDistinctionModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
          <button
            onClick={() => setShowDistinctionModal(false)}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl text-center mb-6" style={{ fontWeight: 600, color: '#222222' }}>
            Ajoutez une distinction
          </h2>

          <textarea
            value={distinction}
            onChange={(e) => setDistinction(e.target.value)}
            placeholder="Par exemple : « Prix de la meilleure œuvre d'art de l'année »"
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-sm focus:border-gray-900 focus:outline-none transition-colors resize-none mb-4"
            rows={6}
            maxLength={1150}
            style={{ color: '#222222' }}
          />

          <p className="text-sm text-right mb-6" style={{ color: '#717171' }}>
            Caractères requis : {distinction.length}/1150
          </p>

          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setShowDistinctionModal(false);
                setShowTipsModal(true);
              }}
              className="text-sm hover:underline"
              style={{ color: '#222222', fontWeight: 600 }}
            >
              Découvrir nos conseils
            </button>
            <button
              onClick={() => setShowDistinctionModal(false)}
              className="px-6 py-2 rounded-lg text-sm"
              style={{ fontWeight: 600, color: '#717171', backgroundColor: '#F5F5F5' }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAddLinkModal = () => {
    if (!showAddLinkModal) return null;

    const handleSaveLink = () => {
      if (tempLinkInput.trim()) {
        setWebsiteLinks([...websiteLinks, tempLinkInput.trim()]);
        setTempLinkInput('');
      }
      setShowAddLinkModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
          <button
            onClick={() => {
              setShowAddLinkModal(false);
              setTempLinkInput('');
            }}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl text-center mb-6" style={{ fontWeight: 600, color: '#222222' }}>
            Ajoutez un lien
          </h2>

          <input
            type="text"
            value={tempLinkInput}
            onChange={(e) => setTempLinkInput(e.target.value)}
            placeholder="https://www.exemple.com"
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-sm focus:border-gray-900 focus:outline-none transition-colors mb-4"
            style={{ color: '#222222' }}
          />

          <div className="flex justify-end items-center gap-3">
            <button
              onClick={handleSaveLink}
              className="px-6 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              style={{ fontWeight: 600, color: '#222222', backgroundColor: '#F5F5F5' }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Photo Tips Modal
  const renderPhotoTipsModal = () => {
    if (!showPhotoTipsModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setShowPhotoTipsModal(false)}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl text-center mb-2" style={{ fontWeight: 600, color: '#222222' }}>
            Découvrir nos conseils
          </h2>

          <div className="mb-8"></div>

          <h3 className="text-xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
            Comment choisir de bonnes<br />photos pour votre expérience
          </h3>

          {/* Tips */}
          <div className="space-y-6 mb-8">
            {/* Tip 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Proposez des photos variées
                </h4>
                <p className="text-sm" style={{ color: '#717171' }}>
                  Ajoutez des photos de personnes en action et montrez différents aspects de votre expérience.
                </p>
              </div>
            </div>

            {/* Tip 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Privilégiez l'authenticité
                </h4>
                <p className="text-sm" style={{ color: '#717171' }}>
                  Vos clients sont l'authenticité d'inclure des photos et elles doivent fidèlement représenter votre expérience.
                </p>
              </div>
            </div>

            {/* Tip 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="10" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M8 11V7a4 4 0 0 1 8 0v4"/>
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Immortalisez la magie
                </h4>
                <p className="text-sm" style={{ color: '#717171' }}>
                  Évitez les très gros plans, le texte superposé ou les filigranes. <a href="#" className="underline" style={{ color: '#222222' }}>En savoir plus</a>
                </p>
              </div>
            </div>
          </div>

          {/* Inspiration Section */}
          <div>
            <h4 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              Inspiration
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1757085242675-1a047a53c04d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwYWludGluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc2ODQwMDA5N3ww&ixlib=rb-4.1.0&q=80&w=1080" 
                  alt="Art workshop" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div className="aspect-[4/3] rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1634151739970-bba3910d0d36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2xhc3MlMjBmb29kfGVufDF8fHx8MTc2ODM3NTI1NXww&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt="Cooking class" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1750498407644-ed88cc6bbac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNyYWZ0JTIwd29ya3Nob3B8ZW58MXx8fHwxNzY4NDQzNDE3fDA&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt="Handmade craft" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add Photo Modal (Upload Interface)
  const renderAddPhotoModal = () => {
    if (!showAddPhotoModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative max-h-[90vh] flex flex-col">
          <button
            onClick={handleCancelPhotoModal}
            className="absolute top-6 left-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <button
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>

          <div className="text-center mb-6">
            <h2 className="text-xl mb-1" style={{ fontWeight: 600, color: '#222222' }}>
              Ajoutez des photos
            </h2>
            <p className="text-sm" style={{ color: '#717171' }}>
              {uploadedPhotosTemp.length} élément(s) sélectionné(s)
            </p>
          </div>

          {/* Content Area - Scrollable */}
          <div className="flex-1 overflow-y-auto mb-6">
            {uploadedPhotosTemp.length === 0 ? (
              /* Drop Zone */
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center"
              >
                <div className="mb-4">
                  <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
                    <rect x="8" y="16" width="32" height="24" rx="2" stroke="#222222" strokeWidth="2"/>
                    <rect x="24" y="28" width="32" height="24" rx="2" fill="white" stroke="#222222" strokeWidth="2"/>
                    <circle cx="32" cy="34" r="2" fill="#222222"/>
                    <polyline points="24 52 32 42 40 48 56 36 56 52" stroke="#222222" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
                <p className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Glissez-déposez un fichier
                </p>
                <p className="text-sm mb-4" style={{ color: '#717171' }}>
                  ou recherchez des photos
                </p>
                <input
                  type="file"
                  id="photo-upload"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="photo-upload"
                  className="px-6 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ fontWeight: 600, backgroundColor: '#222222' }}
                >
                  Parcourir
                </label>
              </div>
            ) : (
              /* Photo Grid */
              <div className="grid grid-cols-2 gap-3">
                {uploadedPhotosTemp.map((photo, index) => (
                  <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                      title="Supprimer cette photo"
                    >
                      <span className="text-white text-xs" style={{ fontWeight: 600 }}>i</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              onClick={handleCancelPhotoModal}
              className="text-sm hover:underline"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Annuler
            </button>
            <button
              onClick={handleAddPhotos}
              disabled={uploadedPhotosTemp.length === 0}
              className="px-6 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ 
                fontWeight: 600, 
                backgroundColor: uploadedPhotosTemp.length > 0 ? '#222222' : '#E5E5E5',
                color: uploadedPhotosTemp.length > 0 ? 'white' : '#717171'
              }}
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Title Tips Modal
  const renderTitleTipsModal = () => {
    if (!showTitleTipsModal) return null;

    const tips = [
      {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        ),
        title: "Mettez en avant l'activité principale",
        description: "Assurez-vous que l'activité est l'objet dans le titre, que manœuvre un verbe et un lieu original pour vous démarquer."
      },
      {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 3v18"/>
          </svg>
        ),
        title: "Rédigez un titre clair mais accrocheur",
        description: "Évitez-vous de termes directifs (tel qu'adaptant un ton original pour vous démarquer."
      },
      {
        icon: (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ),
        title: "Valorisez un aspect unique",
        description: "Identifiez ce qui rend votre expérience typique et mettez-le en valeur."
      }
    ];

    const examples = [
      {
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop",
        title: "Travaillez le cuir avec un artisan de Tokyo"
      },
      {
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
        title: "Explorez les souks de Marrakech en compagnie d'un marchand d'épices"
      },
      {
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
        title: "Capturez l'esprit du Brésil dans une colorée"
      }
    ];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg" style={{ fontWeight: 600, color: '#222222' }}>
              Découvrir nos conseils
            </h2>
            <button
              onClick={() => setShowTitleTipsModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
              Comment donner un titre à votre expérience
            </h3>

            {/* Tips */}
            <div className="space-y-6 mb-8">
              {tips.map((tip, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {tip.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                      {tip.title}
                    </h4>
                    <p className="text-sm" style={{ color: '#717171' }}>
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Inspiration Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                  Inspiration
                </h4>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {examples.map((example, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                    <img 
                      src={example.image} 
                      alt="" 
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 flex items-center">
                      <p className="text-sm" style={{ color: '#222222' }}>
                        {example.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-base mb-3" style={{ fontWeight: 600, color: '#222222' }}>
                En savoir plus
              </h4>
              <div className="flex gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop" 
                  alt="" 
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h5 className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Rédigez un titre et une description efficaces
                  </h5>
                  <p className="text-xs" style={{ color: '#717171' }}>
                    Temps de lecture : 3 min
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 1: Category Selection
  if (currentStep === 'category') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
            <Logo />
          </button>
          <button 
            onClick={() => onNavigate('annonces')}
            className="px-6 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
          <div className="max-w-4xl w-full">
            <h1 className="text-4xl text-center mb-16" style={{ fontWeight: 600, color: '#222222' }}>
              Quelle expérience<br />allez-vous proposer<br />aux voyageurs ?
            </h1>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {/* Art et design */}
              <button
                onClick={() => handleCategorySelect('art-design')}
                className={`p-6 rounded-xl border-2 transition-all hover:border-gray-900 ${
                  selectedCategory === 'art-design' ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
                      <rect x="12" y="8" width="32" height="40" rx="2" fill="#FFB4B4" stroke="#E57373" strokeWidth="2"/>
                      <path d="M20 16 L28 32 L36 20 L44 28" stroke="#E57373" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="24" cy="20" r="3" fill="#E57373"/>
                      <rect x="8" y="12" width="8" height="32" rx="1" fill="#D4A574"/>
                    </svg>
                  </div>
                  <p className="text-sm text-center" style={{ fontWeight: 600, color: '#222222' }}>
                    Art et design
                  </p>
                </div>
              </button>

              {/* Cuisine et boissons */}
              <button
                onClick={() => handleCategorySelect('cuisine')}
                className={`p-6 rounded-xl border-2 transition-all hover:border-gray-900 ${
                  selectedCategory === 'cuisine' ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
                      <ellipse cx="32" cy="38" rx="18" ry="4" fill="#FFA726"/>
                      <path d="M14 38 L14 42 C14 44 16 46 20 46 L44 46 C48 46 50 44 50 42 L50 38" fill="#FF9800"/>
                      <circle cx="22" cy="28" r="6" fill="#FFD54F"/>
                      <circle cx="38" cy="30" r="5" fill="#8BC34A"/>
                      <circle cx="30" cy="24" r="4" fill="#EF5350"/>
                    </svg>
                  </div>
                  <p className="text-sm text-center" style={{ fontWeight: 600, color: '#222222' }}>
                    Cuisine et<br />boissons
                  </p>
                </div>
              </button>

              {/* Fitness et bien-être */}
              <button
                onClick={() => handleCategorySelect('fitness')}
                className={`p-6 rounded-xl border-2 transition-all hover:border-gray-900 ${
                  selectedCategory === 'fitness' ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
                      <rect x="28" y="18" width="8" height="28" rx="4" fill="#64B5F6"/>
                      <ellipse cx="32" cy="14" rx="6" ry="8" fill="#42A5F5"/>
                      <circle cx="18" cy="32" r="6" fill="#90CAF9"/>
                      <circle cx="46" cy="32" r="6" fill="#90CAF9"/>
                      <rect x="12" y="30" width="12" height="4" rx="2" fill="#42A5F5"/>
                      <rect x="40" y="30" width="12" height="4" rx="2" fill="#42A5F5"/>
                    </svg>
                  </div>
                  <p className="text-sm text-center" style={{ fontWeight: 600, color: '#222222' }}>
                    Fitness et<br />bien-être
                  </p>
                </div>
              </button>

              {/* Histoire et culture */}
              <button
                onClick={() => handleCategorySelect('histoire')}
                className={`p-6 rounded-xl border-2 transition-all hover:border-gray-900 ${
                  selectedCategory === 'histoire' ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
                      <rect x="16" y="12" width="32" height="40" fill="#D7CCC8"/>
                      <rect x="20" y="16" width="8" height="12" fill="#8D6E63"/>
                      <rect x="32" y="16" width="8" height="12" fill="#8D6E63"/>
                      <rect x="20" y="32" width="8" height="12" fill="#8D6E63"/>
                      <rect x="32" y="32" width="8" height="12" fill="#8D6E63"/>
                      <path d="M16 12 L32 4 L48 12" fill="#A1887F"/>
                    </svg>
                  </div>
                  <p className="text-sm text-center" style={{ fontWeight: 600, color: '#222222' }}>
                    Histoire<br />et culture
                  </p>
                </div>
              </button>

              {/* Nature et plein air */}
              <button
                onClick={() => handleCategorySelect('nature')}
                className={`p-6 rounded-xl border-2 transition-all hover:border-gray-900 ${
                  selectedCategory === 'nature' ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 mb-4 flex items-center justify-center">
                    <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
                      <ellipse cx="32" cy="48" rx="24" ry="8" fill="#66BB6A"/>
                      <path d="M20 48 L24 32 L28 48" fill="#4CAF50"/>
                      <path d="M36 48 L40 28 L44 48" fill="#388E3C"/>
                      <circle cx="32" cy="24" r="8" fill="#81C784"/>
                      <path d="M28 24 Q32 16 36 24" fill="#66BB6A"/>
                      <ellipse cx="32" cy="40" rx="16" ry="6" fill="#A5D6A7"/>
                    </svg>
                  </div>
                  <p className="text-sm text-center" style={{ fontWeight: 600, color: '#222222' }}>
                    Nature et<br />plein air
                  </p>
                </div>
              </button>
            </div>

            {/* Next Button */}
            <div className="flex justify-center mt-16">
              <button
                disabled={!selectedCategory}
                onClick={handleCategoryNext}
                className={`px-8 py-3 rounded-lg text-white text-base transition-opacity ${
                  selectedCategory ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'
                }`}
                style={{ fontWeight: 600, backgroundColor: selectedCategory ? '#222222' : '#E5E5E5' }}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Type Selection
  if (currentStep === 'type') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
            <Logo />
          </button>
          <button 
            onClick={() => onNavigate('annonces')}
            className="px-6 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="max-w-6xl w-full flex gap-12 items-center">
            {/* Left side - Form */}
            <div className="flex-1">
              <h1 className="text-4xl mb-12" style={{ fontWeight: 600, color: '#222222' }}>
                Comment décririez-<br />vous votre expérience ?
              </h1>

              <div className="grid grid-cols-2 gap-4 max-w-xl">
                <button
                  onClick={() => handleTypeSelect('visite-archi')}
                  className={`px-6 py-4 rounded-xl border-2 text-base text-left transition-all hover:border-gray-900 ${
                    selectedType === 'visite-archi' ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                  }`}
                  style={{ fontWeight: 500, color: '#222222' }}
                >
                  Visite architecturale
                </button>

                <button
                  onClick={() => handleTypeSelect('atelier-art')}
                  className={`px-6 py-4 rounded-xl border-2 text-base text-left transition-all hover:border-gray-900 ${
                    selectedType === 'atelier-art' ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                  }`}
                  style={{ fontWeight: 500, color: '#222222' }}
                >
                  Atelier artistique
                </button>

                <button
                  onClick={() => handleTypeSelect('visite-galeries')}
                  className={`px-6 py-4 rounded-xl border-2 text-base text-left transition-all hover:border-gray-900 ${
                    selectedType === 'visite-galeries' ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                  }`}
                  style={{ fontWeight: 500, color: '#222222' }}
                >
                  Visite de galeries
                </button>

                <button
                  onClick={() => handleTypeSelect('shopping-mode')}
                  className={`px-6 py-4 rounded-xl border-2 text-base text-left transition-all hover:border-gray-900 ${
                    selectedType === 'shopping-mode' ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                  }`}
                  style={{ fontWeight: 500, color: '#222222' }}
                >
                  Expérience shopping et mode
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentStep('category')}
                  className="px-6 py-3 rounded-lg text-base hover:bg-gray-100 transition-colors flex items-center gap-2"
                  style={{ fontWeight: 600, color: '#222222' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Retour
                </button>
                <button
                  disabled={!selectedType}
                  onClick={handleTypeNext}
                  className={`px-8 py-3 rounded-lg text-white text-base transition-opacity ${
                    selectedType ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'
                  }`}
                  style={{ fontWeight: 600, backgroundColor: selectedType ? '#222222' : '#E5E5E5' }}
                >
                  Suivant
                </button>
              </div>
            </div>

            {/* Right side - Preview Card */}
            <div className="flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-80">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-6 flex items-center justify-center">
                    <svg className="w-28 h-28" viewBox="0 0 64 64" fill="none">
                      <rect x="12" y="8" width="32" height="40" rx="2" fill="#FFB4B4" stroke="#E57373" strokeWidth="2"/>
                      <path d="M20 16 L28 32 L36 20 L44 28" stroke="#E57373" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="24" cy="20" r="3" fill="#E57373"/>
                      <rect x="8" y="12" width="8" height="32" rx="1" fill="#D4A574"/>
                    </svg>
                  </div>
                  <h3 className="text-xl text-center" style={{ fontWeight: 600, color: '#222222' }}>
                    {getCategoryLabel(selectedCategory)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Location
  if (currentStep === 'location') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
            <Logo />
          </button>
          <button 
            onClick={() => onNavigate('annonces')}
            className="px-6 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Retour
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="max-w-6xl w-full flex gap-12 items-center">
            {/* Left side - Form */}
            <div className="flex-1">
              <h1 className="text-4xl mb-12" style={{ fontWeight: 600, color: '#222222' }}>
                Où proposerez-vous<br />votre expérience ?
              </h1>

              <div className="max-w-xl">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Saisir une ville"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-base focus:border-gray-900 focus:outline-none transition-colors"
                    style={{ color: '#222222' }}
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-4 mt-12">
                <button
                  onClick={() => setCurrentStep('type')}
                  className="px-6 py-3 rounded-lg text-base hover:bg-gray-100 transition-colors flex items-center gap-2"
                  style={{ fontWeight: 600, color: '#222222' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Retour
                </button>
                <button
                  disabled={!location.trim()}
                  onClick={handleLocationNext}
                  className={`px-8 py-3 rounded-lg text-white text-base transition-opacity ${
                    location.trim() ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'
                  }`}
                  style={{ fontWeight: 600, backgroundColor: location.trim() ? '#222222' : '#E5E5E5' }}
                >
                  Suivant
                </button>
              </div>
            </div>

            {/* Right side - Preview Card */}
            <div className="flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-80">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 mb-6 flex items-center justify-center">
                    <svg className="w-28 h-28" viewBox="0 0 64 64" fill="none">
                      <rect x="12" y="8" width="32" height="40" rx="2" fill="#FFB4B4" stroke="#E57373" strokeWidth="2"/>
                      <path d="M20 16 L28 32 L36 20 L44 28" stroke="#E57373" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="24" cy="20" r="3" fill="#E57373"/>
                      <rect x="8" y="12" width="8" height="32" rx="1" fill="#D4A574"/>
                    </svg>
                  </div>
                  <h3 className="text-xl text-center" style={{ fontWeight: 600, color: '#222222' }}>
                    {getCategoryLabel(selectedCategory)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Intro - Create your listing
  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-white flex flex-col md:flex-row">
        {/* Left side - Content */}
        <div className="flex-1 flex items-center justify-center px-8 md:px-16 py-16">
          <div className="max-w-xl">
            <h1 className="text-5xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
              Créez votre<br />annonce
            </h1>
            <p className="text-lg mb-2" style={{ color: '#717171' }}>
              Parlez-nous de vous et de l'expérience que vous proposez.
            </p>
            <p className="text-lg" style={{ color: '#717171' }}>
              Notre équipe vérifiera qu'elle répond à nos critères.
            </p>
          </div>
        </div>

        {/* Right side - Preview Card */}
        <div className="flex-1 flex items-center justify-center px-8 py-16 bg-gray-50">
          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full">
            <div className="flex flex-col items-center text-center">
              <div className="w-40 h-40 mb-8 flex items-center justify-center transform rotate-12">
                <svg className="w-full h-full" viewBox="0 0 64 64" fill="none">
                  <rect x="8" y="4" width="38" height="48" rx="2" fill="#FFB4B4" stroke="#E57373" strokeWidth="2"/>
                  <path d="M16 12 L24 28 L32 16 L40 24" stroke="#E57373" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="20" cy="16" r="3" fill="#E57373"/>
                  <rect x="4" y="8" width="10" height="38" rx="1" fill="#D4A574"/>
                  <ellipse cx="56" cy="16" rx="4" ry="6" fill="#FFD93D" opacity="0.8"/>
                  <circle cx="54" cy="44" r="2" fill="#E57373" opacity="0.6"/>
                </svg>
              </div>
              <h3 className="text-2xl mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                {getCategoryLabel(selectedCategory)}
              </h3>
              <p className="text-base" style={{ color: '#717171' }}>
                {location}
              </p>
            </div>
          </div>
        </div>

        {/* Footer with button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-6">
          <div className="max-w-7xl mx-auto flex justify-end">
            <button
              onClick={() => setCurrentStep('experience-years')}
              className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
              style={{ fontWeight: 600, backgroundColor: '#222222' }}
            >
              Commencer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 5: Experience Years
  if (currentStep === 'experience-years') {
    const categoryText = selectedCategory === 'art-design' ? "l'art et du design" : "ce domaine";
    
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header with Logo and Save */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
            <Logo />
          </button>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: '#717171' }}>
              À propos de vous <span style={{ color: '#222222', fontWeight: 600 }}>Étape 1 sur 7</span>
            </p>
            <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar - Progress */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#222222">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              </svg>
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-16 py-12">
            <div className="max-w-2xl w-full text-center">
              <h1 className="text-5xl mb-12" style={{ fontWeight: 600, color: '#222222' }}>
                Depuis combien d'années<br />
                travaillez-vous dans le<br />
                domaine de {categoryText} ?
              </h1>

              {/* Counter */}
              <div className="flex items-center justify-center gap-8 mb-16">
                <button
                  onClick={() => setExperienceYears(Math.max(0, experienceYears - 1))}
                  className="w-14 h-14 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center"
                  disabled={experienceYears === 0}
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>

                <div className="text-8xl" style={{ fontWeight: 600, color: '#222222', minWidth: '200px' }}>
                  {experienceYears}
                </div>

                <button
                  onClick={() => setExperienceYears(experienceYears + 1)}
                  className="w-14 h-14 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep('intro')}
            className="px-6 py-3 text-base hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('qualifications')}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600, backgroundColor: '#222222' }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Step 6: Qualifications
  if (currentStep === 'qualifications') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header with Logo and Save */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentStep('experience-years')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
              <Logo />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: '#717171' }}>
              À propos de vous <span style={{ color: '#222222', fontWeight: 600 }}>Étape 1 sur 7</span>
            </p>
            <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar - Profile */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              </svg>
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-16 py-12">
            <div className="max-w-2xl w-full">
              {/* Profile Initial */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gray-900 flex items-center justify-center text-white text-4xl" style={{ fontWeight: 600 }}>
                  R
                </div>
              </div>

              <h1 className="text-4xl text-center mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Décrivez vos qualifications
              </h1>
              
              <p className="text-center text-base mb-12" style={{ color: '#717171' }}>
                Aidez les voyageurs à mieux vous connaître.
              </p>

              {/* Sections - Now just buttons that open modals */}
              <div className="space-y-4">
                {/* Présentation */}
                <button
                  onClick={() => setShowPresentationModal(true)}
                  className="w-full border-2 border-gray-300 rounded-xl px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                        Présentation
                      </p>
                      <p className="text-sm" style={{ color: '#717171' }}>
                        Comment vous présentez-vous ?
                      </p>
                    </div>
                  </div>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                {/* Expertise */}
                <button
                  onClick={() => setShowExpertiseModal(true)}
                  className="w-full border-2 border-gray-300 rounded-xl px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                        Expertise
                      </p>
                      <p className="text-sm" style={{ color: '#717171' }}>
                        Mettez en avant votre expérience
                      </p>
                    </div>
                  </div>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>

                {/* Distinction obtenue */}
                <button
                  onClick={() => setShowDistinctionModal(true)}
                  className="w-full border-2 border-gray-300 rounded-xl px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                        Distinction obtenue <span style={{ color: '#717171', fontWeight: 400 }}>(facultatif)</span>
                      </p>
                      <p className="text-sm" style={{ color: '#717171' }}>
                        Ajoutez un moment fort de votre carrière
                      </p>
                    </div>
                  </div>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-8 text-sm" style={{ color: '#717171' }}>
                <button onClick={() => setShowTipsModal(true)} className="hover:underline">
                  Découvrir nos conseils
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep('experience-years')}
            className="px-6 py-3 text-base hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('online-profiles')}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600, backgroundColor: '#222222' }}
          >
            Suivant
          </button>
        </div>

        {/* Modals */}
        {renderPresentationModal()}
        {renderTipsModal()}
        {renderExpertiseModal()}
        {renderDistinctionModal()}
      </div>
    );
  }

  // Step 7: Online Profiles
  if (currentStep === 'online-profiles') {
    // Show initial interface with social logos if no links added yet
    if (websiteLinks.length === 0) {
      return (
        <div className="min-h-screen bg-white flex flex-col">
          {/* Header */}
          <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentStep('qualifications')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
                <Logo />
              </button>
            </div>
            <div className="flex items-center gap-6">
              <p className="text-sm" style={{ color: '#717171' }}>
                À propos de vous <span style={{ color: '#222222', fontWeight: 600 }}>Étape 1 sur 7</span>
              </p>
              <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
                Enregistrer et quitter
              </button>
            </div>
          </header>

          {/* Sidebar + Content */}
          <div className="flex flex-1">
            {/* Left Sidebar */}
            <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                </svg>
              </div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-16 py-12">
              <div className="max-w-2xl w-full">
                <h1 className="text-5xl mb-6 text-center" style={{ fontWeight: 600, color: '#222222' }}>
                  Ajoutez vos profils<br />en ligne
                </h1>
                
                <p className="text-base mb-12 max-w-xl mx-auto text-center" style={{ color: '#717171' }}>
                  Pour nous aider à confirmer vos compétences, ajoutez des liens vers vos commentaires, 
                  les articles de presse que vous avez reçus et votre site web. Les voyageurs ne les verront pas.
                </p>

                {/* Social Platform Cards */}
                <div className="flex justify-center gap-6 mb-12">
                  {/* Facebook */}
                  <div className="w-32 h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                    <svg className="w-16 h-16" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="20" fill="#1877F2"/>
                      <path d="M29.5 15.5H26.5C25.119 15.5 24 16.619 24 18V21H29.5L28.5 26H24V38H19V26H15.5V21H19V17.5C19 14.462 21.462 12 24.5 12H29.5V15.5Z" fill="white"/>
                    </svg>
                  </div>

                  {/* Google */}
                  <div className="w-32 h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                    <svg className="w-16 h-16" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                  </div>

                  {/* Yelp */}
                  <div className="w-32 h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                    <svg className="w-16 h-16" viewBox="0 0 48 48">
                      <path fill="#D32323" d="M24.7,33.8l-5.5,9.4c-0.4,0.7-1.4,0.8-1.9,0.2l-2.3-2.3c-0.5-0.5-0.5-1.4,0.1-1.9l5.5-4.8c0.8-0.7,2-0.1,2,0.9L24.7,33.8z"/>
                      <path fill="#D32323" d="M24.3,30.2c-0.8,0.1-1.5-0.5-1.5-1.3l-0.8-8.3c-0.1-0.8,0.7-1.5,1.5-1.3l3.9,0.9c0.8,0.2,1.3,1,1,1.8l-2.6,7.4C25.6,29.9,25,30.1,24.3,30.2z"/>
                      <path fill="#D32323" d="M20.5,28.1c-0.7-0.4-0.8-1.4-0.3-2l4.4-6c0.5-0.7,1.5-0.7,2,0l1.9,2.6c0.5,0.7,0.3,1.6-0.4,2l-6.2,3.7C21.4,28.7,21,28.5,20.5,28.1z"/>
                      <path fill="#D32323" d="M29.8,20.3l7.8-3.5c0.7-0.3,1.5,0.2,1.5,1l-0.1,2.9c0,0.7-0.6,1.3-1.3,1.2l-7.1-0.4c-1,0-1.4-1.2-0.7-1.8L29.8,20.3z"/>
                      <path fill="#D32323" d="M18.5,7.5l-0.9,12.8c0,0.9-1.1,1.3-1.7,0.6l-5.2-6.1c-0.6-0.7-0.4-1.8,0.4-2.2l9.5-4.8c0.9-0.5,1.9,0.3,1.7,1.3L18.5,7.5z"/>
                    </svg>
                  </div>
                </div>

                {/* Add Profile Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAddLinkModal(true)}
                    className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
                    style={{ fontWeight: 600, backgroundColor: '#222222' }}
                  >
                    Ajouter un profil
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
            <button
              onClick={() => setCurrentStep('qualifications')}
              className="px-6 py-3 text-base hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Retour
            </button>
            <button
              onClick={() => setCurrentStep('address-info')}
              className="text-base hover:underline"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Ignorer
            </button>
          </div>

          {/* Add Link Modal */}
          {renderAddLinkModal()}
        </div>
      );
    }

    // Show list interface when there are links
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentStep('qualifications')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
              <Logo />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: '#717171' }}>
              À propos de vous <span style={{ color: '#222222', fontWeight: 600 }}>Étape 1 sur 7</span>
            </p>
            <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              </svg>
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-16 py-12">
            <div className="max-w-2xl w-full">
              <h1 className="text-5xl mb-6 text-center" style={{ fontWeight: 600, color: '#222222' }}>
                Ajoutez vos profils<br />en ligne
              </h1>
              
              <p className="text-base mb-12 max-w-xl mx-auto text-center" style={{ color: '#717171' }}>
                Pour nous aider à confirmer vos compétences, ajoutez des liens vers vos commentaires, 
                les articles de presse que vous avez reçus et votre site web. Les voyageurs ne les verront pas.
              </p>

              {/* Saved Links */}
              <div className="space-y-4 mb-6">
                {websiteLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-4 py-4 border border-gray-300 rounded-xl hover:border-gray-900 transition-colors"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                    <span className="flex-1 text-left" style={{ color: '#222222' }}>{link}</span>
                    <button
                      onClick={() => setWebsiteLinks(websiteLinks.filter((_, i) => i !== index))}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Another Link Button */}
              <button
                onClick={() => setShowAddLinkModal(true)}
                className="w-full py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200"
                style={{ fontWeight: 600 }}
              >
                Ajouter un autre lien
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep('qualifications')}
            className="px-6 py-3 text-base hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('address-info')}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600, backgroundColor: '#222222' }}
          >
            Suivant
          </button>
        </div>

        {/* Add Link Modal */}
        {renderAddLinkModal()}
      </div>
    );
  }

  // Step 8: Address Info
  if (currentStep === 'address-info') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentStep('online-profiles')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
              <Logo />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: '#717171' }}>
              À propos de vous <span style={{ color: '#222222', fontWeight: 600 }}>Étape 1 sur 7</span>
            </p>
            <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#222222">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              </svg>
            </div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-16 py-12">
            <div className="max-w-2xl w-full">
              <h1 className="text-5xl mb-12 text-center" style={{ fontWeight: 600, color: '#222222' }}>
                Parlez-nous un peu de vous
              </h1>

              <div className="space-y-4">
                {/* Country Dropdown */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#222222', fontWeight: 600 }}>
                    Quelle est votre adresse résidentielle ?
                  </label>
                  <p className="text-xs mb-2" style={{ color: '#717171' }}>
                    Les voyageurs ne verront pas ces informations.
                  </p>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    style={{ color: '#222222' }}
                  >
                    <option value="Madagascar">Madagascar</option>
                    <option value="France">France</option>
                    <option value="Canada">Canada</option>
                    <option value="États-Unis">États-Unis</option>
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#222222', fontWeight: 600 }}>
                    Adresse du domicile ou de la rue
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    placeholder="Adresse"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* Apartment */}
                <div>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    placeholder="Appartement, étage, immeuble (si applicable)"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* Commune */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#222222', fontWeight: 600 }}>
                    Commune
                  </label>
                  <input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    placeholder="Commune"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#222222', fontWeight: 600 }}>
                    Province/État/Territoire (si applicable)
                  </label>
                  <input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    placeholder="Province"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: '#222222', fontWeight: 600 }}>
                    Code postal (si applicable)
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    placeholder="Code postal"
                    style={{ color: '#222222' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep('online-profiles')}
            className="px-6 py-3 text-base hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('meeting-location')}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600, backgroundColor: '#222222' }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Step 9: Meeting Location
  if (currentStep === 'meeting-location') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentStep('address-info')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
              <Logo />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: '#717171' }}>
              Lieu <span style={{ color: '#222222', fontWeight: 600 }}>Étape 2 sur 7</span>
            </p>
            <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#222222" stroke="#222222" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-16 py-12">
            <div className="max-w-2xl w-full">
              <h1 className="text-5xl mb-6 text-center" style={{ fontWeight: 600, color: '#222222' }}>
                Où les voyageurs doivent-ils vous retrouver ?
              </h1>
              <p className="text-center mb-12" style={{ color: '#717171' }}>
                Les voyageurs verront cette adresse sur votre annonce.
              </p>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={meetingLocation}
                  onChange={(e) => setMeetingLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl outline-none focus:border-gray-900 transition-colors"
                  placeholder="Saisir une adresse"
                  style={{ color: '#222222' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep('address-info')}
            className="px-6 py-3 text-base hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('confirm-location')}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600, backgroundColor: '#222222' }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Step 10: Confirm Location
  if (currentStep === 'confirm-location') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentStep('meeting-location')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
              <Logo />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: '#717171' }}>
              Lieu <span style={{ color: '#222222', fontWeight: 600 }}>Étape 2 sur 7</span>
            </p>
            <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#222222" stroke="#222222" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-16 py-12">
            <div className="max-w-lg w-full">
              <h1 className="text-5xl mb-6 text-center" style={{ fontWeight: 600, color: '#222222' }}>
                Confirmez le lieu
              </h1>
              <p className="text-center mb-12" style={{ color: '#717171' }}>
                Assurez-vous que cette adresse est correcte. Vous ne pourrez plus la modifier une fois votre annonce envoyée.
              </p>

              <div className="space-y-4">
                {/* Country/Region */}
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#717171' }}>Pays/région</label>
                  <select
                    value={confirmCountry}
                    onChange={(e) => setConfirmCountry(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    style={{ color: '#222222' }}
                  >
                    <option value="Madagascar">Madagascar</option>
                    <option value="France">France</option>
                    <option value="Canada">Canada</option>
                    <option value="États-Unis">États-Unis</option>
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#717171' }}>Numéro et route de site</label>
                  <input
                    type="text"
                    value={siteAddress}
                    onChange={(e) => setSiteAddress(e.target.value)}
                    placeholder="4GJC+24M, Rue Ranaivo Paul"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* Apartment */}
                <div>
                  <input
                    type="text"
                    value={siteApartment}
                    onChange={(e) => setSiteApartment(e.target.value)}
                    placeholder="Appartement, étage, immeuble (si applicable)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* Commune */}
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#717171' }}>Commune</label>
                  <input
                    type="text"
                    value={siteCommune}
                    onChange={(e) => setSiteCommune(e.target.value)}
                    placeholder="Antananarivo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#717171' }}>Province/État/Territoire (si applicable)</label>
                  <input
                    type="text"
                    value={siteProvince}
                    onChange={(e) => setSiteProvince(e.target.value)}
                    placeholder="Analamanga"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-xs mb-2" style={{ color: '#717171' }}>Code postal (si applicable)</label>
                  <input
                    type="text"
                    value={sitePostalCode}
                    onChange={(e) => setSitePostalCode(e.target.value)}
                    placeholder="Code postal"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    style={{ color: '#222222' }}
                  />
                </div>

                {/* Site Name (Optional) */}
                <div>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Nom du lieu (facultatif)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-gray-900 transition-colors"
                    style={{ color: '#222222' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep('meeting-location')}
            className="px-6 py-3 text-base hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('map-marker')}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600, backgroundColor: '#222222' }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Step 11: Map Marker
  if (currentStep === 'map-marker') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentStep('confirm-location')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
              <Logo />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: '#717171' }}>
              Lieu <span style={{ color: '#222222', fontWeight: 600 }}>Étape 2 sur 7</span>
            </p>
            <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#222222" stroke="#222222" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-16 py-12">
            <div className="max-w-2xl w-full">
              <h1 className="text-5xl mb-12 text-center" style={{ fontWeight: 600, color: '#222222' }}>
                Le repère est-il au bon<br />endroit ?
              </h1>

              {/* Map Container */}
              <div className="relative w-full h-96 bg-gray-200 rounded-2xl overflow-hidden mb-8">
                {/* Simulated Map */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-100 to-gray-100">
                  {/* Map Details */}
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded text-xs" style={{ color: '#717171' }}>
                    Raccourcis clavier
                  </div>
                  <div className="absolute bottom-4 left-4 text-xs" style={{ color: '#717171' }}>
                    Données cartographiques ©2025 · 50 m
                  </div>
                  <div className="absolute bottom-4 right-4 text-xs" style={{ color: '#717171' }}>
                    Conditions d'utilisation
                  </div>
                  
                  {/* Center Marker */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="18" fill="white" opacity="0.3"/>
                        <circle cx="24" cy="24" r="12" fill="white" opacity="0.5"/>
                        <path d="M24 8C17.373 8 12 13.373 12 20C12 28 24 40 24 40C24 40 36 28 36 20C36 13.373 30.627 8 24 8Z" fill="#222222"/>
                        <circle cx="24" cy="20" r="4" fill="white"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Repositioning Button */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                  <button
                    className="px-6 py-3 rounded-full text-white text-sm shadow-lg hover:opacity-90 transition-opacity"
                    style={{ fontWeight: 600, backgroundColor: '#717171' }}
                  >
                    Déplacer la carte pour repositionner le repère
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => setCurrentStep('confirm-location')}
            className="px-6 py-3 text-base hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>
          <button
            onClick={() => setCurrentStep('photos')}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600, backgroundColor: '#222222' }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Step 12: Photos
  if (currentStep === 'photos') {
    // Ensure photos is always an array
    const safePhotos = Array.isArray(photos) ? photos : [];
    
    return (
      <>
        {renderPhotoTipsModal()}
        {renderAddPhotoModal()}
        <div className="min-h-screen bg-white flex flex-col">
          {/* Header */}
          <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentStep('map-marker')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
              <Logo />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: '#717171' }}>
              Photos <span style={{ color: '#222222', fontWeight: 600 }}>Étape 3 sur 7</span>
            </p>
            <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-16 py-12">
            <div className="max-w-2xl w-full">
              <h1 className="text-5xl mb-4 text-center" style={{ fontWeight: 600, color: '#222222' }}>
                Ajoutez des photos qui<br />mettent en valeur vos<br />compétences
              </h1>
              <p className="text-center mb-12" style={{ color: '#717171' }}>
                Ajoutez au moins 5 photos.
              </p>

              {/* Photo Grid */}
              {safePhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {safePhotos.map((photo, index) => (
                    <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-200">
                      <img 
                        src={photo} 
                        alt={`Photo ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white rounded-lg shadow-sm">
                          <span className="text-xs" style={{ fontWeight: 600, color: '#222222' }}>Couverture</span>
                        </div>
                      )}
                      <button
                        onClick={() => setPhotos(safePhotos.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {/* Add Photo Button */}
                  <button
                    onClick={() => setShowAddPhotoModal(true)}
                    className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="1.5">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-12">
                    <div className="flex gap-4">
                      {/* Mock photos showing example */}
                      <div className="w-48 h-36 rounded-xl overflow-hidden shadow-lg transform rotate-[-4deg]">
                        <img 
                          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop" 
                          alt="Example 1" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-48 h-36 rounded-xl overflow-hidden shadow-lg transform rotate-[4deg]">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" 
                          alt="Example 2" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Add Button - Only shown when no photos */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowAddPhotoModal(true)}
                      className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
                      style={{ fontWeight: 600, backgroundColor: '#222222' }}
                    >
                      Ajouter
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => setShowPhotoTipsModal(true)}
            className="text-base hover:underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Obtenir des conseils
          </button>
          <button
            onClick={() => setCurrentStep('title')}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontWeight: 600, backgroundColor: photos.length >= 5 ? '#222222' : '#E5E5E5' }}
            disabled={photos.length < 5}
          >
            Suivant
          </button>
        </div>
        </div>
      </>
    );
  }

  // Step 13: Title
  if (currentStep === 'title') {
    return (
      <>
        {renderTitleTipsModal()}
        <div className="min-h-screen bg-white flex flex-col">
          {/* Header */}
          <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentStep('photos')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
                <Logo />
              </button>
            </div>
            <div className="flex items-center gap-6">
              <p className="text-sm" style={{ color: '#717171' }}>
                Expérience <span style={{ color: '#222222', fontWeight: 600 }}>Étape 4 sur 7</span>
              </p>
              <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
                Enregistrer et quitter
              </button>
            </div>
          </header>

          {/* Sidebar + Content */}
          <div className="flex flex-1">
            {/* Left Sidebar */}
            <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-16 py-12">
              <div className="max-w-2xl w-full">
                <h1 className="text-5xl mb-12 text-center" style={{ fontWeight: 600, color: '#222222' }}>
                  Donnez un titre à votre<br />expérience
                </h1>

                {/* Title Input */}
                <div className="mb-8">
                  <textarea
                    value={experienceTitle}
                    onChange={(e) => {
                      if (e.target.value.length <= 60) {
                        setExperienceTitle(e.target.value);
                      }
                    }}
                    placeholder="Créez des sandales en cuir avec un artisan de Tokyo"
                    className={`w-full px-4 py-3 border-b-2 border-gray-300 focus:border-gray-900 outline-none resize-none transition-all ${experienceTitle ? 'text-4xl' : 'text-2xl'}`}
                    style={{ color: experienceTitle ? '#222222' : '#B0B0B0', fontWeight: experienceTitle ? 600 : 400 }}
                    rows={2}
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-sm" style={{ color: '#717171' }}>
                      Caractères restants : {60 - experienceTitle.length}/60
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
            <button
              onClick={() => setShowTitleTipsModal(true)}
              className="text-base hover:underline"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Obtenir des conseils
            </button>
            <button
              onClick={() => setCurrentStep('describe')}
              className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontWeight: 600, backgroundColor: experienceTitle.trim().length > 0 ? '#222222' : '#E5E5E5' }}
              disabled={experienceTitle.trim().length === 0}
            >
              Suivant
            </button>
          </div>
        </div>
      </>
    );
  }

  // Step 14: Describe
  if (currentStep === 'describe') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentStep('title')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
              <Logo />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: '#717171' }}>
              Expérience <span style={{ color: '#222222', fontWeight: 600 }}>Étape 4 sur 7</span>
            </p>
            <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Sidebar + Content */}
        <div className="flex flex-1">
          {/* Left Sidebar */}
          <div className="w-20 bg-gray-900 flex flex-col items-center py-8 gap-6">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="8" r="4"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-700"></div>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center px-16 py-12">
            <div className="max-w-2xl w-full">
              <h2 className="text-xl text-center mb-4" style={{ color: '#717171' }}>
                Décrivez votre expérience
              </h2>
              <div className="mb-16">
                <textarea
                  value={experienceDescription}
                  onChange={(e) => {
                    if (e.target.value.length <= 5000) {
                      setExperienceDescription(e.target.value);
                    }
                  }}
                  placeholder="Confectionnez vos propres sandales en cuir"
                  className={`w-full px-0 py-2 border-0 outline-none resize-none text-center transition-all ${experienceDescription ? 'text-5xl' : 'text-4xl'}`}
                  style={{ 
                    color: experienceDescription ? '#222222' : '#B0B0B0', 
                    fontWeight: experienceDescription ? 700 : 500,
                    lineHeight: '1.1'
                  }}
                  rows={3}
                />
              </div>
              <p className="text-sm text-center" style={{ color: '#717171' }}>
                Décrivez ce que feront les voyageurs. Par exemple : « Confectionnez vos propres sandales en cuir ».
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          <button
            className="text-base hover:underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Obtenir des conseils
          </button>
          <button
            onClick={() => setCurrentStep('program-intro')}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontWeight: 600, backgroundColor: experienceDescription.trim().length > 0 ? '#222222' : '#E5E5E5' }}
            disabled={experienceDescription.trim().length === 0}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Step 15: Program Intro
  if (currentStep === 'program-intro') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentStep('describe')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
              <Logo />
            </button>
          </div>
          <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
            Enregistrer et quitter
          </button>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-16 py-12">
          <div className="max-w-2xl w-full">
            <h1 className="text-5xl mb-8 text-center" style={{ fontWeight: 600, color: '#222222' }}>
              Indiquez aux voyageurs ce<br />qu'ils feront en ajoutant un<br />programme
            </h1>

            {/* Example Cards */}
            <div className="space-y-4 mb-8">
              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=100&h=100&fit=crop"
                  alt="Préparez-vous"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Préparez-vous
                  </h3>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    30 minutes
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=100&h=100&fit=crop"
                  alt="Révisez la théorie des couleurs"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Révisez la théorie des couleurs
                  </h3>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    1 heure
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=100&h=100&fit=crop"
                  alt="Apprenez la restauration d'art"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Apprenez la restauration d'art
                  </h3>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    90 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-end">
          <button
            onClick={() => setCurrentStep('program')}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600, backgroundColor: '#222222' }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Step 16: Program
  if (currentStep === 'program') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentStep('program-intro')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
              <Logo />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: '#717171' }}>
              Programme <span style={{ color: '#222222', fontWeight: 600 }}>Étape 5 sur 7</span>
            </p>
            <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-16 py-12">
          <div className="max-w-2xl w-full">
            <h1 className="text-4xl mb-2 text-center" style={{ fontWeight: 600, color: '#222222' }}>
              {activities.length > 0 ? 'Votre programme' : 'Créez un programme'}
            </h1>
            <p className="text-base text-center mb-12" style={{ color: '#717171' }}>
              {activities.length > 0 
                ? `Ajoutez jusqu'à ${10 - activities.length} activités` 
                : 'Ajoutez jusqu\'à 10 activités à votre expérience afin que les voyageurs sachent à quoi s\'attendre.'}
            </p>

            {/* Activities List - Display in reverse order (newest first) */}
            {activities.length > 0 && (
              <div className="mb-4 space-y-3">
                {[...activities].reverse().map((activity, reverseIndex) => {
                  const index = activities.length - 1 - reverseIndex;
                  return (
                    <div key={index} className="p-4 border border-gray-300 rounded-xl flex gap-4 items-start hover:border-gray-400 transition-colors">
                      {/* Activity Photo Thumbnail */}
                      {activity.photo && (
                        <div className="flex-shrink-0">
                          <img 
                            src={activity.photo} 
                            alt={activity.title}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Activity Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                          {activity.title || `Activité ${index + 1}`} • {
                            activity.duration < 60 
                              ? `${activity.duration} min` 
                              : activity.duration % 60 === 0 
                                ? `${Math.floor(activity.duration / 60)}h` 
                                : `${Math.floor(activity.duration / 60)}h${activity.duration % 60}`
                          }
                        </h3>
                        {activity.description && (
                          <p className="text-sm" style={{ color: '#717171' }}>
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Activity Button */}
            <button
              onClick={() => {
                setActivityTitle('');
                setActivityDescription('');
                setActivityDuration(60);
                setActivityPhoto('');
                setCurrentActivityIndex(null);
                setActivityModalStep('title');
                setShowActivityModal(true);
              }}
              className="w-full p-5 border border-gray-300 rounded-xl hover:border-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span className="text-base" style={{ fontWeight: 400, color: '#222222' }}>
                Ajouter une activité
              </span>
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          <button
            className="text-base hover:underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Obtenir des conseils
          </button>
          <button
            onClick={() => {
              setCurrentStep('tarification');
              setPricingStep('participants');
              setShowPricingBreakdown(false);
            }}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600, backgroundColor: '#222222' }}
          >
            Suivant
          </button>
        </div>

        {/* Activity Modal */}
        {showActivityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Step 1: Title Input */}
              {activityModalStep === 'title' && (
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <h2 className="text-2xl" style={{ fontWeight: 600, color: '#222222' }}>
                      Donnez un titre à votre {currentActivityIndex !== null ? `activité` : 'première activité'}
                    </h2>
                    <button
                      onClick={() => setShowActivityModal(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Title Input */}
                  <div className="mb-8">
                    <input
                      type="text"
                      value={activityTitle}
                      onChange={(e) => setActivityTitle(e.target.value)}
                      placeholder="Apprenez les bases"
                      maxLength={50}
                      className="w-full text-center text-3xl p-4 border-b-2 border-gray-300 focus:border-gray-900 outline-none"
                      style={{ color: '#222222', fontWeight: 300 }}
                      autoFocus
                    />
                    <div className="text-right mt-2">
                      <span className="text-sm" style={{ color: '#717171' }}>
                        Caractères restants : {50 - activityTitle.length}/50
                      </span>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setActivityModalStep('tips')}
                      className="text-base hover:underline"
                      style={{ fontWeight: 600, color: '#222222' }}
                    >
                      Obtenir des conseils
                    </button>
                    <button
                      onClick={() => {
                        if (activityTitle.trim()) {
                          setActivityModalStep('description');
                        }
                      }}
                      disabled={!activityTitle.trim()}
                      className="px-6 py-2 rounded-lg text-white text-base hover:opacity-90 transition-opacity disabled:opacity-40"
                      style={{ fontWeight: 600, backgroundColor: '#222222' }}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Tips Modal */}
              {activityModalStep === 'tips' && (
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <button
                        onClick={() => setActivityModalStep('title')}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors mb-4"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                      <p className="text-sm mb-2" style={{ color: '#717171' }}>
                        Découvrir nos conseils
                      </p>
                      <h2 className="text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
                        Comment intituler<br />vos activités
                      </h2>
                    </div>
                    <button
                      onClick={() => setActivityModalStep('title')}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Tips Content */}
                  <div className="space-y-6 mb-8">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                          Mettez en avant l'activité principale
                        </h3>
                        <p className="text-sm" style={{ color: '#717171' }}>
                          Indiquez l'objet principal de chaque activité dans le titre.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                          Facilitez la lecture des informations
                        </h3>
                        <p className="text-sm" style={{ color: '#717171' }}>
                          Vous pouvez intituler votre activité en seulement 2 à 4 mots.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                            <path d="M9 11l3 3L22 4" />
                            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                          Tracez le parcours
                        </h3>
                        <p className="text-sm" style={{ color: '#717171' }}>
                          Les titres de vos activités créent votre programme, de l'introduction à la conclusion.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Inspiration Section */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                        Inspiration
                      </h3>
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors text-left">
                        <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                          Préparez-vous
                        </p>
                      </button>
                      <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors text-left">
                        <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                          Révélez l'histoire des couleurs
                        </p>
                      </button>
                      <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors text-left">
                        <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                          Apprenez la restauration originale
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Video Section */}
                  <div className="mb-8">
                    <h3 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                      En savoir plus
                    </h3>
                    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-900 transition-colors cursor-pointer">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=400&fit=crop"
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                          Comment créer un programme qui se démarque
                        </p>
                        <p className="text-sm" style={{ color: '#717171' }}>
                          Temps de lecture : 3 min
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setActivityModalStep('title')}
                      className="px-6 py-2 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
                      style={{ fontWeight: 600, backgroundColor: '#222222' }}
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Description Input */}
              {activityModalStep === 'description' && (
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <button
                      onClick={() => setActivityModalStep('title')}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowActivityModal(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <h2 className="text-2xl text-center mb-8" style={{ fontWeight: 600, color: '#222222' }}>
                    Décrivez ce que feront les voyageurs
                  </h2>

                  {/* Activity Title Display */}
                  <div className="mb-6">
                    <h3 className="text-3xl text-center mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                      {activityTitle}
                    </h3>
                    <p className="text-sm text-center mb-6" style={{ color: '#717171' }}>
                      Ajoutez des informations au sujet de votre activité. Par exemple :<br />
                      « Découvrez la promenade de fabrication du cuir »
                    </p>
                  </div>

                  {/* Description Input */}
                  <div className="mb-8">
                    <textarea
                      value={activityDescription}
                      onChange={(e) => setActivityDescription(e.target.value)}
                      placeholder="Décrivez l'activité..."
                      maxLength={50}
                      rows={3}
                      className="w-full text-center text-base p-4 border-b-2 border-gray-300 focus:border-gray-900 outline-none resize-none"
                      style={{ color: '#717171' }}
                    />
                    <div className="text-right mt-2">
                      <span className="text-sm" style={{ color: '#717171' }}>
                        Caractères restants : {50 - activityDescription.length}/50
                      </span>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setActivityModalStep('tips')}
                      className="text-base hover:underline"
                      style={{ fontWeight: 600, color: '#222222' }}
                    >
                      Obtenir des conseils
                    </button>
                    <button
                      onClick={() => {
                        setActivityModalStep('duration');
                      }}
                      className="px-6 py-2 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
                      style={{ fontWeight: 600, backgroundColor: '#222222' }}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Duration Selection */}
              {activityModalStep === 'duration' && (
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <button
                      onClick={() => setActivityModalStep('description')}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setActivityModalStep('description')}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <h2 className="text-2xl text-center mb-12" style={{ fontWeight: 600, color: '#222222' }}>
                    Définissez une durée
                  </h2>

                  {/* Duration Selector */}
                  <div className="flex items-center justify-center gap-8 mb-16">
                    <button
                      onClick={() => setActivityDuration(Math.max(15, activityDuration - 15))}
                      className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                    
                    <div className="text-center">
                      <div className="text-7xl mb-2" style={{ fontWeight: 300, color: '#222222' }}>
                        {activityDuration}
                      </div>
                      <div className="text-sm" style={{ color: '#717171' }}>
                        Minutes
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setActivityDuration(activityDuration + 15)}
                      className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  </div>

                  {/* Footer Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setActivityModalStep('photo')}
                      className="px-6 py-2 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
                      style={{ fontWeight: 600, backgroundColor: '#222222' }}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Photo Selection */}
              {activityModalStep === 'photo' && (
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <button
                      onClick={() => setActivityModalStep('duration')}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setActivityModalStep('duration')}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <h2 className="text-2xl text-center mb-8" style={{ fontWeight: 600, color: '#222222' }}>
                    Choisissez une photo
                  </h2>

                  {/* "Learn Basics" Button */}
                  <button className="w-full p-4 border border-gray-300 rounded-xl hover:border-gray-900 transition-colors flex items-center justify-center gap-3 mb-8">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span className="text-base" style={{ fontWeight: 400, color: '#222222' }}>
                      Apprenez les bases
                    </span>
                  </button>

                  {/* Photo Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {photos.length > 0 ? (
                      photos.map((photo, index) => (
                        <button
                          key={index}
                          onClick={() => setActivityPhoto(photo)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                            activityPhoto === photo 
                              ? 'border-gray-900 shadow-lg' 
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img 
                            src={photo} 
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))
                    ) : (
                      <>
                        {/* Default placeholder images if no photos uploaded */}
                        {['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
                          'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=400&h=400&fit=crop',
                          'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=400&fit=crop',
                          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
                          'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=400&h=400&fit=crop'].map((photoUrl, index) => (
                          <button
                            key={index}
                            onClick={() => setActivityPhoto(photoUrl)}
                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                              activityPhoto === photoUrl 
                                ? 'border-gray-900 shadow-lg' 
                                : 'border-gray-200 hover:border-gray-400'
                            }`}
                          >
                            <img 
                              src={photoUrl} 
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                        {/* Add Photo Button */}
                        <button className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center">
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {/* Footer Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        if (currentActivityIndex !== null) {
                          // Update existing activity
                          const newActivities = [...activities];
                          newActivities[currentActivityIndex] = {
                            title: activityTitle,
                            description: activityDescription,
                            duration: activityDuration,
                            photo: activityPhoto
                          };
                          setActivities(newActivities);
                        } else {
                          // Add new activity
                          setActivities([...activities, {
                            title: activityTitle,
                            description: activityDescription,
                            duration: activityDuration,
                            photo: activityPhoto
                          }]);
                        }
                        setShowActivityModal(false);
                        setActivityTitle('');
                        setActivityDescription('');
                        setActivityDuration(60);
                        setActivityPhoto('');
                        setCurrentActivityIndex(null);
                        setActivityModalStep('title');
                      }}
                      disabled={!activityPhoto}
                      className="px-6 py-2 rounded-lg text-white text-base hover:opacity-90 transition-opacity disabled:opacity-40"
                      style={{ fontWeight: 600, backgroundColor: '#222222' }}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Step 17: Pricing
  if (currentStep === 'tarification') {
    // Calculate service fee (assume 14% for example)
    const serviceFeePercentage = 14;
    const basePrice = pricePerPerson;
    const serviceFee = (basePrice * serviceFeePercentage) / 100;
    const youEarn = basePrice - serviceFee;

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (pricingStep === 'price') {
                  setPricingStep('participants');
                  setShowPricingBreakdown(false);
                } else {
                  setCurrentStep('program');
                  setPricingStep('participants');
                  setShowPricingBreakdown(false);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button onClick={() => onNavigate('annonces')} className="hover:opacity-70 transition-opacity">
              <Logo />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <p className="text-sm" style={{ color: '#717171' }}>
              Tarification <span style={{ color: '#222222', fontWeight: 600 }}>Étape 6 sur 7</span>
            </p>
            <button className="px-6 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
              Enregistrer et quitter
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-16 py-12">
          <div className="max-w-2xl w-full">
            {/* Step 1: Max Participants */}
            {pricingStep === 'participants' && (
              <>
                <h1 className="text-4xl mb-16 text-center" style={{ fontWeight: 600, color: '#222222' }}>
                  Indiquez le maximum de participants
                </h1>

                {/* Participant Counter */}
                <div className="flex items-center justify-center gap-8 mb-16">
                  <button
                    onClick={() => setMaxParticipants(Math.max(1, maxParticipants - 1))}
                    disabled={maxParticipants <= 1}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                  
                  <div className="text-9xl" style={{ fontWeight: 300, color: '#222222' }}>
                    {maxParticipants}
                  </div>
                  
                  <button
                    onClick={() => setMaxParticipants(maxParticipants + 1)}
                    className="w-12 h-12 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                      <line x1="12" y1="5" x2="12" y2="19"/>
                      <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Price per Person */}
            {pricingStep === 'price' && (
              <>
                <h1 className="text-4xl mb-16 text-center" style={{ fontWeight: 600, color: '#222222' }}>
                  Prix par voyageur
                </h1>

                {/* Price Input */}
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-baseline">
                    <span className="text-9xl" style={{ fontWeight: 300, color: '#222222' }}>
                      $
                    </span>
                    <input
                      type="number"
                      value={pricePerPerson}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          setPricePerPerson(val);
                        } else if (e.target.value === '') {
                          setPricePerPerson(1);
                        }
                      }}
                      className="text-9xl text-center outline-none w-64"
                      style={{ fontWeight: 300, color: '#222222' }}
                      min="1"
                    />
                  </div>
                </div>

                {/* "You earn" link and breakdown */}
                <div className="mb-16">
                  <div className="text-center mb-4">
                    <button
                      onClick={() => setShowPricingBreakdown(!showPricingBreakdown)}
                      className="text-sm hover:underline inline-flex items-center gap-1"
                      style={{ color: '#222222', fontWeight: 400 }}
                    >
                      Vous gagnez {youEarn.toFixed(0)}$
                      <svg 
                        className={`w-3 h-3 transition-transform ${showPricingBreakdown ? 'rotate-180' : ''}`} 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>

                  {/* Pricing Breakdown Card */}
                  {showPricingBreakdown && (
                    <div className="max-w-md mx-auto border border-gray-300 rounded-xl p-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-base" style={{ color: '#222222' }}>
                            Prix de base
                          </span>
                          <span className="text-base" style={{ color: '#222222', fontWeight: 600 }}>
                            ${basePrice}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-base" style={{ color: '#222222' }}>
                            Frais de service HOMIQIO ({serviceFeePercentage} %)
                          </span>
                          <span className="text-base" style={{ color: '#222222', fontWeight: 600 }}>
                            -${serviceFee.toFixed(0)}
                          </span>
                        </div>
                        <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                          <span className="text-base" style={{ color: '#222222', fontWeight: 600 }}>
                            Vous gagnez
                          </span>
                          <span className="text-base" style={{ color: '#222222', fontWeight: 600 }}>
                            ${youEarn.toFixed(0)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setShowPricingBreakdown(false)}
                          className="text-sm hover:underline inline-flex items-center gap-1"
                          style={{ color: '#222222', fontWeight: 400 }}
                        >
                          Afficher moins
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info link */}
                <div className="text-center">
                  <button className="text-sm hover:underline" style={{ color: '#222222', textDecoration: 'underline' }}>
                    En savoir plus sur la tarification
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          {pricingStep === 'price' ? (
            <button
              className="text-base hover:underline"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Découvrir nos conseils
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={() => {
              if (pricingStep === 'participants') {
                setPricingStep('price');
                setShowPricingBreakdown(false);
              } else {
                onNavigate('annonces');
              }
            }}
            className="px-8 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600, backgroundColor: '#222222' }}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  }

  // Return null as fallback (should never reach here)
  return null;
}