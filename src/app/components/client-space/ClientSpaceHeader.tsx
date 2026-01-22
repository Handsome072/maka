'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/app/components/Logo';
import { HeaderRightMenu } from '@/app/components/HeaderRightMenu';
import { LanguageModal } from '@/app/components/LanguageModal';
import { BecomeHostModal } from '@/app/components/BecomeHostModal';
import { getNavigationPath } from '@/app/config/routes';

export function ClientSpaceHeader() {
  const router = useRouter();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  const handleNavigate = (page: 'logements' | 'messages' | 'annonces' | 'host-onboarding' | 'experiences' | 'services') => {
      const path = getNavigationPath(page);
      router.push(path);
  };

  return (
    <>
      <header className="h-[73px] border-b border-gray-200 bg-white sticky top-0 z-40 hidden md:block">
        <div className="h-full px-4 md:px-12 flex items-center justify-between max-w-[1920px] mx-auto">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push('/')}>
             <Logo />
          </div>

          {/* Right Menu */}
          <div className="flex-shrink-0">
             <HeaderRightMenu
                isHost={false}
                showMenuDropdown={showMenuDropdown}
                setShowMenuDropdown={setShowMenuDropdown}
                onNavigate={handleNavigate}
                onLanguageClick={() => setShowLanguageModal(true)}
                onHostClick={() => setShowBecomeHostModal(true)}
                onHelpClick={() => router.push('/help-center')}
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
            }
            setShowBecomeHostModal(false);
          }}
        />
      )}
    </>
  );
}

