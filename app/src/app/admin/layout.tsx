'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminContext, AdminData, ROL_ACCESO, ROL_LABEL, RolAdmin } from '@/lib/admin-context'

const NAV = [
  {
    seccion: 'dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    seccion: 'socios',
    label: 'Socios',
    href: '/admin/socios',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    seccion: 'pagos',
    label: 'Pagos',
    href: '/admin/pagos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
  {
    seccion: 'novedades',
    label: 'Novedades',
    href: '/admin/novedades',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    seccion: 'reservas',
    label: 'Reservas',
    href: '/admin/reservas',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [cargando, setCargando] = useState(true)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function verificar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('admins')
        .select('id, nombre, apellido, rol, club_id')
        .eq('id', user.id)
        .single()

      if (!data) { router.push('/login'); return }
      setAdmin(data as AdminData)
      setCargando(false)
    }
    verificar()
  }, [])

  async function salir() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F4F3EF] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#B8975A] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const navVisible = admin
    ? NAV.filter(item => ROL_ACCESO[admin.rol]?.includes(item.seccion))
    : []

  const paginaActual = NAV.find(n => n.href === pathname)?.label ?? 'Admin'

  return (
    <AdminContext.Provider value={admin}>
      <div className="min-h-screen bg-[#F4F3EF] flex">

        {/* Sidebar desktop */}
        <aside className="hidden md:flex w-56 bg-[#0D0D0D] flex-col flex-shrink-0 fixed h-full">
          <div className="px-5 pt-8 pb-6 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <svg width="22" height="26" viewBox="0 0 76 88" fill="none">
                <path d="M38 2L72 14V48C72 66 38 86 38 86C38 86 4 66 4 48V14L38 2Z" fill="url(#asg)" />
                <text x="38" y="52" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="600" fill="white">CC</text>
                <defs>
                  <linearGradient id="asg" x1="4" y1="2" x2="72" y2="86" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#C9A86C" />
                    <stop offset="100%" stopColor="#8B6A32" />
                  </linearGradient>
                </defs>
              </svg>
              <div>
                <div className="text-white text-xs font-bold">Club Carrasco</div>
                <div className="text-[#B8975A] text-[10px]">Panel admin</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {navVisible.map(item => {
              const active = pathname === item.href
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left ${
                    active ? 'bg-[#B8975A]/15 text-[#B8975A]' : 'text-[#666] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={active ? 'text-[#B8975A]' : 'text-[#555]'}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </nav>

          {admin && (
            <div className="px-4 py-5 border-t border-white/5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-[#B8975A]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#B8975A] text-xs font-bold">
                    {admin.nombre[0]}{admin.apellido[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-white text-xs font-semibold truncate">{admin.nombre} {admin.apellido}</div>
                  <div className="text-[#555] text-[10px]">{ROL_LABEL[admin.rol]}</div>
                </div>
              </div>
              <button
                onClick={salir}
                className="text-[#444] text-xs hover:text-[#C0392B] transition-colors flex items-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar sesión
              </button>
            </div>
          )}
        </aside>

        {/* Contenido principal */}
        <div className="flex-1 md:ml-56 flex flex-col min-h-screen">

          {/* Top bar mobile */}
          <header className="md:hidden bg-white border-b border-[#E0DED9] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <svg width="18" height="22" viewBox="0 0 76 88" fill="none">
                <path d="M38 2L72 14V48C72 66 38 86 38 86C38 86 4 66 4 48V14L38 2Z" fill="url(#msg)" />
                <text x="38" y="52" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="600" fill="white">CC</text>
                <defs>
                  <linearGradient id="msg" x1="4" y1="2" x2="72" y2="86" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#C9A86C" />
                    <stop offset="100%" stopColor="#8B6A32" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-[#0D0D0D] text-sm font-bold">{paginaActual}</span>
            </div>
            <button onClick={() => setMenuAbierto(!menuAbierto)} className="p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </header>

          {menuAbierto && (
            <div className="md:hidden bg-[#0D0D0D] px-3 py-3 flex flex-col gap-1">
              {navVisible.map(item => {
                const active = pathname === item.href
                return (
                  <button
                    key={item.href}
                    onClick={() => { router.push(item.href); setMenuAbierto(false) }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left ${
                      active ? 'bg-[#B8975A]/15 text-[#B8975A]' : 'text-[#666] hover:text-white'
                    }`}
                  >
                    <span className={active ? 'text-[#B8975A]' : 'text-[#555]'}>{item.icon}</span>
                    {item.label}
                  </button>
                )
              })}
              <button onClick={salir} className="flex items-center gap-2 px-3 py-2.5 text-[#C0392B] text-sm mt-1">
                Cerrar sesión
              </button>
            </div>
          )}

          <main className="flex-1 p-5 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  )
}
