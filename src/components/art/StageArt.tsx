import { useMemo } from 'react'
import type { Palette } from '../../data/types'
import { useSvgId } from './Logo'
import { PALETTES, hashStr, mulberry32 } from './palettes'

export type Pose = 'singer' | 'rap' | 'slam' | 'none' | 'trio'

interface StageArtProps {
  seed: string
  palette: Palette
  pose?: Pose
  crowd?: boolean
  animated?: boolean
  className?: string
  /** 'wide' = 16:10 composition, 'tall' = portrait poster */
  ratio?: 'wide' | 'tall'
  /** Photo réelle à afficher à la place de l’illustration */
  photo?: string
}

type Pt = [number, number]
const POSES: Record<Exclude<Pose, 'none' | 'trio'>, { arms: Pt[][]; legs: Pt[][]; mic: Pt | null; stand?: boolean }> = {
  singer: {
    arms: [
      [[11, -72], [18, -58], [5, -80]],
      [[-11, -72], [-25, -60], [-33, -72]],
    ],
    legs: [
      [[-5, -33], [-7, 0]],
      [[5, -33], [8, 0]],
    ],
    mic: [3, -83],
  },
  rap: {
    arms: [
      [[11, -72], [21, -88], [25, -106]],
      [[-11, -72], [-15, -58], [-4, -80]],
    ],
    legs: [
      [[-5, -33], [-13, 0]],
      [[5, -33], [13, 0]],
    ],
    mic: [-2, -83],
  },
  slam: {
    arms: [
      [[11, -72], [23, -58], [30, -66]],
      [[-11, -72], [-21, -56], [-14, -50]],
    ],
    legs: [
      [[-5, -33], [-6, 0]],
      [[5, -33], [6, 0]],
    ],
    mic: [8, -84],
    stand: true,
  },
}

