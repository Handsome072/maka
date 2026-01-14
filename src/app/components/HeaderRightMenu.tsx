import { Globe, Menu, User } from "lucide-react";
import { MenuDropdown } from "./MenuDropdown";
import { LoggedInMenuDropdown } from "./LoggedInMenuDropdown";
import { useAuth } from "../context/AuthContext";

interface HeaderRightMenuProps {
  showMenuDropdown: boolean;
  setShowMenuDropdown: (show: boolean) => void;
  setShowLanguageModal: (show: boolean) => void;
  setShowBecomeHostModal: (show: boolean) => void;
  setShowAuthModal: (show: boolean) => void;
  onClientSpaceClick?: () => void;
  onMessagesClick?: () => void;
  isHost?: boolean;
  onAnnoncesClick?: () => void;
}

export function HeaderRightMenu({
  showMenuDropdown,
  setShowMenuDropdown,
  setShowLanguageModal,
  setShowBecomeHostModal,
  setShowAuthModal,
  onClientSpaceClick,
  onMessagesClick,
  isHost,
  onAnnoncesClick,
}: HeaderRightMenuProps) {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2.5 flex-shrink-0">
      <button
        className="hidden md:block px-4 py-3 hover:bg-gray-100 rounded-full transition-all duration-200 text-sm"
        style={{ fontWeight: 600 }}
        onClick={() => {
          if (isHost && onAnnoncesClick) {
            onAnnoncesClick();
          } else {
            setShowBecomeHostModal(true);
          }
        }}
      >
        {isHost ? 'Mode hôte' : 'Devenir hôte'}
      </button>
      
      {user ? (
        <button
          className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white cursor-pointer hover:bg-gray-800 transition-all duration-200"
          style={{ fontWeight: 600 }}
        >
          {user.name.charAt(0).toUpperCase()}
        </button>
      ) : (
        <button
          className="p-3 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-all duration-200"
          onClick={() => setShowLanguageModal(true)}
        >
          <Globe className="w-4 h-4" />
        </button>
      )}
      
      <div className="relative">
        <button
          className="flex items-center gap-2 border border-gray-300 rounded-full p-1.5 pr-3 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
          onClick={() => setShowMenuDropdown(!showMenuDropdown)}
        >
          <Menu className="w-4 h-4 ml-1" />
          {user ? (
            <div
              className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm"
              style={{ fontWeight: 600 }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </button>

        {/* Menu Dropdown - Always rendered here, never destroyed */}
        {user ? (
          <LoggedInMenuDropdown
            isOpen={showMenuDropdown}
            onClose={() => setShowMenuDropdown(false)}
            onBecomeHostClick={() => {
              setShowMenuDropdown(false);
              setShowBecomeHostModal(true);
            }}
            onLanguageClick={() => {
              setShowMenuDropdown(false);
              setShowLanguageModal(true);
            }}
            onClientSpaceClick={onClientSpaceClick}
            onMessagesClick={onMessagesClick}
            isHost={isHost}
            onAnnoncesClick={onAnnoncesClick}
          />
        ) : (
          <MenuDropdown
            isOpen={showMenuDropdown}
            onClose={() => setShowMenuDropdown(false)}
            onAuthClick={() => {
              setShowMenuDropdown(false);
              setShowAuthModal(true);
            }}
          />
        )}
      </div>
    </div>
  );
}