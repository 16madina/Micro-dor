import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { PRODUCTS, TALENTS, type Product } from '../data'
import type { MusicTrack } from '../data/music'
import { auth, db } from '../lib/firebase'

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
  /** compte de démonstration hors ligne (pas de Firebase) */
  demo?: boolean
}

export type RegisterResult = 'ok' | 'exists' | 'badcode' | 'weak' | 'error'
export type LoginResult = 'ok' | 'invalid' | 'tooMany' | 'error'

export const ROLE_LABEL: Record<Role, string> = { eleve: 'Élève', parent: 'Parent / tuteur', organisation: 'Organisation', organisateur: 'Organisateur' }

/* Le code organisateur n’est PAS dans l’application : il est vérifié par les règles Firestore (firestore.rules). */

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
  // compte (Firebase Authentication + profil Firestore ; comptes démo hors ligne)
  user: Account | null
  authReady: boolean
  register: (a: Omit<Account, 'id' | 'createdAt' | 'demo'>, password: string, orgCode?: string) => Promise<RegisterResult>
  login: (email: string, password: string) => Promise<LoginResult>
  resetPassword: (email: string) => Promise<boolean>
  demoLogin: (role: Role) => void
  logout: () => void
  isOrganizer: boolean
  // boutique (Firestore, modifiable par les organisateurs)
  products: Product[]
  addProduct: (p: Product) => Promise<boolean>
  updateProduct: (id: string, patch: Partial<Product>) => Promise<boolean>
  removeProduct: (id: string) => Promise<boolean>
}

