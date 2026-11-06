import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowDownAZ, Crown, Flame, Heart, MapPin, SearchX, Trophy } from 'lucide-react'
import { SCHOOLS, TALENTS, fmtNum, schoolById } from '../data'
import { useApp } from '../state/AppState'
import Portrait from '../components/art/Portrait'
import { TalentCard } from '../components/cards'
import { Button, CategoryTag, Chips, DemoPill, PageHero, cx } from '../components/ui'
import { CAT_OPTIONS, EngagementCounts, SupportButton, VoteButton, type CatFilter } from '../components/talents/shared'

type Sort = 'populaires' | 'az'

/** Talent mis en vedette : le plus soutenu au départ de la démo */
const FEATURED = TALENTS.reduce((a, b) => (b.supports > a.supports ? b : a))

const SCHOOL_OPTIONS = [{ value: 'toutes', label: 'Toutes les écoles' }, ...SCHOOLS.map((s) => ({ value: s.id, label: s.shortName }))]

function FeaturedBanner() {
  const { supportCount } = useApp()
  const t = FEATURED
  const school = schoolById(t.schoolId)
  return (
    <section className="gold-border relative mb-8 overflow-hidden rounded-3xl shadow-stage animate-fadeUp">
      {/* éclairage de scène */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_80%_10%,rgba(104,55,181,.55),transparent_65%),radial-gradient(50%_70%_at_0%_100%,rgba(214,172,85,.14),transparent_70%)]" />
      <div className="pointer-events-none absolute -top-10 right-[22%] h-[140%] w-24 origin-top animate-sweep bg-gradient-to-b from-goldlight/25 to-transparent blur-xl" />

      {/* portrait */}
      <Link
        to={`/talents/${t.id}`}
        aria-label={`Voir le profil de ${t.name}`}
        className="absolute inset-y-0 right-0 w-[56%] sm:w-[46%] lg:w-[42%]"
      >
        <Portrait look={t.look} category={t.category} seed={t.id} className="h-full w-full" />
        <span className="absolute inset-0 bg-gradient-to-r from-[#0d1120] via-[#0d1120]/40 to-transparent" />
      </Link>

      <div className="relative z-10 flex min-h-[320px] max-w-[64%] flex-col justify-end p-5 sm:max-w-[58%] sm:p-7 lg:min-h-[380px] lg:p-10">
        <div className="eyebrow mb-3 flex items-center gap-2">
          <Crown size={14} className="text-gold" />
          Talent de la semaine
        </div>
        <h2 className="text-gold-metal font-display text-[58px] leading-[0.85] tracking-wide sm:text-[76px] lg:text-[104px]">{t.name}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <CategoryTag category={t.category} />
          <Link to={`/ecoles/${school.id}`} className="flex items-center gap-1 text-[12.5px] font-semibold text-white/75 hover:text-goldlight">
            <MapPin size={12} className="text-gold" />
            <span className="hidden sm:inline">{school.name}</span>
            <span className="sm:hidden">{school.shortName}</span>
          </Link>
        </div>
        <p className="mt-4 hidden max-w-md border-l-2 border-gold/60 pl-3 text-[14.5px] italic leading-relaxed text-white/80 sm:block">« {t.quote} »</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-white/50">
          <EngagementCounts talentId={t.id} className="text-white" />
          <span>encouragements · votes</span>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Button to={`/talents/${t.id}`} size="sm" className="lg:h-11 lg:px-6 lg:text-sm">
            Voir le profil
          </Button>
          <SupportButton talentId={t.id} size="sm" className="hidden sm:inline-flex" />
          <SupportButton talentId={t.id} iconOnly size="sm" className="sm:hidden" />
          <VoteButton talentId={t.id} size="sm" className="hidden sm:inline-flex" />
          <VoteButton talentId={t.id} iconOnly size="sm" className="sm:hidden" />
        </div>
      </div>
    </section>
  )
}

