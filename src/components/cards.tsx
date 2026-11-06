import { Link } from 'react-router-dom'
import { Heart, MapPin, Play, Users, CalendarDays } from 'lucide-react'
import { CATEGORY_LABEL, PHOTOS, fmtDate, fmtNum, schoolById, showsOfSchool, talentsOfSchool, type Category, type School, type Show, type Talent } from '../data'
import { useApp } from '../state/AppState'
import StageArt, { type Pose } from './art/StageArt'
import { EngagementCounts } from './talents/shared'
import Portrait from './art/Portrait'
import SchoolArt from './art/SchoolArt'
import { CategoryTag, StatusBadge, cx } from './ui'

export const poseFor = (c: Category | 'mixte'): Pose =>
  c === 'chant' ? 'singer' : c === 'slam' || c === 'theatre' ? 'slam' : c === 'rap' || c === 'danse' ? 'rap' : 'trio'

/** Affiche de spectacle, format paysage */
export function ShowCard({ show, className, size = 'md' }: { show: Show; className?: string; size?: 'md' | 'lg' }) {
  const school = schoolById(show.schoolId)
  return (
    <Link
      to={`/spectacles/${show.id}`}
      className={cx(
        'group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-night shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-gold',
        className,
      )}
    >
      <div className={cx('relative', size === 'lg' ? 'aspect-[16/10]' : 'aspect-[16/10]')}>
        <StageArt seed={show.id} photo={PHOTOS.show(show.id)} palette={show.palette} pose={poseFor(show.category)} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <StatusBadge status={show.status} className="absolute left-3 top-3" />
        <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-ink/50 opacity-0 backdrop-blur transition group-hover:opacity-100">
          <Play size={15} className="ml-0.5 fill-goldlight text-goldlight" />
        </span>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="mb-1.5">
            <CategoryTag category={show.category} />
          </div>
          <h3 className={cx('font-display leading-none tracking-wide', size === 'lg' ? 'text-[30px]' : 'text-[24px]')}>{show.title}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-white/70">
            <span className="font-semibold text-white/90">{school.name}</span>
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {school.city}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={12} />
              {fmtDate(show.date)} · {show.time}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5">
        <span className="text-[11px] text-white/45">{show.venue}</span>
        <span className="text-[12.5px] font-bold text-gold group-hover:text-goldlight">
          {show.status === 'upcoming' ? 'Voir le spectacle' : show.status === 'live' ? 'Regarder (démo)' : 'Voir la rediffusion'} →
        </span>
      </div>
    </Link>
  )
}

/** Carte talent portrait */
export function TalentCard({ talent, className }: { talent: Talent; className?: string }) {
  const school = schoolById(talent.schoolId)
  return (
    <Link
      to={`/talents/${talent.id}`}
      className={cx(
        'group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-night shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-gold/40',
        className,
      )}
    >
      <div className="relative aspect-[4/5]">
        <Portrait look={talent.look} category={talent.category} seed={talent.id} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="font-display text-[24px] leading-none tracking-wide">{talent.name}</div>
          <div className="mt-1 text-[12px] font-bold text-gold">{CATEGORY_LABEL[talent.category]}</div>
          <div className="mt-0.5 truncate text-[11.5px] text-white/60">{school.name}</div>
          <EngagementCounts talentId={talent.id} spread className="mt-2" />
        </div>
      </div>
    </Link>
  )
}

/** Carte d'école (liste) */
export function SchoolCard({ school, className }: { school: School; className?: string }) {
  const nShows = showsOfSchool(school.id).length
  const nTalents = talentsOfSchool(school.id).length
  return (
    <Link
      to={`/ecoles/${school.id}`}
      className={cx(
        'group flex overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-night2 to-night shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-gold/40 lg:flex-col',
        className,
      )}
    >
      <div className="relative w-[38%] shrink-0 overflow-hidden lg:aspect-[16/9] lg:w-full">
        <SchoolArt school={school} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
        <span className="absolute bottom-0 left-0 h-1 w-full" style={{ background: `linear-gradient(90deg, ${school.accent}, transparent)` }} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-3.5 lg:p-4">
        <h3 className="text-[14.5px] font-extrabold leading-tight lg:text-[16px]">{school.name}</h3>
        <div className="flex items-center gap-1 text-[12px] text-white/55">
          <MapPin size={12} style={{ color: school.accent }} />
          {school.city}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 text-[11.5px] text-white/60">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {school.participants} participants
          </span>
          <span>{nShows} spectacle{nShows > 1 ? 's' : ''}</span>
          <span className="hidden lg:inline">{nTalents} talents</span>
        </div>
        <span className="mt-2 hidden text-[12.5px] font-bold text-gold group-hover:text-goldlight lg:inline">Découvrir l’école →</span>
      </div>
    </Link>
  )
}
