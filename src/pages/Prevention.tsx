import { useRef, useState, type ComponentType } from 'react'
import {
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  Mic2,
  PenLine,
  Play,
  Presentation,
  Quote,
  Route as RouteIcon,
  School,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  type LucideProps,
} from 'lucide-react'
import { CAPSULES, THEMES, type Capsule, type Theme, type ThemeId } from '../data'
import StageArt from '../components/art/StageArt'
import { Button, Chips, SectionHeader, cx } from '../components/ui'
import HoodedSilhouette from '../components/mission/HoodedSilhouette'
import CapsulePlayer, { poseForFormat } from '../components/mission/CapsulePlayer'

const ICONS: Record<Theme['icon'], ComponentType<LucideProps>> = {
  shield: ShieldCheck,
  cap: GraduationCap,
  heart: HeartHandshake,
  path: RouteIcon,
}

const PILLARS = [
  { icon: Mic2, title: 'La scène attire', text: 'Le chant, le slam et le rap conscience captent l’attention des jeunes là où un discours classique ne passe plus.' },
  { icon: Users, title: 'Les pairs portent le message', text: 'Ce sont des élèves qui écrivent et interprètent : le message circule d’égal à égal, sans leçon de morale.' },
  { icon: HeartHandshake, title: 'Les ressources suivent', text: 'Chaque spectacle s’accompagne d’un échange encadré et de pistes d’aide concrètes, avec le personnel de l’école.' },
]

const TESTIMONIALS = [
  {
    who: 'Samuel, 16 ans',
    theme: 'Décrochage scolaire',
    text: 'J’avais un pied dehors. Le projet de slam m’a donné un rendez-vous chaque mardi, puis une raison de finir l’année. Sur scène, pour la première fois, on m’écoutait jusqu’au bout.',
  },
  {
    who: 'Inès, 17 ans',
    theme: 'Prévention de la criminalité',
    text: 'Mon texte parle d’un ami qui a suivi la mauvaise gang. L’écrire m’a obligé à regarder les conséquences en face. Après le spectacle, des élèves sont venus me dire qu’ils se reconnaissaient.',
  },
  {
    who: 'Nadia, intervenante',
    theme: 'Estime de soi et persévérance',
    text: 'Ce qui change, ce n’est pas seulement la performance : c’est la façon dont l’élève se tient dans le corridor le lendemain. La confiance gagnée sur scène déborde dans la classe.',
  },
]

const SPEAKERS: { theme: string; format: string }[] = [
  { theme: 'Réinsertion et choix de vie', format: 'Conférence-témoignage' },
  { theme: 'Prévention de la criminalité', format: 'Atelier interactif' },
  { theme: 'Décrochage scolaire', format: 'Spectacle-conférence' },
  { theme: 'Estime de soi et persévérance', format: 'Classe de maître' },
]

const STEPS = [
  { icon: School, title: 'Rencontre avec l’école', text: 'La direction et l’équipe d’intervention choisissent les thèmes prioritaires et le calendrier.' },
  { icon: PenLine, title: 'Ateliers d’écriture et de scène', text: 'Des artistes-mentors accompagnent les élèves dans l’écriture de textes porteurs de sens.' },
  { icon: Presentation, title: 'Spectacle-conférence', text: 'Les élèves montent sur scène, suivis d’une capsule ou d’un témoignage et d’une discussion encadrée.' },
  { icon: HeartHandshake, title: 'Suivi et ressources', text: 'L’école reçoit une trousse pédagogique et les références d’aide adaptées à sa région.' },
]

