import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { formatPrice, useCart } from '../context/CartContext'
import { productById } from '../data/products'
import { FREE_SHIPPING_THRESHOLD } from '../types'
import { SmartImage } from '../components/SmartImage'
import { Reveal } from '../components/motion/Reveal'
import styles from './CartPage.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

export default function CartPage() {
  const { items, totals, setQty, remove, clear } = useCart()

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal)
  const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <section className={styles.page} aria-labelledby="cart-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Your claim // 注文</p>
          <h1 id="cart-title" className={`display ${styles.title}`}>CART</h1>
        </Reveal>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyMark}>_EMPTY</p>
            <p className={styles.emptyText}>
              Nothing claimed yet. Units move fast — don&apos;t sleep on the drop.
            </p>
            <Link to="/drop" className="btn btn--primary">Browse the drop →</Link>
          </div>
        ) : (
          <div className={styles.layout}>
            <ul className={styles.lines}>
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const product = productById(item.productId)
                  if (!product) return null
                  return (
                    <motion.li
                      key={`${item.productId}-${item.size}`}
                      className={styles.line}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <Link to={`/drop/${product.slug}`} className={styles.thumb}>
                        <SmartImage src={product.images.front} alt="" className={styles.thumbImg} />
                      </Link>
                      <div className={styles.lineInfo}>
                        <p className={styles.lineIndex} aria-hidden="true">
                          FILE_{String(item.productId.indexOf(product.slug) + 1).padStart(2, '0')}
                        </p>
                        <Link to={`/drop/${product.slug}`} className={styles.lineName}>
                          {product.name}
                        </Link>
                        <p className={styles.lineMeta}>
                          {product.colorway} <span aria-hidden="true">//</span> {item.size}
                        </p>
                        <div className={styles.qty}>
                          <button
                            type="button"
                            onClick={() => setQty(item.productId, item.size, item.qty - 1)}
                            aria-label={`Decrease quantity of ${product.name}, size ${item.size}`}
                          >
                            −
                          </button>
                          <span aria-live="polite">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.productId, item.size, item.qty + 1)}
                            aria-label={`Increase quantity of ${product.name}, size ${item.size}`}
                            disabled={item.qty >= 9}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className={styles.lineRight}>
                        <p className={styles.linePrice}>{formatPrice(product.price * item.qty)}</p>
                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() => remove(item.productId, item.size)}
                          aria-label={`Remove ${product.name}, size ${item.size} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </ul>

            <aside className={styles.summary} aria-label="Order summary">
              <div className={styles.shipping}>
                <p className={styles.shipMsg}>
                  {remaining > 0 ? (
                    <>
                      <strong>{formatPrice(remaining)}</strong> away from free Australia-wide shipping
                    </>
                  ) : (
                    <>✦ Free Australia-wide shipping unlocked</>
                  )}
                </p>
                <div
                  className={styles.meter}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-label="Progress towards free shipping"
                >
                  <motion.div
                    className={styles.meterFill}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </div>
              </div>

              <dl className={styles.totals}>
                {totals.savings > 0 && (
                  <div className={styles.totalRow}>
                    <dt>You save</dt>
                    <dd className={styles.savings}>−{formatPrice(totals.savings)}</dd>
                  </div>
                )}
                <div className={styles.totalRow}>
                  <dt>Subtotal</dt>
                  <dd className={styles.subtotal}>{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className={styles.totalRow}>
                  <dt>Shipping</dt>
                  <dd className={styles.shipValue}>
                    {remaining > 0 ? 'Calculated at checkout' : 'Free'}
                  </dd>
                </div>
              </dl>

              <button type="button" className={`btn ${styles.demoBtn}`} disabled>
                Demo mode // checkout disabled
              </button>
              <p className={styles.note}>
                Demo cart — no real payments. Ships Australia-wide in 1–2 weeks.
              </p>
              <button type="button" className={styles.clear} onClick={clear}>
                Empty cart
              </button>
              <Link to="/drop" className={styles.continue}>
                CONTINUE SHOPPING →
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
