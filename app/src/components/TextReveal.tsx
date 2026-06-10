'use client'

import { motion } from 'framer-motion'

interface Props {
  text: string
  className?: string
  delay?: number
  stagger?: number
  by?: 'word' | 'char'
}

export default function TextReveal({ text, className = '', delay = 0, stagger = 0.06, by = 'word' }: Props) {
  const units = by === 'word' ? text.split(' ') : text.split('')

  return (
    <span className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`} aria-label={text}>
      {units.map((unit, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
        >
          {unit}
        </motion.span>
      ))}
    </span>
  )
}
