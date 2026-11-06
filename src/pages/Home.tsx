import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clapperboard, GraduationCap, HeartHandshake, MapPin, Megaphone, Play, Route, ShieldCheck, Sparkles } from 'lucide-react'
import { LIVE, PARTNERS, PHOTOS, REPLAYS, SCHOOLS, TALENTS, THEMES, UPCOMING, fmtDay, schoolById } from '../data'
import StageArt from '../components/art/StageArt'
import { PartnerLogo } from '../components/art/PartnerLogo'
import { ShowCard, TalentCard } from '../components/cards'
import { Button, HScroll, SectionHeader, cx } from '../components/ui'
import { FEATURED_CAMPAIGNS, type Campaign } from '../data/campaigns'
import { CampaignBanner, CampaignStatusBadge, CarouselArrows, CarouselDots, useCarousel } from '../components/campaigns'
import { useApp } from '../state/AppState'

const THEME_ICON = {
  shield: ShieldCheck,
  cap: GraduationCap,
  heart: HeartHandshake,
  path: Route,
}

function SlideText({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div
      className={cx(
        'absolute inset-x-0 bottom-0 p-5 pb-14 transition-opacity duration-500 lg:inset-y-0 lg:right-auto lg:flex lg:w-[78%] lg:flex-col lg:justify-center lg:p-10 lg:pb-14 xl:w-[60%] xl:p-14',
        active ? 'opacity-100 [&_.reveal]:animate-fadeUp' : 'pointer-events-none opacity-0',
      )}
    >
      {children}
    </div>
  )
}

interface TalentPoster {
  seed: string
  photo: string
  pose: 'singer' | 'rap' | 'trio'
  /** Cadrage de la photo (téléphone puis ordinateur) */
  frame: string
  badge: string
  lines: [string, string, string, string]
  text: string
}

const TALENT_POSTERS: TalentPoster[] = [
  {
    seed: 'hero',
    photo: PHOTOS.hero,
    pose: 'singer',
    frame: '[&_img]:object-[60%_42%] lg:[&_img]:object-[62%_30%]',
    badge: 'Saison 2026–2027',
    lines: ['Le Québec a', 'du talent.', 'MICRO D’OR lui', 'donne une scène.'],
    text: 'Chant, danse, théâtre, slam, rap conscience : découvre les talents des écoles secondaires du Québec.',
  },
  {
    seed: 'hero-danse',
    photo: PHOTOS.heroAlt,
    pose: 'trio',
    frame: '[&_img]:object-[50%_40%] lg:[&_img]:object-[55%_45%]',
    badge: 'Danse · Chant · Slam',
    lines: ['Ils montent', 'sur scène.', 'Viens les', 'applaudir.'],
    text: 'Des spectacles montés par les élèves, dans les écoles de partout au Québec, en salle ou en direct sur la plateforme.',
  },
  {
    seed: 'hero-public',
    photo: PHOTOS.show('s10'),
    pose: 'rap',
    frame: '[&_img]:object-[45%_50%] lg:[&_img]:object-[50%_50%]',
    badge: 'En direct et en rediffusion',
    lines: ['Le public,', 'c’est toi.', 'Soutiens', 'ta relève.'],
    text: 'Regarde les spectacles en direct, vote pour tes talents préférés et encourage les élèves de ton école.',
  },
]

