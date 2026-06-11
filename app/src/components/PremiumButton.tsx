'use client'

import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  onClick?: (e?: React.MouseEvent) => void
  className?: string
  disabled?: boolean
  variant?: 'gold' | 'dark' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  icon?: React.ReactNode
  type?: 'button' | 'submit'
}

const V = {
  gold:    { bg: 'linear-gradient(160deg,#D4A854 0%,var(--club-primary) 45%,#8B6A32 100%)', shadow: '#6B4E1E', shimmer: 'rgba(255,255,255,0.38)', border: 'rgba(255,220,140,0.25)', text: '#fff' },
  dark:    { bg: 'linear-gradient(160deg,#222 0%,#111 100%)',                   shadow: '#000',    shimmer: 'rgba(var(--club-primary-rgb),0.45)', border: 'rgba(255,255,255,0.08)', text: '#fff' },
  ghost:   { bg: 'transparent',                                                  shadow: 'none',    shimmer: 'rgba(var(--club-primary-rgb),0.2)',  border: 'rgba(var(--club-primary-rgb),0.28)', text: 'var(--club-primary)' },
  danger:  { bg: 'linear-gradient(160deg,#9B1C1C 0%,#6B1010 100%)',             shadow: '#3D0606', shimmer: 'rgba(255,120,120,0.3)', border: 'rgba(255,100,100,0.2)', text: '#fff' },
  outline: { bg: 'transparent',                                                  shadow: 'none',    shimmer: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.15)', text: '#fff' },
}

const S = {
  sm: { py: 'py-2',   px: 'px-4', text: 'text-[10px]', tracking: 'tracking-[2px]', r: 'rounded-xl',  depth: 3 },
  md: { py: 'py-3',   px: 'px-5', text: 'text-xs',     tracking: 'tracking-[3px]', r: 'rounded-xl',  depth: 4 },
  lg: { py: 'py-3.5', px: 'px-7', text: 'text-sm',     tracking: 'tracking-[3px]', r: 'rounded-2xl', depth: 5 },
}

export default function PremiumButton({
  children, onClick, className = '', disabled,
  variant = 'gold', size = 'md', fullWidth = false, icon, type = 'button',
}: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const [pressed, setPressed] = useState(false)
  const v = V[variant]
  const s = S[size]

  // Magnetic pull
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 180, damping: 18 })
  const sy = useSpring(my, { stiffness: 180, damping: 18 })

  function onMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.2)
    my.set((e.clientY - (r.top  + r.height / 2)) * 0.2)
  }
  function onMouseLeave() { mx.set(0); my.set(0) }

  const depth = s.depth
  const hasShadow = v.shadow !== 'none'

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        x: sx, y: sy,
        translateY: pressed ? depth - 1 : 0,
        background: v.bg,
        border: `1px solid ${v.border}`,
        boxShadow: hasShadow
          ? pressed
            ? `0 1px 0 ${v.shadow}, 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`
            : `0 ${depth}px 0 ${v.shadow}, 0 ${depth * 2}px ${depth * 5}px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.14)`
          : `0 0 0 1px ${v.border}`,
      }}
      transition={{ type: 'spring', stiffness: 600, damping: 35 }}
      className={`
        relative overflow-hidden font-bold uppercase select-none
        ${s.py} ${s.px} ${s.text} ${s.tracking} ${s.r}
        ${fullWidth ? 'w-full' : ''}
        disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
        ${className}
      `}
    >
      {/* Shimmer sweep — runs on loop */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <span
          style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(105deg, transparent 35%, ${v.shimmer} 50%, transparent 65%)`,
            animation: 'btn-shimmer 3.2s ease-in-out 1s infinite',
          }}
        />
      </span>

      {/* Top-edge glint */}
      <span aria-hidden className="pointer-events-none absolute top-0 inset-x-6 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.45), transparent)' }} />

      {/* Pressed inner shadow */}
      {pressed && (
        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.35)' }} />
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2" style={{ color: v.text }}>
        {icon}
        {children}
      </span>

      <style>{`
        @keyframes btn-shimmer {
          0%   { transform: translateX(-120%); }
          40%  { transform: translateX(220%); }
          100% { transform: translateX(220%); }
        }
      `}</style>
    </motion.button>
  )
}
