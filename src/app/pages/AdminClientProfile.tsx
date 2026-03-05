'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Ban, PauseCircle, KeyRound, MessageCircle, ShieldCheck, Shield,
  FileText, Monitor, MapPin, Phone, Mail, Globe, Calendar, AlertTriangle
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

interface AdminNote {
  id: number;
  author: string;
  date: string;
  content: string;
}

const clientsData: Record<string, {
  id: number; name: string; email: string; avatar: string; phone: string;
  country: string; verified: boolean; joinDate: string; language: string;
  status: 'ACTIF' | 'SUSPENDU' | 'BANNI';
  verificationDate: string | null;
  documents: { name: string; date: string; status: string }[];
  totalBookings: number; cancellations: number; reviewsLeft: number; reviewsReceived: number;
  bookings: { property: string; host: string; dates: string; amount: string; status: string }[];
  payments: { id: string; amount: string; status: string; date: string }[];
  disputes: { id: string; property: string; status: string; date: string }[];
  risk: { lastLogin: string; ip: string; device: string; fraudScore: number };
}> = {
  '1': {
    id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', avatar: 'JD',
    phone: '+33 6 12 34 56 78', country: 'France', verified: true,
    joinDate: '15 jan. 2024', language: 'Francais', status: 'ACTIF',
    verificationDate: '20 jan. 2024',
    documents: [
      { name: 'Carte d\'identite', date: '15 jan. 2024', status: 'APPROUVE' },
      { name: 'Justificatif de domicile', date: '15 jan. 2024', status: 'APPROUVE' },
    ],
    totalBookings: 12, cancellations: 1, reviewsLeft: 10, reviewsReceived: 8,
    bookings: [
      { property: 'Villa Toscane', host: 'Marie Simon', dates: '15-20 fev. 2025', amount: '1 250 $', status: 'CONFIRMEE' },
      { property: 'Appartement Paris 8e', host: 'Pierre Laurent', dates: '01-05 jan. 2025', amount: '890 $', status: 'TERMINEE' },
      { property: 'Chalet Alpes', host: 'Sophie Martin', dates: '20-27 dec. 2024', amount: '2 100 $', status: 'TERMINEE' },
      { property: 'Studio Lyon', host: 'Thomas Dubois', dates: '10-12 nov. 2024', amount: '340 $', status: 'ANNULEE' },
    ],
    payments: [
      { id: 'PAY-001', amount: '1 250 $', status: 'REUSSI', date: '10 fev. 2025' },
      { id: 'PAY-002', amount: '890 $', status: 'REUSSI', date: '28 dec. 2024' },
      { id: 'PAY-003', amount: '2 100 $', status: 'REUSSI', date: '15 dec. 2024' },
      { id: 'PAY-004', amount: '340 $', status: 'REMBOURSE', date: '05 nov. 2024' },
    ],
    disputes: [
      { id: 'DIS-001', property: 'Studio Lyon', status: 'RESOLU', date: '12 nov. 2024' },
    ],
    risk: { lastLogin: '05 mar. 2025 a 14:32', ip: '192.168.1.42', device: 'Chrome / macOS', fraudScore: 12 },
  },
  '2': {
    id: 2, name: 'Marie Simon', email: 'marie.simon@email.com', avatar: 'MS',
    phone: '+33 6 23 45 67 89', country: 'France', verified: true,
    joinDate: '03 fev. 2024', language: 'Francais', status: 'ACTIF',
    verificationDate: '10 fev. 2024',
    documents: [
      { name: 'Passeport', date: '03 fev. 2024', status: 'APPROUVE' },
    ],
    totalBookings: 8, cancellations: 0, reviewsLeft: 7, reviewsReceived: 6,
    bookings: [
      { property: 'Maison Bordeaux', host: 'Antoine Moreau', dates: '01-07 mar. 2025', amount: '1 680 $', status: 'CONFIRMEE' },
      { property: 'Appartement Nice', host: 'Lucie Bernard', dates: '14-18 fev. 2025', amount: '720 $', status: 'TERMINEE' },
    ],
    payments: [
      { id: 'PAY-010', amount: '1 680 $', status: 'REUSSI', date: '25 fev. 2025' },
      { id: 'PAY-011', amount: '720 $', status: 'REUSSI', date: '10 fev. 2025' },
    ],
    disputes: [],
    risk: { lastLogin: '04 mar. 2025 a 09:15', ip: '10.0.0.58', device: 'Safari / iOS', fraudScore: 5 },
  },
};

// Default client for unknown IDs
const defaultClient = clientsData['1'];

