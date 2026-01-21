'use client';

import { useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { MobileNav } from '@/app/components/MobileNav';
import { MobileSearchOverlay } from '@/app/components/MobileSearchOverlay';
import { AuthModal } from '@/app/components/AuthModal';
import { ScrollProvider, useScroll } from '@/app/hooks/ScrollContext';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { getCurrentPageFromPathname, getNavigationPath } from '@/app/config/routes';
import { Search } from 'lucide-react';

/**
 * Routes qui utilisent le Header/Footer STANDARD (via layout)
 * Ces pages n'ont PAS leur propre header intégré
 *
 * Note: Les pages comme /property/[id], /experience/[id], /search, /booking, etc.
 * ont leur propre header intégré dans le composant page et sont donc exclues.
 */
const ROUTES_WITH_STANDARD_HEADER = [
  '/',
  '/experiences',
  '/services',
  '/property',
];

/**
 * Vérifie si la route actuelle doit afficher le header/footer standard
 */
function shouldShowStandardHeader(pathname: string | null): boolean {
  if (!pathname) return false;

  return ROUTES_WITH_STANDARD_HEADER.some(route => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

/**
 * Layout interne avec Header et Footer
 * Utilise le contexte de scroll partagé
 */
function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const { isScrolled, handleNavigateScroll } = useScroll();
  const { user } = useAuth();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  // Check if current page should show standard header/footer
  const showHeaderFooter = shouldShowStandardHeader(pathname);

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {showHeaderFooter && (
        <>
          {/* Mobile Header - visible only for S < 745 */}
          <div className="md:hidden sticky top-0 z-50 bg-[#F7F7F7]">
            {/* Mobile Search Button */}
            <div className="px-4 py-3">
              <button
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full py-3 px-6 shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Commencer ma recherche</span>
              </button>
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="flex items-center justify-around px-6 pb-3 border-b border-gray-200">
              <button
                onClick={() => handleNavigate('logements')}
                className={`flex flex-col items-center gap-1.5 py-2 px-4 ${currentPage === 'logements' ? 'border-b-2 border-black' : ''}`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-6 opacity-100'}`}
                >
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xs font-medium">Logements</span>
              </button>

              <button
                onClick={() => handleNavigate('experiences')}
                className={`relative flex flex-col items-center gap-1.5 py-2 px-4 ${currentPage === 'experiences' ? 'border-b-2 border-black' : ''}`}
              >
                <div className={`transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-6 opacity-100'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span className="absolute top-0 -right-6 text-white text-[8px] px-1.5 py-0.5" style={{ fontWeight: 600, background: 'linear-gradient(357.5deg, #3e567c 1.59%, #3a5475 21.23%, #2d3c5b 58.6%, #809dc0 97.4%)', borderRadius: '10px 10px 10px 2px' }}>NOUVEAU</span>
                </div>
                <span className="text-xs font-medium">Expériences</span>
              </button>

              <button
                onClick={() => handleNavigate('services')}
                className={`relative flex flex-col items-center gap-1.5 py-2 px-4 ${currentPage === 'services' ? 'border-b-2 border-black' : ''}`}
              >
                <div className={` transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-6 opacity-100'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M9 3V21M15 3V21M3 9H21M3 15H21" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="absolute top-0 -right-6 text-white text-[8px] px-1.5 py-0.5" style={{ fontWeight: 600, background: 'linear-gradient(357.5deg, #3e567c 1.59%, #3a5475 21.23%, #2d3c5b 58.6%, #809dc0 97.4%)', borderRadius: '10px 10px 10px 2px' }}>NOUVEAU</span>
                </div>
                <span className="text-xs font-medium">Services</span>
              </button>
            </div>
          </div>

          {/* Desktop/Tablet Header - visible only for S >= 745 */}
          <div className="hidden md:block sticky top-0 z-50">
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
          </div>
        </>
      )}
      {children}
      {showHeaderFooter && <Footer onNavigate={handleNavigate} />}

      {/* Mobile Navigation - visible only for S < 745 */}
      {showHeaderFooter && (
        <MobileNav
          isScrolled={isScrolled}
          onSearchClick={() => setShowMobileSearch(true)}
          onFavoritesClick={() => { }}
          onLoginClick={() => {
            if (user) {
              // User is logged in, navigate to client space
              handleNavigateScroll();
              router.push('/client-space');
            } else {
              // User is not logged in, show auth modal
              setShowAuthModal(true);
            }
          }}
          onProfileClick={() => {
            handleNavigateScroll();
            router.push('/client-space');
          }}
          onMessagesClick={() => {
            handleNavigateScroll();
            router.push('/messages');
          }}
        />
      )}

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay
        isOpen={showMobileSearch}
        onClose={() => setShowMobileSearch(false)}
        currentPage={currentPage}
        onNavigate={(page) => {
          handleNavigate(page);
          setShowMobileSearch(false);
        }}
        onSearch={(params) => {
          handleSearch(params);
          setShowMobileSearch(false);
        }}
      />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
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

