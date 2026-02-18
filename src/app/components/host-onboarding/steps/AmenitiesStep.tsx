'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';
import { AMENITIES_DATA } from '../constants';

export function AmenitiesStep() {
  const { selectedAmenities, expandedAmenities, toggleAmenity, toggleSection } = useHostOnboarding();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-[#222222] mb-6">Commodités</h1>
      <div className="space-y-6">
        {Object.entries(AMENITIES_DATA).map(([section, items]) => (
          <div key={section} className="border-b border-gray-100 pb-6">
            <button onClick={() => toggleSection(section)} className="flex items-center justify-between w-full py-2">
              <h3 className="text-lg font-bold text-[#222222]">{section}</h3>
              <ChevronDown className={`w-5 h-5 text-gray-500 ${expandedAmenities[section] ? 'rotate-180' : ''}`} />
            </button>
            {expandedAmenities[section] && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 mt-4">
                {items.map((amenity) => (
                  <label key={amenity.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleAmenity(amenity.id)}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selectedAmenities.includes(amenity.id) ? 'bg-black border-black' : 'border-gray-300 bg-white'}`}>
                      {selectedAmenities.includes(amenity.id) && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <amenity.icon className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" />
                      <span className="text-sm">{amenity.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
