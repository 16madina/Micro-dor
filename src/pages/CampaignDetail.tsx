import { useParams } from 'react-router-dom'
import { ArrowRight, CalendarDays, Check, Megaphone, Quote, Target } from 'lucide-react'
import { CAMPAIGNS, campaignById } from '../data/campaigns'
import { CampaignBanner, CampaignCard, CampaignStatusBadge, ResourceCard } from '../components/campaigns'
import { Button, HScroll, SectionHeader } from '../components/ui'

export default function CampaignDetail() {
  const { id } = useParams()
  const c = campaignById(id ?? '')

  if (!c)
    return (
      <div className="py-24 text-center">
        <p className="text-white/60">Cette campagne est introuvable.</p>
        <Button to="/campagnes" className="mt-4">
          Voir nos campagnes
        </Button>
      </div>
    )

  const others = CAMPAIGNS.filter((x) => x.id !== c.id)

  return (
    <div key={c.id}>
      {/* Bannière */}
      <section className="relative -mx-4 -mt-4 overflow-hidden lg:mx-0 lg:mt-0 lg:rounded-[28px] lg:border lg:border-white/[0.07] lg:shadow-stage">
        <img src={c.banner} alt="" aria-hidden decoding="async" className="absolute inset-0 h-full w-full scale-125 object-cover blur-3xl brightness-[.45]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/60 to-ink" />
        <div className="relative">
          <CampaignBanner c={c} eager className="animate-fadeIn" />
          <div className="p-5 pb-7 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:p-10 lg:pt-8">
            <div className="min-w-0">
              <div className="mb-3 flex animate-fadeUp flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-ink/50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-goldlight backdrop-blur">
                  <Megaphone size={12} /> {c.topic}
                </span>
                <CampaignStatusBadge status={c.status} />
              </div>
              <h1 className="sr-only">{c.title}</h1>
              <p className="animate-fadeUp pt-[0.12em] font-display text-[34px] leading-[0.95] tracking-wide text-gold-shine [animation-delay:.06s] lg:text-[52px]">{c.slogan}</p>
              <p className="mt-3 max-w-xl animate-fadeUp text-[15.5px] leading-relaxed text-white/80 [animation-delay:.12s]">{c.tagline}</p>
            </div>
            <div className="mt-4 flex shrink-0 animate-fadeUp items-center gap-1.5 text-[13px] font-semibold text-white/55 [animation-delay:.18s] lg:mt-0">
              <CalendarDays size={14} /> {c.period}
            </div>
          </div>
        </div>
      </section>

      {/* Présentation */}
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <div className="eyebrow mb-2">La campagne</div>
          <p className="text-[17px] leading-relaxed text-white/85 lg:text-[19px]">{c.summary}</p>
          <h2 className="mt-8 font-display text-[30px] leading-none tracking-wide lg:text-[36px]">Pourquoi cette campagne ?</h2>
          <ul className="mt-4 space-y-3">
            {c.why.map((w) => (
              <li key={w} className="flex gap-3 text-[14.5px] leading-relaxed text-white/70">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold-soft" />
                {w}
              </li>
            ))}
          </ul>
        </div>
        <div className="gold-border h-fit rounded-3xl p-5 lg:p-6">
          <div className="flex items-center gap-2 text-gold">
            <Target size={18} />
            <span className="eyebrow">Nos objectifs</span>
          </div>
          <ol className="mt-4 space-y-4">
            {c.goals.map((g, i) => (
              <li key={g} className="flex gap-3">
                <span className="font-display text-[30px] leading-none text-gold-metal">{i + 1}</span>
                <span className="pt-1 text-[14.5px] font-semibold leading-snug text-white/85">{g}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Actions */}
      <section className="mt-12">
        <SectionHeader eyebrow="Sur le terrain" title="Ce qu’on fait dans les écoles" />
        <div className="grid gap-3 lg:grid-cols-3">
          {c.actions.map((a, i) => (
            <div key={a.title} className="card relative overflow-hidden p-5">
              <span className="absolute inset-x-0 top-0 h-1 bg-gold-soft" />
              <span className="font-display text-[34px] leading-none text-white/15">0{i + 1}</span>
              <div className="mt-2 text-[16px] font-extrabold">{a.title}</div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/60">{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Messages clés */}
      <section className="mt-12">
        <SectionHeader eyebrow="Ce qu’on veut que tu retiennes" title="Les messages clés" />
        <div className="grid gap-3 sm:grid-cols-3">
          {c.messages.map((m) => (
            <figure key={m} className="glass relative rounded-2xl border border-gold/25 p-5">
              <Quote size={22} className="text-gold/60" />
              <blockquote className="mt-2 font-display text-[26px] leading-[1.02] tracking-wide text-goldlight">{m}</blockquote>
            </figure>
          ))}
        </div>
      </section>

      {/* Participer */}
      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeader eyebrow="Passe à l’action" title="Comment participer" />
          <ul className="space-y-3">
            {c.participate.map((p) => (
              <li key={p} className="card flex items-start gap-3 p-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-soft text-ink">
                  <Check size={15} strokeWidth={3} />
                </span>
                <span className="pt-0.5 text-[14.5px] leading-snug text-white/85">{p}</span>
              </li>
            ))}
          </ul>
          <Button to="/partenaires" variant="outline" className="mt-5" iconRight={<ArrowRight size={16} />}>
            Inscrire mon école
          </Button>
        </div>
        <div>
          <SectionHeader eyebrow="Tu n’es pas seul·e" title="Besoin d’aide ?" />
          <div className="space-y-3">
            {c.resources.map((r) => (
              <ResourceCard key={r.name} r={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Autres campagnes */}
      <section className="mt-14">
        <SectionHeader eyebrow="Continuer" title="Nos autres campagnes" action={{ label: 'Toutes', to: '/campagnes' }} />
        <HScroll>
          {others.map((o) => (
            <CampaignCard key={o.id} c={o} className="w-[290px] shrink-0 snap-start lg:w-[340px]" />
          ))}
        </HScroll>
      </section>
    </div>
  )
}
