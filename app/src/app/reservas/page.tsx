'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'

// ── SVG Icons (no emojis) ─────────────────────────────
const FlameIcon = ({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2c-4 4-5.5 8-5.5 11a5.5 5.5 0 0 0 11 0c0-3-2-6-3.5-8.5C13.5 6.5 13 8 12 9.5c-1-2-1.5-4.5 0-7.5z"/>
  </svg>
)

const SunriseIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M12 2v3M4.2 10.2l2.1 2.1M2 18h20M7 18a5 5 0 0 1 10 0M18 6.2l-2.1 2.1"/>
  </svg>
)

const SunIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
  </svg>
)

const MoonIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const GrillIcon = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8h16M4 8a8 8 0 0 0 16 0M9 16l-1 4M15 16l1 4M10 20h4"/>
    <line x1="7" y1="12" x2="7" y2="16"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="17" y1="12" x2="17" y2="16"/>
  </svg>
)

// ── Data ──────────────────────────────────────────────
const PARRILLEROS = [
  { id: 'parrillero-1', num: '01', nombre: 'Parrillero 1', descripcion: 'Sector norte · hasta 15 personas' },
  { id: 'parrillero-2', num: '02', nombre: 'Parrillero 2', descripcion: 'Sector central · hasta 20 personas' },
  { id: 'parrillero-3', num: '03', nombre: 'Parrillero 3', descripcion: 'Sector sur · hasta 12 personas' },
]

const FRANJAS = [
  { id: 'manana', label: 'Mañana', hora: '10:00', rango: '10:00 – 14:00', icon: SunriseIcon },
  { id: 'tarde',  label: 'Tarde',  hora: '14:00', rango: '14:00 – 18:00', icon: SunIcon    },
  { id: 'noche',  label: 'Noche',  hora: '18:00', rango: '18:00 – 22:00', icon: MoonIcon   },
]

function getDias() {
  const hoy   = new Date()
  const names = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() + i)
    return { key: d.toISOString().split('T')[0], dia: names[d.getDay()], num: d.getDate(), mes: meses[d.getMonth()], esHoy: i === 0 }
  })
}

const AMBER = '#C8940A'
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

// ── Label helper ─────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '14px' }}>
      {children}
    </p>
  )
}

