import type { Product } from '../../data/types'
import { useSvgId } from './Logo'

/** Maquettes de produits dérivés (vectorielles) */
export default function ProductArt({ kind, className = '' }: { kind: Product['kind']; className?: string }) {
  const id = useSvgId('pr')
  const gold = `url(#${id}g)`
  const fabric = `url(#${id}f)`
  const logo = (x: number, y: number, s: number) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <image href="brand/logo-sm.webp" x="-11" y="-20" width="22" height="34" preserveAspectRatio="xMidYMid meet" />
      <text x="0" y="24" textAnchor="middle" fontFamily="Bebas Neue, sans-serif" fontSize="11" fill={gold} letterSpacing=".5">
        MICRO D’OR
      </text>
    </g>
  )
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF2C6" />
          <stop offset=".5" stopColor="#D6AC55" />
          <stop offset="1" stopColor="#9C7629" />
        </linearGradient>
        <linearGradient id={`${id}f`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2a34" />
          <stop offset=".6" stopColor="#111118" />
          <stop offset="1" stopColor="#050508" />
        </linearGradient>
        <radialGradient id={`${id}bg`} cx=".5" cy=".4" r=".7">
          <stop offset="0" stopColor="#2a1f45" />
          <stop offset="1" stopColor="#0c0e18" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${id}bg)`} />
      <ellipse cx="100" cy="182" rx="70" ry="8" fill="#000" opacity=".5" />
      {kind === 'tshirt' && (
        <g>
          <path d="M62,40 L82,30 Q100,42 118,30 L138,40 L166,66 L148,86 L136,76 L136,172 L64,172 L64,76 L52,86 L34,66Z" fill={fabric} stroke="#3a3a48" />
          <path d="M82,30 Q100,46 118,30" fill="none" stroke="#444" strokeWidth="2" />
          {logo(100, 92, 1.5)}
        </g>
      )}
      {kind === 'hoodie' && (
        <g>
          <path d="M70,46 Q100,14 130,46 L162,70 L172,150 L150,152 L140,96 L140,176 L60,176 L60,96 L50,152 L28,150 L38,70Z" fill={fabric} stroke="#3a3a48" />
          <path d="M78,48 Q100,26 122,48 Q112,66 100,66 Q88,66 78,48Z" fill="#08080c" />
          <line x1="94" y1="66" x2="92" y2="92" stroke="#D6AC55" strokeWidth="1.5" />
          <line x1="106" y1="66" x2="108" y2="92" stroke="#D6AC55" strokeWidth="1.5" />
          <path d="M72,140 L128,140 L124,166 L76,166Z" fill="#0b0b10" stroke="#2a2a34" />
          {logo(100, 104, 1.2)}
        </g>
      )}
      {kind === 'cap' && (
        <g>
          <path d="M44,120 Q44,58 100,56 Q156,58 156,120Z" fill={fabric} stroke="#3a3a48" />
          <path d="M40,120 Q100,108 172,124 Q182,138 160,140 Q100,128 40,134Z" fill="#0b0b10" stroke="#3a3a48" />
          <circle cx="100" cy="58" r="4" fill="#D6AC55" />
          <path d="M100,58 L100,120" stroke="#2a2a34" />
          {logo(100, 86, 1.1)}
        </g>
      )}
      {kind === 'album' && (
        <g>
          <circle cx="128" cy="100" r="58" fill="#050508" />
          <circle cx="128" cy="100" r="40" fill="none" stroke="#222" />
          <circle cx="128" cy="100" r="14" fill={gold} />
          <rect x="34" y="40" width="120" height="120" rx="4" fill="#120c22" stroke={gold} />
          <polygon points="94,40 100,40 140,160 54,160" fill="#F4D78C" opacity=".18" />
          {logo(94, 92, 1.5)}
          <text x="94" y="150" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff" opacity=".7" letterSpacing="1.5">
            TALENTS 2026
          </text>
        </g>
      )}
      {kind === 'ticket' && (
        <g transform="rotate(-8 100 100)">
          <path d="M26,64 L174,64 L174,88 Q164,100 174,112 L174,136 L26,136 L26,112 Q36,100 26,88Z" fill="#14101f" stroke={gold} strokeWidth="1.5" />
          <line x1="132" y1="68" x2="132" y2="132" stroke="#D6AC55" strokeDasharray="3 3" />
          {logo(76, 92, 1.1)}
          <text x="153" y="96" textAnchor="middle" fontSize="7" fill="#F4D78C" fontWeight="800">
            ADMIS
          </text>
          <text x="153" y="110" textAnchor="middle" fontSize="6" fill="#fff" opacity=".6">
            DÉMO
          </text>
        </g>
      )}
    </svg>
  )
}
