'use client';

import { useHostOnboarding } from '../HostOnboardingContext';

export function ReservationTypeStep() {
  const { rentalFrequency, setRentalFrequency, spaceType, setSpaceType } = useHostOnboarding();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222]">Type de réservation</h1>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#222222]">À quelle fréquence louerez-vous votre logement ?</h3>
        <div className="space-y-3">
          {[
            { id: 'occasional', label: "C'est un logement privé que je loue occasionnellement" },
            { id: 'dedicated', label: "C'est un logement exclusivement dédié à la location" },
          ].map((opt) => (
            <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                  rentalFrequency === opt.id ? 'border-black' : 'border-gray-300 group-hover:border-black'
                }`}
                onClick={() => setRentalFrequency(opt.id as 'occasional' | 'dedicated')}
              >
                {rentalFrequency === opt.id && <div className="w-3 h-3 bg-black rounded-full" />}
              </div>
              <span className="text-[#717171] group-hover:text-[#222222] transition-colors">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="w-16 h-px bg-gray-200" />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#222222]">Qu'offrez-vous aux invités ?</h3>
        <div className="space-y-6">
          {[
            { id: 'entire', label: 'Logement entier', desc: "Les voyageurs disposent du logement dans son intégralité." },
            { id: 'private', label: 'Chambre privée', desc: "Les invités ont leur propre chambre privée pour dormir." },
            { id: 'shared', label: 'Chambre partagée', desc: "Les invités dorment dans une chambre partagée." },
          ].map((opt) => (
            <div key={opt.id} className="flex items-start gap-3 group cursor-pointer" onClick={() => setSpaceType(opt.id as 'entire' | 'private' | 'shared')}>
              <div
                className={`w-5 h-5 mt-1 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                  spaceType === opt.id ? 'border-black' : 'border-gray-300 group-hover:border-black'
                }`}
              >
                {spaceType === opt.id && <div className="w-3 h-3 bg-black rounded-full" />}
              </div>
              <div>
                <span className="block text-[#222222] font-medium mb-1 group-hover:text-black">{opt.label}</span>
                <span className="block text-[#717171] text-sm leading-relaxed">{opt.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
