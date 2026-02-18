import HostOnboardingStepClient from './HostOnboardingStepClient';

/**
 * Generate static params for all possible onboarding steps
 * Required for static export
 */
export function generateStaticParams() {
  const validSteps = [
    'acceptance-condition',
    'reservation-type',
    'address-location',
    'capacity-details',
    'client-expectations',
    'amenities',
    'summary-review-1',
    'host-photo',
    'chalet-photos',
    'chalet-description',
    'summary-review-2',
    'permissions',
    'reservation-mode',
    'pricing',
    'fees',
    'calendar',
    'cancellation-policy',
    'laws-taxes',
    'local-laws',
    'guest-arrival',
    'phone-number',
    'summary-review-3',
    'verification',
    'signature'
  ];

  return validSteps.map((step) => ({
    step,
  }));
}

/**
 * Dynamic Host Onboarding Step Page
 * Handles individual step URLs like /host-onboarding/property-type, /host-onboarding/space-type, etc.
 */
export default function HostOnboardingStepPage() {
  return <HostOnboardingStepClient />;
}