const clean = <T,>(o: T) => JSON.parse(JSON.stringify(o)) as T
const errCode = (e: unknown) => (e as { code?: string })?.code ?? ''

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
  const [authReady, setAuthReady] = useState(false)
  const [liveProducts, setLiveProducts] = useState<Product[] | null>(null)
  const [demoProducts, setDemoProducts] = useState<Product[]>(PRODUCTS)
  const registering = useRef(false)
  const tid = useRef(0)

  const toast = useCallback((message: string, tone: Toast['tone'] = 'gold') => {
    const id = ++tid.current
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  // Session Firebase : restaure le compte et son profil au chargement
  useEffect(
    () =>
      onAuthStateChanged(auth, async (fb) => {
        if (!fb) {
          setUser((u) => (u?.demo ? u : null))
          setAuthReady(true)
          return
        }
        if (registering.current) return
        try {
          const snap = await getDoc(doc(db, 'users', fb.uid))
          if (snap.exists()) {
            const d = snap.data()
            setUser({
              id: fb.uid,
              role: d.role,
              firstName: d.firstName,
              lastName: d.lastName,
              email: d.email,
              details: d.details ?? {},
              createdAt: d.createdAt?.toDate?.().toISOString().slice(0, 10) ?? '',
            })
            setMyTracks(d.musiques ?? [])
          }
        } catch {
          /* hors ligne : on garde l’état actuel */
        }
        setAuthReady(true)
      }),
    [],
  )

  // Boutique partagée (lecture publique)
  useEffect(
    () =>
      onSnapshot(
        collection(db, 'produits'),
        (snap) =>
          setLiveProducts(
            snap.docs
              .map((d) => ({ ...(d.data() as Product & { ordre?: number }), id: d.id }))
              .sort((a, b) => ((a as { ordre?: number }).ordre ?? 0) - ((b as { ordre?: number }).ordre ?? 0)),
          ),
        () => setLiveProducts(null),
      ),
    [],
  )

  // Démo : les autres compteurs bougent doucement pour donner vie au classement
  useEffect(() => {
    const t = setInterval(() => {
      const pick = TALENTS[Math.floor(Math.random() * TALENTS.length)].id
      setExtra((e) => ({ ...e, [pick + '#crowd']: (e[pick + '#crowd'] ?? 0) + 1 }))
    }, 4500)
    return () => clearInterval(t)
  }, [])

  /** La première modification d’un organisateur copie le catalogue de départ dans Firestore */
  const seed = async () => {
    if (liveProducts && liveProducts.length) return
    const batch = writeBatch(db)
    PRODUCTS.forEach((p, i) => batch.set(doc(db, 'produits', p.id), clean({ ...p, ordre: i })))
    await batch.commit()
  }

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
      toggleTrack: (id) => {
        const had = myTracks.includes(id)
        setMyTracks((m) => (had ? m.filter((x) => x !== id) : [...m, id]))
        if (user && !user.demo) updateDoc(doc(db, 'users', user.id), { musiques: had ? arrayRemove(id) : arrayUnion(id) }).catch(() => {})
      },
      uploads,
      addUpload: (t) => setUploads((u) => [t, ...u]),
      user,
      authReady,
      register: async (a, password, orgCode) => {
        registering.current = true
        try {
          const cred = await createUserWithEmailAndPassword(auth, a.email.trim(), password)
          const profile = {
            role: a.role,
            firstName: a.firstName,
            lastName: a.lastName,
            email: cred.user.email,
            details: a.details,
            musiques: [],
            createdAt: serverTimestamp(),
            ...(a.role === 'organisateur' ? { orgCode: (orgCode ?? '').trim().toUpperCase() } : {}),
          }
          try {
            await setDoc(doc(db, 'users', cred.user.uid), profile)
          } catch (e) {
            await deleteUser(cred.user).catch(() => {})
            return errCode(e) === 'permission-denied' && a.role === 'organisateur' ? 'badcode' : 'error'
          }
          setUser({ ...a, email: cred.user.email ?? a.email, id: cred.user.uid, createdAt: new Date().toISOString().slice(0, 10) })
          setMyTracks([])
          return 'ok'
        } catch (e) {
          const c = errCode(e)
          return c === 'auth/email-already-in-use' ? 'exists' : c === 'auth/weak-password' ? 'weak' : 'error'
        } finally {
          registering.current = false
          setAuthReady(true)
        }
      },
      login: async (email, password) => {
        try {
          await signInWithEmailAndPassword(auth, email.trim(), password)
          return 'ok'
        } catch (e) {
          const c = errCode(e)
          if (c === 'auth/invalid-credential' || c === 'auth/wrong-password' || c === 'auth/user-not-found' || c === 'auth/invalid-email') return 'invalid'
          if (c === 'auth/too-many-requests') return 'tooMany'
          return 'error'
        }
      },
      resetPassword: async (email) => {
        try {
          await sendPasswordResetEmail(auth, email.trim())
          return true
        } catch (e) {
          // pour ne pas révéler quels courriels ont un compte, on ne signale que les erreurs techniques
          return errCode(e) === 'auth/user-not-found' || errCode(e) === 'auth/invalid-email'
        }
      },
      demoLogin: (role) => {
        if (auth.currentUser) void signOut(auth)
        setUser({ ...DEMO_ACCOUNTS[role], demo: true })
      },
      logout: () => {
        if (user?.demo) setUser(null)
        else void signOut(auth).then(() => setUser(null))
        setMyTracks([])
      },
      isOrganizer: user?.role === 'organisateur',
      products: user?.demo ? demoProducts : liveProducts && liveProducts.length ? liveProducts : PRODUCTS,
      addProduct: async (p) => {
        if (user?.demo) {
          setDemoProducts((x) => [...x, p])
          return true
        }
        try {
          await seed()
          await setDoc(doc(db, 'produits', p.id), clean({ ...p, ordre: Date.now() }))
          return true
        } catch {
          return false
        }
      },
      updateProduct: async (id, patch) => {
        if (user?.demo) {
          setDemoProducts((x) => x.map((p) => (p.id === id ? { ...p, ...patch } : p)))
          return true
        }
        try {
          await seed()
          await updateDoc(doc(db, 'produits', id), clean(patch))
          return true
        } catch {
          return false
        }
      },
      removeProduct: async (id) => {
        setCart((c) => c.filter((i) => i.productId !== id))
        if (user?.demo) {
          setDemoProducts((x) => x.filter((p) => p.id !== id))
          return true
        }
        try {
          await seed()
          await deleteDoc(doc(db, 'produits', id))
          return true
        } catch {
          return false
        }
      },
    }),
    [extra, cart, cartOpen, toasts, toast, splashVisible, tourStep, searchOpen, menuOpen, myTracks, uploads, user, authReady, liveProducts, demoProducts],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp outside provider')
  return c
}
