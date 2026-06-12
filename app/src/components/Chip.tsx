'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  /** "r,g,b" string or "var(--club-primary-rgb)". Defaults to club primary. */
  accentRgb?: string
  icon?: ReactNode
  /** pill = rounded-full  |  tab = rounded-xl segment-control style */
  variant?: 'pill' | 'tab'
  /** row = icon + label side-by-side  |  col = icon above label */
  direction?: 'row' | 'col'
  size?: 'sm' | 'md'
  /** Pass a shared string to all chips in a group for the Framer Motion sliding bg */
  layoutId?: string
  className?: string
}

/**
 * Universal pill / chip / tab for the whole app.
 * Inactive: glassmorphism + very slow ghost-shimmer border.
 * Active:   accent bg + fast bright shimmer border + glow box-shadow.
 * Transition: spring animation via Framer Motion layoutId (optional).
 */
export default function Chip({
  children,
  active = false,
  onClick,
  accentRgb,
  icon,
  variant = 'pill',
  direction = 'row',
  size = 'sm',
  layoutId,
  className = '',
}: ChipProps) {
  const rgb = accentRgb ?? 'var(--club-primary-rgb)'
  const borderRadius = variant === 'pill' ? '999px' : '14px'
  const px = size === 'md' ? '16px' : '12px'
  const py = size === 'md' ? '10px' : '6px'
  const isCol = direction === 'col'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const borderStyle: any = {
    borderRadius: 'inherit',
    padding: '1px',
    background: active
      ? `linear-gradient(90deg, transparent 0%, rgba(${rgb},0.9) 50%, transparent 100%)`
      : `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.13) 50%, transparent 100%)`,
    backgroundSize: '300% 100%',
    animation: active
      ? 'shimmer-slide 2s ease-in-out infinite'
      : 'shimmer-slide 7s ease-in-out infinite',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
  }

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.91 }}
      className={`relative flex-shrink-0 overflow-hidden select-none
        ${isCol ? 'flex flex-col items-center gap-1' : 'flex flex-row items-center gap-1.5'}
        ${className}`}
      style={{
        borderRadius,
        padding: isCol ? `${py} ${px}` : `${py} ${px}`,
        boxShadow: active
          ? `0 0 22px rgba(${rgb},0.30), 0 0 0 0.5px rgba(${rgb},0.18)`
          : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* ── Base background (CSS-only fallback / no-layoutId mode) ── */}
      {!layoutId && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 'inherit',
            background: active ? `rgba(${rgb},0.18)` : 'rgba(255,255,255,0.04)',
            transition: 'background 0.25s ease',
          }}
        />
      )}

      {/* ── Framer Motion shared-layout sliding background ── */}
      {layoutId && !active && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 'inherit', background: 'rgba(255,255,255,0.04)' }}
        />
      )}
      {layoutId && active && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 'inherit', background: `rgba(${rgb},0.22)` }}
          transition={{ type: 'spring', stiffness: 500, damping: 42 }}
        />
      )}

      {/* ── Animated border via CSS mask ── */}
      <div className="absolute inset-0 pointer-events-none" style={borderStyle} />

      {/* ── Active shimmer sweep over bg ── */}
      {active && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 'inherit',
            background: `linear-gradient(105deg, transparent 25%, rgba(${rgb},0.14) 50%, transparent 75%)`,
            backgroundSize: '250% 100%',
            animation: 'shimmer-slide 3.5s ease-in-out infinite',
          }}
        />
      )}

      {/* ── Icon ── */}
      {icon && (
        <span
          className="relative z-10 flex items-center leading-none"
          style={{
            color: active ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.28)',
            transition: 'color 0.22s ease',
          }}
        >
          {icon}
        </span>
      )}

      {/* ── Label ── */}
      <span
        className="relative z-10 text-[10px] font-bold tracking-wider uppercase leading-none"
        style={{
          color: active ? '#ffffff' : 'rgba(255,255,255,0.38)',
          transition: 'color 0.22s ease',
          textShadow: active ? `0 0 14px rgba(${rgb},0.55)` : 'none',
        }}
      >
        {children}
      </span>
    </motion.button>
  )
}
