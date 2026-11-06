import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Mic2,
  Pause,
  Play,
  Quote,
  School as SchoolIcon,
  Share2,
  ShieldCheck,
  Trophy,
  UserRoundX,
} from 'lucide-react'
import {
  CATEGORY_LABEL,
  PHOTOS,
  TALENTS,
  fmtDate,
  fmtNum,
  nextShowOfTalent,
  schoolById,
  showById,
  showsOfTalent,
  talentsOfSchool,
  type Talent,
} from '../data'
import { useApp } from '../state/AppState'
import Portrait from '../components/art/Portrait'
import StageArt from '../components/art/StageArt'
import { MicEmblem } from '../components/art/Logo'
import { ShowCard, TalentCard, poseFor } from '../components/cards'
import { Button, CategoryTag, HScroll, SectionHeader, Tabs, cx } from '../components/ui'
import { EqBars, SupportButton, VoteButton } from '../components/talents/shared'

type Tab = 'performances' | 'prochain' | 'apropos'
const EXCERPT = 30 // secondes d’extrait simulé

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

function NotFound() {
  return (
    <div className="card mx-auto mt-6 flex max-w-xl flex-col items-center px-6 py-14 text-center animate-fadeUp">
      <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/30 bg-gold/10">
        <UserRoundX size={28} className="text-gold" />
      </span>
      <h1 className="mt-4 font-display text-[40px] leading-none tracking-wide">Talent introuvable</h1>
      <p className="mt-2 max-w-sm text-[14px] text-white/60">
        Ce profil n’existe pas ou n’est plus présenté. Découvre les autres voix de la saison.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <Button to="/talents">Voir tous les talents</Button>
        <Button to="/votes" variant="outline">
          Classement
        </Button>
      </div>
    </div>
  )
}

