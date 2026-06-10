'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'

type Categoria = 'Todos' | 'Torneos' | 'Institucional' | 'Indumentaria' | 'Salud'

type Novedad = {
  id: number
  titulo: string
  resumen: string
  cuerpo: string
  categoria: Categoria
  fecha: string
  hora: string
  destacada?: boolean
}

const NOVEDADES: Novedad[] = [
  {
    id: 1,
    titulo: 'Torneo de verano — Inscripciones abiertas',
    resumen: 'Este año el torneo contará con categorías para todas las edades.',
    cuerpo: 'El Club Carrasco tiene el agrado de anunciar que las inscripciones para el Torneo de Verano 2026 ya están abiertas. Este año contaremos con categorías Sub-12, Sub-16, Adultos y Senior.\n\nLas inscripciones se realizan a través de la secretaría del club o directamente con el coordinador deportivo. El torneo comenzará el 15 de enero y se extenderá por cuatro semanas.\n\nPremios para los tres primeros puestos de cada categoría. ¡No te lo pierdas!',
    categoria: 'Torneos',
    fecha: 'Hoy',
    hora: '10:30 hs',
    destacada: true,
  },
  {
    id: 2,
    titulo: 'Nueva colección de indumentaria disponible',
    resumen: 'La nueva línea oficial del club ya está disponible en la tienda.',
    cuerpo: 'La nueva colección oficial del Club Carrasco para la temporada 2026 ya está disponible en la tienda del club.\n\nEncontrá remeras, buzos, gorras y bolsos con el escudo oficial en los colores institucionales. Los socios activos tienen un 15% de descuento presentando su credencial.\n\nHorario de la tienda: lunes a viernes de 9 a 18 hs, sábados de 9 a 13 hs.',
    categoria: 'Indumentaria',
    fecha: 'Ayer',
    hora: '15:00 hs',
  },
  {
    id: 3,
    titulo: 'Asamblea ordinaria — 15 de junio, 19 hs',
    resumen: 'Se tratarán temas presupuestales y la renovación de autoridades.',
    cuerpo: 'Se convoca a todos los socios activos a la Asamblea General Ordinaria del Club Carrasco, a realizarse el día 15 de junio a las 19:00 horas en el salón principal.\n\nOrden del día:\n1. Lectura y aprobación del acta anterior\n2. Informe de Comisión Directiva\n3. Balance y presupuesto 2026\n4. Renovación parcial de autoridades\n5. Varios\n\nEs indispensable concurrir con documento de identidad. El quórum necesario es de 30 socios activos.',
    categoria: 'Institucional',
    fecha: 'Jun 5',
    hora: '09:00 hs',
  },
  {
    id: 4,
    titulo: 'Nuevo programa de nutrición deportiva',
    resumen: 'El club incorpora una nutricionista para asesoramiento personalizado.',
    cuerpo: 'En el marco del programa de bienestar integral, el Club Carrasco incorporó a la Lic. María Fernández, nutricionista deportiva con más de 10 años de experiencia.\n\nLos socios pueden agendar consultas individuales de 45 minutos los martes y jueves de 10 a 14 hs.\n\nPara sacar turno, acercate a la recepción o escribí a nutricion@clubcarrasco.com.uy.',
    categoria: 'Salud',
    fecha: 'Jun 3',
    hora: '11:00 hs',
  },
  {
    id: 5,
    titulo: 'Resultados — Copa Primavera de Tenis',
    resumen: 'Excelentes resultados para los representantes del club.',
    cuerpo: 'El pasado fin de semana se disputó la Copa Primavera de Tenis, organizada por la Asociación Uruguaya de Tenis, con participación de 12 clubes.\n\nNuestros representantes lograron excelentes resultados:\n• Categoría A (masculino): Rodrigo Méndez — Finalista\n• Categoría B (femenino): Valentina Sosa — Campeona\n• Dobles masculino: Pérez/García — Tercer puesto\n\nFelicitamos a todos los participantes por su dedicación y esfuerzo.',
    categoria: 'Torneos',
    fecha: 'Jun 1',
    hora: '18:00 hs',
  },
  {
    id: 6,
    titulo: 'Mantenimiento del gimnasio — 12 de junio',
    resumen: 'El gimnasio estará cerrado por mantenimiento preventivo.',
    cuerpo: 'Informamos a los socios que el día 12 de junio el gimnasio permanecerá cerrado por trabajos de mantenimiento preventivo de equipos.\n\nLas actividades grupales de ese día (funcional 08:00, yoga 09:30) quedan suspendidas y serán recuperadas la semana siguiente.\n\nDisculpamos los inconvenientes.',
    categoria: 'Institucional',
    fecha: 'May 30',
    hora: '14:00 hs',
  },
]

