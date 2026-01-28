'use client';

import { Users, Home, DollarSign, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '../config/routes';

export function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      category: 'PRINCIPAL',
      items: [
        { id: 'admin-dashboard', label: 'Dashboard général', icon: Home, href: ROUTES.ADMIN_DASHBOARD }
      ]
    },
    {
      category: 'GESTION',
      items: [
        { id: 'admin-clients', label: 'Gestion des clients', icon: Users, href: ROUTES.ADMIN_CLIENTS },
        { id: 'admin-hosts', label: 'Gestion des hôtes', icon: Home, href: ROUTES.ADMIN_HOSTS },
        { id: 'admin-properties', label: 'Gestion des logements', icon: Home, href: ROUTES.ADMIN_PROPERTIES },
        { id: 'admin-reservations', label: 'Gestion des réservations', icon: DollarSign, href: ROUTES.ADMIN_RESERVATIONS },
        { id: 'admin-payments', label: 'Gestion des paiements', icon: DollarSign, href: ROUTES.ADMIN_PAYMENTS },
        { id: 'admin-refunds', label: 'Gestion des remboursements', icon: Home, href: ROUTES.ADMIN_REFUNDS },
        { id: 'admin-disputes', label: 'Gestion des litiges', icon: Home, href: ROUTES.ADMIN_DISPUTES },
        { id: 'admin-fraud', label: 'Gestion de la fraude', icon: 'alert', href: ROUTES.ADMIN_FRAUD },
        { id: 'admin-reviews', label: 'Modération des avis', icon: Home, href: ROUTES.ADMIN_REVIEWS },
      ]
    },
    {
      category: 'CONFIGURATION',
      items: [
        { id: 'admin-cms', label: 'Gestion des pages (CMS)', icon: 'settings', href: ROUTES.ADMIN_CMS },
        { id: 'admin-notifications', label: 'Gestion des notifications', icon: 'bell', href: ROUTES.ADMIN_NOTIFICATIONS },
        { id: 'admin-commissions', label: 'Configuration des commissions', icon: 'percent', href: ROUTES.ADMIN_COMMISSIONS },
        { id: 'admin-security', label: 'Logs et sécurité', icon: 'lock', href: ROUTES.ADMIN_SECURITY },
        { id: 'admin-teams', label: 'Gestion des équipes', icon: Users, href: ROUTES.ADMIN_TEAMS },
      ]
    },
  ];

  const renderIcon = (icon: any) => {
    if (typeof icon === 'string') {
      switch (icon) {
        case 'alert':
          return (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          );
        case 'settings':
          return (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          );
        case 'bell':
          return (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          );
        case 'percent':
          return (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          );
        case 'lock':
          return (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          );
        default:
          return null;
      }
    }
    const IconComponent = icon;
    return <IconComponent className="w-5 h-5" />;
  };

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/admin') {
      return pathname === '/admin' || pathname === '/admin/';
    }
    return pathname === href || pathname.startsWith(href + '/') || pathname === href + '/';
  };

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#5EC6D8] rounded-lg flex items-center justify-center text-white shadow-lg"
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
            <div className="w-8 h-8 bg-[#5EC6D8] rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg" style={{ fontWeight: 600 }}>Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((section, idx) => (
            <div key={idx} className="px-4 mb-4">
              <p className="text-xs mb-2" style={{ color: '#6B7280', fontWeight: 600 }}>{section.category}</p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${isActive(item.href)
                        ? 'bg-[#5EC6D8]/10 text-[#5EC6D8]'
                        : 'hover:bg-gray-100 text-gray-700'
                      }`}
                  >
                    {renderIcon(item.icon)}
                    <span className="text-sm flex-1 break-words" style={{ fontWeight: 500 }}>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5EC6D8] rounded-full flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
              HA
            </div>
            <div>
              <div className="text-sm" style={{ fontWeight: 600 }}>HOMIQIO Admin</div>
              <div className="text-xs text-gray-500">admin@homiqio.com</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
