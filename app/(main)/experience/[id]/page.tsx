import { ExperienceDetailsClient } from './ExperienceDetailsClient';

/**
 * Generate static params for experience pages
 * These IDs correspond to the mock experiences in the application
 */
export function generateStaticParams() {
  // Generate IDs for mock experiences (1-10)
  return Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
  }));
}

/**
 * Page Experience Details Next.js
 * Réutilise le composant ExperienceDetails existant
 */
export default function ExperienceDetailsPage() {
  return <ExperienceDetailsClient />;
}

