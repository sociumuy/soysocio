'use client'

import { useRouter } from 'next/navigation'

const ULTIMA_ACTUALIZACION = '19 de junio de 2026'

const SECCIONES = [
  {
    titulo: '1. Responsable del tratamiento',
    contenido: `La Plataforma, en su rol de intermediario tecnológico, es corresponsable del tratamiento de datos junto al club deportivo que contrata el servicio. El club es el responsable principal de los datos de sus socios y determina los fines del tratamiento.`,
  },
  {
    titulo: '2. Datos que recopilamos',
    contenido: `Recopilamos únicamente los datos necesarios para la prestación del servicio:

— Datos de identidad: nombre, apellido, número de socio, categoría.
— Datos de contacto: dirección de correo electrónico.
— Datos de uso: historial de accesos, reservas realizadas.
— Datos de pago: procesados directamente por Stripe. La Plataforma no almacena números de tarjeta ni datos financieros sensibles.`,
  },
  {
    titulo: '3. Finalidad del tratamiento',
    contenido: `Los datos recopilados se utilizan exclusivamente para:

— Gestionar el acceso y la autenticación del usuario.
— Procesar el pago de cuotas sociales.
— Gestionar reservas de instalaciones del club.
— Enviar comunicaciones administrativas relacionadas con el servicio (no publicidad).
— Cumplir con obligaciones legales aplicables.`,
  },
  {
    titulo: '4. Base legal del tratamiento',
    contenido: `El tratamiento de datos se basa en la ejecución del contrato de membresía entre el socio y el club, y en el consentimiento explícito otorgado al aceptar estos términos. El tratamiento cumple con lo establecido en la Ley N° 18.331 de Protección de Datos Personales y Acción de Habeas Data de la República Oriental del Uruguay.`,
  },
  {
    titulo: '5. Terceros que acceden a tus datos',
    contenido: `Compartimos datos únicamente con los proveedores necesarios para operar el servicio:

— Supabase (supabase.com): proveedor de base de datos y autenticación. Datos almacenados en servidores con cifrado en reposo.
— Stripe (stripe.com): procesador de pagos. Maneja datos de tarjetas bajo estándar PCI DSS.

No vendemos, alquilamos ni cedemos datos personales a terceros con fines comerciales.`,
  },
  {
    titulo: '6. Conservación de datos',
    contenido: `Los datos se conservan durante la vigencia de la membresía del socio y por un período adicional de cinco (5) años para cumplir obligaciones contables y legales, salvo que la ley exija un plazo diferente.

Una vez vencido el plazo, los datos son eliminados o anonimizados de forma permanente.`,
  },
  {
    titulo: '7. Tus derechos (Ley 18.331)',
    contenido: `Como titular de datos personales en Uruguay, tenés derecho a:

— Acceso: solicitar información sobre los datos que tenemos sobre vos.
— Rectificación: corregir datos incorrectos o incompletos.
— Supresión: solicitar la eliminación de tus datos cuando ya no sean necesarios.
— Oposición: oponerte al tratamiento de tus datos en determinadas circunstancias.

Para ejercer estos derechos, contactá al administrador de tu club o escribinos a la dirección de soporte de la Plataforma. Responderemos en un plazo máximo de quince (15) días hábiles.`,
  },
  {
    titulo: '8. Seguridad',
    contenido: `Implementamos medidas técnicas y organizativas para proteger tus datos:

— Comunicaciones cifradas mediante TLS/HTTPS.
— Contraseñas almacenadas con hash seguro (nunca en texto plano).
— Rate limiting en todos los endpoints de la API.
— Acceso a datos de producción restringido al personal autorizado.
— Tokens de autenticación con expiración automática.`,
  },
  {
    titulo: '9. Cookies y almacenamiento local',
    contenido: `Utilizamos cookies de sesión estrictamente necesarias para el funcionamiento de la autenticación. No utilizamos cookies de seguimiento, publicidad ni análisis de comportamiento de terceros.

El almacenamiento local del navegador se usa para recordar la selección de club y preferencias de interfaz, sin almacenar datos personales sensibles.`,
  },
  {
    titulo: '10. Modificaciones a esta política',
    contenido: `Podemos actualizar esta Política de Privacidad cuando sea necesario. Te notificaremos con al menos siete (7) días de anticipación mediante aviso en la Plataforma. El uso continuado implica la aceptación de la política actualizada.`,
  },
  {
    titulo: '11. Contacto y reclamos',
    contenido: `Para consultas, ejercicio de derechos o reclamos relacionados con el tratamiento de tus datos personales, podés contactarnos a través del administrador de tu club o por correo electrónico a la dirección de soporte de la Plataforma.

También podés presentar un reclamo ante la Unidad Reguladora y de Control de Datos Personales (URCDP) de Uruguay: urcdp.gub.uy`,
  },
]

export default function PrivacidadPage() {
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
          Política de Privacidad
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.30)', marginTop: '8px' }}>
          Última actualización: {ULTIMA_ACTUALIZACION}
        </p>
      </div>

      {/* Ley badge */}
      <div className="px-5 py-4 flex items-center gap-3" style={{ background: 'rgba(200,148,10,0.05)', borderBottom: '1px solid rgba(200,148,10,0.12)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8940A" strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.50)', lineHeight: 1.5 }}>
          Este documento cumple con la <strong style={{ color: 'rgba(255,255,255,0.75)' }}>Ley N° 18.331</strong> de Protección de Datos Personales de la República Oriental del Uruguay.
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
          Para más información sobre tus derechos, visitá{' '}
          <span style={{ color: '#C8940A' }}>urcdp.gub.uy</span>
          {' '}— Unidad Reguladora y de Control de Datos Personales de Uruguay.
        </p>
      </div>

    </main>
  )
}
