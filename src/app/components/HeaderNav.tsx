'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  AtSign,
  BookOpen,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  Plus,
  type LucideIcon,
} from 'lucide-react';
import { usePublicListings } from '../hooks/usePublicListings';
import { destinationSuggestions } from '@/shared/places';
import { ROUTES } from '../config/routes';

export type MainPage = 'logements' | 'experiences' | 'services';

/** Rubriques du site, regroupées dans le menu « Séjours ». */
export const STAY_CATEGORIES: { page: MainPage; label: string; description: string; href: string }[] = [
  { page: 'logements', label: 'Logements', description: 'Logements entiers et chambres privées', href: ROUTES.HOME },
  { page: 'experiences', label: 'Expériences', description: 'Activités avec des hôtes locaux', href: ROUTES.EXPERIENCES },
  { page: 'services', label: 'Services', description: 'Chefs privés, bien-être et plus', href: ROUTES.SERVICES },
];

export const CONTACT_EMAIL = 'contact@sejoura.com';
export const HELP_CENTER_PATH = '/help-center';

/** Résultats de recherche pour une destination ('' = toutes les annonces). */
export const searchHref = (destination = '') => `${ROUTES.SEARCH}?destination=${encodeURIComponent(destination)}`;

/** Destinations qui ont le plus d'annonces publiées, chargées seulement quand `enabled`. */
export function useTopDestinations(enabled: boolean, limit = 8) {
  const { listings, failed } = usePublicListings(enabled);
  const destinations = useMemo(() => destinationSuggestions(listings ?? []).slice(0, limit), [listings, limit]);
  return { destinations, loading: enabled && !listings && !failed };
}

type MenuId = 'stays' | 'contact';

const panelClass =
  'rounded-xl border border-black/[0.06] bg-white shadow-[0_18px_50px_-20px_rgba(17,24,39,0.3)]';

interface MenuRowProps {
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

function MenuRow({ icon: Icon, href, onClick, children }: MenuRowProps) {
  const className =
    'flex w-full items-center gap-3 px-5 py-3.5 text-left text-[15px] text-ink hover:bg-black/[0.03] transition-colors border-b border-black/[0.06] last:border-b-0';
  const content = (
    <>
      <Icon className="w-[18px] h-[18px] flex-shrink-0 text-gray-500" strokeWidth={1.75} />
      <span className="truncate">{children}</span>
    </>
  );
  if (!href) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }
  if (href.startsWith('mailto:')) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={className}>
      {content}
    </Link>
  );
}

interface HeaderNavMenusProps {
  currentPage?: MainPage;
  isHost?: boolean;
  onHostClick: () => void;
}

