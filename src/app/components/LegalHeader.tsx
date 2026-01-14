'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Globe, Menu, User } from 'lucide-react';
import { MenuDropdown } from './MenuDropdown';
import { LoggedInMenuDropdown } from './LoggedInMenuDropdown';
import { LanguageModal } from './LanguageModal';
import { BecomeHostModal } from './BecomeHostModal';
import { AuthModal } from './AuthModal';
import { useAuth } from '../context/AuthContext';

export function LegalHeader() {
  const { user } = useAuth();
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        <div className="px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Help Center icon with ? */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-8 h-8"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="14" stroke="#1E3A5F" strokeWidth="2" fill="none" />
                <text x="16" y="21" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1E3A5F">?</text>
              </svg>
              <span className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                Centre d'aide
              </span>
            </Link>

            {/* Search bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Rechercher des guides pratiq..."
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(94, 198, 216)' }}>
                  <Search className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                className="hidden md:block px-4 py-3 hover:bg-gray-100 rounded-full transition-all duration-200 text-sm"
                style={{ fontWeight: 600 }}
                onClick={() => setShowBecomeHostModal(true)}
              >
                Devenir hôte
              </button>

              {!user && (
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

                {/* Menu Dropdown */}
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
                  />
                ) : (
                  <MenuDropdown
                    isOpen={showMenuDropdown}
                    onClose={() => setShowMenuDropdown(false)}
                    onAuthClick={() => {
                      setShowMenuDropdown(false);
                      setShowAuthModal(true);
                    }}
                    onBecomeHostClick={() => {
                      setShowMenuDropdown(false);
                      setShowBecomeHostModal(true);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
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

