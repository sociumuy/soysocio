'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

const MONTO = 2400
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function historialSimulado(cuotaAlDia: boolean) {
  const hoy = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1)
    const pagado = i > 0 || cuotaAlDia
    return {
      mes: `${MESES[d.getMonth()]} ${d.getFullYear()}`,
      monto: MONTO,
      pagado,
      fecha: pagado ? `${String(3 + i).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` : null,
    }
  })
}

export default function CuotaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [socios, setSocios] = useState<Socio[]>([])
  const [socioActivo, setSocioActivo] = useState<Socio | null>(null)
  const [loading, setLoading] = useState(true)
  const [pagando, setPagando] = useState(false)
  const [exito, setExito] = useState(false)

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('socios')
        .select('id, nombre, apellido, numero_socio, categoria, cuota_al_dia')
        .eq('user_id', user.id)
        .order('nombre')

      const lista = data ?? []
      setSocios(lista)
      setSocioActivo(lista[0] ?? null)
      setLoading(false)
    }
    cargar()
  }, [])

  async function simularPago() {
    if (!socioActivo) return
    setPagando(true)
    await new Promise(r => setTimeout(r, 1800))
    await supabase.from('socios').update({ cuota_al_dia: true }).eq('id', socioActivo.id)
    setSocios(prev => prev.map(s => s.id === socioActivo.id ? { ...s, cuota_al_dia: true } : s))
    setSocioActivo(prev => prev ? { ...prev, cuota_al_dia: true } : prev)
    setPagando(false)
    setExito(true)
    setTimeout(() => setExito(false), 3000)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#B8975A] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  const socio = socioActivo
  const historial = socio ? historialSimulado(socio.cuota_al_dia) : []
  const pendientes = socios.filter(s => !s.cuota_al_dia)

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <button
          onClick={() => router.push('/home')}
          className="flex items-center gap-2 text-[#555] text-xs mb-6 hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
        <h1 className="text-white font-serif text-3xl font-semibold">Cuotas</h1>
        <p className="text-[#555] text-sm mt-1">Club Carrasco</p>

        {socios.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
            {socios.map(s => (
              <button
                key={s.id}
                onClick={() => setSocioActivo(s)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  socioActivo?.id === s.id
                    ? 'bg-[#B8975A] text-white'
                    : 'bg-white/10 text-[#888] hover:bg-white/15'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#B8975A]/30 flex items-center justify-center text-[10px] font-bold text-[#B8975A]">
                  {s.nombre[0]}
                </span>
                {s.nombre}
                {!s.cuota_al_dia && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-28 flex flex-col gap-5">

        {pendientes.length > 0 && !exito && (
          <div className="bg-[#FEF0F0] border border-red-200 rounded-2xl px-4 py-3 flex items-start gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" className="mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <div className="text-[#C0392B] text-xs font-bold">
                {pendientes.length === 1
                  ? `${pendientes[0].nombre} tiene una cuota pendiente`
                  : `${pendientes.length} socios tienen cuotas pendientes`}
              </div>
              <div className="text-[#E07070] text-xs mt-0.5">Seleccioná cada socio para pagar</div>
            </div>
          </div>
        )}

        {exito && (
          <div className="bg-[#EAF7EE] border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#219653" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[#219653] text-xs font-bold">¡Pago registrado correctamente!</span>
          </div>
        )}

        {/* Card cuota actual */}
        {socio && (
          <div className={`rounded-2xl p-5 ${socio.cuota_al_dia ? 'bg-[#0D0D0D]' : 'bg-[#7D1A1A]'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-widest mb-1">
                  {socios.length > 1 ? socio.nombre : 'Mi cuota'}
                </div>
                <div className="text-white font-serif text-4xl font-semibold">
                  ${MONTO.toLocaleString('es-UY')}
                </div>
                <div className="text-[rgba(255,255,255,0.3)] text-xs mt-1">UYU · mensual · {socio.categoria}</div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                socio.cuota_al_dia ? 'bg-[#B8975A]/20 text-[#B8975A]' : 'bg-red-900/50 text-red-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${socio.cuota_al_dia ? 'bg-[#B8975A]' : 'bg-red-400'}`} />
                {socio.cuota_al_dia ? 'Al día' : 'Pendiente'}
              </div>
            </div>

            {!socio.cuota_al_dia && (
              <button
                onClick={simularPago}
                disabled={pagando}
                className="w-full bg-[#B8975A] text-white rounded-xl py-3.5 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {pagando ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    Pagar cuota — ${MONTO.toLocaleString('es-UY')}
                  </>
                )}
              </button>
            )}

            {socio.cuota_al_dia && (
              <div className="flex items-center gap-2 text-[rgba(255,255,255,0.25)] text-xs">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Próximo vencimiento: 1 de julio
              </div>
            )}
          </div>
        )}

        {/* N° de socio */}
        {socio && (
          <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-[#888] text-xs uppercase tracking-widest mb-1">N° de socio</div>
              <div className="text-[#0D0D0D] text-2xl font-serif font-semibold">{socio.numero_socio}</div>
              <div className="text-[#aaa] text-xs mt-0.5">{socio.categoria}</div>
            </div>
            <div className="w-12 h-12 bg-[#F4F3EF] rounded-2xl flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.8" strokeLinecap="round">
                <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
          </div>
        )}

        {/* Historial */}
        <div>
          <div className="text-[#888] text-xs uppercase tracking-widest mb-3">Historial de pagos</div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {historial.map((h, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-3.5 ${i < historial.length - 1 ? 'border-b border-[#F4F3EF]' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${h.pagado ? 'bg-[#EAF7EE]' : 'bg-[#FEF0F0]'}`}>
                    {h.pagado ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#219653" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="text-[#0D0D0D] text-sm font-semibold">{h.mes}</div>
                    <div className="text-[#aaa] text-xs">{h.fecha ?? 'Sin pagar'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${h.pagado ? 'text-[#0D0D0D]' : 'text-[#C0392B]'}`}>
                    ${h.monto.toLocaleString('es-UY')}
                  </div>
                  <div className={`text-[10px] font-semibold ${h.pagado ? 'text-[#219653]' : 'text-[#C0392B]'}`}>
                    {h.pagado ? 'Pagado' : 'Pendiente'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <NavBar />
    </main>
  )
}
