'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAdmin, tieneAcceso } from '@/lib/admin-context'
import AccesoDenegado from '@/components/AccesoDenegado'
import PremiumButton from '@/components/PremiumButton'

type Socio = {
  id: string
  nombre: string
  apellido: string
  email?: string
  numero_socio: string
  categoria: string
  cuota_al_dia: boolean
}

const CATEGORIAS = ['Activo', 'Cadete', 'Juvenil', 'Vitalicio', 'Honorario']

export default function AdminSociosPage() {
  const admin = useAdmin()
  const [socios, setSocios] = useState<Socio[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<'todos' | 'al_dia' | 'pendiente'>('todos')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', numero_socio: '', categoria: 'Activo'
  })
  const supabase = createClient()

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    const { data } = await supabase
      .from('socios')
      .select('id, nombre, apellido, email, numero_socio, categoria, cuota_al_dia')
      .order('apellido')
    setSocios(data ?? [])
    setLoading(false)
  }

  if (!admin) return null
  if (!tieneAcceso(admin.rol, 'socios')) return <AccesoDenegado />

  const puedeEditar = admin.rol === 'director' || admin.rol === 'secretaria'

  async function toggleCuota(id: string, actual: boolean) {
    if (!puedeEditar) return
    await supabase.from('socios').update({ cuota_al_dia: !actual }).eq('id', id)
    setSocios(prev => prev.map(s => s.id === id ? { ...s, cuota_al_dia: !actual } : s))
  }

  async function invitarSocio(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErrorMsg(null)

    const res = await fetch('/api/invitar-socio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, club_id: admin!.club_id }),
    })

    const json = await res.json()

    if (!res.ok) {
      setErrorMsg(json.error ?? 'Error al invitar')
      setEnviando(false)
      return
    }

    setExito(`Invitación enviada a ${form.email}`)
    setForm({ nombre: '', apellido: '', email: '', numero_socio: '', categoria: 'Activo' })
    setModalAbierto(false)
    setEnviando(false)
    cargar()

    setTimeout(() => setExito(null), 4000)
  }

  const filtrados = socios
    .filter(s => {
      const q = busqueda.toLowerCase()
      return (
        s.nombre.toLowerCase().includes(q) ||
        s.apellido.toLowerCase().includes(q) ||
        s.numero_socio?.includes(q)
      )
    })
    .filter(s => {
      if (filtro === 'al_dia') return s.cuota_al_dia
      if (filtro === 'pendiente') return !s.cuota_al_dia
      return true
    })

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[#0D0D0D] text-2xl font-serif font-semibold">Socios</h1>
          <p className="text-[#888] text-sm mt-1">{socios.length} miembros registrados</p>
        </div>
        {puedeEditar && (
          <PremiumButton
            variant="dark"
            size="sm"
            onClick={() => setModalAbierto(true)}
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}
          >
            Nuevo socio
          </PremiumButton>
        )}
      </div>

      {exito && (
        <div className="mb-4 bg-[#EAF7EE] border border-[#219653]/20 rounded-xl px-4 py-3 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#219653" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-[#219653] text-sm font-semibold">{exito}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o N° de socio..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full bg-white border border-[#E0DED9] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(['todos', 'al_dia', 'pendiente'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                filtro === f ? 'bg-[#0D0D0D] text-white' : 'bg-white text-[#888] border border-[#E0DED9]'
              }`}
            >
              {f === 'todos' ? 'Todos' : f === 'al_dia' ? 'Al día' : 'Pendiente'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#B8975A] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-16 text-[#aaa] text-sm">
            {busqueda ? 'No se encontraron socios' : 'No hay socios registrados'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F4F3EF]">
                <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold">Socio</th>
                <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold hidden sm:table-cell">N°</th>
                <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold hidden sm:table-cell">Categoría</th>
                <th className="text-center px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold">Cuota</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((s, i) => (
                <tr key={s.id} className={`border-b border-[#F4F3EF] last:border-0 ${i % 2 === 0 ? '' : 'bg-[#FAFAF8]'}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#F4F3EF] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#888] text-xs font-semibold">{s.nombre[0]}{s.apellido[0]}</span>
                      </div>
                      <div>
                        <div className="text-[#0D0D0D] text-sm font-semibold">{s.apellido}, {s.nombre}</div>
                        <div className="text-[#aaa] text-xs">{s.email ?? <span className="italic">Sin email</span>}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[#888] text-sm hidden sm:table-cell">{s.numero_socio}</td>
                  <td className="px-5 py-3.5 text-[#888] text-sm hidden sm:table-cell">{s.categoria}</td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => toggleCuota(s.id, s.cuota_al_dia)}
                      disabled={!puedeEditar}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        puedeEditar ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'
                      } ${s.cuota_al_dia ? 'bg-[#EAF7EE] text-[#219653]' : 'bg-[#FEF0F0] text-[#C0392B]'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.cuota_al_dia ? 'bg-[#219653]' : 'bg-[#C0392B]'}`} />
                      {s.cuota_al_dia ? 'Al día' : 'Pendiente'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal nuevo socio */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[#0D0D0D] text-lg font-serif font-semibold">Nuevo socio</h2>
              <button
                onClick={() => { setModalAbierto(false); setErrorMsg(null) }}
                className="text-[#aaa] hover:text-[#0D0D0D] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={invitarSocio} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#555] uppercase tracking-wider">Nombre</label>
                  <input
                    required
                    value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    className="border border-[#E0DED9] rounded-xl px-3 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors bg-white"
                    placeholder="Juan"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#555] uppercase tracking-wider">Apellido</label>
                  <input
                    required
                    value={form.apellido}
                    onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))}
                    className="border border-[#E0DED9] rounded-xl px-3 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors bg-white"
                    placeholder="García"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#555] uppercase tracking-wider">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="border border-[#E0DED9] rounded-xl px-3 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors bg-white"
                  placeholder="juan@email.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#555] uppercase tracking-wider">N° de socio</label>
                  <input
                    required
                    value={form.numero_socio}
                    onChange={e => setForm(f => ({ ...f, numero_socio: e.target.value }))}
                    className="border border-[#E0DED9] rounded-xl px-3 py-2.5 text-sm text-[#0D0D0D] outline-none focus:border-[#B8975A] transition-colors bg-white"
                    placeholder="1234"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-[#555] uppercase tracking-wider">Categoría</label>
                  <select
                    value={form.categoria}
                    onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                    className="border border-[#E0DED9] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#B8975A] transition-colors bg-white"
                  >
                    {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {errorMsg && (
                <p className="text-red-500 text-xs text-center">{errorMsg}</p>
              )}

              <div className="flex gap-3 mt-1">
                <PremiumButton
                  variant="ghost"
                  size="md"
                  onClick={() => { setModalAbierto(false); setErrorMsg(null) }}
                >
                  Cancelar
                </PremiumButton>
                <div className="flex-1">
                  <PremiumButton type="submit" fullWidth size="md" disabled={enviando}>
                    {enviando ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </span>
                    ) : 'Enviar invitación'}
                  </PremiumButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
