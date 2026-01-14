'use client';

import { ScrollProvider } from '@/app/hooks/ScrollContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollProvider>
      {children}
    </ScrollProvider>
  );
}

