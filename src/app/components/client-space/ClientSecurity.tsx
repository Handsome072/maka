'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function ClientSecurity() {
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

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
            Connexion et sécurité
          </h2>
        </div>

        {/* Connexion Section */}
        <div className="mb-12">
          <h3 className="text-lg md:text-xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
            Connexion
          </h3>

          <div className="border-b border-gray-200 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Mot de passe
                </h4>
                {!updatingPassword && (
                  <p className="text-sm" style={{ color: '#C13515' }}>
                    Dernière mise à jour le il y a 4 heures
                  </p>
                )}
              </div>
              {!updatingPassword && (
                <button
                  onClick={() => setUpdatingPassword(true)}
                  className="text-base underline"
                  style={{ fontWeight: 600, color: '#222222' }}
                >
                  Mettre à jour
                </button>
              )}
              {updatingPassword && (
                <button
                  onClick={() => setUpdatingPassword(false)}
                  className="text-base underline"
                  style={{ fontWeight: 600, color: '#222222' }}
                >
                  Annuler
                </button>
              )}
            </div>

            {/* Formulaire de mise à jour du mot de passe */}
            {updatingPassword && (
              <div className="mt-6">
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#222222' }}>
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder=""
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: '#222222' }}>
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      placeholder=""
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
                <button
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm transition-colors hover:bg-gray-800"
                  style={{ fontWeight: 600 }}
                  onClick={() => setUpdatingPassword(false)}
                >
                  Mettre à jour le mot de passe
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Compte Section */}
        <div className="mb-12">
          <h3 className="text-lg md:text-xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
            Compte
          </h3>

          <div className="border-b border-gray-200 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Désactivation de votre compte
                </h4>
                <p className="text-sm text-gray-600">
                  Cette action est définitive
                </p>
              </div>
              <button
                onClick={() => setShowDeactivateModal(true)}
                className="text-base underline"
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Désactiver
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de désactivation du compte */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowDeactivateModal(false)}
              className="absolute top-4 right-4 text-sm underline"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              Quitter
            </button>

            <h3 className="text-2xl mb-6 pr-16" style={{ fontWeight: 600, color: '#222222' }}>
              Pourquoi choisissez-vous de désactiver votre compte ?
            </h3>

            <div className="space-y-4 mb-6">
              <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="deactivation-reason"
                  className="w-5 h-5 text-gray-900 focus:ring-2 focus:ring-gray-900"
                />
                <span className="text-base" style={{ color: '#222222' }}>
                  Je n'utilise plus HOMIQIO.
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="deactivation-reason"
                  className="w-5 h-5 text-gray-900 focus:ring-2 focus:ring-gray-900"
                />
                <span className="text-base" style={{ color: '#222222' }}>
                  J'utilise un autre compte HOMIQIO.
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="deactivation-reason"
                  className="w-5 h-5 text-gray-900 focus:ring-2 focus:ring-gray-900"
                />
                <span className="text-base" style={{ color: '#222222' }}>
                  Autre
                </span>
              </label>
            </div>

            <button
              className="w-full px-6 py-3 rounded-lg text-base cursor-not-allowed"
              style={{
                fontWeight: 600,
                backgroundColor: '#EBEBEB',
                color: '#B0B0B0'
              }}
              disabled
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

