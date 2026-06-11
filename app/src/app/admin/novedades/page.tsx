'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAdmin, tieneAcceso } from '@/lib/admin-context'
import AccesoDenegado from '@/components/AccesoDenegado'
import PremiumButton from '@/components/PremiumButton'

type Novedad = {
  id: string
  titulo: string
  resumen: string
  cuerpo: string
  categoria: string
  destacada: boolean
  imagen_url: string | null
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
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)

  useEffect(() => { cargar() }, [])

  async function cargar() {
    const { data } = await supabase.from('novedades').select('*').order('created_at', { ascending: false })
    setNovedades(data ?? [])
    setLoading(false)
  }

  function handleImagenChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImagenFile(file)
    setImagenPreview(file ? URL.createObjectURL(file) : null)
  }

  async function publicar(e: React.FormEvent) {
    e.preventDefault()
    if (!admin) return
    setPublicando(true)

    let imagen_url: string | null = null
    if (imagenFile) {
      const ext = imagenFile.name.split('.').pop()
      const path = `${admin.club_id}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('novedades').upload(path, imagenFile, { upsert: true })
      if (!upErr) {
        const { data: urlData } = supabase.storage.from('novedades').getPublicUrl(path)
        imagen_url = urlData.publicUrl
      }
    }

    await supabase.from('novedades').insert({
      club_id: admin.club_id,
      titulo: form.titulo,
      resumen: form.resumen,
      cuerpo: form.cuerpo,
      categoria: form.categoria,
      destacada: form.destacada,
      imagen_url,
    })
    setForm({ titulo: '', resumen: '', cuerpo: '', categoria: 'Institucional', destacada: false })
    setImagenFile(null)
    setImagenPreview(null)
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
        <PremiumButton
          variant="dark"
          size="sm"
          onClick={() => setMostrarForm(!mostrarForm)}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}
        >
          Nueva
        </PremiumButton>
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
                className="w-full border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[var(--club-primary)] transition-colors" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Resumen corto</label>
              <input required value={form.resumen} onChange={e => setForm(f => ({ ...f, resumen: e.target.value }))}
                placeholder="Una línea que aparece en la lista"
                className="w-full border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[var(--club-primary)] transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Categoría</label>
                <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                  className="w-full border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[var(--club-primary)] transition-colors bg-white">
                  {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Destacada</label>
                <button type="button" onClick={() => setForm(f => ({ ...f, destacada: !f.destacada }))}
                  className={`flex items-center gap-2 border rounded-xl px-4 py-3 text-sm font-semibold transition-all ${form.destacada ? 'border-[var(--club-primary)] bg-[var(--club-primary)]/10 text-[var(--club-primary)]' : 'border-[#E0DED9] text-[#aaa]'}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={form.destacada ? 'var(--club-primary)' : 'none'} stroke="var(--club-primary)" strokeWidth="2" strokeLinecap="round">
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
                className="w-full border border-[#E0DED9] rounded-xl px-4 py-3 text-sm text-[#0D0D0D] outline-none focus:border-[var(--club-primary)] transition-colors resize-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#555] uppercase tracking-wider block mb-1">Imagen (opcional)</label>
              <label className="flex items-center gap-3 cursor-pointer border border-dashed border-[#E0DED9] rounded-xl px-4 py-3 hover:border-[var(--club-primary)] transition-colors group">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--club-primary)" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-sm text-[#888] group-hover:text-[var(--club-primary)] transition-colors">
                  {imagenFile ? imagenFile.name : 'Seleccionar imagen'}
                </span>
                <input type="file" accept="image/*" onChange={handleImagenChange} className="hidden" />
              </label>
              {imagenPreview && (
                <div className="mt-2 relative">
                  <img src={imagenPreview} alt="preview" className="w-full h-36 object-cover rounded-xl" />
                  <button type="button" onClick={() => { setImagenFile(null); setImagenPreview(null) }}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <PremiumButton type="submit" fullWidth size="md" disabled={publicando}>
                  {publicando ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Publicando...
                    </span>
                  ) : 'Publicar'}
                </PremiumButton>
              </div>
              <PremiumButton variant="ghost" size="md" onClick={() => setMostrarForm(false)}>
                Cancelar
              </PremiumButton>
            </div>
          </div>
        </form>
      )}

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-6 h-6 border-2 border-[var(--club-primary)] border-t-transparent rounded-full animate-spin" /></div>
      ) : novedades.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-[#aaa] text-sm">
          No hay novedades publicadas todavía
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {novedades.map(n => (
            <div key={n.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-1 w-full" style={{ background: CAT_COLORS[n.categoria] ?? '#888' }} />
              {n.imagen_url && (
                <img src={n.imagen_url} alt={n.titulo} className="w-full h-28 object-cover" />
              )}
              <div className="px-5 py-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: `${CAT_COLORS[n.categoria]}18`, color: CAT_COLORS[n.categoria] ?? '#888' }}>
                      {n.categoria}
                    </span>
                    {n.destacada && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--club-primary)" stroke="var(--club-primary)" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
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
