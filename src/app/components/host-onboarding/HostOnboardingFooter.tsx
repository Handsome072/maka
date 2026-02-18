'use client';

import type { Step } from './types';

interface HostOnboardingFooterProps {
  currentStep: Step;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled: () => boolean;
}

export function HostOnboardingFooter({
  currentStep,
  onBack,
  onNext,
  isNextDisabled,
}: HostOnboardingFooterProps) {
  const isSummaryReview = currentStep.includes('summary-review');
  const isSignature = currentStep === 'signature';

  if (isSummaryReview && !isSignature) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 md:px-12 z-50">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-200 rounded-full text-[#222222] font-semibold hover:bg-gray-50 transition-colors shadow-sm min-w-[120px]"
          >
            Retour
          </button>
        </div>
      </footer>
    );
  }

  if (isSignature) {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 md:px-12 z-50">
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
        {currentStep !== 'acceptance-condition' && (
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-200 rounded-full text-[#222222] font-semibold hover:bg-gray-50 transition-colors shadow-sm min-w-[120px]"
          >
            Retour
          </button>
        )}
        <div className={currentStep === 'acceptance-condition' ? 'ml-auto' : ''}>
          <button
            onClick={onNext}
            disabled={isNextDisabled()}
            className={`px-8 py-3 rounded-full text-white font-semibold transition-all shadow-md min-w-[120px] ${
              isNextDisabled() ? 'bg-gray-800 opacity-50 cursor-not-allowed' : 'bg-[#222222] hover:bg-black'
            }`}
          >
            Suivant
          </button>
        </div>
      </div>
    </footer>
  );
}
