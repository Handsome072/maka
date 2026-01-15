'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Users, Phone, MessageSquare, Star } from 'lucide-react';

/**
 * Client Component pour la page Détail de réservation
 */
export function ReservationDetailClient() {
  const router = useRouter();
  const params = useParams();
  const reservationId = params.reservationId as string;

  // Mock data
  const reservation = {
    id: reservationId,
    property: 'Appartement moderne avec vue panoramique',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    location: 'Paris, France',
    address: '15 Rue de la Paix, 75002 Paris',
    checkIn: '15 janv. 2025',
    checkInTime: '15:00',
    checkOut: '18 janv. 2025',
    checkOutTime: '11:00',
    guests: 2,
    nights: 3,
    pricePerNight: 87.56,
    status: 'upcoming',
    host: {
      name: 'Marie L.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      rating: 4.9,
      responseRate: '100%'
    },
    confirmationCode: 'HMQ2025011501'
  };

  const subtotal = reservation.nights * reservation.pricePerNight;
  const taxes = subtotal * 0.10;
  const total = subtotal + taxes;

  return (
    <div>
      {/* Back button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour aux réservations
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Info */}
          <div className="flex gap-4">
            <img 
              src={reservation.image} 
              alt={reservation.property}
              className="w-40 h-28 object-cover rounded-xl"
            />
            <div>
              <h1 className="text-xl font-semibold mb-1">{reservation.property}</h1>
              <p className="text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {reservation.location}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Confirmée
              </span>
            </div>
          </div>

          {/* Confirmation Code */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">Code de confirmation</p>
            <p className="text-lg font-mono font-semibold">{reservation.confirmationCode}</p>
          </div>

          {/* Trip Details */}
          <div className="border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Détails du voyage</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Arrivée
                </p>
                <p className="font-medium">{reservation.checkIn}</p>
                <p className="text-sm text-gray-500">à partir de {reservation.checkInTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Départ
                </p>
                <p className="font-medium">{reservation.checkOut}</p>
                <p className="text-sm text-gray-500">avant {reservation.checkOutTime}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="w-4 h-4" />
                Voyageurs
              </p>
              <p className="font-medium">{reservation.guests} voyageur(s)</p>
            </div>

            <div>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Adresse
              </p>
              <p className="font-medium">{reservation.address}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border rounded-lg hover:bg-gray-50">
              <MessageSquare className="w-5 h-5" />
              Contacter l'hôte
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 border rounded-lg hover:bg-gray-50">
              <Phone className="w-5 h-5" />
              Appeler l'hôte
            </button>
          </div>
        </div>

        {/* Sidebar - Host & Price */}
        <div className="space-y-6">
          {/* Host */}
          <div className="border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Votre hôte</h3>
            <div className="flex items-center gap-3">
              <img
                src={reservation.host.avatar}
                alt={reservation.host.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{reservation.host.name}</p>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                  {reservation.host.rating} · {reservation.host.responseRate} réponse
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Détail du prix</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{reservation.pricePerNight.toFixed(2)} € x {reservation.nights} nuits</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>{taxes.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-semibold pt-3 border-t">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

