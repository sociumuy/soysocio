'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Deporte = 'rugby' | 'hockey' | 'futbol'

const DEPORTES = {
  rugby: {
    nombre: 'Rugby',
    emoji: '🏉',
    color: '#1B2D6E',
    descripcion: 'El corazón del club. Formamos jugadores con valores desde los 6 años.',
    categorias: [
      { nombre: 'M6 – M8', subtitulo: 'Iniciación', dias: 'Sáb 9:00 hs', icono: '⭐' },
      { nombre: 'M10 – M12', subtitulo: 'Infantil', dias: 'Mié y Sáb 9:30 hs', icono: '🌟' },
      { nombre: 'M14 – M16', subtitulo: 'Juvenil', dias: 'Mar, Jue y Sáb 10:00 hs', icono: '💪' },
      { nombre: 'M19', subtitulo: 'Intermedia', dias: 'Lun, Mié, Vie 18:00 hs', icono: '🏆' },
      { nombre: 'Primera División', subtitulo: 'Adultos', dias: 'Lun, Mié, Vie 19:30 hs', icono: '🦁' },
      { nombre: 'Veteranos', subtitulo: '+35 años', dias: 'Sáb 11:00 hs', icono: '🧠' },
    ],
    contacto: 'rugby@lobosrugbyclub.uy',
  },
  hockey: {
    nombre: 'Hockey',
    emoji: '🏑',
    color: '#1A6B3A',
    descripcion: 'Disciplina, trabajo en equipo y pasión. El hockey crece cada año en Lobos.',
    categorias: [
      { nombre: 'Bebé Hockey', subtitulo: 'Iniciación', dias: 'Sáb 9:00 hs', icono: '⭐' },
      { nombre: 'Infantil', subtitulo: 'Sub-12', dias: 'Mar y Sáb 9:30 hs', icono: '🌟' },
      { nombre: 'Juvenil', subtitulo: 'Sub-16', dias: 'Lun, Mié y Sáb 10:00 hs', icono: '💪' },
      { nombre: 'Adultas', subtitulo: 'Primera División', dias: 'Mar, Jue y Dom 10:30 hs', icono: '🏆' },
    ],
    contacto: 'hockey@lobosrugbyclub.uy',
  },
  futbol: {
    nombre: 'Fútbol',
    emoji: '⚽',
    color: '#7D1A1A',
    descripcion: 'Fútbol infantil y juvenil con énfasis en formación y disfrute del juego.',
    categorias: [
      { nombre: 'Baby Fútbol', subtitulo: 'Iniciación', dias: 'Sáb 9:00 hs', icono: '⭐' },
      { nombre: 'Sub-8 – Sub-10', subtitulo: 'Infantil A', dias: 'Mié y Sáb 10:00 hs', icono: '🌟' },
      { nombre: 'Sub-12 – Sub-14', subtitulo: 'Infantil B', dias: 'Mar, Jue y Sáb 10:30 hs', icono: '💪' },
      { nombre: 'Sub-16', subtitulo: 'Juvenil', dias: 'Lun, Mié y Sáb 11:00 hs', icono: '🏆' },
    ],
    contacto: 'futbol@lobosrugbyclub.uy',
  },
}

export default function DeportesPage() {
  const router = useRouter()
  const [activo, setActivo] = useState<Deporte>('rugby')

  const deporte = DEPORTES[activo]

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <button onClick={() => router.push('/home')}
          className="flex items-center gap-2 text-[#555] text-xs mb-6 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Inicio
        </button>
        <div className="flex items-center gap-3">
          <img src="/lobos-logo.png" alt="Lobos" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-white font-serif text-3xl font-semibold">Deportes</h1>
            <p className="text-[#555] text-sm">Lobos Rugby Club</p>
          </div>
        </div>
      </div>

      {/* Tab selector */}
      <div className="px-5 pb-4">
        <div className="flex gap-2 bg-[#1a1a1a] rounded-2xl p-1">
          {(Object.keys(DEPORTES) as Deporte[]).map((key) => {
            const d = DEPORTES[key]
            const sel = activo === key
            return (
              <motion.button
                key={key}
                onClick={() => setActivo(key)}
                className="flex-1 flex flex-col items-center py-2.5 rounded-xl transition-colors"
                style={{ background: sel ? d.color : 'transparent' }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-base">{d.emoji}</span>
                <span className={`text-[10px] font-bold mt-0.5 ${sel ? 'text-white' : 'text-[#555]'}`}>
                  {d.nombre}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-28 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activo}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            className="flex flex-col gap-4"
          >
            {/* Banner del deporte */}
            <div className="rounded-2xl p-5 text-white overflow-hidden relative"
              style={{ background: `linear-gradient(135deg, ${deporte.color} 0%, ${deporte.color}cc 100%)` }}>
              <div className="absolute top-0 right-0 text-8xl opacity-10 leading-none -mt-2 -mr-2">
                {deporte.emoji}
              </div>
              <div className="relative z-10">
                <div className="text-3xl mb-2">{deporte.emoji}</div>
                <h2 className="font-serif text-2xl font-semibold mb-1">{deporte.nombre}</h2>
                <p className="text-white/70 text-sm leading-relaxed">{deporte.descripcion}</p>
              </div>
            </div>

            {/* Categorías */}
            <div>
              <p className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Categorías y horarios</p>
              <div className="flex flex-col gap-2">
                {deporte.categorias.map((cat, i) => (
                  <motion.div
                    key={cat.nombre}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease }}
                    className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                      style={{ background: `${deporte.color}12` }}>
                      {cat.icono}
                    </div>
                    <div className="flex-1">
                      <div className="text-[#0D0D0D] text-sm font-bold">{cat.nombre}</div>
                      <div className="text-[#aaa] text-xs">{cat.subtitulo}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-semibold" style={{ color: deporte.color }}>{cat.dias.split(' ')[0]}</div>
                      <div className="text-[#bbb] text-[10px]">{cat.dias.split(' ').slice(1).join(' ')}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contacto */}
            <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ background: `${deporte.color}12` }}>
                ✉️
              </div>
              <div>
                <div className="text-[#0D0D0D] text-sm font-bold">Contacto {deporte.nombre}</div>
                <div className="text-[#aaa] text-xs">{deporte.contacto}</div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      <NavBar />
    </main>
  )
}
