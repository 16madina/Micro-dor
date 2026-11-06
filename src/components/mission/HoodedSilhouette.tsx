import { useSvgId } from '../art/Logo'

/**
 * Silhouette encapuchonnée en contre-jour, vue de trois quarts dos,
 * tournée vers la lumière de scène. Purement illustrative.
 */
export default function HoodedSilhouette({ className = '' }: { className?: string }) {
  const id = useSvgId('hood')
  const body =
    'M150 58 C120 58 100 82 98 112 C96 132 102 150 112 162 C86 172 64 196 54 236 L40 320 L260 320 L248 238 C240 198 218 174 192 164 C204 150 210 130 206 108 C202 80 180 58 150 58 Z'
  return (
    <svg viewBox="0 0 300 320" className={className} aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id={`${id}rim`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#F4D78C" stopOpacity=".95" />
          <stop offset=".35" stopColor="#C9B6FF" stopOpacity=".6" />
          <stop offset="1" stopColor="#6837B5" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d0a18" />
          <stop offset="1" stopColor="#030306" />
        </linearGradient>
        <filter id={`${id}blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={`${id}soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>
      {/* halo de contre-jour */}
      <path d={body} fill="none" stroke={`url(#${id}rim)`} strokeWidth="10" opacity=".55" filter={`url(#${id}blur)`} />
      <path d={body} fill="none" stroke={`url(#${id}rim)`} strokeWidth="2.4" filter={`url(#${id}soft)`} />
      <path d={body} fill={`url(#${id}fill)`} />
      {/* ouverture du capuchon et plis */}
      <path d="M120 112 C122 92 138 80 156 82 C176 84 188 102 186 124 C184 142 176 154 164 160" fill="none" stroke="#2a2140" strokeWidth="2" opacity=".9" />
      <path d="M126 118 C132 102 146 94 160 98 C174 104 178 122 172 140 C168 150 160 156 152 158 C136 156 124 140 126 118 Z" fill="#000" opacity=".85" />
      <path d="M112 162 C128 176 170 178 192 164" fill="none" stroke="#2a2140" strokeWidth="2" />
      <path d="M150 180 L148 250" stroke="#2a2140" strokeWidth="1.6" />
      <path d="M140 186 L138 214 M160 186 L161 214" stroke="#3a2f58" strokeWidth="1.4" strokeLinecap="round" />
      {/* reflet doré sur l’épaule */}
      <path d="M200 168 C224 180 242 204 248 238" fill="none" stroke="#F4D78C" strokeWidth="1.6" opacity=".7" filter={`url(#${id}soft)`} />
    </svg>
  )
}
