'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'
import Chip from '@/components/Chip'
import { getStoredClub } from '@/lib/club-storage'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
const BG = '#08101f'

type Deporte = 'rugby' | 'hockey' | 'futbol'

const ICONOS: Record<Deporte, React.ReactNode> = {
  rugby: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-35 12 12)" />
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="8.5" y1="7.5" x2="15.5" y2="7.5" />
      <line x1="7" y1="11" x2="17" y2="11" />
      <line x1="8.5" y1="14.5" x2="15.5" y2="14.5" />
    </svg>
  ),
  hockey: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="17" />
      <path d="M12 17 Q9 19.5 7 22" />
      <line x1="7" y1="22" x2="13" y2="22" />
      <circle cx="12" cy="3" r="2" />
    </svg>
  ),
  futbol: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7 l2.5 3.5 H18 l-2.5 3 1.5 3.5L12 15l-5 2 1.5-3.5L6 10h3.5z" />
    </svg>
  ),
}

type Equipo = { pos: number; nombre: string; pj: number; pg: number; pp: number; pts: number; esLobos?: boolean }
type Tabla  = { id: string; label: string; copa: string; fechas: number; equipos: Equipo[] }

const TABLAS_RUGBY: Tabla[] = [
  {
    id: 'primera', label: 'Primera', copa: 'Copa Perifar', fechas: 21,
    equipos: [
      { pos: 1,  nombre: 'Old Christians', pj: 22, pg: 21, pp: 1,  pts: 104 },
      { pos: 2,  nombre: 'Old Boys',        pj: 22, pg: 20, pp: 2,  pts: 99  },
      { pos: 3,  nombre: 'Carrasco Polo',   pj: 22, pg: 15, pp: 7,  pts: 77  },
      { pos: 4,  nombre: 'Cricket',         pj: 22, pg: 16, pp: 6,  pts: 75  },
      { pos: 5,  nombre: 'Los Cuervos',     pj: 22, pg: 15, pp: 7,  pts: 73  },
      { pos: 6,  nombre: 'PGC Trébol',      pj: 22, pg: 13, pp: 9,  pts: 70  },
      { pos: 7,  nombre: 'Lobos',           pj: 22, pg: 9,  pp: 13, pts: 50, esLobos: true },
      { pos: 8,  nombre: 'Ceibos',          pj: 22, pg: 7,  pp: 14, pts: 38  },
      { pos: 9,  nombre: 'Seminario',       pj: 22, pg: 5,  pp: 16, pts: 34  },
      { pos: 10, nombre: 'Champagnat',      pj: 22, pg: 5,  pp: 17, pts: 24  },
      { pos: 11, nombre: 'Círculo',         pj: 22, pg: 3,  pp: 19, pts: 17  },
      { pos: 12, nombre: 'PSG',             pj: 22, pg: 1,  pp: 20, pts: 10  },
    ],
  },
  {
    id: 'preintermedia', label: 'Preintermedia A', copa: 'Copa Perifar', fechas: 24,
    equipos: [
      { pos: 1,  nombre: 'Old Christians', pj: 24, pg: 24, pp: 0,  pts: 119 },
      { pos: 2,  nombre: 'Old Boys',        pj: 23, pg: 21, pp: 2,  pts: 101 },
      { pos: 3,  nombre: 'Azules OCC',      pj: 23, pg: 17, pp: 6,  pts: 88  },
      { pos: 4,  nombre: 'Lobos',           pj: 24, pg: 15, pp: 8,  pts: 79, esLobos: true },
      { pos: 5,  nombre: 'Carrasco Polo',   pj: 24, pg: 15, pp: 9,  pts: 77  },
      { pos: 6,  nombre: 'La Olla',         pj: 24, pg: 12, pp: 11, pts: 62  },
      { pos: 7,  nombre: 'PGC Trébol',      pj: 24, pg: 10, pp: 13, pts: 55  },
      { pos: 8,  nombre: 'Remeros',         pj: 24, pg: 10, pp: 14, pts: 51  },
      { pos: 9,  nombre: 'Los Cuervos',     pj: 24, pg: 8,  pp: 14, pts: 44  },
      { pos: 10, nombre: 'Cardos',          pj: 24, pg: 7,  pp: 17, pts: 40  },
      { pos: 11, nombre: 'Círculo',         pj: 23, pg: 6,  pp: 17, pts: 33  },
      { pos: 12, nombre: 'Jubilar',         pj: 22, pg: 4,  pp: 17, pts: 20  },
      { pos: 13, nombre: 'Los Robles',      pj: 23, pg: 1,  pp: 22, pts: 7   },
    ],
  },
  {
    id: 'm19', label: 'M19', copa: 'Campeonato Uruguayo', fechas: 21,
    equipos: [
      { pos: 1,  nombre: 'Old Boys',        pj: 22, pg: 21, pp: 1,  pts: 104 },
      { pos: 2,  nombre: 'Old Christians',  pj: 21, pg: 18, pp: 2,  pts: 93  },
      { pos: 3,  nombre: 'Los Cuervos',     pj: 22, pg: 15, pp: 6,  pts: 73  },
      { pos: 4,  nombre: 'Cricket',         pj: 22, pg: 13, pp: 7,  pts: 70  },
      { pos: 5,  nombre: 'Azules OCC',      pj: 22, pg: 12, pp: 10, pts: 63  },
      { pos: 6,  nombre: 'Seminario',       pj: 22, pg: 13, pp: 9,  pts: 61  },
      { pos: 7,  nombre: 'Carrasco Polo',   pj: 22, pg: 10, pp: 11, pts: 56  },
      { pos: 8,  nombre: 'Lobos',           pj: 21, pg: 10, pp: 12, pts: 54, esLobos: true },
      { pos: 9,  nombre: 'PGC Trébol',      pj: 22, pg: 9,  pp: 11, pts: 51  },
      { pos: 10, nombre: 'Champagnat',      pj: 22, pg: 4,  pp: 17, pts: 23  },
      { pos: 11, nombre: 'Ceibos',          pj: 21, pg: 2,  pp: 19, pts: 13  },
      { pos: 12, nombre: 'Azulgrana',       pj: 22, pg: 0,  pp: 22, pts: 0   },
    ],
  },
  {
    id: 'm17', label: 'M17', copa: 'Copa Oro', fechas: 4,
    equipos: [
      { pos: 1, nombre: 'Carrasco Polo',  pj: 4, pg: 3, pp: 0, pts: 11 },
      { pos: 2, nombre: 'British',        pj: 4, pg: 3, pp: 1, pts: 10 },
      { pos: 3, nombre: 'Monte VI',       pj: 4, pg: 3, pp: 1, pts: 10 },
      { pos: 4, nombre: 'Old Christians', pj: 4, pg: 2, pp: 1, pts: 9  },
      { pos: 5, nombre: 'Seminario',      pj: 4, pg: 2, pp: 2, pts: 8  },
      { pos: 6, nombre: 'Lobos',          pj: 4, pg: 1, pp: 3, pts: 6, esLobos: true },
      { pos: 7, nombre: 'Cricket',        pj: 4, pg: 1, pp: 3, pts: 6  },
      { pos: 8, nombre: 'Lions',          pj: 4, pg: 0, pp: 4, pts: 4  },
    ],
  },
  {
    id: 'femenino', label: 'Femenino', copa: 'Nacional General', fechas: 0,
    equipos: [
      { pos: 1, nombre: 'CTM Negro',    pj: 0, pg: 0, pp: 0, pts: 36 },
      { pos: 2, nombre: 'Vaimaca',      pj: 0, pg: 0, pp: 0, pts: 30 },
      { pos: 3, nombre: 'CTM Blanco',   pj: 0, pg: 0, pp: 0, pts: 24 },
      { pos: 4, nombre: 'Lobos',        pj: 0, pg: 0, pp: 0, pts: 16, esLobos: true },
      { pos: 5, nombre: 'Trouville',    pj: 0, pg: 0, pp: 0, pts: 6  },
      { pos: 6, nombre: 'Joaquín Suárez',pj:0, pg: 0, pp: 0, pts: 6  },
      { pos: 7, nombre: 'Mulitas',      pj: 0, pg: 0, pp: 0, pts: 4  },
      { pos: 8, nombre: 'Champagnat',   pj: 0, pg: 0, pp: 0, pts: 2  },
      { pos: 9, nombre: 'Mcricket',     pj: 0, pg: 0, pp: 0, pts: 0  },
    ],
  },
]