// ── Main page ─────────────────────────────────────────
export default function ReservasPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [parrilleroSel, setParrilleroSel] = useState<typeof PARRILLEROS[0] | null>(null)
  const [diaSel,        setDiaSel]        = useState(getDias()[0].key)
  const [franjaSel,     setFranjaSel]     = useState<typeof FRANJAS[0] | null>(null)
  const [ocupados,      setOcupados]      = useState<{ espacio: string; hora: string }[]>([])
  const [socioId,       setSocioId]       = useState<string | null>(null)
  const [clubId,        setClubId]        = useState<string | null>(null)
  const [confirmando,   setConfirmando]   = useState(false)
  const [confirmado,    setConfirmado]    = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  const dias      = getDias()
  const diaDisplay = dias.find(d => d.key === diaSel)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('socios').select('id, club_id').eq('user_id', user.id).limit(1).single()
        .then(({ data }) => { if (data) { setSocioId(data.id); setClubId(data.club_id) } })
    })
  }, [])

  useEffect(() => {
    if (!diaSel || !clubId) return
    supabase.from('reservas').select('espacio, hora').eq('fecha', diaSel).eq('club_id', clubId!).eq('estado', 'confirmada')
      .then(({ data }) => setOcupados(data ?? []))
  }, [diaSel, clubId])

  function estaOcupado(id: string, hora: string) {
    return ocupados.some(o => o.espacio === id && o.hora === hora)
  }

  async function confirmar() {
    if (!socioId || !clubId || !parrilleroSel || !franjaSel) return
    setConfirmando(true); setError(null)
    const { error: err } = await supabase.from('reservas').insert({
      socio_id: socioId, club_id: clubId,
      espacio: parrilleroSel.id, fecha: diaSel,
      hora: franjaSel.hora, estado: 'confirmada',
    })
    if (err) { setError('No se pudo confirmar. Intentá de nuevo.'); setConfirmando(false); return }
    setConfirmando(false); setConfirmado(true)
  }

  // ── Success state ─────────────────────────────────
  if (confirmado) return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-8 text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
        style={{ background: `rgba(200,148,10,0.12)`, border: `1px solid rgba(200,148,10,0.3)`, color: AMBER }}
      >
        <CheckIcon />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, ease }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: AMBER, marginBottom: '10px' }}>
          Reserva confirmada
        </p>
        <h1 className="font-serif text-white" style={{ fontSize: '36px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '20px' }}>
          {parrilleroSel?.nombre}
        </h1>
        <p className="font-mono" style={{ fontSize: '13px', color: AMBER, letterSpacing: '0.06em', marginBottom: '6px' }}>
          {diaDisplay?.dia} {diaDisplay?.num} {diaDisplay?.mes}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '40px' }}>
          {franjaSel?.rango}
        </p>

        <button
          onClick={() => router.push('/home')}
          className="w-full py-4 rounded-2xl active:opacity-75 transition-opacity mb-4"
          style={{ background: AMBER, fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0D0D0D' }}
        >
          Volver al inicio
        </button>
        <button
          onClick={() => { setConfirmado(false); setParrilleroSel(null); setFranjaSel(null) }}
          style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', WebkitTapHighlightColor: 'transparent' }}
        >
          Hacer otra reserva
        </button>
      </motion.div>
    </main>
  )

  // ── Main flow ─────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col pb-32">

      {/* ── Header ── */}
      <div className="px-5 pt-20 pb-7">
        <button onClick={() => router.push('/home')}
          className="flex items-center gap-1.5 mb-8 active:opacity-50 transition-opacity"
          style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.30)', letterSpacing: '0.06em', WebkitTapHighlightColor: 'transparent' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Inicio
        </button>

        <div className="flex items-start justify-between">
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: '8px' }}>
              Lobos Rugby Club
            </p>
            <h1 className="font-serif text-white" style={{ fontSize: '36px', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1 }}>
              Parrilleros
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.28)', marginTop: '6px' }}>
              Reservá tu espacio para el asado
            </p>
          </div>
          <div className="mt-1" style={{ color: `rgba(200,148,10,0.45)` }}>
            <GrillIcon size={36} />
          </div>
        </div>
      </div>

      {/* ── Hairline ── */}
      <div className="mx-5 mb-7" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

      <div className="px-5 flex flex-col gap-8">

        {/* ══ PASO 1: Parrillero ══ */}
        <div>
          <SectionLabel>01 · Elegí un parrillero</SectionLabel>
          <div className="flex flex-col" style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', overflow: 'hidden' }}>
            {PARRILLEROS.map((p, i) => {
              const sel = parrilleroSel?.id === p.id
              return (
                <motion.button
                  key={p.id}
                  onClick={() => { setParrilleroSel(p); setFranjaSel(null) }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center gap-4 px-4 py-4 text-left relative transition-colors"
                  style={{
                    background: sel ? 'rgba(200,148,10,0.07)' : 'transparent',
                    borderBottom: i < PARRILLEROS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {/* Amber left accent when selected */}
                  {sel && <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: AMBER, borderRadius: '0 2px 2px 0' }} />}

                  {/* Number */}
                  <span className="font-serif flex-shrink-0 w-10 text-center" style={{ fontSize: '28px', fontWeight: 700, lineHeight: 1, color: sel ? AMBER : 'rgba(255,255,255,0.15)', transition: 'color 0.2s' }}>
                    {p.num}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: sel ? '#fff' : 'rgba(255,255,255,0.70)', transition: 'color 0.2s' }}>
                      {p.nombre}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginTop: '2px' }}>
                      {p.descripcion}
                    </p>
                  </div>

                  {/* Check */}
                  {sel
                    ? <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: AMBER }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0D0D0D" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                    : <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.12)' }} />
                  }
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* ══ PASO 2: Fecha ══ */}
        <AnimatePresence>
          {parrilleroSel && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.35, ease }}>
              <SectionLabel>02 · Elegí una fecha</SectionLabel>

              <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
                {dias.map((d) => {
                  const sel = diaSel === d.key
                  return (
                    <button
                      key={d.key}
                      onClick={() => { setDiaSel(d.key); setFranjaSel(null) }}
                      className="flex flex-col items-center flex-shrink-0 pt-2 pb-3 px-3 rounded-2xl transition-all active:opacity-70"
                      style={{
                        minWidth: '52px',
                        background: sel ? 'rgba(200,148,10,0.10)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${sel ? 'rgba(200,148,10,0.35)' : 'rgba(255,255,255,0.07)'}`,
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: sel ? AMBER : 'rgba(255,255,255,0.28)', marginBottom: '4px' }}>
                        {d.esHoy ? 'Hoy' : d.dia}
                      </span>
                      <span className="font-serif" style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1, color: sel ? '#fff' : 'rgba(255,255,255,0.65)', marginBottom: '3px' }}>
                        {d.num}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', color: sel ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.20)' }}>
                        {d.mes}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ PASO 3: Franja horaria ══ */}
        <AnimatePresence>
          {parrilleroSel && diaSel && (
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.35, ease }}>
              <SectionLabel>03 · Elegí un turno</SectionLabel>

              <div className="grid grid-cols-3 gap-2.5">
                {FRANJAS.map((f) => {
                  const ocupado = estaOcupado(parrilleroSel.id, f.hora)
                  const sel     = franjaSel?.id === f.id
                  const Icon    = f.icon
                  return (
                    <button
                      key={f.id}
                      disabled={ocupado}
                      onClick={() => setFranjaSel(f)}
                      className="rounded-2xl flex flex-col items-center py-5 gap-3 transition-all active:opacity-70"
                      style={{
                        background: ocupado ? 'rgba(255,255,255,0.02)' : sel ? 'rgba(200,148,10,0.10)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${sel ? 'rgba(200,148,10,0.40)' : 'rgba(255,255,255,0.07)'}`,
                        opacity: ocupado ? 0.35 : 1,
                        cursor: ocupado ? 'not-allowed' : 'pointer',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <span style={{ color: sel ? AMBER : 'rgba(255,255,255,0.35)' }}>
                        <Icon size={20} />
                      </span>
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-serif" style={{ fontSize: '14px', fontWeight: 600, color: sel ? '#fff' : 'rgba(255,255,255,0.65)', lineHeight: 1 }}>
                          {f.label}
                        </span>
                        <span className="font-mono" style={{ fontSize: '9px', color: sel ? AMBER : 'rgba(255,255,255,0.22)' }}>
                          {f.hora}
                        </span>
                      </div>
                      {ocupado && (
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.20)' }}>
                          Ocupado
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ RESUMEN Y CONFIRM ══ */}
        <AnimatePresence>
          {parrilleroSel && franjaSel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, ease }}
              className="rounded-3xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <SectionLabel>Tu reserva</SectionLabel>

              {/* Resumen */}
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(200,148,10,0.12)', color: AMBER }}>
                  <FlameIcon size={18} color={AMBER} />
                </div>
                <div>
                  <p className="font-serif text-white" style={{ fontSize: '18px', fontWeight: 600, lineHeight: 1.1, marginBottom: '4px' }}>
                    {parrilleroSel.nombre}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>
                    {parrilleroSel.descripcion}
                  </p>
                </div>
              </div>

              {/* Fecha y turno */}
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="flex-1">
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '4px' }}>Fecha</p>
                  <p className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: '#fff', letterSpacing: '0.04em' }}>
                    {diaDisplay?.dia} {diaDisplay?.num} {diaDisplay?.mes}
                  </p>
                </div>
                <div style={{ width: '1px', height: '32px', background: 'rgba(255,255,255,0.07)' }} />
                <div className="flex-1">
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '4px' }}>Turno</p>
                  <p className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: AMBER, letterSpacing: '0.04em' }}>
                    {franjaSel.rango}
                  </p>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-xs mb-4 rounded-xl px-3 py-2.5" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}>
                  {error}
                </p>
              )}

              <button
                onClick={confirmar}
                disabled={confirmando}
                className="w-full py-4 rounded-2xl active:opacity-75 transition-opacity disabled:opacity-50"
                style={{ background: AMBER, fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0D0D0D' }}
              >
                {confirmando
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(0,0,0,0.3)', borderTopColor: '#0D0D0D' }} />
                      Confirmando...
                    </span>
                  : 'Confirmar reserva'
                }
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <NavBar />
    </main>
  )
}
