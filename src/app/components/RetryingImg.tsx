'use client';

import { useEffect, useState, type ImgHTMLAttributes } from 'react';

/** Délais avant de recharger une image en échec */
const RETRY_DELAYS_MS = [1_500, 4_000, 10_000];

/**
 * <img> qui retente le chargement après un échec réseau (ex. : ERR_NETWORK_CHANGED quand le Wi-Fi change) :
 * le navigateur ne le fait jamais tout seul et l'image resterait vide jusqu'au rechargement de la page.
 */
export function RetryingImg({ src, onError, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setAttempt(0);
  }, [src]);

  return (
    <img
      // Nouvel élément à chaque essai : remettre le même src sur l'ancien ne relance pas le téléchargement
      key={attempt}
      src={src}
      onError={(event) => {
        onError?.(event);
        const delay = RETRY_DELAYS_MS[attempt];
        if (delay !== undefined) setTimeout(() => setAttempt((n) => n + 1), delay);
      }}
      {...props}
    />
  );
}