function Figure({ pose, x, y, s, rim, id }: { pose: keyof typeof POSES; x: number; y: number; s: number; rim: string; id: string }) {
  const p = POSES[pose]
  const body = (
    <>
      <ellipse cx="0" cy="-88" rx="7.6" ry="9" />
      <rect x="-3.2" y="-81" width="6.4" height="7" />
      <path d="M-13.5,-75 Q0,-80 13.5,-75 C15.5,-66 14,-52 10.5,-36 L-10.5,-36 C-14,-52 -15.5,-66 -13.5,-75Z" />
      <path d="M-10.5,-37 L10.5,-37 L11,-30 L-11,-30Z" />
      {p.legs.map((pts, i) => (
        <polyline key={'l' + i} points={pts.map((q) => q.join(',')).join(' ')} fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {p.arms.map((pts, i) => (
        <polyline key={'a' + i} points={pts.map((q) => q.join(',')).join(' ')} fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {p.stand && <line x1="16" y1="1" x2="9" y2="-80" stroke="#1a1626" strokeWidth="1.6" />}
      {/* contour lumineux */}
      <g fill={rim} stroke={rim} opacity=".95" transform="translate(-1.3 -1.1)" filter={`url(#${id}soft)`}>
        {body}
      </g>
      <g fill="#05040a" stroke="#05040a">
        {body}
      </g>
      {p.mic && (
        <>
          <circle cx={p.mic[0]} cy={p.mic[1]} r="2.6" fill="#F4D78C" />
          <circle cx={p.mic[0]} cy={p.mic[1]} r="5" fill="#F4D78C" opacity=".25" />
        </>
      )}
    </g>
  )
}

export default function StageArt({
  seed,
  palette,
  pose = 'singer',
  crowd = true,
  animated = false,
  className = '',
  ratio = 'wide',
  photo,
}: StageArtProps) {
  if (photo) {
    const pos = /\b(absolute|fixed)\b/.test(className) ? '' : 'relative'
    return (
      <span className={`${className} ${pos} block overflow-hidden bg-night`}>
        <img src={photo} alt="" loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${animated ? 'animate-kenburns' : ''}`} />
      </span>
    )
  }
  return <StageIllustration seed={seed} palette={palette} pose={pose} crowd={crowd} animated={animated} className={className} ratio={ratio} />
}

function StageIllustration({
  seed,
  palette,
  pose = 'singer',
  crowd = true,
  animated = false,
  className = '',
  ratio = 'wide',
}: StageArtProps) {
  const id = useSvgId('st')
  const P = PALETTES[palette]
  const W = 400
  const H = ratio === 'wide' ? 250 : 500
  const floorY = ratio === 'wide' ? 196 : 360
  const figY = floorY - 2
  const figS = ratio === 'wide' ? 1.05 : 1.7

  const r = useMemo(() => {
    const rnd = mulberry32(hashStr(seed))
    const lamps = Array.from({ length: 7 }, (_, i) => {
      const x = 30 + i * 56 + (rnd() - 0.5) * 14
      return {
        x,
        tx: 200 + (rnd() - 0.5) * 300,
        w: 28 + rnd() * 34,
        color: i % 3 === 1 ? P.beam2 : P.beam,
        delay: -rnd() * 8,
        dur: 6 + rnd() * 5,
        o: 0.18 + rnd() * 0.22,
      }
    })
    const bokeh = Array.from({ length: 22 }, () => ({
      x: rnd() * W,
      y: rnd() * (floorY - 30),
      r: 1 + rnd() * 4.5,
      o: 0.06 + rnd() * 0.18,
      c: rnd() > 0.6 ? P.beam2 : P.beam,
      d: rnd() * 4,
    }))
    const heads = Array.from({ length: 26 }, (_, i) => ({
      x: -10 + i * 16.5 + (rnd() - 0.5) * 8,
      y: H - 26 + rnd() * 14,
      r: 9 + rnd() * 5,
      arm: rnd() > 0.72,
      armX: (rnd() - 0.5) * 30,
      armY: H - 50 - rnd() * 22,
      phone: rnd() > 0.55,
    }))
    return { lamps, bokeh, heads }
  }, [seed, palette, H, floorY])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.top} />
          <stop offset=".62" stopColor={P.mid} />
          <stop offset="1" stopColor="#05050a" />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx=".5" cy=".62" r=".55">
          <stop offset="0" stopColor={P.glow} stopOpacity=".95" />
          <stop offset=".45" stopColor={P.glow} stopOpacity=".3" />
          <stop offset="1" stopColor={P.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}beamA`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.beam} stopOpacity=".95" />
          <stop offset="1" stopColor={P.beam} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}beamB`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.beam2} stopOpacity=".95" />
          <stop offset="1" stopColor={P.beam2} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}spot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF4CF" stopOpacity=".85" />
          <stop offset="1" stopColor="#F4D78C" stopOpacity=".05" />
        </linearGradient>
        <radialGradient id={`${id}back`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FFF4CF" stopOpacity=".75" />
          <stop offset=".35" stopColor={P.beam} stopOpacity=".35" />
          <stop offset="1" stopColor={P.beam} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.glow} stopOpacity=".55" />
          <stop offset=".25" stopColor="#0b0a14" />
          <stop offset="1" stopColor="#030306" />
        </linearGradient>
        <radialGradient id={`${id}vig`} cx=".5" cy=".5" r=".75">
          <stop offset=".55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".75" />
        </radialGradient>
        <filter id={`${id}blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={`${id}soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}bg)`} />
      <ellipse cx="200" cy={floorY - 40} rx="260" ry={ratio === 'wide' ? 150 : 260} fill={`url(#${id}glow)`} />

      {/* bokeh */}
      <g filter={`url(#${id}soft)`}>
      {r.bokeh.map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={b.y}
          r={b.r}
          fill={b.c}
          opacity={b.o}
          style={animated ? { animation: `pulseLive ${3 + b.d}s ease-in-out ${-b.d}s infinite` } : undefined}
        />
      ))}
      </g>

      {/* faisceaux */}
      <g style={{ mixBlendMode: 'screen' }}>
        {r.lamps.map((l, i) => (
          <g
            key={i}
            style={{
              transformOrigin: `${l.x}px 10px`,
              transformBox: 'view-box',
              animation: animated ? `${i % 2 ? 'sweep' : 'sweep2'} ${l.dur}s ease-in-out ${l.delay}s infinite` : undefined,
            }}
          >
            <polygon
              points={`${l.x - 3},10 ${l.x + 3},10 ${l.tx + l.w},${floorY + 10} ${l.tx - l.w},${floorY + 10}`}
              fill={`url(#${id}${i % 3 === 1 ? 'beamB' : 'beamA'})`}
              opacity={l.o}
            />
          </g>
        ))}
        <polygon points={`192,0 208,0 252,${floorY + 6} 148,${floorY + 6}`} fill={`url(#${id}spot)`} opacity=".42" />
      </g>

      {/* brume */}
      <ellipse
        cx="200"
        cy={floorY - 20}
        rx="230"
        ry="40"
        fill={P.beam}
        opacity=".22"
        filter={`url(#${id}blur)`}
        style={animated ? { animation: 'haze 9s ease-in-out infinite', transformBox: 'view-box' } : undefined}
      />

      {/* rampe de projecteurs */}
      <rect x="0" y="6" width={W} height="4" fill="#0c0b12" />
      {r.lamps.map((l, i) => (
        <g key={i}>
          <circle cx={l.x} cy="11" r="7" fill={l.color} opacity=".35" filter={`url(#${id}soft)`} />
          <circle cx={l.x} cy="11" r="3.2" fill="#fff" />
        </g>
      ))}

      {/* scène */}
      <rect x="0" y={floorY} width={W} height={H - floorY} fill={`url(#${id}floor)`} />
      <rect x="0" y={floorY} width={W} height="1.4" fill={P.rim} opacity=".55" />
      <ellipse cx="200" cy={floorY + 4} rx="70" ry="6" fill="#FFF4CF" opacity=".25" filter={`url(#${id}soft)`} />

      {/* contre-jour derrière l'artiste */}
      {pose !== 'none' && (
        <ellipse cx="200" cy={figY - (ratio === 'wide' ? 55 : 90)} rx={pose === 'trio' ? 150 : 70} ry={ratio === 'wide' ? 75 : 130} fill={`url(#${id}back)`} />
      )}
      {/* artiste(s) */}
      {pose === 'trio' ? (
        <>
          <Figure pose="slam" x={120} y={figY} s={figS * 0.82} rim={P.rim} id={id} />
          <Figure pose="rap" x={285} y={figY} s={figS * 0.82} rim={P.rim} id={id} />
          <Figure pose="singer" x={200} y={figY} s={figS * 0.95} rim={P.rim} id={id} />
        </>
      ) : pose !== 'none' ? (
        <Figure pose={pose} x={200} y={figY} s={figS} rim={P.rim} id={id} />
      ) : null}

      {/* foule */}
      {crowd && (
        <g fill="#020205">
          {r.heads.map((h, i) => (
            <g key={i}>
              {h.arm && (
                <>
                  <line x1={h.x + 6} y1={h.y + 4} x2={h.x + h.armX} y2={h.armY} stroke="#020205" strokeWidth="5.5" strokeLinecap="round" />
                  <circle cx={h.x + h.armX} cy={h.armY - 2} r="4.2" />
                  {h.phone && (
                    <>
                      <rect x={h.x + h.armX - 3} y={h.armY - 7} width="6" height="9" rx="1" fill="#e9f0ff" opacity=".9" />
                      <circle cx={h.x + h.armX} cy={h.armY - 3} r="7" fill="#e9f0ff" opacity=".18" />
                    </>
                  )}
                </>
              )}
              <circle cx={h.x} cy={h.y} r={h.r} />
              <ellipse cx={h.x} cy={h.y + h.r * 2.1} rx={h.r * 2} ry={h.r * 1.4} />
            </g>
          ))}
        </g>
      )}

      <rect width={W} height={H} fill={`url(#${id}vig)`} />
    </svg>
  )
}
