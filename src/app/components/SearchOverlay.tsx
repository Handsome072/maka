import { SearchBar } from "./SearchBar";
import { ExperienceSearchBar } from "./ExperienceSearchBar";
import { ServiceSearchBar } from "./ServiceSearchBar";
import { useEffect, RefObject, useState } from "react";
import { HeaderContent } from "./HeaderContent";
import { MenuDropdown } from "./MenuDropdown";
import { LanguageModal } from "./LanguageModal";
import { BecomeHostModal } from "./BecomeHostModal";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: "logements" | "experiences" | "services";
  onNavigate: (
    page: "logements" | "experiences" | "services",
  ) => void;
  headerRef: RefObject<HTMLElement>;
  onSearch: (params: any) => void;
}

export function SearchOverlay({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  headerRef,
  onSearch,
}: SearchOverlayProps) {
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);

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
    <div className="fixed inset-0 z-[60] border-none" onClick={onClose}>
      {/* Overlay background */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      />

      {/* Content */}
      <div
        className="relative bg-[#F7F7F7]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200">
          <HeaderContent
            currentPage={currentPage}
            onNavigate={onNavigate}
            onGlobeClick={() => setShowLanguageModal(true)}
            onMenuClick={() => setShowMenuDropdown(!showMenuDropdown)}
            onBecomeHostClick={() => setShowBecomeHostModal(true)}
            MenuDropdownComponent={
              <MenuDropdown
                isOpen={showMenuDropdown}
                onClose={() => setShowMenuDropdown(false)}
              />
            }
          />
        </div>

        {/* Search bar based on current page */}
        <div className="bg-[#F7F7F7]">
          {currentPage === "logements" && <SearchBar onSearch={onSearch} />}
          {currentPage === "experiences" && (
            <ExperienceSearchBar onSearch={onSearch} />
          )}
          {currentPage === "services" && <ServiceSearchBar onSearch={onSearch} />}
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
        />
      )}
    </div>
  );
}