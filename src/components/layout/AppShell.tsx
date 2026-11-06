import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Bell, LogIn, ChevronLeft, ChevronRight, Clapperboard, Menu, RotateCcw, Search, ShoppingBag, X } from 'lucide-react'
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
  const back = () => ((window.history.state as { idx?: number } | null)?.idx ? nav(-1) : nav('/'))
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:hidden">
      <div className="flex h-14 items-center justify-between pl-[max(4px,env(safe-area-inset-left))] pr-[max(6px,env(safe-area-inset-right))]">
        <div className="flex min-w-0 items-center">
          {!isRoot && (
            <IconButton label="Retour" onClick={back} className="-mr-1">
              <ChevronLeft size={26} />
            </IconButton>
          )}
          <Link to="/" aria-label="Accueil MICRO D’OR" className={cx('flex min-w-0 items-center gap-1', isRoot && 'pl-2.5')}>
            <MicEmblem className="-my-1 h-10 w-7 shrink-0" glow={false} />
            <Wordmark className={cx('truncate text-[23px] italic max-[359px]:text-[19px]', !isRoot && 'max-[389px]:hidden')} />
          </Link>
        </div>
        <div className="relative flex shrink-0 items-center">
          <HeaderActions />
          <IconButton label="Ouvrir le menu" onClick={() => setMenuOpen(true)} className="ml-0.5">
            <Menu size={23} />
          </IconButton>
        </div>
      </div>
    </header>
  )
}

function BottomNav() {
  const { pathname } = useLocation()
  return (
    <nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid h-[62px] max-w-lg grid-cols-5 px-1">
        {PRIMARY_NAV.map((item) => {
          const active = isActive(pathname, item.to) || (item.to === '/profil' && pathname.startsWith('/connexion'))
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center justify-center gap-0.5 transition-transform duration-150 active:scale-90"
            >
              <span className={cx('grid h-8 w-14 place-items-center rounded-full transition-colors duration-200', active && 'bg-gold/15')}>
                <Icon size={22} className={active ? 'text-gold' : 'text-white/55'} strokeWidth={active ? 2.3 : 1.8} />
              </span>
              <span className={cx('text-[10.5px] font-bold leading-none', active ? 'text-goldlight' : 'text-white/50')}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function DrawerRow({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const { pathname } = useLocation()
  const active = pathname === item.to
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cx(
        'flex h-12 items-center gap-3.5 rounded-xl px-3 text-[15px] font-semibold transition active:bg-white/10',
        active ? 'bg-gold/10 text-goldlight' : 'text-white/85',
      )}
    >
      <Icon size={20} className={active ? 'text-gold' : 'text-gold/80'} />
      <span className="flex-1">{item.label}</span>
      <ChevronRight size={16} className="text-white/25" />
    </Link>
  )
}

function MoreMenu() {
  const { menuOpen, setMenuOpen, startTour, replaySplash, isOrganizer, user } = useApp()
  const { pathname } = useLocation()
  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen])
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const h = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', h)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', h)
    }
  }, [menuOpen, setMenuOpen])
  if (!menuOpen) return null
  const close = () => setMenuOpen(false)
  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="absolute inset-0 animate-fadeIn bg-black/70 backdrop-blur-sm" onClick={close} />
      <aside className="absolute inset-y-0 right-0 flex w-[86%] max-w-[360px] animate-slideInRight flex-col overflow-y-auto overscroll-contain border-l border-gold/20 bg-ink pb-[max(16px,env(safe-area-inset-bottom))] pl-4 pr-[max(16px,env(safe-area-inset-right))] pt-[max(12px,env(safe-area-inset-top))] shadow-[-20px_0_60px_rgba(0,0,0,.6)]">
        <div className="mb-4 flex h-12 items-center justify-between">
          <span className="flex items-center gap-1">
            <MicEmblem className="h-10 w-7" glow={false} />
            <Wordmark className="text-[22px] italic" />
          </span>
          <IconButton label="Fermer le menu" onClick={close}>
            <X size={22} />
          </IconButton>
        </div>

        {/* compte */}
        {user ? (
          <Link to="/profil" onClick={close} className="mb-5 flex items-center gap-3 rounded-2xl border border-gold/25 bg-gold/[0.06] p-3 active:bg-gold/10">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-metal p-[1.5px]">
              <span className="grid h-full w-full place-items-center rounded-full bg-night2 text-[13px] font-extrabold uppercase text-goldlight">
                {(user.firstName[0] ?? '') + (user.lastName[0] ?? '')}
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-extrabold">
                {user.firstName} {user.lastName}
              </span>
              <span className="block text-[12px] text-white/50">Voir mon profil</span>
            </span>
            <ChevronRight size={16} className="text-white/30" />
          </Link>
        ) : (
          <div className="mb-5 grid grid-cols-2 gap-2">
            <Link to="/connexion" onClick={close} className="flex h-11 items-center justify-center gap-1.5 rounded-full bg-gold-soft text-[13.5px] font-extrabold text-ink">
              <LogIn size={16} /> Se connecter
            </Link>
            <Link to="/connexion?mode=inscription" onClick={close} className="flex h-11 items-center justify-center rounded-full border border-gold/50 text-[13.5px] font-bold text-goldlight">
              Créer un compte
            </Link>
          </div>
        )}

        <div className="eyebrow mb-1.5 px-3">Découvrir</div>
        <nav className="space-y-0.5">
          {MORE_NAV.map((i) => (
            <DrawerRow key={i.to} item={i} onNavigate={close} />
          ))}
        </nav>

        <div className="eyebrow mb-1.5 mt-5 px-3">Espaces</div>
        <nav className="space-y-0.5">
          {SPACES_NAV.map((i) => (
            <DrawerRow key={i.to} item={i} onNavigate={close} />
          ))}
          {isOrganizer && <DrawerRow item={ORGANIZER_NAV} onNavigate={close} />}
        </nav>

        <div className="mt-auto space-y-2 pt-6">
          <button onClick={startTour} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-soft text-sm font-extrabold text-ink shadow-gold active:scale-[.98]">
            <Clapperboard size={17} /> Visite guidée sponsors
          </button>
          <button onClick={replaySplash} className="flex w-full items-center justify-center gap-2 py-2 text-[12px] font-semibold text-white/50">
            <RotateCcw size={13} /> Revoir l’intro
          </button>
        </div>
      </aside>
    </div>
  )
}

function Toasts() {
  const { toasts } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+64px)] z-[90] flex flex-col items-center gap-2 px-4 lg:top-6">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cx(
            'max-w-full animate-fadeUp rounded-full px-5 py-2.5 text-center text-[13.5px] font-bold shadow-card',
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
    <div className="min-h-[100dvh]">
      <Sidebar />
      <div className="lg:pl-[260px]">
        <DesktopTopBar />
        <MobileHeader />
        <main
          key={pathname}
          className="mx-auto max-w-[1280px] animate-pageIn pb-[calc(92px+env(safe-area-inset-bottom))] pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] pt-4 lg:animate-fadeIn lg:px-10 lg:pb-16 lg:pt-8"
        >
          {children}
        </main>
      </div>
      <BottomNav />
      <MoreMenu />
      <Toasts />
    </div>
  )
}
