'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import NavBar from '@/components/NavBar'
import GrainOverlay from '@/components/GrainOverlay'
import { motion, AnimatePresence } from 'framer-motion'

type Categoria = 'Todos' | 'Rugby' | 'Hockey' | 'Fútbol' | 'Institucional' | 'Indumentaria'

type Novedad = {
  id: string
  titulo: string
  resumen: string
  cuerpo: string
  categoria: Categoria
  destacada: boolean
  imagen_url: string | null
  created_at: string
}

const CATEGORIAS: Categoria[] = ['Todos', 'Rugby', 'Hockey', 'Fútbol', 'Institucional', 'Indumentaria']

const CAT_COLOR: Record<string, string> = {
  Rugby:         '#5B7ED4',
  Hockey:        '#4DB880',
  Fútbol:        '#D4705E',
  Institucional: '#9E9E9E',
  Indumentaria:  '#C8940A',
  Todos:         'rgba(255,255,255,0.5)',
}

const SEED_NOVEDADES: Novedad[] = [
  { id: 'seed-1', titulo: 'Intermedia B campeona: Copa de Oro Summum', resumen: 'El equipo de Intermedia B de hockey conquistó la Copa de Oro Summum tras una destacada campaña. Un logro histórico para las chicas del club.', cuerpo: 'El equipo de Intermedia B de hockey de Lobos Rugby Club conquistó la Copa de Oro Summum tras una destacada campaña en el campeonato 2023.', categoria: 'Hockey', destacada: true, imagen_url: null, created_at: '2023-10-15T12:00:00Z' },
  { id: 'seed-2', titulo: 'Circuito Femenino de Seven en Lobos', resumen: 'Lobos Rugby Club fue sede del Circuito Femenino de Seven, recibiendo a equipos de todo el Uruguay en nuestra cancha de Maldonado.', cuerpo: 'Una fiesta del rugby femenino con gran nivel de juego y el calor de toda la familia lobos.', categoria: 'Rugby', destacada: false, imagen_url: null, created_at: '2022-10-24T12:00:00Z' },
  { id: 'seed-3', titulo: 'Colonia de Vacaciones Lobos 2022–2023', resumen: '"Aprender jugando." Lobos RC organiza su tradicional colonia de vacaciones para niños de todas las categorías del club durante el verano.', cuerpo: 'Una semana de actividades, deporte y convivencia que refuerza los valores del club.', categoria: 'Institucional', destacada: false, imagen_url: null, created_at: '2022-11-22T12:00:00Z' },
  { id: 'seed-4', titulo: 'Triangular y cuadrangular Intermedia y M19', resumen: 'La primera semana de marzo el plantel Intermedia y M19 de Lobos participaron en torneos para dar inicio a la temporada 2023.', cuerpo: 'Un arranque prometedor que ilusiona a toda la familia lobos de cara al campeonato.', categoria: 'Rugby', destacada: false, imagen_url: null, created_at: '2023-03-04T09:00:00Z' },
  { id: 'seed-5', titulo: 'Pretemporada Hockey Infantil', resumen: 'Arranca la pretemporada de hockey infantil en Lobos. Las más pequeñas del club dan sus primeros pasos en el deporte.', cuerpo: 'El hockey infantil es la base de las más de 170 jugadoras que hoy tiene el club.', categoria: 'Hockey', destacada: false, imagen_url: null, created_at: '2023-03-04T10:00:00Z' },
  { id: 'seed-6', titulo: 'Pretemporada Rugby Infantil', resumen: '¡Arrancan los más chicos! El rugby infantil de Lobos comenzó la pretemporada 2023 con categorías desde M7 hasta M13.', cuerpo: 'El plantel formativo es la cantera del club y el semillero de los valores que definen la identidad lobos.', categoria: 'Rugby', destacada: false, imagen_url: null, created_at: '2023-03-04T11:00:00Z' },
  { id: 'seed-7', titulo: 'Pretemporada Fútbol Infantil y Juvenil', resumen: 'El departamento de fútbol de Lobos inicia la pretemporada 2023. Inscripciones abiertas para categorías infantiles y juveniles.', cuerpo: 'Las categorías Infantiles y Juveniles vuelven a los entrenamientos con ganas de una gran temporada.', categoria: 'Fútbol', destacada: false, imagen_url: null, created_at: '2023-03-04T12:00:00Z' },
  { id: 'seed-8', titulo: 'Triangular Veteranos — Inicio de temporada', resumen: 'Los Veteranos de Lobos abrieron la temporada 2023 con un triangular entre equipos del club y rivales tradicionales.', cuerpo: 'Los Veteranos entrenan dos veces por semana y son el corazón histórico del club.', categoria: 'Rugby', destacada: false, imagen_url: null, created_at: '2023-03-04T08:00:00Z' },
]

