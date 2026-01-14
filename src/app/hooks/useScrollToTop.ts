'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour gérer le bouton "Retour en haut"
 * @param threshold - Seuil de scroll en pixels pour afficher le bouton (default: 400)
 */
export function useScrollToTop(threshold = 400) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > threshold);
    };

    // Passive listener pour optimiser les performances de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { showScrollTop, scrollToTop };
}

