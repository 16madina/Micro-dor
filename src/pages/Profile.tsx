import { Link, Navigate } from 'react-router-dom'
import { ArrowRight, KeyRound, LogOut, Compass, FlaskConical, GraduationCap, Headphones, Heart, PlayCircle, ShoppingBag, Users, type LucideIcon } from 'lucide-react'
import { SCHOOLS, TALENTS } from '../data'
import { ROLE_LABEL, useApp } from '../state/AppState'
import { TalentCard } from '../components/cards'
import { Button, DemoPill, cx } from '../components/ui'
import { BlockTitle } from '../components/spaces/SpaceUI'

const LINKS: { to: string; label: string; sub: string; icon: LucideIcon; accent?: boolean }[] = [
  { to: '/eleve', label: 'Espace élève', sub: 'Répétitions, ressources, événements', icon: GraduationCap, accent: true },
  { to: '/parent', label: 'Espace parent', sub: 'Spectacles, invitations, autorisations', icon: Users },
  { to: '/eleve/repetition', label: 'Salle de répétition', sub: 'Beats, téléprompteur, prises simulées', icon: Headphones },
  { to: '/votes', label: 'Votes', sub: 'Soutenir les talents (simulé)', icon: Heart },
  { to: '/boutique', label: 'Boutique', sub: 'Produits dérivés de démonstration', icon: ShoppingBag },
]

