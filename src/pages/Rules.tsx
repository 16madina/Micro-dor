import { useState, type ComponentType, type ReactNode } from 'react'
import {
  BadgeCheck,
  Camera,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  FileText,
  Layers,
  ListChecks,
  ShieldCheck,
  TriangleAlert,
  Users,
  Vote,
  type LucideProps,
} from 'lucide-react'
import { Button, DemoPill, PageHero, cx } from '../components/ui'

interface Section {
  id: string
  title: string
  icon: ComponentType<LucideProps>
  body: ReactNode
}

const P = ({ children }: { children: ReactNode }) => <p className="text-[14px] leading-relaxed text-white/70">{children}</p>
const UL = ({ items }: { items: ReactNode[] }) => (
  <ul className="space-y-2">
    {items.map((it, i) => (
      <li key={i} className="flex gap-2.5 text-[14px] leading-relaxed text-white/70">
        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
        <span>{it}</span>
      </li>
    ))}
  </ul>
)
const Note = ({ children }: { children: ReactNode }) => (
  <div className="rounded-xl border border-stagelight/30 bg-stage/10 px-4 py-3 text-[12.5px] leading-relaxed text-[#d9c8ff]">{children}</div>
)

const SECTIONS: Section[] = [
  {
    id: 'admissibilite',
    title: 'Admissibilité',
    icon: BadgeCheck,
    body: (
      <>
        <P>Le concours MICRO D’OR s’adresse aux élèves inscrits dans une école secondaire participante au Québec.</P>
        <UL
          items={[
            'Être inscrit·e dans une école participante (1re à 5e secondaire) au moment des auditions.',
            'Avoir obtenu l’autorisation écrite d’un parent ou tuteur légal pour toute participation d’une personne mineure.',
            'Présenter une œuvre originale, ou une reprise dont l’utilisation est autorisée par l’école.',
            'Participer en solo, en duo ou en trio ; un même élève ne peut faire partie que d’un seul numéro par catégorie.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'categories',
    title: 'Catégories',
    icon: Layers,
    body: (
      <>
        <P>Cinq disciplines sont ouvertes. Chaque numéro dure au maximum 4 minutes.</P>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: 'Danse', d: 'Solo ou groupe : hip-hop, contemporain, street jazz, danses du monde.' },
            { t: 'Théâtre', d: 'Monologue, scène à deux, improvisation ou conte.' },
            { t: 'Chant', d: 'Interprétation vocale, a cappella ou accompagnée, tous styles.' },
            { t: 'Slam', d: 'Poésie orale, sans accompagnement musical ou avec ambiance légère.' },
            { t: 'Rap conscience', d: 'Textes engagés porteurs d’un message positif ou de prévention.' },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-gold/25 bg-gold/[0.05] p-4">
              <div className="font-display text-[22px] leading-none tracking-wide text-goldlight">{c.t}</div>
              <div className="mt-1.5 text-[12.5px] leading-relaxed text-white/65">{c.d}</div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'deroulement',
    title: 'Déroulement',
    icon: ListChecks,
    body: (
      <>
        <ol className="relative space-y-3 border-l border-gold/30 pl-5">
          {[
            ['Inscriptions', 'Auprès de l’école, avec le formulaire de consentement parental.'],
            ['Ateliers', 'Écriture, voix et présence scénique avec des artistes-mentors.'],
            ['Auditions locales', 'Devant un jury formé de membres du personnel et d’artistes invités.'],
            ['Finale locale', 'Spectacle public dans l’école, avec vote du public (simulé dans ce prototype).'],
            ['Grande finale', 'Les lauréats de chaque école se produisent lors d’une soirée provinciale.'],
          ].map(([t, d], i) => (
            <li key={t} className="relative">
              <span className="absolute -left-[29px] top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gold-soft text-[9px] font-extrabold text-ink">{i + 1}</span>
              <div className="text-[14px] font-extrabold text-white/90">{t}</div>
              <div className="text-[13px] text-white/60">{d}</div>
            </li>
          ))}
        </ol>
        <Note>Les dates de la tournée affichées dans l’application sont fictives.</Note>
      </>
    ),
  },
  {
    id: 'votes',
    title: 'Encouragements et votes du public',
    icon: Vote,
    body: (
      <>
        <P>Le public dispose de deux gestes distincts :</P>
        <UL
          items={[
            'Encourager : ouvert à tous, sans compte. Un encouragement par personne et par talent, que l’on peut retirer. Il n’a aucun effet sur le classement.',
            'Voter : réservé aux personnes ayant un compte. Les votes sont payants, par forfaits (1 vote 2 $, 5 votes 8 $, 10 votes 15 $), avec un plafond de 10 votes par personne et par discipline (chant, danse, théâtre, slam, rap conscience). Les votes achetés sont définitifs. Avant 14 ans, un parent ou tuteur doit approuver le compte. (Prototype : paiement simulé.)',
            'Le résultat final envisagé combine l’évaluation du jury (pondération envisagée : 60 %) et le vote du public (40 %).',
            'Aucun achat ni contrepartie financière ; des mécanismes de détection des votes automatisés ou abusifs sont prévus.',
          ]}
        />
        <Note>Version de démonstration : les chiffres de départ affichés sont fictifs ; les encouragements et votes réels s’y ajoutent.</Note>
      </>
    ),
  },
  {
    id: 'mineurs',
    title: 'Protection des mineurs et consentement parental',
    icon: ShieldCheck,
    body: (
      <>
        <P>La sécurité et la vie privée des élèves sont prioritaires.</P>
        <UL
          items={[
            'Consentement écrit d’un parent ou tuteur légal requis avant toute participation, captation ou diffusion.',
            'Affichage public limité au prénom et à l’initiale du nom ; aucune coordonnée personnelle n’est publiée.',
            'Aucune messagerie privée entre adultes et élèves dans l’application.',
            'Commentaires modérés et présence d’un adulte responsable lors de chaque activité.',
            'Droit de retrait : l’élève ou son parent peut demander le retrait de sa participation en tout temps.',
          ]}
        />
        <Note>Les modalités définitives devront être validées selon les lois applicables en matière de protection des renseignements personnels.</Note>
      </>
    ),
  },
  {
    id: 'conduite',
    title: 'Code de conduite',
    icon: Users,
    body: (
      <>
        <P>Chaque participant·e s’engage à faire de la scène un espace sécuritaire et respectueux.</P>
        <UL
          items={[
            'Respect des autres talents, du public, du jury et du personnel.',
            'Aucun propos haineux, discriminatoire, sexiste ou harcelant.',
            'Les textes abordant la violence ou la criminalité le font sous l’angle de la prévention, jamais de la glorification.',
            'Tout manquement peut mener à un avertissement, puis à une disqualification, après rencontre avec l’élève et sa famille.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'image',
    title: 'Droits d’image',
    icon: Camera,
    body: (
      <>
        <UL
          items={[
            'Les captations photo et vidéo exigent une autorisation distincte, signée par le parent ou tuteur.',
            'Les images servent uniquement à la promotion du programme MICRO D’OR et de ses initiatives de prévention.',
            'Aucune utilisation commerciale du visage ou de la voix d’un élève sans consentement explicite.',
            'Les contenus sont retirés sur demande et conservés pour une durée limitée.',
          ]}
        />
      </>
    ),
  },
]

export default function Rules() {
  const [open, setOpen] = useState<Set<string>>(() => new Set(['admissibilite']))
  const allOpen = open.size === SECTIONS.length

  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  const goTo = (id: string) => {
    setOpen((s) => new Set(s).add(id))
    requestAnimationFrame(() => document.getElementById(`reg-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <div>
      <PageHero
        eyebrow="Document de travail"
        title={
          <>
            Règlement du concours <span className="text-gold-metal">(démonstration)</span>
          </>
        }
        sub="Les grandes lignes envisagées pour encadrer le concours MICRO D’OR : admissibilité, catégories, votes, protection des mineurs et droits d’image."
      >
        <div className="mt-4 flex flex-wrap gap-2">
          <DemoPill>Version brouillon 0.3 — novembre 2026 (fictive)</DemoPill>
        </div>
      </PageHero>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/[0.12] to-transparent p-4 lg:p-5">
        <TriangleAlert size={20} className="mt-0.5 shrink-0 text-goldlight" />
        <div>
          <div className="text-[14px] font-extrabold text-goldlight">Brouillon à des fins de démonstration</div>
          <p className="mt-0.5 text-[13px] leading-relaxed text-white/70">
            Ce texte illustre le contenu d’un futur règlement. Il ne constitue pas un document juridique et n’engage aucune organisation. La version officielle devra être rédigée et validée par des professionnels.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
        {/* Sommaire */}
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-3">
            <div className="flex items-center gap-2 px-2 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-white/45">
              <FileText size={13} className="text-gold" /> Sommaire
            </div>
            <nav className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 lg:flex-col lg:gap-0.5">
              {SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(s.id)}
                  className={cx(
                    'flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[12.5px] font-semibold transition lg:shrink',
                    open.has(s.id) ? 'bg-gold/10 text-goldlight' : 'text-white/65 hover:bg-white/5 hover:text-white',
                  )}
                >
                  <span className="font-display text-[15px] text-gold/70">{String(i + 1).padStart(2, '0')}</span>
                  <span className="whitespace-nowrap lg:whitespace-normal">{s.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Accordéon */}
        <div>
          <div className="mb-3 flex justify-end">
            <button
              onClick={() => setOpen(allOpen ? new Set() : new Set(SECTIONS.map((s) => s.id)))}
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-[12px] font-bold text-white/70 transition hover:border-gold/40 hover:text-goldlight"
            >
              {allOpen ? <ChevronsDownUp size={14} /> : <ChevronsUpDown size={14} />}
              {allOpen ? 'Tout replier' : 'Tout déplier'}
            </button>
          </div>
          <div className="space-y-3">
            {SECTIONS.map((s, i) => {
              const isOpen = open.has(s.id)
              return (
                <section key={s.id} id={`reg-${s.id}`} className={cx('scroll-mt-24 overflow-hidden rounded-2xl border transition', isOpen ? 'border-gold/35 bg-gradient-to-b from-night2 to-night shadow-card' : 'border-white/[0.07] bg-night/60')}>
                  <h2>
                    <button
                      onClick={() => toggle(s.id)}
                      aria-expanded={isOpen}
                      aria-controls={`reg-body-${s.id}`}
                      className="flex w-full items-center gap-4 px-4 py-4 text-left lg:px-6 lg:py-5"
                    >
                      <span className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition', isOpen ? 'border-gold/60 bg-gold/15 text-goldlight' : 'border-white/10 text-white/55')}>
                        <s.icon size={20} strokeWidth={1.7} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-gold/80">Article {i + 1}</span>
                        <span className="block text-[15.5px] font-extrabold leading-snug lg:text-[17px]">{s.title}</span>
                      </span>
                      <ChevronDown size={20} className={cx('shrink-0 text-white/50 transition-transform duration-300', isOpen && 'rotate-180 text-goldlight')} />
                    </button>
                  </h2>
                  <div id={`reg-body-${s.id}`} className={cx('grid transition-[grid-template-rows] duration-300 ease-out', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                    <div className="overflow-hidden">
                      <div className="space-y-4 border-t border-white/[0.06] px-4 pb-5 pt-4 lg:px-6 lg:pl-[88px]">{s.body}</div>
                    </div>
                  </div>
                </section>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-[15px] font-extrabold">Des questions sur l’encadrement ?</div>
              <p className="text-[13px] text-white/60">Découvrez l’espace parents (démo) et les initiatives de prévention.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" to="/parent">
                Espace parents (démo)
              </Button>
              <Button size="sm" variant="outline" to="/prevention">
                Volet prévention
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
