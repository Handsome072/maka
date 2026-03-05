'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { HostOnboarding } from '@/app/pages/HostOnboarding';

function EditListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get('id');

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
      listingId={listingId ? parseInt(listingId, 10) : undefined}
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
