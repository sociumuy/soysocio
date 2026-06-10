'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
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

    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    // Detectar rol: admin o socio
    const userId = authData.user?.id
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('id')
      .eq('id', userId)
      .single()

    if (adminData) {
      window.location.href = '/admin'
    } else {
      window.location.href = '/home'
    }
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
          <text x="38" y="52" textAnchor="middle"
            fontFamily="Georgia, serif" fontSize="18" fontWeight="600"
            fill="white" letterSpacing="1">CC</text>
          <defs>
            <linearGradient id="shield-grad" x1="4" y1="2" x2="72" y2="86" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C9A86C" />
              <stop offset="100%" stopColor="#8B6A32" />
            </linearGradient>
          </defs>
        </svg>
        <h1 className="font-serif text-white text-2xl font-semibold tracking-wide">Club Carrasco</h1>
        <p className="text-[#B8975A] text-xs tracking-[3px] uppercase mt-1">Montevideo · Uruguay</p>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#B8975A]/40 to-transparent mt-6" />
      </div>

      {/* Card de login */}
      <div className="w-full max-w-sm bg-white rounded-2xl p-7 shadow-xl">
        <h2 className="text-[#0D0D0D] text-xl font-bold mb-1">Bienvenido</h2>
        <p className="text-[#888] text-sm mb-6">Ingresá a tu espacio de socio</p>

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
            onClick={() => router.push('/login/recuperar')}
            className="text-xs text-[#B8975A] hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
          <p className="text-center text-xs text-[#aaa]">
            ¿Problemas para ingresar?{' '}
            <span className="text-[#B8975A] cursor-pointer hover:underline">
              Contactá al club
            </span>
          </p>
        </div>
      </div>

      <p className="text-[#333] text-xs mt-8 tracking-wider">
        Powered by <span className="text-[#B8975A]">SoySocio</span>
      </p>
    </main>
  )
}
