'use client'

import { useAdmin, tieneAcceso } from '@/lib/admin-context'
import AccesoDenegado from '@/components/AccesoDenegado'

const RESERVAS_MOCK = [
  { socio: 'García, Rodrigo',  espacio: 'Gimnasio',         hora: '07:00' },
  { socio: 'Sosa, Valentina',  espacio: 'Pileta',           hora: '08:00' },
  { socio: 'Méndez, Carlos',   espacio: 'Cancha de Tenis',  hora: '09:00' },
  { socio: 'López, Ana',       espacio: 'Gimnasio',         hora: '10:00' },
  { socio: 'Fernández, Mateo', espacio: 'Sauna',            hora: '11:00' },
  { socio: 'Rodríguez, Laura', espacio: 'Squash',           hora: '14:00' },
  { socio: 'Pérez, Diego',     espacio: 'Gimnasio',         hora: '17:00' },
]

export default function AdminReservasPage() {
  const admin = useAdmin()

  if (!admin) return null
  if (!tieneAcceso(admin.rol, 'reservas')) return <AccesoDenegado />

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-[#0D0D0D] text-2xl font-serif font-semibold">Reservas</h1>
        <p className="text-[#888] text-sm mt-1">
          Agenda de hoy — {new Date().toLocaleDateString('es-UY', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F4F3EF]">
              <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold">Hora</th>
              <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold">Socio</th>
              <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold hidden sm:table-cell">Espacio</th>
            </tr>
          </thead>
          <tbody>
            {RESERVAS_MOCK.map((r, i) => (
              <tr key={i} className="border-b border-[#F4F3EF] last:border-0">
                <td className="px-5 py-3.5">
                  <span className="text-[#0D0D0D] text-sm font-bold font-mono">{r.hora}</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="text-[#0D0D0D] text-sm font-semibold">{r.socio}</div>
                  <div className="text-[#aaa] text-xs sm:hidden">{r.espacio}</div>
                </td>
                <td className="px-5 py-3.5 text-[#888] text-sm hidden sm:table-cell">{r.espacio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
