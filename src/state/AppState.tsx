import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInAnonymously,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, increment, onSnapshot, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { PRODUCTS, TALENTS, talentById, type Category, type Product } from '../data'
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

export type EncourageResult = 'added' | 'removed' | 'error'
export type VoteResult = 'ok' | 'needAccount' | 'consent' | 'cap' | 'error'

/** Forfaits de votes (paiement simulé pour l’instant) */
export const VOTE_PACKS = [
  { qty: 1, price: 2, label: '1 vote' },
  { qty: 5, price: 8, label: '5 votes', tag: 'Populaire' },
  { qty: 10, price: 15, label: '10 votes', tag: 'Meilleur prix' },
] as const
/** Plafond de votes par personne et par discipline (aussi vérifié par les règles Firestore) */
export const VOTE_CAP = 10
export interface Ballot {
  total: number
  parts: Record<string, number>
}
const EMPTY_BALLOT: Ballot = { total: 0, parts: {} }

interface AppState {
  // encouragements : ouverts à tous, 1 par personne et par talent, sans effet sur le classement
  supportCount: (talentId: string) => number
  hasSupported: (talentId: string) => boolean
  support: (talentId: string) => Promise<EncourageResult>
  // votes payants : compte requis, forfaits de 1, 5 ou 10, plafond de 10 par discipline, seuls à compter pour le classement
  voteCount: (talentId: string) => number
  ballot: (category: Category) => Ballot
  myVotesFor: (talentId: string) => number
  /** pourquoi la personne ne peut pas encore payer (null si elle peut) */
  voteBlock: 'needAccount' | 'consent' | null
  buyVotes: (talentId: string, qty: number) => Promise<VoteResult>
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

const toggleSet = (s: Set<string>, id: string) => {
  const n = new Set(s)
  if (n.has(id)) n.delete(id)
  else n.add(id)
  return n
}
const clean = <T,>(o: T) => JSON.parse(JSON.stringify(o)) as T
const errCode = (e: unknown) => (e as { code?: string })?.code ?? ''

const Ctx = createContext<AppState | null>(null)

/**
 * Chiffres de départ de la démonstration (fictifs). Les encouragements et votes réels
 * enregistrés dans Firestore s’ajoutent à ces valeurs. Mettre à false avant le lancement réel.
 */
export const DEMO_BASE_COUNTS = true
const BASE_ENC: Record<string, number> = Object.fromEntries(TALENTS.map((t) => [t.id, DEMO_BASE_COUNTS ? t.supports : 0]))
const BASE_VOTES: Record<string, number> = Object.fromEntries(TALENTS.map((t) => [t.id, DEMO_BASE_COUNTS ? Math.round(t.supports * 0.27) : 0]))

export function AppProvider({ children }: { children: ReactNode }) {
  const [live, setLive] = useState<Record<string, { e: number; v: number }>>({})
  const [encouraged, setEncouraged] = useState<Set<string>>(new Set())
  const [myVotes, setMyVotes] = useState<Partial<Record<Category, Ballot>>>({})
  const [demoDelta, setDemoDelta] = useState<Record<string, { e: number; v: number }>>({})
  const [fbUid, setFbUid] = useState<string | null>(null)
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
        setFbUid(fb?.uid ?? null)
        if (!fb) {
          setUser((u) => (u?.demo ? u : null))
          setAuthReady(true)
          return
        }
        if (registering.current) return
        if (fb.isAnonymous) {
          setAuthReady(true)
          return
        }
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

  // Compteurs partagés (encouragements et votes) en temps réel
  useEffect(
    () =>
      onSnapshot(
        collection(db, 'talents'),
        (snap) => {
          const m: Record<string, { e: number; v: number }> = {}
          snap.docs.forEach((d) => (m[d.id] = { e: d.data().encouragements ?? 0, v: d.data().votes ?? 0 }))
          setLive(m)
        },
        () => {},
      ),
    [],
  )

  // Mes encouragements et mes votes (compte réel ou anonyme)
  useEffect(() => {
    if (!fbUid) {
      setEncouraged(new Set())
      setMyVotes({})
      return
    }
    let alive = true
    ;(async () => {
      const enc = await Promise.all(
        TALENTS.map((t) =>
          getDoc(doc(db, 'talents', t.id, 'fans', fbUid))
            .then((d) => (d.exists() ? t.id : null))
            .catch(() => null),
        ),
      )
      const cats: Category[] = ['chant', 'slam', 'rap', 'danse', 'theatre']
      const votes = await Promise.all(
        cats.map((c) =>
          getDoc(doc(db, 'bulletins', `${c}_${fbUid}`))
            .then((d) => (d.exists() ? ([c, { total: d.data().total ?? 0, parts: d.data().parts ?? {} }] as const) : null))
            .catch(() => null),
        ),
      )
      if (!alive) return
      setEncouraged(new Set(enc.filter(Boolean) as string[]))
      setMyVotes(Object.fromEntries(votes.filter(Boolean) as (readonly [Category, Ballot])[]))
    })()
    return () => {
      alive = false
    }
  }, [fbUid])

  /** Identité Firebase pour encourager : compte réel, sinon compte anonyme créé à la volée */
  const ensureUid = async () => auth.currentUser?.uid ?? (await signInAnonymously(auth)).user.uid

  /** Crée le document de compteurs d’un talent au premier encouragement / vote */
  const ensureTalent = async (id: string) => {
    if (live[id]) return
    const ref = doc(db, 'talents', id)
    const snap = await getDoc(ref)
    if (!snap.exists()) await setDoc(ref, { category: talentById(id).category, encouragements: 0, votes: 0 })
  }

  /** La première modification d’un organisateur copie le catalogue de départ dans Firestore */
  const seed = async () => {
    if (liveProducts && liveProducts.length) return
    const batch = writeBatch(db)
    PRODUCTS.forEach((p, i) => batch.set(doc(db, 'produits', p.id), clean({ ...p, ordre: i })))
    await batch.commit()
  }

  const value = useMemo<AppState>(
    () => ({
      supportCount: (id) => (BASE_ENC[id] ?? 0) + (live[id]?.e ?? 0) + (demoDelta[id]?.e ?? 0),
      hasSupported: (id) => encouraged.has(id),
      support: async (id) => {
        const had = encouraged.has(id)
        if (user?.demo) {
          setEncouraged((s) => toggleSet(s, id))
          setDemoDelta((d) => ({ ...d, [id]: { e: (d[id]?.e ?? 0) + (had ? -1 : 1), v: d[id]?.v ?? 0 } }))
          return had ? 'removed' : 'added'
        }
        setEncouraged((s) => toggleSet(s, id)) // affichage immédiat
        try {
          const uid = await ensureUid()
          await ensureTalent(id)
          const b = writeBatch(db)
          const fan = doc(db, 'talents', id, 'fans', uid)
          if (had) b.delete(fan)
          else b.set(fan, { at: serverTimestamp() })
          b.update(doc(db, 'talents', id), { encouragements: increment(had ? -1 : 1) })
          await b.commit()
          return had ? 'removed' : 'added'
        } catch {
          setEncouraged((s) => toggleSet(s, id)) // annule l’affichage
          return 'error'
        }
      },
      voteCount: (id) => (BASE_VOTES[id] ?? 0) + (live[id]?.v ?? 0) + (demoDelta[id]?.v ?? 0),
      ballot: (c) => myVotes[c] ?? EMPTY_BALLOT,
      myVotesFor: (id) => myVotes[talentById(id).category]?.parts[id] ?? 0,
      voteBlock: !user ? 'needAccount' : user.details.consentementParental === 'en_attente' ? 'consent' : null,
      buyVotes: async (id, qty) => {
        const cat = talentById(id).category
        if (!user) return 'needAccount'
        if (user.details.consentementParental === 'en_attente') return 'consent'
        const prev = myVotes[cat] ?? EMPTY_BALLOT
        if (!VOTE_PACKS.some((p) => p.qty === qty) || prev.total + qty > VOTE_CAP) return 'cap'
        const next: Ballot = { total: prev.total + qty, parts: { ...prev.parts, [id]: (prev.parts[id] ?? 0) + qty } }
        if (user.demo) {
          setMyVotes((m) => ({ ...m, [cat]: next }))
          setDemoDelta((d) => ({ ...d, [id]: { e: d[id]?.e ?? 0, v: (d[id]?.v ?? 0) + qty } }))
          return 'ok'
        }
        const uid = auth.currentUser?.uid
        if (!uid) return 'needAccount'
        try {
          await ensureTalent(id)
          const b = writeBatch(db)
          b.set(doc(db, 'bulletins', `${cat}_${uid}`), { uid, category: cat, total: next.total, parts: next.parts, dernier: id, at: serverTimestamp() })
          b.update(doc(db, 'talents', id), { votes: increment(qty) })
          await b.commit()
          setMyVotes((m) => ({ ...m, [cat]: next }))
          return 'ok'
        } catch {
          return 'error'
        }
      },
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
        setEncouraged(new Set())
        setMyVotes({})
      },
      logout: () => {
        if (user?.demo) setUser(null)
        else void signOut(auth).then(() => setUser(null))
        setMyTracks([])
        setEncouraged(new Set())
        setMyVotes({})
        setDemoDelta({})
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
    [live, encouraged, myVotes, demoDelta, cart, cartOpen, toasts, toast, splashVisible, tourStep, searchOpen, menuOpen, myTracks, uploads, user, authReady, liveProducts, demoProducts],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp outside provider')
  return c
}
