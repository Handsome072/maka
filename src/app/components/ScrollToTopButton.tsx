'use client';

import { ArrowUp } from 'lucide-react';
import { useScrollToTop } from '../hooks/useScrollToTop';

/**
 * Bouton "Retour en haut de la page"
 * Apparaît après 400px de scroll
 * UI identique à l'original
 */
export function ScrollToTopButton() {
  const { showScrollTop, scrollToTop } = useScrollToTop();

  if (!showScrollTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 px-5 py-3 bg-gray-900 text-white rounded-lg text-sm shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 z-50"
      style={{ fontWeight: 600 }}
    >
      <ArrowUp className="w-4 h-4" />
      Retour en haut de la page
    </button>
  );
}

