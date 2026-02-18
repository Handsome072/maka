'use client';

import { Info } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function ChaletDescriptionStep() {
  const { descriptionData, setDescriptionData } = useHostOnboarding();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222] text-center mb-8">Description du chalet</h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#222222]">Titre de l'annonce *</label>
          <input
            type="text"
            value={descriptionData.title}
            onChange={(e) => setDescriptionData({ ...descriptionData, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
          <div className="flex items-start gap-2 text-gray-500 text-xs">
            <Info className="w-3 h-3 mt-0.5" />
            <p>Astuce: Suscitez l'intérêt des voyageurs avec un titre accrocheur qui souligne ce qui rend votre chalet unique.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#222222]">Sous-titre descriptif de l'annonce <span className="text-gray-400 font-normal">(Optionnel)</span></label>
          <input
            type="text"
            placeholder="Sous-titre descriptif de l'annonce"
            value={descriptionData.subtitle}
            onChange={(e) => setDescriptionData({ ...descriptionData, subtitle: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
          <div className="flex items-start gap-2 text-gray-500 text-xs">
            <Info className="w-3 h-3 mt-0.5" />
            <p>Astuce: Décrivez les principaux atouts de votre chalet afin d'attirer l'attention des voyageurs.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#222222]">Description *</label>
          <textarea
            value={descriptionData.description}
            onChange={(e) => setDescriptionData({ ...descriptionData, description: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[150px]"
          />
          <div className="flex items-start gap-2 text-gray-500 text-xs">
            <Info className="w-3 h-3 mt-0.5" />
            <p>Conseil: Rédigez une courte description qui présente votre chalet, les activités à proximité et le village dans lequel il se trouve.</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h3 className="font-bold text-gray-500 text-sm uppercase">Ajoutez des informations supplémentaires sur votre chalet (Optionnel)</h3>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#222222]">Le chalet</label>
            <textarea
              value={descriptionData.aboutChalet}
              onChange={(e) => setDescriptionData({ ...descriptionData, aboutChalet: e.target.value })}
              placeholder="Tapez ici..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[100px]"
            />
            <div className="flex items-start gap-2 text-gray-500 text-xs">
              <Info className="w-3 h-3 mt-0.5" />
              <p>Conseil: Incluez tout autre détail qui peut aider les invités à définir leurs attentes pour leur séjour.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#222222]">Disponibilités de l'hôte</label>
            <textarea
              value={descriptionData.hostAvailability}
              onChange={(e) => setDescriptionData({ ...descriptionData, hostAvailability: e.target.value })}
              placeholder="Tapez ici..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[100px]"
            />
            <div className="flex items-start gap-2 text-gray-500 text-xs">
              <Info className="w-3 h-3 mt-0.5" />
              <p>Conseil: Informez les invités de votre disponibilité pendant leur séjour. Pour votre sécurité, ne communiquez pas votre numéro de téléphone ou votre adresse électronique avant d'avoir confirmé une réservation.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#222222]">Le quartier</label>
            <textarea
              value={descriptionData.neighborhood}
              onChange={(e) => setDescriptionData({ ...descriptionData, neighborhood: e.target.value })}
              placeholder="Tapez ici..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[100px]"
            />
            <div className="flex items-start gap-2 text-gray-500 text-xs">
              <Info className="w-3 h-3 mt-0.5" />
              <p>Conseil: Présentez ce qui rend votre quartier unique, comme votre café, votre parc préféré ou d'autres lieux qui peuvent susciter l'intérêt des touristes.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#222222]">Transport</label>
            <textarea
              value={descriptionData.transport}
              onChange={(e) => setDescriptionData({ ...descriptionData, transport: e.target.value })}
              placeholder="Tapez ici..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[100px]"
            />
            <div className="flex items-start gap-2 text-gray-500 text-xs">
              <Info className="w-3 h-3 mt-0.5" />
              <p>Conseil: Indiquez aux invités ce qu'ils doivent savoir sur votre quartier, comme les moyens de transport courants à proximité, les conseils en matière de circulation ou les itinéraires à faire à pied.</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#222222]">Autres informations pertinentes</label>
            <textarea
              value={descriptionData.otherInfo}
              onChange={(e) => setDescriptionData({ ...descriptionData, otherInfo: e.target.value })}
              placeholder="Tapez ici..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
