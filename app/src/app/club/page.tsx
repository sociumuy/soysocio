'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import NavBar from '@/components/NavBar'
import { getStoredClub } from '@/lib/club-storage'

const LOGO = 'https://www.lobosrugbyclub.uy/wp-content/uploads/2019/10/lrc_logo_menu.png'

const VALORES = [
  { titulo: 'Respeto', desc: 'Con el rival, el árbitro y los compañeros.' },
  { titulo: 'Cortesía', desc: 'En la cancha y fuera de ella.' },
  { titulo: 'Compromiso', desc: 'Con el equipo, el club y la familia.' },
  { titulo: 'Espíritu Indomable', desc: 'Nunca rendirse. Siempre levantarse.' },
  { titulo: 'Compañerismo', desc: 'El equipo es más que la suma de sus partes.' },
  { titulo: 'Humildad', desc: 'Aprender siempre, de todos y en todo momento.' },
  { titulo: 'Solidaridad', desc: 'Somos una familia que se apoya.' },
]

const DISCIPLINAS = [
  {
    emoji: '🏉', nombre: 'Rugby', color: '#1B2D6E',
    cats: 'M7 · M9 · M11 · M13 · M15 · M17 · M19 · Intermedia · Primera · Veteranos',
    desc: 'Participamos en el Campeonato Uruguayo de Rugby. Valores de compañerismo, humildad y solidaridad en todas las categorías.',
  },
  {
    emoji: '🏑', nombre: 'Hockey', color: '#1A6B3A',
    cats: 'Sub-8 · Sub-10 · Sub-12 · Sub-14 · Sub-16 · Intermedia B · Reserva · Senior',
    desc: 'Más de 170 jugadoras. Competimos en la Federación Uruguaya de Hockey y en torneos locales en Maldonado y Montevideo.',
  },
  {
    emoji: '⚽', nombre: 'Fútbol', color: '#7D1A1A',
    cats: 'Infantiles · Juveniles',
    desc: 'Fútbol formativo para niños y jóvenes del club. Pretemporada anual y participación en torneos locales de la región.',
  },
  {
    emoji: '🏋️', nombre: 'Fitness', color: '#5a4a2a',
    cats: 'Sala de aparatos · Yoga · Zumba · Funcional',
    desc: '"Fitness para todos los gustos." Grupos pequeños con profesionales altamente capacitados para ayudarte a lograr tus metas.',
  },
]

const SERVICIOS = [
  { emoji: '🍖', nombre: 'Cantina',            desc: 'Bar disponible en días de entrenamiento y partido.' },
  { emoji: '🏟️', nombre: 'Alquiler de Canchas', desc: 'Canchas de rugby, hockey y fútbol para alquiler.' },
  { emoji: '🎉', nombre: 'Salón de Fiestas',   desc: 'Club House para eventos y celebraciones privadas.' },
]

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]
const BG = '#08101f'

