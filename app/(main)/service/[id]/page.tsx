import { ServiceDetailsClient } from './ServiceDetailsClient';

/**
 * Generate static params for service pages
 * These IDs correspond to the mock services in the application
 */
export function generateStaticParams() {
  // Generate IDs for mock services (1-10)
  return Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
  }));
}

/**
 * Page Service Details Next.js
 * Réutilise le composant ServiceDetails existant
 */
export default function ServiceDetailsPage() {
  return <ServiceDetailsClient />;
}

