'use client';

import { ChevronDown } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function PricingStep() {
  const { currency, setCurrency, pricing, setPricing } = useHostOnboarding();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222] text-center mb-8">Définissez vos prix</h1>
      <div className="space-y-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#222222]">Sélectionnez la devise monétaire de votre pays *</label>
          <div className="relative">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
              <option value="CAD (C$)">CAD (C$)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-500">Choisissez une devise pour indiquer vos prix</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Tarif de base *</label>
            <input type="text" value={pricing.base} onChange={(e) => setPricing({ ...pricing, base: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="0" />
            <p className="text-xs text-gray-500">Ce prix sera le tarif par défaut pour chaque nuit.</p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Tarif d'une nuit de week-end</label>
            <input type="text" value={pricing.weekend} onChange={(e) => setPricing({ ...pricing, weekend: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="CAD (C$)" />
            <p className="text-xs text-gray-500">Ce prix sera le prix par défaut pour le week-end.</p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Tarif hebdomadaire</label>
            <input type="text" value={pricing.weekly} onChange={(e) => setPricing({ ...pricing, weekly: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="CAD (C$)" />
            <p className="text-xs text-gray-500">Ce prix sera le tarif par défaut pour une période de 7 jours.</p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Tarif mensuel</label>
            <input type="text" value={pricing.monthly} onChange={(e) => setPricing({ ...pricing, monthly: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="CAD (C$)" />
            <p className="text-xs text-gray-500">Ce prix sera le tarif appliqué pour des périodes de 28 jours.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
