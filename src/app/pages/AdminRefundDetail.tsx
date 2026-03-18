'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle, Clock, XCircle, RotateCcw, AlertTriangle,
  User, Mail, Phone, Calendar, Hash, MapPin, CreditCard, Copy,
  DollarSign, Shield, ArrowUpRight, Ban, Play, Edit3, Scale
} from 'lucide-react';
import { AdminSidebar } from '@/app/components/AdminSidebar';

// ── Types ────────────────────────────────────────────────────────────────────

type RefundStatus = 'Approuve' | 'En cours' | 'En attente' | 'Rejete' | 'Rembourse';
type RefundType = 'Total' | 'Partiel';
type RefundReason = 'Annulation client' | 'Annulation hote' | 'Probleme logement' | 'Erreur paiement' | 'Litige' | 'Force majeure';
type RefundMethod = 'Carte bancaire' | 'PayPal' | 'Virement' | 'Stripe';
type ResponsableRemboursement = 'Plateforme' | 'Hote' | 'Partage';

interface RefundDetail {
  id: string;
  reservationId: string;
  property: { name: string; id: number; city: string; country: string };
  client: { name: string; email: string; phone: string; avatar: string; id: number };
  host: { name: string; email: string; phone: string; avatar: string; id: number; iban: string };
  reason: RefundReason;
  reasonDetails: string;
  refundAmount: number;
  reservationAmount: number;
  commission: number;
  commissionRate: number;
  refundType: RefundType;
  status: RefundStatus;
  method: RefundMethod;
  responsable: ResponsableRemboursement;
  responsableDetails: string;
  requestDate: string;
  processedDate: string | null;
  stripeRefundId: string | null;
  history: { date: string; action: string; actor: string; details: string }[];
}

// ── Status Config ────────────────────────────────────────────────────────────

