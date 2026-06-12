'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { setStoredClub, getIniciales, getClubGradient, type ClubStored } from '@/lib/club-storage'

type Club = { id: string; nombre: string; color_primario?: string; color_rgb?: string; logo_url?: string | null }
type Step = 'loading' | 'clubs' | 'roles'

const NAVY = '#1B2D6E'
const GOLD = '#C8940A'
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

const BG = '#08101f'

// Clubes demo para presentación — se muestran además de los de Supabase
const DEMO_CLUBS: Club[] = [
  { id: 'demo-polo',      nombre: 'Carrasco Polo Club', color_primario: '#1565C0', color_rgb: '21, 101, 192', logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Carrasco_Polo_Club_Crest.svg/250px-Carrasco_Polo_Club_Crest.svg.png' },
  { id: 'demo-ceibos',    nombre: 'Ceibos Club',        color_primario: '#2E7D32', color_rgb: '46, 125, 50',  logo_url: 'https://oszvzrfijlfssdrsobpe.supabase.co/storage/v1/object/public/avatars/logos/ceibos.jpg' },
  { id: 'demo-oldboys',   nombre: 'Old Boys',           color_primario: '#C62828', color_rgb: '198, 40, 40',  logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Old_Boys_Club_Crest.svg/250px-Old_Boys_Club_Crest.svg.png' },
  { id: 'demo-seminario', nombre: 'Club Seminario',     color_primario: '#7B1828', color_rgb: '123, 24, 40',  logo_url: 'https://clubseminario.com.uy/images/escudo/logo-cs.png' },
]

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>('loading')
  const [clubs, setClubs] = useState<Club[]>([])
  const [selectedClub, setSelectedClub] = useState<ClubStored | null>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: admin } = await supabase.from('admins').select('id').eq('id', user.id).single()
        window.location.href = admin ? '/admin' : '/home'
        return
      }
      const { data } = await supabase.from('clubes').select('id, nombre, color_primario, color_rgb, logo_url').order('nombre')
      const lista: Club[] = data ?? []
      // Agrega demos que no estén ya en Supabase (por nombre)
      const extras = DEMO_CLUBS.filter(d => !lista.some(l => l.nombre === d.nombre))
      // Clubs reales primero, demos ordenados alfabéticamente después
      const todos = [...lista, ...extras.sort((a, b) => a.nombre.localeCompare(b.nombre))]
      setClubs(todos)
      setStep(todos.length === 0 ? 'roles' : 'clubs')
    }
    init()
  }, [])

  function handleSelectClub(c: Club, i: number) {
    const club: ClubStored = {
      id: c.id, nombre: c.nombre,
      iniciales: getIniciales(c.nombre),
      gradiente: getClubGradient(i),
      color_primario: c.color_primario ?? GOLD,
      color_rgb: c.color_rgb ?? '200, 148, 10',
      logo_url: c.logo_url,
    }
    setSelectedClub(club)
    setStoredClub(club)
    document.documentElement.style.setProperty('--club-primary', club.color_primario)
    document.documentElement.style.setProperty('--club-primary-rgb', club.color_rgb)
  }

  function handleContinue() {
    if (!selectedClub) return
    setStep('roles')
  }

  function handleRole(rol: 'socio' | 'admin') {
    router.push(`/login?rol=${rol}`)
  }

  if (step === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div className="w-7 h-7 rounded-full border-2 animate-spin"
          style={{ borderColor: `${GOLD}60`, borderTopColor: GOLD }} />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: BG }}>

      {/* ── Header ── */}
      <div className="relative px-6 pt-14 pb-10 flex flex-col items-center">

        {/* Separador dorado inferior */}
        <div className="pointer-events-none absolute bottom-0 left-8 right-8 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}60, transparent)` }} />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-center gap-3"
        >
          <h1 className="text-white font-serif text-6xl font-bold tracking-tight leading-none">DelClub</h1>

          <div className="flex items-center gap-2.5">
            <div className="h-px w-10" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}80)` }} />
            <p className="text-[9px] tracking-[5px] uppercase font-semibold" style={{ color: `${GOLD}99` }}>
              Tu club, en tu bolsillo
            </p>
            <div className="h-px w-10" style={{ background: `linear-gradient(270deg, transparent, ${GOLD}80)` }} />
          </div>
        </motion.div>
      </div>

      {/* ── Content (azul, seamless) ── */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">

          {/* STEP 1: Seleccionar club */}
          {step === 'clubs' && (
            <motion.div
              key="clubs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease }}
              className="flex-1 flex flex-col px-6 pt-8 pb-10"
            >
              <div className="mb-6 text-center">
                <p className="text-xs font-bold uppercase tracking-[3px] mb-2" style={{ color: GOLD }}>Paso 1 de 2</p>
                <h2 className="font-sans text-3xl font-bold leading-tight text-white">
                  ¿A qué club pertenecés?
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {clubs.map((c, i) => {
                  const iniciales = getIniciales(c.nombre)
                  const isSelected = selectedClub?.id === c.id
                  return (
                    <motion.button
                      key={c.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08, ease }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleSelectClub(c, i)}
                      className="w-full text-left relative overflow-hidden"
                      style={{
                        background: isSelected
                          ? 'rgba(200, 148, 10, 0.10)'
                          : 'rgba(255, 255, 255, 0.07)',
                        borderRadius: 20,
                        border: `1.5px solid ${isSelected ? GOLD : 'rgba(255,255,255,0.12)'}`,
                        boxShadow: isSelected
                          ? `0 0 0 3px ${GOLD}22, 0 8px 24px rgba(0,0,0,0.25)`
                          : '0 2px 12px rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(8px)',
                        transition: 'box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease',
                      }}
                    >
                      {/* Banda lateral izquierda */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[20px]"
                        style={{
                          background: isSelected ? GOLD : 'rgba(255,255,255,0.08)',
                          transition: 'background 0.2s ease'
                        }} />

                      <div className="flex items-center gap-3 px-4 py-3.5 pl-5">
                        {/* Logo circular */}
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                            style={{
                              background: c.logo_url ? '#fff' : (isSelected ? `${GOLD}22` : 'rgba(255,255,255,0.10)'),
                              border: `2px solid ${isSelected ? GOLD : 'rgba(255,255,255,0.15)'}`,
                              boxShadow: isSelected ? `0 0 0 3px ${GOLD}18` : 'none',
                              transition: 'all 0.2s ease',
                            }}>
                            {c.logo_url
                              ? <img src={c.logo_url} alt={c.nombre} className="w-full h-full object-contain p-1.5" style={{ mixBlendMode: 'multiply' }} />
                              : <span className="font-sans text-lg font-black text-white">{iniciales}</span>
                            }
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: GOLD, border: '2px solid #0f1d4e' }}
                            >
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </motion.div>
                          )}
                        </div>

                        {/* Texto */}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base leading-tight text-white">
                            {c.nombre}
                          </div>
                          <div className="text-xs mt-1 font-medium"
                            style={{ color: isSelected ? GOLD : 'rgba(255,255,255,0.40)' }}>
                            {isSelected ? 'Club seleccionado' : 'Toca para seleccionar'}
                          </div>
                        </div>

                        {/* Chevron */}
                        <motion.div
                          animate={{ x: isSelected ? 2 : 0, opacity: isSelected ? 0 : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              <AnimatePresence>
                {selectedClub && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    className="mt-6"
                  >
                    <button
                      onClick={handleContinue}
                      className="w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase transition-opacity active:opacity-80"
                      style={{ background: GOLD, color: '#0f1d4e' }}
                    >
                      Continuar →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 2: Rol */}
          {step === 'roles' && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease }}
              className="flex-1 flex flex-col px-6 pt-8 pb-10"
            >
              <button
                onClick={() => setStep('clubs')}
                className="inline-flex items-center gap-2 mb-6 self-start px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(255,255,255,0.12)'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                {selectedClub?.nombre ?? 'Volver'}
              </button>

              <div className="mb-8 text-center">
                <p className="text-xs font-bold uppercase tracking-[3px] mb-2" style={{ color: GOLD }}>Paso 2 de 2</p>
                <h2 className="font-sans text-3xl font-bold leading-tight text-white whitespace-nowrap">
                  ¿Cómo querés ingresar?
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    rol: 'socio' as const,
                    label: 'Socio',
                    desc: 'Reservas, cuotas\ny novedades',
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    ),
                  },
                  {
                    rol: 'admin' as const,
                    label: 'Admin',
                    desc: 'Gestión del club\ny sus miembros',
                    icon: (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round">
                        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" />
                        <polyline points="9 12 11 14 15 10" />
                      </svg>
                    ),
                  },
                ].map(({ rol, label, desc, icon }, i) => (
                  <motion.button
                    key={rol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, ease }}
                    onClick={() => handleRole(rol)}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-2xl p-6 flex flex-col items-center gap-4 text-center"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: '1.5px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: `${GOLD}18` }}>
                      {icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm tracking-wider uppercase text-white">{label}</div>
                      <div className="text-[11px] mt-1.5 leading-relaxed whitespace-pre-line"
                        style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <p className="text-center text-[9px] tracking-widest pb-6" style={{ color: 'rgba(255,255,255,0.20)' }}>
        Powered by <span style={{ color: `${GOLD}80` }}>DelClub</span>
      </p>
    </main>
  )
}
