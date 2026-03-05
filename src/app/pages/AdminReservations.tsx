'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, Eye, Edit, Filter, Download, X, ChevronLeft, ChevronRight,
  CheckCircle, Clock, XCircle, CalendarDays, Home, DollarSign, TrendingUp,
  AlertTriangle, Ban, RefreshCw, Shield, UserX, ArrowLeft, CreditCard,
  Calendar, User, MapPin, Phone, Mail, MessageSquare, MoreHorizontal
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

// ── Types ────────────────────────────────────────────────────────────────────

type ReservationStatus = 'Confirmee' | 'En attente' | 'En cours' | 'Terminee' | 'Annulee' | 'Litige';
type PaymentStatus = 'Paye' | 'En attente' | 'Rembourse' | 'Echoue' | 'Partiel';

interface Reservation {
  id: string;
  propertyPhoto: string;
  propertyName: string;
  propertyId: number;
  host: { name: string; avatar: string; id: number; email: string; phone: string };
  guest: { name: string; avatar: string; id: number; email: string; phone: string };
  checkIn: string;
  checkOut: string;
  nights: number;
  totalAmount: number;
  commission: number;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const reservations: Reservation[] = [
  {
    id: 'RES-2401', propertyPhoto: '/images/properties/villa-toscane.jpg', propertyName: 'Villa Toscane', propertyId: 1,
    host: { name: 'Jean Dupont', avatar: 'JD', id: 1, email: 'jean.dupont@email.com', phone: '+33 6 12 34 56 78' },
    guest: { name: 'Alexandre Leroy', avatar: 'AL', id: 10, email: 'alex.leroy@email.com', phone: '+33 6 98 76 54 32' },
    checkIn: '2025-03-15', checkOut: '2025-03-22', nights: 7, totalAmount: 1750, commission: 262.50,
    status: 'Confirmee', paymentStatus: 'Paye', createdAt: '2025-02-28'
  },
  {
    id: 'RES-2402', propertyPhoto: '/images/properties/apt-paris.jpg', propertyName: 'Appartement Paris 8e', propertyId: 2,
    host: { name: 'Marie Simon', avatar: 'MS', id: 2, email: 'marie.simon@email.com', phone: '+33 6 11 22 33 44' },
    guest: { name: 'Camille Bernard', avatar: 'CB', id: 11, email: 'camille.bernard@email.com', phone: '+33 6 55 66 77 88' },
    checkIn: '2025-03-20', checkOut: '2025-03-27', nights: 7, totalAmount: 840, commission: 126,
    status: 'En attente', paymentStatus: 'En attente', createdAt: '2025-03-01'
  },
  {
    id: 'RES-2403', propertyPhoto: '/images/properties/chalet-alpes.jpg', propertyName: 'Chalet des Alpes', propertyId: 3,
    host: { name: 'Pierre Laurent', avatar: 'PL', id: 3, email: 'pierre.laurent@email.com', phone: '+33 6 22 33 44 55' },
    guest: { name: 'Lucas Bouchard', avatar: 'LB', id: 12, email: 'lucas.bouchard@email.com', phone: '+33 6 44 55 66 77' },
    checkIn: '2025-03-10', checkOut: '2025-03-17', nights: 7, totalAmount: 1260, commission: 189,
    status: 'En cours', paymentStatus: 'Paye', createdAt: '2025-02-20'
  },
  {
    id: 'RES-2404', propertyPhoto: '/images/properties/studio-moderne.jpg', propertyName: 'Studio Moderne Centre', propertyId: 4,
    host: { name: 'Sophie Martin', avatar: 'SM', id: 4, email: 'sophie.martin@email.com', phone: '+33 6 33 44 55 66' },
    guest: { name: 'Sophie Moreau', avatar: 'SO', id: 13, email: 'sophie.moreau@email.com', phone: '+33 6 77 88 99 00' },
    checkIn: '2025-02-05', checkOut: '2025-02-12', nights: 7, totalAmount: 595, commission: 89.25,
    status: 'Terminee', paymentStatus: 'Paye', createdAt: '2025-01-20'
  },
  {
    id: 'RES-2405', propertyPhoto: '/images/properties/maison-mer.jpg', propertyName: 'Maison Bord de Mer', propertyId: 5,
    host: { name: 'Thomas Dubois', avatar: 'TD', id: 5, email: 'thomas.dubois@email.com', phone: '+33 6 44 55 66 77' },
    guest: { name: 'Thomas Petit', avatar: 'TP', id: 14, email: 'thomas.petit@email.com', phone: '+33 6 88 99 00 11' },
    checkIn: '2025-02-25', checkOut: '2025-03-04', nights: 7, totalAmount: 2240, commission: 336,
    status: 'Annulee', paymentStatus: 'Rembourse', createdAt: '2025-02-10'
  },
  {
    id: 'RES-2406', propertyPhoto: '/images/properties/apt-centre.jpg', propertyName: 'Appartement Centre Historique', propertyId: 6,
    host: { name: 'Lucie Bernard', avatar: 'LB', id: 6, email: 'lucie.bernard@email.com', phone: '+33 6 55 66 77 88' },
    guest: { name: 'Julie Martin', avatar: 'JM', id: 15, email: 'julie.martin@email.com', phone: '+33 6 99 00 11 22' },
    checkIn: '2025-03-28', checkOut: '2025-04-04', nights: 7, totalAmount: 665, commission: 99.75,
    status: 'Confirmee', paymentStatus: 'Paye', createdAt: '2025-03-02'
  },
  {
    id: 'RES-2407', propertyPhoto: '/images/properties/villa-luxe.jpg', propertyName: 'Villa Luxe Croisette', propertyId: 7,
    host: { name: 'Antoine Moreau', avatar: 'AM', id: 7, email: 'antoine.moreau@email.com', phone: '+33 6 66 77 88 99' },
    guest: { name: 'Marc Rousseau', avatar: 'MR', id: 16, email: 'marc.rousseau@email.com', phone: '+33 6 00 11 22 33' },
    checkIn: '2025-04-12', checkOut: '2025-04-19', nights: 7, totalAmount: 3150, commission: 472.50,
    status: 'En attente', paymentStatus: 'En attente', createdAt: '2025-03-05'
  },
  {
    id: 'RES-2408', propertyPhoto: '/images/properties/studio-cosy.jpg', propertyName: 'Studio Cosy Capitole', propertyId: 8,
    host: { name: 'Camille Leroy', avatar: 'CL', id: 8, email: 'camille.leroy@email.com', phone: '+33 6 77 88 99 00' },
    guest: { name: 'Claire Lefebvre', avatar: 'CL', id: 17, email: 'claire.lefebvre@email.com', phone: '+33 6 11 22 33 44' },
    checkIn: '2025-02-18', checkOut: '2025-02-25', nights: 7, totalAmount: 455, commission: 68.25,
    status: 'Litige', paymentStatus: 'Partiel', createdAt: '2025-02-01'
  },
  {
    id: 'RES-2409', propertyPhoto: '/images/properties/loft-industrial.jpg', propertyName: 'Loft Industriel', propertyId: 9,
    host: { name: 'Jean Dupont', avatar: 'JD', id: 1, email: 'jean.dupont@email.com', phone: '+33 6 12 34 56 78' },
    guest: { name: 'Emma Girard', avatar: 'EG', id: 18, email: 'emma.girard@email.com', phone: '+33 6 22 33 44 55' },
    checkIn: '2025-03-01', checkOut: '2025-03-05', nights: 4, totalAmount: 560, commission: 84,
    status: 'Terminee', paymentStatus: 'Paye', createdAt: '2025-02-15'
  },
  {
    id: 'RES-2410', propertyPhoto: '/images/properties/maison-campagne.jpg', propertyName: 'Maison de Campagne', propertyId: 10,
    host: { name: 'Marie Simon', avatar: 'MS', id: 2, email: 'marie.simon@email.com', phone: '+33 6 11 22 33 44' },
    guest: { name: 'Paul Renaud', avatar: 'PR', id: 19, email: 'paul.renaud@email.com', phone: '+33 6 33 44 55 66' },
    checkIn: '2025-04-01', checkOut: '2025-04-08', nights: 7, totalAmount: 1225, commission: 183.75,
    status: 'Confirmee', paymentStatus: 'Paye', createdAt: '2025-03-04'
  },
  {
    id: 'RES-2411', propertyPhoto: '/images/properties/chalet-savoie.jpg', propertyName: 'Chalet Savoyard', propertyId: 11,
    host: { name: 'Pierre Laurent', avatar: 'PL', id: 3, email: 'pierre.laurent@email.com', phone: '+33 6 22 33 44 55' },
    guest: { name: 'Nathalie Duval', avatar: 'ND', id: 20, email: 'nathalie.duval@email.com', phone: '+33 6 44 55 66 77' },
    checkIn: '2025-03-08', checkOut: '2025-03-15', nights: 7, totalAmount: 1540, commission: 231,
    status: 'En cours', paymentStatus: 'Paye', createdAt: '2025-02-22'
  },
  {
    id: 'RES-2412', propertyPhoto: '/images/properties/apt-riviera.jpg', propertyName: 'Appartement Riviera', propertyId: 12,
    host: { name: 'Sophie Martin', avatar: 'SM', id: 4, email: 'sophie.martin@email.com', phone: '+33 6 33 44 55 66' },
    guest: { name: 'Hugo Lambert', avatar: 'HL', id: 21, email: 'hugo.lambert@email.com', phone: '+33 6 55 66 77 88' },
    checkIn: '2025-02-14', checkOut: '2025-02-17', nights: 3, totalAmount: 1140, commission: 171,
    status: 'Annulee', paymentStatus: 'Echoue', createdAt: '2025-01-30'
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export function AdminReservations() {
  // List state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [hostFilter, setHostFilter] = useState<string>('all');
  const [guestFilter, setGuestFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [amountFilter, setAmountFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Detail / modals state
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
  const [showRefundModal, setShowRefundModal] = useState<string | null>(null);
  const [showFraudModal, setShowFraudModal] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  // ── Derived data ───────────────────────────────────────────────────────────

  const hosts = useMemo(() => {
    const unique = new Map<number, string>();
    reservations.forEach(r => unique.set(r.host.id, r.host.name));
    return Array.from(unique.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, []);

  const guests = useMemo(() => {
    const unique = new Map<number, string>();
    reservations.forEach(r => unique.set(r.guest.id, r.guest.name));
    return Array.from(unique.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, []);

  const filtered = useMemo(() => {
    return reservations.filter(r => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !r.id.toLowerCase().includes(q) &&
          !r.propertyName.toLowerCase().includes(q) &&
          !r.guest.name.toLowerCase().includes(q) &&
          !r.host.name.toLowerCase().includes(q)
        ) return false;
      }
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (paymentFilter !== 'all' && r.paymentStatus !== paymentFilter) return false;
      if (hostFilter !== 'all' && r.host.id !== Number(hostFilter)) return false;
      if (guestFilter !== 'all' && r.guest.id !== Number(guestFilter)) return false;
      if (amountFilter !== 'all') {
        if (amountFilter === '0-500' && r.totalAmount > 500) return false;
        if (amountFilter === '500-1000' && (r.totalAmount < 500 || r.totalAmount > 1000)) return false;
        if (amountFilter === '1000-2000' && (r.totalAmount < 1000 || r.totalAmount > 2000)) return false;
        if (amountFilter === '2000+' && r.totalAmount < 2000) return false;
      }
      if (dateFilter !== 'all') {
        const now = new Date();
        const checkIn = new Date(r.checkIn);
        if (dateFilter === 'this-month' && (checkIn.getMonth() !== now.getMonth() || checkIn.getFullYear() !== now.getFullYear())) return false;
        if (dateFilter === 'next-month') {
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          if (checkIn.getMonth() !== nextMonth.getMonth() || checkIn.getFullYear() !== nextMonth.getFullYear()) return false;
        }
        if (dateFilter === 'past' && checkIn >= now) return false;
        if (dateFilter === 'upcoming' && checkIn < now) return false;
      }
      return true;
    });
  }, [searchQuery, statusFilter, paymentFilter, hostFilter, guestFilter, dateFilter, amountFilter]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => ({
    total: reservations.length,
    confirmee: reservations.filter(r => r.status === 'Confirmee').length,
    enAttente: reservations.filter(r => r.status === 'En attente').length,
    enCours: reservations.filter(r => r.status === 'En cours').length,
    terminee: reservations.filter(r => r.status === 'Terminee').length,
    annulee: reservations.filter(r => r.status === 'Annulee').length,
    litige: reservations.filter(r => r.status === 'Litige').length,
    totalRevenue: reservations.reduce((sum, r) => sum + r.totalAmount, 0),
    totalCommission: reservations.reduce((sum, r) => sum + r.commission, 0),
  }), []);

  const activeFiltersCount = [statusFilter, paymentFilter, hostFilter, guestFilter, dateFilter, amountFilter]
    .filter(f => f !== 'all').length;

  const clearFilters = () => {
    setStatusFilter('all');
    setPaymentFilter('all');
    setHostFilter('all');
    setGuestFilter('all');
    setDateFilter('all');
    setAmountFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getStatusConfig = (status: ReservationStatus) => {
    switch (status) {
      case 'Confirmee': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, dot: 'bg-emerald-500' };
      case 'En attente': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock, dot: 'bg-amber-500' };
      case 'En cours': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: CalendarDays, dot: 'bg-blue-500' };
      case 'Terminee': return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: CheckCircle, dot: 'bg-gray-500' };
      case 'Annulee': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle, dot: 'bg-red-500' };
      case 'Litige': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: AlertTriangle, dot: 'bg-purple-500' };
    }
  };

  const getPaymentConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'Paye': return { bg: 'bg-emerald-50', text: 'text-emerald-700' };
      case 'En attente': return { bg: 'bg-amber-50', text: 'text-amber-700' };
      case 'Rembourse': return { bg: 'bg-blue-50', text: 'text-blue-700' };
      case 'Echoue': return { bg: 'bg-red-50', text: 'text-red-700' };
      case 'Partiel': return { bg: 'bg-orange-50', text: 'text-orange-700' };
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateShort = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // ── Detail View ────────────────────────────────────────────────────────────

  if (selectedReservation) {
    const r = selectedReservation;
    const statusConfig = getStatusConfig(r.status);
    const paymentConfig = getPaymentConfig(r.paymentStatus);
    const StatusIcon = statusConfig.icon;

    const timeline = [
      { date: r.createdAt, label: 'Reservation creee', icon: CalendarDays, color: 'text-gray-500' },
      ...(r.paymentStatus === 'Paye' || r.paymentStatus === 'Partiel' ? [{ date: r.createdAt, label: 'Paiement recu', icon: CreditCard, color: 'text-emerald-500' }] : []),
      ...(r.status === 'Confirmee' || r.status === 'En cours' || r.status === 'Terminee' ? [{ date: r.createdAt, label: 'Reservation confirmee', icon: CheckCircle, color: 'text-emerald-500' }] : []),
      ...(r.status === 'En cours' ? [{ date: r.checkIn, label: 'Check-in effectue', icon: Home, color: 'text-blue-500' }] : []),
      ...(r.status === 'Terminee' ? [
        { date: r.checkIn, label: 'Check-in effectue', icon: Home, color: 'text-blue-500' },
        { date: r.checkOut, label: 'Check-out effectue', icon: Home, color: 'text-gray-500' },
      ] : []),
      ...(r.status === 'Annulee' ? [{ date: r.createdAt, label: 'Reservation annulee', icon: XCircle, color: 'text-red-500' }] : []),
      ...(r.status === 'Litige' ? [{ date: r.createdAt, label: 'Litige ouvert', icon: AlertTriangle, color: 'text-purple-500' }] : []),
    ];

    return (
      <div className="min-h-screen bg-gray-50/50">
        <AdminSidebar />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          {/* Back button + header */}
          <div className="mb-6 mt-16 lg:mt-0">
            <button onClick={() => setSelectedReservation(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Retour aux reservations
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>#{r.id}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {r.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Creee le {formatDate(r.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {r.status !== 'Annulee' && r.status !== 'Terminee' && (
                  <button onClick={() => setShowCancelModal(r.id)} className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
                    <Ban className="w-4 h-4" />
                    Annuler
                  </button>
                )}
                {r.paymentStatus === 'Paye' && (
                  <button onClick={() => { setShowRefundModal(r.id); setRefundAmount(String(r.totalAmount)); }} className="px-4 py-2.5 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
                    <RefreshCw className="w-4 h-4" />
                    Rembourser
                  </button>
                )}
                <button onClick={() => setShowFraudModal(r.id)} className="px-4 py-2.5 border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
                  <Shield className="w-4 h-4" />
                  Fraude
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Reservation info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-lg mb-5" style={{ fontWeight: 600 }}>Informations reservation</h2>
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                    <Home className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm mb-0.5 truncate" style={{ fontWeight: 600 }}>{r.propertyName}</div>
                    <div className="text-xs text-gray-500">Logement #{r.propertyId}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Check-in</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{formatDate(r.checkIn)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Check-out</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{formatDate(r.checkOut)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Nuits</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{r.nights} nuits</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Date reservation</div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{formatDate(r.createdAt)}</div>
                  </div>
                </div>
              </div>

              {/* Payment details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg" style={{ fontWeight: 600 }}>Details du paiement</h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs ${paymentConfig.bg} ${paymentConfig.text}`} style={{ fontWeight: 600 }}>
                    {r.paymentStatus}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Montant total</span>
                    <span className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(r.totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Commission plateforme (15%)</span>
                    <span className="text-sm text-emerald-600" style={{ fontWeight: 600 }}>{formatCurrency(r.commission)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span className="text-sm" style={{ fontWeight: 600 }}>Revenu hote</span>
                    <span className="text-base" style={{ fontWeight: 600 }}>{formatCurrency(r.totalAmount - r.commission)}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-lg mb-5" style={{ fontWeight: 600 }}>Timeline du sejour</h2>
                <div className="space-y-0">
                  {timeline.map((event, i) => {
                    const Icon = event.icon;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-50 ${event.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          {i < timeline.length - 1 && <div className="w-px h-6 bg-gray-200 my-1" />}
                        </div>
                        <div className="pb-4">
                          <div className="text-sm" style={{ fontWeight: 500 }}>{event.label}</div>
                          <div className="text-xs text-gray-500">{formatDate(event.date)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Guest info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4" style={{ fontWeight: 600 }}>Voyageur</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-[#111827] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontWeight: 600 }}>
                    {r.guest.avatar}
                  </div>
                  <div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{r.guest.name}</div>
                    <div className="text-xs text-gray-500">Client #{r.guest.id}</div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{r.guest.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {r.guest.phone}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs flex items-center justify-center gap-1.5" style={{ fontWeight: 500 }}>
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                  </button>
                  <button className="px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-xs text-red-600 flex items-center justify-center gap-1.5" style={{ fontWeight: 500 }}>
                    <UserX className="w-3.5 h-3.5" />
                    Bloquer
                  </button>
                </div>
              </div>

              {/* Host info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4" style={{ fontWeight: 600 }}>Hote</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-[#111827] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontWeight: 600 }}>
                    {r.host.avatar}
                  </div>
                  <div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{r.host.name}</div>
                    <div className="text-xs text-gray-500">Hote #{r.host.id}</div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{r.host.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {r.host.phone}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-xs flex items-center justify-center gap-1.5" style={{ fontWeight: 500 }}>
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                  </button>
                  <button className="px-3 py-2 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors text-xs text-orange-600 flex items-center justify-center gap-1.5" style={{ fontWeight: 500 }}>
                    <Ban className="w-3.5 h-3.5" />
                    Suspendre
                  </button>
                </div>
              </div>

              {/* Admin actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
                <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-4" style={{ fontWeight: 600 }}>Actions administrateur</h2>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm text-left" style={{ fontWeight: 500 }}>
                    <Edit className="w-4 h-4 text-gray-500" />
                    Modifier les dates
                  </button>
                  {r.status !== 'Annulee' && r.status !== 'Terminee' && (
                    <button onClick={() => setShowCancelModal(r.id)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors flex items-center gap-3 text-sm text-left" style={{ fontWeight: 500 }}>
                      <Ban className="w-4 h-4 text-red-500" />
                      Annuler la reservation
                    </button>
                  )}
                  {r.paymentStatus === 'Paye' && (
                    <button onClick={() => { setShowRefundModal(r.id); setRefundAmount(String(r.totalAmount)); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors flex items-center gap-3 text-sm text-left" style={{ fontWeight: 500 }}>
                      <RefreshCw className="w-4 h-4 text-blue-500" />
                      Forcer un remboursement
                    </button>
                  )}
                  <button onClick={() => setShowFraudModal(r.id)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-colors flex items-center gap-3 text-sm text-left" style={{ fontWeight: 500 }}>
                    <Shield className="w-4 h-4 text-orange-500" />
                    Marquer comme fraude
                  </button>
                  <button className="w-full px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-colors flex items-center gap-3 text-sm text-left" style={{ fontWeight: 500 }}>
                    <AlertTriangle className="w-4 h-4 text-purple-500" />
                    Voir les litiges
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowCancelModal(null); setCancelReason(''); }}>
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>Annuler la reservation</h3>
              <p className="text-sm text-gray-500 text-center mb-4">Cette action annulera la reservation et notifiera le voyageur et l&apos;hote.</p>
              <textarea
                placeholder="Raison de l'annulation..."
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm resize-none mb-4"
              />
              <div className="flex items-center gap-3">
                <button onClick={() => { setShowCancelModal(null); setCancelReason(''); }} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>Fermer</button>
                <button onClick={() => { setShowCancelModal(null); setCancelReason(''); }} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm" style={{ fontWeight: 600 }}>Confirmer l&apos;annulation</button>
              </div>
            </div>
          </div>
        )}

        {/* Refund Modal */}
        {showRefundModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowRefundModal(null); setRefundAmount(''); }}>
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>Forcer un remboursement</h3>
              <p className="text-sm text-gray-500 text-center mb-4">Le remboursement sera effectue sur le moyen de paiement original du voyageur.</p>
              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Montant du remboursement (EUR)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => { setShowRefundModal(null); setRefundAmount(''); }} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>Annuler</button>
                <button onClick={() => { setShowRefundModal(null); setRefundAmount(''); }} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm" style={{ fontWeight: 600 }}>Rembourser</button>
              </div>
            </div>
          </div>
        )}

        {/* Fraud Modal */}
        {showFraudModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowFraudModal(null)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>Marquer comme fraude</h3>
              <p className="text-sm text-gray-500 text-center mb-4">Cette reservation sera signalee comme frauduleuse. L&apos;equipe securite sera notifiee.</p>
              <textarea
                placeholder="Details de la suspicion de fraude..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm resize-none mb-4"
              />
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFraudModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>Annuler</button>
                <button onClick={() => setShowFraudModal(null)} className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-sm" style={{ fontWeight: 600 }}>Confirmer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── List View ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50/50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 mt-16 lg:mt-0">
          <div>
            <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Gestion des reservations</h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} reservation{filtered.length > 1 ? 's' : ''} trouvee{filtered.length > 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm" style={{ fontWeight: 500 }}>
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-transparent">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-gray-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Total reservations</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-transparent">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl text-emerald-700" style={{ fontWeight: 600 }}>{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-xs text-gray-500 mt-1">Revenus totaux</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-transparent">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl text-blue-700" style={{ fontWeight: 600 }}>{formatCurrency(stats.totalCommission)}</div>
            <div className="text-xs text-gray-500 mt-1">Commissions</div>
          </div>
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-transparent">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl text-purple-700" style={{ fontWeight: 600 }}>{stats.litige}</div>
            <div className="text-xs text-gray-500 mt-1">Litiges ouverts</div>
          </div>
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {([
            { key: 'all', label: 'Toutes', count: stats.total },
            { key: 'Confirmee', label: 'Confirmees', count: stats.confirmee },
            { key: 'En attente', label: 'En attente', count: stats.enAttente },
            { key: 'En cours', label: 'En cours', count: stats.enCours },
            { key: 'Terminee', label: 'Terminees', count: stats.terminee },
            { key: 'Annulee', label: 'Annulees', count: stats.annulee },
            { key: 'Litige', label: 'Litiges', count: stats.litige },
          ] as const).map(item => (
            <button
              key={item.key}
              onClick={() => { setStatusFilter(item.key); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
                statusFilter === item.key
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
              style={{ fontWeight: statusFilter === item.key ? 600 : 500 }}
            >
              {item.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${statusFilter === item.key ? 'bg-white/20' : 'bg-gray-100'}`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Search & Filters Header */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par ID, logement, voyageur, hote..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 focus:border-[#111827] transition-all text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2.5 border rounded-xl transition-colors flex items-center gap-2 text-sm ${showFilters ? 'bg-[#111827] text-white border-[#111827]' : 'border-gray-200 hover:bg-gray-50'}`}
                    style={{ fontWeight: 500 }}
                  >
                    <Filter className="w-4 h-4" />
                    Filtres
                    {activeFiltersCount > 0 && (
                      <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${showFilters ? 'bg-white text-[#111827]' : 'bg-[#111827] text-white'}`} style={{ fontWeight: 600 }}>
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="px-3 py-2.5 text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1">
                      <X className="w-3.5 h-3.5" />
                      Effacer
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Paiement</label>
                    <select value={paymentFilter} onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm">
                      <option value="all">Tous</option>
                      <option value="Paye">Paye</option>
                      <option value="En attente">En attente</option>
                      <option value="Rembourse">Rembourse</option>
                      <option value="Echoue">Echoue</option>
                      <option value="Partiel">Partiel</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Hote</label>
                    <select value={hostFilter} onChange={(e) => { setHostFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm">
                      <option value="all">Tous</option>
                      {hosts.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Voyageur</label>
                    <select value={guestFilter} onChange={(e) => { setGuestFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm">
                      <option value="all">Tous</option>
                      {guests.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Periode</label>
                    <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm">
                      <option value="all">Toutes</option>
                      <option value="this-month">Ce mois</option>
                      <option value="next-month">Mois prochain</option>
                      <option value="past">Passees</option>
                      <option value="upcoming">A venir</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block" style={{ fontWeight: 500 }}>Montant</label>
                    <select value={amountFilter} onChange={(e) => { setAmountFilter(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm">
                      <option value="all">Tous</option>
                      <option value="0-500">0 - 500 EUR</option>
                      <option value="500-1000">500 - 1 000 EUR</option>
                      <option value="1000-2000">1 000 - 2 000 EUR</option>
                      <option value="2000+">2 000+ EUR</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>ID</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Logement</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Hote</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Voyageur</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Sejour</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Montant</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Commission</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Paiement</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => {
                  const statusConfig = getStatusConfig(r.status);
                  const paymentConfig = getPaymentConfig(r.paymentStatus);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                      <td className="py-3.5 px-4">
                        <span className="text-xs text-gray-500 font-mono" style={{ fontWeight: 600 }}>#{r.id}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Home className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm truncate max-w-[150px]" style={{ fontWeight: 600 }}>{r.propertyName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-[#111827] rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0" style={{ fontWeight: 600 }}>{r.host.avatar}</div>
                          <span className="text-sm text-gray-600 truncate max-w-[100px]">{r.host.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-[10px] flex-shrink-0" style={{ fontWeight: 600 }}>{r.guest.avatar}</div>
                          <span className="text-sm text-gray-600 truncate max-w-[100px]">{r.guest.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-sm" style={{ fontWeight: 500 }}>{formatDateShort(r.checkIn)} - {formatDateShort(r.checkOut)}</div>
                        <div className="text-xs text-gray-400">{r.nights} nuit{r.nights > 1 ? 's' : ''}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(r.totalAmount)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-sm text-emerald-600" style={{ fontWeight: 500 }}>{formatCurrency(r.commission)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                          <StatusIcon className="w-3 h-3" />
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs ${paymentConfig.bg} ${paymentConfig.text}`} style={{ fontWeight: 600 }}>
                          {r.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setSelectedReservation(r)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Voir">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Modifier">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          {r.status !== 'Annulee' && r.status !== 'Terminee' && (
                            <button onClick={() => setShowCancelModal(r.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Annuler">
                              <Ban className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-500">Aucune reservation trouvee</div>
                        <button onClick={clearFilters} className="text-sm text-[#111827] hover:underline" style={{ fontWeight: 500 }}>
                          Effacer les filtres
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tablet Table */}
          <div className="hidden md:block xl:hidden overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Reservation</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Voyageur / Hote</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Sejour</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Montant</th>
                  <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Statut</th>
                  <th className="text-right py-3 px-4 text-xs text-gray-500 uppercase tracking-wider" style={{ fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r) => {
                  const statusConfig = getStatusConfig(r.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Home className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm" style={{ fontWeight: 600 }}>{r.propertyName}</div>
                            <div className="text-xs text-gray-500 font-mono">#{r.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-sm" style={{ fontWeight: 500 }}>{r.guest.name}</div>
                        <div className="text-xs text-gray-500">{r.host.name}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-sm" style={{ fontWeight: 500 }}>{formatDateShort(r.checkIn)} - {formatDateShort(r.checkOut)}</div>
                        <div className="text-xs text-gray-400">{r.nights} nuit{r.nights > 1 ? 's' : ''}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(r.totalAmount)}</div>
                        <div className="text-xs text-emerald-600">{formatCurrency(r.commission)}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                          <StatusIcon className="w-3 h-3" />
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedReservation(r)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          {r.status !== 'Annulee' && r.status !== 'Terminee' && (
                            <button onClick={() => setShowCancelModal(r.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                              <Ban className="w-4 h-4 text-red-500" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-50">
            {paginated.map((r) => {
              const statusConfig = getStatusConfig(r.status);
              const paymentConfig = getPaymentConfig(r.paymentStatus);
              const StatusIcon = statusConfig.icon;
              return (
                <div key={r.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                        <Home className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm truncate" style={{ fontWeight: 600 }}>{r.propertyName}</div>
                        <div className="text-xs text-gray-500 font-mono">#{r.id}</div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs flex-shrink-0 ${statusConfig.bg} ${statusConfig.text}`} style={{ fontWeight: 600 }}>
                      <StatusIcon className="w-3 h-3" />
                      {r.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Voyageur</div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[8px] text-gray-600 flex-shrink-0" style={{ fontWeight: 600 }}>{r.guest.avatar}</div>
                        <span className="text-xs" style={{ fontWeight: 500 }}>{r.guest.name}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Hote</div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-[#111827] rounded-full flex items-center justify-center text-[8px] text-white flex-shrink-0" style={{ fontWeight: 600 }}>{r.host.avatar}</div>
                        <span className="text-xs" style={{ fontWeight: 500 }}>{r.host.name}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Sejour</div>
                      <div className="text-xs" style={{ fontWeight: 500 }}>{formatDateShort(r.checkIn)} - {formatDateShort(r.checkOut)}</div>
                      <div className="text-[10px] text-gray-400">{r.nights} nuit{r.nights > 1 ? 's' : ''}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Montant</div>
                      <div className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(r.totalAmount)}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${paymentConfig.bg} ${paymentConfig.text}`} style={{ fontWeight: 600 }}>{r.paymentStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => setSelectedReservation(r)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                      <Eye className="w-3.5 h-3.5" />
                      Voir
                    </button>
                    <button className="flex-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-xs" style={{ fontWeight: 500 }}>
                      <Edit className="w-3.5 h-3.5" />
                      Modifier
                    </button>
                    {r.status !== 'Annulee' && r.status !== 'Terminee' && (
                      <button onClick={() => setShowCancelModal(r.id)} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors">
                        <Ban className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {paginated.length === 0 && (
              <div className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <Search className="w-8 h-8 text-gray-300" />
                  <div className="text-sm text-gray-500">Aucune reservation trouvee</div>
                  <button onClick={clearFilters} className="text-sm text-[#111827] hover:underline" style={{ fontWeight: 500 }}>
                    Effacer les filtres
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Affichage {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} sur {filtered.length}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm transition-colors ${page === currentPage ? 'bg-[#111827] text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                    style={{ fontWeight: page === currentPage ? 600 : 400 }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Cancel Modal (from list) */}
      {showCancelModal && !selectedReservation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowCancelModal(null); setCancelReason(''); }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg text-center mb-2" style={{ fontWeight: 600 }}>Annuler la reservation</h3>
            <p className="text-sm text-gray-500 text-center mb-4">Cette action annulera la reservation #{showCancelModal} et notifiera le voyageur et l&apos;hote.</p>
            <textarea
              placeholder="Raison de l'annulation..."
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#111827]/20 text-sm resize-none mb-4"
            />
            <div className="flex items-center gap-3">
              <button onClick={() => { setShowCancelModal(null); setCancelReason(''); }} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ fontWeight: 500 }}>Fermer</button>
              <button onClick={() => { setShowCancelModal(null); setCancelReason(''); }} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm" style={{ fontWeight: 600 }}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
