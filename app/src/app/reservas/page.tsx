'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '@/components/NavBar'

const PARRILLEROS = [
  { id: 'parrillero-1', nombre: 'Parrillero 1', descripcion: 'Sector norte · hasta 15 personas' },
  { id: 'parrillero-2', nombre: 'Parrillero 2', descripcion: 'Sector central · hasta 20 personas' },
  { id: 'parrillero-3', nombre: 'Parrillero 3', descripcion: 'Sector sur · hasta 12 personas' },
]

const FRANJAS = [
  { id: 'manana', label: 'Mañana', hora: '10:00', rango: '10:00 – 14:00' },
  { id: 'tarde', label: 'Tarde', hora: '14:00', rango: '14:00 – 18:00' },
  { id: 'noche', label: 'Noche', hora: '18:00', rango: '18:00 – 22:00' },
]

function getDias() {
  const dias = []
  const hoy = new Date()
  const nombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  for (let i = 0; i < 14; i++) {
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

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function ReservasPage() {
  const router = useRouter()
  const supabase = createClient()

  const [parrilleroSel, setParrilleroSel] = useState<typeof PARRILLEROS[0] | null>(null)
  const [diaSel, setDiaSel] = useState(getDias()[0].key)
  const [franjaSel, setFranjaSel] = useState<typeof FRANJAS[0] | null>(null)
  const [ocupados, setOcupados] = useState<{ espacio: string; hora: string }[]>([])
  const [socioId, setSocioId] = useState<string | null>(null)
  const [clubId, setClubId] = useState<string | null>(null)
  const [confirmando, setConfirmando] = useState(false)
  const [confirmado, setConfirmado] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dias = getDias()
  const diaDisplay = dias.find(d => d.key === diaSel)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('socios').select('id, club_id').eq('user_id', user.id).limit(1).single()
      if (data) { setSocioId(data.id); setClubId(data.club_id) }
    }
    cargar()
  }, [])

  useEffect(() => {
    if (!diaSel || !clubId) return
    async function cargarOcupados() {
      const { data } = await supabase
        .from('reservas')
        .select('espacio, hora')
        .eq('fecha', diaSel)
        .eq('club_id', clubId!)
        .eq('estado', 'confirmada')
      setOcupados(data ?? [])
    }
    cargarOcupados()
  }, [diaSel, clubId])

  function estaOcupado(parrilleroId: string, hora: string) {
    return ocupados.some(o => o.espacio === parrilleroId && o.hora === hora)
  }

  async function confirmar() {
    if (!socioId || !clubId || !parrilleroSel || !franjaSel) return
    setConfirmando(true)
    setError(null)

    const { error: err } = await supabase.from('reservas').insert({
      socio_id: socioId,
      club_id: clubId,
      espacio: parrilleroSel.id,
      fecha: diaSel,
      hora: franjaSel.hora,
      estado: 'confirmada',
    })

    if (err) {
      setError('No se pudo confirmar. Intentá de nuevo.')
      setConfirmando(false)
      return
    }
    setConfirmando(false)
    setConfirmado(true)
  }

  if (confirmado) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(var(--club-primary-rgb),0.1)', border: '1px solid rgba(var(--club-primary-rgb),0.3)' }}
        >
          <span className="text-4xl">🔥</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h1 className="text-white font-serif text-3xl font-semibold mb-2">¡Reservado!</h1>
          <p className="text-[#555] text-sm mb-1">{parrilleroSel?.nombre}</p>
          <p className="font-mono text-sm font-semibold mb-8" style={{ color: 'var(--club-primary)' }}>
            {diaDisplay?.dia} {diaDisplay?.num} de {diaDisplay?.mes} · {franjaSel?.rango}
          </p>
          <button
            onClick={() => router.push('/home')}
            className="w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase text-[#0D0D0D] mb-4"
            style={{ background: 'var(--club-primary)' }}
          >
            Volver al inicio
          </button>
          <button
            onClick={() => { setConfirmado(false); setParrilleroSel(null); setFranjaSel(null) }}
            className="text-[#555] text-xs hover:text-white transition-colors"
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
        <button onClick={() => router.push('/home')}
          className="flex items-center gap-2 text-[#555] text-xs mb-6 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Inicio
        </button>
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <h1 className="text-white font-serif text-3xl font-semibold">Parrilleros</h1>
            <p className="text-[#555] text-sm">Reservá tu espacio para el asado</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-28 flex flex-col gap-5">

        {/* Selector de parrillero */}
        <div>
          <p className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Elegí un parrillero</p>
          <div className="flex flex-col gap-2">
            {PARRILLEROS.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setParrilleroSel(p)}
                className={`rounded-2xl p-4 flex items-center gap-4 text-left transition-all ${
                  parrilleroSel?.id === p.id
                    ? 'bg-[#0D0D0D] shadow-md'
                    : 'bg-white shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                  style={{
                    background: parrilleroSel?.id === p.id
                      ? 'rgba(var(--club-primary-rgb),0.15)'
                      : '#F4F3EF'
                  }}>
                  🔥
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-bold ${parrilleroSel?.id === p.id ? 'text-white' : 'text-[#0D0D0D]'}`}>
                    {p.nombre}
                  </div>
                  <div className={`text-xs mt-0.5 ${parrilleroSel?.id === p.id ? 'text-[#555]' : 'text-[#aaa]'}`}>
                    {p.descripcion}
                  </div>
                </div>
                {parrilleroSel?.id === p.id && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--club-primary)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Selector de fecha */}
        <AnimatePresence>
          {parrilleroSel && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Fecha</p>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {dias.map((d) => (
                  <button
                    key={d.key}
                    onClick={() => { setDiaSel(d.key); setFranjaSel(null) }}
                    className={`flex flex-col items-center py-2.5 px-3 rounded-2xl flex-shrink-0 transition-all ${
                      diaSel === d.key ? 'bg-[#0D0D0D] text-white' : 'bg-white text-[#0D0D0D] shadow-sm'
                    }`}
                  >
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${diaSel === d.key ? 'text-[var(--club-primary)]' : 'text-[#aaa]'}`}>
                      {d.esHoy ? 'Hoy' : d.dia}
                    </span>
                    <span className={`text-lg font-serif font-semibold mt-0.5 ${diaSel === d.key ? 'text-white' : 'text-[#0D0D0D]'}`}>
                      {d.num}
                    </span>
                    <span className={`text-[10px] ${diaSel === d.key ? 'text-[#555]' : 'text-[#ccc]'}`}>
                      {d.mes}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selector de franja */}
        <AnimatePresence>
          {parrilleroSel && diaSel && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-[#888] text-[10px] uppercase tracking-widest mb-3">Turno</p>
              <div className="grid grid-cols-3 gap-2">
                {FRANJAS.map((f) => {
                  const ocupado = estaOcupado(parrilleroSel.id, f.hora)
                  const sel = franjaSel?.id === f.id
                  return (
                    <button
                      key={f.id}
                      disabled={ocupado}
                      onClick={() => setFranjaSel(f)}
                      className={`rounded-2xl py-4 flex flex-col items-center gap-1 transition-all ${
                        ocupado
                          ? 'bg-[#E0DED9] cursor-not-allowed opacity-50'
                          : sel
                          ? 'bg-[#0D0D0D] shadow-md'
                          : 'bg-white shadow-sm'
                      }`}
                    >
                      <span className="text-lg">
                        {f.id === 'manana' ? '🌅' : f.id === 'tarde' ? '☀️' : '🌙'}
                      </span>
                      <span className={`text-xs font-bold ${sel ? 'text-white' : ocupado ? 'text-[#bbb]' : 'text-[#0D0D0D]'}`}>
                        {f.label}
                      </span>
                      <span className={`text-[9px] ${sel ? 'text-[#555]' : 'text-[#bbb]'}`}>{f.rango}</span>
                      {ocupado && <span className="text-[9px] text-[#ccc] font-semibold">Ocupado</span>}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmar */}
        <AnimatePresence>
          {parrilleroSel && franjaSel && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="bg-[#0D0D0D] rounded-2xl p-5"
            >
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Tu reserva</p>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="text-white text-sm font-bold">{parrilleroSel.nombre}</div>
                  <div className="font-mono text-xs mt-0.5" style={{ color: 'var(--club-primary)' }}>
                    {diaDisplay?.dia} {diaDisplay?.num} de {diaDisplay?.mes} · {franjaSel.rango}
                  </div>
                </div>
              </div>
              {error && (
                <p className="text-red-400 text-xs mb-3 bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
              )}
              <button
                onClick={confirmar}
                disabled={confirmando}
                className="w-full py-4 rounded-xl text-sm font-bold tracking-widest uppercase text-[#0D0D0D] transition-opacity active:opacity-80 disabled:opacity-50"
                style={{ background: 'var(--club-primary)' }}
              >
                {confirmando ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Confirmando...
                  </span>
                ) : 'Confirmar reserva'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <NavBar />
    </main>
  )
}
