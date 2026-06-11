'use client'

import { useEffect } from 'react'
import { getStoredClub } from '@/lib/club-storage'

export default function ClubTheme() {
  useEffect(() => {
    const club = getStoredClub()
    if (!club?.color_primario) return
    const root = document.documentElement
    root.style.setProperty('--club-primary', club.color_primario)
    root.style.setProperty('--club-primary-rgb', club.color_rgb ?? '184, 151, 90')
  }, [])
  return null
}
