'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAdmin, tieneAcceso } from '@/lib/admin-context'
import AccesoDenegado from '@/components/AccesoDenegado'

type Novedad = {
  id: string
  titulo: string
  resumen: string
  cuerpo: string
  categoria: string
  destacada: boolean
  created_at: string
}

const CATEGORIAS = ['Institucional', 'Torneos', 'Indumentaria', 'Salud']

const CAT_COLORS: Record<string, string> = {
  'Institucional': '#1A6B3A',
  'Torneos':       '#1A5C9E',
  'Indumentaria':  '#A03030',
  'Salud':         '#7030A0',
}

function formatFecha(iso: string) {
  const d = new Date(iso)
  const ahora = new Date()
  const diff = Math.floor((ahora.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return `Hoy · ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')} hs`
  if (diff === 1) return 'Ayer'
  return `${d.getDate()} ${['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][d.getMonth()]}`
}

export default function AdminNovedadesPage() {
  const admin = useAdmin()
  const supabase = createClient()
  const [novedades, setNovedades] = useState<Novedad[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [publicando, setPublicando] = useState(false)
  const [form, setForm] = useState({ titulo: '', resumen: '', cuerpo: '', categoria: 'Institucional', destacada: false })

  useEffect(() => { cargar() }, [])

  async function cargar() {
    const { data } = await supabase.from('novedades').select('*').order('created_at', { ascending: false })
    setNovedades(data ?? [])
    setLoading(false)
  }

  async function publicar(e: React.FormEvent) {
    e.preventDefault()
    if (!admin) return
    setPublicando(true)
    await supabase.from('novedades').insert({
      club_id: admin.club_id,
      titulo: form.titulo,
      resumen: form.resumen,
      cuerpo: form.cuerpo,
      categoria: form.categoria,
      destacada: form.destacada,
    })
    setForm({ titulo: '', resumen: '', cuerpo: '', categoria: 'Institucional', destacada: false })
    setMostrarForm(false)
    setPublicando(false)
    cargar()
  }

  async function eliminar(id: string) {
    await supabase.from('novedades').delete().eq('id', id)
    setNovedades(prev => prev.filter(n => n.id !== id))
  }

  if (!admin) return null
  if (!tieneAcceso(admin.rol, 'novedades')) return <AccesoDenegado />

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0D0D0D] text-2xl font-serif font-semibold">Novedades</h1>
          <p className="text-[#888] text-sm mt-1">{novedades.length} publicaciones</p>
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

      {/* Formulario */}
      {mostrarForm && (
        <form onSubmit={publicar} className="bg-white rounded-2xl shadow-sm p-5 mb-5">
          <h2 className="text-[#0D0D0D] text-sm font-bold mb-4">Publicar novedad</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Título</label>
              <input required value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                placeholder="Ej: Torneo de verano — Inscripciones abiertas"
                className="w-full border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Resumen corto</label>
              <input required value={form.resumen} onChange={e => setForm(f => ({ ...f, resumen: e.target.value }))}
                placeholder="Una línea que aparece en la lista"
                className="w-full border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Categoría</label>
                <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                  className="w-full border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors bg-white">
                  {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Destacada</label>
                <button type="button" onClick={() => setForm(f => ({ ...f, destacada: !f.destacada }))}
                  className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm font-semibold transition-all ${form.destacada ? 'border-[#B8975A] bg-[#B8975A]/10 text-[#B8975A]' : 'border-[#E0DED9] text-[#aaa]'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={form.destacada ? '#B8975A' : 'none'} stroke="#B8975A" strokeWidth="2" strokeLinecap="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  {form.destacada ? 'Sí' : 'No'}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Contenido completo</label>
              <textarea required value={form.cuerpo} onChange={e => setForm(f => ({ ...f, cuerpo: e.target.value }))}
                rows={6} placeholder="Escribí el cuerpo de la noticia..."
                className="w-full border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={publicando}
                className="flex-1 bg-[#B8975A] text-white rounded-xl py-3 text-xs font-bold tracking-widest uppercase hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2">
                {publicando ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Publicando...</> : 'Publicar'}
              </button>
              <button type="button" onClick={() => setMostrarForm(false)}
                className="px-5 bg-[#F4F3EF] text-[#888] rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity">
                Cancelar
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-[#B8975A] border-t-transparent rounded-full animate-spin" /></div>
      ) : novedades.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-[#aaa] text-sm">
          No hay novedades publicadas todavía
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {novedades.map(n => (
            <div key={n.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-1 w-full" style={{ background: CAT_COLORS[n.categoria] ?? '#888' }} />
              <div className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: `${CAT_COLORS[n.categoria]}18`, color: CAT_COLORS[n.categoria] ?? '#888' }}>
                      {n.categoria}
                    </span>
                    {n.destacada && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#B8975A" stroke="#B8975A" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    )}
                  </div>
                  <div className="text-[#0D0D0D] text-sm font-semibold leading-snug">{n.titulo}</div>
                  <div className="text-[#aaa] text-xs mt-1">{n.resumen}</div>
                  <div className="text-[#ccc] text-[10px] mt-2">{formatFecha(n.created_at)}</div>
                </div>
                <button onClick={() => eliminar(n.id)} className="text-[#ddd] hover:text-[#C0392B] transition-colors p-1 flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
