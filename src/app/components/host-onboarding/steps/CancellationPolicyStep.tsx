'use client';

import { ChevronDown } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function CancellationPolicyStep() {
  const { cancellationPolicy, setCancellationPolicy } = useHostOnboarding();

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222]">Politique d'annulation</h1>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-[#222222]">Politique d'annulation</label>
        <div className="relative">
          <select value={cancellationPolicy} onChange={(e) => setCancellationPolicy(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
            <option value="Flexible">Flexible</option>
            <option value="Modérée">Modérée</option>
            <option value="Stricte">Stricte</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm space-y-3">
          <p><span className="font-semibold text-[#222222]">Annulation jusqu'à 10 jours avant l'arrivée:</span><br />Remboursement complet.</p>
          <p><span className="font-semibold text-[#222222]">Moins de 10 jours avant l'arrivée :</span><br />Perte de 30% du montant total.</p>
          <p><span className="font-semibold text-[#222222]">Moins de 2 jours avant l'arrivée :</span><br />Aucun remboursement (sauf dépôt de sécurité)</p>
        </div>
      </div>
    </div>
  );
}
