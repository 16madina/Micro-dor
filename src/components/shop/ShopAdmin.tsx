import { useState, type FormEvent } from 'react'
import { KeyRound, PackagePlus, Save, Trash2 } from 'lucide-react'
import { fmtPrice, type Product } from '../../data'
import { useApp } from '../../state/AppState'
import ProductArt from '../art/ProductArt'
import { Button, cx } from '../ui'

const KINDS: { value: Product['kind']; label: string }[] = [
  { value: 'tshirt', label: 'T-shirt' },
  { value: 'hoodie', label: 'Chandail à capuchon' },
  { value: 'cap', label: 'Casquette' },
  { value: 'album', label: 'Album / musique' },
  { value: 'ticket', label: 'Billet' },
]
const INPUT = 'h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-[14px] text-white outline-none focus:border-gold/60'
const toPrice = (v: string) => Math.round(parseFloat(v.replace(',', '.')) * 100) / 100

function Row({ p }: { p: Product }) {
  const { updateProduct, removeProduct, toast } = useApp()
  const [price, setPrice] = useState(p.price.toFixed(2).replace('.', ','))
  const [desc, setDesc] = useState(p.description)
  const [confirm, setConfirm] = useState(false)
  const dirty = toPrice(price) !== p.price || desc !== p.description
  const valid = !Number.isNaN(toPrice(price)) && toPrice(price) >= 0

  return (
    <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 border-b border-white/[0.06] p-3 last:border-0 lg:grid-cols-[64px_minmax(0,1.2fr)_120px_minmax(0,1.6fr)_auto] lg:items-center lg:gap-4 lg:px-4">
      <div className="h-16 w-16 overflow-hidden rounded-xl bg-night2">
        <ProductArt kind={p.kind} className="h-full w-full" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-[14.5px] font-extrabold">{p.name}</div>
        <div className="text-[11.5px] text-white/45">
          {KINDS.find((k) => k.value === p.kind)?.label}
          {p.sizes && ` · tailles ${p.sizes.join(', ')}`}
        </div>
      </div>
      <label className="col-span-2 text-[11px] font-bold text-white/50 lg:col-span-1">
        Prix ($)
        <input id={`price-${p.id}`} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={cx(INPUT, 'mt-1 tabular-nums', !valid && 'border-[#ff8a9a]')} />
      </label>
      <label className="col-span-2 text-[11px] font-bold text-white/50 lg:col-span-1">
        Description
        <input id={`desc-${p.id}`} value={desc} onChange={(e) => setDesc(e.target.value)} className={cx(INPUT, 'mt-1')} />
      </label>
      <div className="col-span-2 flex justify-end gap-2 lg:col-span-1">
        <Button
          size="sm"
          variant={dirty ? 'gold' : 'dark'}
          disabled={!dirty || !valid}
          icon={<Save size={14} />}
          className="disabled:opacity-40"
          onClick={() => {
            updateProduct(p.id, { price: toPrice(price), description: desc.trim() })
            toast(`« ${p.name} » mis à jour`)
          }}
        >
          Enregistrer
        </Button>
        {confirm ? (
          <>
            <Button
              size="sm"
              variant="outline"
              className="!border-[#ff8a9a] !text-[#ffb3bf]"
              onClick={() => {
                removeProduct(p.id)
                toast(`« ${p.name} » retiré de la boutique`, 'info')
              }}
            >
              Confirmer
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirm(false)}>
              Annuler
            </Button>
          </>
        ) : (
          <button onClick={() => setConfirm(true)} aria-label={`Retirer ${p.name}`} title="Retirer de la boutique" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/60 hover:border-[#ff8a9a] hover:text-[#ffb3bf]">
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  )
}

/** Gestion de la boutique — réservée aux organisateurs */
export default function ShopAdmin() {
  const { products, addProduct, toast, user } = useApp()
  const [f, setF] = useState({ name: '', price: '', kind: 'tshirt' as Product['kind'], description: '', sizes: false, badge: '' })
  const [err, setErr] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const price = toPrice(f.price)
    if (!f.name.trim()) return setErr('Donne un nom au produit.')
    if (Number.isNaN(price) || price < 0) return setErr('Entre un prix valide, par exemple 19,99.')
    addProduct({
      id: 'p' + Date.now(),
      name: f.name.trim(),
      price,
      kind: f.kind,
      description: f.description.trim() || 'Nouveau produit MICRO D’OR.',
      sizes: f.sizes ? ['S', 'M', 'L', 'XL'] : undefined,
      badge: f.badge.trim() || 'Nouveau',
    })
    toast(`« ${f.name.trim()} » ajouté à la boutique (${fmtPrice(price)})`)
    setF({ name: '', price: '', kind: 'tshirt', description: '', sizes: false, badge: '' })
    setErr(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/[0.06] p-4 text-[13px] leading-relaxed text-white/70">
        <KeyRound size={18} className="mt-0.5 shrink-0 text-gold" />
        <span>
          <b className="text-goldlight">Espace organisateur — {user?.firstName}.</b> Les changements s’appliquent tout de suite à la boutique de cette session. Dans l’application
          réelle, ils seraient enregistrés sur le serveur et visibles par tous.
        </span>
      </div>

      <section>
        <h3 className="mb-3 font-display text-[28px] leading-none tracking-wide">Produits en vente ({products.length})</h3>
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-night/60">
          {products.map((p) => (
            <Row key={p.id} p={p} />
          ))}
          {products.length === 0 && <div className="p-8 text-center text-white/50">La boutique est vide. Ajoute un premier produit ci-dessous.</div>}
        </div>
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 font-display text-[28px] leading-none tracking-wide">
          <PackagePlus size={22} className="text-gold" /> Ajouter un produit
        </h3>
        <form onSubmit={submit} noValidate className="grid gap-4 rounded-2xl border border-white/[0.07] bg-night/60 p-4 lg:grid-cols-[160px_minmax(0,1fr)] lg:p-6">
          <div className="mx-auto h-40 w-40 overflow-hidden rounded-2xl bg-night2">
            <ProductArt kind={f.kind} className="h-full w-full" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-[12px] font-bold text-white/60">
              Nom du produit
              <input id="new-name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Ex. Tuque MICRO D’OR" className={cx(INPUT, 'mt-1 h-11')} />
            </label>
            <label className="text-[12px] font-bold text-white/60">
              Prix ($)
              <input id="new-price" inputMode="decimal" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} placeholder="19,99" className={cx(INPUT, 'mt-1 h-11')} />
            </label>
            <label className="text-[12px] font-bold text-white/60">
              Type (maquette)
              <select id="new-kind" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as Product['kind'] })} className={cx(INPUT, 'mt-1 h-11 bg-night')}>
                {KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[12px] font-bold text-white/60">
              Étiquette (facultatif)
              <input id="new-badge" value={f.badge} onChange={(e) => setF({ ...f, badge: e.target.value })} placeholder="Nouveau, Édition limitée…" className={cx(INPUT, 'mt-1 h-11')} />
            </label>
            <label className="text-[12px] font-bold text-white/60 sm:col-span-2">
              Description
              <input id="new-desc" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={cx(INPUT, 'mt-1 h-11')} />
            </label>
            <label className="flex items-center gap-2 text-[13px] text-white/70 sm:col-span-2">
              <input id="new-sizes" type="checkbox" checked={f.sizes} onChange={(e) => setF({ ...f, sizes: e.target.checked })} className="h-4 w-4 accent-[#D6AC55]" />
              Proposer des tailles (S, M, L, XL)
            </label>
            {err && <p className="text-[12.5px] font-semibold text-[#ff8a9a] sm:col-span-2">{err}</p>}
            <Button type="submit" className="sm:col-span-2" icon={<PackagePlus size={16} />}>
              Ajouter à la boutique
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
