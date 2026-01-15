'use client';

import { useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ScrollProvider, useScroll } from '@/app/hooks/ScrollContext';
import { AuthProvider } from '@/app/context/AuthContext';
import { getCurrentPageFromPathname, getNavigationPath } from '@/app/config/routes';

/**
 * Layout interne avec Header et Footer
 * Utilise le contexte de scroll partagé
 */
function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const { isScrolled, handleNavigateScroll } = useScroll();

  // Determine current page from pathname
  const currentPage = getCurrentPageFromPathname(pathname);

  // Handle navigation with real routes
  const handleNavigate = (page: 'logements' | 'experiences' | 'services' | 'messages' | 'host-onboarding' | 'annonces' | 'client-space' | 'experience-onboarding', data?: any) => {
    const path = getNavigationPath(page);
    handleNavigateScroll();
    router.push(path);
  };

  // Handle search
  const handleSearch = (params: any) => {
    const searchQuery = new URLSearchParams({
      destination: params.destination || '',
      checkIn: params.checkInDate?.toISOString() || '',
      checkOut: params.checkOutDate?.toISOString() || '',
      adults: params.guestsCount?.adults?.toString() || '0',
      children: params.guestsCount?.children?.toString() || '0',
      babies: params.guestsCount?.babies?.toString() || '0',
      pets: params.guestsCount?.pets?.toString() || '0',
    });
    handleNavigateScroll();
    router.push(`/search?${searchQuery.toString()}`);
  };

  // Check if current page should show header/footer
  const showHeaderFooter = !pathname?.match(/^\/(property|experience|service|booking|search|client-space|messages|privacy|terms|how-it-works|company-info|host-onboarding|annonces|identity-verification|phone-verification|experience-onboarding)/);

  return (
    <div className="min-h-screen bg-white">
      {showHeaderFooter && (
        <Header
          ref={headerRef}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isScrolled={isScrolled}
          onSearch={handleSearch}
          onClientSpaceClick={() => {
            handleNavigateScroll();
            router.push('/client-space');
          }}
        />
      )}
      {children}
      {showHeaderFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

/**
 * Layout principal avec ScrollProvider et AuthProvider
 * Fournit le contexte de scroll à tous les composants enfants
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ScrollProvider>
        <MainLayoutContent>{children}</MainLayoutContent>
      </ScrollProvider>
    </AuthProvider>
  );
}

