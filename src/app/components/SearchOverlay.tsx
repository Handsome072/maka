import { SearchBar } from "./SearchBar";
import { useEffect, RefObject, useState } from "react";
import { HeaderContent } from "./HeaderContent";
import { HeaderRightMenu } from "./HeaderRightMenu";
import { LanguageModal } from "./LanguageModal";
import { BecomeHostModal } from "./BecomeHostModal";
import { AuthModal } from "./AuthModal";
import Link from "next/link";
import { ROUTES } from "../config/routes";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: "logements" | "experiences" | "services";
  onNavigate: (
    page: "logements" | "experiences" | "services" | "messages" | "host-onboarding" | "annonces",
  ) => void;
  headerRef: RefObject<HTMLElement>;
  onSearch: (params: any) => void;
  onClientSpaceClick?: () => void;
  isHost?: boolean;
}

export function SearchOverlay({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  headerRef,
  onSearch,
  onClientSpaceClick,
  isHost,
}: SearchOverlayProps) {
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fermer l'overlay quand on scroll vers le haut
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      if (!headerRef.current) return;
      const headerHeight = headerRef.current.offsetHeight || 0;
      if (window.scrollY < headerHeight) {
        onClose();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [isOpen, onClose, headerRef]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] border-none"
        onClick={onClose}
      >
        {/* Overlay background */}
        <div
          className="absolute inset-0 bg-black/50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        />

        {/* Content Container - Matches main header exactly */}
        <div
          className="relative bg-[#FCFCFC]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Exact replica of main Header component */}
          <div className="px-4 sm:px-6 lg:px-12 py-4">
            <div className="flex items-center justify-between relative">
              {/* Logo - Always visible */}
              <Link
                href={ROUTES.HOME}
                className="flex items-center gap-1 flex-shrink-0 relative z-10 border-0"
              >
                <img
                  src="/logo.png"
                  alt="HOMIQIO Logo"
                  className="w-[150px] h-auto border-0"
                />
              </Link>

              {/* Center Section - HeaderContent */}
              <div className="flex-1 relative">
                <HeaderContent
                  currentPage={currentPage}
                  onNavigate={onNavigate}
                  onGlobeClick={() => setShowLanguageModal(true)}
                  onMenuClick={() => setShowMenuDropdown(!showMenuDropdown)}
                  onBecomeHostClick={() => setShowBecomeHostModal(true)}
                  MenuDropdownComponent={null}
                />
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

          {/* Search Bar - Matches main page layout */}
          <div className="bg-[#FCFCFC]">
            <SearchBar type={currentPage} onSearch={onSearch} />
          </div>
        </div>
      </div>

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
}