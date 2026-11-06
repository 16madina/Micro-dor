import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Phone } from 'lucide-react'
import { CAMPAIGN_STATUS_LABEL, type Campaign, type CampaignStatus } from '../data/campaigns'
import { cx } from './ui'

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

export function CampaignCard({ c, className }: { c: Campaign; className?: string }) {
  return (
    <Link
      to={`/campagnes/${c.id}`}
      className={cx('group card flex flex-col overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:border-gold/40', className)}
    >
      <div className="relative h-44 overflow-hidden lg:h-48">
        <img src={c.photo} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 opacity-35 mix-blend-color" style={{ background: c.accent }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <CampaignStatusBadge status={c.status} className="absolute left-3 top-3" />
        <div className="absolute inset-x-4 bottom-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: c.accent }}>
            {c.topic}
          </div>
          <div className="font-display text-[30px] leading-[0.95] tracking-wide">{c.title}</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[14px] leading-relaxed text-white/65">{c.tagline}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-white/45">
            <CalendarDays size={13} /> {c.period}
          </span>
          <span className="flex items-center gap-1 text-[13px] font-bold text-gold transition group-hover:text-goldlight">
            Voir <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </span>
        </div>
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
