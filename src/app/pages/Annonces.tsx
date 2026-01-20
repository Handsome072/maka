import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { clearListingData } from '@/app/utils/listingStorage';
import { BecomeHostModal } from '@/app/components/BecomeHostModal';

interface AnnoncesProps {
  onNavigate: (page: string) => void;
  showConfirmationPopup?: boolean;
  onConfirmationComplete?: () => void;
  uploadedPhotos?: string[];
  listingTitle?: string;
}

export function Annonces({ 
  onNavigate, 
  showConfirmationPopup = false, 
  onConfirmationComplete,
  uploadedPhotos = [],
  listingTitle = 'Maison hôte calme'
}: AnnoncesProps) {
  const [showPopup, setShowPopup] = useState(showConfirmationPopup);
  const [showListingDetailsPopup, setShowListingDetailsPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setShowPopup(showConfirmationPopup);
  }, [showConfirmationPopup]);

  const handleStartVerification = () => {
    setShowPopup(false);
    onConfirmationComplete?.();
    onNavigate('verification-points');
  };

  const handleDeleteListing = () => {
    setShowListingDetailsPopup(false);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteListing = () => {
    // Clear all listing data from localStorage
    clearListingData();
    setShowDeleteConfirm(false);
    // Reload the page to reset the app state
    window.location.reload();
  };

  // Get the first uploaded photo or use a default
  const mainPhoto = uploadedPhotos.length > 0 
    ? uploadedPhotos[0] 
    : 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between z-20">
        <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
          <img
            src="/logo.png"
            alt="HOMIQIO Logo"
            className="w-[120px] h-auto"
          />
        </button>
        <div className="flex items-center gap-8">
          <nav className="flex gap-8">
            <button className="text-sm hover:opacity-70 transition-opacity" style={{ fontWeight: 600, color: '#717171' }}>
              Aujourd'hui
            </button>
            <button className="text-sm hover:opacity-70 transition-opacity" style={{ fontWeight: 600, color: '#717171' }}>
              Calendrier
            </button>
            <button className="text-sm border-b-2 border-gray-900 pb-3" style={{ fontWeight: 600, color: '#222222' }}>
              Annonces
            </button>
            <button className="text-sm hover:opacity-70 transition-opacity" style={{ fontWeight: 600, color: '#717171' }}>
              Messages
            </button>
          </nav>
          <button 
            onClick={() => onNavigate('logements')}
            className="text-sm hover:opacity-70 transition-opacity" 
            style={{ fontWeight: 600, color: '#222222' }}
          >
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
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
            Mes annonces
          </h1>
          <div className="flex gap-3">
            <button className="p-2 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
            <button 
              onClick={() => setShowBecomeHostModal(true)}
              className="p-2 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Listing Card 1 - Existing */}
          <div 
            onClick={() => onNavigate('edit-listing')}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="relative">
              <ImageWithFallback
                src={mainPhoto}
                alt={listingTitle}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs" style={{ backgroundColor: '#4A90E2', color: '#FFFFFF', fontWeight: 600 }}>
                À Action requise
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                {listingTitle}
              </h3>
              <p className="text-sm" style={{ color: '#717171' }}>
                Logement · Antananarivo, Analamanga
              </p>
            </div>
          </div>

          {/* Listing Card 2 - New creation placeholder */}
          <div 
            onClick={() => setShowListingDetailsPopup(true)}
            className="bg-gray-200 rounded-xl overflow-hidden border border-gray-300 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
                <div className="text-6xl" style={{ color: '#999999' }}>
                  <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs" style={{ backgroundColor: '#E0E0E0', color: '#717171', fontWeight: 600 }}>
                En cours
              </div>
            </div>
            <div className="p-5 bg-gray-200">
              <h3 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Votre annonce a été créée le 13 janvier 2026
              </h3>
              <p className="text-sm" style={{ color: '#717171' }}>
                Logement
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowPopup(false);
                onConfirmationComplete?.();
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EC4899 0%, #EF4444 100%)' }}>
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <p className="text-xs mb-3" style={{ color: '#717171' }}>
                {listingTitle}
              </p>
              
              <h2 className="text-xl mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Confirmez quelques informations...
              </h2>
              
              <p className="text-sm mb-6" style={{ color: '#717171' }}>
                Action requise pour publier votre annonce
              </p>
              
              <button
                onClick={handleStartVerification}
                className="w-full px-6 py-3 rounded-lg text-white text-base mb-4 hover:opacity-90 transition-opacity"
                style={{ fontWeight: 600, backgroundColor: '#222222' }}
              >
                Commencer
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs" style={{ color: '#717171' }}>
                <ImageWithFallback
                  src={mainPhoto}
                  alt={listingTitle}
                  className="w-8 h-8 rounded object-cover"
                />
                <span>{listingTitle}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listing Details Popup */}
      {showListingDetailsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={() => setShowListingDetailsPopup(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="text-center">
              {/* Calendar Placeholder */}
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="#999999" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>
              
              <p className="text-sm mb-6" style={{ color: '#717171' }}>
                Votre annonce a été créée le 13 janvier 2026
              </p>
              
              <button
                onClick={() => {
                  setShowListingDetailsPopup(false);
                  onNavigate('edit-listing');
                }}
                className="w-full px-6 py-3 rounded-lg text-white text-base mb-3 hover:opacity-90 transition-opacity"
                style={{ fontWeight: 600, backgroundColor: '#222222' }}
              >
                Modifier l'annonce
              </button>
              
              <button
                onClick={handleDeleteListing}
                className="w-full px-6 py-3 rounded-lg border-2 border-gray-200 text-base hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  Supprimer l'annonce
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EC4899 0%, #EF4444 100%)' }}>
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              <p className="text-xs mb-3" style={{ color: '#717171' }}>
                {listingTitle}
              </p>
              
              <h2 className="text-xl mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Supprimer l'annonce ?
              </h2>
              
              <p className="text-sm mb-6" style={{ color: '#717171' }}>
                Cette action est irréversible
              </p>
              
              <button
                onClick={confirmDeleteListing}
                className="w-full px-6 py-3 rounded-lg text-white text-base mb-4 hover:opacity-90 transition-opacity"
                style={{ fontWeight: 600, backgroundColor: '#222222' }}
              >
                Supprimer
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs" style={{ color: '#717171' }}>
                <ImageWithFallback
                  src={mainPhoto}
                  alt={listingTitle}
                  className="w-8 h-8 rounded object-cover"
                />
                <span>{listingTitle}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Become Host Modal */}
      {showBecomeHostModal && (
        <BecomeHostModal
          isOpen={showBecomeHostModal}
          onClose={() => setShowBecomeHostModal(false)}
          onSelectOption={(option) => {
            if (option === 'logement') {
              onNavigate('host-onboarding');
            } else if (option === 'experience') {
              onNavigate('experience-onboarding');
            }
            // Service sera implémenté plus tard
            setShowBecomeHostModal(false);
          }}
        />
      )}
    </div>
  );
}