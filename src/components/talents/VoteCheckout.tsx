import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Loader2, Lock, ShieldCheck, Trophy } from 'lucide-react'
import { CATEGORY_LABEL, fmtPrice, talentById } from '../../data'
import { VOTE_CAP, VOTE_PACKS, useApp } from '../../state/AppState'
import Modal from '../mission/Modal'
import { GoldBurst, cx, useBurst } from '../ui'
import { PortraitThumb } from './shared'

/**
 * Paiement d’un forfait de votes.
 * SIMULÉ pour l’instant : aucun montant n’est prélevé, aucune carte n’est demandée.
 * Le vrai paiement (Stripe) remplacera l’étape « Payer » sans changer le reste.
 */
export default function VoteCheckout({ talentId, open, onClose }: { talentId: string; open: boolean; onClose: () => void }) {
  const { ballot, myVotesFor, buyVotes, voteBlock, toast } = useApp()
  const t = talentById(talentId)
  const cat = CATEGORY_LABEL[t.category]
  const used = ballot(t.category).total
  const left = VOTE_CAP - used
  const mine = myVotesFor(talentId)
  const [qty, setQty] = useState<number>(1)
  const [step, setStep] = useState<'choose' | 'paying' | 'done'>('choose')
  const [bought, setBought] = useState(0)
  const [burst, fire] = useBurst()

  // à chaque ouverture : on repart du choix, avec le plus grand forfait encore permis par défaut… sauf 10
  useEffect(() => {
    if (!open) return
    setStep('choose')
    setQty(left >= 5 ? 5 : 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const pack = VOTE_PACKS.find((p) => p.qty === qty) ?? VOTE_PACKS[0]
  const blocked = voteBlock === 'consent' || left <= 0

  const pay = async () => {
    if (blocked || qty > left) return
    setStep('paying')
    await new Promise((r) => setTimeout(r, 1100)) // paiement simulé
    const r = await buyVotes(talentId, qty)
    if (r === 'ok') {
      setBought(qty)
      setStep('done')
      fire()
      toast(`${qty} vote${qty > 1 ? 's' : ''} pour ${t.name} · merci !`)
    } else {
      setStep('choose')
      toast(
        r === 'consent'
          ? 'Un parent doit d’abord approuver ton compte.'
          : r === 'cap'
            ? `Plafond atteint : ${VOTE_CAP} votes par discipline.`
            : 'Vote non enregistré. Vérifie ta connexion et réessaie.',
        'info',
      )
    }
  }

  return (
    <Modal open={open} onClose={onClose} eyebrow={step === 'done' ? 'Vote confirmé' : `Voter · ${cat}`} title={step === 'done' ? 'Merci !' : 'Choisis ton forfait'}>
      <div className="space-y-4 px-5 pb-6 pt-3 lg:px-7 lg:pb-7" onClick={(e) => e.stopPropagation()}>
        {/* talent */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-ink/40 p-3">
          <PortraitThumb talent={t} className="h-12 w-12 ring-1 ring-stagelight/60" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[15px] font-extrabold">{t.name}</div>
            <div className="text-[12px] text-white/50">{cat}</div>
          </div>
          {mine > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-stage/30 px-2.5 py-1 text-[12px] font-extrabold text-[#d9c6ff]">
              <Trophy size={12} /> {mine} de toi
            </span>
          )}
        </div>

        {step === 'done' ? (
          <div className="relative flex flex-col items-center py-4 text-center">
            <span className="relative grid h-20 w-20 place-items-center rounded-full bg-stage text-white shadow-[0_10px_40px_-8px_rgba(104,55,181,.9)]">
              <Trophy size={34} className="fill-white/25" />
              <GoldBurst trigger={burst} />
            </span>
            <div className="mt-4 font-display text-[30px] leading-none tracking-wide">
              {bought} vote{bought > 1 ? 's' : ''} pour {t.name}
            </div>
            <p className="mt-2 max-w-xs text-[13px] text-white/55">
              Tu as maintenant {mine} vote{mine > 1 ? 's' : ''} pour {t.name}, et {used}/{VOTE_CAP} en {cat}.
            </p>
            <div className="mt-5 flex w-full gap-2">
              <Link to="/votes" onClick={onClose} className="flex h-11 flex-1 items-center justify-center rounded-full border border-white/15 text-sm font-extrabold text-white/80 hover:border-gold/50">
                Voir le classement
              </Link>
              <button onClick={onClose} className="h-11 flex-1 rounded-full bg-gold-soft text-sm font-extrabold text-ink shadow-gold hover:brightness-110">
                Terminer
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* plafond */}
            <div>
              <div className="mb-1.5 flex items-center justify-between text-[12px]">
                <span className="text-white/55">Tes votes en {cat}</span>
                <span className="font-extrabold tabular-nums text-[#d9c6ff]">
                  {used}/{VOTE_CAP}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-stagelight transition-all" style={{ width: `${(used / VOTE_CAP) * 100}%` }} />
              </div>
            </div>

            {voteBlock === 'consent' ? (
              <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 text-[13px] leading-relaxed text-white/80">
                <b className="text-goldlight">Accord parental en attente.</b> Comme tu as moins de 14 ans, un parent ou tuteur doit approuver ton compte avant que tu puisses voter. Tu peux quand même encourager tous les talents gratuitement.
              </div>
            ) : left <= 0 ? (
              <div className="rounded-2xl border border-white/10 bg-ink/40 p-4 text-[13px] text-white/70">
                Tu as atteint le plafond de {VOTE_CAP} votes en {cat}. Merci pour ton soutien ! Tu peux encore voter dans les autres disciplines.
              </div>
            ) : (
              <div role="radiogroup" aria-label="Forfaits de votes" className="grid grid-cols-3 gap-2">
                {VOTE_PACKS.map((p) => {
                  const off = p.qty > left
                  const on = qty === p.qty && !off
                  return (
                    <button
                      key={p.qty}
                      role="radio"
                      aria-checked={on}
                      disabled={off || step === 'paying'}
                      onClick={() => setQty(p.qty)}
                      className={cx(
                        'relative flex flex-col items-center rounded-2xl border px-2 pb-3 pt-4 text-center transition',
                        on ? 'border-stagelight bg-stage/25 shadow-[0_8px_30px_-10px_rgba(104,55,181,.9)]' : 'border-white/10 bg-ink/40 hover:border-stagelight/50',
                        off && 'cursor-not-allowed opacity-35',
                      )}
                    >
                      {'tag' in p && !off && (
                        <span className="absolute -top-2 rounded-full bg-gold-soft px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wide text-ink">{p.tag}</span>
                      )}
                      <span className="font-display text-[34px] leading-none text-white">{p.qty}</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">vote{p.qty > 1 ? 's' : ''}</span>
                      <span className="mt-2 text-[15px] font-extrabold text-goldlight">{fmtPrice(p.price)}</span>
                      <span className="text-[10.5px] text-white/40">{fmtPrice(p.price / p.qty)} / vote</span>
                      {on && <Check size={14} className="absolute right-2 top-2 text-stagelight" />}
                    </button>
                  )
                })}
              </div>
            )}

            <button
              onClick={pay}
              disabled={blocked || step === 'paying'}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold-soft text-[15px] font-extrabold text-ink shadow-gold transition hover:brightness-110 active:scale-[.98] disabled:opacity-50 disabled:shadow-none"
            >
              {step === 'paying' ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Paiement en cours…
                </>
              ) : (
                <>
                  <Lock size={16} /> Payer {fmtPrice(pack.price)} et voter
                </>
              )}
            </button>

            <div className="flex gap-2 rounded-xl border border-dashed border-white/15 px-3 py-2.5 text-[11.5px] leading-relaxed text-white/50">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-gold" />
              <span>
                Les votes achetés sont définitifs, avec un plafond de {VOTE_CAP} votes par personne et par discipline.
              </span>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
