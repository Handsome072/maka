'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { HeaderRightMenu } from './HeaderRightMenu';
import { LanguageModal } from './LanguageModal';
import { BecomeHostModal } from './BecomeHostModal';
import { AuthModal } from './AuthModal';

export function LegalHeader() {
  const router = useRouter();
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Handle navigation - same logic as main Header
  const handleNavigate = (page: 'host-onboarding' | 'experience-onboarding') => {
    if (page === 'host-onboarding') {
      router.push('/host-onboarding');
    } else if (page === 'experience-onboarding') {
      router.push('/experience-onboarding');
    }
  };

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

            {/* Right Menu - Using shared HeaderRightMenu component */}
            <HeaderRightMenu
              showMenuDropdown={showMenuDropdown}
              setShowMenuDropdown={setShowMenuDropdown}
              setShowLanguageModal={setShowLanguageModal}
              setShowBecomeHostModal={setShowBecomeHostModal}
              setShowAuthModal={setShowAuthModal}
            />
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
          onSelectOption={(option) => {
            if (option === 'logement') {
              handleNavigate('host-onboarding');
            } else if (option === 'experience') {
              handleNavigate('experience-onboarding');
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

