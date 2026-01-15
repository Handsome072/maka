import { Heart, Share, Star, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { ImageCarouselModal } from '../components/ImageCarouselModal';

interface PropertyDetailsProps {
  onBack: () => void;
  onBook?: (data: any) => void;
}

export function PropertyDetails({ onBack, onBook }: PropertyDetailsProps) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1737305457496-dc7503cdde1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkaW8lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njc3NjY1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1612419299101-6c294dc2901d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYXBhcnRtZW50JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3Njc2ODYxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1737467016100-68cd7759d93c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBiZWRyb29tJTIwY29tZm9ydGFibGV8ZW58MXx8fHwxNzY3NzY2NTU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1597497522150-2f50bffea452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwYXBhcnRtZW50fGVufDF8fHx8MTc2NzczMDQyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1757439402224-56c48352f719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMGFwYXJ0bWVudCUyMG1vZGVybnxlbnwxfHx8fDE3Njc3NjY1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc2NzgwNjkyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1650338031185-1e97add7a389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwcGF0aW8lMjBnYXJkZW58ZW58MXx8fHwxNzY3ODI1MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1696774276390-6ce82111140f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwc3BhY2V8ZW58MXx8fHwxNzY3ODI4Nzc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1682888818696-906287d759f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzaG93ZXIlMjBiYXRocm9vbXxlbnwxfHx8fDE3Njc4NzQ5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1758448511533-e1502259fff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBlbnRyYW5jZSUyMGhhbGx3YXl8ZW58MXx8fHwxNzY3ODc0OTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  ];

  const openCarousel = (index: number) => {
    setCarouselStartIndex(index);
    setShowCarousel(true);
  };

  return (
    <>
      {/* Image Carousel Modal */}
      <ImageCarouselModal
        images={images}
        isOpen={showCarousel}
        initialIndex={carouselStartIndex}
        onClose={() => setShowCarousel(false)}
        showFavorite={true}
        isFavorite={isFavorite}
        onFavoriteToggle={() => setIsFavorite(!isFavorite)}
      />

      {/* Header */}
      <Header currentPage="logements" onNavigate={onBack} isScrolled={true} />

      {/* Main Content */}
      <div className="bg-white min-h-screen">
        {/* Title and Actions Section */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 pt-6">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>
              Studio aux Portes de Paris
            </h1>
            <div className="flex items-center gap-4">
              {/* Partager Button */}
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors">
                <Share className="w-4 h-4" />
                <span className="text-sm underline" style={{ fontWeight: 600 }}>Partager</span>
              </button>
              {/* Enregistrer Button */}
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#10B981] text-[#10B981]' : ''}`} />
                <span className="text-sm underline" style={{ fontWeight: 600 }}>Enregistrer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[300px] md:h-[400px] relative">
            {/* Large image */}
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden">
              <img
                src={images[0]}
                alt="Property main"
                className="w-full h-full object-cover cursor-pointer transition-all"
                onClick={() => openCarousel(0)}
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
            </div>

            {/* Small images */}
            {images.slice(1, 5).map((img, index) => (
              <div key={index} className="hidden md:block relative group overflow-hidden">
                <img
                  src={img}
                  alt={`Property ${index + 2}`}
                  className="w-full h-full object-cover cursor-pointer transition-all"
                  onClick={() => openCarousel(index + 1)}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"></div>
              </div>
            ))}

            {/* Show all photos button */}
            <button
              onClick={() => openCarousel(0)}
              className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg border border-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2"
              style={{ fontWeight: 600, fontSize: '14px' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 3h4v4H3V3zm6 0h4v4H9V3zM3 9h4v4H3V9zm6 0h4v4H9V9z" />
              </svg>
              Afficher toutes les photos
            </button>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-12 pb-16">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Property Info Section */}
              <div className="pb-6 border-b border-gray-200">
                <h2 className="text-xl md:text-2xl mb-2" style={{ fontWeight: 600 }}>
                  Superbe studio de 15m² au calme tout confort
                </h2>
                <div className="flex items-center gap-1 text-sm">
                  <span>Logement entier : appartement</span>
                  <span className="text-gray-400">·</span>
                  <span>Paris, France</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span>2 voyageurs</span>
                  <span className="text-gray-400">·</span>
                  <span>1 chambre</span>
                  <span className="text-gray-400">·</span>
                  <span>2 lits</span>
                  <span className="text-gray-400">·</span>
                  <span>1 salle de bain</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mt-8">
                <div className="flex gap-8">
                  {['Photos', 'Équipements', 'Commentaires', 'Emplacement'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`pb-4 text-sm transition-colors ${
                        activeTab === tab.toLowerCase()
                          ? 'border-b-2 border-gray-900'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Badges Section */}
              <div className="py-8 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Coup de coeur */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="text-3xl">🏅</div>
                    </div>
                    <div>
                      <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>
                        Coup de cœur voyageurs
                      </h3>
                      <p className="text-sm text-gray-600">
                        Un des logements les plus appréciés sur HOMIQIO
                      </p>
                    </div>
                  </div>

                  {/* Un des logements préférés */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="text-3xl">✨</div>
                    </div>
                    <div>
                      <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>
                        Un des logements préférés des voyageurs sur HOMIQIO
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                        <span className="text-sm" style={{ fontWeight: 600 }}>4,96</span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="text-3xl">💬</div>
                    </div>
                    <div>
                      <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>26</h3>
                      <p className="text-sm text-gray-600">Commentaires</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Host Section */}
              <div className="py-8 border-b border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl" style={{ fontWeight: 600 }}>
                    J
                  </div>
                  <div>
                    <h3 className="text-base" style={{ fontWeight: 600 }}>Hôte : Jérémy</h3>
                    <p className="text-sm text-gray-600">4 mois d'expérience en tant qu'hôte</p>
                  </div>
                </div>
              </div>

              {/* Property Highlights */}
              <div className="py-8 border-b border-gray-200 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="text-2xl">🏆</div>
                  </div>
                  <div>
                    <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>
                      Ce logement fait partie des 10 % de logements préférés sur HOMIQIO
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ce logement est très bien classé, d'après ses évaluations, ses commentaires et la fiabilité de l'hôte pour répondre aux questions des voyageurs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>
                      Procédure d'arrivée exceptionnelle
                    </h3>
                    <p className="text-sm text-gray-600">
                      Les voyageurs récents ont attribué 5 étoiles à la procédure d'arrivée.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base mb-1" style={{ fontWeight: 600 }}>
                      Annulation gratuite avant le 2 avril
                    </h3>
                    <p className="text-sm text-gray-600">
                      Obtenez un remboursement intégral si vous changez d'avis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="py-8 border-b border-gray-200">
                <div className="text-base leading-relaxed text-gray-900">
                  <p className={showFullDescription ? '' : 'line-clamp-4'}>
                    Bienvenue dans ce studio cosy de 15m², entièrement refait à neuf et pensé pour votre confort. Vous y trouverez une pièce lumineuse, une cuisine équipée donnant sur cour, double vitrage pour le calme, salle de bain pratique et toilettes privatives sur le palier. L'immeuble est paisible et agréable. Les photos montrent chaque détail pour préparer votre séjour. Je reste disponible avec plaisir pour répondre à vos questions et vous accompagner.
                  </p>
                  {!showFullDescription && (
                    <button
                      onClick={() => setShowFullDescription(true)}
                      className="text-sm mt-2 underline" 
                      style={{ fontWeight: 600 }}
                    >
                      Lire la suite
                    </button>
                  )}
                </div>

                {showFullDescription && (
                  <>
                    <h3 className="text-xl mt-8 mb-4" style={{ fontWeight: 600 }}>Le logement...</h3>
                    <p className="text-base leading-relaxed text-gray-900">
                      Ce studio confortable dispose de tout le nécessaire pour passer un agréable séjour. La pièce principale est lumineuse et bien aménagée. La cuisine est entièrement équipée avec réfrigérateur, plaques de cuisson, micro-ondes et tous les ustensiles nécessaires. La salle de bain moderne comprend une douche, un lavabo et des rangements. Le logement est situé dans un quartier calme et bien desservi par les transports en commun.
                    </p>
                  </>
                )}
              </div>

              {/* Where you'll sleep */}
              <div className="py-8 border-gray-200">
                <h3 className="text-xl mb-6" style={{ fontWeight: 600 }}>Où vous dormirez</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl">
                    <img src={images[2]} alt="Bedroom 1" className="w-full h-64 object-cover rounded-lg mb-4" />
                    <h4 className="text-base" style={{ fontWeight: 600 }}>Chambre</h4>
                    <p className="text-sm text-gray-600 mt-1">1 lit double</p>
                  </div>
                  <div className="rounded-xl">
                    <img src={images[1]} alt="Bedroom 2" className="w-full h-64 object-cover rounded-lg mb-4" />
                    <h4 className="text-base" style={{ fontWeight: 600 }}>Espace commun</h4>
                    <p className="text-sm text-gray-600 mt-1">1 canapé-lit</p>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              {/* <div className="py-8">
                <p className="text-sm text-gray-600">
                  Certaines informations ont été traduites automatiquement.
                </p>
                <button className="text-sm underline mt-2" style={{ fontWeight: 600 }}>
                  Afficher le texte d'origine
                </button>
              </div> */}

              {/* Ce que propose ce logement */}
              <div className="py-8 border-t border-gray-200">
                <h3 className="text-xl mb-6" style={{ fontWeight: 600 }}>Ce que propose ce logement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Amenities list */}
                  <div className="flex items-center gap-4 py-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h4l3 9 4-18 3 9h4" />
                    </svg>
                    <span className="text-base">Cuisine</span>
                  </div>

                  <div className="flex items-center gap-4 py-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                    <span className="text-base">Wifi</span>
                  </div>

                  <div className="flex items-center gap-4 py-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-base">Télévision</span>
                  </div>

                  <div className="flex items-center gap-4 py-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    <span className="text-base">Sèche-cheveux</span>
                  </div>

                  <div className="flex items-center gap-4 py-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-base">Espace de travail dédié</span>
                  </div>

                  <div className="flex items-center gap-4 py-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base">Animaux acceptés</span>
                  </div>

                  <div className="flex items-center gap-4 py-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-base">Réfrigérateur</span>
                  </div>

                  <div className="flex items-center gap-4 py-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-base">Four à micro-ondes</span>
                  </div>

                  <div className="flex items-center gap-4 py-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <line x1="18" y1="6" x2="6" y2="18" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base line-through text-black">Détecteur de monoxyde de carbone</span>
                  </div>

                  <div className="flex items-center gap-4 py-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <line x1="18" y1="6" x2="6" y2="18" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <span className="text-base line-through text-black">Détecteur de fumée</span>
                  </div>
                </div>

                <button className="mt-6 px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-300 transition-colors text-base" style={{ fontWeight: 600 }}>
                  Afficher les 24 équipements
                </button>
              </div>

              {/* 2 nuits à Paris - Calendar Section */}
              <div className="py-8 border-t border-gray-200">
                <h3 className="text-xl mb-2" style={{ fontWeight: 600 }}>2 nuits à Paris</h3>
                <p className="text-sm text-gray-600 mb-6">3 avr. 2026 - 5 avr. 2026</p>

                {/* Calendar */}
                <div className="border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="flex gap-12">
                      <h4 className="text-base" style={{ fontWeight: 600 }}>Avril 2026</h4>
                      <h4 className="text-base" style={{ fontWeight: 600 }}>Mai 2026</h4>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                    {/* April Calendar */}
                    <div>
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                          <div key={i} className="text-center text-xs text-gray-600 py-2" style={{ fontWeight: 600 }}>
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {[null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((day, i) => (
                          <div
                            key={i}
                            className={`aspect-square flex items-center justify-center text-sm ${
                              day === 3 || day === 5
                                ? 'bg-gray-900 text-white rounded-full'
                                : day === 4
                                ? 'bg-gray-200'
                                : day
                                ? 'hover:bg-gray-100 rounded-full cursor-pointer'
                                : ''
                            }`}
                          >
                            {day || ''}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* May Calendar */}
                    <div>
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                          <div key={i} className="text-center text-xs text-gray-600 py-2" style={{ fontWeight: 600 }}>
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {[null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day, i) => (
                          <div
                            key={i}
                            className={`aspect-square flex items-center justify-center text-sm ${
                              day ? 'hover:bg-gray-100 rounded-full cursor-pointer' : ''
                            }`}
                          >
                            {day || ''}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-2 mt-6 pt-6 border-t border-gray-200">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <button className="text-sm underline" style={{ fontWeight: 600 }}>
                      Effacer les dates
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Reservation Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="border border-gray-200 rounded-2xl p-6 shadow-xl">
                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl" style={{ fontWeight: 600 }}>$199</span>
                    <span className="text-base text-gray-600">pour 2 nuits</span>
                  </div>

                  {/* Rare badge */}
                  <div className="flex items-start gap-2 mb-6 p-3 bg-green-50 rounded-lg">
                    <div className="text-green-600 mt-0.5">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm" style={{ fontWeight: 600 }}>
                        Perle rare ! Les réservations pour ce logement sont fréquentes.
                      </p>
                    </div>
                  </div>

                  {/* Date inputs */}
                  <div className="border border-gray-300 rounded-lg mb-4">
                    <div className="grid grid-cols-2 divide-x divide-gray-300">
                      <div className="p-3">
                        <label className="text-xs block mb-1" style={{ fontWeight: 600 }}>ARRIVÉE</label>
                        <input type="text" value="03/04/2026" readOnly className="text-sm w-full outline-none" />
                      </div>
                      <div className="p-3">
                        <label className="text-xs block mb-1" style={{ fontWeight: 600 }}>DÉPART</label>
                        <input type="text" value="05/04/2026" readOnly className="text-sm w-full outline-none" />
                      </div>
                    </div>
                    <div className="border-t border-gray-300 p-3">
                      <label className="text-xs block mb-1" style={{ fontWeight: 600 }}>VOYAGEURS</label>
                      <button className="text-sm w-full text-left flex items-center justify-between">
                        <span>1 voyageur</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Reserve button */}
                  <button
                    onClick={() => onBook?.({
                      title: "Superbe studio de 15m² au calme tout confort",
                      image: images[0],
                      rating: 4.96,
                      location: "Coup de cœur voyageurs",
                      checkIn: "3-4",
                      checkOut: "avr. 2026",
                      guests: 1,
                      nights: 2,
                      pricePerNight: 87.56
                    })}
                    className="w-full py-3 rounded-full text-white text-base mb-4 transition-colors hover:opacity-90"
                    style={{
                      fontWeight: 600,
                      backgroundColor: '#000000'
                    }}
                  >
                    Réserver
                  </button>

                  <p className="text-center text-sm text-gray-600 mb-4">
                    Aucun montant ne vous sera débité pour le moment
                  </p>

                  {/* Cancellation policy */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Annulation gratuite avant le <span style={{ fontWeight: 600 }}>2 avril</span>
                    </p>
                  </div>

                  {/* Report listing */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button className="flex items-center gap-2 text-sm underline mx-auto">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      Signaler cette annonce
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Full Width */}
        <div className="max-w-[1280px] border-t border-gray-200 py-16 mx-auto px-4 sm:px-6 lg:px-20">
          {/* Hero Rating */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-6xl">🏅</span>
              <h2 className="text-7xl" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>4,96</h2>
              <span className="text-6xl">🏅</span>
            </div>
            <h3 className="text-2xl mb-3" style={{ fontWeight: 600 }}>Coup de cœur voyageurs</h3>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Ce logement fait partie des <span style={{ fontWeight: 600 }}>10 % de logements préférés</span> sur HOMIQIO parmi les logements éligibles, à partir des évaluations, des commentaires et de la fiabilité des annonces selon les voyageurs.
            </p>
          </div>

          {/* Rating Breakdown */}
          <div className="grid grid-cols-7 gap-4 pb-8 mb-12 border-b border-gray-200">
            {/* Evaluation globale */}
            <div>
              <p className="text-sm mb-3" style={{ fontWeight: 600 }}>Évaluation globale</p>
                <div className="">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-2">{rating}</span>
                      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-900 rounded-full"
                          style={{ width: rating === 5 ? '95%' : rating === 4 ? '5%' : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Individual ratings */}
            {[
              { label: 'Propreté', rating: 4.9 },
              { label: 'Précision', rating: 4.9 },
              { label: 'Arrivée', rating: 5.0 },
              { label: 'Communication', rating: 5.0 },
              { label: 'Emplacement', rating: 4.7 },
              { label: 'Qualité-prix', rating: 4.9 }
            ].map((item, index) => (
              <div key={index} className="flex flex-col justify-between border-l border-gray-200 pl-6 h-24">
                <div>
                  <p className="text-sm mb-1" style={{ fontWeight: 600 }}>{item.label}</p>
                  <p className="text-lg" style={{ fontWeight: 600 }}>{item.rating}</p>
                </div>
                {/* Icon */}
                <div className="w-6 h-6 text-gray-700">
                  {index === 0 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-3.694 9 8.25z" />
                    </svg>
                  )}
                  {index === 4 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  )}
                  {index === 5 && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Review 1 */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg" style={{ fontWeight: 600 }}>
                  K
                </div>
                <div>
                  <h4 className="text-base" style={{ fontWeight: 600 }}>Kai</h4>
                  <p className="text-sm text-gray-600">10 ans sur HOMIQIO</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">· Il y a 2 jours · Séjour de quelques nuits</span>
              </div>
              <p className="text-base text-gray-900 leading-relaxed mb-3">
                J'ai passé trois jours très agréables dans l'appartement de Jérémy. L'appartement est petit mais super confortable, situé au centre et bien desservi par le métro. Les toilettes sont ...
              </p>
              <button className="text-sm underline" style={{ fontWeight: 600 }}>Lire la suite</button>
            </div>

            {/* Review 2 */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full flex items-center justify-center text-white text-lg" style={{ fontWeight: 600 }}>
                  E
                </div>
                <div>
                  <h4 className="text-base" style={{ fontWeight: 600 }}>Emil</h4>
                  <p className="text-sm text-gray-600">2 ans sur HOMIQIO</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">· Il y a 1 semaine · Séjour de quelques nuits</span>
              </div>
              <p className="text-base text-gray-900 leading-relaxed mb-3">
                J'ai vraiment apprécié mon séjour chez Jeremy. L'appartement était propre, confortable et exactement conforme à la description. Tout a parfaitement fonctionné, e...
              </p>
              <button className="text-sm underline" style={{ fontWeight: 600 }}>Lire la suite</button>
            </div>

            {/* Review 3 */}
            <div className="border-b border-gray-200 pb-8 md:border-b-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-lg" style={{ fontWeight: 600 }}>
                  V
                </div>
                <div>
                  <h4 className="text-base" style={{ fontWeight: 600 }}>Vanessa</h4>
                  <p className="text-sm text-gray-600">8 ans sur HOMIQIO</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">· Il y a 2 semaines · Séjour de quelques nuits</span>
              </div>
              <p className="text-base text-gray-900 leading-relaxed mb-3">
                Jeremy est un hôte très sympathique, qui nous réserve un très bon accueil. L'appartement est joliment décoré et très propre....
              </p>
              <button className="text-sm underline" style={{ fontWeight: 600 }}>Lire la suite</button>
            </div>

            {/* Review 4 */}
            <div className="pb-8 md:pb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white text-lg" style={{ fontWeight: 600 }}>
                  M
                </div>
                <div>
                  <h4 className="text-base" style={{ fontWeight: 600 }}>Marie</h4>
                  <p className="text-sm text-gray-600">13 ans sur HOMIQIO</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 fill-current" />
                ))}
                <span className="text-sm text-gray-600 ml-2">· Il y a 5 jours · Séjour de quelques nuits</span>
              </div>
              <p className="text-base text-gray-900 leading-relaxed mb-3">
                Jeremy nous a accueilli chaleureusement, les échanges avec lui ont été sympathique et réactif. L'appartement est très propre et bien situé. Je recommande vivement !
              </p>
              <button className="text-sm underline" style={{ fontWeight: 600 }}>Lire la suite</button>
            </div>
          </div>

          {/* Show all reviews button */}
          <div className="text-center flex self-start">
            <button className="px-6 py-3 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-base" style={{ fontWeight: 600 }}>
              Afficher les 26 commentaires
            </button>
          </div>
        </div>

        {/* Location Section - Full Width */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 py-16 border-t border-gray-200">
          <h3 className="text-2xl mb-6" style={{ fontWeight: 600 }}>Où se situe le logement</h3>
          <p className="text-base text-gray-600 mb-6">Paris, Île-de-France, France</p>

          {/* Map */}
          <div className="relative w-full h-[480px] rounded-xl overflow-hidden mb-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.77824472027!2d2.2646349878843567!3d48.858938437928655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <p className="text-base text-gray-600">
            L'adresse exacte sera communiquée après la réservation.
          </p>
        </div>

        {/* Host Information Section - Full Width */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 py-8 border-t border-gray-200">
          <h3 className="text-[26px] mb-8" style={{ fontWeight: 600 }}>Faites connaissance avec votre hôte</h3>

          <div className="flex flex-row gap-16">
            {/* Left - Host Card */}
            <div>
              <div className="grid grid-cols-3 items-center border border-gray-200 rounded-3xl pt-4 shadow-xl bg-white w-[520px] py-4">
                <div className="flex flex-col items-center text-center mb-8 col-span-2 mt-4">
                  <div className="relative mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1664482017668-91158897414c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwb3J0cmFpdCUyMHByb2ZpbGV8ZW58MXx8fHwxNzY3NzcwNDcxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Jérémy"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 bg-[#10B981] rounded-full p-2.5">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  <h4 className="text-[36px] mb-1" style={{ fontWeight: 600 }}>Jérémy</h4>
                  <p className="text-base text-gray-600">Hôte</p>
                </div>

                <div className="grid grid-rows-3 gap-4">
                  <div className="text-start border-b border-gray-200">
                    <p className="text-[22px] mb-1" style={{ fontWeight: 600 }}>26</p>
                    <p className="text-sm font-bold leading-tight text-gray-600">évaluations</p>
                  </div>
                  <div className="flex flex-col items-start text-start border-b border-gray-200">
                    <div className="flex items-center justify-center gap-0.5 mb-1">
                      <span className="text-[22px]" style={{ fontWeight: 600 }}>4,96</span>
                      <Star className="w-3.5 h-3.5 fill-current -mt-1" />
                    </div>
                    <p className="text-sm font-bold leading-tight text-gray-600">en note globale</p>
                  </div>
                  <div className="text-start">
                    <p className="text-[22px] mb-1" style={{ fontWeight: 600 }}>4</p>
                    <p className="text-sm font-bold leading-tight text-gray-600">mois d'expérience<br />en tant qu'hôte</p>
                  </div>
                </div>
              </div>

              {/* Info below card */}
              <div className="mt-6 space-y-4 max-w-md">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-base">Ma profession : Artiste</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-base">Passions : Cinéma théâtre art, lire, écrire, créer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Host Info */}
            <div className="space-y-6 p-">
              <div>
                <h4 className="text-[22px] mb-6" style={{ fontWeight: 600 }}>Informations sur l'hôte</h4>
                <div className="space-y-2 mb-8">
                  <p className="text-base">Taux de réponse : 92 %</p>
                  <p className="text-base">Répond dans l'heure</p>
                </div>

                <button 
                  className="w-full md:w-auto py-3 px-6 bg-gray-100 rounded-lg text-base mb-6"
                  style={{ fontWeight: 600 }}
                >
                  Envoyer un message à l'hôte
                </button>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">
                <button className="underline hover:text-gray-900 transition-colors" style={{ fontWeight: 600 }}>
                  Ce logement est proposé par un particulier. En savoir plus
                </button>
              </p>

              <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-[#10B981]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"/>
                  </svg>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  Afin de protéger votre paiement, utilisez toujours HOMIQIO pour envoyer de l'argent et communiquer avec les hôtes.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Things to Know Section - Full Width */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 mt-8 py-16 border-t border-gray-50">
          <h3 className="text-2xl mb-8" style={{ fontWeight: 600 }}>À savoir</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {/* Cancellation Policy */}
            <div>
              <div className="flex flex-col items-start gap-3 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h4 className="text-base" style={{ fontWeight: 600 }}>Conditions d'annulation</h4>
              </div>
              <p className="text-sm mb-3 text-[#6C6C6C]">
                Annulation gratuite avant le 2 avril. Si vous annulez avant l'arrivée prévue le 3 avril, vous aurez droit à un remboursement partiel. Consultez les conditions complètes de cet hôte pour en savoir plus.
              </p>
              <button className="text-sm underline" style={{ fontWeight: 600 }}>
                En savoir plus
              </button>
            </div>

            {/* House Rules */}
            <div>
              <div className="flex flex-col items-start gap-3 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="text-base" style={{ fontWeight: 600 }}>Règlement intérieur</h4>
              </div>
              <div className="space-y-2 text-sm mb-3 text-[#6C6C6C]">
                <p>Arrivée à partir de 14:00</p>
                <p>Départ avant 11:00</p>
                <p>2 voyageurs maximum</p>
              </div>
              <button className="text-sm underline" style={{ fontWeight: 600 }}>
                En savoir plus
              </button>
            </div>

            {/* Safety & Property */}
            <div>
              <div className="flex flex-col items-start gap-3 mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h4 className="text-base" style={{ fontWeight: 600 }}>Sécurité et logement</h4>
              </div>
              <div className="space-y-2 text-sm text-[#6C6C6C] mb-3">
                <p>Aucune indication de la présence d'un détecteur de monoxyde de carbone</p>
                <p>Aucune indication de la présence d'un détecteur de fumée</p>
              </div>
              <button className="text-sm underline" style={{ fontWeight: 600 }}>
                En savoir plus
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white bg-gray-200">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <button className="hover:underline">HOMIQIO</button>
              <ChevronRight className="w-4 h-4" />
              <button className="hover:underline">Émirats arabes unis</button>
              <ChevronRight className="w-4 h-4" />
              <button className="hover:underline">Dubaï</button>
              <ChevronRight className="w-4 h-4" />
              <button className="hover:underline">Dubaï</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}