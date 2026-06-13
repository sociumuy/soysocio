'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import { getStoredClub } from '@/lib/club-storage'

const LOGO = 'https://www.lobosrugbyclub.uy/wp-content/uploads/2019/10/lrc_logo_menu.png'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const VALORES = [
  { n: '01', titulo: 'Respeto',           desc: 'Con el rival, el árbitro y los compañeros.' },
  { n: '02', titulo: 'Cortesía',          desc: 'En la cancha y fuera de ella.' },
  { n: '03', titulo: 'Compromiso',        desc: 'Con el equipo, el club y la familia.' },
  { n: '04', titulo: 'Espíritu Indomable',desc: 'Nunca rendirse. Siempre levantarse.' },
  { n: '05', titulo: 'Compañerismo',      desc: 'El equipo es más que la suma de sus partes.' },
  { n: '06', titulo: 'Humildad',          desc: 'Aprender siempre, de todos y en todo momento.' },
  { n: '07', titulo: 'Solidaridad',       desc: 'Somos una familia que se apoya.' },
]

const DISCIPLINAS = [
  { nombre: 'Rugby',   color: '#1B2D6E', rgb: '27,45,110',   socios: '380+', cats: '10 categorías',   desde: 'M7 hasta Veteranos' },
  { nombre: 'Hockey',  color: '#1A6B3A', rgb: '26,107,58',   socios: '170+', cats: '8 categorías',    desde: 'Sub-8 hasta Senior'  },
  { nombre: 'Fútbol',  color: '#7D1A1A', rgb: '125,26,26',   socios: '120+', cats: '4 categorías',    desde: 'Infantiles · Juveniles' },
  { nombre: 'Fitness', color: '#4a3520', rgb: '74,53,32',    socios: '130+', cats: 'Gym · Clases',    desde: 'Yoga · Funcional · Zumba' },
]

const SPONSORS_TOP = [
  { nombre: 'MP',              sub: null },
  { nombre: 'Cardiomóvil',     sub: 'Emergencia Médica' },
  { nombre: 'Reserva Montoya', sub: 'La Barra · PDE'    },
  { nombre: 'Itaú Uruguay',    sub: 'Banco oficial'      },
]
const SPONSORS_MID = ['Woodside School', 'Zillertal', 'KP Pro', 'Gatorade', 'Tienda Inglesa']
const SPONSORS_COMUNIDAD = [
  'Market del Este', 'Barraca Maldonado', 'Cattivelli', 'Aguilera',
  'Reverdecer', 'Bancoff', 'WMW', 'Barbot Ingenieros',
  'Avícolas del Oeste', 'Radio Viva 96.7', 'Solstar',
]

