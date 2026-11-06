import { useEffect, useRef, useState } from 'react'
import { SkipForward, Volume2, VolumeX } from 'lucide-react'
import { useApp } from '../../state/AppState'

/**
 * Écran d’ouverture : vidéo officielle MICRO D’OR (à partir de la 6e seconde de l’original).
 * Lecture muette automatique, son activable, possibilité de passer.
 */
export default function Splash() {
  const { splashVisible, hideSplash } = useApp()
  const [run, setRun] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const video = useRef<HTMLVideoElement>(null)
  const done = useRef(false)

  const finish = () => {
    if (done.current) return
    done.current = true
    setLeaving(true)
    setTimeout(hideSplash, 600)
  }

  useEffect(() => {
    if (!splashVisible) return
    done.current = false
    setLeaving(false)
    setProgress(0)
    setRun((r) => r + 1)
    // Filet de sécurité si la vidéo ne peut pas être lue
    const safety = setTimeout(finish, 12000)
    return () => clearTimeout(safety)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splashVisible])

  useEffect(() => {
    const v = video.current
    if (!splashVisible || !v) return
    v.currentTime = 0
    v.muted = muted
    v.play().catch(() => {
      // lecture bloquée : on réessaie en muet, sinon on passe à l’accueil
      v.muted = true
      setMuted(true)
      v.play().catch(() => setTimeout(finish, 1200))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  if (!splashVisible) return null

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation()
    const v = video.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (v.paused) v.play().catch(() => {})
  }

  return (
    <div
      onClick={finish}
      className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-black transition-opacity duration-500"
      style={{ opacity: leaving ? 0 : 1 }}
      role="presentation"
    >
      {/* fond flou pour les écrans larges */}
      <img src="brand/splash-poster.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(closest-side,transparent,rgba(0,0,0,.85))]" />

      <video
        key={run}
        ref={video}
        src="brand/splash.mp4"
        poster="brand/splash-poster.jpg"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={finish}
        onError={() => setTimeout(finish, 800)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget
          if (v.duration) setProgress(v.currentTime / v.duration)
        }}
        className="relative mx-auto h-full w-full object-cover landscape:w-auto landscape:object-contain"
      />

      {/* contrôles */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-4 pb-[max(16px,env(safe-area-inset-bottom))] lg:p-8">
        <button
          onClick={toggleSound}
          className="flex h-10 items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 text-[12.5px] font-bold text-white/85 backdrop-blur transition hover:border-gold/60"
          aria-label={muted ? 'Activer le son' : 'Couper le son'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-goldlight" />}
          {muted ? 'Activer le son' : 'Son activé'}
        </button>
        <div className="hidden h-1 max-w-xs flex-1 overflow-hidden rounded-full bg-white/10 sm:block">
          <div className="h-full rounded-full bg-gold-soft" style={{ width: `${progress * 100}%` }} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            finish()
          }}
          className="flex h-10 items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 text-[12.5px] font-bold text-white/85 backdrop-blur transition hover:border-gold/60"
        >
          Passer l’intro <SkipForward size={15} />
        </button>
      </div>
    </div>
  )
}
