import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, X } from 'lucide-react'
import { DEMO_TODAY, SHOWS, fmtDate, regionById, type School } from '../../data'
import { useSvgId } from '../art/Logo'
import { cx } from '../ui'

/* ------------------------------------------------------------------
 * Carte schématique du sud du Québec.
 * Projection équirectangulaire simple (corrigée par cos(47,5°)).
 * Les contours sont volontairement stylisés — ce n’est pas une carte exacte.
 * ------------------------------------------------------------------ */
const LON0 = -78
const LON1 = -63.6
const LAT1 = 49.75
const LAT0 = 44.75
const K = 82
const COS = Math.cos((47.5 * Math.PI) / 180)
export const MAP_W = Math.round((LON1 - LON0) * COS * K) // ≈ 798
export const MAP_H = Math.round((LAT1 - LAT0) * K) // 410

const proj = (lat: number, lon: number): [number, number] => [(lon - LON0) * COS * K, (LAT1 - lat) * K]
const path = (pts: [number, number][], close = true) =>
  pts.map(([la, lo], i) => `${i ? 'L' : 'M'}${proj(la, lo).map((v) => v.toFixed(1)).join(',')}`).join(' ') + (close ? ' Z' : '')

// [lat, lon]
const LAND: [number, number][] = [
  [51.6, -79.5], [51.6, -60.4], [50.25, -60.4], [50.2, -61.8], [50.24, -63.6], [50.12, -65.2], [50.2, -66.4],
  [49.15, -64.4], [48.85, -64.15], [48.5, -64.22], [48.3, -64.6], [48.05, -65.4], [48.0, -66.3], [48.05, -66.9],
  [47.95, -67.6], [47.45, -68.3], [47.4, -69.2], [46.4, -70.0], [45.8, -70.4], [45.3, -71.0], [45.0, -71.5],
  [45.0, -74.7], [45.35, -74.4], [45.45, -75.0], [45.47, -75.7], [45.6, -76.4], [45.9, -76.9], [46.1, -77.3],
  [46.4, -78.2], [46.7, -79.0], [47.3, -79.5],
]
const ESTUARY: [number, number][] = [
  [50.2, -66.4], [49.6, -67.3], [49.22, -68.15], [48.74, -69.08], [48.15, -69.7], [47.44, -70.5], [47.0, -70.95],
  [46.84, -71.22], [46.78, -71.18], [47.1, -70.6], [47.83, -69.54], [48.45, -68.52], [48.85, -67.53], [49.1, -66.5],
  [49.2, -65.5], [49.15, -64.4],
]
const RIVER: [number, number][] = [
  [45.05, -74.6], [45.3, -74.1], [45.45, -73.72], [45.53, -73.52], [45.75, -73.38], [46.05, -73.08], [46.2, -72.82],
  [46.34, -72.5], [46.55, -72.05], [46.81, -71.2],
]
const SAGUENAY: [number, number][] = [[48.55, -71.75], [48.43, -71.2], [48.38, -70.8], [48.28, -70.3], [48.15, -69.72]]
const ST_MAURICE: [number, number][] = [[47.6, -73.0], [47.0, -72.75], [46.6, -72.65], [46.36, -72.55]]
const OTTAWA: [number, number][] = [[47.3, -79.5], [46.7, -79.0], [46.4, -78.2], [46.1, -77.3], [45.9, -76.9], [45.6, -76.4], [45.47, -75.7], [45.45, -75.0], [45.35, -74.4], [45.5, -74.0]]
const ANTICOSTI: [number, number][] = [[49.86, -64.5], [49.95, -63.5], [49.72, -62.3], [49.4, -61.72], [49.12, -62.0], [49.25, -63.0], [49.56, -64.05]]

const LABELS: { t: string; lat: number; lon: number; size?: number; rot?: number }[] = [
  { t: 'SAGUENAY–LAC-SAINT-JEAN', lat: 49.15, lon: -72.4 },
  { t: 'CÔTE-NORD', lat: 49.45, lon: -69.6 },
  { t: 'GASPÉSIE', lat: 48.72, lon: -65.9 },
  { t: 'BAS-SAINT-LAURENT', lat: 47.75, lon: -68.4, size: 9 },
  { t: 'MAURICIE', lat: 47.55, lon: -73.9 },
  { t: 'LAURENTIDES', lat: 46.35, lon: -75.0, size: 9 },
  { t: 'OUTAOUAIS', lat: 47.0, lon: -76.6 },
  { t: 'ESTRIE', lat: 45.15, lon: -72.0, size: 9 },
  { t: 'CHAUDIÈRE-APPALACHES', lat: 46.3, lon: -70.6, size: 9 },
  { t: 'Fleuve Saint-Laurent', lat: 48.62, lon: -68.75, size: 10, rot: -37 },
]

