-- Dates bloquées par l'hôte dans son calendrier : nuits indisponibles à la réservation.
-- Une ligne par nuit ; la nuit du « date » au lendemain ne peut plus être réservée.

create table public.listing_blocked_dates (
  listing_id bigint not null references public.listings (id) on delete cascade,
  date date not null,
  created_at timestamptz(0) default now(),
  primary key (listing_id, date)
);

-- Seule l'API Next.js (clé secrète) lit et écrit cette table, comme les autres
alter table public.listing_blocked_dates enable row level security;
revoke all on public.listing_blocked_dates from anon, authenticated;
