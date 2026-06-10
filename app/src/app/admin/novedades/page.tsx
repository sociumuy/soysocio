'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useAdmin, tieneAcceso } from '@/lib/admin-context'
import AccesoDenegado from '@/components/AccesoDenegado'

const NOVEDADES_MOCK = [
  { titulo: 'Torneo de verano — Inscripciones abiertas', categoria: 'Torneos', fecha: 'Hoy · 10:30 hs' },
  { titulo: 'Nueva colección de indumentaria disponible', categoria: 'Indumentaria', fecha: 'Ayer · 15:00 hs' },
  { titulo: 'Asamblea ordinaria — 15 de junio, 19 hs', categoria: 'Institucional', fecha: 'Jun 5 · 09:00 hs' },
  { titulo: 'Nuevo programa de nutrición deportiva', categoria: 'Salud', fecha: 'Jun 3 · 11:00 hs' },
]

export default function AdminNovedadesPage() {
  const admin = useAdmin()
  const [mostrarForm, setMostrarForm] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [cuerpo, setCuerpo] = useState('')
  const [categoria, setCategoria] = useState('Institucional')

  if (!admin) return null
  if (!tieneAcceso(admin.rol, 'novedades')) return <AccesoDenegado />

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0D0D0D] text-2xl font-serif font-semibold">Novedades</h1>
          <p className="text-[#888] text-sm mt-1">Anuncios publicados para los socios</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-[#0D0D0D] text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-5">
          <h2 className="text-[#0D0D0D] text-sm font-bold mb-4">Publicar novedad</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Título</label>
              <input
                type="text"
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Ej: Torneo de verano — Inscripciones abiertas"
                className="w-full border border-[#E0DED9] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#B8975A] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Categoría</label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                className="w-full border border-[#E0DED9] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#B8975A] transition-colors bg-white"
              >
                {['Institucional', 'Torneos', 'Indumentaria', 'Salud'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Contenido</label>
              <textarea
                value={cuerpo}
                onChange={e => setCuerpo(e.target.value)}
                rows={5}
                placeholder="Escribí el cuerpo de la noticia..."
                className="w-full border border-[#E0DED9] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#B8975A] transition-colors resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-[#B8975A] text-white rounded-xl py-3 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity">
                Publicar
              </button>
              <button
                onClick={() => setMostrarForm(false)}
                className="px-4 bg-[#F4F3EF] text-[#888] rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {NOVEDADES_MOCK.map((n, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-[#0D0D0D] text-sm font-semibold">{n.titulo}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[#888] text-xs">{n.categoria}</span>
                <span className="text-[#ddd]">·</span>
                <span className="text-[#aaa] text-xs">{n.fecha}</span>
              </div>
            </div>
            <button className="text-[#aaa] hover:text-[#C0392B] transition-colors p-1 ml-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
