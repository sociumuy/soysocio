'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Socio = {
  nombre: string
  apellido: string
  numero_socio: string
  categoria: string
  cuota_al_dia: boolean
}

export default function HomePage() {
  const [socio, setSocio] = useState<Socio | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function cargarSocio() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('socios')
        .select('*')
        .eq('id', user.id)
        .single()

      setSocio(data)
      setLoading(false)
    }

    cargarSocio()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#B8975A] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* Header */}
      <div className="bg-[#0D0D0D] px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <svg width="26" height="30" viewBox="0 0 76 88" fill="none">
              <path d="M38 2L72 14V48C72 66 38 86 38 86C38 86 4 66 4 48V14L38 2Z"
                fill="url(#hsg)" stroke="rgba(184,151,90,0.3)" strokeWidth="1" />
              <text x="38" y="52" textAnchor="middle"
                fontFamily="Georgia,serif" fontSize="18" fontWeight="600"
                fill="white" letterSpacing="1">CC</text>
              <defs>
                <linearGradient id="hsg" x1="4" y1="2" x2="72" y2="86" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#C9A86C" />
                  <stop offset="100%" stopColor="#8B6A32" />
                </linearGradient>
              </defs>
            </svg>
            <div>
              <div className="text-white text-sm font-semibold">Club Carrasco</div>
              <div className="text-[#B8975A] text-xs">Socio Activo</div>
            </div>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
            className="text-[#555] text-xs hover:text-white transition-colors"
          >
            Salir
          </button>
        </div>

        <div className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-widest mb-1">
          Bienvenido de vuelta
        </div>
        <h1 className="text-white text-4xl font-serif font-semibold leading-tight">
          Hola, <em>{socio?.nombre ?? 'Socio'}</em>
        </h1>
      </div>

      {/* Contenido */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-8 flex flex-col gap-5">

        {/* Cuota card */}
        <div className={`rounded-2xl p-5 ${socio?.cuota_al_dia ? 'bg-[#0D0D0D]' : 'bg-[#7D1A1A]'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[rgba(255,255,255,0.5)] text-xs uppercase tracking-widest">
              Mi Cuota
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${socio?.cuota_al_dia ? 'text-[#B8975A]' : 'text-red-300'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-[#B8975A]' : 'bg-red-400'}`} />
              {socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}
            </div>
          </div>
          <div className="text-white font-serif text-3xl font-semibold mb-1">$2.400</div>
          <div className="text-[rgba(255,255,255,0.35)] text-xs mb-4">UYU · mensual</div>
          <button className="w-full bg-[#B8975A] text-white rounded-xl py-3 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity">
            Pagar cuota
          </button>
        </div>

        {/* Próxima reserva */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-[#888] text-xs uppercase tracking-widest mb-3">Próxima reserva</div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F4F3EF] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <div className="text-[#0D0D0D] text-sm font-bold">Gimnasio</div>
              <div className="text-[#888] text-xs">Jueves · 09:00 hs</div>
            </div>
          </div>
        </div>

        {/* Noticias */}
        <div>
          <div className="text-[#888] text-xs uppercase tracking-widest mb-3">Novedades</div>
          <div className="flex flex-col gap-2">
            {[
              { titulo: 'Torneo de verano — Inscripciones abiertas', fecha: 'Hoy · 10:30 hs' },
              { titulo: 'Nueva colección de indumentaria disponible', fecha: 'Ayer · 15:00 hs' },
              { titulo: 'Asamblea ordinaria — 15 de junio, 19 hs', fecha: 'Jun 5 · 09:00 hs' },
            ].map((n, i) => (
              <div key={i} className="bg-white rounded-xl px-4 py-3.5 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow">
                <div className={`w-1 h-8 rounded-full flex-shrink-0 ${i === 0 ? 'bg-[#B8975A]' : 'bg-[#E0DED9]'}`} />
                <div>
                  <div className="text-[#0D0D0D] text-sm font-semibold leading-snug">{n.titulo}</div>
                  <div className="text-[#aaa] text-xs mt-0.5">{n.fecha}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
