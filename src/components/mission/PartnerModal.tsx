import { useEffect, useState, type FormEvent } from 'react'
import { CircleCheck, Lock, Send } from 'lucide-react'
import { Button, cx } from '../ui'
import Modal from './Modal'

export const TIER_OPTIONS = [
  'Partenaire principal',
  'Partenaires régionaux',
  'Partenaires jeunesse',
  'Partenaires médias',
  'Soutien matériel et technique',
] as const

const field =
  'mt-1.5 w-full rounded-xl border border-white/10 bg-ink/60 px-4 text-[14px] text-white placeholder:text-white/30 outline-none transition focus:border-gold/70 focus:ring-2 focus:ring-gold/20'

/**
 * Formulaire de démonstration. Rien n’est transmis ni conservé :
 * l’état local est effacé à la fermeture.
 */
export default function PartnerModal({ open, onClose, initialTier }: { open: boolean; onClose: () => void; initialTier?: string }) {
  const [org, setOrg] = useState('')
  const [role, setRole] = useState('')
  const [tier, setTier] = useState<string>(TIER_OPTIONS[0])
  const [msg, setMsg] = useState('')
  const [done, setDone] = useState(false)
  const [touched, setTouched] = useState(false)

  const reset = () => {
    setOrg('')
    setRole('')
    setMsg('')
    setDone(false)
    setTouched(false)
  }

  useEffect(() => {
    if (open) {
      reset()
      setTier(initialTier && (TIER_OPTIONS as readonly string[]).includes(initialTier) ? initialTier : TIER_OPTIONS[0])
    }
  }, [open, initialTier])

  const close = () => {
    reset()
    onClose()
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!org.trim()) return
    // Démonstration : aucune requête réseau, aucune sauvegarde.
    setDone(true)
    setOrg('')
    setRole('')
    setMsg('')
  }

  return (
    <Modal open={open} onClose={close} eyebrow="Formulaire de démonstration" title={done ? 'Merci !' : 'Devenir partenaire'}>
      {done ? (
        <div className="flex flex-col items-center px-6 pb-8 pt-6 text-center lg:px-10">
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-gold-soft shadow-gold">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/30 [animation-duration:2s]" />
            <CircleCheck size={40} className="relative text-ink" />
          </span>
          <div className="mt-4 pt-1 font-display text-[28px] leading-tight tracking-wide text-gold-metal">Demande simulée</div>
          <p className="mt-2 text-[15px] font-bold text-white">Demande simulée — aucune donnée n’a été transmise</p>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-white/55">
            Dans la version réelle, l’équipe MICRO D’OR communiquerait avec votre organisation pour présenter le dossier de partenariat ({tier}).
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button onClick={close}>Fermer</Button>
            <Button variant="dark" onClick={reset}>
              Nouvelle demande
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="px-5 pb-6 pt-3 lg:px-7 lg:pb-7">
          <p className="text-[13.5px] text-white/60">Indiquez votre intérêt — le formulaire est simulé et n’envoie rien.</p>
          <div className="mt-4 grid gap-4">
            <label className="block">
              <span className="text-[12px] font-bold uppercase tracking-wider text-white/60">Nom de l’organisation *</span>
              <input
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Ex. : Organisation fictive inc."
                autoComplete="off"
                className={cx(field, 'h-12', touched && !org.trim() && 'border-live/70')}
              />
              {touched && !org.trim() && <span className="mt-1 block text-[12px] font-semibold text-[#ff9aae]">Veuillez indiquer un nom d’organisation (fictif).</span>}
            </label>
            <label className="block">
              <span className="text-[12px] font-bold uppercase tracking-wider text-white/60">Rôle de la personne-ressource</span>
              <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ex. : Direction des communications" autoComplete="off" className={cx(field, 'h-12')} />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold uppercase tracking-wider text-white/60">Palier de partenariat</span>
              <select value={tier} onChange={(e) => setTier(e.target.value)} className={cx(field, 'h-12 cursor-pointer appearance-none')}>
                {TIER_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[12px] font-bold uppercase tracking-wider text-white/60">Message</span>
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} placeholder="Vos objectifs, votre région, vos idées…" className={cx(field, 'resize-none py-3')} />
            </label>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-[11.5px] leading-relaxed text-white/50">
            <Lock size={14} className="mt-0.5 shrink-0 text-gold" />
            Prototype : aucune donnée n’est envoyée, enregistrée ni conservée. N’inscrivez pas de renseignements personnels.
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={close}>
              Annuler
            </Button>
            <Button type="submit" icon={<Send size={15} />}>
              Envoyer (simulation)
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
