import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  BellRing,
  CalendarClock,
  CalendarDays,
  Headphones,
  Library,
  MapPin,
  Mic2,
  MonitorPlay,
  Play,
  School,
  Star,
} from 'lucide-react'
import { fmtDay, fmtNum, schoolById, showById, showsOfSchool, talentById } from '../data'
import { useApp } from '../state/AppState'
import Portrait from '../components/art/Portrait'
import SchoolArt from '../components/art/SchoolArt'
import { ShowCard } from '../components/cards'
import { Button, Chips, cx } from '../components/ui'
import { BlockTitle, RowItem, scrollToId } from '../components/spaces/SpaceUI'
import { NowPlaying, TrackRow, useDemoPlayer } from '../components/spaces/player'
import { LIBRARY } from '../components/spaces/tracks'
import StudioArt from '../components/spaces/StudioArt'

const ALL_TRACKS = [...LIBRARY.repetition.tracks, ...LIBRARY.slam.tracks, ...LIBRARY.rap.tracks]
type LibKey = keyof typeof LIBRARY

const REHEARSALS = [
  { id: 'r1', date: '2026-11-10', time: '16 h 00', title: 'Travail du 2e couplet', place: 'Studio B — École du Sommet', coach: 'Mentor rap (à confirmer)' },
  { id: 'r2', date: '2026-11-17', time: '16 h 00', title: 'Placement sur le beat', place: 'Salle de répétition virtuelle', coach: 'Séance autonome' },
  { id: 'r3', date: '2026-12-02', time: '15 h 30', title: 'Générale technique', place: 'Auditorium du Sommet', coach: 'Équipe de production' },
]

