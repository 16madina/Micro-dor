import { useMemo } from 'react'
import type { School } from '../../data/types'
import { useSvgId } from './Logo'
import { hashStr, mulberry32 } from './palettes'
import { PHOTOS } from '../../data'

const SKIES: Record<School['scene'], [string, string, string]> = {
  city: ['#0c0a24', '#4a2468', '#e38a5a'],
  island: ['#1a0c2a', '#8a2f5a', '#ffb070'],
  river: ['#050b1c', '#12305e', '#3a78b0'],
  stars: ['#05041a', '#1c1650', '#4a3a8a'],
  modern: ['#03100f', '#0d3a3a', '#2a8a7a'],
  mountain: ['#1a1030', '#8a4a3a', '#ffc070'],
  bridge: ['#14060e', '#5a1430', '#e0506a'],
  aurora: ['#020812', '#0a2030', '#12403a'],
}

/** Photo d’établissement (bâtiment d’illustration, école fictive) */
export default function SchoolArt({ school, className = '' }: { school: School; className?: string }) {
  const pos = /\b(absolute|fixed)\b/.test(className) ? '' : 'relative'
  return (
    <span className={`${className} ${pos} block overflow-hidden bg-night`}>
      <img src={PHOTOS.school(school.id)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
      <span className="absolute inset-0 mix-blend-soft-light" style={{ background: `linear-gradient(160deg, ${school.accent}55, transparent 60%)` }} />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
    </span>
  )
}

/** Ancienne illustration vectorielle, conservée en secours */
export function SchoolIllustration({ school, className = '' }: { school: School; className?: string }) {
  const id = useSvgId('sc')
  const [s0, s1, s2] = SKIES[school.scene]
  const sc = school.scene
  const rnd = useMemo(() => mulberry32(hashStr(school.id)), [school.id])
  const data = useMemo(() => {
    const stars = Array.from({ length: sc === 'stars' || sc === 'aurora' ? 70 : 24 }, () => ({
      x: rnd() * 400,
      y: rnd() * 110,
      r: 0.4 + rnd() * 1.2,
      o: 0.3 + rnd() * 0.7,
    }))
    const windows = Array.from({ length: 30 }, () => rnd() > 0.35)
    const skyline = Array.from({ length: 18 }, (_, i) => ({ x: i * 24 - 6, w: 16 + rnd() * 14, h: 30 + rnd() * 70 }))
    const trees = [-6, 22, 52, 330, 360, 392].map((x) => ({ x: x + (rnd() - 0.5) * 10, h: 22 + rnd() * 16 }))
    return { stars, windows, skyline, trees }
  }, [rnd, sc])

  const modern = sc === 'modern'

  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s0} />
          <stop offset=".55" stopColor={s1} />
          <stop offset="1" stopColor={s2} />
        </linearGradient>
        <linearGradient id={`${id}bld`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2238" />
          <stop offset="1" stopColor="#120e1c" />
        </linearGradient>
        <linearGradient id={`${id}glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={school.accent} stopOpacity=".55" />
          <stop offset=".5" stopColor="#0a2a2a" stopOpacity=".9" />
          <stop offset="1" stopColor={school.accent} stopOpacity=".35" />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx=".5" cy="1" r=".6">
          <stop offset="0" stopColor={school.accent} stopOpacity=".55" />
          <stop offset="1" stopColor={school.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset=".6" stopColor="#08090E" stopOpacity="0" />
          <stop offset="1" stopColor="#08090E" stopOpacity=".9" />
        </linearGradient>
        <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width="400" height="220" fill={`url(#${id}sky)`} />
      {data.stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
      ))}

      {sc === 'aurora' && (
        <g filter={`url(#${id}b)`} opacity=".8">
          <path d="M-20,70 C60,20 120,90 200,40 C280,-5 330,70 420,30 L420,60 C330,100 280,30 200,75 C120,120 60,50 -20,100Z" fill="#5dff9e" opacity=".55" />
          <path d="M-20,40 C80,0 160,60 240,20 C300,-10 360,40 420,10 L420,30 C360,60 300,10 240,45 C160,90 80,25 -20,65Z" fill="#9b6be8" opacity=".5" />
        </g>
      )}
      {sc === 'stars' && <path d="M330,40 a18,18 0 1,0 14,30 a14,14 0 1,1 -14,-30Z" fill="#F4D78C" opacity=".9" />}
      {(sc === 'island' || sc === 'mountain' || sc === 'city') && (
        <circle cx={sc === 'mountain' ? 300 : 90} cy="150" r="34" fill="#ffd28a" opacity=".55" filter={`url(#${id}b)`} />
      )}
      {sc === 'mountain' && (
        <>
          <path d="M-10,160 L60,90 L110,130 L170,70 L240,140 L300,95 L410,160Z" fill="#3a2040" opacity=".85" />
          <path d="M-10,170 L80,120 L140,150 L220,105 L320,150 L410,125 L410,180 L-10,180Z" fill="#241632" />
        </>
      )}
      {(sc === 'city' || sc === 'river' || sc === 'bridge') && (
        <g fill="#140f22" opacity=".9">
          {data.skyline.map((b, i) => (
            <rect key={i} x={b.x} y={160 - b.h} width={b.w} height={b.h} />
          ))}
        </g>
      )}
      {sc === 'bridge' && (
        <g stroke="#2a0e1c" fill="none" strokeWidth="3">
          <path d="M-10,150 Q100,110 200,150 Q300,110 410,150" />
          <line x1="100" y1="128" x2="100" y2="170" />
          <line x1="300" y1="128" x2="300" y2="170" />
        </g>
      )}
      {sc === 'island' && <path d="M-10,170 Q100,150 200,160 Q300,148 410,165 L410,185 L-10,185Z" fill="#2a1030" />}

      {/* bâtiment */}
      <ellipse cx="200" cy="180" rx="200" ry="50" fill={`url(#${id}glow)`} />
      {modern ? (
        <g>
          <polygon points="70,180 70,100 250,82 330,100 330,180" fill="#0d1a1c" />
          <polygon points="80,176 80,106 250,90 250,176" fill={`url(#${id}glass)`} />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={80 + i * 22} y1={105 - i * 2} x2={80 + i * 22} y2="176" stroke="#9ff" strokeOpacity=".25" />
          ))}
          {[120, 140, 160].map((y) => (
            <line key={y} x1="80" y1={y} x2="250" y2={y - 2} stroke="#9ff" strokeOpacity=".2" />
          ))}
          <rect x="258" y="104" width="64" height="72" fill="#0a1416" />
          {data.windows.slice(0, 9).map((on, i) => (
            <rect key={i} x={264 + (i % 3) * 19} y={112 + Math.floor(i / 3) * 20} width="13" height="12" fill={on ? '#ffe2a0' : '#16262a'} />
          ))}
        </g>
      ) : (
        <g>
          <rect x="40" y="128" width="80" height="52" fill={`url(#${id}bld)`} />
          <rect x="100" y="98" width="200" height="82" fill={`url(#${id}bld)`} />
          <rect x="280" y="120" width="86" height="60" fill={`url(#${id}bld)`} />
          <rect x="96" y="94" width="208" height="6" fill="#3a3048" />
          {data.windows.map((on, i) => {
            const col = i % 10
            const row = Math.floor(i / 10)
            if (col === 4 || col === 5) return null
            return (
              <rect
                key={i}
                x={110 + col * 18.5}
                y={108 + row * 20}
                width="11"
                height="12"
                rx="1"
                fill={on ? '#ffd98a' : '#231d33'}
                opacity={on ? 0.95 : 1}
              />
            )
          })}
          {[0, 1, 2].map((i) => (
            <rect key={'l' + i} x={50 + i * 22} y="140" width="12" height="12" fill={i !== 1 ? '#ffd98a' : '#231d33'} />
          ))}
          {[0, 1, 2].map((i) => (
            <rect key={'r' + i} x={292 + i * 24} y="134" width="13" height="12" fill={i !== 2 ? '#ffd98a' : '#231d33'} />
          ))}
          {/* entrée */}
          <rect x="182" y="140" width="36" height="40" fill="#ffe6a8" opacity=".9" />
          <rect x="172" y="132" width="56" height="6" fill={school.accent} />
          <rect x="166" y="104" width="68" height="16" rx="3" fill="#0b0814" stroke={school.accent} strokeWidth="1" />
          <text x="200" y="115.5" textAnchor="middle" fontSize="8" fontWeight="800" letterSpacing="2" fill={school.accent}>
            ÉCOLE
          </text>
          <line x1="330" y1="80" x2="330" y2="120" stroke="#ccc" strokeWidth="1" />
          <rect x="330" y="80" width="16" height="10" fill={school.accent} opacity=".9" />
        </g>
      )}

      {/* sol et arbres */}
      <rect x="0" y="178" width="400" height="42" fill="#07080d" />
      {sc === 'river' && (
        <g>
          <rect x="0" y="194" width="400" height="26" fill="#0c1e3a" />
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={i * 30 + 6} y={198 + (i % 3) * 5} width="14" height="1.5" fill="#ffd98a" opacity=".5" />
          ))}
        </g>
      )}
      <g fill="#05060a">
        {data.trees.map((t, i) =>
          sc === 'aurora' || sc === 'mountain' ? (
            <polygon key={i} points={`${t.x},${182 - t.h - 10} ${t.x - 12},182 ${t.x + 12},182`} />
          ) : (
            <g key={i}>
              <circle cx={t.x} cy={182 - t.h * 0.6} r={t.h * 0.45} />
              <rect x={t.x - 1.5} y={182 - t.h * 0.4} width="3" height={t.h * 0.4} />
            </g>
          ),
        )}
      </g>
      <path d="M184,180 L216,180 L250,220 L150,220Z" fill="#14121c" />
      <rect width="400" height="220" fill={`url(#${id}fade)`} />
    </svg>
  )
}
