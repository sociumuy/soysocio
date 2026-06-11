'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAdmin, tieneAcceso } from '@/lib/admin-context'
import AccesoDenegado from '@/components/AccesoDenegado'

type Stats = { totalSocios: number; sociosAlDia: number; sociosPendientes: number }

export default function AdminDashboard() {
  const router = useRouter()
  const admin  = useAdmin()
  const [stats, setStats]   = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function cargar() {
      const { data: socios } = await supabase.from('socios').select('cuota_al_dia')
      if (socios) setStats({
        totalSocios:      socios.length,
        sociosAlDia:      socios.filter(s => s.cuota_al_dia).length,
        sociosPendientes: socios.filter(s => !s.cuota_al_dia).length,
      })
      setLoading(false)
    }
    cargar()
  }, [])

  if (!admin) return null
  if (!tieneAcceso(admin.rol, 'dashboard')) return <AccesoDenegado />

  const METRICAS = [
    { label: 'Socios',   valor: stats?.totalSocios ?? '—',      color: 'var(--club-primary)', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label: 'Al día',   valor: stats?.sociosAlDia ?? '—',       color: '#219653',             icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> },
    { label: 'Pendiente', valor: stats?.sociosPendientes ?? '—', color: '#C0392B',             icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  ]

  const ACCIONES = [
    { seccion: 'socios',    label: 'Gestionar socios',  desc: 'Ver, agregar y editar miembros',      href: '/admin/socios',    primary: true  },
    { seccion: 'pagos',     label: 'Aprobar pagos',      desc: 'Confirmar transferencias pendientes', href: '/admin/pagos',     primary: false },
    { seccion: 'novedades', label: 'Publicar novedad',   desc: 'Crear un anuncio para los socios',   href: '/admin/novedades', primary: false },
    { seccion: 'reservas',  label: 'Ver reservas',       desc: 'Agenda del día por espacio',         href: '/admin/reservas',  primary: false },
  ].filter(a => tieneAcceso(admin.rol, a.seccion))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[#0D0D0D] text-xl font-sans font-bold">Dashboard</h1>
        <p className="text-[#888] text-sm mt-0.5">Resumen general del club</p>
      </div>

      {/* Métricas — 3 columnas compactas, sin sm: */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {METRICAS.map((m, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto mb-2"
              style={{ background: m.color + '15', color: m.color }}
            >
              {m.icon}
            </div>
            {loading
              ? <div className="w-8 h-5 bg-[#F4F3EF] rounded animate-pulse mx-auto mb-1" />
              : <div className="text-[#0D0D0D] text-2xl font-bold leading-none mb-1">{m.valor}</div>
            }
            <div className="text-[#bbb] text-[10px] leading-tight">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Acciones rápidas — siempre 1 columna */}
      {ACCIONES.length > 0 && (
        <>
          <div className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Acciones rápidas</div>
          <div className="flex flex-col gap-3">
            {ACCIONES.map((a, i) => (
              <button
                key={i}
                onClick={() => router.push(a.href)}
                className="rounded-2xl p-4 text-left transition-opacity active:opacity-80 shadow-sm flex items-center justify-between"
                style={{ background: a.primary ? '#08101f' : '#fff' }}
              >
                <div>
                  <div className="text-sm font-bold mb-0.5" style={{ color: a.primary ? '#fff' : '#0D0D0D' }}>{a.label}</div>
                  <div className="text-xs" style={{ color: a.primary ? 'var(--club-primary)' : '#aaa' }}>{a.desc}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={a.primary ? 'rgba(255,255,255,0.3)' : '#ccc'} strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
