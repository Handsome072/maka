import { PropertyDetailsClient } from './PropertyDetailsClient';

/**
 * Aucune page générée au build : chaque logement est rendu à sa première visite puis mis en cache.
 * Les données sont chargées dans le navigateur via l'API.
 */
export function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;
  return <PropertyDetailsClient id={id} />;
}