const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']

function parseFecha(iso: string) {
  const d = new Date(iso)
  return { day: d.getDate(), mes: MESES[d.getMonth()], year: d.getFullYear() }
}

function formatFechaDetalle(iso: string) {
  const { day, mes, year } = parseFecha(iso)
  return `${day} ${mes} ${year}`
}

// ── Detail view ────────────────────────────────────────
function NovedadDetalle({ n, onBack }: { n: Novedad; onBack: () => void }) {
  const color = CAT_COLOR[n.categoria] ?? 'rgba(255,255,255,0.35)'
  return (
    <motion.main
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#0D0D0D] flex flex-col"
    >
      {/* Accent line at very top */}
      <div style={{ height: '2px', background: color }} />

      {/* Header */}
      <div className="px-5 pt-14 pb-7">
        <button onClick={onBack}
          className="flex items-center gap-1.5 mb-8 active:opacity-50 transition-opacity"
          style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.08em', WebkitTapHighlightColor: 'transparent' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          Novedades
        </button>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color }} >
            {n.categoria}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.20)', marginLeft: 'auto' }}>
            {formatFechaDetalle(n.created_at)}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-white" style={{ fontSize: '26px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {n.titulo}
        </h1>

        {n.imagen_url && (
          <img src={n.imagen_url} alt={n.titulo} className="w-full rounded-2xl mt-6 object-cover" style={{ height: '200px' }} />
        )}
      </div>

      {/* Hairline */}
      <div className="mx-5 mb-6" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

      {/* Body */}
      <div className="px-5 pb-32 flex flex-col gap-4">
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.75, color: 'rgba(255,255,255,0.65)' }}>
          {n.resumen}
        </p>
        {n.cuerpo !== n.resumen && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.75, color: 'rgba(255,255,255,0.45)' }}>
            {n.cuerpo}
          </p>
        )}
      </div>

      <NavBar />
    </motion.main>
  )
}

