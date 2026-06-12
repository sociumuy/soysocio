'use client'

// Navegación: Opción A — 5 tabs directos.
// Club reemplaza el acceso desde home card, dando acceso directo
// a sponsors, historia e instalaciones sin profundidad de navegación.

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const items = [
  {
    label: 'Inicio',
    href: '/home',
    icon: (active: boolean) => (
      <svg width="19" height="19" viewBox="0 0 24 24" fill={active ? 'var(--club-primary)' : 'none'}
        stroke={active ? 'var(--club-primary)' : '#4a4a4a'} strokeWidth="1.6" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Deportes',
    href: '/deportes',
    icon: (active: boolean) => (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--club-primary)' : '#4a4a4a'} strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M14.83 9.17l3.53 3.53M4.93 19.07l4.24-4.24" />
      </svg>
    ),
  },
  {
    label: 'Novedades',
    href: '/novedades',
    icon: (active: boolean) => (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--club-primary)' : '#4a4a4a'} strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" />
        <path d="M4 6a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2" />
        <line x1="11" y1="8" x2="17" y2="8" />
        <line x1="11" y1="12" x2="17" y2="12" />
        <line x1="11" y1="16" x2="15" y2="16" />
      </svg>
    ),
  },
  {
    label: 'Club',
    href: '/club',
    icon: (active: boolean) => (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--club-primary)' : '#4a4a4a'} strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" />
      </svg>
    ),
  },
  {
    label: 'Perfil',
    href: '/perfil',
    icon: (active: boolean) => (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--club-primary)' : '#4a4a4a'} strokeWidth="1.6" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function NavBar() {
  const pathname = usePathname()
  const router   = useRouter()

  return (
    <nav style={{
      position: 'fixed',
      bottom: '22px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 50,
    }}>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '6px',
          background: 'rgba(10,10,14,0.92)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRadius: '999px',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.06)',
        }}
      >
        {items.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <motion.button
              key={item.href}
              onClick={() => router.push(item.href)}
              whileTap={{ scale: 0.84 }}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                width: '52px',
                height: '44px',
                borderRadius: '999px',
                cursor: 'pointer',
              }}
            >
              {active && (
                <motion.div
                  layoutId="nav-active-pill"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '999px',
                    background: 'rgba(var(--club-primary-rgb),0.16)',
                    border: '1px solid rgba(var(--club-primary-rgb),0.28)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 42 }}
                />
              )}
              <div style={{
                position: 'relative',
                zIndex: 10,
                filter: active ? 'drop-shadow(0 0 6px rgba(var(--club-primary-rgb),0.55))' : 'none',
                transition: 'filter 0.2s ease',
              }}>
                {item.icon(active)}
              </div>
              <span style={{
                position: 'relative',
                zIndex: 10,
                fontSize: '8px',
                fontWeight: active ? 700 : 500,
                letterSpacing: '0.03em',
                color: active ? 'var(--club-primary)' : 'rgba(255,255,255,0.25)',
                lineHeight: 1,
                fontFamily: 'var(--font-body)',
              }}>
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </motion.div>
    </nav>
  )
}
