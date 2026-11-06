import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, Eye, EyeOff, GraduationCap, KeyRound, Lock, ShieldCheck, Users } from 'lucide-react'
import { CATEGORY_LABEL, PHOTOS, REGIONS, SCHOOLS, type Category } from '../data'
import { ROLE_LABEL, useApp, type Role } from '../state/AppState'
import { MicEmblem, Wordmark } from '../components/art/Logo'
import { Button, cx } from '../components/ui'

const INPUT =
  'h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-[15px] text-white outline-none transition placeholder:text-white/30 focus:border-gold/60 focus:bg-white/[0.06]'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const ROLES: { role: Role; icon: typeof Users; title: string; text: string }[] = [
  { role: 'eleve', icon: GraduationCap, title: 'Je suis élève', text: 'Je participe ou je veux participer aux spectacles de mon école.' },
  { role: 'parent', icon: Users, title: 'Je suis parent ou tuteur', text: 'Mon enfant participe : je suis ses spectacles et je gère ses autorisations.' },
  { role: 'organisation', icon: Building2, title: 'Je représente une organisation', text: 'École, centre de services scolaire, organisme jeunesse, partenaire ou média.' },
  { role: 'organisateur', icon: KeyRound, title: 'Je suis organisateur', text: 'Équipe MICRO D’OR : musiques, boutique et événements. Code requis.' },
]
const TEAMS = ['Coordination de la tournée', 'Production et technique', 'Musique et répertoire', 'Boutique et produits', 'Communication', 'Prévention et ateliers']
const ORG_TYPES = ['École secondaire', 'Centre de services scolaire', 'Organisme jeunesse', 'Partenaire / commanditaire', 'Média', 'Autre']
const LEVELS = ['Secondaire 1', 'Secondaire 2', 'Secondaire 3', 'Secondaire 4', 'Secondaire 5']
const DISCIPLINES: Category[] = ['chant', 'danse', 'theatre', 'slam', 'rap']
const SPACE: Record<Role, { to: string; label: string }> = {
  eleve: { to: '/eleve', label: 'Aller à mon espace élève' },
  parent: { to: '/parent', label: 'Aller à mon espace parent' },
  organisation: { to: '/partenaires', label: 'Voir l’offre partenaires' },
  organisateur: { to: '/organisateur', label: 'Aller à mon espace organisateur' },
}

function Field({ id, label, error, hint, children, className }: { id: string; label: string; error?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[12.5px] font-bold text-white/70">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-[12px] font-semibold text-[#ff8a9a]">{error}</p> : hint ? <p className="mt-1 text-[11.5px] text-white/40">{hint}</p> : null}
    </div>
  )
}

function Password({ id, value, onChange, placeholder, autoComplete }: { id: string; value: string; onChange: (v: string) => void; placeholder?: string; autoComplete: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input id={id} type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete} className={cx(INPUT, 'pr-12')} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} className="absolute right-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-lg text-white/50 hover:text-white">
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  )
}

function strength(pw: string) {
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return Math.min(4, s)
}

const ageFrom = (iso: string) => {
  if (!iso) return null
  const d = new Date(iso + 'T00:00:00')
  const now = new Date('2026-11-05T00:00:00')
  let a = now.getFullYear() - d.getFullYear()
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) a--
  return a
}

