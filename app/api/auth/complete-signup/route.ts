import { authUserPayload, setUserPassword } from '@/server/account';
import type { UserRow } from '@/server/auth';
import { HttpError, input, json, route } from '@/server/http';
import { usableSignupLink } from '@/server/signup';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

const PASSWORD_REQUIREMENTS: Array<[RegExp, string]> = [
  [/[A-Z]/, 'une lettre majuscule'],
  [/[0-9]/, 'un chiffre'],
  [/[^A-Za-z0-9]/, 'un caractère spécial'],
];

const ALREADY_USED = (email: string) =>
  new HttpError(409, { status: 'used', email, message: 'Un compte existe déjà pour cette adresse.' });

/** 18 ans révolus au jour d'aujourd'hui (UTC), pour une date AAAA-MM-JJ. */
function isAdult(birthDate: string, now = new Date()): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
  if (!match) return false;
  const adultFrom = Date.UTC(Number(match[1]) + 18, Number(match[2]) - 1, Number(match[3]));
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return today >= adultFrom;
}

/** Identifiant Supabase Auth d'une adresse (compte d'authentification resté sans ligne users). */
async function findAuthUserId(email: string): Promise<string | null> {
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await db().auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const found = data.users.find((user) => (user.email ?? '').toLowerCase() === email);
    if (found) return found.id;
    if (data.users.length < 1000) return null;
  }
  return null;
}

/** Crée le compte Supabase Auth puis la ligne users ; annule le compte Auth si l'insertion échoue. */
async function createAccount(email: string, password: string, profile: Record<string, unknown>): Promise<void> {
  let authId: string;
  let createdHere = false;

  const { data: created, error } = await db().auth.admin.createUser({ email, password, email_confirm: true });

  if (created?.user && !error) {
    authId = created.user.id;
    createdHere = true;
  } else {
    const code = (error as { code?: string } | null)?.code;
    const status = (error as { status?: number } | null)?.status;

    if (code === 'email_exists') {
      // Compte Auth orphelin (tentative précédente interrompue) : on le reprend s'il n'a pas de ligne users
      const { count } = await db().from('users').select('id', { count: 'exact', head: true }).eq('email', email);
      if (count) throw ALREADY_USED(email);
      const orphanId = await findAuthUserId(email);
      if (!orphanId) throw ALREADY_USED(email);
      const { error: updateError } = await db().auth.admin.updateUserById(orphanId, { password, email_confirm: true });
      if (updateError) throw updateError;
      authId = orphanId;
    } else if (status && status >= 400 && status < 500) {
      const message = error?.message ?? 'Mot de passe refusé.';
      throw new HttpError(422, { message, errors: { password: [message] } });
    } else {
      throw error ?? new Error('Création du compte impossible.');
    }
  }

  const { error: insertError } = await db()
    .from('users')
    .insert({ auth_id: authId, email, has_password: true, ...profile });

  if (insertError) {
    if (createdHere) {
      await db().auth.admin.deleteUser(authId);
    }
    // Formulaire envoyé deux fois en même temps : le second trouve l'adresse déjà prise
    const { count } = await db().from('users').select('id', { count: 'exact', head: true }).eq('email', email);
    if (count) throw ALREADY_USED(email);
    throw insertError;
  }
}

/**
 * Inscription, étape 2 : depuis le lien reçu par e-mail, crée le compte avec le profil et le mot de passe.
 * Le navigateur ouvre ensuite la session Supabase avec ce mot de passe.
 */
export const POST = route(async (req) => {
  const validated = await validate<{
    token: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    password: string;
    receive_marketing?: boolean | number | string;
  }>(await input(req), {
    token: ['required', 'string'],
    first_name: ['required', 'string', 'max:255'],
    last_name: ['required', 'string', 'max:255'],
    birth_date: ['required', 'string', 'date', 'before:today'],
    password: ['required', 'string', 'min:8', 'max:72', 'confirmed'],
    password_confirmation: ['required', 'string'],
    receive_marketing: ['boolean'],
  });

  const { email, unfinished } = await usableSignupLink(validated.token);

  if (!isAdult(validated.birth_date)) {
    const message = 'Vous devez avoir au moins 18 ans pour vous inscrire.';
    throw new HttpError(422, { message, errors: { birth_date: [message] } });
  }

  const missing = PASSWORD_REQUIREMENTS.filter(([pattern]) => !pattern.test(validated.password)).map(([, label]) => label);
  if (missing.length > 0) {
    const message = `Le mot de passe doit contenir ${missing.join(', ')}.`;
    throw new HttpError(422, { message, errors: { password: [message] } });
  }

  const profile = {
    first_name: validated.first_name,
    last_name: validated.last_name,
    birth_date: validated.birth_date,
    receive_marketing: [true, 1, '1'].includes(validated.receive_marketing as never),
    email_verified_at: new Date().toISOString(),
    email_verification_token: null,
  };

  if (unfinished) {
    // Inscription commencée avec l'ancien parcours et jamais terminée : on la complète
    must(await db().from('users').update(profile).eq('id', unfinished.id));
    await setUserPassword(unfinished, validated.password);
  } else {
    await createAccount(email, validated.password, profile);
  }

  const user = must(await db().from('users').select('*').eq('email', email).single()) as UserRow;

  return json(
    {
      message: 'Votre compte a été créé.',
      user: authUserPayload(user, true),
    },
    201,
  );
});
