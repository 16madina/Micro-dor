import { useCallback, useEffect, useState } from 'react'
import { AudioLines, BookOpenText, Disc3, Mic2, Music2, Pause, Play, SkipBack, SkipForward, Sparkles } from 'lucide-react'
import { cx } from '../ui'
import { audioSupported, useLoop } from './audio'

export type TrackKind = 'beat' | 'instrumental' | 'texte' | 'atelier' | 'voix'

export interface DemoTrack {
  id: string
  title: string
  subtitle: string
  /** durée en secondes */
  duration: number
  kind: TrackKind
  bpm?: number
}

export const fmtTime = (s: number) => {
  const t = Math.max(0, Math.floor(s))
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

export const KIND_META: Record<TrackKind, { label: string; icon: typeof Music2; tint: string }> = {
  beat: { label: 'Beat', icon: Disc3, tint: 'text-[#ff9aae] bg-live/10 border-live/30' },
  instrumental: { label: 'Instrumental', icon: Music2, tint: 'text-goldlight bg-gold/10 border-gold/30' },
  texte: { label: 'Texte', icon: BookOpenText, tint: 'text-[#c9b6ff] bg-stage/15 border-stagelight/30' },
  atelier: { label: 'Atelier', icon: Sparkles, tint: 'text-[#7CF0C2] bg-[#7CF0C2]/10 border-[#7CF0C2]/25' },
  voix: { label: 'Voix guide', icon: Mic2, tint: 'text-white/80 bg-white/5 border-white/15' },
}

/** Lecteur de démonstration : progression simulée, vrai son seulement pour les « Beat » (Web Audio). */
export function useDemoPlayer(tracks: DemoTrack[], opts: { bpm?: number } = {}) {
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const current = tracks.find((t) => t.id === currentId) ?? null

  useEffect(() => {
    if (!playing || !current) return
    const t = window.setInterval(() => setPos((p) => p + 0.25), 250)
    return () => window.clearInterval(t)
  }, [playing, current])

  useEffect(() => {
    if (current && pos >= current.duration) {
      setPlaying(false)
      setPos(0)
    }
  }, [pos, current])

  const bpm = opts.bpm ?? current?.bpm ?? 90
  useLoop(playing && current?.kind === 'beat', 'beat', bpm)

  const select = useCallback(
    (id: string) => {
      if (id === currentId) {
        setPlaying((p) => !p)
        return
      }
      setCurrentId(id)
      setPos(0)
      setPlaying(true)
    },
    [currentId],
  )
  const toggle = useCallback(() => {
    if (!currentId && tracks[0]) {
      setCurrentId(tracks[0].id)
      setPos(0)
      setPlaying(true)
      return
    }
    setPlaying((p) => !p)
  }, [currentId, tracks])
  const step = useCallback(
    (d: number) => {
      if (!tracks.length) return
      const i = tracks.findIndex((t) => t.id === currentId)
      const n = tracks[(i + d + tracks.length) % tracks.length]
      setCurrentId(n.id)
      setPos(0)
      setPlaying(true)
    },
    [tracks, currentId],
  )
  const seek = useCallback((frac: number) => current && setPos(Math.max(0, Math.min(0.999, frac)) * current.duration), [current])
  const play = useCallback(() => {
    if (!currentId && tracks[0]) setCurrentId(tracks[0].id)
    setPlaying(true)
  }, [currentId, tracks])
  const pause = useCallback(() => setPlaying(false), [])

  return { current, currentId, playing, pos, select, toggle, step, seek, play, pause, bpm }
}
export type DemoPlayer = ReturnType<typeof useDemoPlayer>

/** Barres d’égaliseur animées */
export function EqBars({ active, bars = 5, className }: { active: boolean; bars?: number; className?: string }) {
  return (
    <span className={cx('inline-flex h-5 items-end gap-[3px]', className)} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={cx('block w-[3px] origin-bottom rounded-full bg-gold-soft', active ? 'animate-eq' : '')}
          style={{
            height: '100%',
            transform: active ? undefined : `scaleY(${0.2 + ((i * 37) % 5) / 14})`,
            animationDelay: `${-((i * 0.37) % 1)}s`,
            animationDuration: `${0.7 + ((i * 0.23) % 0.6)}s`,
          }}
        />
      ))}
    </span>
  )
}

