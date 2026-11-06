import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Bell, LogIn, ChevronLeft, Clapperboard, Menu, RotateCcw, Search, ShoppingBag, X } from 'lucide-react'
import { LogoInline, MicEmblem, Wordmark } from '../art/Logo'
import { useApp } from '../../state/AppState'
import { IconButton, cx } from '../ui'
import { MORE_NAV, ORGANIZER_NAV, PRIMARY_NAV, SPACES_NAV, isActive, type NavItem } from './nav'

const NOTIFS = [
  { t: 'Finale locale — Les Lumières est en direct (démo)', d: 'Il y a 5 min', to: '/spectacles/s1' },
  { t: 'Maya L. a reçu 50 nouveaux soutiens (simulés)', d: 'Il y a 1 h', to: '/talents/maya-l' },
  { t: 'La tournée arrive à Laval le 20 novembre', d: 'Hier', to: '/tournee' },
  { t: 'Nouvelle capsule : Rester pour la scène', d: 'Il y a 2 jours', to: '/prevention' },
]

function Avatar({ className = '' }: { className?: string }) {
  const { user } = useApp()
  if (!user)
    return (
      <span className={cx('flex h-9 items-center gap-1.5 rounded-full border border-gold/50 px-3 text-[12px] font-bold text-goldlight', className)}>
        <LogIn size={15} />
        <span className="hidden sm:inline">Connexion</span>
      </span>
    )
  return (
    <span className={cx('grid h-9 w-9 place-items-center rounded-full bg-gold-metal p-[1.5px]', className)}>
      <span className="grid h-full w-full place-items-center rounded-full bg-night2 text-[12px] font-extrabold uppercase text-goldlight">
        {(user.firstName[0] ?? '') + (user.lastName[0] ?? '')}
      </span>
    </span>
  )
}

