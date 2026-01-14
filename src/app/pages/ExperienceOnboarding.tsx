import { useState, useEffect } from 'react';
import { Logo } from '@/app/components/Logo';

interface ExperienceOnboardingProps {
  onNavigate: (page: string) => void;
}

type ExperienceCategory = 'art-design' | 'cuisine' | 'fitness' | 'histoire' | 'nature' | null;
type ExperienceType = 'visite-archi' | 'atelier-art' | 'visite-galeries' | 'shopping-mode' | null;

export function ExperienceOnboarding({ onNavigate }: ExperienceOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<'category' | 'type' | 'location' | 'intro' | 'experience-years' | 'qualifications' | 'online-profiles'>('category');
  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory>(null);
  const [selectedType, setSelectedType] = useState<ExperienceType>(null);
  const [location, setLocation] = useState('');
  const [experienceYears, setExperienceYears] = useState(10);
  const [presentation, setPresentation] = useState('');
  const [expertise, setExpertise] = useState('');
  const [distinction, setDistinction] = useState('');
  
  // Modal states
  const [showPresentationModal, setShowPresentationModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showExpertiseModal, setShowExpertiseModal] = useState(false);
  const [showDistinctionModal, setShowDistinctionModal] = useState(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [websiteLink, setWebsiteLink] = useState('');

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
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    const dataToSave = {
      selectedCategory,
      selectedType,
      location,
      experienceYears,
      presentation,
      expertise,
      distinction
    };
    localStorage.setItem('experienceOnboarding', JSON.stringify(dataToSave));
  }, [selectedCategory, selectedType, location, experienceYears, presentation, expertise, distinction]);

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

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
          <button
            onClick={() => setShowAddLinkModal(false)}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl text-center mb-6" style={{ fontWeight: 600, color: '#222222' }}>
            Ajoutez un lien vers votre profil en ligne
          </h2>

          <input
            type="text"
            value={websiteLink}
            onChange={(e) => setWebsiteLink(e.target.value)}
            placeholder="https://www.exemple.com"
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-sm focus:border-gray-900 focus:outline-none transition-colors mb-4"
            style={{ color: '#222222' }}
          />

          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setShowAddLinkModal(false);
                setShowTipsModal(true);
              }}
              className="text-sm hover:underline"
              style={{ color: '#222222', fontWeight: 600 }}
            >
              Découvrir nos conseils
            </button>
            <button
              onClick={() => setShowAddLinkModal(false)}
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
        <div className="border-t border-gray-200 px-8 py-6 flex justify-end">
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
            <div className="max-w-2xl w-full text-center">
              <h1 className="text-5xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                Ajoutez vos profils<br />en ligne
              </h1>
              
              <p className="text-base mb-12 max-w-xl mx-auto" style={{ color: '#717171' }}>
                Pour nous aider à confirmer vos compétences, ajoutez des liens vers vos commentaires, 
                les articles de presse que vous avez reçus et votre site web. Les voyageurs ne les verront pas.
              </p>

              {/* Social Icons */}
              <div className="flex justify-center gap-6 mb-12">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-200">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-200">
                  <svg className="w-10 h-10" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-200">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#FF1A1A">
                    <path d="M9.56 1.89C6.22 3.66 4 7.09 4 11c0 2.03.62 4.04 1.78 5.85l.02.03c.99 1.56 2.26 2.98 3.77 4.22l.02.02a34.8 34.8 0 0 0 2.38 1.73l.03.02L12 23l.02-.02.03-.02a34.8 34.8 0 0 0 2.38-1.73l.02-.02c1.51-1.24 2.78-2.66 3.77-4.22l.02-.03A9.955 9.955 0 0 0 20 11c0-3.91-2.22-7.34-5.56-9.11L12 .74l-2.44 1.15zM12 15c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                  </svg>
                </div>
              </div>

              {/* Add Profile Button */}
              <button
                onClick={() => setShowAddLinkModal(true)}
                className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Ajouter un profil
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-between items-center">
          <button
            onClick={() => onNavigate('annonces')}
            className="px-6 py-2 text-base hover:bg-gray-100 rounded-lg transition-colors"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Ignorer
          </button>
          <button
            onClick={() => onNavigate('annonces')}
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

  return null;
}