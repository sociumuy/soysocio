'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdmin, tieneAcceso } from '@/lib/admin-context'
import AccesoDenegado from '@/components/AccesoDenegado'

type Stats = {
  totalSocios: number
  sociosAlDia: number
  sociosPendientes: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const admin = useAdmin()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function cargar() {
      const { data: socios } = await supabase.from('socios').select('cuota_al_dia')
      if (socios) {
        setStats({
          totalSocios: socios.length,
          sociosAlDia: socios.filter(s => s.cuota_al_dia).length,
          sociosPendientes: socios.filter(s => !s.cuota_al_dia).length,
        })
      }
      setLoading(false)
    }
    cargar()
  }, [])

  if (!admin) return null
  if (!tieneAcceso(admin.rol, 'dashboard')) return <AccesoDenegado />

  const METRICAS = [
    {
      label: 'Socios totales',
      valor: stats?.totalSocios ?? '—',
      sub: 'registrados',
      color: '#B8975A',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.8" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: 'Cuotas al día',
      valor: stats?.sociosAlDia ?? '—',
      sub: 'socios',
      color: '#219653',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#219653" strokeWidth="1.8" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      label: 'Cuotas pendientes',
      valor: stats?.sociosPendientes ?? '—',
      sub: 'socios',
      color: '#C0392B',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
  ]

  const ACCIONES_POR_ROL = [
    { seccion: 'socios',    label: 'Gestionar socios',   desc: 'Ver, agregar y editar miembros',          href: '/admin/socios',    gold: true  },
    { seccion: 'pagos',     label: 'Aprobar pagos',       desc: 'Confirmar transferencias pendientes',     href: '/admin/pagos',     gold: false },
    { seccion: 'novedades', label: 'Publicar novedad',    desc: 'Crear un anuncio para los socios',        href: '/admin/novedades', gold: false },
    { seccion: 'reservas',  label: 'Ver reservas',        desc: 'Agenda del día por espacio',              href: '/admin/reservas',  gold: false },
  ].filter(a => tieneAcceso(admin.rol, a.seccion))

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-[#0D0D0D] text-2xl font-serif font-semibold">Dashboard</h1>
        <p className="text-[#888] text-sm mt-1">Resumen general del club</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {METRICAS.map((m, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#888] text-xs uppercase tracking-widest">{m.label}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: m.color + '15' }}>
                {m.icon}
              </div>
            </div>
            {loading ? (
              <div className="w-12 h-7 bg-[#F4F3EF] rounded animate-pulse" />
            ) : (
              <div className="text-[#0D0D0D] text-3xl font-serif font-semibold">{m.valor}</div>
            )}
            <div className="text-[#ccc] text-xs mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      {ACCIONES_POR_ROL.length > 0 && (
        <>
          <div className="text-[#888] text-xs uppercase tracking-widest mb-4">Acciones rápidas</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACCIONES_POR_ROL.map((a, i) => (
              <button
                key={i}
                onClick={() => router.push(a.href)}
                className={`rounded-2xl p-5 text-left hover:opacity-90 transition-opacity shadow-sm ${
                  a.gold ? 'bg-[#0D0D0D]' : 'bg-white'
                }`}
              >
                <div className={`text-sm font-bold mb-1 ${a.gold ? 'text-white' : 'text-[#0D0D0D]'}`}>{a.label}</div>
                <div className={`text-xs ${a.gold ? 'text-[#B8975A]' : 'text-[#aaa]'}`}>{a.desc}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
