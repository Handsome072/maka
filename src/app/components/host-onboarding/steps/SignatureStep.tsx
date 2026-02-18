'use client';

import { Check } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function SignatureStep() {
  const { signatureName, setSignatureName, isSigned, setIsSigned, handleBack, handleNext } = useHostOnboarding();

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-[#222222]">Confirmation et soumission</h1>
        <p className="text-[#717171]">
          Veuillez confirmer l'exactitude des informations et signer ci-dessous pour soumettre votre annonce.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              className={`w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 ${isSigned ? 'bg-black border-black' : 'border-gray-300 bg-white group-hover:border-black'}`}
              onClick={() => setIsSigned(!isSigned)}
            >
              {isSigned && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
            </div>
            <div className="text-sm text-[#717171] leading-relaxed select-none" onClick={() => setIsSigned(!isSigned)}>
              Je certifie que toutes les informations fournies sont exactes et conformes à la réalité. Je comprends que toute fausse déclaration pourrait entraîner la suspension de mon annonce. J'accepte les conditions d'utilisation de HOMIQIO.
            </div>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#222222]">Signature électronique (Nom complet) *</label>
          <input
            type="text"
            placeholder="Votre nom complet"
            value={signatureName}
            onChange={(e) => setSignatureName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black font-serif italic text-lg"
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={handleBack} className="w-full py-4 border border-gray-300 rounded-full font-bold text-lg text-[#222222] hover:bg-gray-50 transition-colors">
          Retour
        </button>
        <button
          onClick={handleNext}
          disabled={!isSigned || !signatureName}
          className={`w-full py-4 rounded-full font-bold text-lg text-white transition-all ${!isSigned || !signatureName ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:opacity-90'}`}
        >
          Soumettre votre annonce
        </button>
      </div>
    </div>
  );
}
