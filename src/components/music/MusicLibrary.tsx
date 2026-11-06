import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  AudioLines,
  Check,
  Download,
  Drama,
  Feather,
  Footprints,
  Headphones,
  ListMusic,
  Lock,
  Mic,
  Pause,
  Play,
  Search,
  Upload,
  X,
  type LucideIcon,
} from 'lucide-react'
import { CATEGORY_LABEL, type Category } from '../../data'
import { MUSIC, fmtDuration, type MusicTrack } from '../../data/music'
import { hashStr, mulberry32 } from '../art/palettes'
import { useApp } from '../../state/AppState'
import { Button, CategoryTag, Chips, cx } from '../ui'
import { musicEngine, synthSupported } from './engine'

const ICON: Record<Category, LucideIcon> = { chant: Mic, rap: AudioLines, slam: Feather, danse: Footprints, theatre: Drama }

type Filter = 'tous' | Category | 'selection'

/** Durée de l’extrait d’écoute (secondes) */
export const PREVIEW = 60
const previewLen = (t: MusicTrack) => (t.duration > 0 ? Math.min(PREVIEW, t.duration) : PREVIEW)

export function TrackCover({ track, className = '', playing = false }: { track: MusicTrack; className?: string; playing?: boolean }) {
  const bars = useMemo(() => {
    const r = mulberry32(hashStr(track.id))
    return Array.from({ length: 14 }, () => 0.25 + r() * 0.75)
  }, [track.id])
  const Icon = ICON[track.discipline]
  return (
    <div
      className={cx('relative overflow-hidden rounded-xl', className)}
      style={{ background: `linear-gradient(135deg, ${track.color[0]}, ${track.color[1]} 70%, #08090E)` }}
    >
      <div className="absolute inset-x-[12%] bottom-[18%] top-[38%] flex items-end gap-[6%]">
        {bars.map((h, i) => (
          <span
            key={i}
            className={cx('flex-1 origin-bottom rounded-full bg-white/70', playing && 'animate-eq')}
            style={{ height: `${h * 100}%`, animationDelay: `${i * 0.07}s`, animationDuration: `${0.6 + (i % 4) * 0.15}s` }}
          />
        ))}
      </div>
      <Icon className="absolute left-[12%] top-[12%] h-[22%] w-[22%] text-white/90" strokeWidth={2.2} />
    </div>
  )
}

