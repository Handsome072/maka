'use client';

import { ChevronDown } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';

export function PhoneNumberStep() {
  const { phoneNumber, setPhoneNumber, countryCode, setCountryCode } = useHostOnboarding();

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-[#222222]">Ajoutez votre numéro de téléphone</h1>
        <p className="text-[#717171]">
          Nous vous enverrons des demandes de réservation, des rappels et d'autres notifications. Ce numéro doit pouvoir recevoir des SMS ou des appels.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#222222]">Numéro de téléphone portable *</label>
        <div className="relative flex items-center">
          <div className="absolute left-3 flex items-center gap-2 pr-2 border-r border-gray-300">
            <div className="relative">
              <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="appearance-none bg-transparent font-medium text-[#222222] pr-6 focus:outline-none cursor-pointer">
                <option value="+1">🇨🇦 +1</option>
                <option value="+1US">🇺🇸 +1</option>
                <option value="+33">🇫🇷 +33</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#222222] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full p-3 pl-28 border border-gray-300 rounded-lg focus:outline-none focus:border-black" placeholder="(000) 000-0000" />
        </div>
      </div>
    </div>
  );
}
