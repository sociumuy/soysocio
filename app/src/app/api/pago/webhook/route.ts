import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (e: any) {
    return NextResponse.json({ error: `Webhook error: ${e.message}` }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as any
    const { socio_id, club_id } = pi.metadata

    if (socio_id && club_id) {
      await supabase
        .from('socios')
        .update({ cuota_al_dia: true })
        .eq('id', socio_id)

      await supabase.from('pagos').insert({
        socio_id,
        club_id,
        monto: pi.amount / 100,
        moneda: pi.currency.toUpperCase(),
        stripe_payment_intent_id: pi.id,
        stripe_status: pi.status,
        concepto: 'Cuota mensual',
      })
    }
  }

  return NextResponse.json({ ok: true })
}
