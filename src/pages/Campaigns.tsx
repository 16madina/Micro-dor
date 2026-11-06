import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, HeartHandshake, Megaphone, Mic2, PenLine, School, Users } from 'lucide-react'
import { CAMPAIGNS, type CampaignStatus } from '../data/campaigns'
import { CampaignBanner, CampaignCard, CampaignStatusBadge, CarouselArrows, CarouselDots, ResourceCard, useCarousel } from '../components/campaigns'
import { Button, Chips, PageHero, SectionHeader } from '../components/ui'

type Filter = CampaignStatus | 'all'

const STEPS = [
  { icon: School, title: 'L’école s’inscrit', text: 'La direction choisit une ou plusieurs campagnes selon les besoins de ses élèves.' },
  { icon: PenLine, title: 'Les élèves créent', text: 'Avec des artistes-mentors, ils écrivent textes, chansons et chorégraphies sur le thème.' },
  { icon: Mic2, title: 'La scène porte le message', text: 'Un spectacle-conférence réunit toute l’école, suivi d’un échange encadré.' },
  { icon: HeartHandshake, title: 'Le suivi continue', text: 'L’école reçoit une trousse d’animation et la liste des ressources d’aide de sa région.' },
]

/** Les bannières de toutes les campagnes, qui défilent */
function BannerCarousel() {
  const { i, go, paused, bind } = useCarousel(CAMPAIGNS.length)
  const c = CAMPAIGNS[i]
  return (
    <section aria-roledescription="carrousel" aria-label="Nos campagnes" className="gold-border overflow-hidden rounded-[24px] shadow-stage lg:rounded-[28px]" {...bind}>
      <div className="group/car relative overflow-hidden">
        <div className="flex transition-transform duration-700 ease-[cubic-bezier(.65,0,.35,1)]" style={{ transform: `translateX(-${i * 100}%)` }}>
          {CAMPAIGNS.map((x, n) => (
            <Link key={x.id} to={`/campagnes/${x.id}`} tabIndex={n === i ? 0 : -1} aria-hidden={n !== i} className="w-full shrink-0">
              <CampaignBanner c={x} eager={n < 2} />
            </Link>
          ))}
        </div>
        <CarouselArrows i={i} go={go} />
      </div>
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:gap-8 lg:p-7">
        <div key={c.id} className="min-h-[132px] min-w-0 flex-1 animate-fadeUp lg:min-h-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-goldlight">
              <Megaphone size={12} /> {c.topic}
            </span>
            <CampaignStatusBadge status={c.status} />
          </div>
          <p className="mt-3 pt-[0.12em] font-display text-[28px] leading-[0.95] tracking-wide text-gold-shine lg:text-[36px]">{c.slogan}</p>
          <p className="mt-1.5 max-w-xl text-[14.5px] leading-relaxed text-white/70">{c.tagline}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <Button to={`/campagnes/${c.id}`} size="lg" iconRight={<ArrowRight size={16} />} className="max-sm:w-full">
            Découvrir la campagne
          </Button>
          <CarouselDots count={CAMPAIGNS.length} i={i} go={go} paused={paused} className="max-sm:justify-center" />
        </div>
      </div>
    </section>
  )
}

export default function Campaigns() {
  const [filter, setFilter] = useState<Filter>('all')
  const list = filter === 'all' ? CAMPAIGNS : CAMPAIGNS.filter((c) => c.status === filter)
  const count = (s: CampaignStatus) => CAMPAIGNS.filter((c) => c.status === s).length

  return (
    <div>
      <PageHero
        eyebrow="Sensibilisation jeunesse"
        title={
          <>
            Nos <span className="text-gold-metal">campagnes</span>
          </>
        }
        sub="Criminalité, décrochage, santé mentale, cyberintimidation… MICRO D’OR utilise la scène pour parler aux jeunes des sujets qui comptent, avec leurs mots à eux."
      />

      <BannerCarousel />

      <section className="mt-12">
        <SectionHeader eyebrow={`${CAMPAIGNS.length} campagnes`} title="Toutes nos campagnes" />
        <Chips<Filter>
          className="mb-5"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'Toutes' },
            { value: 'en-cours', label: `En cours (${count('en-cours')})` },
            { value: 'a-venir', label: `À venir (${count('a-venir')})` },
            { value: 'terminee', label: `Terminées (${count('terminee')})` },
          ]}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => (
            <CampaignCard key={c.id} c={c} className="animate-fadeUp" />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeader eyebrow="Comment ça marche" title="Une campagne dans ton école" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-soft text-ink shadow-gold">
                  <s.icon size={20} />
                </span>
                <span className="font-display text-[34px] leading-none text-white/15">0{i + 1}</span>
              </div>
              <div className="mt-4 text-[15.5px] font-extrabold">{s.title}</div>
              <p className="mt-1 text-[13.5px] leading-relaxed text-white/60">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="gold-border mt-6 flex flex-col items-start gap-4 rounded-3xl p-6 lg:flex-row lg:items-center lg:p-8">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold-soft text-ink shadow-gold">
            <Users size={26} />
          </span>
          <div className="flex-1">
            <div className="font-display text-[30px] leading-none tracking-wide">Amène une campagne dans ton école</div>
            <p className="mt-1.5 text-[14px] text-white/60">Direction, enseignant·e, intervenant·e ou élève : parlez-nous des besoins de votre milieu.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button to="/partenaires" size="lg" iconRight={<ArrowRight size={16} />}>
              Nous contacter
            </Button>
            <Button to="/prevention" size="lg" variant="ghost">
              Notre mission
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <SectionHeader eyebrow="Tu n’es pas seul·e" title="Besoin de parler ?" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ResourceCard r={{ name: 'Tel-jeunes', contact: '1 800 263-2266 · texto 514 600-1002', note: 'Gratuit, confidentiel, 24 h sur 24, pour les 5 à 20 ans.' }} />
          <ResourceCard r={{ name: 'Jeunesse, J’écoute', contact: '1 800 668-6868 · texto 686868', note: 'Écoute et soutien en tout temps, partout au Canada.' }} />
          <ResourceCard r={{ name: 'Urgence', contact: '911', note: 'Si toi ou quelqu’un d’autre êtes en danger immédiat.' }} />
        </div>
      </section>
    </div>
  )
}
