import type { UserRow } from '@/server/auth';
import { db, must, publicAuthClient, supabaseUrl } from '@/server/supabase';
import { freshTimestamp } from './update';

/**
 * Hash::check($password, $user->password) : le hash vit dans Supabase Auth.
 * Faux si l'utilisateur n'a pas de mot de passe ; sinon on tente une connexion avec un client jetable
 * et la session de vérification est révoquée aussitôt.
 */
export async function checkPassword(user: UserRow, password: string): Promise<boolean> {
  if (!user.has_password || !user.auth_id) {
    return false;
  }

  const { data, error } = await publicAuthClient().auth.signInWithPassword({ email: user.email, password });

  if (data?.session) {
    const { error: revokeError } = await db().auth.admin.signOut(data.session.access_token, 'local');
    if (revokeError) {
      console.error('[auth] révocation de la session de vérification impossible', revokeError);
    }
  }

  if (error) {
    // 400 = identifiants invalides (ou email non confirmé côté Auth) ; le reste (429, 5xx, réseau) est une vraie panne
    if (error.status === 400 || error.code === 'invalid_credentials') {
      return false;
    }
    throw error;
  }

  // L'email de public.users doit désigner le même compte Auth que l'utilisateur connecté
  return !!data.session && data.user?.id === user.auth_id;
}

/**
 * $user->update(['password' => Hash::make($password)])
 *
 * Avec le jeton de la requête, le changement passe par la session de l'utilisateur : Supabase Auth garde
 * cette session et ferme les autres. Par l'API admin, il fermerait toutes les sessions, y compris celle en
 * cours, et l'utilisateur serait déconnecté juste après avoir changé son mot de passe (Laravel gardait le jeton).
 */
export async function setPassword(user: UserRow, password: string, currentToken?: string): Promise<void> {
  if (!user.auth_id) {
    throw new Error(`Utilisateur ${user.id} sans compte Supabase Auth`);
  }

  if (currentToken) {
    const response = await fetch(`${supabaseUrl()}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '',
        Authorization: `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      // Laravel acceptait de redéfinir le même mot de passe ; Supabase le refuse sans rien modifier
      if (body.error_code !== 'same_password') {
        const error = new Error(body.msg ?? body.message ?? `Supabase Auth a refusé le mot de passe (${response.status})`);
        (error as Error & { status?: number }).status = response.status;
        throw error;
      }
    }
  } else {
    const { error } = await db().auth.admin.updateUserById(user.auth_id, { password });
    if (error) {
      throw error;
    }
  }
  must(
    await db()
      .from('users')
      .update({ has_password: true, updated_at: freshTimestamp() })
      .eq('id', user.id),
  );
}

/** $user->tokens()->delete() : révoque toutes les sessions de l'utilisateur. */
export async function revokeAllSessions(token: string): Promise<void> {
  const { error } = await db().auth.admin.signOut(token, 'global');
  // 401/403/404 : session déjà expirée ou supprimée, rien à révoquer
  if (error && ![401, 403, 404].includes(error.status ?? 0)) {
    throw error;
  }
}
