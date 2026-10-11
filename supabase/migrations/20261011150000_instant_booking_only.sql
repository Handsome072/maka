-- Plus de validation des demandes par l'hôte : toutes les réservations sont instantanées.
-- Les annonces encore « sur demande » passent en réservation instantanée, et c'est la valeur par défaut.
-- Les demandes déjà en attente (aucune à cette date) gardent leur fonctionnement jusqu'à leur réponse ou expiration.

update public.listings set reservation_mode = 'instant' where reservation_mode is distinct from 'instant';

alter table public.listings alter column reservation_mode set default 'instant';
