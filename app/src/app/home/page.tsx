'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import BorderBeamButton from '@/components/BorderBeamButton'
import AnimatedNumber from '@/components/AnimatedNumber'
import GrainOverlay from '@/components/GrainOverlay'
import ShiftCard from '@/components/ShiftCard'

type Socio = {
  id: string
  nombre: string
  apellido: string
  numero_socio: string
  categoria: string
  cuota_al_dia: boolean
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  },
}

export default function HomePage() {
  const [socios, setSocios] = useState<Socio[]>([])
  const [socioActivo, setSocioActivo] = useState<Socio | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function cargarSocios() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: adminCheck } = await supabase.from('admins').select('id').eq('id', user.id).single()
      if (adminCheck) { window.location.href = '/admin'; return }
      const { data } = await supabase
        .from('socios')
        .select('id, nombre, apellido, numero_socio, categoria, cuota_al_dia')
        .eq('user_id', user.id)
        .order('nombre')
      const lista = data ?? []
      setSocios(lista)
      setSocioActivo(lista[0] ?? null)
      setLoading(false)
    }
    cargarSocios()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#B8975A] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  const socio = socioActivo

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* ── Dark header ── */}
      <div className="relative bg-[#0D0D0D] px-5 pt-12 pb-8 overflow-hidden">
        <GrainOverlay opacity={0.05} />

        {/* ambient glow */}
        <div className="pointer-events-none absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(184,151,90,0.4) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

        {/* top bar */}
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg width="28" height="32" viewBox="0 0 76 88" fill="none">
                <path d="M38 2L72 14V48C72 66 38 86 38 86C38 86 4 66 4 48V14L38 2Z"
                  fill="url(#hsg)" stroke="rgba(184,151,90,0.3)" strokeWidth="1" />
                <text x="38" y="52" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="600" fill="white" letterSpacing="1">CC</text>
                <defs>
                  <linearGradient id="hsg" x1="4" y1="2" x2="72" y2="86" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#C9A86C" />
                    <stop offset="100%" stopColor="#8B6A32" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <div className="text-white text-sm font-semibold">Club Carrasco</div>
              <div className="flex items-center gap-1.5">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                />
                <span className="text-emerald-400 text-[10px] font-semibold tracking-wider">EN LÍNEA</span>
              </div>
            </div>
          </div>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
            className="text-[#444] text-xs hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/15"
          >
            Salir
          </button>
        </div>

        {/* greeting */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[rgba(255,255,255,0.35)] text-[10px] uppercase tracking-[3px] mb-2"
          >
            Bienvenido de vuelta
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl font-semibold leading-tight"
            style={{ background: 'linear-gradient(135deg, #fff 40%, rgba(184,151,90,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Hola, {socio?.nombre ?? 'Socio'}
          </motion.h1>

          {/* socio badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(184,151,90,0.1)', border: '1px solid rgba(184,151,90,0.2)' }}
          >
            <span className="text-[#B8975A] text-[10px] font-bold tracking-widest uppercase">{socio?.categoria ?? 'Socio'}</span>
            <span className="text-[#444] text-[10px]">·</span>
            <span className="text-[#666] text-[10px]">N° {socio?.numero_socio ?? '—'}</span>
          </motion.div>
        </div>

        {/* family selector */}
        {socios.length > 1 && (
          <div className="relative z-10 flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {socios.map(s => (
              <button
                key={s.id}
                onClick={() => setSocioActivo(s)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  socioActivo?.id === s.id ? 'bg-[#B8975A] text-white' : 'bg-white/8 text-[#888]'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#B8975A]/30 flex items-center justify-center text-[10px] font-bold text-[#B8975A]">
                  {s.nombre[0]}
                </span>
                {s.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Cream content ── */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-32">
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-4"
        >

          {/* ── Cuota card ── */}
          <motion.div variants={stagger.item}>
            <ShiftCard intensity={5} className="w-full">
              <div
                className="relative overflow-hidden rounded-2xl p-5"
                style={{
                  background: socio?.cuota_al_dia
                    ? 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)'
                    : 'linear-gradient(135deg, #5c1111 0%, #7D1A1A 100%)',
                }}
              >
                <GrainOverlay opacity={0.06} />

                {/* glow orb */}
                <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 rounded-full opacity-30"
                  style={{
                    background: socio?.cuota_al_dia
                      ? 'radial-gradient(circle, rgba(184,151,90,0.5) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(255,100,100,0.4) 0%, transparent 70%)',
                    transform: 'translate(30%, -30%)',
                  }} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[rgba(255,255,255,0.45)] text-[10px] uppercase tracking-[3px]">
                      {socios.length > 1 ? `Cuota — ${socio?.nombre}` : 'Mi Cuota'}
                    </span>
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${socio?.cuota_al_dia ? 'text-[#B8975A]' : 'text-red-300'}`}>
                      <motion.span
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-[#B8975A]' : 'bg-red-400'}`}
                      />
                      {socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-[rgba(255,255,255,0.5)] text-lg font-serif">$</span>
                    <span className="text-white font-serif text-5xl font-semibold tracking-tight">
                      <AnimatedNumber value={2400} />
                    </span>
                  </div>
                  <div className="text-[rgba(255,255,255,0.25)] text-xs mb-5 tracking-wider">UYU · mensual</div>

                  <BorderBeamButton onClick={() => router.push('/cuota')} className="w-full">
                    {socio?.cuota_al_dia ? 'Ver historial' : 'Pagar cuota'}
                  </BorderBeamButton>
                </div>
              </div>
            </ShiftCard>
          </motion.div>

          {/* ── Quick stats row ── */}
          <motion.div variants={stagger.item} className="grid grid-cols-2 gap-3">
            {[
              { label: 'Reservas activas', value: '1', icon: '📅' },
              { label: 'Novedades nuevas', value: '3', icon: '📰' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                <span className="text-lg">{icon}</span>
                <div className="text-[#0D0D0D] text-2xl font-serif font-semibold">{value}</div>
                <div className="text-[#aaa] text-[10px] uppercase tracking-wider leading-tight">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* ── Próxima reserva ── */}
          <motion.div variants={stagger.item}>
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(184,151,90,0.15), rgba(184,151,90,0.05))', border: '1px solid rgba(184,151,90,0.2)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-[#888] text-[10px] uppercase tracking-wider mb-1">Próxima reserva</div>
                <div className="text-[#0D0D0D] text-sm font-bold">Gimnasio</div>
                <div className="text-[#aaa] text-xs">Jueves · 09:00 hs</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F4F3EF] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </div>
          </motion.div>

          {/* ── Novedades ── */}
          <motion.div variants={stagger.item}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-[#888] text-[10px] uppercase tracking-widest">Novedades</div>
              <button onClick={() => router.push('/novedades')} className="text-[#B8975A] text-xs font-semibold flex items-center gap-1">
                Ver todas
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { titulo: 'Torneo de verano — Inscripciones abiertas', fecha: 'Hoy', color: '#1A5C9E', tag: 'Torneos' },
                { titulo: 'Nueva colección de indumentaria disponible', fecha: 'Ayer', color: '#A03030', tag: 'Indumentaria' },
                { titulo: 'Asamblea ordinaria — 15 de junio', fecha: 'Jun 5', color: '#1A6B3A', tag: 'Institucional' },
              ].map((n, i) => (
                <motion.div
                  key={i}
                  onClick={() => router.push('/novedades')}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm flex cursor-pointer"
                >
                  <div className="w-1 flex-shrink-0" style={{ background: n.color }} />
                  <div className="flex-1 px-4 py-3 flex items-center gap-3 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="text-[#0D0D0D] text-sm font-semibold leading-snug truncate">{n.titulo}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${n.color}15`, color: n.color }}>{n.tag}</span>
                        <span className="text-[#ccc] text-[10px]">{n.fecha}</span>
                      </div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

      <NavBar />
    </main>
  )
}
