import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        background: '#0D0D0D',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: 110,
          fontWeight: 700,
          color: '#B8975A',
          lineHeight: 1,
        }}
      >
        S
      </div>
    </div>,
    { ...size }
  )
}
