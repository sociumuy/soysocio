import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { nombre, apellido, email, numero_socio, categoria, club_id } = await request.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { nombre, apellido },
    redirectTo: 'https://soysocio.vercel.app/home',
  })

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 400 })
  }

  const { error: socioError } = await supabase.from('socios').insert({
    id: inviteData.user.id,
    nombre,
    apellido,
    email,
    numero_socio,
    categoria,
    club_id,
    cuota_al_dia: false,
  })

  if (socioError) {
    return NextResponse.json({ error: socioError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