interface Pin {
  school: School
  ax: number
  ay: number
  x: number
  y: number
}

/** Écarte les épingles trop proches (grand Montréal) tout en gardant un trait vers la vraie position. */
function declutter(schools: School[], scale: number, minD: number): Pin[] {
  const pins: Pin[] = schools.map((s) => {
    const [x, y] = proj(s.lat, s.lon)
    return { school: s, ax: x * scale, ay: y * scale, x: x * scale, y: y * scale }
  })
  for (let it = 0; it < 120; it++) {
    for (let i = 0; i < pins.length; i++) {
      for (let j = i + 1; j < pins.length; j++) {
        const a = pins[i]
        const b = pins[j]
        let dx = b.x - a.x
        let dy = b.y - a.y
        let d = Math.hypot(dx, dy)
        if (d < 0.01) {
          const ang = (i * 2.4 + j) % (Math.PI * 2)
          dx = Math.cos(ang)
          dy = Math.sin(ang)
          d = 1
        }
        if (d < minD) {
          const push = (minD - d) / 2
          a.x -= (dx / d) * push
          a.y -= (dy / d) * push
          b.x += (dx / d) * push
          b.y += (dy / d) * push
        }
      }
    }
    for (const p of pins) {
      p.x += (p.ax - p.x) * 0.02
      p.y += (p.ay - p.y) * 0.02
    }
  }
  return pins
}

export const nextShowOfSchool = (schoolId: string) =>
  SHOWS.filter((s) => s.schoolId === schoolId && s.status !== 'replay' && s.date >= DEMO_TODAY).sort((a, b) =>
    a.date.localeCompare(b.date),
  )[0]

