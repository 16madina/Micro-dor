import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Heart, Trophy } from 'lucide-react'
import { CATEGORY_LABEL, fmtNum, talentById, type Category, type Talent } from '../../data'
import { useApp } from '../../state/AppState'
import { useSvgId } from '../art/Logo'
import Portrait from '../art/Portrait'
import { GoldBurst, cx, useBurst } from '../ui'

export const THANKS = 'Merci d’encourager ce talent !'

export type CatFilter = 'tous' | Category
export const CAT_OPTIONS: { value: CatFilter; label: string }[] = [
  { value: 'tous', label: 'Tous' },
  { value: 'chant', label: 'Chant' },
  { value: 'slam', label: 'Slam' },
  { value: 'rap', label: 'Rap conscience' },
  { value: 'danse', label: 'Danse' },
  { value: 'theatre', label: 'Théâtre' },
]

const BTN_SIZES = {
  xs: 'h-8 px-3 text-[12px] gap-1.5',
  sm: 'h-9 px-4 text-[13px] gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-[15px] gap-2',
}

/**
 * Bouton « Encourager » : un encouragement par personne et par talent (on peut le retirer).
 * N’a aucun effet sur le classement.
 */
export function SupportButton({
  talentId,
  label = 'Encourager',
  doneLabel = 'Encouragé ✓',
  size = 'md',
  className,
  iconOnly,
}: {
  talentId: string
  label?: string
  doneLabel?: string
  size?: keyof typeof BTN_SIZES
  className?: string
  iconOnly?: boolean
}) {
  const { support, hasSupported, toast } = useApp()
  const [burst, fire] = useBurst()
  const done = hasSupported(talentId)
  const onClick = async (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!done) fire()
    const r = await support(talentId)
    if (r === 'added') toast(THANKS)
    else if (r === 'removed') toast('Encouragement retiré', 'info')
    else toast('Impossible d’enregistrer pour le moment. Réessaie.', 'info')
  }
  return (
    <span className={cx('relative inline-flex', className)}>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={done}
        aria-label={iconOnly ? (done ? doneLabel : label) : undefined}
        title={done ? 'Retirer mon encouragement' : 'Encourager (n’influence pas le classement)'}
        className={cx(
          'relative inline-flex w-full select-none items-center justify-center whitespace-nowrap rounded-full font-extrabold transition-all duration-200 active:scale-[.96]',
          iconOnly ? (size === 'lg' ? 'h-12 w-12' : size === 'md' ? 'h-11 w-11' : 'h-9 w-9') : BTN_SIZES[size],
          done ? 'border border-gold/70 bg-gold/[0.12] text-goldlight hover:bg-gold/20' : 'bg-gold-soft text-ink shadow-gold hover:brightness-110',
        )}
      >
        <Heart size={size === 'xs' ? 13 : 16} className={cx(done ? 'fill-gold text-gold' : 'fill-ink/80')} />
        {!iconOnly && (done ? doneLabel : label)}
      </button>
      <GoldBurst trigger={burst} />
    </span>
  )
}

/**
 * Bouton « Voter » : une voix par compte et par discipline, modifiable.
 * Seuls les votes comptent pour le classement.
 */
export function VoteButton({
  talentId,
  size = 'md',
  className,
  iconOnly,
}: {
  talentId: string
  size?: keyof typeof BTN_SIZES
  className?: string
  iconOnly?: boolean
}) {
  const { vote, myVote, toast, user } = useApp()
  const nav = useNavigate()
  const { pathname } = useLocation()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const t = talentById(talentId)
  const current = myVote(t.category)
  const mine = current === talentId
  const cat = CATEGORY_LABEL[t.category]

  useEffect(() => {
    if (!confirming) return
    const i = setTimeout(() => setConfirming(false), 4000)
    return () => clearTimeout(i)
  }, [confirming])

  const onClick = async (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (mine) return toast(`${t.name} a déjà ta voix en ${cat}`, 'info')
    if (!user) {
      toast('Connecte-toi pour voter : une voix par compte et par discipline', 'info')
      return nav('/connexion?suite=' + encodeURIComponent(pathname))
    }
    if (current && !confirming) return setConfirming(true)
    setConfirming(false)
    setBusy(true)
    const r = await vote(talentId)
    setBusy(false)
    if (r === 'voted') toast(`Ta voix en ${cat} va à ${t.name}`)
    else if (r === 'changed') toast(`Vote modifié : ta voix en ${cat} va maintenant à ${t.name}`)
    else if (r === 'needAccount') nav('/connexion?suite=' + encodeURIComponent(pathname))
    else if (r === 'error') toast('Vote non enregistré. Vérifie ta connexion et réessaie.', 'info')
  }

  const text = mine ? 'Mon vote ✓' : confirming ? 'Remplacer mon vote ?' : 'Voter'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-pressed={mine}
      aria-label={iconOnly ? text : undefined}
      title={mine ? `Ta voix en ${cat}` : current ? `Tu as déjà voté en ${cat} : un nouveau clic déplacera ta voix` : `Donner ta voix en ${cat} (1 par discipline)`}
      className={cx(
        'relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-extrabold transition-all duration-200 active:scale-[.96] disabled:opacity-60',
        iconOnly ? (size === 'lg' ? 'h-12 w-12' : size === 'md' ? 'h-11 w-11' : 'h-9 w-9') : BTN_SIZES[size],
        mine
          ? 'bg-stage text-white shadow-[0_8px_24px_-8px_rgba(104,55,181,.9)]'
          : confirming
            ? 'border border-stagelight bg-stage/25 text-white'
            : 'border border-stagelight/60 text-[#d9c6ff] hover:bg-stage/20',
        className,
      )}
    >
      <Trophy size={size === 'xs' ? 13 : 16} className={mine ? 'fill-white/30' : ''} />
      {!iconOnly && text}
    </button>
  )
}