const refundStatusConfig: Record<RefundStatus, { bg: string; text: string; icon: typeof CheckCircle }> = {
  'Approuve': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  'En cours': { bg: 'bg-orange-50', text: 'text-orange-700', icon: Clock },
  'En attente': { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  'Rejete': { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle },
  'Rembourse': { bg: 'bg-blue-50', text: 'text-blue-700', icon: RotateCcw },
};

// ── Mock Data ────────────────────────────────────────────────────────────────

const refundDetails: Record<string, RefundDetail> = {
  'REM-001': {
    id: 'REM-001', reservationId: 'RES-2401',
    property: { name: 'Villa Toscane', id: 1, city: 'Nice', country: 'France' },
    client: { name: 'Alexandre Leroy', email: 'alex.leroy@email.com', phone: '+33 6 98 76 54 32', avatar: 'AL', id: 10 },
    host: { name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '+33 6 12 34 56 78', avatar: 'JD', id: 1, iban: 'FR76 **** **** **** 4521' },
    reason: 'Annulation client', reasonDetails: 'Le client a annule sa reservation suite a un probleme personnel imprevu. Annulation faite dans le delai autorise par la politique d\'annulation.',
    refundAmount: 1750, reservationAmount: 2012, commission: 301.80, commissionRate: 15,
    refundType: 'Total', status: 'Rembourse', method: 'Carte bancaire',
    responsable: 'Plateforme', responsableDetails: 'Remboursement pris en charge par la plateforme car annulation dans les delais.',
    requestDate: '2025-02-10T09:30:00', processedDate: '2025-02-12T14:15:00',
    stripeRefundId: 're_3NqK8dL2eZvKY3ab1',
    history: [
      { date: '2025-02-12T14:15:00', action: 'Remboursement effectue', actor: 'Systeme', details: 'Virement de 1 750,00 EUR effectue sur la carte bancaire du client' },
      { date: '2025-02-11T10:00:00', action: 'Remboursement approuve', actor: 'Admin (Marie Admin)', details: 'Demande de remboursement validee - conforme a la politique d\'annulation' },
      { date: '2025-02-10T09:30:00', action: 'Demande de remboursement', actor: 'Alexandre Leroy', details: 'Demande de remboursement total suite a annulation de la reservation RES-2401' },
    ],
  },
  'REM-002': {
    id: 'REM-002', reservationId: 'RES-2405',
    property: { name: 'Maison Bord de Mer', id: 5, city: 'Biarritz', country: 'France' },
    client: { name: 'Thomas Petit', email: 'thomas.petit@email.com', phone: '+33 6 88 99 00 11', avatar: 'TP', id: 14 },
    host: { name: 'Thomas Dubois', email: 'thomas.dubois@email.com', phone: '+33 6 44 55 66 77', avatar: 'TD', id: 5, iban: 'FR76 **** **** **** 7833' },
    reason: 'Probleme logement', reasonDetails: 'Le client signale que le logement ne correspondait pas a la description. Plusieurs equipements manquants et probleme de proprete. Photos a l\'appui fournies.',
    refundAmount: 1200, reservationAmount: 2597, commission: 389.55, commissionRate: 15,
    refundType: 'Partiel', status: 'En cours', method: 'Stripe',
    responsable: 'Hote', responsableDetails: 'L\'hote est responsable du remboursement partiel car le logement ne correspondait pas a l\'annonce.',
    requestDate: '2025-02-18T16:45:00', processedDate: null,
    stripeRefundId: null,
    history: [
      { date: '2025-02-20T11:00:00', action: 'En cours de traitement', actor: 'Admin (Marie Admin)', details: 'Verification des preuves en cours. Contact avec l\'hote initie.' },
      { date: '2025-02-19T09:00:00', action: 'Preuves recues', actor: 'Thomas Petit', details: '5 photos et 1 video ajoutees au dossier' },
      { date: '2025-02-18T16:45:00', action: 'Demande de remboursement', actor: 'Thomas Petit', details: 'Demande de remboursement partiel pour non-conformite du logement' },
    ],
  },
  'REM-009': {
    id: 'REM-009', reservationId: 'RES-2440',
    property: { name: 'Villa Cote d\'Azur', id: 10, city: 'Saint-Tropez', country: 'France' },
    client: { name: 'Antoine Girard', email: 'antoine.girard@email.com', phone: '+33 6 77 88 99 00', avatar: 'AG', id: 20 },
    host: { name: 'Thomas Dubois', email: 'thomas.dubois@email.com', phone: '+33 6 44 55 66 77', avatar: 'TD', id: 5, iban: 'FR76 **** **** **** 7833' },
    reason: 'Litige', reasonDetails: 'Litige en cours entre le client et l\'hote concernant des dommages au logement. Le client conteste les frais supplementaires factures par l\'hote.',
    refundAmount: 3200, reservationAmount: 4500, commission: 675, commissionRate: 15,
    refundType: 'Partiel', status: 'En cours', method: 'Carte bancaire',
    responsable: 'Partage', responsableDetails: 'Le remboursement est partage entre la plateforme (40%) et l\'hote (60%) suite a la mediation.',
    requestDate: '2025-03-10T14:00:00', processedDate: null,
    stripeRefundId: null,
    history: [
      { date: '2025-03-12T16:30:00', action: 'Mediation en cours', actor: 'Admin (Jean Admin)', details: 'Session de mediation planifiee entre le client et l\'hote' },
      { date: '2025-03-11T10:00:00', action: 'Reponse de l\'hote', actor: 'Thomas Dubois', details: 'L\'hote conteste partiellement les allegations du client' },
      { date: '2025-03-10T14:00:00', action: 'Litige ouvert', actor: 'Antoine Girard', details: 'Demande de remboursement partiel suite a un litige sur des frais supplementaires' },
    ],
  },
};

function getRefundDetail(id: string): RefundDetail {
  if (refundDetails[id]) return refundDetails[id];
  return {
    id, reservationId: 'RES-0000',
    property: { name: 'Logement Exemple', id: 0, city: 'Paris', country: 'France' },
    client: { name: 'Client Exemple', email: 'client@email.com', phone: '+33 6 00 00 00 00', avatar: 'CE', id: 0 },
    host: { name: 'Hote Exemple', email: 'hote@email.com', phone: '+33 6 00 00 00 00', avatar: 'HE', id: 0, iban: 'FR76 **** **** **** 0000' },
    reason: 'Annulation client', reasonDetails: 'Demande de remboursement standard.',
    refundAmount: 500, reservationAmount: 750, commission: 112.50, commissionRate: 15,
    refundType: 'Total', status: 'En attente', method: 'Carte bancaire',
    responsable: 'Plateforme', responsableDetails: 'A determiner.',
    requestDate: '2025-03-01T12:00:00', processedDate: null,
    stripeRefundId: null,
    history: [
      { date: '2025-03-01T12:00:00', action: 'Demande de remboursement', actor: 'Client', details: 'Demande soumise' },
    ],
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(amount);
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ── Component ────────────────────────────────────────────────────────────────

export function AdminRefundDetail() {
  const params = useParams();
  const refundId = params?.id as string || 'REM-001';
  const refund = getRefundDetail(refundId);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [showEditAmountModal, setShowEditAmountModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [editAmount, setEditAmount] = useState(refund.refundAmount.toString());

  const StatusIcon = refundStatusConfig[refund.status].icon;
  const isPending = refund.status === 'En attente' || refund.status === 'En cours' || refund.status === 'Approuve';

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mt-16 lg:mt-0 mb-6">
          <Link href="/admin/refunds" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Retour aux remboursements
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{refund.id}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs ${refundStatusConfig[refund.status].bg} ${refundStatusConfig[refund.status].text}`} style={{ fontWeight: 600 }}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {refund.status}
                </span>
                <span className={`inline-block px-2.5 py-1 rounded-full text-xs ${refund.refundType === 'Total' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`} style={{ fontWeight: 600 }}>
                  {refund.refundType}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(refund.requestDate)}</span>
                <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" />{refund.method}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Refund Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Informations remboursement</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoRow icon={Hash} label="ID Remboursement" value={refund.id} />
                  <InfoRow icon={Hash} label="ID Reservation" value={refund.reservationId} link />
                  <InfoRow icon={CreditCard} label="Methode" value={refund.method} />
                  <InfoRow icon={Hash} label="Ref. Stripe" value={refund.stripeRefundId || 'Non attribue'} copyable={!!refund.stripeRefundId} />
                  <InfoRow icon={Calendar} label="Date demande" value={formatDateTime(refund.requestDate)} />
                  <InfoRow icon={Calendar} label="Date traitement" value={refund.processedDate ? formatDateTime(refund.processedDate) : 'Non traite'} />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-base" style={{ fontWeight: 600 }}>Motif du remboursement</h2>
                  <span className="inline-block px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700" style={{ fontWeight: 600 }}>{refund.reason}</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 leading-relaxed">{refund.reasonDetails}</p>
              </div>
            </div>

            {/* Financial Detail */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base" style={{ fontWeight: 600 }}>Detail financier</h2>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Montant de la reservation</span>
                    <span style={{ fontWeight: 500 }}>{formatCurrency(refund.reservationAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Commission plateforme ({refund.commissionRate}%)</span>
                    <span className="text-emerald-600" style={{ fontWeight: 500 }}>{formatCurrency(refund.commission)}</span>
                  </div>
                  <div className="h-px bg-gray-100 my-1" />
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ fontWeight: 600 }}>Montant rembourse</span>
                    <span className="text-lg text-blue-600" style={{ fontWeight: 600 }}>{formatCurrency(refund.refundAmount)}</span>
                  </div>
                  {refund.refundType === 'Partiel' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Pourcentage rembourse</span>
                      <span className="text-gray-600" style={{ fontWeight: 500 }}>
                        {((refund.refundAmount / refund.reservationAmount) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Responsable */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-base" style={{ fontWeight: 600 }}>Responsable du remboursement</h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                    refund.responsable === 'Plateforme' ? 'bg-blue-50 text-blue-700' :
                    refund.responsable === 'Hote' ? 'bg-orange-50 text-orange-700' :
                    'bg-purple-50 text-purple-700'
                  }`} style={{ fontWeight: 600 }}>{refund.responsable}</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 leading-relaxed">{refund.responsableDetails}</p>
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
                    {refund.client.avatar}
                  </div>
                  <div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{refund.client.name}</div>
                    <div className="text-xs text-gray-500">Client #{refund.client.id}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />{refund.client.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />{refund.client.phone}
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
                    {refund.host.avatar}
                  </div>
                  <div>
                    <div className="text-sm" style={{ fontWeight: 600 }}>{refund.host.name}</div>
                    <div className="text-xs text-gray-500">Hote #{refund.host.id}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />{refund.host.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />{refund.host.phone}
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
                    {refund.history.map((event, idx) => (
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

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            {/* Property Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-sm" style={{ fontWeight: 600 }}>Logement</h3>
              </div>
              <div className="p-5">
                <div className="text-sm mb-1" style={{ fontWeight: 600 }}>{refund.property.name}</div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />{refund.property.city}, {refund.property.country}
                </div>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-sm" style={{ fontWeight: 600 }}>Resume financier</h3>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Reservation</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(refund.reservationAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Commission</span>
                  <span className="text-sm text-emerald-600" style={{ fontWeight: 600 }}>{formatCurrency(refund.commission)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Rembourse</span>
                  <span className="text-sm text-blue-600" style={{ fontWeight: 600 }}>{formatCurrency(refund.refundAmount)}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${refund.refundType === 'Total' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`} style={{ fontWeight: 600 }}>
                    {refund.refundType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Responsable</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${
                    refund.responsable === 'Plateforme' ? 'bg-blue-50 text-blue-700' :
                    refund.responsable === 'Hote' ? 'bg-orange-50 text-orange-700' :
                    'bg-purple-50 text-purple-700'
                  }`} style={{ fontWeight: 600 }}>{refund.responsable}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Statut</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] ${refundStatusConfig[refund.status].bg} ${refundStatusConfig[refund.status].text}`} style={{ fontWeight: 600 }}>
                    {refund.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-sm" style={{ fontWeight: 600 }}>Actions administrateur</h3>
              </div>
              <div className="p-4 space-y-2">
                {(refund.status === 'En attente' || refund.status === 'En cours') && (
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-emerald-50 transition-colors text-left"
                    style={{ fontWeight: 500 }}
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Approuver remboursement
                  </button>
                )}
                {(refund.status === 'En attente' || refund.status === 'En cours') && (
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-red-50 transition-colors text-left"
                    style={{ fontWeight: 500 }}
                  >
                    <XCircle className="w-4 h-4 text-red-600" />
                    Refuser remboursement
                  </button>
                )}
                {refund.status === 'Approuve' && (
                  <button
                    onClick={() => setShowLaunchModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors text-left"
                    style={{ fontWeight: 500 }}
                  >
                    <Play className="w-4 h-4 text-blue-600" />
                    Lancer remboursement
                  </button>
                )}
                {isPending && (
                  <button
                    onClick={() => { setEditAmount(refund.refundAmount.toString()); setShowEditAmountModal(true); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors text-left"
                    style={{ fontWeight: 500 }}
                  >
                    <Edit3 className="w-4 h-4 text-gray-600" />
                    Modifier montant
                  </button>
                )}
                {refund.reason === 'Litige' && isPending && (
                  <button
                    onClick={() => setShowEscalateModal(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-amber-50 transition-colors text-left"
                    style={{ fontWeight: 500 }}
                  >
                    <Scale className="w-4 h-4 text-amber-600" />
                    Escalader litige
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowApproveModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg" style={{ fontWeight: 600 }}>Approuver le remboursement</h3>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Remboursement</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{refund.id}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Client</span>
                  <span className="text-sm" style={{ fontWeight: 500 }}>{refund.client.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Montant</span>
                  <span className="text-sm text-blue-600" style={{ fontWeight: 600 }}>{formatCurrency(refund.refundAmount)}</span>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <p className="text-sm text-emerald-700">Le remboursement sera approuve et pret a etre lance.</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center gap-3">
              <button onClick={() => setShowApproveModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={() => setShowApproveModal(false)} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors" style={{ fontWeight: 500 }}>
                Approuver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg" style={{ fontWeight: 600 }}>Refuser le remboursement</h3>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Remboursement</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{refund.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Montant</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(refund.refundAmount)}</span>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm mb-2" style={{ fontWeight: 500 }}>Raison du refus</label>
                <textarea
                  rows={3}
                  placeholder="Expliquez la raison du refus..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827] resize-none"
                />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Le client sera notifie du refus et pourra contester la decision.</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center gap-3">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button onClick={() => setShowRejectModal(false)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors" style={{ fontWeight: 500 }}>
                Refuser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Launch Refund Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowLaunchModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-center text-lg mb-2" style={{ fontWeight: 600 }}>Lancer le remboursement ?</h3>
              <p className="text-center text-sm text-gray-500 mb-4">
                Le montant de {formatCurrency(refund.refundAmount)} sera rembourse au client via {refund.method}.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700">Cette action est irreversible.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowLaunchModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>
                  Annuler
                </button>
                <button onClick={() => setShowLaunchModal(false)} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors" style={{ fontWeight: 500 }}>
                  Lancer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Amount Modal */}
      {showEditAmountModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditAmountModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg" style={{ fontWeight: 600 }}>Modifier le montant du remboursement</h3>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Montant reservation</span>
                  <span className="text-sm" style={{ fontWeight: 600 }}>{formatCurrency(refund.reservationAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Montant actuel</span>
                  <span className="text-sm text-blue-600" style={{ fontWeight: 600 }}>{formatCurrency(refund.refundAmount)}</span>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm mb-2" style={{ fontWeight: 500 }}>Nouveau montant</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EUR</span>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    max={refund.reservationAmount}
                    min={0}
                    step="0.01"
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827]"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm mb-2" style={{ fontWeight: 500 }}>Raison de la modification</label>
                <textarea
                  rows={2}
                  placeholder="Expliquez la raison..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#111827] resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center gap-3">
              <button onClick={() => setShowEditAmountModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>
                Annuler
              </button>
              <button
                onClick={() => setShowEditAmountModal(false)}
                disabled={!editAmount || parseFloat(editAmount) <= 0 || parseFloat(editAmount) > refund.reservationAmount}
                className="flex-1 px-4 py-2.5 bg-[#111827] text-white rounded-lg text-sm hover:bg-[#1f2937] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontWeight: 500 }}
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalate Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEscalateModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-center text-lg mb-2" style={{ fontWeight: 600 }}>Escalader le litige ?</h3>
              <p className="text-center text-sm text-gray-500 mb-6">
                Le litige sera escalade au niveau superieur pour une resolution plus approfondie. Les deux parties seront notifiees.
              </p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowEscalateModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors" style={{ fontWeight: 500 }}>
                  Annuler
                </button>
                <button onClick={() => setShowEscalateModal(false)} className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700 transition-colors" style={{ fontWeight: 500 }}>
                  Escalader
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
