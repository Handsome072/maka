import { AdminHostProfile } from '@/app/pages/AdminHostProfile';

/** Aucune page générée au build : rendue à la première visite puis mise en cache (données chargées dans le navigateur). */
export function generateStaticParams() {
  return [];
}

export default function AdminHostProfilePage() {
  return <AdminHostProfile />;
}
