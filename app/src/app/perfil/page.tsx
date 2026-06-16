'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'

type Socio = {
  nombre: string
  apellido: string
  numero_socio: string
  categoria: string
  cuota_al_dia: boolean
  foto_url: string | null
}

const PRECIOS_CUOTA: Record<string, number> = {
  'Infantiles -13': 2190,
  'Juveniles -21':  2890,
  'Mayores +22':    3490,
  'Cuota Familiar': 6590,
  'Fitness':        2190,
  'Cuota Amigo':    890,
}

function getPrecioCuota(cat?: string) {
  return PRECIOS_CUOTA[cat ?? ''] ?? 3490
}

export default function PerfilPage() {
  const [socio, setSocio]     = useState<Socio | null>(null)
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [subiendo, setSubiendo] = useState(false)
  const fileRef  = useRef<HTMLInputElement>(null)
  const router   = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('socios').select('*').eq('id', user.id).single()
      setSocio(data)
      if (data?.foto_url) {
        const { data: url } = supabase.storage.from('avatars').getPublicUrl(data.foto_url)
        setFotoUrl(url.publicUrl)
      }
      setLoading(false)
    }
    cargar()
  }, [])

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSubiendo(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const ext  = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!error) {
      await supabase.from('socios').update({ foto_url: path }).eq('id', user.id)
      const { data: url } = supabase.storage.from('avatars').getPublicUrl(path)
      setFotoUrl(url.publicUrl)
    }
    setSubiendo(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <main className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
      <div className="w-5 h-5 border border-white/20 border-t-white/60 rounded-full animate-spin" />
    </main>
  )

  const iniciales = `${socio?.nombre?.[0] ?? ''}${socio?.apellido?.[0] ?? ''}`
  const precio    = getPrecioCuota(socio?.categoria)

  return (
    <main className="min-h-screen bg-[#0A0A0C] flex flex-col pb-36">

      {/* ── Header ── */}
      <div className="px-6 pt-20 mb-10">
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
          marginBottom: '20px',
        }}>
          Mi perfil
        </p>

        {/* ── Credencial ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #1a2952 0%, #0d1730 100%)', padding: '24px' }}
        >
          {/* Glow sutil */}
          <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, #B8975A 0%, transparent 70%)', transform: 'translate(20%,-20%)' }} />

          {/* Top row */}
          <div className="flex items-start justify-between mb-7">
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
                Lobos Rugby Club
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.15)', marginTop: '2px' }}>
                Maldonado · Uruguay
              </p>
            </div>
            <img src="/lobos-logo.png" alt="Lobos" className="w-9 h-9 object-contain opacity-80" />
          </div>

          {/* Avatar + nombre */}
          <div className="flex items-center gap-4 mb-7">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative flex-shrink-0 active:opacity-70 transition-opacity"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
                {fotoUrl
                  ? <img src={fotoUrl} alt="foto" className="w-full h-full object-cover" />
                  : <span className="font-serif text-white text-xl font-semibold">{iniciales}</span>
                }
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: '#B8975A', border: '1.5px solid #0d1730' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </button>

            <div>
              <h2 className="font-serif text-white leading-tight" style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em' }}>
                {socio ? `${socio.nombre} ${socio.apellido}` : '—'}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.38)', marginTop: '2px', letterSpacing: '0.08em' }}>
                {socio?.categoria ?? 'Socio'}
              </p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B8975A', marginTop: '6px', display: 'block' }}
                className="active:opacity-50 transition-opacity"
              >
                Cambiar foto
              </button>
            </div>
          </div>

          {/* Footer de la credencial */}
          <div className="flex items-end justify-between pt-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '4px' }}>
                N° de socio
              </p>
              <p className="font-mono text-white" style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '0.12em' }}>
                {socio?.numero_socio ? `#${socio.numero_socio}` : '—'}
              </p>
            </div>
            <div className="text-right">
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '4px' }}>
                Estado
              </p>
              <div className="flex items-center gap-1.5 justify-end">
                <span className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 700, color: socio?.cuota_al_dia ? '#34d399' : '#f87171' }}>
                  {socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
          {subiendo && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-3xl backdrop-blur-sm">
              <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </motion.div>
      </div>

      {/* Divisor */}
      <div className="mx-6 mb-10" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* ── Cuota ── */}
      <div className="px-6 mb-10">
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '20px' }}>
          Cuota
        </p>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-serif text-white" style={{ fontSize: '32px', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>
              $U {precio.toLocaleString('es-UY')}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginTop: '5px' }}>
              {socio?.categoria ?? 'Cuota mensual'} · por mes
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: socio?.cuota_al_dia ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)', border: `1px solid ${socio?.cuota_al_dia ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}` }}>
            <span className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, color: socio?.cuota_al_dia ? '#34d399' : '#f87171' }}>
              {socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}
            </span>
          </div>
        </div>

        <button
          onClick={() => router.push('/cuota')}
          className="w-full py-3.5 rounded-2xl active:opacity-75 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.70)' }}
        >
          {socio?.cuota_al_dia ? 'Ver tabla de cuotas' : 'Ver cuotas →'}
        </button>
      </div>

      {/* Divisor */}
      <div className="mx-6 mb-10" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* ── Datos ── */}
      <div className="px-6 mb-10">
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '20px' }}>
          Datos
        </p>

        <div className="flex flex-col">
          {[
            { label: 'Nombre completo', value: socio ? `${socio.nombre} ${socio.apellido}` : '—' },
            { label: 'Categoría',       value: socio?.categoria  ?? '—' },
            { label: 'N° de socio',     value: socio?.numero_socio ? `#${socio.numero_socio}` : '—' },
          ].map(({ label, value }, i, arr) => (
            <div key={label}
              className={`flex items-center justify-between py-4 ${i < arr.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.28)' }}>
                {label}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div className="mx-6 mb-10" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* ── Cerrar sesión ── */}
      <div className="px-6">
        <button
          onClick={handleSignOut}
          className="w-full py-4 rounded-2xl active:opacity-60 transition-opacity"
          style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'rgba(248,113,113,0.65)', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.12)' }}
        >
          Cerrar sesión
        </button>
      </div>

      <NavBar />
    </main>
  )
}
