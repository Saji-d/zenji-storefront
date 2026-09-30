import { formatPrice, useCart } from '../context/CartContext'
import { FREE_SHIPPING_THRESHOLD } from '../types'
import { productById } from '../data/products'
import { useCartDrawer } from '../hooks/useCartDrawer'
import { SmartImage } from './SmartImage'
import styles from './CartDrawer.module.css'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

const MAX_QTY = 9

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totals, setQty, remove, clear } = useCart()
  const { panelRef } = useCartDrawer({ open, onClose })

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal)
  const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <div
      className={`${styles.root} ${open ? styles.open : ''}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <header className={styles.head}>
          <h2 className={styles.title}>
            Your cart
            {totals.count > 0 && <span className={styles.count}>{totals.count}</span>}
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close cart"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path
                d="M3 3l10 10M13 3L3 13"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Your cart is empty</p>
            <p className={styles.emptyText}>
              The Origin Drop is a limited run, so pieces do not wait around.
            </p>
            <button type="button" className="btn btn--ghost" onClick={onClose}>
              Browse the drop
            </button>
          </div>
        ) : (
          <>
            <ul className={styles.lines}>
              {items.map((item) => {
                const product = productById(item.productId)
                if (!product) return null
                return (
                  <li key={`${item.productId}-${item.size}`} className={styles.line}>
                    <div className={styles.thumb}>
                      <SmartImage
                        src={product.images.front}
                        alt=""
                        className={styles.thumbImg}
                      />
                    </div>

                    <div className={styles.lineInfo}>
                      <p className={styles.lineName}>{product.name}</p>
                      <p className={styles.lineMeta}>
                        {product.colorway} · Size {item.size}
                      </p>
                      <div className={styles.qty}>
                        <button
                          type="button"
                          onClick={() => setQty(item.productId, item.size, item.qty - 1)}
                          aria-label={`Decrease quantity of ${product.name}, size ${item.size}`}
                        >
                          &minus;
                        </button>
                        <span aria-live="polite">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(item.productId, item.size, item.qty + 1)}
                          aria-label={`Increase quantity of ${product.name}, size ${item.size}`}
                          disabled={item.qty >= MAX_QTY}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className={styles.lineRight}>
                      <p className={styles.linePrice}>
                        {formatPrice(product.price * item.qty)}
                      </p>
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => remove(item.productId, item.size)}
                        aria-label={`Remove ${product.name}, size ${item.size} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className={styles.foot}>
              <div className={styles.shipping}>
                <p className={styles.shipMsg}>
                  {remaining > 0 ? (
                    <>
                      <strong>{formatPrice(remaining)}</strong> away from free shipping
                    </>
                  ) : (
                    'Free Australia-wide shipping unlocked'
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
                  <div className={styles.meterFill} style={{ width: `${progress}%` }} />
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
                  <dd>{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className={styles.totalRow}>
                  <dt>Shipping</dt>
                  <dd>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</dd>
                </div>
                <div className={`${styles.totalRow} ${styles.grand}`}>
                  <dt>Total</dt>
                  <dd>{formatPrice(totals.total)}</dd>
                </div>
              </dl>

              <button type="button" className="btn btn--primary btn--block" disabled>
                Checkout unavailable
              </button>

              <p className={styles.note}>
                Demonstration storefront. No payment is taken. Real orders ship from
                Australia in 1–2 weeks.
              </p>

              <button type="button" className={styles.clear} onClick={clear}>
                Empty cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
