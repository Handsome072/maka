import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { listingsApi } from '../services/api';

/**
 * Detects whether the authenticated user has at least one listing
 * (any status: pending, active, rejected, archived, draft).
 *
 * - isHost = true  → user has at least one listing → show "Mode hôte"
 * - isHost = false → no listing at all             → show "Devenir hôte"
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
        setIsHost(res.listings.length > 0);
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
