'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { MobileNav } from '@/app/components/MobileNav';
import { MobileSearchOverlay } from '@/app/components/MobileSearchOverlay';
import { BecomeHostModal } from '@/app/components/BecomeHostModal';
import { ScrollProvider, useScroll } from '@/app/hooks/ScrollContext';
import { useAuth } from '@/app/context/AuthContext';
import { useHostStatus } from '@/app/hooks/useHostStatus';
import { getCurrentPageFromPathname, getNavigationPath, ROUTES } from '@/app/config/routes';
import Link from 'next/link';
import { Menu, Search } from 'lucide-react';
import { MobileMenu } from '@/app/components/MobileMenu';

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
  const { user, isAdmin } = useAuth();
  const { isHost } = useHostStatus();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const closeMobileMenu = useCallback(() => setShowMobileMenu(false), []);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);

  // Redirect admin users to /admin if they try to access non-admin pages
  useEffect(() => {
    if (isAdmin && pathname && !pathname.startsWith('/admin')) {
      router.replace('/admin');
    }
  }, [isAdmin, pathname, router]);

  // Determine current page from pathname
  const currentPage = getCurrentPageFromPathname(pathname);

  // Handle navigation with real routes
  const handleNavigate = (page: 'logements' | 'experiences' | 'services' | 'messages' | 'host-onboarding' | 'annonces' | 'client-space' | 'experience-onboarding' | 'login', data?: any) => {
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

  // Accueil, Expériences, Services : la barre de recherche prolonge le header (ordinateur)
  const hasSearchBand = ['/', '/experiences', '/services'].includes(pathname?.replace(/(.)\/$/, '$1') ?? '');

  return (
    <div className="min-h-screen bg-white pb-16 md:pb-0">
      {showHeaderFooter && (
        <>
          {/* Mobile Header - visible only for S < 745 : logo, recherche et menu plein écran */}
          <div
            className={`md:hidden sticky top-0 z-50 bg-[#FCFCFC] border-b border-gray-100 transition-shadow duration-200 ${
              isScrolled ? 'shadow-[0_6px_16px_-12px_rgba(17,24,39,0.25)]' : ''
            }`}
          >
            <div className="h-14 px-4 flex items-center justify-between">
              <Link href={ROUTES.HOME} className="flex-shrink-0">
                <img src="/sejoura_logo.png" alt="Séjoura" className="w-[128px] h-auto" />
              </Link>
              <div className="flex items-center gap-1">
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-black/[0.04]"
                  onClick={() => setShowMobileSearch(true)}
                  aria-label="Rechercher"
                >
                  <Search className="w-5 h-5" strokeWidth={1.75} />
                </button>
                <button
                  className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-ink hover:bg-black/[0.04]"
                  onClick={() => setShowMobileMenu(true)}
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="w-6 h-6" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
          <MobileMenu
            open={showMobileMenu}
            onClose={closeMobileMenu}
            currentPage={currentPage}
            isHost={isHost}
            onHostClick={() => {
              handleNavigateScroll();
              router.push(isHost ? ROUTES.ANNONCES : '/host-onboarding/acceptance-condition');
            }}
            onAuthClick={() => handleNavigate('login')}
          />

          {/* Desktop/Tablet Header - visible only for S >= 745 */}
          <div className="hidden md:block sticky top-0 z-50">
            <Header
              ref={headerRef}
              currentPage={currentPage}
              onNavigate={handleNavigate}
              isScrolled={isScrolled}
              joinsSearchBand={hasSearchBand}
              onClientSpaceClick={() => {
                handleNavigateScroll();
                router.push('/client-space');
              }}
              isHost={isHost}
              onBecomeHostDirect={() => {
                handleNavigateScroll();
                router.push('/host-onboarding/acceptance-condition');
              }}
            />
          </div>
        </>
      )}
      {children}
      {showHeaderFooter && <Footer onNavigate={handleNavigate} />}

          {/* Mobile Navigation - visible only for S < 745 ; masquée sur une annonce, où la barre « Réserver » prend sa place (comme Airbnb) */}
      {showHeaderFooter && !pathname?.startsWith('/property/') && (
        <MobileNav
          onSearchClick={() => setShowMobileSearch(true)}
          onFavoritesClick={() => {
            handleNavigateScroll();
            router.push(user ? ROUTES.CLIENT_SPACE_FAVORITES : `/login?redirect=${ROUTES.CLIENT_SPACE_FAVORITES}`);
          }}
          isHost={isHost}
          onBecomeHostClick={() => {
            handleNavigateScroll();
            if (isHost) {
              router.push('/annonces');
            } else {
              router.push('/host-onboarding/acceptance-condition');
            }
          }}
          onLoginClick={() => {
            if (user) {
              // User is logged in, navigate to client space
              handleNavigateScroll();
              router.push('/client-space');
            } else {
              // User is not logged in, navigate to login page
              handleNavigateScroll();
              router.push('/login');
            }
          }}
          onProfileClick={() => {
            // Only navigate to client-space if on homepage
            if (pathname === '/') {
              handleNavigateScroll();
              router.push('/client-space');
            }
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

      {/* Become Host Modal */}
      <BecomeHostModal
        isOpen={showBecomeHostModal}
        onClose={() => setShowBecomeHostModal(false)}
        onSelectOption={(option) => {
          if (option === 'logement') {
            handleNavigate('host-onboarding');
          } else if (option === 'experience') {
            handleNavigate('experience-onboarding');
          }
          // Service sera implémenté plus tard
          setShowBecomeHostModal(false);
        }}
      />
    </div>
  );
}

/**
 * Layout principal avec ScrollProvider
 * Fournit le contexte de scroll à tous les composants enfants
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </ScrollProvider>
  );
}

