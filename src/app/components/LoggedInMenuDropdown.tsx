import { Heart, Globe, MessageSquare, User, HelpCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/routes';

// Host illustration - works for both Vite (public/) and Next.js (public/)
const hostIllustration = '/host-illustration.png';

interface LoggedInMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onBecomeHostClick?: () => void;
  onLanguageClick?: () => void;
  onClientSpaceClick?: () => void;
  onMessagesClick?: () => void;
  isHost?: boolean;
  onAnnoncesClick?: () => void;
}

export function LoggedInMenuDropdown({ isOpen, onClose, onBecomeHostClick, onLanguageClick, onClientSpaceClick, onMessagesClick, isHost, onAnnoncesClick }: LoggedInMenuDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl w-60 z-50 max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-120px)] md:max-h-[600px] overflow-y-auto"
      style={{
        minWidth: '300px',
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        scrollbarWidth: 'thin', // Firefox
        scrollbarColor: '#d1d5db transparent', // Firefox
      }}
    >
      <style>{`
        /* Custom scrollbar for Webkit browsers (Chrome, Safari, Edge) */
        .absolute.top-full.right-0::-webkit-scrollbar {
          width: 6px;
        }
        .absolute.top-full.right-0::-webkit-scrollbar-track {
          background: transparent;
        }
        .absolute.top-full.right-0::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        .absolute.top-full.right-0::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
      `}</style>
      <div className="py-2">
      {/* Favoris */}
      <button className="w-full px-8 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left">
        <Heart className="w-5 h-5 text-gray-700" />
        <span className="text-sm" style={{ fontWeight: 600 }}>Favoris</span>
      </button>

      {/* Voyages */}
      <button className="w-full px-8 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left">
        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span className="text-sm" style={{ fontWeight: 600 }}>Voyages</span>
      </button>

      {/* Messages */}
      <Link
        href={ROUTES.MESSAGES}
        className="w-full px-8 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
        onClick={onClose}
      >
        <MessageSquare className="w-5 h-5 text-gray-700" />
        <span className="text-sm" style={{ fontWeight: 600 }}>Messages</span>
      </Link>

      {/* Espace client */}
      <Link
        href={ROUTES.CLIENT_SPACE}
        className="w-full px-8 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
        onClick={onClose}
      >
        <User className="w-5 h-5 text-gray-700" />
        <span className="text-sm" style={{ fontWeight: 600 }}>Espace client</span>
      </Link>

      {/* Divider */}
      <div className="w-[240px] h-px bg-gray-200 my-2 mx-auto"></div>


      {/* Langues et devise */}
      <button className="w-full px-8 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left" onClick={onLanguageClick}>
        <Globe className="w-5 h-5 text-gray-700" />
        <span className="text-sm">Langues et devise</span>
      </button>

      {/* Centre d'aide */}
      <button className="w-full px-8 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left">
        <HelpCircle className="w-5 h-5 text-gray-700" />
        <span className="text-sm">Centre d'aide</span>
      </button>

      {/* Divider */}
      <div className="w-[240px] h-px bg-gray-200 my-2 mx-auto"></div>

      {/* Devenir hôte / Gérer mes annonces */}
      {isHost ? (
        <Link
          href={ROUTES.ANNONCES}
          className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left block"
          onClick={onClose}
        >
          <div className="flex items-start justify-between gap-3 px-4">
            <div className="flex-1">
              <div className="text-sm mb-1" style={{ fontWeight: 600 }}>
                Gérer mes annonces
              </div>
              <div className="text-xs text-gray-600 leading-relaxed">
                Accédez à votre espace hôte pour gérer vos annonces.
              </div>
            </div>
            <img
              src={hostIllustration}
              alt="Illustration hôte"
              className="w-12 h-12 object-contain flex-shrink-0"
            />
          </div>
        </Link>
      ) : (
        <button
          className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left"
          onClick={onBecomeHostClick}
        >
          <div className="flex items-start justify-between gap-3 px-4">
            <div className="flex-1">
              <div className="text-sm mb-1" style={{ fontWeight: 600 }}>
                Devenir hôte
              </div>
              <div className="text-xs text-gray-600 leading-relaxed">
                Devenir hôte et gagner des revenus supplémentaires, c'est facile.
              </div>
            </div>
            <img
              src={hostIllustration}
              alt="Illustration hôte"
              className="w-12 h-12 object-contain flex-shrink-0"
            />
          </div>
        </button>
      )}

      {/* Divider */}
      <div className="w-[240px] h-px bg-gray-200 my-2 mx-auto"></div>

      {/* Déconnexion */}
      <button
        className="w-full px-8 py-3 hover:bg-gray-50 transition-colors text-left"
        onClick={handleLogout}
      >
        <span className="text-sm">Déconnexion</span>
      </button>
      </div>
    </div>
  );
}