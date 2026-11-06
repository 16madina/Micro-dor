import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, KeyRound, Lock, Music2, ShoppingBag, Upload, type LucideIcon } from 'lucide-react'
import { SHOWS, UPCOMING } from '../data'
import { MUSIC } from '../data/music'
import { useApp } from '../state/AppState'
import { Button, PageHero } from '../components/ui'

/** Espace organisateur — équipe MICRO D’OR (accès par code) */
export default function Organizer() {
  const { user, isOrganizer, uploads, products, myTracks } = useApp()

  if (!isOrganizer)
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-gold/40 bg-gold/10 text-gold">
          <Lock size={28} />
        </span>
        <h1 className="mt-5 font-display text-[40px] leading-none tracking-wide">Espace réservé</h1>
        <p className="mt-2 text-[14px] text-white/60">
          Cet espace est réservé à l’équipe MICRO D’OR. Crée un compte « organisateur » avec le code fourni par la coordination, ou connecte-toi.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button to="/connexion?mode=inscription&suite=/organisateur">Créer un compte organisateur</Button>
          <Button to="/connexion?suite=/organisateur" variant="dark">
            Se connecter
          </Button>
        </div>
      </div>
    )

  const cards: { icon: LucideIcon; value: number; label: string; to: string; action: string }[] = [
    { icon: Music2, value: MUSIC.length + uploads.length, label: 'Musiques au catalogue', to: '/musiques?ajouter=1', action: 'Ajouter une musique' },
    { icon: ShoppingBag, value: products.length, label: 'Produits en boutique', to: '/boutique?onglet=gestion', action: 'Gérer la boutique' },
    { icon: CalendarDays, value: UPCOMING.length, label: 'Spectacles à venir', to: '/tournee', action: 'Voir la tournée' },
  ]

  return (
    <div>
      <PageHero
        eyebrow="Équipe MICRO D’OR"
        title={
          <>
            Espace <span className="text-gold-metal">organisateur</span>
          </>
        }
        sub={`Bonjour ${user?.firstName}. Gère le catalogue musical, la boutique et suis la saison en un coup d’œil.`}
      >
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11.5px] font-bold text-goldlight">
          <KeyRound size={13} /> {user?.details.equipe ?? 'Organisateur'}
        </span>
      </PageHero>

      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map(({ icon: Icon, value, label, to, action }) => (
          <Link key={label} to={to} className="group rounded-2xl border border-white/[0.08] bg-gradient-to-b from-night2 to-night p-5 transition hover:-translate-y-0.5 hover:border-gold/40">
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                <Icon size={20} />
              </span>
              <ArrowRight size={16} className="text-white/25 transition group-hover:translate-x-0.5 group-hover:text-gold" />
            </div>
            <div className="mt-4 font-display text-[44px] leading-none text-goldlight">{value}</div>
            <div className="text-[12.5px] font-semibold text-white/55">{label}</div>
            <div className="mt-3 text-[13px] font-bold text-gold">{action} →</div>
          </Link>
        ))}
      </div>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.07] bg-night/60 p-5">
          <h2 className="mb-3 font-display text-[26px] leading-none tracking-wide">Actions rapides</h2>
          <div className="space-y-2">
            <Button to="/musiques?ajouter=1" variant="outline" className="w-full !justify-start" icon={<Upload size={16} />}>
              Téléverser un instrumental
            </Button>
            <Button to="/boutique?onglet=gestion" variant="outline" className="w-full !justify-start" icon={<ShoppingBag size={16} />}>
              Modifier les prix ou ajouter un produit
            </Button>
            <Button to="/spectacles" variant="outline" className="w-full !justify-start" icon={<CalendarDays size={16} />}>
              Consulter les {SHOWS.length} spectacles de la saison
            </Button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-night/60 p-5">
          <h2 className="mb-3 font-display text-[26px] leading-none tracking-wide">Droits de l’équipe</h2>
          <ul className="space-y-2 text-[13.5px] text-white/70">
            {[
              'Ajouter des musiques au catalogue « Nos musiques »',
              'Modifier les prix et descriptions de la boutique',
              'Ajouter ou retirer des produits',
              `Sélection personnelle : ${myTracks.length} musique${myTracks.length > 1 ? 's' : ''}`,
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11.5px] leading-relaxed text-white/40">
            Prototype : le code organisateur est vérifié dans le navigateur. En production, il sera vérifié par le serveur et chaque organisateur aura un compte
            nominatif.
          </p>
        </div>
      </section>
    </div>
  )
}
