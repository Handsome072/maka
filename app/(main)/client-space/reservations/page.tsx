'use client';

import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Star } from 'lucide-react';

interface Reservation {
  id: string;
  property: string;
  image: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
}

const reservations: Reservation[] = [
  {
    id: '1',
    property: 'Appartement moderne avec vue',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    location: 'Paris, France',
    checkIn: '15 janv. 2025',
    checkOut: '18 janv. 2025',
    guests: 2,
    status: 'upcoming',
    price: 262.68
  },
  {
    id: '2',
    property: 'Studio cosy près de la Tour Eiffel',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    location: 'Paris, France',
    checkIn: '5 déc. 2024',
    checkOut: '8 déc. 2024',
    guests: 1,
    status: 'completed',
    price: 189.50
  }
];

/**
 * Page Réservations
 */
export default function ReservationsPage() {
  const router = useRouter();

  const upcomingReservations = reservations.filter(r => r.status === 'upcoming');
  const pastReservations = reservations.filter(r => r.status !== 'upcoming');

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Mes réservations</h1>

      {/* Upcoming */}
      {upcomingReservations.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-4">À venir</h2>
          <div className="space-y-4">
            {upcomingReservations.map((reservation) => (
              <div 
                key={reservation.id}
                onClick={() => router.push(`/client-space/reservations/${reservation.id}`)}
                className="flex gap-4 p-4 border rounded-xl cursor-pointer hover:shadow-md transition-shadow"
              >
                <img 
                  src={reservation.image} 
                  alt={reservation.property}
                  className="w-32 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{reservation.property}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                    <MapPin className="w-4 h-4" />
                    {reservation.location}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {reservation.checkIn} - {reservation.checkOut}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Confirmée
                  </span>
                  <p className="mt-2 font-semibold">{reservation.price.toFixed(2)} €</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {pastReservations.length > 0 && (
        <section>
          <h2 className="text-lg font-medium mb-4">Historique</h2>
          <div className="space-y-4">
            {pastReservations.map((reservation) => (
              <div 
                key={reservation.id}
                className="flex gap-4 p-4 border rounded-xl opacity-75"
              >
                <img 
                  src={reservation.image} 
                  alt={reservation.property}
                  className="w-32 h-24 object-cover rounded-lg grayscale"
                />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{reservation.property}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                    <MapPin className="w-4 h-4" />
                    {reservation.location}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {reservation.checkIn} - {reservation.checkOut}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    Terminée
                  </span>
                  <p className="mt-2 font-semibold">{reservation.price.toFixed(2)} €</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {reservations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Aucune réservation pour le moment</p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#00A99D] text-white rounded-lg hover:bg-[#008B82]"
          >
            Explorer les logements
          </button>
        </div>
      )}
    </div>
  );
}

