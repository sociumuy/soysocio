'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import GrainOverlay from '@/components/GrainOverlay'
import BorderBeamButton from '@/components/BorderBeamButton'
import { getStoredClub } from '@/lib/club-storage'

function LoginForm() {
  const searchParams = useSearchParams()
  const rol = searchParams.get('rol') ?? 'socio'
  const esAdmin = rol === 'admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const storedClub = getStoredClub()

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
    <main className="relative min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 overflow-hidden">

      <GrainOverlay opacity={0.05} />

      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(184,151,90,0.2) 0%, transparent 70%)' }}
        />
      </div>

      {/* Shield */}
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center mb-8"
      >
        <div className="relative mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-12px] rounded-full border border-dashed opacity-15"
            style={{ borderColor: '#B8975A' }}
          />
          <svg width="60" height="70" viewBox="0 0 76 88" fill="none">
            <path d="M38 2L72 14V48C72 66 38 86 38 86C38 86 4 66 4 48V14L38 2Z"
              fill="url(#sg)" stroke="rgba(184,151,90,0.35)" strokeWidth="1" />
            <path d="M38 10L64 20V48C64 63 38 78 38 78C38 78 12 63 12 48V20L38 10Z"
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            {esAdmin ? (
              <polyline points="30 44 35 49 46 38" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
            ) : (
              <>
                <circle cx="38" cy="36" r="5" fill="white" opacity="0.9" />
                <path d="M27 52c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
              </>
            )}
            <defs>
              <linearGradient id="sg" x1="4" y1="2" x2="72" y2="86" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C9A86C" />
                <stop offset="100%" stopColor="#8B6A32" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="font-serif text-2xl font-semibold"
          style={{ background: storedClub ? `linear-gradient(135deg, ${storedClub.gradiente[2]} 0%, #fff 50%, ${storedClub.gradiente[2]} 100%)` : 'linear-gradient(135deg, #fff 40%, rgba(184,151,90,0.8) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {storedClub?.nombre ?? 'SoySocio'}
        </h1>

        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest"
          style={{
            background: esAdmin ? 'rgba(184,151,90,0.15)' : 'rgba(255,255,255,0.07)',
            color: esAdmin ? '#B8975A' : 'rgba(255,255,255,0.4)',
            border: `1px solid ${esAdmin ? 'rgba(184,151,90,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          {esAdmin ? '⚙ Administrador' : '◎ Socio'}
        </motion.span>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-48 h-px mt-5"
          style={{ background: 'linear-gradient(to right, transparent, rgba(184,151,90,0.4), transparent)' }}
        />
      </motion.div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: 'rgba(255,255,255,0.97)' }}
      >
        {/* top accent bar */}
        <div className="h-0.5 w-full" style={{ background: 'linear-gradient(to right, transparent, #B8975A, transparent)' }} />

        <div className="p-7">
          <h2 className="text-[#0D0D0D] text-xl font-bold mb-1">
            {esAdmin ? 'Acceso administrativo' : 'Bienvenido de vuelta'}
          </h2>
          <p className="text-[#888] text-sm mb-6">
            {esAdmin ? 'Ingresá con tu cuenta del staff' : 'Ingresá a tu espacio de socio'}
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Correo electrónico</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="tu@email.com"
                className="border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors bg-[#FAFAF8]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Contraseña</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••"
                className="border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors bg-[#FAFAF8]"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs text-center bg-red-50 py-2 px-3 rounded-lg border border-red-100"
              >
                {error}
              </motion.p>
            )}

            <div className="mt-2">
              <BorderBeamButton
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Ingresando...
                  </span>
                ) : 'Ingresar'}
              </BorderBeamButton>
            </div>
          </form>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-5 w-full text-xs text-[#aaa] hover:text-[#0D0D0D] transition-colors flex items-center justify-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver al inicio
          </button>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 text-[#222] text-[10px] mt-8 tracking-widest"
      >
        Powered by <span style={{ color: 'rgba(184,151,90,0.5)' }}>SoySocio</span>
      </motion.p>

    </main>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