export default function Prevention() {
  const [theme, setTheme] = useState<ThemeId | 'all'>('all')
  const [playing, setPlaying] = useState<Capsule | null>(null)
  const capsRef = useRef<HTMLElement>(null)

  const list = theme === 'all' ? CAPSULES : CAPSULES.filter((c) => c.theme === theme)
  const goCapsules = (t?: ThemeId) => {
    if (t) setTheme(t)
    capsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="space-y-14 lg:space-y-20">
      {/* ---------------- HERO */}
      <section className="relative -mx-4 overflow-hidden border-y border-white/[0.06] lg:mx-0 lg:rounded-[28px] lg:border">
        <StageArt seed="prevention-hero" palette="violet" pose="none" crowd animated className="absolute inset-0 h-full w-full opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
        <HoodedSilhouette className="pointer-events-none absolute bottom-0 right-[-18%] h-[78%] opacity-70 sm:right-0 lg:right-[1%] lg:h-[86%] lg:opacity-100 xl:right-[3%]" />
        <div className="relative px-5 pb-10 pt-14 lg:px-14 lg:pb-16 lg:pt-24">
          <div className="eyebrow animate-fadeUp">Volet prévention · MICRO D’OR</div>
          <h1 className="mt-4 max-w-[760px] animate-fadeUp font-display text-[44px] leading-[0.92] tracking-wide sm:text-[58px] lg:text-[84px]">
            <span className="block">LE TALENT ATTIRE L’ATTENTION.</span>
            <span className="block text-gold-metal">LE MESSAGE PEUT CHANGER UNE TRAJECTOIRE.</span>
          </h1>
          <p className="mt-5 max-w-xl animate-fadeUp text-[15px] leading-relaxed text-white/75 lg:text-[17px]">
            MICRO D’OR utilise la musique, le slam et la scène pour sensibiliser les jeunes aux conséquences de la criminalité et du décrochage scolaire — avec des mots qui leur ressemblent.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => goCapsules()} icon={<Play size={16} className="fill-ink" />}>
              Voir les capsules
            </Button>
            <Button size="lg" variant="outline" to="/partenaires">
              Soutenir le volet prévention
            </Button>
          </div>
        </div>
      </section>

      {/* ---------------- MISSION */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <div className="eyebrow mb-2">Notre mission</div>
          <h2 className="font-display text-[36px] leading-[0.95] tracking-wide lg:text-[52px]">
            Faire de la scène <span className="text-gold-metal">un levier de prévention</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Derrière chaque micro, il y a un jeune qui choisit ses mots. MICRO D’OR transforme cette prise de parole en outil de sensibilisation : les textes abordent la pression du groupe, la violence, l’abandon scolaire ou la difficulté de se relever — toujours sous l’angle des conséquences, de l’espoir et des ressources disponibles.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70">
            Le programme se déploie en partenariat avec les écoles, les centres de services scolaires et les organismes jeunesse, dans un cadre sécuritaire et respectueux des élèves mineurs.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {PILLARS.map((p, i) => (
            <div key={p.title} className="card flex gap-4 p-5 transition hover:border-gold/30">
              <span className="font-display text-[40px] leading-none text-gold/35">0{i + 1}</span>
              <div>
                <div className="flex items-center gap-2 text-[16px] font-extrabold">
                  <p.icon size={18} className="text-gold" /> {p.title}
                </div>
                <p className="mt-1 text-[13.5px] leading-relaxed text-white/60">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- THÈMES */}
      <section>
        <SectionHeader eyebrow="Quatre axes d’intervention" title="Les thèmes abordés" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-5">
          {THEMES.map((t) => {
            const Icon = ICONS[t.icon]
            const n = CAPSULES.filter((c) => c.theme === t.id).length
            return (
              <button
                key={t.id}
                onClick={() => goCapsules(t.id)}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-night2 to-ink p-5 text-left shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-gold/45 hover:shadow-gold lg:p-7"
              >
                <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-stage/25 blur-3xl transition group-hover:bg-stage/40" />
                <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-gold/60 bg-ink/50 shadow-[0_0_30px_-8px_rgba(214,172,85,.7)] lg:h-16 lg:w-16">
                  <Icon size={28} strokeWidth={1.5} className="text-goldlight" />
                </span>
                <h3 className="relative mt-4 font-display text-[28px] leading-none tracking-wide lg:text-[34px]">{t.title}</h3>
                <p className="relative mt-2 text-[13.5px] leading-relaxed text-white/65">{t.description}</p>
                <span className="relative mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-gold group-hover:text-goldlight">
                  {n} capsule{n > 1 ? 's' : ''} <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ---------------- CAPSULES */}
      <section ref={capsRef} className="scroll-mt-24">
        <SectionHeader eyebrow="Bibliothèque" title="Capsules et témoignages" />
        <p className="-mt-2 mb-4 max-w-2xl text-[13.5px] text-white/55">
          Capsules vidéo, ateliers et conférences conçus pour être présentés en classe.
        </p>
        <Chips
          className="mb-5"
          value={theme}
          onChange={setTheme}
          options={[{ value: 'all' as const, label: 'Tous les thèmes' }, ...THEMES.map((t) => ({ value: t.id, label: t.short }))]}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <CapsuleCard key={c.id} capsule={c} onPlay={() => setPlaying(c)} />
          ))}
          <div
            className={cx(
              'relative flex flex-col justify-center overflow-hidden rounded-2xl border border-dashed border-gold/35 bg-gradient-to-br from-gold/[0.07] via-transparent to-stage/10 p-6',
              list.length % 2 === 0 ? 'sm:col-span-2' : 'sm:col-span-1',
              ['lg:col-span-3', 'lg:col-span-2', 'lg:col-span-1'][list.length % 3],
            )}
          >
            <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-stage/30 blur-3xl" />
            <Sparkles size={22} className="relative text-gold" />
            <h3 className="relative mt-3 font-display text-[26px] leading-none tracking-wide">Une capsule à votre image</h3>
            <p className="relative mt-2 max-w-md text-[13px] leading-relaxed text-white/60">
              Organismes, fondations et entreprises peuvent soutenir la production d’une nouvelle capsule ou d’un atelier en classe.
            </p>
            <div className="relative mt-4">
              <Button size="sm" variant="outline" to="/partenaires" iconRight={<ArrowRight size={14} />}>
                Soutenir une capsule
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TÉMOIGNAGES */}
      <section>
        <SectionHeader eyebrow="Paroles de jeunes" title="Témoignages" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.who} className="card relative flex flex-col p-6">
              <Quote size={34} className="text-gold/50" />
              <span className="mt-3 text-[11px] font-bold uppercase tracking-wider text-stagelight">{t.theme}</span>
              <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-white/85">« {t.text} »</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-dashed border-white/25 bg-white/[0.04]">
                  <UserRound size={18} className="text-white/45" />
                </span>
                <div>
                  <div className="text-[13px] font-extrabold">{t.who}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ---------------- CONFÉRENCIERS */}
      <section>
        <SectionHeader eyebrow="Programmation à venir" title="Futurs conférenciers" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {SPEAKERS.map((s, i) => (
            <div key={i} className="relative flex flex-col items-center rounded-2xl border border-dashed border-gold/35 bg-gradient-to-b from-gold/[0.06] to-transparent px-4 py-6 text-center">
              <span className="relative grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-ink">
                <UserRound size={36} strokeWidth={1.2} className="text-gold/60" />
                <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-night2 text-[15px] font-bold text-goldlight ring-1 ring-gold/40">?</span>
              </span>
              <div className="mt-4 text-[13px] font-extrabold leading-snug text-white/90">Espace réservé — conférencier à confirmer</div>
              <div className="mt-2 text-[11.5px] text-white/50">{s.format}</div>
              <div className="mt-1 text-[11.5px] font-bold text-gold">{s.theme}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-white/45">
          Les parcours authentiques seront présentés uniquement avec le consentement libre et éclairé des personnes concernées.
        </p>
      </section>

      {/* ---------------- ÉTAPES */}
      <section>
        <SectionHeader eyebrow="Déploiement" title="Comment ça marche dans les écoles" />
        <ol className="relative grid grid-cols-1 gap-4 lg:grid-cols-4">
          <span className="pointer-events-none absolute left-0 right-0 top-[38px] hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent lg:block" />
          {STEPS.map((s, i) => (
            <li key={s.title} className="card relative p-5">
              <div className="flex items-center justify-between">
                <span className="relative grid h-11 w-11 place-items-center rounded-full bg-gold-soft font-display text-[24px] text-ink shadow-gold">{i + 1}</span>
                <s.icon size={22} className="text-gold/70" />
              </div>
              <h3 className="mt-4 text-[16px] font-extrabold">{s.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[12.5px] leading-relaxed text-white/60">
          <strong className="text-white/85">Besoin d’aide pour vrai ?</strong> Parle à un adulte de confiance ou au personnel d’intervention de ton école. En cas d’urgence, compose le 911.
        </div>
      </section>

      {/* ---------------- CTA */}
      <section className="relative overflow-hidden rounded-[28px] border border-gold/30">
        <StageArt seed="prev-cta" palette="gold" pose="trio" className="absolute inset-0 h-full w-full opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="relative flex flex-col gap-6 p-7 lg:flex-row lg:items-center lg:justify-between lg:p-12">
          <div className="max-w-xl">
            <div className="eyebrow mb-2 flex items-center gap-2">
              <Sparkles size={13} /> Partenaires
            </div>
            <h2 className="font-display text-[36px] leading-[0.95] tracking-wide lg:text-[50px]">
              Associez votre organisation <span className="text-gold-metal">à la prévention</span>
            </h2>
            <p className="mt-3 text-[14.5px] text-white/70">Financez une tournée d’ateliers, une capsule ou un spectacle-conférence dans une école de votre région.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" to="/partenaires" iconRight={<ArrowRight size={16} />}>
              Devenir partenaire
            </Button>
            <Button size="lg" variant="dark" to="/tournee">
              Voir la tournée
            </Button>
          </div>
        </div>
      </section>

      <CapsulePlayer capsule={playing} onClose={() => setPlaying(null)} />
    </div>
  )
}

function CapsuleCard({ capsule: c, onPlay }: { capsule: Capsule; onPlay: () => void }) {
  const theme = THEMES.find((t) => t.id === c.theme)!
  const Icon = ICONS[theme.icon]
  const testimony = c.format === 'Témoignage'
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-night shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-gold/40">
      <button onClick={onPlay} className="relative block aspect-video overflow-hidden text-left" aria-label={`Lire « ${c.title} »`}>
        <StageArt seed={`cap-${c.id}`} palette={c.palette} pose={poseForFormat(c)} crowd={!testimony} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
        {testimony && <HoodedSilhouette className="absolute bottom-0 left-1/2 h-[80%] -translate-x-1/2" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-md bg-ink/70 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-goldlight backdrop-blur">{c.format}</span>
        <span className="absolute right-3 top-3 rounded-md bg-ink/70 px-2 py-1 text-[11px] font-bold tabular-nums text-white/85 backdrop-blur">{c.duration}</span>
        <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-goldlight/60 bg-ink/50 shadow-gold backdrop-blur transition group-hover:scale-110 group-hover:bg-gold-soft">
          <Play size={22} className="ml-0.5 fill-goldlight text-goldlight transition group-hover:fill-ink group-hover:text-ink" />
        </span>
      </button>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-gold">
          <Icon size={13} /> {theme.short}
        </div>
        <h3 className="mt-1.5 font-display text-[24px] leading-none tracking-wide">{c.title}</h3>
        <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-white/60">{c.summary}</p>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
          <span className={cx('truncate text-[11.5px]', c.speaker.includes('confirmer') || c.speaker.includes('réservé') ? 'italic text-white/45' : 'text-white/65')}>{c.speaker}</span>
          <button onClick={onPlay} className="shrink-0 text-[12.5px] font-bold text-gold hover:text-goldlight">
            Lire →
          </button>
        </div>
      </div>
    </article>
  )
}
