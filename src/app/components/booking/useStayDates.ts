'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { reservationsApi } from '../../services/api';
import { weekdayAllowed, weekdayName } from '@/shared/booking';

const DAY_MS = 86_400_000;

/** Nombre de jours chargés à l'avance pour barrer les nuits déjà réservées. */
const BOOKED_WINDOW_DAYS = 365;

export type DateFocus = 'checkIn' | 'checkOut';

export function toYmd(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** « AAAA-MM-JJ » → minuit local de ce jour ; null si le format ne correspond pas. */
export function parseYmd(value: string | null | undefined): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null;
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

export interface StayRules {
  /** Jours d'arrivée / de départ autorisés de l'annonce ({ Lun: true, Sam: false, … }). */
  arrivalDays?: unknown;
  departureDays?: unknown;
  /** Séjour déjà choisi (page de réservation). */
  initialCheckIn?: Date | null;
  initialCheckOut?: Date | null;
}

/**
 * Sélection arrivée / départ façon Airbnb : on choisit d'abord l'arrivée, puis seuls les départs
 * possibles restent cliquables (durée min/max du séjour, jours autorisés, aucune nuit déjà réservée entre les deux).
 */
export function useStayDates(listingId: number, minStay: number, maxStay: number, rules: StayRules = {}) {
  const { arrivalDays, departureDays } = rules;
  const [checkIn, setCheckIn] = useState<Date | null>(rules.initialCheckIn ?? null);
  const [checkOut, setCheckOut] = useState<Date | null>(rules.initialCheckOut ?? null);
  const [focus, setFocus] = useState<DateFocus>('checkIn');
  const [bookedNights, setBookedNights] = useState<Set<string>>(() => new Set());
  const [bookedVersion, setBookedVersion] = useState(0);

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
  }, [listingId, bookedVersion]);

  /** Recharge les nuits occupées (après un refus « dates plus disponibles »). */
  const reloadBooked = useCallback(() => setBookedVersion((v) => v + 1), []);

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
    (day: Date) => day >= startOfToday() && weekdayAllowed(arrivalDays, day.getDay()) && nightsFree(day, minStay),
    [minStay, nightsFree, arrivalDays],
  );

  const canCheckOut = useCallback(
    (day: Date) => {
      if (!checkIn || day <= checkIn) return false;
      const nights = nightsBetween(checkIn, day);
      return (
        nights >= minStay &&
        (!maxStay || nights <= maxStay) &&
        weekdayAllowed(departureDays, day.getDay()) &&
        nightsFree(checkIn, nights)
      );
    },
    [checkIn, minStay, maxStay, nightsFree, departureDays],
  );

  /** Ce qui empêche de réserver le séjour choisi (dates venues d'ailleurs, ou nuits prises entre-temps). */
  const issue = useMemo((): string | null => {
    if (!checkIn || !checkOut) return null;
    const nights = nightsBetween(checkIn, checkOut);
    if (nights < minStay) return `Ce logement demande un séjour d'au moins ${minStay} nuit${minStay > 1 ? 's' : ''}.`;
    if (maxStay && nights > maxStay) return `Ce logement accepte au maximum ${maxStay} nuits.`;
    if (!weekdayAllowed(arrivalDays, checkIn.getDay())) {
      return `Les arrivées ne sont pas possibles le ${weekdayName(checkIn.getDay())} dans ce logement.`;
    }
    if (!weekdayAllowed(departureDays, checkOut.getDay())) {
      return `Les départs ne sont pas possibles le ${weekdayName(checkOut.getDay())} dans ce logement.`;
    }
    if (!nightsFree(checkIn, nights)) return 'Certaines de ces nuits sont déjà réservées.';
    return null;
  }, [checkIn, checkOut, minStay, maxStay, arrivalDays, departureDays, nightsFree]);

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
    issue,
    focus,
    setFocus,
    selectingCheckOut,
    isSelectable,
    select,
    clear,
    clearCheckOut,
    reloadBooked,
  };
}
