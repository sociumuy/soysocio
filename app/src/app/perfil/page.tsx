'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'

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
        <div className="w-6 h-6 border-2 border-[#B8975A] border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  const iniciales = socio
    ? `${socio.nombre?.[0] ?? ''}${socio.apellido?.[0] ?? ''}`
    : '?'

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex flex-col">

      {/* Header oscuro */}
      <div className="bg-[#0D0D0D] px-5 pt-12 pb-10 flex flex-col items-center">

        {/* Avatar */}
        <div className="relative mb-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-24 h-24 rounded-full bg-[#1a1a1a] border-2 border-[#B8975A]/40 flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {fotoUrl ? (
              <img src={fotoUrl} alt="foto" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-serif text-3xl font-semibold">{iniciales}</span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#B8975A] rounded-full flex items-center justify-center border-2 border-[#0D0D0D]">
            {subiendo ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
        </div>

        <h1 className="text-white font-serif text-2xl font-semibold">
          {socio ? `${socio.nombre} ${socio.apellido}` : 'Mi Perfil'}
        </h1>
        {socio?.numero_socio && (
          <p className="text-[#B8975A] text-xs tracking-widest mt-1">Socio N° {socio.numero_socio}</p>
        )}
        <div className="mt-3 px-4 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full">
          <span className="text-[#888] text-xs uppercase tracking-wider">
            {socio?.categoria ?? 'Activo'}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 bg-[#F4F3EF] rounded-t-3xl px-5 pt-6 pb-8 flex flex-col gap-3">

        {/* Estado de cuota */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-[#888] text-xs uppercase tracking-widest mb-3">Estado de cuenta</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#0D0D0D] text-lg font-serif font-semibold">$2.400 UYU</div>
              <div className="text-[#aaa] text-xs mt-0.5">Cuota mensual</div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${socio?.cuota_al_dia ? 'bg-[#EAF7EE] text-[#219653]' : 'bg-[#FEF0F0] text-[#C0392B]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${socio?.cuota_al_dia ? 'bg-[#219653]' : 'bg-[#C0392B]'}`} />
              {socio?.cuota_al_dia ? 'Al día' : 'Pendiente'}
            </div>
          </div>
          <button className="w-full mt-4 bg-[#0D0D0D] text-white rounded-xl py-3 text-xs font-bold tracking-widest uppercase hover:opacity-80 transition-opacity">
            Pagar cuota
          </button>
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
