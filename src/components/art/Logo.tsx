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
  // La police n'a pas d'italique : le navigateur penche les lettres lui-même et le dégradé doré
  // ne suit pas, ce qui coupe le bout du « R ». On penche donc tout le bloc (lettres + dégradé).
  const slanted = /\bitalic\b/.test(className)
  const cls = className.replace(/\bitalic\b/g, '')
  return (
    <span
      className={`inline-block whitespace-nowrap px-[0.06em] font-display not-italic leading-none tracking-[0.04em] text-gold-metal ${cls}`}
      style={{ filter: 'drop-shadow(0 2px 10px rgba(214,172,85,.35))', transform: slanted ? 'skewX(-12deg)' : undefined }}
    >
      MICRO D’OR
    </span>
  )
}

/** Logo horizontal pour l'en-tête */
export function LogoInline({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <MicEmblem className="-my-1 h-9 w-6" glow={false} />
      <Wordmark className="text-[23px] italic" />
    </span>
  )
}
