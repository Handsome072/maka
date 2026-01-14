import { Heart, Globe, MessageSquare, User, Settings, HelpCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import hostIllustration from '@/assets/38ec71431adff7f609dab055e5554ab5c0ee6be7.png';
import { useAuth } from '../context/AuthContext';

interface LoggedInMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onBecomeHostClick?: () => void;
  onLanguageClick?: () => void;
  onClientSpaceClick?: () => void;
  onMessagesClick?: () => void;
}

export function LoggedInMenuDropdown({ isOpen, onClose, onBecomeHostClick, onLanguageClick, onClientSpaceClick, onMessagesClick }: LoggedInMenuDropdownProps) {
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
      className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl w-60 py-2 z-50"
      style={{ minWidth: '300px' }}
    >
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
      <button 
        className="w-full px-8 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
        onClick={() => {
          onMessagesClick?.();
          onClose();
        }}
      >
        <MessageSquare className="w-5 h-5 text-gray-700" />
        <span className="text-sm" style={{ fontWeight: 600 }}>Messages</span>
      </button>

      {/* Espace client */}
      <button 
        className="w-full px-8 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
        onClick={() => {
          onClientSpaceClick?.();
          onClose();
        }}
      >
        <User className="w-5 h-5 text-gray-700" />
        <span className="text-sm" style={{ fontWeight: 600 }}>Espace client</span>
      </button>

      {/* Divider */}
      <div className="w-[240px] h-px bg-gray-200 my-2 mx-auto"></div>

      {/* Paramètres du compte */}
      <button className="w-full px-8 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left">
        <Settings className="w-5 h-5 text-gray-700" />
        <span className="text-sm">Paramètres du compte</span>
      </button>

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

      {/* Devenir hôte avec illustration */}
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

      {/* Parrainer un hôte */}
      <button className="w-full px-8 py-3 hover:bg-gray-50 transition-colors text-left">
        <span className="text-sm">Parrainer un hôte</span>
      </button>

      {/* Trouver un co-hôte */}
      <button className="w-full px-8 py-3 hover:bg-gray-50 transition-colors text-left">
        <span className="text-sm">Trouver un co-hôte</span>
      </button>

      {/* Cartes cadeaux */}
      <button className="w-full px-8 py-3 hover:bg-gray-50 transition-colors text-left">
        <span className="text-sm">Cartes cadeaux</span>
      </button>

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
  );
}