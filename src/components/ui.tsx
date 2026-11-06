import { useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, FlaskConical } from 'lucide-react'
import { CATEGORY_LABEL, STATUS_LABEL, type Category, type ShowStatus } from '../data'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
export { cx }

type Variant = 'gold' | 'outline' | 'ghost' | 'dark'
const VARIANTS: Record<Variant, string> = {
  gold: 'bg-gold-soft text-ink font-extrabold shadow-gold hover:brightness-110 active:scale-[.98]',
  outline: 'border border-gold/60 text-goldlight hover:bg-gold/10 active:scale-[.98]',
  ghost: 'text-white/80 hover:text-white hover:bg-white/5',
  dark: 'bg-white/[0.06] border border-white/10 text-white hover:bg-white/10 active:scale-[.98]',
}
const SIZES = { sm: 'h-9 px-4 text-[13px]', md: 'h-11 px-5 text-sm', lg: 'h-12 px-7 text-[15px]' }

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: keyof typeof SIZES
  to?: string
  icon?: ReactNode
  iconRight?: ReactNode
}

export function Button({ variant = 'gold', size = 'md', to, icon, iconRight, className, children, ...rest }: BtnProps) {
  const cls = cx(
    'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 whitespace-nowrap select-none',
    VARIANTS[variant],
    SIZES[size],
    className,
  )
  const inner = (
    <>
      {icon}
      {children}
      {iconRight}
    </>
  )
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    )
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  )
}

export function IconButton({ className, children, label, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cx(
        'relative grid h-10 w-10 place-items-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Chips<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div className={cx('no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            'h-9 shrink-0 rounded-full px-4 text-[13px] font-semibold transition',
            value === o.value
              ? 'bg-gold-soft text-ink shadow-gold'
              : 'border border-white/10 bg-white/[0.04] text-white/75 hover:border-gold/40 hover:text-white',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function StatusBadge({ status, className }: { status: ShowStatus; className?: string }) {
  if (status === 'live')
    return (
      <span className={cx('inline-flex items-center gap-1.5 rounded-md bg-live px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(229,56,79,.5)]', className)}>
        <span className="h-1.5 w-1.5 animate-pulseLive rounded-full bg-white" />
        En direct (Démo)
      </span>
    )
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-md px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider',
        status === 'upcoming' ? 'bg-stage text-white' : 'bg-white/15 text-white/85 backdrop-blur',
        className,
      )}
    >
      {status === 'replay' ? 'Terminé · Rediffusion' : STATUS_LABEL[status]}
    </span>
  )
}

const CAT_COLOR: Record<Category | 'mixte', string> = {
  chant: 'text-goldlight border-gold/40 bg-gold/10',
  slam: 'text-[#c9b6ff] border-stagelight/40 bg-stage/15',
  rap: 'text-[#ff9aae] border-live/40 bg-live/10',
  danse: 'text-[#8ff5e2] border-[#18a39a]/50 bg-[#18a39a]/10',
  theatre: 'text-[#ffc08a] border-[#e0602f]/50 bg-[#e0602f]/10',
  mixte: 'text-white/80 border-white/15 bg-white/5',
}
export function CategoryTag({ category, className }: { category: Category | 'mixte'; className?: string }) {
  return (
    <span className={cx('inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-bold', CAT_COLOR[category], className)}>
      {CATEGORY_LABEL[category]}
    </span>
  )
}

export function DemoPill({ children = 'Données de démonstration', className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10.5px] font-semibold text-white/55', className)}>
      <FlaskConical size={11} className="text-gold/80" />
      {children}
    </span>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  action?: { label: string; to: string }
  className?: string
}) {
  return (
    <div className={cx('mb-4 flex items-end justify-between gap-4', className)}>
      <div>
        {eyebrow && <div className="eyebrow mb-1.5">{eyebrow}</div>}
        <h2 className="font-display text-[30px] leading-none tracking-wide text-white lg:text-[38px]">{title}</h2>
      </div>
      {action && (
        <Link to={action.to} className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-gold hover:text-goldlight">
          {action.label}
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  )
}

/** Rangée horizontale défilante avec flèches sur ordinateur */
export function HScroll({ children, className, itemClass }: { children: ReactNode; className?: string; itemClass?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <div className={cx('group/h relative', className)}>
      <div ref={ref} className={cx('no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 lg:mx-0 lg:gap-4 lg:px-0', itemClass)}>
        {children}
      </div>
      <button
        aria-label="Précédent"
        onClick={() => scroll(-1)}
        className="absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-ink/90 text-goldlight opacity-0 shadow-card transition group-hover/h:opacity-100 lg:grid"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        aria-label="Suivant"
        onClick={() => scroll(1)}
        className="absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-ink/90 text-goldlight opacity-0 shadow-card transition group-hover/h:opacity-100 lg:grid"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

/** Explosion de particules dorées (feedback de soutien) */
export function GoldBurst({ trigger }: { trigger: number }) {
  if (!trigger) return null
  return (
    <span key={trigger} className="pointer-events-none absolute inset-0 grid place-items-center overflow-visible">
      <span className="absolute h-16 w-16 animate-burst rounded-full border-2 border-goldlight" />
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2
        const d = 34 + (i % 3) * 14
        return (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 animate-particle rounded-full bg-goldlight shadow-[0_0_8px_#F4D78C]"
            style={{ ['--dx' as string]: `${Math.cos(a) * d}px`, ['--dy' as string]: `${Math.sin(a) * d}px` }}
          />
        )
      })}
    </span>
  )
}

export function useBurst() {
  const [n, setN] = useState(0)
  return [n, () => setN((x) => x + 1)] as const
}

export function PageHero({
  eyebrow,
  title,
  sub,
  children,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  sub?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('mb-6 animate-fadeUp', className)}>
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <h1 className="font-display text-[40px] leading-[0.95] tracking-wide lg:text-[60px]">{title}</h1>
      {sub && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/65">{sub}</p>}
      {children}
    </div>
  )
}

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div className={cx('no-scrollbar flex gap-1 overflow-x-auto border-b border-white/10', className)}>
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cx(
            'relative shrink-0 px-4 py-3 text-[13.5px] font-bold transition',
            value === t.value ? 'text-goldlight' : 'text-white/55 hover:text-white',
          )}
        >
          {t.label}
          {value === t.value && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold-soft" />}
        </button>
      ))}
    </div>
  )
}

export function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-[30px] leading-none text-goldlight">{value}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/50">{label}</div>
    </div>
  )
}
