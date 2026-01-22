'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ClientNotifications() {
  const [notificationsTab, setNotificationsTab] = useState<'offres' | 'compte'>('offres');

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8 w-full">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/client-space"
            className="md:hidden p-1 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" style={{ color: '#222222' }} />
          </Link>
          <h2 className="text-2xl md:text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
            Notifications
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-gray-300">
          <button
            onClick={() => setNotificationsTab('offres')}
            className={`pb-3 text-base ${notificationsTab === 'offres' ? 'border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            style={{ fontWeight: notificationsTab === 'offres' ? 600 : 400, color: notificationsTab === 'offres' ? '#222222' : '#6B7280' }}
          >
            Offres et mises à jour
          </button>
          <button
            onClick={() => setNotificationsTab('compte')}
            className={`pb-3 text-base ${notificationsTab === 'compte' ? 'border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            style={{ fontWeight: notificationsTab === 'compte' ? 600 : 400, color: notificationsTab === 'compte' ? '#222222' : '#6B7280' }}
          >
            Compte
          </button>
        </div>

        {/* Tab: Compte */}
        {notificationsTab === 'compte' && (
          <>
            {/* Activité du compte et politiques */}
            <div className="mb-10">
              <h3 className="text-lg md:text-xl mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                Activité du compte et politiques
              </h3>
              <p className="text-sm mb-6" style={{ color: '#C13515' }}>
                Confirmez votre réservation, vérifiez l'activité de votre compte et découvrez les politiques importantes de HOMIQIO.
              </p>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                    Activité du compte
                  </h4>
                  <p className="text-sm mb-3" style={{ color: '#717171' }}>
                    Activé : E-mail
                  </p>
                  <button className="text-base underline hover:no-underline" style={{ fontWeight: 600, color: '#222222' }}>
                    Modifier
                  </button>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                    Politiques pour les voyageurs
                  </h4>
                  <p className="text-sm mb-3" style={{ color: '#717171' }}>
                    Activé : E-mail
                  </p>
                  <button className="text-base underline hover:no-underline" style={{ fontWeight: 600, color: '#222222' }}>
                    Modifier
                  </button>
                </div>
              </div>
            </div>

            {/* Rappels */}
            <div className="mb-10">
              <h3 className="text-lg md:text-xl mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                Rappels
              </h3>
              <p className="text-sm mb-6" style={{ color: '#717171' }}>
                Recevez des rappels importants sur vos réservations, vos annonces et l'activité de votre compte.
              </p>

              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  Rappels
                </h4>
                <p className="text-sm mb-3" style={{ color: '#717171' }}>
                  Activé : E-mail
                </p>
                <button className="text-base underline hover:no-underline" style={{ fontWeight: 600, color: '#222222' }}>
                  Modifier
                </button>
              </div>
            </div>

            {/* Messages entre les hôtes et les voyageurs */}
            <div className="mb-10">
              <h3 className="text-lg md:text-xl mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                Messages entre les hôtes et les voyageurs
              </h3>
              <p className="text-sm mb-6" style={{ color: '#717171' }}>
                Restez en contact avec les hôtes et les voyageurs avant, pendant et après votre réservation.
              </p>

              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  Messages
                </h4>
                <p className="text-sm mb-3" style={{ color: '#717171' }}>
                  Activé : E-mail
                </p>
                <button className="text-base underline hover:no-underline" style={{ fontWeight: 600, color: '#222222' }}>
                  Modifier
                </button>
              </div>
            </div>
          </>
        )}

        {/* Tab: Offres et mises à jour */}
        {notificationsTab === 'offres' && (
          <>
            {/* Conseils et offres de voyage */}
            <div className="mb-12">
              <h3 className="text-lg md:text-xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Conseils et offres de voyage
              </h3>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                Trouvez l'inspiration pour votre prochain voyage en recevant des recommandations personnalisées et des offres spéciales.
              </p>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                    Inspiration et offres
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Activé : E-mail
                  </p>
                  <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                    Modifier
                  </button>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                    Planification du voyage
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Activé : E-mail
                  </p>
                  <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                    Modifier
                  </button>
                </div>
              </div>
            </div>

            {/* Actualités de HOMIQIO */}
            <div className="mb-12">
              <h3 className="text-lg md:text-xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Actualités de HOMIQIO
              </h3>
              <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                Recevez les dernières actualités de HOMIQIO et dites-nous comment nous pouvons nous améliorer.
              </p>

              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                    Actualités et programmes
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Activé : E-mail
                  </p>
                  <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                    Modifier
                  </button>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                    Remarques
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Activé : E-mail
                  </p>
                  <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                    Modifier
                  </button>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                    Réglementation en matière de voyage
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Activé : E-mail
                  </p>
                  <button className="text-base underline" style={{ fontWeight: 600, color: '#222222' }}>
                    Modifier
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="unsubscribe"
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900 cursor-pointer"
              />
              <label htmlFor="unsubscribe" className="text-base text-gray-700 cursor-pointer">
                Je souhaite me désabonner de tous les e-mails marketing
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