function HeaderActions() {
  const { setSearchOpen, cart, setCartOpen } = useApp()
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const nav = useNavigate()
  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const n = cart.reduce((a, i) => a + i.qty, 0)
  return (
    <div className="flex items-center gap-0.5" ref={ref}>
      <IconButton label="Rechercher" onClick={() => setSearchOpen(true)} className="lg:hidden">
        <Search size={20} />
      </IconButton>
      {n > 0 && (
        <IconButton label="Panier" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={20} />
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-extrabold text-ink">{n}</span>
        </IconButton>
      )}
      <IconButton
        label="Notifications"
        onClick={() => {
          setOpen((o) => !o)
          setSeen(true)
        }}
      >
        <Bell size={20} />
        {!seen && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_#F4D78C]" />}
      </IconButton>
      <Link to="/profil" aria-label="Profil ou connexion" className="ml-1">
        <Avatar />
      </Link>
      {open && (
        <div className="glass absolute right-3 top-14 z-50 w-[330px] animate-fadeIn overflow-hidden rounded-2xl border border-white/10 shadow-card">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-sm font-extrabold">Notifications</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Démonstration</span>
          </div>
          {NOTIFS.map((x) => (
            <button
              key={x.t}
              onClick={() => {
                setOpen(false)
                nav(x.to)
              }}
              className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-white/5"
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
              <span>
                <span className="block text-[13px] font-semibold leading-snug">{x.t}</span>
                <span className="text-[11px] text-white/45">{x.d}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SideLink({ item, exact }: { item: NavItem; exact?: boolean }) {
  const { pathname } = useLocation()
  const active = exact ? pathname === item.to : isActive(pathname, item.to)
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      className={cx(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold transition',
        active ? 'bg-gradient-to-r from-gold/20 to-transparent text-goldlight' : 'text-white/65 hover:bg-white/5 hover:text-white',
      )}
    >
      <Icon size={18} className={active ? 'text-gold' : 'text-white/50 group-hover:text-gold'} />
      {item.label}
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_#F4D78C]" />}
    </NavLink>
  )
}

function Sidebar() {
  const { startTour, replaySplash, isOrganizer } = useApp()
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/[0.06] bg-ink/90 backdrop-blur-xl lg:flex">
      <Link to="/" className="flex flex-col items-center px-6 pb-4 pt-7">
        <MicEmblem className="h-28 w-24" large />
        <Wordmark className="mt-1 text-[38px] italic" />
        <span className="mt-1 text-[11px] font-semibold tracking-wide text-white/50">La scène des talents de demain</span>
      </Link>
      <nav className="no-scrollbar flex-1 space-y-0.5 overflow-y-auto px-3 pb-4">
        {PRIMARY_NAV.map((i) => (
          <SideLink key={i.to} item={i} />
        ))}
        <div className="px-3 pb-1.5 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Découvrir</div>
        {MORE_NAV.map((i) => (
          <SideLink key={i.to} item={i} />
        ))}
        <div className="px-3 pb-1.5 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Espaces (démo)</div>
        {SPACES_NAV.map((i) => (
          <SideLink key={i.to} item={i} exact />
        ))}
        {isOrganizer && <SideLink item={ORGANIZER_NAV} exact />}
      </nav>
      <div className="space-y-2 border-t border-white/[0.06] p-3">
        <button
          onClick={startTour}
          className="gold-border group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:shadow-gold"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-soft text-ink">
            <Clapperboard size={18} />
          </span>
          <span>
            <span className="block text-[13px] font-extrabold text-goldlight">Visite guidée sponsors</span>
            <span className="text-[11px] text-white/50">Lancer la démonstration</span>
          </span>
        </button>
        <button onClick={replaySplash} className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-[12px] font-semibold text-white/45 transition hover:text-white">
          <RotateCcw size={13} /> Revoir l’intro
        </button>
      </div>
    </aside>
  )
}

function DesktopTopBar() {
  const { setSearchOpen } = useApp()
  return (
    <div className="sticky top-0 z-30 hidden items-center justify-between gap-6 border-b border-white/[0.05] bg-ink/70 px-10 py-3 backdrop-blur-xl lg:flex">
      <button
        onClick={() => setSearchOpen(true)}
        className="flex h-10 w-[380px] items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 text-[13px] text-white/45 transition hover:border-gold/40"
      >
        <Search size={16} />
        Rechercher une école, un talent, un spectacle…
        <kbd className="ml-auto rounded border border-white/15 px-1.5 text-[10px] text-white/40">/</kbd>
      </button>
      <div className="flex items-center gap-4">
        <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-goldlight">Prototype visuel</span>
        <div className="relative">
          <HeaderActions />
        </div>
      </div>
    </div>
  )
}

const ROOTS = ['/', ...PRIMARY_NAV.map((n) => n.to), ...MORE_NAV.map((n) => n.to), '/eleve', '/parent', '/visite']

function MobileHeader() {
  const { pathname } = useLocation()
  const { setMenuOpen } = useApp()
  const nav = useNavigate()
  const isRoot = ROOTS.includes(pathname)
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.05] bg-ink/75 px-2 backdrop-blur-xl lg:hidden">
      <div className="flex items-center">
        {isRoot ? (
          <IconButton label="Menu" onClick={() => setMenuOpen(true)}>
            <Menu size={21} />
          </IconButton>
        ) : (
          <IconButton label="Retour" onClick={() => nav(-1)}>
            <ChevronLeft size={24} />
          </IconButton>
        )}
        <Link to="/" aria-label="Accueil MICRO D’OR">
          <LogoInline />
        </Link>
      </div>
      <div className="relative">
        <HeaderActions />
      </div>
    </header>
  )
}

function BottomNav() {
  const { pathname } = useLocation()
  return (
    <nav className="glass fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {PRIMARY_NAV.map((item) => {
          const active = isActive(pathname, item.to)
          const Icon = item.icon
          return (
            <Link key={item.to} to={item.to} className="relative flex flex-col items-center gap-1 pb-2 pt-2.5">
              {active && <span className="absolute top-0 h-[2px] w-8 rounded-full bg-gold-soft shadow-[0_0_10px_#F4D78C]" />}
              <Icon size={21} className={active ? 'text-gold' : 'text-white/55'} strokeWidth={active ? 2.3 : 1.8} />
              <span className={cx('text-[10.5px] font-bold', active ? 'text-goldlight' : 'text-white/50')}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function MoreMenu() {
  const { menuOpen, setMenuOpen, startTour, replaySplash, isOrganizer } = useApp()
  const { pathname } = useLocation()
  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen])
  if (!menuOpen) return null
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 animate-fadeIn bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
      <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-[340px] animate-fadeIn flex-col overflow-y-auto border-r border-gold/20 bg-ink p-5">
        <div className="mb-5 flex items-center justify-between">
          <LogoInline />
          <IconButton label="Fermer" onClick={() => setMenuOpen(false)}>
            <X size={20} />
          </IconButton>
        </div>
        <div className="eyebrow mb-3">Découvrir</div>
        <div className="grid grid-cols-3 gap-2">
          {MORE_NAV.map((i) => {
            const Icon = i.icon
            return (
              <Link key={i.to} to={i.to} className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] py-4 text-[12px] font-bold text-white/80 transition hover:border-gold/40">
                <Icon size={22} className="text-gold" />
                {i.label}
              </Link>
            )
          })}
        </div>
        <div className="eyebrow mb-3 mt-6">Espaces (démonstration)</div>
        <div className="space-y-1">
          {SPACES_NAV.map((i) => (
            <SideLink key={i.to} item={i} exact />
          ))}
          {isOrganizer && <SideLink item={ORGANIZER_NAV} exact />}
        </div>
        <div className="mt-auto space-y-2 pt-6">
          <button onClick={startTour} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-soft text-sm font-extrabold text-ink shadow-gold">
            <Clapperboard size={17} /> Visite guidée sponsors
          </button>
          <button onClick={replaySplash} className="flex w-full items-center justify-center gap-2 py-2 text-[12px] font-semibold text-white/50">
            <RotateCcw size={13} /> Revoir l’intro
          </button>
        </div>
      </div>
    </div>
  )
}

function Toasts() {
  const { toasts } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-[90] flex flex-col items-center gap-2 px-4 lg:top-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cx(
            'animate-fadeUp rounded-full px-5 py-2.5 text-[13.5px] font-bold shadow-card',
            t.tone === 'gold' ? 'bg-gold-soft text-ink shadow-gold' : 'glass border border-white/10 text-white',
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const { setSearchOpen } = useApp()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [setSearchOpen])
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-[260px]">
        <DesktopTopBar />
        <MobileHeader />
        <main key={pathname} className="mx-auto max-w-[1280px] animate-fadeIn px-4 pb-28 pt-4 lg:px-10 lg:pb-16 lg:pt-8">
          {children}
        </main>
      </div>
      <BottomNav />
      <MoreMenu />
      <Toasts />
    </div>
  )
}
