'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function RecuperarPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleRecuperar(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/cuenta/nueva-contrasena`,
    })

    if (error) {
      setError('No pudimos enviar el email. Verificá la dirección ingresada.')
      setLoading(false)
      return
    }

    setEnviado(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] px-6">
      <div className="w-full max-w-sm">

        <button
          onClick={() => router.push('/login')}
          className="flex items-center gap-2 text-[#555] text-xs mb-8 hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver al login
        </button>

        <h1 className="text-white font-serif text-3xl font-semibold mb-2">Recuperar acceso</h1>
        <p className="text-[#555] text-sm mb-8">
          Ingresá tu email y te mandamos un link para crear una nueva contraseña.
        </p>

        {enviado ? (
          <div className="bg-[#1a1a1a] border border-[var(--club-primary)]/30 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-[var(--club-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--club-primary)" strokeWidth="2" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-white font-semibold mb-1">Email enviado</p>
            <p className="text-[#555] text-sm">Revisá tu bandeja de entrada y seguí el link para crear tu nueva contraseña.</p>
          </div>
        ) : (
          <form onSubmit={handleRecuperar} className="flex flex-col gap-4">
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
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[var(--club-primary)] transition-colors placeholder:text-[#444]"
              />
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[var(--club-primary)] text-white rounded-xl py-3.5 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar link'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
