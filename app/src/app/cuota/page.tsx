'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getStoredClub } from '@/lib/club-storage'
import { getStripe } from '@/lib/stripe'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import NavBar from '@/components/NavBar'

type Socio = { id: string; nombre: string; apellido: string; numero_socio: string; cuota_al_dia: boolean }

// ── Formulario de pago ───────────────────────────────
function FormularioPago({ monto, onExito }: { monto: number; onExito: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setProcesando(true)
    setError(null)

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/cuota/exito`,
      },
      redirect: 'if_required',
    })

    if (stripeError) {
      setError(stripeError.message ?? 'Error al procesar el pago')
      setProcesando(false)
    } else {
      onExito()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-[#888] text-xs uppercase tracking-widest mb-4">Método de pago</p>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {error && (
        <div className="bg-[#FEF0F0] rounded-xl px-4 py-3 text-[#C0392B] text-xs font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || procesando}
        className="w-full py-4 rounded-2xl text-sm font-bold tracking-widest uppercase transition-opacity active:opacity-80 disabled:opacity-50 flex items-center justify-center gap-3"
        style={{ background: 'var(--club-primary)', color: '#0D0D0D' }}
      >
        {procesando ? (
          <>
            <div className="w-4 h-4 border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            Pagar ${monto.toLocaleString('es-UY')} UYU
          </>
        )}
      </button>

      <p className="text-center text-[#ccc] text-[10px]">
        Pago seguro procesado por Stripe · Los datos de tu tarjeta nunca son almacenados
      </p>
    </form>
  )
}

// ── Página principal ─────────────────────────────────
export default function CuotaPage() {
  const [socio, setSocio] = useState<Socio | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [monto, setMonto] = useState(2400)
  const [loading, setLoading] = useState(true)
  const [pagado, setPagado] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const club = getStoredClub()

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase.from('socios').select('*').eq('id', user.id).single()
      setSocio(data)

      if (data && !data.cuota_al_dia && club) {
        const res = await fetch('/api/pago/crear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ socio_id: data.id, club_id: club.id }),
        })
        const json = await res.json()
        if (json.clientSecret) {
          setClientSecret(json.clientSecret)
          const { data: clubData } = await supabase
            .from('clubes').select('cuota_monto').eq('id', club.id).single()
          if (clubData?.cuota_monto) setMonto(clubData.cuota_monto)
        } else {
          setErrorMsg(json.error ?? 'No se pudo iniciar el pago')
        }
      }

      setLoading(false)
    }
    cargar()
  }, [])

  if (loading) return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[var(--club-primary)] border-t-transparent rounded-full animate-spin" />
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <div className="px-5 pt-12 pb-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 text-xs mb-8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
        <h1 className="text-white font-serif text-3xl font-semibold">Pagar cuota</h1>
        <p className="text-white/40 text-xs mt-1">{club?.nombre}</p>
      </div>

      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-32 flex flex-col gap-4">

        {/* Cuota al día */}
        {(socio?.cuota_al_dia || pagado) && (
          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#EAF7EE] flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#219653" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p className="text-[#0D0D0D] font-semibold">Cuota al día</p>
              <p className="text-[#aaa] text-xs mt-0.5">No tenés pagos pendientes</p>
            </div>
          </div>
        )}

        {/* Error de configuración */}
        {errorMsg && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-[#C0392B] text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Resumen + formulario */}
        {!socio?.cuota_al_dia && !pagado && !errorMsg && (
          <>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="text-[#888] text-xs uppercase tracking-widest mb-4">Resumen</p>
              <div className="flex justify-between items-center py-2.5 border-b border-[#F4F3EF]">
                <span className="text-[#555] text-sm">Concepto</span>
                <span className="text-[#0D0D0D] text-sm font-medium">Cuota mensual</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-[#F4F3EF]">
                <span className="text-[#555] text-sm">Socio</span>
                <span className="text-[#0D0D0D] text-sm font-medium">N° {socio?.numero_socio}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-[#0D0D0D] font-bold text-sm">Total</span>
                <span className="text-[#0D0D0D] font-mono font-bold text-xl">${monto.toLocaleString('es-UY')} UYU</span>
              </div>
            </div>

            {clientSecret && (
              <Elements
                stripe={getStripe()}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: 'var(--club-primary, #C8940A)',
                      borderRadius: '12px',
                      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    },
                  },
                }}
              >
                <FormularioPago monto={monto} onExito={() => setPagado(true)} />
              </Elements>
            )}
          </>
        )}
      </div>

      <NavBar />
    </main>
  )
}
