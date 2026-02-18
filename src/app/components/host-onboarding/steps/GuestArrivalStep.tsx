'use client';

import { Check, ChevronDown, Upload, X } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function GuestArrivalStep() {
  const { guestArrival, setGuestArrival } = useHostOnboarding();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222] text-center">Facilitez l'arrivée de vos invités avec ces derniers détails</h1>

      <div className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#222222]">Internet</h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Quelle est la vitesse de votre connexion Internet? *</label>
            <div className="relative">
              <select value={guestArrival.internetSpeed} onChange={(e) => setGuestArrival({ ...guestArrival, internetSpeed: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
                <option value="">Choisissez-en un</option>
                <option value="50">Moins de 50 Mbps</option>
                <option value="100">50 à 100 Mbps</option>
                <option value="500">100 à 500 Mbps</option>
                <option value="1000">Plus de 500 Mbps</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <span className="text-[#222222] font-medium">Avez-vous une connexion au wifi?</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setGuestArrival({ ...guestArrival, hasWifi: true })} className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${guestArrival.hasWifi === true ? 'bg-transparent border-black text-black' : 'border-gray-300 bg-transparent text-gray-400 hover:border-gray-400'}`}>
                <Check className="w-5 h-5" />
              </button>
              <button onClick={() => setGuestArrival({ ...guestArrival, hasWifi: false })} className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${guestArrival.hasWifi === false ? 'bg-transparent border-red-500 text-red-500' : 'border-gray-300 bg-transparent text-gray-400 hover:border-gray-400'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#222222]">Guide du chalet</h3>
          <button className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-2 text-[#222222] font-medium hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" /> Téléverser
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#222222]">Instructions et règlements par rapport à la propriété</h3>
          <textarea value={guestArrival.instructions} onChange={(e) => setGuestArrival({ ...guestArrival, instructions: e.target.value })} placeholder="Tapez ici..." className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[120px] resize-none" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#222222]">Arrivée | Méthode d'enregistrement *</label>
          <div className="relative">
            <select value={guestArrival.checkinMethod} onChange={(e) => setGuestArrival({ ...guestArrival, checkinMethod: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
              <option value="">-</option>
              <option value="keybox">Boîte à clé sécurisée</option>
              <option value="smartlock">Serrure intelligente</option>
              <option value="meet">Hôte vous accueille</option>
              <option value="staff">Personnel de l'immeuble</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
