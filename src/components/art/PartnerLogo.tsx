import type { ReactNode } from 'react'
import { useSvgId } from './Logo'

/**
 * Logos de marques FICTIVES (exemples de présentation).
 * Conçus pour l’occasion : aucune ressemblance voulue avec une marque existante.
 */

type Mark = (id: string) => ReactNode

const MARKS: Record<string, Mark> = {
  // Fondation Aurore — lever de soleil en arcs
  p1: (id) => (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#F59E0B" />
          <stop offset=".55" stopColor="#EC4899" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path d="M6 44 A26 26 0 0 1 58 44" fill="none" stroke={`url(#${id})`} strokeWidth="5" strokeLinecap="round" />
      <path d="M14 44 A18 18 0 0 1 50 44" fill="none" stroke={`url(#${id})`} strokeWidth="5" strokeLinecap="round" opacity=".85" />
      <path d="M22 44 A10 10 0 0 1 42 44 Z" fill={`url(#${id})`} />
      <rect x="4" y="49" width="56" height="4" rx="2" fill="#1F2140" />
    </>
  ),
  // Caisse Boréale — sapin en chevrons + étoile du Nord
  p2: () => (
    <>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#0E5E54" />
      <path d="M32 14 L44 27 H20 Z" fill="#7CF0C2" />
      <path d="M32 22 L48 38 H16 Z" fill="#3CCB9A" />
      <path d="M32 31 L52 50 H12 Z" fill="#1FA37A" />
      <rect x="29.5" y="50" width="5" height="6" rx="1" fill="#7CF0C2" />
      <path d="M50 9 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6 Z" fill="#F4D78C" />
    </>
  ),
  // Énergie Rivière-Nord — goutte, vague et éclair
  p3: (id) => (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38BDF8" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
      <path d="M32 4 C32 4 12 28 12 40 A20 20 0 0 0 52 40 C52 28 32 4 32 4 Z" fill={`url(#${id})`} />
      <path d="M15 42 C21 37 26 47 32 42 S43 37 49 42" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" opacity=".9" />
      <path d="M34 16 L26 31 H32 L29 41 L39 26 H33 Z" fill="#FDE047" />
    </>
  ),
  // Coop Jeunes Pousses — pousse dans un cercle
  p4: () => (
    <>
      <circle cx="32" cy="32" r="29" fill="#16A34A" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="#BEF264" strokeWidth="2" opacity=".5" />
      <path d="M32 50 V30" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M32 32 C32 22 24 16 15 17 C15 27 22 33 32 32 Z" fill="#BEF264" />
      <path d="M32 28 C32 19 39 13 49 14 C49 24 42 29 32 28 Z" fill="#fff" />
      <path d="M22 50 H42" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".7" />
    </>
  ),
  // Onde Laurentienne Radio — ondes de diffusion
  p5: (id) => (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F97316" />
          <stop offset="1" stopColor="#E11D48" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="32" r="8" fill={`url(#${id})`} />
      <path d="M30 18 A20 20 0 0 1 30 46" fill="none" stroke={`url(#${id})`} strokeWidth="5" strokeLinecap="round" />
      <path d="M40 10 A30 30 0 0 1 40 54" fill="none" stroke={`url(#${id})`} strokeWidth="5" strokeLinecap="round" opacity=".75" />
      <path d="M50 4 A40 40 0 0 1 50 60" fill="none" stroke={`url(#${id})`} strokeWidth="5" strokeLinecap="round" opacity=".45" />
    </>
  ),
  // Studio Lumen Son — diaphragme lumineux + barres de son
  p6: (id) => (
    <>
      <defs>
        <radialGradient id={id} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#5B21B6" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill={`url(#${id})`} />
      {[
        [17, 10],
        [24, 18],
        [31, 26],
        [38, 16],
        [45, 8],
      ].map(([x, h]) => (
        <rect key={x} x={x} y={32 - h / 2} width="4.5" height={h} rx="2.25" fill="#fff" />
      ))}
      <circle cx="32" cy="32" r="22" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="3 4" />
    </>
  ),
}

