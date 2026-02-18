'use client';

import { Check } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function LocalLawsStep() {
  const { acceptedLocalLaws, setAcceptedLocalLaws } = useHostOnboarding();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222] text-center">Prenez connaissance des lois et des taxes locales</h1>

      <div className="space-y-6 text-[#717171] text-base leading-relaxed">
        <p>Vous devez toujours vous informer sur les lois en vigueur dans votre ville avant de publier votre annonce.</p>
        <p>
          La plupart des villes réglementent le partage de logement et les codes applicables de différents endroits (droit de l'urbanisme, plan d'occupation des sols, code du bâtiment, règlement de zonage, etc.) Le plus souvent, vous devez vous enregistrer et obtenir une autorisation avant de pouvoir louer votre chalet ou accepter des voyageurs. Vous pouvez également être responsable de la collecte et du versement de certaines taxes. Dans certains endroits, les locations à court terme sont totalement interdites.
        </p>
        <p>Vous êtes responsable de votre propre décision de louer ou de réserver un chalet, il vous incombe donc de connaître les règles applicables avant d'utiliser HOMIQIO.</p>
        <p>Pour commencer, nous vous proposons quelques ressources utiles dans la section «Réglementation de votre ville».</p>
        <p>En acceptant nos conditions générales et en publiant une annonce, vous vous engagez à respecter les lois et règlements de votre pays.</p>
      </div>

      <div className="pt-4">
        <label className="flex items-start gap-4 cursor-pointer group">
          <div
            className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${acceptedLocalLaws ? 'bg-black border-black' : 'border-gray-300 bg-white group-hover:border-black'}`}
            onClick={(e) => { e.preventDefault(); setAcceptedLocalLaws(!acceptedLocalLaws); }}
          >
            {acceptedLocalLaws && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
          </div>
          <div className="select-none" onClick={() => setAcceptedLocalLaws(!acceptedLocalLaws)}>
            <span className="text-[#222222] font-medium leading-normal">
              J'accepte les <span className="underline text-blue-600">termes et conditions</span> de la plateforme, ainsi que de respecter les lois locales en vigueur qui s'appliquent à l'endroit où j'effectue la location de mon chalet.
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
