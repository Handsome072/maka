'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ClientSpaceSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/client-space' && (pathname === '/client-space' || pathname === '/client-space/reservations')) {
      return true;
    }
    return pathname?.startsWith(path) && path !== '/client-space';
  };

  const getLinkClass = (path: string) => {
    // Special case for reservations which is default
    const active = path === '/client-space/reservations' 
      ? (pathname === '/client-space' || pathname === '/client-space/reservations')
      : pathname?.startsWith(path);
      
    return `w-full flex items-center gap-4 text-left transition-colors ${
      active ? '' : 'opacity-60 hover:opacity-100'
    }`;
  };

  const getTextStyle = (path: string) => {
    const active = path === '/client-space/reservations' 
      ? (pathname === '/client-space' || pathname === '/client-space/reservations')
      : pathname?.startsWith(path);

    return { fontWeight: active ? 600 : 400, color: '#222222' };
  };

  return (
    <aside className="w-full md:w-[380px] border-r border-gray-200 min-h-[calc(100vh-73px)] flex flex-col bg-white">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-lg md:text-2xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
          Espace client
        </h1>

        <nav className="space-y-5">
          <Link
            href="/client-space/reservations"
            className={getLinkClass('/client-space/reservations')}
          >
            <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-sm" style={getTextStyle('/client-space/reservations')}>
              Mes réservations
            </span>
          </Link>

          <Link
            href="/client-space/profile"
            className={getLinkClass('/client-space/profile')}
          >
            <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm" style={getTextStyle('/client-space/profile')}>
              Informations personnelles
            </span>
          </Link>

          <Link
            href="/client-space/security"
            className={getLinkClass('/client-space/security')}
          >
            <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm" style={getTextStyle('/client-space/security')}>
              Connexion et sécurité
            </span>
          </Link>

          <Link
            href="/client-space/notifications"
            className={getLinkClass('/client-space/notifications')}
          >
            <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-sm" style={getTextStyle('/client-space/notifications')}>
              Notifications
            </span>
          </Link>

          <Link
            href="/client-space/payments"
            className={getLinkClass('/client-space/payments')}
          >
            <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-sm" style={getTextStyle('/client-space/payments')}>
              Paiements
            </span>
          </Link>

          <Link
            href="/client-space/languages"
            className={getLinkClass('/client-space/languages')}
          >
            <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm" style={getTextStyle('/client-space/languages')}>
              Langues et devise
            </span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}

