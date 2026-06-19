'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import NavBar from '@/components/NavBar'

// ── Tipos MP SDK ─────────────────────────────────────────────────────────────
declare global {
  interface Window {
    MercadoPago: new (key: string, opts?: { locale: string }) => MpInstance
  }
}
interface MpInstance {
  cardForm: (config: MpCardFormConfig) => MpCardForm
}
interface MpCardForm {
  getCardFormData: () => { token: string; installments: string; paymentMethodId: string; issuerId: string }
  unmount: () => void
}
interface MpCardFormConfig {
  amount: string
  iframe: boolean
  form: {
    id: string
    cardNumber:           { id: string; placeholder?: string }
    expirationDate:       { id: string; placeholder?: string }
    securityCode:         { id: string; placeholder?: string }
    cardholderName:       { id: string; placeholder?: string }
    issuer:               { id: string }
    installments:         { id: string }
    identificationType:   { id: string }
    identificationNumber: { id: string }
    cardholderEmail:      { id: string }
  }
  callbacks: {
    onFormMounted?: (err: unknown) => void
    onSubmit: (event: Event) => void
  }
}

function loadMpSdk(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if ((window as { MercadoPago?: unknown }).MercadoPago) return Promise.resolve()
  if (document.getElementById('mp-sdk')) {
    return new Promise(resolve => {
      const check = setInterval(() => {
        if ((window as { MercadoPago?: unknown }).MercadoPago) { clearInterval(check); resolve() }
      }, 50)
    })
  }
  return new Promise(resolve => {
    const s = document.createElement('script')
    s.id = 'mp-sdk'
    s.src = 'https://sdk.mercadopago.com/js/v2'
    s.onload = () => resolve()
    document.head.appendChild(s)
  })
}

