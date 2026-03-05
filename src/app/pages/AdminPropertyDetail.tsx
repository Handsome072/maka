'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Star, MapPin, Users, Bath, Bed, Wifi, CheckCircle, PauseCircle,
  XCircle, Clock, Edit, Trash2, Eye, Calendar, DollarSign, TrendingUp,
  Home, MessageCircle, Flag, AlertTriangle, ChevronLeft, ChevronRight,
  Shield, Heart, Award, BarChart3, Loader2
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { adminListingsApi, type AdminListing } from '@/app/services/api';
import { toast } from 'sonner';

const SPACE_TYPE_LABELS: Record<string, string> = {
  entire: 'Logement entier',
  private: 'Chambre privee',
  shared: 'Chambre partagee',
};

export function AdminPropertyDetail() {
  const params = useParams();
  const router = useRouter();
  const propertyId = Number(params?.id) || 0;

  const [listing, setListing] = useState<AdminListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [refuseReason, setRefuseReason] = useState('');
  const [suspendReason, setSuspendReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await adminListingsApi.getOne(propertyId);
        setListing(res.listing);
      } catch (err: any) {
        toast.error(err.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [propertyId]);

  const handleApprove = async () => {
    if (!listing) return;
    try {
      setActionLoading(true);
      const res = await adminListingsApi.approve(listing.id);
      setListing(res.listing);
      setShowApproveModal(false);
      toast.success('Annonce approuvee avec succes !');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'approbation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!listing) return;
    try {
      setActionLoading(true);
      const res = await adminListingsApi.reject(listing.id, refuseReason);
      setListing(res.listing);
      setShowRefuseModal(false);
      setRefuseReason('');
      toast.success('Annonce refusee.');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors du refus');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!listing) return;
    try {
      setActionLoading(true);
      const res = await adminListingsApi.suspend(listing.id, suspendReason);
      setListing(res.listing);
      setShowSuspendModal(false);
      setSuspendReason('');
      toast.success('Annonce suspendue.');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suspension');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!listing) return;
    try {
      setActionLoading(true);
      await adminListingsApi.delete(listing.id);
      toast.success('Annonce supprimee.');
      setShowDeleteModal(false);
      router.push('/admin/properties');
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle, label: 'Actif' };
      case 'pending': return { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock, label: 'En attente' };
      case 'archived': return { bg: 'bg-orange-50', text: 'text-orange-700', icon: PauseCircle, label: 'Suspendu' };
      case 'rejected': return { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle, label: 'Refuse' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: status };
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatPrice = (price: string | null | undefined) => {
    if (!price) return '--';
    return `${Number(price).toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <AdminSidebar />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <AdminSidebar />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Home className="w-12 h-12 text-gray-300" />
            <p className="text-gray-500">Annonce introuvable</p>
            <Link href="/admin/properties" className="text-sm text-[#111827] hover:underline" style={{ fontWeight: 500 }}>
              Retour a la liste
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const statusConfig = getStatusConfig(listing.status);
  const StatusIcon = statusConfig.icon;
  const photos = listing.photos || [];
  const amenities = listing.amenities || [];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 mt-16 lg:mt-0">
          <Link href="/admin/properties" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#111827] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour a la liste
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {photos.length > 0 ? (
                  <img src={photos[0].url} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Home className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{listing.title || 'Sans titre'}</h1>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                  </span>
                </div>
                {listing.subtitle && <p className="text-sm text-gray-500">{listing.subtitle}</p>}
                <div className="flex items-center gap-2 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-gray-500">{listing.city || 'N/A'}, {listing.province}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-400 font-mono">#{listing.id}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {listing.status === 'pending' && (
                <>
                  <button onClick={() => setShowApproveModal(true)} className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
                    <CheckCircle className="w-4 h-4" />
                    Approuver
                  </button>
                  <button onClick={() => setShowRefuseModal(true)} className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
                    <XCircle className="w-4 h-4" />
                    Refuser
                  </button>
                </>
              )}
              {listing.status === 'active' && (
                <button onClick={() => setShowSuspendModal(true)} className="px-4 py-2.5 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
                  <PauseCircle className="w-4 h-4" />
                  Suspendre
                </button>
              )}
              <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Rejection reason banner */}
        {listing.status === 'rejected' && listing.rejection_reason && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-red-700" style={{ fontWeight: 600 }}>Raison du refus</div>
              <p className="text-sm text-red-600 mt-1">{listing.rejection_reason}</p>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left: Property Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            {photos.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={photos[currentPhotoIndex]?.url}
                    alt={listing.title || ''}
                    className="w-full h-full object-cover"
                  />
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentPhotoIndex(i => (i - 1 + photos.length) % photos.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentPhotoIndex(i => (i + 1) % photos.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur">
                        {currentPhotoIndex + 1} / {photos.length}
                      </div>
                    </>
                  )}
                </div>
                {photos.length > 1 && (
                  <div className="p-3 flex gap-2 overflow-x-auto">
                    {photos.map((photo, i) => (
                      <button
                        key={photo.id}
                        onClick={() => setCurrentPhotoIndex(i)}
                        className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${i === currentPhotoIndex ? 'border-[#111827]' : 'border-transparent'}`}
                      >
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h2 className="text-lg mb-3" style={{ fontWeight: 600 }}>Description</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{listing.description}</p>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>Details du logement</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Capacite</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{listing.capacity} personnes</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Bath className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Salles de bain</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{listing.bathrooms}</div>
                    </div>
                  </div>
                  {listing.space_type && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Home className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Type</div>
                        <div className="text-sm" style={{ fontWeight: 600 }}>{SPACE_TYPE_LABELS[listing.space_type] || listing.space_type}</div>
                      </div>
                    </div>
                  )}
                  {listing.has_wifi && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Wifi className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs text-gray-500">Wi-Fi</div>
                        <div className="text-sm" style={{ fontWeight: 600 }}>{listing.wifi_speed || 'Oui'}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h2 className="text-lg mb-3" style={{ fontWeight: 600 }}>Equipements</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-600">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>Tarification</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Prix / nuit</div>
                    <div className="text-lg" style={{ fontWeight: 600 }}>{formatPrice(listing.base_price)} {listing.currency}</div>
                  </div>
                  {listing.weekend_price && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Week-end</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{formatPrice(listing.weekend_price)} {listing.currency}</div>
                    </div>
                  )}
                  {listing.weekly_price && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Semaine</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{formatPrice(listing.weekly_price)} {listing.currency}</div>
                    </div>
                  )}
                  {listing.monthly_price && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Mois</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{formatPrice(listing.monthly_price)} {listing.currency}</div>
                    </div>
                  )}
                  {listing.cleaning_fee && Number(listing.cleaning_fee) > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Frais menage</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{formatPrice(listing.cleaning_fee)} {listing.currency}</div>
                    </div>
                  )}
                  {listing.security_deposit && Number(listing.security_deposit) > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Depot securite</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{formatPrice(listing.security_deposit)} {listing.currency}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>Regles et conditions</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Mode de reservation</div>
                    <div style={{ fontWeight: 600 }}>{listing.reservation_mode === 'instant' ? 'Instantanee' : 'Sur demande'}</div>
                  </div>
                  {listing.cancellation_policy && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Annulation</div>
                      <div style={{ fontWeight: 600 }}>{listing.cancellation_policy}</div>
                    </div>
                  )}
                  {listing.min_stay && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Sejour min</div>
                      <div style={{ fontWeight: 600 }}>{listing.min_stay} nuits</div>
                    </div>
                  )}
                  {listing.max_stay && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Sejour max</div>
                      <div style={{ fontWeight: 600 }}>{listing.max_stay} nuits</div>
                    </div>
                  )}
                  {listing.arrival_time && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Arrivee</div>
                      <div style={{ fontWeight: 600 }}>{listing.arrival_time}</div>
                    </div>
                  )}
                  {listing.departure_time && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Depart</div>
                      <div style={{ fontWeight: 600 }}>{listing.departure_time}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Address Info */}
            {listing.full_address && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                <h2 className="text-lg mb-3" style={{ fontWeight: 600 }}>Adresse</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{listing.full_address}</span>
                  </div>
                  {listing.street && <div className="text-gray-500 ml-6">Rue: {listing.street}</div>}
                  {listing.postal_code && <div className="text-gray-500 ml-6">Code postal: {listing.postal_code}</div>}
                </div>
              </div>
            )}
          </div>

          {/* Right: Host Info + Meta */}
          <div className="space-y-6">
            {/* Host Card */}
            {listing.host && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 md:p-6 border-b border-gray-100">
                  <h2 className="text-lg" style={{ fontWeight: 600 }}>Hote</h2>
                </div>
                <div className="p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {listing.host_photo_url ? (
                      <img src={listing.host_photo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-[#111827] rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
                        {listing.host.first_name?.[0]}{listing.host.last_name?.[0]}
                      </div>
                    )}
                    <div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>
                        {listing.host.name}
                      </div>
                      <div className="text-xs text-gray-500">{listing.host.email}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-500">ID Hote</span>
                      <span className="text-xs font-mono" style={{ fontWeight: 500 }}>#{listing.host.id}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-xs text-gray-500">Email</span>
                      <span className="text-xs" style={{ fontWeight: 500 }}>{listing.host.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 className="text-sm mb-4" style={{ fontWeight: 600 }}>Dates</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Cree le</span>
                  <span className="text-xs" style={{ fontWeight: 500 }}>{formatDate(listing.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Mis a jour le</span>
                  <span className="text-xs" style={{ fontWeight: 500 }}>{formatDate(listing.updated_at)}</span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 className="text-sm mb-4" style={{ fontWeight: 600 }}>Informations rapides</h2>
              <div className="space-y-3">
                {listing.phone_number && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Telephone</span>
                    <span className="text-xs" style={{ fontWeight: 500 }}>{listing.country_code} {listing.phone_number}</span>
                  </div>
                )}
                {listing.checkin_method && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Check-in</span>
                    <span className="text-xs" style={{ fontWeight: 500 }}>{listing.checkin_method}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Lois locales</span>
                  <span className={`text-xs ${listing.accepted_local_laws ? 'text-emerald-600' : 'text-gray-400'}`} style={{ fontWeight: 500 }}>
                    {listing.accepted_local_laws ? 'Acceptees' : 'Non acceptees'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowApproveModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>Approuver le logement</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Le logement sera visible par tous les utilisateurs et disponible a la reservation.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowApproveModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }} disabled={actionLoading}>
                Annuler
              </button>
              <button onClick={handleApprove} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center gap-2" style={{ fontWeight: 600 }} disabled={actionLoading}>
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refuse Modal */}
      {showRefuseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRefuseModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>Refuser le logement</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              L&apos;hote sera notifie du refus avec la raison indiquee.
            </p>
            <textarea
              placeholder="Raison du refus..."
              rows={3}
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm resize-none mb-4"
            />
            <div className="flex items-center gap-3">
              <button onClick={() => { setShowRefuseModal(false); setRefuseReason(''); }} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }} disabled={actionLoading}>
                Annuler
              </button>
              <button onClick={handleReject} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2" style={{ fontWeight: 600 }} disabled={actionLoading}>
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Refuser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSuspendModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PauseCircle className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>Suspendre le logement</h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Le logement ne sera plus visible. L&apos;hote sera notifie.
            </p>
            <textarea
              placeholder="Raison de la suspension..."
              rows={3}
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm resize-none mb-4"
            />
            <div className="flex items-center gap-3">
              <button onClick={() => { setShowSuspendModal(false); setSuspendReason(''); }} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }} disabled={actionLoading}>
                Annuler
              </button>
              <button onClick={handleSuspend} className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-sm flex items-center justify-center gap-2" style={{ fontWeight: 600 }} disabled={actionLoading}>
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Suspendre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>Supprimer le logement</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Cette action est irreversible. Toutes les donnees associees seront supprimees.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }} disabled={actionLoading}>
                Annuler
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2" style={{ fontWeight: 600 }} disabled={actionLoading}>
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
