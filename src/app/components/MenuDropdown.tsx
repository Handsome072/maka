import { HelpCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import hostIllustration from '@/assets/38ec71431adff7f609dab055e5554ab5c0ee6be7.png';

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthClick?: () => void;
}

export function MenuDropdown({ isOpen, onClose, onAuthClick }: MenuDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl w-60 py-2 z-50 "
      style={{ minWidth: '300px' }}
    >
      {/* Centre d'aide */}
      <button className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left">
        <HelpCircle className="w-5 h-5 text-gray-700 ml-4" />
        <span className="text-sm">Centre d'aide</span>
      </button>
      {/* Divider */}
      <div className="w-[240px] h-px bg-gray-200 my-2 mx-auto"></div>

      {/* Devenir hôte avec illustration */}
      <button className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left">
        <div className="flex items-start justify-between gap-3  px-4">
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
         {/* Divider */}
      <div className="w-[240px] h-px bg-gray-200 my-2 mx-auto"></div>
      {/* Parrainer un hôte */}
      <button className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left">
        <span className="text-sm px-4">Parrainer un hôte</span>
      </button>

      {/* Trouver un co-hôte */}
      <button className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left">
        <span className="text-sm px-4">Trouver un co-hôte</span>
      </button>

      {/* Cartes cadeaux */}
      <button className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left">
        <span className="text-sm px-4">Cartes cadeaux</span>
      </button>

          {/* Divider */}
      <div className="w-[240px] h-px bg-gray-200 my-2 mx-auto"></div>

      {/* Se connecter ou s'inscrire */}
      <button 
        className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left"
        onClick={onAuthClick}
      >
        <span className="text-sm px-4">Se connecter ou s'inscrire</span>
      </button>
    </div>
  );
}