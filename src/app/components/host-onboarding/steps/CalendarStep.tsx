'use client';

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Sparkles, Upload } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function CalendarStep() {
  const { activeTab, setActiveTab, setIsImportModalOpen, setIsRateModalOpen, setIsBlockModalOpen } = useHostOnboarding();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-[#FFF8E6] border border-[#FFE0B2] p-4 rounded-lg flex items-center gap-3">
        <div className="p-1 bg-[#FF9800] rounded text-white"><CalendarIcon className="w-4 h-4" /></div>
        <span className="text-[#B7791F] font-semibold text-sm">Un hébergement réussi commence avec un calendrier à jour</span>
      </div>

      <div className="text-sm text-[#717171] leading-relaxed max-w-3xl">
        Votre calendrier est votre meilleur allié pour assurer à vos invités la meilleure expérience possible. Assurez-vous que votre calendrier demeure à jour afin de recevoir des demandes de réservation uniquement lorsque votre chalet est disponible. Annuler un séjour à la dernière minute entraîne des pénalités.
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#222222]">Calendrier externe iCals</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50"><Upload className="w-4 h-4" /> Exporter</button>
            <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800"><Plus className="w-4 h-4" /> Ajouter</button>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg py-8 text-center border border-gray-100 text-sm text-[#717171]">
          Aucun iCal externe n'a encore été ajouté
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
        <span className="flex items-center gap-1 text-sm font-semibold text-[#B7791F] whitespace-nowrap"><Sparkles className="w-4 h-4" /> Périodes automatiques</span>
        {['Hiver', 'Semaine de relâche', 'Printemps', 'Pâques', 'Fête de la reine', 'Été', 'Semaines de la construction', 'Haute saison - Été', 'Automne', 'Fête du travail'].map((period) => (
          <button key={period} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-black whitespace-nowrap shadow-sm flex items-center gap-2">
            {period} <span className="text-xs">🔥</span>
          </button>
        ))}
        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0"><ChevronRight className="w-4 h-4" /></button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col lg:flex-row h-[600px]">
        <div className="w-full lg:w-72 border-r border-gray-200 bg-white flex flex-col">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('rates')}
              className={`flex-1 py-4 text-sm font-medium text-center relative ${activeTab === 'rates' ? 'text-black' : 'text-gray-500'}`}
            >
              Tarifs spécifiques
              {activeTab === 'rates' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
            <button
              onClick={() => setActiveTab('blocks')}
              className={`flex-1 py-4 text-sm font-medium text-center relative ${activeTab === 'blocks' ? 'text-black' : 'text-gray-500'}`}
            >
              Blocages
              {activeTab === 'blocks' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
          </div>

          {activeTab === 'rates' && (
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-[#222222]">Tarifs spécifiques</h3>
                <button onClick={() => setIsRateModalOpen(true)} className="text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50">
                  + Ajouter
                </button>
              </div>
              <div className="text-sm text-gray-500 italic">Aucun tarif spécifique ajouté</div>
            </div>
          )}

          {activeTab === 'blocks' && (
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl text-[#222222]">Blocages</h3>
                <button onClick={() => setIsBlockModalOpen(true)} className="text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-full hover:bg-gray-50">
                  + Ajouter
                </button>
              </div>
              <div className="text-sm text-gray-500 italic">Aucun blocage de période ajouté</div>
            </div>
          )}
        </div>

        <div className="flex-1 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">Fixer un tarif spécifique</button>
            <div className="flex items-center gap-4">
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
              <span className="font-bold text-lg">Février 2026</span>
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-[#1B1F2E] text-white rounded-lg text-sm font-medium hover:opacity-90">Importer</button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"><Upload className="w-4 h-4" /> Exporter</button>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'].map((day) => (
              <div key={day} className="py-2 text-center text-xs font-medium text-gray-500">{day}</div>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-7 auto-rows-fr bg-white">
            {[...Array(6)].map((_, i) => <div key={`empty-${i}`} className="border-b border-r border-gray-100 min-h-[100px]" />)}
            {[...Array(28)].map((_, i) => (
              <div key={i} className="border-b border-r border-gray-100 min-h-[100px] p-2 relative hover:bg-gray-50 cursor-pointer group transition-colors">
                <span className="text-xs text-gray-400 absolute top-2 right-2">{i + 1}</span>
                <div className="flex flex-col items-center justify-center h-full gap-1">
                  <span className="text-sm font-medium text-gray-400 group-hover:text-black">C$120</span>
                </div>
              </div>
            ))}
            {[...Array(8)].map((_, i) => <div key={`empty-end-${i}`} className="border-b border-r border-gray-100 min-h-[100px]" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
