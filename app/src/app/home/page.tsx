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

const PRECIOS_TRANSFERENCIA: Record<string, number> = {
  'Infantiles -13': 2190,
  'Juveniles -21': 2890,
  'Mayores +22': 3490,
  'Cuota Familiar': 6590,
  'Fitness': 2190,
  'Cuota Amigo': 890,
}

function getPrecio(categoria?: string): number {
  if (!categoria) return 3490
  return PRECIOS_TRANSFERENCIA[categoria] ?? 3490
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
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-8"
        >
          <img
            src="/delclub-logo.jpg"
            alt="DelClub"
            style={{ width: 152, height: 152, borderRadius: '30px', display: 'block' }}
          />
          <motion.div
            animate={{ opacity: [0.2, 0.55, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 28, height: 2, background: 'rgba(255,255,255,0.35)', borderRadius: 2 }}
          />
        </motion.div>
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

          {/* App mark + Club info */}
          <div className="flex items-center gap-3">
            {/* DelClub "dc" — app identity mark */}
            <span className="flex-shrink-0" style={{
              fontFamily: 'var(--font-display)',
              fontSize: '26px',
              fontWeight: 800,
              color: 'rgba(255,255,255,0.90)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}>dc</span>

            {/* Divider */}
            <div className="w-px h-7 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.10)' }} />

            <div className="flex items-center gap-1.5 mt-1">
              {/* Iconito del club */}
              <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                {storedClub?.logo_url
                  ? <img src={storedClub.logo_url} alt="" className="w-full h-full object-contain" />
                  : <span style={{ fontSize: '6px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>
                      {storedClub?.iniciales ?? 'L'}
                    </span>
                }
              </div>
              {/* Nombre */}
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.01em',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1,
              }}>
                {clubNombre}
              </span>
              {/* EN LÍNEA — en la misma línea */}
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-65"
                  style={{ animation: 'ping-ring 1.4s cubic-bezier(0,0,0.2,1) infinite' }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(52,211,153,0.8)', textTransform: 'uppercase' }}>
                En línea
              </span>
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

        {/* ── Greeting ── */}
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-white/28 text-[10px] uppercase tracking-[3.5px] mb-1 font-medium">
            Bienvenido de vuelta
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="font-serif text-5xl font-semibold leading-none text-white"
          >
            {socio?.nombre ?? 'Socio'}
          </motion.h1>

          {/* ACTIVO badge — rectangular outline */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mt-3"
            style={{
              padding: '4px 10px',
              borderRadius: '3px',
              border: '1px solid rgba(var(--club-primary-rgb),0.45)',
              background: 'transparent',
            }}
          >
            <span className="text-[var(--club-primary)] text-[10px] font-bold tracking-widest uppercase">
              {socio?.categoria ?? 'Socio'}
            </span>
            <span className="text-white/15 text-[10px]">·</span>
            <span className="text-white/35 text-[10px] font-mono">N° {socio?.numero_socio ?? '—'}</span>
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

          {/* ── Cuota ── */}
          <motion.div variants={stagger.item}>
            <motion.div
              layout
              onClick={() => setCuotaExpanded(v => !v)}
              className="cursor-pointer overflow-hidden"
              style={{ borderRadius: '10px', background: '#0f1c33' }}
              transition={{ layout: { duration: 0.4, ease } }}
            >
              {/* Línea superior de color */}
              <div style={{ height: '2px', background: socio?.cuota_al_dia ? 'var(--club-primary)' : '#e53e3e' }} />

              <div className="px-4 py-4 flex items-center justify-between gap-4">
                {/* Izquierda: label + monto */}
                <div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', display: 'block', marginBottom: '6px' }}>
                    {socios.length > 1 ? `Cuota · ${socio?.nombre}` : 'Mi cuota'}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.30)', fontWeight: 500 }}>$</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                      <AnimatedNumber value={getPrecio(socio?.categoria)} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.20)', marginLeft: '2px' }}>UYU</span>
                  </div>
                </div>

                {/* Derecha: estado + acción */}
                <div className="flex flex-col items-end gap-2.5">
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em',
                    color: socio?.cuota_al_dia ? 'var(--club-primary)' : '#fc8181',
                  }}>
                    {socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}
                  </span>
                  <button
                    onClick={(e) => { e?.stopPropagation(); router.push('/cuota') }}
                    className="flex items-center gap-0.5 active:opacity-50 transition-opacity"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.35)' }}
                  >
                    {socio?.cuota_al_dia ? 'Ver historial' : 'Pagar cuota'}
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
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
                    className="overflow-hidden"
                  >
                    <div className="h-px mx-4" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <div className="px-4 py-4">
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '12px' }}>
                        Últimos 3 meses
                      </p>
                      {[
                        { mes: 'Junio 2026', estado: socio?.cuota_al_dia },
                        { mes: 'Mayo 2026', estado: true },
                        { mes: 'Abril 2026', estado: true },
                      ].map(({ mes, estado }) => (
                        <div key={mes} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.50)' }}>{mes}</span>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, color: estado ? '#68d391' : '#fc8181' }}>
                            {estado ? 'Pagado' : 'Pendiente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* ── Hoy en el club ── */}
          <motion.div variants={stagger.item}>
            {(() => {
              const ahora = new Date()
              const dia = ahora.getDay()
              const minutoActual = ahora.getHours() * 60 + ahora.getMinutes()

              type Act = { hora: string; min: number; nombre: string; tag: string }
              const GYM_M: Act  = { hora: '08:00', min: 480,  nombre: 'Gym · Sala',    tag: 'Fitness' }
              const FUNC: Act   = { hora: '08:15', min: 495,  nombre: 'Funcional',      tag: 'Fitness' }
              const ZUMBA: Act  = { hora: '08:30', min: 510,  nombre: 'Zumba',          tag: 'Fitness' }
              const YOGA: Act   = { hora: '08:30', min: 510,  nombre: 'Yoga',           tag: 'Fitness' }
              const PILATES: Act= { hora: '09:30', min: 570,  nombre: 'Pilates',        tag: 'Fitness' }
              const FUNC2: Act  = { hora: '09:30', min: 570,  nombre: 'Funcional',      tag: 'Fitness' }
              const GYM_T: Act  = { hora: '16:00', min: 960,  nombre: 'Gym · Sala',    tag: 'Fitness' }
              const HOCKEY: Act = { hora: '18:00', min: 1080, nombre: 'Hockey Mamis',   tag: 'Hockey'  }

              const semana: Record<number, Act[]> = {
                1: [GYM_M, FUNC, ZUMBA, GYM_T],
                2: [GYM_M, FUNC, YOGA, PILATES, FUNC2, GYM_T, HOCKEY],
                3: [GYM_M, FUNC, ZUMBA, GYM_T],
                4: [GYM_M, FUNC, YOGA, PILATES, FUNC2, GYM_T, HOCKEY],
                5: [GYM_M, FUNC, ZUMBA, GYM_T],
              }

              const actividades = semana[dia] ?? []
              const sinAct = actividades.length === 0
              const proximoIdx = actividades.findIndex(a => a.min > minutoActual)
              const actualIdx  = actividades.findIndex(a => minutoActual >= a.min && minutoActual < a.min + 75)

              return (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
                      Hoy en el club
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.22)' }}>
                      {ahora.toLocaleDateString('es-UY', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  {sinAct ? (
                    <div className="py-5 text-center" style={{ color: 'rgba(255,255,255,0.22)', fontSize: '12px' }}>
                      Sin actividades programadas hoy
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {actividades.map((a, i) => {
                        const esActual  = i === actualIdx
                        const esProximo = i === proximoIdx && actualIdx === -1
                        const pasado    = proximoIdx !== -1 ? i < proximoIdx : actualIdx !== -1 ? i < actualIdx : true
                        return (
                          <div
                            key={`${a.hora}-${a.nombre}`}
                            className="flex items-center gap-3 rounded-xl px-3 py-2"
                            style={{
                              background: esActual ? 'rgba(var(--club-primary-rgb),0.13)' : esProximo ? 'rgba(255,255,255,0.05)' : 'transparent',
                              border: esActual ? '1px solid rgba(var(--club-primary-rgb),0.28)' : '1px solid transparent',
                            }}
                          >
                            <span style={{
                              fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
                              color: esActual ? 'var(--club-primary)' : pasado ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.42)',
                              width: '38px', flexShrink: 0, fontVariantNumeric: 'tabular-nums',
                            }}>
                              {a.hora}
                            </span>
                            <div className="w-px h-3.5 flex-shrink-0" style={{ background: esActual ? 'rgba(var(--club-primary-rgb),0.35)' : 'rgba(255,255,255,0.07)' }} />
                            <span style={{
                              fontFamily: 'var(--font-body)', fontSize: '13px',
                              fontWeight: esActual || esProximo ? 600 : 400,
                              color: esActual ? '#fff' : pasado ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.70)',
                              flex: 1,
                            }}>
                              {a.nombre}
                            </span>
                            <span style={{
                              fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              color: esActual ? 'rgba(var(--club-primary-rgb),0.65)' : 'rgba(255,255,255,0.15)',
                            }}>
                              {esActual ? 'En curso' : esProximo ? 'Próximo' : a.tag}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )
            })()}
          </motion.div>

          {/* ── Novedades ── */}
          <motion.div variants={stagger.item}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
                Novedades
              </span>
              <button onClick={() => router.push('/novedades')}
                style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--club-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                className="transition-opacity active:opacity-60">
                Ver todas
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              {[
                { titulo: 'Convocatoria Rugby Primera — Pretemporada 2026', fecha: 'Jun 2026', tag: 'Rugby' },
                { titulo: 'Hockey Mamis: horarios de temporada confirmados', fecha: 'May 2026', tag: 'Hockey' },
                { titulo: 'Copa Lobos Infantil de Fútbol — ¡Inscribite!', fecha: 'May 2026', tag: 'Fútbol' },
              ].map((n, i) => (
                <motion.button key={i}
                  onClick={() => router.push('/novedades')}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left cursor-pointer block"
                  style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.07)' : undefined }}
                >
                  <div style={{ paddingTop: '14px', paddingBottom: '14px' }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '7px' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(var(--club-primary-rgb),0.72)' }}>
                        {n.tag}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.22)' }}>
                        {n.fecha}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.88)', lineHeight: 1.45 }}>
                      {n.titulo}
                    </p>
                  </div>
                </motion.button>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
            </div>
          </motion.div>

          {/* ── Próximo partido ── */}
          <motion.div variants={stagger.item}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="rounded-lg overflow-hidden relative cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #1B2D6E 0%, #0f1d4a 100%)',
                border: '1px solid rgba(27,45,110,0.6)',
                borderTopWidth: '2px',
                borderTopColor: 'var(--club-primary)',
              }}
              onClick={() => router.push('/deportes')}
            >
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }} />
              <div className="relative z-10 p-4">
                {(() => {
                  const hoy = new Date(); hoy.setHours(0,0,0,0)
                  const partido = new Date('2026-06-14')
                  const diff = Math.round((partido.getTime() - hoy.getTime()) / 86400000)
                  const label = diff > 1 ? `Faltan ${diff} días` : diff === 1 ? 'Mañana' : diff === 0 ? 'Hoy' : null
                  return (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round">
                          <ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-35 12 12)" />
                          <line x1="12" y1="4" x2="12" y2="20" />
                        </svg>
                        <span className="text-white/40 text-[9px] font-bold uppercase tracking-[3px]">Próximo Partido · Rugby Primera</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {label && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(var(--club-primary-rgb),0.18)', color: 'var(--club-primary)' }}>
                            {label}
                          </span>
                        )}
                        <span className="text-[var(--club-primary)] text-[9px] font-bold uppercase tracking-wider">SAB 14 JUN</span>
                      </div>
                    </div>
                  )
                })()}
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

        </motion.div>
      </div>

      <NavBar />
    </main>
  )
}
