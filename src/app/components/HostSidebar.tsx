'use client';

import { Home, CalendarDays, MessageSquare, DollarSign, Menu, X, LogOut, Settings, ChevronUp, User, Megaphone } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '../config/routes';
import { useAuth } from '../context/AuthContext';

type HostPage = 'host-dashboard' | 'host-reservations' | 'host-calendar' | 'annonces' | 'messages' | 'host-revenues';

interface HostSidebarProps {
  activePage?: HostPage;
}

export function HostSidebar({ activePage }: HostSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const menuItems = [
    {
      category: 'PRINCIPAL',
      items: [
        { id: 'host-dashboard', label: "Aujourd'hui", icon: Home, href: ROUTES.HOST_DASHBOARD },
      ]
    },
    {
      category: 'GESTION',
      items: [
        { id: 'host-reservations', label: 'Réservations', icon: CalendarDays, href: ROUTES.HOST_RESERVATIONS },
        { id: 'host-calendar', label: 'Calendrier', icon: CalendarDays, href: ROUTES.HOST_CALENDAR },
        { id: 'annonces', label: 'Annonces', icon: Megaphone, href: ROUTES.ANNONCES },
        { id: 'messages', label: 'Boîte de réception', icon: MessageSquare, href: ROUTES.HOST_INBOX },
      ]
    },
    {
      category: 'FINANCES',
      items: [
        { id: 'host-revenues', label: 'Revenus', icon: DollarSign, href: ROUTES.HOST_REVENUES },
      ]
    },
  ];

  const isActive = (itemId: string, href: string) => {
    if (activePage) return itemId === activePage;
    if (!pathname) return false;
    if (href === ROUTES.ANNONCES || href === ROUTES.HOST_DASHBOARD) {
      return pathname === href || pathname === href + '/';
    }
    return pathname === href || pathname.startsWith(href + '/') || pathname === href + '/';
  };

  const userName = user?.name || 'Hôte';
  const userEmail = user?.email || '';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-[280px] bg-white border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logoIcon.png" alt="HOMIQIO" className="w-8 h-8 object-contain" />
            <span className="text-lg" style={{ fontWeight: 600 }}>Mode hôte</span>
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((section, idx) => (
            <div key={idx} className="px-4 mb-4">
              <p className="text-xs mb-2" style={{ color: '#6B7280', fontWeight: 600 }}>{section.category}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.id, item.href);
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${active
                          ? 'bg-gray-100 text-gray-900'
                          : 'hover:bg-gray-100 text-gray-700'
                        }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-sm flex-1 break-words" style={{ fontWeight: active ? 600 : 500 }}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Passer en mode voyageur */}
        <div className="px-4 pb-2">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-sm" style={{ fontWeight: 500 }}>Passer en mode voyageur</span>
          </Link>
        </div>

        {/* User section */}
        <div className="relative border-t border-gray-200" ref={userMenuRef}>
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 mx-3 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              <Link
                href={ROUTES.HOST_SETTINGS}
                onClick={() => { setShowUserMenu(false); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700"
                style={{ fontWeight: 500 }}
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Paramètres
              </Link>
              <Link
                href={ROUTES.HOST_PROFILE}
                onClick={() => { setShowUserMenu(false); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-sm text-gray-700 border-t border-gray-100"
                style={{ fontWeight: 500 }}
              >
                <User className="w-4 h-4 text-gray-400" />
                Profil
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-sm text-red-600 border-t border-gray-100"
                style={{ fontWeight: 500 }}
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          )}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0" style={{ fontWeight: 600 }}>
              {userInitial}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm truncate" style={{ fontWeight: 600 }}>{userName}</div>
              {userEmail && <div className="text-xs text-gray-500 truncate">{userEmail}</div>}
            </div>
            <ChevronUp className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${showUserMenu ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </aside>
    </>
  );
}
