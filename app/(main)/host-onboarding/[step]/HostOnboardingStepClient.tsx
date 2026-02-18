'use client';

import { useRouter, useParams } from 'next/navigation';
import { HostOnboarding } from '@/app/pages/HostOnboarding';
import { getNavigationPath } from '@/app/config/routes';

/**
 * Client component for Host Onboarding Step Page
 */
export default function HostOnboardingStepClient() {
  const router = useRouter();
  const params = useParams();
  const step = params.step as string;

  // Valid step types (from Intégration site Airbnb)
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

  // If step is not valid, redirect to acceptance-condition
  const initialStep = validSteps.includes(step) 
    ? step as any
    : 'acceptance-condition';

  // Handle navigation
  const handleNavigate = (page: string, data?: any) => {
    if (page === 'home' || page === 'logements') {
      router.push('/');
    } else if (page === 'annonces') {
      router.push('/annonces');
    } else {
      const path = getNavigationPath(page as any);
      router.push(path);
    }
  };

  // Handle complete onboarding
  const handleCompleteOnboarding = () => {
    router.push('/annonces');
  };

  // Handle step changes - navigate to the new step URL
  const handleStepChange = (newStep: string) => {
    router.push(`/host-onboarding/${newStep}`);
  };

  return (
    <HostOnboarding 
      onNavigate={handleNavigate} 
      onCompleteOnboarding={handleCompleteOnboarding}
      initialStep={initialStep}
      onStepChange={handleStepChange}
    />
  );
}

