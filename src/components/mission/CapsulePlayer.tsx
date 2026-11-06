import { useEffect, useState } from 'react'
import { Captions, Pause, Play, RotateCcw, Volume2 } from 'lucide-react'
import type { Capsule, ThemeId } from '../../data'
import StageArt, { type Pose } from '../art/StageArt'
import { cx } from '../ui'
import Modal from './Modal'

export const poseForFormat = (c: Capsule): Pose =>
  c.format === 'Témoignage (démo)' ? 'none' : c.format === 'Conférence' ? 'slam' : c.format === 'Atelier' ? 'trio' : c.theme === 'estime' ? 'singer' : 'rap'

export const toSec = (d: string) => {
  const [m, s] = d.split(':').map(Number)
  return m * 60 + s
}
const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`

/** Sous-titres de démonstration — textes rédigés pour illustrer le format */
const CAPTIONS: Record<ThemeId, string[]> = {
  criminalite: [
    '« Une seule décision peut changer la suite de l’histoire. »',
    '« La pression du groupe, on la sent. Mais on peut dire non. »',
    '« Demander de l’aide, c’est déjà reprendre le contrôle. »',
  ],
  decrochage: [
    '« La scène m’a donné une raison de revenir le lendemain. »',
    '« Chaque parcours compte, même celui qui fait un détour. »',
    '« Rester, c’est se donner plus de choix pour plus tard. »',
  ],
  estime: [
    '« Le trac, c’est l’énergie qui dit que ça compte pour moi. »',
    '« Je n’ai pas besoin d’être parfait pour mériter ma place. »',
    '« Une voix qui tremble reste une voix qui porte. »',
  ],
  reinsertion: [
    '« On n’est jamais réduit à son pire moment. »',
    '« Il existe des ressources, et des gens prêts à aider. »',
    '« Changer de trajectoire, ça se fait un pas à la fois. »',
  ],
}

/** Lecteur de démonstration : progression simulée, aucune vidéo réelle */
export default function CapsulePlayer({ capsule, onClose }: { capsule: Capsule | null; onClose: () => void }) {
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [subs, setSubs] = useState(true)
  const total = capsule ? toSec(capsule.duration) : 1

  useEffect(() => {
    setT(0)
    setPlaying(true)
  }, [capsule?.id])

  useEffect(() => {
    if (!capsule || !playing) return
    // lecture accélérée : la capsule complète défile en ~24 s
    const step = total / 96
    const h = window.setInterval(() => {
      setT((x) => {
        const n = Math.min(total, x + step)
        if (n >= total) setPlaying(false)
        return n
      })
    }, 250)
    return () => window.clearInterval(h)
  }, [capsule, playing, total])

  if (!capsule) return null
  const pct = (t / total) * 100
  const ended = t >= total
  const lines = CAPTIONS[capsule.theme]
  const line = lines[Math.min(lines.length - 1, Math.floor((t / total) * lines.length))]

  return (
    <Modal open={!!capsule} onClose={onClose} wide>
      <div className="relative aspect-video w-full overflow-hidden bg-ink lg:rounded-t-3xl">
        <StageArt seed={`cap-${capsule.id}`} palette={capsule.palette} pose={poseForFormat(capsule)} crowd animated={playing} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-md bg-ink/70 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-goldlight backdrop-blur">Lecteur de démonstration</span>
          <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white/75 backdrop-blur">Aucune vidéo réelle</span>
        </div>
        <button onClick={() => (ended ? (setT(0), setPlaying(true)) : setPlaying((p) => !p))} className="absolute inset-0 grid place-items-center" aria-label={playing ? 'Pause' : 'Lecture'}>
          {(!playing || ended) && (
            <span className="grid h-20 w-20 animate-fadeIn place-items-center rounded-full border border-goldlight/60 bg-ink/50 shadow-gold backdrop-blur">
              {ended ? <RotateCcw size={30} className="text-goldlight" /> : <Play size={32} className="ml-1 fill-goldlight text-goldlight" />}
            </span>
          )}
        </button>
        {subs && !ended && t > 0 && (
          <div className="pointer-events-none absolute inset-x-6 bottom-16 text-center">
            <span className="inline rounded bg-ink/75 px-2 py-1 text-[13px] font-semibold leading-relaxed text-white box-decoration-clone lg:text-[15px]">{line}</span>
          </div>
        )}
        {ended && (
          <div className="pointer-events-none absolute inset-x-0 bottom-16 text-center text-[13px] font-bold text-goldlight">Fin de la capsule (démo) — touchez pour revoir</div>
        )}
        {/* contrôles */}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-4 pb-3">
          <button onClick={() => (ended ? (setT(0), setPlaying(true)) : setPlaying((p) => !p))} aria-label={playing ? 'Pause' : 'Lecture'} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-soft text-ink">
            {ended ? <RotateCcw size={16} /> : playing ? <Pause size={16} className="fill-ink" /> : <Play size={16} className="ml-0.5 fill-ink" />}
          </button>
          <span className="w-[86px] shrink-0 text-[11.5px] font-semibold tabular-nums text-white/80">
            {fmt(t)} / {capsule.duration}
          </span>
          <div
            className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/15"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              setT(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * total)
            }}
            role="slider"
            aria-label="Progression (simulée)"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={Math.round(t)}
          >
            <div className="absolute inset-y-0 left-0 rounded-full bg-gold-soft" style={{ width: `${pct}%` }} />
            <div className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-goldlight shadow-gold" style={{ left: `${pct}%` }} />
          </div>
          <button onClick={() => setSubs((s) => !s)} aria-pressed={subs} aria-label="Sous-titres" className={cx('hidden h-9 w-9 place-items-center rounded-full sm:grid', subs ? 'text-goldlight' : 'text-white/50')}>
            <Captions size={18} />
          </button>
          <Volume2 size={18} className="hidden text-white/50 sm:block" aria-hidden />
        </div>
      </div>
      <div className="p-5 lg:p-7">
        <div className="eyebrow">
          {capsule.format} · {capsule.duration}
        </div>
        <h2 className="mt-1.5 font-display text-[32px] leading-none tracking-wide lg:text-[40px]">{capsule.title}</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-white/70">{capsule.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] text-white/55">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-semibold">Intervenant : {capsule.speaker}</span>
          <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-semibold text-goldlight">Sous-titres de démonstration</span>
        </div>
        <p className="mt-4 text-[11.5px] leading-relaxed text-white/40">
          Prototype : la lecture est simulée et accélérée. Les répliques affichées sont rédigées pour illustrer le format et ne sont attribuées à aucune personne réelle.
        </p>
      </div>
    </Modal>
  )
}
