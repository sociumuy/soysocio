'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'
import PremiumButton from '@/components/PremiumButton'
import { getStoredClub } from '@/lib/club-storage'

type Espacio = {
  id: string
  nombre: string
  descripcion: string
  capacidad: string
  icon: React.ReactNode
}

const ESPACIOS: Espacio[] = [
  {
    id: 'gimnasio',
    nombre: 'Gimnasio',
    descripcion: 'Musculación y cardio',
    capacidad: 'Máx. 20 personas',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.8" strokeLinecap="round">
        <path d="M6 4v16M18 4v16M2 9h4M18 9h4M2 15h4M18 15h4" />
      </svg>
    ),
  },
  {
    id: 'tenis',
    nombre: 'Cancha de Tenis',
    descripcion: 'Canchas 1, 2 y 3',
    capacidad: '2–4 personas',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M6.5 6.5c3 3 3 9 0 11M17.5 6.5c-3 3-3 9 0 11" />
      </svg>
    ),
  },
  {
    id: 'pileta',
    nombre: 'Pileta',
    descripcion: 'Natación libre',
    capacidad: 'Máx. 15 personas',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.8" strokeLinecap="round">
        <path d="M2 12c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
        <path d="M2 17c1.5-2 3-2 4.5 0s3 2 4.5 0 3-2 4.5 0 3 2 4.5 0" />
        <path d="M12 2a3 3 0 0 0-3 3v5" />
        <circle cx="12" cy="4" r="1.5" />
      </svg>
    ),
  },
  {
    id: 'sauna',
    nombre: 'Sauna',
    descripcion: 'Sauna finlandesa',
    capacidad: 'Máx. 6 personas',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.8" strokeLinecap="round">
        <path d="M8 2c0 4-4 4-4 8a6 6 0 0 0 12 0c0-4-4-4-4-8" />
        <path d="M12 2c0 4-4 4-4 8" />
      </svg>
    ),
  },
  {
    id: 'squash',
    nombre: 'Squash',
    descripcion: 'Cancha cubierta',
    capacidad: '2 personas',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="15" cy="15" r="2" />
        <line x1="7" y1="7" x2="11" y2="11" />
      </svg>
    ),
  },
]

const HORAS = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

function getDias() {
  const dias = []
  const hoy = new Date()
  const nombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  for (let i = 0; i < 7; i++) {
    const d = new Date(hoy)
    d.setDate(hoy.getDate() + i)
    dias.push({
      key: d.toISOString().split('T')[0],
      dia: nombres[d.getDay()],
      num: d.getDate(),
      mes: meses[d.getMonth()],
      esHoy: i === 0,
    })
  }
  return dias
}

