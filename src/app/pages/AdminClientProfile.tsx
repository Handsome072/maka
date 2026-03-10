'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Ban, PauseCircle, KeyRound, MessageCircle, ShieldCheck, Shield,
  FileText, Monitor, MapPin, Phone, Mail, Globe, Calendar, AlertTriangle,
  Star, Trash2, Flag, Eye, CreditCard, RotateCcw, Clock, Activity,
  ChevronDown, ChevronUp, X, Loader2
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { adminClientsApi, type AdminClientDetail, type AdminClientNote } from '@/app/services/api';

export function AdminClientProfile() {
  const params = useParams();
  const clientId = params?.id as string || '1';

  const [client, setClient] = useState<AdminClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<AdminClientNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState<'reservations' | 'avis' | 'signalements' | 'activite'>('reservations');
  const [showBookingsAll, setShowBookingsAll] = useState(false);
  const [suspendModal, setSuspendModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [suspectModal, setSuspectModal] = useState(false);

  const fetchClient = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminClientsApi.getOne(Number(clientId));
      setClient(response.client);
      setNotes(response.client.notes || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement du client';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const addNote = async () => {
    if (!newNote.trim() || !client) return;
    try {
      const response = await adminClientsApi.addNote(client.id, newNote.trim());
      setNotes(prev => [...prev, response.note]);
      setNewNote('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      alert(message);
    }
  };

  const handleSuspend = async () => {
    if (!client) return;
    try {
      if (client.status === 'SUSPENDU' || client.status === 'BANNI') {
        await adminClientsApi.activate(client.id);
      } else {
        await adminClientsApi.suspend(client.id);
      }
      setSuspendModal(false);
      fetchClient();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      alert(message);
    }
  };

  const handleDelete = async () => {
    if (!client) return;
    try {
      await adminClientsApi.delete(client.id);
      setDeleteModal(false);
      window.location.href = '/admin/clients';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      alert(message);
    }
  };

  const handleToggleSuspect = async () => {
    if (!client) return;
    try {
      await adminClientsApi.toggleSuspect(client.id);
      setSuspectModal(false);
      fetchClient();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      alert(message);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'ACTIF') return 'bg-green-50 text-green-700';
    if (status === 'SUSPENDU') return 'bg-orange-50 text-orange-700';
    if (status === 'BANNI') return 'bg-red-50 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getBookingStatusColor = (status: string) => {
    if (status === 'CONFIRMEE') return 'bg-green-50 text-green-700';
    if (status === 'TERMINEE') return 'bg-blue-50 text-blue-700';
    if (status === 'ANNULEE') return 'bg-red-50 text-red-700';
    if (status === 'EN ATTENTE') return 'bg-orange-50 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getPaymentStatusColor = (status: string) => {
    if (status === 'REUSSI') return 'bg-green-50 text-green-700';
    if (status === 'REMBOURSE') return 'bg-blue-50 text-blue-700';
    if (status === 'ECHOUE') return 'bg-red-50 text-red-700';
    if (status === 'EN ATTENTE') return 'bg-orange-50 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getDisputeStatusColor = (status: string) => {
    if (status === 'RESOLU') return 'bg-green-50 text-green-700';
    if (status === 'EN COURS') return 'bg-orange-50 text-orange-700';
    if (status === 'OUVERT') return 'bg-red-50 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getReportStatusColor = (status: string) => {
    if (status === 'RESOLU') return 'bg-green-50 text-green-700';
    if (status === 'EN COURS') return 'bg-orange-50 text-orange-700';
    if (status === 'OUVERT') return 'bg-red-50 text-red-700';
    if (status === 'REJETE') return 'bg-gray-100 text-gray-500';
    return 'bg-gray-100 text-gray-700';
  };

  const getRefundStatusColor = (status: string) => {
    if (status === 'EFFECTUE') return 'bg-green-50 text-green-700';
    if (status === 'EN ATTENTE') return 'bg-orange-50 text-orange-700';
    if (status === 'REFUSE') return 'bg-red-50 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getFraudScoreColor = (score: number) => {
    if (score <= 20) return 'bg-green-500';
    if (score <= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getFraudScoreBadge = (score: number) => {
    if (score <= 20) return { bg: 'bg-green-50 text-green-700', label: 'Faible' };
    if (score <= 50) return { bg: 'bg-orange-50 text-orange-700', label: 'Moyen' };
    return { bg: 'bg-red-50 text-red-700', label: 'Eleve' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500">Chargement du profil client...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <p className="text-sm text-red-600">{error || 'Client introuvable'}</p>
              <div className="flex gap-3">
                <Link href="/admin/clients" className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Retour a la liste
                </Link>
                <button onClick={fetchClient} className="px-4 py-2 bg-[#111827] text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reessayer
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const displayedBookings = showBookingsAll ? client.bookings : client.bookings.slice(0, 4);

  const tabs = [
    { key: 'reservations' as const, label: 'Reservations', count: client.bookings.length },
    { key: 'avis' as const, label: 'Avis recus', count: client.reviews.length },
    { key: 'signalements' as const, label: 'Signalements', count: client.reports.length },
    { key: 'activite' as const, label: 'Activite', count: client.activityLog.length },
  ];

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

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#111827] rounded-full flex items-center justify-center text-white text-lg md:text-xl flex-shrink-0" style={{ fontWeight: 600 }}>
                {client.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl md:text-2xl lg:text-3xl" style={{ fontWeight: 600 }}>{client.name}</h1>
                  <span className="text-xs text-gray-400 font-mono">#{client.id}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getStatusColor(client.status)}`} style={{ fontWeight: 600 }}>
                    {client.status}
                  </span>
                  {client.verified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700" style={{ fontWeight: 600 }}>
                      <ShieldCheck className="w-3 h-3" /> Verifie
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-500" style={{ fontWeight: 600 }}>
                      <Shield className="w-3 h-3" /> Non verifie
                    </span>
                  )}
                  {client.isSuspect && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-orange-50 text-orange-700" style={{ fontWeight: 600 }}>
                      <AlertTriangle className="w-3 h-3" /> Suspect
                    </span>
                  )}
                  {client.averageRating > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700" style={{ fontWeight: 600 }}>
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> {client.averageRating.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">{client.email}</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSuspectModal(true)}
                className="px-3 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 transition-colors flex items-center gap-1.5"
              >
                <Flag className="w-4 h-4" />
                <span className="text-xs" style={{ fontWeight: 500 }}>Suspect</span>
              </button>
              <button
                onClick={() => setSuspendModal(true)}
                className="px-3 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-1.5"
              >
                <PauseCircle className="w-4 h-4" />
                <span className="text-xs" style={{ fontWeight: 500 }}>Suspendre</span>
              </button>
              <button
                onClick={() => setDeleteModal(true)}
                className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-xs" style={{ fontWeight: 500 }}>Supprimer</span>
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-gray-600" />
                <span className="text-xs" style={{ fontWeight: 500 }}>Reset MDP</span>
              </button>
              <button className="px-3 py-2 bg-[#111827] text-white rounded-lg hover:bg-[#1f2937] transition-colors flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs" style={{ fontWeight: 600 }}>Message</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info + Verification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-base md:text-lg mb-4" style={{ fontWeight: 600 }}>Informations personnelles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-400">Email</div>
                  <div className="text-sm truncate" style={{ fontWeight: 500 }}>{client.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Telephone</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Pays</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.country}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Inscription</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.joinDate}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Langue</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.language}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Total depense</div>
                  <div className="text-sm" style={{ fontWeight: 600 }}>{client.totalSpent}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-base md:text-lg mb-4" style={{ fontWeight: 600 }}>Verification d&apos;identite</h2>
            <div className="flex items-center gap-2 mb-4">
              {client.verified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-green-50 text-green-700" style={{ fontWeight: 600 }}>
                  <ShieldCheck className="w-4 h-4" /> Identite verifiee
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-500" style={{ fontWeight: 600 }}>
                  <Shield className="w-4 h-4" /> Non verifie
                </span>
              )}
              {client.verificationDate && (
                <span className="text-xs text-gray-400">le {client.verificationDate}</span>
              )}
            </div>
            {client.documents.length > 0 && (
              <div className="space-y-2.5">
                <div className="text-sm text-gray-500" style={{ fontWeight: 500 }}>Documents soumis</div>
                {client.documents.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm truncate" style={{ fontWeight: 500 }}>{doc.name}</div>
                        <div className="text-xs text-gray-400">{doc.date}</div>
                      </div>
                    </div>
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700 flex-shrink-0 ml-2" style={{ fontWeight: 600 }}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-5">
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-400 mb-1" style={{ fontWeight: 500 }}>RESERVATIONS</div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{client.totalBookings}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-400 mb-1" style={{ fontWeight: 500 }}>ANNULATIONS</div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{client.cancellations}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-400 mb-1" style={{ fontWeight: 500 }}>AVIS LAISSES</div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{client.reviewsLeft}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-400 mb-1" style={{ fontWeight: 500 }}>AVIS RECUS</div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{client.reviewsReceived}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-400 mb-1" style={{ fontWeight: 500 }}>LITIGES</div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{client.disputes.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-100">
            <div className="text-xs text-gray-400 mb-1" style={{ fontWeight: 500 }}>REMBOURSEMENTS</div>
            <div className="text-2xl" style={{ fontWeight: 600 }}>{client.refunds.length}</div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-5">
          {/* Tab navigation */}
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 md:px-6 py-3.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-[#111827] text-[#111827]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  style={{ fontWeight: activeTab === tab.key ? 600 : 400 }}
                >
                  {tab.label}
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab: Reservations */}
          {activeTab === 'reservations' && (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80">
                      <th className="text-left py-3 px-5 text-xs text-gray-500" style={{ fontWeight: 600 }}>LOGEMENT</th>
                      <th className="text-left py-3 px-5 text-xs text-gray-500" style={{ fontWeight: 600 }}>HOTE</th>
                      <th className="text-left py-3 px-5 text-xs text-gray-500" style={{ fontWeight: 600 }}>DATES</th>
                      <th className="text-left py-3 px-5 text-xs text-gray-500" style={{ fontWeight: 600 }}>MONTANT</th>
                      <th className="text-left py-3 px-5 text-xs text-gray-500" style={{ fontWeight: 600 }}>STATUT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedBookings.map((b, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3.5 px-5 text-sm" style={{ fontWeight: 500 }}>{b.property}</td>
                        <td className="py-3.5 px-5 text-sm text-gray-600">{b.host}</td>
                        <td className="py-3.5 px-5 text-sm text-gray-500">{b.dates}</td>
                        <td className="py-3.5 px-5 text-sm" style={{ fontWeight: 600 }}>{b.amount}</td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getBookingStatusColor(b.status)}`} style={{ fontWeight: 600 }}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden divide-y divide-gray-100">
                {displayedBookings.map((b, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm" style={{ fontWeight: 600 }}>{b.property}</div>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getBookingStatusColor(b.status)}`} style={{ fontWeight: 600 }}>
                        {b.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Hote: </span>
                        <span>{b.host}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Montant: </span>
                        <span style={{ fontWeight: 600 }}>{b.amount}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Dates: </span>
                        <span>{b.dates}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {client.bookings.length > 4 && (
                <div className="p-4 border-t border-gray-100 text-center">
                  <button
                    onClick={() => setShowBookingsAll(!showBookingsAll)}
                    className="text-sm text-[#111827] hover:underline inline-flex items-center gap-1"
                    style={{ fontWeight: 500 }}
                  >
                    {showBookingsAll ? 'Voir moins' : `Voir toutes les reservations (${client.bookings.length})`}
                    {showBookingsAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Tab: Avis recus */}
          {activeTab === 'avis' && (
            <div className="divide-y divide-gray-100">
              {client.reviews.length > 0 ? client.reviews.map((review) => (
                <div key={review.id} className="p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                      {review.hostAvatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1.5">
                        <div>
                          <span className="text-sm" style={{ fontWeight: 600 }}>{review.hostName}</span>
                          <span className="text-xs text-gray-400 ml-2">pour {review.property}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-gray-400 text-sm">Aucun avis recu</div>
              )}
            </div>
          )}

          {/* Tab: Signalements */}
          {activeTab === 'signalements' && (
            <div className="divide-y divide-gray-100">
              {client.reports.length > 0 ? client.reports.map((report) => (
                <div key={report.id} className="p-4 md:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm" style={{ fontWeight: 600 }}>{report.reason}</span>
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getReportStatusColor(report.status)}`} style={{ fontWeight: 600 }}>
                          {report.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Signale par {report.reporter} le {report.date}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{report.description}</p>
                </div>
              )) : (
                <div className="p-12 text-center text-gray-400 text-sm">Aucun signalement</div>
              )}
            </div>
          )}

          {/* Tab: Activite */}
          {activeTab === 'activite' && (
            <div className="divide-y divide-gray-100">
              {client.activityLog.length > 0 ? client.activityLog.map((log) => (
                <div key={log.id} className="p-4 md:p-5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {log.action === 'Connexion' && <Monitor className="w-4 h-4 text-gray-400" />}
                    {log.action === 'Reservation' && <Calendar className="w-4 h-4 text-blue-500" />}
                    {log.action === 'Paiement' && <CreditCard className="w-4 h-4 text-green-500" />}
                    {log.action === 'Modification profil' && <Activity className="w-4 h-4 text-purple-500" />}
                    {log.action === 'Avis' && <Star className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <span className="text-sm" style={{ fontWeight: 500 }}>{log.action}</span>
                        <span className="text-sm text-gray-500 ml-1">- {log.detail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{log.date}</span>
                        <span className="text-gray-300">|</span>
                        <span>{log.ip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-gray-400 text-sm">Aucune activite enregistree</div>
              )}
            </div>
          )}
        </div>

        {/* Payments + Disputes + Refunds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Payments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base" style={{ fontWeight: 600 }}>Paiements</h2>
              <Link href="/admin/payments" className="text-xs text-gray-400 hover:text-[#111827] transition-colors flex items-center gap-1">
                <Eye className="w-3 h-3" /> Tout voir
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {client.payments.map((p, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm" style={{ fontWeight: 600 }}>{p.amount}</div>
                    <div className="text-xs text-gray-400">{p.id} - {p.date}</div>
                  </div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs flex-shrink-0 ${getPaymentStatusColor(p.status)}`} style={{ fontWeight: 600 }}>
                    {p.status}
                  </span>
                </div>
              ))}
              {client.payments.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">Aucun paiement</div>
              )}
            </div>
          </div>

          {/* Disputes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base" style={{ fontWeight: 600 }}>Litiges</h2>
              <Link href="/admin/disputes" className="text-xs text-gray-400 hover:text-[#111827] transition-colors flex items-center gap-1">
                <Eye className="w-3 h-3" /> Tout voir
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {client.disputes.length > 0 ? client.disputes.map((d, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm" style={{ fontWeight: 600 }}>{d.property}</span>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getDisputeStatusColor(d.status)}`} style={{ fontWeight: 600 }}>
                      {d.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{d.id} - {d.date}</div>
                  <div className="text-xs text-gray-500 mt-1.5">{d.description}</div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-400 text-sm">Aucun litige</div>
              )}
            </div>
          </div>

          {/* Refunds */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base" style={{ fontWeight: 600 }}>Remboursements</h2>
              <Link href="/admin/refunds" className="text-xs text-gray-400 hover:text-[#111827] transition-colors flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> Tout voir
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {client.refunds.length > 0 ? client.refunds.map((r, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm" style={{ fontWeight: 600 }}>{r.amount}</span>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getRefundStatusColor(r.status)}`} style={{ fontWeight: 600 }}>
                      {r.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">{r.id} - {r.date}</div>
                  <div className="text-xs text-gray-500 mt-1">{r.reason}</div>
                </div>
              )) : (
                <div className="p-8 text-center text-gray-400 text-sm">Aucun remboursement</div>
              )}
            </div>
          </div>
        </div>

        {/* Admin Notes + Risk Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Admin Notes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-base md:text-lg mb-4" style={{ fontWeight: 600 }}>Notes internes</h2>
            <div className="space-y-2.5 mb-4">
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm resize-none"
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
            <h2 className="text-base md:text-lg mb-4" style={{ fontWeight: 600 }}>Monitoring des risques</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400">Derniere connexion</div>
                  <div className="text-sm" style={{ fontWeight: 500 }}>{client.risk.lastLogin}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400">Adresse IP</div>
                    <div className="text-sm font-mono" style={{ fontWeight: 500 }}>{client.risk.ip}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400">Appareil</div>
                    <div className="text-sm" style={{ fontWeight: 500 }}>{client.risk.device}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-400 mb-1">Connexions totales</div>
                  <div className="text-lg" style={{ fontWeight: 600 }}>{client.risk.loginCount}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-400 mb-1">Tentatives echouees</div>
                  <div className="text-lg" style={{ fontWeight: 600 }}>{client.risk.failedLogins}</div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Score de risque fraude</span>
                  </div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${getFraudScoreBadge(client.risk.fraudScore).bg}`} style={{ fontWeight: 600 }}>
                    {client.risk.fraudScore}/100 - {getFraudScoreBadge(client.risk.fraudScore).label}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getFraudScoreColor(client.risk.fraudScore)}`}
                    style={{ width: `${client.risk.fraudScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Suspend Modal */}
      {suspendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSuspendModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <PauseCircle className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg" style={{ fontWeight: 600 }}>Suspendre le compte</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Etes-vous sur de vouloir suspendre le compte de <span style={{ fontWeight: 600 }}>{client.name}</span> ?
              L&apos;utilisateur ne pourra plus acceder a la plateforme.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setSuspendModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={handleSuspend} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm" style={{ fontWeight: 600 }}>
                {client.status === 'SUSPENDU' || client.status === 'BANNI' ? 'Reactiver' : 'Suspendre'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg" style={{ fontWeight: 600 }}>Supprimer le compte</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Etes-vous sur de vouloir supprimer le compte de <span style={{ fontWeight: 600 }}>{client.name}</span> ?
            </p>
            <p className="text-xs text-red-500 mb-6" style={{ fontWeight: 500 }}>
              Cette action est irreversible. Toutes les donnees seront supprimees.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setDeleteModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm" style={{ fontWeight: 600 }}>
                Supprimer definitivement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspect Modal */}
      {suspectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSuspectModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Flag className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-lg" style={{ fontWeight: 600 }}>Marquer comme suspect</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Marquer <span style={{ fontWeight: 600 }}>{client.name}</span> comme utilisateur suspect ?
              Cette action ajoutera un indicateur visible par tous les administrateurs.
            </p>
            <textarea
              placeholder="Raison (optionnel)..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm resize-none mb-4"
            />
            <div className="flex items-center gap-3 justify-end">
              <button onClick={() => setSuspectModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={handleToggleSuspect} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm" style={{ fontWeight: 600 }}>
                {client.isSuspect ? 'Retirer des suspects' : 'Marquer suspect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
