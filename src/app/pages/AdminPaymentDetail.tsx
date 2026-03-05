'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Eye, CheckCircle, Clock, XCircle, DollarSign, CreditCard,
  AlertTriangle, RotateCcw, User, Mail, Phone, Home, Calendar, Shield,
  Ban, Flag, Pause, Play, Copy, ExternalLink, Hash, Building, MapPin
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

// ── Types ────────────────────────────────────────────────────────────────────

type PaymentStatus = 'Reussi' | 'En attente' | 'Echoue' | 'Rembourse' | 'Annule';
type PayoutStatus = 'Verse' | 'En attente' | 'Suspendu' | 'Echoue';
type PaymentMethod = 'Carte bancaire' | 'PayPal' | 'Stripe' | 'Virement';

interface PaymentDetail {
  id: string;
  reservationId: string;
  property: { name: string; id: number; city: string; country: string };
  client: { name: string; email: string; phone: string; avatar: string; id: number };
  host: { name: string; email: string; phone: string; avatar: string; id: number; iban: string };
  pricing: {
    nightlyRate: number;
    nights: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    totalAmount: number;
    commission: number;
    commissionRate: number;
    payoutAmount: number;
  };
  method: PaymentMethod;
  paymentStatus: PaymentStatus;
  payoutStatus: PayoutStatus;
  date: string;
  payoutDate: string | null;
  isFlagged: boolean;
  flagReason: string | null;
  stripePaymentId: string;
  history: { date: string; action: string; actor: string; details: string }[];
}

// ── Status Config ────────────────────────────────────────────────────────────

