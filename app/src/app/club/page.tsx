'use client'

export const dynamic = 'force-dynamic'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import NavBar from '@/components/NavBar'
import { getStoredClub } from '@/lib/club-storage'

const LOGO = 'https://www.lobosrugbyclub.uy/wp-content/uploads/2019/10/lrc_logo_menu.png'

const VALORES = [
  { icono: '🤝', titulo: 'Respeto', desc: 'Con el rival, el árbitro y los compañeros, dentro y fuera de la cancha.' },
  { icono: '🎓', titulo: 'Cortesía', desc: 'Tratar a todos con amabilidad y consideración siempre.' },
  { icono: '💪', titulo: 'Compromiso', desc: 'Con el equipo, el club y la familia lobos.' },
  { icono: '🐺', titulo: 'Espíritu Indomable', desc: 'Nunca rendirse. Siempre levantarse. El espíritu Lobos.' },
  { icono: '🤜', titulo: 'Compañerismo', desc: 'El equipo es más que la suma de sus partes.' },
  { icono: '🙏', titulo: 'Humildad', desc: 'Aprender siempre, de todos y en cada momento.' },
  { icono: '❤️', titulo: 'Solidaridad', desc: 'Somos una familia que se apoya en la cancha y en la vida.' },
]

const DISCIPLINAS = [
  { emoji: '🏉', nombre: 'Rugby', cats: 'M7 · M13 · M19 · Intermedia · Primera · Veteranos', color: '#1B2D6E' },
  { emoji: '🏑', nombre: 'Hockey', cats: 'Sub-12 · Sub-14 · Sub-16 · Intermedia · Primera', color: '#1A6B3A' },
  { emoji: '⚽', nombre: 'Fútbol', cats: 'Baby Fútbol · Infantil · Senior · Master +45', color: '#7D1A1A' },
  { emoji: '🏋️', nombre: 'Fitness', cats: 'Disponible para socios', color: '#555' },
]

