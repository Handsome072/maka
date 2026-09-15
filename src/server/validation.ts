import { HttpError } from './http';
import { db } from './supabase';
import { todayUtc } from './format';
import { IMAGE_MIME_TYPES } from './storage';

/**
 * Validation au format Laravel ($request->validate()) : mêmes règles, mêmes messages (locale en)
 * et même réponse 422 { message, errors }.
 *
 * Règles prises en charge : required, sometimes, nullable, string, email, integer, numeric, boolean,
 * array, date, image, confirmed, min:N, max:N, before:today, after_or_equal:today, after:<champ>,
 * exists:table,colonne, unique:table,colonne[,idIgnoré], in:a,b
 */

type Rules = Record<string, string | string[]>;
type Data = Record<string, any>;

const MISSING = Symbol('missing');

function getPath(data: Data, path: string): unknown {
  let current: any = data;
  for (const segment of path.split('.')) {
    if (current === null || typeof current !== 'object' || !(segment in current)) {
      return MISSING;
    }
    current = current[segment];
  }
  return current;
}

function setPath(target: Data, path: string, value: unknown): void {
  const segments = path.split('.');
  let current = target;
  segments.slice(0, -1).forEach((segment) => {
    current[segment] ??= {};
    current = current[segment];
  });
  current[segments[segments.length - 1]] = value;
}

/** Développe « languages_spoken.* » en « languages_spoken.0 », « languages_spoken.1 »… */
function expandWildcards(rules: Rules, data: Data): Array<[string, string[]]> {
  const expanded: Array<[string, string[]]> = [];
  for (const [key, raw] of Object.entries(rules)) {
    const list = Array.isArray(raw) ? raw : raw.split('|');
    if (!key.includes('*')) {
      expanded.push([key, list]);
      continue;
    }
    const [base, rest] = key.split('.*');
    const parent = getPath(data, base);
    if (parent && typeof parent === 'object') {
      Object.keys(parent).forEach((index) => expanded.push([`${base}.${index}${rest ?? ''}`, list]));
    }
  }
  return expanded;
}

function attributeName(key: string): string {
  return key.replace(/_/g, ' ');
}

const isNumeric = (v: unknown) =>
  (typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && /^\s*[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\s*$/.test(v));
const isInteger = (v: unknown) =>
  (typeof v === 'number' && Number.isInteger(v)) || (typeof v === 'string' && /^[+-]?\d+$/.test(v));
const isPlainArray = (v: unknown) => Array.isArray(v) || (v !== null && typeof v === 'object' && !(v instanceof Blob));
const parseDate = (v: unknown): Date | null => {
  if (typeof v !== 'string' && typeof v !== 'number') return null;
  const text = String(v);
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(text) ? `${text}T00:00:00Z` : text);
  return Number.isNaN(d.getTime()) ? null : d;
};

function sizeOf(value: unknown, ruleList: string[]): { size: number; kind: 'numeric' | 'array' | 'file' | 'string' } {
  if (value instanceof Blob) {
    return { size: value.size / 1024, kind: 'file' };
  }
  if (ruleList.includes('numeric') || ruleList.includes('integer')) {
    return { size: Number(value), kind: 'numeric' };
  }
  if (Array.isArray(value)) {
    return { size: value.length, kind: 'array' };
  }
  if (value !== null && typeof value === 'object') {
    return { size: Object.keys(value).length, kind: 'array' };
  }
  return { size: [...String(value ?? '')].length, kind: 'string' };
}

const MAX_MESSAGES = {
  numeric: 'The :attribute field must not be greater than :max.',
  array: 'The :attribute field must not have more than :max items.',
  file: 'The :attribute field must not be greater than :max kilobytes.',
  string: 'The :attribute field must not be greater than :max characters.',
};

const MIN_MESSAGES = {
  numeric: 'The :attribute field must be at least :min.',
  array: 'The :attribute field must have at least :min items.',
  file: 'The :attribute field must be at least :min kilobytes.',
  string: 'The :attribute field must be at least :min characters.',
};

