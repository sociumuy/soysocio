'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAdmin, tieneAcceso } from '@/lib/admin-context'
import AccesoDenegado from '@/components/AccesoDenegado'

type Socio = {
  id: string
  nombre: string
  apellido: string
  numero_socio: string
  categoria: string
  cuota_al_dia: boolean
}

export default function AdminSociosPage() {
  const admin = useAdmin()
  const [socios, setSocios] = useState<Socio[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<'todos' | 'al_dia' | 'pendiente'>('todos')
  const supabase = createClient()

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from('socios')
        .select('id, nombre, apellido, numero_socio, categoria, cuota_al_dia')
        .order('apellido')
      setSocios(data ?? [])
      setLoading(false)
    }
    cargar()
  }, [])

  if (!admin) return null
  if (!tieneAcceso(admin.rol, 'socios')) return <AccesoDenegado />

  // Solo director y secretaria pueden modificar cuotas; recepcion solo lee
  const puedeEditar = admin.rol === 'director' || admin.rol === 'secretaria'

  async function toggleCuota(id: string, actual: boolean) {
    if (!puedeEditar) return
    await supabase.from('socios').update({ cuota_al_dia: !actual }).eq('id', id)
    setSocios(prev => prev.map(s => s.id === id ? { ...s, cuota_al_dia: !actual } : s))
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
      <div className="mb-6">
        <h1 className="text-[#0D0D0D] text-2xl font-serif font-semibold">Socios</h1>
        <p className="text-[#888] text-sm mt-1">{socios.length} miembros registrados</p>
      </div>

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
                        <div className="text-[#aaa] text-xs sm:hidden">N° {s.numero_socio}</div>
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
    </div>
  )
}
