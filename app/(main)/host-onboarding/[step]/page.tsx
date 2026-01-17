import HostOnboardingStepClient from './HostOnboardingStepClient';

/**
 * Generate static params for all possible onboarding steps
 * Required for static export
 */
export function generateStaticParams() {
  const validSteps = [
    'intro',
    'step1',
    'property-type',
    'space-type',
    'location',
    'confirm-address',
    'pin-location',
    'guest-info',
    'step2-intro',
    'amenities',
    'photos',
    'photo-upload',
    'photo-review',
    'title',
    'highlights',
    'description',
    'step3-intro',
    'reservation-settings',
    'pricing',
    'weekend-pricing',
    'discounts',
    'security',
    'final-details',
    'verification-points'
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

