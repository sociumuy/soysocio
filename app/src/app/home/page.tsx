'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Chip from '@/components/Chip'
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

const METEORS = [
  { id: 0, top: 8,  left: 58, delay: 0,   duration: 4.5, width: 72 },
  { id: 1, top: 22, left: 78, delay: 1.8, duration: 5.5, width: 55 },
  { id: 2, top: 4,  left: 88, delay: 0.6, duration: 3.8, width: 88 },
  { id: 3, top: 33, left: 68, delay: 2.6, duration: 6.2, width: 60 },
  { id: 4, top: 14, left: 96, delay: 3.3, duration: 4.2, width: 76 },
]

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

        {/* Radial glow — top right */}
        <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 opacity-[0.14]"
          style={{ background: 'radial-gradient(circle, rgba(var(--club-primary-rgb),0.8) 0%, transparent 65%)', transform: 'translate(40%,-40%)' }} />
        {/* Radial glow — top left, dimmer */}
        <div className="pointer-events-none absolute top-0 left-0 w-56 h-56 opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, rgba(var(--club-primary-rgb),0.6) 0%, transparent 70%)', transform: 'translate(-40%,-40%)' }} />

        {/* ── Meteors ── */}
        {METEORS.map(m => (
          <span key={m.id} className="absolute pointer-events-none"
            style={{
              top: `${m.top}%`,
              left: `${m.left}%`,
              width: `${m.width}px`,
              height: '1.5px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(var(--club-primary-rgb),0.6) 40%, rgba(255,255,255,0.85) 65%, rgba(var(--club-primary-rgb),0.4) 85%, transparent 100%)',
              boxShadow: '0 0 5px rgba(var(--club-primary-rgb),0.5), 0 0 1px rgba(255,255,255,0.6)',
              animation: `meteor-fall ${m.duration}s linear ${m.delay}s infinite`,
              opacity: 0,
            }} />
        ))}

        {/* ── Top bar ── */}
        <div className="relative z-10 flex items-center justify-between mb-8">

          {/* Logo + Club info */}
          <div className="flex items-center gap-3">
            {/* Logo — glow ring */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ boxShadow: '0 0 0 1px rgba(var(--club-primary-rgb),0.45), 0 0 20px rgba(var(--club-primary-rgb),0.20)' }} />
              <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.06)' }}>
                {storedClub?.logo_url
                  ? <img src={storedClub.logo_url} alt={clubNombre} className="w-full h-full object-contain p-1" />
                  : <img src="/lobos-logo.png" alt="Lobos Rugby Club" className="w-full h-full object-contain p-1" />
                }
              </div>
            </div>

            <div>
              <div className="text-white text-sm font-bold tracking-wide leading-tight">{clubNombre}</div>
              {/* EN LÍNEA — ping animation */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2 flex-shrink-0">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-65"
                    style={{ animation: 'ping-ring 1.4s cubic-bezier(0,0,0.2,1) infinite' }} />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-emerald-400 text-[10px] font-bold tracking-[2px] uppercase">EN LÍNEA</span>
              </div>
            </div>
          </div>

          {/* Salir — ghost with gradient border */}
          <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
            className="relative overflow-hidden text-white/25 hover:text-white/60 transition-colors text-xs px-3 py-1.5 rounded-lg">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0.10) 100%)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
            } as any} />
            Salir
          </button>
        </div>

        {/* ── Club identity strip — animated gradient text ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
          className="relative z-10 flex items-center gap-3 mb-6">
          <div className="h-px flex-1"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--club-primary-rgb),0.35), transparent)' }} />
          <span className="text-[9px] font-bold tracking-[4px] uppercase flex-shrink-0"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.22) 0%, rgba(var(--club-primary-rgb),1) 35%, rgba(255,255,255,0.9) 50%, rgba(var(--club-primary-rgb),0.85) 65%, rgba(255,255,255,0.22) 100%)',
              backgroundSize: '300% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer-slide 5s linear infinite',
            }}>
            Somos Familia · Punta del Este · Est. 1989
          </span>
          <div className="h-px flex-1"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--club-primary-rgb),0.35), transparent)' }} />
        </motion.div>

        {/* ── Greeting ── */}
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-white/28 text-[10px] uppercase tracking-[3.5px] mb-1 font-medium">
            Bienvenido de vuelta
          </motion.p>

          {/* Name — horizontal shimmer sweep */}
          <motion.h1
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="font-serif text-5xl font-semibold leading-none"
            style={{
              background: 'linear-gradient(90deg, rgba(var(--club-primary-rgb),0.65) 0%, #ffffff 28%, rgba(var(--club-primary-rgb),1) 52%, #ffffff 76%, rgba(var(--club-primary-rgb),0.65) 100%)',
              backgroundSize: '300% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer-slide 3.5s linear infinite',
            }}
          >
            {socio?.nombre ?? 'Socio'}
          </motion.h1>

          {/* ACTIVO badge — spinning comet border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mt-3 relative overflow-hidden"
            style={{ padding: '6px 14px', borderRadius: '999px' }}
          >
            {/* bg */}
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(var(--club-primary-rgb),0.10)' }} />
            {/* spinning comet border */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <div className="absolute inset-0 pointer-events-none" style={{
              borderRadius: 'inherit',
              padding: '1px',
              overflow: 'hidden',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
            } as any}>
              <div style={{
                position: 'absolute',
                top: '-50%', left: '-50%',
                width: '200%', height: '200%',
                background: 'conic-gradient(transparent 180deg, rgba(var(--club-primary-rgb),0.2) 240deg, rgba(var(--club-primary-rgb),0.9) 285deg, rgba(255,255,255,0.85) 305deg, rgba(var(--club-primary-rgb),0.7) 325deg, transparent 360deg)',
                animation: 'spin-beam 3s linear infinite',
              }} />
            </div>
            <span className="relative z-10 text-[var(--club-primary)] text-[10px] font-bold tracking-widest uppercase">
              {socio?.categoria ?? 'Socio'}
            </span>
            <span className="relative z-10 text-[#3a3a3a] text-[10px]">·</span>
            <span className="relative z-10 text-[#666] text-[10px] font-mono">N° {socio?.numero_socio ?? '—'}</span>
          </motion.div>
        </div>

        {/* ── Family selector ── */}
        {socios.length > 1 && (
          <div className="relative z-10 flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {socios.map(s => (
              <Chip
                key={s.id}
                active={socioActivo?.id === s.id}
                onClick={() => setSocioActivo(s)}
                layoutId="family-chip"
                size="md"
                icon={
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: 'rgba(var(--club-primary-rgb),0.3)', color: 'var(--club-primary)' }}>
                    {s.nombre[0]}
                  </span>
                }
              >
                {s.nombre}
              </Chip>
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
                      className="relative overflow-hidden px-6 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase text-[#0D0D0D] transition-opacity active:opacity-80"
                      style={{ background: 'var(--club-primary)' }}
                    >
                      {/* shimmer sweep */}
                      <div className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer-slide 2.5s ease-in-out infinite',
                        }} />
                      <span className="relative z-10">{socio?.cuota_al_dia ? 'Ver historial' : 'Pagar cuota'}</span>
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

          {/* ── Quick stats — animated gradient text (MagicUI pattern) ── */}
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
                  {/* AnimatedGradientText: sweep from club-primary → white → club-primary */}
                  <span className="font-serif text-3xl font-bold leading-none"
                    style={{
                      background: 'linear-gradient(90deg, rgba(var(--club-primary-rgb),0.7) 0%, #ffffff 35%, rgba(var(--club-primary-rgb),1) 65%, #ffffff 100%)',
                      backgroundSize: '300% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'shimmer-slide 4s linear infinite',
                    }}>{value}</span>
                  <span className="text-white/30 text-[9px] font-bold uppercase tracking-[2px] mt-1.5">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Deportes — pills con shimmer ── */}
          <motion.div variants={stagger.item}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-[3px] h-3.5 rounded-full"
                  style={{ background: 'var(--club-primary)', boxShadow: '0 0 8px 1px rgba(var(--club-primary-rgb),0.6)', animation: 'glow-pulse 2.5s ease-in-out infinite' }} />
                <span className="text-white/65 text-[10px] font-bold uppercase tracking-[2.5px]">Deportes</span>
              </div>
              <button onClick={() => router.push('/deportes')} className="text-[var(--club-primary)] text-xs font-semibold flex items-center gap-1 transition-opacity active:opacity-60">
                Ver todo
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {[
                {
                  nombre: 'Rugby', cant: '6 cat.', color: '#4a6fa5', rgb: '74,111,165',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-35 12 12)"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="8.5" y1="7.5" x2="15.5" y2="7.5"/><line x1="7" y1="11" x2="17" y2="11"/><line x1="8.5" y1="14.5" x2="15.5" y2="14.5"/></svg>,
                },
                {
                  nombre: 'Hockey', cant: '4 cat.', color: '#3a9a5c', rgb: '58,154,92',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="12" y1="3" x2="12" y2="17"/><path d="M12 17 Q9 19.5 7 22"/><line x1="7" y1="22" x2="13" y2="22"/><circle cx="12" cy="3" r="2"/></svg>,
                },
                {
                  nombre: 'Fútbol', cant: '4 cat.', color: '#c0674a', rgb: '192,103,74',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 7 l2.5 3.5 H18 l-2.5 3 1.5 3.5L12 15l-5 2 1.5-3.5L6 10h3.5z"/></svg>,
                },
              ].map((d) => (
                <motion.button key={d.nombre}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => router.push('/deportes')}
                  className="relative flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    background: `rgba(${d.rgb},0.12)`,
                    border: `1px solid rgba(${d.rgb},0.3)`,
                    boxShadow: `0 0 22px rgba(${d.rgb},0.12)`,
                  }}>
                  {/* Shimmer sweep en el color del deporte */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(105deg, transparent 30%, rgba(${d.rgb},0.12) 50%, transparent 70%)`,
                      backgroundSize: '250% 100%',
                      animation: 'shimmer-slide 2.8s ease-in-out infinite',
                    }} />
                  {/* Ícono en cuadrado coloreado */}
                  <div className="relative z-10 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `rgba(${d.rgb},0.22)`, color: d.color }}>
                    {d.icon}
                  </div>
                  <div className="relative z-10 text-left">
                    <div className="text-white text-[13px] font-bold leading-tight">{d.nombre}</div>
                    <div className="text-white/35 text-[10px] mt-0.5">{d.cant}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* ── Parrilleros — border beam card ── */}
          <motion.div variants={stagger.item}>
            {/* MagicUI AnimatedBorder: CSS mask shows gradient ONLY in 1px border zone */}
            <motion.div whileTap={{ scale: 0.98 }} onClick={() => router.push('/reservas')}
              className="relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ background: '#0c1626' }}>
              {/* Sliding gradient visible only on the 1px border */}
              <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
                style={{
                  padding: '1px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(var(--club-primary-rgb),0.7) 40%, rgba(var(--club-primary-rgb),0.9) 50%, rgba(var(--club-primary-rgb),0.7) 60%, transparent 100%)',
                  backgroundSize: '300% 100%',
                  animation: 'shimmer-slide 2.5s ease-in-out infinite',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                }} />
              <div className="relative z-10 p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(var(--club-primary-rgb),0.12)',
                    color: 'var(--club-primary)',
                    boxShadow: '0 0 14px rgba(var(--club-primary-rgb),0.2)',
                  }}>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Novedades ── */}
          <motion.div variants={stagger.item}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-[3px] h-3.5 rounded-full"
                  style={{ background: 'var(--club-primary)', boxShadow: '0 0 8px 1px rgba(var(--club-primary-rgb),0.6)', animation: 'glow-pulse 2.5s ease-in-out infinite' }} />
                <span className="text-white/65 text-[10px] font-bold uppercase tracking-[2.5px]">Novedades</span>
              </div>
              <button onClick={() => router.push('/novedades')} className="text-[var(--club-primary)] text-xs font-semibold flex items-center gap-1 transition-opacity active:opacity-60">
                Ver todas
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { titulo: 'Pre-temporada Rugby M19 — Inscripciones abiertas', fecha: 'Hoy', color: '#1B2D6E', rgb: '27,45,110', tag: 'Rugby' },
                { titulo: 'Hockey femenino: torneo triangular este sábado', fecha: 'Ayer', color: '#1A6B3A', rgb: '26,107,58', tag: 'Hockey' },
                { titulo: 'Asamblea anual de socios — 20 de junio', fecha: 'Jun 8', color: '#4a4a5a', rgb: '74,74,90', tag: 'Institucional' },
              ].map((n, i) => (
                // MagicUI pattern: animated border via CSS mask on tap + persistent glow shadow
                <motion.div key={i} onClick={() => router.push('/novedades')}
                  whileTap={{ scale: 0.98 }}
                  className="relative rounded-xl overflow-hidden flex cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  {/* Animated border — shimmer sweep on the 1px border zone */}
                  <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
                    style={{
                      padding: '1px',
                      background: `linear-gradient(90deg, transparent 0%, rgba(${n.rgb},0.6) 50%, transparent 100%)`,
                      backgroundSize: '300% 100%',
                      animation: `shimmer-slide ${3 + i * 0.7}s ease-in-out infinite`,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                    }} />
                  {/* Left accent */}
                  <div className="w-[3px] flex-shrink-0 relative z-10"
                    style={{
                      background: `linear-gradient(180deg, ${n.color} 0%, ${n.color}88 100%)`,
                      boxShadow: `2px 0 10px rgba(${n.rgb},0.5)`,
                    }} />
                  <div className="flex-1 px-4 py-3 flex items-center gap-3 min-w-0 relative z-10">
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm font-semibold leading-snug line-clamp-2">{n.titulo}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `rgba(${n.rgb},0.2)`, color: n.color }}>{n.tag}</span>
                        <span className="text-white/25 text-[10px]">{n.fecha}</span>
                      </div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
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