export default function ClubPage() {
  const router   = useRouter()
  const club     = getStoredClub()
  const primary  = club?.color_primario ?? '#1B2D6E'
  const rgb      = club?.color_rgb      ?? '27, 45, 110'
  const logoUrl  = club?.logo_url       ?? LOGO
  const clubName = club?.nombre         ?? 'Lobos Rugby Club'

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#08101f' }}>

      {/* ════════════════════════════════════
          HERO — editorial, asimétrico
      ════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ minHeight: '340px' }}>
        {/* Glow top */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(ellipse 90% 55% at 50% -5%, rgba(${rgb},0.22) 0%, transparent 65%)` }} />
        {/* Grain */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '180px' }} />

        {/* Nav row */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-20 mb-10">
          <button onClick={() => router.back()}
            className="w-8 h-8 rounded-full flex items-center justify-center active:opacity-60 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <img src="/lobos-logo.png" alt="Lobos" className="w-8 h-8 object-contain opacity-60" />
        </div>

        {/* Club name — large editorial treatment */}
        <div className="relative z-10 px-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', color: `rgba(${rgb},0.7)`, marginBottom: '10px', fontWeight: 700 }}>
              Est. 1989 · Maldonado, Uruguay
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 0.92, marginBottom: '16px' }}>
              Lobos<br />
              <span style={{ color: primary }}>Rugby</span><br />
              Club
            </h1>
          </motion.div>

          {/* Stats inline — no boxes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-5 mt-6 pb-8"
          >
            {[
              { v: '800+', l: 'socios' },
              { v: '35+',  l: 'años'   },
              { v: '4',    l: 'disciplinas' },
              { v: '10',   l: 'categorías rugby' },
            ].map(({ v, l }, i) => (
              <div key={l} className="flex flex-col" style={{ opacity: 1 - i * 0.15 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{v}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.30)', marginTop: '2px', letterSpacing: '0.05em' }}>{l}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Línea separadora dorada */}
      <div className="px-5 mb-10">
        <div className="h-px" style={{ background: `linear-gradient(to right, ${primary}, rgba(${rgb},0.15), transparent)` }} />
      </div>

      {/* ════════════════════════════════════
          HISTORIA — pull quote + hitos
      ════════════════════════════════════ */}
      <div className="px-5 mb-10">
        <Eyebrow>Historia</Eyebrow>

        {/* Pull quote */}
        <blockquote className="mb-6" style={{ borderLeft: `2px solid rgba(${rgb},0.5)`, paddingLeft: '16px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#fff', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
            "Un club familiar construido en 35 años de deporte y comunidad."
          </p>
        </blockquote>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.7 }}>
          Lobos RC nació en Maldonado como institución de rugby y creció hasta convertirse en el club de referencia de la costa uruguaya. Hoy reúne más de{' '}
          <span style={{ color: '#fff', fontWeight: 600 }}>800 socios</span> en cuatro disciplinas, con categorías desde los 6 años hasta los Veteranos.
        </p>

        {/* Hitos */}
        <div className="flex flex-col gap-0 mt-6">
          {[
            { año: '1989', hecho: 'Fundación del club en Maldonado' },
            { año: '2005', hecho: 'Incorporación del Hockey femenino' },
            { año: '2015', hecho: 'Más de 500 socios activos' },
            { año: '2024', hecho: '800+ socios, 4 disciplinas, 35 años' },
          ].map(({ año, hecho }, i, arr) => (
            <div key={año} className="flex gap-4 relative">
              {/* Línea vertical */}
              {i < arr.length - 1 && (
                <div className="absolute left-[31px] top-7 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              )}
              <div className="flex-shrink-0 flex flex-col items-center pt-1">
                <div className="w-2 h-2 rounded-full mt-1" style={{ background: primary, flexShrink: 0 }} />
              </div>
              <div className="pb-5">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, color: primary, letterSpacing: '0.12em' }}>{año}</span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginTop: '1px' }}>{hecho}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          DISCIPLINAS — cards con número grande
      ════════════════════════════════════ */}
      <div className="mb-10">
        <div className="px-5 mb-4">
          <Eyebrow>Disciplinas</Eyebrow>
        </div>
        <div className="flex flex-col gap-2 px-5">
          {DISCIPLINAS.map((d, i) => (
            <motion.div
              key={d.nombre}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, ease }}
              className="relative overflow-hidden rounded-2xl"
              style={{ background: `rgba(${d.rgb},0.12)`, border: `1px solid rgba(${d.rgb},0.22)` }}
            >
              {/* Número en background */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 select-none pointer-events-none"
                style={{ fontFamily: 'var(--font-display)', fontSize: '72px', fontWeight: 900, color: `rgba(${d.rgb},0.18)`, letterSpacing: '-0.05em', lineHeight: 1 }}>
                {String(i + 1).padStart(2, '0')}
              </div>

              <div className="relative z-10 px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {d.nombre}
                  </h3>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.38)', marginLeft: '12px' }}>
                  {d.desde}
                </p>
                <div className="flex items-center gap-4 mt-3 ml-3">
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>{d.socios}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.30)', marginLeft: '4px' }}>socios</span>
                  </div>
                  <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.40)' }}>{d.cats}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          VALORES — scroll horizontal editorial
      ════════════════════════════════════ */}
      <div className="mb-10">
        <div className="px-5 mb-4">
          <Eyebrow>Valores</Eyebrow>
        </div>

        {/* Horizontal scroll de valores */}
        <div className="flex gap-3 overflow-x-auto pb-3 px-5" style={{ scrollbarWidth: 'none' }}>
          {VALORES.map((v) => (
            <div
              key={v.n}
              className="flex-shrink-0 flex flex-col justify-between rounded-2xl p-4"
              style={{
                width: '140px',
                minHeight: '160px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 900, color: `rgba(${rgb},0.2)`, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {v.n}
              </span>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '6px' }}>
                  {v.titulo}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          INSTALACIONES — minimalista
      ════════════════════════════════════ */}
      <div className="px-5 mb-10">
        <Eyebrow>Instalaciones</Eyebrow>
        <div className="flex flex-col divide-y" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.07)' }}>
          {[
            { titulo: 'Canchas de césped',   sub: 'Rugby · Hockey · Fútbol' },
            { titulo: 'Gimnasio y SUM',       sub: 'Fitness · Clases grupales' },
            { titulo: 'Cantina y Club House', sub: 'Bar · Eventos · Fiestas' },
            { titulo: 'Parrilleros',          sub: '3 parrilleros disponibles' },
          ].map(({ titulo, sub }) => (
            <div key={titulo} className="flex items-center justify-between py-4">
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: '#fff' }}>{titulo}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{sub}</p>
              </div>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: `rgba(${rgb},0.5)` }} />
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          SPONSORS — wall editorial
      ════════════════════════════════════ */}
      <div className="px-5 mb-10">
        <Eyebrow>Acompañan al club</Eyebrow>

        {/* Gold line */}
        <div className="h-px mb-5" style={{ background: 'linear-gradient(to right, #C8940A, rgba(200,148,10,0.15), transparent)' }} />

        {/* Principales — nombres grandes */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-7">
          {SPONSORS_TOP.map(s => (
            <div key={s.nombre}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {s.nombre}
              </p>
              {s.sub && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.28)', marginTop: '3px' }}>
                  {s.sub}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Separador */}
        <div className="h-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Secundarios */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 mb-7">
          {SPONSORS_MID.map(nombre => (
            <span key={nombre} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>
              {nombre}
            </span>
          ))}
        </div>

        {/* Separador */}
        <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.04)' }} />

        {/* Comunidad — pequeño */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.20)', marginBottom: '10px' }}>
          Comunidad
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.8 }}>
          {SPONSORS_COMUNIDAD.join(' · ')}
        </p>
      </div>

      {/* ════════════════════════════════════
          CONTACTO — tarjetas de acción
      ════════════════════════════════════ */}
      <div className="px-5 mb-10">
        <Eyebrow>Contacto</Eyebrow>

        <div className="flex flex-col gap-2">
          {/* Dirección */}
          <div className="rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '6px' }}>Dirección</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: '#fff', lineHeight: 1.35 }}>
              Honorato Balzac esq.<br />Calderón de la Barca
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.30)', marginTop: '3px' }}>Maldonado, Uruguay 20000</p>
          </div>

          {/* Teléfono + Email — dos columnas */}
          <div className="grid grid-cols-2 gap-2">
            <a href="tel:+59893357676"
              className="rounded-2xl px-4 py-4 active:opacity-70 transition-opacity"
              style={{ background: `rgba(${rgb},0.12)`, border: `1px solid rgba(${rgb},0.22)` }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: `rgba(${rgb},0.7)`, marginBottom: '6px' }}>Teléfono</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>+598 93<br />357 676</p>
            </a>
            <a href="mailto:hola@lobosrugbyclub.uy"
              className="rounded-2xl px-4 py-4 active:opacity-70 transition-opacity"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '6px' }}>Email</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, color: '#fff', lineHeight: 1.35 }}>hola@lobos<br />rugbyclub.uy</p>
            </a>
          </div>

          {/* Horario */}
          <div className="rounded-2xl px-5 py-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '6px' }}>Horario secretaría</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: '#fff' }}>Lun–Vie  9:30 – 19:30</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Sáb  10:00 – 12:00</p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          REDES — minimal, icono grande
      ════════════════════════════════════ */}
      <div className="px-5 pb-36">
        <Eyebrow>Redes</Eyebrow>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              label: 'Instagram',
              handle: '@lobosclubpde',
              url: 'https://www.instagram.com/lobosclubpde/',
              color: '#E1306C',
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
            },
            {
              label: 'Facebook',
              handle: 'lobos.club',
              url: 'https://www.facebook.com/pg/lobos.club/',
              color: '#1877F2',
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
            },
            {
              label: 'Twitter / X',
              handle: '@lobosclubpde',
              url: 'https://twitter.com/lobosclubpde',
              color: '#fff',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
            },
            {
              label: 'Sitio web',
              handle: 'lobosrugbyclub.uy',
              url: 'https://www.lobosrugbyclub.uy/',
              color: primary,
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
            },
          ].map((red) => (
            <a
              key={red.label}
              href={red.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl p-4 flex flex-col gap-3 active:opacity-70 transition-opacity"
              style={{ background: `${red.color}0d`, border: `1px solid ${red.color}22` }}
            >
              <div style={{ color: red.color }}>{red.icon}</div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{red.label}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.30)', marginTop: '3px' }}>{red.handle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      <NavBar />
    </main>
  )
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: '9px',
      fontWeight: 700,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.28)',
      marginBottom: '16px',
    }}>
      {children}
    </p>
  )
}
