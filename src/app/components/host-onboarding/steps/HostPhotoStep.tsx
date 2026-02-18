'use client';

import { Upload, User } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function HostPhotoStep() {
  const { hostPhoto, handleHostPhotoUpload } = useHostOnboarding();

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-[#222222]">Ajoutez une photo de vous</h1>
        <p className="text-[#717171] max-w-lg mx-auto">
          Assurez-vous que votre photo montre clairement votre visage, afin que les voyageurs puissent facilement vous identifier en tant qu'hôte.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
            {hostPhoto ? (
              <img src={hostPhoto} alt="Host" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <label className="cursor-pointer">
            <div className="flex items-center gap-2 px-6 py-3 bg-white border border-black rounded-full hover:bg-gray-50 transition-colors shadow-sm">
              <Upload className="w-4 h-4" />
              <span className="font-medium">Ajouter une photo</span>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleHostPhotoUpload} />
          </label>
        </div>
      </div>
    </div>
  );
}
