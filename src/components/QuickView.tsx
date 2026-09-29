import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Product, Size } from '../types'
import { formatPrice, useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useModalFocus } from '../hooks/useModalFocus'
import { useLockBody } from '../hooks/useLockBody'
import { useRadioGroupKeys } from '../hooks/useRadioGroupKeys'
import styles from './QuickView.module.css'

interface QuickViewProps {
  product: Product | null
  onClose: () => void
}

const STATUS_LABEL: Record<Product['status'], string> = {
  'last-units': 'LAST UNITS',
  'selling-fast': 'SELLING FAST',
  limited: 'LIMITED',
}

export function QuickView({ product, onClose }: QuickViewProps) {
  const { add } = useCart()
  const { has, toggle } = useWishlist()
  const reduce = useReducedMotion()

  const open = product !== null
  const { panelRef } = useModalFocus({ open, onClose })
  useLockBody(open)

  const [imageIdx, setImageIdx] = useState(0)
  const [size, setSize] = useState<Size | null>(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  // reset per product
  useEffect(() => {
    if (product) {
      setImageIdx(0)
      setSize(null)
      setQty(1)
      setAdded(false)
    }
  }, [product])

  const { setRef, onKeyDown } = useRadioGroupKeys(
    product?.sizes ?? [],
    size,
    setSize,
  )

  const images = useMemo(() => {
    if (!product) return []
    return [product.images.front, product.images.back, ...product.images.gallery].filter(
      (src, i, arr) => arr.indexOf(src) === i,
    )
  }, [product])

  const discount =
    product?.compareAt != null
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0

  const handleAdd = () => {
    if (!product || !size) return
    for (let i = 0; i < qty; i++) add(product.id, size)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <AnimatePresence>
      {product && (
        <div className={styles.root}>
          <motion.div
            className={styles.overlay}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} — quick view`}
            className={styles.panel}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 46, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.99 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close quick view"
            >
              ✕
            </button>

            <div className={styles.gallery}>
              <div className={styles.stage}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={images[imageIdx]}
                    src={images[imageIdx]}
                    alt={`${product.name} — view ${imageIdx + 1} of ${images.length}`}
                    className={styles.stageImg}
                    initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </AnimatePresence>
                {discount > 0 && <span className={styles.sale}>−{discount}%</span>}
              </div>

              {images.length > 1 && (
                <div className={styles.thumbs} role="tablist" aria-label="Product views">
                  {images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      role="tab"
                      aria-selected={i === imageIdx}
                      aria-label={`View ${i + 1}`}
                      className={`${styles.thumb} ${i === imageIdx ? styles.thumbActive : ''}`}
                      onClick={() => setImageIdx(i)}
                    >
                      <img src={src} alt="" loading="lazy" decoding="async" draggable={false} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.info}>
              <p className={styles.eyebrow}>THE_ORIGIN_DROP // {STATUS_LABEL[product.status]}</p>
              <h3 className={styles.title}>{product.name}</h3>
              <p className={styles.colorway}>{product.colorway}</p>
              <p className={styles.tagline}>{product.tagline}</p>

              <p className={styles.priceRow}>
                <span className={styles.price}>{formatPrice(product.price)}</span>
                {product.compareAt && (
                  <s className={styles.compare}>{formatPrice(product.compareAt)}</s>
                )}
              </p>

              <div className={styles.sizes} role="radiogroup" aria-label={`Size — ${product.name}`}>
                {product.sizes.map((s, i) => (
                  <button
                    key={s}
                    ref={setRef(i)}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    tabIndex={size === s || (size === null && i === 0) ? 0 : -1}
                    className={`${styles.size} ${size === s ? styles.sizeActive : ''}`}
                    onClick={() => {
                      setSize(s)
                      setAdded(false)
                    }}
                    onKeyDown={onKeyDown}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className={styles.actionsRow}>
                <div className={styles.qty} aria-label="Quantity">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <span aria-live="polite">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(9, q + 1))}
                    aria-label="Increase quantity"
                    disabled={qty >= 9}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className={`btn ${size ? 'btn--primary' : 'btn--ghost'} ${styles.add}`}
                  onClick={handleAdd}
                  disabled={!size}
                >
                  {added ? 'Added ✓' : size ? 'Add to cart' : 'Select a size'}
                </button>

                <button
                  type="button"
                  className={`${styles.wish} ${has(product.id) ? styles.wishActive : ''}`}
                  onClick={() => toggle(product.id)}
                  aria-pressed={has(product.id)}
                  aria-label={has(product.id) ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                >
                  ♥
                </button>
              </div>

              <p className={styles.note}>
                240GSM HEAVYWEIGHT // OVERSIZED // SHIPS AU-WIDE // NO RESTOCKS
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
