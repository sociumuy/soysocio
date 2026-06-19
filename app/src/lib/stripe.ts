import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
})

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
