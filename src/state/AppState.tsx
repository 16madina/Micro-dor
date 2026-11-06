import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { PRODUCTS, TALENTS, type Product } from '../data'
import type { MusicTrack } from '../data/music'

export interface CartItem {
  key: string
  productId: string
  size?: string
  qty: number
}

export type Role = 'eleve' | 'parent' | 'organisation' | 'organisateur'

export interface Account {
  id: string
  role: Role
  firstName: string
  lastName: string
  email: string
  /** champs propres au profil (école, niveau, organisation…) */
  details: Record<string, string>
  createdAt: string
}

export const ROLE_LABEL: Record<Role, string> = { eleve: 'Élève', parent: 'Parent / tuteur', organisation: 'Organisation', organisateur: 'Organisateur' }

/** Code d’accès des organisateurs (prototype : vérifié dans le navigateur ; à vérifier côté serveur en production) */
export const ORGANIZER_CODE = 'MICRO'
export const isOrganizerCode = (c: string) => c.trim().toUpperCase() === ORGANIZER_CODE

export const DEMO_ACCOUNTS: Record<Role, Account> = {
  eleve: {
    id: 'demo-eleve',
    role: 'eleve',
    firstName: 'Alex',
    lastName: 'Tremblay',
    email: 'alex.demo@exemple.ca',
    details: { ecole: 'sommet', niveau: 'Secondaire 4', disciplines: 'Rap conscience' },
    createdAt: '2026-09-01',
  },
  parent: {
    id: 'demo-parent',
    role: 'parent',
    firstName: 'Julie',
    lastName: 'Tremblay',
    email: 'julie.demo@exemple.ca',
    details: { lien: 'Mère', enfant: 'Maya L.', ecole: 'lumieres' },
    createdAt: '2026-09-03',
  },
  organisation: {
    id: 'demo-org',
    role: 'organisation',
    firstName: 'Marc',
    lastName: 'Gagnon',
    email: 'marc.demo@exemple.ca',
    details: { type: 'École secondaire', organisation: 'École secondaire des Lumières', fonction: 'Direction adjointe', ville: 'Montréal', region: 'montreal' },
    createdAt: '2026-08-28',
  },
  organisateur: {
    id: 'demo-orga',
    role: 'organisateur',
    firstName: 'Samira',
    lastName: 'Côté',
    email: 'equipe.demo@exemple.ca',
    details: { equipe: 'Coordination de la tournée' },
    createdAt: '2026-08-15',
  },
}

async function hash(pw: string) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('microdor:' + pw))
    return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return 'x' + pw.length
  }
}

interface Toast {
  id: number
  message: string
  tone: 'gold' | 'info'
}

interface AppState {
  // soutiens (simulés, locaux)
  supportCount: (talentId: string) => number
  hasSupported: (talentId: string) => boolean
  support: (talentId: string) => void
  // panier fictif
  cart: CartItem[]
  addToCart: (productId: string, size?: string) => void
  setQty: (key: string, qty: number) => void
  clearCart: () => void
  cartOpen: boolean
  setCartOpen: (v: boolean) => void
  // retours visuels
  toasts: Toast[]
  toast: (message: string, tone?: Toast['tone']) => void
  // intro
  splashVisible: boolean
  replaySplash: () => void
  hideSplash: () => void
  // visite guidée
  tourStep: number | null
  startTour: () => void
  setTourStep: (n: number | null) => void
  // panneaux
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
  menuOpen: boolean
  setMenuOpen: (v: boolean) => void
  // musiques
  myTracks: string[]
  toggleTrack: (id: string) => void
  uploads: MusicTrack[]
  addUpload: (t: MusicTrack) => void
  // compte (démonstration, en mémoire uniquement)
  user: Account | null
  register: (a: Omit<Account, 'id' | 'createdAt'>, password: string) => Promise<'ok' | 'exists'>
  login: (email: string, password: string) => Promise<'ok' | 'unknown' | 'wrong'>
  demoLogin: (role: Role) => void
  logout: () => void
  isOrganizer: boolean
  // boutique modifiable par les organisateurs
  products: Product[]
  addProduct: (p: Product) => void
  updateProduct: (id: string, patch: Partial<Product>) => void
  removeProduct: (id: string) => void
}