export function TrackRow({ track, player, index }: { track: DemoTrack; player: DemoPlayer; index?: number }) {
  const active = player.currentId === track.id
  const isPlaying = active && player.playing
  const meta = KIND_META[track.kind]
  const Icon = meta.icon
  return (
    <button
      onClick={() => player.select(track.id)}
      className={cx(
        'group flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition',
        active ? 'border-gold/40 bg-gold/[0.07] shadow-gold' : 'border-white/[0.06] bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.05]',
      )}
    >
      <span
        className={cx(
          'grid h-11 w-11 shrink-0 place-items-center rounded-full border transition',
          active ? 'border-transparent bg-gold-soft text-ink' : 'border-gold/40 text-goldlight group-hover:bg-gold/10',
        )}
      >
        {isPlaying ? <Pause size={17} className="fill-current" /> : <Play size={17} className="ml-0.5 fill-current" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          {index !== undefined && <span className="w-4 text-[11px] font-bold tabular-nums text-white/30">{String(index + 1).padStart(2, '0')}</span>}
          <span className={cx('truncate text-[14px] font-bold', active ? 'text-goldlight' : 'text-white')}>{track.title}</span>
        </span>
        <span className="mt-0.5 flex items-center gap-2 text-[11.5px] text-white/50">
          <span className={cx('inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[10px] font-bold', meta.tint)}>
            <Icon size={10} />
            {meta.label}
          </span>
          <span className="truncate">{track.subtitle}</span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2.5">
        {active && <EqBars active={isPlaying} bars={4} className="h-4" />}
        <span className="text-[12.5px] font-semibold tabular-nums text-white/55">{fmtTime(track.duration)}</span>
      </span>
    </button>
  )
}

/** Barre « en cours de lecture » */
export function NowPlaying({ player, className, compact = false }: { player: DemoPlayer; className?: string; compact?: boolean }) {
  const { current, playing, pos } = player
  const frac = current ? pos / current.duration : 0
  const live = current?.kind === 'beat' && audioSupported()
  return (
    <div className={cx('card relative overflow-hidden p-4', className)}>
      <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-stage/30 blur-3xl" />
      <div className="relative flex items-center gap-3">
        <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-gold/30 bg-gradient-to-br from-stage/50 via-night2 to-ink">
          <Disc3 size={28} className={cx('text-goldlight', playing && 'animate-[spin_3s_linear_infinite]')} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="eyebrow !text-[10px]">{current ? (playing ? 'En lecture' : 'En pause') : 'Lecteur'}</div>
          <div className="truncate text-[15px] font-extrabold">{current ? current.title : 'Choisissez une piste'}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/45">
            <AudioLines size={12} className={live ? 'text-[#7CF0C2]' : 'text-white/35'} />
            {current ? (live ? `Son généré en direct · ${player.bpm} BPM` : 'Lecture en cours') : 'Aucune piste sélectionnée'}
          </div>
        </div>
        <EqBars active={playing} bars={compact ? 4 : 6} className={compact ? 'h-6' : 'h-8'} />
      </div>
      <div className="relative mt-3.5">
        <div
          role="slider"
          aria-label="Position de lecture"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(frac * 100)}
          tabIndex={0}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            player.seek((e.clientX - r.left) / r.width)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') player.seek(frac + 0.05)
            if (e.key === 'ArrowLeft') player.seek(frac - 0.05)
          }}
          className="group relative h-4 cursor-pointer"
        >
          <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/10" />
          <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gold-soft transition-[width] duration-200 ease-linear" style={{ width: `${frac * 100}%` }} />
          <div
            className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-goldlight shadow-[0_0_10px_#F4D78C] transition-[left] duration-200 ease-linear"
            style={{ left: `${frac * 100}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[11px] font-semibold tabular-nums text-white/45">
          <span>{fmtTime(pos)}</span>
          <span>{current ? fmtTime(current.duration) : '00:00'}</span>
        </div>
      </div>
      <div className="relative mt-1 flex items-center justify-center gap-5">
        <button aria-label="Piste précédente" onClick={() => player.step(-1)} className="grid h-10 w-10 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
          <SkipBack size={19} className="fill-current" />
        </button>
        <button
          aria-label={playing ? 'Pause' : 'Lecture'}
          onClick={player.toggle}
          className="grid h-14 w-14 place-items-center rounded-full bg-gold-soft text-ink shadow-gold transition hover:brightness-110 active:scale-95"
        >
          {playing ? <Pause size={24} className="fill-current" /> : <Play size={24} className="ml-1 fill-current" />}
        </button>
        <button aria-label="Piste suivante" onClick={() => player.step(1)} className="grid h-10 w-10 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
          <SkipForward size={19} className="fill-current" />
        </button>
      </div>
    </div>
  )
}
