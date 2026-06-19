import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const MAX_ATTEMPTS  = 5
const WINDOW_MS     = 15 * 60 * 1000 // 15 minutos

function getIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const real      = request.headers.get('x-real-ip')
  const raw       = forwarded?.split(',')[0].trim() ?? real ?? 'anonymous'
  return raw
}

/**
 * Verifica el rate limit para una ruta y una IP.
 * Retorna un NextResponse 429 si se superó el límite, null si está OK.
 * Falla abierta: si hay error en Supabase, deja pasar la request.
 */
export async function checkRateLimit(request: Request, route: string): Promise<NextResponse | null> {
  const ip  = getIp(request)
  const key = `${route}:${ip}`

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString()

  const { data, error } = await supabase
    .from('rate_limits')
    .select('attempts, window_start')
    .eq('key', key)
    .single()

  // Error que no sea "not found" → fail open
  if (error && error.code !== 'PGRST116') return null

  // Sin registro o ventana expirada → nueva ventana
  if (!data || data.window_start < windowStart) {
    await supabase.from('rate_limits').upsert({
      key,
      attempts:     1,
      window_start: new Date().toISOString(),
    }, { onConflict: 'key' })
    return null
  }

  // Límite superado
  if (data.attempts >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Esperá 15 minutos antes de volver a intentar.' },
      { status: 429, headers: { 'Retry-After': '900' } }
    )
  }

  // Incrementar contador
  await supabase.from('rate_limits')
    .update({ attempts: data.attempts + 1 })
    .eq('key', key)

  return null
}
