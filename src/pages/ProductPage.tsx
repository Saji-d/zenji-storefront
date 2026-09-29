import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { productBySlug, relatedProducts } from '../data/products'
import { formatPrice, useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useRadioGroupKeys } from '../hooks/useRadioGroupKeys'
import { useLockBody } from '../hooks/useLockBody'
import type { Size } from '../types'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/motion/Reveal'
import styles from './ProductPage.module.css'

const STATUS_LABEL = {
  'last-units': 'LAST UNITS',
  'selling-fast': 'SELLING FAST',
  limited: 'LIMITED',
} as const

const EASE = [0.22, 1, 0.36, 1] as const

export default function ProductPage() {
  const { slug } = useParams()
  const product = slug ? productBySlug(slug) : undefined
  const { add } = useCart()
  const { has, toggle } = useWishlist()
  const reduce = useReducedMotion()

  const [imageIdx, setImageIdx] = useState(0)
  const [size, setSize] = useState<Size | null>(null)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [addedPulse, setAddedPulse] = useState(false)
  const [openPanel, setOpenPanel] = useState<string | null>('details')

  // reset state when navigating between products
  useEffect(() => {
    setImageIdx(0)
    setSize(null)
    setQty(1)
    setAdded(false)
    setOpenPanel('details')
  }, [slug])

  const images = useMemo(
    () =>
      product
        ? [product.images.front, product.images.back, ...product.images.gallery].filter(
            (s, i, arr) => arr.indexOf(s) === i,
          )
        : [],
    [product],
  )

  const { setRef, onKeyDown } = useRadioGroupKeys(product?.sizes ?? [], size, setSize)
  useLockBody(false)

  if (!product) {
    return (
      <section className={styles.page}>
        <div className="container">
          <p className="eyebrow">_ERROR</p>
          <h1 className={`display ${styles.title}`}>FILE NOT FOUND</h1>
          <p className={styles.story}>That design is not in the archive.</p>
          <Link to="/drop" className="btn btn--primary">Back to the drop →</Link>
        </div>
      </section>
    )
  }

  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0
  const wished = has(product.id)
  const related = relatedProducts(product.slug, 3)

  const handleAdd = () => {
    if (!size) return
    for (let i = 0; i < qty; i++) add(product.id, size)
    setAdded(true)
    setAddedPulse(true)
    window.setTimeout(() => setAddedPulse(false), 500)
    window.setTimeout(() => setAdded(false), 2200)
  }

  const PANELS = [
    { key: 'details', title: 'DETAILS', body: product.story },
    {
      key: 'material',
      title: 'MATERIAL & FIT',
      body: '100% heavyweight 240gsm cotton. Oversized cut with dropped shoulders — true to size for a relaxed drape, size down for a closer fit. Screen-printed original artwork.',
    },
    {
      key: 'shipping',
      title: 'SHIPPING & RETURNS',
      body: 'Ships Australia-wide in 1–2 weeks. Free shipping on orders over A$100. Returns accepted within 14 days on unworn pieces.',
    },
    {
      key: 'drop',
      title: 'DROP NOTES',
      body: 'Pressed once in a limited run of 200 units. No restocks, ever — when your size is gone, the file closes for good.',
    },
  ]

  return (
    <section className={styles.page} aria-labelledby="pdp-title">
      <div className={`container ${styles.grid}`}>
        {/* gallery */}
        <motion.div layout className={styles.gallery}>
          <div className={styles.stage}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={images[imageIdx]}
                src={images[imageIdx]}
                alt={`${product.name} — view ${imageIdx + 1} of ${images.length}`}
                className={styles.stageImg}
                initial={reduce ? false : { opacity: 0, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: 0.32, ease: EASE }}
                loading="eager"
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
        </motion.div>

        {/* info column */}
        <motion.div layout className={styles.info}>
          <p className={styles.eyebrow}>
            THE_ORIGIN_DROP <span aria-hidden="true">//</span> {STATUS_LABEL[product.status]}
          </p>
          <h1 id="pdp-title" className={styles.title}>{product.name}</h1>
          <p className={styles.tagline}>{product.tagline}</p>

          <p className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.compareAt && <s className={styles.compare}>{formatPrice(product.compareAt)}</s>}
          </p>

          <div className={styles.sizeHead}>
            <span className={styles.sizeLabel}>SIZE</span>
            <span className={styles.sizeHint}>OVERSIZED FIT — XS–XXL</span>
          </div>
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
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={qty <= 1}>−</button>
              <span aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(9, q + 1))} aria-label="Increase quantity" disabled={qty >= 9}>+</button>
            </div>
            <motion.button
              type="button"
              className={`btn ${size ? 'btn--primary' : 'btn--ghost'} ${styles.add}`}
              onClick={handleAdd}
              disabled={!size}
              animate={addedPulse ? { scale: [1, 0.97, 1] } : { scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {added ? 'ADDED ✓' : size ? 'ADD TO CART' : 'SELECT A SIZE'}
            </motion.button>
            <button
              type="button"
              className={`${styles.wish} ${wished ? styles.wishActive : ''}`}
              onClick={() => toggle(product.id)}
              aria-pressed={wished}
              aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            >
              ♥
            </button>
          </div>

          {/* info accordions */}
          <div className={styles.panels}>
            {PANELS.map((p) => {
              const open = openPanel === p.key
              return (
                <div key={p.key} className={styles.panel}>
                  <button
                    type="button"
                    className={styles.panelHead}
                    aria-expanded={open}
                    aria-controls={`panel-${p.key}`}
                    onClick={() => setOpenPanel(open ? null : p.key)}
                  >
                    <span>{p.title}</span>
                    <span className={styles.panelIcon} aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`panel-${p.key}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: EASE }}
                        className={styles.panelBody}
                      >
                        <p>{p.body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* next in the arc */}
      <div className={`container ${styles.related}`}>
        <Reveal>
          <div className="section-head">
            <h2 className="display">NEXT IN THE ARC</h2>
            <Link to="/drop" className={styles.relatedLink}>SHOP ALL →</Link>
          </div>
        </Reveal>
        <div className={styles.relatedGrid}>
          {related.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <ProductCard product={p} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
