import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  CheckCheck,
  ClipboardCheck,
  Eye,
  EyeOff,
  HeartHandshake,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  MonitorPlay,
  RotateCcw,
  School,
  Sparkles,
  TriangleAlert,
  X,
  type LucideIcon,
} from 'lucide-react'
import { PHOTOS, fmtDate, fmtDay, schoolById, showById, showsOfSchool, talentById, type Show } from '../data'
import { useApp } from '../state/AppState'
import Portrait from '../components/art/Portrait'
import SchoolArt from '../components/art/SchoolArt'
import StageArt from '../components/art/StageArt'
import { Button, DemoPill, StatusBadge, cx } from '../components/ui'
import { BlockTitle, DemoNotice, RowItem, Toggle, scrollToId } from '../components/spaces/SpaceUI'

type Answer = 'pending' | 'accepted' | 'declined'

const INVITES = [
  { id: 'i1', title: 'Finale locale — Les Lumières', detail: 'Places réservées aux familles · Aujourd’hui, 19 h 30', to: '/spectacles/s1' },
  { id: 'i2', title: 'Grande finale MICRO D’OR', detail: '2 places famille (simulées) · 12 févr. 2027, 19 h 30', to: '/spectacles/s9' },
  { id: 'i3', title: 'Rencontre parents et mentors', detail: 'Accompagner un jeune artiste · 24 nov. 2026, 18 h 30', to: '/prevention' },
]

const PERMS: { id: 'image' | 'diffusion' | 'vote'; title: string; desc: string }[] = [
  { id: 'image', title: 'Droit à l’image', desc: 'Affichage de la photo et des visuels de Maya sur la plateforme.' },
  { id: 'diffusion', title: 'Diffusion des prestations', desc: 'Présentation des spectacles de Maya en direct et en rediffusion.' },
  { id: 'vote', title: 'Participation au vote du public', desc: 'Le profil de Maya peut recevoir des soutiens du public.' },
]
const DEFAULT_PERMS = { image: true, diffusion: true, vote: false }

interface Notif {
  id: string
  icon: LucideIcon
  text: string
  when: string
  to?: string
  anchor?: string
}
const NOTIFS: Notif[] = [
  { id: 'n1', icon: MonitorPlay, text: 'Maya L. est au programme de la finale locale ce soir (démo)', when: 'Il y a 20 min', to: '/spectacles/s1' },
  { id: 'n2', icon: Mail, text: 'Nouvelle invitation : Grande finale MICRO D’OR', when: 'Il y a 2 h', anchor: 'invitations' },
  { id: 'n3', icon: ClipboardCheck, text: 'Rappel : une autorisation reste à confirmer', when: 'Hier', anchor: 'autorisations' },
  { id: 'n4', icon: HeartHandshake, text: 'Nouvelle capsule : Le trac, mon allié', when: 'Il y a 3 jours', to: '/prevention' },
  { id: 'n5', icon: Sparkles, text: 'Maya L. a reçu de nouveaux soutiens (simulés)', when: 'Il y a 4 jours', to: '/talents/maya-l' },
]

