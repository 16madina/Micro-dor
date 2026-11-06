import { Download, Headphones, ListMusic } from 'lucide-react'
import MusicLibrary from '../components/music/MusicLibrary'
import { PageHero } from '../components/ui'

export default function Music() {
  return (
    <div>
      <PageHero
        eyebrow="Bibliothèque officielle"
        title={
          <>
            Nos <span className="text-gold-metal">musiques</span>
          </>
        }
        sub="Les instrumentaux de la saison, préparés par l’équipe MICRO D’OR. Écoute-les, choisis celui qui portera ta prestation et télécharge-le pour répéter."
      />

      <div className="mb-6 grid grid-cols-3 gap-2 lg:max-w-2xl">
        {[
          { icon: Headphones, t: 'Écoute', d: 'Un clic sur la pochette' },
          { icon: ListMusic, t: 'Choisis', d: 'Pour ta prestation' },
          { icon: Download, t: 'Télécharge', d: 'Pour répéter' },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/[0.07] bg-night/60 p-3 text-center">
            <Icon size={20} className="text-gold" />
            <span className="text-[13px] font-extrabold">{t}</span>
            <span className="text-[11px] text-white/45">{d}</span>
          </div>
        ))}
      </div>

      <MusicLibrary />
    </div>
  )
}
