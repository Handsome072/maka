'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { HostOnboarding } from '@/app/pages/HostOnboarding';

function EditListingContent() {
  const router = useRouter();
  const handleNavigate = (page: string) => {
    if (page === 'annonces') {
      router.push('/annonces');
    } else if (page === 'logements' || page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  const handleComplete = () => {
    router.push('/annonces');
  };

  return (
    <HostOnboarding
      onNavigate={handleNavigate}
      onCompleteOnboarding={handleComplete}
      initialStep="acceptance-condition"
    />
  );
}

export default function EditListingPage() {
  return (
    <Suspense>
      <EditListingContent />
    </Suspense>
  );
}
