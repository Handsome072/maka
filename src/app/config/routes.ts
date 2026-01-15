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
  CLIENT_SPACE_RESERVATIONS: '/client-space/reservations',
  CLIENT_SPACE_PROFILE: '/client-space/profile',
  CLIENT_SPACE_PAYMENTS: '/client-space/payments',
  CLIENT_SPACE_SECURITY: '/client-space/security',
  CLIENT_SPACE_NOTIFICATIONS: '/client-space/notifications',
  CLIENT_SPACE_LANGUAGES: '/client-space/languages',
  
  // Pages hôte
  HOST_ONBOARDING: '/host-onboarding',
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
  
  // Pages légales
  PRIVACY: '/privacy',
  TERMS: '/terms',
  HOW_IT_WORKS: '/how-it-works',
  COMPANY_INFO: '/company-info',
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
  page: 'logements' | 'experiences' | 'services' | 'messages' | 'host-onboarding' | 'annonces' | 'client-space' | 'experience-onboarding'
): string {
  switch (page) {
    case 'logements':
      return ROUTES.HOME;
    case 'experiences':
      return ROUTES.EXPERIENCES;
    case 'services':
      return ROUTES.SERVICES;
    case 'messages':
      return ROUTES.MESSAGES;
    case 'host-onboarding':
      return ROUTES.HOST_ONBOARDING;
    case 'annonces':
      return ROUTES.ANNONCES;
    case 'client-space':
      return ROUTES.CLIENT_SPACE;
    case 'experience-onboarding':
      return ROUTES.EXPERIENCE_ONBOARDING;
    default:
      return ROUTES.HOME;
  }
}

