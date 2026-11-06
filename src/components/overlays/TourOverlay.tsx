import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clapperboard, X } from 'lucide-react'
import { useApp } from '../../state/AppState'
import { cx } from '../ui'

export const TOUR_STEPS = [
  {
    to: '/',
    title: 'Une marque, une scène',
    text: 'MICRO D’OR s’ouvre comme une vraie plateforme de divertissement : une identité noir et or, mémorable, pensée pour les jeunes et crédible pour les adultes.',
    splash: true,
  },
  {
    to: '/',
    title: 'Un accueil spectaculaire',
    text: 'Affiches de spectacles, talents à découvrir et tournée : l’expérience donne envie avant même d’expliquer.',
  },
  {
    to: '/ecoles',
    title: 'Les écoles participantes',
    text: 'Chaque école secondaire a sa vitrine, ses talents et ses spectacles. Établissements fictifs pour la démonstration.',
  },
  {
    to: '/spectacles/s1',
    title: 'Un spectacle simulé',
    text: 'Le lecteur présente programme, artistes et statut. Les directs sont clairement identifiés « Démonstration ».',
  },
  {
    to: '/votes',
    title: 'Finalistes et soutiens',
    text: 'Le public encourage les talents. Essayez « Je soutiens » : votes simulés, sans aucune donnée personnelle.',
  },
  {
    to: '/prevention',
    title: 'La mission sociale',
    text: 'La scène attire l’attention ; le message peut changer une trajectoire. Prévention de la criminalité et du décrochage scolaire.',
  },
  {
    to: '/partenaires',
    title: 'Votre place à nos côtés',
    text: 'Partenaire principal, régional, jeunesse, média ou technique : des formes de visibilité concrètes, associées à une cause.',
  },
]

export default function TourOverlay() {
  const { tourStep, setTourStep, replaySplash, splashVisible } = useApp()
  const nav = useNavigate()

  useEffect(() => {
    if (tourStep === null) return
    const s = TOUR_STEPS[tourStep]
    nav(s.to)
    if (s.splash) replaySplash()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourStep])

  useEffect(() => {
    if (tourStep === null) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTourStep(null)
      if (e.key === 'ArrowRight') setTourStep(Math.min(TOUR_STEPS.length - 1, tourStep + 1))
      if (e.key === 'ArrowLeft') setTourStep(Math.max(0, tourStep - 1))
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [tourStep, setTourStep])

  if (tourStep === null || splashVisible) return null
  const s = TOUR_STEPS[tourStep]
  const last = tourStep === TOUR_STEPS.length - 1
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom))] z-[70] flex justify-center px-3 lg:bottom-6 lg:pl-[260px]">
      <div key={tourStep} className="glass pointer-events-auto w-full max-w-xl animate-fadeUp rounded-2xl border border-gold/40 p-4 shadow-gold lg:p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold-soft text-ink">
            <Clapperboard size={15} />
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold">
            Visite guidée · {tourStep + 1}/{TOUR_STEPS.length}
          </span>
          <button onClick={() => setTourStep(null)} className="ml-auto flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold text-white/60 hover:bg-white/10 hover:text-white">
            Quitter <X size={14} />
          </button>
        </div>
        <h3 className="font-display text-[26px] leading-none tracking-wide">{s.title}</h3>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/70">{s.text}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-1 gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                aria-label={`Étape ${i + 1}`}
                onClick={() => setTourStep(i)}
                className={cx('h-1.5 flex-1 rounded-full transition', i <= tourStep ? 'bg-gold' : 'bg-white/15')}
              />
            ))}
          </div>
          <button
            disabled={tourStep === 0}
            onClick={() => setTourStep(tourStep - 1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 disabled:opacity-30"
            aria-label="Étape précédente"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => (last ? setTourStep(null) : setTourStep(tourStep + 1))}
            className="flex h-10 items-center gap-1 rounded-full bg-gold-soft px-5 text-[13px] font-extrabold text-ink shadow-gold"
          >
            {last ? 'Terminer' : 'Suivant'} {!last && <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
