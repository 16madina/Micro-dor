import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, CheckCircle2, FlaskConical, PackageCheck, Plus, ShoppingBag, Sparkles, Ticket, X } from 'lucide-react'
import { fmtPrice, type Product } from '../data'
import { useApp } from '../state/AppState'
import ProductArt from '../components/art/ProductArt'
import { Button, DemoPill, PageHero, Tabs, cx } from '../components/ui'
import MusicLibrary from '../components/music/MusicLibrary'
import ShopAdmin from '../components/shop/ShopAdmin'
import { useSearchParams } from 'react-router-dom'
import { DemoNotice } from '../components/spaces/SpaceUI'

function Badge({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cx('rounded-full bg-gold-soft px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ink shadow-gold', className)}>
      {children}
    </span>
  )
}

function ProductCard({ product, onOpen, onQuickAdd, featured = false }: { product: Product; onOpen: () => void; onQuickAdd: () => void; featured?: boolean }) {
  const isTicket = product.kind === 'ticket'
  return (
    <div
      className={cx(
        'group relative h-full overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-night2 to-night shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-gold',
      )}
    >
      <button
        onClick={onOpen}
        className={cx('block h-full w-full text-left', isTicket && 'max-lg:flex', featured && 'lg:flex')}
        aria-label={`Voir ${product.name}`}
      >
        <div
          className={cx(
            'relative overflow-hidden bg-[#0c0e18]',
            isTicket ? 'aspect-square w-[42%] shrink-0 lg:w-full' : featured ? 'aspect-square lg:aspect-auto lg:w-[52%] lg:shrink-0' : 'aspect-square',
          )}
        >
          <ProductArt kind={product.kind} className="absolute inset-0 h-full w-full transition duration-700 group-hover:scale-105" />
          {product.badge && <Badge className="absolute left-3 top-3">{product.badge}</Badge>}
        </div>
        <div className={cx('flex flex-col justify-center p-3.5 lg:p-4', featured && 'lg:flex-1 lg:p-8')}>
          {featured && <div className="eyebrow mb-2 hidden lg:block">Pièce signature</div>}
          <div
            className={cx(
              'font-bold leading-tight',
              featured ? 'text-[14.5px] lg:font-display lg:text-[44px] lg:font-normal lg:leading-[0.95] lg:tracking-wide' : 'text-[14.5px]',
            )}
          >
            {product.name}
          </div>
          {(isTicket || featured) && (
            <p className={cx('mt-1.5 text-[12.5px] leading-relaxed text-white/55', featured && 'hidden lg:block lg:max-w-xs lg:text-[14px]')}>
              {product.description}
            </p>
          )}
          <div className={cx('mt-1.5 font-display text-[24px] leading-none tracking-wide text-gold-metal', featured && 'lg:mt-4 lg:text-[34px]')}>
            {fmtPrice(product.price)}
          </div>
          {product.sizes && (
            <div className="mt-1.5 text-[11px] text-white/40">
              Tailles {product.sizes[0]} à {product.sizes[product.sizes.length - 1]}
            </div>
          )}
          {featured && (
            <span className="mt-5 hidden w-fit items-center gap-2 rounded-full border border-gold/60 px-5 py-2.5 text-[13px] font-bold text-goldlight lg:inline-flex">
              Choisir ma taille →
            </span>
          )}
        </div>
      </button>
      <button
        onClick={onQuickAdd}
        aria-label={product.sizes ? `Choisir une taille pour ${product.name}` : `Ajouter ${product.name} au panier`}
        title={product.sizes ? 'Choisir une taille' : 'Ajouter au panier'}
        className={cx(
          'absolute grid h-10 w-10 place-items-center rounded-full bg-gold-soft text-ink shadow-gold transition hover:scale-105 active:scale-95',
          isTicket ? 'bottom-3 right-3' : 'right-3 top-3',
        )}
      >
        <Plus size={20} strokeWidth={2.6} />
      </button>
    </div>
  )
}

