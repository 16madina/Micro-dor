import { useState } from 'react'
import { Minus, Plus, ShoppingBag, X, CheckCircle2 } from 'lucide-react'
import { fmtPrice } from '../../data'
import { useApp } from '../../state/AppState'
import ProductArt from '../art/ProductArt'
import { Button } from '../ui'

/** Panier fictif — aucun paiement réel */
export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, clearCart, products: PRODUCTS } = useApp()
  const [done, setDone] = useState(false)
  if (!cartOpen) return null
  const total = cart.reduce((a, i) => a + i.qty * (PRODUCTS.find((p) => p.id === i.productId)?.price ?? 0), 0)
  const close = () => {
    setCartOpen(false)
    setDone(false)
  }
  return (
    <div className="fixed inset-0 z-[85]">
      <div className="absolute inset-0 animate-fadeIn bg-black/70 backdrop-blur-sm" onClick={close} />
      <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] animate-slideUp flex-col rounded-t-3xl border-t border-gold/30 bg-ink lg:inset-y-0 lg:left-auto lg:right-0 lg:max-h-none lg:w-[420px] lg:rounded-none lg:border-l lg:border-t-0">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-gold" />
            <span className="font-display text-[26px] leading-none tracking-wide">Mon panier</span>
          </div>
          <button onClick={close} aria-label="Fermer" className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
            <X size={18} />
          </button>
        </div>
        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <CheckCircle2 size={54} className="text-gold" />
            <div className="font-display text-[32px] leading-none">Commande simulée !</div>
            <p className="max-w-xs text-[13.5px] text-white/60">Aucun paiement n’a été effectué. Cette boutique est une démonstration du futur parcours d’achat.</p>
            <Button onClick={close} className="mt-3">
              Continuer la visite
            </Button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center text-white/50">
            <ShoppingBag size={40} className="text-white/20" />
            Votre panier est vide.
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {cart.map((i) => {
                const p = PRODUCTS.find((x) => x.id === i.productId)
                if (!p) return null
                return (
                  <div key={i.key} className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-night2">
                      <ProductArt kind={p.kind} className="h-full w-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-bold">{p.name}</div>
                      <div className="text-[12px] text-white/50">{i.size ? `Taille ${i.size} · ` : ''}{fmtPrice(p.price)}</div>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-white/10">
                      <button aria-label="Retirer un" onClick={() => setQty(i.key, i.qty - 1)} className="grid h-8 w-8 place-items-center">
                        <Minus size={14} />
                      </button>
                      <span className="w-5 text-center text-[13px] font-bold">{i.qty}</span>
                      <button aria-label="Ajouter un" onClick={() => setQty(i.key, i.qty + 1)} className="grid h-8 w-8 place-items-center">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="space-y-3 border-t border-white/10 p-5">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Total (fictif)</span>
                <span className="font-display text-[30px] leading-none text-goldlight">{fmtPrice(total)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  clearCart()
                  setDone(true)
                }}
              >
                Simuler la commande
              </Button>
              <p className="text-center text-[11px] text-white/40">Prototype — aucun paiement, aucune donnée bancaire collectée.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
