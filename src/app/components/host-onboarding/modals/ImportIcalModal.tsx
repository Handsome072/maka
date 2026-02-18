'use client';

import { X } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function ImportIcalModal() {
  const { isImportModalOpen, setIsImportModalOpen } = useHostOnboarding();

  if (!isImportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsImportModalOpen(false)} />
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-[#222222]">Importer et visualiser vos réservations à partir d'autres plateformes</h3>
          <button onClick={() => setIsImportModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-8 space-y-8">
          <p className="text-[#222222] font-medium">Quelle plateforme de réservation souhaitez-vous importer dans HOMIQIO?</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Booking.com', bg: 'bg-[#003580]', color: 'text-white', icon: 'B.' },
              { name: 'Airbnb.com', bg: 'bg-[#FF5A5F]', color: 'text-white', icon: 'A' },
              { name: 'Vrbo.com', bg: 'bg-[#2c3e50]', color: 'text-white', icon: 'V' },
              { name: 'GlampingHub', bg: 'bg-[#27ae60]', color: 'text-white', icon: 'G' },
            ].map((platform) => (
              <button key={platform.name} className="flex flex-col items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-black transition-colors group">
                <div className={`w-12 h-12 rounded-lg ${platform.bg} ${platform.color} flex items-center justify-center font-bold text-xl`}>{platform.icon}</div>
                <span className="text-xs text-gray-500 group-hover:text-black">Importer de {platform.name}</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">ou</span></div>
          </div>
          <button className="w-full py-3 border border-gray-300 rounded-full text-[#222222] font-medium hover:border-black transition-colors">Importer d'une autre plateforme</button>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex gap-4 justify-end">
          <button onClick={() => setIsImportModalOpen(false)} className="px-6 py-3 border border-gray-300 rounded-full text-[#222222] font-medium hover:bg-gray-50">Cancel</button>
          <button className="px-6 py-3 bg-[#333] text-white rounded-full font-medium hover:bg-black">Importer</button>
        </div>
      </div>
    </div>
  );
}
