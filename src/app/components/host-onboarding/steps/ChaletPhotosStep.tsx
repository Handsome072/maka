'use client';

import { Plus, X } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function ChaletPhotosStep() {
  const { chaletPhotos, setChaletPhotos, handleChaletPhotoUpload } = useHostOnboarding();

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-[#222222]">Photos du chalet</h1>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-[#222222] mb-1">Astuces pour les photos</h3>
            <p className="text-sm text-gray-500">Nous vous suggérons de télécharger au moins 5 photos des différentes pièces et espaces à l'intérieur et à l'extérieur du chalet.</p>
          </div>
          <div>
            <h3 className="font-bold text-[#222222] mb-1">Quels types de photos dois-je télécharger?</h3>
            <p className="text-sm text-gray-500">Veuillez télécharger au moins une photo de chaque pièce du chalet, y compris le salon, la cuisine, les chambre(s), les salle(s) de bains, l'extérieur et les environs.</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden group border border-gray-200">
              {chaletPhotos[index] ? (
                <>
                  <img src={chaletPhotos[index]} alt={`Chalet ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      const newPhotos = [...chaletPhotos];
                      newPhotos.splice(index, 1);
                      setChaletPhotos(newPhotos);
                    }}
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center">
                  <Plus className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="relative cursor-pointer group">
          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" multiple accept=".png, .jpg, .jpeg, .webp" onChange={handleChaletPhotoUpload} />
          <div className="text-center">
            <p className="text-[#222222] font-medium text-sm group-hover:underline">Faites glisser vos images ici, ou <span className="underline">Parcourir</span></p>
            <p className="text-gray-400 text-xs mt-1">Formats acceptés: PNG, JPG, WEBP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
