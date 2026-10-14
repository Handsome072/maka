'use client';

import { useCallback, useEffect, useState } from 'react';
import { publicListingsApi, type PublicListing } from '../services/api';

/** La liste reste en mémoire une minute : l'accueil et les suggestions de destinations la partagent. */
const CACHE_MS = 60_000;
let cache: { at: number; request: Promise<PublicListing[]> } | null = null;

function loadPublicListings(): Promise<PublicListing[]> {
  if (!cache || Date.now() - cache.at > CACHE_MS) {
    const request = publicListingsApi.getAll().then((res) => res.listings);
    cache = { at: Date.now(), request };
    request.catch(() => {
      if (cache?.request === request) cache = null;
    });
  }
  return cache.request;
}

/**
 * Annonces actives de la base, sans filtre (null pendant le chargement).
 * `enabled` à false retarde le chargement (ex. : tant que la liste des destinations est fermée).
 */
export function usePublicListings(enabled = true) {
  const [listings, setListings] = useState<PublicListing[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    setFailed(false);
    loadPublicListings()
      .then((rows) => {
        if (!cancelled) setListings(rows);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt, enabled]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  // Échec : on recharge dès que le navigateur retrouve le réseau, sans attendre un clic
  useEffect(() => {
    if (!failed) return;
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, [failed, retry]);

  return { listings, failed, retry };
}

// ─── Annonces consultées récemment (navigateur du visiteur) ──────────────────

const RECENTLY_VIEWED_KEY = 'homiqio_recently_viewed';
const RECENTLY_VIEWED_MAX = 12;

export function readRecentlyViewed(): number[] {
  try {
    const ids = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
    return Array.isArray(ids) ? ids.filter((id): id is number => Number.isInteger(id)) : [];
  } catch {
    return [];
  }
}

export function rememberViewed(id: number): void {
  try {
    const ids = [id, ...readRecentlyViewed().filter((other) => other !== id)].slice(0, RECENTLY_VIEWED_MAX);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids));
  } catch {
    // Stockage indisponible (navigation privée) : la section n'apparaît simplement pas
  }
}
