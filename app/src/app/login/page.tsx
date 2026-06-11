'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { getStoredClub } from '@/lib/club-storage'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

function LoginForm() {
  const searchParams = useSearchParams()
  const rol = searchParams.get('rol') ?? 'socio'
  const esAdmin = rol === 'admin'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const router   = useRouter()
  const supabase = createClient()
  const club     = getStoredClub()

  const primary  = club?.color_primario ?? '#C8940A'
  const rgb      = club?.color_rgb      ?? '200, 148, 10'
  const iniciales = club?.iniciales     ?? 'DC'

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    const userId = authData.user?.id
    const { data: adminData } = await supabase.from('admins').select('id').eq('id', userId).single()
    const esAdminReal = !!adminData

    if (esAdmin && !esAdminReal) {
      await supabase.auth.signOut()
      setError('Esta cuenta no tiene acceso de administrador. Ingresá como socio.')
      setLoading(false)
      return
    }

    if (!esAdmin && esAdminReal) {
      await supabase.auth.signOut()
      setError('Los administradores deben ingresar por el acceso de administrador.')
      setLoading(false)
      return
    }

    window.location.href = esAdminReal ? '/admin' : '/home'
  }

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      style={{ background: `linear-gradient(160deg, #08101f 0%, rgba(${rgb}, 0.10) 50%, #08101f 100%)` }}
    >
      {/* Glow ambiental del club */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[380px] h-[380px] rounded-full opacity-20"
        style={{ background: `radial-gradient(circle, rgba(${rgb}, 0.5) 0%, transparent 70%)` }}
      />

      {/* ── Identidad del club ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 flex flex-col items-center mb-8 gap-3"
      >
        {/* Logo o iniciales */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
          style={{
            background: `rgba(${rgb}, 0.12)`,
            border: `1.5px solid rgba(${rgb}, 0.28)`,
          }}
        >
          {club?.logo_url
            ? <img src={club.logo_url} alt={club.nombre} className="w-full h-full object-contain p-2" />
            : <span className="font-sans text-2xl font-black text-white">{iniciales}</span>
          }
        </div>

        {/* Nombre del club */}
        <div className="text-center">
          <h1 className="font-sans text-xl font-bold text-white tracking-tight">
            {club?.nombre ?? 'DelClub'}
          </h1>
          <span
            className="inline-block mt-2 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-[3px]"
            style={{
              background: `rgba(${rgb}, 0.14)`,
              color: primary,
              border: `1px solid rgba(${rgb}, 0.28)`,
            }}
          >
            {esAdmin ? 'Administrador' : 'Socio'}
          </span>
        </div>

        {/* Separador */}
        <div
          className="w-28 h-px mt-1"
          style={{ background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.45), transparent)` }}
        />
      </motion.div>

      {/* ── Formulario ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
        className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid rgba(${rgb}, 0.16)`,
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Línea de acento superior */}
        <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, ${primary}, transparent)` }} />

        <div className="p-6">
          <h2 className="text-white text-lg font-bold font-sans mb-0.5">
            {esAdmin ? 'Acceso administrativo' : 'Bienvenido de vuelta'}
          </h2>
          <p className="text-sm mb-6 font-sans" style={{ color: 'rgba(255,255,255,0.38)' }}>
            {esAdmin ? 'Ingresá con tu cuenta del staff' : 'Ingresá a tu espacio de socio'}
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold uppercase tracking-[3px]"
                style={{ color: `rgba(${rgb}, 0.75)` }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
                className="rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  caretColor: primary,
                }}
                placeholder-style="color: rgba(255,255,255,0.2)"
                onFocus={e => {
                  e.target.style.borderColor = `rgba(${rgb}, 0.45)`
                  e.target.style.background  = 'rgba(255,255,255,0.09)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.10)'
                  e.target.style.background  = 'rgba(255,255,255,0.06)'
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[10px] font-bold uppercase tracking-[3px]"
                style={{ color: `rgba(${rgb}, 0.75)` }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  caretColor: primary,
                }}
                onFocus={e => {
                  e.target.style.borderColor = `rgba(${rgb}, 0.45)`
                  e.target.style.background  = 'rgba(255,255,255,0.09)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.10)'
                  e.target.style.background  = 'rgba(255,255,255,0.06)'
                }}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-center py-2 px-3 rounded-lg"
                style={{
                  color: '#f87171',
                  background: 'rgba(239,68,68,0.10)',
                  border: '1px solid rgba(239,68,68,0.18)',
                }}
              >
                {error}
              </motion.p>
            )}

            {/* Botón flat premium */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl text-sm font-bold uppercase tracking-[3px] transition-opacity active:opacity-75 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: primary, color: '#fff' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : 'Ingresar'}
            </button>
          </form>

          {/* Volver */}
          <button
            onClick={() => router.push('/')}
            className="w-full mt-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-opacity active:opacity-60"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver al inicio
          </button>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="relative z-10 text-[9px] mt-8 tracking-widest"
        style={{ color: 'rgba(255,255,255,0.14)' }}
      >
        Powered by <span style={{ color: `rgba(${rgb}, 0.35)` }}>DelClub</span>
      </motion.p>
    </main>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
