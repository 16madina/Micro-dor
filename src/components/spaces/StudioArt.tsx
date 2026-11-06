import { useSvgId } from '../art/Logo'

/** Studio d’enregistrement illustré : micro à condensateur, filtre anti-pop et casque (visuel fictif) */
export default function StudioArt({ className = '', recording = false }: { className?: string; recording?: boolean }) {
  const id = useSvgId('studio')
  const g = `url(#${id}gold)`
  const foam = Array.from({ length: 5 }, (_, r) => Array.from({ length: 4 }, (_, c) => ({ r, c }))).flat()
  return (
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120c26" />
          <stop offset=".7" stopColor="#0b0a18" />
          <stop offset="1" stopColor="#06060c" />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx=".62" cy=".3" r=".55">
          <stop offset="0" stopColor="#9B6BE8" stopOpacity=".55" />
          <stop offset=".5" stopColor="#6837B5" stopOpacity=".18" />
          <stop offset="1" stopColor="#6837B5" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}warm`} cx=".18" cy=".95" r=".5">
          <stop offset="0" stopColor="#D6AC55" stopOpacity=".28" />
          <stop offset="1" stopColor="#D6AC55" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF2C6" />
          <stop offset=".45" stopColor="#D6AC55" />
          <stop offset="1" stopColor="#8A6420" />
        </linearGradient>
        <linearGradient id={`${id}body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1b1b24" />
          <stop offset=".35" stopColor="#4a4a58" />
          <stop offset=".55" stopColor="#2a2a34" />
          <stop offset="1" stopColor="#0e0e14" />
        </linearGradient>
        <linearGradient id={`${id}grille`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2c2c38" />
          <stop offset=".4" stopColor="#8d8da0" />
          <stop offset=".6" stopColor="#50505e" />
          <stop offset="1" stopColor="#1a1a22" />
        </linearGradient>
        <linearGradient id={`${id}beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9B6FF" stopOpacity=".35" />
          <stop offset="1" stopColor="#C9B6FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}desk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a1626" />
          <stop offset="1" stopColor="#07070c" />
        </linearGradient>
        <pattern id={`${id}mesh`} width="3" height="3" patternUnits="userSpaceOnUse">
          <path d="M0 0L3 3M3 0L0 3" stroke="#C9B6FF" strokeOpacity=".22" strokeWidth=".5" />
        </pattern>
      </defs>

      <rect width="400" height="250" fill={`url(#${id}bg)`} />
      <rect width="400" height="250" fill={`url(#${id}glow)`} />

      {/* Panneaux acoustiques */}
      <g opacity=".75">
        {foam.map(({ r, c }) => (
          <g key={`${r}-${c}`} transform={`translate(${18 + c * 30} ${22 + r * 30})`}>
            <rect width="27" height="27" rx="2" fill="#15112a" stroke="#2a2148" strokeWidth=".8" />
            {(r + c) % 2 === 0
              ? [5, 11, 17, 23].map((x) => <line key={x} x1={x} y1="3" x2={x} y2="24" stroke="#2f2652" strokeWidth="2.2" />)
              : [5, 11, 17, 23].map((y) => <line key={y} x1="3" y1={y} x2="24" y2={y} stroke="#2f2652" strokeWidth="2.2" />)}
          </g>
        ))}
      </g>

      {/* Faisceaux */}
      <g className="origin-top animate-haze">
        <polygon points="250,0 268,0 330,250 190,250" fill={`url(#${id}beam)`} opacity=".55" />
        <polygon points="300,0 310,0 400,210 330,250" fill={`url(#${id}beam)`} opacity=".3" />
      </g>

      {/* Bokeh */}
      {[
        [170, 40, 6],
        [205, 22, 3],
        [355, 40, 5],
        [380, 90, 8],
        [150, 120, 3],
        [300, 30, 4],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#F4D78C' : '#C9B6FF'} opacity=".25" />
      ))}

      {/* Enseigne « En ondes » */}
      <g transform="translate(150 16)">
        <rect width="64" height="18" rx="4" fill={recording ? '#E5384F' : '#2a1820'} stroke={recording ? '#ff8a9a' : '#4a2a34'} strokeWidth=".8" />
        {recording && <rect width="64" height="18" rx="4" fill="#E5384F" opacity=".5" style={{ filter: 'blur(6px)' }} />}
        <text x="32" y="12.8" textAnchor="middle" fontFamily="Bebas Neue, sans-serif" fontSize="11" letterSpacing="1.2" fill={recording ? '#fff' : '#7a4a56'}>
          EN ONDES
        </text>
      </g>

      {/* Pied de micro */}
      <line x1="262" y1="250" x2="262" y2="122" stroke="#2b2b36" strokeWidth="5" />
      <line x1="262" y1="250" x2="262" y2="122" stroke="#5a5a6a" strokeWidth="1.2" />
      <line x1="262" y1="124" x2="236" y2="112" stroke="#2b2b36" strokeWidth="4" />
      <circle cx="262" cy="124" r="4" fill={g} />

      {/* Filtre anti-pop */}
      <path d="M262 132 C 230 150, 200 140, 196 112" fill="none" stroke="#3a3a48" strokeWidth="2" />
      <circle cx="190" cy="90" r="25" fill="#0c0b16" opacity=".55" />
      <circle cx="190" cy="90" r="25" fill={`url(#${id}mesh)`} />
      <circle cx="190" cy="90" r="25" fill="none" stroke="#3d3d4c" strokeWidth="3" />

      {/* Micro à condensateur */}
      <g transform="rotate(-8 232 80)">
        <ellipse cx="232" cy="96" rx="27" ry="34" fill="none" stroke="#3a3a46" strokeWidth="2.2" />
        <rect x="214" y="34" width="36" height="74" rx="18" fill={`url(#${id}body)`} />
        <path d="M214 70 V52 a18 18 0 0 1 36 0 V70 Z" fill={`url(#${id}grille)`} />
        {[42, 47, 52, 57, 62, 67].map((y) => (
          <line key={y} x1="215" y1={y} x2="249" y2={y} stroke="#15151c" strokeWidth=".8" opacity=".7" />
        ))}
        {[222, 228, 234, 240].map((x) => (
          <line key={x} x1={x} y1="36" x2={x} y2="70" stroke="#15151c" strokeWidth=".6" opacity=".45" />
        ))}
        <rect x="213" y="69" width="38" height="5" rx="1.5" fill={g} />
        <circle cx="232" cy="88" r="3" fill={g} />
        <rect x="226" y="108" width="12" height="10" rx="2" fill="#1a1a22" />
        <path d="M222 44 Q 226 38 232 37" stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" fill="none" />
      </g>

      {/* Casque suspendu */}
      <g transform="translate(330 96)">
        <line x1="0" y1="-30" x2="0" y2="-8" stroke="#3a3a46" strokeWidth="2" />
        <path d="M-26 40 C -30 -14, 30 -14, 26 40" fill="none" stroke="#24242e" strokeWidth="7" strokeLinecap="round" />
        <path d="M-26 40 C -30 -14, 30 -14, 26 40" fill="none" stroke={g} strokeWidth="1.4" opacity=".75" />
        <rect x="-36" y="34" width="18" height="30" rx="8" fill="#17171f" stroke={g} strokeWidth="1.2" />
        <rect x="18" y="34" width="18" height="30" rx="8" fill="#17171f" stroke={g} strokeWidth="1.2" />
        <rect x="-32" y="40" width="10" height="18" rx="5" fill="#2a2a36" />
        <rect x="22" y="40" width="10" height="18" rx="5" fill="#2a2a36" />
        <path d="M-27 64 C -20 90, 10 92, 20 110" fill="none" stroke="#1d1d26" strokeWidth="1.6" />
      </g>

      {/* Console */}
      <rect y="206" width="400" height="44" fill={`url(#${id}desk)`} />
      <rect y="205" width="400" height="1.4" fill={g} opacity=".6" />
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i} transform={`translate(${22 + i * 16} 214)`}>
          <circle r="3.2" fill="#24202f" stroke="#4a4060" strokeWidth=".6" />
          <rect x="-1.2" y="8" width="2.4" height="20" rx="1" fill="#120f1c" />
          <rect x="-4" y={12 + ((i * 7) % 12)} width="8" height="4" rx="1" fill={i % 3 === 0 ? '#D6AC55' : '#6a6280'} />
        </g>
      ))}
      <rect width="400" height="250" fill={`url(#${id}warm)`} />
      {/* VU-mètres */}
      <g transform="translate(160 220)">
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={i * 6} y="0" width="4" height="10" rx="1" fill={i > 7 ? '#E5384F' : i > 5 ? '#F4D78C' : '#7CF0C2'} opacity={recording ? 0.95 : i < 4 ? 0.6 : 0.15} />
        ))}
      </g>
    </svg>
  )
}