function TalentSlide({ p, active }: { p: TalentPoster; active: boolean }) {
  return (
    <>
      <StageArt
        seed={p.seed}
        photo={p.photo}
        palette="violet"
        pose={p.pose}
        animated
        className={cx(
          'absolute left-0 right-0 top-0 h-[62%] lg:bottom-0 lg:left-[22%] lg:h-full lg:[mask-image:linear-gradient(90deg,transparent,#000_35%)]',
          p.frame,
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink from-40% via-ink/60 via-55% to-transparent to-75% lg:bg-gradient-to-r lg:from-0% lg:via-50% lg:to-100% lg:from-ink lg:via-ink/70 lg:to-transparent" />
      <SlideText active={active}>
        <div className="reveal mb-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-ink/50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-goldlight backdrop-blur">
            <Sparkles size={12} /> {p.badge}
          </span>
        </div>
        <h2 className="reveal font-display text-[54px] leading-[0.9] tracking-wide [animation-delay:.08s] lg:text-[64px] xl:text-[84px]">
          {p.lines[0]}
          <br />
          {p.lines[1]}
          <br />
          <span className="text-gold-shine">{p.lines[2]}</span>
          <br />
          <span className="text-gold-shine">{p.lines[3]}</span>
        </h2>
        <p className="reveal mt-4 max-w-md text-[15px] leading-relaxed text-white/75 [animation-delay:.16s] lg:text-[17px]">{p.text}</p>
        <div className="reveal mt-6 flex flex-col gap-3 [animation-delay:.24s] sm:flex-row">
          <Button to="/spectacles" size="lg" iconRight={<Play size={16} className="fill-ink" />}>
            Découvrir les spectacles
          </Button>
          <Button to="/campagnes" size="lg" variant="outline" className="bg-ink/40 backdrop-blur" icon={<Megaphone size={16} />}>
            Nos campagnes
          </Button>
        </div>
      </SlideText>
    </>
  )
}

/** Un talent, une campagne, un talent, une campagne… */
const HERO_SLIDES: ({ kind: 'talent'; p: TalentPoster } | { kind: 'campaign'; c: Campaign })[] = TALENT_POSTERS.flatMap((p, n) => [
  { kind: 'talent' as const, p },
  ...(FEATURED_CAMPAIGNS[n] ? [{ kind: 'campaign' as const, c: FEATURED_CAMPAIGNS[n] }] : []),
])

function CampaignSlide({ c, active }: { c: Campaign; active: boolean }) {
  return (
    <>
      {/* Fond : la photo de la bannière, agrandie (floutée sur ordinateur) */}
      <img
        src={c.banner}
        alt=""
        aria-hidden
        decoding="async"
        className={cx(
          'absolute inset-x-0 top-0 h-[60%] w-full object-cover object-right lg:inset-0 lg:h-full lg:scale-110 lg:object-center lg:blur-2xl lg:brightness-[.55]',
          active && 'max-lg:animate-kenburns',
        )}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink from-45% via-ink/70 via-60% to-transparent to-80% lg:bg-gradient-to-r lg:from-ink/85 lg:from-0% lg:via-ink/55 lg:via-60% lg:to-ink/35 lg:to-100%" />
      <div
        className={cx(
          'absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 pb-14 transition-opacity duration-500 lg:inset-y-0 lg:justify-center lg:gap-6 lg:px-10 lg:pb-14 lg:pt-8 xl:px-14',
          active ? 'opacity-100 [&_.reveal]:animate-fadeUp' : 'pointer-events-none opacity-0',
        )}
      >
        <Link
          to={`/campagnes/${c.id}`}
          className="reveal block overflow-hidden rounded-2xl shadow-card ring-1 ring-gold/35 transition hover:ring-gold/70 lg:max-w-[860px]"
        >
          <CampaignBanner c={c} eager />
        </Link>
        <div className="min-w-0 lg:flex lg:max-w-[860px] lg:items-end lg:justify-between lg:gap-8">
          <div className="min-w-0">
            <div className="reveal flex flex-wrap items-center gap-2 [animation-delay:.06s]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-ink/50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-goldlight backdrop-blur">
                <Megaphone size={12} /> Campagne
              </span>
              <CampaignStatusBadge status={c.status} />
            </div>
            <p className="reveal mt-3 pt-[0.12em] font-display text-[30px] leading-[0.95] tracking-wide text-gold-shine [animation-delay:.1s] lg:text-[34px] xl:text-[40px]">
              {c.slogan}
            </p>
            <p className="reveal mt-2 max-w-md text-[14.5px] leading-relaxed text-white/75 [animation-delay:.16s] lg:text-[15.5px]">{c.tagline}</p>
          </div>
          <div className="reveal mt-5 flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3 [animation-delay:.22s] lg:mt-0 lg:flex-col lg:items-end">
            <Button to="/campagnes" size="lg" iconRight={<ArrowRight size={16} />} className="max-sm:w-full">
              Découvrir les campagnes
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

function Hero() {
  const count = HERO_SLIDES.length
  const { i, go, paused, bind } = useCarousel(count)

  return (
    <section
      aria-roledescription="carrousel"
      aria-label="À la une"
      className="group/car relative -mx-4 -mt-4 overflow-hidden lg:mx-0 lg:mt-0 lg:rounded-[28px] lg:border lg:border-white/[0.07] lg:shadow-stage"
      {...bind}
    >
      <h1 className="sr-only">MICRO D’OR : le Québec a du talent, MICRO D’OR lui donne une scène</h1>
      <div className="relative h-[680px] lg:h-[560px]">
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(.65,0,.35,1)]"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, n) => (
            <div
              key={n}
              className="relative h-full w-full shrink-0 overflow-hidden"
              aria-hidden={n !== i}
              role="group"
              aria-roledescription="affiche"
              aria-label={`${n + 1} sur ${count}`}
            >
              {slide.kind === 'talent' ? <TalentSlide p={slide.p} active={i === n} /> : <CampaignSlide c={slide.c} active={i === n} />}
            </div>
          ))}
        </div>
        {/* lumière balayante */}
        <div
          className="pointer-events-none absolute -top-20 left-1/2 h-[140%] w-40 origin-top animate-sweep opacity-40 mix-blend-screen"
          style={{
            background: 'linear-gradient(180deg, rgba(244,215,140,.7), transparent 70%)',
            filter: 'blur(18px)',
          }}
        />
        <CarouselArrows i={i} go={go} />
        <CarouselDots count={count} i={i} go={go} paused={paused} className="absolute bottom-5 left-5 lg:left-10 xl:left-14" />
      </div>
    </section>
  )
}

