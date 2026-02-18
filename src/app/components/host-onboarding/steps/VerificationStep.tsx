'use client';

import { useHostOnboarding } from '../HostOnboardingContext';

export function VerificationStep() {
  const { addressData, capacityData, bedrooms, pricing, currency, fees, cancellationPolicy, chaletPhotos } = useHostOnboarding();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222] text-center mb-8">Vérifiez vos informations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
          <h3 className="font-bold text-lg text-[#222222] border-b border-gray-200 pb-2">Général</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Adresse:</span> {addressData.address}, {addressData.city}</p>
            <p><span className="font-semibold">Capacité:</span> {capacityData.capacity} personnes</p>
            <p><span className="font-semibold">Chambres:</span> {bedrooms.length}</p>
            <p><span className="font-semibold">Salles de bain:</span> {capacityData.bathrooms}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
          <h3 className="font-bold text-lg text-[#222222] border-b border-gray-200 pb-2">Tarification</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold">Prix de base:</span> {pricing.base} {currency}</p>
            <p><span className="font-semibold">Frais de ménage:</span> {fees.cleaning} {currency}</p>
            <p><span className="font-semibold">Dépôt de sécurité:</span> {fees.security} {currency}</p>
            <p><span className="font-semibold">Politique d'annulation:</span> {cancellationPolicy}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl space-y-4 md:col-span-2">
          <h3 className="font-bold text-lg text-[#222222] border-b border-gray-200 pb-2">Photos</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {chaletPhotos.length > 0 ? (
              chaletPhotos.map((photo, i) => (
                <div key={i} className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                  <img src={photo} className="w-full h-full object-cover" alt={`Photo ${i + 1}`} />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">Aucune photo ajoutée</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
