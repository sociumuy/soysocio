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

type Club = { id: string; nombre: string; color_primario?: string; color_rgb?: string; logo_url?: string | null }
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
      const { data } = await supabase.from('clubes').select('id, nombre, color_primario, color_rgb, logo_url').order('nombre')
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
      color_primario: c.color_primario ?? '#B8975A',
      color_rgb: c.color_rgb ?? '184, 151, 90',
      logo_url: c.logo_url,
    }
    setSelectedClub(club)
    setStoredClub(club)
    // Apply immediately so the rest of the landing reflects the club color
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

  /* ── Loading ── */
  if (step === 'loading') {
    return (
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-7 h-7 rounded-full border-2 border-[var(--club-primary)] border-t-transparent"
        />
      </main>
    )
  }

  const bgColor = selectedClub?.color_primario === '#C8940A' || !selectedClub
    ? '#0B1628'
    : '#0A0A0A'

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: bgColor }}>
      <GrainOverlay opacity={0.04} />

      {/* Diagonal stripe texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

      {/* Navy glow top */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-96 opacity-40"
        style={{ background: 'radial-gradient(ellipse at 50% -20%, #1B2D6E 0%, transparent 70%)' }} />

      {/* Gold glow bottom */}
      <motion.div
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 opacity-20"
        style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(var(--club-primary-rgb),0.6) 0%, transparent 70%)' }}
      />

      {/* ── Logo header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 flex flex-col items-center pt-16 pb-2"
      >
        <motion.img
          src="/lobos-logo.png"
          alt="Lobos Rugby Club"
          className="w-24 h-24 object-contain mb-4"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <h1 className="font-serif text-3xl font-bold text-white tracking-tight">Lobos Rugby Club</h1>
        <p className="text-white/30 text-[10px] tracking-[4px] uppercase mt-1">Punta del Este · Uruguay</p>
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
                            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10 overflow-hidden"
                            style={{
                              background: isSelected ? `${grad[0]}80` : 'rgba(255,255,255,0.06)',
                              border: `1px solid ${isSelected ? grad[2] + '50' : 'rgba(255,255,255,0.1)'}`,
                            }}
                          >
                            {c.logo_url
                              ? <img src={c.logo_url} alt={c.nombre} className="w-full h-full object-contain p-1.5" />
                              : <span className="font-serif text-xl font-bold" style={{ color: isSelected ? '#fff' : '#555' }}>{iniciales}</span>
                            }
                          </div>

                          {/* Club info */}
                          <div className="flex-1 relative z-10 min-w-0">
                            <div className="text-white text-base font-bold truncate">{c.nombre}</div>
                            <div className="text-[11px] mt-0.5" style={{ color: isSelected ? `${grad[2]}cc` : '#444' }}>
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
                    <button
                      onClick={handleContinue}
                      className="w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase transition-opacity active:opacity-80"
                      style={{ background: 'var(--club-primary)', color: '#0D0D0D' }}
                    >
                      Ingresar a {selectedClub.nombre} →
                    </button>
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
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--club-primary)" strokeWidth="1.5" strokeLinecap="round">
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
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--club-primary)" strokeWidth="1.5" strokeLinecap="round">
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
                          border: '1px solid rgba(var(--club-primary-rgb),0.18)',
                        }}
                      >
                        <GrainOverlay opacity={0.065} />
                        <motion.div
                          animate={{ opacity: [0.4, 0.7, 0.4] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute inset-0 rounded-2xl"
                          style={{ background: 'radial-gradient(circle at 50% 20%, rgba(var(--club-primary-rgb),0.08), transparent 60%)' }}
                        />
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                          style={{ background: 'radial-gradient(circle at 35% 35%, rgba(var(--club-primary-rgb),0.18), rgba(var(--club-primary-rgb),0.05))', border: '1px solid rgba(var(--club-primary-rgb),0.22)' }}
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
        className="relative z-10 text-center text-white/10 text-[9px] tracking-widest pb-6"
      >
        Powered by <span style={{ color: 'rgba(var(--club-primary-rgb),0.5)' }}>DelClub</span>
      </motion.p>
    </main>
  )
}
