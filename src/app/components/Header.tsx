import { Search, Globe, Menu, User } from "lucide-react";
import { useState, forwardRef, useRef, useImperativeHandle } from "react";
import { CompactSearchBar } from "./SearchBar";
import { SearchOverlay } from "./SearchOverlay";
import { LanguageModal } from "./LanguageModal";
import { HeaderContent } from "./HeaderContent";
import { BecomeHostModal } from "./BecomeHostModal";
import { AuthModal } from "./AuthModal";
import { HeaderRightMenu } from "./HeaderRightMenu";
import { useAuth } from "../context/AuthContext";

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
          className="sticky top-0 z-50 bg-white"
        >
          <div className="px-4 sm:px-6 lg:px-20 py-4">
            <div className="flex items-center justify-between relative">
              {/* Logo - Always visible */}
              <button
                onClick={() => onNavigate("logements")}
                className="flex items-center gap-1 flex-shrink-0 hover:opacity-80 transition-opacity duration-200 relative z-10"
              >
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z"
                    fill="#10B981"
                  />
                </svg>
                <span
                  className="text-[#10B981] text-xl ml-1 hidden sm:block"
                  style={{ fontWeight: 600 }}
                >
                  HOMIQIO
                </span>
              </button>

              {/* Center Section - Both components always mounted, visibility controlled by CSS */}
              <div className="flex-1 relative">
                {/* HeaderContent - Normal mode (visible when NOT scrolled) */}
                <div
                  className={`transition-opacity duration-300 ease-in-out ${
                    isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
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
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
                    isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="flex-1 mx-8">
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