export async function validate<T extends Data = Data>(data: Data, rules: Rules): Promise<T> {
  const errors: Record<string, string[]> = {};
  const validated: Data = {};

  for (const [key, ruleList] of expandWildcards(rules, data)) {
    const value = getPath(data, key);
    const present = value !== MISSING;
    const actual = present ? value : undefined;

    if (ruleList.includes('sometimes') && !present) {
      continue;
    }
    if (ruleList.includes('nullable') && actual === null) {
      if (present) setPath(validated, key, null);
      continue;
    }

    const attr = attributeName(key);
    const fail = (message: string, replacements: Record<string, string | number> = {}) => {
      let text = message.replace(':attribute', attr);
      for (const [name, replacement] of Object.entries(replacements)) {
        text = text.replace(`:${name}`, String(replacement));
      }
      (errors[key] ??= []).push(text);
    };

    for (const rule of ruleList) {
      const separator = rule.indexOf(':');
      const name = separator === -1 ? rule : rule.slice(0, separator);
      const parameter = separator === -1 ? '' : rule.slice(separator + 1);

      if (name === 'required') {
        const empty =
          actual === undefined ||
          actual === null ||
          (typeof actual === 'string' && actual.trim() === '') ||
          (Array.isArray(actual) && actual.length === 0);
        if (empty) {
          fail('The :attribute field is required.');
          break; // Laravel arrête la validation du champ après l'échec d'une règle implicite
        }
        continue;
      }

      // Les règles non implicites ne s'appliquent pas à un champ absent
      if (!present) {
        continue;
      }

      switch (name) {
        case 'sometimes':
        case 'nullable':
          break;
        case 'string':
          if (typeof actual !== 'string') fail('The :attribute field must be a string.');
          break;
        case 'email':
          if (typeof actual !== 'string' || !/^[^\s@]+@[^\s@]+$/.test(actual)) {
            fail('The :attribute field must be a valid email address.');
          }
          break;
        case 'integer':
          if (!isInteger(actual)) fail('The :attribute field must be an integer.');
          break;
        case 'numeric':
          if (!isNumeric(actual)) fail('The :attribute field must be a number.');
          break;
        case 'boolean':
          if (![true, false, 0, 1, '0', '1'].includes(actual as any)) fail('The :attribute field must be true or false.');
          break;
        case 'array':
          if (!isPlainArray(actual)) fail('The :attribute field must be an array.');
          break;
        case 'date':
          if (!parseDate(actual)) fail('The :attribute field must be a valid date.');
          break;
        case 'image':
          if (!(actual instanceof Blob) || !IMAGE_MIME_TYPES.includes(actual.type)) {
            fail('The :attribute field must be an image.');
          }
          break;
        case 'confirmed':
          if (getPath(data, `${key}_confirmation`) !== actual) {
            fail('The :attribute field confirmation does not match.');
          }
          break;
        case 'max': {
          const { size, kind } = sizeOf(actual, ruleList);
          if (size > Number(parameter)) fail(MAX_MESSAGES[kind], { max: parameter });
          break;
        }
        case 'min': {
          const { size, kind } = sizeOf(actual, ruleList);
          if (size < Number(parameter)) fail(MIN_MESSAGES[kind], { min: parameter });
          break;
        }
        case 'before':
        case 'after':
        case 'after_or_equal': {
          const date = parseDate(actual);
          const other = parameter === 'today' ? todayUtc() : parseDate(getPath(data, parameter));
          const label = parameter === 'today' ? 'today' : attributeName(parameter);
          // Laravel compare avec false quand l'autre champ est absent ou invalide : la règle passe alors
          const ok =
            !!date &&
            (!other || (name === 'before' ? date < other : name === 'after' ? date > other : date >= other));
          if (!ok) {
            const verb = name === 'before' ? 'before' : name === 'after' ? 'after' : 'after or equal to';
            fail(`The :attribute field must be a date ${verb} :date.`, { date: label });
          }
          break;
        }
        case 'in':
          if (!parameter.split(',').includes(String(actual))) fail('The selected :attribute is invalid.');
          break;
        case 'exists': {
          const [table, column = key] = parameter.split(',');
          const { count, error } = await db().from(table).select(column, { count: 'exact', head: true }).eq(column, actual as any);
          if (error || !count) fail('The selected :attribute is invalid.');
          break;
        }
        case 'unique': {
          const [table, column = key, ignoreId] = parameter.split(',');
          let query = db().from(table).select('id', { count: 'exact', head: true }).eq(column, actual as any);
          if (ignoreId) query = query.neq('id', ignoreId);
          const { count, error } = await query;
          if (error) throw error;
          if (count) fail('The :attribute has already been taken.');
          break;
        }
        default:
          throw new Error(`Règle de validation non prise en charge : ${rule}`);
      }
    }

    if (!errors[key] && present) {
      // Comme validated() de Laravel : un objet dont les clés ont leurs propres règles ne garde que ces clés
      const hasChildRules = Object.keys(rules).some((k) => k.startsWith(`${key}.`) && !k.startsWith(`${key}.*`));
      const isObject = actual !== null && typeof actual === 'object' && !Array.isArray(actual) && !(actual instanceof Blob);
      setPath(validated, key, hasChildRules && isObject ? {} : actual);
    }
  }

  const keys = Object.keys(errors);
  if (keys.length > 0) {
    const first = errors[keys[0]][0];
    const others = keys.reduce((count, key) => count + errors[key].length, 0) - 1;
    const message = others > 0 ? `${first} (and ${others} more ${others === 1 ? 'error' : 'errors'})` : first;
    throw new HttpError(422, { message, errors });
  }

  return validated as T;
}
