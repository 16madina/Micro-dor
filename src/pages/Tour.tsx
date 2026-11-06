import { useMemo, useState } from 'react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock, MapPin, Navigation, RotateCcw } from 'lucide-react'
import {
  DEMO_TODAY,
  REGIONS,
  SCHOOLS,
  SHOWS,
  fmtDate,
  fmtDay,
  monthName,
  regionById,
  schoolById,
  type Show,
} from '../data'
import { Button, CategoryTag, DemoPill, PageHero, SectionHeader, StatusBadge, cx } from '../components/ui'
import QuebecMap from '../components/mission/QuebecMap'

/** Mois navigables : novembre 2026 → février 2027 */
const MONTHS: { y: number; m: number }[] = [
  { y: 2026, m: 10 },
  { y: 2026, m: 11 },
  { y: 2027, m: 0 },
  { y: 2027, m: 1 },
]
const WEEKDAYS = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam']
const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const ALL_SORTED = [...SHOWS].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))

export default function Tour() {
  const [regionId, setRegionId] = useState('all')
  const [pinId, setPinId] = useState<string | null>(null)
  const [monthIdx, setMonthIdx] = useState(0)
  const [day, setDay] = useState<string | null>(DEMO_TODAY)

  const shows = useMemo(
    () => (regionId === 'all' ? ALL_SORTED : ALL_SORTED.filter((s) => schoolById(s.schoolId).regionId === regionId)),
    [regionId],
  )
  const byDate = useMemo(() => {
    const m = new Map<string, Show[]>()
    for (const s of shows) m.set(s.date, [...(m.get(s.date) ?? []), s])
    return m
  }, [shows])

  const regionsWithSchools = new Set(SCHOOLS.map((s) => s.regionId))
  const region = regionById(regionId)

  const changeRegion = (r: string) => {
    setRegionId(r)
    const s = SCHOOLS.find((x) => x.regionId === r)
    setPinId(s ? s.id : null)
  }

  // groupes par mois pour la liste
  const groups = useMemo(() => {
    const g: { key: string; label: string; items: Show[] }[] = []
    for (const s of shows) {
      const key = s.date.slice(0, 7)
      const last = g[g.length - 1]
      if (last && last.key === key) last.items.push(s)
      else {
        const [y, m] = key.split('-').map(Number)
        g.push({ key, label: `${cap(monthName(m - 1))} ${y}`, items: [s] })
      }
    }
    return g
  }, [shows])

  const nUpcoming = shows.filter((s) => s.status !== 'replay').length

  return (
    <div>
      <PageHero
        eyebrow="Saison 2026–2027 · Tournée provinciale"
        title={
          <>
            La tournée MICRO D’OR <span className="text-gold-metal">à travers le Québec</span>
          </>
        }
        sub="De Gatineau à Saguenay, la scène MICRO D’OR s’installe dans les écoles secondaires participantes. Explorez la carte, le calendrier et toutes les étapes de la saison."
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <DemoPill>Dates fictives — démonstration</DemoPill>
          <DemoPill>Écoles fictives</DemoPill>
        </div>
      </PageHero>

      {/* ---------- Bandeau chiffres + filtre */}
      <div className="card mb-5 flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-5">
        <div className="grid grid-cols-3 gap-2 lg:flex lg:gap-10">
          <MiniStat value={SCHOOLS.length} label="écoles" />
          <MiniStat value={regionsWithSchools.size} label="régions visitées" />
          <MiniStat value={SHOWS.length} label="étapes" />
        </div>
        <label className="relative block lg:w-[340px]">
          <span className="sr-only">Filtrer par région administrative</span>
          <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
          <select
            value={regionId}
            onChange={(e) => changeRegion(e.target.value)}
            className="h-12 w-full cursor-pointer appearance-none rounded-full border border-gold/40 bg-ink/70 pl-11 pr-11 text-[14px] font-bold text-white outline-none transition hover:border-gold focus:border-goldlight focus:ring-2 focus:ring-gold/30"
          >
            <option value="all">Toutes les régions</option>
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.code} — {r.name}
                {regionsWithSchools.has(r.id) ? '' : ' (aucune étape)'}
              </option>
            ))}
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-goldlight" />
        </label>
      </div>

      {/* ---------- Carte + calendrier */}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section className="card relative flex flex-col p-3 lg:p-5" aria-label="Carte de la tournée">
          <div className="mb-2 flex items-start justify-between gap-3 px-1">
            <div>
              <div className="eyebrow">Carte de la tournée</div>
              <div className="mt-1 text-[12.5px] text-white/55">Touchez une épingle dorée pour voir l’école et sa prochaine date.</div>
            </div>
            {regionId !== 'all' && (
              <button onClick={() => changeRegion('all')} className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-[11.5px] font-bold text-white/70 hover:border-gold/40 hover:text-goldlight">
                <RotateCcw size={12} /> Tout le Québec
              </button>
            )}
          </div>
          <QuebecMap schools={SCHOOLS} regionId={regionId} selectedId={pinId} onSelect={setPinId} />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-[10.5px] text-white/40">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_#F4D78C]" /> École participante (fictive)
            </span>
            <span>Carte schématique — tracé non cartographique</span>
          </div>
          <div className="mt-auto border-t border-white/[0.07] px-1 pt-4">
            <div className="mb-2.5 text-[10.5px] font-bold uppercase tracking-wider text-white/40">Écoles de la tournée</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SCHOOLS.map((s) => {
                const active = s.id === pinId
                const dim = regionId !== 'all' && s.regionId !== regionId
                return (
                  <button
                    key={s.id}
                    onClick={() => setPinId(active ? null : s.id)}
                    aria-pressed={active}
                    className={cx(
                      'flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition',
                      active ? 'border-gold/70 bg-gold/15' : 'border-white/[0.07] bg-white/[0.03] hover:border-gold/40',
                      dim && !active && 'opacity-40',
                    )}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.accent, boxShadow: `0 0 8px ${s.accent}` }} />
                    <span className="min-w-0">
                      <span className={cx('block truncate text-[12px] font-bold', active ? 'text-goldlight' : 'text-white/85')}>{s.shortName}</span>
                      <span className="block truncate text-[10.5px] text-white/45">{s.city}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <Calendar
          monthIdx={monthIdx}
          setMonthIdx={(i) => {
            setMonthIdx(i)
            setDay(null)
          }}
          byDate={byDate}
          day={day}
          setDay={setDay}
        />
      </div>

      {/* ---------- Liste des étapes */}
      <section className="mt-10">
        <SectionHeader
          eyebrow={region ? `Région ${region.code} · ${region.name}` : 'Toutes les régions'}
          title="Toutes les étapes de la tournée"
        />
        <p className="-mt-2 mb-5 text-[13px] text-white/55">
          {shows.length} étape{shows.length > 1 ? 's' : ''} · {nUpcoming} à venir ou en cours · dates fictives
        </p>

        {shows.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
            <Navigation className="text-gold" size={28} />
            <div className="font-display text-[26px] tracking-wide">Aucune étape dans cette région… pour l’instant</div>
            <p className="max-w-md text-[13.5px] text-white/60">
              La saison de démonstration ne compte pas encore d’école participante en {region?.name}. La tournée a vocation à rejoindre les 17 régions administratives.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Button size="sm" onClick={() => changeRegion('all')} icon={<RotateCcw size={14} />}>
                Voir toutes les régions
              </Button>
              <Button size="sm" variant="outline" to="/partenaires">
                Soutenir la tournée
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((g) => (
              <div key={g.key}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="font-display text-[22px] tracking-wider text-goldlight">{g.label}</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
                </div>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {g.items.map((s) => (
                    <EventRow key={s.id} show={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-[34px] leading-none text-gold-metal">{value}</span>
      <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">{label}</span>
    </div>
  )
}

function DateBlock({ date, className }: { date: string; className?: string }) {
  const { day, month } = fmtDay(date)
  return (
    <div className={cx('flex w-[58px] shrink-0 flex-col items-center justify-center rounded-xl border border-gold/40 bg-gradient-to-b from-gold/15 to-transparent py-2', className)}>
      <span className="font-display text-[30px] leading-none text-goldlight">{day}</span>
      <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-gold">{month}</span>
    </div>
  )
}

function EventRow({ show }: { show: Show }) {
  const school = schoolById(show.schoolId)
  const region = regionById(school.regionId)
  return (
    <article className="group flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-gradient-to-r from-night2/80 to-night/50 p-3 transition hover:border-gold/35 lg:gap-4 lg:p-4">
      <DateBlock date={show.date} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={show.status} />
          <CategoryTag category={show.category} className="hidden sm:inline-flex" />
        </div>
        <h3 className="mt-1.5 truncate text-[15px] font-extrabold leading-tight lg:text-[16px]">{show.title}</h3>
        <div className="mt-0.5 truncate text-[12.5px] font-semibold text-white/75">{school.name}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[11.5px] text-white/50">
          <span className="flex items-center gap-1">
            <MapPin size={11} className="text-gold" />
            {school.city} · {region?.name}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {show.time}
          </span>
        </div>
      </div>
      <Button to={`/spectacles/${show.id}`} size="sm" variant={show.status === 'replay' ? 'dark' : 'outline'} className="shrink-0 !px-3.5 lg:!px-4">
        Consulter
      </Button>
    </article>
  )
}

function Calendar({
  monthIdx,
  setMonthIdx,
  byDate,
  day,
  setDay,
}: {
  monthIdx: number
  setMonthIdx: (i: number) => void
  byDate: Map<string, Show[]>
  day: string | null
  setDay: (d: string | null) => void
}) {
  const { y, m } = MONTHS[monthIdx]
  const first = new Date(y, m, 1).getDay()
  const nDays = new Date(y, m + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: nDays }, (_, i) => i + 1)]
  while (cells.length % 7) cells.push(null)
  const monthCount = [...byDate.keys()].filter((k) => k.startsWith(iso(y, m, 1).slice(0, 7))).reduce((n, k) => n + byDate.get(k)!.length, 0)
  const dayShows = day ? byDate.get(day) ?? [] : []

  return (
    <section className="card flex flex-col p-4 lg:p-5" aria-label="Calendrier de la tournée">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setMonthIdx(monthIdx - 1)}
          disabled={monthIdx === 0}
          aria-label="Mois précédent"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/80 transition hover:border-gold/50 hover:text-goldlight disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <div className="font-display text-[28px] leading-none tracking-wider">
            {cap(monthName(m))} <span className="text-gold-metal">{y}</span>
          </div>
          <div className="mt-1 text-[11px] font-semibold text-white/45">
            {monthCount} spectacle{monthCount > 1 ? 's' : ''} ce mois-ci
          </div>
        </div>
        <button
          onClick={() => setMonthIdx(monthIdx + 1)}
          disabled={monthIdx === MONTHS.length - 1}
          aria-label="Mois suivant"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/80 transition hover:border-gold/50 hover:text-goldlight disabled:pointer-events-none disabled:opacity-25"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-2 flex justify-center gap-1.5">
        {MONTHS.map((mm, i) => (
          <button
            key={i}
            onClick={() => setMonthIdx(i)}
            aria-label={`${monthName(mm.m)} ${mm.y}`}
            className={cx('h-1.5 rounded-full transition-all', i === monthIdx ? 'w-6 bg-gold' : 'w-1.5 bg-white/20 hover:bg-white/40')}
          />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} className="pb-1 text-[10px] font-bold uppercase tracking-wider text-white/35">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />
          const key = iso(y, m, d)
          const ev = byDate.get(key)
          const sel = key === day
          const today = key === DEMO_TODAY
          return (
            <button
              key={i}
              onClick={() => setDay(sel ? null : key)}
              aria-pressed={sel}
              aria-label={`${d} ${monthName(m)}${ev ? `, ${ev.length} spectacle${ev.length > 1 ? 's' : ''}` : ''}`}
              className={cx(
                'relative flex aspect-square flex-col items-center justify-center rounded-xl text-[13px] font-bold transition',
                ev
                  ? sel
                    ? 'bg-gold-soft text-ink shadow-gold'
                    : 'border border-gold/50 bg-gold/15 text-goldlight shadow-[0_0_18px_-4px_rgba(214,172,85,.6)] hover:bg-gold/25'
                  : sel
                    ? 'border border-white/30 bg-white/10 text-white'
                    : 'text-white/55 hover:bg-white/[0.06] hover:text-white',
                today && !sel && 'ring-1 ring-stagelight ring-offset-1 ring-offset-night',
              )}
            >
              {d}
              {ev && (
                <span className="absolute bottom-1 flex gap-0.5">
                  {ev.slice(0, 3).map((s) => (
                    <span key={s.id} className={cx('h-1 w-1 rounded-full', sel ? 'bg-ink' : s.status === 'live' ? 'bg-live' : 'bg-goldlight')} />
                  ))}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-white/45">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded border border-gold/60 bg-gold/20" /> Spectacle
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded ring-1 ring-stagelight" /> Aujourd’hui (démo)
        </span>
      </div>

      <div className="mt-4 flex-1 border-t border-white/[0.07] pt-4">
        {!day ? (
          <div className="flex items-center gap-2 text-[12.5px] text-white/50">
            <CalendarDays size={15} className="text-gold" /> Sélectionnez une date en surbrillance pour voir ses spectacles.
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/45">{fmtDate(day, true)}</div>
            {dayShows.length === 0 ? (
              <div className="text-[12.5px] text-white/50">Aucun spectacle prévu ce jour-là.</div>
            ) : (
              <ul className="space-y-2">
                {dayShows.map((s) => {
                  const sc = schoolById(s.schoolId)
                  return (
                    <li key={s.id} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5">
                      <span className="h-9 w-1 shrink-0 rounded-full" style={{ background: `linear-gradient(${sc.accent}, ${sc.accent2})` }} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-extrabold">{s.title}</div>
                        <div className="truncate text-[11.5px] text-white/55">
                          {sc.city} · {s.time}
                        </div>
                      </div>
                      <Button to={`/spectacles/${s.id}`} size="sm" variant="ghost" className="!h-8 !px-3 text-gold" iconRight={<ChevronRight size={14} />}>
                        Voir
                      </Button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
