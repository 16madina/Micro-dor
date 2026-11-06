import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarDays, ChevronRight, MapPin, Music2, Play, Quote, X } from 'lucide-react'
import { PHOTOS, SCHOOLS, fmtDate, fmtDay, regionById, showsOfSchool, talentsOfSchool, type Palette } from '../data'
import SchoolArt from '../components/art/SchoolArt'
import StageArt, { type Pose } from '../components/art/StageArt'
import { ShowCard, TalentCard, poseFor } from '../components/cards'
import { Button, StatusBadge, Tabs, cx } from '../components/ui'

type Tab = 'presentation' | 'talents' | 'spectacles' | 'calendrier' | 'galerie'
const POSES: Pose[] = ['singer', 'rap', 'slam', 'trio', 'singer', 'slam']

export default function SchoolDetail() {
  const { id } = useParams()
  const school = SCHOOLS.find((s) => s.id === id)
  const [tab, setTab] = useState<Tab>('presentation')
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (!school)
    return (
      <div className="py-24 text-center">
        <p className="text-white/60">Cette école est introuvable.</p>
        <Button to="/ecoles" className="mt-4">
          Voir les écoles
        </Button>
      </div>
    )

  const talents = talentsOfSchool(school.id)
  const shows = showsOfSchool(school.id).sort((a, b) => a.date.localeCompare(b.date))
  const main = shows.find((s) => s.status === 'live') ?? shows.find((s) => s.status === 'upcoming') ?? shows[0]
  const upcoming = shows.filter((s) => s.status !== 'replay')
  const past = shows.filter((s) => s.status === 'replay')
  const region = regionById(school.regionId)
  const gallery = [...shows.map((s) => PHOTOS.show(s.id)), ...talents.map((t) => PHOTOS.talent(t.id)), PHOTOS.crowd, PHOTOS.heroAlt].slice(0, POSES.length)
  const galleryPalettes: Palette[] = [school.palette, 'violet', 'gold', school.palette, 'magenta', 'blue']

  return (
    <div style={{ ['--accent' as string]: school.accent }}>
      {/* bannière */}
      <section className="relative -mx-4 -mt-4 overflow-hidden lg:mx-0 lg:mt-0 lg:rounded-[28px] lg:border lg:border-white/[0.07]">
        <div className="relative h-[380px] lg:h-[420px]">
          <SchoolArt school={school} className="absolute inset-x-0 top-0 h-[62%] w-full lg:h-full" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 30%, ${school.accent2}55 70%, #08090E 100%)` }} />
          <div className="absolute inset-x-0 bottom-0 p-5 lg:p-10">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink" style={{ background: school.accent }}>
                {school.motto}
              </span>
            </div>
            <h1 className="font-display text-[44px] leading-[0.92] tracking-wide lg:text-[72px]">{school.name}</h1>
            <div className="mt-2 flex items-center gap-1.5 text-[14px] text-white/75">
              <MapPin size={15} style={{ color: school.accent }} />
              {school.city}
              {region && region.name !== school.city && ` · ${region.name}`}
            </div>
          </div>
        </div>
      </section>

      {/* statistiques */}
      <div className="relative z-10 -mt-1 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/[0.08] bg-night/90 py-4 backdrop-blur lg:mt-6 lg:max-w-2xl">
        {[
          { v: school.participants, l: 'Participants' },
          { v: shows.length, l: 'Spectacles' },
          { v: talents.length, l: 'Talents' },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display text-[32px] leading-none" style={{ color: school.accent }}>
              {s.v}
            </div>
            <div className="mt-1 text-[10.5px] font-bold uppercase tracking-wider text-white/45">{s.l}</div>
          </div>
        ))}
      </div>

      {main && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button to={`/spectacles/${main.id}`} size="lg" icon={<Play size={16} className="fill-ink" />}>
            {main.status === 'live' ? 'Regarder le spectacle' : main.status === 'upcoming' ? 'Voir le prochain spectacle' : 'Voir la rediffusion'}
          </Button>
          <Button variant="dark" size="lg" onClick={() => setTab('talents')}>
            Rencontrer les talents
          </Button>
        </div>
      )}

      <Tabs
        className="mt-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'presentation', label: 'Présentation' },
          { value: 'talents', label: 'Talents' },
          { value: 'spectacles', label: 'Spectacles' },
          { value: 'calendrier', label: 'Calendrier' },
          { value: 'galerie', label: 'Galerie' },
        ]}
      />

      <div key={tab} className="animate-fadeUp pt-6">
        {tab === 'presentation' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="relative mb-5 rounded-2xl border-l-4 bg-white/[0.03] p-5" style={{ borderColor: school.accent }}>
                <Quote size={22} className="absolute right-4 top-4 opacity-30" style={{ color: school.accent }} />
                <p className="font-display text-[28px] leading-tight tracking-wide">« {school.tagline} »</p>
              </div>
              <p className="text-[15px] leading-relaxed text-white/75">{school.description}</p>
              <h3 className="mb-3 mt-6 text-[13px] font-extrabold uppercase tracking-widest text-white/50">Programmes artistiques</h3>
              <div className="flex flex-wrap gap-2">
                {school.programs.map((p) => (
                  <span key={p} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] font-semibold">
                    <Music2 size={13} style={{ color: school.accent }} /> {p}
                  </span>
                ))}
              </div>
            </div>
            {main && (
              <Link to={`/spectacles/${main.id}`} className="group relative block overflow-hidden rounded-2xl border border-white/[0.08]">
                <div className="relative aspect-video">
                  <StageArt seed={main.id + 'teaser'} photo={PHOTOS.show(main.id)} palette={main.palette} pose={poseFor(main.category)} animated className="absolute inset-0 h-full w-full" />
                  <div className="absolute inset-0 grid place-items-center bg-ink/20">
                    <span className="grid h-16 w-16 place-items-center rounded-full border border-white/40 bg-ink/50 backdrop-blur transition group-hover:scale-110">
                      <Play size={26} className="ml-1 fill-white" />
                    </span>
                  </div>
                  <StatusBadge status={main.status} className="absolute left-3 top-3" />
                </div>
                <div className="flex items-center justify-between bg-night p-4">
                  <div>
                    <div className="font-extrabold">{main.title}</div>
                    <div className="text-[12px] text-white/50">
                      {fmtDate(main.date)} · {main.time}
                    </div>
                  </div>
                  <ChevronRight className="text-gold" />
                </div>
              </Link>
            )}
          </div>
        )}

        {tab === 'talents' && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {talents.map((t) => (
              <TalentCard key={t.id} talent={t} />
            ))}
          </div>
        )}

        {tab === 'spectacles' && (
          <div className="space-y-8">
            <div>
              <h3 className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-white/50">En direct et à venir</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((s) => (
                  <ShowCard key={s.id} show={s} />
                ))}
                {upcoming.length === 0 && <p className="text-white/50">Aucun spectacle à venir pour le moment.</p>}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-white/50">Spectacles passés</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((s) => (
                  <ShowCard key={s.id} show={s} />
                ))}
                {past.length === 0 && <p className="text-[14px] text-white/50">Premier spectacle de la saison à venir.</p>}
              </div>
            </div>
          </div>
        )}

        {tab === 'calendrier' && (
          <div className="relative space-y-3 pl-6 lg:max-w-2xl">
            <span className="absolute bottom-2 left-[7px] top-2 w-px" style={{ background: `linear-gradient(${school.accent}, transparent)` }} />
            {shows.map((s) => {
              const d = fmtDay(s.date)
              return (
                <Link key={s.id} to={`/spectacles/${s.id}`} className="relative flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-night/70 p-3 transition hover:border-gold/40">
                  <span className="absolute -left-[22px] h-3 w-3 rounded-full border-2 border-ink" style={{ background: school.accent }} />
                  <div className="w-14 text-center">
                    <div className="font-display text-[28px] leading-none">{d.day}</div>
                    <div className="text-[10px] font-bold uppercase text-white/50">{d.month}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold">{s.title}</div>
                    <div className="flex items-center gap-1 text-[12px] text-white/50">
                      <CalendarDays size={12} /> {s.time} · {s.venue}
                    </div>
                  </div>
                  <StatusBadge status={s.status} />
                </Link>
              )
            })}
          </div>
        )}

        {tab === 'galerie' && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {POSES.map((p, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className={cx('group relative overflow-hidden rounded-2xl border border-white/[0.07]', i === 0 && 'col-span-2 lg:row-span-2')}
              >
                <div className={cx('relative', i === 0 ? 'aspect-[16/10] lg:aspect-auto lg:h-full' : 'aspect-[4/3]')}>
                  <StageArt seed={school.id + 'g' + i} photo={gallery[i]} palette={galleryPalettes[i]} pose={p} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
                </div>
                <span className="absolute bottom-2 left-2 rounded-md bg-ink/70 px-2 py-0.5 text-[10.5px] font-semibold text-white/80 backdrop-blur">
                  Performance {i + 1}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[80] grid animate-fadeIn place-items-center bg-black/90 p-4" onClick={() => setLightbox(null)}>
          <button aria-label="Fermer" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10">
            <X size={20} />
          </button>
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-gold/30" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video">
              <StageArt seed={school.id + 'g' + lightbox} photo={gallery[lightbox]} palette={galleryPalettes[lightbox]} pose={POSES[lightbox]} animated className="absolute inset-0 h-full w-full" />
            </div>
            <div className="flex items-center justify-between bg-night p-4 text-[13px]">
              <span className="font-bold">
                {school.shortName} — Performance {lightbox + 1}
              </span>
              <div className="flex gap-2">
                <button onClick={() => setLightbox((lightbox + POSES.length - 1) % POSES.length)} className="rounded-full border border-white/15 px-3 py-1">
                  ←
                </button>
                <button onClick={() => setLightbox((lightbox + 1) % POSES.length)} className="rounded-full border border-white/15 px-3 py-1">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* autres écoles */}
      <section className="mt-12">
        <h3 className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-white/50">Autres écoles participantes</h3>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
          {SCHOOLS.filter((s) => s.id !== school.id).map((s) => (
            <Link key={s.id} to={`/ecoles/${s.id}`} className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-4 text-[13px] font-semibold transition hover:border-gold/40">
              <span className="h-6 w-6 rounded-full" style={{ background: `linear-gradient(135deg, ${s.accent}, ${s.accent2})` }} />
              {s.shortName} <span className="text-white/40">· {s.city}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
