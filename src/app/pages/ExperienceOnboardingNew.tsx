import { useState, useEffect } from 'react';

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
      if (data.websiteLink) setWebsiteLink(data.websiteLink);
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
      distinction,
      websiteLink
    };
    localStorage.setItem('experienceOnboarding', JSON.stringify(dataToSave));
  }, [selectedCategory, selectedType, location, experienceYears, presentation, expertise, distinction, websiteLink]);

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

    const hasContent = presentation.trim().length > 0;

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
              className="px-6 py-2 rounded-lg text-sm transition-colors"
              style={{ 
                fontWeight: 600, 
                color: hasContent ? '#FFFFFF' : '#717171', 
                backgroundColor: hasContent ? '#222222' : '#F5F5F5',
                cursor: hasContent ? 'pointer' : 'default'
              }}
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

    const hasContent = expertise.trim().length > 0;

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
              className="px-6 py-2 rounded-lg text-sm transition-colors"
              style={{ 
                fontWeight: 600, 
                color: hasContent ? '#FFFFFF' : '#717171', 
                backgroundColor: hasContent ? '#222222' : '#F5F5F5',
                cursor: hasContent ? 'pointer' : 'default'
              }}
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

    const hasContent = distinction.trim().length > 0;

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
              className="px-6 py-2 rounded-lg text-sm transition-colors"
              style={{ 
                fontWeight: 600, 
                color: hasContent ? '#FFFFFF' : '#717171', 
                backgroundColor: hasContent ? '#222222' : '#F5F5F5',
                cursor: hasContent ? 'pointer' : 'default'
              }}
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

    const hasContent = websiteLink.trim().length > 0;

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
              className="px-6 py-2 rounded-lg text-sm transition-colors"
              style={{ 
                fontWeight: 600, 
                color: hasContent ? '#FFFFFF' : '#717171', 
                backgroundColor: hasContent ? '#222222' : '#F5F5F5',
                cursor: hasContent ? 'pointer' : 'default'
              }}
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
            <img
              src="/logo.png"
              alt="HOMIQIO Logo"
              className="w-[120px] h-auto"
            />
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

  // Continuer avec les autres étapes...
  // Pour la suite, je vais créer un deuxième fichier car c'est trop long
  
  return <div>Étapes en cours de construction...</div>;
}
