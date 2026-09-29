import styles from './ProductCard.module.css'
import type { Product } from '../types'
import { formatPrice } from '../context/CartContext'
import { SmartImage } from './SmartImage'

const STATUS_LABEL: Record<Product['status'], string> = {
  'last-units': 'LAST UNITS',
  'selling-fast': 'SELLING FAST',
  limited: 'LIMITED',
}

interface ProductCardProps {
  product: Product
  onQuickView: (product: Product) => void
  priority?: boolean
}

export function ProductCard({ product, onQuickView, priority = false }: ProductCardProps) {
  const hasBack = product.images.back !== product.images.front
  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0

  return (
    <article className={styles.card} aria-label={`${product.name} — ${product.colorway}`}>
      <div className={styles.media}>
        <div className={styles.frame}>
          <SmartImage
            src={product.images.front}
            alt={`${product.name} — ${product.colorway}, front`}
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

        <div className={styles.chips}>
          <span className={`${styles.chip} ${styles[`chip--${product.status}`]}`}>
            {STATUS_LABEL[product.status]}
          </span>
          {discount > 0 && <span className={styles.sale}>−{discount}%</span>}
        </div>

        <button
          type="button"
          className={styles.quickView}
          onClick={() => onQuickView(product)}
          aria-label={`Quick view — ${product.name}`}
        >
          QUICK VIEW
        </button>
      </div>

      <div className={styles.meta}>
        <p className={styles.colorway}>{product.colorway}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.tagline}>{product.tagline}</p>
        <p className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.compareAt && (
            <s className={styles.compare}>{formatPrice(product.compareAt)}</s>
          )}
        </p>
      </div>
    </article>
  )
}
