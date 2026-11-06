import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight, Headphones, Heart, ScrollText, Sparkles, Trophy } from 'lucide-react'
import { CATEGORY_LABEL, TALENTS, fmtNum, schoolById, type Category, type Talent } from '../data'
import { useApp } from '../state/AppState'
import Portrait from '../components/art/Portrait'
import { Button, CategoryTag, Chips, DemoPill, Stat, cx } from '../components/ui'
import { CAT_OPTIONS, EngagementCounts, PortraitThumb, RankBadge, SupportButton, TrophyArt, VoteButton, useFlip, type CatFilter } from '../components/talents/shared'

const byName = [...TALENTS].sort((a, b) => a.name.localeCompare(b.name, 'fr-CA'))

const CATS: Category[] = ['chant', 'danse', 'theatre', 'slam', 'rap']

function Hero() {
  const { voteCount, supportCount, myVote, user } = useApp()
  const totalVotes = TALENTS.reduce((s, t) => s + voteCount(t.id), 0)
  const mine = CATS.filter((c) => myVote(c)).length
  const fav = [...TALENTS].sort((a, b) => supportCount(b.id) - supportCount(a.id))[0]
  return (
    <section className="gold-border relative mb-6 overflow-hidden rounded-3xl p-5 shadow-stage animate-fadeUp sm:p-7 lg:mb-8 lg:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_85%_20%,rgba(104,55,181,.5),transparent_65%),radial-gradient(40%_60%_at_10%_110%,rgba(214,172,85,.16),transparent_70%)]" />
      <div className="pointer-events-none absolute -top-10 right-[18%] h-[140%] w-24 origin-top animate-sweep bg-gradient-to-b from-goldlight/25 to-transparent blur-xl" />

      <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="eyebrow flex items-center gap-2">
                <Sparkles size={13} /> Vote du public
              </div>
              {user ? (
                <DemoPill>Tes votes : {mine} / 5 disciplines</DemoPill>
              ) : (
                <Link to="/connexion?suite=/votes" className="inline-flex items-center gap-1.5 rounded-full border border-stagelight/50 bg-stage/15 px-2.5 py-1 text-[11px] font-bold text-[#d9c6ff]">
                  <Trophy size={12} /> Connecte-toi pour voter
                </Link>
              )}
            </div>
            <TrophyArt className="-mr-2 -mt-3 h-28 w-28 shrink-0 animate-floaty lg:hidden" />
          </div>
          <h1 className="mt-4 font-display text-[50px] leading-[0.9] tracking-wide sm:text-[68px] lg:text-[88px]">
            TON <span className="text-gold-metal">SOUTIEN</span> PEUT FAIRE <span className="text-gold-shine">BRILLER</span> UN TALENT.
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-white/65">
            <b className="text-goldlight">Encourage</b> autant de talents que tu veux : ça leur fait chaud au cœur, sans changer le classement.{' '}
            <b className="text-[#d9c6ff]">Vote</b> pour ton talent préféré dans chaque discipline : une seule voix par compte, et c’est elle qui compte.
          </p>
          <div className="mt-6 grid max-w-md grid-cols-3 gap-2 rounded-2xl border border-white/[0.08] bg-ink/40 px-2 py-4 backdrop-blur">
            <Stat value={fmtNum(totalVotes)} label="Votes" />
            <Stat value={TALENTS.length} label="Talents" />
            <Stat value={`${mine}/5`} label="Tes votes" />
          </div>
        </div>
        <TrophyArt className="hidden h-auto w-full animate-floaty drop-shadow-[0_20px_40px_rgba(214,172,85,.25)] lg:block" />
      </div>
      {/* Coup de cœur du public : le talent le plus encouragé (hors classement) */}
      <Link
        to={`/talents/${fav.id}`}
        className="relative mt-5 flex items-center gap-3 rounded-2xl border border-gold/30 bg-ink/50 p-3 backdrop-blur transition hover:border-gold/60 lg:max-w-md"
      >
        <PortraitThumb talent={fav} className="h-12 w-12 ring-2 ring-gold" />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-gold">
            <Heart size={11} className="fill-gold" /> Coup de cœur du public
          </span>
          <span className="block truncate font-display text-[22px] leading-none tracking-wide">{fav.name}</span>
          <span className="text-[11.5px] text-white/50">{fmtNum(supportCount(fav.id))} encouragements · hors classement</span>
        </span>
        <ChevronRight size={16} className="text-white/30" />
      </Link>
    </section>
  )
}

