/**
 * Configuration centralisée des routes de navigation
 * Utilisé pour garantir la cohérence de la navigation dans toute l'application
 */

export const ROUTES = {
  // Pages principales
  HOME: '/',
  EXPERIENCES: '/experiences',
  SERVICES: '/services',

  // Pages utilisateur
  MESSAGES: '/messages',
  CLIENT_SPACE: '/client-space',
  CLIENT_SPACE_MESSAGES: '/client-space/messages',
  CLIENT_SPACE_RESERVATIONS: '/client-space/reservations',
  CLIENT_SPACE_PROFILE: '/client-space/profile',
  CLIENT_SPACE_PAYMENTS: '/client-space/payments',
  CLIENT_SPACE_SECURITY: '/client-space/security',
  CLIENT_SPACE_NOTIFICATIONS: '/client-space/notifications',
  CLIENT_SPACE_LANGUAGES: '/client-space/languages',

  // Pages hôte
  HOST_ONBOARDING: '/host-onboarding',
  HOST_DASHBOARD: '/annonces',
  HOST_RESERVATIONS: '/annonces/reservations',
  HOST_CALENDAR: '/annonces/calendar',
  HOST_REVENUES: '/annonces/revenues',
  HOST_INBOX: '/annonces/inbox',
  HOST_SETTINGS: '/annonces/settings',
  HOST_PROFILE: '/annonces/profile',
  ANNONCES: '/annonces',
  EXPERIENCE_ONBOARDING: '/experience-onboarding',

  // Pages détails (dynamiques)
  PROPERTY: (id: string = '1') => `/property/${id}`,
  EXPERIENCE: (id: string = '1') => `/experience/${id}`,
  SERVICE: (id: string = '1') => `/service/${id}`,

  // Pages de réservation
  BOOKING: '/booking',
  SEARCH: '/search',

  // Vérifications
  IDENTITY_VERIFICATION: '/identity-verification',
  PHONE_VERIFICATION: '/phone-verification',

  // Authentification
  LOGIN: '/login',

  // Pages légales
  PRIVACY: '/privacy',
  TERMS: '/terms',
  HOW_IT_WORKS: '/how-it-works',
  COMPANY_INFO: '/company-info',

  // Pages Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_CLIENT_PROFILE: (id: string = '1') => `/admin/clients/${id}`,
  ADMIN_HOSTS: '/admin/hosts',
  ADMIN_HOST_PROFILE: (id: string = '1') => `/admin/hosts/${id}`,
  ADMIN_PROPERTIES: '/admin/properties',
  ADMIN_PROPERTY_DETAIL: (id: string = '1') => `/admin/properties/${id}`,
  ADMIN_RESERVATIONS: '/admin/reservations',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_PAYMENT_DETAIL: (id: string = 'PAY-10001') => `/admin/payments/${id}`,
  ADMIN_REFUNDS: '/admin/refunds',
  ADMIN_REFUND_DETAIL: (id: string = 'REM-001') => `/admin/refunds/${id}`,
  ADMIN_DISPUTES: '/admin/disputes',
  ADMIN_FRAUD: '/admin/fraud',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_CMS: '/admin/cms',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_COMMISSIONS: '/admin/commissions',
  ADMIN_SECURITY: '/admin/security',
  ADMIN_TEAMS: '/admin/teams',
  ADMIN_SUPPORT: '/admin/support',
} as const;

/**
 * Mapping des pages principales pour la navigation du header
 */
export type MainPage = 'logements' | 'experiences' | 'services';

export const MAIN_PAGE_ROUTES: Record<MainPage, string> = {
  logements: ROUTES.HOME,
  experiences: ROUTES.EXPERIENCES,
  services: ROUTES.SERVICES,
};

/**
 * Items de navigation pour le header
 */
export const NAV_ITEMS = [
  { key: 'logements' as const, label: 'Logements', path: ROUTES.HOME },
  { key: 'experiences' as const, label: 'Expériences', path: ROUTES.EXPERIENCES, badge: 'NOUVEAU' },
  { key: 'services' as const, label: 'Services', path: ROUTES.SERVICES, badge: 'NOUVEAU' },
];

/**
 * Helper pour déterminer la page courante à partir du pathname
 */
export function getCurrentPageFromPathname(pathname: string | null): MainPage {
  if (pathname?.startsWith('/experiences')) return 'experiences';
  if (pathname?.startsWith('/services')) return 'services';
  return 'logements';
}

/**
 * Helper pour obtenir le path de navigation pour une page
 */
export function getNavigationPath(
  page: 'logements' | 'experiences' | 'services' | 'messages' | 'host-onboarding' | 'annonces' | 'client-space' | 'client-space-profile' | 'experience-onboarding' | 'login' | 'host-dashboard' | 'host-reservations' | 'host-calendar' | 'host-revenues'
): string {
  switch (page) {
    case 'logements':
      return ROUTES.HOME;
    case 'experiences':
      return ROUTES.EXPERIENCES;
    case 'services':
      return ROUTES.SERVICES;
    case 'messages':
      return ROUTES.CLIENT_SPACE_MESSAGES;
    case 'host-onboarding':
      return ROUTES.HOST_ONBOARDING;
    case 'host-dashboard':
      return ROUTES.HOST_DASHBOARD;
    case 'host-reservations':
      return ROUTES.HOST_RESERVATIONS;
    case 'host-calendar':
      return ROUTES.HOST_CALENDAR;
    case 'annonces':
      return ROUTES.ANNONCES;
    case 'host-revenues':
      return ROUTES.HOST_REVENUES;
    case 'client-space':
      return ROUTES.CLIENT_SPACE;
    case 'client-space-profile':
      return ROUTES.CLIENT_SPACE_PROFILE;
    case 'experience-onboarding':
      return ROUTES.EXPERIENCE_ONBOARDING;
    case 'login':
      return ROUTES.LOGIN;
    default:
      return ROUTES.HOME;
  }
}