/** Lecteur d’extrait simulé : aucune vraie vidéo, uniquement une animation */
function Performances({ talent }: { talent: Talent }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(0)
  const perf = talent.performances[index]
  const show = perf ? showById(perf.showId) : undefined

  useEffect(() => {
    if (!playing) return
    const iv = setInterval(() => {
      setT((x) => {
        if (x + 0.25 >= EXCERPT) {
          setPlaying(false)
          return 0
        }
        return x + 0.25
      })
    }, 250)
    return () => clearInterval(iv)
  }, [playing])

  const select = (i: number) => {
    if (i === index) {
      setPlaying((p) => !p)
      return
    }
    setIndex(i)
    setT(0)
    setPlaying(true)
  }

  if (!perf)
    return (
      <div className="card p-6 text-center text-[14px] text-white/60">
        Aucune performance publiée pour l’instant.
        <div className="mt-4">
          <Button to="/spectacles" variant="outline" size="sm">
            Voir les spectacles
          </Button>
        </div>
      </div>
    )

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-6">
      {/* lecteur */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-night shadow-card">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Mettre en pause l’extrait' : 'Lire l’extrait'}
          className="group relative block aspect-video w-full overflow-hidden text-left"
        >
          <StageArt
            seed={talent.id + perf.title}
            photo={PHOTOS.talent(talent.id)}
            palette={talent.look.palette}
            pose={poseFor(talent.category)}
            animated={playing}
            className={cx('absolute inset-0 h-full w-full transition duration-700', playing ? 'scale-105' : 'group-hover:scale-[1.03]')}
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          <span className="absolute left-3 top-3 rounded-md bg-ink/60 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-goldlight backdrop-blur">
            Extrait
          </span>
          <span className="absolute right-3 top-3 rounded-md bg-ink/60 px-2 py-1 text-[11px] font-bold text-white/80 backdrop-blur">{perf.duration}</span>
          <span
            className={cx(
              'absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold-soft text-ink shadow-gold transition duration-300 lg:h-20 lg:w-20',
              playing ? 'scale-75 opacity-0 group-hover:scale-90 group-hover:opacity-100' : 'group-hover:scale-110',
            )}
          >
            {playing ? <Pause size={28} className="fill-ink" /> : <Play size={28} className="ml-1 fill-ink" />}
          </span>
          <span className="absolute inset-x-0 bottom-0 p-4">
            <span className="flex items-end justify-between gap-3">
              <span>
                <span className="block font-display text-[26px] leading-none tracking-wide lg:text-[32px]">{perf.title}</span>
                <span className="mt-1 block text-[12px] text-white/65">{show ? show.title : 'Performance'} · interprétation originale</span>
              </span>
              <EqBars active={playing} bars={6} className="h-6" />
            </span>
          </span>
        </button>
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause' : 'Lecture'}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/50 text-goldlight transition hover:bg-gold/10"
          >
            {playing ? <Pause size={15} className="fill-goldlight" /> : <Play size={15} className="ml-0.5 fill-goldlight" />}
          </button>
          <span className="w-9 text-right text-[11.5px] font-semibold tabular-nums text-white/60">{mmss(t)}</span>
          <span
            className="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/10"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setT(Math.max(0, Math.min(EXCERPT - 1, ((e.clientX - r.left) / r.width) * EXCERPT)))
            }}
          >
            <span className="absolute inset-y-0 left-0 rounded-full bg-gold-soft shadow-[0_0_10px_#F4D78C] transition-[width] duration-200 ease-linear" style={{ width: `${(t / EXCERPT) * 100}%` }} />
          </span>
          <span className="w-9 text-[11.5px] font-semibold tabular-nums text-white/40">{mmss(EXCERPT)}</span>
        </div>
      </div>

      {/* liste */}
      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
          {talent.performances.length} performance{talent.performances.length > 1 ? 's' : ''}
        </div>
        <ul className="space-y-2">
          {talent.performances.map((p, i) => {
            const s = showById(p.showId)
            const active = i === index
            return (
              <li key={p.title}>
                <div
                  className={cx(
                    'flex items-center gap-3 rounded-xl border p-2.5 transition',
                    active ? 'border-gold/40 bg-gold/[0.07]' : 'border-white/[0.07] bg-white/[0.03] hover:border-white/15',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-label={active && playing ? `Pause : ${p.title}` : `Lire l’extrait : ${p.title}`}
                    className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg"
                  >
                    <StageArt seed={talent.id + p.title} photo={PHOTOS.show(p.showId)} palette={talent.look.palette} pose={poseFor(talent.category)} crowd={false} className="absolute inset-0 h-full w-full" />
                    <span className="absolute inset-0 grid place-items-center bg-ink/35">
                      {active && playing ? <EqBars active className="h-4" bars={4} /> : <Play size={16} className="ml-0.5 fill-goldlight text-goldlight" />}
                    </span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <button type="button" onClick={() => select(i)} className={cx('block truncate text-left text-[14px] font-extrabold', active && 'text-goldlight')}>
                      {p.title}
                    </button>
                    {s ? (
                      <Link to={`/spectacles/${s.id}`} className="mt-0.5 block truncate text-[12px] text-white/55 hover:text-gold">
                        {s.title} · {fmtDate(s.date)}
                      </Link>
                    ) : (
                      <span className="mt-0.5 block text-[12px] text-white/45">Performance</span>
                    )}
                  </div>
                  <span className="shrink-0 text-[12px] font-semibold tabular-nums text-white/50">{p.duration}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

function NextShow({ talent }: { talent: Talent }) {
  const next = nextShowOfTalent(talent.id)
  const all = showsOfTalent(talent.id).filter((s) => s.id !== next?.id)
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      {next ? (
        <ShowCard show={next} size="lg" />
      ) : (
        <div className="card flex flex-col items-center justify-center p-8 text-center">
          <CalendarDays size={28} className="text-gold" />
          <p className="mt-3 text-[14px] text-white/65">Aucun spectacle à venir annoncé pour {talent.name}.</p>
          <Button to="/spectacles" variant="outline" size="sm" className="mt-4">
            Voir la programmation
          </Button>
        </div>
      )}
      <div>
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">Autres apparitions</div>
        {all.length ? (
          <ul className="space-y-2">
            {all.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/spectacles/${s.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 transition hover:border-gold/40"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-bold">{s.title}</span>
                    <span className="text-[12px] text-white/50">
                      {fmtDate(s.date)} · {s.status === 'replay' ? 'Rediffusion' : s.status === 'live' ? 'En direct' : 'À venir'}
                    </span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-gold" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-white/50">Pas d’autre apparition pour le moment.</p>
        )}
        <Button to="/spectacles" variant="ghost" size="sm" className="mt-3 px-0 text-gold hover:bg-transparent hover:text-goldlight" iconRight={<ChevronRight size={15} />}>
          Toute la programmation
        </Button>
      </div>
    </div>
  )
}

function About({ talent }: { talent: Talent }) {
  const { supportCount, voteCount } = useApp()
  const school = schoolById(talent.schoolId)
  const facts = [
    { k: 'Discipline', v: CATEGORY_LABEL[talent.category] },
    { k: 'École', v: school.name, to: `/ecoles/${school.id}` },
    { k: 'Ville', v: school.city },
    { k: 'Performances', v: String(talent.performances.length) },
    { k: 'Encouragements', v: fmtNum(supportCount(talent.id)) },
    { k: 'Votes', v: fmtNum(voteCount(talent.id)) },
  ]
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="card p-5">
        <h3 className="font-display text-[24px] tracking-wide">Parcours</h3>
        <p className="mt-2 text-[14.5px] leading-relaxed text-white/75">{talent.bio}</p>
        <dl className="mt-4 divide-y divide-white/[0.06]">
          {facts.map((f) => (
            <div key={f.k} className="flex items-center justify-between gap-4 py-2.5 text-[13.5px]">
              <dt className="text-white/50">{f.k}</dt>
              <dd className="text-right font-bold">
                {f.to ? (
                  <Link to={f.to} className="text-goldlight hover:underline">
                    {f.v}
                  </Link>
                ) : (
                  f.v
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="space-y-4">
        <div className="card p-5">
          <h3 className="font-display text-[24px] tracking-wide">Influences</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {talent.influences.map((i) => (
              <span key={i} className="rounded-full border border-gold/30 bg-gold/[0.08] px-3 py-1 text-[12.5px] font-semibold text-goldlight">
                {i}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-stage/30 bg-stage/10 p-5">
          <div className="flex items-center gap-2 text-[13px] font-extrabold text-[#c9b6ff]">
            <ShieldCheck size={16} />
            Participation encadrée
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-white/65">
            Les participants sont accompagnés par leur école et participent avec l’autorisation de leurs parents.
          </p>
          <Link to="/reglement" className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold text-gold hover:text-goldlight">
            Lire le règlement <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function TalentDetail() {
  const { id } = useParams()
  const talent = TALENTS.find((t) => t.id === id)
  const { supportCount, hasSupported, voteCount, myVotesFor, toast } = useApp()
  const [tab, setTab] = useState<Tab>('performances')

  if (!talent) return <NotFound />

  const school = schoolById(talent.schoolId)
  const others = talentsOfSchool(talent.schoolId).filter((t) => t.id !== talent.id)
  const count = supportCount(talent.id)
  const votes = voteCount(talent.id)
  const myVotes = myVotesFor(talent.id)
  const isMyVote = myVotes > 0

  const share = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      toast('Lien du profil copié', 'info')
    } catch {
      toast('Lien prêt à être copié', 'info')
    }
  }

  return (
    <div>
      <Link to="/talents" className="mb-4 hidden items-center gap-1 text-[13px] font-semibold text-white/55 transition hover:text-goldlight lg:inline-flex">
        <ChevronLeft size={16} /> Tous les talents
      </Link>

      {/* HERO */}
      <section className="relative grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-12">
        <div className="pointer-events-none absolute -left-20 -top-10 h-[420px] w-[420px] rounded-full bg-stage/30 blur-[100px]" />

        {/* portrait */}
        <div className="relative mx-auto w-full max-w-[460px] animate-fadeUp lg:max-w-none">
          <div className="gold-border relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-stage">
            <Portrait look={talent.look} category={talent.category} seed={talent.id} className="absolute inset-0 h-full w-full" />
            <span className="pointer-events-none absolute -top-8 left-1/3 h-[130%] w-20 origin-top animate-sweep bg-gradient-to-b from-goldlight/20 to-transparent blur-xl" />
            <span className="absolute left-4 top-4">
              <CategoryTag category={talent.category} className="bg-ink/60 backdrop-blur" />
            </span>
            <MicEmblem className="absolute bottom-3 right-3 h-14 w-10 opacity-90" glow={false} />
          </div>
        </div>

        {/* infos */}
        <div className="relative min-w-0 animate-fadeUp [animation-delay:120ms]">
          <div className="eyebrow mb-2 flex items-center gap-2">
            <Mic2 size={13} />
            Talent MICRO D’OR · Saison 2026
          </div>
          <h1 className="text-gold-metal font-display break-words text-[72px] leading-[0.85] tracking-wide sm:text-[92px] lg:text-[clamp(68px,7vw,120px)]">{talent.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13.5px]">
            <span className="font-extrabold text-gold">{CATEGORY_LABEL[talent.category]}</span>
            <Link to={`/ecoles/${school.id}`} className="flex items-center gap-1.5 font-semibold text-white/85 underline-offset-4 hover:text-goldlight hover:underline">
              <SchoolIcon size={14} className="text-gold" />
              {school.name}
            </Link>
            <span className="flex items-center gap-1 text-white/55">
              <MapPin size={13} />
              {school.city}
            </span>
          </div>

          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75">{talent.bio}</p>

          {/* encouragements et votes */}
          <div className="glass mt-6 rounded-2xl border border-white/10 p-4">
            <div className="grid grid-cols-2 divide-x divide-white/10">
              <div className="pr-4">
                <div className="flex items-baseline gap-2">
                  <span key={count} className="animate-fadeIn font-display text-[40px] leading-none text-goldlight">
                    {fmtNum(count)}
                  </span>
                  <Heart size={17} className={cx('text-gold', hasSupported(talent.id) && 'fill-gold')} />
                </div>
                <div className="text-[12px] font-semibold text-white/50">encouragements</div>
              </div>
              <div className="pl-4">
                <div className="flex items-baseline gap-2">
                  <span key={votes} className="animate-fadeIn font-display text-[40px] leading-none text-[#d9c6ff]">
                    {fmtNum(votes)}
                  </span>
                  <Trophy size={17} className={cx('text-stagelight', isMyVote && 'fill-stagelight/40')} />
                </div>
                <div className="text-[12px] font-semibold text-white/50">votes · {CATEGORY_LABEL[talent.category]}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <SupportButton talentId={talent.id} size="md" className="flex-1" />
              <VoteButton talentId={talent.id} size="md" className="flex-1" />
              <button
                type="button"
                onClick={share}
                aria-label="Partager le profil"
                title="Partager le profil"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/80 transition hover:border-gold/40 hover:text-goldlight"
              >
                <Share2 size={18} />
              </button>
            </div>
            <p className="mt-2.5 text-[11.5px] leading-snug text-white/45">
              Encourager est gratuit et ne change pas le classement. Voter est payant (dès 2 $){isMyVote ? ` : tu as donné ${myVotes} vote${myVotes > 1 ? 's' : ''} à ${talent.name}.` : '.'}
            </p>
          </div>

          {/* citation */}
          <figure className="relative mt-6 pl-10">
            <Quote size={30} className="absolute left-0 top-0 fill-gold/20 text-gold" />
            <blockquote className="font-display text-[26px] leading-[1.05] tracking-wide text-white/95 lg:text-[32px]">« {talent.quote} »</blockquote>
            <figcaption className="mt-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-gold/80">— {talent.name}</figcaption>
          </figure>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {talent.influences.map((i) => (
              <span key={i} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[12px] font-semibold text-white/75">
                {i}
              </span>
            ))}
            <Link to="/votes" className="ml-auto hidden items-center gap-1.5 text-[12.5px] font-bold text-gold hover:text-goldlight sm:inline-flex">
              <Trophy size={14} /> Voir le classement
            </Link>
          </div>
        </div>
      </section>

      {/* ONGLETS */}
      <section className="mt-10">
        <Tabs
          tabs={[
            { value: 'performances', label: 'Performances' },
            { value: 'prochain', label: 'Prochain spectacle' },
            { value: 'apropos', label: 'À propos' },
          ]}
          value={tab}
          onChange={setTab}
          className="mb-5"
        />
        <div key={tab + talent.id} className="animate-fadeIn">
          {tab === 'performances' && <Performances talent={talent} />}
          {tab === 'prochain' && <NextShow talent={talent} />}
          {tab === 'apropos' && <About talent={talent} />}
        </div>
      </section>

      {/* AUTRES TALENTS */}
      {others.length > 0 && (
        <section className="mt-12">
          <SectionHeader eyebrow={school.shortName} title="Autres talents de l’école" action={{ label: 'L’école', to: `/ecoles/${school.id}` }} />
          <HScroll>
            {others.map((t) => (
              <TalentCard key={t.id} talent={t} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23%]" />
            ))}
            <Link
              to={`/talents?ecole=${school.id}`}
              className="flex w-[46%] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/30 bg-gold/[0.04] p-4 text-center transition hover:border-gold/60 sm:w-[31%] lg:w-[23%]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-soft text-ink shadow-gold">
                <ChevronRight size={22} />
              </span>
              <span className="text-[13px] font-bold text-goldlight">Toute la galerie {school.shortName}</span>
            </Link>
          </HScroll>
        </section>
      )}
    </div>
  )
}
