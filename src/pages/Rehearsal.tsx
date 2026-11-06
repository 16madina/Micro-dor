import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  Circle,
  Gauge,
  Headphones,
  ListMusic,
  Mic,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ScrollText,
  Square,
  Star,
  Trash2,
  Type,
} from 'lucide-react'
import { useApp } from '../state/AppState'
import { Button, cx } from '../components/ui'
import { BlockTitle, Toggle } from '../components/spaces/SpaceUI'
import { EqBars, NowPlaying, TrackRow, fmtTime, useDemoPlayer } from '../components/spaces/player'
import { SLAM_TEXT, STUDIO_TRACKS } from '../components/spaces/tracks'
import { useLoop } from '../components/spaces/audio'
import StudioArt from '../components/spaces/StudioArt'

interface Take {
  id: number
  n: number
  duration: number
  track: string
  fav: boolean
}

const MAX_TAKE = 180

function Teleprompter({ frac, playing, onRestart, onGuided, guidedActive }: { frac: number; playing: boolean; onRestart: () => void; onGuided: () => void; guidedActive: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  const refs = useRef<(HTMLParagraphElement | null)[]>([])
  const [size, setSize] = useState(1)
  const content = useMemo(() => SLAM_TEXT.map((l, i) => (l ? i : -1)).filter((i) => i > 0), [])
  const active = frac > 0 ? content[Math.min(content.length - 1, Math.floor(frac * content.length))] : -1

  useEffect(() => {
    const c = box.current
    if (!c) return
    if (active < 0) {
      c.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const el = refs.current[active]
    if (el) c.scrollTo({ top: el.offsetTop - c.clientHeight * 0.38, behavior: 'smooth' })
  }, [active])

  const sizes = ['text-[17px] lg:text-[19px]', 'text-[20px] lg:text-[23px]', 'text-[24px] lg:text-[28px]']
  return (
    <section className="card relative overflow-hidden p-4 lg:p-5">
      <BlockTitle
        icon={ScrollText}
        aside={
          <div className="flex items-center gap-1">
            <button aria-label="Réduire le texte" onClick={() => setSize((s) => Math.max(0, s - 1))} disabled={size === 0} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/70 transition hover:text-white disabled:opacity-30">
              <Type size={12} />
            </button>
            <button aria-label="Agrandir le texte" onClick={() => setSize((s) => Math.min(2, s + 1))} disabled={size === 2} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/70 transition hover:text-white disabled:opacity-30">
              <Type size={17} />
            </button>
            <button aria-label="Revenir au début" title="Revenir au début" onClick={onRestart} className="grid h-8 w-8 place-items-center rounded-full border border-white/10 text-white/70 transition hover:text-white">
              <RotateCcw size={14} />
            </button>
          </div>
        }
      >
        Téléprompteur
      </BlockTitle>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-white/50">
        <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold', playing ? 'bg-live/15 text-[#ff9aae]' : 'bg-white/[0.05] text-white/55')}>
          <span className={cx('h-1.5 w-1.5 rounded-full', playing ? 'animate-pulseLive bg-live' : 'bg-white/40')} />
          {playing ? 'Défilement automatique' : 'En attente de lecture'}
        </span>
        <span>« Encore debout » — texte original</span>
      </div>
      <div className="relative rounded-2xl border border-white/[0.06] bg-ink/60">
        <div
          ref={box}
          className="no-scrollbar relative h-[300px] overflow-y-auto px-5 lg:h-[380px] lg:px-8"
          style={{ maskImage: 'linear-gradient(transparent, #000 22%, #000 70%, transparent)', WebkitMaskImage: 'linear-gradient(transparent, #000 22%, #000 70%, transparent)' }}
        >
          <div className="py-[120px] lg:py-[150px]">
            {SLAM_TEXT.map((line, i) =>
              line ? (
                <p
                  key={i}
                  ref={(el) => {
                    refs.current[i] = el
                  }}
                  className={cx(
                    'py-1 font-bold leading-snug transition-all duration-500',
                    sizes[size],
                    i === 0 && 'font-display !text-[34px] font-normal tracking-wide text-gold-metal lg:!text-[44px]',
                    i !== 0 && (i === active ? 'translate-x-1 text-goldlight [text-shadow:0_0_24px_rgba(244,215,140,.45)]' : active >= 0 && i < active ? 'text-white/25' : 'text-white/60'),
                  )}
                >
                  {i === active && i !== 0 && <span className="mr-2 inline-block h-2 w-2 -translate-y-1 rounded-full bg-gold align-middle shadow-[0_0_8px_#F4D78C]" />}
                  {line}
                </p>
              ) : (
                <div key={i} className="h-5" />
              ),
            )}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-4 top-[38%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>
      {!guidedActive && (
        <Button size="sm" variant="outline" onClick={onGuided} className="mt-3 w-full sm:w-auto" icon={<Play size={14} className="fill-current" />}>
          Lancer la lecture guidée du slam
        </Button>
      )}
    </section>
  )
}

function TempoCard({ bpm, setBpm, metronome, setMetronome, pulsing }: { bpm: number; setBpm: (n: number) => void; metronome: boolean; setMetronome: (v: boolean) => void; pulsing: boolean }) {
  const [beat, setBeat] = useState(0)
  useEffect(() => {
    if (!pulsing) {
      setBeat(0)
      return
    }
    const t = window.setInterval(() => setBeat((b) => (b + 1) % 4), 60000 / bpm)
    return () => window.clearInterval(t)
  }, [pulsing, bpm])
  const clamp = (n: number) => Math.max(60, Math.min(140, n))
  return (
    <section className="card p-4 lg:p-5">
      <BlockTitle icon={Gauge}>Tempo et métronome</BlockTitle>
      <div className="flex items-center justify-between gap-3">
        <button aria-label="Ralentir" onClick={() => setBpm(clamp(bpm - 2))} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-gold/40 hover:text-white active:scale-95">
          <Minus size={18} />
        </button>
        <div className="text-center">
          <div className="font-display text-[56px] leading-none tracking-wide text-gold-metal tabular-nums">{bpm}</div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">BPM</div>
        </div>
        <button aria-label="Accélérer" onClick={() => setBpm(clamp(bpm + 2))} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-gold/40 hover:text-white active:scale-95">
          <Plus size={18} />
        </button>
      </div>
      <input
        type="range"
        min={60}
        max={140}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        aria-label="Tempo"
        className="mt-4 w-full accent-[#D6AC55]"
      />
      <div className="mt-3 flex justify-center gap-2.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cx(
              'h-3 w-3 rounded-full transition-all duration-100',
              pulsing && beat === i ? (i === 0 ? 'scale-125 bg-goldlight shadow-[0_0_12px_#F4D78C]' : 'scale-110 bg-stagelight shadow-[0_0_10px_#9B6BE8]') : 'bg-white/10',
            )}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { v: 78, l: 'Lent' },
          { v: 90, l: 'Boom bap' },
          { v: 100, l: 'Énergique' },
        ].map((p) => (
          <button
            key={p.v}
            onClick={() => setBpm(p.v)}
            className={cx(
              'h-8 flex-1 rounded-full px-3 text-[12px] font-bold transition',
              bpm === p.v ? 'bg-gold-soft text-ink' : 'border border-white/10 bg-white/[0.04] text-white/70 hover:text-white',
            )}
          >
            {p.l} · {p.v}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
        <div>
          <div className="text-[13.5px] font-bold">Métronome</div>
          <div className="text-[11.5px] text-white/45">Clic sonore généré dans le navigateur</div>
        </div>
        <Toggle checked={metronome} onChange={setMetronome} label="Métronome" />
      </div>
      <p className="mt-2.5 text-[11px] text-white/40">Le tempo s’applique aux pistes « Beat » et au métronome.</p>
    </section>
  )
}

export default function Rehearsal() {
  const { toast } = useApp()
  const [bpm, setBpm] = useState(90)
  const player = useDemoPlayer(STUDIO_TRACKS, { bpm })
  const [metronome, setMetronome] = useState(false)
  useLoop(metronome, 'click', bpm)

  // le tempo suit la piste Beat choisie
  const currentTrack = player.current
  useEffect(() => {
    if (currentTrack?.bpm) setBpm(currentTrack.bpm)
  }, [currentTrack])

  // ---- prise simulée
  const [rec, setRec] = useState<'idle' | 'countdown' | 'recording'>('idle')
  const [count, setCount] = useState(3)
  const [elapsed, setElapsed] = useState(0)
  const [takes, setTakes] = useState<Take[]>([])
  const [listening, setListening] = useState<number | null>(null)
  const takeN = useRef(0)

  useEffect(() => {
    if (rec !== 'countdown') return
    if (count === 0) {
      setRec('recording')
      setElapsed(0)
      player.play()
      return
    }
    const t = window.setTimeout(() => setCount((c) => c - 1), 750)
    return () => window.clearTimeout(t)
  }, [rec, count]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (rec !== 'recording') return
    const t = window.setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => window.clearInterval(t)
  }, [rec])

  const stopTake = () => {
    if (rec === 'countdown') {
      setRec('idle')
      return
    }
    const n = ++takeN.current
    const d = Math.max(1, elapsed)
    setTakes((t) => [{ id: Date.now(), n, duration: d, track: player.current?.title ?? 'A cappella', fav: false }, ...t])
    setRec('idle')
    player.pause()
    toast(`Prise ${n} ajoutée`, 'info')
  }

  useEffect(() => {
    if (rec === 'recording' && elapsed >= MAX_TAKE) stopTake()
  }, [elapsed]) // eslint-disable-line react-hooks/exhaustive-deps

  const startTake = () => {
    setCount(3)
    setRec('countdown')
  }

  const frac = player.current ? player.pos / player.current.duration : 0
  const guidedActive = player.currentId === 'st-slam' && player.playing

  return (
    <div className="space-y-6 lg:space-y-8">
      <Button variant="ghost" size="sm" to="/eleve" icon={<ChevronLeft size={16} />} className="-ml-3">
        Mon espace élève
      </Button>

      {/* En-tête studio */}
      <div className="relative -mt-3 animate-fadeUp overflow-hidden rounded-3xl border border-white/[0.08] shadow-stage">
        <div className="relative aspect-[4/3] sm:aspect-[16/8] lg:aspect-[21/8]">
          <StudioArt recording={rec === 'recording'} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
          {rec === 'recording' && (
            <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-live px-3 py-1.5 text-[12px] font-extrabold tabular-nums shadow-[0_0_24px_rgba(229,56,79,.6)]">
              <span className="h-2 w-2 animate-pulseLive rounded-full bg-white" />
              REC {fmtTime(elapsed)}
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 p-5 lg:p-8">
            <h1 className="font-display text-[40px] leading-[0.92] tracking-wide lg:text-[64px]">
              Salle de répétition virtuelle
            </h1>
            <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-white/65 lg:text-[15px]">
              Choisis une piste, cale ton tempo, suis ton texte au téléprompteur et enregistre une prise comme en studio.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        <div className="min-w-0 space-y-6">
          {/* Pistes */}
          <section>
            <BlockTitle icon={ListMusic} aside={<span className="text-[11px] font-semibold text-white/40">{STUDIO_TRACKS.length} pistes</span>}>
              Pistes de répétition
            </BlockTitle>
            <div className="space-y-2">
              {STUDIO_TRACKS.map((t, i) => (
                <TrackRow key={t.id} track={t} player={player} index={i} />
              ))}
            </div>
          </section>

          <NowPlaying player={player} className="lg:hidden" />

          <Teleprompter
            frac={frac}
            playing={player.playing}
            guidedActive={guidedActive}
            onRestart={() => player.seek(0)}
            onGuided={() => player.select('st-slam')}
          />
        </div>

        <aside className="min-w-0 space-y-6">
          <NowPlaying player={player} className="hidden lg:block" />

          {/* Prise simulée */}
          <section className={cx('card relative overflow-hidden p-4 transition lg:p-5', rec !== 'idle' && 'border-live/40 shadow-[0_0_40px_-10px_rgba(229,56,79,.5)]')}>
            <BlockTitle icon={Mic}>Enregistrer une prise</BlockTitle>
            <div className="flex items-center gap-4">
              <button
                onClick={rec === 'idle' ? startTake : stopTake}
                aria-label={rec === 'idle' ? 'Enregistrer une prise' : 'Arrêter la prise'}
                className={cx(
                  'relative grid h-20 w-20 shrink-0 place-items-center rounded-full border-4 transition active:scale-95',
                  rec === 'idle' ? 'border-white/15 bg-live/90 hover:bg-live' : 'border-live/60 bg-ink',
                )}
              >
                {rec !== 'idle' && <span className="absolute inset-0 animate-ping rounded-full border-2 border-live/50" />}
                {rec === 'idle' ? (
                  <Circle size={26} className="fill-white text-white" />
                ) : rec === 'countdown' ? (
                  <span className="font-display text-[38px] leading-none text-white">{count || '●'}</span>
                ) : (
                  <Square size={24} className="fill-live text-live" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[40px] leading-none tracking-wide tabular-nums">{fmtTime(rec === 'recording' ? elapsed : 0)}</div>
                <div className="mt-1 text-[12px] text-white/50">
                  {rec === 'idle' ? 'Prêt — appuie pour lancer une prise' : rec === 'countdown' ? 'Décompte…' : 'Prise en cours'}
                </div>
                <div className="mt-2 flex h-6 items-end gap-[3px]" aria-hidden="true">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span
                      key={i}
                      className={cx('block w-[4px] origin-bottom rounded-full', rec === 'recording' ? 'animate-eq' : '', i > 13 ? 'bg-live' : i > 9 ? 'bg-goldlight' : 'bg-[#7CF0C2]')}
                      style={{
                        height: '100%',
                        opacity: rec === 'recording' ? 0.9 : 0.15,
                        transform: rec === 'recording' ? undefined : 'scaleY(.2)',
                        animationDelay: `${-((i * 0.29) % 1)}s`,
                        animationDuration: `${0.45 + ((i * 0.17) % 0.5)}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {rec === 'idle' ? (
              <Button className="mt-4 w-full" icon={<Circle size={14} className="fill-current" />} onClick={startTake}>
                Enregistrer une prise
              </Button>
            ) : (
              <Button className="mt-4 w-full" variant="dark" icon={<Square size={14} className="fill-current" />} onClick={stopTake}>
                {rec === 'countdown' ? 'Annuler' : 'Arrêter la prise'}
              </Button>
            )}

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12px] font-bold uppercase tracking-wider text-white/50">Mes prises</span>
                {takes.length > 0 && <span className="text-[11px] text-white/35">{takes.length} cette séance</span>}
              </div>
              {takes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 px-4 py-5 text-center text-[12.5px] text-white/45">
                  Aucune prise pour l’instant. Lance un beat, puis appuie sur le bouton rouge.
                </div>
              ) : (
                <ul className="space-y-2">
                  {takes.map((t) => {
                    const on = listening === t.id
                    return (
                      <li key={t.id} className={cx('flex animate-fadeUp items-center gap-3 rounded-2xl border p-2.5', on ? 'border-gold/40 bg-gold/[0.06]' : 'border-white/[0.07] bg-white/[0.03]')}>
                        <button
                          aria-label={on ? 'Arrêter la réécoute' : 'Réécouter la prise'}
                          onClick={() => {
                            setListening(on ? null : t.id)
                            if (!on) toast('Réécoute de la prise', 'info')
                          }}
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-soft text-ink"
                        >
                          {on ? <Pause size={15} className="fill-current" /> : <Play size={15} className="ml-0.5 fill-current" />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13.5px] font-bold">Prise {t.n}</div>
                          <div className="truncate text-[11.5px] text-white/45">
                            {fmtTime(t.duration)} · {t.track}
                          </div>
                        </div>
                        {on && <EqBars active bars={4} className="h-4" />}
                        <button
                          aria-label={t.fav ? 'Retirer des favorites' : 'Marquer comme favorite'}
                          onClick={() => setTakes((all) => all.map((x) => (x.id === t.id ? { ...x, fav: !x.fav } : x)))}
                          className={cx('grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/10', t.fav ? 'text-gold' : 'text-white/40')}
                        >
                          <Star size={15} className={t.fav ? 'fill-gold' : ''} />
                        </button>
                        <button
                          aria-label="Retirer la prise"
                          onClick={() => {
                            setTakes((all) => all.filter((x) => x.id !== t.id))
                            if (on) setListening(null)
                          }}
                          className="grid h-8 w-8 place-items-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
                        >
                          <Trash2 size={15} />
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>

          <TempoCard bpm={bpm} setBpm={setBpm} metronome={metronome} setMetronome={setMetronome} pulsing={metronome || (player.playing && player.current?.kind === 'beat')} />

          <div className="card flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-goldlight">
              <Headphones size={18} />
            </span>
            <p className="flex-1 text-[12px] leading-relaxed text-white/55">Conseil : utilise des écouteurs pour entendre le beat et le métronome sans résonance.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
