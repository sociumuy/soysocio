import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

// POST /api/stripe/onboard-club
// Crea una cuenta Stripe Express para el club y devuelve el link de onboarding.
// El admin del club accede a este link una sola vez para conectar su cuenta bancaria.
export async function POST(request: Request) {
  const { club_id } = await request.json()

  if (!club_id) {
    return NextResponse.json({ error: 'club_id requerido' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Verificar si el club ya tiene una cuenta Stripe
  const { data: club } = await supabase
    .from('clubes')
    .select('stripe_account_id, nombre')
    .eq('id', club_id)
    .single()

  if (!club) {
    return NextResponse.json({ error: 'Club no encontrado' }, { status: 404 })
  }

  let accountId = club.stripe_account_id

  // Si no tiene cuenta, crearla
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'UY',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        name: club.nombre,
        mcc: '7941', // Athletic clubs
      },
    })

    accountId = account.id

    // Guardar el stripe_account_id en Supabase
    await supabase
      .from('clubes')
      .update({ stripe_account_id: accountId })
      .eq('id', club_id)
  }

  // Generar link de onboarding
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin?stripe=refresh`,
    return_url:  `${process.env.NEXT_PUBLIC_APP_URL}/admin?stripe=success`,
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url })
}
