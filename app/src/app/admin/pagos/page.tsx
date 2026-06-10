'use client'

export const dynamic = 'force-dynamic'

import { useAdmin, tieneAcceso } from '@/lib/admin-context'
import AccesoDenegado from '@/components/AccesoDenegado'

const PAGOS_MOCK = [
  { nombre: 'García, Rodrigo', numero: '0042', monto: '$2.400', fecha: 'Hoy · 09:15 hs', estado: 'pendiente' },
  { nombre: 'Sosa, Valentina', numero: '0017', monto: '$2.400', fecha: 'Hoy · 08:40 hs', estado: 'pendiente' },
  { nombre: 'Méndez, Carlos',  numero: '0031', monto: '$2.400', fecha: 'Ayer · 18:20 hs', estado: 'pendiente' },
  { nombre: 'López, Ana',      numero: '0008', monto: '$2.400', fecha: 'Jun 8 · 11:00 hs', estado: 'confirmado' },
  { nombre: 'Fernández, Mateo',numero: '0055', monto: '$2.400', fecha: 'Jun 7 · 16:30 hs', estado: 'confirmado' },
]

export default function AdminPagosPage() {
  const admin = useAdmin()

  if (!admin) return null
  if (!tieneAcceso(admin.rol, 'pagos')) return <AccesoDenegado />

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-[#0D0D0D] text-2xl font-serif font-semibold">Pagos</h1>
        <p className="text-[#888] text-sm mt-1">Transferencias declaradas por socios</p>
      </div>

      <div className="bg-[#FEF0F0] border border-[#C0392B]/20 rounded-2xl px-5 py-4 mb-5">
        <div className="flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[#C0392B] text-xs leading-relaxed">
            <strong>Próximamente:</strong> Esta sección conectará con el sistema de pagos real. Por ahora verificá las transferencias en el banco y confirmá desde la tabla de socios.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F4F3EF]">
              <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold">Socio</th>
              <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold hidden sm:table-cell">Monto</th>
              <th className="text-left px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold hidden sm:table-cell">Fecha</th>
              <th className="text-center px-5 py-3 text-[#aaa] text-xs uppercase tracking-widest font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {PAGOS_MOCK.map((p, i) => (
              <tr key={i} className="border-b border-[#F4F3EF] last:border-0">
                <td className="px-5 py-3.5">
                  <div className="text-[#0D0D0D] text-sm font-semibold">{p.nombre}</div>
                  <div className="text-[#aaa] text-xs">N° {p.numero}</div>
                </td>
                <td className="px-5 py-3.5 text-[#0D0D0D] text-sm hidden sm:table-cell">{p.monto}</td>
                <td className="px-5 py-3.5 text-[#888] text-xs hidden sm:table-cell">{p.fecha}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    p.estado === 'pendiente' ? 'bg-[#FEF0F0] text-[#C0392B]' : 'bg-[#EAF7EE] text-[#219653]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.estado === 'pendiente' ? 'bg-[#C0392B]' : 'bg-[#219653]'}`} />
                    {p.estado === 'pendiente' ? 'Pendiente' : 'Confirmado'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
