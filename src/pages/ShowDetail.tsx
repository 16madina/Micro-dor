import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bell, CalendarDays, CalendarPlus, Hand, MapPin, Maximize, Pause, Play, Share2, Volume2, VolumeX } from 'lucide-react'
import { CATEGORY_LABEL, PHOTOS, SHOWS, fmtDate, schoolById, showById, talentById } from '../data'
import StageArt from '../components/art/StageArt'
import Portrait from '../components/art/Portrait'
import { ShowCard, poseFor } from '../components/cards'
import { Button, CategoryTag, StatusBadge, Tabs, cx } from '../components/ui'
import { useApp } from '../state/AppState'

const toSec = (d: string) => d.split(':').map(Number).reduce((a, n) => a * 60 + n, 0)
const fmtT = (s: number) => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  return (h ? h + ':' + String(m).padStart(2, '0') : String(m)) + ':' + String(sec).padStart(2, '0')
}

function Player({ showId, onIdx }: { showId: string; onIdx: (i: number) => void }) {
  const show = showById(showId)!
  const { toast } = useApp()
  const total = toSec(show.duration)
  const [playing, setPlaying] = useState(false)
  const [t, setT] = useState(show.status === 'live' ? Math.round(total * 0.28) : 0)
  const [muted, setMuted] = useState(false)
  const [hd, setHd] = useState(true)
  const [claps, setClaps] = useState<number[]>([])
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!playing) return
    const i = setInterval(() => setT((x) => (x + 1 >= total ? (setPlaying(false), total) : x + 1)), 1000)
    return () => clearInterval(i)
  }, [playing, total])

  const idx = Math.min(show.program.length - 1, Math.floor((t / total) * show.program.length))
  const current = show.program[idx]
  const curTalent = current.talentId ? talentById(current.talentId) : null
  useEffect(() => onIdx(idx), [idx, onIdx])

  if (show.status === 'upcoming')
    return (
      <div className="relative overflow-hidden rounded-none border-white/[0.08] bg-night lg:rounded-2xl lg:border">
        <div className="relative aspect-video">
          <StageArt seed={show.id} photo={PHOTOS.show(show.id)} palette={show.palette} pose={poseFor(show.category)} animated className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 grid place-items-center bg-ink/60 p-6 text-center backdrop-blur-[2px]">
            <div>
              <div className="eyebrow mb-2">Prochainement</div>
              <div className="font-display text-[34px] leading-none lg:text-[52px]">{fmtDate(show.date, true)}</div>
              <div className="mt-1 text-white/70">{show.time} · {show.venue}</div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button onClick={() => toast('Rappel activé (simulation) 🔔')} icon={<Bell size={16} />}>
                  Me rappeler
                </Button>
                <Button variant="dark" onClick={() => toast('Ajouté au calendrier (simulation)', 'info')} icon={<CalendarPlus size={16} />}>
                  Ajouter au calendrier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <div ref={box} className="group/p relative overflow-hidden bg-black lg:rounded-2xl lg:border lg:border-white/[0.08]">
      <div className="relative aspect-video">
        <StageArt
          key={idx}
          seed={show.id + idx}
          photo={curTalent ? PHOTOS.talent(curTalent.id) : PHOTOS.show(show.id)}
          palette={show.palette}
          pose={curTalent ? poseFor(curTalent.category) : 'trio'}
          animated={playing}
          className={cx('absolute inset-0 h-full w-full transition duration-700', !playing && 'brightness-75')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-md bg-live px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider">Démonstration</span>
          {show.status === 'live' && <StatusBadge status="live" />}
        </div>
        {playing && (
          <div className="absolute right-3 top-3 flex h-6 items-end gap-[3px]" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="w-1 origin-bottom animate-eq rounded-full bg-goldlight" style={{ height: '100%', animationDelay: `${i * 0.13}s`, animationDuration: `${0.7 + i * 0.12}s` }} />
            ))}
          </div>
        )}

        {/* en cours */}
        <div className="absolute bottom-16 left-4 right-4 lg:bottom-20 lg:left-6">
          <div className="text-[11px] font-bold uppercase tracking-widest text-gold">Sur scène</div>
          <div className="font-display text-[24px] leading-none lg:text-[34px]">{current.label}</div>
        </div>

        {!playing && (
          <button onClick={() => setPlaying(true)} aria-label="Lecture" className="absolute inset-0 grid place-items-center">
            <span className="grid h-20 w-20 place-items-center rounded-full border border-white/40 bg-ink/50 backdrop-blur transition hover:scale-110 hover:border-gold">
              <Play size={34} className="ml-1.5 fill-white" />
            </span>
          </button>
        )}

        {/* applaudissements */}
        {claps.map((c) => (
          <span key={c} className="pointer-events-none absolute bottom-16 animate-rise text-2xl" style={{ right: 24 + (c % 7) * 12 }}>
            👏
          </span>
        ))}

        {/* contrôles */}
        <div className="absolute inset-x-0 bottom-0 px-3 pb-2 lg:px-5 lg:pb-3">
          <input
            type="range"
            min={0}
            max={total}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            aria-label="Position"
            className="h-1 w-full cursor-pointer accent-[#D6AC55]"
          />
          <div className="mt-1 flex items-center gap-1 text-[12px] font-semibold">
            <button onClick={() => setPlaying((p) => !p)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10" aria-label={playing ? 'Pause' : 'Lecture'}>
              {playing ? <Pause size={18} className="fill-white" /> : <Play size={18} className="fill-white" />}
            </button>
            <button onClick={() => setMuted((m) => !m)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10" aria-label="Son">
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <span className="tabular-nums text-white/85">
              {fmtT(t)} / {show.duration}
            </span>
            <button
              onClick={() => {
                setClaps((c) => [...c, Date.now()].slice(-6))
                toast('👏 Applaudissement envoyé (simulation)', 'info')
              }}
              className="ml-auto flex h-8 items-center gap-1.5 rounded-full border border-white/20 px-3 hover:border-gold"
            >
              <Hand size={14} /> Applaudir
            </button>
            <button onClick={() => setHd((h) => !h)} className={cx('h-8 rounded px-2 text-[11px] font-extrabold', hd ? 'text-goldlight' : 'text-white/50')}>
              HD
            </button>
            <button
              onClick={() => (document.fullscreenElement ? document.exitFullscreen() : box.current?.requestFullscreen?.())}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10"
              aria-label="Plein écran"
            >
              <Maximize size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShowDetail() {
  const { id } = useParams()
  const show = showById(id ?? '')
  const [tab, setTab] = useState<'programme' | 'artistes' | 'apropos'>('programme')
  const { toast } = useApp()
  const [cur, setCur] = useState(0)

  if (!show)
    return (
      <div className="py-24 text-center">
        <p className="text-white/60">Ce spectacle n’existe pas dans la démonstration.</p>
        <Button to="/spectacles" className="mt-4">
          Voir les spectacles
        </Button>
      </div>
    )

  const school = schoolById(show.schoolId)
  const lineup = show.lineup.map(talentById)
  const nextUp = show.program.slice(cur + 1).filter((p) => p.talentId)
  const others = SHOWS.filter((s) => s.id !== show.id && (s.schoolId === show.schoolId || s.status === show.status)).slice(0, 3)

  return (
    <div>
      <div className="-mx-4 -mt-4 lg:mx-0 lg:mt-0">
        <Player key={show.id} showId={show.id} onIdx={setCur} />
      </div>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={show.status} />
            <CategoryTag category={show.category} />
          </div>
          <h1 className="font-display text-[40px] leading-[0.92] tracking-wide lg:text-[56px]">{show.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-white/65">
            <Link to={`/ecoles/${school.id}`} className="font-bold text-gold hover:text-goldlight">
              {school.name}
            </Link>
            <span className="flex items-center gap-1">
              <MapPin size={13} /> {school.city}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays size={13} /> {fmtDate(show.date, true)} · {show.time}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="dark"
              size="sm"
              icon={<Share2 size={14} />}
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href).catch(() => {})
                toast('Lien copié (prototype)', 'info')
              }}
            >
              Partager
            </Button>
            <Button variant="dark" size="sm" to="/votes">
              Soutenir les artistes
            </Button>
          </div>

          <Tabs
            className="mt-6"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: 'programme', label: 'Programme' },
              { value: 'artistes', label: 'Artistes' },
              { value: 'apropos', label: 'À propos' },
            ]}
          />
          <div key={tab} className="animate-fadeUp pt-4">
            {tab === 'programme' && (
              <ol className="space-y-1.5">
                {show.program.map((p, i) => {
                  const active = show.status !== 'upcoming' && i === cur
                  const t = p.talentId ? talentById(p.talentId) : null
                  const inner = (
                    <>
                      <span className="w-16 shrink-0 text-[12px] font-bold tabular-nums text-white/45">{p.time}</span>
                      <span className={cx('flex-1 text-[14px] font-semibold', active && 'text-goldlight')}>{p.label}</span>
                      {active && <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold">En cours</span>}
                      {t && !active && <span className="text-[11px] text-white/40">{CATEGORY_LABEL[t.category]}</span>}
                    </>
                  )
                  const cls = cx(
                    'flex items-center gap-3 rounded-xl border px-3 py-3 transition',
                    active ? 'border-gold/50 bg-gold/10' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20',
                  )
                  return t ? (
                    <li key={i}>
                      <Link to={`/talents/${t.id}`} className={cls}>
                        {inner}
                      </Link>
                    </li>
                  ) : (
                    <li key={i} className={cls}>
                      {inner}
                    </li>
                  )
                })}
              </ol>
            )}
            {tab === 'artistes' && (
              <div className="grid gap-3 sm:grid-cols-2">
                {lineup.map((t) => (
                  <Link key={t.id} to={`/talents/${t.id}`} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-night/70 p-2.5 transition hover:border-gold/40">
                    <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl">
                      <Portrait look={t.look} category={t.category} seed={t.id} className="h-full w-full" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-[22px] leading-none">{t.name}</div>
                      <div className="text-[12px] font-bold text-gold">{CATEGORY_LABEL[t.category]}</div>
                      <div className="truncate text-[11.5px] text-white/50">{schoolById(t.schoolId).name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {tab === 'apropos' && (
              <div className="space-y-4 text-[14.5px] leading-relaxed text-white/75">
                <p>{show.description}</p>
                <p className="text-white/55">
                  Lieu : {show.venue}, {school.city}. Durée : {show.duration}.
                </p>
                <div className="rounded-xl border border-gold/25 bg-gold/[0.06] p-4 text-[12.5px] text-white/65">
                  <b className="text-goldlight">Spectacle de démonstration.</b> Ce spectacle, ses artistes et ses dates sont fictifs. Aucun événement réel n’est
                  diffusé dans ce prototype ; le lecteur utilise des visuels de substitution.
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-white/[0.07] bg-night/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-[24px] leading-none tracking-wide">Prochains passages</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Démo</span>
            </div>
            {(show.status === 'upcoming' ? show.program.filter((p) => p.talentId) : nextUp).slice(0, 4).map((p, i) => {
              const t = talentById(p.talentId!)
              return (
                <Link key={i} to={`/talents/${t.id}`} className="flex items-center gap-3 border-t border-white/[0.06] py-2.5 first:border-0">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-gold/40">
                    <Portrait look={t.look} category={t.category} seed={t.id} className="h-full w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold">{t.name}</div>
                    <div className="truncate text-[11.5px] text-white/50">{p.label.split('— ')[1] ?? CATEGORY_LABEL[t.category]}</div>
                  </div>
                  <span className="text-[11.5px] font-bold text-gold">{p.time}</span>
                </Link>
              )
            })}
            {show.status !== 'upcoming' && nextUp.length === 0 && <p className="text-[13px] text-white/50">Tous les artistes sont passés. Merci !</p>}
          </div>
          <div>
            <h3 className="mb-3 text-[13px] font-extrabold uppercase tracking-widest text-white/50">À voir aussi</h3>
            <div className="space-y-3">
              {others.map((s) => (
                <ShowCard key={s.id} show={s} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