const DEPORTES = {
  rugby: {
    nombre: 'Rugby',
    acento: '#1B2D6E',
    acentoRgb: '27,45,110',
    descripcion: 'El corazón del club. Formamos jugadores con valores desde los 6 años.',
    categorias: [
      { nombre: 'M6 – M8',          subtitulo: 'Iniciación',  dias: 'Sáb',                  hora: '9:00 hs'   },
      { nombre: 'M10 – M12',        subtitulo: 'Infantil',    dias: 'Mié y Sáb',             hora: '9:30 hs'   },
      { nombre: 'M14 – M16',        subtitulo: 'Juvenil',     dias: 'Mar, Jue y Sáb',        hora: '10:00 hs'  },
      { nombre: 'M19',              subtitulo: 'Intermedia',  dias: 'Lun, Mié, Vie',         hora: '18:00 hs'  },
      { nombre: 'Primera División', subtitulo: 'Adultos',     dias: 'Lun, Mié, Vie',         hora: '19:30 hs'  },
      { nombre: 'Veteranos',        subtitulo: '+35 años',    dias: 'Sáb',                   hora: '11:00 hs'  },
    ],
    contacto: 'hola@lobosrugbyclub.uy',
  },
  hockey: {
    nombre: 'Hockey',
    acento: '#1A6B3A',
    acentoRgb: '26,107,58',
    descripcion: 'Disciplina, trabajo en equipo y pasión. Más de 170 jugadoras en el club.',
    categorias: [
      { nombre: 'Bebé Hockey', subtitulo: 'Iniciación',        dias: 'Sáb',           hora: '9:00 hs'   },
      { nombre: 'Infantil',    subtitulo: 'Sub-12',            dias: 'Mar y Sáb',     hora: '9:30 hs'   },
      { nombre: 'Juvenil',     subtitulo: 'Sub-16',            dias: 'Lun, Mié y Sáb',hora: '10:00 hs'  },
      { nombre: 'Adultas',     subtitulo: 'Primera División',  dias: 'Mar, Jue y Dom',hora: '10:30 hs'  },
    ],
    contacto: 'hola@lobosrugbyclub.uy',
  },
  futbol: {
    nombre: 'Fútbol',
    acento: '#7D1A1A',
    acentoRgb: '125,26,26',
    descripcion: 'Fútbol infantil y adulto con énfasis en formación y disfrute del juego.',
    categorias: [
      { nombre: 'Baby Fútbol',    subtitulo: 'Iniciación', dias: 'Sáb',           hora: '9:00 hs'  },
      { nombre: 'Sub-8 – Sub-10', subtitulo: 'Infantil A', dias: 'Mié y Sáb',     hora: '10:00 hs' },
      { nombre: 'Sub-12 – Sub-14',subtitulo: 'Infantil B', dias: 'Mar, Jue y Sáb',hora: '10:30 hs' },
      { nombre: 'Sub-16',         subtitulo: 'Juvenil',    dias: 'Lun, Mié y Sáb',hora: '11:00 hs' },
    ],
    contacto: 'hola@lobosrugbyclub.uy',
  },
}

