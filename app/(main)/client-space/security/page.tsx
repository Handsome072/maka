'use client';

import { useState } from 'react';
import { Lock, Key, Smartphone, Shield } from 'lucide-react';

/**
 * Page Sécurité
 */
export default function SecurityPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Connexion et sécurité</h1>

      <div className="space-y-6">
        {/* Password */}
        <div className="border-b pb-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium">Mot de passe</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Dernière modification il y a 3 mois
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="text-sm text-[#00A99D] hover:underline"
            >
              Modifier
            </button>
          </div>
          
          {showChangePassword && (
            <div className="mt-4 pl-16 space-y-4">
              <input
                type="password"
                placeholder="Mot de passe actuel"
                className="w-full max-w-md px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
              />
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                className="w-full max-w-md px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
              />
              <input
                type="password"
                placeholder="Confirmer le nouveau mot de passe"
                className="w-full max-w-md px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A99D]"
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button className="px-4 py-2 bg-[#00A99D] text-white rounded-lg hover:bg-[#008B82]">
                  Enregistrer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div className="border-b pb-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium">Authentification à deux facteurs</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Ajoutez une couche de sécurité supplémentaire à votre compte
                </p>
              </div>
            </div>
            <button className="text-sm text-[#00A99D] hover:underline">
              Configurer
            </button>
          </div>
        </div>

        {/* Connected Devices */}
        <div className="border-b pb-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium">Appareils connectés</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Gérez les appareils ayant accès à votre compte
                </p>
              </div>
            </div>
            <button className="text-sm text-[#00A99D] hover:underline">
              Voir
            </button>
          </div>
        </div>

        {/* Privacy */}
        <div>
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium">Confidentialité des données</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Gérez vos paramètres de confidentialité
                </p>
              </div>
            </div>
            <button className="text-sm text-[#00A99D] hover:underline">
              Gérer
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-12 pt-6 border-t">
        <h2 className="text-lg font-medium text-red-600 mb-4">Zone de danger</h2>
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <h3 className="font-medium text-red-800">Supprimer mon compte</h3>
          <p className="text-sm text-red-600 mt-1">
            Cette action est irréversible. Toutes vos données seront supprimées.
          </p>
          <button className="mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-100">
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
}

