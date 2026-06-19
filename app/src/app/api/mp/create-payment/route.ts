import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { getPaymentClient, CUOTA_AMOUNTS, RECARGO_TARJETA } from '@/lib/mercadopago'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const limited = await checkRateLimit(request, 'mp/create-payment')
  if (limited) return limited

  const { socio_id, token, payment_method_id, issuer_id, installments, email } =
    await request.json()

  if (!socio_id || !token || !payment_method_id) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: socio } = await supabase
    .from('socios')
    .select('id, categoria, club_id, nombre, apellido')
    .eq('id', socio_id)
    .single()

  if (!socio) {
    return NextResponse.json({ error: 'Socio no encontrado' }, { status: 404 })
  }

  const base   = CUOTA_AMOUNTS[socio.categoria] ?? CUOTA_AMOUNTS['Mayores +22']
  const amount = Math.round(base * (1 + RECARGO_TARJETA))

  const paymentClient = getPaymentClient()

  const result = await paymentClient.create({
    body: {
      transaction_amount: amount,
      token,
      description:        `Cuota ${socio.categoria} — DelClub`,
      installments:       installments ? Number(installments) : 1,
      payment_method_id,
      issuer_id:          issuer_id ? Number(issuer_id) : undefined,
      payer:              { email: email ?? 'socio@delclub.app' },
      metadata:           { socio_id: socio.id, club_id: socio.club_id },
    },
  })

  if (result.status === 'approved') {
    await Promise.all([
      supabase.from('socios').update({ cuota_al_dia: true }).eq('id', socio_id),
      supabase.from('pagos').insert({
        socio_id,
        club_id:       socio.club_id,
        monto:         amount,
        moneda:        'UYU',
        mp_payment_id: String(result.id),
        estado:        'aprobado',
      }),
    ])
    return NextResponse.json({ status: 'approved' })
  }

  if (result.status === 'in_process' || result.status === 'pending') {
    return NextResponse.json({ status: result.status })
  }

  return NextResponse.json(
    { error: result.status_detail ?? 'Pago rechazado' },
    { status: 422 }
  )
}
