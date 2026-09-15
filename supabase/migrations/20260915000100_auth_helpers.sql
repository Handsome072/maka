-- Révocation de toutes les sessions d'un utilisateur (équivalent de $user->tokens()->delete() de Sanctum).
-- Supprimer la session supprime aussi ses refresh tokens ; les routes API refusent alors immédiatement
-- le jeton d'accès, car authenticate() vérifie la session auprès de Supabase Auth.
create or replace function public.revoke_user_sessions(p_auth_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.sessions where user_id = p_auth_id;
$$;

revoke execute on function public.revoke_user_sessions(uuid) from public, anon, authenticated;
grant execute on function public.revoke_user_sessions(uuid) to service_role;
