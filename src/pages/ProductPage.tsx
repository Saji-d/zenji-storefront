import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { productBySlug, relatedProducts } from '../data/products'
import { formatPrice, useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useRadioGroupKeys } from '../hooks/useRadioGroupKeys'
import type { Size } from '../types'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/motion/Reveal'
import styles from './ProductPage.module.css'

const EASE = [0.22, 1, 0.36, 1] as const
const MAX_QTY = 9

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
  const [openPanel, setOpenPanel] = useState<string | null>('details')
  const sizeGroupRef = useRef<HTMLDivElement | null>(null)

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

  if (!product) {
    return (
      <section className={styles.page}>
        <div className="container">
          <p className="eyebrow">404</p>
          <h1 className={`display ${styles.title}`}>Design not found</h1>
          <p className={styles.story}>
            This design is not part of the current drop.
          </p>
          <Link to="/drop" className="btn btn--primary">
            Back to the drop
          </Link>
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
    if (!size) {
      // from the sticky bar: send the customer to the size choice
      sizeGroupRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      sizeGroupRef.current?.querySelector<HTMLElement>('[role="radio"]')?.focus()
      return
    }
    for (let i = 0; i < qty; i++) add(product.id, size)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  const PANELS = [
    { key: 'details', title: 'The design', body: product.story },
    {
      key: 'material',
      title: 'Material and fit',
      body: '100% heavyweight 240gsm cotton, garment washed so it keeps its shape and screen-printed to survive the wash cycle. Oversized streetwear cut with dropped shoulders, sizes XS to XXL. Size down for a closer fit.',
    },
    {
      key: 'shipping',
      title: 'Shipping and returns',
      body: 'Dispatched from Australia and delivered in 1–2 weeks. Free shipping on orders over A$100, otherwise A$9.99. Unworn pieces can be returned within 14 days.',
    },
    {
      key: 'drop',
      title: 'Drop notes',
      body: 'Original artwork drawn for this drop and printed once. Runs are small and finite. Once a size sells through it is never reprinted.',
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
                alt={`${product.name} in ${product.colorway}, view ${imageIdx + 1} of ${images.length}`}
                className={styles.stageImg}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                width={900}
                height={1350}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                draggable={false}
              />
            </AnimatePresence>
            {discount > 0 && <span className={styles.sale}>{discount}% off</span>}
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
          <p className="eyebrow">The Origin Drop</p>
          <h1 id="pdp-title" className={styles.title}>
            {product.name}
          </h1>
          {product.status === 'last-units' && <p className={styles.stock}>Last units</p>}

          <p className={styles.priceRow}>
            <span className={discount ? styles.priceSale : styles.price}>
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <s className={styles.compare}>
                <span className="sr-only">Original price </span>
                {formatPrice(product.compareAt)}
              </s>
            )}
          </p>

          <div className={styles.sizeHead}>
            <span className={styles.sizeLabel}>Size</span>
            <span className={styles.sizeHint}>Oversized fit, XS–XXL</span>
          </div>
          <div
            ref={sizeGroupRef}
            className={styles.sizes}
            role="radiogroup"
            aria-label={`Size: ${product.name}`}
          >
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
                &minus;
              </button>
              <span aria-live="polite">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                aria-label="Increase quantity"
                disabled={qty >= MAX_QTY}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={`btn ${size ? 'btn--primary' : 'btn--ghost'} ${styles.add}`}
              onClick={handleAdd}
            >
              {added ? 'Added to cart' : size ? 'Add to bag' : 'Select a size'}
            </button>

            <button
              type="button"
              className={`${styles.wish} ${wished ? styles.wishActive : ''}`}
              onClick={() => toggle(product.id)}
              aria-pressed={wished}
              aria-label={
                wished
                  ? `Remove ${product.name} from wishlist`
                  : `Save ${product.name} to wishlist`
              }
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path
                  d="M10 16.5 3.9 10.6a4 4 0 1 1 5.7-5.6l.4.4.4-.4a4 4 0 1 1 5.7 5.6Z"
                  fill={wished ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.35"
                />
              </svg>
            </button>
          </div>

          <p className={styles.reassure}>
            Free shipping over A$100 · dispatched from Australia
          </p>

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
                    <span className={styles.panelIcon} aria-hidden="true">
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`panel-${p.key}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: EASE }}
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

      {/* mobile-only sticky add to bag */}
      <div className={styles.stickyBar}>
        <div className={styles.stickyInfo}>
          <p className={styles.stickyName}>{product.name}</p>
          <p className={styles.stickyPrice}>{formatPrice(product.price)}</p>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={handleAdd}
        >
          {size ? 'Add to bag' : 'Select size'}
        </button>
      </div>

      {/* related */}
      <div className={`container ${styles.related}`}>
        <Reveal>
          <div className="section-head">
            <h2 className="display">You may also like</h2>
            <Link to="/drop" className="link-line">
              Shop all
            </Link>
          </div>
        </Reveal>
        <div className={styles.relatedGrid}>
          {related.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
