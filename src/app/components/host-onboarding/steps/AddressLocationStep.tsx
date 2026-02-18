'use client';

import { ChevronDown } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';
import { MockMap } from '../MockMap';

export function AddressLocationStep() {
  const { addressData, setAddressData } = useHostOnboarding();

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <div className="flex-1 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#222222]">Saisir votre adresse</h1>
          <p className="text-[#717171]">Seuls les voyageurs qui disposent d'une réservation confirmée pourront voir votre adresse.</p>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Ville *</label>
            <input className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="Ville" value={addressData.city} onChange={(e) => setAddressData({ ...addressData, city: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Adresse *</label>
            <input className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="Adresse" value={addressData.address} onChange={(e) => setAddressData({ ...addressData, address: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#222222]">Code postal *</label>
              <input className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="Code postal" value={addressData.postalCode} onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#222222]">MRC (Optionnel)</label>
              <div className="relative">
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black appearance-none bg-white"><option value="">-</option></select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Comté (Optionnel)</label>
            <input className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="Comté" value={addressData.county} onChange={(e) => setAddressData({ ...addressData, county: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#222222]">Province / État</label>
              <div className="relative">
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black appearance-none bg-white" value={addressData.province} onChange={(e) => setAddressData({ ...addressData, province: e.target.value })}>
                  <option value="QC">Québec</option>
                  <option value="ON">Ontario</option>
                  <option value="NB">Nouveau-Brunswick</option>
                  <option value="Other">Autre</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#222222]">Pays</label>
              <div className="relative">
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black appearance-none bg-white" value={addressData.country} onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}>
                  <option value="CA">Canada</option>
                  <option value="US">États-Unis</option>
                  <option value="FR">France</option>
                  <option value="Other">Autre</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200">
          <MockMap />
        </div>
      </div>
    </div>
  );
}
