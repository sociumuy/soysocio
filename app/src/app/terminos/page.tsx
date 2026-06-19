'use client'

import { useRouter } from 'next/navigation'

const ULTIMA_ACTUALIZACION = '19 de junio de 2026'

const SECCIONES = [
  {
    titulo: '1. Objeto del servicio',
    contenido: `La Plataforma es un sistema de gestión digital para clubes deportivos que permite a los socios acceder a información institucional, realizar el pago de cuotas sociales, efectuar reservas de instalaciones y consultar novedades del club.

La Plataforma actúa como intermediario tecnológico entre el club y sus socios. El club es el responsable de la información publicada, la gestión de membresías y la prestación de los servicios deportivos y sociales.`,
  },
  {
    titulo: '2. Registro y cuenta de usuario',
    contenido: `El acceso a la Plataforma está restringido a socios habilitados por el club. El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.

El usuario se compromete a proporcionar información veraz y actualizada. En caso de detectar un uso no autorizado de su cuenta, deberá notificarlo inmediatamente al administrador del club.`,
  },
  {
    titulo: '3. Pagos de cuotas sociales',
    contenido: `El pago de cuotas sociales se procesa a través de Stripe, una plataforma de pagos de terceros. Al realizar un pago, el usuario acepta los términos y condiciones de Stripe (stripe.com/legal).

Los fondos son acreditados directamente en la cuenta bancaria del club, descontando una comisión de servicio de la Plataforma. El comprobante de pago es generado automáticamente y queda registrado en el sistema.

Los precios de las cuotas son determinados exclusivamente por el club y pueden ser modificados por este en cualquier momento, con previo aviso a los socios.`,
  },
  {
    titulo: '4. Reservas de instalaciones',
    contenido: `El sistema de reservas permite solicitar el uso de instalaciones del club según la disponibilidad configurada por el administrador. La confirmación de una reserva no garantiza su disponibilidad ante situaciones de fuerza mayor o decisiones administrativas del club.

El club se reserva el derecho de cancelar o modificar reservas con notificación al socio.`,
  },
  {
    titulo: '5. Uso aceptable',
    contenido: `El usuario se compromete a utilizar la Plataforma de manera lícita y conforme a estos términos. Queda prohibido:

— Intentar acceder a cuentas de otros usuarios o a áreas restringidas del sistema.
— Utilizar la Plataforma para fines distintos a los previstos.
— Introducir código malicioso, virus o cualquier elemento que pueda dañar el sistema.
— Realizar más de cinco (5) intentos de autenticación fallidos en un período de quince (15) minutos.`,
  },
  {
    titulo: '6. Propiedad intelectual',
    contenido: `El diseño, código, marca y contenidos de la Plataforma son propiedad de sus desarrolladores. Los contenidos publicados por el club (noticias, fotos, información institucional) son propiedad del club.

El usuario no adquiere ningún derecho de propiedad intelectual sobre la Plataforma por el mero uso de la misma.`,
  },
  {
    titulo: '7. Limitación de responsabilidad',
    contenido: `La Plataforma se provee "tal cual", sin garantías de disponibilidad ininterrumpida. No nos responsabilizamos por daños derivados de interrupciones del servicio, errores en la información publicada por el club, o incumplimientos del club hacia sus socios.

La responsabilidad máxima de la Plataforma ante el usuario no excederá el monto de la última cuota abonada a través del sistema.`,
  },
  {
    titulo: '8. Modificaciones',
    contenido: `Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios serán notificados con al menos siete (7) días de anticipación mediante aviso en la Plataforma. El uso continuado del servicio tras la notificación implica la aceptación de los nuevos términos.`,
  },
  {
    titulo: '9. Ley aplicable y jurisdicción',
    contenido: `Estos Términos se rigen por las leyes de la República Oriental del Uruguay. Para cualquier controversia derivada del uso de la Plataforma, las partes se someten a la jurisdicción de los Tribunales de Montevideo, Uruguay, con renuncia a cualquier otro fuero.`,
  },
  {
    titulo: '10. Contacto',
    contenido: `Para consultas sobre estos Términos y Condiciones, podés contactarnos a través del administrador de tu club o enviando un correo electrónico a la dirección de soporte indicada en la Plataforma.`,
  },
]

export default function TerminosPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col pb-16" style={{ background: '#0D0D0D' }}>

      {/* Header */}
      <div className="px-5 pt-14 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 active:opacity-60 transition-opacity"
          style={{ color: 'rgba(255,255,255,0.40)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px' }}>Volver</span>
        </button>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '8px' }}>
          Documento legal
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Términos y Condiciones
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.30)', marginTop: '8px' }}>
          Última actualización: {ULTIMA_ACTUALIZACION}
        </p>
      </div>

      {/* Intro */}
      <div className="px-5 py-5" style={{ background: 'rgba(200,148,10,0.05)', borderBottom: '1px solid rgba(200,148,10,0.12)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.6 }}>
          Al utilizar esta Plataforma, aceptás estos Términos y Condiciones en su totalidad. Si no estás de acuerdo con alguna parte, no debés usar el servicio.
        </p>
      </div>

      {/* Secciones */}
      <div className="px-5 py-6 flex flex-col gap-8">
        {SECCIONES.map((s, i) => (
          <div key={i}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '10px', letterSpacing: '-0.01em' }}>
              {s.titulo}
            </h2>
            {s.contenido.split('\n\n').map((parrafo, j) => (
              <p key={j} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.52)', lineHeight: 1.7, marginBottom: '8px' }}>
                {parrafo}
              </p>
            ))}
            {i < SECCIONES.length - 1 && (
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginTop: '16px' }} />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-6 mx-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6, textAlign: 'center' }}>
          Al usar la Plataforma confirmás haber leído, entendido y aceptado estos Términos y Condiciones, así como nuestra{' '}
          <button onClick={() => router.push('/privacidad')}
            style={{ color: '#C8940A', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
            Política de Privacidad
          </button>.
        </p>
      </div>

    </main>
  )
}
