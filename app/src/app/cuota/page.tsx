'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import NavBar from '@/components/NavBar'

type Socio = {
  id: string
  nombre: string
  apellido: string
  numero_socio: string
  categoria: string
  cuota_al_dia: boolean
}

type ModaloPago = 'transferencia' | 'debito'

const CUOTAS = [
  {
    tipo: 'Mayores +22',
    transferencia: 3490,
    debito: 2950,
    descripcion: 'Acceso completo al club y disciplinas deportivas',
    destacada: true,
  },
  {
    tipo: 'Cuota Familiar',
    transferencia: 6590,
    debito: 6100,
    descripcion: '2 adultos + 2 menores de 21 años',
    destacada: true,
  },
  {
    tipo: 'Juveniles -21',
    transferencia: 2890,
    debito: 2390,
    descripcion: 'Socios de 13 a 21 años',
    destacada: false,
  },
  {
    tipo: 'Infantiles -13',
    transferencia: 2190,
    debito: 1890,
    descripcion: 'Socios menores de 13 años',
    destacada: false,
  },
  {
    tipo: 'Fitness',
    transferencia: 2190,
    debito: 1890,
    descripcion: 'Gym, Yoga, Dance, Funcional y más',
    destacada: false,
  },
  {
    tipo: 'Cuota Amigo',
    transferencia: 890,
    debito: 790,
    descripcion: 'Solo actividades sociales, sin deporte',
    destacada: false,
    minor: true,
  },
]

const PRECIOS_MAP: Record<string, number> = {
  'Infantiles -13': 2190,
  'Juveniles -21': 2890,
  'Mayores +22': 3490,
  'Cuota Familiar': 6590,
  'Fitness': 2190,
  'Cuota Amigo': 890,
}

const PRECIOS_MAP_DEBITO: Record<string, number> = {
  'Infantiles -13': 1890,
  'Juveniles -21': 2390,
  'Mayores +22': 2950,
  'Cuota Familiar': 6100,
  'Fitness': 1890,
  'Cuota Amigo': 790,
}

function formatPrecio(n: number): string {
  return n.toLocaleString('es-UY')
}

function getPrecio(categoria: string, modo: ModaloPago): number {
  const map = modo === 'transferencia' ? PRECIOS_MAP : PRECIOS_MAP_DEBITO
  return map[categoria] ?? 3490
}