function StudioLink({ className }: { className?: string }) {
  return (
    <Link
      to="/eleve/repetition"
      className={cx('group relative block overflow-hidden rounded-2xl border border-gold/30 shadow-stage transition hover:-translate-y-0.5 hover:shadow-gold', className)}
    >
      <div className="relative aspect-[16/9]">
        <StudioArt className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <span className="absolute left-3 top-3 rounded-md bg-stage px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider">Nouveau</span>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div>
            <div className="eyebrow mb-1">Studio virtuel</div>
            <div className="font-display text-[28px] leading-none tracking-wide">Salle de répétition</div>
            <div className="mt-1 text-[12px] text-white/60">Beats, téléprompteur, métronome et prises</div>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-soft text-ink shadow-gold transition group-hover:scale-105">
            <ArrowRight size={20} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function Student() {
  const { supportCount, toast } = useApp()
  const alex = talentById('alex-t')
  const school = schoolById(alex.schoolId)
  const shows = showsOfSchool('sommet')
  const upcoming = shows.filter((s) => s.status !== 'replay')
  const [lib, setLib] = useState<LibKey>('repetition')
  const player = useDemoPlayer(ALL_TRACKS)
  const [reminders, setReminders] = useState<Record<string, boolean>>({ r1: true })
  const libOptions = useMemo(() => (Object.keys(LIBRARY) as LibKey[]).map((k) => ({ value: k, label: LIBRARY[k].label })), [])
  const next = REHEARSALS[0]
  const nextDay = fmtDay(next.date)

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* En-tête */}
      <div className="animate-fadeUp">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="eyebrow">Espace élève</span>
        </div>
        <h1 className="font-display text-[40px] leading-[0.95] tracking-wide lg:text-[60px]">
          Mon espace élève
        </h1>
      </div>

      {/* Carte profil */}
      <div className="gold-border relative animate-fadeUp overflow-hidden rounded-3xl p-4 shadow-card lg:p-6" style={{ animationDelay: '60ms' }}>
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-stage/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-gold/40 shadow-gold lg:h-32 lg:w-32">
              <Portrait look={alex.look} category={alex.category} seed={alex.id} className="absolute inset-0 h-full w-full" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-[38px] leading-none tracking-wide lg:text-[48px]">{alex.name}</div>
              <div className="mt-1 text-[14px] font-semibold text-white/85">École du Sommet</div>
              <div className="text-[13px] text-white/55">
                Catégorie : <span className="font-bold text-gold">Rap conscience</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[12px] text-white/45">
                <MapPin size={12} /> {school.city}
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 sm:items-end">
            <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/[0.07] bg-ink/40 px-2 py-3 sm:w-[340px]">
              <div className="text-center">
                <div className="font-display text-[28px] leading-none text-goldlight">{fmtNum(supportCount(alex.id))}</div>
                <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-wider text-white/45">Encouragements</div>
              </div>
              <div className="text-center">
                <div className="font-display text-[28px] leading-none text-goldlight">{alex.performances.length}</div>
                <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-wider text-white/45">Prestation{alex.performances.length > 1 ? 's' : ''}</div>
              </div>
              <div className="text-center">
                <div className="font-display text-[28px] leading-none text-goldlight">{REHEARSALS.length}</div>
                <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-wider text-white/45">Répétitions</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" to={`/talents/${alex.id}`} icon={<Star size={15} />}>
                Ma fiche talent
              </Button>
              <Button size="sm" to="/eleve/repetition" icon={<Headphones size={15} />}>
                Répéter maintenant
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        {/* Colonne principale */}
        <div className="min-w-0 space-y-6 lg:space-y-8">
          {/* Raccourcis (maquette client) */}
          <div className="card divide-y divide-white/[0.06] overflow-hidden">
            <RowItem icon={CalendarClock} title="Mes répétitions" sub={`Prochaine : ${nextDay.day} novembre, ${next.time}`} onClick={() => scrollToId('repetitions')} />
            <RowItem icon={Library} title="Ressources musicales" sub="Beats, instrumentaux, textes et ateliers" onClick={() => scrollToId('ressources')} />
            <RowItem icon={CalendarDays} title="Mes événements" sub={`${upcoming.length} à venir · ${shows.length - upcoming.length} en rediffusion`} onClick={() => scrollToId('evenements')} />
            <RowItem icon={Mic2} title="Mes performances" sub={alex.performances.map((p) => p.title).join(' · ')} onClick={() => scrollToId('performances')} />
          </div>

          <StudioLink className="lg:hidden" />

          {/* Ressources musicales */}
          <section id="ressources" className="scroll-mt-24">
            <div className="mb-4">
              <div className="eyebrow mb-1.5">Bibliothèque</div>
              <h2 className="font-display text-[30px] leading-none tracking-wide lg:text-[38px]">Mes ressources musicales</h2>
            </div>
            <Chips options={libOptions} value={lib} onChange={setLib} className="mb-3" />
            <p className="mb-3 text-[13px] text-white/55">{LIBRARY[lib].intro}</p>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-2">
                {LIBRARY[lib].tracks.map((t, i) => (
                  <TrackRow key={t.id} track={t} player={player} index={i} />
                ))}
              </div>
              <NowPlaying player={player} className="xl:sticky xl:top-24 xl:self-start" compact />
            </div>
            <p className="mt-3 text-[11.5px] text-white/40">
              Les pistes « Beat » produisent un vrai rythme synthétisé dans le navigateur (Web Audio).
            </p>
          </section>

          {/* Événements */}
          <section id="evenements" className="scroll-mt-24">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <div className="eyebrow mb-1.5">École du Sommet</div>
                <h2 className="font-display text-[30px] leading-none tracking-wide lg:text-[38px]">Mes événements</h2>
              </div>
              <Link to="/spectacles" className="text-[13px] font-semibold text-gold hover:text-goldlight">
                Tous les spectacles →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {shows.map((s) => (
                <ShowCard key={s.id} show={s} />
              ))}
            </div>
          </section>

          {/* Performances */}
          <section id="performances" className="scroll-mt-24">
            <div className="mb-4">
              <div className="eyebrow mb-1.5">Sur scène</div>
              <h2 className="font-display text-[30px] leading-none tracking-wide lg:text-[38px]">Mes performances</h2>
            </div>
            <div className="space-y-2">
              {alex.performances.map((p) => {
                const show = showById(p.showId)
                return (
                  <Link
                    key={p.title}
                    to={`/spectacles/${p.showId}`}
                    className="card group flex items-center gap-3.5 p-3.5 transition hover:border-gold/40"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 text-goldlight transition group-hover:bg-gold-soft group-hover:text-ink">
                      <Play size={18} className="ml-0.5 fill-current" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[24px] leading-none tracking-wide">{p.title}</span>
                      <span className="mt-1 block truncate text-[12.5px] text-white/55">
                        {show ? `${show.title} · ${show.status === 'replay' ? 'Rediffusion disponible' : 'À venir'}` : 'Spectacle'}
                      </span>
                    </span>
                    <span className="text-[13px] font-semibold tabular-nums text-white/55">{p.duration}</span>
                  </Link>
                )
              })}
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-white/15 px-4 py-3.5">
                <span className="text-[12.5px] text-white/50">Ta prochaine prestation : {upcoming[0] ? `${upcoming[0].title}` : 'à venir'}</span>
                <Button size="sm" variant="dark" to={upcoming[0] ? `/spectacles/${upcoming[0].id}` : '/spectacles'}>
                  Voir
                </Button>
              </div>
            </div>
          </section>
        </div>

        {/* Colonne latérale */}
        <aside className="min-w-0 space-y-6">
          <StudioLink className="hidden lg:block" />

          {/* Répétitions */}
          <section id="repetitions" className="card scroll-mt-24 p-4 lg:p-5">
            <BlockTitle icon={CalendarClock}>
              Mes prochaines répétitions
            </BlockTitle>
            <div className="space-y-2.5">
              {REHEARSALS.map((r, i) => {
                const d = fmtDay(r.date)
                const on = !!reminders[r.id]
                return (
                  <div key={r.id} className={cx('flex items-center gap-3 rounded-2xl border p-3', i === 0 ? 'border-gold/35 bg-gold/[0.05]' : 'border-white/[0.06] bg-white/[0.02]')}>
                    <div className="w-12 shrink-0 rounded-xl border border-white/10 bg-ink/50 py-1.5 text-center">
                      <div className="font-display text-[24px] leading-none text-goldlight">{d.day}</div>
                      <div className="text-[10px] font-bold uppercase text-white/50">{d.month}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-bold">{r.title}</div>
                      <div className="truncate text-[11.5px] text-white/50">
                        {r.time} · {r.place}
                      </div>
                      <div className="truncate text-[11px] text-white/35">{r.coach}</div>
                    </div>
                    <button
                      aria-label={on ? 'Retirer le rappel' : 'Activer un rappel'}
                      title={on ? 'Rappel activé' : 'Activer un rappel'}
                      onClick={() => {
                        setReminders((m) => ({ ...m, [r.id]: !on }))
                        toast(on ? 'Rappel retiré' : `Rappel activé pour le ${d.day} ${d.month}`, 'info')
                      }}
                      className={cx(
                        'grid h-9 w-9 shrink-0 place-items-center rounded-full border transition',
                        on ? 'border-gold/50 bg-gold/15 text-goldlight' : 'border-white/10 text-white/50 hover:text-white',
                      )}
                    >
                      {on ? <BellRing size={16} /> : <Bell size={16} />}
                    </button>
                  </div>
                )
              })}
            </div>
            <Button size="sm" variant="outline" to="/eleve/repetition" className="mt-3 w-full" icon={<Headphones size={15} />}>
              Préparer ma prochaine séance
            </Button>
          </section>

          {/* Mon école */}
          <section className="card overflow-hidden">
            <div className="relative aspect-[16/8]">
              <SchoolArt school={school} className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <School size={16} className="text-gold" />
                <span className="eyebrow">Mon école</span>
              </div>
            </div>
            <div className="p-4 pt-2">
              <div className="text-[16px] font-extrabold">{school.name}</div>
              <div className="text-[12.5px] text-white/55">
                {school.city} · {school.participants} participants · « {school.motto} »
              </div>
              <Button size="sm" variant="dark" to={`/ecoles/${school.id}`} className="mt-3 w-full" iconRight={<ArrowRight size={15} />}>
                Voir la page de l’école
              </Button>
            </div>
          </section>

          {/* Ma catégorie */}
          <section className="card relative overflow-hidden p-4 lg:p-5">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-live/15 blur-3xl" />
            <BlockTitle icon={Mic2}>Ma catégorie</BlockTitle>
            <div className="font-display text-[34px] leading-none tracking-wide text-gold-metal">Rap conscience</div>
            <p className="mt-2 text-[13px] leading-relaxed text-white/60">
              Un rap qui porte un message : solidarité, persévérance, fierté de sa communauté. Les textes sont évalués pour leur sens autant que pour leur flow.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Texte et message', 'Flow', 'Présence scénique', 'Originalité'].map((c) => (
                <span key={c} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/70">
                  {c}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="dark" to="/reglement" className="flex-1">
                Règlement
              </Button>
              <Button size="sm" variant="dark" to="/talents" className="flex-1" icon={<MonitorPlay size={15} />}>
                Autres talents
              </Button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
