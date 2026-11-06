import { useMemo, useState } from 'react'
import { Info, Search } from 'lucide-react'
import { SCHOOLS, SHOWS, TALENTS } from '../data'
import { SchoolCard } from '../components/cards'
import { Chips, PageHero } from '../components/ui'

export default function Schools() {
  const [city, setCity] = useState('all')
  const [q, setQ] = useState('')
  const cities = [{ value: 'all', label: 'Toutes' }, ...SCHOOLS.map((s) => ({ value: s.city, label: s.city }))]
  const list = useMemo(
    () =>
      SCHOOLS.filter((s) => (city === 'all' || s.city === city) && (!q || (s.name + s.city).toLowerCase().includes(q.toLowerCase()))),
    [city, q],
  )
  const total = SCHOOLS.reduce((a, s) => a + s.participants, 0)

  return (
    <div>
      <PageHero
        eyebrow="Réseau MICRO D’OR"
        title={
          <>
            Écoles <span className="text-gold-metal">participantes</span>
          </>
        }
        sub="Huit écoles secondaires, huit scènes, huit communautés qui font briller leurs talents. Chaque établissement a sa vitrine, ses artistes et ses spectacles."
      />

      <div className="mb-5 grid grid-cols-3 gap-2 lg:max-w-xl">
        {[
          { v: SCHOOLS.length, l: 'Écoles' },
          { v: total, l: 'Participants' },
          { v: SHOWS.length, l: 'Spectacles' },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-white/[0.07] bg-night/60 p-3 text-center">
            <div className="font-display text-[30px] leading-none text-goldlight">{s.v}</div>
            <div className="mt-1 text-[10.5px] font-bold uppercase tracking-wider text-white/45">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-gold/25 bg-gold/[0.06] px-4 py-3 text-[12.5px] leading-snug text-white/70">
        <Info size={16} className="mt-0.5 shrink-0 text-gold" />
        <span>
          <b className="text-goldlight">Établissements fictifs.</b> Les noms d’écoles sont inventés pour la démonstration et situés dans de vraies villes québécoises.
          Les photos de bâtiments servent d’illustration. Les participants ({TALENTS.length} talents) sont des personnages de démonstration.
        </span>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 lg:w-72">
          <Search size={16} className="text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher une école"
            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-white/35"
          />
        </div>
        <Chips options={cities} value={city} onChange={setCity} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
        {list.map((s, i) => (
          <div key={s.id} className="animate-fadeUp" style={{ animationDelay: `${i * 0.04}s` }}>
            <SchoolCard school={s} className="h-full" />
          </div>
        ))}
      </div>
      {list.length === 0 && <div className="py-16 text-center text-white/50">Aucune école ne correspond à votre recherche.</div>}
    </div>
  )
}
