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
          className="w-7 h-7 rounded-full border-2 border-[var(--club-primary)] border-t-transparent" />
      </main>
    )
  }

  const socio = socioActivo
  const clubNombre = storedClub?.nombre ?? 'Lobos Rugby Club'

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
          style={{ background: 'radial-gradient(circle, rgba(var(--club-primary-rgb),0.5) 0%, transparent 70%)', transform: 'translate(35%,-35%)' }} />

        {/* top bar */}
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {storedClub?.logo_url
                ? <img src={storedClub.logo_url} alt={clubNombre} className="w-full h-full object-contain p-1" />
                : <img src="/lobos-logo.png" alt="Lobos Rugby Club" className="w-full h-full object-contain p-1" />
              }
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

        {/* Club identity strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="relative z-10 flex items-center gap-3 mb-6 overflow-hidden">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-white/20 text-[9px] font-bold tracking-[4px] uppercase">Somos Familia · Punta del Este · Est. 1989</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>

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
            style={{ background: 'linear-gradient(135deg, #ffffff 30%, rgba(var(--club-primary-rgb),0.75) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {socio?.nombre ?? 'Socio'}
          </motion.h1>

          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(var(--club-primary-rgb),0.12)', border: '1px solid rgba(var(--club-primary-rgb),0.25)' }}>
            <span className="text-[var(--club-primary)] text-[10px] font-bold tracking-widest uppercase">{socio?.categoria ?? 'Socio'}</span>
            <span className="text-[#333]">·</span>
            <span className="text-[#555] text-[10px] font-mono">N° {socio?.numero_socio ?? '—'}</span>
          </motion.div>
        </div>

        {/* Family selector */}
        {socios.length > 1 && (
          <div className="relative z-10 flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {socios.map(s => (
              <button key={s.id} onClick={() => setSocioActivo(s)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${socioActivo?.id === s.id ? 'bg-[var(--club-primary)] text-white' : 'bg-white/8 text-[#666]'}`}>
                <span className="w-5 h-5 rounded-full bg-[var(--club-primary)]/30 flex items-center justify-center text-[10px] font-bold text-[var(--club-primary)]">{s.nombre[0]}</span>
                {s.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 bg-[#08101f] rounded-t-3xl px-5 pt-5 pb-32">
        <motion.div variants={stagger.container} initial="initial" animate="animate" className="flex flex-col gap-5">

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
                    background: `radial-gradient(circle, ${socio?.cuota_al_dia ? 'rgba(var(--club-primary-rgb),0.6)' : 'rgba(255,80,80,0.4)'} 0%, transparent 70%)`,
                    transform: 'translate(30%,-30%)',
                  }} />

                <div className="relative z-10 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/40 text-[10px] uppercase tracking-[3px]">
                      {socios.length > 1 ? `Cuota — ${socio?.nombre}` : 'Mi Cuota'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${socio?.cuota_al_dia ? 'text-[var(--club-primary)]' : 'text-red-300'}`}>
                        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
                          className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-[var(--club-primary)]' : 'bg-red-400'}`} />
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
                    <span className="text-white/40 font-mono text-xl">$</span>
                    <span className="text-white font-mono text-5xl font-semibold tracking-tight leading-none">
                      <AnimatedNumber value={2400} />
                    </span>
                  </div>
                  <p className="text-white/20 text-xs tracking-wider mb-4">UYU · mensual</p>

                  <div className="flex justify-center">
                    <button
                      onClick={(e) => { e?.stopPropagation(); router.push('/cuota') }}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase text-[#0D0D0D] transition-opacity active:opacity-80"
                      style={{ background: 'var(--club-primary)' }}
                    >
                      {socio?.cuota_al_dia ? 'Ver historial' : 'Pagar cuota'}
                    </button>
                  </div>
                </div>

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

          {/* ── Próximo partido ── */}
          <motion.div variants={stagger.item}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl overflow-hidden relative cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #1B2D6E 0%, #0f1d4a 100%)' }}
              onClick={() => router.push('/deportes')}
            >
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }} />
              <div className="relative z-10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round">
                      <ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-35 12 12)" />
                      <line x1="12" y1="4" x2="12" y2="20" />
                    </svg>
                    <span className="text-white/40 text-[9px] font-bold uppercase tracking-[3px]">Próximo Partido · Rugby Primera</span>
                  </div>
                  <span className="text-[var(--club-primary)] text-[9px] font-bold uppercase tracking-wider">SAB 14 JUN</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-1">
                    <img src="/lobos-logo.png" alt="Lobos" className="w-10 h-10 object-contain" />
                    <span className="text-white text-xs font-bold">Lobos RC</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-white/20 text-[10px] tracking-widest uppercase">vs</span>
                    <span className="text-white font-mono text-2xl font-bold tracking-widest mt-1">16:00</span>
                    <span className="text-white/30 text-[9px] mt-1">Cancha Principal</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">OB</span>
                    </div>
                    <span className="text-white text-xs font-bold">Old Boys</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Quick stats — tipografía pura, sin cards ── */}
          <motion.div variants={stagger.item}>
            <div className="flex items-center rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { label: 'Socios', value: '800+' },
                { label: 'Novedades', value: '3' },
                { label: 'Años', value: '35+' },
              ].map(({ label, value }, i) => (
                <div key={label} className="flex-1 flex flex-col items-center py-4"
                  style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span className="font-serif text-3xl font-bold leading-none" style={{ color: 'var(--club-primary)' }}>{value}</span>
                  <span className="text-white/30 text-[9px] font-bold uppercase tracking-[2px] mt-1.5">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Deportes — pills horizontales ── */}
          <motion.div variants={stagger.item}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[2px]"
                style={{ borderLeft: '3px solid var(--club-primary)', paddingLeft: '8px' }}>Deportes</p>
              <button onClick={() => router.push('/deportes')} className="text-[var(--club-primary)] text-xs font-semibold flex items-center gap-1 transition-opacity active:opacity-60">
                Ver todo
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {[
                {
                  nombre: 'Rugby', cant: '6 cat.',
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-35 12 12)"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="8.5" y1="7.5" x2="15.5" y2="7.5"/><line x1="7" y1="11" x2="17" y2="11"/><line x1="8.5" y1="14.5" x2="15.5" y2="14.5"/></svg>,
                },
                {
                  nombre: 'Hockey', cant: '4 cat.',
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><line x1="12" y1="3" x2="12" y2="17"/><path d="M12 17 Q9 19.5 7 22"/><line x1="7" y1="22" x2="13" y2="22"/><circle cx="12" cy="3" r="2"/></svg>,
                },
                {
                  nombre: 'Fútbol', cant: '4 cat.',
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 7 l2.5 3.5 H18 l-2.5 3 1.5 3.5L12 15l-5 2 1.5-3.5L6 10h3.5z"/></svg>,
                },
              ].map((d) => (
                <motion.button key={d.nombre} whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/deportes')}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(var(--club-primary-rgb),0.25)',
                  }}>
                  <span style={{ color: 'var(--club-primary)' }}>{d.icon}</span>
                  <span className="text-white text-xs font-semibold">{d.nombre}</span>
                  <span className="text-white/30 text-[10px]">{d.cant}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ── Parrilleros — dark card con SVG ── */}
          <motion.div variants={stagger.item}>
            <motion.div whileTap={{ scale: 0.98 }} onClick={() => router.push('/reservas')}
              className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(var(--club-primary-rgb),0.12)', color: 'var(--club-primary)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 2h6l1 4H8z" /><path d="M8 6c0 5 8 5 8 0" />
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <line x1="9" y1="14" x2="9" y2="18" /><line x1="12" y1="13" x2="12" y2="18" /><line x1="15" y1="14" x2="15" y2="18" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white/30 text-[9px] uppercase tracking-[3px] mb-0.5">Instalaciones</p>
                <p className="text-white text-sm font-bold">Reservar Parrillero</p>
                <p className="text-white/35 text-xs">3 parrilleros disponibles</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </motion.div>
          </motion.div>

          {/* ── Novedades ── */}
          <motion.div variants={stagger.item}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[2px]"
                style={{ borderLeft: '3px solid var(--club-primary)', paddingLeft: '8px' }}>Novedades</p>
              <button onClick={() => router.push('/novedades')} className="text-[var(--club-primary)] text-xs font-semibold flex items-center gap-1 transition-opacity active:opacity-60">
                Ver todas
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { titulo: 'Pre-temporada Rugby M19 — Inscripciones abiertas', fecha: 'Hoy', color: '#1B2D6E', tag: 'Rugby' },
                { titulo: 'Hockey femenino: torneo triangular este sábado', fecha: 'Ayer', color: '#1A6B3A', tag: 'Hockey' },
                { titulo: 'Asamblea anual de socios — 20 de junio', fecha: 'Jun 8', color: '#4a4a5a', tag: 'Institucional' },
              ].map((n, i) => (
                <motion.div key={i} onClick={() => router.push('/novedades')} whileTap={{ scale: 0.98 }}
                  className="rounded-xl overflow-hidden flex cursor-pointer transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-[3px] flex-shrink-0 rounded-l-xl" style={{ background: n.color }} />
                  <div className="flex-1 px-4 py-3 flex items-center gap-3 min-w-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{n.titulo}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${n.color}22`, color: n.color }}>{n.tag}</span>
                        <span className="text-white/25 text-[10px]">{n.fecha}</span>
                      </div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Nuestro Club ── */}
          <motion.div variants={stagger.item}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/club')}
              className="w-full rounded-2xl overflow-hidden relative text-left"
              style={{ background: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a1a 100%)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
              <div className="relative z-10 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: `rgba(var(--club-primary-rgb),0.1)`, border: '1px solid rgba(255,255,255,0.08)' }}>
                  {storedClub?.logo_url
                    ? <img src={storedClub.logo_url} alt={clubNombre} className="w-full h-full object-contain p-1" />
                    : <img src="/lobos-logo.png" alt="Lobos" className="w-full h-full object-contain p-1" />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-0.5">El Club</p>
                  <p className="text-white text-sm font-bold">Nuestro Club</p>
                  <p className="text-white/40 text-xs">Historia · Valores · Contacto</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </motion.button>
          </motion.div>

        </motion.div>
      </div>

      <NavBar />
    </main>
  )
}
