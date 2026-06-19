import Stripe from 'stripe'

let _stripe: Stripe | null = null
export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY not set')
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true })
  }
  return _stripe
}
export const stripe = { get paymentIntents() { return getStripe().paymentIntents }, get accounts() { return getStripe().accounts }, get accountLinks() { return getStripe().accountLinks }, get webhooks() { return getStripe().webhooks } }

// Cuota amounts in UYU centésimos (×100 for Stripe)
export const CUOTA_AMOUNTS: Record<string, number> = {
  'Infantiles -13': 219000,
  'Juveniles -21': 289000,
  'Mayores +22': 349000,
  'Cuota Familiar': 659000,
  'Fitness': 219000,
  'Cuota Amigo': 89000,
}

// DelClub commission: 2%
export const DELCLUB_FEE_PERCENT = 0.02
