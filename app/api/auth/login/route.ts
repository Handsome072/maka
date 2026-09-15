import { abort, input, route } from '@/server/http';
import { db, must } from '@/server/supabase';
import { validate } from '@/server/validation';

export const dynamic = 'force-dynamic';

/**
 * La connexion elle-même se fait dans le navigateur avec Supabase Auth (signInWithPassword), pour que
 * les limites de débit de Supabase s'appliquent à l'IP de chaque visiteur et non à celle du serveur.
 *
 * Le navigateur n'appelle cette route qu'après un échec, pour obtenir exactement la réponse de
 * AuthController@login : 422 de validation, compte sans mot de passe, ou identifiants incorrects.
 * Elle ne révèle rien de plus que l'ancienne API.
 */
export const POST = route(async (req) => {
  const credentials = await validate<{ email: string; password: string }>(await input(req), {
    email: ['required', 'email'],
    password: ['required'],
  });

  const user = must(
    await db().from('users').select('has_password').eq('email', credentials.email).limit(1).maybeSingle(),
  ) as { has_password: boolean } | null;

  if (user && !user.has_password) {
    abort(401, "Veuillez d'abord vérifier votre email et définir votre mot de passe.");
  }

  abort(401, 'Identifiants incorrects.');
});
