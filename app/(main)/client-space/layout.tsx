'use client';

import { ClientSpaceSidebar } from '@/app/components/client-space/ClientSpaceSidebar';

export default function ClientSpaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <ClientSpaceSidebar />
      <main className="lg:ml-[280px] p-4 md:p-6 lg:p-8 mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  );
}
