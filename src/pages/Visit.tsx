import { Clapperboard, Play } from 'lucide-react'
import StageArt from '../components/art/StageArt'
import { PHOTOS } from '../data'
import { MicEmblem } from '../components/art/Logo'
import { TOUR_STEPS } from '../components/overlays/TourOverlay'
import { Button } from '../components/ui'
import { useApp } from '../state/AppState'

export default function Visit() {
  const { startTour, setTourStep } = useApp()
  return (
    <div>
      <section className="relative -mx-4 -mt-4 overflow-hidden lg:mx-0 lg:mt-0 lg:rounded-[28px] lg:border lg:border-white/[0.07]">
        <div className="relative min-h-[460px]">
          <StageArt seed="visite" photo={PHOTOS.crowd} palette="gold" pose="trio" animated className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-ink/70" />
          <div className="relative flex min-h-[460px] flex-col items-center justify-center p-6 text-center">
            <span className="mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-gold/50 bg-ink/60 text-gold">
              <Clapperboard size={30} />
            </span>
            <div className="eyebrow mb-2">Mode démonstration sponsors</div>
            <h1 className="font-display text-[52px] leading-[0.9] tracking-wide lg:text-[80px]">
              Visite guidée
              <br />
              <span className="text-gold-metal">MICRO D’OR</span>
            </h1>
            <p className="mt-3 max-w-md text-[15px] text-white/70">Découvrez la plateforme, ses fonctionnalités et son impact.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={startTour} iconRight={<Play size={15} className="fill-ink" />}>
                Lancer la démonstration
              </Button>
              <Button size="lg" variant="outline" className="bg-ink/40" onClick={() => setTourStep(1)}>
                Parcours rapide (3 min)
              </Button>
            </div>
            <p className="mt-4 text-[12px] text-white/45">Quittez la visite à tout moment avec « Quitter » ou la touche Échap. Flèches ← → pour naviguer.</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-[32px] tracking-wide">Les 7 étapes</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOUR_STEPS.map((s, i) => (
            <button key={i} onClick={() => setTourStep(i)} className="group flex flex-col items-start rounded-2xl border border-white/[0.07] bg-night/70 p-4 text-left transition hover:border-gold/40">
              <span className="font-display text-[38px] leading-none text-gold-metal">{String(i + 1).padStart(2, '0')}</span>
              <span className="mt-2 font-extrabold">{s.title}</span>
              <span className="mt-1 line-clamp-3 text-[12.5px] text-white/55">{s.text}</span>
              <span className="mt-3 text-[12px] font-bold text-gold opacity-0 transition group-hover:opacity-100">Aller à cette étape →</span>
            </button>
          ))}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gold/30 p-4 text-center">
            <MicEmblem className="h-20 w-14" />
            <span className="mt-2 text-[12.5px] text-white/55">Prototype visuel — données fictives</span>
          </div>
        </div>
      </section>
    </div>
  )
}
