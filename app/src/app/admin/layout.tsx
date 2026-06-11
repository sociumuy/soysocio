'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminContext, AdminData, ROL_ACCESO, ROL_LABEL } from '@/lib/admin-context'
import { getStoredClub } from '@/lib/club-storage'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  {
    seccion: 'dashboard', label: 'Dashboard', href: '/admin',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    seccion: 'socios', label: 'Socios', href: '/admin/socios',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    seccion: 'pagos', label: 'Pagos', href: '/admin/pagos',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  },
  {
    seccion: 'novedades', label: 'Novedades', href: '/admin/novedades',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  },
  {
    seccion: 'reservas', label: 'Reservas', href: '/admin/reservas',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [admin, setAdmin]             = useState<AdminData | null>(null)
  const [cargando, setCargando]       = useState(true)
  const [drawerAbierto, setDrawer]    = useState(false)
  const supabase = createClient()
  const club     = getStoredClub()

  const primary = club?.color_primario ?? '#C8940A'
  const rgb     = club?.color_rgb      ?? '200, 148, 10'

  useEffect(() => {
    async function verificar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('admins').select('id, nombre, apellido, rol, club_id')
        .eq('id', user.id).single()
      if (!data) { router.push('/login'); return }
      setAdmin(data as AdminData)
      setCargando(false)
    }
    verificar()
  }, [])

  // Cierra drawer en cada cambio de ruta
  useEffect(() => { setDrawer(false) }, [pathname])

  async function salir() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F4F3EF' }}>
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: `rgba(${rgb},0.4)`, borderTopColor: primary }} />
      </div>
    )
  }

  if (!admin) return null

  const navVisible  = NAV.filter(item => ROL_ACCESO[admin.rol]?.includes(item.seccion))
  const paginaActual = NAV.find(n => n.href === pathname)?.label ?? 'Admin'

  return (
    <AdminContext.Provider value={admin}>
      {/*
        Layout: siempre drawer (no sidebar persistente).
        El phone-frame es 393px — las media queries del browser no reflejan eso,
        por lo que un sidebar persistente siempre comprimiría el contenido.
      */}
      <div className="min-h-screen flex flex-col w-full overflow-x-hidden" style={{ background: '#F4F3EF' }}>

        {/* ── Top bar (siempre visible) ── */}
        <header
          className="w-full sticky top-0 z-30 flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ background: '#08101f', borderBottom: `1px solid rgba(${rgb},0.18)` }}
        >
          {/* Izquierda: hamburger + club */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDrawer(true)}
              className="p-1.5 rounded-lg"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6"  />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div
              className="w-6 h-6 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ background: `rgba(${rgb},0.18)` }}
            >
              {club?.logo_url
                ? <img src={club.logo_url} alt="" className="w-full h-full object-contain" />
                : <span className="text-white text-[8px] font-black leading-none">{club?.iniciales ?? 'DC'}</span>
              }
            </div>

            <span className="text-white text-sm font-semibold">{paginaActual}</span>
          </div>

          {/* Derecha: indicador del club */}
          <div className="w-2 h-2 rounded-full" style={{ background: primary }} />
        </header>

        {/* ── Drawer overlay ── */}
        <AnimatePresence>
          {drawerAbierto && (
            <>
              {/* Backdrop */}
              <motion.div
                key="bd"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-40"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
                onClick={() => setDrawer(false)}
              />

              {/* Panel */}
              <motion.aside
                key="panel"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                className="fixed top-0 left-0 h-full z-50 flex flex-col"
                style={{ width: 260, background: '#08101f' }}
              >
                {/* Club header */}
                <div className="px-5 pt-8 pb-5 flex items-center gap-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ background: `rgba(${rgb},0.15)`, border: `1.5px solid rgba(${rgb},0.25)` }}
                  >
                    {club?.logo_url
                      ? <img src={club.logo_url} alt={club.nombre} className="w-full h-full object-contain p-1" />
                      : <span className="text-white text-sm font-black">{club?.iniciales ?? 'DC'}</span>
                    }
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold leading-tight">{club?.nombre ?? 'DelClub'}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: primary }}>Panel admin</div>
                  </div>

                  {/* Botón cerrar */}
                  <button
                    onClick={() => setDrawer(false)}
                    className="ml-auto p-1.5 rounded-lg"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6"  y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
                  {navVisible.map(item => {
                    const active = pathname === item.href
                    return (
                      <button
                        key={item.href}
                        onClick={() => { router.push(item.href); setDrawer(false) }}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium w-full text-left transition-colors"
                        style={{
                          background: active ? `rgba(${rgb},0.14)` : 'transparent',
                          color: active ? primary : 'rgba(255,255,255,0.50)',
                        }}
                      >
                        <span style={{ color: active ? primary : 'rgba(255,255,255,0.28)' }}>{item.icon}</span>
                        {item.label}
                        {active && <span className="ml-auto w-1 h-4 rounded-full" style={{ background: primary }} />}
                      </button>
                    )
                  })}
                </nav>

                {/* User footer */}
                <div className="px-4 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `rgba(${rgb},0.18)` }}
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
                    onClick={salir}
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: 'rgba(255,255,255,0.28)' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ── Contenido principal: siempre 100% ancho ── */}
        <main className="flex-1 w-full overflow-x-hidden p-4">
          {children}
        </main>
      </div>
    </AdminContext.Provider>
  )
}
