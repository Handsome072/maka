'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Star, MapPin, Users, Bath, Bed, Wifi, CheckCircle, PauseCircle,
  XCircle, Clock, Edit, Trash2, Eye, Calendar, DollarSign, TrendingUp,
  Home, MessageCircle, Flag, AlertTriangle, ChevronLeft, ChevronRight,
  Shield, Heart, Award, BarChart3
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

interface PropertyDetail {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  photos: string[];
  status: 'Actif' | 'En attente' | 'Suspendu' | 'Refuse';
  type: string;
  city: string;
  country: string;
  fullAddress: string;
  pricePerNight: number;
  weekendPrice: number;
  weeklyPrice: number;
  monthlyPrice: number;
  cleaningFee: number;
  currency: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  cancellationPolicy: string;
  reservationMode: string;
  minStay: number;
  maxStay: number;
  wifiSpeed: string;
  createdAt: string;
  updatedAt: string;
  host: {
    id: number; name: string; avatar: string; email: string; phone: string;
    verified: boolean; joinDate: string; totalProperties: number;
    avgRating: number; responseRate: string;
  };
  stats: {
    totalReservations: number; totalRevenue: string; occupancyRate: string;
    avgRating: number; totalReviews: number; totalSignalements: number;
    viewsThisMonth: number; favoritesCount: number;
  };
  reservations: {
    id: string; guest: string; dates: string; amount: string;
    status: 'Confirmee' | 'Terminee' | 'Annulee' | 'En attente';
  }[];
  reviews: {
    guest: string; avatar: string; rating: number; comment: string;
    date: string; propertyResponse?: string;
  }[];
  signalements: {
    id: string; reporter: string; reason: string; date: string;
    status: 'Ouvert' | 'En cours' | 'Resolu';
  }[];
}

