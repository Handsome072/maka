'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { favoritesApi } from '../services/api';

interface FavoritesContextType {
  isFavorite: (listingId: number) => boolean;
  /**
   * Ajoute ou retire l'annonce des favoris (affichage immédiat, annulé si l'enregistrement échoue).
   * Un visiteur non connecté est envoyé vers la connexion ; le cœur est posé à son retour.
   */
  toggleFavorite: (listingId: number) => void;
  /** Vrai une fois les favoris de l'utilisateur connecté chargés. */
  loaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Cœur cliqué avant la connexion : posé au retour s'il date de moins de 30 minutes
const PENDING_KEY = 'homiqio_pending_favorite';
const PENDING_MAX_AGE_MS = 30 * 60_000;

function takePendingFavorite(): number | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    sessionStorage.removeItem(PENDING_KEY);
    const pending = raw ? JSON.parse(raw) : null;
    return pending && Number.isInteger(pending.id) && Date.now() - pending.at < PENDING_MAX_AGE_MS ? pending.id : null;
  } catch {
    return null;
  }
}

function savePendingFavorite(id: number): void {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ id, at: Date.now() }));
  } catch {
    // Stockage indisponible : il faudra recliquer sur le cœur après la connexion
  }
}

function withId(ids: Set<number>, id: number, present: boolean): Set<number> {
  const next = new Set(ids);
  if (present) next.add(id);
  else next.delete(id);
  return next;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [ids, setIds] = useState<Set<number>>(() => new Set());
  const [loaded, setLoaded] = useState(false);
  const idsRef = useRef(ids);
  idsRef.current = ids;
  // Une seule requête à la fois par annonce : un double clic ne peut pas inverser l'ordre ajout / retrait
  const inFlight = useRef(new Set<number>());

  const goToLogin = useCallback(() => {
    const here = `${window.location.pathname}${window.location.search}`;
    router.push(`/login?redirect=${encodeURIComponent(here)}`);
  }, [router]);

  useEffect(() => {
    if (isLoading) return;
    setLoaded(false);
    if (!isAuthenticated) {
      setIds(new Set());
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await favoritesApi.list();
        const next = new Set(res.listing_ids);
        const pending = takePendingFavorite();
        if (pending !== null && !next.has(pending)) {
          await favoritesApi.add(pending).then(() => next.add(pending)).catch(() => {});
        }
        if (!cancelled) {
          setIds(next);
          setLoaded(true);
        }
      } catch {
        // Favoris indisponibles : les cœurs restent vides, un clic réessaiera l'enregistrement
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, user?.id]);

  const toggleFavorite = useCallback(
    (listingId: number) => {
      if (!isAuthenticated) {
        savePendingFavorite(listingId);
        goToLogin();
        return;
      }
      if (inFlight.current.has(listingId)) return;
      inFlight.current.add(listingId);

      const wasFavorite = idsRef.current.has(listingId);
      setIds((current) => withId(current, listingId, !wasFavorite));
      (wasFavorite ? favoritesApi.remove(listingId) : favoritesApi.add(listingId))
        .catch((error: { status?: number }) => {
          setIds((current) => withId(current, listingId, wasFavorite));
          if (error?.status === 401) {
            if (!wasFavorite) savePendingFavorite(listingId);
            goToLogin();
          }
        })
        .finally(() => inFlight.current.delete(listingId));
    },
    [isAuthenticated, goToLogin],
  );

  const isFavorite = useCallback((listingId: number) => ids.has(listingId), [ids]);

  const value = useMemo(() => ({ isFavorite, toggleFavorite, loaded }), [isFavorite, toggleFavorite, loaded]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
