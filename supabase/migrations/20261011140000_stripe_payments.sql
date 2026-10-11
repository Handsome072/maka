-- Paiement en ligne (Stripe Embedded Checkout).
-- « awaiting_payment » : le voyageur est en train de payer ; les dates sont retenues 30 minutes au plus.
-- Demande : la carte est autorisée (empreinte), débitée quand l'hôte accepte, libérée sinon.
-- Réservation instantanée : débit immédiat. Annulation : remboursement Stripe du montant calculé.
-- Versements aux hôtes : manuels, suivis dans host_payouts (un par réservation, 0 % de commission hôte).

alter table public.reservations drop constraint reservations_status_check;
alter table public.reservations add constraint reservations_status_check
  check (status in ('awaiting_payment', 'pending', 'confirmed', 'active', 'completed', 'cancelled', 'declined', 'expired'));

-- Les dates d'un paiement en cours sont retenues comme celles d'une demande
alter table public.reservations drop constraint reservations_no_overlap;
alter table public.reservations add constraint reservations_no_overlap
  exclude using gist (listing_id with =, daterange(check_in, check_out) with &&)
  where (status in ('awaiting_payment', 'pending', 'confirmed', 'active'));

alter table public.reservations
  -- null : réservation sans paiement en ligne (avant Stripe)
  add column payment_status varchar(24)
    check (payment_status in ('awaiting', 'authorized', 'paid', 'released', 'refunded', 'partially_refunded')),
  add column stripe_checkout_session_id varchar(255),
  add column stripe_payment_intent_id varchar(255),
  add column amount_paid numeric(10, 2),
  add column amount_refunded numeric(10, 2),
  add column paid_at timestamptz(0);

create unique index reservations_stripe_checkout_session_id_key
  on public.reservations (stripe_checkout_session_id) where stripe_checkout_session_id is not null;

-- Un seul versement par réservation (le webhook Stripe et le retour du paiement peuvent arriver ensemble)
create unique index host_payouts_reservation_id_key on public.host_payouts (reservation_id);
