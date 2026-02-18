'use client';

import { Check, ChevronDown, Upload, X } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function LawsTaxesStep() {
  const { taxRegistration, setTaxRegistration } = useHostOnboarding();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222] text-center">Indiquez les taxes et lois applicables</h1>

      <p className="text-[#717171] text-center max-w-xl mx-auto">
        Si vous avez l'obligation de détenir un numéro d'enregistrement ou un permis de location à court terme dans votre secteur, indiquez-le ci-dessus.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#222222]">Type d'enregistrement *</label>
          <div className="relative">
            <select value={taxRegistration.type} onChange={(e) => setTaxRegistration({ ...taxRegistration, type: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
              <option value="CITQ">CITQ</option>
              <option value="Other">Autre</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#222222]">Numéro d'enregistrement CITQ *</label>
          <input type="text" placeholder="Tapez ici" value={taxRegistration.number} onChange={(e) => setTaxRegistration({ ...taxRegistration, number: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#222222]">Date de délivrance</label>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>1</option></select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>Janvier</option></select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>2027</option></select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#222222]">Date d'expiration</label>
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>1</option></select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>Janvier</option></select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white"><option>2027</option></select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#222222]">Image du certificat</label>
          <button className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-2 text-[#222222] font-medium hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" /> Téléverser
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-xl text-[#222222]">Taxes</h3>
        <p className="text-[#717171] text-sm">Si les taxes (i.e.: TPS, TVQ) ne sont pas déjà incluses dans votre prix de base, ajoutez-les ici.</p>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-[#222222]">Souhaitez-vous inclure les taxes à votre prix?</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setTaxRegistration({ ...taxRegistration, taxesIncluded: true })} className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${taxRegistration.taxesIncluded === true ? 'bg-black border-black text-white' : 'border-gray-300 bg-transparent text-black hover:border-black'}`}>
              <Check className="w-5 h-5" />
            </button>
            <button onClick={() => setTaxRegistration({ ...taxRegistration, taxesIncluded: false })} className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${taxRegistration.taxesIncluded === false ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 bg-transparent text-red-500 hover:border-red-500'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