/** Les deux compteurs côte à côte : encouragements (♥) et votes (🏆) */
export function EngagementCounts({
  talentId,
  className,
  compact,
  spread,
}: {
  talentId: string
  className?: string
  compact?: boolean
  /** encouragements à gauche, votes à droite (cartes) */
  spread?: boolean
}) {
  const { supportCount, voteCount, hasSupported, myVote } = useApp()
  const t = talentById(talentId)
  return (
    <span
      className={cx(
        'items-center tabular-nums',
        spread ? 'flex w-full justify-between text-[13px]' : 'inline-flex gap-2.5',
        !spread && (compact ? 'text-[12px]' : 'text-[13px]'),
        className,
      )}
    >
      <span className="inline-flex items-center gap-1 font-extrabold" title="Encouragements">
        <Heart size={compact ? 12 : 13} className={cx('text-gold', hasSupported(talentId) && 'fill-gold')} />
        {fmtNum(supportCount(talentId))}
      </span>
      <span className="inline-flex items-center gap-1 font-extrabold text-[#d9c6ff]" title="Votes">
        <Trophy size={compact ? 12 : 13} className={cx('text-stagelight', myVote(t.category) === talentId && 'fill-stagelight/40')} />
        {fmtNum(voteCount(talentId))}
      </span>
    </span>
  )
}

/** Vignette ronde du portrait, centrée sur le visage */
export function PortraitThumb({ talent, className }: { talent: Talent; className?: string }) {
  return (
    <span className={cx('relative block shrink-0 overflow-hidden rounded-full bg-night ring-1 ring-white/10', className)}>
      <Portrait
        look={talent.look}
        category={talent.category}
        seed={talent.id}
        className="absolute inset-0 h-full w-full origin-[50%_30%] scale-[1.3]"
      />
    </span>
  )
}

/** Barres d’égaliseur (animées seulement en lecture) */
export function EqBars({ active, className, bars = 5 }: { active: boolean; className?: string; bars?: number }) {
  return (
    <span className={cx('inline-flex h-4 items-end gap-[3px]', className)} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cx('h-full w-[3px] origin-bottom rounded-full bg-gold-soft', active ? 'animate-eq' : 'scale-y-[.3]')}
          style={active ? { animationDelay: `${-((i * 0.37) % 1)}s`, animationDuration: `${0.7 + (i % 3) * 0.22}s` } : undefined}
        />
      ))}
    </span>
  )
}

const MEDALS = [
  'bg-gold-metal text-ink shadow-[0_0_18px_rgba(244,215,140,.55)]',
  'bg-[linear-gradient(135deg,#ffffff_0%,#c9ced8_40%,#7d8494_70%,#e6e9ef_100%)] text-ink shadow-[0_0_14px_rgba(220,225,235,.35)]',
  'bg-[linear-gradient(135deg,#f3c39a_0%,#c47a3f_45%,#7a4320_75%,#e2a77a_100%)] text-ink shadow-[0_0_14px_rgba(205,127,60,.4)]',
]
export function RankBadge({ rank, className }: { rank: number; className?: string }) {
  return (
    <span
      className={cx(
        'grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-[20px] leading-none',
        rank <= 3 ? MEDALS[rank - 1] : 'border border-white/10 bg-white/[0.04] text-white/60',
        className,
      )}
    >
      {rank}
    </span>
  )
}

/** Animation FLIP : les lignes glissent vers leur nouvelle position quand l’ordre change */
export function useFlip(order: string[]) {
  const nodes = useRef(new Map<string, HTMLElement>())
  const prev = useRef(new Map<string, number>())
  const sig = order.join('|')
  useLayoutEffect(() => {
    const next = new Map<string, number>()
    nodes.current.forEach((el, k) => {
      if (el.offsetParent === null) return // ligne masquée : on ne l’anime pas
      const top = el.offsetTop
      next.set(k, top)
      const p = prev.current.get(k)
      if (p !== undefined && p !== top) {
        el.style.transition = 'none'
        el.style.transform = `translateY(${p - top}px)`
        void el.offsetHeight
        el.style.transition = 'transform 650ms cubic-bezier(.2,.8,.2,1)'
        el.style.transform = ''
      }
    })
    prev.current = next
  }, [sig])
  return (key: string) => (el: HTMLElement | null) => {
    if (el) nodes.current.set(key, el)
    else nodes.current.delete(key)
  }
}

