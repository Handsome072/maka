'use client';

import { Check, Pencil } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';
import { SUMMARY_CHALET_IMG } from '../constants';
import type { Step } from '../types';

export function SummaryReview3Step() {
  const { jumpToStep, handleNext } = useHostOnboarding();

  const stepItems: { label: string; step: Step }[] = [
    { label: "Permissions", step: 'permissions' },
    { label: "Mode de réservation", step: 'reservation-mode' },
    { label: "Tarification", step: 'pricing' },
    { label: "Frais", step: 'fees' },
    { label: "Calendrier", step: 'calendar' },
    { label: "Politique d'annulation", step: 'cancellation-policy' },
    { label: "Taxes et lois", step: 'laws-taxes' },
    { label: "Lois locales", step: 'local-laws' },
    { label: "Arrivée des invités", step: 'guest-arrival' },
    { label: "Numéro de téléphone", step: 'phone-number' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="flex-1 w-full space-y-8">
          <h1 className="text-3xl font-bold text-[#222222]">Vous y êtes presque!</h1>

          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="font-bold text-[#222222]">Commencez par la base</h3>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="font-bold text-[#222222]">Décrivez l'environnement</h3>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden">
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center text-[#222222] font-bold text-lg bg-white">3</div>
                  <div>
                    <h3 className="font-bold text-[#222222]">Préparez l'accueil des invités</h3>
                    <p className="text-sm text-gray-500">Préparez l'accueil des invités</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="bg-white">
                {stepItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <span className="text-[#222222] font-medium text-sm">{item.label}</span>
                    <button onClick={() => jumpToStep(item.step)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                      <Pencil className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button onClick={handleNext} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity">
              Continuer
            </button>
          </div>
        </div>
        <div className="flex-1 w-full lg:h-[700px] rounded-2xl overflow-hidden shadow-lg hidden lg:block sticky top-32">
          <img src={SUMMARY_CHALET_IMG} className="w-full h-full object-cover" alt="Chalet" />
        </div>
      </div>
    </div>
  );
}
