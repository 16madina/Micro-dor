import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cx } from '../ui'

/**
 * Fenêtre modale partagée par les pages Mission (prévention, partenaires).
 * Rendue dans un portail pour échapper aux conteneurs animés (transform).
 * Feuille glissante sur mobile, boîte centrée sur ordinateur.
 */
export default function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  className,
  wide = false,
}: {
  open: boolean
  onClose: () => void
  title?: ReactNode
  eyebrow?: ReactNode
  children: ReactNode
  className?: string
  wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[85] flex items-end justify-center lg:items-center lg:p-8" role="dialog" aria-modal="true">
      <button aria-label="Fermer" onClick={onClose} className="absolute inset-0 animate-fadeIn cursor-default bg-ink/80 backdrop-blur-md" />
      <div
        className={cx(
          'relative max-h-[92vh] w-full animate-slideUp overflow-y-auto rounded-t-3xl border border-gold/25 bg-gradient-to-b from-night2 to-ink shadow-[0_30px_120px_-20px_rgba(104,55,181,.55)] lg:animate-fadeUp lg:rounded-3xl',
          wide ? 'lg:max-w-4xl' : 'lg:max-w-xl',
          className,
        )}
      >
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-white/20 lg:hidden" />
        <button
          onClick={onClose}
          aria-label="Fermer la fenêtre"
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-ink/60 text-white/80 backdrop-blur transition hover:border-gold/50 hover:text-goldlight"
        >
          <X size={18} />
        </button>
        {(title || eyebrow) && (
          <div className="px-5 pb-1 pt-5 pr-16 lg:px-7 lg:pt-7">
            {eyebrow && <div className="eyebrow mb-1.5">{eyebrow}</div>}
            {title && <h2 className="font-display text-[30px] leading-none tracking-wide lg:text-[36px]">{title}</h2>}
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
