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
  Rugby:         '#6B85D4',
  Hockey:        '#4CAF82',
  Fútbol:        '#D47A6B',
  Institucional: '#999',
  Indumentaria:  '#C8940A',
  Todos:         'rgba(255,255,255,0.35)',
}

const SEED_NOVEDADES: Novedad[] = [
  {
    id: 'seed-1',
    titulo: 'Intermedia B campeona: Copa de Oro Summum',
    resumen: 'El equipo de Intermedia B de hockey conquistó la Copa de Oro Summum tras una destacada campaña. Un logro histórico para las chicas del club.',
    cuerpo: 'El equipo de Intermedia B de hockey de Lobos Rugby Club conquistó la Copa de Oro Summum tras una destacada campaña en el campeonato 2023. El resultado fue contundente ante Seminario y coronó una temporada de trabajo constante de las jugadoras y su cuerpo técnico.',
    categoria: 'Hockey',
    destacada: true,
    imagen_url: null,
    created_at: '2023-10-15T12:00:00Z',
  },
  {
    id: 'seed-2',
    titulo: 'Circuito Femenino de Seven en Lobos',
    resumen: 'Lobos Rugby Club fue sede del Circuito Femenino de Seven, recibiendo a equipos de todo el Uruguay en nuestra cancha de Maldonado.',
    cuerpo: 'Lobos Rugby Club fue sede del Circuito Femenino de Seven, recibiendo a equipos de todo el Uruguay en nuestra cancha de Maldonado. Una fiesta del rugby femenino con gran nivel de juego y el calor de toda la familia lobos.',
    categoria: 'Rugby',
    destacada: false,
    imagen_url: null,
    created_at: '2022-10-24T12:00:00Z',
  },
  {
    id: 'seed-3',
    titulo: 'Colonia de Vacaciones Lobos 2022–2023',
    resumen: '"Aprender jugando." Lobos RC organiza su tradicional colonia de vacaciones para niños de todas las categorías del club durante el verano.',
    cuerpo: '"Aprender jugando." Durante el verano, Lobos RC organiza su tradicional colonia de vacaciones para niños de todas las categorías del club. Una semana de actividades, deporte y convivencia que refuerza los valores del club: respeto, compañerismo y espíritu indomable.',
    categoria: 'Institucional',
    destacada: false,
    imagen_url: null,
    created_at: '2022-11-22T12:00:00Z',
  },
  {
    id: 'seed-4',
    titulo: 'Triangular y cuadrangular Intermedia y M19',
    resumen: 'La primera semana de marzo el plantel Intermedia y M19 de Lobos participaron en torneos para dar inicio a la temporada 2023.',
    cuerpo: 'La primera semana de marzo el plantel Intermedia y M19 de Lobos participaron en torneos triangulares y cuadrangulares para dar inicio a la temporada 2023. Un arranque prometedor que ilusiona a toda la familia lobos de cara al campeonato.',
    categoria: 'Rugby',
    destacada: false,
    imagen_url: null,
    created_at: '2023-03-02T09:00:00Z',
  },
  {
    id: 'seed-5',
    titulo: 'Pretemporada Hockey Infantil',
    resumen: 'Arranca la pretemporada de hockey infantil en Lobos. Las más pequeñas del club dan sus primeros pasos en el deporte.',
    cuerpo: 'Arranca la pretemporada de hockey infantil en Lobos Rugby Club. Las categorías Sub-8, Sub-10 y Sub-12 se suman a los entrenamientos con entusiasmo y alegría. El hockey infantil es la base de las más de 170 jugadoras que hoy tiene el club.',
    categoria: 'Hockey',
    destacada: false,
    imagen_url: null,
    created_at: '2023-03-02T10:00:00Z',
  },
  {
    id: 'seed-6',
    titulo: 'Pretemporada Rugby Infantil',
    resumen: '¡Arrancan los más chicos! El rugby infantil de Lobos comenzó la pretemporada 2023 con categorías desde M7 hasta M13.',
    cuerpo: '¡Arrancan los más chicos! El rugby infantil de Lobos comenzó la pretemporada 2023 con categorías desde M7 hasta M13. El plantel formativo es la cantera del club y el semillero de los valores que definen la identidad lobos: compañerismo, humildad y solidaridad.',
    categoria: 'Rugby',
    destacada: false,
    imagen_url: null,
    created_at: '2023-03-02T11:00:00Z',
  },
  {
    id: 'seed-7',
    titulo: 'Pretemporada Fútbol Infantil y Juvenil',
    resumen: 'El departamento de fútbol de Lobos inicia la pretemporada 2023. Inscripciones abiertas para categorías infantiles y juveniles.',
    cuerpo: 'El departamento de fútbol de Lobos Rugby Club inicia la pretemporada 2023. Las categorías Infantiles y Juveniles vuelven a los entrenamientos con ganas de una gran temporada. Las inscripciones están abiertas — consultá en la oficina del club.',
    categoria: 'Fútbol',
    destacada: false,
    imagen_url: null,
    created_at: '2023-03-02T12:00:00Z',
  },
  {
    id: 'seed-8',
    titulo: 'Triangular Veteranos — Inicio de temporada',
    resumen: 'Los Veteranos de Lobos abrieron la temporada 2023 con un triangular entre equipos del club y rivales tradicionales.',
    cuerpo: 'Los Veteranos de Lobos Rugby Club abrieron la temporada 2023 con un triangular entre equipos del club y rivales tradicionales de la zona. Los Veteranos entrenan dos veces por semana y son el corazón histórico del club.',
    categoria: 'Rugby',
    destacada: false,
    imagen_url: null,
    created_at: '2023-03-02T08:00:00Z',
  },
]

