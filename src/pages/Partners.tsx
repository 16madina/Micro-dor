import { useState, type ComponentType, type ReactNode } from 'react'
import {
  ArrowRight,
  Check,
  Crown,
  Handshake,
  Image as ImageIcon,
  MapPinned,
  Mic2,
  Minus,
  Plus,
  Radio,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Ticket,
  Users,
  Wrench,
  type LucideProps,
} from 'lucide-react'
import { PARTNERS, PHOTOS, SCHOOLS, type PartnerSlot } from '../data'
import StageArt from '../components/art/StageArt'
import { MicEmblem, Wordmark, useSvgId } from '../components/art/Logo'
import { PartnerLogo, PartnerMark } from '../components/art/PartnerLogo'
import { Button, DemoPill, cx } from '../components/ui'
import PartnerModal from '../components/mission/PartnerModal'

type Icon = ComponentType<LucideProps>

interface Tier {
  name: string
  key: string
  icon: Icon
  slots: number
  text: string
  perks: string[]
}

const TIERS: Tier[] = [
  {
    name: 'Partenaire principal',
    key: 'Partenaire principal',
    icon: Crown,
    slots: 1,
    text: 'Le visage de la saison : votre organisation présente la tournée MICRO D’OR dans toutes les écoles participantes.',
    perks: ['Appellation « présenté par » sur la saison', 'Logo sur toutes les affiches et pages d’événements', 'Prise de parole lors de la grande finale', 'Association au volet prévention'],
  },
  {
    name: 'Partenaires régionaux',
    key: 'Partenaire régional',
    icon: MapPinned,
    slots: 3,
    text: 'Ancrez votre marque dans votre région en soutenant les étapes locales de la tournée.',
    perks: ['Visibilité sur les étapes de votre région', 'Logo sur les affiches régionales', 'Billets d’invitation (démo)'],
  },
  {
    name: 'Partenaires jeunesse',
    key: 'Partenaire jeunesse',
    icon: Sprout,
    slots: 2,
    text: 'Organismes et coopératives qui accompagnent les jeunes avant, pendant et après la scène.',
    perks: ['Présence aux ateliers d’écriture', 'Association aux initiatives de prévention'],
  },
  {
    name: 'Partenaires médias',
    key: 'Partenaire média',
    icon: Radio,
    slots: 2,
    text: 'Radios, balados et médias numériques qui amplifient la voix de la relève.',
    perks: ['Diffusion de capsules et d’extraits', 'Couverture de la tournée'],
  },
  {
    name: 'Soutien matériel et technique',
    key: 'Soutien technique',
    icon: Wrench,
    slots: 3,
    text: 'Son, lumière, captation, transport : l’expertise qui rend chaque spectacle possible.',
    perks: ['Mention « équipement fourni par »', 'Visibilité sur scène'],
  },
]

const VISIBILITY: { icon: Icon; title: string; text: string }[] = [
  { icon: ImageIcon, title: 'Logo sur les pages d’événements', text: 'Votre logo accompagne chaque fiche de spectacle de l’application et du site.' },
  { icon: Ticket, title: 'Présence sur les affiches', text: 'Affiches imprimées et numériques des étapes de la tournée, dans les écoles et en ligne.' },
  { icon: Mic2, title: 'Visibilité pendant les spectacles', text: 'Mention de l’animateur, écrans de scène et bannières dans la salle.' },
  { icon: ShieldCheck, title: 'Association aux initiatives de prévention', text: 'Votre nom lié aux capsules et ateliers sur la criminalité et le décrochage.' },
  { icon: RouteIcon, title: 'Soutien à la tournée', text: 'Contribuez au transport, à l’hébergement et à l’équipement de la tournée provinciale.' },
]

type Cell = 'full' | 'partial' | null
// lignes = VISIBILITY, colonnes = TIERS
const MATRIX: Cell[][] = [
  ['full', 'full', 'full', 'full', 'partial'],
  ['full', 'partial', null, 'full', null],
  ['full', 'full', 'partial', null, 'full'],
  ['full', null, 'full', null, null],
  ['full', 'partial', null, 'full', 'full'],
]

const WHY: { icon: Icon; title: string; text: string }[] = [
  { icon: Target, title: 'Un impact concret', text: 'Soutenir des jeunes qui choisissent la scène, l’école et des projets positifs.' },
  { icon: Users, title: 'Familles et écoles', text: 'Rejoindre élèves, parents, personnel scolaire et communautés locales.' },
  { icon: MapPinned, title: 'Un ancrage régional', text: 'Des étapes dans plusieurs régions du Québec, du grand Montréal au Saguenay.' },
  { icon: Sparkles, title: 'Des contenus rassembleurs', text: 'Des spectacles, des capsules et des histoires qui valorisent la relève.' },
]

