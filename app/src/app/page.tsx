'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import GrainOverlay from '@/components/GrainOverlay'
import AnimatedMesh from '@/components/AnimatedMesh'
import ShiftCard from '@/components/ShiftCard'
import PremiumButton from '@/components/PremiumButton'
import { setStoredClub, getIniciales, getClubGradient, type ClubStored } from '@/lib/club-storage'

type Club = { id: string; nombre: string }
type Step = 'loading' | 'clubs' | 'roles'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>('loading')
  const [clubs, setClubs] = useState<Club[]>([])
  const [selectedClub, setSelectedClub] = useState<ClubStored | null>(null)

  useEffect(() => {
    async function init() {
      // Check existing session
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: admin } = await supabase.from('admins').select('id').eq('id', user.id).single()
        window.location.href = admin ? '/admin' : '/home'
        return
      }

      // Load clubs
      const { data } = await supabase.from('clubes').select('id, nombre').order('nombre')
      const lista: Club[] = data ?? []
      setClubs(lista)

      if (lista.length === 0) {
        setStep('roles')
        return
      }

      // Always show club selector — even with 1 club, confirm which club the user is entering
      setStep('clubs')
    }
    init()
  }, [])

  function handleSelectClub(c: Club, i: number) {
    const club: ClubStored = {
      id: c.id, nombre: c.nombre,
      iniciales: getIniciales(c.nombre),
      gradiente: getClubGradient(i),
    }
    setSelectedClub(club)
    setStoredClub(club)
  }

  function handleContinue() {
    if (!selectedClub) return
    setStep('roles')
  }

  function handleRole(rol: 'socio' | 'admin') {
    router.push(`/login?rol=${rol}`)
  }

  /* ── Loading ── */
  if (step === 'loading') {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-7 h-7 rounded-full border-2 border-[#B8975A] border-t-transparent"
        />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-[#0A0A0A] flex flex-col overflow-hidden">
      <GrainOverlay opacity={0.055} />
      <AnimatedMesh />

      {/* Radial ambient */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-[-15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(184,151,90,0.22) 0%, transparent 65%)' }}
      />

      {/* ── Logo header (always visible) ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="relative z-10 flex flex-col items-center pt-14 pb-4"
      >
        <div className="relative mb-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-16px] rounded-full border border-dashed opacity-[0.18]"
            style={{ borderColor: '#B8975A' }}
          />
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3.5, repeat: Infinity }}>
            <svg width="52" height="60" viewBox="0 0 76 88" fill="none">
              <path d="M38 2L72 14V48C72 66 38 86 38 86C38 86 4 66 4 48V14L38 2Z" fill="url(#lsg)" stroke="rgba(184,151,90,0.3)" strokeWidth="1" />
              <path d="M38 10L64 20V48C64 63 38 78 38 78C38 78 12 63 12 48V20L38 10Z" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <defs>
                <linearGradient id="lsg" x1="4" y1="2" x2="72" y2="86" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#C9A86C" /><stop offset="100%" stopColor="#8B6A32" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>
        <h1 className="font-serif text-2xl font-semibold"
          style={{ background: 'linear-gradient(135deg, #C9A86C 0%, #fff 50%, #C9A86C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          SoySocio
        </h1>
        <p className="text-[#383838] text-[9px] tracking-[4px] uppercase mt-1">Tu club, en tu bolsillo</p>
      </motion.div>

      {/* ── Step content ── */}
      <div className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">

          {/* ── STEP: Club selector ── */}
          {step === 'clubs' && (
            <motion.div
              key="clubs"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease }}
              className="flex-1 flex flex-col px-6 pt-4 pb-10"
            >
              <div className="mb-6">
                <p className="text-[#444] text-[10px] uppercase tracking-[4px] mb-2">Paso 1 de 2</p>
                <h2 className="text-white font-serif text-3xl font-semibold leading-tight">
                  ¿A qué club<br />pertenecés?
                </h2>
              </div>

              {/* Club cards */}
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {clubs.map((c, i) => {
                  const grad = getClubGradient(i)
                  const iniciales = getIniciales(c.nombre)
                  const isSelected = selectedClub?.id === c.id
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.09, ease }}
                    >
                      <ShiftCard
                        onClick={() => handleSelectClub(c, i)}
                        intensity={5}
                        className="w-full"
                      >
                        <div
                          className="relative overflow-hidden rounded-2xl flex items-center gap-4 p-4 transition-all duration-300"
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${grad[0]} 0%, ${grad[1]} 100%)`
                              : 'rgba(255,255,255,0.04)',
                            border: isSelected
                              ? `1px solid ${grad[2]}50`
                              : '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <GrainOverlay opacity={0.06} />

                          {/* Club emblem */}
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 font-serif text-xl font-bold relative z-10"
                            style={{
                              background: isSelected
                                ? `${grad[2]}30`
                                : 'rgba(184,151,90,0.08)',
                              color: isSelected ? '#fff' : '#555',
                              border: `1px solid ${isSelected ? grad[2] + '50' : 'rgba(255,255,255,0.08)'}`,
                            }}
                          >
                            {iniciales}
                          </div>

                          {/* Club info */}
                          <div className="flex-1 relative z-10 min-w-0">
                            <div className="text-white text-sm font-bold truncate">{c.nombre}</div>
                            <div className="text-[10px] mt-0.5" style={{ color: isSelected ? `${grad[2]}cc` : '#444' }}>
                              {isSelected ? '✓ Seleccionado' : 'Toca para seleccionar'}
                            </div>
                          </div>

                          {/* Check */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                              style={{ background: `${grad[2]}30`, border: `1px solid ${grad[2]}60` }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={grad[2]} strokeWidth="3" strokeLinecap="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                      </ShiftCard>
                    </motion.div>
                  )
                })}
              </div>

              {/* Continue button */}
              <AnimatePresence>
                {selectedClub && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-5"
                  >
                    <PremiumButton onClick={handleContinue} fullWidth size="lg">
                      Continuar con {selectedClub.nombre}
                    </PremiumButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── STEP: Role selector ── */}
          {step === 'roles' && (
            <motion.div
              key="roles"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease }}
              className="flex-1 flex flex-col px-6 pt-4 pb-10"
            >
              {/* Club badge */}
              {selectedClub && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 self-start"
                  style={{
                    background: `${selectedClub.gradiente[0]}60`,
                    border: `1px solid ${selectedClub.gradiente[2]}40`,
                  }}
                >
                  <span className="font-bold text-[10px] uppercase tracking-wider"
                    style={{ color: selectedClub.gradiente[2] }}>
                    {selectedClub.iniciales}
                  </span>
                  <span className="text-white/60 text-[10px]">{selectedClub.nombre}</span>
                  <button
                    onClick={() => { setSelectedClub(null); setStep('clubs') }}
                    className="text-white/30 hover:text-white/60 transition-colors ml-1"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </motion.div>
              )}

              <div className="mb-7">
                {clubs.length > 1 && (
                  <p className="text-[#444] text-[10px] uppercase tracking-[4px] mb-2">Paso 2 de 2</p>
                )}
                <h2 className="text-white font-serif text-3xl font-semibold leading-tight">
                  ¿Cómo querés<br />ingresar?
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    rol: 'socio' as const,
                    label: 'Socio',
                    desc: 'Reservas, cuotas\ny novedades',
                    icon: (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.5" strokeLinecap="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    ),
                    delay: 0.05,
                  },
                  {
                    rol: 'admin' as const,
                    label: 'Admin',
                    desc: 'Gestión del club\ny sus miembros',
                    icon: (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" />
                        <polyline points="9 12 11 14 15 10" />
                      </svg>
                    ),
                    delay: 0.14,
                  },
                ].map(({ rol, label, desc, icon, delay }) => (
                  <motion.div
                    key={rol}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay, ease }}
                  >
                    <ShiftCard onClick={() => handleRole(rol)} intensity={6} className="w-full">
                      <div
                        className="relative overflow-hidden rounded-2xl flex flex-col items-center gap-4 px-4 py-8"
                        style={{
                          background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                          border: '1px solid rgba(184,151,90,0.18)',
                        }}
                      >
                        <GrainOverlay opacity={0.065} />
                        <motion.div
                          animate={{ opacity: [0.4, 0.7, 0.4] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute inset-0 rounded-2xl"
                          style={{ background: 'radial-gradient(circle at 50% 20%, rgba(184,151,90,0.08), transparent 60%)' }}
                        />
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                          style={{ background: 'radial-gradient(circle at 35% 35%, rgba(184,151,90,0.18), rgba(184,151,90,0.05))', border: '1px solid rgba(184,151,90,0.22)' }}
                        >
                          {icon}
                        </div>
                        <div className="text-center relative z-10">
                          <div className="text-white text-sm font-bold tracking-[3px] uppercase">{label}</div>
                          <div className="text-[#555] text-[11px] mt-1.5 leading-relaxed whitespace-pre-line">{desc}</div>
                        </div>
                      </div>
                    </ShiftCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="relative z-10 text-center text-[#1e1e1e] text-[9px] tracking-widest pb-6"
      >
        Powered by <span style={{ color: 'rgba(184,151,90,0.45)' }}>SoySocio</span>
      </motion.p>
    </main>
  )
}
