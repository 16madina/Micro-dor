import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, FlaskConical, type LucideIcon } from 'lucide-react'
import { cx } from '../ui'

/** Bandeau d’avertissement « démonstration » */
export function DemoNotice({
  children,
  title = 'Information',
  tone = 'gold',
  icon: Icon = FlaskConical,
  className,
}: {
  children: ReactNode
  title?: string
  tone?: 'gold' | 'violet' | 'amber'
  icon?: LucideIcon
  className?: string
}) {
  const tones = {
    gold: 'border-gold/30 bg-gold/[0.06] text-goldlight',
    violet: 'border-stagelight/30 bg-stage/[0.12] text-[#c9b6ff]',
    amber: 'border-[#F2A65A]/40 bg-[#F2A65A]/[0.08] text-[#FFC98A]',
  }
  return (
    <div className={cx('flex items-start gap-3 rounded-2xl border px-4 py-3', tones[tone], className)}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="text-[12.5px] leading-relaxed text-white/70">
        <span className="font-extrabold text-current">{title}</span>
        {title ? ' — ' : ''}
        {children}
      </div>
    </div>
  )
}

/** Rangée de liste avec icône (style maquette client) */
export function RowItem({
  icon: Icon,
  title,
  sub,
  to,
  onClick,
  right,
  className,
}: {
  icon: LucideIcon
  title: ReactNode
  sub?: ReactNode
  to?: string
  onClick?: () => void
  right?: ReactNode
  className?: string
}) {
  const inner = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gradient-to-br from-gold/15 to-transparent text-goldlight">
        <Icon size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-bold leading-tight">{title}</span>
        {sub && <span className="mt-0.5 block truncate text-[12.5px] text-white/55">{sub}</span>}
      </span>
      {right}
      <ChevronRight size={18} className="shrink-0 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-gold" />
    </>
  )
  const cls = cx('group flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition hover:bg-white/[0.04]', className)
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    )
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  )
}

/** Interrupteur (préférences de démonstration, état local) */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative h-7 w-12 shrink-0 rounded-full border transition',
        checked ? 'border-gold/60 bg-gold-soft shadow-gold' : 'border-white/15 bg-white/[0.08]',
      )}
    >
      <span
        className={cx(
          'absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow transition-all',
          checked ? 'left-[calc(100%-1.4rem)] bg-ink' : 'left-1 bg-white/70',
        )}
      />
    </button>
  )
}

/** En-tête de bloc dans une carte */
export function BlockTitle({ icon: Icon, children, aside }: { icon?: LucideIcon; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 font-display text-[24px] leading-none tracking-wide lg:text-[26px]">
        {Icon && <Icon size={18} className="text-gold" />}
        {children}
      </h3>
      {aside}
    </div>
  )
}

/** Défilement doux vers une ancre de la page */
export const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