const CATEGORIAS: Categoria[] = ['Todos', 'Torneos', 'Institucional', 'Indumentaria', 'Salud']

const CAT_COLORS: Record<Categoria, { bg: string; text: string }> = {
  'Todos':        { bg: '#0D0D0D', text: '#fff' },
  'Torneos':      { bg: '#1A3A5C', text: '#6BAED6' },
  'Institucional':{ bg: '#1A3A1A', text: '#52C97A' },
  'Indumentaria': { bg: '#3A1A1A', text: '#E07070' },
  'Salud':        { bg: '#2A1A3A', text: '#B07AE0' },
}

const CAT_BADGE: Record<Categoria, { bg: string; text: string }> = {
  'Todos':        { bg: '#F4F3EF', text: '#888' },
  'Torneos':      { bg: '#EBF4FF', text: '#1A5C9E' },
  'Institucional':{ bg: '#EAFAF0', text: '#1A6B3A' },
  'Indumentaria': { bg: '#FAEAEA', text: '#A03030' },
  'Salud':        { bg: '#F4EAFA', text: '#7030A0' },
}

export default function NovedadesPage() {
  const router = useRouter()
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria>('Todos')
  const [novedadSel, setNovedadSel] = useState<Novedad | null>(null)

  const filtradas = categoriaActiva === 'Todos'
    ? NOVEDADES
    : NOVEDADES.filter(n => n.categoria === categoriaActiva)

  // Vista de detalle
  if (novedadSel) {
    const colors = CAT_COLORS[novedadSel.categoria]
    const badge = CAT_BADGE[novedadSel.categoria]
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex flex-col">
        {/* Header con color de categoría */}
        <div style={{ background: colors.bg }} className="px-5 pt-12 pb-8">
          <button
            onClick={() => setNovedadSel(null)}
            className="flex items-center gap-2 text-[#555] text-xs mb-6 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Novedades
          </button>
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: colors.bg === '#0D0D0D' ? '#1a1a1a' : undefined, color: colors.text, border: `1px solid ${colors.text}30` }}
          >
            {novedadSel.categoria}
          </div>
          <h1 className="text-white font-serif text-2xl font-semibold leading-snug">
            {novedadSel.titulo}
          </h1>
          <p className="text-[#555] text-xs mt-3">{novedadSel.fecha} · {novedadSel.hora}</p>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-28">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            {novedadSel.cuerpo.split('\n').map((parrafo, i) => (
              parrafo.trim() === ''
                ? <div key={i} className="h-3" />
                : <p key={i} className="text-[#333] text-sm leading-relaxed">{parrafo}</p>
            ))}
          </div>
        </div>

        <NavBar />
      </main>
    )
  }

  // Vista de lista
  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <div className="h-10 mb-2" />
        <h1 className="text-white font-serif text-3xl font-semibold">Novedades</h1>
        <p className="text-[#555] text-sm mt-1">Club Carrasco</p>
      </div>

      {/* Contenido */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-24 flex flex-col gap-4">

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                categoriaActiva === cat
                  ? 'bg-[#0D0D0D] text-white'
                  : 'bg-white text-[#888] shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3">
          {filtradas.map((n, i) => {
            const badge = CAT_BADGE[n.categoria]
            const isDestacada = n.destacada && categoriaActiva === 'Todos' && i === 0
            return (
              <button
                key={n.id}
                onClick={() => setNovedadSel(n)}
                className={`bg-white rounded-2xl shadow-sm text-left hover:shadow-md transition-shadow overflow-hidden w-full ${isDestacada ? 'ring-1 ring-[#B8975A]/30' : ''}`}
              >
                {/* Barra de color superior */}
                <div
                  className="h-1 w-full"
                  style={{ background: CAT_COLORS[n.categoria].text }}
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ background: badge.bg, color: badge.text }}
                    >
                      {n.categoria}
                    </span>
                    {isDestacada && (
                      <span className="text-[10px] text-[#B8975A] font-semibold uppercase tracking-wider">Destacado</span>
                    )}
                    <span className="text-[#ccc] text-[10px] ml-auto">{n.fecha}</span>
                  </div>
                  <h3 className="text-[#0D0D0D] text-sm font-bold leading-snug mb-1">{n.titulo}</h3>
                  <p className="text-[#888] text-xs leading-relaxed line-clamp-2">{n.resumen}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[#ccc] text-[10px]">{n.hora}</span>
                    <span className="text-[#B8975A] text-[10px] font-semibold flex items-center gap-1">
                      Leer más
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

      </div>

      <NavBar />
    </main>
  )
}
