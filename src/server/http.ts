import { NextResponse, type NextRequest } from 'next/server';

/** Erreur HTTP renvoyée telle quelle en JSON (équivalent d'abort() / response()->json() de Laravel). */
export class HttpError extends Error {
  constructor(
    public status: number,
    public body: Record<string, unknown>,
  ) {
    super(typeof body.message === 'string' ? body.message : `HTTP ${status}`);
  }
}

export function json(data: unknown, status = 200, headers?: HeadersInit): NextResponse {
  return NextResponse.json(data, { status, headers });
}

export function abort(status: number, message: string): never {
  throw new HttpError(status, { message });
}

/** Même message que ModelNotFoundException (findOrFail) de Laravel. */
export function notFound(model: string, id?: string | number): never {
  const suffix = id === undefined ? '.' : ` ${id}`;
  throw new HttpError(404, { message: `No query results for model [App\\Models\\${model}]${suffix}` });
}

/**
 * Enveloppe une route : paramètres dynamiques résolus, HttpError convertie en réponse JSON,
 * toute autre erreur journalisée et renvoyée en 500 comme Laravel en production.
 */
export function route<P extends Record<string, string> = Record<string, string>>(
  handler: (req: NextRequest, params: P) => Promise<Response>,
) {
  return async (req: NextRequest, context: { params: Promise<P> }): Promise<Response> => {
    try {
      const params = ((await context?.params) ?? {}) as P;
      return await handler(req, params);
    } catch (error) {
      if (error instanceof HttpError) {
        return json(error.body, error.status);
      }
      console.error(`[api] ${req.method} ${req.nextUrl.pathname}`, error);
      return json({ message: 'Server Error' }, 500);
    }
  };
}

/** Identifiant numérique d'une route (Laravel typait `int $id`). */
export function intParam(value: string | undefined, model: string): number {
  if (!value || !/^\d+$/.test(value)) {
    notFound(model, value);
  }
  return Number(value);
}

// Laravel ne supprime pas les espaces de ces champs (middleware TrimStrings)
const UNTRIMMED_KEYS = new Set(['current_password', 'password', 'password_confirmation']);

/** Reproduit les middlewares globaux TrimStrings et ConvertEmptyStringsToNull. */
function normalize(value: unknown, key?: string): unknown {
  if (typeof value === 'string') {
    const trimmed = key !== undefined && UNTRIMMED_KEYS.has(key) ? value : value.trim();
    return trimmed === '' ? null : trimmed;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalize(item));
  }
  if (value && typeof value === 'object' && !(value instanceof Blob)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalize(v, k)]));
  }
  return value;
}

const inputCache = new WeakMap<Request, Promise<Record<string, any>>>();

/**
 * Équivalent de $request->input() : corps (JSON, formulaire ou multipart) fusionné par-dessus la query string.
 * Le corps n'est lu qu'une fois par requête.
 */
export function input(req: NextRequest): Promise<Record<string, any>> {
  let cached = inputCache.get(req);
  if (!cached) {
    cached = readInput(req);
    inputCache.set(req, cached);
  }
  return cached;
}

async function readInput(req: NextRequest): Promise<Record<string, any>> {
  const query: Record<string, unknown> = Object.fromEntries(req.nextUrl.searchParams.entries());
  let body: Record<string, unknown> = {};
  const contentType = req.headers.get('content-type') ?? '';

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const form = await req.formData();
      for (const [key, value] of form.entries()) {
        body[key] = value;
      }
    } else {
      const text = await req.text();
      if (text) {
        try {
          const parsed = JSON.parse(text);
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            body = parsed;
          }
        } catch {
          body = {};
        }
      }
    }
  }

  return normalize({ ...query, ...body }) as Record<string, any>;
}

/** $request->filled() */
export function filled(value: unknown): boolean {
  if (typeof value === 'boolean' || Array.isArray(value)) {
    return true;
  }
  return value !== null && value !== undefined && String(value).trim() !== '';
}

/** $request->boolean() (FILTER_VALIDATE_BOOLEAN) */
export function toBoolean(value: unknown, fallback = false): boolean {
  if (value === undefined || value === null) {
    return fallback;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  return ['1', 'true', 'on', 'yes'].includes(String(value).toLowerCase());
}
