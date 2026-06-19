import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

// POST /api/stripe/webhook
// Stripe envía eventos aquí. Al confirmarse un pago, cuota_al_dia = true.
export async function POST(request: Request) {
  const body      = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Sin firma' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent   = event.data.object as Stripe.PaymentIntent
    const socio_id = intent.metadata?.socio_id

    if (!socio_id) {
      return NextResponse.json({ error: 'Sin socio_id en metadata' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Marcar cuota al día
    await supabase
      .from('socios')
      .update({ cuota_al_dia: true })
      .eq('id', socio_id)

    // Registrar pago en historial
    await supabase.from('pagos').insert({
      socio_id,
      club_id:           intent.metadata.club_id,
      monto:             intent.amount / 100,
      moneda:            intent.currency.toUpperCase(),
      stripe_payment_id: intent.id,
      estado:            'aprobado',
    })
  }

  return NextResponse.json({ received: true })
}