const propertiesData: Record<string, PropertyDetail> = {
  '1': {
    id: 1, title: 'Villa Toscane', subtitle: 'Magnifique villa avec vue panoramique',
    description: 'Decouvrez cette superbe villa de 200m2 situee dans le coeur de Paris. Entierement renovee, elle offre un cadre exceptionnel avec ses 4 chambres spacieuses, sa piscine privee et son jardin paysager. Ideale pour des vacances en famille ou entre amis.',
    photos: ['/images/properties/villa-1.jpg', '/images/properties/villa-2.jpg', '/images/properties/villa-3.jpg', '/images/properties/villa-4.jpg', '/images/properties/villa-5.jpg'],
    status: 'Actif', type: 'Villa', city: 'Paris', country: 'France',
    fullAddress: '42 Avenue des Champs-Elysees, 75008 Paris, France',
    pricePerNight: 250, weekendPrice: 300, weeklyPrice: 1500, monthlyPrice: 5000,
    cleaningFee: 80, currency: 'EUR', capacity: 8, bedrooms: 4, bathrooms: 3,
    amenities: ['Wi-Fi', 'Piscine', 'Parking', 'Climatisation', 'Cuisine equipee', 'Lave-linge', 'Seche-linge', 'TV ecran plat', 'Barbecue', 'Jardin'],
    cancellationPolicy: 'Flexible', reservationMode: 'Instantanee', minStay: 2, maxStay: 30,
    wifiSpeed: '100 Mbps', createdAt: '2023-01-15', updatedAt: '2025-02-20',
    host: {
      id: 1, name: 'Jean Dupont', avatar: 'JD', email: 'jean.dupont@email.com',
      phone: '+33 6 12 34 56 78', verified: true, joinDate: '15 jan. 2023',
      totalProperties: 4, avgRating: 4.8, responseRate: '96%'
    },
    stats: {
      totalReservations: 67, totalRevenue: '16 750 EUR', occupancyRate: '78%',
      avgRating: 4.9, totalReviews: 54, totalSignalements: 1,
      viewsThisMonth: 342, favoritesCount: 128
    },
    reservations: [
      { id: 'RES-001', guest: 'Marie Simon', dates: '15-20 fev. 2025', amount: '1 500 EUR', status: 'Confirmee' },
      { id: 'RES-002', guest: 'Pierre Laurent', dates: '01-05 jan. 2025', amount: '1 250 EUR', status: 'Terminee' },
      { id: 'RES-003', guest: 'Sophie Martin', dates: '20-27 dec. 2024', amount: '2 100 EUR', status: 'Terminee' },
      { id: 'RES-004', guest: 'Thomas Dubois', dates: '10-12 nov. 2024', amount: '600 EUR', status: 'Annulee' },
      { id: 'RES-005', guest: 'Lucie Bernard', dates: '01-07 oct. 2024', amount: '1 750 EUR', status: 'Terminee' },
    ],
    reviews: [
      { guest: 'Marie Simon', avatar: 'MS', rating: 5, comment: 'Villa exceptionnelle ! Tout etait parfait, de la proprete a l\'emplacement. L\'hote est tres accueillant et disponible. Je recommande vivement pour des vacances en famille.', date: '21 fev. 2025' },
      { guest: 'Pierre Laurent', avatar: 'PL', rating: 4, comment: 'Tres belle villa, bien equipee. Petit bemol sur le bruit de la rue le matin mais rien de redhibitoire. Le jardin est magnifique.', date: '06 jan. 2025', propertyResponse: 'Merci Pierre ! Nous avons installe de nouveaux double-vitrages pour reduire le bruit.' },
      { guest: 'Sophie Martin', avatar: 'SM', rating: 5, comment: 'Parfait pour les fetes de fin d\'annee. La piscine chauffee etait un vrai bonheur. Tout etait impeccable.', date: '28 dec. 2024' },
      { guest: 'Lucie Bernard', avatar: 'LB', rating: 5, comment: 'Sejour inoubliable. La villa est encore plus belle en vrai que sur les photos. Merci Jean !', date: '08 oct. 2024' },
    ],
    signalements: [
      { id: 'SIG-001', reporter: 'Thomas Dubois', reason: 'Photos ne correspondent pas a la realite', date: '12 nov. 2024', status: 'Resolu' },
    ],
  },
  '4': {
    id: 4, title: 'Studio Moderne Centre', subtitle: 'Studio contemporain au coeur de Marseille',
    description: 'Studio moderne de 30m2 entierement renove, situe en plein centre de Marseille a deux pas du Vieux-Port. Ideal pour les voyageurs solo ou en couple.',
    photos: ['/images/properties/studio-1.jpg', '/images/properties/studio-2.jpg'],
    status: 'En attente', type: 'Studio', city: 'Marseille', country: 'France',
    fullAddress: '15 Rue de la Republique, 13001 Marseille, France',
    pricePerNight: 85, weekendPrice: 95, weeklyPrice: 500, monthlyPrice: 1800,
    cleaningFee: 30, currency: 'EUR', capacity: 2, bedrooms: 1, bathrooms: 1,
    amenities: ['Wi-Fi', 'Climatisation', 'Cuisine equipee', 'Lave-linge', 'TV'],
    cancellationPolicy: 'Moderee', reservationMode: 'Sur demande', minStay: 1, maxStay: 14,
    wifiSpeed: '50 Mbps', createdAt: '2024-11-10', updatedAt: '2024-11-10',
    host: {
      id: 4, name: 'Sophie Martin', avatar: 'SM', email: 'sophie.martin@email.com',
      phone: '+33 6 45 67 89 01', verified: true, joinDate: '10 mar. 2023',
      totalProperties: 2, avgRating: 4.5, responseRate: '88%'
    },
    stats: {
      totalReservations: 0, totalRevenue: '0 EUR', occupancyRate: '0%',
      avgRating: 0, totalReviews: 0, totalSignalements: 0,
      viewsThisMonth: 0, favoritesCount: 0
    },
    reservations: [],
    reviews: [],
    signalements: [],
  },
};

const defaultProperty = propertiesData['1'];

