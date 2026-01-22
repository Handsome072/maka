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
      <header className="border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button
                onClick={() => router.push('/')}
                className="cursor-pointer"
              >
                <Logo className="h-10 md:h-12 w-auto" />
              </button>
            </div>

            <HeaderRightMenu
              showMenuDropdown={showMenuDropdown}
              setShowMenuDropdown={setShowMenuDropdown}
              setShowLanguageModal={setShowLanguageModal}
              setShowBecomeHostModal={setShowBecomeHostModal}
              onAuthClick={() => router.push('/login')}
              isHost={false}
              onAnnoncesClick={() => handleNavigate('annonces')}
              onMessagesClick={() => handleNavigate('messages')}
              onClientSpaceClick={() => {}} // Déjà sur l'espace client
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

