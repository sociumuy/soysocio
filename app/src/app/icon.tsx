import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: '#0D0D0D',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20%',
      }}
    >
      {/* Shield shape via text — gold S */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 260,
            fontWeight: 700,
            color: '#B8975A',
            lineHeight: 1,
            letterSpacing: '-8px',
          }}
        >
          S
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 400,
            color: 'rgba(184,151,90,0.5)',
            letterSpacing: '18px',
            marginTop: -20,
          }}
        >
          SOCIO
        </div>
      </div>
    </div>,
    { ...size }
  )
}
