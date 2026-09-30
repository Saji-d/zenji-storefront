import { Link } from 'react-router-dom'
import styles from './ProductCard.module.css'
import type { Product } from '../types'
import { formatPrice } from '../context/CartContext'
import { SmartImage } from './SmartImage'

interface ProductCardProps {
  product: Product
  /** omitted on PDP-related cards, where navigating is the right action */
  onQuickView?: (product: Product) => void
  priority?: boolean
}

/**
 * Discovery card.
 *
 * Deliberately restrained: no ordinal index, no tagline on every tile, and at
 * most one accent chip. Stock is a real constraint for this label, so
 * "Last units" earns the red; "Limited" on a run that is limited by definition
 * does not, and saying it on all nine just adds noise.
 */
export function ProductCard({ product, onQuickView, priority = false }: ProductCardProps) {
  const hasBack = product.images.back !== product.images.front
  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <div className={styles.frame}>
          <SmartImage
            src={product.images.front}
            alt={`${product.name} tee in ${product.colorway}`}
            className={styles.imgFront}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
          />
          {hasBack && (
            <SmartImage
              src={product.images.back}
              alt=""
              className={styles.imgBack}
              loading="lazy"
            />
          )}
          <div className={styles.shade} aria-hidden="true" />
        </div>

        {product.status === 'last-units' && (
          <p className={styles.stock}>Last units</p>
        )}

        {onQuickView && (
          <button
            type="button"
            className={styles.quickView}
            onClick={() => onQuickView(product)}
            aria-label={`Quick view — ${product.name}`}
          >
            Quick view
          </button>
        )}
      </div>

      <div className={styles.meta}>
        <h3 className={styles.name}>
          <Link to={`/drop/${product.slug}`} className={styles.nameLink}>
            {product.name}
          </Link>
        </h3>

        <p className={styles.priceRow}>
          <span className={discount ? styles.priceSale : styles.price}>
            {formatPrice(product.price)}
          </span>
          {product.compareAt && <s className={styles.compare}>{formatPrice(product.compareAt)}</s>}
          {discount > 0 && <span className={styles.off}>{discount}% off</span>}
        </p>

        <p className={styles.colorway}>{product.colorway}</p>
      </div>
    </article>
  )
}