function ShowRow({ show, featuring }: { show: Show; featuring: boolean }) {
  const d = fmtDay(show.date)
  return (
    <Link to={`/spectacles/${show.id}`} className="group flex items-center gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 transition hover:border-gold/35 hover:bg-white/[0.045]">
      <div className="w-14 shrink-0 rounded-xl border border-gold/25 bg-gradient-to-b from-gold/15 to-transparent py-2 text-center">
        <div className="font-display text-[26px] leading-none text-goldlight">{d.day}</div>
        <div className="text-[10.5px] font-bold uppercase text-white/55">{d.month}</div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={show.status} />
          {featuring && <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-goldlight">Maya au programme</span>}
        </div>
        <div className="truncate text-[15px] font-bold">{show.title}</div>
        <div className="flex items-center gap-1 truncate text-[12px] text-white/50">
          <MapPin size={11} />
          {show.venue} · {fmtDate(show.date)}, {show.time}
        </div>
      </div>
      <ArrowRight size={18} className="shrink-0 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-gold" />
    </Link>
  )
}

export default function Parent() {
  const { toast } = useApp()
  const nav = useNavigate()
  const maya = talentById('maya-l')
  const school = schoolById('lumieres')
  const finale = showById('s9')
  const shows = [...showsOfSchool('lumieres'), ...(finale ? [finale] : [])]
    .filter((s, i, a) => a.findIndex((x) => x.id === s.id) === i && s.status !== 'replay')
    .sort((a, b) => a.date.localeCompare(b.date))

  const [answers, setAnswers] = useState<Record<string, Answer>>({ i1: 'accepted', i2: 'pending', i3: 'pending' })
  const [perms, setPerms] = useState<Record<string, boolean>>(DEFAULT_PERMS)
  const [read, setRead] = useState<Record<string, boolean>>({ n4: true, n5: true })
  const [preview, setPreview] = useState(false)

  const pending = Object.values(answers).filter((a) => a === 'pending').length
  const granted = Object.values(perms).filter(Boolean).length
  const unread = NOTIFS.filter((n) => !read[n.id]).length

  const answer = (id: string, a: Answer) => {
    setAnswers((m) => ({ ...m, [id]: a }))
    if (a === 'accepted') toast('Invitation acceptée (démo) — aucune réservation réelle')
    if (a === 'declined') toast('Invitation déclinée (démo)', 'info')
  }

  const openNotif = (n: Notif) => {
    setRead((r) => ({ ...r, [n.id]: true }))
    if (n.to) nav(n.to)
    else if (n.anchor) scrollToId(n.anchor)
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* En-tête */}
      <div className="animate-fadeUp">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="eyebrow">Espace parent</span>
          <DemoPill>Espace simulé</DemoPill>
        </div>
        <h1 className="font-display text-[40px] leading-[0.95] tracking-wide lg:text-[60px]">
          Espace parent <span className="text-gold-metal">(Démonstration)</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/65">
          Un endroit calme pour suivre le parcours de votre jeune : ses spectacles, vos invitations et vos choix d’autorisation, en toute clarté.
        </p>
      </div>

      {/* Carte d’accueil */}
      <div className="relative animate-fadeUp overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-night2 via-night to-ink p-5 shadow-card lg:p-7" style={{ animationDelay: '60ms' }}>
        <div className="pointer-events-none absolute -left-16 -top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-stage/25 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-gold-metal p-[2px] shadow-gold">
              <span className="grid h-full w-full place-items-center rounded-full bg-night2 font-display text-[30px] tracking-wide text-goldlight">MT</span>
            </span>
            <div>
              <div className="font-display text-[36px] leading-none tracking-wide">Mme Tremblay</div>
              <div className="mt-1 text-[14px] text-white/75">
                Parent de : <span className="font-bold text-white">Maya L.</span>
              </div>
              <div className="text-[13px] text-white/55">École des Lumières · {school.city}</div>
            </div>
          </div>
          <Link to={`/talents/${maya.id}`} className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-ink/40 p-2.5 pr-4 transition hover:border-gold/40">
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
              <Portrait look={maya.look} category={maya.category} seed={maya.id} className="absolute inset-0 h-full w-full" />
            </span>
            <span>
              <span className="block text-[14px] font-bold">Maya L.</span>
              <span className="block text-[12px] text-gold">Chant · Finaliste (démo)</span>
            </span>
            <ArrowRight size={16} className="ml-1 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-gold" />
          </Link>
        </div>
        <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4">
          {[
            { v: shows.length, l: 'Spectacles à venir' },
            { v: pending, l: pending > 1 ? 'Invitations en attente' : 'Invitation en attente' },
            { v: `${granted}/3`, l: 'Autorisations accordées' },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-display text-[30px] leading-none text-goldlight">{s.v}</div>
              <div className="mt-1 text-[10.5px] font-semibold uppercase leading-tight tracking-wider text-white/45">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <DemoNotice title="Prototype rassurant, mais fictif" tone="violet">
        Mme Tremblay et Maya L. sont des personnages de démonstration. Aucun compte réel, aucune authentification, aucune donnée personnelle collectée : vos choix ci-dessous ne sont ni enregistrés ni transmis.
      </DemoNotice>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
        <div className="min-w-0 space-y-6">
          {/* Aperçu (maquette client) */}
          <div className="card divide-y divide-white/[0.06] overflow-hidden">
            <RowItem icon={CalendarDays} title="Prochains spectacles" sub={`${shows.length} à venir · prochain : ${shows[0] ? fmtDate(shows[0].date) : '—'}`} onClick={() => scrollToId('spectacles')} />
            <RowItem
              icon={Mail}
              title="Invitations"
              sub={pending ? `${pending} en attente de réponse` : 'Toutes les invitations ont une réponse'}
              onClick={() => scrollToId('invitations')}
              right={pending > 0 ? <span className="grid h-6 min-w-6 place-items-center rounded-full bg-gold px-1.5 text-[11px] font-extrabold text-ink">{pending}</span> : undefined}
            />
            <RowItem icon={ClipboardCheck} title="Autorisations parentales" sub={`${granted} sur 3 accordées (démo)`} onClick={() => scrollToId('autorisations')} />
            <RowItem icon={Lock} title="Diffusions privées (démo)" sub="Fonctionnalité simulée, non opérationnelle" onClick={() => scrollToId('diffusions')} />
            <RowItem
              icon={Bell}
              title="Notifications"
              sub={unread ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Vous êtes à jour'}
              onClick={() => scrollToId('notifications')}
              right={unread > 0 ? <span className="h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_8px_#F4D78C]" /> : undefined}
            />
          </div>

          {/* Spectacles */}
          <section id="spectacles" className="scroll-mt-24">
            <BlockTitle icon={CalendarDays} aside={<Link to="/spectacles" className="text-[12.5px] font-semibold text-gold hover:text-goldlight">Tout voir →</Link>}>
              Prochains spectacles
            </BlockTitle>
            <div className="space-y-2.5">
              {shows.map((s) => (
                <ShowRow key={s.id} show={s} featuring={s.lineup.includes(maya.id)} />
              ))}
            </div>
          </section>

          {/* Invitations */}
          <section id="invitations" className="card scroll-mt-24 p-4 lg:p-5">
            <BlockTitle icon={Mail} aside={<span className="text-[10.5px] font-semibold uppercase tracking-wider text-white/40">Réponses simulées</span>}>
              Invitations
            </BlockTitle>
            <div className="space-y-2.5">
              {INVITES.map((inv) => {
                const a = answers[inv.id]
                return (
                  <div key={inv.id} className={cx('rounded-2xl border p-3.5 transition', a === 'accepted' ? 'border-gold/35 bg-gold/[0.05]' : a === 'declined' ? 'border-white/[0.05] bg-white/[0.015]' : 'border-white/[0.08] bg-white/[0.03]')}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link to={inv.to} className={cx('text-[14.5px] font-bold hover:text-goldlight', a === 'declined' && 'text-white/50')}>
                          {inv.title}
                        </Link>
                        <div className="mt-0.5 text-[12px] text-white/50">{inv.detail}</div>
                      </div>
                      {a !== 'pending' && (
                        <span className={cx('inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold', a === 'accepted' ? 'bg-gold-soft text-ink' : 'bg-white/10 text-white/60')}>
                          {a === 'accepted' ? <Check size={12} /> : <X size={12} />}
                          {a === 'accepted' ? 'Acceptée' : 'Déclinée'}
                        </span>
                      )}
                    </div>
                    {a === 'pending' ? (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button size="sm" icon={<Check size={15} />} onClick={() => answer(inv.id, 'accepted')}>
                          Accepter
                        </Button>
                        <Button size="sm" variant="dark" icon={<X size={15} />} onClick={() => answer(inv.id, 'declined')}>
                          Décliner
                        </Button>
                      </div>
                    ) : (
                      <button onClick={() => answer(inv.id, 'pending')} className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-gold hover:text-goldlight">
                        <RotateCcw size={12} /> Modifier ma réponse
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Notifications */}
          <section id="notifications" className="card scroll-mt-24 p-4 lg:p-5">
            <BlockTitle
              icon={Bell}
              aside={
                <button
                  onClick={() => {
                    setRead(Object.fromEntries(NOTIFS.map((n) => [n.id, true])))
                    toast('Notifications marquées comme lues', 'info')
                  }}
                  disabled={unread === 0}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-gold transition hover:text-goldlight disabled:text-white/30"
                >
                  <CheckCheck size={14} /> Tout marquer comme lu
                </button>
              }
            >
              Notifications
            </BlockTitle>
            <ul className="-mx-2">
              {NOTIFS.map((n) => {
                const Icon = n.icon
                const isUnread = !read[n.id]
                return (
                  <li key={n.id}>
                    <button onClick={() => openNotif(n)} className="flex w-full items-start gap-3 rounded-xl px-2 py-2.5 text-left transition hover:bg-white/[0.04]">
                      <span className={cx('mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full', isUnread ? 'bg-gold/15 text-goldlight' : 'bg-white/[0.05] text-white/45')}>
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cx('block text-[13.5px] leading-snug', isUnread ? 'font-bold text-white' : 'text-white/60')}>{n.text}</span>
                        <span className="text-[11px] text-white/40">{n.when}</span>
                      </span>
                      {isUnread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold shadow-[0_0_8px_#F4D78C]" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>

        <aside className="min-w-0 space-y-6">
          {/* École associée */}
          <section className="card overflow-hidden">
            <div className="relative aspect-[16/8]">
              <SchoolArt school={school} className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <School size={16} className="text-gold" />
                <span className="eyebrow">École associée</span>
              </div>
            </div>
            <div className="p-4 pt-2">
              <div className="text-[16px] font-extrabold">{school.name}</div>
              <div className="text-[12.5px] text-white/55">
                {school.city} · « {school.tagline} »
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button size="sm" variant="dark" to={`/ecoles/${school.id}`}>
                  Voir l’école
                </Button>
                <Button size="sm" variant="dark" icon={<MessageCircle size={14} />} onClick={() => toast('Messagerie non disponible dans ce prototype', 'info')}>
                  Contacter
                </Button>
              </div>
            </div>
          </section>

          {/* Autorisations */}
          <section id="autorisations" className="card scroll-mt-24 p-4 lg:p-5">
            <BlockTitle icon={ClipboardCheck}>Autorisations parentales</BlockTitle>
            <p className="-mt-1 mb-3 text-[12px] text-white/45">Interrupteurs de démonstration : état local, effacé en quittant la page.</p>
            <div className="space-y-2.5">
              {PERMS.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold">{p.title}</div>
                    <div className="mt-0.5 text-[12px] leading-snug text-white/50">{p.desc}</div>
                  </div>
                  <Toggle
                    checked={perms[p.id]}
                    label={p.title}
                    onChange={(v) => {
                      setPerms((m) => ({ ...m, [p.id]: v }))
                      toast(`${p.title} : ${v ? 'accordé' : 'retiré'} (démo, rien n’est enregistré)`, 'info')
                    }}
                  />
                </div>
              ))}
            </div>
            <button onClick={() => setPerms(DEFAULT_PERMS)} className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-gold hover:text-goldlight">
              <RotateCcw size={12} /> Rétablir les choix par défaut
            </button>
          </section>

          {/* Diffusions privées */}
          <section id="diffusions" className="card scroll-mt-24 overflow-hidden">
            <div className="p-4 pb-3 lg:p-5 lg:pb-3">
              <BlockTitle icon={Lock}>Diffusions privées (simulées)</BlockTitle>
              <div className="flex items-start gap-2.5 rounded-xl border border-[#F2A65A]/40 bg-[#F2A65A]/[0.08] px-3 py-2.5">
                <TriangleAlert size={16} className="mt-0.5 shrink-0 text-[#FFC98A]" />
                <p className="text-[12.5px] font-semibold leading-snug text-[#FFC98A]">Fonctionnalité simulée : non sécurisée, non opérationnelle dans ce prototype.</p>
              </div>
            </div>
            <div className="relative mx-4 aspect-[16/9] overflow-hidden rounded-2xl border border-white/[0.08] lg:mx-5">
              <StageArt seed="parent-prive" photo={PHOTOS.show('s1')} palette="violet" pose="singer" className={cx('absolute inset-0 h-full w-full transition duration-700', !preview && 'scale-110 blur-md')} />
              <div className={cx('absolute inset-0 transition', preview ? 'bg-gradient-to-t from-ink/80 to-transparent' : 'bg-ink/50')} />
              {preview ? (
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <span className="rounded-md bg-white/15 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur">Aperçu d’interface · aucune vidéo réelle</span>
                  <div className="mt-1.5 text-[13.5px] font-bold">Répétition générale — accès famille (fictif)</div>
                </div>
              ) : (
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-ink/60 backdrop-blur">
                      <Lock size={20} className="text-white/70" />
                    </span>
                    <div className="mt-2 text-[12px] font-semibold text-white/70">Maquette d’interface</div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 lg:p-5">
              <Button size="sm" variant="outline" className="w-full" icon={preview ? <EyeOff size={15} /> : <Eye size={15} />} onClick={() => setPreview((p) => !p)}>
                {preview ? 'Masquer l’aperçu' : 'Voir l’aperçu de l’interface'}
              </Button>
              <p className="mt-3 text-[11.5px] leading-relaxed text-white/45">
                Une version réelle exigerait notamment une authentification des familles, le consentement des parents et des écoles, ainsi qu’un hébergement vidéo protégé. Rien de cela n’est mis en place ici.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
