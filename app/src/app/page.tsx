'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { setStoredClub, getIniciales, getClubGradient, type ClubStored } from '@/lib/club-storage'

type Club = { id: string; nombre: string; color_primario?: string; color_rgb?: string; logo_url?: string | null }
type Step = 'loading' | 'clubs' | 'roles'

const NAVY = '#1B2D6E'
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

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
      setClubs(lista)
      setStep(lista.length === 0 ? 'roles' : 'clubs')
    }
    init()
  }, [])

  function handleSelectClub(c: Club, i: number) {
    const club: ClubStored = {
      id: c.id, nombre: c.nombre,
      iniciales: getIniciales(c.nombre),
      gradiente: getClubGradient(i),
      color_primario: c.color_primario ?? '#C8940A',
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
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: NAVY, borderTopColor: 'transparent' }} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* ── Navy header ── */}
      <div className="relative overflow-hidden px-6 pt-14 pb-12 flex flex-col items-center"
        style={{ background: NAVY }}>
        {/* Diagonal stripes */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '18px 18px' }} />
        {/* Bottom glow */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-32 opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(200,148,10,0.8) 0%, transparent 70%)' }} />

        {/* Logo placeholder */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="relative z-10 flex flex-col items-center"
        >
          {/* Logo placeholder — reemplazar con logo real */}
          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(200,148,10,0.9)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" />
            </svg>
          </div>
          <h1 className="text-white font-serif text-4xl font-bold tracking-tight">DelClub</h1>
          <p className="text-white/40 text-[10px] tracking-[5px] uppercase mt-1.5">Tu club, en tu bolsillo</p>
        </motion.div>
      </div>

      {/* ── Content (blanco) ── */}
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
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[3px] mb-2" style={{ color: NAVY }}>Paso 1 de 2</p>
                <h2 className="font-serif text-3xl font-bold leading-tight" style={{ color: NAVY }}>
                  ¿A qué club<br />pertenecés?
                </h2>
              </div>

              <div className="flex flex-col gap-3 flex-1">
                {clubs.map((c, i) => {
                  const iniciales = getIniciales(c.nombre)
                  const isSelected = selectedClub?.id === c.id
                  return (
                    <motion.button
                      key={c.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.08, ease }}
                      onClick={() => handleSelectClub(c, i)}
                      className="w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-all"
                      style={{
                        background: isSelected ? NAVY : '#F7F8FC',
                        border: `2px solid ${isSelected ? NAVY : '#E8EAF0'}`,
                      }}
                    >
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                        style={{ background: isSelected ? 'rgba(255,255,255,0.12)' : '#fff', border: `1px solid ${isSelected ? 'rgba(255,255,255,0.2)' : '#E8EAF0'}` }}>
                        {c.logo_url
                          ? <img src={c.logo_url} alt={c.nombre} className="w-full h-full object-contain p-1.5" />
                          : <span className="font-serif text-lg font-bold" style={{ color: isSelected ? '#fff' : NAVY }}>{iniciales}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-base font-bold truncate ${isSelected ? 'text-white' : ''}`} style={{ color: isSelected ? '#fff' : NAVY }}>
                          {c.nombre}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: isSelected ? 'rgba(255,255,255,0.5)' : '#9CA3AF' }}>
                          {isSelected ? '✓ Seleccionado' : 'Toca para seleccionar'}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
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
                      className="w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase text-white transition-opacity active:opacity-80"
                      style={{ background: NAVY }}
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
              {selectedClub && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setStep('clubs')}
                  className="inline-flex items-center gap-2 mb-6 self-start px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: '#F0F2F8', color: NAVY }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  {selectedClub.nombre}
                </motion.button>
              )}

              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[3px] mb-2" style={{ color: NAVY }}>Paso 2 de 2</p>
                <h2 className="font-serif text-3xl font-bold leading-tight" style={{ color: NAVY }}>
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
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round">
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
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round">
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
                    className="rounded-2xl p-6 flex flex-col items-center gap-4 text-center transition-all"
                    style={{ background: '#F7F8FC', border: `2px solid #E8EAF0` }}
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: '#EEF1FA' }}>
                      {icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm tracking-wider uppercase" style={{ color: NAVY }}>{label}</div>
                      <div className="text-[11px] mt-1.5 leading-relaxed text-gray-400 whitespace-pre-line">{desc}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <p className="text-center text-gray-300 text-[9px] tracking-widest pb-6">
        Powered by <span style={{ color: NAVY }}>DelClub</span>
      </p>
    </main>
  )
}
