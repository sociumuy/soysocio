'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import NavBar from '@/components/NavBar'
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

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  'Todos':         { bg: '#0D0D0D', text: '#fff' },
  'Torneos':       { bg: '#1A3A5C', text: '#6BAED6' },
  'Institucional': { bg: '#1A3A1A', text: '#52C97A' },
  'Indumentaria':  { bg: '#3A1A1A', text: '#E07070' },
  'Salud':         { bg: '#2A1A3A', text: '#B07AE0' },
}

const CAT_BADGE: Record<string, { bg: string; text: string }> = {
  'Todos':         { bg: '#F4F3EF', text: '#888' },
  'Torneos':       { bg: '#EBF4FF', text: '#1A5C9E' },
  'Institucional': { bg: '#EAFAF0', text: '#1A6B3A' },
  'Indumentaria':  { bg: '#FAEAEA', text: '#A03030' },
  'Salud':         { bg: '#F4EAFA', text: '#7030A0' },
}

function formatFecha(iso: string) {
  const d = new Date(iso)
  const ahora = new Date()
  const diff = Math.floor((ahora.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Hoy'
  if (diff === 1) return 'Ayer'
  return `${d.getDate()} ${['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][d.getMonth()]}`
}

export default function NovedadesPage() {
  const router = useRouter()
  const supabase = createClient()
  const [novedades, setNovedades] = useState<Novedad[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>('Todos')
  const [novedadSel, setNovedadSel] = useState<Novedad | null>(null)
  const [slideDir, setSlideDir] = useState(0)
  const prevCatIndex = useRef(0)

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from('novedades')
        .select('*')
        .order('created_at', { ascending: false })
      setNovedades((data as Novedad[]) ?? [])
      setLoading(false)
    }
    cargar()
  }, [])

  const filtradas = categoriaActiva === 'Todos'
    ? novedades
    : novedades.filter(n => n.categoria === categoriaActiva)

  // Vista de detalle
  if (novedadSel) {
    const colors = CAT_COLORS[novedadSel.categoria] ?? CAT_COLORS['Todos']
    const badge = CAT_BADGE[novedadSel.categoria] ?? CAT_BADGE['Todos']
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex flex-col">
        <div style={{ background: colors.bg }} className="px-5 pt-12 pb-8">
          <button onClick={() => setNovedadSel(null)}
            className="flex items-center gap-2 text-[#555] text-xs mb-6 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            Novedades
          </button>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ color: colors.text, border: `1px solid ${colors.text}30` }}>
            {novedadSel.categoria}
          </div>
          <h1 className="text-white font-serif text-2xl font-semibold leading-snug">{novedadSel.titulo}</h1>
          <p className="text-[#555] text-xs mt-3">{formatFecha(novedadSel.created_at)}</p>
        </div>
        {novedadSel.imagen_url && (
          <img src={novedadSel.imagen_url} alt={novedadSel.titulo} className="w-full h-52 object-cover" />
        )}
        <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-28">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            {novedadSel.cuerpo.split('\n').map((parrafo, i) => (
              parrafo.trim() === ''
                ? <div key={i} className="h-3" />
                : <p key={i} className="text-[#333] text-sm leading-relaxed">{parrafo}</p>
            ))}
          </div>
        </div>
        <NavBar />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <div className="px-5 pt-12 pb-6">
        <div className="h-10 mb-2" />
        <h1 className="text-white font-serif text-3xl font-semibold">Novedades</h1>
        <p className="text-[#555] text-sm mt-1">Club Carrasco</p>
      </div>

      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-32 flex flex-col gap-4">

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {CATEGORIAS.map((cat, i) => (
            <button key={cat} onClick={() => {
              const dir = i > prevCatIndex.current ? 1 : -1
              setSlideDir(dir)
              prevCatIndex.current = i
              setCategoriaActiva(cat)
            }}
              className="relative flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-colors"
              style={{ color: categoriaActiva === cat ? '#fff' : '#888' }}
            >
              {categoriaActiva === cat && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-full bg-[#0D0D0D]"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  style={{ zIndex: 0 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" custom={slideDir}>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-[#B8975A] border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <motion.div
            key={categoriaActiva}
            custom={slideDir}
            initial={{ opacity: 0, x: slideDir * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDir * -24 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {filtradas.length === 0 ? (
              <div className="text-center py-16 text-[#aaa] text-sm">No hay novedades publicadas</div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtradas.map((n, i) => {
                  const badge = CAT_BADGE[n.categoria] ?? CAT_BADGE['Todos']
                  const isDestacada = n.destacada && categoriaActiva === 'Todos' && i === 0
                  return (
                    <motion.button
                      key={n.id}
                      onClick={() => setNovedadSel(n)}
                      whileTap={{ scale: 0.98 }}
                      className={`bg-white rounded-2xl shadow-sm text-left overflow-hidden w-full ${isDestacada ? 'ring-1 ring-[#B8975A]/30' : ''}`}
                    >
                      <div className="h-1 w-full" style={{ background: CAT_COLORS[n.categoria]?.text ?? '#888' }} />
                      {n.imagen_url && (
                        <img src={n.imagen_url} alt={n.titulo} className="w-full h-36 object-cover" />
                      )}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                            style={{ background: badge.bg, color: badge.text }}>
                            {n.categoria}
                          </span>
                          {isDestacada && <span className="text-[10px] text-[#B8975A] font-semibold uppercase tracking-wider">Destacado</span>}
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
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
      <NavBar />
    </main>
  )
}