export default function DeportesPage() {
  const router  = useRouter()
  const club    = getStoredClub()
  const primary = club?.color_primario ?? '#1B2D6E'
  const rgb     = club?.color_rgb      ?? '27, 45, 110'
  const logoUrl = club?.logo_url

  const [activo, setActivo]     = useState<Deporte>('rugby')
  const [tablaId, setTablaId]   = useState('primera')
  const deporte   = DEPORTES[activo]
  const tablaActiva = TABLAS_RUGBY.find(t => t.id === tablaId) ?? TABLAS_RUGBY[0]

  return (
    <main className="min-h-screen flex flex-col" style={{ background: BG }}>

      {/* ── Header ── */}
      <div className="relative px-5 pt-12 pb-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, rgba(${rgb},0.14) 0%, transparent 70%)` }} />

        <button onClick={() => router.push('/home')}
          className="relative z-10 flex items-center gap-2 text-white/30 text-xs mb-6 hover:text-white/60 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Inicio
        </button>

        <div className="relative z-10 flex items-center gap-3">
          {logoUrl
            ? <img src={logoUrl} alt="Lobos" className="w-10 h-10 object-contain" />
            : <img src="/lobos-logo.png" alt="Lobos" className="w-10 h-10 object-contain" />
          }
          <div>
            <h1 className="text-white font-serif text-3xl font-semibold leading-tight">Deportes</h1>
            <p className="text-white/30 text-xs mt-0.5">Lobos Rugby Club</p>
          </div>
        </div>
      </div>

      {/* ── Tab selector ── */}
      <div className="px-5 pb-5">
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {(Object.keys(DEPORTES) as Deporte[]).map((key) => {
            const d = DEPORTES[key]
            return (
              <Chip
                key={key}
                active={activo === key}
                onClick={() => setActivo(key)}
                accentRgb={d.acentoRgb}
                icon={ICONOS[key]}
                direction="col"
                variant="tab"
                size="md"
                layoutId="sport-tab"
                className="flex-1 py-2"
              >
                {d.nombre}
              </Chip>
            )
          })}
        </div>
      </div>

      {/* ── Contenido ── */}
      <div className="flex-1 px-5 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={activo}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease }}
            className="flex flex-col gap-4"
          >
            {/* Banner del deporte */}
            <div className="rounded-2xl p-5 overflow-hidden relative"
              style={{ background: `linear-gradient(135deg, ${deporte.acento} 0%, ${deporte.acento}99 100%)` }}>
              <div className="pointer-events-none absolute top-0 right-0 w-32 h-32 opacity-10"
                style={{ background: `radial-gradient(circle, #fff 0%, transparent 70%)`, transform: 'translate(30%,-30%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{ICONOS[activo]}</span>
                  <h2 className="text-white font-serif text-2xl font-semibold">{deporte.nombre}</h2>
                </div>
                <p className="text-white/65 text-sm leading-relaxed">{deporte.descripcion}</p>
              </div>
            </div>

            {/* ── Tablas de posiciones (solo Rugby) ── */}
            {activo === 'rugby' && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-[3px] h-3.5 rounded-full" style={{ background: deporte.acento }} />
                    <span className="text-white/65 text-[10px] font-bold uppercase tracking-[2px]">Posiciones</span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <span className="text-white/20 text-[9px]">uru.org.uy</span>
                </div>

                {/* Selector de categoría */}
                <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
                  {TABLAS_RUGBY.map(t => (
                    <Chip
                      key={t.id}
                      active={t.id === tablaId}
                      onClick={() => setTablaId(t.id)}
                      accentRgb={deporte.acentoRgb}
                      variant="pill"
                      layoutId="tabla-tab"
                    >
                      {t.label}
                    </Chip>
                  ))}
                </div>

                {/* Subtítulo de la tabla activa */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-white/30 text-[9px]">{tablaActiva.copa}</span>
                  {tablaActiva.fechas > 0 && (
                    <span className="text-white/20 text-[9px]">{tablaActiva.fechas} fechas</span>
                  )}
                </div>

                {/* Header de columnas */}
                <div className="flex items-center px-3 py-1 mb-1">
                  <span className="w-6 text-white/20 text-[9px] font-bold text-center">#</span>
                  <span className="flex-1 text-white/20 text-[9px] font-bold uppercase tracking-wider pl-2">Equipo</span>
                  {tablaActiva.id !== 'femenino' && <>
                    <span className="w-8 text-white/20 text-[9px] font-bold text-center">PJ</span>
                    <span className="w-8 text-white/20 text-[9px] font-bold text-center">PG</span>
                  </>}
                  <span className="w-10 text-white/20 text-[9px] font-bold text-center">PTS</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={tablaId}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease }}
                    className="flex flex-col gap-1">
                    {tablaActiva.equipos.map((eq, i) => (
                      <div key={eq.nombre}
                        className="flex items-center px-3 py-2.5 rounded-xl relative overflow-hidden"
                        style={{
                          background: eq.esLobos
                            ? 'rgba(27,45,110,0.35)'
                            : i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                          border: eq.esLobos ? '1px solid rgba(27,45,110,0.5)' : '1px solid transparent',
                        }}>
                        {eq.esLobos && (
                          <div className="absolute inset-0 pointer-events-none"
                            style={{ background: 'linear-gradient(90deg, rgba(27,45,110,0.25) 0%, transparent 70%)' }} />
                        )}
                        <span className="w-6 text-center text-[11px] font-bold relative z-10"
                          style={{ color: eq.pos <= 4 ? '#5c9e6a' : eq.esLobos ? '#fff' : 'rgba(255,255,255,0.25)' }}>
                          {eq.pos}
                        </span>
                        <span className="flex-1 pl-2 text-[12px] font-semibold relative z-10 leading-tight"
                          style={{ color: eq.esLobos ? '#fff' : 'rgba(255,255,255,0.78)' }}>
                          {eq.nombre}
                          {eq.esLobos && (
                            <span className="ml-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.65)' }}>
                              Nosotros
                            </span>
                          )}
                        </span>
                        {tablaActiva.id !== 'femenino' && <>
                          <span className="w-8 text-center text-[11px] relative z-10"
                            style={{ color: 'rgba(255,255,255,0.3)' }}>{eq.pj}</span>
                          <span className="w-8 text-center text-[11px] relative z-10"
                            style={{ color: 'rgba(255,255,255,0.3)' }}>{eq.pg}</span>
                        </>}
                        <span className="w-10 text-center text-[13px] font-bold relative z-10"
                          style={{ color: eq.esLobos ? '#fff' : eq.pos <= 4 ? '#5c9e6a' : 'rgba(255,255,255,0.55)' }}>
                          {eq.pts}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* Categorías */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[9px] font-bold uppercase tracking-[3px]"
                  style={{ color: `rgba(${rgb},0.7)` }}>Categorías y Horarios</span>
                <div className="flex-1 h-px" style={{ background: `rgba(${rgb},0.15)` }} />
              </div>
              <div className="flex flex-col gap-2">
                {deporte.categorias.map((cat, i) => (
                  <motion.div
                    key={cat.nombre}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, ease }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderLeft: `3px solid ${deporte.acento}`,
                    }}
                  >
                    <div className="flex-1">
                      <p className="text-white text-sm font-bold leading-tight">{cat.nombre}</p>
                      <p className="text-white/35 text-xs mt-0.5">{cat.subtitulo}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white/60 text-[11px] font-semibold">{cat.dias}</p>
                      <p className="text-white/35 text-[10px] mt-0.5">{cat.hora}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contacto */}
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `rgba(${rgb},0.12)`, color: primary }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p className="text-white/30 text-[9px] uppercase tracking-[3px]">Contacto {deporte.nombre}</p>
                <p className="text-white text-sm font-medium mt-0.5">{deporte.contacto}</p>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      <NavBar />
    </main>
  )
}
