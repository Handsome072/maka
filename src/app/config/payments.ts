import { loadStripe, type Stripe } from '@stripe/stripe-js';

/**
 * Paiement en ligne (Stripe) : actif quand la clé publique est définie au build.
 * Sans elle, les réservations se font sans paiement en ligne (comportement d'avant Stripe).
 */
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';

export const PAYMENTS_ENABLED = PUBLISHABLE_KEY !== '';

let stripePromise: Promise<Stripe | null> | null = null;

/** Stripe.js chargé une seule fois, à la première ouverture du formulaire de paiement. */
export function getStripe(): Promise<Stripe | null> {
  stripePromise ??= loadStripe(PUBLISHABLE_KEY);
  return stripePromise;
}