/* ------------------------------------------------------------------ connexion */
function LoginForm({ onDone, toSignup }: { onDone: () => void; toSignup: () => void }) {
  const { login, demoLogin, resetPassword, toast } = useApp()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [forgot, setForgot] = useState<'closed' | 'open' | 'sent'>('closed')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) return setErr('Entre une adresse courriel valide.')
    if (!pw) return setErr('Entre ton mot de passe.')
    setBusy(true)
    const r = await login(email, pw)
    setBusy(false)
    if (r === 'invalid') return setErr('Courriel ou mot de passe incorrect. Vérifie-les, ou crée un compte si tu n’en as pas encore.')
    if (r === 'tooMany') return setErr('Trop de tentatives. Patiente quelques minutes ou réinitialise ton mot de passe.')
    if (r === 'error') return setErr('Connexion impossible pour le moment. Vérifie ta connexion Internet et réessaie.')
    toast('Connexion réussie')
    onDone()
  }

  return (
    <div>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field id="login-email" label="Courriel">
          <input id="login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom.nom@exemple.ca" className={INPUT} />
        </Field>
        <Field id="login-pw" label="Mot de passe">
          <Password id="login-pw" value={pw} onChange={setPw} autoComplete="current-password" placeholder="••••••••" />
        </Field>
        {err && <p className="rounded-xl border border-[#ff8a9a]/30 bg-[#ff8a9a]/10 px-3 py-2 text-[13px] font-semibold text-[#ffb3bf]">{err}</p>}
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setForgot(forgot === 'closed' ? 'open' : 'closed')} className="text-[13px] font-semibold text-gold hover:text-goldlight">
            Mot de passe oublié ?
          </button>
          <button type="button" onClick={toSignup} className="text-[13px] font-semibold text-white/60 hover:text-white">
            Pas de compte ? <span className="text-gold">Créer un compte</span>
          </button>
        </div>
        {forgot !== 'closed' && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[13px] text-white/70">
            {forgot === 'sent' ? (
              <span>Si un compte existe pour ce courriel, tu vas recevoir un lien pour choisir un nouveau mot de passe. Pense à vérifier tes courriels indésirables.</span>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <span className="flex-1">Nous t’enverrons un lien pour choisir un nouveau mot de passe.</span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    if (!EMAIL_RE.test(email)) return setErr('Entre d’abord ton courriel ci-dessus.')
                    setErr(null)
                    if (await resetPassword(email)) setForgot('sent')
                    else setErr('Envoi impossible pour le moment. Réessaie dans quelques instants.')
                  }}
                >
                  Envoyer le lien
                </Button>
              </div>
            )}
          </div>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? 'Connexion…' : 'Se connecter'}
        </Button>
      </form>

      <div className="mt-7">
        <div className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
          <span className="h-px flex-1 bg-white/10" />
          Connexion rapide
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map(({ role, icon: Icon }) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                demoLogin(role)
                toast(`Connecté en tant que ${ROLE_LABEL[role].toLowerCase()}`)
                onDone()
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3 text-[12.5px] font-bold text-white/80 transition hover:border-gold/50"
            >
              <Icon size={17} className="text-gold" />
              {ROLE_LABEL[role]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ inscription */
type Form = Record<string, string>

function SignupFlow({ toLogin, onDone }: { toLogin: () => void; onDone: (role: Role) => void }) {
  const { register } = useApp()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<Role | null>(null)
  const [f, setF] = useState<Form>({})
  const [disc, setDisc] = useState<Category[]>([])
  const [errors, setErrors] = useState<Form>({})
  const [busy, setBusy] = useState(false)
  const set = (k: string) => (v: string) => setF((x) => ({ ...x, [k]: v }))
  const age = useMemo(() => ageFrom(f.naissance ?? ''), [f.naissance])
  const needsParent = role === 'eleve' && age !== null && age < 14

  const validateInfo = () => {
    const e: Form = {}
    if (!f.prenom?.trim()) e.prenom = 'Indique ton prénom.'
    if (!f.nom?.trim()) e.nom = 'Indique ton nom.'
    if (role === 'eleve') {
      if (!f.naissance) e.naissance = 'Indique ta date de naissance.'
      else if (age !== null && (age < 11 || age > 19)) e.naissance = 'MICRO D’OR s’adresse aux élèves du secondaire (environ 12 à 17 ans).'
      if (!f.ecole) e.ecole = 'Choisis ton école.'
      if (!f.niveau) e.niveau = 'Choisis ton niveau.'
      if (!disc.length) e.disc = 'Choisis au moins une discipline.'
      if (needsParent && !EMAIL_RE.test(f.parentEmail ?? '')) e.parentEmail = 'Le courriel d’un parent ou tuteur est requis avant 14 ans.'
    }
    if (role === 'parent') {
      if (!f.lien) e.lien = 'Précise ton lien avec l’élève.'
      if (!f.enfant?.trim()) e.enfant = 'Indique le prénom de ton enfant.'
      if (!f.ecole) e.ecole = 'Choisis l’école de ton enfant.'
    }
    if (role === 'organisateur') {
      if (!f.code?.trim()) e.code = 'Entre le code organisateur fourni par l’équipe.'
      if (!f.equipe) e.equipe = 'Choisis ton équipe.'
    }
    if (role === 'organisation') {
      if (!f.type) e.type = 'Choisis le type d’organisation.'
      if (!f.organisation?.trim()) e.organisation = 'Indique le nom de l’organisation.'
      if (!f.fonction?.trim()) e.fonction = 'Indique ta fonction.'
      if (!f.region) e.region = 'Choisis la région.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e: Form = {}
    if (!EMAIL_RE.test(f.email ?? '')) e.email = 'Entre une adresse courriel valide.'
    if ((f.pw ?? '').length < 8 || !/\d/.test(f.pw ?? '') || !/[A-Za-z]/.test(f.pw ?? '')) e.pw = 'Au moins 8 caractères, avec des lettres et au moins un chiffre.'
    if (f.pw !== f.pw2) e.pw2 = 'Les deux mots de passe ne correspondent pas.'
    if (f.cgu !== 'oui') e.cgu = 'Tu dois accepter les conditions pour créer un compte.'
    setErrors(e)
    if (Object.keys(e).length || !role) return
    setBusy(true)
    const details: Form = {}
    for (const k of ['naissance', 'ecole', 'niveau', 'parentEmail', 'lien', 'enfant', 'telephone', 'type', 'organisation', 'fonction', 'ville', 'region', 'equipe']) if (f[k]) details[k] = f[k]
    if (disc.length) details.disciplines = disc.map((d) => CATEGORY_LABEL[d]).join(', ')
    if (needsParent) details.consentementParental = 'en_attente'
    const r = await register({ role, firstName: f.prenom.trim(), lastName: f.nom.trim(), email: f.email, details }, f.pw, f.code)
    setBusy(false)
    if (r === 'exists') return setErrors({ email: 'Un compte existe déjà avec ce courriel. Connecte-toi plutôt.' })
    if (r === 'weak') return setErrors({ pw: 'Mot de passe trop faible. Choisis-en un plus long.' })
    if (r === 'badcode') {
      setStep(2)
      return setErrors({ code: 'Code organisateur invalide.' })
    }
    if (r === 'error') return setErrors({ form: 'Création du compte impossible pour le moment. Vérifie ta connexion Internet et réessaie.' })
    setStep(4)
  }

  const s = strength(f.pw ?? '')

  if (step === 4 && role)
    return (
      <div className="py-6 text-center">
        <CheckCircle2 size={56} className="mx-auto text-gold" />
        <h2 className="mt-4 font-display text-[40px] leading-none tracking-wide">Bienvenue, {f.prenom} !</h2>
        <p className="mx-auto mt-2 max-w-sm text-[14px] text-white/65">
          Ton compte {ROLE_LABEL[role].toLowerCase()} est créé.
          {needsParent && ' Ton inscription reste en attente de la confirmation de ton parent ou tuteur.'}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button size="lg" onClick={() => onDone(role)} iconRight={<ArrowRight size={16} />}>
            {SPACE[role].label}
          </Button>
          <Button size="lg" variant="dark" to="/profil">
            Voir mon profil
          </Button>
        </div>
      </div>
    )

  return (
    <div>
      {/* progression */}
      <div className="mb-6 flex items-center gap-2">
        {['Profil', 'Informations', 'Compte'].map((l, i) => (
          <div key={l} className="flex flex-1 flex-col gap-1.5">
            <span className={cx('h-1.5 rounded-full transition', i + 1 <= step ? 'bg-gold-soft' : 'bg-white/10')} />
            <span className={cx('text-[11px] font-bold uppercase tracking-wider', i + 1 === step ? 'text-goldlight' : 'text-white/35')}>
              {i + 1}. {l}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="font-display text-[30px] leading-none tracking-wide">Qui es-tu ?</h2>
          <p className="mt-1.5 text-[13.5px] text-white/55">Le formulaire s’adapte à ton profil.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {ROLES.map(({ role: r, icon: Icon, title, text }) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                aria-pressed={role === r}
                className={cx(
                  'relative flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition',
                  role === r ? 'border-gold bg-gold/[0.08] shadow-gold' : 'border-white/10 bg-white/[0.03] hover:border-gold/40',
                )}
              >
                <span className={cx('absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full border-2', role === r ? 'border-gold bg-gold' : 'border-white/25')}>
                  {role === r && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
                </span>
                <span className={cx('grid h-11 w-11 place-items-center rounded-xl', role === r ? 'bg-gold-soft text-ink' : 'bg-gold/10 text-gold')}>
                  <Icon size={21} />
                </span>
                <span>
                  <span className="block text-[14.5px] font-extrabold leading-tight">{title}</span>
                  <span className="mt-1 block text-[12px] leading-snug text-white/55">{text}</span>
                </span>
              </button>
            ))}
          </div>
          <Button size="lg" className="mt-6 w-full" disabled={!role} onClick={() => setStep(2)} iconRight={<ArrowRight size={16} />}>
            Continuer
          </Button>
          <p className="mt-4 text-center text-[13px] text-white/55">
            Déjà un compte ?{' '}
            <button type="button" onClick={toLogin} className="font-bold text-gold hover:text-goldlight">
              Se connecter
            </button>
          </p>
        </div>
      )}

      {step === 2 && role && (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            if (validateInfo()) setStep(3)
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-[30px] leading-none tracking-wide">Tes informations</h2>
            <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-bold text-goldlight">{ROLE_LABEL[role]}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="su-prenom" label="Prénom" error={errors.prenom}>
              <input id="su-prenom" autoComplete="given-name" value={f.prenom ?? ''} onChange={(e) => set('prenom')(e.target.value)} className={INPUT} />
            </Field>
            <Field id="su-nom" label="Nom" error={errors.nom}>
              <input id="su-nom" autoComplete="family-name" value={f.nom ?? ''} onChange={(e) => set('nom')(e.target.value)} className={INPUT} />
            </Field>

            {role === 'eleve' && (
              <>
                <Field id="su-naissance" label="Date de naissance" error={errors.naissance} hint={age !== null ? `${age} ans` : undefined}>
                  <input id="su-naissance" type="date" value={f.naissance ?? ''} onChange={(e) => set('naissance')(e.target.value)} className={cx(INPUT, '[color-scheme:dark]')} />
                </Field>
                <Field id="su-niveau" label="Niveau" error={errors.niveau}>
                  <select id="su-niveau" value={f.niveau ?? ''} onChange={(e) => set('niveau')(e.target.value)} className={cx(INPUT, 'bg-night')}>
                    <option value="">Choisir…</option>
                    {LEVELS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </Field>
                <Field id="su-ecole" label="École" error={errors.ecole} className="sm:col-span-2">
                  <select id="su-ecole" value={f.ecole ?? ''} onChange={(e) => set('ecole')(e.target.value)} className={cx(INPUT, 'bg-night')}>
                    <option value="">Choisir mon école…</option>
                    {SCHOOLS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.city}
                      </option>
                    ))}
                    <option value="autre">Mon école ne figure pas dans la liste</option>
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <span className="mb-1.5 block text-[12.5px] font-bold text-white/70">Discipline(s)</span>
                  <div className="flex flex-wrap gap-2">
                    {DISCIPLINES.map((d) => {
                      const on = disc.includes(d)
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDisc((x) => (on ? x.filter((y) => y !== d) : [...x, d]))}
                          className={cx('h-9 rounded-full px-4 text-[13px] font-bold transition', on ? 'bg-gold-soft text-ink' : 'border border-white/15 text-white/75 hover:border-gold/50')}
                        >
                          {CATEGORY_LABEL[d]}
                        </button>
                      )
                    })}
                  </div>
                  {errors.disc && <p className="mt-1 text-[12px] font-semibold text-[#ff8a9a]">{errors.disc}</p>}
                </div>
                {needsParent && (
                  <div className="rounded-2xl border border-gold/30 bg-gold/[0.06] p-4 sm:col-span-2">
                    <div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-goldlight">
                      <ShieldCheck size={16} /> Tu as moins de 14 ans
                    </div>
                    <p className="mb-3 text-[12.5px] leading-relaxed text-white/65">
                      Au Québec, le consentement d’un parent ou tuteur est requis. Nous lui demanderons d’approuver ton compte.
                    </p>
                    <Field id="su-parent" label="Courriel du parent ou tuteur" error={errors.parentEmail}>
                      <input id="su-parent" type="email" value={f.parentEmail ?? ''} onChange={(e) => set('parentEmail')(e.target.value)} className={INPUT} />
                    </Field>
                  </div>
                )}
              </>
            )}

            {role === 'parent' && (
              <>
                <Field id="su-lien" label="Lien avec l’élève" error={errors.lien}>
                  <select id="su-lien" value={f.lien ?? ''} onChange={(e) => set('lien')(e.target.value)} className={cx(INPUT, 'bg-night')}>
                    <option value="">Choisir…</option>
                    {['Mère', 'Père', 'Tuteur ou tutrice', 'Autre membre de la famille'].map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </Field>
                <Field id="su-enfant" label="Prénom de ton enfant" error={errors.enfant}>
                  <input id="su-enfant" value={f.enfant ?? ''} onChange={(e) => set('enfant')(e.target.value)} className={INPUT} />
                </Field>
                <Field id="su-ecole-p" label="École de ton enfant" error={errors.ecole} className="sm:col-span-2">
                  <select id="su-ecole-p" value={f.ecole ?? ''} onChange={(e) => set('ecole')(e.target.value)} className={cx(INPUT, 'bg-night')}>
                    <option value="">Choisir l’école…</option>
                    {SCHOOLS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.city}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="su-tel" label="Téléphone (facultatif)" className="sm:col-span-2">
                  <input id="su-tel" type="tel" autoComplete="tel" value={f.telephone ?? ''} onChange={(e) => set('telephone')(e.target.value)} placeholder="514 555-0123" className={INPUT} />
                </Field>
              </>
            )}

            {role === 'organisateur' && (
              <>
                <div className="rounded-2xl border border-gold/30 bg-gold/[0.06] p-4 sm:col-span-2">
                  <div className="mb-2 flex items-center gap-2 text-[13px] font-bold text-goldlight">
                    <KeyRound size={16} /> Accès réservé à l’équipe MICRO D’OR
                  </div>
                  <Field id="su-code" label="Code organisateur" error={errors.code} hint="Code fourni par la coordination de MICRO D’OR.">
                    <Password id="su-code" value={f.code ?? ''} onChange={set('code')} autoComplete="off" placeholder="Code d’accès" />
                  </Field>
                </div>
                <Field id="su-equipe" label="Équipe" error={errors.equipe}>
                  <select id="su-equipe" value={f.equipe ?? ''} onChange={(e) => set('equipe')(e.target.value)} className={cx(INPUT, 'bg-night')}>
                    <option value="">Choisir…</option>
                    {TEAMS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field id="su-tel-t" label="Téléphone (facultatif)">
                  <input id="su-tel-t" type="tel" autoComplete="tel" value={f.telephone ?? ''} onChange={(e) => set('telephone')(e.target.value)} className={INPUT} />
                </Field>
              </>
            )}

            {role === 'organisation' && (
              <>
                <Field id="su-type" label="Type d’organisation" error={errors.type}>
                  <select id="su-type" value={f.type ?? ''} onChange={(e) => set('type')(e.target.value)} className={cx(INPUT, 'bg-night')}>
                    <option value="">Choisir…</option>
                    {ORG_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field id="su-org" label="Nom de l’organisation" error={errors.organisation}>
                  <input id="su-org" autoComplete="organization" value={f.organisation ?? ''} onChange={(e) => set('organisation')(e.target.value)} className={INPUT} />
                </Field>
                <Field id="su-fonction" label="Fonction" error={errors.fonction}>
                  <input id="su-fonction" autoComplete="organization-title" value={f.fonction ?? ''} onChange={(e) => set('fonction')(e.target.value)} placeholder="Ex. Direction, enseignant·e…" className={INPUT} />
                </Field>
                <Field id="su-ville" label="Ville">
                  <input id="su-ville" value={f.ville ?? ''} onChange={(e) => set('ville')(e.target.value)} className={INPUT} />
                </Field>
                <Field id="su-region" label="Région" error={errors.region}>
                  <select id="su-region" value={f.region ?? ''} onChange={(e) => set('region')(e.target.value)} className={cx(INPUT, 'bg-night')}>
                    <option value="">Choisir…</option>
                    {REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.code} — {r.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="su-tel-o" label="Téléphone (facultatif)">
                  <input id="su-tel-o" type="tel" autoComplete="tel" value={f.telephone ?? ''} onChange={(e) => set('telephone')(e.target.value)} className={INPUT} />
                </Field>
              </>
            )}
          </div>
          <div className="mt-6 flex gap-2">
            <Button type="button" variant="dark" size="lg" icon={<ArrowLeft size={16} />} onClick={() => setStep(1)}>
              Retour
            </Button>
            <Button type="submit" size="lg" className="flex-1" iconRight={<ArrowRight size={16} />}>
              Continuer
            </Button>
          </div>
        </form>
      )}

      {step === 3 && role && (
        <form noValidate onSubmit={submit}>
          <h2 className="mb-4 font-display text-[30px] leading-none tracking-wide">Ton compte</h2>
          <div className="space-y-4">
            <Field id="su-email" label={role === 'organisation' ? 'Courriel professionnel' : 'Courriel'} error={errors.email}>
              <input id="su-email" type="email" autoComplete="email" value={f.email ?? ''} onChange={(e) => set('email')(e.target.value)} placeholder="prenom.nom@exemple.ca" className={INPUT} />
            </Field>
            <Field id="su-pw" label="Mot de passe" error={errors.pw}>
              <Password id="su-pw" value={f.pw ?? ''} onChange={set('pw')} autoComplete="new-password" placeholder="8 caractères minimum" />
              <div className="mt-2 flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className={cx('h-1.5 flex-1 rounded-full', i <= s ? (s <= 1 ? 'bg-[#ff8a9a]' : s === 2 ? 'bg-[#ffc08a]' : 'bg-gold') : 'bg-white/10')} />
                  ))}
                </div>
                <span className="w-20 text-right text-[11px] font-bold text-white/50">{['Trop court', 'Faible', 'Moyen', 'Solide', 'Excellent'][s]}</span>
              </div>
            </Field>
            <Field id="su-pw2" label="Confirmer le mot de passe" error={errors.pw2}>
              <Password id="su-pw2" value={f.pw2 ?? ''} onChange={set('pw2')} autoComplete="new-password" />
            </Field>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <input id="su-cgu" type="checkbox" checked={f.cgu === 'oui'} onChange={(e) => set('cgu')(e.target.checked ? 'oui' : '')} className="mt-0.5 h-4 w-4 accent-[#D6AC55]" />
              <span className="text-[12.5px] leading-relaxed text-white/70">
                J’accepte les conditions d’utilisation et la{' '}
                <Link to="/reglement" className="font-bold text-gold">
                  politique de confidentialité
                </Link>
                {role === 'eleve' && ', et je confirme que mes parents sont informés de mon inscription'}.
              </span>
            </label>
            {errors.cgu && <p className="-mt-2 text-[12px] font-semibold text-[#ff8a9a]">{errors.cgu}</p>}
            {errors.form && <p className="rounded-xl border border-[#ff8a9a]/30 bg-[#ff8a9a]/10 px-3 py-2 text-[13px] font-semibold text-[#ffb3bf]">{errors.form}</p>}
          </div>
          <div className="mt-6 flex gap-2">
            <Button type="button" variant="dark" size="lg" icon={<ArrowLeft size={16} />} onClick={() => setStep(2)}>
              Retour
            </Button>
            <Button type="submit" size="lg" className="flex-1" disabled={busy}>
              {busy ? 'Création…' : 'Créer mon compte'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ page */
export default function Auth() {
  const [params, setParams] = useSearchParams()
  const nav = useNavigate()
  const mode = params.get('mode') === 'inscription' ? 'signup' : 'login'
  const next = params.get('suite') || '/profil'
  const setMode = (m: 'login' | 'signup') => setParams(m === 'signup' ? { mode: 'inscription', suite: next } : { suite: next }, { replace: true })

  return (
    <div className="-mx-4 -mt-4 lg:mx-0 lg:mt-0">
      <div className="grid lg:min-h-[calc(100vh-120px)] overflow-hidden lg:grid-cols-[1fr_1.05fr] lg:rounded-[28px] lg:border lg:border-white/[0.07]">
        {/* visuel */}
        <div className="relative hidden lg:block">
          <img src={PHOTOS.hero} alt="" className="absolute inset-0 h-full w-full object-cover object-[60%_30%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <MicEmblem className="h-28 w-20" large />
            <Wordmark className="mt-2 block text-[56px] italic" />
            <p className="mt-2 max-w-sm text-[16px] text-white/75">Un seul compte pour suivre les spectacles, soutenir les talents et préparer ta prestation.</p>
            <ul className="mt-5 space-y-2 text-[13.5px] text-white/70">
              {['Élèves : répétitions, musiques et performances', 'Parents : spectacles, invitations et autorisations', 'Organisations : écoles, partenaires et médias', 'Organisateurs : musiques, boutique et événements'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-gold" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* formulaire */}
        <div className="flex flex-col justify-center bg-ink/60 px-4 py-6 sm:px-10 lg:px-14 lg:py-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <MicEmblem className="h-14 w-10" />
              <Wordmark className="text-[34px] italic" />
            </div>
            <h1 className="font-display text-[44px] leading-none tracking-wide">{mode === 'login' ? 'Bon retour !' : 'Créer un compte'}</h1>
            <p className="mt-2 text-[14px] text-white/55">{mode === 'login' ? 'Connecte-toi pour accéder à ton espace.' : 'Rejoins la scène MICRO D’OR en trois étapes.'}</p>

            <div className="my-6 grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
              {(['login', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cx('h-10 rounded-full text-[13.5px] font-bold transition', mode === m ? 'bg-gold-soft text-ink shadow-gold' : 'text-white/60 hover:text-white')}
                >
                  {m === 'login' ? 'Se connecter' : 'Créer un compte'}
                </button>
              ))}
            </div>

            {mode === 'login' ? (
              <LoginForm onDone={() => nav(next)} toSignup={() => setMode('signup')} />
            ) : (
              <SignupFlow key="signup" toLogin={() => setMode('login')} onDone={(role) => nav(SPACE[role].to)} />
            )}

            <p className="mt-8 flex items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-[11.5px] leading-relaxed text-white/45">
              <Lock size={14} className="mt-0.5 shrink-0 text-gold/70" />
              Comptes sécurisés par Firebase (Google) ; les profils sont hébergés à Montréal. Le mot de passe n’est jamais visible par l’équipe MICRO D’OR.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
