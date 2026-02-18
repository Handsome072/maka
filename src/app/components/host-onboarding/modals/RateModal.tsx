'use client';

import { Calendar as CalendarIcon, ChevronDown, X } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function RateModal() {
  const {
    isRateModalOpen,
    setIsRateModalOpen,
    rateModalMinStay,
    setRateModalMinStay,
    rateModalMaxStay,
    setRateModalMaxStay,
    rateModalNote,
    setRateModalNote,
  } = useHostOnboarding();

  if (!isRateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsRateModalOpen(false)} />
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="font-bold text-lg text-[#222222]">Tarif spécifique</h3>
          <button onClick={() => setIsRateModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#222222]">Période *</label>
            <div className="relative">
              <input type="text" placeholder="Sélectionner les dates" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
              <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:border-black transition-colors">
            + Ajouter une période à ce tarif
          </button>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#222222]">Nom de période *</label>
            <input type="text" placeholder="Tapez ici" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#222222]">Tarif de base *</label>
              <input type="text" placeholder="CAD (C$)" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
              <p className="text-[10px] text-gray-400">Ce prix sera le tarif par défaut pour chaque nuit.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#222222]">Tarif d'une nuit de week-end</label>
              <input type="text" placeholder="CAD (C$)" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
              <p className="text-[10px] text-gray-400">Ce prix sera le prix par défaut pour le week-end.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#222222]">Tarif hebdomadaire</label>
              <input type="text" placeholder="CAD (C$)" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
              <p className="text-[10px] text-gray-400">Ce prix sera le tarif par défaut pour une période de 7 jours.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#222222]">Tarif mensuel</label>
              <input type="text" placeholder="CAD (C$)" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
              <p className="text-[10px] text-gray-400">Ce prix sera le tarif appliqué pour des périodes de 28 jours.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <h4 className="font-bold text-[#222222] text-lg">Durée du séjour</h4>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#222222]">Durée minimum d'un séjour</label>
              <div className="relative">
                <select value={rateModalMinStay} onChange={(e) => setRateModalMinStay(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#222222]">Durée maximale d'un séjour</label>
              <div className="relative">
                <select value={rateModalMaxStay} onChange={(e) => setRateModalMaxStay(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
                  <option value="Aucun maximum">Aucun maximum</option>
                  {[7, 14, 28].map((n) => <option key={n} value={n}>{n} jours</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#222222]">Note à vous-même</label>
              <textarea value={rateModalNote} onChange={(e) => setRateModalNote(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none h-24" />
              <p className="text-right text-xs text-gray-400">{rateModalNote.length}/300</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-4 justify-end sticky bottom-0 bg-white">
          <button onClick={() => setIsRateModalOpen(false)} className="px-6 py-3 border border-gray-300 rounded-full text-[#222222] font-medium hover:bg-gray-50">Annuler</button>
          <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800">Sauvegarder</button>
        </div>
      </div>
    </div>
  );
}