/** Menus « Séjours » et « Contactez-nous » du header (ordinateur et tablette). */
export function HeaderNavMenus({ currentPage, isHost, onHostClick }: HeaderNavMenusProps) {
  const [open, setOpen] = useState<MenuId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const { destinations, loading } = useTopDestinations(open === 'stays');

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const canHover = () => window.matchMedia('(hover: hover)').matches;
  const show = (menu: MenuId) => {
    window.clearTimeout(closeTimer.current);
    setOpen(menu);
  };
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 150);
  };
  const close = () => setOpen(null);

  const hoverHandlers = (menu: MenuId) => ({
    onMouseEnter: () => {
      if (canHover()) show(menu);
    },
    onMouseLeave: () => {
      if (canHover()) hideSoon();
    },
  });

  const trigger = (menu: MenuId, label: string) => (
    <button
      type="button"
      aria-expanded={open === menu}
      aria-controls={`header-menu-${menu}`}
      // Souris : le survol ouvre le menu et le clic le garde ouvert ; tactile : le clic ouvre ou ferme
      onClick={() => (canHover() ? show(menu) : setOpen(open === menu ? null : menu))}
      className={`flex items-center gap-1.5 h-10 px-3.5 rounded-full text-[15px] font-medium text-ink transition-colors ${
        open === menu ? 'bg-black/[0.04]' : 'hover:bg-black/[0.04]'
      }`}
    >
      {label}
      <ChevronDown
        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open === menu ? 'rotate-180' : ''}`}
      />
    </button>
  );

  return (
    <div ref={containerRef} className="relative flex items-center gap-1">
      {/* Séjours : panneau large, aligné sur la droite des deux menus */}
      <div {...hoverHandlers('stays')}>
        {trigger('stays', 'Séjours')}
        {open === 'stays' && (
          <div className="absolute right-0 top-full pt-3 z-50">
            <div
              id="header-menu-stays"
              className={`${panelClass} w-[600px] max-w-[calc(100vw-2rem)] p-6 grid grid-cols-[1.15fr_1fr] gap-x-8 gap-y-5`}
            >
              <section>
                <h3 className="flex items-center gap-2 text-sm font-medium text-ink mb-3">
                  <MapPin className="w-4 h-4 text-brand-deep" strokeWidth={1.75} />
                  Destinations
                </h3>
                {loading ? (
                  <div className="space-y-3 pt-1" aria-label="Chargement des destinations">
                    {[70, 55, 62, 48, 58].map((width) => (
                      <div key={width} className="h-3.5 rounded bg-gray-100 animate-pulse" style={{ width: `${width}%` }} />
                    ))}
                  </div>
                ) : destinations.length > 0 ? (
                  <ul>
                    {destinations.map((destination) => (
                      <li key={`${destination.kind}-${destination.label}`}>
                        <Link
                          href={searchHref(destination.label)}
                          onClick={close}
                          className="group flex items-baseline justify-between gap-3 py-1.5 text-[15px] text-ink/85 hover:text-ink"
                        >
                          <span className="truncate group-hover:underline underline-offset-4">{destination.label}</span>
                          <span className="text-xs text-gray-400 tabular-nums">{destination.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Aucune destination pour le moment.</p>
                )}
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-sm font-medium text-ink mb-3">
                  <LayoutGrid className="w-4 h-4 text-brand-deep" strokeWidth={1.75} />
                  Catégories
                </h3>
                <ul className="space-y-0.5">
                  {STAY_CATEGORIES.map((category) => {
                    const active = category.page === currentPage;
                    return (
                      <li key={category.page}>
                        <Link
                          href={category.href}
                          onClick={close}
                          aria-current={active ? 'page' : undefined}
                          className="block -mx-3 px-3 py-2 rounded-lg hover:bg-black/[0.03] transition-colors"
                        >
                          <span className={`block text-[15px] ${active ? 'font-medium text-brand-deep' : 'text-ink'}`}>
                            {category.label}
                          </span>
                          <span className="block text-[13px] text-gray-500">{category.description}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>

              <div className="col-span-2 border-t border-black/[0.06] pt-4">
                <Link
                  href={searchHref()}
                  onClick={close}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-brand-deep transition-colors"
                >
                  Toutes nos annonces
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contactez-nous */}
      <div className="relative" {...hoverHandlers('contact')}>
        {trigger('contact', 'Contactez-nous')}
        {open === 'contact' && (
          <div className="absolute right-0 top-full pt-3 z-50">
            <div id="header-menu-contact" className={`${panelClass} w-[290px] overflow-hidden`}>
              <MenuRow
                icon={isHost ? LayoutDashboard : Plus}
                onClick={() => {
                  close();
                  onHostClick();
                }}
              >
                {isHost ? 'Mode hôte' : 'Proposer mon logement'}
              </MenuRow>
              <MenuRow icon={CircleHelp} href={HELP_CENTER_PATH} onClick={close}>
                Centre d'aide
              </MenuRow>
              <MenuRow icon={BookOpen} href={ROUTES.HOW_IT_WORKS} onClick={close}>
                Comment ça marche
              </MenuRow>
              <MenuRow icon={AtSign} href={`mailto:${CONTACT_EMAIL}`} onClick={close}>
                {CONTACT_EMAIL}
              </MenuRow>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
