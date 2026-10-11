-- Annulations : montant remboursable calculé selon la politique d'annulation au moment de l'annulation.
-- Messages automatiques : événements de la réservation affichés dans la conversation (demande envoyée,
-- acceptée, refusée, expirée, annulée), distincts des messages écrits par les participants.
-- Uniquement des ajouts : le code déjà déployé continue de fonctionner.

alter table public.reservations add column refund_amount numeric(10, 2);

alter table public.messages add column is_system boolean not null default false;
