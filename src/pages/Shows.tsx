import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Play, Users } from 'lucide-react'
import { CATEGORY_LABEL, LIVE, PHOTOS, SHOWS, fmtDate, schoolById, talentById, type Category } from '../data'
import StageArt from '../components/art/StageArt'
import { ShowCard, poseFor } from '../components/cards'
import { Button, CategoryTag, Chips, DemoPill, PageHero, StatusBadge } from '../components/ui'

type Filter = 'all' | 'live' | 'upcoming' | 'replay' | Category

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'live', label: 'En direct' },
  { value: 'upcoming', label: 'À venir' },
  { value: 'replay', label: 'Rediffusions' },
  { value: 'chant', label: 'Chant' },
  { value: 'slam', label: 'Slam' },
  { value: 'rap', label: 'Rap conscience' },
  { value: 'danse', label: 'Danse' },
  { value: 'theatre', label: 'Théâtre' },
]

const ORDER = { live: 0, upcoming: 1, replay: 2 }

export default function Shows() {
  const [params, setParams] = useSearchParams()
  const f = (params.get('f') as Filter) || 'all'
  const setF = (v: Filter) => setParams(v === 'all' ? {} : { f: v }, { replace: true })

  const list = useMemo(() => {
    return SHOWS.filter((s) => {
      if (f === 'all') return true
      if (f === 'live' || f === 'upcoming' || f === 'replay') return s.status === f
      return s.category === f || s.lineup.some((id) => talentById(id).category === f)
    }).sort((a, b) => ORDER[a.status] - ORDER[b.status] || a.date.localeCompare(b.date))
  }, [f])

  const featured = LIVE[0]
  const fs = schoolById(featured.schoolId)

  return (
    <div>
      <PageHero
        eyebrow="Catalogue"
        title={
          <>
            Les <span className="text-gold-metal">spectacles</span>
          </>
        }
        sub="Directs simulés, prochaines dates de la tournée et rediffusions : toute la scène MICRO D’OR au même endroit."
      >
        <DemoPill className="mt-3">Spectacles fictifs — aucun événement réel n’est diffusé</DemoPill>
      </PageHero>

      {/* À la une */}
      <Link to={`/spectacles/${featured.id}`} className="group relative mb-8 block overflow-hidden rounded-[24px] border border-white/[0.08] shadow-stage">
        <div className="relative h-[300px] lg:h-[380px]">
          <StageArt seed={featured.id + 'feat'} photo={PHOTOS.show(featured.id)} palette={featured.palette} pose="trio" animated className="absolute inset-0 h-full w-full lg:[transform:translateX(24%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent lg:bg-gradient-to-r lg:from-ink lg:via-ink/50" />
          <div className="absolute inset-x-0 bottom-0 p-5 lg:inset-y-0 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:p-10">
            <div className="mb-3 flex items-center gap-2">
              <StatusBadge status="live" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">À la une</span>
            </div>
            <h2 className="font-display text-[40px] leading-[0.92] tracking-wide lg:text-[58px]">{featured.title}</h2>
            <p className="mt-2 text-[13.5px] text-white/70">
              {fs.city} · {fmtDate(featured.date)}, {featured.time}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[12.5px] text-white/60">
              <Users size={14} className="text-gold" />
              {featured.lineup.map((id) => talentById(id).name).join(' · ')}
            </div>
            <div className="mt-5">
              <span className="inline-flex h-11 items-center gap-2 rounded-full bg-gold-soft px-6 text-sm font-extrabold text-ink shadow-gold transition group-hover:brightness-110">
                <Play size={16} className="fill-ink" /> Regarder la démonstration
              </span>
            </div>
          </div>
        </div>
      </Link>

      <Chips options={FILTERS} value={f} onChange={setF} className="mb-5" />

      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] text-white/50">
          {list.length} spectacle{list.length > 1 ? 's' : ''}
        </span>
        {f !== 'all' && (
          <Button variant="ghost" size="sm" onClick={() => setF('all')}>
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        {list.map((s, i) => (
          <div key={s.id} className="animate-fadeUp" style={{ animationDelay: `${i * 0.04}s` }}>
            <ShowCard show={s} />
          </div>
        ))}
      </div>

      {/* Par catégorie */}
      <section className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {(['chant', 'danse', 'theatre', 'slam', 'rap'] as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => {
              setF(c)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.08] text-left"
          >
            <div className="relative h-36">
              <StageArt seed={'cat' + c} photo={PHOTOS.talent(({ chant: 'maya-l', danse: 'jade-t', theatre: 'samuel-p', slam: 'lea-r', rap: 'karim-s' } as Record<Category, string>)[c])} palette="violet" pose={poseFor(c)} crowd={false} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/90 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5">
                <CategoryTag category={c} className="mb-2 self-start" />
                <span className="font-display text-[30px] leading-none">{CATEGORY_LABEL[c]}</span>
              </div>
            </div>
          </button>
        ))}
      </section>
    </div>
  )
}
