'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import { getStoredClub } from '@/lib/club-storage'

const LOGO = 'https://www.lobosrugbyclub.uy/wp-content/uploads/2019/10/lrc_logo_menu.png'
const GOLD = '#B8975A'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const VALORES = [
  { titulo: 'Respeto',            desc: 'Con el rival, el árbitro y los compañeros.' },
  { titulo: 'Cortesía',           desc: 'En la cancha y fuera de ella.' },
  { titulo: 'Compromiso',         desc: 'Con el equipo, el club y la familia.' },
  { titulo: 'Espíritu Indomable', desc: 'Nunca rendirse. Siempre levantarse.' },
  { titulo: 'Compañerismo',       desc: 'El equipo es más que la suma de sus partes.' },
  { titulo: 'Humildad',           desc: 'Aprender siempre, de todos y en todo momento.' },
  { titulo: 'Solidaridad',        desc: 'Somos una familia que se apoya.' },
]

const DISCIPLINAS = [
  { nombre: 'Rugby',   socios: '380+', detalle: '10 categorías · M7 hasta Veteranos' },
  { nombre: 'Hockey',  socios: '170+', detalle: '8 categorías · Sub-8 hasta Senior'  },
  { nombre: 'Fútbol',  socios: '120+', detalle: '4 categorías · Infantiles y Juveniles' },
  { nombre: 'Fitness', socios: '130+', detalle: 'Gym · Yoga · Funcional · Zumba'     },
]

const SPONSORS_TOP = [
  { nombre: 'MP' },
  { nombre: 'Cardiomóvil' },
  { nombre: 'Reserva Montoya' },
  { nombre: 'Itaú Uruguay' },
]
const SPONSORS_MID = ['Woodside School', 'Zillertal', 'KP Pro', 'Gatorade', 'Tienda Inglesa']
const SPONSORS_COMUNIDAD = [
  'Market del Este', 'Barraca Maldonado', 'Cattivelli', 'Aguilera',
  'Reverdecer', 'Bancoff', 'WMW', 'Barbot Ingenieros',
  'Avícolas del Oeste', 'Radio Viva 96.7', 'Solstar',
]