// ── Formulario de pago MP ─────────────────────────────────────────────────────
function MpCardForm({
  amount,
  socioId,
  email,
  onSuccess,
  onCancel,
}: {
  amount: number
  socioId: string
  email: string
  onSuccess: () => void
  onCancel: () => void
}) {
  const cardFormRef = useRef<MpCardForm | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [mounted,   setMounted]   = useState(false)

  useEffect(() => {
    let active = true

    async function init() {
      await loadMpSdk()
      if (!active) return

      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!, { locale: 'es-UY' })

      cardFormRef.current = mp.cardForm({
        amount: String(amount),
        iframe: true,
        form: {
          id:                  'form-mp',
          cardNumber:          { id: 'mp-cardNumber',          placeholder: '0000 0000 0000 0000' },
          expirationDate:      { id: 'mp-expirationDate',      placeholder: 'MM/YY' },
          securityCode:        { id: 'mp-securityCode',        placeholder: 'CVV' },
          cardholderName:      { id: 'mp-cardholderName',      placeholder: 'Nombre como aparece en la tarjeta' },
          issuer:              { id: 'mp-issuer' },
          installments:        { id: 'mp-installments' },
          identificationType:  { id: 'mp-identificationType' },
          identificationNumber:{ id: 'mp-identificationNumber' },
          cardholderEmail:     { id: 'mp-cardholderEmail' },
        },
        callbacks: {
          onFormMounted: (err) => {
            if (err) { console.error('MP mount error:', err); return }
            if (active) setMounted(true)
          },
          onSubmit: async (event) => {
            event.preventDefault()
            if (!cardFormRef.current) return
            setLoading(true)
            setError(null)

            const { token, installments, paymentMethodId, issuerId } =
              cardFormRef.current.getCardFormData()

            try {
              const res  = await fetch('/api/mp/create-payment', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ socio_id: socioId, token, installments, payment_method_id: paymentMethodId, issuer_id: issuerId, email }),
              })
              const data = await res.json()
              if (!res.ok) throw new Error(data.error ?? 'Pago rechazado')
              if (data.status === 'approved') {
                onSuccess()
              } else {
                setError('Tu pago está siendo procesado. Te notificaremos cuando se confirme.')
                setLoading(false)
              }
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : 'Error inesperado')
              setLoading(false)
            }
          },
        },
      })
    }

    init()
    return () => {
      active = false
      try { cardFormRef.current?.unmount() } catch { /* ignore SDK cleanup errors */ }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.10)', borderRadius: '12px',
    padding: '12px 14px', color: '#fff', fontSize: '13px', fontFamily: 'var(--font-body)',
    outline: 'none',
  }
  const iframeBox: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '12px', height: '42px', overflow: 'hidden',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'var(--font-body)', fontSize: '9px',
    letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.28)', marginBottom: '6px',
  }
  const selectStyle: React.CSSProperties = {
    ...inputStyle, appearance: 'none',
    background: 'rgba(255,255,255,0.06)',
  }

  return (
    <form id="form-mp" className="flex flex-col gap-3">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: mounted ? 1 : 0.4, transition: 'opacity 0.3s' }}>

        <div>
          <label style={labelStyle}>Número de tarjeta</label>
          <div id="mp-cardNumber" style={iframeBox} />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label style={labelStyle}>Vencimiento</label>
            <div id="mp-expirationDate" style={iframeBox} />
          </div>
          <div className="flex-1">
            <label style={labelStyle}>CVV</label>
            <div id="mp-securityCode" style={iframeBox} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Titular</label>
          <input id="mp-cardholderName" type="text" style={inputStyle} />
        </div>

        <div className="flex gap-3">
          <div style={{ width: '110px', flexShrink: 0 }}>
            <label style={labelStyle}>Documento</label>
            <select id="mp-identificationType" style={selectStyle} />
          </div>
          <div className="flex-1">
            <label style={labelStyle}>Número</label>
            <input id="mp-identificationNumber" type="text" style={inputStyle} placeholder="12345678" />
          </div>
        </div>

        {/* Campos ocultos requeridos por MP SDK */}
        <select id="mp-installments" style={{ display: 'none' }} />
        <select id="mp-issuer" style={{ display: 'none' }} />
        <input id="mp-cardholderEmail" type="email" defaultValue={email} style={{ display: 'none' }} />

      </div>

      {error && (
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '12px', color: '#f87171',
          background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.18)',
          borderRadius: '10px', padding: '10px 14px',
        }}>
          {error}
        </p>
      )}

      <div className="flex gap-3 mt-1">
        <button type="button" onClick={onCancel}
          style={{
            flex: 1, padding: '12px', borderRadius: '12px',
            fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600,
            color: 'rgba(255,255,255,0.45)',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          }}>
          Cancelar
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            const form = document.getElementById('form-mp') as HTMLFormElement | null
            form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
          }}
          style={{
            flex: 2, padding: '12px', borderRadius: '12px',
            fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700,
            color: '#fff', background: loading ? 'rgba(200,148,10,0.5)' : '#C8940A',
            transition: 'background 0.2s',
          }}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Procesando...
            </span>
          ) : 'Confirmar pago'}
        </button>
      </div>
    </form>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

type Socio = {
  id: string
  nombre: string
  apellido: string
  numero_socio: string
  categoria: string
  cuota_al_dia: boolean
}

type ModaloPago = 'transferencia' | 'tarjeta'

const RECARGO_TARJETA = 0.05

const CUOTAS = [
  { tipo: 'Mayores +22',    base: 3490, descripcion: 'Acceso completo al club y disciplinas deportivas', destacada: true  },
  { tipo: 'Cuota Familiar', base: 6590, descripcion: '2 adultos + 2 menores de 21 años',                 destacada: true  },
  { tipo: 'Juveniles -21',  base: 2890, descripcion: 'Socios de 13 a 21 años',                           destacada: false },
  { tipo: 'Infantiles -13', base: 2190, descripcion: 'Socios menores de 13 años',                        destacada: false },
  { tipo: 'Fitness',        base: 2190, descripcion: 'Gym, Yoga, Dance, Funcional y más',                destacada: false },
  { tipo: 'Cuota Amigo',   base: 890,   descripcion: 'Solo actividades sociales, sin deporte',           destacada: false, minor: true },
]

const PRECIOS_MAP: Record<string, number> = {
  'Infantiles -13': 2190,
  'Juveniles -21':  2890,
  'Mayores +22':    3490,
  'Cuota Familiar': 6590,
  'Fitness':        2190,
  'Cuota Amigo':    890,
}

