'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminContext, AdminData, ROL_ACCESO, ROL_LABEL, RolAdmin } from '@/lib/admin-context'
import { getStoredClub } from '@/lib/club-storage'
import { motion, AnimatePresence } from 'framer-motion'

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

function SidebarContent({
  admin, navVisible, pathname, club, onNavigate, onSalir,
}: {
  admin: AdminData
  navVisible: typeof NAV
  pathname: string
  club: ReturnType<typeof getStoredClub>
  onNavigate: (href: string) => void
  onSalir: () => void
}) {
  const primary = club?.color_primario ?? 'var(--club-primary)'
  const rgb     = club?.color_rgb      ?? 'var(--club-primary-rgb)'

  return (
    <div className="flex flex-col h-full" style={{ background: '#08101f' }}>
      {/* Logo / club header */}
      <div className="px-5 pt-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          {/* Club logo or initials */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ background: `rgba(${rgb}, 0.15)`, border: `1px solid rgba(${rgb}, 0.25)` }}
          >
            {club?.logo_url
              ? <img src={club.logo_url} alt={club.nombre} className="w-full h-full object-contain p-1" />
              : <span className="text-white text-xs font-black">{club?.iniciales ?? 'DC'}</span>
            }
          </div>
          <div>
            <div className="text-white text-xs font-bold leading-tight">{club?.nombre ?? 'DelClub'}</div>
            <div className="text-[10px] mt-0.5" style={{ color: primary }}>Panel admin</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navVisible.map(item => {
          const active = pathname === item.href
          return (
            <button
              key={item.href}
              onClick={() => onNavigate(item.href)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-colors"
              style={{
                background: active ? `rgba(${rgb}, 0.14)` : 'transparent',
                color: active ? primary : 'rgba(255,255,255,0.45)',
              }}
            >
              <span style={{ color: active ? primary : 'rgba(255,255,255,0.3)' }}>{item.icon}</span>
              {item.label}
              {active && (
                <span className="ml-auto w-1 h-4 rounded-full" style={{ background: primary }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `rgba(${rgb}, 0.18)` }}
          >
            <span className="text-xs font-bold" style={{ color: primary }}>
              {admin.nombre[0]}{admin.apellido[0]}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-white text-xs font-semibold truncate">{admin.nombre} {admin.apellido}</div>
            <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{ROL_LABEL[admin.rol]}</div>
          </div>
        </div>
        <button
          onClick={onSalir}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: 'rgba(255,255,255,0.25)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin]           = useState<AdminData | null>(null)
  const [cargando, setCargando]     = useState(true)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const supabase = createClient()
  const club     = getStoredClub()

  const primary = club?.color_primario ?? '#C8940A'
  const rgb     = club?.color_rgb      ?? '200, 148, 10'

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

  // Close drawer on route change
  useEffect(() => { setMenuAbierto(false) }, [pathname])

  async function salir() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function navegar(href: string) {
    router.push(href)
    setMenuAbierto(false)
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F3EF' }}>
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `${primary}60`, borderTopColor: primary }} />
      </div>
    )
  }

  if (!admin) return null

  const navVisible = NAV.filter(item => ROL_ACCESO[admin.rol]?.includes(item.seccion))
  const paginaActual = NAV.find(n => n.href === pathname)?.label ?? 'Admin'

  return (
    <AdminContext.Provider value={admin}>
      <div className="min-h-screen flex overflow-hidden" style={{ background: '#F4F3EF' }}>

        {/* ── Desktop sidebar (persistent) ── */}
        <aside className="hidden md:flex w-56 flex-shrink-0 fixed h-full z-30">
          <div className="w-full">
            <SidebarContent
              admin={admin} navVisible={navVisible} pathname={pathname}
              club={club} onNavigate={navegar} onSalir={salir}
            />
          </div>
        </aside>

        {/* ── Mobile drawer (overlay) ── */}
        <AnimatePresence>
          {menuAbierto && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMenuAbierto(false)}
                className="fixed inset-0 z-40 md:hidden"
                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
              />

              {/* Drawer panel */}
              <motion.aside
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 240 }}
                className="fixed top-0 left-0 h-full w-72 z-50 md:hidden"
              >
                <SidebarContent
                  admin={admin} navVisible={navVisible} pathname={pathname}
                  club={club} onNavigate={navegar} onSalir={salir}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Main content ── */}
        <div className="flex-1 md:ml-56 flex flex-col min-h-screen min-w-0">

          {/* Mobile header */}
          <header
            className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3"
            style={{
              background: '#08101f',
              borderBottom: `1px solid rgba(${rgb}, 0.15)`,
            }}
          >
            <div className="flex items-center gap-2.5">
              {/* Hamburger */}
              <button
                onClick={() => setMenuAbierto(true)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              {/* Club logo mini */}
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center overflow-hidden"
                style={{ background: `rgba(${rgb}, 0.15)` }}
              >
                {club?.logo_url
                  ? <img src={club.logo_url} alt="" className="w-full h-full object-contain" />
                  : <span className="text-white text-[8px] font-black">{club?.iniciales ?? 'DC'}</span>
                }
              </div>

              <span className="text-white text-sm font-semibold">{paginaActual}</span>
            </div>

            {/* Club accent dot */}
            <div className="w-2 h-2 rounded-full" style={{ background: primary }} />
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  )
}