// ── Main list view ─────────────────────────────────────
export default function NovedadesPage() {
  const supabase = createClient()
  const [novedades, setNovedades] = useState<Novedad[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>('Todos')
  const [novedadSel, setNovedadSel] = useState<Novedad | null>(null)
  const prevCatIndex = useRef(0)
  const [slideDir, setSlideDir] = useState(0)

  useEffect(() => {
    supabase.from('novedades').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        const result = (data as Novedad[]) ?? []
        setNovedades(result.length > 0 ? result : SEED_NOVEDADES)
        setLoading(false)
      })
  }, [])

  const filtradas = categoriaActiva === 'Todos'
    ? novedades
    : novedades.filter(n => n.categoria === categoriaActiva)

  const portada = filtradas.find(n => n.destacada) ?? filtradas[0] ?? null
  const rest    = filtradas.filter(n => n !== portada)
  const grid    = rest.slice(0, 2)
  const lista   = rest.slice(2)

  if (novedadSel) return <NovedadDetalle n={novedadSel} onBack={() => setNovedadSel(null)} />

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col pb-32">

      {/* ── Header ── */}
      <div className="px-5 pt-20 pb-5">
        <div className="flex items-end justify-between">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Novedades
          </h1>
          {novedades.length > 0 && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.20)', letterSpacing: '0.08em' }}>
              {filtradas.length} {filtradas.length === 1 ? 'historia' : 'historias'}
            </span>
          )}
        </div>
      </div>

      {/* ── Category tabs — underline editorial ── */}
      <div className="relative mb-6">
        <div
          className="flex gap-0 overflow-x-auto scrollbar-hide px-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {CATEGORIAS.map((cat, i) => {
            const active = categoriaActiva === cat
            const color  = CAT_COLOR[cat]
            return (
              <button key={cat} onClick={() => {
                const dir = i > prevCatIndex.current ? 1 : -1
                setSlideDir(dir); prevCatIndex.current = i; setCategoriaActiva(cat)
              }}
                className="relative flex-shrink-0 pb-3 mr-5 active:opacity-60 transition-all"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  fontWeight: active ? 700 : 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: active ? '#fff' : 'rgba(255,255,255,0.25)',
                  transition: 'color 0.2s',
                }}>
                  {cat}
                </span>
                {active && (
                  <motion.div
                    layoutId="cat-underline"
                    className="absolute bottom-0 left-0 right-0"
                    style={{ height: '2px', background: cat === 'Todos' ? 'rgba(255,255,255,0.5)' : color }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Feed ── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-5 h-5 border border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      ) : filtradas.length === 0 ? (
        <p className="text-center py-20" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.20)' }}>
          No hay novedades en esta categoría
        </p>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={categoriaActiva}
            initial={{ opacity: 0, x: slideDir * 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDir * -18 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col"
          >

            {/* ══ PORTADA ══ */}
            {portada && (
              <motion.button
                onClick={() => setNovedadSel(portada)}
                whileTap={{ scale: 0.98 }}
                className="mx-5 mb-6 rounded-3xl overflow-hidden relative text-left"
                style={{ minHeight: '240px', WebkitTapHighlightColor: 'transparent' }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Fondo */}
                {portada.imagen_url ? (
                  <>
                    <img src={portada.imagen_url} alt={portada.titulo} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(10,10,10,0.90) 60%, #0D0D0D 100%)' }} />
                  </>
                ) : (
                  <div className="absolute inset-0" style={{ background: '#111' }}>
                    <GrainOverlay opacity={0.06} />
                    {/* Sport glow */}
                    <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none"
                      style={{ background: `radial-gradient(circle at bottom left, ${CAT_COLOR[portada.categoria]}28 0%, transparent 65%)` }} />
                    {/* Top accent band */}
                    <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: CAT_COLOR[portada.categoria] ?? 'rgba(255,255,255,0.2)' }} />
                  </div>
                )}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: CAT_COLOR[portada.categoria] }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: CAT_COLOR[portada.categoria] }}>
                        {portada.categoria}
                      </span>
                    </div>
                    {portada.destacada && (
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.12)', padding: '3px 8px', borderRadius: '100px' }}>
                        Portada
                      </span>
                    )}
                  </div>

                  <div>
                    <h2 className="font-serif text-white" style={{ fontSize: '22px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: '8px' }}>
                      {portada.titulo}
                    </h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '14px' }}>
                      {portada.resumen}
                    </p>
                    <div className="flex items-center justify-between">
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em' }}>
                        {formatFechaDetalle(portada.created_at)}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>
                        Leer →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            )}

            {/* ══ GRID 2× ══ */}
            {grid.length > 0 && (
              <div className="px-5 mb-7">
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: '12px' }}>
                  Más historias
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {grid.map((n, i) => {
                    const color = CAT_COLOR[n.categoria] ?? 'rgba(255,255,255,0.3)'
                    const { day, mes } = parseFecha(n.created_at)
                    return (
                      <motion.button
                        key={n.id}
                        onClick={() => setNovedadSel(n)}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-2xl overflow-hidden text-left flex flex-col"
                        style={{ background: 'rgba(255,255,255,0.04)', WebkitTapHighlightColor: 'transparent' }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {n.imagen_url
                          ? <img src={n.imagen_url} alt={n.titulo} className="w-full object-cover" style={{ height: '80px' }} />
                          : <div style={{ height: '4px', background: color }} />
                        }
                        <div className="p-3 flex-1 flex flex-col gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color }}>
                              {n.categoria}
                            </span>
                          </div>
                          <h3 className="font-serif text-white" style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {n.titulo}
                          </h3>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.22)', marginTop: 'auto' }}>
                            {day} {mes}
                          </span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ══ LISTA PERIÓDICO ══ */}
            {lista.length > 0 && (
              <div className="px-5">
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: '4px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  Archivo
                </p>
                {lista.map((n, i) => {
                  const color = CAT_COLOR[n.categoria] ?? 'rgba(255,255,255,0.3)'
                  const { day, mes } = parseFecha(n.created_at)
                  return (
                    <motion.button
                      key={n.id}
                      onClick={() => setNovedadSel(n)}
                      whileTap={{ scale: 0.99 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full text-left flex items-start gap-4 py-4"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', WebkitTapHighlightColor: 'transparent' }}
                    >
                      {/* Fecha columna */}
                      <div className="flex flex-col items-center w-9 flex-shrink-0 pt-0.5">
                        <span className="font-serif" style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1, color }}>
                          {day}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '7px', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.22)', marginTop: '2px' }}>
                          {mes}
                        </span>
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color }} />
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color }}>
                            {n.categoria}
                          </span>
                        </div>
                        <h3 className="font-serif text-white" style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                          {n.titulo}
                        </h3>
                      </div>

                      {/* Thumb si tiene imagen */}
                      {n.imagen_url && (
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={n.imagen_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      )}

      <NavBar />
    </main>
  )
}