/** Bibliothèque « Nos musiques » : écouter, choisir pour sa prestation, télécharger. */
export default function MusicLibrary({ embedded = false }: { embedded?: boolean }) {
  const { myTracks, toggleTrack, uploads, toast, isOrganizer } = useApp()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const [filter, setFilter] = useState<Filter>('tous')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'recent' | 'az' | 'bpm'>('recent')
  const [playing, setPlaying] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [dl, setDl] = useState<Record<string, number>>({})
  const [uploadOpen, setUploadOpen] = useState(() => isOrganizer && params.get('ajouter') === '1')
  const audio = useRef<HTMLAudioElement | null>(null)
  const started = useRef(0)

  const all = useMemo(() => [...uploads, ...MUSIC], [uploads])
  const current = all.find((t) => t.id === playing) ?? null

  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    const out = all.filter((t) => {
      if (filter === 'selection' && !myTracks.includes(t.id)) return false
      if (filter !== 'tous' && filter !== 'selection' && t.discipline !== filter) return false
      return !n || (t.title + t.style + t.mood.join(' ')).toLowerCase().includes(n)
    })
    if (sort === 'az') out.sort((a, b) => a.title.localeCompare(b.title, 'fr'))
    else if (sort === 'bpm') out.sort((a, b) => (a.synth?.bpm ?? 0) - (b.synth?.bpm ?? 0))
    else out.sort((a, b) => b.addedOn.localeCompare(a.addedOn))
    return out
  }, [all, filter, q, sort, myTracks])

  const halt = () => {
    musicEngine().stop()
    audio.current?.pause()
  }

  const closePlayer = () => {
    halt()
    setIsPlaying(false)
    setPlaying(null)
  }

  const start = (t: MusicTrack, from: number) => {
    halt()
    if (t.url) {
      const a = audio.current ?? new Audio()
      if (a.src !== t.url) a.src = t.url
      a.currentTime = from
      a.onended = () => setIsPlaying(false)
      a.play().catch(() => toast('Lecture impossible pour ce fichier', 'info'))
      audio.current = a
    } else if (t.synth) {
      if (!synthSupported() || !musicEngine().play(t.synth)) {
        toast('Le son n’est pas disponible sur cet appareil', 'info')
        return
      }
    }
    started.current = performance.now() - from * 1000
    setIsPlaying(true)
  }

  /** Ouvre le lecteur et lance l’extrait ; un second clic met en pause / reprend */
  const play = (t: MusicTrack) => {
    if (playing === t.id) return toggle()
    setPlaying(t.id)
    setElapsed(0)
    start(t, 0)
  }

  const toggle = () => {
    if (!current) return
    if (isPlaying) {
      halt()
      setIsPlaying(false)
    } else {
      const from = elapsed >= previewLen(current) - 0.3 ? 0 : elapsed
      setElapsed(from)
      start(current, from)
    }
  }

  const seek = (ratio: number) => {
    if (!current) return
    const from = Math.max(0, Math.min(previewLen(current) - 1, ratio * previewLen(current)))
    setElapsed(from)
    if (isPlaying) start(current, from)
  }

  useEffect(() => {
    if (!current || !isPlaying) return
    const i = window.setInterval(() => {
      const e = current.url && audio.current ? audio.current.currentTime : (performance.now() - started.current) / 1000
      if (e >= previewLen(current)) {
        halt()
        setElapsed(previewLen(current))
        setIsPlaying(false)
      } else setElapsed(e)
    }, 200)
    return () => window.clearInterval(i)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, isPlaying])

  useEffect(() => () => {
    musicEngine().stop()
    audio.current?.pause()
  }, [])

  const download = (t: MusicTrack) => {
    if (dl[t.id] !== undefined) return
    setDl((d) => ({ ...d, [t.id]: 0 }))
    let p = 0
    const i = window.setInterval(() => {
      p += 0.12 + Math.random() * 0.1
      if (p >= 1) {
        window.clearInterval(i)
        setDl((d) => ({ ...d, [t.id]: 1 }))
        toast(`Téléchargement simulé : « ${t.title} » (MP3)`)
      } else setDl((d) => ({ ...d, [t.id]: p }))
    }, 160)
  }

  const choose = (t: MusicTrack) => {
    const had = myTracks.includes(t.id)
    toggleTrack(t.id)
    toast(had ? `« ${t.title} » retirée de ta sélection` : `« ${t.title} » ajoutée à ta sélection pour ta prestation`, had ? 'info' : 'gold')
  }

  const chips: { value: Filter; label: string }[] = [
    { value: 'tous', label: 'Toutes' },
    ...(['chant', 'rap', 'slam', 'danse', 'theatre'] as Category[]).map((c) => ({ value: c as Filter, label: CATEGORY_LABEL[c] })),
    { value: 'selection', label: `Ma sélection (${myTracks.length})` },
  ]

  return (
    <div className={cx(current && 'pb-44')}>
      {/* barre d’outils */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 lg:w-80">
          <Search size={16} className="text-white/40" />
          <input
            id="music-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Titre, style, ambiance…"
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-white/35"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            id="music-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="h-10 rounded-full border border-white/10 bg-night px-4 text-[13px] font-semibold text-white/80 outline-none"
            aria-label="Trier"
          >
            <option value="recent">Plus récentes</option>
            <option value="az">A → Z</option>
            <option value="bpm">Tempo (BPM)</option>
          </select>
          {isOrganizer ? (
            <Button size="sm" variant="outline" icon={<Upload size={15} />} onClick={() => setUploadOpen(true)}>
              Ajouter une musique
            </Button>
          ) : (
            <Button
              size="sm"
              variant="dark"
              icon={<Lock size={14} />}
              title="Réservé aux organisateurs"
              onClick={() => {
                toast('L’ajout de musiques est réservé aux organisateurs', 'info')
                nav('/connexion?suite=' + encodeURIComponent(embedded ? '/boutique?onglet=musiques' : '/musiques'))
              }}
            >
              Ajouter (organisateurs)
            </Button>
          )}
        </div>
      </div>
      <Chips options={chips} value={filter} onChange={setFilter} className="mb-5" />

      {/* liste */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-night/60">
        <div className="hidden grid-cols-[56px_minmax(0,1.6fr)_minmax(0,1fr)_70px_70px_auto] items-center gap-4 border-b border-white/[0.06] px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-widest text-white/40 lg:grid">
          <span />
          <span>Titre</span>
          <span>Discipline</span>
          <span>Tempo</span>
          <span>Durée</span>
          <span className="text-right">Actions</span>
        </div>
        {list.map((t) => {
          const loaded = playing === t.id
          const rowPlaying = loaded && isPlaying
          const chosen = myTracks.includes(t.id)
          const d = dl[t.id]
          return (
            <div
              key={t.id}
              className={cx(
                'grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 border-b border-white/[0.05] px-3 py-3 transition last:border-0 lg:grid-cols-[56px_minmax(0,1.6fr)_minmax(0,1fr)_70px_70px_auto] lg:gap-4 lg:px-4',
                loaded ? 'bg-gold/[0.07]' : 'hover:bg-white/[0.03]',
              )}
            >
              <button onClick={() => play(t)} className="group relative h-14 w-14" aria-label={rowPlaying ? `Mettre en pause ${t.title}` : `Écouter un extrait de ${t.title}`}>
                <TrackCover track={t} playing={rowPlaying} className="h-14 w-14" />
                <span className={cx('absolute inset-0 grid place-items-center rounded-xl bg-ink/45 transition', loaded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
                  {rowPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="ml-0.5 fill-white" />}
                </span>
              </button>
              <button type="button" onClick={() => play(t)} className="min-w-0 text-left" title="Écouter un extrait d’une minute">
                <div className="flex items-center gap-2">
                  <span className={cx('truncate text-[15px] font-extrabold', loaded && 'text-goldlight')}>{t.title}</span>
                  {t.uploaded && <span className="shrink-0 rounded bg-stage px-1.5 py-0.5 text-[9.5px] font-extrabold uppercase text-white">Nouveau</span>}
                </div>
                <div className="truncate text-[12px] text-white/50">
                  {t.style}
                  {t.keyLabel !== '—' && ` · ${t.keyLabel}`} · {t.mood.join(', ')}
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-white/45 lg:hidden">
                  <CategoryTag category={t.discipline} />
                  {t.synth && <span>{t.synth.bpm} BPM</span>}
                  <span>{fmtDuration(t.duration)}</span>
                </div>
              </button>
              <div className="hidden lg:block">
                <CategoryTag category={t.discipline} />
              </div>
              <span className="hidden text-[13px] tabular-nums text-white/60 lg:block">{t.synth ? `${t.synth.bpm} BPM` : '—'}</span>
              <span className="hidden text-[13px] tabular-nums text-white/60 lg:block">{fmtDuration(t.duration)}</span>
              <div className="flex items-center justify-end gap-1.5">
                <button
                  onClick={() => choose(t)}
                  title={chosen ? 'Retirer de ma sélection' : 'Choisir pour ma prestation'}
                  aria-label={chosen ? 'Retirer de ma sélection' : 'Choisir pour ma prestation'}
                  className={cx(
                    'flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition',
                    chosen ? 'bg-gold-soft text-ink shadow-gold' : 'border border-white/15 text-white/80 hover:border-gold/50',
                  )}
                >
                  {chosen ? <Check size={14} /> : <ListMusic size={14} />}
                  <span className="hidden sm:inline">{chosen ? 'Choisie' : 'Choisir'}</span>
                </button>
                <button
                  onClick={() => download(t)}
                  aria-label={`Télécharger ${t.title}`}
                  title="Télécharger"
                  className="relative grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-gold/50"
                >
                  {d === 1 ? <Check size={15} className="text-gold" /> : <Download size={15} />}
                  {d !== undefined && d < 1 && (
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36" aria-hidden>
                      <circle cx="18" cy="18" r="16.5" fill="none" stroke="#D6AC55" strokeWidth="2.5" strokeDasharray={`${d * 103.7} 103.7`} />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )
        })}
        {list.length === 0 && (
          <div className="p-10 text-center text-[14px] text-white/50">
            {filter === 'selection' ? 'Aucune musique choisie pour le moment. Clique sur « Choisir » pour en ajouter.' : 'Aucune musique ne correspond à ta recherche.'}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-gold/25 bg-gold/[0.06] p-4 text-[12.5px] leading-relaxed text-white/65 lg:flex-row lg:items-center lg:justify-between">
        <span>
          <b className="text-goldlight">Prototype :</b> les instrumentaux sont générés en direct pour la démonstration et les téléchargements sont simulés. Dans
          l’application réelle, l’équipe MICRO D’OR téléversera ses fichiers et les élèves les enregistreront sur leur appareil.
        </span>
        {!embedded && (
          <Button to="/eleve/repetition" size="sm" variant="dark" icon={<Headphones size={15} />} className="shrink-0">
            Répéter en studio
          </Button>
        )}
      </div>

      {current && (
        <NowPlaying
          track={current}
          elapsed={elapsed}
          playing={isPlaying}
          chosen={myTracks.includes(current.id)}
          downloaded={dl[current.id]}
          onToggle={toggle}
          onSeek={seek}
          onClose={closePlayer}
          onChoose={() => choose(current)}
          onDownload={() => download(current)}
        />
      )}
      {uploadOpen && isOrganizer && <UploadModal onClose={() => setUploadOpen(false)} />}
    </div>
  )
}

function NowPlaying({
  track,
  elapsed,
  playing,
  chosen,
  downloaded,
  onToggle,
  onSeek,
  onClose,
  onChoose,
  onDownload,
}: {
  track: MusicTrack
  elapsed: number
  playing: boolean
  chosen: boolean
  downloaded?: number
  onToggle: () => void
  onSeek: (ratio: number) => void
  onClose: () => void
  onChoose: () => void
  onDownload: () => void
}) {
  const len = previewLen(track)
  const pct = Math.min(100, (elapsed / len) * 100)
  const ended = !playing && elapsed >= len - 0.3
  return createPortal(
    <div className="fixed inset-x-0 bottom-[68px] z-[45] px-3 pb-[env(safe-area-inset-bottom)] lg:bottom-4 lg:pl-[276px] lg:pr-6">
      <div className="glass mx-auto max-w-3xl animate-slideUp rounded-2xl border border-gold/35 p-3 shadow-gold">
        <div className="flex items-center gap-3">
          <TrackCover track={track} playing={playing} className="h-14 w-14 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-[15px] font-extrabold text-goldlight">{track.title}</span>
              <span className="hidden shrink-0 rounded-full border border-gold/40 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-gold sm:inline">
                Extrait {fmtDuration(len)}
              </span>
            </div>
            <div className="truncate text-[11.5px] text-white/55">
              <span className="font-bold text-gold sm:hidden">Extrait {fmtDuration(len)} · </span>
              {track.style}
              {track.synth && ` · ${track.synth.bpm} BPM`} · {CATEGORY_LABEL[track.discipline]}
            </div>
          </div>
          <button
            onClick={onToggle}
            aria-label={playing ? 'Pause' : ended ? 'Réécouter l’extrait' : 'Lecture'}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-soft text-ink shadow-gold transition active:scale-95"
          >
            {playing ? <Pause size={20} className="fill-ink" /> : <Play size={20} className="ml-0.5 fill-ink" />}
          </button>
          <button onClick={onClose} aria-label="Fermer le lecteur" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* progression de l’extrait */}
        <div className="mt-2.5 flex items-center gap-2.5">
          <span className="w-9 text-right text-[11px] tabular-nums text-white/60">{fmtDuration(elapsed)}</span>
          <button
            type="button"
            aria-label="Avancer dans l’extrait"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              onSeek((e.clientX - r.left) / r.width)
            }}
            className="relative h-2 flex-1 cursor-pointer rounded-full bg-white/10"
          >
            <span className="absolute inset-y-0 left-0 rounded-full bg-gold-soft" style={{ width: `${pct}%` }} />
            <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-goldlight shadow-[0_0_8px_#F4D78C]" style={{ left: `${pct}%` }} />
          </button>
          <span className="w-9 text-[11px] tabular-nums text-white/60">{fmtDuration(len)}</span>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="truncate text-[11.5px] text-white/50">
            {ended ? 'Extrait terminé — on la choisit ?' : `Morceau complet : ${fmtDuration(track.duration)}`}
          </span>
          <div className="flex shrink-0 gap-1.5">
            <button
              onClick={onChoose}
              className={cx(
                'flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-bold transition',
                chosen ? 'bg-gold-soft text-ink' : ended ? 'animate-pulse border border-gold text-goldlight' : 'border border-white/20 text-white/85 hover:border-gold/60',
              )}
            >
              {chosen ? <Check size={14} /> : <ListMusic size={14} />}
              {chosen ? 'Choisie' : 'Choisir'}
            </button>
            <button
              onClick={onDownload}
              className="flex h-9 items-center gap-1.5 rounded-full border border-white/20 px-3.5 text-[12.5px] font-bold text-white/85 transition hover:border-gold/60"
            >
              {downloaded === 1 ? <Check size={14} className="text-gold" /> : <Download size={14} />}
              <span className="hidden sm:inline">{downloaded === 1 ? 'Téléchargée' : downloaded !== undefined ? `${Math.round(downloaded * 100)} %` : 'Télécharger'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const { addUpload, toast } = useApp()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [disc, setDisc] = useState<Category>('chant')
  const [style, setStyle] = useState('')

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!file) return
    const url = URL.createObjectURL(file)
    const probe = new Audio()
    probe.preload = 'metadata'
    probe.src = url
    const finish = (duration: number) => {
      addUpload({
        id: 'u' + Date.now(),
        title: title.trim() || file.name.replace(/\.[^.]+$/, ''),
        discipline: disc,
        style: style.trim() || 'Téléversée par l’équipe',
        keyLabel: '—',
        duration: Math.round(duration) || 0,
        mood: ['Nouveau'],
        color: ['#F4D78C', '#6837B5'],
        url,
        uploaded: true,
        addedOn: '2099-01-01',
      })
      toast('Musique ajoutée au catalogue (cette session)')
      onClose()
    }
    probe.onloadedmetadata = () => finish(isFinite(probe.duration) ? probe.duration : 0)
    probe.onerror = () => finish(0)
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/75 backdrop-blur-sm lg:items-center" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg animate-slideUp rounded-t-3xl border border-gold/30 bg-ink p-5 lg:rounded-3xl lg:p-7"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="eyebrow mb-1">Espace équipe MICRO D’OR</div>
            <h3 className="font-display text-[30px] leading-none tracking-wide">Ajouter une musique</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <label
          htmlFor="music-file"
          className={cx(
            'flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition',
            file ? 'border-gold/60 bg-gold/[0.06]' : 'border-white/15 hover:border-gold/40',
          )}
        >
          <Upload size={26} className="text-gold" />
          <span className="text-[14px] font-bold">{file ? file.name : 'Choisir un fichier audio'}</span>
          <span className="text-[11.5px] text-white/45">MP3, WAV, M4A…</span>
          <input id="music-file" type="file" accept="audio/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-[12px] font-semibold text-white/60 sm:col-span-2">
            Titre
            <input id="music-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex. Instrumental finale 2027" className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-[14px] text-white outline-none focus:border-gold/50" />
          </label>
          <label className="text-[12px] font-semibold text-white/60">
            Discipline
            <select id="music-disc" value={disc} onChange={(e) => setDisc(e.target.value as Category)} className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-night px-3 text-[14px] text-white outline-none">
              {(['chant', 'rap', 'slam', 'danse', 'theatre'] as Category[]).map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABEL[c]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[12px] font-semibold text-white/60">
            Style
            <input id="music-style" value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Ex. Boom bap" className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-[14px] text-white outline-none focus:border-gold/50" />
          </label>
        </div>

        <p className="mt-4 text-[11.5px] leading-relaxed text-white/45">
          Prototype : le fichier reste sur cet appareil et n’est visible que pendant cette session. Dans l’application réelle, il serait envoyé au serveur et
          proposé à tous les élèves.
        </p>
        <div className="mt-5 flex gap-2">
          <Button type="submit" disabled={!file} className="flex-1 disabled:opacity-40">
            Ajouter au catalogue
          </Button>
          <Button type="button" variant="dark" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </form>
    </div>,
    document.body,
  )
}

export function MySelectionLink() {
  const { myTracks } = useApp()
  if (!myTracks.length) return null
  return (
    <Link to="/musiques" className="text-[12.5px] font-bold text-gold hover:text-goldlight">
      Ma sélection : {myTracks.length} musique{myTracks.length > 1 ? 's' : ''} →
    </Link>
  )
}
