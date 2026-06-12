'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const items = [
  {
    label: 'Inicio',
    href: '/home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--club-primary)' : 'none'}
        stroke={active ? 'var(--club-primary)' : '#666'} strokeWidth="1.6" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Deportes',
    href: '/deportes',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--club-primary)' : '#666'} strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M14.83 9.17l3.53 3.53M4.93 19.07l4.24-4.24" />
      </svg>
    ),
  },
  {
    label: 'Novedades',
    href: '/novedades',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--club-primary)' : '#666'} strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z" />
        <path d="M4 6a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2" />
        <line x1="11" y1="8" x2="17" y2="8" />
        <line x1="11" y1="12" x2="17" y2="12" />
        <line x1="11" y1="16" x2="15" y2="16" />
      </svg>
    ),
  },
  {
    label: 'Perfil',
    href: '/perfil',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? 'var(--club-primary)' : '#666'} strokeWidth="1.6" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function NavBar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <motion.nav
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 pt-2 pb-6"
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {items.map((item) => {
        const active = pathname.startsWith(item.href)
        return (
          <motion.button
            key={item.href}
            onClick={() => router.push(item.href)}
            whileTap={{ scale: 0.88 }}
            className="relative flex flex-col items-center gap-1.5 flex-1 py-1.5 rounded-xl"
            style={{ background: active ? 'rgba(var(--club-primary-rgb),0.12)' : 'transparent' }}
          >
            {item.icon(active)}
            <span className="text-[9px] font-bold tracking-widest uppercase"
              style={{ color: active ? 'var(--club-primary)' : '#555' }}>
              {item.label}
            </span>
            {active && (
              <motion.div
                layoutId="dock-indicator"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                style={{ background: 'var(--club-primary)' }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </motion.button>
        )
      })}
    </motion.nav>
  )
}
