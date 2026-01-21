import { Heart, Share, Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ExperienceCard } from '../components/ExperienceCard';
import { ImageCarouselModal } from '../components/ImageCarouselModal';
import { useScroll } from '../hooks/ScrollContext';

interface ExperienceDetailsProps {
  onBack: () => void;
}

export function ExperienceDetails({ onBack }: ExperienceDetailsProps) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { isScrolled } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const images = [
    'https://images.unsplash.com/photo-1705535541638-8805ba0f64aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhbHltcGljJTIwYXRobGV0ZSUyMHRyYWluaW5nJTIwc25vd3xlbnwxfHx8fDE3Njc3NzYxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1529165980561-f19d4acc4f3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY29hY2glMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc3MTcyNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1620188500179-32ac33c60848?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlJTIwZ3ltJTIwd29ya291dCUyMHRyYWluaW5nfGVufDF8fHx8MTc2Nzc3NjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1763643425378-fecc79d33159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0cmFpbmluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3Njc3MjM1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  // Additional images for gallery
  const allGalleryImages = [
    ...images,
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB0cmFpbmluZyUyMHdvcmtvdXR8ZW58MXx8fHwxNzY3Nzc2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxneW0lMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzY3Nzc2MTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwdHJhaW5lciUyMGNvYWNofGVufDF8fHx8MTc2Nzc3NjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzfGVufDF8fHx8MTc2Nzc3NjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBleGVyY2lzZXxlbnwxfHx8fDE3Njc3NzYxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  const programItems = [
    {
      image: 'https://images.unsplash.com/photo-1705535541638-8805ba0f64aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJhbHltcGljJTIwYXRobGV0ZSUyMHRyYWluaW5nJTIwc25vd3xlbnwxfHx8fDE3Njc3NzYxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Retrouvez-moi à la salle de sport',
      description: 'Fraîchement sorti des épreuves de snowboard cross paralympique, je commencerai à me préparer pour le banked slalom.'
    },
    {
      image: 'https://images.unsplash.com/photo-1620188500179-32ac33c60848?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlJTIwZ3ltJTIwd29ya291dCUyMHRyYWluaW5nfGVufDF8fHx8MTc2Nzc3NjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Échauffement et mobilité',
      description: 'Après quelques étirements, snowboard en direction les vélos d\'intérieur : un peu de cardio pour se réveiller !'
    },
    {
      image: 'https://images.unsplash.com/photo-1763643425378-fecc79d33159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0cmFpbmluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3Njc3MjM1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Développez vos réflexes',
      description: 'Dans ma discipline, la vitesse est primordiale. Nous travaillerons votre temps de réaction avec des balles d\'agilité.'
    },
    {
      image: 'https://images.unsplash.com/photo-1620188500179-32ac33c60848?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlJTIwZ3ltJTIwd29ya291dCUyMHRyYWluaW5nfGVufDF8fHx8MTc2Nzc3NjE2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Mettez votre équilibre à l\'épreuve',
      description: 'Montez sur la planche d\'instabilité, puis essayez-vous aux squats sur un ballon de gym. Trouvez votre point d\'équilibre.'
    },
    {
      image: 'https://images.unsplash.com/photo-1763643425378-fecc79d33159?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0cmFpbmluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3Njc3MjM1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Retentissez le rythme',
      description: 'Direction la salle de musculation pour un entraînement complet du corps avec poids et haltères.'
    }
  ];

  const openCarousel = (index: number) => {
    setCarouselStartIndex(index);
    setShowCarousel(true);
  };

  return (
    <>
      {/* Image Carousel Modal */}
      <ImageCarouselModal
        images={allGalleryImages}
        isOpen={showCarousel}
        initialIndex={carouselStartIndex}
        onClose={() => setShowCarousel(false)}
        showFavorite={true}
        isFavorite={isFavorite}
        onFavoriteToggle={() => setIsFavorite(!isFavorite)}
      />

      {/* Mobile Header - Fixed White Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="font-semibold text-sm">
           Milan · Sports
        </div>

        <div className="flex gap-2 -mr-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Share className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Desktop Header - Standard Airbnb Header with Scroll Behavior */}
      <div className="hidden md:block bg-white sticky top-0 z-50">
        <Header currentPage="experiences" onNavigate={onBack} isScrolled={isScrolled} />
      </div>

      <div className="bg-white pt-16 md:pt-0">
        {/* Hero Section - Photo Grid + Info */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-20 pt-6 md:pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Photo Grid (2x2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-auto md:h-[600px] col-span-2 relative">
              {/* Mobile: 2x2 Grid */}
              <div className="md:hidden grid grid-cols-2 gap-2 w-full rounded-2xl overflow-hidden aspect-square">
                 {images.slice(0, 4).map((img, index) => (
                   <div key={index} className="relative h-full w-full" onClick={() => openCarousel(index)}>
                     <img src={img} alt={`Experience ${index + 1}`} className="w-full h-full object-cover" />
                     {index === 3 && (
                       <div className="absolute bottom-2 right-2">
                         <button className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                           </svg>
                         </button>
                       </div>
                     )}
                   </div>
                 ))}
              </div>

              {/* Desktop: Grid */}
              <div className="hidden md:block cursor-pointer rounded-tl-3xl overflow-hidden" onClick={() => openCarousel(0)}>
                <img src={images[0]} alt="Experience 1" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block cursor-pointer rounded-tr-3xl overflow-hidden" onClick={() => openCarousel(1)}>
                <img src={images[1]} alt="Experience 2" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block cursor-pointer rounded-bl-3xl overflow-hidden" onClick={() => openCarousel(2)}>
                <img src={images[2]} alt="Experience 3" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block cursor-pointer rounded-br-3xl overflow-hidden relative group" onClick={() => openCarousel(3)}>
                <img src={images[3]} alt="Experience 4" className="w-full h-full object-cover" />
                {/* Show all photos overlay button */}
                <button className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 600 }}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16" stroke="currentColor">
                    <rect x="2" y="2" width="5" height="5" strokeWidth="1.5" />
                    <rect x="9" y="2" width="5" height="5" strokeWidth="1.5" />
                    <rect x="2" y="9" width="5" height="5" strokeWidth="1.5" />
                    <rect x="9" y="9" width="5" height="5" strokeWidth="1.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right: Title and Info */}
            <div className="flex flex-col items-center justify-center px-4 md:px-0 lg:px-8 pt-4 md:pt-0">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl text-center lg:text-center mb-4" style={{ fontWeight: 600, lineHeight: '1.2' }}>
                Récupérez comme un athlète olympique avec Neville Wright
              </h1>

              {/* Description */}
              <p className="text-sm text-gray-700 text-center lg:text-center mb-4 leading-relaxed">
                Apprenez à optimiser votre récupération avec le thérapeute spécialisé dans la récupération d'3 fois athlète olympique. Bénéficiez d'un coaching pratique avant de le rejoindre pour un défi mental avec bain de glace.
              </p>

              {/* Badge - Tout est automatiquement */}
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center gap-2 text-xs text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>Traduit automatiquement</span>
                </div>
              </div>

              {/* Location buttons */}
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-6">
                <button className="px-3 py-1.5 text-xs hover:border-gray-600 transition-colors border border-transparent hover:border-black rounded" style={{ fontWeight: 600 }}>
                  Milan
                </button>
                <button className="px-3 py-1.5 text-xs hover:border-gray-600 transition-colors border border-transparent hover:border-black rounded" style={{ fontWeight: 600 }}>
                  Italie
                </button>
              </div>

              {/* Share and Save icons - Desktop Only */}
              <div className="hidden md:flex items-center gap-4 justify-center lg:justify-start mb-4">
                <button className="flex items-center gap-2 text-sm hover:bg-gray-100 p-2 rounded-lg transition-colors">
                  <Share className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex items-center gap-2 text-sm hover:bg-gray-100 p-2 rounded-lg transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Host Info */}
              <div className="pt-6 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1529165980561-f19d4acc4f3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY29hY2glMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc3MTcyNjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Host Neville"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm" style={{ fontWeight: 600 }}>Hôte : Neville</p>
                    <p className="text-xs text-gray-600">Trois fois athlète olympique pour le Canada</p>
                  </div>
                </div>

                {/* Info bullets */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm" style={{ fontWeight: 600 }}>Conseil 7 Gym & Spa</p>
                      <p className="text-xs text-gray-600">Milan, l'l'enfante</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm" style={{ fontWeight: 600 }}>Trois fois badour olympique</p>
                      <p className="text-xs text-gray-600">Jeux Olympiques d'hiver de 2010, 2014 et 2018</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3">
              {/* Title and Description - REMOVED (now in hero) */}

              {/* Share and Save Buttons - REMOVED (now in hero) */}

              {/* Host Section - REMOVED (now in hero) */}

              {/* Program Section */}
              <div className="py-8 border-b border-gray-200">
                <h3 className="text-[22px] mb-6" style={{ fontWeight: 600 }}>Au programme</h3>
                
                <div className="space-y-6">
                  {programItems.map((item, index) => (
                    <div key={index} className="flex gap-4 pr-16">
                      <img 
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-base mb-1" style={{ fontWeight: 600 }}>{item.title}</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meeting Point Section */}
              <div className="py-8 border-b border-gray-200">
                <h3 className="text-[22px] mb-6" style={{ fontWeight: 600 }}>Lieu de rendez-vous</h3>
                
                {/* Location Name and Address */}
                <div className="mb-4">
                  <p className="text-base mb-1" style={{ fontWeight: 600 }}>Ceresio 7 Gym & Spa</p>
                  <p className="text-base text-gray-600">20154, Milan, Lombardie, Italie</p>
                </div>

                {/* Map */}
                <div className="relative w-full h-[420px] rounded-3xl overflow-hidden bg-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d178420.37564876517!2d9.0406854!3d45.4642035!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4786c1493f1275e7%3A0x3cffcd13c6740e8d!2sMilan%2C%20Italie!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: '1.5rem' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              {/* More Experiences Section */}
              <div className="py-8 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[26px]" style={{ fontWeight: 600 }}>Milan : plus d'expériences</h3>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-900 hover:shadow-md transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:border-gray-900 hover:shadow-md transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Experiences Grid with ExperienceCard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ExperienceCard
                    image="https://images.unsplash.com/photo-1557480091-8b815bba4064?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZWxhdG8lMjBpY2UlMjBjcmVhbSUyMGl0YWx5fGVufDF8fHx8MTc2Nzg4MzE4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    title="Le secret des glaces et des pâtes fraîches dans une mais..."
                    host="Cuisine · 3 heures"
                    price="À partir de 69 € par voyageur"
                    rating={4.89}
                  />
                  
                  <ExperienceCard
                    image="https://images.unsplash.com/photo-1714836403365-6659229f4d53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5lJTIwdGFzdGluZyUyMHNvbW1lbGllcnxlbnwxfHx8fDE3Njc4ODMxODl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    title="Dégustation de vin avec le sommelier le plus italien de..."
                    host="Dégustations · 2 heures"
                    price="À partir de 49 € par voyageur"
                    rating={4.95}
                  />
                  
                  <ExperienceCard
                    image="https://images.unsplash.com/photo-1714681480721-591a8d8475f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxhbiUyMHBvcnRhJTIwdmVuZXppYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3Njc4ODMxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    title="Découvrez les trésors cachés de Porta Venezia"
                    host="Visites culturelles · 2 heures"
                    price="À partir de 25 € par voyageur"
                    rating={4.97}
                  />
                  
                  <ExperienceCard
                    image="https://images.unsplash.com/photo-1720247521914-c12c3bd3a3c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwY2FyJTIwbWlsYW4lMjBpdGFseXxlbnwxfHx8fDE3Njc4ODMxOTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    title="Explorez Milan en vintage embl..."
                    host="Visites culturelles"
                    price="À partir de 129 € par voyageur"
                    rating={4.85}
                  />
                </div>
              </div>

              {/* About Host Section */}
              <div className="py-8 border-b border-gray-200">
                <h3 className="text-[22px] mb-8" style={{ fontWeight: 600 }}>À propos de moi</h3>
                
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                  {/* Left Column - Host Info */}
                  <div className="flex flex-col items-center shadow-lg rounded-3xl mb-6 py-6 px-3">
                    {/* Host Photo */}
                    <img 
                      src="https://images.unsplash.com/photo-1529165980561-f19d4acc4f3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwY29hY2glMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc3MTcyNjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Neville"
                      className="w-24 h-24 rounded-full object-cover mb-4"
                    />
                    
                    {/* Host Name */}
                    <h4 className="text-[22px] mb-2" style={{ fontWeight: 600 }}>Neville</h4>
                    
                    {/* Host Subtitle */}
                    <p className="text-sm text-gray-600 mb-6 text-center">
                      Trois fois athlète olympique pour le Canada
                    </p>
                    
                  </div>
                    {/* Contact Button */}
                    <button className="w-full px-6 py-3 bg-gray-100 rounded-xl text-sm mb-4" style={{ fontWeight: 600 }}>
                      Envoyer un message à Neville
                    </button>
                    
                    {/* Security Note */}
                    <p className="text-xs text-gray-600 max-w-[280px] text-center lg:text-left leading-relaxed">
                      Afin de protéger votre paiement, utilisez toujours HOMIQIO pour envoyer de l'argent et communiquer avec les hôtes.
                    </p>
                  </div>
                  {/* Right Column - Bio */}
                  <div>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      J'ai participé trois fois aux Jeux Olympiques, je suis spécialiste de la performance, coach et mentor, et j'ai représenté le Canada au sein des équipes nationales d'athlétisme et de bobsleigh pendant 15 ans. En tant que conférencier, j'inspire également les autres à trouver leur propre chemin vers la réussite. Mon parcours n'a pas été sans difficultés, et je sais par expérience à quel point le travail et la persévérance sont essentiels pour atteindre ses objectifs. Je me réjouis de pouvoir transmettre mon approche au monde du sport et au-delà, vous y compris, lors des Jeux Olympiques de Milano Cortina 2026.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card (Sticky) */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="border border-gray-200 rounded-xl shadow-lg p-6 bg-white">
                  {/* Header: Price and CTA Button */}
                  <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-base text-gray-900" style={{ fontWeight: 600 }}> À partir de 26 €</span>
                        <span className="text-gray-600 text-xs">par voyageur</span>
                      </div>
                      <p className="text-xs" style={{ color: '#059669', fontWeight: 600 }}>
                        Annulation gratuite
                      </p>
                    </div>
                    <button className="px-6 py-3 rounded-full text-white text-base hover:shadow-lg transition-all whitespace-nowrap" style={{ backgroundColor: '#000000', fontWeight: 600 }}>
                      Voir les dates
                    </button>
                  </div>

                  {/* Date Items List */}
                  <div className="space-y-3 mb-4">
                    {/* Date 1 */}
                    <div className="border border-gray-300 rounded-xl p-4 hover:border-gray-900 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                            mercredi 11 février
                          </p>
                          <p className="text-xs text-gray-600">14:30 – 17:00</p>
                        </div>
                        <p className="text-xs" style={{ color: '#059669', fontWeight: 600 }}>
                          3 places disponibles
                        </p>
                      </div>
                    </div>

                    {/* Date 2 */}
                    <div className="border border-gray-300 rounded-xl p-4 hover:border-gray-900 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                            jeudi 12 février
                          </p>
                          <p className="text-xs text-gray-600">14:30 – 17:00</p>
                        </div>
                        <p className="text-xs" style={{ color: '#059669', fontWeight: 600 }}>
                          7 places disponibles
                        </p>
                      </div>
                    </div>

                    {/* Date 3 */}
                    <div className="border border-gray-300 rounded-xl p-4 hover:border-gray-900 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                            vendredi 13 février
                          </p>
                          <p className="text-xs text-gray-600">14:30 – 17:00</p>
                        </div>
                        <p className="text-xs" style={{ color: '#059669', fontWeight: 600 }}>
                          4 places disponibles
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Show all dates link */}
                  <div className="text-center pt-2">
                    <button className="text-base text-gray-600 hover:text-gray-900 transition-colors">
                      Afficher toutes les dates
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Things to Know Section - Full Width Outside Grid */}
        <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 py-12 rounded-bl-4xl rounded-br-4xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]">
          {/* <div className="inset-0 bg-[#F7F7F7]"></div> */}
          <h3 className="text-[22px] mb-8" style={{ fontWeight: 600 }}>À savoir</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Item 1 - Critères pour les voyageurs */}
            <div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <h4 className="text-base mb-2" style={{ fontWeight: 600 }}>Critères pour les voyageurs</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Les voyageurs âgés de 13 ans et plus peuvent participer.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 2 - Niveau d'activité physique */}
            <div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h4 className="text-base mb-2" style={{ fontWeight: 600 }}>Niveau d'activité physique</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Cette expérience implique un niveau d'activité modéré et exige un niveau de compétence débutant.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 3 - À prévoir */}
            <div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h4 className="text-base mb-2" style={{ fontWeight: 600 }}>À prévoir</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Une pièce d'identité (carte d'identité, passeport ou permis de conduire valide) sera requise à l'arrivée. Vêtements de sport. Chaussures de course ou de sport, bouteille d'eau.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 4 - Accessibilité */}
            <div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <div>
                  <h4 className="text-base mb-2" style={{ fontWeight: 600 }}>Accessibilité</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Accès de plain-pied. Entrées d'une largeur supérieure à 81 cm. Toilettes de plain-pied disponibles. Place de stationnement réservée disponible. Surface plane et stable dans principalement plat ou régulier. Espace de repos et de calme disponible. Pas de stimuli sensoriels extrêmes.{' '}
                    <button className="text-sm underline" style={{ fontWeight: 600 }}>
                      En savoir plus
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Item 5 - Conditions d'annulation */}
            <div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <h4 className="text-base mb-2" style={{ fontWeight: 600 }}>Conditions d'annulation</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Annulez au moins 3 jours avant le début pour obtenir un remboursement intégral.
                  </p>
                </div>
              </div>
            </div>

            {/* Item 6 - Jacopo accueille des voyageurs en tant que particulier */}
            <div>
              <div className="flex items-start gap-4">
                <svg className="w-6 h-6 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <div>
                  <h4 className="text-base mb-2" style={{ fontWeight: 600 }}>Jacopo accueille des voyageurs en tant que particulier</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    L'hôte est responsable de cette expérience.{' '}
                    <button className="text-sm underline" style={{ fontWeight: 600 }}>
                      En savoir plus
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HOMIQIO Originals Section */}
        <div className="bg-[#F7F7F7] py-16 -mt-10">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20">
            <div className="max-w-3xl mx-auto text-center">
              {/* Feather Icon */}
              <div className="flex justify-center mb-8">
                <img 
                  src="https://images.unsplash.com/photo-1649372306972-ffb288a9d681?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBmZWF0aGVyJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc2Nzc4NDM0MXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="HOMIQIO Originals"
                  className="w-16 h-16 object-contain"
                />
              </div>
              
              {/* Title */}
              <h2 className="text-[28px] md:text-[32px] leading-tight mb-4" style={{ fontWeight: 600 }}>
                Les expériences HOMIQIO Originals sont conçues pour HOMIQIO
              </h2>
              
              {/* Description */}
              <p className="text-base text-gray-700 leading-relaxed">
                HOMIQIO Originals : des expériences sélectionnées pour leur qualité et proposées par des hôtes d'exception.{' '}
                <button className="underline" style={{ fontWeight: 600 }}>
                  En savoir plus
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Report Link */}
        <div className="bg-white py-6 border-b border-gray-200">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-20 text-center">
            <p className="text-sm text-gray-600">
              Vous avez rencontré un problème ?{' '}
              <button className="underline hover:text-gray-900 transition-colors">
                Signaler cette annonce
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}