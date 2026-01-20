import { useState } from 'react';

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

    // Default content for other sections
    return (
      <div className="flex-1 bg-white px-12 py-8">
        <h1 className="text-3xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
          {selectedSection === 'title' && 'Titre'}
          {selectedSection === 'type' && 'Type de logement'}
          {selectedSection === 'pricing' && 'Tarification'}
          {selectedSection === 'availability' && 'Disponibilités'}
          {selectedSection === 'guests' && 'Nombre de voyageurs'}
          {selectedSection === 'description' && 'Description'}
          {selectedSection === 'amenities' && 'Équipements'}
          {selectedSection === 'accessibility' && 'Accessibilité'}
          {selectedSection === 'location' && 'Localisation'}
          {selectedSection === 'host' && 'Hôte'}
          {selectedSection === 'cohosts' && 'Co-hôtes'}
          {selectedSection === 'reservation-params' && 'Paramètres de réservation'}
          {selectedSection === 'house-rules' && 'Règles de la maison'}
          {selectedSection === 'safety' && 'Sécurité'}
          {selectedSection === 'cancellation' && 'Annulation'}
          {selectedSection === 'custom-link' && 'Lien personnalisé'}
        </h1>
        <p style={{ color: '#717171' }}>Contenu à venir...</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Host Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between z-20">
        <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
          <img
            src="/logo.png"
            alt="HOMIQIO Logo"
            className="w-[120px] h-auto"
          />
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
              <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Équipements
              </p>
              <div className="flex items-center gap-2 mt-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                  <polyline points="17 2 12 7 7 2" />
                </svg>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#717171" strokeWidth="2">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <line x1="12" y1="20" x2="12.01" y2="20" />
                </svg>
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

                {/* Guides */}
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
                    Créez un guide pour faire connaître à vos voyageurs vos meilleures adresses locales.
                  </p>
                </button>

                {/* Préférences concernant les échanges avec les voyageurs */}
                <button
                  onClick={() => setSelectedGuideSection('guest-preferences')}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                    selectedGuideSection === 'guest-preferences' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                    Préférences concernant les échanges avec les voyageurs
                  </p>
                  <p className="text-sm" style={{ color: '#10B981' }}>
                    Ajoutez des informations
                  </p>
                </button>
              </>
            )}
          </nav>

          {/* Aperçu Button */}
          <div className="mt-6">
            <button className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <span className="text-sm" style={{ fontWeight: 600 }}>
                Aperçu
              </span>
            </button>
          </div>
        </div>

        {/* Right Content */}
        {renderContent()}
      </div>
    </div>
  );
}