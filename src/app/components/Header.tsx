import { Search, Globe, Menu, User } from "lucide-react";
import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import Link from "next/link";
import { CompactSearchBar } from "./SearchBar";
import { SearchOverlay } from "./SearchOverlay";
import { LanguageModal } from "./LanguageModal";
import { HeaderContent } from "./HeaderContent";
import { BecomeHostModal } from "./BecomeHostModal";
import { AuthModal } from "./AuthModal";
import { HeaderRightMenu } from "./HeaderRightMenu";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../config/routes";

interface HeaderProps {
  currentPage: "logements" | "experiences" | "services";
  onNavigate: (
    page: "logements" | "experiences" | "services" | "messages" | "host-onboarding" | "annonces",
  ) => void;
  isScrolled: boolean;
  onSearch: (params: any) => void;
  onClientSpaceClick?: () => void;
  isHost?: boolean;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ currentPage, onNavigate, isScrolled, onSearch, onClientSpaceClick, isHost }, ref) => {
    const [showSearchOverlay, setShowSearchOverlay] =
      useState(false);
    const [showLanguageModal, setShowLanguageModal] =
      useState(false);
    const [showMenuDropdown, setShowMenuDropdown] =
      useState(false);
    const [showBecomeHostModal, setShowBecomeHostModal] =
      useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const { user } = useAuth();

    // Internal ref for the header element
    const headerRef = useRef<HTMLElement>(null);

    // Forward the ref to parent component
    useImperativeHandle(ref, () => headerRef.current as HTMLElement);

    return (
      <>
        <header
          ref={headerRef}
          className="z-50 bg-[#F7F7F7]"
        >
          <div className="px-4 sm:px-6 lg:px-12 py-4">
            <div className="flex items-center justify-between relative">
              {/* Logo - Responsive: texte masqué pour S < 950 */}
              <Link
                href={ROUTES.HOME}
                className="flex items-center gap-1 flex-shrink-0 relative z-10 border-0"
              >
                {/* Logo complet visible pour S >= 950 */}
                <img
                  src="/logo.png"
                  alt="HOMIQIO Logo"
                  className="hidden min-[950px]:block w-[150px] h-auto border-0"
                />
                {/* Icône seule visible pour S < 950 */}
                <img
                  src="/logoIcon.png"
                  alt="HOMIQIO"
                  className="block min-[950px]:hidden w-[40px] h-auto border-0"
                />
              </Link>

              {/* Center Section - Both components always mounted, visibility controlled by CSS */}
              <div className="flex-1 relative">
                {/* HeaderContent - Normal mode (visible when NOT scrolled) */}
                <div
                  className={`transition-opacity duration-300 ease-in-out ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                >
                  <HeaderContent
                    currentPage={currentPage}
                    onNavigate={onNavigate}
                    onGlobeClick={() => setShowLanguageModal(true)}
                    onMenuClick={() => setShowMenuDropdown(!showMenuDropdown)}
                    onBecomeHostClick={() => setShowBecomeHostModal(true)}
                    MenuDropdownComponent={null}
                  />
                </div>

                {/* CompactSearchBar - Compact mode (visible when scrolled) */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                  <div className="flex-1 mx-2 sm:mx-4 md:mx-8">
                    <CompactSearchBar
                      currentPage={currentPage}
                      onOpen={() => setShowSearchOverlay(true)}
                    />
                  </div>
                </div>
              </div>

              {/* Right Menu - Always rendered, never destroyed */}
              <HeaderRightMenu
                showMenuDropdown={showMenuDropdown}
                setShowMenuDropdown={setShowMenuDropdown}
                setShowLanguageModal={setShowLanguageModal}
                setShowBecomeHostModal={setShowBecomeHostModal}
                setShowAuthModal={setShowAuthModal}
                onClientSpaceClick={onClientSpaceClick}
                onMessagesClick={() => onNavigate('messages')}
                isHost={isHost}
                onAnnoncesClick={() => onNavigate('annonces')}
              />
            </div>
          </div>
        </header>

        {/* Search Overlay */}
        {showSearchOverlay && (
          <SearchOverlay
            isOpen={showSearchOverlay}
            currentPage={currentPage}
            onNavigate={onNavigate}
            onClose={() => setShowSearchOverlay(false)}
            headerRef={headerRef}
            onSearch={onSearch}
            onClientSpaceClick={onClientSpaceClick}
            isHost={isHost}
          />
        )}

        {/* Language Modal */}
        {showLanguageModal && (
          <LanguageModal
            isOpen={showLanguageModal}
            onClose={() => setShowLanguageModal(false)}
          />
        )}

        {/* Become Host Modal */}
        {showBecomeHostModal && (
          <BecomeHostModal
            isOpen={showBecomeHostModal}
            onClose={() => setShowBecomeHostModal(false)}
            onSelectOption={(option) => {
              if (option === 'logement') {
                onNavigate('host-onboarding');
              } else if (option === 'experience') {
                onNavigate('experience-onboarding');
              }
              // Service sera implémenté plus tard
              setShowBecomeHostModal(false);
            }}
          />
        )}

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </>
    );
  },
);

Header.displayName = "Header";