export default function ClubPage() {
  const router = useRouter()
  const club   = getStoredClub()
  const primary  = club?.color_primario ?? '#1B2D6E'
  const rgb      = club?.color_rgb      ?? '27, 45, 110'
  const logoUrl  = club?.logo_url       ?? LOGO
  const clubName = club?.nombre         ?? 'Lobos Rugby Club'

  return (
    <main className="min-h-screen flex flex-col" style={{ background: BG }}>

      {/* ── Hero ── */}
      <div className="relative px-5 pt-12 pb-10 overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(${rgb},0.18) 0%, transparent 70%)` }} />

        <button onClick={() => router.push('/home')}
          className="relative z-10 flex items-center gap-2 text-white/30 text-xs mb-8 hover:text-white/70 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Inicio
        </button>

        {/* Logo + nombre */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="relative z-10 flex flex-col items-center text-center gap-5"
        >
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl overflow-hidden flex items-center justify-center"
              style={{ background: `rgba(${rgb},0.10)`, border: `1.5px solid rgba(${rgb},0.25)` }}>
              <img src={logoUrl} alt={clubName} className="w-full h-full object-contain p-2" />
            </div>
            {/* glow bajo el logo */}
            <div className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full blur-md opacity-40"
              style={{ background: primary }} />
          </div>

          <div>
            <h1 className="text-white font-serif text-4xl font-bold tracking-tight leading-tight">{clubName}</h1>
            <p className="text-white/30 text-xs tracking-[4px] uppercase mt-2">Maldonado · Uruguay · Est. 1989</p>
          </div>

          {/* Tagline */}
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, rgba(${rgb},0.4))` }} />
            <span className="text-white/50 font-serif text-lg italic">Somos Familia</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, rgba(${rgb},0.4))` }} />
          </div>
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <div className="px-5 pb-8">
        <div className="grid grid-cols-3 divide-x rounded-2xl overflow-hidden"
          style={{ background: `rgba(${rgb},0.08)`, border: `1px solid rgba(${rgb},0.15)` }}>
          {[
            { value: '800+', label: 'Socios' },
            { value: '35+',  label: 'Años'   },
            { value: '4',    label: 'Disciplinas' },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center py-4 gap-0.5"
              style={{ borderColor: `rgba(${rgb},0.2)` }}>
              <span className="font-serif text-2xl font-bold" style={{ color: primary }}>{value}</span>
              <span className="text-white/30 text-[10px] uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Historia ── */}
      <Section label="Historia" rgb={rgb}>
        <p className="text-white/70 text-sm leading-relaxed">
          Lobos Rugby Club nació hace más de 35 años en Maldonado como institución de rugby.
          Con el tiempo creció hasta convertirse en un club familiar que hoy reúne a más de{' '}
          <span className="text-white font-semibold">800 socios</span> en cuatro disciplinas:
          Rugby, Hockey, Fútbol y Fitness.
        </p>
        <p className="text-white/50 text-sm leading-relaxed mt-3">
          El club integra niños, jóvenes y familias promoviendo principios básicos de respeto,
          cortesía, compromiso y espíritu indomable. Desarrolla sentido de pertenencia comunitario
          y fomenta el deporte tanto en el ámbito educativo como competitivo.
        </p>
        <p className="text-white/50 text-sm leading-relaxed mt-3">
          Hoy el club cuenta con más de{' '}
          <span className="text-white font-semibold">170 jugadoras de hockey</span> y categorías
          de rugby desde M7 hasta Veteranos, compitiendo en el Campeonato Uruguayo de Rugby y la
          Federación Uruguaya de Hockey.
        </p>
        <p className="text-white/20 text-[11px] italic mt-4 text-right">Maldonado, Uruguay</p>
      </Section>

      {/* ── Valores ── */}
      <Section label="Valores" rgb={rgb}>
        <div className="flex flex-col">
          {VALORES.map((v, i) => (
            <motion.div
              key={v.titulo}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, ease }}
              className={`flex items-start gap-4 py-3.5 ${i < VALORES.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
            >
              <div className="w-0.5 h-full min-h-[2rem] rounded-full flex-shrink-0 mt-0.5"
                style={{ background: `rgba(${rgb},0.6)` }} />
              <div>
                <p className="text-white text-sm font-semibold leading-tight">{v.titulo}</p>
                <p className="text-white/40 text-xs mt-0.5 leading-snug">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── Disciplinas ── */}
      <Section label="Disciplinas" rgb={rgb}>
        <div className="flex flex-col gap-2">
          {DISCIPLINAS.map((d) => (
            <div key={d.nombre}
              className="px-4 py-3.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${d.color}` }}>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xl w-6 text-center flex-shrink-0">{d.emoji}</span>
                <p className="text-white text-sm font-bold">{d.nombre}</p>
              </div>
              <p className="text-white/45 text-[11px] leading-relaxed mb-1">{d.desc}</p>
              <p className="text-white/20 text-[10px] tracking-wide">{d.cats}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Servicios ── */}
      <Section label="Instalaciones y Servicios" rgb={rgb}>
        <div className="flex flex-col gap-2">
          {SERVICIOS.map((s) => (
            <div key={s.nombre}
              className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-lg flex-shrink-0 mt-0.5">{s.emoji}</span>
              <div>
                <p className="text-white text-sm font-bold">{s.nombre}</p>
                <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Contacto ── */}
      <Section label="Contacto" rgb={rgb}>
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
              label: 'Dirección',
              value: 'Honorato Balzac esq. Calderón de la Barca\nMaldonado, Uruguay 20000',
            },
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.37 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
              label: 'Teléfono',
              value: '+598 93 357 676',
            },
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
              label: 'Email',
              value: 'hola@lobosrugbyclub.uy\nclublobosoficina@gmail.com',
            },
            {
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
              label: 'Horario',
              value: 'Lun–Vie  9:30–12:30 · 15:30–19:30\nSáb  10:00–12:00',
            },
          ].map((row, i, arr) => (
            <div key={row.label}
              className={`flex items-start gap-3.5 px-4 py-4 ${i < arr.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `rgba(${rgb},0.12)`, color: primary }}>
                {row.icon}
              </div>
              <div>
                <p className="text-white/30 text-[9px] uppercase tracking-[3px] mb-0.5">{row.label}</p>
                <p className="text-white text-sm font-medium leading-relaxed whitespace-pre-line">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Redes sociales ── */}
      <Section label="Redes Sociales" rgb={rgb} last>
        <div className="flex flex-col gap-2">
          {[
            {
              label: 'Instagram', handle: '@lobosclubpde', url: 'https://www.instagram.com/lobosclubpde/',
              color: '#E1306C',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>,
            },
            {
              label: 'Facebook', handle: 'lobos.club', url: 'https://www.facebook.com/pg/lobos.club/',
              color: '#1877F2',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
            },
            {
              label: 'Twitter / X', handle: '@lobosclubpde', url: 'https://twitter.com/lobosclubpde',
              color: '#fff',
              icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
            },
            {
              label: 'Sitio oficial', handle: 'lobosrugbyclub.uy', url: 'https://www.lobosrugbyclub.uy/',
              color: primary,
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
            },
          ].map((red) => (
            <a key={red.label} href={red.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 px-4 py-4 rounded-xl transition-opacity active:opacity-60"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderLeftWidth: 3, borderLeftColor: red.color }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${red.color}18`, color: red.color }}>
                {red.icon}
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-bold">{red.label}</p>
                <p className="text-white/35 text-xs mt-0.5">{red.handle}</p>
              </div>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          ))}
        </div>
      </Section>

      <NavBar />
    </main>
  )
}

/* ── Componente de sección reutilizable ── */
function Section({ label, rgb, children, last }: { label: string; rgb: string; children: ReactNode; last?: boolean }) {
  return (
    <div className={`px-5 ${last ? 'pb-28' : 'pb-6'}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[9px] font-bold uppercase tracking-[3px]" style={{ color: `rgba(${rgb},0.7)` }}>{label}</span>
        <div className="flex-1 h-px" style={{ background: `rgba(${rgb},0.15)` }} />
      </div>
      {children}
    </div>
  )
}