function ProductSheet({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addToCart, toast, setCartOpen } = useApp()
  const [size, setSize] = useState<string | undefined>(product.sizes ? (product.sizes.includes('M') ? 'M' : product.sizes[0]) : undefined)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', k)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const add = () => {
    addToCart(product.id, size)
    toast(`${product.name}${size ? ` (${size})` : ''} ajouté au panier fictif`)
    setAdded(true)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center lg:items-center" role="dialog" aria-modal="true" aria-label={product.name}>
      <div className="absolute inset-0 animate-fadeIn bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[92dvh] w-full animate-slideUp overflow-y-auto overscroll-contain rounded-t-3xl pb-[env(safe-area-inset-bottom)] border-t border-gold/30 bg-ink shadow-card lg:max-w-3xl lg:animate-fadeUp lg:rounded-3xl lg:border">
        <div className="sticky top-0 z-10 flex justify-center pt-2.5 lg:hidden">
          <span className="h-1 w-10 rounded-full bg-white/20" />
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-ink/70 text-white/80 backdrop-blur hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>
        <div className="lg:grid lg:grid-cols-2">
          <div className="relative mx-4 mt-2 aspect-[4/3] overflow-hidden rounded-2xl lg:m-0 lg:aspect-auto lg:min-h-[440px] lg:rounded-none">
            <ProductArt kind={product.kind} className="absolute inset-0 h-full w-full" />
            {product.badge && <Badge className="absolute left-3 top-3">{product.badge}</Badge>}
            <DemoPill className="absolute bottom-3 left-3 bg-ink/60 backdrop-blur">Visuel de démonstration</DemoPill>
          </div>
          <div className="flex flex-col p-5 lg:p-7">
            <div className="eyebrow mb-1.5">Collection MICRO D’OR</div>
            <h2 className="font-display text-[38px] leading-[0.95] tracking-wide">{product.name}</h2>
            <div className="mt-2 font-display text-[32px] leading-none tracking-wide text-gold-metal">{fmtPrice(product.price)}</div>
            <p className="mt-3 text-[14px] leading-relaxed text-white/65">{product.description}</p>

            {added ? (
              <div className="mt-6 animate-fadeUp rounded-2xl border border-gold/30 bg-gold/[0.06] p-4">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={22} className="text-gold" />
                  <div>
                    <div className="text-[14.5px] font-extrabold">Ajouté au panier</div>
                    <div className="text-[12px] text-white/55">Panier fictif — aucun paiement réel.</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    size="md"
                    icon={<ShoppingBag size={17} />}
                    onClick={() => {
                      onClose()
                      setCartOpen(true)
                    }}
                  >
                    Voir le panier
                  </Button>
                  <Button size="md" variant="dark" onClick={onClose}>
                    Continuer
                  </Button>
                </div>
                <button onClick={() => setAdded(false)} className="mt-3 w-full text-center text-[12.5px] font-semibold text-gold hover:text-goldlight">
                  Ajouter un autre exemplaire
                </button>
              </div>
            ) : (
              <>
                {product.sizes && (
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[12px] font-bold uppercase tracking-wider text-white/50">Taille</span>
                      <span className="text-[12px] font-semibold text-goldlight">{size}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          aria-pressed={size === s}
                          className={cx(
                            'h-11 min-w-[52px] rounded-xl px-3 text-[14px] font-bold transition',
                            size === s ? 'bg-gold-soft text-ink shadow-gold' : 'border border-white/15 bg-white/[0.04] text-white/80 hover:border-gold/40',
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <ul className="mt-5 space-y-1.5 text-[12.5px] text-white/55">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-gold" /> Article fictif présenté à titre d’exemple
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-gold" /> Aucune commande ni livraison réelle
                  </li>
                </ul>
                <div className="mt-auto pt-6">
                  <Button size="lg" className="w-full" icon={<ShoppingBag size={18} />} onClick={add}>
                    Ajouter au panier · {fmtPrice(product.price)}
                  </Button>
                  <p className="mt-2.5 text-center text-[11px] text-white/40">Boutique de démonstration — aucun paiement réel</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Shop() {
  const { cart, setCartOpen, addToCart, toast, products: PRODUCTS, isOrganizer } = useApp()
  const [params, setParams] = useSearchParams()
  const o = params.get('onglet')
  const tab = o === 'musiques' ? 'musiques' : o === 'gestion' && isOrganizer ? 'gestion' : 'produits'
  const [openId, setOpenId] = useState<string | null>(null)
  const close = useCallback(() => setOpenId(null), [])
  const n = cart.reduce((a, i) => a + i.qty, 0)
  const total = cart.reduce((a, i) => a + i.qty * (PRODUCTS.find((p) => p.id === i.productId)?.price ?? 0), 0)
  const product = PRODUCTS.find((p) => p.id === openId)
  const order = ['tshirt', 'cap', 'hoodie', 'album', 'ticket']
  const products = [...PRODUCTS].sort((a, b) => (order.indexOf(a.id) + 1 || 99) - (order.indexOf(b.id) + 1 || 99))

  const quickAdd = (p: Product) => {
    if (p.sizes) return setOpenId(p.id)
    addToCart(p.id)
    toast(`${p.name} ajouté au panier fictif`)
  }

  return (
    <div className="pb-16 lg:pb-0">
      <PageHero
        eyebrow="Produits dérivés et musiques"
        title={
          <>
            Boutique <span className="text-gold-metal">MICRO D’OR</span>
          </>
        }
        sub="Portez les couleurs de la scène. Une collection noire et or pensée pour les talents, leurs familles et leurs fans."
      >
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" icon={<ShoppingBag size={15} />} onClick={() => setCartOpen(true)}>
            Voir le panier ({n})
          </Button>
          <DemoPill>Produits fictifs</DemoPill>
        </div>
      </PageHero>

      <Tabs
        className="mb-6"
        value={tab}
        onChange={(v) => setParams(v === 'produits' ? {} : { onglet: v }, { replace: true })}
        tabs={[
          { value: 'produits', label: 'Produits dérivés' },
          { value: 'musiques', label: 'Nos musiques' },
          ...(isOrganizer ? [{ value: 'gestion', label: 'Gestion (organisateur)' }] : []),
        ]}
      />

      {tab === 'gestion' ? (
        <ShopAdmin />
      ) : tab === 'musiques' ? (
        <MusicLibrary embedded />
      ) : (
        <>
      <DemoNotice title="Boutique de démonstration" icon={FlaskConical} className="mb-6 animate-fadeUp">
        aucun paiement réel. Les produits, prix et commandes sont simulés pour illustrer le futur parcours d’achat.
      </DemoNotice>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
        {products.map((p, i) => (
          <div
            key={p.id}
            className={cx('animate-fadeUp', p.kind === 'ticket' && 'col-span-2 lg:col-span-1', p.id === 'tshirt' && 'lg:col-span-2')}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <ProductCard product={p} featured={p.id === 'tshirt'} onOpen={() => setOpenId(p.id)} onQuickAdd={() => quickAdd(p)} />
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: Sparkles,
            t: 'Design noir et or',
            d: 'L’identité MICRO D’OR, du micro doré au logo brodé.',
          },
          {
            icon: PackageCheck,
            t: 'Livraison simulée',
            d: 'Aucun colis n’est expédié : c’est une maquette.',
          },
          {
            icon: Ticket,
            t: 'Billets de démonstration',
            d: 'Aucun billet réel n’est émis dans ce prototype.',
          },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="card flex items-start gap-3 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-goldlight">
              <Icon size={18} />
            </span>
            <div>
              <div className="text-[14px] font-bold">{t}</div>
              <div className="mt-0.5 text-[12.5px] leading-relaxed text-white/55">{d}</div>
            </div>
          </div>
        ))}
      </div>

        </>
      )}

      {/* Bouton panier flottant (portail : hors du conteneur animé de la page) */}
      {tab === 'produits' && createPortal(
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-[calc(80px+env(safe-area-inset-bottom))] right-[max(16px,env(safe-area-inset-right))] z-30 flex h-12 items-center gap-2.5 rounded-full bg-gold-soft pl-4 pr-5 text-[14px] font-extrabold text-ink shadow-gold transition hover:brightness-110 active:scale-95 lg:bottom-8 lg:right-10"
        >
          <span className="relative">
            <ShoppingBag size={19} />
            {n > 0 && (
              <span
                key={n}
                className="absolute -right-2 -top-2 grid h-4 min-w-4 animate-fadeUp place-items-center rounded-full bg-ink px-1 text-[9px] font-extrabold text-goldlight"
              >
                {n}
              </span>
            )}
          </span>
          Voir le panier ({n}){n > 0 && <span className="hidden border-l border-ink/20 pl-2.5 font-bold sm:inline">{fmtPrice(total)}</span>}
        </button>,
        document.body,
      )}

      {product && createPortal(<ProductSheet key={product.id} product={product} onClose={close} />, document.body)}
    </div>
  )
}
