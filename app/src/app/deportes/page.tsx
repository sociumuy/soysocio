'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'
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

const DEPORTES = {
  rugby: {
    nombre: 'Rugby',
    acento: '#1B2D6E',
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

  const [activo, setActivo] = useState<Deporte>('rugby')
  const deporte = DEPORTES[activo]

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
        <div className="flex gap-1.5 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(Object.keys(DEPORTES) as Deporte[]).map((key) => {
            const sel = activo === key
            const d   = DEPORTES[key]
            return (
              <motion.button
                key={key}
                onClick={() => setActivo(key)}
                className="flex-1 flex flex-col items-center py-2.5 rounded-xl gap-1.5 transition-colors"
                style={{ background: sel ? d.acento : 'transparent' }}
                whileTap={{ scale: 0.95 }}
              >
                <span style={{ color: sel ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                  {ICONOS[key]}
                </span>
                <span className="text-[10px] font-bold tracking-wider"
                  style={{ color: sel ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                  {d.nombre}
                </span>
              </motion.button>
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