const PROJECTION = [
  { value: String(SCHOOLS.length), label: 'écoles dans la saison de démonstration' },
  { value: '≈ 40', label: 'spectacles par saison' },
  { value: '≈ 15 000', label: 'élèves sensibilisés' },
  { value: '17', label: 'régions visées à terme' },
]

export default function Partners() {
  const [modal, setModal] = useState<{ open: boolean; tier?: string }>({ open: false })
  const open = (tier?: string) => setModal({ open: true, tier })
  const principal = PARTNERS.find((p) => p.tier === 'Partenaire principal')

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* ---------------- COUVERTURE */}
      <section className="relative -mx-4 overflow-hidden border-y border-gold/20 lg:mx-0 lg:rounded-[28px] lg:border">
        <StageArt seed="partners-cover" photo={PHOTOS.crowd} palette="gold" pose="trio" crowd animated className="absolute inset-0 h-full w-full opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-ink/60" />
        <div className="relative flex flex-col items-center px-5 pb-12 pt-14 text-center lg:px-16 lg:pb-20 lg:pt-24">
          <MicEmblem className="h-24 w-16 animate-floaty lg:h-32 lg:w-20" large />
          <div className="eyebrow mt-4">Dossier partenaires · Saison 2026–2027</div>
          <h1 className="mt-3 max-w-4xl pt-2 font-display text-[46px] leading-[0.9] tracking-wide text-gold-metal sm:text-[64px] lg:text-[96px]" style={{ filter: 'drop-shadow(0 4px 30px rgba(214,172,85,.25))' }}>
            ENSEMBLE, DONNONS UNE SCÈNE À LA RELÈVE.
          </h1>
          <p className="mt-5 max-w-xl text-[16px] font-semibold leading-relaxed text-white/85 lg:text-[19px]">
            Devenez partenaire de MICRO D’OR et investissez dans la jeunesse du Québec.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => open()} icon={<Handshake size={18} />}>
              Devenir partenaire
            </Button>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('paliers')?.scrollIntoView({ behavior: 'smooth' })}>
              Voir les paliers
            </Button>
          </div>
          <DemoPill className="mt-6">Marques fictives — exemples de présentation</DemoPill>
        </div>
      </section>

      {/* ---------------- 01 MISSION */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <SlideHead n="01" label="La mission" />
          <h2 className="font-display text-[36px] leading-[0.95] tracking-wide lg:text-[52px]">
            Révéler les talents, <span className="text-gold-metal">porter des messages qui comptent</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            MICRO D’OR est une tournée de spectacles de talents dans les écoles secondaires du Québec : chant, danse, théâtre, slam et rap conscience. Les élèves écrivent, répètent et montent sur scène devant leur communauté.
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-white/70">
            Au-delà du concours, MICRO D’OR est un outil de prévention : la musique devient un moyen de parler de persévérance scolaire, de choix de vie et des conséquences de la criminalité.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="dark" to="/prevention" iconRight={<ArrowRight size={15} />}>
              Le volet prévention
            </Button>
            <Button variant="ghost" to="/tournee">
              La tournée
            </Button>
          </div>
        </div>
        <div>
          <SlideHead n="02" label="Pourquoi s’associer" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WHY.map((w) => (
              <div key={w.title} className="card p-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/50 bg-gold/10">
                  <w.icon size={20} className="text-goldlight" strokeWidth={1.6} />
                </span>
                <div className="mt-3 text-[15px] font-extrabold">{w.title}</div>
                <p className="mt-1 text-[13px] leading-relaxed text-white/60">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROJECTION */}
      <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-night2 via-night to-ink p-6 lg:p-10">
        <span className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-stage/30 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <SlideHead n="03" label="Portée envisagée" className="!mb-0" />
          <span className="rounded-full border border-gold/50 bg-gold/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-goldlight">Projection illustrative</span>
        </div>
        <div className="relative mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {PROJECTION.map((p) => (
            <div key={p.label} className="border-l border-gold/30 pl-4">
              <div className="font-display text-[44px] leading-none text-gold-metal lg:text-[60px]">{p.value}</div>
              <div className="mt-1.5 text-[12.5px] font-semibold leading-snug text-white/60">{p.label}</div>
            </div>
          ))}
        </div>
        <p className="relative mt-6 text-[11.5px] text-white/40">
          Projection illustrative : chiffres hypothétiques à des fins de présentation. Il ne s’agit d’aucune statistique d’audience réelle.
        </p>
      </section>

      {/* ---------------- PALIERS */}
      <section id="paliers" className="scroll-mt-24">
        <SlideHead n="04" label="Paliers de partenariat" />
        <h2 className="mb-6 font-display text-[36px] leading-[0.95] tracking-wide lg:text-[52px]">Une place pour chaque partenaire</h2>

        {/* Principal — mise en vedette */}
        <div className="gold-border relative overflow-hidden rounded-[24px] p-5 shadow-gold lg:p-8">
          <span className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <TierTitle tier={TIERS[0]} />
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">{TIERS[0].text}</p>
              <ul className="mt-4 space-y-2">
                {TIERS[0].perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[13.5px] text-white/80">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" /> {p}
                  </li>
                ))}
              </ul>
            </div>
            {principal && <LogoSlot partner={principal} large />}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {TIERS.slice(1).map((t, i) => {
            const brands = PARTNERS.filter((p) => p.tier === t.key)
            const empties = Math.max(0, t.slots - brands.length)
            const wide = i === 0 || i === 3
            return (
              <div key={t.key} className={cx('card flex flex-col p-5 lg:p-6', wide && 'lg:col-span-2')}>
                <TierTitle tier={t} />
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/60">{t.text}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {t.perks.map((p) => (
                    <span key={p} className="flex items-center gap-1.5 text-[12px] text-white/70">
                      <Check size={13} className="text-gold" /> {p}
                    </span>
                  ))}
                </div>
                <div className={cx('mt-4 grid flex-1 gap-3', wide ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2')}>
                  {brands.map((b) => (
                    <LogoSlot key={b.id} partner={b} />
                  ))}
                  {Array.from({ length: empties }).map((_, k) => (
                    <button
                      key={k}
                      onClick={() => open(t.name)}
                      className="group flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-4 text-center transition hover:border-gold/60 hover:bg-gold/[0.06]"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/50 transition group-hover:border-gold group-hover:text-goldlight">
                        <Plus size={18} />
                      </span>
                      <span className="text-[13px] font-bold text-white/70 group-hover:text-goldlight">Espace disponible</span>
                      <span className="text-[11px] text-white/40">Réserver cet emplacement (démo)</span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ---------------- VISIBILITÉ */}
      <section>
        <SlideHead n="05" label="Options de visibilité" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
          <div>
            <h2 className="mb-6 font-display text-[36px] leading-[0.95] tracking-wide lg:text-[52px]">
              Votre marque, <span className="text-gold-metal">sous les projecteurs</span>
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {VISIBILITY.map((v, i) => (
                <div key={v.title} className={cx('card group flex gap-4 p-5 transition hover:border-gold/35', i === VISIBILITY.length - 1 && 'sm:col-span-2')}>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-gold/50 bg-ink/60 shadow-[0_0_24px_-8px_rgba(214,172,85,.7)]">
                    <v.icon size={22} strokeWidth={1.5} className="text-goldlight" />
                  </span>
                  <div>
                    <div className="text-[15px] font-extrabold leading-snug">{v.title}</div>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/60">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <PosterPreview partner={principal} />
        </div>

        {/* Matrice paliers × visibilité */}
        <div className="card mt-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] px-5 py-4">
            <div className="text-[15px] font-extrabold">Visibilité par palier</div>
            <span className="text-[11px] text-white/45">Grille indicative — à adapter selon chaque entente</span>
          </div>
          <div className="no-scrollbar overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[13px]">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-white/50">
                  <th className="px-5 py-3 font-bold">Option</th>
                  {TIERS.map((t, i) => (
                    <th key={t.key} className={cx('px-3 py-3 text-center font-bold', i === 0 && 'text-goldlight')}>
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VISIBILITY.map((v, r) => (
                  <tr key={v.title} className="border-t border-white/[0.05]">
                    <td className="px-5 py-3 font-semibold text-white/85">{v.title}</td>
                    {MATRIX[r].map((c, k) => (
                      <td key={k} className={cx('px-3 py-3 text-center', k === 0 && 'bg-gold/[0.05]')}>
                        {c === 'full' ? (
                          <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-gold-soft text-ink" title="Inclus">
                            <Check size={14} strokeWidth={3} />
                          </span>
                        ) : c === 'partial' ? (
                          <span className="text-[11px] font-bold text-gold" title="Selon l’entente">
                            Selon l’entente
                          </span>
                        ) : (
                          <Minus size={14} className="inline text-white/20" aria-label="Non inclus" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------- CTA FINAL */}
      <section className="relative overflow-hidden rounded-[28px] border border-gold/40 bg-gradient-to-br from-[#1b1408] via-ink to-[#1a0f30] px-6 py-12 text-center lg:py-16">
        <span className="pointer-events-none absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <SlideHead n="06" label="Passons à l’action" className="justify-center" />
          <h2 className="mx-auto max-w-3xl font-display text-[40px] leading-[0.92] tracking-wide lg:text-[64px]">
            La relève est prête. <span className="text-gold-metal">Votre scène l’attend.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[14.5px] text-white/65">Discutons du palier qui correspond à votre organisation et à votre région.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => open()} icon={<Handshake size={18} />}>
              Devenir partenaire
            </Button>
            <Button size="lg" variant="dark" to="/reglement">
              Lire le règlement (démo)
            </Button>
          </div>
        </div>
      </section>

      <PartnerModal open={modal.open} initialTier={modal.tier} onClose={() => setModal({ open: false })} />
    </div>
  )
}

function SlideHead({ n, label, className }: { n: string; label: string; className?: string }) {
  return (
    <div className={cx('mb-3 flex items-center gap-3', className)}>
      <span className="font-display text-[20px] leading-none text-gold">{n}</span>
      <span className="h-px w-8 bg-gold/50" />
      <span className="eyebrow !text-white/60">{label}</span>
    </div>
  )
}

function TierTitle({ tier }: { tier: Tier }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-soft text-ink shadow-gold">
        <tier.icon size={20} strokeWidth={2} />
      </span>
      <h3 className="font-display text-[28px] leading-none tracking-wide lg:text-[32px]">{tier.name}</h3>
    </div>
  )
}

/** Emplacement de logo sur carte blanche — monogramme de marque fictive */
function LogoSlot({ partner: p, large }: { partner: PartnerSlot; large?: boolean }) {
  return (
    <div className={cx('relative flex flex-col items-center justify-center rounded-2xl bg-[#F7F3EA] text-center shadow-card ring-1 ring-black/5', large ? 'min-h-[220px] p-8' : 'min-h-[132px] p-4')}>
      <span className="absolute right-2.5 top-2.5 rounded-full bg-ink/[0.06] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-ink/50">Marque fictive — exemple</span>
      <div className="flex w-full flex-col items-center gap-2">
        <PartnerLogo id={p.id} brand={p.brand} className={cx('w-full', large ? 'h-24 max-w-[380px]' : 'h-14 max-w-[230px]')} />
        <div className={cx('font-semibold uppercase tracking-[0.18em] text-ink/45', large ? 'text-[11px]' : 'text-[9px]')}>{p.tier}</div>
      </div>
    </div>
  )
}

function Monogram({ text, color, size }: { text: string; color: string; size: number }) {
  const id = useSvgId('mg')
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".45" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".28" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="18" fill={color} />
      <rect x="2" y="2" width="60" height="60" rx="18" fill={`url(#${id})`} />
      <rect x="6.5" y="6.5" width="51" height="51" rx="14" fill="none" stroke="#08090E" strokeOpacity=".22" />
      <text x="32" y="43" textAnchor="middle" fontFamily='"Bebas Neue", Impact, sans-serif' fontSize="30" fill="#08090E" letterSpacing="1">
        {text}
      </text>
    </svg>
  )
}

function PosterPreview({ partner }: { partner?: PartnerSlot }): ReactNode {
  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-gold/40 shadow-[0_30px_80px_-20px_rgba(104,55,181,.6)]">
        <StageArt seed="poster-preview" photo={PHOTOS.poster} palette="violet" pose="singer" crowd ratio="tall" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink" />
        <div className="absolute inset-x-0 top-0 p-5 text-center">
          <Wordmark className="text-[40px] italic" />
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">Tournée des talents</div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="text-center font-display text-[26px] leading-none tracking-wide">Finale locale</div>
          <div className="mt-1 text-center text-[11px] text-white/60">Date fictive · École fictive</div>
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#F7F3EA] px-3 py-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-ink/50">Présenté par</span>
            {partner ? <PartnerLogo id={partner.id} brand={partner.brand} className="h-7 w-[110px]" /> : <span className="text-[12px] font-extrabold text-ink">Votre marque</span>}
          </div>
          <div className="mt-2 flex justify-center gap-1.5">
            {PARTNERS.filter((p) => p.tier !== 'Partenaire principal').map((p) => (
              <PartnerMark key={p.id} id={p.id} size={18} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 text-center text-[11.5px] text-white/50">Aperçu d’affiche — marques fictives</div>
    </div>
  )
}
