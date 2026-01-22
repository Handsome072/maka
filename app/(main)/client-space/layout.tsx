'use client';

import { usePathname } from 'next/navigation';
import { ClientSpaceHeader } from '@/app/components/client-space/ClientSpaceHeader';
import { ClientSpaceSidebar } from '@/app/components/client-space/ClientSpaceSidebar';
import { ClientSpaceMobileNav } from '@/app/components/client-space/ClientSpaceMobileNav';

export default function ClientSpaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isIndex = pathname === '/client-space';

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      <ClientSpaceHeader />
      <div className="flex max-w-[1920px] mx-auto">
        {/* Sidebar */}
        <div className={`
          w-full md:w-auto
          ${isIndex ? 'block' : 'hidden md:block'}
        `}>
          <ClientSpaceSidebar />
        </div>

        {/* Main Content */}
        <main className={`
          flex-1
          ${isIndex ? 'hidden md:block' : 'block'}
        `}>
          {children}
        </main>
      </div>

      {/* Mobile Navigation - visible only for S < 745px */}
      <ClientSpaceMobileNav />
    </div>
  );
}
