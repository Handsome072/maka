'use client';

import { useRouter } from 'next/navigation';
import { HostSidebar } from '@/app/components/HostSidebar';
import { useState } from 'react';
import { ArrowLeft, Calendar, Users, MapPin, Mail, Phone, MessageSquare, Clock, Check, X } from 'lucide-react';

interface HostReservationDetailProps {
  reservationId: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:     { label: 'En attente',  color: '#9333EA', bg: '#F3E8FF' },
  confirmed:   { label: 'Confirmée',   color: '#B45309', bg: '#FEF3C7' },
  in_progress: { label: 'En cours',    color: '#065F46', bg: '#D1FAE5' },
  completed:   { label: 'Terminée',    color: '#4B5563', bg: '#F3F4F6' },
  cancelled:   { label: 'Annulée',     color: '#991B1B', bg: '#FEE2E2' },
};

const MOCK_DETAIL = {
  'RES-001': {
    id: 'RES-001',
    status: 'confirmed',
    property: { name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant', address: '123 Chemin du Sommet, Mont-Tremblant, QC' },
    checkIn: '22 mars 2026',
    checkInTime: '15:00',
    checkOut: '29 mars 2026',
    checkOutTime: '11:00',
    nights: 7,
    guests: 4,
    guest: {
      name: 'Alexandre Leroy',
      avatar: 'AL',
      email: 'alexandre.leroy@email.com',
      phone: '+1 514 555 0101',
    },
    payment: {
      total: '2 450 $',
      commission: '245 $',
      hostRevenue: '2 205 $',
    },
    bookedAt: '5 mars 2026',
  },
  'RES-002': {
    id: 'RES-002',
    status: 'in_progress',
    property: { name: 'Appartement Vieux-Montréal', city: 'Montréal', address: '45 Rue Saint-Paul, Montréal, QC' },
    checkIn: '3 mars 2026',
    checkInTime: '15:00',
    checkOut: '8 mars 2026',
    checkOutTime: '11:00',
    nights: 5,
    guests: 2,
    guest: {
      name: 'Camille Bernard',
      avatar: 'CB',
      email: 'camille.bernard@email.com',
      phone: '+1 514 555 0202',
    },
    payment: {
      total: '980 $',
      commission: '98 $',
      hostRevenue: '882 $',
    },
    bookedAt: '20 fév. 2026',
  },
  'RES-003': {
    id: 'RES-003',
    status: 'confirmed',
    property: { name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant', address: '123 Chemin du Sommet, Mont-Tremblant, QC' },
    checkIn: '15 mars 2026',
    checkInTime: '15:00',
    checkOut: '20 mars 2026',
    checkOutTime: '11:00',
    nights: 5,
    guests: 6,
    guest: {
      name: 'Lucas Bouchard',
      avatar: 'LB',
      email: 'lucas.bouchard@email.com',
      phone: '+1 438 555 0303',
    },
    payment: {
      total: '1 750 $',
      commission: '175 $',
      hostRevenue: '1 575 $',
    },
    bookedAt: '28 fév. 2026',
  },
  'RES-004': {
    id: 'RES-004',
    status: 'completed',
    property: { name: 'Appartement Vieux-Montréal', city: 'Montréal', address: '45 Rue Saint-Paul, Montréal, QC' },
    checkIn: '10 fév. 2026',
    checkInTime: '15:00',
    checkOut: '14 fév. 2026',
    checkOutTime: '11:00',
    nights: 4,
    guests: 2,
    guest: {
      name: 'Sophie Moreau',
      avatar: 'SM',
      email: 'sophie.moreau@email.com',
      phone: '+1 514 555 0404',
    },
    payment: {
      total: '720 $',
      commission: '72 $',
      hostRevenue: '648 $',
    },
    bookedAt: '25 janv. 2026',
  },
  'RES-005': {
    id: 'RES-005',
    status: 'completed',
    property: { name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant', address: '123 Chemin du Sommet, Mont-Tremblant, QC' },
    checkIn: '1 fév. 2026',
    checkInTime: '15:00',
    checkOut: '8 fév. 2026',
    checkOutTime: '11:00',
    nights: 7,
    guests: 5,
    guest: {
      name: 'Thomas Dubois',
      avatar: 'TD',
      email: 'thomas.dubois@email.com',
      phone: '+1 438 555 0505',
    },
    payment: {
      total: '3 150 $',
      commission: '315 $',
      hostRevenue: '2 835 $',
    },
    bookedAt: '15 janv. 2026',
  },
  'RES-006': {
    id: 'RES-006',
    status: 'cancelled',
    property: { name: 'Appartement Vieux-Montréal', city: 'Montréal', address: '45 Rue Saint-Paul, Montréal, QC' },
    checkIn: '20 fév. 2026',
    checkInTime: '15:00',
    checkOut: '25 fév. 2026',
    checkOutTime: '11:00',
    nights: 5,
    guests: 3,
    guest: {
      name: 'Julie Martin',
      avatar: 'JM',
      email: 'julie.martin@email.com',
      phone: '+1 514 555 0606',
    },
    payment: {
      total: '1 120 $',
      commission: '112 $',
      hostRevenue: '1 008 $',
    },
    bookedAt: '5 fév. 2026',
  },
  'RES-007': {
    id: 'RES-007',
    status: 'confirmed',
    property: { name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant', address: '123 Chemin du Sommet, Mont-Tremblant, QC' },
    checkIn: '28 mars 2026',
    checkInTime: '15:00',
    checkOut: '4 avr. 2026',
    checkOutTime: '11:00',
    nights: 7,
    guests: 4,
    guest: {
      name: 'Marc Rousseau',
      avatar: 'MR',
      email: 'marc.rousseau@email.com',
      phone: '+1 438 555 0707',
    },
    payment: {
      total: '2 800 $',
      commission: '280 $',
      hostRevenue: '2 520 $',
    },
    bookedAt: '1 mars 2026',
  },
  'RES-008': {
    id: 'RES-008',
    status: 'pending',
    property: { name: 'Chalet Mont-Tremblant', city: 'Mont-Tremblant', address: '123 Chemin du Sommet, Mont-Tremblant, QC' },
    checkIn: '10 avr. 2026',
    checkInTime: '15:00',
    checkOut: '15 avr. 2026',
    checkOutTime: '11:00',
    nights: 5,
    guests: 3,
    guest: {
      name: 'Élodie Tremblay',
      avatar: 'ET',
      email: 'elodie.tremblay@email.com',
      phone: '+1 514 555 0808',
    },
    payment: {
      total: '1 890 $',
      commission: '189 $',
      hostRevenue: '1 701 $',
    },
    bookedAt: '6 mars 2026',
  },
  'RES-009': {
    id: 'RES-009',
    status: 'pending',
    property: { name: 'Appartement Vieux-Montréal', city: 'Montréal', address: '45 Rue Saint-Paul, Montréal, QC' },
    checkIn: '18 avr. 2026',
    checkInTime: '15:00',
    checkOut: '22 avr. 2026',
    checkOutTime: '11:00',
    nights: 4,
    guests: 2,
    guest: {
      name: 'Hugo Lavoie',
      avatar: 'HL',
      email: 'hugo.lavoie@email.com',
      phone: '+1 438 555 0909',
    },
    payment: {
      total: '760 $',
      commission: '76 $',
      hostRevenue: '684 $',
    },
    bookedAt: '7 mars 2026',
  },
} as Record<string, any>;

export function HostReservationDetail({ reservationId }: HostReservationDetailProps) {
  const router = useRouter();
  const [reservationData, setReservationData] = useState(MOCK_DETAIL);
  const [actionConfirm, setActionConfirm] = useState<{ action: 'accept' | 'refuse' } | null>(null);
  const reservation = reservationData[reservationId];

  const handleAccept = () => {
    setReservationData(prev => ({
      ...prev,
      [reservationId]: { ...prev[reservationId], status: 'confirmed' },
    }));
    setActionConfirm(null);
  };

  const handleRefuse = () => {
    setReservationData(prev => ({
      ...prev,
      [reservationId]: { ...prev[reservationId], status: 'cancelled' },
    }));
    setActionConfirm(null);
  };

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HostSidebar activePage="host-reservations" />
        <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
          <button
            onClick={() => router.push('/annonces/reservations')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 mt-16 lg:mt-0"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux réservations
          </button>
          <div className="text-center py-24">
            <h2 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>Réservation introuvable</h2>
            <p className="text-sm" style={{ color: '#717171' }}>Cette réservation n'existe pas ou a été supprimée.</p>
          </div>
        </main>
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[reservation.status] || STATUS_CONFIG.confirmed;

  return (
    <div className="min-h-screen bg-gray-50">
      <HostSidebar activePage="host-reservations" />

      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8">
        {/* Back button */}
        <button
          onClick={() => router.push('/annonces/reservations')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 mt-16 lg:mt-0"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm" style={{ fontWeight: 500 }}>Retour aux réservations</span>
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
              Réservation {reservation.id}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#717171' }}>
              Réservé le {reservation.bookedAt}
            </p>
          </div>
          <span
            className="inline-block self-start px-3 py-1.5 rounded-full text-sm"
            style={{ fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color }}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Action banner for pending reservations */}
        {reservation.status === 'pending' && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-6">
            <p className="text-sm mb-4" style={{ fontWeight: 500, color: '#6B21A8' }}>
              Ce voyageur souhaite réserver votre logement. Acceptez ou refusez cette demande.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setActionConfirm({ action: 'accept' })}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white transition-colors hover:opacity-90"
                style={{ fontWeight: 600, backgroundColor: '#065F46' }}
              >
                <Check className="w-5 h-5" />
                Accepter la réservation
              </button>
              <button
                onClick={() => setActionConfirm({ action: 'refuse' })}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm text-white transition-colors hover:opacity-90"
                style={{ fontWeight: 600, backgroundColor: '#991B1B' }}
              >
                <X className="w-5 h-5" />
                Refuser la réservation
              </button>
              <button
                onClick={() => router.push('/annonces/inbox')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                <MessageSquare className="w-5 h-5" />
                Envoyer un message
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stay info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base mb-5" style={{ fontWeight: 600, color: '#222222' }}>Informations du séjour</h2>

              <div className="space-y-4">
                {/* Property */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{reservation.property.name}</p>
                    <p className="text-sm" style={{ color: '#717171' }}>{reservation.property.address}</p>
                  </div>
                </div>

                {/* Dates grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs" style={{ color: '#717171' }}>Check-in</p>
                      <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{reservation.checkIn}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>à partir de {reservation.checkInTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs" style={{ color: '#717171' }}>Check-out</p>
                      <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{reservation.checkOut}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>avant {reservation.checkOutTime}</p>
                    </div>
                  </div>
                </div>

                {/* Duration & guests */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs" style={{ color: '#717171' }}>Durée du séjour</p>
                      <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{reservation.nights} nuit{reservation.nights > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs" style={{ color: '#717171' }}>Nombre de voyageurs</p>
                      <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{reservation.guests} voyageur{reservation.guests > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest info */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base mb-5" style={{ fontWeight: 600, color: '#222222' }}>Informations voyageur</h2>

              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0"
                  style={{ fontWeight: 600, backgroundColor: '#222222' }}
                >
                  {reservation.guest.avatar}
                </div>
                <div>
                  <p className="text-base" style={{ fontWeight: 600, color: '#222222' }}>{reservation.guest.name}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm" style={{ color: '#222222' }}>{reservation.guest.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm" style={{ color: '#222222' }}>{reservation.guest.phone}</span>
                </div>
              </div>

              {/* Contact actions */}
              {(reservation.status === 'pending' || reservation.status === 'confirmed' || reservation.status === 'in_progress') && (
                <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
                  <button
                    onClick={() => router.push('/annonces/inbox')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm"
                    style={{ fontWeight: 600, color: '#222222' }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Envoyer un message
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Payment */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base mb-5" style={{ fontWeight: 600, color: '#222222' }}>Informations paiement</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#717171' }}>Montant total</span>
                  <span className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>{reservation.payment.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#717171' }}>Commission plateforme</span>
                  <span className="text-sm" style={{ color: '#991B1B' }}>- {reservation.payment.commission}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>Revenu estimé</span>
                  <span className="text-base" style={{ fontWeight: 700, color: '#065F46' }}>{reservation.payment.hostRevenue}</span>
                </div>
              </div>

              <p className="text-xs mt-4 p-3 rounded-lg" style={{ backgroundColor: '#F9FAFB', color: '#9CA3AF' }}>
                Les détails complets des paiements sont disponibles dans la section Revenus.
              </p>
            </div>

            {/* Quick summary card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222' }}>Résumé</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#717171' }}>ID réservation</span>
                  <span className="font-mono" style={{ fontWeight: 500, color: '#222222' }}>{reservation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#717171' }}>Statut</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{ fontWeight: 600, backgroundColor: statusInfo.bg, color: statusInfo.color }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#717171' }}>Réservé le</span>
                  <span style={{ color: '#222222' }}>{reservation.bookedAt}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation modal */}
      {actionConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
              {actionConfirm.action === 'accept' ? 'Accepter la réservation ?' : 'Refuser la réservation ?'}
            </h3>
            <p className="text-sm mb-6" style={{ color: '#717171' }}>
              {actionConfirm.action === 'accept'
                ? 'Le voyageur sera notifié et la réservation sera confirmée.'
                : 'Le voyageur sera notifié de votre refus. Cette action est irréversible.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setActionConfirm(null)}
                className="flex-1 py-2.5 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Annuler
              </button>
              <button
                onClick={() => actionConfirm.action === 'accept' ? handleAccept() : handleRefuse()}
                className="flex-1 py-2.5 rounded-lg text-sm text-white transition-colors"
                style={{
                  fontWeight: 600,
                  backgroundColor: actionConfirm.action === 'accept' ? '#065F46' : '#991B1B',
                }}
              >
                {actionConfirm.action === 'accept' ? 'Confirmer' : 'Refuser'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
