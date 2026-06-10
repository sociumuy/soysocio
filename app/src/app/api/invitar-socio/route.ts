import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { nombre, apellido, email, numero_socio, categoria, club_id } = await request.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let userId: string

  // Intentar invitar al usuario
  const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { nombre, apellido },
    redirectTo: 'https://soysocio.vercel.app/home',
  })

  if (inviteError) {
    // El email ya existe — buscar el user en auth.users por email
    const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const existingUser = users.find(u => u.email === email)

    if (!existingUser) {
      return NextResponse.json({ error: 'No se pudo vincular la cuenta existente. Verificá el email.' }, { status: 400 })
    }
    userId = existingUser.id
  } else {
    userId = inviteData.user.id
  }

  // Insertar el socio (id se genera automáticamente, user_id vincula al login)
  const { error: socioError } = await supabase.from('socios').insert({
    nombre,
    apellido,
    email,
    numero_socio,
    categoria,
    club_id,
    user_id: userId,
    cuota_al_dia: false,
  })

  if (socioError) {
    return NextResponse.json({ error: socioError.message }, { status: 400 })
  }

  const yaExistia = !!inviteError
  return NextResponse.json({ success: true, yaExistia })
}