export function AdminClientProfile() {
  const params = useParams();
  const clientId = params?.id as string || '1';
  const client = clientsData[clientId] || defaultClient;

  const [notes, setNotes] = useState<AdminNote[]>([
    { id: 1, author: 'Admin', date: '01 mar. 2025', content: 'Client VIP - a effectue plus de 10 reservations. Offrir un code promo pour fidelisation.' },
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
    return 'bg-gray-100 text-gray-700';
  };

  const getBookingStatusColor = (status: string) => {
    if (status === 'CONFIRMEE') return 'bg-green-100 text-green-700';
    if (status === 'TERMINEE') return 'bg-blue-100 text-blue-700';
    if (status === 'ANNULEE') return 'bg-red-100 text-red-700';
    if (status === 'EN ATTENTE') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getPaymentStatusColor = (status: string) => {
    if (status === 'REUSSI') return 'bg-green-100 text-green-700';
    if (status === 'REMBOURSE') return 'bg-blue-100 text-blue-700';
    if (status === 'ECHOUE') return 'bg-red-100 text-red-700';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8 mt-16 lg:mt-0">
          <Link href="/admin/clients" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#111827] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour a la liste
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center text-white text-xl" style={{ fontWeight: 600 }}>
                {client.avatar}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{client.name}</h1>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(client.status)}`} style={{ fontWeight: 600 }}>
                    {client.status}
                  </span>
                  {client.verified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                      <ShieldCheck className="w-3 h-3" /> Verifie
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-600" style={{ fontWeight: 600 }}>
                      <Shield className="w-3 h-3" /> Non verifie
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-1">{client.email}</div>
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
                <KeyRound className="w-4 h-4 text-gray-600" />
                <span className="text-sm" style={{ fontWeight: 500 }}>Reset MDP</span>
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
            <h2 className="text-lg mb-4" style={{ fontWeight: 600 }}>Informations du profil</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Telephone</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Pays</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.country}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Date d&apos;inscription</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.joinDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500">Langue preferee</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.language}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg mb-4" style={{ fontWeight: 600 }}>Verification d&apos;identite</h2>
            <div className="flex items-center gap-2 mb-4">
              {client.verified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-green-100 text-green-700" style={{ fontWeight: 600 }}>
                  <ShieldCheck className="w-4 h-4" /> Identite verifiee
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600" style={{ fontWeight: 600 }}>
                  <Shield className="w-4 h-4" /> Non verifie
                </span>
              )}
              {client.verificationDate && (
                <span className="text-xs text-gray-400">le {client.verificationDate}</span>
              )}
            </div>
            {client.documents.length > 0 && (
              <div className="space-y-3">
                <div className="text-sm text-gray-600" style={{ fontWeight: 500 }}>Documents</div>
                {client.documents.map((doc, i) => (
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

        {/* Activity Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">RESERVATIONS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{client.totalBookings}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">ANNULATIONS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{client.cancellations}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">AVIS LAISSES</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{client.reviewsLeft}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-2">AVIS RECUS</div>
            <div className="text-3xl" style={{ fontWeight: 600 }}>{client.reviewsReceived}</div>
          </div>
        </div>

        {/* Bookings History */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-lg" style={{ fontWeight: 600 }}>Historique des reservations</h2>
          </div>
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>LOGEMENT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>HOTE</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATES</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>MONTANT</th>
                  <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                </tr>
              </thead>
              <tbody>
                {client.bookings.map((b, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm" style={{ fontWeight: 500 }}>{b.property}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{b.host}</td>
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
          {/* Mobile */}
          <div className="lg:hidden divide-y divide-gray-100">
            {client.bookings.map((b, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm" style={{ fontWeight: 600 }}>{b.property}</div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getBookingStatusColor(b.status)}`} style={{ fontWeight: 600 }}>
                    {b.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Hote: </span>
                    <span>{b.host}</span>
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

        {/* Payments History + Disputes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Payments */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Historique des paiements</h2>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ID</th>
                    <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>MONTANT</th>
                    <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                    <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {client.payments.map((p, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-6 text-sm text-gray-600">{p.id}</td>
                      <td className="py-3 px-6 text-sm" style={{ fontWeight: 600 }}>{p.amount}</td>
                      <td className="py-3 px-6">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getPaymentStatusColor(p.status)}`} style={{ fontWeight: 600 }}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-600">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100">
              {client.payments.map((p, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{p.amount}</div>
                    <div className="text-xs text-gray-500">{p.id} - {p.date}</div>
                  </div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getPaymentStatusColor(p.status)}`} style={{ fontWeight: 600 }}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Disputes */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Litiges</h2>
            </div>
            {client.disputes.length > 0 ? (
              <>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>ID</th>
                        <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>LOGEMENT</th>
                        <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUT</th>
                        <th className="text-left py-3 px-6 text-xs text-gray-600" style={{ fontWeight: 600 }}>DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.disputes.map((d, i) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-6 text-sm text-gray-600">{d.id}</td>
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
                  {client.disputes.map((d, i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm" style={{ fontWeight: 600 }}>{d.property}</div>
                        <div className="text-xs text-gray-500">{d.id} - {d.date}</div>
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
            <h2 className="text-lg mb-4" style={{ fontWeight: 600 }}>Monitoring des risques</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Derniere connexion</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.risk.lastLogin}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Adresse IP</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.risk.ip}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Monitor className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Appareil</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.risk.device}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">Score de risque fraude</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${client.risk.fraudScore <= 20 ? 'bg-green-500' : client.risk.fraudScore <= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${client.risk.fraudScore}%` }}
                      />
                    </div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getFraudScoreColor(client.risk.fraudScore)}`} style={{ fontWeight: 600 }}>
                      {client.risk.fraudScore}/100 - {getFraudScoreLabel(client.risk.fraudScore)}
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
