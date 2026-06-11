export type ClubStored = {
  id: string
  nombre: string
  iniciales: string
  gradiente: string[]
  color_primario: string
  color_rgb: string
  logo_url?: string | null
}

const KEY = 'delclub_club'

export function getStoredClub(): ClubStored | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setStoredClub(club: ClubStored) {
  localStorage.setItem(KEY, JSON.stringify(club))
}

export function clearStoredClub() {
  localStorage.removeItem(KEY)
}

// Derive initials from club name (e.g. "Club Carrasco" → "CC")
export function getIniciales(nombre: string): string {
  return nombre
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || nombre.slice(0, 2).toUpperCase()
}

// Assign a gradient palette per club based on position
const GRADIENTS = [
  ['#1A3A5C', '#2E6BA8', '#6BAED6'],  // azul
  ['#1A3A1A', '#2E7A2E', '#52C97A'],  // verde
  ['#5C1A1A', '#8A2E2E', '#E07070'],  // rojo
  ['#2A1A4A', '#6A2E8A', '#B07AE0'],  // violeta
  ['#3A2A1A', '#8A6A2A', '#C9A86C'],  // dorado
  ['#1A3A3A', '#2E7A7A', '#52C9C9'],  // teal
]

export function getClubGradient(index: number): string[] {
  return GRADIENTS[index % GRADIENTS.length]
}
