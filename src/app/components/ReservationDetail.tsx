import { X, Share, Heart } from 'lucide-react';
import { useState } from 'react';
import { ImageCarouselModal } from './ImageCarouselModal';

interface ReservationDetailProps {
  onClose: () => void;
}

export function ReservationDetail({ onClose }: ReservationDetailProps) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1737305457496-dc7503cdde1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzdHVkaW8lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njc3NjY1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1612419299101-6c294dc2901d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYXBhcnRtZW50JTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3Njc2ODYxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1737467016100-68cd7759d93c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBiZWRyb29tJTIwY29tZm9ydGFibGV8ZW58MXx8fHwxNzY3NzY2NTU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1597497522150-2f50bffea452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwYXBhcnRtZW50fGVufDF8fHx8MTc2NzczMDQyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1757439402224-56c48352f719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMGFwYXJ0bWVudCUyMG1vZGVybnxlbnwxfHx8fDE3Njc3NjY1NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc2NzgwNjkyOHww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1650338031185-1e97add7a389?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwcGF0aW8lMjBnYXJkZW58ZW58MXx8fHwxNzY3ODI1MjIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1696774276390-6ce82111140f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwbGl2aW5nJTIwc3BhY2V8ZW58MXx8fHwxNzY3ODI4Nzc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1682888818696-906287d759f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzaG93ZXIlMjBiYXRocm9vbXxlbnwxfHx8fDE3Njc4NzQ5NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1758448511533-e1502259fff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBlbnRyYW5jZSUyMGhhbGx3YXl8ZW58MXx8fHwxNzY3ODc0OTYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  const openCarousel = (index: number) => {
    setCarouselStartIndex(index);
    setShowCarousel(true);
  };

  return (
    <>
      {/* Cancel Reservation Popup */}
      {showCancelPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full mx-4 relative">
            <button
              onClick={() => setShowCancelPopup(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full border-2 border-gray-800 text-gray-800 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
              Annuler votre réservation
            </h2>

            <div className="mb-6">
              <h3 className="text-xs mb-4" style={{ fontWeight: 700, color: '#222222', letterSpacing: '0.5px' }}>
                DÉTAILS DE REMBOURSEMENT
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                    Frais de réservation
                  </span>
                  <span className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                    580€
                  </span>
                </div>

                <div className="bg-[#3D5278] rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base text-white" style={{ fontWeight: 600 }}>
                      Remboursement
                    </span>
                    <span className="text-base text-white" style={{ fontWeight: 600 }}>
                      290€
                    </span>
                  </div>
                  <p className="text-sm text-white opacity-90 leading-relaxed">
                    Annulation entre 30 et 15 jours avant le début du séjour :<br />
                    50% de la réservation est remboursable
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-6">
              Vous recevrez un email de confirmation d'annulation de votre réservation.
            </p>

            <button
              onClick={() => {
                setIsCancelled(true);
                setShowCancelPopup(false);
              }}
              className="w-full px-6 py-3 border-2 rounded-lg text-base hover:bg-gray-100 transition-colors bg-white"
              style={{
                fontWeight: 600,
                color: '#222222',
                borderColor: '#222222'
              }}
            >
              ANNULER LA RÉSERVATION
            </button>
          </div>
        </div>
      )}

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

      {/* Main Content */}
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 lg:px-20 py-5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <X className="w-5 h-5" />
            <span className="text-sm" style={{ fontWeight: 600 }}>Retour</span>
          </button>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="flex items-center gap-2 px-2 py-2 md:px-3 md:py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Share className="w-4 h-4" />
              <span className="text-sm underline hidden md:inline" style={{ fontWeight: 600 }}>Partager</span>
            </button>
            <button className="flex items-center gap-2 px-2 py-2 md:px-3 md:py-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-sm underline hidden md:inline" style={{ fontWeight: 600 }}>Enregistrer</span>
            </button>
          </div>
        </div>

        {/* Title Section */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 pt-6">
          <h1 className="text-2xl md:text-3xl mb-4" style={{ fontWeight: 600 }}>
            Studio aux Portes de Paris
          </h1>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-20 mb-8">
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
              className="absolute bottom-4 right-4 md:bottom-4 md:right-4 lg:bottom-6 lg:right-6 bg-white px-4 py-2 rounded-lg border border-gray-900 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm z-10 text-sm whitespace-nowrap"
              style={{ fontWeight: 600 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="flex-shrink-0">
                <path d="M3 3h4v4H3V3zm6 0h4v4H9V3zM3 9h4v4H3V9zm6 0h4v4H9V9z" />
              </svg>
              <span>Afficher toutes les photos</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white py-12">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column - Main Content (No Card Background) */}
              <div className="lg:col-span-2 space-y-10">
                {/* Réservation confirmée / annulée */}
                <div className="border-b border-gray-200 pb-10">
                  <h2 className="text-3xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                    {isCancelled ? 'Réservation annulée' : 'Réservation confirmée'}
                  </h2>

                  {isCancelled ? (
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Nous restons à votre disposition si vous souhaitez effectuer une nouvelle réservation ou obtenir de l'aide. N'hésitez pas à{' '}
                        <span className="underline cursor-pointer" style={{ fontWeight: 600 }}>nous contacter</span> pour toute question.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <p className="text-sm mb-3" style={{ color: '#222222' }}>
                          <span style={{ fontWeight: 600 }}>Un email de confirmation de votre réservation vous a été envoyé.</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Cher(e) James Bond, nous sommes ravis de vous informer que votre réservation a été confirmée avec succès aux dates suivantes :
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs" style={{ fontWeight: 600, color: '#222222', letterSpacing: '0.5px' }}>
                              DATE D'ARRIVÉE
                            </span>
                          </div>
                          <p className="text-2xl mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                            Lun. 15 Sept. 2024
                          </p>
                          <p className="text-sm text-gray-500">15:00 - 21:00</p>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs" style={{ fontWeight: 600, color: '#222222', letterSpacing: '0.5px' }}>
                              DATE DE DÉPART
                            </span>
                          </div>
                          <p className="text-2xl mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                            Ven. 19 Sept. 2024
                          </p>
                          <p className="text-sm text-gray-500">11:00</p>
                        </div>
                      </div>

                      <button className="flex items-center gap-2 text-sm" style={{ color: '#222222', fontWeight: 600 }}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        AJOUTER À MON CALENDRIER
                      </button>
                    </>
                  )}
                </div>

                {/* Services supplémentaires réservés */}
                <div className="border-b border-gray-200 pb-10">
                  <h2 className="text-3xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                    Services supplémentaires réservés
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                          Ménage ponctuel
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Lorem ipsum dolor sit amet consectetur. Elit turpis id volutpat vitae. Vulputate mauris eu dignissim quis a nunc lorem. Consectetur viverra scelerisque nam. Consecte{' '}
                          <span className="text-red-400 underline cursor-pointer" style={{ fontWeight: 600 }}>Voir plus</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                          Parking [Type de parking]
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Lorem ipsum dolor sit amet consectetur. Elit turpis id volutpat vitae. Vulputate mauris eu dignissim quis a nunc lorem. Consectetur viverra scelerisque nam. Consecte{' '}
                          <span className="text-red-400 underline cursor-pointer" style={{ fontWeight: 600 }}>Voir plus</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 text-sm" style={{ color: '#222222', fontWeight: 600 }}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    AJOUTER DES SERVICES
                  </button>
                </div>

                {/* Détails du prix */}
                <div className="border-b border-gray-200 pb-10">
                  <h2 className="text-3xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                    Détails du prix
                  </h2>

                  {/* Frais de réservation */}
                  <div className="mb-6">
                    <button className="flex items-center justify-between w-full mb-4">
                      <span className="text-xs" style={{ fontWeight: 700, color: '#222222', letterSpacing: '0.5px' }}>
                        FRAIS DE RÉSERVATION
                      </span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Arrhes</span>
                        <span className="text-gray-700">500€</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Services ponctuels</span>
                        <span className="text-gray-700">80€</span>
                      </div>
                      <div className="pl-4 flex items-center justify-between text-sm text-gray-500">
                        <span>Ménage hebdomadaire</span>
                        <span>40€</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg" style={{ fontWeight: 600, color: '#222222' }}>Total</span>
                        <span className="text-lg" style={{ fontWeight: 600, color: '#222222' }}>580€</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Dont TVA</span>
                        <span>54,66 €</span>
                      </div>
                    </div>
                  </div>

                  {/* Frais récurrents */}
                  <div>
                    <button className="flex items-center justify-between w-full mb-4">
                      <span className="text-xs" style={{ fontWeight: 700, color: '#222222', letterSpacing: '0.5px' }}>
                        FRAIS RÉCURRENTS
                      </span>
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Loyer</span>
                        <span className="text-gray-700">500€ par mois</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">3 occupants</span>
                        <span className="text-gray-700">200€ par mois</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">Services supplémentaires</span>
                        <span className="text-gray-700">40€ par mois</span>
                      </div>
                      <div className="pl-4 flex items-center justify-between text-sm text-gray-500">
                        <span>Ménage hebdomadaire</span>
                        <span>40€ par mois</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg" style={{ fontWeight: 600, color: '#222222' }}>Total</span>
                        <span className="text-lg" style={{ fontWeight: 600, color: '#222222' }}>740€ par mois</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Dont TVA</span>
                        <span>54,66 €</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Sticky Card */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Appartement T2 Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-2xl mb-5" style={{ fontWeight: 600, color: '#222222' }}>
                      Appartement T2
                    </h2>

                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Croix Verte</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
                        </svg>
                        <span>2</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                        <span>1</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2m-16 0h16m-16 0v10a2 2 0 002 2h12a2 2 0 002-2V8m-16 0h16" />
                        </svg>
                        <span>42m2</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>T2</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>3 à 4</span>
                      </div>
                    </div>

                    <button
                      className="flex items-center gap-2 text-sm"
                      style={{ color: '#222222', fontWeight: 600 }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      VOIR L'APPARTEMENT
                    </button>
                  </div>

                  {/* Conditions d'annulation Card */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24">
                    <h2 className="text-2xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                      Conditions d'annulation
                    </h2>

                    <ul className="space-y-4 mb-6 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>Annulation plus de 30 jours avant arrivée du client : restitution intégrale du montant du séjour</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>Annulation entre 30 et 15 jours avant arrivée du Client : restitution de 50 % du montant de la réservation</span>
                      </li>
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>Annulation de moins de 15 jours avant arrivée : aucune restitution des sommes payées</span>
                      </li>
                    </ul>

                    <button
                      onClick={() => setShowCancelPopup(true)}
                      className="w-full px-6 py-3 border-2 rounded-lg text-sm hover:bg-gray-100 transition-colors bg-white flex items-center justify-center gap-2"
                      style={{
                        fontWeight: 600,
                        color: '#222222',
                        borderColor: '#222222'
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      ANNULER LA RÉSERVATION
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}