function Leaderboard({ cat }: { cat: CatFilter }) {
  const { voteCount, myVote } = useApp()
  const [expanded, setExpanded] = useState(false)
  const ranked = TALENTS.filter((t) => cat === 'tous' || t.category === cat)
    .map((t) => ({ t, c: voteCount(t.id) }))
    .sort((a, b) => b.c - a.c || a.t.name.localeCompare(b.t.name))
    .slice(0, 10)
  const register = useFlip(ranked.map((r) => r.t.id))

  return (
    <div className="card">
      <div className="relative rounded-t-2xl border-b border-white/[0.06] bg-gradient-to-br from-gold/[0.12] via-transparent to-stage/20 px-4 pb-3.5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="eyebrow mb-1">Top 10 · {cat === 'tous' ? 'Toutes disciplines' : CATEGORY_LABEL[cat]}</div>
            <h2 className="font-display text-[28px] leading-none tracking-wide">Classement des votes</h2>
          </div>
          <Trophy size={26} className="shrink-0 text-gold" />
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-white/45">
          <span className="h-1.5 w-1.5 animate-pulseLive rounded-full bg-live" />
          Mise à jour en direct · seuls les votes comptent
        </div>
      </div>

      <ol className="relative space-y-1 p-2">
        {ranked.map(({ t, c }, i) => {
          const rank = i + 1
          const school = schoolById(t.schoolId)
          return (
            <li
              key={t.id}
              ref={register(t.id)}
              className={cx(
                'relative items-center gap-2.5 rounded-xl px-2 py-2 sm:gap-3 lg:py-1.5',
                i >= 5 && !expanded ? 'hidden lg:flex' : 'flex',
                rank === 1 && 'bg-gradient-to-r from-gold/[0.16] to-transparent',
                rank === 2 && 'bg-gradient-to-r from-white/[0.07] to-transparent',
                rank === 3 && 'bg-gradient-to-r from-[#c47a3f]/[0.12] to-transparent',
              )}
            >
              <RankBadge rank={rank} />
              <Link to={`/talents/${t.id}`} className="group flex min-w-0 flex-1 items-center gap-2.5">
                <PortraitThumb
                  talent={t}
                  className={cx('h-11 w-11 lg:h-10 lg:w-10', rank === 1 ? 'ring-2 ring-gold' : rank <= 3 ? 'ring-1 ring-white/30' : '')}
                />
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-extrabold group-hover:text-goldlight">{t.name}</span>
                  <span className="flex items-center gap-1 truncate text-[11.5px] text-white/50">
                    <Trophy size={11} className={cx('shrink-0 text-stagelight', myVote(t.category) === t.id && 'fill-stagelight/40')} />
                    <span key={c} className="animate-fadeIn font-bold tabular-nums text-[#d9c6ff]">
                      {fmtNum(c)} votes
                    </span>
                    <span className="truncate">· {school.shortName}</span>
                  </span>
                </span>
              </Link>
              <VoteButton talentId={t.id} size="xs" className="shrink-0" />
            </li>
          )
        })}
      </ol>

      {ranked.length > 5 && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex w-full items-center justify-center gap-1.5 border-t border-white/[0.06] py-3 text-[12.5px] font-bold text-gold hover:text-goldlight lg:hidden"
        >
          {expanded ? 'Réduire' : `Afficher le top ${ranked.length}`}
          <ChevronDown size={15} className={cx('transition', expanded && 'rotate-180')} />
        </button>
      )}
    </div>
  )
}