export default function CuotaPage() {
  const [socio, setSocio] = useState<Socio | null>(null)
  const [loading, setLoading] = useState(true)
  const [modo, setModo] = useState<ModaloPago>('transferencia')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('socios')
        .select('id, nombre, apellido, numero_socio, categoria, cuota_al_dia')
        .eq('id', user.id)
        .single()
      setSocio(data)
      setLoading(false)
    }
    cargar()
  }, [])

  if (loading) return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[var(--club-primary)] border-t-transparent rounded-full animate-spin" />
    </main>
  )

  const categoria = socio?.categoria ?? 'Mayores +22'
  const precioSocio = getPrecio(categoria, modo)
  const precioSocioAlt = getPrecio(categoria, modo === 'transferencia' ? 'debito' : 'transferencia')
  const ahorro = PRECIOS_MAP[categoria] - PRECIOS_MAP_DEBITO[categoria] || 0

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col pb-32">
      {/* ── Header ── */}
      <div className="px-5 pt-20 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-full active:opacity-60 transition-opacity"
          style={{ background: 'rgba(255,255,255,0.06)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Cuotas Sociales
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.30)', marginTop: '2px' }}>
            Temporada 2025
          </p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">

        {/* ── Estado personal ── */}
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ height: '2px', background: socio?.cuota_al_dia ? 'var(--club-primary)' : '#e53e3e' }} />
          <div className="p-4 flex items-center justify-between">
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '6px' }}>
                {categoria}
              </p>
              <div className="flex items-baseline gap-1">
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.28)', fontWeight: 500 }}>$U</span>
                <AnimatePresence mode="wait">
                  <motion.span key={`${modo}-${precioSocio}`}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{ fontFamily: 'var(--font-body)', fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {formatPrecio(precioSocio)}
                  </motion.span>
                </AnimatePresence>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.20)' }}>/ mes</span>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${socio?.cuota_al_dia ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}
              style={{ fontFamily: 'var(--font-body)', fontSize: '11px' }}>
              <span className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}
            </div>
          </div>
        </div>

        {/* ── Alerta fecha de pago ── */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(240,180,41,0.08)', border: '1px solid rgba(240,180,41,0.18)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f0b429" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(240,180,41,0.85)', lineHeight: 1.4 }}>
            Pagá entre el <strong>1º y el 10</strong> de cada mes para evitar el recargo del <strong>10%</strong>
          </p>
        </div>

        {/* ── Toggle Transferencia / Débito ── */}
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '10px' }}>
            Modalidad de pago
          </p>
          <div className="flex rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {(['transferencia', 'debito'] as ModaloPago[]).map((m) => (
              <button key={m} onClick={() => setModo(m)}
                className="flex-1 relative py-2.5 rounded-lg transition-all active:opacity-80"
                style={{ zIndex: 1 }}>
                {modo === m && (
                  <motion.div layoutId="modo-pill"
                    style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.10)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                )}
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600,
                  color: modo === m ? '#fff' : 'rgba(255,255,255,0.35)',
                  position: 'relative', zIndex: 2,
                }}>
                  {m === 'transferencia' ? 'Transferencia' : 'Débito automático'}
                </span>
                {m === 'debito' && (
                  <span style={{
                    display: 'block', position: 'relative', zIndex: 2,
                    fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700,
                    color: modo === 'debito' ? '#4ade80' : 'rgba(74,222,128,0.45)',
                    letterSpacing: '0.05em',
                  }}>
                    más barato
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Cards de cuotas ── */}
        <div className="flex flex-col gap-2">
          {CUOTAS.map((c) => {
            const precio = modo === 'transferencia' ? c.transferencia : c.debito
            const diferencia = c.transferencia - c.debito
            const esMiCuota = c.tipo === categoria
            return (
              <motion.div key={c.tipo}
                layout
                style={{
                  background: esMiCuota
                    ? `rgba(var(--club-primary-rgb),0.12)`
                    : c.destacada
                      ? 'rgba(255,255,255,0.055)'
                      : 'rgba(255,255,255,0.03)',
                  border: esMiCuota
                    ? '1px solid rgba(var(--club-primary-rgb),0.35)'
                    : c.destacada
                      ? '1px solid rgba(255,255,255,0.07)'
                      : '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '14px',
                  padding: c.minor ? '12px 16px' : '14px 16px',
                  opacity: c.minor ? 0.75 : 1,
                }}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: c.minor ? '12px' : '14px',
                        fontWeight: 700,
                        color: esMiCuota ? 'var(--club-primary)' : '#fff',
                      }}>
                        {c.tipo}
                      </span>
                      {esMiCuota && (
                        <span style={{
                          fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700,
                          color: 'var(--club-primary)', letterSpacing: '0.08em',
                          background: 'rgba(var(--club-primary-rgb),0.15)',
                          padding: '1px 6px', borderRadius: '99px',
                        }}>
                          TU CUOTA
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                      {c.descripcion}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-3">
                    <AnimatePresence mode="wait">
                      <motion.span key={`${c.tipo}-${modo}`}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: c.minor ? '16px' : '20px',
                          fontWeight: 700,
                          color: esMiCuota ? 'var(--club-primary)' : '#fff',
                          letterSpacing: '-0.02em',
                          lineHeight: 1,
                        }}>
                        ${formatPrecio(precio)}
                      </motion.span>
                    </AnimatePresence>
                    {modo === 'debito' && diferencia > 0 && (
                      <span style={{
                        fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
                        color: '#4ade80',
                      }}>
                        −${diferencia}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ── Beneficio Itaú ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#0f1c33' }}>
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #C8940A, #f0b429)' }} />
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 800, color: '#f0b429', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  5% OFF
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.70)', marginTop: '4px' }}>
                  en tu cuota mensual
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>itaú</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>Sponsor oficial</div>
              </div>
            </div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '14px' }} />
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: '8px' }}>
              Tarjetas habilitadas
            </div>
            <div className="flex flex-col gap-2">
              {['Débito automático Itaú', 'Visa Platinum Itaú', 'Visa Infinite Itaú', 'Mastercard Black Itaú'].map(t => (
                <div key={t} className="flex items-center gap-2.5">
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#f0b429', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>{t}</span>
                </div>
              ))}
            </div>
            <div className="mt-4" style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.22)', lineHeight: 1.5 }}>
              El descuento se aplica automáticamente al pagar con cualquiera de estas tarjetas en débito automático.
            </div>
          </div>
        </div>

        {/* ── Condiciones ── */}
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '12px' }}>
            Condiciones
          </p>
          <div className="flex flex-col gap-3">
            {[
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                ),
                texto: 'Los pagos por transferencia deben realizarse entre el 1º y el 10º de cada mes. Pasada esa fecha se aplica un recargo del 10%.',
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                texto: 'Cuota Familiar: 2 adultos y 2 menores de 21 años. Un tercer o cuarto menor abona el 50% de la cuota. Todos los integrantes deben estar registrados en el sistema.',
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                  </svg>
                ),
                texto: 'Cuota Fitness: incluye todas las actividades del gimnasio o SUM — Yoga, Dance, Funcional, Gym, y más.',
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
                  </svg>
                ),
                texto: 'Cuota Amigo: participan solamente de las actividades sociales, sin actividad deportiva.',
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                ),
                texto: 'La cuota se abona durante los 12 meses del año, independientemente del uso de las instalaciones.',
              },
              {
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                  </svg>
                ),
                texto: 'Baja: el socio que no siga viniendo debe solicitar y completar el formulario de baja en secretaría.',
              },
            ].map(({ icon, texto }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div style={{ color: 'rgba(255,255,255,0.30)', marginTop: '1px', flexShrink: 0 }}>
                  {icon}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                  {texto}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <NavBar />
    </main>
  )
}
