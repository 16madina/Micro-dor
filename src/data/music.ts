/**
 * Catalogue « Nos musiques » — instrumentaux de démonstration.
 * Dans la vraie application, ces fichiers seront téléversés par l’équipe MICRO D’OR.
 * Ici, chaque morceau est synthétisé en direct dans le navigateur (aucun fichier audio).
 */
import type { Category } from './types'

export type Drums = 'boombap' | 'trap' | 'pop' | 'afro' | 'none'
export type Keys = 'piano' | 'pad' | 'pluck' | 'guitar'

export interface SynthSpec {
  bpm: number
  /** note fondamentale (MIDI) */
  root: number
  scale: 'major' | 'minor'
  /** degrés de la gamme, un accord par mesure */
  prog: number[]
  drums: Drums
  keys: Keys
}

export interface MusicTrack {
  id: string
  title: string
  discipline: Category
  style: string
  keyLabel: string
  /** durée en secondes */
  duration: number
  mood: string[]
  color: [string, string]
  synth?: SynthSpec
  /** fichier téléversé (session en cours) */
  url?: string
  uploaded?: boolean
  addedOn: string
}

export const MUSIC: MusicTrack[] = [
  {
    id: 'm1',
    title: 'Lumière d’or',
    discipline: 'chant',
    style: 'Pop soul',
    keyLabel: 'Ré mineur',
    duration: 172,
    mood: ['Émotion', 'Ballade'],
    color: ['#F4D78C', '#9C7629'],
    synth: { bpm: 78, root: 50, scale: 'minor', prog: [0, 5, 2, 6], drums: 'pop', keys: 'piano' },
    addedOn: '2026-10-28',
  },
  {
    id: 'm2',
    title: 'Le bon chemin',
    discipline: 'rap',
    style: 'Boom bap',
    keyLabel: 'La mineur',
    duration: 168,
    mood: ['Conscient', 'Old school'],
    color: ['#FF7A8A', '#7A1E3A'],
    synth: { bpm: 90, root: 45, scale: 'minor', prog: [0, 0, 5, 4], drums: 'boombap', keys: 'piano' },
    addedOn: '2026-10-21',
  },
  {
    id: 'm3',
    title: 'Altitude',
    discipline: 'rap',
    style: 'Trap mélodique',
    keyLabel: 'Fa# mineur',
    duration: 156,
    mood: ['Énergie', 'Moderne'],
    color: ['#C9B6FF', '#3B2A8F'],
    synth: { bpm: 140, root: 42, scale: 'minor', prog: [0, 5, 3, 4], drums: 'trap', keys: 'pluck' },
    addedOn: '2026-11-02',
  },
  {
    id: 'm4',
    title: 'Marée haute',
    discipline: 'slam',
    style: 'Nappe atmosphérique',
    keyLabel: 'Mi mineur',
    duration: 190,
    mood: ['Calme', 'Introspectif'],
    color: ['#5CC8E8', '#2B4FA8'],
    synth: { bpm: 70, root: 40, scale: 'minor', prog: [0, 3, 5, 4], drums: 'none', keys: 'pad' },
    addedOn: '2026-10-14',
  },
  {
    id: 'm5',
    title: 'Respire',
    discipline: 'chant',
    style: 'Folk acoustique',
    keyLabel: 'Sol majeur',
    duration: 180,
    mood: ['Lumineux', 'Doux'],
    color: ['#8BF5A6', '#147A6B'],
    synth: { bpm: 96, root: 43, scale: 'major', prog: [0, 4, 5, 3], drums: 'pop', keys: 'guitar' },
    addedOn: '2026-10-30',
  },
  {
    id: 'm6',
    title: 'Choisir ses pas',
    discipline: 'danse',
    style: 'Afro dance',
    keyLabel: 'Do mineur',
    duration: 164,
    mood: ['Groove', 'Festif'],
    color: ['#FF9F5A', '#B4366E'],
    synth: { bpm: 108, root: 48, scale: 'minor', prog: [0, 3, 4, 3], drums: 'afro', keys: 'pluck' },
    addedOn: '2026-11-03',
  },
  {
    id: 'm7',
    title: 'Fjord',
    discipline: 'danse',
    style: 'Contemporain',
    keyLabel: 'Si mineur',
    duration: 200,
    mood: ['Cinématique', 'Lent'],
    color: ['#7CF0C2', '#0B3338'],
    synth: { bpm: 72, root: 47, scale: 'minor', prog: [0, 5, 6, 4], drums: 'none', keys: 'piano' },
    addedOn: '2026-10-19',
  },
  {
    id: 'm8',
    title: 'Battle de l’Horizon',
    discipline: 'danse',
    style: 'Hip-hop / breakdance',
    keyLabel: 'Ré mineur',
    duration: 150,
    mood: ['Battle', 'Puissant'],
    color: ['#F2C14E', '#8A3B12'],
    synth: { bpm: 98, root: 38, scale: 'minor', prog: [0, 0, 3, 4], drums: 'boombap', keys: 'pluck' },
    addedOn: '2026-11-04',
  },
  {
    id: 'm9',
    title: 'Rideau rouge',
    discipline: 'theatre',
    style: 'Ambiance de scène',
    keyLabel: 'Fa majeur',
    duration: 120,
    mood: ['Suspense', 'Entrée en scène'],
    color: ['#FF7A8A', '#3E0C1C'],
    synth: { bpm: 64, root: 41, scale: 'major', prog: [0, 3, 1, 4], drums: 'none', keys: 'pad' },
    addedOn: '2026-10-09',
  },
  {
    id: 'm10',
    title: 'Ondes courtes',
    discipline: 'theatre',
    style: 'Comédie / impro',
    keyLabel: 'Do majeur',
    duration: 110,
    mood: ['Léger', 'Rythmé'],
    color: ['#ffc08a', '#40180c'],
    synth: { bpm: 118, root: 48, scale: 'major', prog: [0, 5, 3, 4], drums: 'pop', keys: 'pluck' },
    addedOn: '2026-10-25',
  },
  {
    id: 'm11',
    title: 'Juste assez',
    discipline: 'slam',
    style: 'Piano minimal',
    keyLabel: 'La mineur',
    duration: 167,
    mood: ['Intime', 'Texte en avant'],
    color: ['#C9B6FF', '#2a1450'],
    synth: { bpm: 80, root: 45, scale: 'minor', prog: [0, 5, 2, 4], drums: 'none', keys: 'piano' },
    addedOn: '2026-11-01',
  },
  {
    id: 'm12',
    title: 'Deuxième prise',
    discipline: 'rap',
    style: 'Lo-fi',
    keyLabel: 'Mi bémol majeur',
    duration: 176,
    mood: ['Chill', 'Réflexion'],
    color: ['#9fdcff', '#0e2552'],
    synth: { bpm: 84, root: 39, scale: 'major', prog: [1, 4, 0, 5], drums: 'boombap', keys: 'pad' },
    addedOn: '2026-10-17',
  },
]

export const fmtDuration = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