export default function Profile() {
  const { hasSupported, replaySplash, startTour, cart, setCartOpen, user, logout, toast, authReady } = useApp()
  if (!user && !authReady) return <div className="py-24 text-center text-white/50">Chargement du profil…</div>
  if (!user) return <Navigate to="/connexion?suite=/profil" replace />
  const initials = (user.firstName[0] ?? '') + (user.lastName[0] ?? '')
  const school = SCHOOLS.find((s) => s.id === user.details.ecole)
  const subtitle =
    user.role === 'organisateur'
      ? `Équipe MICRO D’OR · ${user.details.equipe ?? ''}`
      : user.role === 'organisation'
      ? [user.details.fonction, user.details.organisation].filter(Boolean).join(' · ')
      : user.role === 'parent'
        ? `Parent de ${user.details.enfant ?? '—'}${school ? ' · ' + school.name : ''}`
        : [user.details.niveau, school?.name].filter(Boolean).join(' · ')
  const supported = TALENTS.filter((t) => hasSupported(t.id))
  const inCart = cart.reduce((a, i) => a + i.qty, 0)

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Carte profil */}
      <div className="gold-border relative animate-fadeUp overflow-hidden rounded-3xl p-5 shadow-card lg:p-7">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-stage/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gold-metal p-[2px] shadow-gold lg:h-24 lg:w-24">
              <span className="grid h-full w-full place-items-center rounded-full bg-night2 font-display text-[34px] uppercase tracking-wide text-goldlight lg:text-[40px]">{initials}</span>
            </span>
            <div>
              <div className="eyebrow mb-1">Mon profil</div>
              <h1 className="font-display text-[42px] leading-none tracking-wide lg:text-[56px]">
                {user.firstName} {user.lastName}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-white/60">
                <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-bold text-goldlight">{ROLE_LABEL[user.role]}</span>
                {subtitle && <span>{subtitle}</span>}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px] text-white/45">
                {user.email}
                {user.demo && <DemoPill>Compte de démonstration (hors ligne)</DemoPill>}
                <button
                  onClick={() => {
                    logout()
                    toast('Tu es déconnecté', 'info')
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-[11.5px] font-bold text-white/70 hover:border-gold/50 hover:text-white"
                >
                  <LogOut size={12} /> Se déconnecter
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.07] bg-ink/40 px-3 py-3 sm:w-[260px]">
            <div className="text-center">
              <div className="font-display text-[30px] leading-none text-goldlight">{supported.length}</div>
              <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-wider text-white/45">Talents soutenus</div>
            </div>
            <button onClick={() => setCartOpen(true)} className="rounded-xl text-center transition hover:bg-white/5">
              <div className="font-display text-[30px] leading-none text-goldlight">{inCart}</div>
              <div className="mt-1 text-[10.5px] font-semibold uppercase tracking-wider text-white/45">Au panier</div>
            </button>
          </div>
        </div>
      </div>

      {/* Accès rapides */}
      <section>
        <BlockTitle icon={Compass}>Accès rapides</BlockTitle>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {(user.role === 'organisateur' ? [{ to: '/organisateur', label: 'Espace organisateur', sub: 'Musiques, boutique, saison', icon: KeyRound, accent: true }, ...LINKS.filter((l) => l.to !== '/eleve/repetition').map((l) => ({ ...l, accent: false }))] : LINKS).map(({ to, label, sub, icon: Icon, accent }, i) => (
            <Link
              key={to}
              to={to}
              className={cx(
                'group relative animate-fadeUp overflow-hidden rounded-2xl border p-4 transition duration-300 hover:-translate-y-0.5',
                accent ? 'col-span-2 border-gold/40 bg-gradient-to-br from-gold/15 via-night2 to-night shadow-gold lg:col-span-1' : 'border-white/[0.08] bg-gradient-to-b from-night2 to-night hover:border-gold/40',
              )}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className={cx('grid h-11 w-11 place-items-center rounded-xl border', accent ? 'border-transparent bg-gold-soft text-ink' : 'border-gold/25 bg-gold/10 text-goldlight')}>
                <Icon size={20} />
              </span>
              <div className="mt-3 text-[15px] font-extrabold leading-tight">{label}</div>
              <div className="mt-0.5 text-[12px] leading-snug text-white/50">{sub}</div>
              <ArrowRight size={16} className="absolute right-4 top-4 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-gold" />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        {/* Talents soutenus */}
        <section className="min-w-0">
          <BlockTitle icon={Heart} aside={supported.length > 0 ? <Link to="/votes" className="text-[12.5px] font-semibold text-gold hover:text-goldlight">Voter encore →</Link> : undefined}>
            Mes talents soutenus
          </BlockTitle>
          {supported.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {supported.map((t) => (
                <TalentCard key={t.id} talent={t} />
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center px-6 py-10 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/30 bg-gold/10">
                <Heart size={28} className="text-gold" />
              </span>
              <div className="mt-4 font-display text-[28px] leading-none tracking-wide">Aucun talent soutenu pour l’instant</div>
              <p className="mt-2 max-w-sm text-[13px] text-white/55">Découvrez les finalistes et offrez-leur un soutien (simulé) : ils apparaîtront ici.</p>
              <Button to="/votes" className="mt-5" icon={<Heart size={16} />}>
                Aller voter
              </Button>
            </div>
          )}
        </section>

        {/* Paramètres du prototype */}
        <section className="card relative h-fit overflow-hidden p-4 lg:p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-stage/25 blur-3xl" />
          <BlockTitle icon={FlaskConical}>Paramètres du prototype</BlockTitle>
          <div className="relative space-y-2">
            <Button variant="dark" className="w-full justify-start" icon={<PlayCircle size={18} className="text-gold" />} onClick={replaySplash}>
              Revoir l’intro
            </Button>
            <Button variant="dark" className="w-full justify-start" icon={<Compass size={18} className="text-gold" />} onClick={startTour}>
              Lancer la visite guidée
            </Button>
          </div>
          <ul className="relative mt-4 space-y-2 border-t border-white/[0.06] pt-4 text-[12.5px] leading-relaxed text-white/55">
            {[
              'Données entièrement fictives : écoles, talents, spectacles et chiffres sont inventés.',
              user.demo ? 'Compte de démonstration : il reste dans cette fenêtre, rien n’est envoyé à un serveur.' : 'Compte réel : connexion sécurisée par Firebase, profil hébergé à Montréal.',
              'Votes et panier : encore simulés, ils restent dans cette page. Ton profil et ta sélection de musiques sont enregistrés avec ton compte.',
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {t}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