function LiveStrip() {
  return (
    <Link
      to="/spectacles?f=live"
      className="group mt-5 flex items-center gap-3 overflow-hidden rounded-2xl border border-live/30 bg-gradient-to-r from-live/15 via-night to-night px-4 py-3 transition hover:border-live/60 lg:mt-6"
    >
      <span className="relative flex h-3 w-3 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-live" />
      </span>
      <span className="text-[13px] font-bold">{LIVE.length} spectacles en direct</span>
      <span className="hidden truncate text-[13px] text-white/55 sm:inline">· {LIVE.map((s) => schoolById(s.schoolId).city).join(' · ')}</span>
      <ArrowRight size={16} className="ml-auto shrink-0 text-gold transition group-hover:translate-x-1" />
    </Link>
  )
}

function Numbers() {
  const items = [
    { v: SCHOOLS.length, l: 'Écoles' },
    { v: TALENTS.length, l: 'Talents' },
    { v: 12, l: 'Spectacles' },
    { v: 17, l: 'Régions visées' },
  ]
  return (
    <section className="mt-10 grid grid-cols-4 gap-2 rounded-2xl border border-white/[0.06] bg-night/60 p-4 lg:p-6">
      {items.map((i) => (
        <div key={i.l} className="text-center">
          <div className="font-display text-[34px] leading-none text-gold-metal lg:text-[52px]">{i.v}</div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/45 lg:text-[11px]">{i.l}</div>
        </div>
      ))}
    </section>
  )
}

function OnStage() {
  const shows = [...LIVE, ...UPCOMING, ...REPLAYS]
  return (
    <section className="mt-12">
      <SectionHeader eyebrow="Cette saison" title="À l’affiche" action={{ label: 'Tous les spectacles', to: '/spectacles' }} />
      <HScroll>
        {shows.map((s) => (
          <ShowCard key={s.id} show={s} className="w-[300px] shrink-0 snap-start lg:w-[380px]" />
        ))}
      </HScroll>
    </section>
  )
}

function TalentsRow() {
  const top = [...TALENTS].sort((a, b) => b.supports - a.supports).slice(0, 12)
  return (
    <section className="mt-12">
      <SectionHeader eyebrow="La relève" title="Les talents à découvrir" action={{ label: 'Voir tout', to: '/talents' }} />
      <HScroll>
        {top.map((t) => (
          <TalentCard key={t.id} talent={t} className="w-[158px] shrink-0 snap-start lg:w-[210px]" />
        ))}
      </HScroll>
    </section>
  )
}

