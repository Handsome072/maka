'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/routes';
import { LanguageModal } from './LanguageModal';
import {
  CONTACT_EMAIL,
  HELP_CENTER_PATH,
  STAY_CATEGORIES,
  searchHref,
  useTopDestinations,
  type MainPage,
} from './HeaderNav';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  currentPage?: MainPage;
  isHost?: boolean;
  onHostClick: () => void;
  onAuthClick?: () => void;
}

type Panel = 'root' | 'stays' | 'contact';

const rowClass = 'flex w-full items-center justify-between py-3.5 text-left text-[17px] text-ink';

/** Menu plein écran du mobile, ouvert par le bouton ☰ du header. */
export function MobileMenu({ open, onClose, currentPage, isHost, onHostClick, onAuthClick }: MobileMenuProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [panel, setPanel] = useState<Panel>('root');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { destinations, loading } = useTopDestinations(open && panel === 'stays');
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Chaque ouverture repart du premier niveau ; la page derrière ne défile pas
  useEffect(() => {
    if (!open) return;
    setPanel('root');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const backButton = (label: string) => (
    <button
      type="button"
      onClick={() => setPanel('root')}
      className="flex items-center gap-1 -ml-1 mb-2 py-2 text-sm font-medium text-gray-500"
    >
      <ChevronLeft className="w-4 h-4" />
      {label}
    </button>
  );

  const link = (href: string, label: React.ReactNode, key?: string) => (
    <Link key={key} href={href} onClick={onClose} className={rowClass}>
      {label}
    </Link>
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-[#FCFCFC] animate-in fade-in slide-in-from-top-2 duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="h-14 px-4 flex items-center justify-between border-b border-black/[0.06] flex-shrink-0">
            <Link href={ROUTES.HOME} onClick={onClose}>
              <img src="/sejoura_logo.png" alt="Séjoura" className="w-[128px] h-auto" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer le menu"
              className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-ink hover:bg-black/[0.04]"
            >
              <X className="w-6 h-6" strokeWidth={1.75} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-4">
            {panel === 'root' && (
              <div className="divide-y divide-black/[0.06]">
                <button type="button" className={rowClass} onClick={() => setPanel('stays')}>
                  Séjours
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button type="button" className={rowClass} onClick={() => setPanel('contact')}>
                  Contactez-nous
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  type="button"
                  className={rowClass}
                  onClick={() => {
                    onClose();
                    onHostClick();
                  }}
                >
                  {isHost ? 'Mode hôte' : 'Devenir hôte'}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  type="button"
                  className={rowClass}
                  onClick={() => {
                    onClose();
                    setShowLanguageModal(true);
                  }}
                >
                  Langue et devise
                  <span className="text-sm text-gray-500">Français · €</span>
                </button>
              </div>
            )}

            {panel === 'stays' && (
              <div>
                {backButton('Séjours')}
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-400">Catégories</p>
                <div className="divide-y divide-black/[0.06]">
                  {STAY_CATEGORIES.map((category) =>
                    link(
                      category.href,
                      <span className={category.page === currentPage ? 'font-medium text-brand-deep' : ''}>
                        {category.label}
                      </span>,
                      category.page,
                    ),
                  )}
                </div>

                <p className="mt-6 text-xs font-medium uppercase tracking-wider text-gray-400">Destinations</p>
                {loading ? (
                  <p className="py-3.5 text-sm text-gray-500">Chargement des destinations…</p>
                ) : (
                  <div className="divide-y divide-black/[0.06]">
                    {destinations.map((destination) =>
                      link(
                        searchHref(destination.label),
                        <>
                          <span className="truncate">{destination.label}</span>
                          <span className="text-sm text-gray-400 tabular-nums">{destination.count}</span>
                        </>,
                        `${destination.kind}-${destination.label}`,
                      ),
                    )}
                  </div>
                )}

                <Link
                  href={searchHref()}
                  onClick={onClose}
                  className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink"
                >
                  Toutes nos annonces
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {panel === 'contact' && (
              <div>
                {backButton('Contactez-nous')}
                <div className="divide-y divide-black/[0.06]">
                  <button
                    type="button"
                    className={rowClass}
                    onClick={() => {
                      onClose();
                      onHostClick();
                    }}
                  >
                    {isHost ? 'Mode hôte' : 'Proposer mon logement'}
                  </button>
                  {link(HELP_CENTER_PATH, "Centre d'aide")}
                  {link(ROUTES.HOW_IT_WORKS, 'Comment ça marche')}
                  <a href={`mailto:${CONTACT_EMAIL}`} className={rowClass}>
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            )}
          </nav>

          {/* Compte */}
          <div className="flex-shrink-0 border-t border-black/[0.06] px-6 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-ink text-white text-sm font-semibold flex-shrink-0">
                  {user.profile_photo_url || user.avatar ? (
                    <img src={(user.profile_photo_url || user.avatar)!} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium text-ink truncate">{user.name}</p>
                  <Link href={ROUTES.CLIENT_SPACE} onClick={onClose} className="text-sm text-gray-500 underline underline-offset-2">
                    Mon espace
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="h-10 px-4 rounded-full border border-gray-300 text-sm font-medium text-ink"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onAuthClick) onAuthClick();
                  else router.push(ROUTES.LOGIN);
                }}
                className="w-full h-12 rounded-full border border-gray-300 bg-white text-[15px] font-medium text-ink"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      )}

      {showLanguageModal && (
        <LanguageModal isOpen={showLanguageModal} onClose={() => setShowLanguageModal(false)} />
      )}
    </>
  );
}
