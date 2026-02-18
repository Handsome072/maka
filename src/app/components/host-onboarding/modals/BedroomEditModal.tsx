'use client';

import { Minus, Plus, X } from 'lucide-react';
import type { Bedroom } from '../types';
import { useHostOnboarding } from '../HostOnboardingContext';

const BED_TYPES: { key: keyof Bedroom['beds']; label: string }[] = [
  { key: 'simple', label: 'Lit simple' },
  { key: 'double', label: 'Lit double' },
  { key: 'queen', label: 'Lit Queen' },
  { key: 'king', label: 'Lit King' },
  { key: 'simple_bunk', label: 'Lit simple superposé' },
  { key: 'double_bunk', label: 'Lit double superposé' },
  { key: 'queen_bunk', label: 'Lit queen superposé' },
  { key: 'king_bunk', label: 'Lit king superposé' },
  { key: 'sofa_bed', label: "Canapé-lit" },
  { key: 'other', label: "Matériel d'appoint" },
];

export function BedroomEditModal() {
  const { editingItem, setEditingItem, handleBedCountChange, updateItem } = useHostOnboarding();

  if (!editingItem) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditingItem(null)} />
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#222222]">{editingItem.item.name}</h2>
          <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-[#222222]" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#222222]">Nom de l'espace *</label>
            <input
              type="text"
              value={editingItem.item.name}
              onChange={(e) => setEditingItem({ ...editingItem, item: { ...editingItem.item, name: e.target.value } })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <div className="space-y-6">
            {BED_TYPES.map((bed) => (
              <div key={bed.key} className="flex items-center justify-between">
                <span className="text-[#222222]">{bed.label}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleBedCountChange(bed.key, -1)}
                    disabled={editingItem.item.beds[bed.key] === 0}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4 text-[#717171]" />
                  </button>
                  <span className="text-base font-medium text-[#222222] w-6 text-center">{editingItem.item.beds[bed.key]}</span>
                  <button onClick={() => handleBedCountChange(bed.key, 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-black">
                    <Plus className="w-4 h-4 text-[#717171]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => {
              updateItem(editingItem.item, editingItem.type);
              setEditingItem(null);
            }}
            className="w-full bg-black text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
