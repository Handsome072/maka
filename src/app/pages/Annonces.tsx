import { useState, useEffect } from 'react';
import { BecomeHostModal } from '@/app/components/BecomeHostModal';
import { HostSidebar } from '@/app/components/HostSidebar';
import { listingsApi, Listing } from '@/app/services/api';

interface AnnoncesProps {
  onNavigate: (page: string, data?: Record<string, any>) => void;
  showConfirmationPopup?: boolean;
  onConfirmationComplete?: () => void;
  uploadedPhotos?: string[];
  listingTitle?: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: 'En attente',       color: '#B45309', bg: '#FEF3C7' },
  active:   { label: 'Actif',            color: '#065F46', bg: '#D1FAE5' },
  draft:    { label: 'Brouillon',        color: '#4B5563', bg: '#F3F4F6' },
  rejected: { label: 'Rejeté',          color: '#991B1B', bg: '#FEE2E2' },
  archived: { label: 'Archivé',         color: '#6B7280', bg: '#F9FAFB' },
};

export function Annonces({
  onNavigate,
  showConfirmationPopup = false,
  onConfirmationComplete,
}: AnnoncesProps) {
  const [listings, setListings]               = useState<Listing[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState<string | null>(null);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [showListingDetailsPopup, setShowListingDetailsPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm]             = useState(false);
  const [deleting, setDeleting]               = useState(false);

  // Show confirmation popup on mount if requested (kept for backward compat)
  const [showPopup, setShowPopup] = useState(showConfirmationPopup);
  useEffect(() => { setShowPopup(showConfirmationPopup); }, [showConfirmationPopup]);

  // Fetch listings on mount
  useEffect(() => {
    listingsApi.getMyListings()
      .then(res => setListings(res.listings))
      .catch(err => setError(err.message || 'Impossible de charger vos annonces.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteListing = () => {
    setShowListingDetailsPopup(false);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteListing = async () => {
    if (!selectedListing) return;
    setDeleting(true);
    try {
      await listingsApi.deleteListing(selectedListing.id);
      setListings(prev => prev.filter(l => l.id !== selectedListing.id));
      setShowDeleteConfirm(false);
      setSelectedListing(null);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    } finally {
      setDeleting(false);
    }
  };

  const openDetails = (listing: Listing) => {
    setSelectedListing(listing);
    setShowListingDetailsPopup(true);
  };

  const getFirstPhotoUrl = (listing: Listing): string => {
    if (listing.photos && listing.photos.length > 0) return listing.photos[0].url;
    return 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HostSidebar activePage="annonces" />

      {/* Main Content */}
      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        <div className="mt-16 lg:mt-0">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
            Mes annonces
          </h1>
          <button
            onClick={() => setShowBecomeHostModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors text-sm"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Ajouter une annonce
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
              Aucune annonce pour l'instant
            </h2>
            <p className="text-sm mb-6" style={{ color: '#717171' }}>
              Commencez à publier votre logement pour accueillir des voyageurs.
            </p>
            <button
              onClick={() => setShowBecomeHostModal(true)}
              className="px-6 py-3 rounded-lg text-white text-sm hover:opacity-90 transition-opacity"
              style={{ fontWeight: 600, backgroundColor: '#222222' }}
            >
              Créer une annonce
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && listings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => {
              const statusInfo = STATUS_LABELS[listing.status] ?? STATUS_LABELS.draft;
              const photoUrl   = getFirstPhotoUrl(listing);
              const title      = listing.title || 'Annonce sans titre';

              return (
                <div
                  key={listing.id}
                  onClick={() => openDetails(listing)}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={photoUrl}
                      alt={title}
                      className="w-full h-56 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop';
                      }}
                    />
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs"
                      style={{ backgroundColor: statusInfo.bg, color: statusInfo.color, fontWeight: 600 }}
                    >
                      {statusInfo.label}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base mb-1 truncate" style={{ fontWeight: 600, color: '#222222' }}>
                      {title}
                    </h3>
                    <p className="text-sm" style={{ color: '#717171' }}>
                      Logement · {listing.city ?? '—'}
                      {listing.province ? `, ${listing.province}` : ''}
                    </p>
                    {listing.base_price && (
                      <p className="text-sm mt-1" style={{ color: '#222222', fontWeight: 600 }}>
                        {parseFloat(listing.base_price).toFixed(0)} {listing.currency} / nuit
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </main>

      {/* Listing Details Popup */}
      {showListingDetailsPopup && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
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
              <img
                src={getFirstPhotoUrl(selectedListing)}
                alt={selectedListing.title ?? ''}
                className="w-full h-40 object-cover rounded-xl mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop';
                }}
              />
              <h2 className="text-lg mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                {selectedListing.title ?? 'Annonce sans titre'}
              </h2>
              <p className="text-sm mb-6" style={{ color: '#717171' }}>
                {selectedListing.city ?? '—'}{selectedListing.province ? `, ${selectedListing.province}` : ''}
              </p>

              <button
                onClick={() => {
                  setShowListingDetailsPopup(false);
                  onNavigate('edit-listing', { listingId: selectedListing.id, listingTitle: selectedListing.title ?? '' });
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
      {showDeleteConfirm && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
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
                    <polyline points="3 6 5 6 21 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <p className="text-xs mb-1" style={{ color: '#717171' }}>
                {selectedListing.title ?? 'Annonce'}
              </p>

              <h2 className="text-xl mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Supprimer l'annonce ?
              </h2>

              <p className="text-sm mb-6" style={{ color: '#717171' }}>
                Cette action est irréversible
              </p>

              <button
                onClick={confirmDeleteListing}
                disabled={deleting}
                className="w-full px-6 py-3 rounded-lg text-white text-base mb-4 hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ fontWeight: 600, backgroundColor: '#EF4444' }}
              >
                {deleting ? 'Suppression...' : 'Supprimer'}
              </button>

              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full px-6 py-3 rounded-lg border border-gray-200 text-base hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Popup (legacy – kept for backward compat) */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative">
            <button
              onClick={() => { setShowPopup(false); onConfirmationComplete?.(); }}
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
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Confirmez quelques informations...
              </h2>
              <p className="text-sm mb-6" style={{ color: '#717171' }}>
                Action requise pour publier votre annonce
              </p>
              <button
                onClick={() => {
                  setShowPopup(false);
                  onConfirmationComplete?.();
                  onNavigate('verification-points');
                }}
                className="w-full px-6 py-3 rounded-lg text-white text-base mb-4 hover:opacity-90 transition-opacity"
                style={{ fontWeight: 600, backgroundColor: '#222222' }}
              >
                Commencer
              </button>
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
            setShowBecomeHostModal(false);
          }}
        />
      )}
    </div>
  );
}
