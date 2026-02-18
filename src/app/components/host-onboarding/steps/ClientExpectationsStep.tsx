'use client';

import { Check, X } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';
import { EXPECTATIONS_DATA } from '../constants';

export function ClientExpectationsStep() {
  const { expectations, setExpectationValue } = useHostOnboarding();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222] mb-8 text-center">Attentes du client et sécurité</h1>
      <div className="space-y-6">
        {EXPECTATIONS_DATA.client.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-4">
            <span className="text-[#222222]">{item.label}</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setExpectationValue(item.id, 'yes')}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  expectations[item.id] === 'yes' ? 'bg-black border-black text-white' : 'border-gray-300 bg-white text-gray-300'
                }`}
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => setExpectationValue(item.id, 'no')}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  expectations[item.id] === 'no' ? 'bg-red-500 border-red-500 text-white' : 'border-red-200 text-red-500 bg-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-px bg-gray-100" />
      <div className="space-y-6">
        {EXPECTATIONS_DATA.safety.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-4">
            <span className="text-[#222222]">{item.label}</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setExpectationValue(item.id, 'yes')}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  expectations[item.id] === 'yes' ? 'bg-black border-black text-white' : 'border-gray-300 bg-white text-gray-300'
                }`}
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => setExpectationValue(item.id, 'no')}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                  expectations[item.id] === 'no' ? 'bg-red-500 border-red-500 text-white' : 'border-red-200 text-red-500 bg-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
