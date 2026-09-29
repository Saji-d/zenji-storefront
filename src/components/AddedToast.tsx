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
 * Spatial "added to cart" feedback: thumbnail + name slide in bottom-left,
 * with a direct path to the cart. Auto-dismisses after 3.2s.
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
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.thumb}>
            <SmartImage src={product.images.front} alt="" className={styles.thumbImg} />
          </div>
          <div className={styles.copy}>
            <p className={styles.added}>
              ADDED <span aria-hidden="true">//</span> {product.name} — {lastAdded.size}
            </p>
            <p className={styles.count}>
              {totals.count} item{totals.count === 1 ? '' : 's'} in cart
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
                VIEW CART
              </button>
              <Link to="/cart" className={styles.toCart} onClick={onClose}>
                CART PAGE →
              </Link>
            </div>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Dismiss notification">
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
