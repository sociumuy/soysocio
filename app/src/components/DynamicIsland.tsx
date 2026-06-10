'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  clubNombre: string
  cuotaAlDia: boolean
  socioCat: string
}

export default function DynamicIsland({ clubNombre, cuotaAlDia, socioCat }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="fixed top-3 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <motion.div
        onClick={() => setExpanded(v => !v)}
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        className="pointer-events-auto cursor-pointer overflow-hidden"
        style={{
          background: 'rgba(10,10,10,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: expanded ? 22 : 999,
          boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        <AnimatePresence mode="wait">
          {!expanded ? (
            /* ── Collapsed pill ── */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2.5 px-4 py-2"
            >
              {/* Status dot */}
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: cuotaAlDia ? '#34d399' : '#f87171' }}
              />
              <span className="text-white text-[11px] font-semibold tracking-wide">{clubNombre}</span>
              <span className="text-[#444] text-[10px]">·</span>
              <span className="text-[10px] font-medium" style={{ color: cuotaAlDia ? '#34d399' : '#f87171' }}>
                {cuotaAlDia ? 'Al día' : 'Cuota pendiente'}
              </span>
            </motion.div>
          ) : (
            /* ── Expanded island ── */
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.08 }}
              className="px-5 py-4 w-72"
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full"
                    style={{ background: cuotaAlDia ? '#34d399' : '#f87171' }}
                  />
                  <span className="text-white text-xs font-bold">{clubNombre}</span>
                </div>
                <span className="text-[#444] text-[10px]">toca para cerrar</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/8 mb-3" />

              {/* Content rows */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#666] text-[11px]">Categoría</span>
                  <span className="text-white text-[11px] font-semibold">{socioCat}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#666] text-[11px]">Estado cuota</span>
                  <span className="text-[11px] font-bold" style={{ color: cuotaAlDia ? '#34d399' : '#f87171' }}>
                    {cuotaAlDia ? '✓ Al día' : '⚠ Pendiente'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#666] text-[11px]">Cuota mensual</span>
                  <span className="text-white text-[11px] font-semibold">$2.400 UYU</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