function formatFecha(iso: string) {
  const d = new Date(iso)
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  return `${d.getDate()} ${['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][d.getMonth()]}`
}

// ── Detail view ────────────────────────────────────────
function NovedadDetalle({ n, onBack }: { n: Novedad; onBack: () => void }) {
  const color = CAT_COLOR[n.categoria] ?? 'rgba(255,255,255,0.35)'
  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#0D0D0D] flex flex-col"
    >
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: n.imagen_url ? 280 : 200 }}>
        {n.imagen_url ? (
          <>
            <img src={n.imagen_url} alt={n.titulo} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(13,13,13,0.92) 80%, #0D0D0D 100%)' }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(150deg, #161616 0%, #0D0D0D 100%)` }}>
            <GrainOverlay opacity={0.05} />
          </div>
        )}

        <button onClick={onBack}
          className="absolute top-14 left-5 z-20 flex items-center gap-1.5 active:opacity-60 transition-opacity"
          style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-body)', fontSize: '11px', WebkitTapHighlightColor: 'transparent' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          Novedades
        </button>

        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-7">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color }} >
              {n.categoria}
            </span>
          </div>
          <h1 className="font-serif text-white leading-tight" style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.01em' }}>{n.titulo}</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '8px' }}>{formatFecha(n.created_at)}</p>
        </div>
      </div>

      {/* Divisor */}
      <div className="mx-5 mb-7" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

      {/* Body */}
      <div className="flex-1 px-5 pb-32">
        {n.cuerpo.split('\n').map((p, i) =>
          p.trim() === ''
            ? <div key={i} className="h-4" />
            : <p key={i} style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: '1.75', color: 'rgba(255,255,255,0.68)', marginBottom: '8px' }}>{p}</p>
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
  const [slideDir, setSlideDir] = useState(0)
  const prevCatIndex = useRef(0)

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

  const hero = filtradas.find(n => n.destacada) ?? filtradas[0] ?? null
  const rest = filtradas.filter(n => n !== hero)

  if (novedadSel) return <NovedadDetalle n={novedadSel} onBack={() => setNovedadSel(null)} />

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col pb-32">

      {/* ── Header ── */}
      <div className="px-5 pt-20 pb-6">
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
          marginBottom: '16px',
        }}>
          Lobos Rugby Club
        </p>
        <h1 className="font-serif text-white" style={{ fontSize: '36px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          Novedades
        </h1>
      </div>

      {/* ── Category tabs ── */}
      <div className="flex gap-1.5 overflow-x-auto px-5 pb-5 scrollbar-hide">
        {CATEGORIAS.map((cat, i) => {
          const active = categoriaActiva === cat
          const color = CAT_COLOR[cat]
          return (
            <button key={cat} onClick={() => {
              const dir = i > prevCatIndex.current ? 1 : -1
              setSlideDir(dir); prevCatIndex.current = i; setCategoriaActiva(cat)
            }}
              className="relative flex-shrink-0 px-4 py-2 rounded-full transition-all active:opacity-70"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: active ? 700 : 500,
                letterSpacing: '0.04em',
                color: active ? '#fff' : 'rgba(255,255,255,0.30)',
                background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                border: active ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {active && cat !== 'Todos' && (
                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" style={{ background: color, marginTop: '-2px' }} />
              )}
              {cat}
            </button>
          )
        })}
      </div>

      {/* ── Divisor ── */}
      <div className="mx-5 mb-6" style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

      {/* ── Feed ── */}
      <div className="px-5 flex flex-col gap-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-5 h-5 border border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        ) : filtradas.length === 0 ? (
          <p className="text-center py-16" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>
            No hay novedades publicadas
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={categoriaActiva}
              initial={{ opacity: 0, x: slideDir * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDir * -20 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex flex-col gap-3"
            >

              {/* ── Hero card ── */}
              {hero && (
                <motion.button
                  onClick={() => setNovedadSel(hero)}
                  whileTap={{ scale: 0.985 }}
                  className="relative w-full rounded-3xl overflow-hidden text-left"
                  style={{ minHeight: 220 }}
                >
                  {hero.imagen_url ? (
                    <>
                      <img src={hero.imagen_url} alt={hero.titulo} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(10,10,12,0.88) 100%)' }} />
                    </>
                  ) : (
                    <div className="absolute inset-0"
                      style={{ background: `linear-gradient(150deg, #1a1a1a 0%, ${CAT_COLOR[hero.categoria] ?? 'rgba(255,255,255,0.1)'}18 100%)` }}>
                      <GrainOverlay opacity={0.06} />
                    </div>
                  )}

                  {hero.destacada && (
                    <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(200,148,10,0.18)', border: '1px solid rgba(200,148,10,0.35)' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C8940A' }}>
                        Destacado
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: CAT_COLOR[hero.categoria] ?? 'rgba(255,255,255,0.4)' }} />
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: CAT_COLOR[hero.categoria] ?? 'rgba(255,255,255,0.4)' }}>
                        {hero.categoria}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>
                        {formatFecha(hero.created_at)}
                      </span>
                    </div>
                    <h2 className="font-serif text-white leading-snug" style={{ fontSize: '19px', fontWeight: 600 }}>{hero.titulo}</h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {hero.resumen}
                    </p>
                  </div>
                </motion.button>
              )}

              {/* ── Rest cards ── */}
              {rest.map((n, i) => {
                const color = CAT_COLOR[n.categoria] ?? 'rgba(255,255,255,0.35)'
                return (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setNovedadSel(n)}
                    whileTap={{ scale: 0.985 }}
                    className="text-left w-full rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', WebkitTapHighlightColor: 'transparent' }}
                  >
                    {n.imagen_url && (
                      <img src={n.imagen_url} alt={n.titulo} className="w-full object-cover" style={{ height: '130px' }} />
                    )}
                    <div className="flex items-stretch">
                      <div className="w-[3px] flex-shrink-0" style={{ background: color, opacity: 0.6 }} />
                      <div className="flex-1 px-4 py-3.5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full" style={{ background: color }} />
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color }}>
                              {n.categoria}
                            </span>
                          </span>
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.20)', marginLeft: 'auto' }}>
                            {formatFecha(n.created_at)}
                          </span>
                        </div>
                        <h3 className="font-serif text-white leading-snug" style={{ fontSize: '15px', fontWeight: 600 }}>{n.titulo}</h3>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.38)', marginTop: '5px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {n.resumen}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}

            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <NavBar />
    </main>
  )
}
