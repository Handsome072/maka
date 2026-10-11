import { BookingConfirmationClient } from './BookingConfirmationClient';

/**
 * Aucune page générée au build : chaque confirmation est rendue à sa première visite.
 * Le HTML est le même pour tous (la réservation est chargée dans le navigateur), rien de personnel n'est mis en cache.
 */
export function generateStaticParams() {
  return [];
}

/** Confirmation affichée juste après une réservation ou une demande de réservation. */
export default function BookingConfirmationPage() {
  return <BookingConfirmationClient />;
}
