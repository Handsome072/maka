import { PropertyDetailsClient } from './PropertyDetailsClient';

/**
 * Generate static params for property pages
 * These IDs correspond to the mock properties in the application
 */
export function generateStaticParams() {
  // Generate IDs for mock properties (1-10)
  return Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
  }));
}

/**
 * Page Property Details Next.js
 * Réutilise le composant PropertyDetails existant
 */
export default function PropertyDetailsPage() {
  return <PropertyDetailsClient />;
}

