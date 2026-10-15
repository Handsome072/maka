import { useState, forwardRef } from "react";
import Link from "next/link";
import { LanguageModal } from "./LanguageModal";
import { BecomeHostModal } from "./BecomeHostModal";
import { HeaderRightMenu } from "./HeaderRightMenu";
import { ROUTES } from "../config/routes";

interface HeaderProps {
  currentPage: "logements" | "experiences" | "services";
  onNavigate: (
    page: "logements" | "experiences" | "services" | "messages" | "host-onboarding" | "annonces" | "login" | "experience-onboarding",
  ) => void;
  isScrolled: boolean;
  /** La barre de recherche placée juste dessous prolonge le header : pas de trait entre les deux. */
  joinsSearchBand?: boolean;
  onClientSpaceClick?: () => void;
  isHost?: boolean;
  onBecomeHostDirect?: () => void;
}

/** Header fin du site : logo à gauche, menus et compte à droite ; seul un trait apparaît au défilement. */
export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ currentPage, onNavigate, isScrolled, joinsSearchBand = false, onClientSpaceClick, isHost, onBecomeHostDirect }, ref) => {
    const [showLanguageModal, setShowLanguageModal] =
      useState(false);
    const [showMenuDropdown, setShowMenuDropdown] =
      useState(false);
    const [showBecomeHostModal, setShowBecomeHostModal] =
      useState(false);

    return (
      <>
        <header
          ref={ref}
          className={`z-50 bg-[#FCFCFC] border-b transition-[box-shadow,border-color] duration-200 ${
            isScrolled
              ? "border-gray-100 shadow-[0_6px_16px_-12px_rgba(17,24,39,0.25)]"
              : joinsSearchBand
                ? "border-transparent"
                : "border-gray-100"
          }`}
        >
          <div className="h-16 px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-6">
            <Link href={ROUTES.HOME} className="flex-shrink-0 border-0">
              <img
                src="/sejoura_logo.png"
                alt="Séjoura"
                className="w-[160px] h-auto border-0"
              />
            </Link>

            <HeaderRightMenu
              showMenuDropdown={showMenuDropdown}
              setShowMenuDropdown={setShowMenuDropdown}
              setShowLanguageModal={setShowLanguageModal}
              setShowBecomeHostModal={setShowBecomeHostModal}
              onAuthClick={() => onNavigate('login')}
              onClientSpaceClick={onClientSpaceClick}
              onMessagesClick={() => onNavigate('messages')}
              isHost={isHost}
              onAnnoncesClick={() => onNavigate('annonces')}
              onBecomeHostDirect={onBecomeHostDirect}
              currentPage={currentPage}
            />
          </div>
        </header>

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

      </>
    );
  },
);

Header.displayName = "Header";
