'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { ReactNode } from 'react';

// Logo path
const logo = '/logo.png';

interface ClientSpaceLayoutProps {
  children: ReactNode;
}

export default function ClientSpaceLayout({ children }: ClientSpaceLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  // Determine active section from URL
  const getActiveSection = () => {
    if (pathname.includes('/client-space/security')) return 'security';
    if (pathname.includes('/client-space/profile')) return 'profile';
    if (pathname.includes('/client-space/notifications')) return 'notifications';
    if (pathname.includes('/client-space/payments')) return 'payments';
    if (pathname.includes('/client-space/languages')) return 'languages';
    return 'reservations';
  };

  const activeSection = getActiveSection();

  const menuItems = [
    { key: 'profile', label: 'Informations personnelles', path: '/client-space/profile', icon: 'user' },
    { key: 'security', label: 'Connexion et sécurité', path: '/client-space/security', icon: 'lock' },
    { key: 'reservations', label: 'Mes réservations', path: '/client-space/reservations', icon: 'clipboard' },
    { key: 'notifications', label: 'Notifications', path: '/client-space/notifications', icon: 'bell' },
    { key: 'payments', label: 'Paiements', path: '/client-space/payments', icon: 'card' },
    { key: 'languages', label: 'Langues et devise', path: '/client-space/languages', icon: 'globe' },
  ];

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'user':
        return (
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-base flex-shrink-0 font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        );
      case 'lock':
        return (
          <svg className="w-9 h-9 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'clipboard':
        return (
          <svg className="w-9 h-9 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'bell':
        return (
          <svg className="w-9 h-9 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case 'card':
        return (
          <svg className="w-9 h-9 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'globe':
        return (
          <svg className="w-9 h-9 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <img 
            src={logo} 
            alt="HOMIQIO" 
            className="h-8 cursor-pointer" 
            onClick={() => router.push('/')}
          />
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/messages')} className="text-sm hover:underline">
              Messages
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4 px-2">Mon compte</h2>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.key 
                      ? 'bg-gray-100 font-medium' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {renderIcon(item.icon)}
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

