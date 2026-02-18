'use client';

import { Check } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function AcceptanceConditionStep() {
  const { acceptedConditions, setAcceptedConditions } = useHostOnboarding();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#222222]">
          Important: Conditions d'acceptation de votre logement
        </h1>
        <h2 className="text-xl font-semibold text-[#222222] underline decoration-2 underline-offset-4">
          82% des demandes d'inscription sont refusées en raison de nos normes de gestion.
        </h2>
        <div className="space-y-4 text-[#717171] text-base leading-relaxed">
          <p>Avant de commencer votre processus d'inscription, lire la note suivante.</p>
          <p>Depuis 2015, HOMIQIO s'engage à améliorer les normes de gestion et la qualité des produits proposés.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Des propriétaires sérieux, engagés à fournir un service de qualité.</li>
            <li>Une propriété unique et distinguée.</li>
            <li>Des photographies de haute qualité prises par un professionnel.</li>
          </ul>
          <p>Si vous avez des doutes, contactez-nous à <a href="mailto:info@homiqio.com" className="underline">info@homiqio.com</a>.</p>
        </div>
      </div>
      <div className="pt-8">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div
            className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
              acceptedConditions ? 'bg-black border-black' : 'border-gray-300 bg-white group-hover:border-black'
            }`}
            onClick={(e) => { e.preventDefault(); setAcceptedConditions(!acceptedConditions); }}
          >
            {acceptedConditions && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
          </div>
          <div className="select-none" onClick={() => setAcceptedConditions(!acceptedConditions)}>
            <span className="text-[#222222] font-medium italic">Je comprends que ma propriété peut potentiellement être refusée</span>
          </div>
        </label>
      </div>
    </div>
  );
}
