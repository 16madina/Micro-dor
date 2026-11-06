import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, HeartHandshake, Megaphone, Mic2, PenLine, School, Users } from 'lucide-react'
import { CAMPAIGNS, type CampaignStatus } from '../data/campaigns'
import { CampaignCard, CampaignStatusBadge, ResourceCard } from '../components/campaigns'
import { Button, Chips, PageHero, SectionHeader } from '../components/ui'

type Filter = CampaignStatus | 'all'

const STEPS = [
  { icon: School, title: 'L’école s’inscrit', text: 'La direction choisit une ou plusieurs campagnes selon les besoins de ses élèves.' },
  { icon: PenLine, title: 'Les élèves créent', text: 'Avec des artistes-mentors, ils écrivent textes, chansons et chorégraphies sur le thème.' },
  { icon: Mic2, title: 'La scène porte le message', text: 'Un spectacle-conférence réunit toute l’école, suivi d’un échange encadré.' },
  { icon: HeartHandshake, title: 'Le suivi continue', text: 'L’école reçoit une trousse d’animation et la liste des ressources d’aide de sa région.' },
]

export default function Campaigns() {
  const [filter, setFilter] = useState<Filter>('all')
  const featured = CAMPAIGNS[0]
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

      {/* Bannière à la une */}
      <Link to={`/campagnes/${featured.id}`} className="group relative block overflow-hidden rounded-[28px] border border-white/[0.07] shadow-stage">
        <div className="relative flex min-h-[540px] flex-col justify-end lg:min-h-[420px] lg:justify-center">
          <img src={featured.photo} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-40 mix-blend-color" style={{ background: featured.accent }} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-ink/75 lg:to-transparent" />
          <div className="relative p-5 pt-48 lg:w-[62%] lg:p-10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-ink/50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-goldlight backdrop-blur">
                <Megaphone size={12} /> À la une
              </span>
              <CampaignStatusBadge status={featured.status} />
            </div>
            <div className="text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: featured.accent }}>
              {featured.topic}
            </div>
            <h2 className="font-display text-[44px] leading-[0.92] tracking-wide lg:text-[64px]">
              {featured.title}
              <span className="mt-0.5 block pt-[0.14em] text-[28px] leading-[0.95] text-gold-shine lg:text-[40px]">{featured.slogan}</span>
            </h2>
            <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-white/75">{featured.summary}</p>
            <span className="mt-5 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-gold-soft px-5 text-sm font-extrabold text-ink shadow-gold transition group-hover:brightness-110">
              Découvrir la campagne <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </Link>

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
