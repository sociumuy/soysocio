'use client'

import { usePathname, useRouter } from 'next/navigation'

const items = [
  {
    label: 'Inicio',
    href: '/home',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#B8975A' : '#999'} strokeWidth="1.8" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: 'Reservas',
    href: '/reservas',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#B8975A' : '#999'} strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Novedades',
    href: '/novedades',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#B8975A' : '#999'} strokeWidth="1.8" strokeLinecap="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },
  {
    label: 'Perfil',
    href: '/perfil',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#B8975A' : '#999'} strokeWidth="1.8" strokeLinecap="round">
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0DED9] px-2 pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center gap-1 py-3 px-4 transition-opacity hover:opacity-70"
            >
              {item.icon(active)}
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${active ? 'text-[#B8975A]' : 'text-[#999]'}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
