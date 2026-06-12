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
 * Universal pill / chip / tab.
 * Inactive: static gradient border lit from top-left corner (no animation).
 * Active:   spinning comet orbiting the border perimeter (conic-gradient + spin-beam).
 * Transition: Framer Motion layoutId spring for sliding background.
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

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.91 }}
      className={`relative flex-shrink-0 overflow-hidden select-none
        ${isCol ? 'flex flex-col items-center gap-1' : 'flex flex-row items-center gap-1.5'}
        ${className}`}
      style={{
        borderRadius,
        padding: `${py} ${px}`,
        boxShadow: active
          ? `0 0 24px rgba(${rgb},0.32), 0 0 0 0.5px rgba(${rgb},0.15)`
          : 'none',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* ── Base background ── */}
      {!layoutId && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 'inherit',
            background: active ? `rgba(${rgb},0.16)` : 'rgba(255,255,255,0.04)',
            transition: 'background 0.25s ease',
          }}
        />
      )}

      {/* ── Framer Motion shared-layout sliding bg (segment controls) ── */}
      {layoutId && !active && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 'inherit', background: 'rgba(255,255,255,0.04)' }} />
      )}
      {layoutId && active && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: 'inherit', background: `rgba(${rgb},0.20)` }}
          transition={{ type: 'spring', stiffness: 500, damping: 42 }}
        />
      )}

      {/* ── INACTIVE border: static gradient lit from top-left ── */}
      {!active && (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <div className="absolute inset-0 pointer-events-none" style={{
          borderRadius: 'inherit',
          padding: '1px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.10) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        } as any} />
      )}

      {/* ── ACTIVE border: spinning comet orbiting the perimeter ── */}
      {active && (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <div className="absolute inset-0 pointer-events-none" style={{
          borderRadius: 'inherit',
          padding: '1px',
          overflow: 'hidden',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
        } as any}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `conic-gradient(
              transparent 180deg,
              rgba(${rgb},0.15) 240deg,
              rgba(${rgb},0.85) 285deg,
              rgba(255,255,255,0.9) 305deg,
              rgba(${rgb},0.75) 325deg,
              transparent 360deg
            )`,
            animation: 'spin-beam 2.5s linear infinite',
          }} />
        </div>
      )}

      {/* ── Icon ── */}
      {icon && (
        <span className="relative z-10 flex items-center leading-none"
          style={{
            color: active ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.28)',
            transition: 'color 0.22s ease',
          }}>
          {icon}
        </span>
      )}

      {/* ── Label ── */}
      <span
        className="relative z-10 text-[10px] font-bold tracking-wider uppercase leading-none"
        style={{
          color: active ? '#ffffff' : 'rgba(255,255,255,0.38)',
          transition: 'color 0.22s ease',
          textShadow: active ? `0 0 14px rgba(${rgb},0.6)` : 'none',
        }}
      >
        {children}
      </span>
    </motion.button>
  )
}
