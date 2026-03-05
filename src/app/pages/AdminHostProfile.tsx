'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Ban, PauseCircle, MessageCircle, ShieldCheck, Shield,
  FileText, Monitor, MapPin, Phone, Mail, Globe, Calendar, AlertTriangle,
  Star, DollarSign, Home, TrendingUp, Clock, XCircle, Lock
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

interface AdminNote {
  id: number;
  author: string;
  date: string;
  content: string;
}

const hostsData: Record<string, {
  id: number; name: string; email: string; avatar: string; phone: string;
  country: string; verified: boolean; joinDate: string; language: string;
  status: 'ACTIF' | 'SUSPENDU' | 'BANNI';
  verificationDate: string | null;
  documents: { name: string; date: string; status: string }[];
  addressVerified: boolean;
  bankVerified: boolean;
  properties: { name: string; city: string; pricePerNight: string; status: string; rating: number; totalBookings: number }[];
  stats: { totalBookings: number; totalEarnings: string; occupancyRate: string; avgRating: number; responseRate: string; cancellationRate: string };
  bookings: { property: string; guest: string; dates: string; amount: string; status: string }[];
  payments: { id: string; property: string; amount: string; commission: string; date: string }[];
  reviews: { guest: string; property: string; rating: number; comment: string; date: string }[];
  disputes: { id: string; guest: string; property: string; status: string; date: string }[];
  risk: { lastLogin: string; ip: string; device: string; fraudScore: number };
}> = {
  '1': {
    id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', avatar: 'JD',
    phone: '+33 6 12 34 56 78', country: 'France', verified: true,
    joinDate: '15 jan. 2023', language: 'Francais', status: 'ACTIF',
    verificationDate: '20 jan. 2023',
    documents: [
      { name: 'Carte d\'identite', date: '15 jan. 2023', status: 'APPROUVE' },
      { name: 'Justificatif de domicile', date: '15 jan. 2023', status: 'APPROUVE' },
    ],
    addressVerified: true,
    bankVerified: true,
    properties: [
      { name: 'Villa Toscane', city: 'Paris', pricePerNight: '180 €', status: 'ACTIF', rating: 4.9, totalBookings: 67 },
      { name: 'Appartement Paris 8e', city: 'Paris', pricePerNight: '120 €', status: 'ACTIF', rating: 4.7, totalBookings: 45 },
      { name: 'Studio Montmartre', city: 'Paris', pricePerNight: '85 €', status: 'INACTIF', rating: 4.5, totalBookings: 23 },
      { name: 'Loft Marais', city: 'Paris', pricePerNight: '200 €', status: 'ACTIF', rating: 4.8, totalBookings: 21 },
    ],
    stats: { totalBookings: 156, totalEarnings: '45 230 €', occupancyRate: '78%', avgRating: 4.8, responseRate: '96%', cancellationRate: '2%' },
    bookings: [
      { property: 'Villa Toscane', guest: 'Marie Simon', dates: '15-20 fev. 2025', amount: '900 €', status: 'CONFIRMEE' },
      { property: 'Appartement Paris 8e', guest: 'Pierre Laurent', dates: '01-05 jan. 2025', amount: '480 €', status: 'TERMINEE' },
      { property: 'Villa Toscane', guest: 'Sophie Martin', dates: '20-27 dec. 2024', amount: '1 260 €', status: 'TERMINEE' },
      { property: 'Loft Marais', guest: 'Thomas Dubois', dates: '10-12 nov. 2024', amount: '400 €', status: 'ANNULEE' },
      { property: 'Studio Montmartre', guest: 'Lucie Bernard', dates: '01-03 oct. 2024', amount: '170 €', status: 'TERMINEE' },
    ],
    payments: [
      { id: 'PAY-H001', property: 'Villa Toscane', amount: '810 €', commission: '90 €', date: '22 fev. 2025' },
      { id: 'PAY-H002', property: 'Appartement Paris 8e', amount: '432 €', commission: '48 €', date: '07 jan. 2025' },
      { id: 'PAY-H003', property: 'Villa Toscane', amount: '1 134 €', commission: '126 €', date: '29 dec. 2024' },
      { id: 'PAY-H004', property: 'Studio Montmartre', amount: '153 €', commission: '17 €', date: '05 oct. 2024' },
    ],
    reviews: [
      { guest: 'Marie Simon', property: 'Villa Toscane', rating: 5, comment: 'Logement exceptionnel, hote tres accueillant. Je recommande vivement !', date: '21 fev. 2025' },
      { guest: 'Pierre Laurent', property: 'Appartement Paris 8e', rating: 4, comment: 'Tres bien situe, propre et confortable. Petit bemol sur le bruit.', date: '06 jan. 2025' },
      { guest: 'Sophie Martin', property: 'Villa Toscane', rating: 5, comment: 'Parfait pour les fetes. Tout etait impeccable.', date: '28 dec. 2024' },
    ],
    disputes: [
      { id: 'DIS-H001', guest: 'Thomas Dubois', property: 'Loft Marais', status: 'RESOLU', date: '12 nov. 2024' },
    ],
    risk: { lastLogin: '05 mar. 2025 a 14:32', ip: '192.168.1.42', device: 'Chrome / macOS', fraudScore: 8 },
  },
  '2': {
    id: 2, name: 'Marie Simon', email: 'marie.simon@email.com', avatar: 'MS',
    phone: '+33 6 23 45 67 89', country: 'France', verified: true,
    joinDate: '03 fev. 2023', language: 'Francais', status: 'ACTIF',
    verificationDate: '10 fev. 2023',
    documents: [
      { name: 'Passeport', date: '03 fev. 2023', status: 'APPROUVE' },
    ],
    addressVerified: true,
    bankVerified: true,
    properties: [
      { name: 'Maison Bordeaux', city: 'Bordeaux', pricePerNight: '150 €', status: 'ACTIF', rating: 4.6, totalBookings: 52 },
      { name: 'Appartement Nice', city: 'Nice', pricePerNight: '110 €', status: 'ACTIF', rating: 4.5, totalBookings: 46 },
    ],
    stats: { totalBookings: 98, totalEarnings: '32 150 €', occupancyRate: '72%', avgRating: 4.6, responseRate: '92%', cancellationRate: '3%' },
    bookings: [
      { property: 'Maison Bordeaux', guest: 'Antoine Moreau', dates: '01-07 mar. 2025', amount: '900 €', status: 'CONFIRMEE' },
      { property: 'Appartement Nice', guest: 'Lucie Bernard', dates: '14-18 fev. 2025', amount: '440 €', status: 'TERMINEE' },
    ],
    payments: [
      { id: 'PAY-H010', property: 'Maison Bordeaux', amount: '810 €', commission: '90 €', date: '09 mar. 2025' },
      { id: 'PAY-H011', property: 'Appartement Nice', amount: '396 €', commission: '44 €', date: '20 fev. 2025' },
    ],
    reviews: [
      { guest: 'Antoine Moreau', property: 'Maison Bordeaux', rating: 5, comment: 'Maison magnifique avec un jardin superbe. Hote parfaite.', date: '08 mar. 2025' },
      { guest: 'Lucie Bernard', property: 'Appartement Nice', rating: 4, comment: 'Bel appartement bien equipe. Vue mer agreable.', date: '19 fev. 2025' },
    ],
    disputes: [],
    risk: { lastLogin: '04 mar. 2025 a 09:15', ip: '10.0.0.58', device: 'Safari / iOS', fraudScore: 5 },
  },
};

