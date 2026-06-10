'use client'

import { motion } from 'framer-motion'

// Dot grid with animated beam sweep — inspired by Cult UI Grid Beam
export default function AnimatedMesh({ className = '' }: { className?: string }) {
  const COLS = 14
  const ROWS = 22
  const dots = Array.from({ length: COLS * ROWS }, (_, i) => ({
    col: i % COLS,
    row: Math.floor(i / COLS),
  }))

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Sweeping beam gradient */}
          <radialGradient id="beam-glow" cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="rgba(184,151,90,0.18)" />
            <stop offset="100%" stopColor="rgba(184,151,90,0)" />
          </radialGradient>
          {/* Individual dot glow */}
          <radialGradient id="dot-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(184,151,90,0.9)" />
            <stop offset="100%" stopColor="rgba(184,151,90,0)" />
          </radialGradient>
        </defs>

        {/* Static dots */}
        {dots.map(({ col, row }) => (
          <circle
            key={`${col}-${row}`}
            cx={`${(col / (COLS - 1)) * 100}%`}
            cy={`${(row / (ROWS - 1)) * 100}%`}
            r="1.2"
            fill="rgba(255,255,255,0.06)"
          />
        ))}

        {/* Ambient glow overlay */}
        <rect width="100%" height="100%" fill="url(#beam-glow)" />
      </svg>

      {/* Animated beam — pure CSS, no JS overhead */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(184,151,90,0.06) 40%, transparent 60%)',
        }}
        animate={{ y: ['-60%', '120%'] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
      />

      {/* Horizontal sweep */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(184,151,90,0.04) 50%, transparent 100%)',
        }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear', repeatDelay: 3, delay: 4 }}
      />
    </div>
  )
}
