import { ReservationDetailClient } from './ReservationDetailClient';

/**
 * Aucune page générée au build : chaque réservation est rendue à sa première visite puis mise en cache.
 * Le HTML est le même pour tous (les données sont chargées dans le navigateur), rien de personnel n'est mis en cache.
 */
export function generateStaticParams() {
  return [];
}

/**
 * Page Détail de réservation
 */
export default function ReservationDetailPage() {
  return <ReservationDetailClient />;
}
