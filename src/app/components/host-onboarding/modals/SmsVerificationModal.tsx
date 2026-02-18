'use client';

import { X } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function SmsVerificationModal() {
  const { isSmsModalOpen, setIsSmsModalOpen, countryCode, phoneNumber, smsCode, setSmsCode, changeStep, stepsList } = useHostOnboarding();

  if (!isSmsModalOpen) return null;

  const handleConfirm = () => {
    setIsSmsModalOpen(false);
    const verificationIndex = stepsList.indexOf('verification');
    if (verificationIndex >= 0) {
      changeStep(stepsList[verificationIndex]);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSmsModalOpen(false)} />
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold text-[#222222]">Entrez votre code de sécurité</h3>
          <button onClick={() => setIsSmsModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="font-medium text-[#222222]">Nous avons envoyé le code par SMS {countryCode.replace('US', '')} {phoneNumber}</p>
            <p className="text-sm text-[#717171] leading-relaxed">
              Nous vous enverrons des demandes de réservation, des rappels et d'autres notifications. Ce numéro doit pouvoir recevoir des messages texte ou des appels.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 text-sm">
            <span className="text-[#717171]">Vous ne l'avez pas reçu?</span>
            <button className="font-bold underline text-[#222222] hover:text-black">Essayez à nouveau</button>
          </div>

          <div className="pt-2">
            <input
              type="text"
              placeholder="Code de vérification (ex: 123456)"
              className="w-full p-4 border border-gray-300 rounded-lg text-center text-xl font-bold tracking-widest focus:outline-none focus:border-black"
              value={smsCode}
              onChange={(e) => setSmsCode(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-4 pt-4">
            <button onClick={() => setIsSmsModalOpen(false)} className="flex-1 py-3 border border-gray-300 rounded-full font-bold text-[#222222] hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button onClick={handleConfirm} className="flex-1 py-3 bg-[#333] text-white rounded-full font-bold hover:bg-black transition-colors">
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