export default function ReservasPage() {
  const router = useRouter()
  const supabase = createClient()
  const storedClub = getStoredClub()

  const [paso, setPaso] = useState<1 | 2 | 3>(1)
  const [espacioSel, setEspacioSel] = useState<Espacio | null>(null)
  const [diaSel, setDiaSel] = useState(getDias()[0].key)
  const [horaSel, setHoraSel] = useState<string | null>(null)
  const [ocupados, setOcupados] = useState<string[]>([])
  const [socioId, setSocioId] = useState<string | null>(null)
  const [clubId, setClubId] = useState<string | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dias = getDias()
  const diaDisplay = dias.find(d => d.key === diaSel)

  // Cargar socio y club al montar
  useEffect(() => {
    async function cargarSocio() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: socios } = await supabase
        .from('socios')
        .select('id, club_id')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (socios) {
        setSocioId(socios.id)
        setClubId(socios.club_id)
      }
    }
    cargarSocio()
  }, [])

  // Cargar horarios ocupados cuando cambia espacio o día
  useEffect(() => {
    if (!espacioSel || !diaSel || !clubId) return
    async function cargarOcupados() {
      const { data } = await supabase
        .from('reservas')
        .select('hora')
        .eq('espacio', espacioSel!.id)
        .eq('fecha', diaSel)
        .eq('club_id', clubId!)
        .eq('estado', 'confirmada')

      setOcupados(data?.map(r => r.hora) ?? [])
    }
    cargarOcupados()
  }, [espacioSel, diaSel, clubId])

  async function confirmar() {
    if (!socioId || !clubId || !espacioSel || !horaSel) return
    setConfirmando(true)
    setError(null)

    const { error: err } = await supabase.from('reservas').insert({
      socio_id: socioId,
      club_id: clubId,
      espacio: espacioSel.id,
      fecha: diaSel,
      hora: horaSel,
      estado: 'confirmada',
    })

    if (err) {
      setError('No se pudo confirmar la reserva. Intentá de nuevo.')
      setConfirmando(false)
      return
    }

    setPaso(3)
    setConfirmando(false)
  }

  // Paso 3: confirmación
  if (paso === 3) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-20 h-20 bg-[#B8975A]/10 border border-[#B8975A]/30 rounded-full flex items-center justify-center mb-6"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="2" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h1 className="text-white font-serif text-3xl font-semibold mb-2">Reserva confirmada</h1>
          <p className="text-[#555] text-sm mb-1">{espacioSel?.nombre}</p>
          <p className="text-[#B8975A] text-sm font-semibold font-mono mb-8">
            {diaDisplay?.dia} {diaDisplay?.num} de {diaDisplay?.mes} · {horaSel} hs
          </p>
          <p className="text-[#444] text-xs mb-8 max-w-xs leading-relaxed">
            Podés cancelar hasta 2 horas antes desde esta pantalla.
          </p>
          <PremiumButton onClick={() => router.push('/home')} size="lg">
            Volver al inicio
          </PremiumButton>
          <button
            onClick={() => { setPaso(1); setEspacioSel(null); setHoraSel(null) }}
            className="mt-4 text-[#555] text-xs hover:text-white transition-colors block w-full text-center"
          >
            Hacer otra reserva
          </button>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        {paso === 2 ? (
          <button
            onClick={() => { setPaso(1); setHoraSel(null) }}
            className="flex items-center gap-2 text-[#555] text-xs mb-6 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver
          </button>
        ) : (
          <div className="h-10 mb-6" />
        )}
        <h1 className="text-white font-serif text-3xl font-semibold">
          {paso === 1 ? 'Reservas' : espacioSel?.nombre}
        </h1>
        <p className="text-[#555] text-sm mt-1">
          {paso === 1 ? 'Elegí un espacio' : 'Elegí día y horario'}
        </p>
      </div>

      {/* Contenido */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-24 flex flex-col gap-4">

        {/* PASO 1: Lista de espacios */}
        {paso === 1 && (
          <>
            <div className="text-[#888] text-xs uppercase tracking-widest mb-1">Instalaciones disponibles</div>
            {ESPACIOS.map((e, i) => (
              <motion.button
                key={e.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => { setEspacioSel(e); setPaso(2) }}
                className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 text-left hover:shadow-md transition-shadow w-full"
              >
                <div className="w-12 h-12 bg-[#F4F3EF] rounded-xl flex items-center justify-center flex-shrink-0">
                  {e.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[#0D0D0D] text-sm font-bold">{e.nombre}</div>
                  <div className="text-[#aaa] text-xs mt-0.5">{e.descripcion}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-[#ccc] text-[10px]">{e.capacidad}</div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </>
        )}

        {/* PASO 2: Fecha y hora */}
        {paso === 2 && (
          <>
            {/* Selector de días */}
            <div>
              <div className="text-[#888] text-xs uppercase tracking-widest mb-3">Fecha</div>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {dias.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => { setDiaSel(d.key); setHoraSel(null) }}
                    className={`flex flex-col items-center py-3 px-3.5 rounded-2xl flex-shrink-0 transition-all ${
                      diaSel === d.key ? 'bg-[#0D0D0D] text-white' : 'bg-white text-[#0D0D0D] shadow-sm'
                    }`}
                  >
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${diaSel === d.key ? 'text-[#B8975A]' : 'text-[#aaa]'}`}>
                      {d.esHoy ? 'Hoy' : d.dia}
                    </span>
                    <span className={`text-xl font-serif font-semibold mt-0.5 ${diaSel === d.key ? 'text-white' : 'text-[#0D0D0D]'}`}>
                      {d.num}
                    </span>
                    <span className={`text-[10px] ${diaSel === d.key ? 'text-[#555]' : 'text-[#ccc]'}`}>
                      {d.mes}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de horarios */}
            <div>
              <div className="text-[#888] text-xs uppercase tracking-widest mb-3">Horario disponible</div>
              <div className="grid grid-cols-4 gap-2">
                {HORAS.map((h) => {
                  const estaOcupado = ocupados.includes(h)
                  const esSel = horaSel === h
                  return (
                    <button
                      key={h}
                      disabled={estaOcupado}
                      onClick={() => setHoraSel(h)}
                      className={`rounded-xl py-3 text-xs font-semibold font-mono transition-all ${
                        estaOcupado
                          ? 'bg-[#E0DED9] text-[#ccc] cursor-not-allowed line-through'
                          : esSel
                          ? 'bg-[#0D0D0D] text-white'
                          : 'bg-white text-[#0D0D0D] shadow-sm hover:shadow-md'
                      }`}
                    >
                      {h}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-white border border-[#E0DED9]" />
                  <span className="text-[#aaa] text-[10px]">Disponible</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#E0DED9]" />
                  <span className="text-[#aaa] text-[10px]">Ocupado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#0D0D0D]" />
                  <span className="text-[#aaa] text-[10px]">Seleccionado</span>
                </div>
              </div>
            </div>

            {/* Resumen + botón confirmar */}
            <AnimatePresence>
              {horaSel && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="bg-[#0D0D0D] rounded-2xl p-5 mt-2"
                >
                  <div className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-widest mb-3">Tu reserva</div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center flex-shrink-0">
                      {espacioSel?.icon}
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold">{espacioSel?.nombre}</div>
                      <div className="text-[#B8975A] text-xs font-mono mt-0.5">
                        {diaDisplay?.dia} {diaDisplay?.num} de {diaDisplay?.mes} · {horaSel} hs
                      </div>
                    </div>
                  </div>
                  {error && (
                    <p className="text-red-400 text-xs mb-3 bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
                  )}
                  <PremiumButton onClick={confirmar} fullWidth size="lg" disabled={confirmando}>
                    {confirmando ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Confirmando...
                      </span>
                    ) : 'Confirmar reserva'}
                  </PremiumButton>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

      </div>

      <NavBar />
    </main>
  )
}
