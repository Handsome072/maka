import { PropertyDetailsClient } from './PropertyDetailsClient';

/**
 * Generate static params for property pages.
 * With output: 'export', we pre-generate pages for a range of IDs.
 * Actual data is fetched client-side via API.
 */
export function generateStaticParams() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: String(i + 1),
  }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;
  return <PropertyDetailsClient id={id} />;
}