function formatPrecio(n: number): string {
  return n.toLocaleString('es-UY')
}

function getPrecio(categoria: string, modo: ModaloPago): number {
  const base = PRECIOS_MAP[categoria] ?? 3490
  return modo === 'tarjeta' ? Math.round(base * (1 + RECARGO_TARJETA)) : base
}

export default function CuotaPage() {
  const [socio,        setSocio]        = useState<Socio | null>(null)
  const [email,        setEmail]        = useState('')
  const [loading,      setLoading]      = useState(true)
  const [modo,         setModo]         = useState<ModaloPago>('tarjeta')
  const [showCardForm, setShowCardForm] = useState(false)
  const [pagoExito,    setPagoExito]    = useState(false)
  const router   = useRouter()
  const supabase = createClient()

  const handlePagoExitoso = useCallback(() => {
    setPagoExito(true)
    setShowCardForm(false)
    setSocio(prev => prev ? { ...prev, cuota_al_dia: true } : prev)
  }, [])

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      if (user.email) setEmail(user.email)
      const { data } = await supabase
        .from('socios')
        .select('id, nombre, apellido, numero_socio, categoria, cuota_al_dia')
        .eq('user_id', user.id)
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

  const categoria     = socio?.categoria ?? 'Mayores +22'
  const precioBase    = PRECIOS_MAP[categoria] ?? 3490
  const precioTarjeta = Math.round(precioBase * (1 + RECARGO_TARJETA))
  const precioSocio   = getPrecio(categoria, modo)
  const recargo       = precioTarjeta - precioBase

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
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}
              style={{ fontFamily: 'var(--font-body)', fontSize: '11px' }}>
              <span className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}
            </div>
          </div>
        </div>

        {/* ── Pago de cuota ── */}
        <AnimatePresence mode="wait">

          {/* Éxito */}
          {pagoExito && (
            <motion.div key="exito"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.20)', borderRadius: '16px', padding: '20px' }}
              className="flex items-center gap-4">
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(74,222,128,0.14)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700, color: '#4ade80' }}>¡Pago confirmado!</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Tu cuota quedó registrada al día.</p>
              </div>
            </motion.div>
          )}

          {/* Formulario de tarjeta MP */}
          {showCardForm && !pagoExito && (
            <motion.div key="form-mp"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '16px' }}>
                Datos de pago
              </p>
              <MpCardForm
                amount={precioTarjeta}
                socioId={socio?.id ?? ''}
                email={email}
                onSuccess={handlePagoExitoso}
                onCancel={() => setShowCardForm(false)}
              />
            </motion.div>
          )}

          {/* Botón iniciar pago con tarjeta */}
          {!socio?.cuota_al_dia && !showCardForm && !pagoExito && modo === 'tarjeta' && (
            <motion.div key="cta-tarjeta" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button onClick={() => setShowCardForm(true)}
                style={{ width: '100%', padding: '14px', borderRadius: '14px', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 700, color: '#fff', background: '#C8940A' }}>
                {`Pagar con tarjeta — $U ${formatPrecio(precioTarjeta)}`}
              </button>
            </motion.div>
          )}

          {/* Instrucciones de transferencia */}
          {!socio?.cuota_al_dia && !pagoExito && modo === 'transferencia' && (
            <motion.div key="cta-transferencia"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '18px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '14px' }}>
                Datos para transferir
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Banco',    valor: 'Banco República (BROU)' },
                  { label: 'Titular',  valor: 'Lobos Rugby Club' },
                  { label: 'Cuenta',   valor: '001234567-00001' },
                  { label: 'Monto',    valor: `$U ${formatPrecio(precioBase)}` },
                  { label: 'Concepto', valor: `Cuota ${socio?.nombre ?? ''} ${socio?.apellido ?? ''} — ${new Date().toLocaleDateString('es-UY', { month: 'long', year: 'numeric' })}` },
                ].map(({ label, valor }) => (
                  <div key={label} className="flex justify-between items-start gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.30)', flexShrink: 0 }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#fff', textAlign: 'right' }}>{valor}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.30)', marginTop: '14px', lineHeight: 1.5 }}>
                Una vez realizada la transferencia, el administrador del club confirmará el pago en un plazo de 24–48hs hábiles.
              </p>
            </motion.div>
          )}

        </AnimatePresence>

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

        {/* ── Toggle Transferencia / Tarjeta ── */}
        <div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '10px' }}>
            Modalidad de pago
          </p>
          <div className="flex rounded-xl p-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {(['tarjeta', 'transferencia'] as ModaloPago[]).map((m) => (
              <button key={m} onClick={() => { setModo(m); setShowCardForm(false) }}
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
                  position: 'relative', zIndex: 2, display: 'block',
                }}>
                  {m === 'tarjeta' ? 'Tarjeta online' : 'Transferencia'}
                </span>
                <span style={{
                  display: 'block', position: 'relative', zIndex: 2,
                  fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em',
                  color: m === 'transferencia'
                    ? (modo === 'transferencia' ? '#4ade80' : 'rgba(74,222,128,0.45)')
                    : (modo === 'tarjeta' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)'),
                }}>
                  {m === 'transferencia' ? 'sin recargo' : `+5% ($U ${formatPrecio(recargo)})`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Cards de cuotas ── */}
        <div className="flex flex-col gap-2">
          {CUOTAS.map((c) => {
            const precioMostrar = modo === 'tarjeta' ? Math.round(c.base * (1 + RECARGO_TARJETA)) : c.base
            const esMiCuota     = c.tipo === categoria
            return (
              <motion.div key={c.tipo} layout
                style={{
                  background: esMiCuota ? 'rgba(var(--club-primary-rgb),0.12)' : c.destacada ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.03)',
                  border: esMiCuota ? '1px solid rgba(var(--club-primary-rgb),0.35)' : c.destacada ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(255,255,255,0.04)',
                  borderRadius: '14px', padding: c.minor ? '12px 16px' : '14px 16px', opacity: c.minor ? 0.75 : 1,
                }}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: c.minor ? '12px' : '14px', fontWeight: 700, color: esMiCuota ? 'var(--club-primary)' : '#fff' }}>
                        {c.tipo}
                      </span>
                      {esMiCuota && (
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, color: 'var(--club-primary)', letterSpacing: '0.08em', background: 'rgba(var(--club-primary-rgb),0.15)', padding: '1px 6px', borderRadius: '99px' }}>
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
                        style={{ fontFamily: 'var(--font-body)', fontSize: c.minor ? '16px' : '20px', fontWeight: 700, color: esMiCuota ? 'var(--club-primary)' : '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
                        ${formatPrecio(precioMostrar)}
                      </motion.span>
                    </AnimatePresence>
                    {modo === 'tarjeta' && (
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>
                        base ${formatPrecio(c.base)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ── Beneficio Itaú ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #C8940A, #f0b429)' }} />
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 800, color: '#f0b429', lineHeight: 1, letterSpacing: '-0.03em' }}>5% OFF</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.70)', marginTop: '4px' }}>en tu cuota mensual</div>
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
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, texto: 'Los pagos por transferencia deben realizarse entre el 1º y el 10º de cada mes. Pasada esa fecha se aplica un recargo del 10%.' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, texto: 'Cuota Familiar: 2 adultos y 2 menores de 21 años. Un tercer o cuarto menor abona el 50% de la cuota.' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>, texto: 'Cuota Fitness: incluye todas las actividades del gimnasio o SUM — Yoga, Dance, Funcional, Gym, y más.' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>, texto: 'Cuota Amigo: participan solamente de las actividades sociales, sin actividad deportiva.' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>, texto: 'La cuota se abona durante los 12 meses del año, independientemente del uso de las instalaciones.' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>, texto: 'Baja: el socio que no siga viniendo debe solicitar y completar el formulario de baja en secretaría.' },
            ].map(({ icon, texto }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div style={{ color: 'rgba(255,255,255,0.30)', marginTop: '1px', flexShrink: 0 }}>{icon}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{texto}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <NavBar />
    </main>
  )
}
