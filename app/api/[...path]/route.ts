import type { NextRequest } from 'next/server';
import { json } from '@/server/http';

export const dynamic = 'force-dynamic';

/** Route inconnue : même réponse JSON que Laravel, au lieu de la page 404 HTML de Next.js. */
async function notFound(req: NextRequest): Promise<Response> {
  const path = req.nextUrl.pathname.replace(/^\/+|\/+$/g, '');
  return json({ message: `The route ${path} could not be found.` }, 404);
}

export const GET = notFound;
export const POST = notFound;
export const PUT = notFound;
export const PATCH = notFound;
export const DELETE = notFound;
