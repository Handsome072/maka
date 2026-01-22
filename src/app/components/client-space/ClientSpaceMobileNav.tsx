'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export function ClientSpaceMobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/client-space/reservations') {
      return pathname === '/client-space' || pathname === '/client-space/reservations' || pathname?.startsWith('/client-space/reservations/');
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around overflow-x-auto">
        {/* Mes réservations */}
        <Link
          href="/client-space/reservations"
          className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[60px] transition-colors ${
            isActive('/client-space/reservations') ? 'text-black' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/client-space/reservations') ? 2 : 1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="text-[10px] font-medium text-center leading-tight">Réservations</span>
        </Link>

        {/* Informations personnelles */}
        <Link
          href="/client-space/profile"
          className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[60px] transition-colors ${
            isActive('/client-space/profile') ? 'text-black' : 'text-gray-500'
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 ${
            isActive('/client-space/profile') ? 'bg-gray-900' : 'bg-gray-500'
          }`} style={{ fontWeight: 600 }}>
            {user?.name.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="text-[10px] font-medium text-center leading-tight">Profil</span>
        </Link>

        {/* Connexion et sécurité */}
        <Link
          href="/client-space/security"
          className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[60px] transition-colors ${
            isActive('/client-space/security') ? 'text-black' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/client-space/security') ? 2 : 1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[10px] font-medium text-center leading-tight">Sécurité</span>
        </Link>

        {/* Notifications */}
        <Link
          href="/client-space/notifications"
          className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[60px] transition-colors ${
            isActive('/client-space/notifications') ? 'text-black' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/client-space/notifications') ? 2 : 1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="text-[10px] font-medium text-center leading-tight">Notifications</span>
        </Link>

        {/* Paiements */}
        <Link
          href="/client-space/payments"
          className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[60px] transition-colors ${
            isActive('/client-space/payments') ? 'text-black' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/client-space/payments') ? 2 : 1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-[10px] font-medium text-center leading-tight">Paiements</span>
        </Link>

        {/* Langues et devise */}
        <Link
          href="/client-space/languages"
          className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[60px] transition-colors ${
            isActive('/client-space/languages') ? 'text-black' : 'text-gray-500'
          }`}
        >
          <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/client-space/languages') ? 2 : 1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-medium text-center leading-tight">Langues</span>
        </Link>
      </div>
    </nav>
  );
}

