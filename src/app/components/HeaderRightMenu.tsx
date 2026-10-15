import { useState } from "react";
import { Menu } from "lucide-react";
import { LoggedInMenuDropdown } from "./LoggedInMenuDropdown";
import { HeaderNavMenus, type MainPage } from "./HeaderNav";
import { MobileMenu } from "./MobileMenu";
import { useAuth } from "../context/AuthContext";

interface HeaderRightMenuProps {
  showMenuDropdown: boolean;
  setShowMenuDropdown: (show: boolean) => void;
  setShowLanguageModal: (show: boolean) => void;
  setShowBecomeHostModal: (show: boolean) => void;
  onAuthClick?: () => void;
  onClientSpaceClick?: () => void;
  onMessagesClick?: () => void;
  isHost?: boolean;
  onAnnoncesClick?: () => void;
  onBecomeHostDirect?: () => void;
  /** Rubrique affichée, mise en avant dans le menu « Séjours ». */
  currentPage?: MainPage;
}

export function HeaderRightMenu({
  showMenuDropdown,
  setShowMenuDropdown,
  setShowLanguageModal,
  setShowBecomeHostModal,
  onAuthClick,
  onClientSpaceClick,
  onMessagesClick,
  isHost,
  onAnnoncesClick,
  onBecomeHostDirect,
  currentPage,
}: HeaderRightMenuProps) {
  const { user } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const photo = user ? user.profile_photo_url || user.avatar : null;

  const handleHostClick = () => {
    if (isHost && onAnnoncesClick) {
      onAnnoncesClick();
    } else if (onBecomeHostDirect) {
      onBecomeHostDirect();
    } else {
      setShowBecomeHostModal(true);
    }
  };

  return (
    <div className="flex items-center flex-shrink-0">
      {/* Ordinateur et tablette */}
      <div className="hidden md:flex items-center gap-1">
        <HeaderNavMenus currentPage={currentPage} isHost={isHost} onHostClick={handleHostClick} />

        <button
          type="button"
          className="h-10 px-3 rounded-full text-[15px] font-medium text-ink hover:bg-black/[0.04] transition-colors"
          onClick={() => setShowLanguageModal(true)}
          aria-label="Langue et devise : français, euro"
        >
          FR
        </button>

        {user ? (
          <div className="relative ml-1">
            <button
              type="button"
              data-menu-trigger
              className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-ink text-white text-sm font-semibold ring-offset-2 ring-offset-[#FCFCFC] transition-shadow ${
                showMenuDropdown ? "ring-2 ring-brand" : "hover:ring-2 hover:ring-black/10"
              }`}
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
              aria-haspopup="menu"
              aria-expanded={showMenuDropdown}
              aria-label="Mon compte"
            >
              {photo ? (
                <img src={photo} alt="" className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </button>

            <LoggedInMenuDropdown
              isOpen={showMenuDropdown}
              onClose={() => setShowMenuDropdown(false)}
              onBecomeHostClick={() => {
                setShowMenuDropdown(false);
                setShowBecomeHostModal(true);
              }}
              onBecomeHostDirect={onBecomeHostDirect ? () => { setShowMenuDropdown(false); onBecomeHostDirect(); } : undefined}
              onLanguageClick={() => {
                setShowMenuDropdown(false);
                setShowLanguageModal(true);
              }}
              onClientSpaceClick={onClientSpaceClick}
              onMessagesClick={onMessagesClick}
              isHost={isHost}
              onAnnoncesClick={onAnnoncesClick}
            />
          </div>
        ) : (
          <button
            type="button"
            className="ml-1 h-10 px-5 rounded-full border border-gray-300 bg-white text-[15px] font-medium text-ink hover:border-ink transition-colors"
            onClick={onAuthClick}
          >
            Connexion
          </button>
        )}
      </div>

      {/* Mobile : tout passe par le menu plein écran */}
      <button
        type="button"
        className="md:hidden w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-ink hover:bg-black/[0.04]"
        onClick={() => setShowMobileMenu(true)}
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-6 h-6" strokeWidth={1.75} />
      </button>
      <MobileMenu
        open={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        currentPage={currentPage}
        isHost={isHost}
        onHostClick={handleHostClick}
        onAuthClick={onAuthClick}
      />
    </div>
  );
}
