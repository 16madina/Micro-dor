import { useId } from 'react'

export function useSvgId(prefix: string) {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, '')
}

function starPoints(cx: number, cy: number, outer: number, inner: number) {
  const pts: string[] = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`)
  }
  return pts.join(' ')
}

/** Emblème MICRO D’OR : trophée micro doré (logo officiel fourni) */
export function MicEmblem({ className = '', glow = true, large = false }: { className?: string; glow?: boolean; large?: boolean }) {
  return (
    <img
      src={large ? 'brand/logo.webp' : 'brand/logo-sm.webp'}
      alt="MICRO D’OR"
      draggable={false}
      className={`object-contain ${className}`}
      style={glow ? { filter: 'drop-shadow(0 0 18px rgba(244,215,140,.35))' } : undefined}
    />
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-display leading-none tracking-[0.04em] text-gold-metal ${className}`}
      style={{ filter: 'drop-shadow(0 2px 10px rgba(214,172,85,.35))' }}
    >
      MICRO D’OR
    </span>
  )
}

/** Logo horizontal pour l'en-tête */
export function LogoInline({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <MicEmblem className="-my-1 h-10 w-7" glow={false} />
      <Wordmark className="text-[26px] italic" />
    </span>
  )
}
