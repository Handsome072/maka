import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listingsApi } from '../services/api';

/**
 * Detects whether the authenticated user has at least one listing
 * with status === 'pending'.
 *
 * - isHost = true  → user has a pending listing  → show "Mode hôte"
 * - isHost = false → no pending listing           → show "Devenir hôte"
 */
export function useHostStatus() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setIsHost(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    listingsApi.getMyListings()
      .then(res => {
        const hasPending = res.listings.some(l => l.status === 'pending');
        setIsHost(hasPending);
      })
      .catch(() => {
        setIsHost(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isAuthenticated, authLoading]);

  return { isHost, isLoading };
}
