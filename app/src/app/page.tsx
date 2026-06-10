'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setVerificando(false); return }

      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single()

      window.location.href = adminData ? '/admin' : '/home'
    }
    checkSession()
  }, [])

  if (verificando) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#B8975A] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-between px-6 py-14">

      {/* Logo */}
      <div className="flex flex-col items-center mt-8">
        <svg width="52" height="60" viewBox="0 0 76 88" fill="none">
          <path d="M38 2L72 14V48C72 66 38 86 38 86C38 86 4 66 4 48V14L38 2Z"
            fill="url(#lsg)" stroke="rgba(184,151,90,0.3)" strokeWidth="1" />
          <path d="M38 10L64 20V48C64 63 38 78 38 78C38 78 12 63 12 48V20L38 10Z"
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <defs>
            <linearGradient id="lsg" x1="4" y1="2" x2="72" y2="86" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C9A86C" />
              <stop offset="100%" stopColor="#8B6A32" />
            </linearGradient>
          </defs>
        </svg>
        <h1 className="text-white font-serif text-2xl font-semibold mt-4 tracking-wide">SoySocio</h1>
        <p className="text-[#444] text-xs tracking-[3px] uppercase mt-1">Tu club, en tu bolsillo</p>
      </div>

      {/* Selector */}
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-[#888] text-xs uppercase tracking-[3px] mb-2">Bienvenido</p>
          <h2 className="text-white font-serif text-3xl font-semibold leading-snug">
            ¿Qué función<br />cumplís en el club?
          </h2>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#B8975A]/30 to-transparent" />

        <div className="grid grid-cols-2 gap-4 w-full">
          {/* Socio */}
          <button
            onClick={() => router.push('/login?rol=socio')}
            className="group flex flex-col items-center gap-4 bg-[#111] border border-white/8 rounded-2xl px-4 py-7 hover:border-[#B8975A]/40 hover:bg-[#B8975A]/5 transition-all active:scale-95"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#B8975A]/10 border border-[#B8975A]/20 flex items-center justify-center group-hover:bg-[#B8975A]/20 transition-all">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-white text-sm font-bold tracking-widest uppercase">Socio</div>
              <div className="text-[#555] text-[11px] mt-1 leading-relaxed">Reservas, cuotas<br />y novedades</div>
            </div>
          </button>

          {/* Administrador */}
          <button
            onClick={() => router.push('/login?rol=admin')}
            className="group flex flex-col items-center gap-4 bg-[#111] border border-white/8 rounded-2xl px-4 py-7 hover:border-[#B8975A]/40 hover:bg-[#B8975A]/5 transition-all active:scale-95"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#B8975A]/10 border border-[#B8975A]/20 flex items-center justify-center group-hover:bg-[#B8975A]/20 transition-all">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.6" strokeLinecap="round">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-white text-sm font-bold tracking-widest uppercase">Admin</div>
              <div className="text-[#555] text-[11px] mt-1 leading-relaxed">Gestión del club<br />y sus miembros</div>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-[#2a2a2a] text-xs tracking-wider">
        Powered by <span className="text-[#B8975A]/60">SoySocio</span>
      </p>

    </main>
  )
}