const WORDS: Record<string, (dark: boolean) => ReactNode> = {
  p1: (d) => (
    <>
      <text x="78" y="30" fontFamily="Manrope, sans-serif" fontWeight="600" fontSize="12" letterSpacing="4" fill={d ? '#5B5E7A' : '#C9C3E6'}>
        FONDATION
      </text>
      <text x="76" y="58" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="30" letterSpacing="3" fill={d ? '#1F2140' : '#fff'}>
        AURORE
      </text>
    </>
  ),
  p2: (d) => (
    <>
      <text x="78" y="44" fontFamily="Manrope, sans-serif" fontWeight="500" fontSize="25" fill={d ? '#334155' : '#E2E8F0'}>
        caisse
        <tspan fontWeight="800" fill={d ? '#0E5E54' : '#7CF0C2'}> boréale</tspan>
      </text>
    </>
  ),
  p3: (d) => (
    <>
      <text x="78" y="28" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="11" letterSpacing="5" fill={d ? '#0284C7' : '#7DD3FC'}>
        ÉNERGIE
      </text>
      <text x="77" y="54" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="25" letterSpacing="-.5" fill={d ? '#0F2A5C' : '#fff'}>
        Rivière-Nord
      </text>
    </>
  ),
  p4: (d) => (
    <>
      <rect x="78" y="14" width="40" height="17" rx="8.5" fill={d ? '#16A34A' : '#BEF264'} />
      <text x="98" y="27" textAnchor="middle" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="11" letterSpacing="1.5" fill={d ? '#fff' : '#14532D'}>
        COOP
      </text>
      <text x="77" y="56" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="23" fill={d ? '#14532D' : '#fff'}>
        jeunes pousses
      </text>
    </>
  ),
  p5: (d) => (
    <>
      <text x="76" y="46" fontFamily="'Bebas Neue', Impact, sans-serif" fontSize="40" letterSpacing="1.5" fill={d ? '#9F1239' : '#fff'}>
        ONDE
      </text>
      <text x="152" y="32" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="11" letterSpacing="2" fill={d ? '#475569' : '#FECDD3'}>
        LAURENTIENNE
      </text>
      <text x="152" y="47" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="11" letterSpacing="2" fill={d ? '#E11D48' : '#FB7185'}>
        RADIO
      </text>
    </>
  ),
  p6: (d) => (
    <>
      <text x="78" y="44" fontFamily="Manrope, sans-serif" fontWeight="800" fontSize="28" letterSpacing="6" fill={d ? '#2E1065' : '#fff'}>
        LUMEN
      </text>
      <text x="80" y="60" fontFamily="Manrope, sans-serif" fontWeight="600" fontSize="10.5" letterSpacing="3.2" fill={d ? '#7C3AED' : '#C4B5FD'}>
        STUDIO · SON
      </text>
    </>
  ),
}

/** Symbole seul */
export function PartnerMark({ id, size = 40, className = '' }: { id: string; size?: number; className?: string }) {
  const gid = useSvgId('pm' + id)
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={`shrink-0 ${className}`} aria-hidden="true">
      {MARKS[id]?.(gid)}
    </svg>
  )
}

/** Logo complet (symbole + nom). `tone="dark"` pour fond clair, `"light"` pour fond sombre. */
export function PartnerLogo({
  id,
  brand,
  tone = 'dark',
  className = '',
}: {
  id: string
  brand: string
  tone?: 'dark' | 'light'
  className?: string
}) {
  const gid = useSvgId('pl' + id)
  return (
    <svg viewBox="0 0 250 72" className={className} role="img" aria-label={`${brand} (marque fictive)`}>
      <g transform="translate(4 4)">{MARKS[id]?.(gid)}</g>
      {WORDS[id]?.(tone === 'dark')}
    </svg>
  )
}
