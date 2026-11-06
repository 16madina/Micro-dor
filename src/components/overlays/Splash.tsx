import { useEffect, useRef, useState } from 'react'
import { SkipForward, Volume2, VolumeX } from 'lucide-react'
import { useApp } from '../../state/AppState'

/** Durée du fondu vers l’accueil (ms) */
const FADE = 900

/**
 * Écran d’ouverture : vidéo officielle MICRO D’OR, jouée en entier avec le son.
 * Si le navigateur refuse le son avant une interaction, la vidéo démarre en muet
 * et le premier toucher active le son. À la fin : fondu vers la page d’accueil.
 */
export default function Splash() {
  const { splashVisible, hideSplash } = useApp()
  const [run, setRun] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const video = useRef<HTMLVideoElement>(null)
  const done = useRef(false)

  const finish = () => {
    if (done.current) return
    done.current = true
    setLeaving(true)
    // baisse le son en douceur pendant le fondu (ignoré sur iPhone, qui fixe le volume)
    const v = video.current
    if (v && !v.muted) {
      const start = v.volume
      const t0 = performance.now()
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / FADE)
        try {
          v.volume = start * (1 - k)
        } catch {
          /* volume en lecture seule */
        }
        if (k < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }
    setTimeout(hideSplash, FADE)
  }

  const unmute = () => {
    const v = video.current
    if (!v || !v.muted) return
    v.muted = false
    setMuted(false)
    if (v.paused) v.play().catch(() => {})
  }

  // (re)démarrage
  useEffect(() => {
    if (!splashVisible) return
    done.current = false
    setLeaving(false)
    setProgress(0)
    setRun((r) => r + 1)
    const safety = setTimeout(finish, 12000)
    return () => clearTimeout(safety)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splashVisible])

  // lecture avec le son, sinon en muet
  useEffect(() => {
    const v = video.current
    if (!splashVisible || !v) return
    v.currentTime = 0
    v.volume = 1
    v.muted = false
    setMuted(false)
    const current = () => video.current === v && !done.current
    v.play().catch((e: DOMException) => {
      // « AbortError » : l’élément a été remplacé ou mis en pause entre-temps, rien à faire
      if (!current() || e?.name !== 'NotAllowedError') return
      // son refusé avant toute interaction : on joue en muet, le premier toucher activera le son
      v.muted = true
      setMuted(true)
      v.play().catch((e2: DOMException) => {
        if (current() && e2?.name === 'NotAllowedError') setTimeout(() => current() && finish(), 1200)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  // premier toucher / touche du clavier : active le son
  useEffect(() => {
    if (!splashVisible) return
    const h = (e: Event) => {
      if ((e.target as Element | null)?.closest?.('[data-sound-toggle]')) return
      unmute()
    }
    window.addEventListener('pointerdown', h, { capture: true })
    window.addEventListener('keydown', h, { capture: true })
    return () => {
      window.removeEventListener('pointerdown', h, { capture: true })
      window.removeEventListener('keydown', h, { capture: true })
    }
  }, [splashVisible])

  if (!splashVisible) return null

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-black transition-opacity ease-out"
      style={{ opacity: leaving ? 0 : 1, transitionDuration: `${FADE}ms`, pointerEvents: leaving ? 'none' : 'auto' }}
      role="presentation"
    >
      {/* fond flou pour les écrans larges */}
      <img src="brand/splash-backdrop.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(closest-side,transparent,rgba(0,0,0,.9))]" />

      <video
        key={run}
        ref={video}
        src="brand/splash.mp4"
        poster="brand/splash-poster.jpg"
        playsInline
        preload="auto"
        onEnded={finish}
        onError={() => setTimeout(finish, 800)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget
          if (!v.duration) return
          setProgress(v.currentTime / v.duration)
          // le fondu commence juste avant la dernière image
          if (v.duration - v.currentTime <= FADE / 1000) finish()
        }}
        className="relative mx-auto h-full w-full object-cover landscape:w-auto landscape:object-contain"
      />

      {/* invitation à activer le son si le navigateur l’a bloqué */}
      {muted && !leaving && (
        <button
          onClick={unmute}
          className="absolute left-1/2 top-[max(24px,env(safe-area-inset-top))] flex -translate-x-1/2 animate-fadeIn items-center gap-2 rounded-full bg-gold-soft px-5 py-2.5 text-[13.5px] font-extrabold text-ink shadow-gold"
        >
          <Volume2 size={17} /> Touchez pour le son
        </button>
      )}

      {/* contrôles */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 pb-[max(16px,env(safe-area-inset-bottom))] lg:p-8">
        <button
          data-sound-toggle
          onClick={() => {
            const v = video.current
            if (!v) return
            if (v.muted) unmute()
            else {
              v.muted = true
              setMuted(true)
            }
          }}
          className="flex h-10 items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 text-[12.5px] font-bold text-white/85 backdrop-blur transition hover:border-gold/60"
          aria-label={muted ? 'Activer le son' : 'Couper le son'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-goldlight" />}
          {muted ? 'Son coupé' : 'Son activé'}
        </button>
        <div className="hidden h-1 max-w-xs flex-1 overflow-hidden rounded-full bg-white/10 sm:block">
          <div className="h-full rounded-full bg-gold-soft" style={{ width: `${progress * 100}%` }} />
        </div>
        <button
          onClick={finish}
          className="flex h-10 items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 text-[12.5px] font-bold text-white/85 backdrop-blur transition hover:border-gold/60"
        >
          Passer l’intro <SkipForward size={15} />
        </button>
      </div>
    </div>
  )
}
