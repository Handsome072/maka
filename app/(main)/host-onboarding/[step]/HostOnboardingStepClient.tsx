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

  // Valid step types
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

  // If step is not valid, redirect to intro
  const initialStep = validSteps.includes(step) 
    ? step as any
    : 'intro';

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

