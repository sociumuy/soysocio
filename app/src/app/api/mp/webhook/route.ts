import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getPaymentClient } from '@/lib/mercadopago'

export const runtime = 'nodejs'

// POST /api/mp/webhook
// MercadoPago notifica aquí los cambios de estado de pago.
// Configurar en: https://www.mercadopago.com.uy/developers/panel/app/webhooks
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body || body.type !== 'payment' || !body.data?.id) {
    return NextResponse.json({ received: true })
  }

  const paymentClient = getPaymentClient()
  const payment       = await paymentClient.get({ id: body.data.id }).catch(() => null)

  if (!payment || payment.status !== 'approved') {
    return NextResponse.json({ received: true })
  }

  const socio_id = payment.metadata?.socio_id
  if (!socio_id) return NextResponse.json({ received: true })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  await Promise.all([
    supabase.from('socios').update({ cuota_al_dia: true }).eq('id', socio_id),
    supabase.from('pagos').insert({
      socio_id,
      club_id:       payment.metadata?.club_id,
      monto:         payment.transaction_amount,
      moneda:        'UYU',
      mp_payment_id: String(payment.id),
      estado:        'aprobado',
    }),
  ])

  return NextResponse.json({ received: true })
}
