'use client'

import { motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  onClick?: (e?: React.MouseEvent) => void
  className?: string
  disabled?: boolean
}

export default function BorderBeamButton({ children, onClick, className = '', disabled }: Props) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden rounded-xl py-3 text-xs font-bold tracking-widest uppercase text-white transition-opacity disabled:opacity-50 ${className}`}
      style={{ background: '#B8975A' }}
    >
      {/* rotating beam */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          background: 'conic-gradient(from var(--beam-angle, 0deg), transparent 70%, rgba(255,255,255,0.7) 80%, transparent 90%)',
          animation: 'beam-spin 2.4s linear infinite',
        }}
      />
      {/* inner mask */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[2px] rounded-[10px]"
        style={{ background: '#B8975A' }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>

      <style>{`
        @keyframes beam-spin {
          from { --beam-angle: 0deg; }
          to   { --beam-angle: 360deg; }
        }
        @property --beam-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
      `}</style>
    </motion.button>
  )
}
