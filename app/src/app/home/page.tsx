'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'
import PremiumButton from '@/components/PremiumButton'
import AnimatedNumber from '@/components/AnimatedNumber'
import GrainOverlay from '@/components/GrainOverlay'
import ShiftCard from '@/components/ShiftCard'
import DynamicIsland from '@/components/DynamicIsland'
import { getStoredClub } from '@/lib/club-storage'

type Socio = {
  id: string
  nombre: string
  apellido: string
  numero_socio: string
  categoria: string
  cuota_al_dia: boolean
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } },
  item: {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
  },
}

export default function HomePage() {
  const [socios, setSocios] = useState<Socio[]>([])
  const [socioActivo, setSocioActivo] = useState<Socio | null>(null)
  const [loading, setLoading] = useState(true)
  const [cuotaExpanded, setCuotaExpanded] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const storedClub = getStoredClub()

  useEffect(() => {
    async function cargar() {
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
    cargar()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-7 h-7 rounded-full border-2 border-[#B8975A] border-t-transparent" />
      </main>
    )
  }

  const socio = socioActivo
  const clubNombre = storedClub?.nombre ?? 'Club Carrasco'

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* ── Dynamic Island ── */}
      <DynamicIsland
        clubNombre={clubNombre}
        cuotaAlDia={socio?.cuota_al_dia ?? false}
        socioCat={socio?.categoria ?? 'Socio'}
      />

      {/* ── Dark header ── */}
      <div className="relative bg-[#0D0D0D] px-5 pt-16 pb-8 overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="pointer-events-none absolute top-0 right-0 w-56 h-56 rounded-full opacity-[0.18]"
          style={{ background: 'radial-gradient(circle, rgba(184,151,90,0.5) 0%, transparent 70%)', transform: 'translate(35%,-35%)' }} />

        {/* top bar */}
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-serif font-bold text-sm"
              style={{ background: storedClub ? `linear-gradient(135deg, ${storedClub.gradiente[0]}, ${storedClub.gradiente[1]})` : 'linear-gradient(135deg,#C9A86C,#8B6A32)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
              {storedClub?.iniciales ?? 'CC'}
            </div>
            <div>
              <div className="text-white text-sm font-semibold">{clubNombre}</div>
              <div className="flex items-center gap-1.5">
                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 text-[10px] font-semibold tracking-wider">EN LÍNEA</span>
              </div>
            </div>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
            className="text-[#3a3a3a] text-xs hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/15">
            Salir
          </button>
        </div>

        {/* Greeting */}
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-white/30 text-[10px] uppercase tracking-[3px] mb-1">
            Bienvenido de vuelta
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="font-serif text-5xl font-semibold leading-none"
            style={{ background: 'linear-gradient(135deg, #ffffff 30%, rgba(184,151,90,0.75) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {socio?.nombre ?? 'Socio'}
          </motion.h1>

          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(184,151,90,0.08)', border: '1px solid rgba(184,151,90,0.18)' }}>
            <span className="text-[#B8975A] text-[10px] font-bold tracking-widest uppercase">{socio?.categoria ?? 'Socio'}</span>
            <span className="text-[#333]">·</span>
            <span className="text-[#555] text-[10px]">N° {socio?.numero_socio ?? '—'}</span>
          </motion.div>
        </div>

        {/* Family selector */}
        {socios.length > 1 && (
          <div className="relative z-10 flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {socios.map(s => (
              <button key={s.id} onClick={() => setSocioActivo(s)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${socioActivo?.id === s.id ? 'bg-[#B8975A] text-white' : 'bg-white/8 text-[#666]'}`}>
                <span className="w-5 h-5 rounded-full bg-[#B8975A]/30 flex items-center justify-center text-[10px] font-bold text-[#B8975A]">{s.nombre[0]}</span>
                {s.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Cream content ── */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-5 pb-32">
        <motion.div variants={stagger.container} initial="initial" animate="animate" className="flex flex-col gap-4">

          {/* ── Expandable Cuota Card ── */}
          <motion.div variants={stagger.item}>
            <ShiftCard intensity={4} className="w-full">
              <motion.div
                layout
                onClick={() => setCuotaExpanded(v => !v)}
                className="relative overflow-hidden rounded-2xl cursor-pointer"
                style={{
                  background: socio?.cuota_al_dia
                    ? 'linear-gradient(135deg, #111 0%, #1c1c1c 100%)'
                    : 'linear-gradient(135deg, #4a0f0f 0%, #7D1A1A 100%)',
                }}
                transition={{ layout: { duration: 0.4, ease } }}
              >
                <GrainOverlay opacity={0.07} />
                <div className="pointer-events-none absolute top-0 right-0 w-44 h-44 rounded-full opacity-25"
                  style={{
                    background: `radial-gradient(circle, ${socio?.cuota_al_dia ? 'rgba(184,151,90,0.6)' : 'rgba(255,80,80,0.4)'} 0%, transparent 70%)`,
                    transform: 'translate(30%,-30%)',
                  }} />

                {/* Main content */}
                <div className="relative z-10 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/40 text-[10px] uppercase tracking-[3px]">
                      {socios.length > 1 ? `Cuota — ${socio?.nombre}` : 'Mi Cuota'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${socio?.cuota_al_dia ? 'text-[#B8975A]' : 'text-red-300'}`}>
                        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                          className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-[#B8975A]' : 'bg-red-400'}`} />
                        {socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}
                      </div>
                      <motion.div animate={{ rotate: cuotaExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-white/40 font-serif text-xl">$</span>
                    <span className="text-white font-serif text-5xl font-semibold tracking-tight leading-none">
                      <AnimatedNumber value={2400} />
                    </span>
                  </div>
                  <p className="text-white/20 text-xs tracking-wider mb-4">UYU · mensual</p>

                  <PremiumButton onClick={(e) => { e?.stopPropagation(); router.push('/cuota') }} fullWidth size="lg">
                    {socio?.cuota_al_dia ? 'Ver historial de pagos' : 'Pagar cuota ahora'}
                  </PremiumButton>
                </div>

                {/* ── Expanded: historial mini ── */}
                <AnimatePresence>
                  {cuotaExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="relative z-10 overflow-hidden"
                    >
                      <div className="h-px bg-white/8 mx-5" />
                      <div className="p-5 pt-4">
                        <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Últimos 3 meses</p>
                        {[
                          { mes: 'Junio 2026', estado: socio?.cuota_al_dia },
                          { mes: 'Mayo 2026', estado: true },
                          { mes: 'Abril 2026', estado: true },
                        ].map(({ mes, estado }) => (
                          <div key={mes} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                            <span className="text-white/60 text-xs">{mes}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${estado ? 'bg-emerald-400/15 text-emerald-400' : 'bg-red-400/15 text-red-400'}`}>
                              {estado ? '✓ Pagado' : '✗ Pendiente'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ShiftCard>
          </motion.div>

          {/* ── Quick stats ── */}
          <motion.div variants={stagger.item} className="grid grid-cols-2 gap-3">
            {[
              { label: 'Reservas activas', value: '1', sub: 'esta semana', color: '#1A5C9E' },
              { label: 'Novedades', value: '3', sub: 'sin leer', color: '#B8975A' },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
                <div className="font-serif text-3xl font-semibold mb-1" style={{ color }}>{value}</div>
                <div className="text-[#0D0D0D] text-xs font-bold leading-tight">{label}</div>
                <div className="text-[#bbb] text-[10px] mt-0.5">{sub}</div>
              </div>
            ))}
          </motion.div>

          {/* ── Próxima reserva ── */}
          <motion.div variants={stagger.item}>
            <motion.div whileTap={{ scale: 0.98 }} onClick={() => router.push('/reservas')}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 cursor-pointer">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(184,151,90,0.12), rgba(184,151,90,0.04))', border: '1px solid rgba(184,151,90,0.18)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[#aaa] text-[10px] uppercase tracking-wider mb-0.5">Próxima reserva</p>
                <p className="text-[#0D0D0D] text-sm font-bold">Gimnasio</p>
                <p className="text-[#aaa] text-xs">Jueves · 09:00 hs</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F4F3EF] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Novedades preview ── */}
          <motion.div variants={stagger.item}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#888] text-[10px] uppercase tracking-widest">Novedades</p>
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
                <motion.div key={i} onClick={() => router.push('/novedades')} whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm flex cursor-pointer">
                  <div className="w-1 flex-shrink-0" style={{ background: n.color }} />
                  <div className="flex-1 px-4 py-3 flex items-center gap-3 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-[#0D0D0D] text-sm font-semibold leading-snug truncate">{n.titulo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${n.color}18`, color: n.color }}>{n.tag}</span>
                        <span className="text-[#ccc] text-[10px]">{n.fecha}</span>
                      </div>
                    </div>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
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
