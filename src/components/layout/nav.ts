import {
  Home,
  School,
  MonitorPlay,
  Star,
  UserRound,
  Heart,
  MapPinned,
  ShieldCheck,
  Handshake,
  ShoppingBag,
  ScrollText,
  GraduationCap,
  Headphones,
  Users,
  Music2,
  KeyRound,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const PRIMARY_NAV: NavItem[] = [
  { to: '/', label: 'Accueil', icon: Home },
  { to: '/ecoles', label: 'Écoles', icon: School },
  { to: '/spectacles', label: 'Spectacles', icon: MonitorPlay },
  { to: '/talents', label: 'Talents', icon: Star },
  { to: '/profil', label: 'Profil', icon: UserRound },
]

export const MORE_NAV: NavItem[] = [
  { to: '/musiques', label: 'Nos musiques', icon: Music2 },
  { to: '/votes', label: 'Votes', icon: Heart },
  { to: '/tournee', label: 'Tournée', icon: MapPinned },
  { to: '/prevention', label: 'Prévention', icon: ShieldCheck },
  { to: '/partenaires', label: 'Partenaires', icon: Handshake },
  { to: '/boutique', label: 'Boutique', icon: ShoppingBag },
  { to: '/reglement', label: 'Règlement', icon: ScrollText },
]

export const SPACES_NAV: NavItem[] = [
  { to: '/eleve', label: 'Espace élève', icon: GraduationCap },
  { to: '/eleve/repetition', label: 'Salle de répétition', icon: Headphones },
  { to: '/parent', label: 'Espace parent', icon: Users },
]

export const ORGANIZER_NAV: NavItem = { to: '/organisateur', label: 'Espace organisateur', icon: KeyRound }

export const isActive = (pathname: string, to: string) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(to + '/'))
