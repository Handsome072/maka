'use client';

import { ChevronDown, HelpCircle } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function FeesStep() {
  const {
    fees,
    setFees,
    extraGuestFeeOpen,
    setExtraGuestFeeOpen,
    petFeeOpen,
    setPetFeeOpen,
    extraGuestFee,
    setExtraGuestFee,
    petFee,
    setPetFee,
  } = useHostOnboarding();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222] text-center mb-8">Ajoutez des frais de base</h1>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2"><label className="block text-sm font-bold text-[#222222]">Frais de nettoyage</label><HelpCircle className="w-4 h-4 text-gray-400" /></div>
          <input type="text" value={fees.cleaning} onChange={(e) => setFees({ ...fees, cleaning: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2"><label className="block text-sm font-bold text-[#222222]">Dépôt de sécurité</label><HelpCircle className="w-4 h-4 text-gray-400" /></div>
          <input type="text" value={fees.security} onChange={(e) => setFees({ ...fees, security: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
        </div>
        <div className="border-t border-gray-100 pt-6">
          <button onClick={() => setExtraGuestFeeOpen(!extraGuestFeeOpen)} className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="font-bold text-[#222222]">Frais pour invité supplémentaire <span className="text-gray-400 font-normal">(Optionnel)</span></span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${extraGuestFeeOpen ? 'rotate-180' : ''}`} />
          </button>
          {extraGuestFeeOpen && (
            <div className="mt-4 pl-4 animate-in slide-in-from-top-2">
              <div className="space-y-2 max-w-xs"><label className="text-sm font-medium">Frais par invité</label><input type="text" placeholder="CAD (C$)" value={extraGuestFee} onChange={(e) => setExtraGuestFee(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" /></div>
            </div>
          )}
        </div>
        <div>
          <button onClick={() => setPetFeeOpen(!petFeeOpen)} className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="font-bold text-[#222222]">Frais pour animaux <span className="text-gray-400 font-normal">(Optionnel)</span></span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${petFeeOpen ? 'rotate-180' : ''}`} />
          </button>
          {petFeeOpen && (
            <div className="mt-4 pl-4 animate-in slide-in-from-top-2">
              <div className="space-y-2 max-w-xs"><label className="text-sm font-medium">Frais par animal</label><input type="text" placeholder="CAD (C$)" value={petFee} onChange={(e) => setPetFee(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" /></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
