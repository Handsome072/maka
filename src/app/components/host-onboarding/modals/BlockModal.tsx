'use client';

import { Calendar as CalendarIcon, X } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function BlockModal() {
  const {
    isBlockModalOpen,
    setIsBlockModalOpen,
    isBlockEnabled,
    setIsBlockEnabled,
    blockModalNote,
    setBlockModalNote,
  } = useHostOnboarding();

  if (!isBlockModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsBlockModalOpen(false)} />
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 className="font-bold text-lg text-[#222222]">Blocages</h3>
          <button onClick={() => setIsBlockModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#222222]">Période *</label>
            <div className="relative">
              <input type="text" placeholder="Sélectionner les dates" className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
              <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#222222]">Nom de période *</label>
            <input type="text" placeholder="Tapez ici" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
          </div>

          <div className="flex items-start gap-4">
            <button
              onClick={() => setIsBlockEnabled(!isBlockEnabled)}
              className={`w-12 h-6 rounded-full relative transition-colors flex-shrink-0 ${isBlockEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 bottom-1 w-4 h-4 bg-white rounded-full transition-transform ${isBlockEnabled ? 'left-[calc(100%-1.25rem)]' : 'left-1'}`} />
            </button>
            <div>
              <span className={`block font-bold text-sm mb-1 ${isBlockEnabled ? 'text-blue-600' : 'text-gray-500'}`}>Bloquer la période</span>
              <p className="text-xs text-[#717171]">L'activation du blocage signifie qu'aucune demande de réservation ne pourra être fait aux dates indiquées.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#222222]">Note à vous-même</label>
            <textarea value={blockModalNote} onChange={(e) => setBlockModalNote(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none h-24" />
            <p className="text-right text-xs text-gray-400">{blockModalNote.length}/300</p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-4 justify-end sticky bottom-0 bg-white">
          <button onClick={() => setIsBlockModalOpen(false)} className="px-6 py-3 border border-gray-300 rounded-full text-[#222222] font-medium hover:bg-gray-50">Annuler</button>
          <button className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800">Sauvegarder</button>
        </div>
      </div>
    </div>
  );
}
