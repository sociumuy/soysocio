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
              <div className="mb-6 text-center">
                <p className="text-xs font-bold uppercase tracking-[3px] mb-2" style={{ color: NAVY }}>Paso 1 de 2</p>
                <h2 className="font-sans text-3xl font-bold leading-tight" style={{ color: NAVY }}>
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
                        background: '#fff',
                        borderRadius: 20,
                        border: `1.5px solid ${isSelected ? NAVY : '#E4E8F0'}`,
                        boxShadow: isSelected
                          ? `0 0 0 3px ${NAVY}22, 0 8px 24px rgba(27,45,110,0.13)`
                          : '0 2px 12px rgba(0,0,0,0.06)',
                        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                      }}
                    >
                      {/* Banda lateral izquierda */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[20px]"
                        style={{ background: isSelected ? NAVY : '#E4E8F0', transition: 'background 0.2s ease' }} />

                      <div className="flex items-center gap-3 px-4 py-3.5 pl-5">
                        {/* Logo circular premium */}
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                            style={{
                              background: '#F0F3FA',
                              border: `2px solid ${isSelected ? NAVY : '#E4E8F0'}`,
                              boxShadow: isSelected ? `0 0 0 3px ${NAVY}18` : 'none',
                              transition: 'all 0.2s ease',
                            }}>
                            {c.logo_url
                              ? <img src={c.logo_url} alt={c.nombre} className="w-full h-full object-contain p-2" />
                              : <span className="font-sans text-lg font-black" style={{ color: NAVY }}>{iniciales}</span>
                            }
                          </div>
                          {/* Indicador seleccionado sobre el logo */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: NAVY, border: '2px solid #fff' }}
                            >
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </motion.div>
                          )}
                        </div>

                        {/* Texto */}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base leading-tight" style={{ color: NAVY }}>
                            {c.nombre}
                          </div>
                          <div className="text-xs mt-1 font-medium" style={{ color: isSelected ? NAVY : '#9CA3AF', opacity: isSelected ? 0.6 : 1 }}>
                            {isSelected ? 'Club seleccionado' : 'Toca para seleccionar'}
                          </div>
                        </div>

                        {/* Chevron */}
                        <motion.div
                          animate={{ x: isSelected ? 2 : 0, opacity: isSelected ? 0 : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8D0E0" strokeWidth="2.5" strokeLinecap="round">
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
