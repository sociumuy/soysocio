'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import NavBar from '@/components/NavBar'
import GrainOverlay from '@/components/GrainOverlay'
import { motion, AnimatePresence } from 'framer-motion'

type Categoria = 'Todos' | 'Torneos' | 'Institucional' | 'Indumentaria' | 'Salud'

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

const CATEGORIAS: Categoria[] = ['Todos', 'Torneos', 'Institucional', 'Indumentaria', 'Salud']

const CAT_ACCENT: Record<string, string> = {
  Torneos: '#6BAED6',
  Institucional: '#52C97A',
  Indumentaria: '#E07070',
  Salud: '#B07AE0',
  Todos: '#B8975A',
}

const CAT_BADGE: Record<string, { bg: string; text: string }> = {
  Torneos: { bg: '#EBF4FF', text: '#1A5C9E' },
  Institucional: { bg: '#EAFAF0', text: '#1A6B3A' },
  Indumentaria: { bg: '#FAEAEA', text: '#A03030' },
  Salud: { bg: '#F4EAFA', text: '#7030A0' },
  Todos: { bg: '#F4F3EF', text: '#888' },
}

function formatFecha(iso: string) {
  const d = new Date(iso)
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  return `${d.getDate()} ${['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][d.getMonth()]}`
}

// ── Detail view ──────────────────────────────────────
function NovedadDetalle({ n, onBack }: { n: Novedad; onBack: () => void }) {
  const accent = CAT_ACCENT[n.categoria] ?? '#B8975A'
  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-[#0D0D0D] flex flex-col"
    >
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: n.imagen_url ? 260 : 180 }}>
        {n.imagen_url ? (
          <>
            <img src={n.imagen_url} alt={n.titulo} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(13,13,13,0.85) 70%, #0D0D0D 100%)' }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #111 0%, ${accent}18 100%)` }}>
            <GrainOverlay opacity={0.06} />
          </div>
        )}

        {/* back button */}
        <button onClick={onBack}
          className="absolute top-12 left-5 z-20 flex items-center gap-2 text-white/60 text-xs hover:text-white transition-colors px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          Novedades
        </button>

        {/* title overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-6">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}40` }}>
            {n.categoria}
          </span>
          <h1 className="text-white font-serif text-2xl font-semibold leading-snug">{n.titulo}</h1>
          <p className="text-white/40 text-xs mt-2">{formatFecha(n.created_at)}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-32">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          {n.cuerpo.split('\n').map((p, i) =>
            p.trim() === ''
              ? <div key={i} className="h-3" />
              : <p key={i} className="text-[#333] text-sm leading-relaxed">{p}</p>
          )}
        </div>
      </div>
      <NavBar />
    </motion.main>
  )
}

// ── Main list view ────────────────────────────────────
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
      .then(({ data }) => { setNovedades((data as Novedad[]) ?? []); setLoading(false) })
  }, [])

  const filtradas = categoriaActiva === 'Todos'
    ? novedades
    : novedades.filter(n => n.categoria === categoriaActiva)

  const hero = filtradas.find(n => n.destacada) ?? filtradas[0] ?? null
  const rest = filtradas.filter(n => n !== hero)

  if (novedadSel) return <NovedadDetalle n={novedadSel} onBack={() => setNovedadSel(null)} />

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* ── Dark header ── */}
      <div className="relative px-5 pt-12 pb-6 overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="pointer-events-none absolute top-0 left-0 w-64 h-64 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(184,151,90,0.5) 0%, transparent 70%)', transform: 'translate(-40%, -40%)' }} />
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <h1 className="text-white font-serif text-4xl font-semibold"
            style={{ background: 'linear-gradient(135deg, #fff 40%, rgba(184,151,90,0.7) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Novedades
          </h1>
          <p className="text-[#444] text-xs mt-1 tracking-wider">Club Carrasco</p>
        </motion.div>
      </div>

      {/* ── Cream body ── */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-5 pb-32 flex flex-col gap-4">

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {CATEGORIAS.map((cat, i) => (
            <button key={cat} onClick={() => {
              const dir = i > prevCatIndex.current ? 1 : -1
              setSlideDir(dir); prevCatIndex.current = i; setCategoriaActiva(cat)
            }}
              className="relative flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors"
              style={{ color: categoriaActiva === cat ? '#fff' : '#888' }}
            >
              {categoriaActiva === cat && (
                <motion.span layoutId="cat-pill"
                  className="absolute inset-0 rounded-full bg-[#0D0D0D]"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  style={{ zIndex: 0 }} />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#B8975A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtradas.length === 0 ? (
          <div className="text-center py-16 text-[#aaa] text-sm">No hay novedades publicadas</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={categoriaActiva}
              initial={{ opacity: 0, x: slideDir * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: slideDir * -24 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="flex flex-col gap-3"
            >

              {/* ── Hero featured card ── */}
              {hero && (
                <motion.button
                  onClick={() => setNovedadSel(hero)}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full rounded-2xl overflow-hidden text-left shadow-lg"
                  style={{ minHeight: 200 }}
                >
                  {hero.imagen_url ? (
                    <>
                      <img src={hero.imagen_url} alt={hero.titulo} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(13,13,13,0.82) 100%)' }} />
                    </>
                  ) : (
                    <div className="absolute inset-0"
                      style={{ background: `linear-gradient(135deg, #111 0%, ${CAT_ACCENT[hero.categoria] ?? '#B8975A'}25 100%)` }}>
                      <GrainOverlay opacity={0.07} />
                    </div>
                  )}

                  {/* badges */}
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: `${CAT_ACCENT[hero.categoria] ?? '#B8975A'}30`, color: CAT_ACCENT[hero.categoria] ?? '#B8975A', border: `1px solid ${CAT_ACCENT[hero.categoria] ?? '#B8975A'}40`, backdropFilter: 'blur(4px)' }}>
                      {hero.categoria}
                    </span>
                    {hero.destacada && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#B8975A]"
                        style={{ background: 'rgba(184,151,90,0.2)', border: '1px solid rgba(184,151,90,0.3)', backdropFilter: 'blur(4px)' }}>
                        ★ Destacado
                      </span>
                    )}
                  </div>

                  {/* content */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
                    <h2 className="text-white font-serif text-xl font-semibold leading-snug mb-1">{hero.titulo}</h2>
                    <p className="text-white/60 text-xs line-clamp-2 mb-3">{hero.resumen}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-[10px]">{formatFecha(hero.created_at)}</span>
                      <span className="text-[#B8975A] text-[10px] font-semibold flex items-center gap-1">
                        Leer más
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                      </span>
                    </div>
                  </div>
                </motion.button>
              )}

              {/* ── Rest of cards ── */}
              {rest.map((n, i) => {
                const badge = CAT_BADGE[n.categoria] ?? CAT_BADGE['Todos']
                const accent = CAT_ACCENT[n.categoria] ?? '#B8975A'
                return (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setNovedadSel(n)}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl shadow-sm text-left overflow-hidden w-full"
                  >
                    {n.imagen_url && (
                      <img src={n.imagen_url} alt={n.titulo} className="w-full h-36 object-cover" />
                    )}
                    <div className="flex items-stretch">
                      <div className="w-1 flex-shrink-0 rounded-l-none" style={{ background: accent }} />
                      <div className="flex-1 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                            style={{ background: badge.bg, color: badge.text }}>
                            {n.categoria}
                          </span>
                          <span className="text-[#ccc] text-[10px] ml-auto">{formatFecha(n.created_at)}</span>
                        </div>
                        <h3 className="text-[#0D0D0D] text-sm font-bold leading-snug mb-1">{n.titulo}</h3>
                        <p className="text-[#888] text-xs leading-relaxed line-clamp-2">{n.resumen}</p>
                        <div className="flex items-center justify-end mt-3">
                          <span className="text-[#B8975A] text-[10px] font-semibold flex items-center gap-1">
                            Leer más
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                          </span>
                        </div>
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
