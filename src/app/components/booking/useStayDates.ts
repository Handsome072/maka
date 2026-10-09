'use client';

import { useCallback, useEffect, useState } from 'react';
import { reservationsApi } from '../../services/api';

const DAY_MS = 86_400_000;

/** Nombre de jours chargés à l'avance pour barrer les nuits déjà réservées. */
const BOOKED_WINDOW_DAYS = 365;

export type DateFocus = 'checkIn' | 'checkOut';

export function toYmd(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function nightsBetween(start: Date, end: Date): number {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / DAY_MS));
}

/**
 * Sélection arrivée / départ façon Airbnb : on choisit d'abord l'arrivée, puis seuls les départs
 * possibles restent cliquables (durée min/max du séjour, aucune nuit déjà réservée entre les deux).
 */
export function useStayDates(listingId: number, minStay: number, maxStay: number) {
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [focus, setFocus] = useState<DateFocus>('checkIn');
  const [bookedNights, setBookedNights] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let cancelled = false;
    const today = startOfToday();
    reservationsApi
      .checkAvailability({
        listing_id: listingId,
        check_in: toYmd(today),
        check_out: toYmd(addDays(today, BOOKED_WINDOW_DAYS)),
      })
      .then((res) => {
        if (!cancelled) setBookedNights(new Set(res.conflicting_dates));
      })
      // Sans cette liste, seules les règles de durée s'appliquent ; la réservation reste vérifiée côté serveur.
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  const nightsFree = useCallback(
    (from: Date, nights: number) => {
      for (let i = 0; i < nights; i++) {
        if (bookedNights.has(toYmd(addDays(from, i)))) return false;
      }
      return true;
    },
    [bookedNights],
  );

  const canCheckIn = useCallback(
    (day: Date) => day >= startOfToday() && nightsFree(day, minStay),
    [minStay, nightsFree],
  );

  const canCheckOut = useCallback(
    (day: Date) => {
      if (!checkIn || day <= checkIn) return false;
      const nights = nightsBetween(checkIn, day);
      return nights >= minStay && (!maxStay || nights <= maxStay) && nightsFree(checkIn, nights);
    },
    [checkIn, minStay, maxStay, nightsFree],
  );

  const selectingCheckOut = focus === 'checkOut' && checkIn !== null;

  const isSelectable = useCallback(
    (day: Date) => (selectingCheckOut ? canCheckOut(day) : canCheckIn(day)),
    [selectingCheckOut, canCheckOut, canCheckIn],
  );

  /** Applique le clic sur un jour ; renvoie true quand le séjour vient d'être complété. */
  const select = useCallback(
    (day: Date): boolean => {
      if (selectingCheckOut) {
        if (!canCheckOut(day)) return false;
        setCheckOut(day);
        setFocus('checkIn');
        return true;
      }
      if (!canCheckIn(day)) return false;
      setCheckIn(day);
      setCheckOut(null);
      setFocus('checkOut');
      return false;
    },
    [selectingCheckOut, canCheckOut, canCheckIn],
  );

  const clear = useCallback(() => {
    setCheckIn(null);
    setCheckOut(null);
    setFocus('checkIn');
  }, []);

  const clearCheckOut = useCallback(() => {
    setCheckOut(null);
    setFocus('checkOut');
  }, []);

  return {
    checkIn,
    checkOut,
    nights: checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0,
    focus,
    setFocus,
    selectingCheckOut,
    isSelectable,
    select,
    clear,
    clearCheckOut,
  };
}