export default function ClubPage() {
  const router  = useRouter()
  const club    = getStoredClub()
  const logoUrl = club?.logo_url ?? LOGO

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#0A0A0C' }}>

      {/* ── Volver ── */}
      <div className="px-6 pt-20 mb-14">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 active:opacity-50 transition-opacity"
          style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.25)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
      </div>

      {/* ════════════════════════════════
          HERO — identidad del club
      ════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="px-6 mb-16"
      >
        {/* Escudo pequeño */}
        <img
          src={logoUrl}
          alt="Lobos RC"
          className="w-12 h-12 object-contain mb-8 opacity-90"
        />

        {/* Nombre — serif, grande */}
        <h1
          className="font-serif text-white leading-none mb-5"
          style={{ fontSize: '48px', fontWeight: 700, letterSpacing: '-0.025em' }}
        >
          Lobos<br />
          Rugby Club
        </h1>

        {/* Localización */}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '10px',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.22)', marginBottom: '28px',
        }}>
          Maldonado · Uruguay · Est. 1989
        </p>

        {/* Línea dorada */}
        <div style={{ width: '40px', height: '1px', background: GOLD, marginBottom: '28px' }} />

        {/* Stats en línea */}
        <div className="flex items-center gap-8">
          {[
            { v: '800+', l: 'Socios' },
            { v: '35+',  l: 'Años'   },
            { v: '4',    l: 'Disciplinas' },
          ].map(({ v, l }) => (
            <div key={l}>
              <p className="font-serif text-white" style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>{v}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>{l}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Divisor full-width */}
      <div className="mx-6 mb-16" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* ════════════════════════════════
          HISTORIA
      ════════════════════════════════ */}
      <div className="px-6 mb-16">
        <Label>Historia</Label>

        {/* Pull quote serif */}
        <p
          className="font-serif text-white mb-6"
          style={{ fontSize: '22px', fontWeight: 400, lineHeight: 1.35, letterSpacing: '-0.01em', fontStyle: 'italic' }}
        >
          "Un club familiar construido en treinta y cinco años de deporte, comunidad y espíritu indomable."
        </p>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.42)', lineHeight: 1.75 }}>
          Lobos Rugby Club nació en Maldonado como institución de rugby y creció hasta convertirse en el referente deportivo de la costa uruguaya.
          Hoy reúne más de <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>800 socios</span> en cuatro disciplinas,
          con categorías desde los 6 años hasta los Veteranos.
        </p>

        {/* Hitos — línea de tiempo minimalista */}
        <div className="mt-8 flex flex-col gap-0">
          {[
            { año: '1989', hecho: 'Fundación en Maldonado' },
            { año: '2005', hecho: 'Nace el hockey femenino' },
            { año: '2015', hecho: 'Más de 500 socios activos' },
            { año: '2024', hecho: '800 socios · 4 disciplinas · 35 años' },
          ].map(({ año, hecho }, i, arr) => (
            <div key={año} className="flex gap-5 relative">
              {i < arr.length - 1 && (
                <div className="absolute left-[28px] top-5 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
              )}
              <div className="flex-shrink-0 w-4 flex flex-col items-center pt-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === arr.length - 1 ? GOLD : 'rgba(255,255,255,0.20)' }} />
              </div>
              <div className="pb-6">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700, color: GOLD, letterSpacing: '0.10em' }}>
                  {año}
                </span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>
                  {hecho}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div className="mx-6 mb-16" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* ════════════════════════════════
          DISCIPLINAS — líneas, sin color
      ════════════════════════════════ */}
      <div className="px-6 mb-16">
        <Label>Disciplinas</Label>

        <div className="flex flex-col">
          {DISCIPLINAS.map(({ nombre, socios, detalle }, i) => (
            <div
              key={nombre}
              className={`flex items-baseline justify-between py-5 ${i < DISCIPLINAS.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div>
                <h3
                  className="font-serif text-white"
                  style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '5px' }}
                >
                  {nombre}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.01em' }}>
                  {detalle}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="font-serif text-white" style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {socios}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.10em', textTransform: 'uppercase', marginTop: '3px' }}>
                  socios
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div className="mx-6 mb-16" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* ════════════════════════════════
          VALORES — manifiesto numerado
      ════════════════════════════════ */}
      <div className="px-6 mb-16">
        <Label>Valores</Label>

        <div className="flex flex-col gap-0">
          {VALORES.map(({ titulo, desc }, i) => (
            <div
              key={titulo}
              className={`flex gap-5 py-5 ${i < VALORES.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700,
                color: GOLD, letterSpacing: '0.08em', minWidth: '20px', paddingTop: '3px',
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="font-serif text-white" style={{ fontSize: '17px', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: '4px' }}>
                  {titulo}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div className="mx-6 mb-16" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* ════════════════════════════════
          INSTALACIONES
      ════════════════════════════════ */}
      <div className="px-6 mb-16">
        <Label>Instalaciones</Label>
        <div className="flex flex-col gap-0">
          {[
            { titulo: 'Canchas de césped',    sub: 'Rugby · Hockey · Fútbol' },
            { titulo: 'Gimnasio y SUM',        sub: 'Fitness · Clases grupales' },
            { titulo: 'Cantina y Club House',  sub: 'Bar · Eventos · Salón de fiestas' },
            { titulo: 'Parrilleros',           sub: '3 parrilleros disponibles' },
          ].map(({ titulo, sub }, i, arr) => (
            <div
              key={titulo}
              className={`flex items-center justify-between py-4 ${i < arr.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.80)' }}>{titulo}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginTop: '2px' }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div className="mx-6 mb-16" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* ════════════════════════════════
          SPONSORS — roll of honour
      ════════════════════════════════ */}
      <div className="px-6 mb-16">
        <Label>Acompañan al club</Label>

        {/* Principales — serif, grandes */}
        <div className="flex flex-col gap-5 mb-10">
          {SPONSORS_TOP.map(({ nombre }) => (
            <p
              key={nombre}
              className="font-serif text-white"
              style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              {nombre}
            </p>
          ))}
        </div>

        {/* Divisor tenue */}
        <div className="mb-8" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Secundarios — texto, sin box */}
        <div className="flex flex-col gap-3 mb-10">
          {SPONSORS_MID.map(nombre => (
            <p
              key={nombre}
              style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.45)' }}
            >
              {nombre}
            </p>
          ))}
        </div>

        {/* Divisor */}
        <div className="mb-6" style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }} />

        {/* Comunidad */}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: '10px',
        }}>
          Comunidad
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.22)', lineHeight: 2 }}>
          {SPONSORS_COMUNIDAD.join('  ·  ')}
        </p>
      </div>

      {/* Divisor */}
      <div className="mx-6 mb-16" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* ════════════════════════════════
          CONTACTO
      ════════════════════════════════ */}
      <div className="px-6 mb-16">
        <Label>Contacto</Label>

        <div className="flex flex-col gap-0">
          {[
            {
              label: 'Dirección',
              valor: 'Honorato Balzac esq. Calderón de la Barca\nMaldonado, Uruguay',
              href: undefined,
            },
            { label: 'Teléfono', valor: '+598 93 357 676', href: 'tel:+59893357676' },
            { label: 'Email',    valor: 'hola@lobosrugbyclub.uy', href: 'mailto:hola@lobosrugbyclub.uy' },
            { label: 'Horario', valor: 'Lun–Vie 9:30–19:30  ·  Sáb 10:00–12:00', href: undefined },
          ].map(({ label, valor, href }, i, arr) => {
            const Inner = (
              <div
                className={`flex flex-col py-5 ${i < arr.length - 1 ? 'border-b' : ''}`}
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '6px' }}>
                  {label}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, color: href ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)', lineHeight: 1.55, whiteSpace: 'pre-line' }}>
                  {valor}
                </p>
              </div>
            )
            return href
              ? <a key={label} href={href} className="active:opacity-60 transition-opacity">{Inner}</a>
              : <div key={label}>{Inner}</div>
          })}
        </div>
      </div>

      {/* Divisor */}
      <div className="mx-6 mb-16" style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

      {/* ════════════════════════════════
          REDES
      ════════════════════════════════ */}
      <div className="px-6 pb-36">
        <Label>Redes</Label>

        <div className="flex flex-col gap-0">
          {[
            { label: 'Instagram',   handle: '@lobosclubpde',      url: 'https://www.instagram.com/lobosclubpde/'     },
            { label: 'Facebook',    handle: 'lobos.club',          url: 'https://www.facebook.com/pg/lobos.club/'     },
            { label: 'Twitter / X', handle: '@lobosclubpde',       url: 'https://twitter.com/lobosclubpde'           },
            { label: 'Sitio web',   handle: 'lobosrugbyclub.uy',   url: 'https://www.lobosrugbyclub.uy/'             },
          ].map(({ label, handle, url }, i, arr) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between py-5 active:opacity-50 transition-opacity ${i < arr.length - 1 ? 'border-b' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.70)' }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>{handle}</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" strokeLinecap="round">
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          ))}
        </div>
      </div>

      <NavBar />
    </main>
  )
}

function Label({ children }: { children: string }) {
  return (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: '9px',
      fontWeight: 700,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.22)',
      marginBottom: '20px',
    }}>
      {children}
    </p>
  )
}
