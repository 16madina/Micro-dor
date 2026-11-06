export type Category = 'chant' | 'slam' | 'rap' | 'danse' | 'theatre'
export type ShowStatus = 'live' | 'upcoming' | 'replay'
export type Palette = 'violet' | 'gold' | 'blue' | 'magenta' | 'teal' | 'amber' | 'crimson'
export type SchoolScene = 'city' | 'island' | 'river' | 'stars' | 'modern' | 'mountain' | 'bridge' | 'aurora'
export type HairStyle =
  | 'afro'
  | 'long'
  | 'bun'
  | 'short'
  | 'beanie'
  | 'hood'
  | 'braids'
  | 'curly'
  | 'ponytail'
  | 'fade'

export interface Region {
  id: string
  code: string
  name: string
}

export interface School {
  id: string
  name: string
  shortName: string
  city: string
  regionId: string
  participants: number
  tagline: string
  description: string
  motto: string
  programs: string[]
  accent: string
  accent2: string
  scene: SchoolScene
  palette: Palette
  /** Approx. coordinates for the tour map */
  lat: number
  lon: number
}

export interface PortraitLook {
  skin: string
  hair: HairStyle
  hairColor: string
  top: string
  palette: Palette
}

export interface Performance {
  title: string
  duration: string
  showId: string
}

export interface Talent {
  id: string
  name: string
  schoolId: string
  category: Category
  bio: string
  quote: string
  supports: number
  look: PortraitLook
  influences: string[]
  performances: Performance[]
}

export interface ProgramItem {
  time: string
  label: string
  talentId?: string
}

export interface Show {
  id: string
  title: string
  schoolId: string
  date: string // ISO yyyy-mm-dd
  time: string
  status: ShowStatus
  category: Category | 'mixte'
  lineup: string[]
  program: ProgramItem[]
  description: string
  palette: Palette
  venue: string
  duration: string
}

export type ThemeId = 'criminalite' | 'decrochage' | 'estime' | 'reinsertion'

export interface Theme {
  id: ThemeId
  title: string
  short: string
  description: string
  icon: 'shield' | 'cap' | 'heart' | 'path'
}

export interface Capsule {
  id: string
  theme: ThemeId
  title: string
  format: 'Capsule vidéo' | 'Témoignage (démo)' | 'Conférence' | 'Atelier'
  duration: string
  speaker: string
  summary: string
  palette: Palette
}

export interface PartnerSlot {
  id: string
  tier: string
  brand: string
  tagline: string
  monogram: string
  color: string
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  kind: 'tshirt' | 'cap' | 'hoodie' | 'album' | 'ticket'
  sizes?: string[]
  badge?: string
}