function TourPreview() {
  return (
    <section className="mt-12">
      <SectionHeader eyebrow="Sur la route" title="La tournée MICRO D’OR" action={{ label: 'Calendrier', to: '/tournee' }} />
      <div className="grid gap-3 lg:grid-cols-3">
        {UPCOMING.map((s, i) => {
          const school = schoolById(s.schoolId)
          const d = fmtDay(s.date)
          return (
            <Link
              key={s.id}
              to={`/spectacles/${s.id}`}
              className="group flex animate-fadeUp items-center gap-4 rounded-2xl border border-white/[0.07] bg-gradient-to-r from-night2 to-night p-3 transition hover:border-gold/40"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-gold/40 bg-gold/[0.07] text-center">
                <div>
                  <div className="font-display text-[28px] leading-none text-goldlight">{d.day}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gold">{d.month}</div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-[12px] font-bold" style={{ color: school.accent }}>
                  <MapPin size={12} /> {school.city}
                </div>
                <div className="truncate text-[14.5px] font-extrabold">{s.title}</div>
                <div className="truncate text-[12px] text-white/50">{school.name}</div>
              </div>
              <ArrowRight size={16} className="shrink-0 text-white/30 transition group-hover:translate-x-1 group-hover:text-gold" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function Mission() {
  return (
    <section className="relative mt-14 overflow-hidden rounded-[28px] border border-white/[0.07]">
      <StageArt seed="mission-home" palette="blue" pose="rap" crowd={false} className="absolute inset-0 h-full w-full opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
      <div className="relative grid gap-8 p-6 lg:grid-cols-[1.1fr_1fr] lg:p-12">
        <div>
          <div className="eyebrow mb-3">Plus qu’un spectacle</div>
          <h2 className="font-display text-[40px] leading-[0.95] tracking-wide lg:text-[56px]">
            Le talent attire l’attention.
            <br />
            <span className="text-gold-metal">Le message peut changer une trajectoire.</span>
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
            MICRO D’OR utilise la musique, le slam et la scène pour sensibiliser les jeunes aux conséquences de la criminalité et au décrochage
            scolaire. Chaque spectacle est aussi un moment de dialogue, de fierté et d’appartenance.
          </p>
          <Button to="/prevention" variant="outline" className="mt-6" iconRight={<ArrowRight size={16} />}>
            Découvrir notre mission
          </Button>
        </div>
        <div className="grid grid-cols-2 content-center gap-3">
          {THEMES.map((t) => {
            const Icon = THEME_ICON[t.icon]
            return (
              <Link
                key={t.id}
                to="/prevention"
                className="glass flex flex-col items-center gap-3 rounded-2xl border border-gold/25 p-4 text-center transition hover:border-gold/60"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/50 text-gold">
                  <Icon size={22} />
                </span>
                <span className="text-[13px] font-bold leading-tight">{t.short}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PartnersTeaser() {
  const { startTour } = useApp()
  return (
    <section className="mt-14">
      <SectionHeader
        eyebrow="Ils nous font confiance (exemples)"
        title="Nos partenaires"
        action={{ label: 'Devenir partenaire', to: '/partenaires' }}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.map((p) => (
          <Link
            key={p.id}
            to="/partenaires"
            className="group relative flex flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#F7F3EA] px-5 pb-4 pt-6 text-center shadow-card ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-gold"
          >
            <PartnerLogo id={p.id} brand={p.brand} className="h-16 w-full max-w-[250px]" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/45">{p.tier}</span>
          </Link>
        ))}
      </div>
      <div className="gold-border mt-6 flex flex-col items-start gap-4 rounded-3xl p-6 lg:flex-row lg:items-center lg:p-8">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold-soft text-ink shadow-gold">
          <Clapperboard size={26} />
        </span>
        <div className="flex-1">
          <div className="font-display text-[30px] leading-none tracking-wide">Visite guidée MICRO D’OR</div>
          <p className="mt-1.5 text-[14px] text-white/60">
            Découvrez la plateforme, ses fonctionnalités et son impact en 7 étapes (environ 3 minutes).
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={startTour} size="lg" iconRight={<Play size={15} className="fill-ink" />}>
            Lancer la visite guidée
          </Button>
          <Button to="/visite" size="lg" variant="ghost">
            Voir les étapes
          </Button>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div>
      <Hero />
      <LiveStrip />
      <OnStage />
      <TalentsRow />
      <Numbers />
      <TourPreview />
      <Mission />
      <PartnersTeaser />
    </div>
  )
}
