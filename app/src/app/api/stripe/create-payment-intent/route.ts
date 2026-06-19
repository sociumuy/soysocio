import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { stripe, CUOTA_AMOUNTS, DELCLUB_FEE_PERCENT } from '@/lib/stripe'
import { checkRateLimit } from '@/lib/rate-limit'

// POST /api/stripe/create-payment-intent
// Crea un PaymentIntent con el split automático: 98% al club, 2% a DelClub.
export async function POST(request: Request) {
  const limited = await checkRateLimit(request, 'stripe/create-payment-intent')
  if (limited) return limited

  const { socio_id } = await request.json()

  if (!socio_id) {
    return NextResponse.json({ error: 'socio_id requerido' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Obtener datos del socio y su club
  const { data: socio } = await supabase
    .from('socios')
    .select('id, categoria, club_id, clubes(stripe_account_id, nombre)')
    .eq('id', socio_id)
    .single()

  if (!socio) {
    return NextResponse.json({ error: 'Socio no encontrado' }, { status: 404 })
  }

  const club = socio.clubes as { stripe_account_id: string | null; nombre: string } | null

  if (!club?.stripe_account_id) {
    return NextResponse.json(
      { error: 'El club aún no configuró su cuenta de cobro. Contactá al administrador.' },
      { status: 422 }
    )
  }

  const amount = CUOTA_AMOUNTS[socio.categoria] ?? CUOTA_AMOUNTS['Mayores +22']
  const applicationFee = Math.round(amount * DELCLUB_FEE_PERCENT)

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'uyu',
    application_fee_amount: applicationFee,
    transfer_data: {
      destination: club.stripe_account_id,
    },
    metadata: {
      socio_id: socio.id,
      club_id:  socio.club_id,
    },
    automatic_payment_methods: { enabled: true },
  })

  return NextResponse.json({ client_secret: paymentIntent.client_secret })
}
