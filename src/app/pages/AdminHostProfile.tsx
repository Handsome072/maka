'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Ban, PauseCircle, MessageCircle, ShieldCheck, Shield,
  FileText, Monitor, MapPin, Phone, Mail, Globe, Calendar, AlertTriangle,
  Star, DollarSign, Home, TrendingUp, Clock, XCircle, Lock, CheckCircle,
  Trash2, Flag, CreditCard, RotateCcw, Eye, ChevronDown, ChevronUp,
  Building, User, BarChart3, Wallet, Receipt, Loader2
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';
import { adminHostsApi, AdminHostDetail, AdminHostNote } from '@/app/services/api';

type Tab = 'overview' | 'properties' | 'bookings' | 'payments' | 'reviews' | 'disputes';

export function AdminHostProfile() {
  const params = useParams();
  const hostId = params?.id as string;

  const [host, setHost] = useState<AdminHostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showActions, setShowActions] = useState(false);
  const [notes, setNotes] = useState<AdminHostNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const fetchHost = useCallback(async () => {
    if (!hostId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await adminHostsApi.getOne(Number(hostId));
      setHost(response.host);
      setNotes(response.host.notes || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  }, [hostId]);

  useEffect(() => {
    fetchHost();
  }, [fetchHost]);

  const addNote = async () => {
    if (!newNote.trim() || !host) return;
    setAddingNote(true);
    try {
      const response = await adminHostsApi.addNote(host.id, newNote.trim());
      setNotes(prev => [...prev, response.note]);
      setNewNote('');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'ajout de la note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleSuspend = async () => {
    if (!host) return;
    try {
      await adminHostsApi.suspend(host.id);
      setHost(prev => prev ? { ...prev, status: 'SUSPENDU' } : null);
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  const handleBan = async () => {
    if (!host) return;
    try {
      await adminHostsApi.ban(host.id);
      setHost(prev => prev ? { ...prev, status: 'BANNI' } : null);
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  const handleActivate = async () => {
    if (!host) return;
    try {
      await adminHostsApi.activate(host.id);
      setHost(prev => prev ? { ...prev, status: 'ACTIF' } : null);
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'ACTIF') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (status === 'SUSPENDU') return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (status === 'BANNI') return 'bg-red-50 text-red-700 border border-red-200';
    if (status === 'INACTIF') return 'bg-gray-50 text-gray-600 border border-gray-200';
    return 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const getBookingStatusColor = (status: string) => {
    if (status === 'CONFIRMEE') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (status === 'TERMINEE') return 'bg-blue-50 text-blue-700 border border-blue-200';
    if (status === 'ANNULEE') return 'bg-red-50 text-red-700 border border-red-200';
    if (status === 'EN ATTENTE') return 'bg-amber-50 text-amber-700 border border-amber-200';
    return 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const getPaymentStatusColor = (status: string) => {
    if (status === 'VERSE') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (status === 'EN ATTENTE') return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (status === 'ECHOUE') return 'bg-red-50 text-red-700 border border-red-200';
    return 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const getDisputeStatusColor = (status: string) => {
    if (status === 'RESOLU') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (status === 'EN COURS') return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (status === 'OUVERT') return 'bg-red-50 text-red-700 border border-red-200';
    return 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const getRefundStatusColor = (status: string) => {
    if (status === 'EFFECTUE') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (status === 'EN ATTENTE') return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (status === 'REFUSE') return 'bg-red-50 text-red-700 border border-red-200';
    return 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Chargement du profil...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !host) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-sm text-gray-700 mb-3">{error || 'Hote introuvable'}</p>
              <button onClick={fetchHost} className="px-4 py-2 bg-[#111827] text-white rounded-xl hover:bg-[#1f2937] transition-colors text-sm">
                Reessayer
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Vue d\'ensemble' },
    { key: 'properties', label: 'Logements', count: host.properties.length },
    { key: 'bookings', label: 'Reservations', count: host.bookings.length },
    { key: 'payments', label: 'Paiements', count: host.payments.length },
    { key: 'reviews', label: 'Avis', count: host.reviews.length },
    { key: 'disputes', label: 'Litiges', count: host.disputes.length + host.signals.length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Back Link */}
        <div className="mb-6 mt-16 lg:mt-0">
          <Link href="/admin/hosts" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#111827] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Retour a la liste
          </Link>

          {/* Host Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#111827] rounded-full flex items-center justify-center text-white text-lg md:text-xl flex-shrink-0" style={{ fontWeight: 600 }}>
                  {host.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl md:text-2xl" style={{ fontWeight: 700 }}>{host.name}</h1>
                    <span className="text-xs text-gray-400 font-mono">#{host.id}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">{host.email}</div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(host.status)}`} style={{ fontWeight: 600 }}>
                      {host.status}
                    </span>
                    {host.verified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-200" style={{ fontWeight: 500 }}>
                        <ShieldCheck className="w-3 h-3" /> Verifie
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-50 text-gray-500 border border-gray-200" style={{ fontWeight: 500 }}>
                        <Shield className="w-3 h-3" /> Non verifie
                      </span>
                    )}
                    <span className="text-xs text-gray-400">Inscrit le {host.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-2 flex-wrap">
                {!host.verified && (
                  <button className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm" style={{ fontWeight: 500 }}>Approuver</span>
                  </button>
                )}
                <button onClick={handleSuspend} className="px-3.5 py-2 border border-amber-200 text-amber-700 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors flex items-center gap-2">
                  <PauseCircle className="w-4 h-4" />
                  <span className="text-sm" style={{ fontWeight: 500 }}>Suspendre</span>
                </button>
                <button onClick={handleBan} className="px-3.5 py-2 border border-red-200 text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  <span className="text-sm" style={{ fontWeight: 500 }}>Bannir</span>
                </button>
                <button className="px-3.5 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Flag className="w-4 h-4 text-gray-600" />
                  <span className="text-sm" style={{ fontWeight: 500 }}>Fraude</span>
                </button>
                <button className="px-3.5 py-2 border border-red-200 text-red-700 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm" style={{ fontWeight: 500 }}>Supprimer</span>
                </button>
              </div>

              {/* Mobile Actions Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="w-full px-4 py-2.5 bg-[#111827] text-white rounded-xl hover:bg-[#1f2937] transition-colors flex items-center justify-center gap-2"
                >
                  <span className="text-sm" style={{ fontWeight: 600 }}>Actions administrateur</span>
                  {showActions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showActions && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {!host.verified && (
                      <button className="px-3 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                        <CheckCircle className="w-4 h-4" /> Approuver
                      </button>
                    )}
                    <button onClick={handleSuspend} className="px-3 py-2.5 border border-amber-200 text-amber-700 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                      <PauseCircle className="w-4 h-4" /> Suspendre
                    </button>
                    <button onClick={handleBan} className="px-3 py-2.5 border border-red-200 text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                      <Ban className="w-4 h-4" /> Bannir
                    </button>
                    <button className="px-3 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                      <Flag className="w-4 h-4 text-gray-600" /> Fraude
                    </button>
                    <button className="px-3 py-2.5 border border-red-200 text-red-700 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                    <Link href="/admin/payments" className="px-3 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                      <CreditCard className="w-4 h-4 text-gray-600" /> Paiements
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-xs text-gray-500 uppercase" style={{ fontWeight: 600 }}>Reservations</div>
            </div>
            <div className="text-xl md:text-2xl" style={{ fontWeight: 700 }}>{host.stats.totalBookings}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-xs text-gray-500 uppercase" style={{ fontWeight: 600 }}>Revenus</div>
            </div>
            <div className="text-xl md:text-2xl" style={{ fontWeight: 700 }}>{host.stats.totalEarnings}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <div className="text-xs text-gray-500 uppercase" style={{ fontWeight: 600 }}>Occupation</div>
            </div>
            <div className="text-xl md:text-2xl" style={{ fontWeight: 700 }}>{host.stats.occupancyRate}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="text-xs text-gray-500 uppercase" style={{ fontWeight: 600 }}>Note</div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl md:text-2xl" style={{ fontWeight: 700 }}>{host.stats.avgRating}</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-sky-50 rounded-lg flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div className="text-xs text-gray-500 uppercase" style={{ fontWeight: 600 }}>Reponse</div>
            </div>
            <div className="text-xl md:text-2xl" style={{ fontWeight: 700 }}>{host.stats.responseRate}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-rose-50 rounded-lg flex items-center justify-center">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <div className="text-xs text-gray-500 uppercase" style={{ fontWeight: 600 }}>Annulations</div>
            </div>
            <div className="text-xl md:text-2xl" style={{ fontWeight: 700 }}>{host.stats.cancellationRate}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 px-1">
          <div className="flex items-center overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-[#111827] text-[#111827]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontWeight: activeTab === tab.key ? 600 : 400 }}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-500'
                  }`} style={{ fontWeight: 600 }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}

        {/* === OVERVIEW TAB === */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Profile Info + Verification */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-base mb-4" style={{ fontWeight: 600 }}>Informations personnelles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-400">Email</div>
                      <div className="text-sm truncate" style={{ fontWeight: 500 }}>{host.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Telephone</div>
                      <div className="text-sm" style={{ fontWeight: 500 }}>{host.phone || '-'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Localisation</div>
                      <div className="text-sm" style={{ fontWeight: 500 }}>{host.city || '-'}, {host.country || '-'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Date d&apos;inscription</div>
                      <div className="text-sm" style={{ fontWeight: 500 }}>{host.joinDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Langue</div>
                      <div className="text-sm" style={{ fontWeight: 500 }}>{host.language}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Home className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Logements</div>
                      <div className="text-sm" style={{ fontWeight: 500 }}>{host.stats.totalProperties} actifs</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-base mb-4" style={{ fontWeight: 600 }}>Verification identite</h2>
                <div className="flex items-center gap-2 mb-4">
                  {host.verified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-emerald-50 text-emerald-700 border border-emerald-200" style={{ fontWeight: 600 }}>
                      <ShieldCheck className="w-4 h-4" /> Identite verifiee
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-gray-50 text-gray-600 border border-gray-200" style={{ fontWeight: 600 }}>
                      <Shield className="w-4 h-4" /> Non verifiee
                    </span>
                  )}
                  {host.verificationDate && (
                    <span className="text-xs text-gray-400">le {host.verificationDate}</span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Email', verified: host.emailVerified, icon: Mail },
                    { label: 'Telephone', verified: host.phoneVerified, icon: Phone },
                    { label: 'Adresse', verified: host.addressVerified, icon: MapPin },
                    { label: 'Compte bancaire', verified: host.bankVerified, icon: Wallet },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm" style={{ fontWeight: 500 }}>{item.label}</span>
                      </div>
                      {item.verified ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  ))}
                </div>

                {host.documents.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Documents</div>
                    <div className="space-y-2">
                      {host.documents.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm" style={{ fontWeight: 500 }}>{doc.name}</div>
                              <div className="text-xs text-gray-400">{doc.date}</div>
                            </div>
                          </div>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                            doc.status === 'APPROUVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`} style={{ fontWeight: 600 }}>
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Notes + Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Admin Notes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-base mb-4" style={{ fontWeight: 600 }}>Notes internes</h2>
                <div className="space-y-3 mb-4">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 bg-gray-50/80 rounded-xl">
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
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827] text-sm resize-none bg-gray-50"
                  />
                  <button
                    onClick={addNote}
                    disabled={addingNote}
                    className="px-4 py-2.5 bg-[#111827] text-white rounded-xl hover:bg-[#1f2937] transition-colors self-end sm:self-stretch disabled:opacity-50"
                  >
                    <span className="text-sm" style={{ fontWeight: 600 }}>{addingNote ? 'Ajout...' : 'Ajouter'}</span>
                  </button>
                </div>
              </div>

              {/* Risk */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-base mb-4" style={{ fontWeight: 600 }}>Securite & Risques</h2>
                <div className="space-y-3">
                  {[
                    { icon: Calendar, label: 'Derniere connexion', value: host.risk.lastLogin },
                    { icon: Globe, label: 'Adresse IP', value: host.risk.ip },
                    { icon: Monitor, label: 'Appareil', value: host.risk.device },
                    { icon: Clock, label: 'Anciennete du compte', value: host.risk.accountAge },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-xl">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                        <item.icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-400">{item.label}</div>
                        <div className="text-sm truncate" style={{ fontWeight: 500 }}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-gray-50/80 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                        <AlertTriangle className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Score de risque fraude</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-11">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${host.risk.fraudScore <= 20 ? 'bg-emerald-500' : host.risk.fraudScore <= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${host.risk.fraudScore}%` }}
                        />
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        host.risk.fraudScore <= 20 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        host.risk.fraudScore <= 50 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                      }`} style={{ fontWeight: 600 }}>
                        {host.risk.fraudScore}/100
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === PROPERTIES TAB === */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base" style={{ fontWeight: 600 }}>Logements ({host.properties.length})</h2>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Logement</th>
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Type</th>
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Ville</th>
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Prix / nuit</th>
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Note</th>
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Reservations</th>
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {host.properties.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="text-sm" style={{ fontWeight: 600 }}>{p.name}</div>
                        <div className="text-xs text-gray-400">#{p.id}</div>
                      </td>
                      <td className="py-3.5 px-5 text-sm text-gray-600">{p.type}</td>
                      <td className="py-3.5 px-5 text-sm text-gray-600">{p.city}</td>
                      <td className="py-3.5 px-5 text-sm" style={{ fontWeight: 600 }}>{p.pricePerNight}</td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${getStatusColor(p.status)}`} style={{ fontWeight: 600 }}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm" style={{ fontWeight: 600 }}>{p.rating}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-sm" style={{ fontWeight: 600 }}>{p.totalBookings}</td>
                      <td className="py-3.5 px-5">
                        <Link href={`/admin/properties/${p.id}`} className="p-2 hover:bg-blue-50 rounded-lg transition-colors inline-flex">
                          <Eye className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100">
              {host.properties.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{p.name}</div>
                      <div className="text-xs text-gray-400">{p.type} · {p.city}</div>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColor(p.status)}`} style={{ fontWeight: 600 }}>
                      {p.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 bg-gray-50/80 rounded-xl p-3 mb-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Prix</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{p.pricePerNight}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Note</div>
                      <div className="flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-sm" style={{ fontWeight: 600 }}>{p.rating}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Reserv.</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{p.totalBookings}</div>
                    </div>
                  </div>
                  <Link href={`/admin/properties/${p.id}`} className="w-full px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                    <Eye className="w-3.5 h-3.5" /> Voir le logement
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === BOOKINGS TAB === */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-base" style={{ fontWeight: 600 }}>Historique des reservations</h2>
            </div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Logement</th>
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Voyageur</th>
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Dates</th>
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Montant</th>
                    <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {host.bookings.map((b, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-5 text-sm" style={{ fontWeight: 500 }}>{b.property}</td>
                      <td className="py-3.5 px-5 text-sm text-gray-600">{b.guest}</td>
                      <td className="py-3.5 px-5 text-sm text-gray-600">{b.dates}</td>
                      <td className="py-3.5 px-5 text-sm" style={{ fontWeight: 600 }}>{b.amount}</td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${getBookingStatusColor(b.status)}`} style={{ fontWeight: 600 }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100">
              {host.bookings.map((b, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm" style={{ fontWeight: 600 }}>{b.property}</div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getBookingStatusColor(b.status)}`} style={{ fontWeight: 600 }}>
                      {b.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>Voyageur: <span className="text-gray-700">{b.guest}</span></div>
                    <div>Montant: <span className="text-gray-700" style={{ fontWeight: 600 }}>{b.amount}</span></div>
                    <div className="col-span-2">Dates: <span className="text-gray-700">{b.dates}</span></div>
                  </div>
                </div>
              ))}
              {host.bookings.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">Aucune reservation</div>
              )}
            </div>
          </div>
        )}

        {/* === PAYMENTS TAB === */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Revenue Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 600 }}>Revenus totaux</div>
                <div className="text-xl" style={{ fontWeight: 700 }}>{host.stats.totalEarnings}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 600 }}>Versements</div>
                <div className="text-xl" style={{ fontWeight: 700 }}>{host.payments.length}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 600 }}>Remboursements</div>
                <div className="text-xl" style={{ fontWeight: 700 }}>{host.refunds.length}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-xs text-gray-500 mb-1" style={{ fontWeight: 600 }}>Dernier versement</div>
                <div className="text-sm" style={{ fontWeight: 600 }}>{host.payments[0]?.date || '-'}</div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Versements (Payouts)</h2>
              </div>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>ID</th>
                      <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Logement</th>
                      <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Montant brut</th>
                      <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Commission</th>
                      <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Net verse</th>
                      <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Date</th>
                      <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {host.payments.map((p, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3.5 px-5 text-sm text-gray-400 font-mono">{p.id}</td>
                        <td className="py-3.5 px-5 text-sm" style={{ fontWeight: 500 }}>{p.property}</td>
                        <td className="py-3.5 px-5 text-sm" style={{ fontWeight: 500 }}>{p.amount}</td>
                        <td className="py-3.5 px-5 text-sm text-gray-500">{p.commission}</td>
                        <td className="py-3.5 px-5 text-sm" style={{ fontWeight: 700, color: '#111827' }}>{p.net}</td>
                        <td className="py-3.5 px-5 text-sm text-gray-600">{p.date}</td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${getPaymentStatusColor(p.status)}`} style={{ fontWeight: 600 }}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="md:hidden divide-y divide-gray-100">
                {host.payments.map((p, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm" style={{ fontWeight: 600 }}>{p.net}</div>
                        <div className="text-xs text-gray-400">{p.id}</div>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getPaymentStatusColor(p.status)}`} style={{ fontWeight: 600 }}>
                        {p.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div>Logement: <span className="text-gray-700">{p.property}</span></div>
                      <div>Date: <span className="text-gray-700">{p.date}</span></div>
                      <div>Brut: <span className="text-gray-700">{p.amount}</span></div>
                      <div>Commission: <span className="text-gray-700">{p.commission}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Refunds */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Remboursements</h2>
              </div>
              {host.refunds.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>ID</th>
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Voyageur</th>
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Montant</th>
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Raison</th>
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Date</th>
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {host.refunds.map((r, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 px-5 text-sm text-gray-400 font-mono">{r.id}</td>
                            <td className="py-3.5 px-5 text-sm text-gray-600">{r.guest}</td>
                            <td className="py-3.5 px-5 text-sm" style={{ fontWeight: 600 }}>{r.amount}</td>
                            <td className="py-3.5 px-5 text-sm text-gray-600">{r.reason}</td>
                            <td className="py-3.5 px-5 text-sm text-gray-600">{r.date}</td>
                            <td className="py-3.5 px-5">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${getRefundStatusColor(r.status)}`} style={{ fontWeight: 600 }}>
                                {r.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="md:hidden divide-y divide-gray-100">
                    {host.refunds.map((r, i) => (
                      <div key={i} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm" style={{ fontWeight: 600 }}>{r.amount}</div>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getRefundStatusColor(r.status)}`} style={{ fontWeight: 600 }}>
                            {r.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{r.id} · {r.guest} · {r.date}</div>
                        <div className="text-xs text-gray-400 mt-1">{r.reason}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">Aucun remboursement</div>
              )}
            </div>
          </div>
        )}

        {/* === REVIEWS TAB === */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-base" style={{ fontWeight: 600 }}>Avis des voyageurs ({host.reviews.length})</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm" style={{ fontWeight: 700 }}>{host.stats.avgRating}</span>
                </div>
                <span className="text-sm text-gray-400">· {host.stats.totalReviews} avis au total</span>
              </div>
            </div>
            {host.reviews.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {host.reviews.map((r, i) => (
                  <div key={i} className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600 flex-shrink-0" style={{ fontWeight: 600 }}>
                          {r.guest.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm" style={{ fontWeight: 600 }}>{r.guest}</div>
                          <div className="text-xs text-gray-400">{r.property}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-12 sm:ml-0">
                        {renderStars(r.rating)}
                        <span className="text-xs text-gray-400">{r.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 ml-12">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm">Aucun avis</div>
            )}
          </div>
        )}

        {/* === DISPUTES TAB === */}
        {activeTab === 'disputes' && (
          <div className="space-y-6">
            {/* Disputes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Litiges ({host.disputes.length})</h2>
              </div>
              {host.disputes.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>ID</th>
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Voyageur</th>
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Logement</th>
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Raison</th>
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Date</th>
                          <th className="text-left py-3 px-5 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {host.disputes.map((d, i) => (
                          <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 px-5 text-sm text-gray-400 font-mono">{d.id}</td>
                            <td className="py-3.5 px-5 text-sm text-gray-600">{d.guest}</td>
                            <td className="py-3.5 px-5 text-sm" style={{ fontWeight: 500 }}>{d.property}</td>
                            <td className="py-3.5 px-5 text-sm text-gray-600">{d.reason}</td>
                            <td className="py-3.5 px-5 text-sm text-gray-600">{d.date}</td>
                            <td className="py-3.5 px-5">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${getDisputeStatusColor(d.status)}`} style={{ fontWeight: 600 }}>
                                {d.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="md:hidden divide-y divide-gray-100">
                    {host.disputes.map((d, i) => (
                      <div key={i} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-sm" style={{ fontWeight: 600 }}>{d.property}</div>
                            <div className="text-xs text-gray-400">{d.id} · {d.guest}</div>
                          </div>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getDisputeStatusColor(d.status)}`} style={{ fontWeight: 600 }}>
                            {d.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">{d.reason} · {d.date}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">Aucun litige</div>
              )}
            </div>

            {/* Signals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Signalements ({host.signals.length})</h2>
              </div>
              {host.signals.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {host.signals.map((s, i) => (
                    <div key={i} className="p-4 md:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          </div>
                          <div>
                            <div className="text-sm" style={{ fontWeight: 600 }}>{s.type}</div>
                            <div className="text-xs text-gray-400">{s.id} · {s.reporter}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-11 sm:ml-0">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                            s.status === 'TRAITE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`} style={{ fontWeight: 600 }}>
                            {s.status}
                          </span>
                          <span className="text-xs text-gray-400">{s.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 ml-11">{s.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 text-sm">Aucun signalement</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
