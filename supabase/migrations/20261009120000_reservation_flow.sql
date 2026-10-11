-- Parcours de réservation : statuts « refusée » et « expirée », numéro de réservation, échéance des demandes,
-- mode et politique d'annulation figés au moment de la réservation, détail complet du prix,
-- et interdiction en base de deux séjours qui se chevauchent sur un même logement.
-- Uniquement des ajouts : le code déjà déployé continue de fonctionner.

create extension if not exists btree_gist with schema extensions;

-- ─── statuts ──────────────────────────────────────────────────────────────────
alter table public.reservations drop constraint reservations_status_check;
alter table public.reservations add constraint reservations_status_check
  check (status in ('pending', 'confirmed', 'active', 'completed', 'cancelled', 'declined', 'expired'));

-- ─── numéro de réservation (« SJ » + 6 caractères sans 0/O ni 1/I) ─────────────
create or replace function public.new_reservation_code()
returns text
language sql
volatile
set search_path = ''
as $$
  select 'SJ' || string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 1 + floor(random() * 32)::int, 1), '')
  from generate_series(1, 6);
$$;

revoke execute on function public.new_reservation_code() from public, anon, authenticated;
grant execute on function public.new_reservation_code() to service_role;

-- ─── nouvelles colonnes ───────────────────────────────────────────────────────
alter table public.reservations
  -- défaut volatil : chaque ligne existante reçoit son propre numéro
  add column confirmation_code varchar(12) not null default public.new_reservation_code(),
  add column reservation_mode varchar(16) check (reservation_mode in ('request', 'instant')),
  add column cancellation_policy varchar(16) check (cancellation_policy in ('flexible', 'moderate', 'strict')),
  add column extra_guest_fee numeric(10, 2),
  add column pet_fee numeric(10, 2),
  add column expires_at timestamptz(0),
  add column confirmed_at timestamptz(0),
  add column declined_at timestamptz(0),
  add column cancelled_at timestamptz(0),
  add column cancelled_by varchar(16) check (cancelled_by in ('guest', 'host', 'admin'));

alter table public.reservations add constraint reservations_confirmation_code_key unique (confirmation_code);

-- ─── politiques d'annulation des annonces : flexible / moderate / strict ──────
update public.listings
set cancellation_policy = case lower(cancellation_policy)
  when 'flexible' then 'flexible'
  when 'moderate' then 'moderate'
  when 'modérée' then 'moderate'
  when 'moderee' then 'moderate'
  when 'strict' then 'strict'
  when 'stricte' then 'strict'
  else cancellation_policy
end
where cancellation_policy is not null;

-- ─── réservations existantes ──────────────────────────────────────────────────
update public.reservations r
set
  reservation_mode = case when l.reservation_mode = 'instant' then 'instant' else 'request' end,
  cancellation_policy = case when l.cancellation_policy in ('flexible', 'moderate', 'strict') then l.cancellation_policy else 'flexible' end,
  expires_at = case when r.status = 'pending' then r.created_at + interval '24 hours' end,
  confirmed_at = case when r.status in ('confirmed', 'active', 'completed') then r.updated_at end
from public.listings l
where l.id = r.listing_id;

-- ─── pas de chevauchement ─────────────────────────────────────────────────────
-- Séjour = [arrivée, départ) : le jour de départ reste libre pour l'arrivée suivante.
-- Une demande en attente bloque ses dates jusqu'à la réponse de l'hôte ou son expiration.
alter table public.reservations add constraint reservations_no_overlap
  exclude using gist (listing_id with =, daterange(check_in, check_out) with &&)
  where (status in ('pending', 'confirmed', 'active'));

create index reservations_pending_expires_at_idx on public.reservations (expires_at) where status = 'pending';
