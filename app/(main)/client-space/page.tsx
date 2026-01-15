'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Client Space Index - Redirects to reservations
 */
export default function ClientSpacePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/client-space/reservations');
  }, [router]);

  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-gray-500">Redirection...</p>
    </div>
  );
}