/** Trophée doré MICRO D’OR (illustration vectorielle) */
export function TrophyArt({ className }: { className?: string }) {
  const id = useSvgId('tr')
  const sparkles = [
    [30, 40, 7, 0],
    [172, 30, 9, 0.6],
    [180, 120, 6, 1.1],
    [18, 132, 5, 0.3],
    [150, 8, 4, 0.9],
  ]
  return (
    <svg viewBox="0 0 200 220" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}glow`} cx=".5" cy=".42" r=".5">
          <stop offset="0" stopColor="#F4D78C" stopOpacity=".55" />
          <stop offset=".45" stopColor="#9B6BE8" stopOpacity=".22" />
          <stop offset="1" stopColor="#6837B5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8A6420" />
          <stop offset=".18" stopColor="#F4D78C" />
          <stop offset=".38" stopColor="#FFF2C6" />
          <stop offset=".6" stopColor="#D6AC55" />
          <stop offset=".85" stopColor="#7a5418" />
          <stop offset="1" stopColor="#C99B45" />
        </linearGradient>
        <linearGradient id={`${id}v`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF2C6" />
          <stop offset=".5" stopColor="#D6AC55" />
          <stop offset="1" stopColor="#7a5418" />
        </linearGradient>
        <linearGradient id={`${id}base`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2116" />
          <stop offset="1" stopColor="#0c0a07" />
        </linearGradient>
        <filter id={`${id}blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <circle cx="100" cy="92" r="100" fill={`url(#${id}glow)`} />
      {/* faisceaux */}
      <g opacity=".22" fill="#F4D78C">
        <polygon points="100,70 60,-10 80,-10" />
        <polygon points="100,70 120,-10 140,-10" />
        <polygon points="100,70 -10,40 -10,60" />
        <polygon points="100,70 210,40 210,60" />
      </g>

      {/* anses */}
      <g fill="none" stroke={`url(#${id}v)`} strokeWidth="8" strokeLinecap="round">
        <path d="M60,54 Q26,52 30,80 Q34,104 66,110" />
        <path d="M140,54 Q174,52 170,80 Q166,104 134,110" />
      </g>
      {/* coupe */}
      <path d="M54,40 L146,40 L141,96 Q136,138 100,142 Q64,138 59,96 Z" fill={`url(#${id}g)`} />
      <ellipse cx="100" cy="40" rx="46" ry="7.5" fill="#FFF2C6" />
      <ellipse cx="100" cy="40.5" rx="39" ry="4.6" fill="#7a5418" />
      <path d="M70,50 Q66,92 86,128" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />

      {/* micro gravé */}
      <g>
        <rect x="88" y="58" width="24" height="34" rx="12" fill="#6f4c16" />
        <rect x="90.5" y="60.5" width="19" height="29" rx="9.5" fill={`url(#${id}v)`} />
        {[66, 72, 78, 84].map((y) => (
          <line key={y} x1="92" x2="108" y1={y} y2={y} stroke="#8A6420" strokeWidth="1.4" />
        ))}
        <path d="M82,84 Q82,104 100,104 Q118,104 118,84" fill="none" stroke="#6f4c16" strokeWidth="3" strokeLinecap="round" />
        <rect x="98" y="104" width="4" height="12" fill="#6f4c16" />
        <rect x="91" y="115" width="18" height="3.5" rx="1.75" fill="#6f4c16" />
      </g>

      {/* pied */}
      <rect x="92" y="140" width="16" height="22" fill={`url(#${id}g)`} />
      <ellipse cx="100" cy="150" rx="13" ry="5" fill={`url(#${id}g)`} />
      <path d="M70,162 L130,162 L138,184 L62,184 Z" fill={`url(#${id}g)`} />
      <rect x="50" y="184" width="100" height="22" rx="4" fill={`url(#${id}base)`} />
      <rect x="50" y="184" width="100" height="3" fill="#D6AC55" opacity=".8" />
      <rect x="74" y="191" width="52" height="9" rx="2" fill={`url(#${id}g)`} opacity=".9" />

      {/* étincelles */}
      {sparkles.map(([x, y, s, d], i) => (
        <path
          key={i}
          className="animate-pulseLive"
          style={{ animationDelay: `${d}s`, animationDuration: `${1.6 + i * 0.3}s` }}
          d={`M${x},${y - s} Q${x},${y} ${x + s},${y} Q${x},${y} ${x},${y + s} Q${x},${y} ${x - s},${y} Q${x},${y} ${x},${y - s} Z`}
          fill="#FFF2C6"
        />
      ))}
    </svg>
  )
}
