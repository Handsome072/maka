'use client';

import { Check, ChevronRight } from 'lucide-react';
import { Logo } from '@/app/components/Logo';
import { BIG_STEPS } from './constants';

interface HostOnboardingHeaderProps {
  currentBigStep: number;
  progressPercentage: number;
  onNavigate: (page: string) => void;
}

export function HostOnboardingHeader({
  currentBigStep,
  progressPercentage,
  onNavigate,
}: HostOnboardingHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 h-20 border-b border-gray-100 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center">
        <Logo />
      </div>

      <div className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2 space-x-4">
        {BIG_STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center gap-2 ${currentBigStep >= step.number ? 'opacity-100' : 'opacity-40'}`}>
              {currentBigStep > step.number ? (
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentBigStep === step.number ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.number}
                </div>
              )}
              <span className="text-sm font-medium text-[#222222] whitespace-nowrap">{step.label}</span>
            </div>
            {index < BIG_STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 mx-2" />}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          className="px-4 py-2 text-sm font-medium text-[#222222] border border-gray-200 rounded-full hover:bg-gray-50 transition-colors hidden sm:block"
          onClick={() => onNavigate('logements')}
        >
          <span className="mr-2">✓</span>
          Enregistrer et quitter
        </button>
        <button className="text-sm font-medium text-[#222222]">En</button>
      </div>

      <div
        className="absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-300 ease-out"
        style={{ width: `${progressPercentage}%` }}
      />
    </header>
  );
}
