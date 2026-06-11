'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import NavBar from '@/components/NavBar'

type Socio = {
  id: string
  nombre: string
  apellido: string
  numero_socio: string
  cuota_al_dia: boolean
}

export default function CuotaPage() {
  const [socio, setSocio] = useState<Socio | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('socios').select('*').eq('id', user.id).single()
      setSocio(data)
      setLoading(false)
    }
    cargar()
  }, [])

  if (loading) return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[var(--club-primary)] border-t-transparent rounded-full animate-spin" />
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <div className="px-5 pt-12 pb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 text-xs mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
        <h1 className="text-white font-serif text-3xl font-semibold">Cuota</h1>
      </div>

      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-32 flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-[#888] text-xs uppercase tracking-widest mb-4">Estado</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#0D0D0D] text-lg font-mono font-semibold">$2.400 UYU</div>
              <div className="text-[#aaa] text-xs mt-0.5">Cuota mensual</div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${socio?.cuota_al_dia ? 'bg-[#EAF7EE] text-[#219653]' : 'bg-[#FEF0F0] text-[#C0392B]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-[#219653]' : 'bg-[#C0392B]'}`} />
              {socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}
            </div>
          </div>
        </div>
      </div>

      <NavBar />
    </main>
  )
}
