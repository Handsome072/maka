-- Favoris : annonces enregistrées par un utilisateur (cœur sur les cartes et la page de l'annonce).
-- Une ligne par couple utilisateur / annonce ; supprimée avec l'utilisateur ou l'annonce.

create table public.favorites (
  user_id bigint not null references public.users (id) on delete cascade,
  listing_id bigint not null references public.listings (id) on delete cascade,
  created_at timestamptz(0) default now(),
  primary key (user_id, listing_id)
);

create index favorites_listing_id_idx on public.favorites (listing_id);

-- Seule l'API Next.js (clé secrète) lit et écrit cette table, comme les autres
alter table public.favorites enable row level security;
revoke all on public.favorites from anon, authenticated;