const defaultHost = hostsData['1'];

export function AdminHostProfile() {
  const params = useParams();
  const hostId = params?.id as string || '1';
  const host = hostsData[hostId] || defaultHost;

  const [notes, setNotes] = useState<AdminNote[]>([
    { id: 1, author: 'Admin', date: '01 mar. 2025', content: 'Hote fiable avec un excellent taux de reponse. Super host potentiel.' },
  ]);
  const [newNote, setNewNote] = useState('');

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes(prev => [...prev, {
      id: Date.now(),
      author: 'Admin',
      date: '05 mar. 2025',
      content: newNote.trim(),
    }]);
    setNewNote('');
  };

  const getStatusColor = (status: string) => {
    if (status === 'ACTIF') return 'bg-green-100 text-green-700';
    if (status === 'SUSPENDU') return 'bg-orange-100 text-orange-700';
    if (status === 'BANNI') return 'bg-red-100 text-red-700';
    if (status === 'INACTIF') return 'bg-gray-100 text-gray-600';
    return 'bg-gray-100 text-gray-700';
  };

  const getBookingStatusColor = (status: string) => {
    if (status === 'CONFIRMEE') return 'bg-green-100 text-green-700';
    if (status === 'TERMINEE') return 'bg-blue-100 text-blue-700';
    if (status === 'ANNULEE') return 'bg-red-100 text-red-700';
    if (status === 'EN ATTENTE') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getDisputeStatusColor = (status: string) => {
    if (status === 'RESOLU') return 'bg-green-100 text-green-700';
    if (status === 'EN COURS') return 'bg-orange-100 text-orange-700';
    if (status === 'OUVERT') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getFraudScoreColor = (score: number) => {
    if (score <= 20) return 'bg-green-100 text-green-700';
    if (score <= 50) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  const getFraudScoreLabel = (score: number) => {
    if (score <= 20) return 'Faible';
    if (score <= 50) return 'Moyen';
    return 'Eleve';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 mt-16 lg:mt-0">
          <Link href="/admin/hosts" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#111827] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour a la liste
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center text-white text-xl" style={{ fontWeight: 600 }}>
                {host.avatar}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{host.name}</h1>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(host.status)}`} style={{ fontWeight: 600 }}>
                    {host.status}
                  </span>
                  {host.verified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                      <ShieldCheck className="w-3 h-3" /> Verifie
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600" style={{ fontWeight: 600 }}>
                      <Shield className="w-3 h-3" /> Non verifie
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">{host.email}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button className="px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2">
                <PauseCircle className="w-4 h-4" />
                <span className="text-sm" style={{ fontWeight: 500 }}>Suspendre</span>
              </button>
              <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2">
                <Ban className="w-4 h-4" />
                <span className="text-sm" style={{ fontWeight: 500 }}>Bannir</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-600" />
                <span className="text-sm" style={{ fontWeight: 500 }}>Geler paiements</span>
              </button>
              <button className="px-4 py-2 bg-[#111827] text-white rounded-lg hover:bg-[#1f2937] transition-colors flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm" style={{ fontWeight: 600 }}>Envoyer message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info + Verification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg mb-4" style={{ fontWeight: 600 }}>Profil de l&apos;hote</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{host.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Telephone</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{host.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Pays</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{host.country}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Date d&apos;inscription</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{host.joinDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Langue preferee</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{host.language}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg mb-4" style={{ fontWeight: 600 }}>Verification</h2>
            <div className="flex items-center gap-2 mb-4">
              {host.verified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                  <ShieldCheck className="w-4 h-4" /> Identite verifiee
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600" style={{ fontWeight: 600 }}>
                  <Shield className="w-4 h-4" /> Non verifie
                </span>
              )}
              {host.verificationDate && (
                <span className="text-xs text-gray-400">le {host.verificationDate}</span>
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm" style={{ fontWeight: 500 }}>Verification adresse</span>
                </div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${host.addressVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`} style={{ fontWeight: 600 }}>
                  {host.addressVerified ? 'VERIFIE' : 'EN ATTENTE'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm" style={{ fontWeight: 500 }}>Compte bancaire</span>
                </div>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${host.bankVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`} style={{ fontWeight: 600 }}>
                  {host.bankVerified ? 'VERIFIE' : 'EN ATTENTE'}
                </span>
              </div>
            </div>

            {host.documents.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600" style={{ fontWeight: 500 }}>Documents</div>
                {host.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm" style={{ fontWeight: 500 }}>{doc.name}</div>
                        <div className="text-xs text-gray-400">{doc.date}</div>
                      </div>
                    </div>
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Host Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-4 h-4 text-gray-400" />
              <div className="text-xs text-gray-600">RESERVATIONS</div>
            </div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{host.stats.totalBookings}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <div className="text-xs text-gray-600">REVENUS TOTAUX</div>
            </div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{host.stats.totalEarnings}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <div className="text-xs text-gray-600">TAUX OCCUPATION</div>
            </div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{host.stats.occupancyRate}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-gray-400" />
              <div className="text-xs text-gray-600">NOTE MOYENNE</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl" style={{ fontWeight: 600 }}>{host.stats.avgRating}</span>
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div className="text-xs text-gray-600">TAUX REPONSE</div>
            </div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{host.stats.responseRate}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-gray-400" />
              <div className="text-xs text-gray-600">ANNULATIONS</div>
            </div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{host.stats.cancellationRate}</div>
          </div>
        </div>

        {/* Properties */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg" style={{ fontWeight: 600 }}>Logements ({host.properties.length})</h2>
          </div>
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>LOGEMENT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>VILLE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>PRIX / NUIT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>NOTE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>RESERVATIONS</th>
                </tr>
              </thead>
              <tbody>
                {host.properties.map((p, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 500 }}>{p.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{p.city}</td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{p.pricePerNight}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(p.status)}`} style={{ fontWeight: 600 }}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm" style={{ fontWeight: 600 }}>{p.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{p.totalBookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:hidden divide-y divide-gray-100">
            {host.properties.map((p, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm" style={{ fontWeight: 600 }}>{p.name}</div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(p.status)}`} style={{ fontWeight: 600 }}>
                    {p.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Ville: </span>
                    <span>{p.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Prix: </span>
                    <span style={{ fontWeight: 600 }}>{p.pricePerNight}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Note: </span>
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {p.rating}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reservations: </span>
                    <span style={{ fontWeight: 600 }}>{p.totalBookings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings History */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg" style={{ fontWeight: 600 }}>Historique des reservations</h2>
          </div>
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>LOGEMENT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>VOYAGEUR</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATES</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>MONTANT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {host.bookings.map((b, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 500 }}>{b.property}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{b.guest}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{b.dates}</td>
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 600 }}>{b.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getBookingStatusColor(b.status)}`} style={{ fontWeight: 600 }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lg:hidden divide-y divide-gray-100">
            {host.bookings.map((b, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm" style={{ fontWeight: 600 }}>{b.property}</div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getBookingStatusColor(b.status)}`} style={{ fontWeight: 600 }}>
                    {b.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Voyageur: </span>
                    <span>{b.guest}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Montant: </span>
                    <span style={{ fontWeight: 600 }}>{b.amount}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Dates: </span>
                    <span>{b.dates}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payments + Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Payments */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Paiements</h2>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ID</th>
                    <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>LOGEMENT</th>
                    <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>MONTANT</th>
                    <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>COMMISSION</th>
                    <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {host.payments.map((p, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-6 text-sm text-gray-600">{p.id}</td>
                      <td className="py-3 px-6 text-sm" style={{ fontWeight: 500 }}>{p.property}</td>
                      <td className="py-3 px-6 text-sm" style={{ fontWeight: 600 }}>{p.amount}</td>
                      <td className="py-3 px-6 text-sm text-gray-500">{p.commission}</td>
                      <td className="py-3 px-6 text-sm text-gray-600">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100">
              {host.payments.map((p, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm" style={{ fontWeight: 600 }}>{p.amount}</div>
                    <span className="text-xs text-gray-500">{p.date}</span>
                  </div>
                  <div className="text-xs text-gray-500">{p.id} - {p.property}</div>
                  <div className="text-xs text-gray-400 mt-1">Commission: {p.commission}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Disputes */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Litiges</h2>
            </div>
            {host.disputes.length > 0 ? (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ID</th>
                        <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>VOYAGEUR</th>
                        <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>LOGEMENT</th>
                        <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                        <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {host.disputes.map((d, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-6 text-sm text-gray-600">{d.id}</td>
                          <td className="py-3 px-6 text-sm text-gray-600">{d.guest}</td>
                          <td className="py-3 px-6 text-sm" style={{ fontWeight: 500 }}>{d.property}</td>
                          <td className="py-3 px-6">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getDisputeStatusColor(d.status)}`} style={{ fontWeight: 600 }}>
                              {d.status}
                            </span>
                          </td>
                          <td className="py-3 px-6 text-sm text-gray-600">{d.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden divide-y divide-gray-100">
                  {host.disputes.map((d, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm" style={{ fontWeight: 600 }}>{d.property}</div>
                        <div className="text-xs text-gray-500">{d.id} - {d.guest} - {d.date}</div>
                      </div>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getDisputeStatusColor(d.status)}`} style={{ fontWeight: 600 }}>
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">
                Aucun litige
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg" style={{ fontWeight: 600 }}>Avis recus ({host.reviews.length})</h2>
          </div>
          {host.reviews.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {host.reviews.map((r, i) => (
                <div key={i} className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-600" style={{ fontWeight: 600 }}>
                        {r.guest.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm" style={{ fontWeight: 600 }}>{r.guest}</div>
                        <div className="text-xs text-gray-500">{r.property}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {renderStars(r.rating)}
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 ml-0 sm:ml-11">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm">
              Aucun avis
            </div>
          )}
        </div>

        {/* Admin Notes + Risk Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Admin Notes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg mb-4" style={{ fontWeight: 600 }}>Notes internes (admin)</h2>
            <div className="space-y-3 mb-4">
              {notes.map((note) => (
                <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm" style={{ fontWeight: 600 }}>{note.author}</span>
                    <span className="text-xs text-gray-400">{note.date}</span>
                  </div>
                  <div className="text-sm text-gray-600">{note.content}</div>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="text-sm text-gray-400 text-center py-4">Aucune note</div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ajouter une note..."
                rows={2}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm resize-none"
              />
              <button
                onClick={addNote}
                className="px-4 py-2 bg-[#111827] text-white rounded-lg hover:bg-[#1f2937] transition-colors self-end sm:self-stretch"
              >
                <span className="text-sm" style={{ fontWeight: 600 }}>Ajouter</span>
              </button>
            </div>
          </div>

          {/* Risk Monitoring */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg mb-4" style={{ fontWeight: 600 }}>Securite & Risques</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Derniere connexion</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{host.risk.lastLogin}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Adresse IP</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{host.risk.ip}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Monitor className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Appareil</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{host.risk.device}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Score de risque fraude</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${host.risk.fraudScore <= 20 ? 'bg-green-500' : host.risk.fraudScore <= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${host.risk.fraudScore}%` }}
                      />
                    </div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getFraudScoreColor(host.risk.fraudScore)}`} style={{ fontWeight: 600 }}>
                      {host.risk.fraudScore}/100 - {getFraudScoreLabel(host.risk.fraudScore)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