export default function QuebecMap({
  schools,
  regionId,
  selectedId,
  onSelect,
}: {
  schools: School[]
  regionId: string
  selectedId: string | null
  onSelect: (id: string | null) => void
}) {
  const id = useSvgId('qc')
  const wrap = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)

  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    setW(el.clientWidth)
    const ro = new ResizeObserver(() => setW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scale = w / MAP_W
  const h = MAP_H * scale
  const pins = useMemo(() => (w ? declutter(schools, scale, w < 560 ? 30 : 40) : []), [schools, scale, w])
  const selected = pins.find((p) => p.school.id === selectedId)

  useEffect(() => {
    if (!selectedId) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onSelect(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, onSelect])

  const geo = useMemo(
    () => ({
      land: path(LAND),
      estuary: path(ESTUARY),
      river: path(RIVER, false),
      saguenay: path(SAGUENAY, false),
      stMaurice: path(ST_MAURICE, false),
      ottawa: path(OTTAWA, false),
      anticosti: path(ANTICOSTI),
      lac: proj(48.6, -72.05),
      grid: [45, 46, 47, 48, 49].map((la) => proj(la, LON0)[1]),
      gridV: [-76, -72, -68, -64].map((lo) => proj(LAT1, lo)[0]),
    }),
    [],
  )

  const narrow = w > 0 && w < 520
  return (
    <div>
    <div ref={wrap} className="relative w-full select-none" style={{ height: h || undefined, aspectRatio: w ? undefined : `${MAP_W} / ${MAP_H}` }}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 h-full w-full" aria-label="Carte schématique du sud du Québec" role="img">
        <defs>
          <linearGradient id={`${id}land`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#262f5c" />
            <stop offset=".5" stopColor="#1f2650" />
            <stop offset="1" stopColor="#2c1d58" />
          </linearGradient>
          <linearGradient id={`${id}fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".15" />
            <stop offset=".16" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id={`${id}mask`}>
            <rect width={MAP_W} height={MAP_H} fill={`url(#${id}fade)`} />
          </mask>
          <radialGradient id={`${id}halo`} cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#D6AC55" stopOpacity=".28" />
            <stop offset="1" stopColor="#D6AC55" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}stage`} cx=".5" cy=".5" r=".5">
            <stop offset="0" stopColor="#6837B5" stopOpacity=".38" />
            <stop offset="1" stopColor="#6837B5" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
          <pattern id={`${id}dots`} width="9" height="9" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r=".9" fill="#F4D78C" opacity=".2" />
          </pattern>
        </defs>

        {/* halo violet de scène */}
        <ellipse cx={proj(46.3, -72.6)[0]} cy={proj(46.3, -72.6)[1]} rx="330" ry="190" fill={`url(#${id}stage)`} />

        {/* graticule */}
        <g stroke="#ffffff" strokeOpacity=".05" strokeDasharray="2 6">
          {geo.grid.map((y) => (
            <line key={y} x1="0" x2={MAP_W} y1={y} y2={y} />
          ))}
          {geo.gridV.map((x) => (
            <line key={x} y1="0" y2={MAP_H} x1={x} x2={x} />
          ))}
        </g>

        <g mask={`url(#${id}mask)`}>
          <path d={geo.land} fill={`url(#${id}land)`} />
          <path d={geo.land} fill={`url(#${id}dots)`} />
          <path d={geo.land} fill="none" stroke="#D6AC55" strokeOpacity=".55" strokeWidth="1.2" strokeLinejoin="round" />
          <path d={geo.land} fill="none" stroke="#F4D78C" strokeOpacity=".35" strokeWidth="3" filter={`url(#${id}glow)`} />
        </g>

        {/* eaux */}
        <path d={geo.estuary} fill="#0c0e1d" stroke="#9B6BE8" strokeOpacity=".7" strokeWidth="1.2" strokeLinejoin="round" />
        <path d={geo.river} fill="none" stroke="#9B6BE8" strokeOpacity=".35" strokeWidth="7" strokeLinecap="round" filter={`url(#${id}glow)`} />
        <path d={geo.river} fill="none" stroke="#0c0e1d" strokeWidth="3.6" strokeLinecap="round" />
        <path d={geo.river} fill="none" stroke="#C9B6FF" strokeOpacity=".55" strokeWidth=".8" strokeLinecap="round" />
        <path d={geo.saguenay} fill="none" stroke="#9B6BE8" strokeOpacity=".55" strokeWidth="1.6" strokeLinecap="round" />
        <path d={geo.stMaurice} fill="none" stroke="#9B6BE8" strokeOpacity=".4" strokeWidth="1.2" strokeLinecap="round" />
        <path d={geo.ottawa} fill="none" stroke="#9B6BE8" strokeOpacity=".45" strokeWidth="1.4" strokeLinecap="round" />
         <ellipse cx={geo.lac[0]} cy={geo.lac[1]} rx="17" ry="11" fill="#0c0e1d" stroke="#9B6BE8" strokeOpacity=".55" />
        <path d={geo.anticosti} fill="#1f2650" stroke="#D6AC55" strokeOpacity=".45" strokeWidth="1" />

        {/* étiquettes */}
        <g fontFamily="Manrope, sans-serif" fontWeight="700" fill="#ffffff" fillOpacity=".28" letterSpacing="2.5" textAnchor="middle">
          {LABELS.map((l) => {
            const [x, y] = proj(l.lat, l.lon)
            return (
              <text key={l.t} x={x} y={y} transform={l.rot ? `rotate(${l.rot} ${x} ${y})` : undefined} fontSize={l.size ?? 10} fontStyle={l.t.startsWith('Fleuve') ? 'italic' : undefined} fill={l.t.startsWith('Fleuve') ? '#C9B6FF' : undefined} fillOpacity={l.t.startsWith('Fleuve') ? 0.5 : undefined}>
                {l.t}
              </text>
            )
          })}
        </g>

        {/* rose des vents */}
        <g transform={`translate(${MAP_W - 52} ${MAP_H - 60})`} opacity=".6">
          <circle r="22" fill="none" stroke="#D6AC55" strokeOpacity=".4" />
          <path d="M0,-18 L4,0 L0,18 L-4,0 Z" fill="#D6AC55" fillOpacity=".7" />
          <text y="-26" textAnchor="middle" fontSize="10" fontWeight="800" fill="#F4D78C" fontFamily="Manrope, sans-serif">
            N
          </text>
        </g>
      </svg>

      {/* traits de rappel + épingles (HTML pour une taille constante et l’accessibilité) */}
      {w > 0 && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${w} ${h}`}>
          {pins.map((p) => (
            <g key={p.school.id}>
              {Math.hypot(p.x - p.ax, p.y - p.ay) > 3 && (
                <line x1={p.ax} y1={p.ay} x2={p.x} y2={p.y} stroke="#F4D78C" strokeOpacity=".5" strokeWidth="1" strokeDasharray="2 2" />
              )}
              <circle cx={p.ax} cy={p.ay} r="2.2" fill="#F4D78C" />
            </g>
          ))}
        </svg>
      )}

      {pins.map((p) => {
        const dim = regionId !== 'all' && p.school.regionId !== regionId
        const active = p.school.id === selectedId
        const crowded = pins.some((o) => o !== p && Math.hypot(o.x - p.x, o.y - p.y) < 46)
        return (
          <button
            key={p.school.id}
            onClick={() => onSelect(active ? null : p.school.id)}
            aria-label={`${p.school.name}, ${p.school.city}`}
            aria-pressed={active}
            className={cx('group absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300', dim ? 'opacity-25 hover:opacity-70' : 'opacity-100', active ? 'z-20' : 'z-10')}
            style={{ left: p.x, top: p.y }}
          >
            <span className={cx('absolute inset-0 -m-2 rounded-full bg-gold/30 blur-md', !dim && 'animate-pulseLive')} />
            {!dim && <span className="absolute inset-0 animate-ping rounded-full bg-goldlight/30 [animation-duration:2.6s]" />}
            <span
              className={cx(
                'relative grid h-6 w-6 place-items-center rounded-full border-2 bg-gold-metal shadow-[0_0_18px_rgba(244,215,140,.8)] transition-transform duration-200 group-hover:scale-125 lg:h-7 lg:w-7',
                active ? 'scale-125 border-white' : 'border-ink',
              )}
            >
              <span className="h-2 w-2 rounded-full bg-ink" />
            </span>
            <span
              className={cx(
                'pointer-events-none absolute left-1/2 top-full mt-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/85 px-2 py-0.5 text-[10.5px] font-bold text-goldlight backdrop-blur sm:block',
                active ? 'opacity-0' : crowded ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100 lg:opacity-80',
              )}
            >
              {p.school.city}
            </span>
          </button>
        )
      })}

      {selected && !narrow && <PinPopover pin={selected} w={w} h={h} onClose={() => onSelect(null)} />}
    </div>
    {selected && narrow && <PinPopover pin={selected} w={w} h={h} inline onClose={() => onSelect(null)} />}
    </div>
  )
}

function PinPopover({ pin, w, h, inline, onClose }: { pin: Pin; w: number; h: number; inline?: boolean; onClose: () => void }) {
  const s = pin.school
  const next = nextShowOfSchool(s.id)
  const region = regionById(s.regionId)
  const PW = Math.min(280, w - 16)
  const left = Math.max(8, Math.min(w - PW - 8, pin.x - PW / 2))
  const below = pin.y < h * 0.45
  return (
    <div
      className={cx('animate-fadeIn', inline ? 'relative mt-3' : 'absolute z-30')}
      style={inline ? undefined : { left, width: PW, ...(below ? { top: pin.y + 22 } : { bottom: h - pin.y + 22 }) }}
      role="dialog"
      aria-label={s.name}
    >
      <div className="glass gold-border relative overflow-hidden rounded-2xl p-4 shadow-[0_20px_60px_-10px_rgba(0,0,0,.8)]">
        <span className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${s.accent}, ${s.accent2})` }} />
        <button onClick={onClose} aria-label="Fermer" className="absolute right-2 top-2.5 grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white">
          <X size={15} />
        </button>
        <div className="eyebrow pr-8 !text-[10px]">
          {region?.code} · {region?.name}
        </div>
        <div className="mt-1 pr-6 text-[15px] font-extrabold leading-tight">{s.name}</div>
        <div className="mt-0.5 flex items-center gap-1 text-[12px] text-white/60">
          <MapPin size={12} className="text-gold" /> {s.city}
        </div>
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-white/45">Prochaine date (fictive)</div>
          {next ? (
            <>
              <div className="mt-1 flex items-center gap-1.5 text-[13.5px] font-extrabold text-goldlight">
                <CalendarDays size={14} /> {fmtDate(next.date, true)} · {next.time}
              </div>
              <div className="mt-0.5 truncate text-[12.5px] text-white/75">{next.title}</div>
            </>
          ) : (
            <div className="mt-1 text-[12.5px] text-white/60">Aucune date annoncée pour l’instant (démo).</div>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          {next && (
            <Link to={`/spectacles/${next.id}`} className="flex h-9 flex-1 items-center justify-center rounded-full bg-gold-soft text-[12.5px] font-extrabold text-ink shadow-gold hover:brightness-110">
              Voir le spectacle
            </Link>
          )}
          <Link to={`/ecoles/${s.id}`} className="flex h-9 flex-1 items-center justify-center rounded-full border border-gold/50 text-[12.5px] font-bold text-goldlight hover:bg-gold/10">
            Fiche de l’école
          </Link>
        </div>
      </div>
    </div>
  )
}