const SERVICIOS = [
  { icono: '🍖', nombre: 'Cantina', desc: 'Bar y cantina disponible en días de partido y entrenamiento.' },
  { icono: '🏟️', nombre: 'Alquiler de Canchas', desc: 'Canchas de rugby, hockey y fútbol para alquiler.' },
  { icono: '🎉', nombre: 'Salón de Fiestas', desc: 'Club House con capacidad para eventos y celebraciones privadas.' },
]

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function ClubPage() {
  const router = useRouter()
  const club = getStoredClub()
  const primary = club?.color_primario ?? '#1B2D6E'
  const rgb = club?.color_rgb ?? '27, 45, 110'
  const logoUrl = club?.logo_url ?? LOGO

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* ── Header oscuro ── */}
      <div className="relative px-5 pt-12 pb-8 overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full"
          style={{ background: `radial-gradient(circle, rgba(${rgb},0.12) 0%, transparent 70%)`, transform: 'translate(40%,-40%)' }} />

        <button onClick={() => router.push('/home')}
          className="flex items-center gap-2 text-[#555] text-xs mb-6 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Inicio
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
            style={{ background: `rgba(${rgb},0.12)`, border: `1.5px solid rgba(${rgb},0.2)` }}>
            <img src={logoUrl} alt="Lobos Rugby Club" className="w-full h-full object-contain p-1.5" />
          </div>
          <div>
            <h1 className="text-white font-serif text-3xl font-semibold leading-tight">Nuestro Club</h1>
            <p className="text-[#555] text-sm mt-0.5">Lobos Rugby Club · Maldonado</p>
          </div>
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="rounded-2xl px-5 py-4 text-center"
          style={{ background: `rgba(${rgb},0.07)`, border: `1px solid rgba(${rgb},0.14)` }}
        >
          <p className="text-white font-serif text-2xl font-semibold italic">"Somos Familia"</p>
          <p className="text-white/30 text-[10px] tracking-[4px] uppercase mt-2">Punta del Este · Uruguay</p>
        </motion.div>
      </div>

      {/* ── Contenido cream ── */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-28 flex flex-col gap-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Socios', value: '800+', color: primary },
            { label: 'Años', value: '35+', color: '#1A6B3A' },
            { label: 'Deportes', value: '3', color: '#7D1A1A' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm text-center overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: color }} />
              <div className="font-serif text-2xl font-bold mb-1" style={{ color }}>{value}</div>
              <div className="text-[#aaa] text-[10px] font-semibold uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* Historia */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Historia</p>
          <p className="text-[#0D0D0D] text-sm leading-relaxed">
            Lobos Rugby Club nació hace más de 35 años en Maldonado como un club de rugby.
            Con el tiempo creció hasta convertirse en una institución deportiva que hoy reúne
            a más de <strong>800 socios</strong> alrededor de tres disciplinas: Rugby, Hockey y Fútbol.
          </p>
          <p className="text-[#555] text-sm leading-relaxed mt-3">
            Desde sus inicios, el club fomenta la integración de niños, jóvenes y sus familias
            a través del deporte, el compañerismo y los valores que definen la identidad lobos.
          </p>
          <p className="text-[#bbb] text-[11px] italic mt-4 text-right">Hecho con ♥ en Punta del Este</p>
        </div>

        {/* Valores */}
        <div>
          <p className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Valores</p>
          <div className="flex flex-col gap-2">
            {VALORES.map((v, i) => (
              <motion.div
                key={v.titulo}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, ease }}
                className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm"
              >
                <span className="text-xl w-8 text-center flex-shrink-0">{v.icono}</span>
                <div>
                  <div className="text-[#0D0D0D] text-sm font-bold">{v.titulo}</div>
                  <div className="text-[#aaa] text-xs leading-snug">{v.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Disciplinas */}
        <div>
          <p className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Disciplinas</p>
          <div className="flex flex-col gap-2">
            {DISCIPLINAS.map((d) => (
              <div key={d.nombre} className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                  style={{ background: `${d.color}12` }}>
                  {d.emoji}
                </div>
                <div className="flex-1">
                  <div className="text-[#0D0D0D] text-sm font-bold">{d.nombre}</div>
                  <div className="text-[#aaa] text-[11px] mt-0.5">{d.cats}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Servicios */}
        <div>
          <p className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Servicios e Instalaciones</p>
          <div className="flex flex-col gap-2">
            {SERVICIOS.map((s) => (
              <div key={s.nombre} className="bg-white rounded-xl px-4 py-3 flex items-start gap-3 shadow-sm">
                <span className="text-xl flex-shrink-0 mt-0.5">{s.icono}</span>
                <div>
                  <div className="text-[#0D0D0D] text-sm font-bold">{s.nombre}</div>
                  <div className="text-[#aaa] text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div>
          <p className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Contacto y Horarios</p>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            {[
              { icono: '📍', label: 'Dirección', value: 'Honorato Balzac esq. Calderón de la Barca\nMaldonado, Uruguay 20000' },
              { icono: '📞', label: 'Teléfono', value: '+598 93 357 676' },
              { icono: '✉️', label: 'Email', value: 'hola@lobosrugbyclub.uy' },
              { icono: '🕐', label: 'Horario oficina', value: 'Lun–Vie 9:30–12:30 y 15:30–19:30\nSáb 10:00–12:00' },
            ].map((c, i, arr) => (
              <div key={c.label}
                className={`flex items-start gap-3 px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-[#F4F3EF]' : ''}`}>
                <span className="text-lg flex-shrink-0 mt-0.5">{c.icono}</span>
                <div>
                  <div className="text-[#aaa] text-[10px] uppercase tracking-wider mb-0.5">{c.label}</div>
                  <div className="text-[#0D0D0D] text-sm font-medium leading-snug whitespace-pre-line">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Redes sociales */}
        <div>
          <p className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Redes Sociales</p>
          <div className="flex flex-col gap-2">
            {[
              {
                label: 'Instagram', handle: '@lobosclubpde', url: 'https://www.instagram.com/lobosclubpde/', color: '#E1306C',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg>,
              },
              {
                label: 'Facebook', handle: 'lobos.club', url: 'https://www.facebook.com/pg/lobos.club/', color: '#1877F2',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
              },
              {
                label: 'Twitter / X', handle: '@lobosclubpde', url: 'https://twitter.com/lobosclubpde', color: '#1DA1F2',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
              },
              {
                label: 'Sitio oficial', handle: 'lobosrugbyclub.uy', url: 'https://www.lobosrugbyclub.uy/', color: '#555',
                icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>,
              },
            ].map((red) => (
              <a key={red.label} href={red.url} target="_blank" rel="noopener noreferrer"
                className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm active:opacity-75">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${red.color}15`, color: red.color }}>
                  {red.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[#0D0D0D] text-sm font-bold">{red.label}</div>
                  <div className="text-[#aaa] text-xs">{red.handle}</div>
                </div>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            ))}
          </div>
        </div>

      </div>

      <NavBar />
    </main>
  )
}
