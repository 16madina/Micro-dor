import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../state/AppState'

/** Durée du fondu vers l’accueil (ms) */
const FADE = 900

/**
 * Écran d’ouverture : vidéo officielle MICRO D’OR, jouée en entier avec le son, sans aucun bouton.
 * Si le navigateur refuse le son avant toute interaction (règle de Safari / Chrome),
 * la vidéo démarre quand même et le premier toucher active le son, sans rien afficher.
 * À la fin : fondu vers la page d’accueil.
 */
export default function Splash() {
  const { splashVisible, hideSplash } = useApp()
  const [run, setRun] = useState(0)
  const [leaving, setLeaving] = useState(false)
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
    if (v.paused) v.play().catch(() => {})
  }

  // (re)démarrage
  useEffect(() => {
    if (!splashVisible) return
    done.current = false
    setLeaving(false)
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
    const current = () => video.current === v && !done.current
    v.play().catch((e: DOMException) => {
      // « AbortError » : l’élément a été remplacé ou mis en pause entre-temps, rien à faire
      if (!current() || e?.name !== 'NotAllowedError') return
      // son refusé avant toute interaction : on joue en muet, le premier toucher activera le son
      v.muted = true
      v.play().catch((e2: DOMException) => {
        if (current() && e2?.name === 'NotAllowedError') setTimeout(() => current() && finish(), 1200)
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])

  // premier toucher / touche du clavier : active le son
  useEffect(() => {
    if (!splashVisible) return
    const h = () => unmute()
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
          // le fondu commence juste avant la dernière image
          if (v.duration - v.currentTime <= FADE / 1000) finish()
        }}
        className="relative mx-auto h-full w-full object-cover landscape:w-auto landscape:object-contain"
      />

    </div>
  )
}
