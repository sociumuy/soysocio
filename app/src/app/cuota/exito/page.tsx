'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function PagoExitoPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function marcarPagado() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('socios').update({ cuota_al_dia: true }).eq('id', user.id)
      }
      setTimeout(() => router.push('/perfil'), 2500)
    }
    marcarPagado()
  }, [])

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-[#EAF7EE] flex items-center justify-center mb-6">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#219653" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="text-white font-serif text-3xl font-semibold mb-2">¡Pago exitoso!</h1>
      <p className="text-white/40 text-sm">Tu cuota quedó registrada. Redirigiendo...</p>
    </main>
  )
}
