'use client';

import { Check, ChevronDown, X } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';
import { PERMISSIONS_DATA } from '../constants';

export function PermissionsStep() {
  const { permissions, setPermissionValue, minAge, setMinAge } = useHostOnboarding();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222]">Permissions</h1>
      <div className="space-y-6">
        {PERMISSIONS_DATA.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-4">
            <span className="text-[#222222]">{item.label}</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPermissionValue(item.id, 'yes')}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  permissions[item.id] === 'yes' ? 'bg-black border-black text-white ring-2 ring-black ring-offset-2' : 'border-gray-300 bg-white'
                }`}
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => setPermissionValue(item.id, 'no')}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  permissions[item.id] === 'no' ? 'bg-red-500 border-red-500 text-white ring-2 ring-red-500 ring-offset-2' : 'border-red-200 text-red-500 bg-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between border-b border-gray-50 pb-4 pt-2">
          <span className="text-[#222222] font-medium">Age minimum pour louer</span>
          <div className="relative w-24">
            <select
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white text-center font-medium focus:outline-none focus:border-black"
            >
              {[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((age) => (
                <option key={age} value={age}>{age} ans</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
