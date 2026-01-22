'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ClientPayments() {
  const [paymentsTab, setPaymentsTab] = useState<'paiements' | 'versements' | 'frais'>('paiements');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payoutStep, setPayoutStep] = useState<'none' | 'method' | 'owner' | 'details'>('none');

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
            Paiements
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-gray-300">
          <button
            onClick={() => setPaymentsTab('paiements')}
            className={`pb-3 text-base ${paymentsTab === 'paiements' ? 'border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            style={{ fontWeight: paymentsTab === 'paiements' ? 600 : 400, color: paymentsTab === 'paiements' ? '#222222' : '#6B7280' }}
          >
            Paiements
          </button>
          <button
            onClick={() => setPaymentsTab('versements')}
            className={`pb-3 text-base ${paymentsTab === 'versements' ? 'border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            style={{ fontWeight: paymentsTab === 'versements' ? 600 : 400, color: paymentsTab === 'versements' ? '#222222' : '#6B7280' }}
          >
            Versements
          </button>
          <button
            onClick={() => setPaymentsTab('frais')}
            className={`pb-3 text-base ${paymentsTab === 'frais' ? 'border-b-2 border-gray-900' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
            style={{ fontWeight: paymentsTab === 'frais' ? 600 : 400, color: paymentsTab === 'frais' ? '#222222' : '#6B7280' }}
          >
            Frais de service
          </button>
        </div>

        {/* Tab: Paiements */}
        {paymentsTab === 'paiements' && (
          <>
            {/* Vos paiements */}
            <div className="mb-12">
              <h3 className="text-lg md:text-xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Vos paiements
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Faites le suivi de tous vos paiements et remboursements.
              </p>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg text-base transition-colors hover:bg-gray-800" style={{ fontWeight: 600 }}>
                Gérer les paiements
              </button>
            </div>

            {/* Modes de paiement */}
            <div className="mb-12">
              <h3 className="text-lg md:text-xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Modes de paiement
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Ajoutez un mode de paiement à l'aide de notre système de paiement sécurisé, puis commencez à organiser votre prochain voyage.
              </p>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg text-base transition-colors hover:bg-gray-800"
                style={{ fontWeight: 600 }}
              >
                Ajouter un mode de paiement
              </button>
            </div>

            {/* Crédit cadeau HOMIQIO */}
            <div>
              <h3 className="text-lg md:text-xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                Crédit cadeau HOMIQIO
              </h3>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-lg text-base transition-colors hover:bg-gray-800" style={{ fontWeight: 600 }}>
                Ajouter une carte cadeau
              </button>
            </div>
          </>
        )}

        {/* Tab: Versements */}
        {paymentsTab === 'versements' && (
          <>
            {/* Votre mode de versement */}
            <div className="mb-12">
              <h3 className="text-lg md:text-xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Votre mode de versement
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Ajoutez au moins un mode de versement pour nous indiquer où envoyer votre argent.
              </p>
              <button
                onClick={() => setPayoutStep('method')}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg text-base transition-colors hover:bg-gray-800"
                style={{ fontWeight: 600 }}
              >
                Configurer les versements
              </button>
            </div>

            {/* Besoin d'aide ? */}
            <div className="border border-gray-300 rounded-xl p-6">
              <h3 className="text-lg mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                Besoin d'aide ?
              </h3>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-between py-3 border-b border-gray-200 text-left">
                  <span className="text-base underline" style={{ fontWeight: 400, color: '#222222' }}>
                    Quand vais-je recevoir mes versements ?
                  </span>
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between py-3 border-b border-gray-200 text-left">
                  <span className="text-base underline" style={{ fontWeight: 400, color: '#222222' }}>
                    Fonctionnement des versements
                  </span>
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between py-3 text-left">
                  <span className="text-base underline" style={{ fontWeight: 400, color: '#222222' }}>
                    Accéder à mon historique des transactions
                  </span>
                  <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Tab: Frais de service */}
        {paymentsTab === 'frais' && (
          <>
            {/* Paramètres des frais de service */}
            <div className="mb-8">
              <h3 className="text-lg md:text-xl mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                Paramètres des frais de service
              </h3>
              <p className="text-sm mb-6" style={{ color: '#C13515' }}>
                Choisissez une option de tarification des frais de service pour toutes vos annonces.
              </p>

              <div className="space-y-4 mb-6">
                {/* Frais uniques */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center group-hover:border-gray-900 transition-colors">
                      <div className="w-2.5 h-2.5 rounded-full bg-transparent"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base" style={{ fontWeight: 400, color: '#222222' }}>
                        Frais uniques
                      </span>
                      <span className="px-2 py-0.5 text-xs" style={{ fontWeight: 600, color: '#222222', backgroundColor: '#F7F7F7', borderRadius: '4px' }}>
                        RECOMMANDÉ
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#717171' }}>
                      HOMIQIO déduit 15,5 % de chaque versement. Les frais de service ne sont jamais facturés aux voyageurs : le prix que vous fixez correspond au prix payé par les voyageurs.
                    </p>
                  </div>
                </label>

                {/* Frais partagés */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-900"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base" style={{ fontWeight: 400, color: '#222222' }}>
                        Frais partagés
                      </span>
                      <span className="text-sm" style={{ fontWeight: 400, color: '#717171' }}>
                        (PARAMÈTRE ACTUEL)
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#717171' }}>
                      HOMIQIO déduit 3 % de vos revenus. Les voyageurs paient des frais de service de 14,1 à 16,5 %, en plus de tout montant facturé par les hôtes, dont le prix par nuit, les frais de ménage et les frais pour les animaux.
                    </p>
                  </div>
                </label>
              </div>

              <p className="text-sm mb-6" style={{ color: '#C13515' }}>
                Pour les logements situés au Brésil, HOMIQIO déduit 16 % de frais d'hôte pour les frais uniques et 4 % pour les frais partagés.
              </p>

              {/* Encart avec icône */}
              <div className="border border-gray-300 rounded-xl p-6 mb-8" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                      <rect x="8" y="12" width="32" height="24" rx="2" stroke="#E91E63" strokeWidth="2" fill="none" />
                      <path d="M16 12V8C16 6.89543 16.8954 6 18 6H30C31.1046 6 32 6.89543 32 8V12" stroke="#E91E63" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="24" cy="24" r="3" fill="#E91E63" />
                      <path d="M20 30H28" stroke="#E91E63" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                      Un versement inchangé, un tarif simplifié
                    </h4>
                    <p className="text-sm mb-2 leading-relaxed" style={{ color: '#717171' }}>
                      Vous pouvez gagner le même montant, sans que vos voyageurs ne paient davantage. Choisissez simplement des frais uniques et ajustez vos prix en conséquence.
                    </p>
                    <button className="text-sm underline hover:no-underline" style={{ fontWeight: 600, color: '#222222' }}>
                      Voir un exemple
                    </button>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex items-center gap-4">
                <button
                  className="px-6 py-3 rounded-lg text-base cursor-not-allowed"
                  style={{
                    fontWeight: 600,
                    backgroundColor: '#EBEBEB',
                    color: '#B0B0B0'
                  }}
                  disabled
                >
                  Enregistrer
                </button>
                <button
                  className="px-6 py-3 border-2 rounded-lg text-base transition-colors hover:bg-gray-50"
                  style={{
                    fontWeight: 600,
                    color: '#222222',
                    borderColor: '#222222'
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Ajouter un mode de paiement */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            {/* Bouton fermer */}
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Titre */}
            <h2 className="text-base text-center mb-6 mt-2" style={{ fontWeight: 600, color: '#222222' }}>
              Indiquez les informations de votre carte
            </h2>

            {/* Logos cartes */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                <span className="text-xs px-2 py-0.5 border border-blue-600 text-blue-600" style={{ fontWeight: 600 }}>VISA</span>
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                  <div className="w-3 h-3 rounded-full bg-orange-400 opacity-80" style={{ marginLeft: '-6px' }}></div>
                </div>
                <span className="text-xs px-1.5 py-0.5 bg-blue-600 text-white" style={{ fontWeight: 600 }}>AMERICAN EXPRESS</span>
              </div>
            </div>

            {/* Formulaire */}
            <div className="space-y-4">
              {/* Numéro de carte */}
              <div>
                <label className="block text-xs mb-1.5 text-gray-700">
                  Numéro de carte
                  <span className="ml-1">🔒</span>
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              {/* Expiration et Cryptogramme */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700">
                    Expiration
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 text-gray-700">
                    Cryptogramme
                  </label>
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              {/* Code postal */}
              <div>
                <label className="block text-xs mb-1.5 text-gray-700">
                  Code postal
                </label>
                <input
                  type="text"
                  placeholder="75001"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              {/* Pays/région */}
              <div>
                <label className="block text-xs mb-1.5 text-gray-700">
                  Pays/région
                </label>
                <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                  <option>France</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                  <option>Canada</option>
                </select>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-sm underline"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Annuler
              </button>
              <button
                className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
                style={{ fontWeight: 600 }}
              >
                Terminé
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

