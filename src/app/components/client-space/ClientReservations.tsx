'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ReservationDetail } from '@/app/components/ReservationDetail';

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1595848463742-764e6b5c11d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1646662521253-5b9253b1a207?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1680601531588-1944422d1bd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1536494126589-29fadf0d7e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1719849448528-bf30db61d3a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1693478075635-bf2742c3ea09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  'https://images.unsplash.com/photo-1549387025-c6b3d88e0ccb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
];

export function ClientReservations() {
  const [showReservationDetail, setShowReservationDetail] = useState(false);

  if (showReservationDetail) {
    return (
      <ReservationDetail
        reservation={{
          id: '123',
          propertyImage: PROPERTY_IMAGES[4],
          propertyTitle: 'Appartement T2',
          dates: '03 - 10 Septembre 2024',
          guests: 1,
          totalPrice: 700,
          status: 'confirmed',
          address: 'Croix Verte, Antananarivo'
        }}
        onBack={() => setShowReservationDetail(false)}
      />
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8 w-full">
      <div className="flex items-center gap-3 mb-8">
        <Link 
          href="/client-space"
          className="md:hidden p-1 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" style={{ color: '#222222' }} />
        </Link>
        <h2 className="text-xl md:text-2xl" style={{ fontWeight: 600, color: '#222222' }}>
          Mes réservations
        </h2>
      </div>

      {/* RÉSERVATION(S) FUTURE(S) */}
      <div className="mb-8">
        <h3 className="text-xs mb-4" style={{ fontWeight: 700, color: '#4A5B8C', letterSpacing: '0.5px' }}>
          RÉSERVATION(S) FUTURE(S)
        </h3>

        <div
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowReservationDetail(true)}
        >
          <img
            src={PROPERTY_IMAGES[4]}
            alt="Appartement"
            className="w-full md:w-48 h-40 md:h-32 object-cover rounded-lg flex-shrink-0"
          />

          <div className="flex-1 min-w-0 py-1">
            <h4 className="text-base font-medium mb-1.5" style={{ color: '#4A5B8C' }}>
              Appartement T2
            </h4>
            <p className="text-xs text-gray-500 mb-2">
              Date d'arrivée : <span className="font-semibold">03/09/2024</span> | <span className="font-semibold">1 occupant</span>
            </p>

            <div className="flex items-center gap-3 md:gap-4 flex-wrap mt-auto">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Croix Verte</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
                </svg>
                <span>2</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <span>1</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2m-16 0h16m-16 0v10a2 2 0 002 2h12a2 2 0 002-2V8m-16 0h16" />
                </svg>
                <span>42m2</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>T2</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>3 à 4</span>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col items-center md:items-end justify-between md:justify-end gap-3 min-w-[140px]">
            <div
              className="rounded-md px-3 py-2 flex flex-col items-center justify-center w-full"
              style={{ backgroundColor: '#222222' }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <span className="text-[10px] text-white opacity-90 whitespace-nowrap font-medium">TOTAL / MOIS</span>
              </div>
              <span className="text-lg text-white font-bold">700 €</span>
            </div>

            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-[11px] font-semibold hover:bg-gray-50 transition-colors bg-white w-full uppercase"
              style={{ color: '#222222' }}
              onClick={(e) => {
                e.stopPropagation();
                // Handle cancellation logic here
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      {/* DERNIÈRES RÉSERVATIONS */}
      <div className="mb-8">
        <h3 className="text-xs mb-4" style={{ fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px' }}>
          DERNIÈRES RÉSERVATIONS
        </h3>

        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 cursor-pointer hover:shadow-md transition-shadow">
              <img
                src={PROPERTY_IMAGES[index % PROPERTY_IMAGES.length]}
                alt="Appartement"
                className="w-full md:w-48 h-40 md:h-32 object-cover rounded-lg flex-shrink-0"
              />

              <div className="flex-1 min-w-0 py-1">
                <h4 className="text-base font-medium mb-1.5" style={{ color: '#9CA3AF' }}>
                  Appartement T2
                </h4>
                <p className="text-xs text-gray-400 mb-2">
                  Date d'arrivée : <span className="font-semibold">03/09/2024</span> | <span className="font-semibold">1 occupant</span>
                </p>

                <div className="flex items-center gap-3 md:gap-4 flex-wrap mt-auto">
                    {/* Simplified for brevity in this example, normally would duplicate the icons */}
                   <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span>Croix Verte</span>
                   </div>
                   {/* ... other details ... */}
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-end gap-3 min-w-[140px]">
                <div
                  className="rounded-md px-3 py-2 flex flex-col items-center justify-center w-full"
                  style={{ backgroundColor: '#9CA3AF' }}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] text-white opacity-90 whitespace-nowrap font-medium">TOTAL / MOIS</span>
                  </div>
                  <span className="text-lg text-white font-bold">700 €</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
       {/* RÉSERVATIONS ANNULÉES */}
        <div>
            <h3 className="text-xs mb-4" style={{ fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px' }}>
            RÉSERVATIONS ANNULÉES
            </h3>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
            <img
                src={PROPERTY_IMAGES[3]}
                alt="Appartement"
                className="w-full md:w-48 h-40 md:h-32 object-cover rounded-lg flex-shrink-0"
            />
             {/* Content similar to above ... */}
             <div className="flex-1 min-w-0 py-1">
                <h4 className="text-base font-medium mb-1.5" style={{ color: '#9CA3AF' }}>
                Appartement T2
                </h4>
                 <p className="text-xs text-gray-400 mb-2">
                Date d'arrivée : <span className="font-semibold">03/09/2024</span> | <span className="font-semibold">1 occupant</span>
                </p>
             </div>
            </div>
        </div>

    </div>
  );
}

