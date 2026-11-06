import { useMemo } from 'react'
import type { Category, PortraitLook } from '../../data/types'
import { useSvgId } from './Logo'
import { PALETTES, hashStr, mulberry32 } from './palettes'
import { PHOTOS, hasTalentPhoto } from '../../data'

function shade(hex: string, f: number) {
  const n = parseInt(hex.slice(1), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    Math.max(0, Math.min(255, Math.round(f >= 0 ? v + (255 - v) * f : v * (1 + f)))),
  )
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('')
}

interface PortraitProps {
  look: PortraitLook
  category: Category
  seed: string
  className?: string
  /** Affiche l'arrière-plan scénique */
  background?: boolean
}

/**
 * Portrait illustré stylisé (personnage de démonstration).
 * Volontairement non photographique : aucune image de mineur réel.
 */
export default function Portrait(props: PortraitProps) {
  if (hasTalentPhoto(props.seed)) return <TalentPhoto id={props.seed} className={props.className} />
  return <IllustratedPortrait {...props} />
}

/** Photo d’illustration du talent (modèle de banque d’images) */
function TalentPhoto({ id, className = '' }: { id: string; className?: string }) {
  const pos = /\b(absolute|fixed)\b/.test(className) ? '' : 'relative'
  return (
    <span className={`${className} ${pos} block overflow-hidden bg-night`}>
      <img src={PHOTOS.talent(id)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
    </span>
  )
}

function IllustratedPortrait({ look, category, seed, className = '', background = true }: PortraitProps) {
  const id = useSvgId('pt')
  const P = PALETTES[look.palette]
  const bokeh = useMemo(() => {
    const rnd = mulberry32(hashStr(seed + 'b'))
    return Array.from({ length: 12 }, () => ({ x: rnd() * 200, y: rnd() * 170, r: 2 + rnd() * 6, o: 0.08 + rnd() * 0.22 }))
  }, [seed])
  const hair = look.hairColor
  const hairHi = shade(hair, 0.25)
  const topLight = shade(look.top, 0.18)

  const backHair = (() => {
    switch (look.hair) {
      case 'afro':
        return (
          <g fill={hair}>
            {[
              [100, 84, 48],
              [64, 100, 26],
              [136, 100, 26],
              [74, 66, 26],
              [126, 66, 26],
              [100, 52, 28],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} />
            ))}
          </g>
        )
      case 'long':
        return (
          <path
            fill={hair}
            d="M66,98 Q62,56 100,56 Q138,56 134,98 L142,190 Q128,198 118,180 L116,122 L84,122 L82,180 Q72,198 58,190 Z"
          />
        )
      case 'hood':
        return <path fill={look.top} d="M54,128 Q48,48 100,46 Q152,48 146,128 L152,180 L48,180 Z" />
      case 'braids':
        return (
          <g fill={hair}>
            {[66, 74, 82, 118, 126, 134].map((x, i) => (
              <rect key={i} x={x - 3.5} y={88} width="7" height={i % 2 ? 104 : 96} rx="3.5" />
            ))}
          </g>
        )
      case 'ponytail':
        return <path fill={hair} d="M124,72 Q170,86 158,168 Q150,190 142,170 Q150,120 120,96 Z" />
      case 'bun':
        return <circle cx="100" cy="58" r="17" fill={hair} />
      case 'curly':
        return (
          <g fill={hair}>
            {[
              [100, 70, 34],
              [70, 92, 18],
              [130, 92, 18],
              [66, 118, 13],
              [134, 118, 13],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} />
            ))}
          </g>
        )
      default:
        return null
    }
  })()

  const frontHair = (() => {
    switch (look.hair) {
      case 'afro':
      case 'curly':
        return (
          <g fill={hair}>
            {Array.from({ length: 9 }).map((_, i) => {
              const a = Math.PI + (i / 8) * Math.PI
              return <circle key={i} cx={100 + Math.cos(a) * 28} cy={96 + Math.sin(a) * 26} r={10} />
            })}
          </g>
        )
      case 'long':
        return <path fill={hair} d="M69,104 Q68,64 100,64 Q132,64 131,104 Q122,80 98,78 Q80,82 69,104Z" />
      case 'beanie':
        return (
          <g>
            <path fill={look.top === '#3b1414' ? '#7a1f2a' : topLight} d="M66,98 Q62,48 100,48 Q138,48 134,98 Z" />
            <rect x="63" y="86" width="74" height="15" rx="6" fill={shade(look.top === '#3b1414' ? '#7a1f2a' : topLight, -0.25)} />
          </g>
        )
      case 'hood':
        return <path fill={hair} d="M71,98 Q72,68 100,67 Q128,68 129,98 Q120,82 100,80 Q80,82 71,98Z" />
      case 'fade':
        return <path fill={hair} d="M71,96 Q72,68 100,67 Q128,68 129,96 Q120,80 100,78 Q80,80 71,96Z" />
      default:
        return <path fill={hair} d="M69,104 Q66,62 100,62 Q134,62 131,104 Q126,82 100,79 Q74,82 69,104Z" />
    }
  })()

  const hasMic = category !== 'slam'

  return (
    <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Portrait illustré de démonstration">
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.top} />
          <stop offset=".7" stopColor={P.mid} />
          <stop offset="1" stopColor="#06060c" />
        </linearGradient>
        <radialGradient id={`${id}sp`} cx=".7" cy=".1" r=".9">
          <stop offset="0" stopColor={P.beam} stopOpacity=".7" />
          <stop offset=".5" stopColor={P.glow} stopOpacity=".2" />
          <stop offset="1" stopColor={P.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}skin`} x1="1" y1="0" x2="0" y2=".3">
          <stop offset="0" stopColor={shade(look.skin, 0.12)} />
          <stop offset=".45" stopColor={look.skin} />
          <stop offset="1" stopColor={shade(look.skin, -0.55)} />
        </linearGradient>
        <linearGradient id={`${id}top`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={topLight} />
          <stop offset=".6" stopColor={look.top} />
          <stop offset="1" stopColor={shade(look.top, -0.5)} />
        </linearGradient>
        <linearGradient id={`${id}mic`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF2C6" />
          <stop offset=".5" stopColor="#D6AC55" />
          <stop offset="1" stopColor="#7a5418" />
        </linearGradient>
        <linearGradient id={`${id}fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset=".55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".75" />
        </linearGradient>
        <filter id={`${id}rim`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {background && (
        <>
          <rect width="200" height="250" fill={`url(#${id}bg)`} />
          <g filter={`url(#${id}rim)`}>
            {bokeh.map((b, i) => (
              <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={i % 3 ? P.beam : '#F4D78C'} opacity={b.o} />
            ))}
          </g>
          <rect width="200" height="250" fill={`url(#${id}sp)`} />
          <polygon points="150,0 175,0 140,250 60,250" fill={P.beam} opacity=".07" />
        </>
      )}

      {/* halo de contre-jour */}
      <g opacity=".9" filter={`url(#${id}rim)`} transform="translate(3 -2)">
        <g fill={P.rim}>
          <path d="M28,252 Q32,176 80,164 L120,164 Q168,176 172,252 Z" />
          <ellipse cx="100" cy="108" rx="31" ry="38" />
        </g>
      </g>

      {backHair}
      {/* cou + torse */}
      <rect x="88" y="132" width="24" height="36" rx="8" fill={shade(look.skin, -0.45)} />
      <path d="M28,252 Q32,176 80,164 Q100,176 120,164 Q168,176 172,252 Z" fill={`url(#${id}top)`} />
      <path d="M80,164 Q100,186 120,164" fill="none" stroke={shade(look.top, -0.5)} strokeWidth="3" />
      {/* tête */}
      <ellipse cx="100" cy="106" rx="29.5" ry="36" fill={`url(#${id}skin)`} />
      <ellipse cx="71" cy="110" rx="5" ry="8" fill={shade(look.skin, -0.4)} />
      <ellipse cx="129" cy="110" rx="5" ry="8" fill={shade(look.skin, -0.1)} />
      {frontHair}
      {/* reflet doré sur le profil */}
      <path d="M126,84 Q134,104 126,132" fill="none" stroke="#F4D78C" strokeWidth="1.6" opacity=".55" strokeLinecap="round" />

      {hasMic ? (
        <g transform="rotate(18 128 170)">
          <rect x="123" y="160" width="10" height="56" rx="4" fill="#1a1622" />
          <circle cx="128" cy="150" r="11" fill={`url(#${id}mic)`} />
          <circle cx="124" cy="146" r="3.5" fill="#fff" opacity=".5" />
          <ellipse cx="128" cy="184" rx="11" ry="13" fill={shade(look.skin, -0.25)} />
        </g>
      ) : (
        <g>
          <ellipse cx="58" cy="196" rx="11" ry="14" fill={shade(look.skin, -0.3)} transform="rotate(-20 58 196)" />
          <rect x="52" y="206" width="14" height="40" rx="6" fill={`url(#${id}top)`} transform="rotate(-12 58 206)" />
        </g>
      )}

      <rect width="200" height="250" fill={`url(#${id}fade)`} />
    </svg>
  )
}
