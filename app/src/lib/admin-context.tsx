'use client'

import { createContext, useContext } from 'react'

export type RolAdmin = 'director' | 'tesorero' | 'secretaria' | 'recepcion' | 'comunicacion'

export type AdminData = {
  id: string
  nombre: string
  apellido: string
  rol: RolAdmin
}

export const ROL_ACCESO: Record<RolAdmin, string[]> = {
  director:     ['dashboard', 'socios', 'pagos', 'novedades', 'reservas'],
  tesorero:     ['dashboard', 'pagos'],
  secretaria:   ['dashboard', 'socios'],
  recepcion:    ['reservas', 'socios'],
  comunicacion: ['novedades'],
}

export const ROL_LABEL: Record<RolAdmin, string> = {
  director:     'Director',
  tesorero:     'Tesorero/a',
  secretaria:   'Secretaría',
  recepcion:    'Recepción',
  comunicacion: 'Comunicación',
}

export const AdminContext = createContext<AdminData | null>(null)

export function useAdmin() {
  return useContext(AdminContext)
}

export function tieneAcceso(rol: RolAdmin, seccion: string) {
  return ROL_ACCESO[rol]?.includes(seccion) ?? false
}
