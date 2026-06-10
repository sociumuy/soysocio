'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'

type Metodo = 'transferencia' | 'mercadopago' | null

export default function CuotaPage() {
  const [metodo, setMetodo] = useState<Metodo>(null)
  const [copiado, setCopiado] = useState<string | null>(null)
  const [confirmado, setConfirmado] = useState(false)
  const router = useRouter()

  function copiar(texto: string, campo: string) {
    navigator.clipboard.writeText(texto)
    setCopiado(campo)
    setTimeout(() => setCopiado(null), 2000)
  }

  if (confirmado) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 bg-[#B8975A]/10 border border-[#B8975A]/30 rounded-full flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="2" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-white font-serif text-3xl font-semibold mb-3">Transferencia registrada</h1>
        <p className="text-[#555] text-sm mb-8 leading-relaxed">
          Una vez que verifiquemos el pago, tu cuota quedará al día. Esto puede demorar 1-2 días hábiles.
        </p>
        <button
          onClick={() => router.push('/home')}
          className="bg-[#B8975A] text-white rounded-xl px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#555] text-xs mb-6 hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
        <h1 className="text-white font-serif text-3xl font-semibold">Pagar cuota</h1>
        <p className="text-[#555] text-sm mt-1">Junio 2026</p>
      </div>

      {/* Contenido */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-24 flex flex-col gap-4">

        {/* Monto */}
        <div className="bg-[#0D0D0D] rounded-2xl p-5">
          <div className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-widest mb-1">Total a pagar</div>
          <div className="text-white font-serif text-4xl font-semibold">$2.400</div>
          <div className="text-[#B8975A] text-xs mt-1 tracking-wider">UYU · Cuota Junio 2026</div>
        </div>

        {/* Métodos */}
        <div className="text-[#888] text-xs uppercase tracking-widest mb-1">Método de pago</div>

        {/* Transferencia */}
        <div
          onClick={() => setMetodo(metodo === 'transferencia' ? null : 'transferencia')}
          className={`bg-white rounded-2xl p-5 shadow-sm cursor-pointer transition-all border-2 ${metodo === 'transferencia' ? 'border-[#B8975A]' : 'border-transparent'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F4F3EF] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8975A" strokeWidth="1.8" strokeLinecap="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-[#0D0D0D] text-sm font-bold">Transferencia bancaria</div>
              <div className="text-[#aaa] text-xs">BROU · Santander · Itaú</div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${metodo === 'transferencia' ? 'border-[#B8975A] bg-[#B8975A]' : 'border-[#ddd]'}`}>
              {metodo === 'transferencia' && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
          </div>

          {/* Datos bancarios */}
          {metodo === 'transferencia' && (
            <div className="mt-4 pt-4 border-t border-[#F4F3EF] flex flex-col gap-3">
              {[
                { label: 'Banco', value: 'BROU' },
                { label: 'Titular', value: 'Club Carrasco S.C.' },
                { label: 'N° de cuenta', value: '001-0123456/78', copiable: true },
                { label: 'Monto', value: '$2.400 UYU', highlight: true },
                { label: 'Concepto', value: 'Socio Jun26', copiable: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[#aaa] text-xs">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${item.highlight ? 'text-[#219653]' : 'text-[#0D0D0D]'}`}>
                      {item.value}
                    </span>
                    {item.copiable && (
                      <button
                        onClick={(e) => { e.stopPropagation(); copiar(item.value, item.label) }}
                        className="text-[10px] bg-[#F4F3EF] text-[#B8975A] font-semibold px-2 py-0.5 rounded-md hover:opacity-80"
                      >
                        {copiado === item.label ? '✓' : 'Copiar'}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={() => setConfirmado(true)}
                className="mt-2 w-full bg-[#0D0D0D] text-white rounded-xl py-3.5 text-xs font-bold tracking-widest uppercase hover:opacity-80 transition-opacity"
              >
                Ya realicé la transferencia
              </button>
            </div>
          )}
        </div>

        {/* MercadoPago */}
        <div
          onClick={() => setMetodo(metodo === 'mercadopago' ? null : 'mercadopago')}
          className={`bg-white rounded-2xl p-5 shadow-sm cursor-pointer transition-all border-2 ${metodo === 'mercadopago' ? 'border-[#B8975A]' : 'border-transparent'}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#009EE3] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">MP</span>
            </div>
            <div className="flex-1">
              <div className="text-[#0D0D0D] text-sm font-bold">MercadoPago</div>
              <div className="text-[#aaa] text-xs">Todas las tarjetas · en cuotas</div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${metodo === 'mercadopago' ? 'border-[#B8975A] bg-[#B8975A]' : 'border-[#ddd]'}`}>
              {metodo === 'mercadopago' && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
          </div>

          {metodo === 'mercadopago' && (
            <div className="mt-4 pt-4 border-t border-[#F4F3EF]">
              <p className="text-[#888] text-xs mb-3">Serás redirigido al portal de pago seguro de MercadoPago.</p>
              <button
                onClick={() => window.open('https://www.mercadopago.com.uy', '_blank')}
                className="w-full bg-[#009EE3] text-white rounded-xl py-3.5 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
              >
                Ir a MercadoPago
              </button>
            </div>
          )}
        </div>

      </div>

      <NavBar />
    </main>
  )
}