const paymentStatusConfig: Record<PaymentStatus, { bg: string; text: string; icon: typeof CheckCircle }> = {
  'Reussi': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  'En attente': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  'Echoue': { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
  'Rembourse': { bg: 'bg-blue-50', text: 'text-blue-700', icon: RotateCcw },
  'Annule': { bg: 'bg-gray-100', text: 'text-gray-600', icon: Ban },
};

const payoutStatusConfig: Record<PayoutStatus, { bg: string; text: string }> = {
  'Verse': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'En attente': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Suspendu': { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Echoue': { bg: 'bg-red-50', text: 'text-red-700' },
};

// ── Mock Data ────────────────────────────────────────────────────────────────

const paymentDetails: Record<string, PaymentDetail> = {
  'PAY-10001': {
    id: 'PAY-10001', reservationId: 'RES-2401',
    property: { name: 'Villa Toscane', id: 1, city: 'Nice', country: 'France' },
    client: { name: 'Alexandre Leroy', email: 'alex.leroy@email.com', phone: '+33 6 98 76 54 32', avatar: 'AL', id: 10 },
    host: { name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '+33 6 12 34 56 78', avatar: 'JD', id: 1, iban: 'FR76 •••• •••• •••• 4521' },
    pricing: { nightlyRate: 250, nights: 7, subtotal: 1750, cleaningFee: 80, serviceFee: 65, taxes: 117, totalAmount: 2012, commission: 301.80, commissionRate: 15, payoutAmount: 1710.20 },
    method: 'Carte bancaire', paymentStatus: 'Reussi', payoutStatus: 'Verse',
    date: '2025-03-15T14:32:00', payoutDate: '2025-03-18T09:00:00',
    isFlagged: false, flagReason: null, stripePaymentId: 'pi_3NqK8dL2eZvKY3ab1',
    history: [
      { date: '2025-03-18T09:00:00', action: 'Payout verse', actor: 'Systeme', details: 'Virement de 1 710,20 EUR vers le compte de Jean Dupont' },
      { date: '2025-03-15T14:32:00', action: 'Paiement reussi', actor: 'Systeme', details: 'Paiement de 2 012,00 EUR par carte bancaire Visa •••• 4242' },
      { date: '2025-03-15T14:30:00', action: 'Paiement initie', actor: 'Alexandre Leroy', details: 'Reservation RES-2401 confirmee' },
    ],
  },
  'PAY-10005': {
    id: 'PAY-10005', reservationId: 'RES-2405',
    property: { name: 'Maison Bord de Mer', id: 5, city: 'Biarritz', country: 'France' },
    client: { name: 'Thomas Petit', email: 'thomas.petit@email.com', phone: '+33 6 88 99 00 11', avatar: 'TP', id: 14 },
    host: { name: 'Thomas Dubois', email: 'thomas.dubois@email.com', phone: '+33 6 44 55 66 77', avatar: 'TD', id: 5, iban: 'FR76 •••• •••• •••• 7833' },
    pricing: { nightlyRate: 320, nights: 7, subtotal: 2240, cleaningFee: 120, serviceFee: 85, taxes: 152, totalAmount: 2597, commission: 389.55, commissionRate: 15, payoutAmount: 2207.45 },
    method: 'Stripe', paymentStatus: 'Rembourse', payoutStatus: 'Suspendu',
    date: '2025-03-08T10:15:00', payoutDate: null,
    isFlagged: true, flagReason: 'Suspicion de fraude - Comportement anormal detecte',
    stripePaymentId: 'pi_3NqK8dL2eZvKY3ab5',
    history: [
      { date: '2025-03-12T16:00:00', action: 'Payout suspendu', actor: 'Admin (Marie Admin)', details: 'Payout suspendu en raison de suspicion de fraude' },
      { date: '2025-03-11T09:30:00', action: 'Marque comme fraude', actor: 'Admin (Marie Admin)', details: 'Transaction signalee pour verification' },
      { date: '2025-03-10T14:00:00', action: 'Remboursement total', actor: 'Admin (Marie Admin)', details: 'Remboursement de 2 597,00 EUR suite a annulation' },
      { date: '2025-03-08T10:15:00', action: 'Paiement reussi', actor: 'Systeme', details: 'Paiement de 2 597,00 EUR par Stripe' },
      { date: '2025-03-08T10:12:00', action: 'Paiement initie', actor: 'Thomas Petit', details: 'Reservation RES-2405 confirmee' },
    ],
  },
};

// Fallback for IDs not in the detail map
function getPaymentDetail(id: string): PaymentDetail {
  if (paymentDetails[id]) return paymentDetails[id];
  return {
    id, reservationId: 'RES-0000',
    property: { name: 'Logement Exemple', id: 0, city: 'Paris', country: 'France' },
    client: { name: 'Client Exemple', email: 'client@email.com', phone: '+33 6 00 00 00 00', avatar: 'CE', id: 0 },
    host: { name: 'Hote Exemple', email: 'hote@email.com', phone: '+33 6 00 00 00 00', avatar: 'HE', id: 0, iban: 'FR76 •••• •••• •••• 0000' },
    pricing: { nightlyRate: 150, nights: 5, subtotal: 750, cleaningFee: 50, serviceFee: 35, taxes: 52, totalAmount: 887, commission: 133.05, commissionRate: 15, payoutAmount: 753.95 },
    method: 'Carte bancaire', paymentStatus: 'Reussi', payoutStatus: 'Verse',
    date: '2025-03-01T12:00:00', payoutDate: '2025-03-04T09:00:00',
    isFlagged: false, flagReason: null, stripePaymentId: 'pi_example',
    history: [
      { date: '2025-03-04T09:00:00', action: 'Payout verse', actor: 'Systeme', details: 'Virement effectue' },
      { date: '2025-03-01T12:00:00', action: 'Paiement reussi', actor: 'Systeme', details: 'Paiement traite' },
    ],
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ── Component ────────────────────────────────────────────────────────────────

export function AdminPaymentDetail() {
  const params = useParams();
  const paymentId = params?.id as string || 'PAY-10001';
  const payment = getPaymentDetail(paymentId);

  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState<string | null>(null);
  const [refundType, setRefundType] = useState<'total' | 'partial'>('total');
  const [refundAmount, setRefundAmount] = useState('');

  const StatusIcon = paymentStatusConfig[payment.paymentStatus].icon;

  function handleAction(action: string) {
    // API call placeholder
    setShowActionModal(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="mt-16 lg:mt-0 mb-6">
          <Link href="/admin/payments" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Retour aux paiements
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{payment.id}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${paymentStatusConfig[payment.paymentStatus].bg} ${paymentStatusConfig[payment.paymentStatus].text}`} style={{ fontWeight: 600 }}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {payment.paymentStatus}
                </span>
                {payment.isFlagged && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-red-50 text-red-700" style={{ fontWeight: 600 }}>
                    <AlertTriangle className="w-3.5 h-3.5" /> Fraude
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(payment.date)}</span>
                <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" />{payment.method}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Flag Warning ───────────────────────────────────────── */}
        {payment.isFlagged && payment.flagReason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-red-800" style={{ fontWeight: 600 }}>Transaction signalee</div>
              <div className="text-sm text-red-700 mt-0.5">{payment.flagReason}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Informations transaction</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoRow icon={Hash} label="ID Transaction" value={payment.id} />
                  <InfoRow icon={Hash} label="ID Reservation" value={payment.reservationId} link />
                  <InfoRow icon={CreditCard} label="Mode paiement" value={payment.method} />
                  <InfoRow icon={Hash} label="Ref. Stripe" value={payment.stripePaymentId} copyable />
                  <InfoRow icon={Calendar} label="Date paiement" value={formatDateTime(payment.date)} />
                  <InfoRow icon={Calendar} label="Date payout" value={payment.payoutDate ? formatDateTime(payment.payoutDate) : 'Non effectue'} />
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Detail du prix</h2>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{formatCurrency(payment.pricing.nightlyRate)} x {payment.pricing.nights} nuits</span>
                    <span style={{ fontWeight: 500 }}>{formatCurrency(payment.pricing.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Frais de menage</span>
                    <span style={{ fontWeight: 500 }}>{formatCurrency(payment.pricing.cleaningFee)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Frais de service</span>
                    <span style={{ fontWeight: 500 }}>{formatCurrency(payment.pricing.serviceFee)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span style={{ fontWeight: 500 }}>{formatCurrency(payment.pricing.taxes)}</span>
                  </div>
                  <div className="h-px bg-gray-100 my-1" />
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ fontWeight: 600 }}>Total paye par le client</span>
                    <span className="text-lg" style={{ fontWeight: 600 }}>{formatCurrency(payment.pricing.totalAmount)}</span>
                  </div>
                  <div className="h-px bg-gray-100 my-1" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-emerald-600">Commission plateforme ({payment.pricing.commissionRate}%)</span>
                    <span className="text-emerald-600" style={{ fontWeight: 600 }}>{formatCurrency(payment.pricing.commission)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600">Payout hote</span>
                    <span className="text-blue-600" style={{ fontWeight: 600 }}>{formatCurrency(payment.pricing.payoutAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Informations client</h2>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#111827] rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
                    {payment.client.avatar}
                  </div>
                  <div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{payment.client.name}</div>
                    <div className="text-xs text-gray-500">Client #{payment.client.id}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />{payment.client.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />{payment.client.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Host Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Informations hote</h2>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
                    {payment.host.avatar}
                  </div>
                  <div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{payment.host.name}</div>
                    <div className="text-xs text-gray-500">Hote #{payment.host.id}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />{payment.host.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />{payment.host.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Payout Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-base" style={{ fontWeight: 600 }}>Informations payout</h2>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] ${payoutStatusConfig[payment.payoutStatus].bg} ${payoutStatusConfig[payment.payoutStatus].text}`} style={{ fontWeight: 600 }}>
                    {payment.payoutStatus}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Montant payout</div>
                    <div className="text-lg" style={{ fontWeight: 600 }}>{formatCurrency(payment.pricing.payoutAmount)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Beneficiaire</div>
                    <div className="text-sm" style={{ fontWeight: 500 }}>{payment.host.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">IBAN</div>
                    <div className="text-sm font-mono text-gray-700">{payment.host.iban}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Date de versement</div>
                    <div className="text-sm" style={{ fontWeight: 500 }}>{payment.payoutDate ? formatDateTime(payment.payoutDate) : '—'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Historique des actions</h2>
              </div>
              <div className="p-5">
                <div className="relative">
                  <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gray-200" />
                  <div className="space-y-6">
                    {payment.history.map((event, idx) => (
                      <div key={idx} className="relative pl-8">
                        <div className={`absolute left-0 top-0.5 w-[23px] h-[23px] rounded-full border-2 flex items-center justify-center ${idx === 0 ? 'bg-[#111827] border-[#111827]' : 'bg-white border-gray-300'}`}>
                          <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-white' : 'bg-gray-300'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm" style={{ fontWeight: 600 }}>{event.action}</span>
                            <span className="text-xs text-gray-400">{formatDateTime(event.date)}</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-0.5">par {event.actor}</div>
                          <div className="text-sm text-gray-600">{event.details}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column (Sidebar) ───────────────────────────── */}
          <div className="space-y-6">
            {/* Property Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-sm" style={{ fontWeight: 600 }}>Logement</h3>
              </div>
              <div className="p-5">
                <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{payment.property.name}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />{payment.property.city}, {payment.property.country}
                </div>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-sm" style={{ fontWeight: 600 }}>Resume financier</h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(payment.pricing.totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Commission</span>
                  <span className="text-sm text-emerald-600" style={{ fontWeight: 600 }}>{formatCurrency(payment.pricing.commission)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Payout</span>
                  <span className="text-sm text-blue-600" style={{ fontWeight: 600 }}>{formatCurrency(payment.pricing.payoutAmount)}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Statut paiement</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${paymentStatusConfig[payment.paymentStatus].bg} ${paymentStatusConfig[payment.paymentStatus].text}`} style={{ fontWeight: 600 }}>{payment.paymentStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Statut payout</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${payoutStatusConfig[payment.payoutStatus].bg} ${payoutStatusConfig[payment.payoutStatus].text}`} style={{ fontWeight: 600 }}>{payment.payoutStatus}</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-sm" style={{ fontWeight: 600 }}>Actions administrateur</h3>
              </div>
              <div className="p-4 space-y-2">
                {payment.paymentStatus === 'Reussi' && (
                  <>
                    <button
                      onClick={() => { setRefundType('total'); setRefundAmount(payment.pricing.totalAmount.toString()); setShowRefundModal(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors text-left"
                      style={{ fontWeight: 500 }}
                    >
                      <RotateCcw className="w-4 h-4 text-blue-600" />
                      Remboursement total
                    </button>
                    <button
                      onClick={() => { setRefundType('partial'); setRefundAmount(''); setShowRefundModal(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors text-left"
                      style={{ fontWeight: 500 }}
                    >
                      <RotateCcw className="w-4 h-4 text-indigo-600" />
                      Remboursement partiel
                    </button>
                  </>
                )}
                {payment.paymentStatus !== 'Annule' && payment.paymentStatus !== 'Rembourse' && (
                  <button
                    onClick={() => setShowActionModal('cancel')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors text-left"
                    style={{ fontWeight: 500 }}
                  >
                    <Ban className="w-4 h-4 text-gray-600" />
                    Annuler paiement
                  </button>
                )}
                {payment.payoutStatus !== 'Suspendu' && payment.payoutStatus !== 'Verse' && (
                  <button
                    onClick={() => setShowActionModal('suspend-payout')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors text-left"
                    style={{ fontWeight: 500 }}
                  >
                    <Pause className="w-4 h-4 text-orange-600" />
                    Suspendre payout
                  </button>
                )}
                {payment.payoutStatus === 'Suspendu' && (
                  <button
                    onClick={() => setShowActionModal('release-payout')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors text-left"
                    style={{ fontWeight: 500 }}
                  >
                    <Play className="w-4 h-4 text-emerald-600" />
                    Debloquer payout
                  </button>
                )}
                {!payment.isFlagged && (
                  <button
                    onClick={() => setShowActionModal('flag-fraud')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-red-50 transition-colors text-left text-red-600"
                    style={{ fontWeight: 500 }}
                  >
                    <Flag className="w-4 h-4" />
                    Marquer fraude
                  </button>
                )}
                <button
                  onClick={() => setShowActionModal('block')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-red-50 transition-colors text-left text-red-600"
                  style={{ fontWeight: 500 }}
                >
                  <Shield className="w-4 h-4" />
                  Bloquer transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Refund Modal ─────────────────────────────────────────── */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowRefundModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg" style={{ fontWeight: 600 }}>Remboursement {refundType === 'total' ? 'total' : 'partiel'}</h3>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Transaction</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{payment.id}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Client</span>
                  <span className="text-sm" style={{ fontWeight: 500 }}>{payment.client.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Montant total</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(payment.pricing.totalAmount)}</span>
                </div>
              </div>

              {refundType === 'total' ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5">
                  <p className="text-sm text-blue-700">Le client sera rembourse de {formatCurrency(payment.pricing.totalAmount)} sur son mode de paiement original.</p>
                </div>
              ) : (
                <div className="mb-5">
                  <label className="block text-sm mb-2" style={{ fontWeight: 500 }}>Montant du remboursement</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EUR</span>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      max={payment.pricing.totalAmount}
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]"
                    />
                  </div>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Cette action est irreversible.</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center gap-3">
              <button onClick={() => setShowRefundModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button
                onClick={() => { handleAction('refund'); setShowRefundModal(false); }}
                disabled={refundType === 'partial' && (!refundAmount || parseFloat(refundAmount) <= 0 || parseFloat(refundAmount) > payment.pricing.totalAmount)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontWeight: 500 }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Action Confirmation Modal ────────────────────────────── */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowActionModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${showActionModal === 'release-payout' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                {showActionModal === 'cancel' && <Ban className="w-6 h-6 text-red-600" />}
                {showActionModal === 'suspend-payout' && <Pause className="w-6 h-6 text-orange-600" />}
                {showActionModal === 'release-payout' && <Play className="w-6 h-6 text-emerald-600" />}
                {showActionModal === 'flag-fraud' && <Flag className="w-6 h-6 text-red-600" />}
                {showActionModal === 'block' && <Shield className="w-6 h-6 text-red-600" />}
              </div>
              <h3 className="text-center text-lg mb-2" style={{ fontWeight: 600 }}>
                {showActionModal === 'cancel' && 'Annuler le paiement ?'}
                {showActionModal === 'suspend-payout' && 'Suspendre le payout ?'}
                {showActionModal === 'release-payout' && 'Debloquer le payout ?'}
                {showActionModal === 'flag-fraud' && 'Marquer comme fraude ?'}
                {showActionModal === 'block' && 'Bloquer la transaction ?'}
              </h3>
              <p className="text-center text-sm text-gray-500 mb-6">
                {showActionModal === 'cancel' && 'Le paiement sera annule et le client pourra etre rembourse.'}
                {showActionModal === 'suspend-payout' && 'Le versement a l\'hote sera suspendu jusqu\'a nouvel ordre.'}
                {showActionModal === 'release-payout' && 'Le versement sera traite dans les 24 heures.'}
                {showActionModal === 'flag-fraud' && 'Cette transaction sera signalee pour investigation.'}
                {showActionModal === 'block' && 'La transaction sera bloquee et le payout suspendu.'}
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowActionModal(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>
                  Annuler
                </button>
                <button
                  onClick={() => handleAction(showActionModal)}
                  className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm transition-colors ${showActionModal === 'release-payout' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                  style={{ fontWeight: 500 }}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function InfoRow({ icon: Icon, label, value, link, copyable }: {
  icon: typeof Hash; label: string; value: string; link?: boolean; copyable?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-500 mb-0.5">{label}</div>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm ${link ? 'text-indigo-600' : ''}`} style={{ fontWeight: 500 }}>{value}</span>
          {copyable && (
            <button onClick={() => navigator.clipboard.writeText(value)} className="p-0.5 hover:bg-gray-100 rounded transition-colors" title="Copier">
              <Copy className="w-3 h-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