export default function Talents() {
  const { supportCount } = useApp()
  const [params, setParams] = useSearchParams()

  const cat = (CAT_OPTIONS.some((o) => o.value === params.get('cat')) ? params.get('cat') : 'tous') as CatFilter
  const schoolId = SCHOOLS.some((s) => s.id === params.get('ecole')) ? (params.get('ecole') as string) : 'toutes'
  const sort: Sort = params.get('tri') === 'az' ? 'az' : 'populaires'

  const setParam = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params)
    if (value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  // L’ordre est figé au moment du filtrage pour éviter que la grille ne « saute »
  // quand les compteurs simulés évoluent en arrière-plan.
  const list = useMemo(() => {
    const filtered = TALENTS.filter((t) => (cat === 'tous' || t.category === cat) && (schoolId === 'toutes' || t.schoolId === schoolId))
    return sort === 'az'
      ? [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'fr-CA'))
      : [...filtered].sort((a, b) => supportCount(b.id) - supportCount(a.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, schoolId, sort])

  const activeSchool = schoolId !== 'toutes' ? schoolById(schoolId) : null
  const filtersOn = cat !== 'tous' || schoolId !== 'toutes'

  return (
    <div>
      <PageHero
        eyebrow="Saison 2026 · Galerie"
        title={
          <>
            Talents à <span className="text-gold-metal">découvrir</span>
          </>
        }
        sub="Chant, danse, théâtre, slam et rap conscience : les talents de huit écoles secondaires du Québec montent sur la scène MICRO D’OR. Découvre leur univers et encourage tes coups de cœur."
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <DemoPill>Personnages fictifs — photos d’illustration</DemoPill>
        </div>
      </PageHero>

      <FeaturedBanner />

      {/* Filtres */}
      <section className="mb-5 space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Chips options={CAT_OPTIONS} value={cat} onChange={(v) => setParam('cat', v, 'tous')} />
          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <span className="text-[12.5px] font-semibold text-white/50 lg:hidden">
              {list.length} talent{list.length > 1 ? 's' : ''}
            </span>
            <div className="flex rounded-full border border-white/10 bg-white/[0.04] p-1" role="group" aria-label="Trier les talents">
              {(
                [
                  { v: 'populaires', label: 'Populaires', Icon: Flame },
                  { v: 'az', label: 'A–Z', Icon: ArrowDownAZ },
                ] as const
              ).map(({ v, label, Icon }) => (
                <button
                  key={v}
                  onClick={() => setParam('tri', v, 'populaires')}
                  aria-pressed={sort === v}
                  className={cx(
                    'flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-bold transition',
                    sort === v ? 'bg-white/10 text-goldlight' : 'text-white/55 hover:text-white',
                  )}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <Chips options={SCHOOL_OPTIONS} value={schoolId} onChange={(v) => setParam('ecole', v, 'toutes')} />
      </section>

      <div className="mb-4 hidden items-baseline justify-between lg:flex">
        <p className="text-[13px] text-white/55">
          <span className="font-extrabold text-white">{list.length}</span> talent{list.length > 1 ? 's' : ''}
          {activeSchool && (
            <>
              {' '}
              ·{' '}
              <Link to={`/ecoles/${activeSchool.id}`} className="font-semibold text-gold hover:text-goldlight">
                {activeSchool.name}
              </Link>
            </>
          )}
        </p>
        {filtersOn && (
          <button onClick={() => setParams(new URLSearchParams(), { replace: true })} className="text-[12.5px] font-semibold text-white/50 hover:text-goldlight">
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {list.length ? (
        <div key={`${cat}-${schoolId}-${sort}`} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-5 xl:grid-cols-4">
          {list.map((t, i) => (
            <div key={t.id} className="animate-fadeUp" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
              <TalentCard talent={t} />
            </div>
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center px-6 py-14 text-center">
          <SearchX size={34} className="text-gold" />
          <h3 className="mt-3 font-display text-[28px] tracking-wide">Aucun talent pour ces filtres</h3>
          <p className="mt-1 max-w-sm text-[14px] text-white/60">Essaie une autre discipline ou une autre école : chaque établissement présente ses propres voix.</p>
          <Button className="mt-5" variant="outline" size="sm" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Appel au soutien */}
      <section className="relative mt-10 overflow-hidden rounded-3xl border border-stage/30 bg-gradient-to-br from-stage/25 via-night to-night p-6 lg:flex lg:items-center lg:justify-between lg:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative">
          <div className="eyebrow mb-1.5">Votes simulés</div>
          <h2 className="font-display text-[32px] leading-none tracking-wide lg:text-[42px]">
            Ton soutien peut faire <span className="text-gold-metal">briller</span> un talent.
          </h2>
          <p className="mt-2 max-w-lg text-[14px] text-white/60">Consulte le classement de démonstration et encourage les artistes qui te touchent.</p>
        </div>
        <Button to="/votes" className="relative mt-5 lg:mt-0" icon={<Trophy size={17} />}>
          Voir le classement
        </Button>
      </section>
    </div>
  )
}
