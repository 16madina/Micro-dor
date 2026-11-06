import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MonitorPlay, School as SchoolIcon, Search, Star, X } from 'lucide-react'
import { CATEGORY_LABEL, SCHOOLS, SHOWS, TALENTS, schoolById } from '../../data'
import { useApp } from '../../state/AppState'

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useApp()
  const [q, setQ] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  const nav = useNavigate()

  useEffect(() => {
    if (searchOpen) {
      setQ('')
      setTimeout(() => ref.current?.focus(), 30)
    }
    const h = (e: KeyboardEvent) => e.key === 'Escape' && setSearchOpen(false)
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [searchOpen, setSearchOpen])

  const results = useMemo(() => {
    const n = norm(q.trim())
    const match = (...s: string[]) => !n || s.some((x) => norm(x).includes(n))
    return [
      ...SCHOOLS.filter((s) => match(s.name, s.city)).map((s) => ({ icon: SchoolIcon, label: s.name, sub: s.city, to: `/ecoles/${s.id}` })),
      ...TALENTS.filter((t) => match(t.name, CATEGORY_LABEL[t.category], schoolById(t.schoolId).city)).map((t) => ({
        icon: Star,
        label: t.name,
        sub: `${CATEGORY_LABEL[t.category]} · ${schoolById(t.schoolId).shortName}`,
        to: `/talents/${t.id}`,
      })),
      ...SHOWS.filter((s) => match(s.title, schoolById(s.schoolId).city)).map((s) => ({
        icon: MonitorPlay,
        label: s.title,
        sub: `${schoolById(s.schoolId).city} · ${s.status === 'live' ? 'En direct (démo)' : s.status === 'upcoming' ? 'À venir' : 'Rediffusion'}`,
        to: `/spectacles/${s.id}`,
      })),
    ].slice(0, n ? 30 : 9)
  }, [q])

  if (!searchOpen) return null
  return (
    <div className="fixed inset-0 z-[80] flex justify-center bg-black/75 backdrop-blur-md" onClick={() => setSearchOpen(false)}>
      <div className="mt-0 h-full w-full max-w-2xl animate-fadeUp lg:mt-[10vh] lg:h-auto" onClick={(e) => e.stopPropagation()}>
        <div className="glass flex h-full flex-col overflow-hidden border border-gold/25 lg:max-h-[70vh] lg:rounded-3xl">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 pt-[max(16px,env(safe-area-inset-top))] lg:pt-4">
            <Search size={20} className="text-gold" />
            <input
              ref={ref}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="École, talent, spectacle, ville…"
              className="flex-1 bg-transparent text-[16px] font-semibold outline-none placeholder:text-white/35"
            />
            <button onClick={() => setSearchOpen(false)} aria-label="Fermer" className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain p-2 pb-[max(8px,env(safe-area-inset-bottom))]">
            {!q && <div className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-widest text-white/35">Suggestions</div>}
            {results.length === 0 && <div className="p-8 text-center text-white/50">Aucun résultat pour « {q} »</div>}
            {results.map((r) => {
              const Icon = r.icon
              return (
                <button
                  key={r.to}
                  onClick={() => {
                    setSearchOpen(false)
                    nav(r.to)
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/[0.06]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold/10 text-gold">
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-bold">{r.label}</span>
                    <span className="block truncate text-[12px] text-white/50">{r.sub}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
