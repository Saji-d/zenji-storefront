import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { productById } from '../data/products'
import { useCart } from '../context/CartContext'
import { SmartImage } from './SmartImage'
import styles from './AddedToast.module.css'

interface AddedToastProps {
  /** productId + size of the most recent addition, or null when hidden */
  lastAdded: { productId: string; size: string } | null
  onClose: () => void
  onOpenCart: () => void
}

/**
 * "Added to cart" feedback: thumbnail + name slide in bottom-left, with a
 * direct path to the cart. Auto-dismisses via the caller's timer.
 */
export function AddedToast({ lastAdded, onClose, onOpenCart }: AddedToastProps) {
  const { totals } = useCart()
  const product = lastAdded ? productById(lastAdded.productId) : undefined

  return (
    <AnimatePresence>
      {lastAdded && product && (
        <motion.div
          className={styles.toast}
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.thumb}>
            <SmartImage src={product.images.front} alt="" className={styles.thumbImg} />
          </div>
          <div className={styles.copy}>
            <p className={styles.added}>
              Added &mdash; {product.name} ({lastAdded.size})
            </p>
            <p className={styles.count}>
              {totals.count} item{totals.count === 1 ? '' : 's'} in bag
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.viewCart}
                onClick={() => {
                  onClose()
                  onOpenCart()
                }}
              >
                View bag
              </button>
              <Link to="/cart" className={styles.toCart} onClick={onClose}>
                Checkout
              </Link>
            </div>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Dismiss notification"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path
                d="M5 5l10 10M15 5L5 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
