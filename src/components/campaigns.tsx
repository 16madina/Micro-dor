import { useCallback, useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Phone } from 'lucide-react'
import { CAMPAIGN_STATUS_LABEL, type Campaign, type CampaignStatus } from '../data/campaigns'
import { cx } from './ui'

/* ---------- Carrousel (défilement auto, glisser au doigt, pause au survol) ---------- */

export const CAROUSEL_DELAY = 6500

export function useCarousel(count: number, delay = CAROUSEL_DELAY) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const go = useCallback((n: number) => setI(((n % count) + count) % count), [count])

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setTimeout(() => {
      if (!document.hidden) setI((x) => (x + 1) % count)
    }, delay)
    return () => window.clearTimeout(t)
  }, [i, paused, count, delay])

  const bind: HTMLAttributes<HTMLElement> = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocusCapture: () => setPaused(true),
    onBlurCapture: () => setPaused(false),
    onTouchStart: (e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }),
    onTouchEnd: (e) => {
      const s = touch.current
      touch.current = null
      if (!s) return
      const dx = e.changedTouches[0].clientX - s.x
      const dy = e.changedTouches[0].clientY - s.y
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1))
    },
  }
  return { i, go, paused, bind, delay }
}

export function CarouselDots({ count, i, go, paused, delay = CAROUSEL_DELAY, className }: { count: number; i: number; go: (n: number) => void; paused: boolean; delay?: number; className?: string }) {
  return (
    <div className={cx('flex gap-2', className)}>
      {Array.from({ length: count }, (_, n) => (
        <button key={n} aria-label={`Voir l’affiche ${n + 1}`} aria-current={n === i} onClick={() => go(n)} className="group/dot relative h-6 py-2.5">
          <span className={cx('block h-1 overflow-hidden rounded-full bg-white/25 transition-all duration-300', n === i ? 'w-10' : 'w-4 group-hover/dot:bg-white/45')}>
            {n === i && (
              <span
                key={`${i}-${paused}`}
                className="block h-full rounded-full bg-gold-soft"
                style={{ animation: paused ? 'none' : `heroProgress ${delay}ms linear forwards`, width: paused ? '100%' : undefined }}
              />
            )}
          </span>
        </button>
      ))}
    </div>
  )
}

/** Flèches visibles au survol, sur ordinateur (le parent doit porter la classe group/car) */
export function CarouselArrows({ i, go, className }: { i: number; go: (n: number) => void; className?: string }) {
  const btn =
    'absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-ink/70 text-goldlight opacity-0 backdrop-blur transition hover:bg-ink group-hover/car:opacity-100 lg:grid'
  return (
    <>
      <button aria-label="Affiche précédente" onClick={() => go(i - 1)} className={cx(btn, 'left-4', className)}>
        <ChevronLeft size={22} />
      </button>
      <button aria-label="Affiche suivante" onClick={() => go(i + 1)} className={cx(btn, 'right-4', className)}>
        <ChevronRight size={22} />
      </button>
    </>
  )
}

/* ---------- Campagnes ---------- */

const STATUS_STYLE: Record<CampaignStatus, string> = {
  'en-cours': 'border-emerald-400/50 bg-emerald-400/15 text-emerald-300',
  'a-venir': 'border-gold/50 bg-gold/15 text-goldlight',
  terminee: 'border-white/20 bg-white/10 text-white/70',
}

export function CampaignStatusBadge({ status, className }: { status: CampaignStatus; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] backdrop-blur', STATUS_STYLE[status], className)}>
      {status === 'en-cours' && <span className="h-1.5 w-1.5 animate-pulseLive rounded-full bg-emerald-300" />}
      {CAMPAIGN_STATUS_LABEL[status]}
    </span>
  )
}

/** Bannière officielle de la campagne, au bon format */
export function CampaignBanner({ c, className, eager }: { c: Campaign; className?: string; eager?: boolean }) {
  return (
    <img
      src={c.banner}
      alt={`${c.title} : ${c.topic}`}
      width={832}
      height={300}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={cx('block aspect-[832/300] w-full object-cover', className)}
    />
  )
}

export function CampaignCard({ c, className }: { c: Campaign; className?: string }) {
  return (
    <Link
      to={`/campagnes/${c.id}`}
      className={cx('group card flex flex-col overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:border-gold/40', className)}
    >
      <div className="overflow-hidden">
        <CampaignBanner c={c} className="transition duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <CampaignStatusBadge status={c.status} />
          <span className="flex items-center gap-1.5 text-[11.5px] font-semibold text-white/45">
            <CalendarDays size={12} /> {c.period}
          </span>
        </div>
        <div className="mt-3 pt-[0.1em] font-display text-[24px] leading-[1] tracking-wide text-gold-metal">{c.slogan}</div>
        <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{c.tagline}</p>
        <span className="mt-auto flex items-center gap-1 pt-4 text-[13px] font-bold text-gold transition group-hover:text-goldlight">
          Découvrir la campagne <ArrowRight size={15} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export function ResourceCard({ r }: { r: Campaign['resources'][number] }) {
  return (
    <div className="card flex gap-3 p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold/[0.07] text-gold">
        <Phone size={18} />
      </span>
      <div className="min-w-0">
        <div className="text-[14.5px] font-extrabold">{r.name}</div>
        <div className="text-[13.5px] font-bold text-goldlight">{r.contact}</div>
        <div className="mt-0.5 text-[12.5px] leading-snug text-white/55">{r.note}</div>
      </div>
    </div>
  )
}
