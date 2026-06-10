'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

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
    const { data: adminData } = await supabase
      .from('admins')
      .select('id')
      .eq('id', userId)
      .single()

    const esAdminReal = !!adminData

    // Validar que el rol seleccionado coincide con la cuenta
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
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] px-6">

      {/* Escudo */}
      <div className="mb-8 flex flex-col items-center">
        <svg className="mb-4" width="64" height="74" viewBox="0 0 76 88" fill="none">
          <path d="M38 2L72 14V48C72 66 38 86 38 86C38 86 4 66 4 48V14L38 2Z"
            fill="url(#shield-grad)" stroke="rgba(184,151,90,0.3)" strokeWidth="1" />
          <path d="M38 10L64 20V48C64 63 38 78 38 78C38 78 12 63 12 48V20L38 10Z"
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          {esAdmin ? (
            <polyline points="30 44 35 49 46 38" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : (
            <>
              <circle cx="38" cy="36" r="5" fill="white" opacity="0.9" />
              <path d="M27 52c0-6.075 4.925-11 11-11s11 4.925 11 11" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
            </>
          )}
          <defs>
            <linearGradient id="shield-grad" x1="4" y1="2" x2="72" y2="86" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C9A86C" />
              <stop offset="100%" stopColor="#8B6A32" />
            </linearGradient>
          </defs>
        </svg>
        <h1 className="font-serif text-white text-2xl font-semibold tracking-wide">Club Carrasco</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
            esAdmin ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'bg-white/10 text-white/50'
          }`}>
            {esAdmin ? 'Administrador' : 'Socio'}
          </span>
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#B8975A]/40 to-transparent mt-5" />
      </div>

      {/* Card de login */}
      <div className="w-full max-w-sm bg-white rounded-2xl p-7 shadow-xl">
        <h2 className="text-[#0D0D0D] text-xl font-bold mb-1">
          {esAdmin ? 'Acceso administrativo' : 'Bienvenido'}
        </h2>
        <p className="text-[#888] text-sm mb-6">
          {esAdmin ? 'Ingresá con tu cuenta del staff' : 'Ingresá a tu espacio de socio'}
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#555] uppercase tracking-wider">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="tu@email.com"
              className="border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#555] uppercase tracking-wider">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#0D0D0D] text-white rounded-xl py-3.5 text-sm font-bold tracking-widest uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2 mt-5">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-xs text-[#aaa] hover:text-[#0D0D0D] transition-colors flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver al inicio
          </button>
        </div>
      </div>

      <p className="text-[#333] text-xs mt-8 tracking-wider">
        Powered by <span className="text-[#B8975A]">SoySocio</span>
      </p>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
