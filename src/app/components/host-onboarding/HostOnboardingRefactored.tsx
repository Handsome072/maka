'use client';

import type { ComponentType } from 'react';
import { useHostOnboardingState } from './useHostOnboardingState';
import { HostOnboardingProvider } from './HostOnboardingContext';
import { HostOnboardingHeader } from './HostOnboardingHeader';
import { HostOnboardingFooter } from './HostOnboardingFooter';
import {
  AcceptanceConditionStep,
  ReservationTypeStep,
  AddressLocationStep,
  CapacityDetailsStep,
  ClientExpectationsStep,
  AmenitiesStep,
  SummaryReview1Step,
  HostPhotoStep,
  ChaletPhotosStep,
  ChaletDescriptionStep,
  SummaryReview2Step,
  PermissionsStep,
  ReservationModeStep,
  PricingStep,
  FeesStep,
  CalendarStep,
  CancellationPolicyStep,
  LawsTaxesStep,
  LocalLawsStep,
  GuestArrivalStep,
  PhoneNumberStep,
  SummaryReview3Step,
  VerificationStep,
  SignatureStep,
} from './steps';
import {
  SmsVerificationModal,
  ImportIcalModal,
  RateModal,
  BlockModal,
  BedroomEditModal,
} from './modals';
import type { HostOnboardingProps } from './types';

const STEP_COMPONENTS: Record<string, ComponentType> = {
  'acceptance-condition': AcceptanceConditionStep,
  'reservation-type': ReservationTypeStep,
  'address-location': AddressLocationStep,
  'capacity-details': CapacityDetailsStep,
  'client-expectations': ClientExpectationsStep,
  'amenities': AmenitiesStep,
  'summary-review-1': SummaryReview1Step,
  'host-photo': HostPhotoStep,
  'chalet-photos': ChaletPhotosStep,
  'chalet-description': ChaletDescriptionStep,
  'summary-review-2': SummaryReview2Step,
  'permissions': PermissionsStep,
  'reservation-mode': ReservationModeStep,
  'pricing': PricingStep,
  'fees': FeesStep,
  'calendar': CalendarStep,
  'cancellation-policy': CancellationPolicyStep,
  'laws-taxes': LawsTaxesStep,
  'local-laws': LocalLawsStep,
  'guest-arrival': GuestArrivalStep,
  'phone-number': PhoneNumberStep,
  'summary-review-3': SummaryReview3Step,
  'verification': VerificationStep,
  'signature': SignatureStep,
};

export function HostOnboardingRefactored({
  onNavigate,
  initialStep = 'acceptance-condition',
  onCompleteOnboarding,
  onStepChange,
}: HostOnboardingProps) {
  const state = useHostOnboardingState({
    initialStep,
    onNavigate,
    onCompleteOnboarding,
    onStepChange,
  });

  const StepComponent = STEP_COMPONENTS[state.currentStep];

  return (
    <HostOnboardingProvider value={state}>
      <div className="min-h-screen bg-white flex flex-col font-sans">
        <HostOnboardingHeader
          currentBigStep={state.currentBigStep}
          progressPercentage={state.progressPercentage}
          onNavigate={state.onNavigate}
        />

        <main className="flex-1 pt-32 pb-40 px-6 md:px-12 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {StepComponent && <StepComponent />}
        </main>

        <HostOnboardingFooter
          currentStep={state.currentStep}
          onBack={state.handleBack}
          onNext={state.handleNext}
          isNextDisabled={state.isNextDisabled}
        />

        <SmsVerificationModal />
        <ImportIcalModal />
        <RateModal />
        <BlockModal />
        <BedroomEditModal />
      </div>
    </HostOnboardingProvider>
  );
}
