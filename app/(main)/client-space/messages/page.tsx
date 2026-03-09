'use client';

import { Suspense } from 'react';
import { ClientMessages } from '@/app/components/client-space/ClientMessages';

export default function ClientMessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
      </div>
    }>
      <ClientMessages />
    </Suspense>
  );
}