export function AdminPropertyDetail() {
  const params = useParams();
  const propertyId = params?.id as string || '1';
  const property = propertiesData[propertyId] || defaultProperty;

  const [activeTab, setActiveTab] = useState<'reservations' | 'reviews' | 'signalements'>('reservations');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Actif': return { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle };
      case 'En attente': return { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock };
      case 'Suspendu': return { bg: 'bg-orange-50', text: 'text-orange-700', icon: PauseCircle };
      case 'Refuse': return { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock };
    }
  };

  const getBookingStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmee': return 'bg-emerald-50 text-emerald-700';
      case 'Terminee': return 'bg-blue-50 text-blue-700';
      case 'Annulee': return 'bg-red-50 text-red-700';
      case 'En attente': return 'bg-amber-50 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSignalementStatusColor = (status: string) => {
    switch (status) {
      case 'Ouvert': return 'bg-red-50 text-red-700';
      case 'En cours': return 'bg-amber-50 text-amber-700';
      case 'Resolu': return 'bg-emerald-50 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const statusConfig = getStatusConfig(property.status);
  const StatusIcon = statusConfig.icon;

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
      ))}
    </div>
  );

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
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Home className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{property.title}</h1>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {property.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{property.subtitle}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-gray-500">{property.city}, {property.country}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-400 font-mono">#{property.id}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {property.status === 'En attente' && (
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
              {property.status === 'Actif' && (
                <button onClick={() => setShowSuspendModal(true)} className="px-4 py-2.5 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
                  <PauseCircle className="w-4 h-4" />
                  Suspendre
                </button>
              )}
              {property.status === 'Suspendu' && (
                <button onClick={() => setShowApproveModal(true)} className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
                  <CheckCircle className="w-4 h-4" />
                  Reactiver
                </button>
              )}
              <button className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Reservations</span>
            </div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{property.stats.totalReservations}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Revenus</span>
            </div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{property.stats.totalRevenue}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Occupation</span>
            </div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{property.stats.occupancyRate}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Note moy.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" style={{ fontWeight: 600 }}>{property.stats.avgRating || '--'}</span>
              {property.stats.avgRating > 0 && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
              {property.stats.totalReviews > 0 && <span className="text-sm text-gray-400">({property.stats.totalReviews})</span>}
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-lg" style={{ fontWeight: 600 }}>{property.stats.viewsThisMonth}</div>
              <div className="text-xs text-gray-500">Vues ce mois</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-pink-600" />
            </div>
            <div>
              <div className="text-lg" style={{ fontWeight: 600 }}>{property.stats.favoritesCount}</div>
              <div className="text-xs text-gray-500">En favoris</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="text-lg" style={{ fontWeight: 600 }}>{property.stats.totalReviews}</div>
              <div className="text-xs text-gray-500">Avis</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${property.stats.totalSignalements > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
              <Flag className={`w-4 h-4 ${property.stats.totalSignalements > 0 ? 'text-red-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <div className="text-lg" style={{ fontWeight: 600 }}>{property.stats.totalSignalements}</div>
              <div className="text-xs text-gray-500">Signalements</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left: Photos & Description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>Galerie photos ({property.photos.length})</h2>
              </div>
              <div className="p-4 md:p-6">
                {/* Main Photo */}
                <div className="relative bg-gray-100 rounded-xl h-48 md:h-72 flex items-center justify-center mb-3 overflow-hidden">
                  <Home className="w-16 h-16 text-gray-300" />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg" style={{ fontWeight: 500 }}>
                    {currentPhotoIndex + 1} / {property.photos.length}
                  </div>
                  {property.photos.length > 1 && (
                    <>
                      <button onClick={() => setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => setCurrentPhotoIndex(Math.min(property.photos.length - 1, currentPhotoIndex + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {property.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhotoIndex(i)}
                      className={`w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${i === currentPhotoIndex ? 'ring-2 ring-[#111827]' : 'opacity-60 hover:opacity-100'}`}
                    >
                      <Home className="w-4 h-4 text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>Description</h2>
              </div>
              <div className="p-4 md:p-6">
                <p className="text-sm text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Informations generales */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>Informations generales</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <Home className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Type</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{property.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Capacite</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{property.capacity} voyageurs</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <Bed className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Chambres</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{property.bedrooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <Bath className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Salles de bain</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{property.bathrooms}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <Wifi className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Wi-Fi</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{property.wifiSpeed}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Adresse</div>
                      <div className="text-sm text-gray-700 max-w-[200px] truncate" style={{ fontWeight: 500 }}>{property.fullAddress}</div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-sm text-gray-500 mb-3" style={{ fontWeight: 500 }}>Equipements</div>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs text-gray-600" style={{ fontWeight: 500 }}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>Tarification</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Prix / nuit</div>
                    <div className="text-lg" style={{ fontWeight: 600 }}>{property.pricePerNight} {property.currency}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Week-end / nuit</div>
                    <div className="text-lg" style={{ fontWeight: 600 }}>{property.weekendPrice} {property.currency}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Semaine</div>
                    <div className="text-lg" style={{ fontWeight: 600 }}>{property.weeklyPrice} {property.currency}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Mois</div>
                    <div className="text-lg" style={{ fontWeight: 600 }}>{property.monthlyPrice} {property.currency}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">Frais menage</div>
                    <div className="text-lg" style={{ fontWeight: 600 }}>{property.cleaningFee} {property.currency}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Politique d&apos;annulation</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{property.cancellationPolicy}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Mode de reservation</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{property.reservationMode}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Sejour min / max</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{property.minStay} - {property.maxStay} nuits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Host Info */}
          <div className="space-y-6">
            {/* Host Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-lg" style={{ fontWeight: 600 }}>Hote</h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#111827] rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
                    {property.host.avatar}
                  </div>
                  <div>
                    <Link href={`/admin/hosts/${property.host.id}`} className="text-sm hover:underline" style={{ fontWeight: 600 }}>
                      {property.host.name}
                    </Link>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {property.host.verified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                          <Shield className="w-3 h-3" /> Verifie
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <Shield className="w-3 h-3" /> Non verifie
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Email</span>
                    <span className="text-xs" style={{ fontWeight: 500 }}>{property.host.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Telephone</span>
                    <span className="text-xs" style={{ fontWeight: 500 }}>{property.host.phone}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Membre depuis</span>
                    <span className="text-xs" style={{ fontWeight: 500 }}>{property.host.joinDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Logements</span>
                    <span className="text-xs" style={{ fontWeight: 600 }}>{property.host.totalProperties}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-500">Note moyenne</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs" style={{ fontWeight: 600 }}>{property.host.avgRating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs text-gray-500">Taux reponse</span>
                    <span className="text-xs" style={{ fontWeight: 600 }}>{property.host.responseRate}</span>
                  </div>
                </div>
                <Link href={`/admin/hosts/${property.host.id}`} className="mt-4 w-full px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm" style={{ fontWeight: 500 }}>
                  <Eye className="w-4 h-4" />
                  Voir le profil
                </Link>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 className="text-sm mb-4" style={{ fontWeight: 600 }}>Dates</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Cree le</span>
                  <span className="text-xs" style={{ fontWeight: 500 }}>{new Date(property.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Mis a jour le</span>
                  <span className="text-xs" style={{ fontWeight: 500 }}>{new Date(property.updatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Reservations / Reviews / Signalements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('reservations')}
                className={`px-6 py-4 text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'reservations' ? 'border-[#111827] text-[#111827]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                style={{ fontWeight: activeTab === 'reservations' ? 600 : 500 }}
              >
                Reservations ({property.reservations.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-[#111827] text-[#111827]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                style={{ fontWeight: activeTab === 'reviews' ? 600 : 500 }}
              >
                Avis ({property.reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('signalements')}
                className={`px-6 py-4 text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'signalements' ? 'border-[#111827] text-[#111827]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                style={{ fontWeight: activeTab === 'signalements' ? 600 : 500 }}
              >
                Signalements ({property.signalements.length})
                {property.signalements.filter(s => s.status !== 'Resolu').length > 0 && (
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <>
              {property.reservations.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="text-left py-3 px-6 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>ID</th>
                          <th className="text-left py-3 px-6 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Voyageur</th>
                          <th className="text-left py-3 px-6 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Dates</th>
                          <th className="text-left py-3 px-6 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Montant</th>
                          <th className="text-left py-3 px-6 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {property.reservations.map((r, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 px-6 text-xs text-gray-400 font-mono">{r.id}</td>
                            <td className="py-3.5 px-6 text-sm" style={{ fontWeight: 500 }}>{r.guest}</td>
                            <td className="py-3.5 px-6 text-sm text-gray-600">{r.dates}</td>
                            <td className="py-3.5 px-6 text-sm" style={{ fontWeight: 600 }}>{r.amount}</td>
                            <td className="py-3.5 px-6">
                              <span className={`inline-block px-2.5 py-1 rounded-lg text-xs ${getBookingStatusColor(r.status)}`} style={{ fontWeight: 600 }}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="md:hidden divide-y divide-gray-50">
                    {property.reservations.map((r, i) => (
                      <div key={i} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm" style={{ fontWeight: 600 }}>{r.guest}</div>
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs ${getBookingStatusColor(r.status)}`} style={{ fontWeight: 600 }}>
                            {r.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Dates: </span>
                            <span>{r.dates}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Montant: </span>
                            <span style={{ fontWeight: 600 }}>{r.amount}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{r.id}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-16 text-center">
                  <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <div className="text-sm text-gray-500">Aucune reservation</div>
                </div>
              )}
            </>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <>
              {property.reviews.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {property.reviews.map((r, i) => (
                    <div key={i} className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600" style={{ fontWeight: 600 }}>
                            {r.avatar}
                          </div>
                          <div>
                            <div className="text-sm" style={{ fontWeight: 600 }}>{r.guest}</div>
                            <div className="text-xs text-gray-400">{r.date}</div>
                          </div>
                        </div>
                        {renderStars(r.rating)}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed ml-0 sm:ml-12">{r.comment}</p>
                      {r.propertyResponse && (
                        <div className="ml-0 sm:ml-12 mt-3 p-3 bg-gray-50 rounded-xl border-l-3 border-[#111827]">
                          <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>Reponse de l&apos;hote</div>
                          <p className="text-sm text-gray-600">{r.propertyResponse}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <Star className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <div className="text-sm text-gray-500">Aucun avis</div>
                </div>
              )}
            </>
          )}

          {/* Signalements Tab */}
          {activeTab === 'signalements' && (
            <>
              {property.signalements.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="text-left py-3 px-6 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>ID</th>
                          <th className="text-left py-3 px-6 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Signale par</th>
                          <th className="text-left py-3 px-6 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Raison</th>
                          <th className="text-left py-3 px-6 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Date</th>
                          <th className="text-left py-3 px-6 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {property.signalements.map((s, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 px-6 text-xs text-gray-400 font-mono">{s.id}</td>
                            <td className="py-3.5 px-6 text-sm" style={{ fontWeight: 500 }}>{s.reporter}</td>
                            <td className="py-3.5 px-6 text-sm text-gray-600">{s.reason}</td>
                            <td className="py-3.5 px-6 text-sm text-gray-500">{s.date}</td>
                            <td className="py-3.5 px-6">
                              <span className={`inline-block px-2.5 py-1 rounded-lg text-xs ${getSignalementStatusColor(s.status)}`} style={{ fontWeight: 600 }}>
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="md:hidden divide-y divide-gray-50">
                    {property.signalements.map((s, i) => (
                      <div key={i} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm" style={{ fontWeight: 600 }}>{s.reporter}</div>
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs ${getSignalementStatusColor(s.status)}`} style={{ fontWeight: 600 }}>
                            {s.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-1">{s.reason}</div>
                        <div className="text-xs text-gray-400">{s.id} - {s.date}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-16 text-center">
                  <Flag className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <div className="text-sm text-gray-500">Aucun signalement</div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowApproveModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>
              {property.status === 'Suspendu' ? 'Reactiver le logement' : 'Approuver le logement'}
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Le logement sera visible par tous les utilisateurs et disponible a la reservation.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowApproveModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={() => setShowApproveModal(false)} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm" style={{ fontWeight: 600 }}>
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm resize-none mb-4"
            />
            <div className="flex items-center gap-3">
              <button onClick={() => setShowRefuseModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={() => setShowRefuseModal(false)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm" style={{ fontWeight: 600 }}>
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
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm resize-none mb-4"
            />
            <div className="flex items-center gap-3">
              <button onClick={() => setShowSuspendModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={() => setShowSuspendModal(false)} className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-sm" style={{ fontWeight: 600 }}>
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
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm" style={{ fontWeight: 600 }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
