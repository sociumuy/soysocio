'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAdmin, tieneAcceso } from '@/lib/admin-context'
import AccesoDenegado from '@/components/AccesoDenegado'

const ESPACIO_LABELS: Record<string, string> = {
  gimnasio: 'Gimnasio',
  tenis: 'Cancha de Tenis',
  pileta: 'Pileta',
  sauna: 'Sauna',
  squash: 'Squash',
}

type Reserva = {
  id: string
  hora: string
  espacio: string
  estado: string
  fecha: string
  socios: { nombre: string; apellido: string } | null
}

function getDias() {
  const dias = []
  const hoy = new Date()
  const nombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  for (let i = 0; i < 7; i++) {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() + i)
    dias.push({
      key: d.toISOString().split('T')[0],
      label: i === 0 ? 'Hoy' : `${nombres[d.getDay()]} ${d.getDate()} ${meses[d.getMonth()]}`,
    })
  }
  return dias
}

export default function AdminReservasPage() {
  const admin = useAdmin()
  const supabase = createClient()

  const dias = getDias()
  const [fechaSel, setFechaSel] = useState(dias[0].key)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarReservas()
  }, [fechaSel])

  async function cargarReservas() {
    setCargando(true)
    const { data } = await supabase
      .from('reservas')
      .select('id, hora, espacio, estado, fecha, socios(nombre, apellido)')
      .eq('fecha', fechaSel)
      .eq('estado', 'confirmada')
      .order('hora', { ascending: true })

    const mapped = (data ?? []).map((r: any) => ({
      ...r,
      socios: Array.isArray(r.socios) ? r.socios[0] ?? null : r.socios,
    })) as Reserva[]
    setReservas(mapped)
    setCargando(false)
  }

  async function cancelar(id: string) {
    await supabase.from('reservas').update({ estado: 'cancelada' }).eq('id', id)
    cargarReservas()
  }

  if (!admin) return null
  if (!tieneAcceso(admin.rol, 'reservas')) return <AccesoDenegado />

  const fechaLabel = dias.find(d => d.key === fechaSel)?.label ?? fechaSel

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0D0D0D] text-2xl font-serif font-semibold">Reservas</h1>
          <p className="text-[#888] text-sm mt-1">{fechaLabel}</p>
        </div>
        <span className="text-[#B8975A] font-mono font-bold text-lg">{reservas.length}</span>
      </div>

      {/* Selector de días */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
        {dias.map(d => (
          <button
            key={d.key}
            onClick={() => setFechaSel(d.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              fechaSel === d.key
                ? 'bg-[#0D0D0D] text-white'
                : 'bg-white text-[#888] border border-[#E0DED9] hover:border-[#0D0D0D]'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {cargando ? (
          <div className="flex items-center justify-center py-16 text-[#aaa] text-sm">
            Cargando...
          </div>
        ) : reservas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <p className="text-[#ccc] text-sm">Sin reservas para este día</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F4F3EF]">
                <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold">Hora</th>
                <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold">Socio</th>
                <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold hidden sm:table-cell">Espacio</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id} className="border-b border-[#F4F3EF] last:border-0">
                  <td className="px-5 py-3.5">
                    <span className="text-[#0D0D0D] text-sm font-bold font-mono">{r.hora}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-[#0D0D0D] text-sm font-semibold">
                      {r.socios ? `${r.socios.apellido}, ${r.socios.nombre}` : '—'}
                    </div>
                    <div className="text-[#aaa] text-xs sm:hidden">{ESPACIO_LABELS[r.espacio] ?? r.espacio}</div>
                  </td>
                  <td className="px-5 py-3.5 text-[#888] text-sm hidden sm:table-cell">
                    {ESPACIO_LABELS[r.espacio] ?? r.espacio}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {tieneAcceso(admin.rol, 'socios') && (
                      <button
                        onClick={() => cancelar(r.id)}
                        className="text-[#ddd] hover:text-[#C0392B] transition-colors text-xs font-semibold"
                      >
                        Cancelar
                      </button>
                    )}
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