function CandidateCard({ talent, rank }: { talent: Talent; rank: number }) {
  const { myVote } = useApp()
  const school = schoolById(talent.schoolId)
  const done = myVote(talent.category) === talent.id
  return (
    <article
      className={cx(
        'group flex flex-col rounded-2xl border bg-gradient-to-b from-night2/80 to-night/60 shadow-card transition duration-300',
        done ? 'border-stagelight/60' : 'border-white/[0.08] hover:border-gold/30',
      )}
    >
      <Link to={`/talents/${talent.id}`} className="relative block aspect-square overflow-hidden rounded-t-2xl" aria-label={`Voir le profil de ${talent.name}`}>
        <Portrait look={talent.look} category={talent.category} seed={talent.id} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
        <CategoryTag category={talent.category} className="absolute left-2.5 top-2.5 bg-ink/60 backdrop-blur" />
        <span
          className={cx(
            'absolute right-2.5 top-2.5 rounded-full px-2 py-0.5 font-display text-[16px] leading-tight',
            rank <= 3 ? 'bg-gold-soft text-ink' : 'bg-ink/60 text-white/80 backdrop-blur',
          )}
        >
          #{rank}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <Link to={`/talents/${talent.id}`} className="font-display text-[23px] leading-none tracking-wide hover:text-goldlight">
          {talent.name}
        </Link>
        <span className="mt-1 truncate text-[11.5px] text-white/55">{school.name}</span>
        <EngagementCounts talentId={talent.id} className="mt-2" />
        <div className="mt-3 grid grid-cols-1 gap-1.5">
          <SupportButton talentId={talent.id} size="sm" className="w-full" />
          <VoteButton talentId={talent.id} size="sm" className="w-full" />
        </div>
      </div>
    </article>
  )
}

export default function Votes() {
  const { voteCount, myVote } = useApp()
  const [cat, setCat] = useState<CatFilter>('tous')

  const pool = TALENTS.filter((t) => cat === 'tous' || t.category === cat)
  const rankOf = new Map(
    [...pool]
      .sort((a, b) => voteCount(b.id) - voteCount(a.id) || a.name.localeCompare(b.name))
      .map((t, i) => [t.id, i + 1] as const),
  )
  const candidates = byName.filter((t) => cat === 'tous' || t.category === cat)

  return (
    <div>
      <Hero />

      <div className="mb-5 flex flex-col gap-2 lg:mb-6 lg:flex-row lg:items-center lg:justify-between">
        <Chips options={CAT_OPTIONS} value={cat} onChange={setCat} />
        <span className="text-[12px] font-semibold text-white/45">
          {cat !== 'tous' && myVote(cat) ? (
            <>
              Ta voix en {CATEGORY_LABEL[cat]} : <b className="text-[#d9c6ff]">{TALENTS.find((t) => t.id === myVote(cat))?.name}</b> · tu peux la changer
            </>
          ) : (
            'Encouragements illimités (1 par talent) · 1 vote par discipline'
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-8">
        {/* Classement */}
        <aside className="lg:sticky lg:top-24 lg:order-2">
          <Leaderboard cat={cat} />
        </aside>

        {/* Candidats */}
        <section className="lg:order-1">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="eyebrow mb-1.5">{candidates.length} talents en lice</div>
              <h2 className="font-display text-[30px] leading-none tracking-wide lg:text-[38px]">Encourage et vote</h2>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-white/40">Ordre alphabétique</span>
          </div>
          <div key={cat} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 lg:gap-4 xl:grid-cols-3">
            {candidates.map((t, i) => (
              <div key={t.id} className="animate-fadeUp" style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}>
                <CandidateCard talent={t} rank={rankOf.get(t.id) ?? 0} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Fonctionnement */}
      <section className="mt-12 rounded-3xl border border-white/[0.07] bg-gradient-to-br from-night2/80 to-ink p-5 lg:p-8">
        <div className="eyebrow mb-1.5">Comment ça marche</div>
        <h2 className="font-display text-[30px] leading-none tracking-wide lg:text-[38px]">Trois gestes pour faire briller la relève</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { Icon: Headphones, t: 'Découvre', d: 'Écoute les extraits simulés et lis le parcours de chaque talent.' },
            { Icon: Heart, t: 'Encourage', d: 'Ouvert à tous, sans compte : un encouragement par talent, à donner à autant de talents que tu veux. Il ne change pas le classement.' },
            { Icon: Trophy, t: 'Vote', d: 'Avec ton compte : une voix par discipline (chant, danse, théâtre, slam, rap). Tu peux la déplacer tant que le vote est ouvert.' },
          ].map(({ Icon, t, d }, i) => (
            <div key={t} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/10 text-gold">
                  <Icon size={18} />
                </span>
                <span className="font-display text-[22px] tracking-wide">
                  <span className="text-gold">{i + 1}.</span> {t}
                </span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-white/60">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <Button to="/talents" iconRight={<ChevronRight size={16} />}>
            Découvrir les talents
          </Button>
          <Button to="/reglement" variant="outline" icon={<ScrollText size={16} />}>
            Lire le règlement
          </Button>
        </div>
      </section>
    </div>
  )
}
