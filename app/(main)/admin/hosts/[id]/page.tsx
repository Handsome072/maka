import { AdminHostProfile } from '@/app/pages/AdminHostProfile';

export function generateStaticParams() {
  // Pre-generate pages for a range of host IDs to support static export
  // The AdminHostProfile component fetches data client-side via API
  return Array.from({ length: 500 }, (_, i) => ({ id: String(i + 1) }));
}

export default function AdminHostProfilePage() {
  return <AdminHostProfile />;
}
