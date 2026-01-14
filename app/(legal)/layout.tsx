'use client';

import { AuthProvider } from '@/app/context/AuthContext';
import { LegalHeader } from '@/app/components/LegalHeader';
import { ScrollToTopButton } from '@/app/components/ScrollToTopButton';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <LegalHeader />
        {children}
        <ScrollToTopButton />
      </div>
    </AuthProvider>
  );
}

