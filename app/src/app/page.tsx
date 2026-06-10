'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import GrainOverlay from '@/components/GrainOverlay'
import TextReveal from '@/components/TextReveal'
import ShiftCard from '@/components/ShiftCard'

export default function LandingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setVerificando(false); return }
      const { data: adminData } = await supabase.from('admins').select('id').eq('id', user.id).single()
      window.location.href = adminData ? '/admin' : '/home'
    }
    checkSession()
  }, [])

  if (verificando) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-6 border-2 border-[#B8975A] border-t-transparent rounded-full animate-spin"
        />
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-between px-6 py-14 overflow-hidden">

      {/* Radial glow background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(184,151,90,0.18) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(184,151,90,0.12) 0%, transparent 70%)' }}
        />
      </div>

      {/* Grain texture */}
      <GrainOverlay opacity={0.055} />

      {/* Horizontal lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.04]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="absolute w-full h-px bg-white" style={{ top: `${(i + 1) * 8}%` }} />
        ))}
      </div>

      {/* Logo + tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center mt-8"
      >
        {/* Shield with animated ring */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-14px] rounded-full border border-dashed opacity-20"
            style={{ borderColor: '#B8975A' }}
          />
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="56" height="64" viewBox="0 0 76 88" fill="none">
              <path d="M38 2L72 14V48C72 66 38 86 38 86C38 86 4 66 4 48V14L38 2Z"
                fill="url(#lg1)" stroke="rgba(184,151,90,0.3)" strokeWidth="1" />
              <path d="M38 10L64 20V48C64 63 38 78 38 78C38 78 12 63 12 48V20L38 10Z"
                fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <defs>
                <linearGradient id="lg1" x1="4" y1="2" x2="72" y2="86" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#C9A86C" />
                  <stop offset="100%" stopColor="#8B6A32" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, letterSpacing: '0.4em' }}
          animate={{ opacity: 1, letterSpacing: '0.05em' }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-white font-serif text-3xl font-semibold mt-5"
          style={{ background: 'linear-gradient(135deg, #C9A86C 0%, #fff 50%, #C9A86C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          SoySocio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-[#444] text-[10px] tracking-[4px] uppercase mt-2"
        >
          Tu club, en tu bolsillo
        </motion.p>
      </motion.div>

      {/* Selector */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-7">
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-[#555] text-[10px] uppercase tracking-[4px] mb-3"
          >
            Bienvenido
          </motion.p>
          <div className="text-white font-serif text-3xl font-semibold leading-tight">
            <TextReveal text="¿Quién sos en" delay={1.0} stagger={0.1} by="word" />
            <br />
            <TextReveal text="el club?" delay={1.3} stagger={0.1} by="word" />
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(184,151,90,0.4), transparent)' }}
        />

        <div className="grid grid-cols-2 gap-4 w-full">
          {[
            {
              rol: 'socio',
              label: 'Socio',
              desc: 'Reservas, cuotas\ny novedades',
              icon: (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              ),
              delay: 1.6,
            },
            {
              rol: 'admin',
              label: 'Admin',
              desc: 'Gestión del club\ny sus miembros',
              icon: (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7l-9-5z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              ),
              delay: 1.75,
            },
          ].map(({ rol, label, desc, icon, delay }) => (
            <motion.div
              key={rol}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            >
              <ShiftCard
                onClick={() => router.push(`/login?rol=${rol}`)}
                className="flex flex-col items-center gap-4 rounded-2xl px-4 py-8 cursor-pointer"
                intensity={6}
              >
                <div
                  className="relative flex flex-col items-center gap-4 w-full h-full rounded-2xl px-4 py-8"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(184,151,90,0.2)',
                  }}
                >
                  <GrainOverlay opacity={0.06} />
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                    style={{ background: 'radial-gradient(circle at 30% 30%, rgba(184,151,90,0.2), rgba(184,151,90,0.05))', border: '1px solid rgba(184,151,90,0.25)' }}>
                    {icon}
                    <motion.div
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: 'radial-gradient(circle at 50% 30%, rgba(184,151,90,0.15), transparent)' }}
                    />
                  </div>
                  <div className="text-center z-10">
                    <div className="text-white text-sm font-bold tracking-[3px] uppercase">{label}</div>
                    <div className="text-[#555] text-[11px] mt-2 leading-relaxed whitespace-pre-line">{desc}</div>
                  </div>
                </div>
              </ShiftCard>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="relative z-10 text-[#222] text-[10px] tracking-widest"
      >
        Powered by <span style={{ color: 'rgba(184,151,90,0.5)' }}>SoySocio</span>
      </motion.p>

    </main>
  )
}
