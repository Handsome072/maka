'use client';

import { Check, ChevronDown, Minus, Plus, Pencil } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function CapacityDetailsStep() {
  const {
    capacityData,
    setCapacityData,
    bedrooms,
    openAreas,
    addBedroom,
    removeBedroom,
    addOpenArea,
    removeOpenArea,
    setEditingItem,
  } = useHostOnboarding();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold text-[#222222]">Capacité d'accueil du chalet</h1>
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Capacité d'accueil *</label>
            <div className="relative">
              <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white" value={capacityData.capacity} onChange={(e) => setCapacityData({ ...capacityData, capacity: parseInt(e.target.value) })}>
                {[...Array(20)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Nombre maximum d'adultes *</label>
            <div className="relative">
              <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white" value={capacityData.adults} onChange={(e) => setCapacityData({ ...capacityData, adults: parseInt(e.target.value) })}>
                {[...Array(20)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Salles de bain *</label>
            <div className="relative">
              <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white" value={capacityData.bathrooms} onChange={(e) => setCapacityData({ ...capacityData, bathrooms: parseInt(e.target.value) })}>
                {[...Array(10)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[#222222] font-medium">Chambres à coucher</span>
            <div className="flex items-center gap-4">
              <button onClick={removeBedroom} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"><Minus className="w-4 h-4" /></button>
              <span className="text-base font-medium w-6 text-center">{bedrooms.length}</span>
              <button onClick={addBedroom} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="space-y-3">
            {bedrooms.map((bedroom) => (
              <div key={bedroom.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#222222]">{bedroom.name}</h3>
                  <p className="text-sm text-[#717171]">{Object.values(bedroom.beds).some((v) => v > 0) ? 'Lits configurés' : 'Aucun lit configuré'}</p>
                </div>
                <button onClick={() => setEditingItem({ item: bedroom, type: 'bedroom' })} className="flex items-center gap-2 text-sm font-medium hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><Pencil className="w-4 h-4" /> Modifier</button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[#222222] font-medium">Chambres à aire ouverte</span>
            <div className="flex items-center gap-4">
              <button onClick={removeOpenArea} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"><Minus className="w-4 h-4" /></button>
              <span className="text-base font-medium w-6 text-center">{openAreas.length}</span>
              <button onClick={addOpenArea} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="space-y-3">
            {openAreas.map((area) => (
              <div key={area.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#222222]">{area.name}</h3>
                  <p className="text-sm text-[#717171]">{Object.values(area.beds).some((v) => v > 0) ? 'Lits configurés' : 'Aucun lit configuré'}</p>
                </div>
                <button onClick={() => setEditingItem({ item: area, type: 'openArea' })} className="flex items-center gap-2 text-sm font-medium hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"><Pencil className="w-4 h-4" /> Modifier</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
