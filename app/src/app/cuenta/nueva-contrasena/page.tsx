'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NuevaContrasenaPage() {
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('No pudimos actualizar la contraseña. Intentá de nuevo.')
      setLoading(false)
      return
    }

    router.push('/home')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0D0D0D] px-6">
      <div className="w-full max-w-sm">

        <h1 className="text-white font-serif text-3xl font-semibold mb-2">Nueva contraseña</h1>
        <p className="text-[#555] text-sm mb-8">Elegí una contraseña segura para tu cuenta.</p>

        <form onSubmit={handleGuardar} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#555] uppercase tracking-wider">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Mínimo 8 caracteres"
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#B8975A] transition-colors placeholder:text-[#444]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#555] uppercase tracking-wider">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              required
              placeholder="Repetí la contraseña"
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#B8975A] transition-colors placeholder:text-[#444]"
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#B8975A] text-white rounded-xl py-3.5 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </main>
  )
}
