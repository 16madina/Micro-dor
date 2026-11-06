import type { Palette } from '../../data/types'

export interface PaletteDef {
  top: string
  mid: string
  glow: string
  beam: string
  beam2: string
  rim: string
}

export const PALETTES: Record<Palette, PaletteDef> = {
  violet: { top: '#07060f', mid: '#2a1450', glow: '#7b3fe0', beam: '#b98cff', beam2: '#F4D78C', rim: '#d9b8ff' },
  gold: { top: '#0a0805', mid: '#3a2608', glow: '#d6923a', beam: '#ffe0a0', beam2: '#ffb347', rim: '#F4D78C' },
  blue: { top: '#04070f', mid: '#0e2552', glow: '#2f6be0', beam: '#8fd0ff', beam2: '#c4a0ff', rim: '#9fdcff' },
  magenta: { top: '#0a0510', mid: '#3a0f45', glow: '#c03aa8', beam: '#ff9be6', beam2: '#9b6be8', rim: '#ffc2ef' },
  teal: { top: '#040c0c', mid: '#0b3338', glow: '#18a39a', beam: '#8ff5e2', beam2: '#b98cff', rim: '#a8fff0' },
  amber: { top: '#0c0605', mid: '#40180c', glow: '#e0602f', beam: '#ffc08a', beam2: '#ff7ab0', rim: '#ffd4a8' },
  crimson: { top: '#0c0407', mid: '#3e0c1c', glow: '#d0284c', beam: '#ff9aae', beam2: '#F4D78C', rim: '#ffc0cc' },
}

export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashStr(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
