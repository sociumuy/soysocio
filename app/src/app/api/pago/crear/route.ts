import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe, DELCLUB_FEE_PERCENT } from '@/lib/stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { socio_id, club_id } = await req.json()
    if (!socio_id || !club_id) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

    const { data: club } = await supabase
      .from('clubes')
      .select('nombre, cuota_monto, stripe_account_id')
      .eq('id', club_id)
      .single()

    if (!club) return NextResponse.json({ error: 'Club no encontrado' }, { status: 404 })
    if (!club.stripe_account_id) return NextResponse.json({ error: 'El club aún no conectó su cuenta de pagos' }, { status: 400 })

    const monto = club.cuota_monto ?? 2400
    const montoEnCentavos = Math.round(monto * 100)
    const fee = Math.round(montoEnCentavos * DELCLUB_FEE_PERCENT)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: montoEnCentavos,
      currency: 'uyu',
      automatic_payment_methods: { enabled: true },
      application_fee_amount: fee,
      transfer_data: { destination: club.stripe_account_id },
      metadata: { socio_id, club_id },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (e: any) {
    console.error('Stripe error:', e)
    return NextResponse.json({ error: e.message ?? 'Error creando pago' }, { status: 500 })
  }
}