const Ctx = createContext<AppState | null>(null)

const BASE = Object.fromEntries(TALENTS.map((t) => [t.id, t.supports]))

export function AppProvider({ children }: { children: ReactNode }) {
  const [extra, setExtra] = useState<Record<string, number>>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [splashVisible, setSplashVisible] = useState(true)
  const [tourStep, setTourStep] = useState<number | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [myTracks, setMyTracks] = useState<string[]>([])
  const [uploads, setUploads] = useState<MusicTrack[]>([])
  const [user, setUser] = useState<Account | null>(null)
  const [products, setProducts] = useState<Product[]>(PRODUCTS)
  const accounts = useRef(new Map<string, { account: Account; pw: string }>())
  const tid = useRef(0)

  const toast = useCallback((message: string, tone: Toast['tone'] = 'gold') => {
    const id = ++tid.current
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  // Démo : les autres compteurs bougent doucement pour donner vie au classement
  useEffect(() => {
    const t = setInterval(() => {
      const pick = TALENTS[Math.floor(Math.random() * TALENTS.length)].id
      setExtra((e) => ({ ...e, [pick + '#crowd']: (e[pick + '#crowd'] ?? 0) + 1 }))
    }, 4500)
    return () => clearInterval(t)
  }, [])

  const value = useMemo<AppState>(
    () => ({
      supportCount: (id) => (BASE[id] ?? 0) + (extra[id] ?? 0) + (extra[id + '#crowd'] ?? 0),
      hasSupported: (id) => (extra[id] ?? 0) > 0,
      support: (id) => setExtra((e) => ({ ...e, [id]: (e[id] ?? 0) + 1 })),
      cart,
      addToCart: (productId, size) => {
        const key = productId + (size ? '-' + size : '')
        setCart((c) => {
          const found = c.find((i) => i.key === key)
          if (found) return c.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
          return [...c, { key, productId, size, qty: 1 }]
        })
      },
      setQty: (key, qty) => setCart((c) => (qty <= 0 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty } : i)))),
      clearCart: () => setCart([]),
      cartOpen,
      setCartOpen,
      toasts,
      toast,
      splashVisible,
      replaySplash: () => setSplashVisible(true),
      hideSplash: () => setSplashVisible(false),
      tourStep,
      startTour: () => setTourStep(0),
      setTourStep,
      searchOpen,
      setSearchOpen,
      menuOpen,
      setMenuOpen,
      myTracks,
      toggleTrack: (id) => setMyTracks((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id])),
      uploads,
      addUpload: (t) => setUploads((u) => [t, ...u]),
      user,
      register: async (a, password) => {
        const key = a.email.trim().toLowerCase()
        if (accounts.current.has(key) || Object.values(DEMO_ACCOUNTS).some((d) => d.email === key)) return 'exists'
        const account: Account = { ...a, email: key, id: 'u' + Date.now(), createdAt: new Date().toISOString().slice(0, 10) }
        accounts.current.set(key, { account, pw: await hash(password) })
        setUser(account)
        return 'ok'
      },
      login: async (email, password) => {
        const key = email.trim().toLowerCase()
        const demo = Object.values(DEMO_ACCOUNTS).find((d) => d.email === key)
        if (demo) {
          setUser(demo)
          return 'ok'
        }
        const rec = accounts.current.get(key)
        if (!rec) return 'unknown'
        if (rec.pw !== (await hash(password))) return 'wrong'
        setUser(rec.account)
        return 'ok'
      },
      demoLogin: (role) => setUser(DEMO_ACCOUNTS[role]),
      logout: () => setUser(null),
      isOrganizer: user?.role === 'organisateur',
      products,
      addProduct: (p) => setProducts((x) => [...x, p]),
      updateProduct: (id, patch) => setProducts((x) => x.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      removeProduct: (id) => {
        setProducts((x) => x.filter((p) => p.id !== id))
        setCart((c) => c.filter((i) => i.productId !== id))
      },
    }),
    [extra, cart, cartOpen, toasts, toast, splashVisible, tourStep, searchOpen, menuOpen, myTracks, uploads, user, products],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp outside provider')
  return c
}
