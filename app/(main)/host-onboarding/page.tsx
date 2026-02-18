'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Page Host Onboarding Next.js
 * Redirects to the intro step
 */
export default function HostOnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the intro step
    router.replace('/host-onboarding/acceptance-condition');
  }, [router]);

  return null;
}

