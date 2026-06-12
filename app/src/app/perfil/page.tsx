'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import PremiumButton from '@/components/PremiumButton'

type Socio = {
  nombre: string
  apellido: string
  numero_socio: string
  categoria: string
  cuota_al_dia: boolean
  foto_url: string | null
}

export default function PerfilPage() {
  const [socio, setSocio] = useState<Socio | null>(null)
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [subiendo, setSubiendo] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('socios')
        .select('*')
        .eq('id', user.id)
        .single()

      setSocio(data)

      if (data?.foto_url) {
        const { data: url } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.foto_url)
        setFotoUrl(url.publicUrl)
      }

      setLoading(false)
    }
    cargar()
  }, [])

  async function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setSubiendo(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (!error) {
      await supabase.from('socios').update({ foto_url: path }).eq('id', user.id)
      const { data: url } = supabase.storage.from('avatars').getPublicUrl(path)
      setFotoUrl(url.publicUrl)
    }

    setSubiendo(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--club-primary)] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  const iniciales = socio
    ? `${socio.nombre?.[0] ?? ''}${socio.apellido?.[0] ?? ''}`
    : '?'

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* Header oscuro */}
      <div className="bg-[#0D0D0D] px-5 pt-12 pb-6">
        <h1 className="text-white/40 text-[10px] uppercase tracking-[3px] mb-6">Mi Perfil</h1>

        {/* Credencial del socio */}
        <div className="relative rounded-2xl overflow-hidden p-5"
          style={{ background: 'linear-gradient(135deg, #1B2D6E 0%, #0d1c4a 100%)' }}>
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(200,148,10,0.8) 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />

          <div className="relative z-10 flex items-start justify-between mb-6">
            <div>
              <p className="text-white/30 text-[9px] font-bold uppercase tracking-[3px] mb-1">Lobos Rugby Club</p>
              <p className="text-white/20 text-[9px] tracking-wider">Punta del Este · Uruguay</p>
            </div>
            <img src="/lobos-logo.png" alt="Lobos" className="w-10 h-10 object-contain opacity-90" />
          </div>

          <div className="relative z-10 flex items-center gap-4">
            {/* Avatar — botón explícito con cámara */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative flex-shrink-0 group"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                {fotoUrl ? (
                  <img src={fotoUrl} alt="foto" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-serif text-2xl font-semibold">{iniciales}</span>
                )}
              </div>
              {/* Badge de cámara */}
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'var(--club-primary)', border: '2px solid #0d1c4a' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </button>

            <div className="flex-1">
              <h1 className="text-white font-serif text-xl font-semibold leading-tight">
                {socio ? `${socio.nombre} ${socio.apellido}` : 'Mi Perfil'}
              </h1>
              <p className="text-white/50 text-xs mt-0.5 uppercase tracking-wider">{socio?.categoria ?? 'Activo'}</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest active:opacity-60 transition-opacity"
                style={{ color: 'rgba(var(--club-primary-rgb),0.7)' }}
              >
                Cambiar foto →
              </button>
            </div>
          </div>

          <div className="relative z-10 mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div>
              <p className="text-white/30 text-[9px] uppercase tracking-wider">N° de Socio</p>
              <p className="text-white font-mono text-lg font-bold tracking-widest mt-0.5">
                {socio?.numero_socio ? `#${socio.numero_socio}` : '—'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/30 text-[9px] uppercase tracking-wider">Estado</p>
              <div className={`flex items-center gap-1.5 mt-0.5 justify-end ${socio?.cuota_al_dia ? 'text-emerald-400' : 'text-red-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="text-xs font-bold">{socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}</span>
              </div>
            </div>
          </div>

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
          {subiendo && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-8 flex flex-col gap-3">

        {/* Estado de cuota */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-[#888] text-xs uppercase tracking-widest mb-3">Estado de cuenta</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#0D0D0D] text-lg font-mono font-semibold">$2.400 UYU</div>
              <div className="text-[#aaa] text-xs mt-0.5">Cuota mensual</div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${socio?.cuota_al_dia ? 'bg-[#EAF7EE] text-[#219653]' : 'bg-[#FEF0F0] text-[#C0392B]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-[#219653]' : 'bg-[#C0392B]'}`} />
              {socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}
            </div>
          </div>
          <div className="mt-4">
            <button onClick={() => router.push('/cuota')}
              className="w-full py-3.5 rounded-xl text-sm font-bold tracking-widest uppercase text-[#0D0D0D] transition-opacity active:opacity-80"
              style={{ background: 'var(--club-primary)' }}>
              {socio?.cuota_al_dia ? 'Ver historial' : 'Pagar cuota'}
            </button>
          </div>
        </div>

        {/* Datos personales */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-[#888] text-xs uppercase tracking-widest mb-3">Datos personales</div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Nombre', value: socio ? `${socio.nombre} ${socio.apellido}` : '—' },
              { label: 'Categoría', value: socio?.categoria ?? '—' },
              { label: 'N° de socio', value: socio?.numero_socio ?? '—' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-[#F4F3EF] last:border-0">
                <span className="text-[#aaa] text-xs">{item.label}</span>
                <span className="text-[#0D0D0D] text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={handleSignOut}
          className="mt-2 w-full bg-white rounded-2xl py-4 text-[#C0392B] text-sm font-semibold shadow-sm hover:opacity-80 transition-opacity"
        >
          Cerrar sesión
        </button>

        <div className="h-20" />
      </div>

      <NavBar />
    </main>
  )
}
