import { useEffect, useRef, useState } from 'react'
import type { Product, Size } from '../types'
import { formatPrice, useCart } from '../context/CartContext'
import { TeeArt } from './art/TeeArt'
import { SizePicker } from './SizePicker'
import styles from './ProductCard.module.css'

const STATUS_LABEL: Record<Product['status'], string> = {
  'last-units': 'LAST UNITS',
  'selling-fast': 'SELLING FAST',
  limited: 'LIMITED',
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { add } = useCart()
  const [size, setSize] = useState<Size | null>(null)
  const [justAdded, setJustAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0

  const handleAdd = () => {
    if (!size) return
    add(product.id, size)
    setJustAdded(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setJustAdded(false), 1600)
  }

  return (
    <article className={styles.card} aria-label={`${product.name} — ${product.colorway}`}>
      <div className={styles.artPanel} style={{ ['--accent' as string]: product.accent }}>
        <div className={styles.chips}>
          <span className={`${styles.chip} ${styles[`chip--${product.status}`]}`}>
            {STATUS_LABEL[product.status]}
          </span>
          {discount > 0 && <span className={styles.sale}>−{discount}%</span>}
        </div>
        <TeeArt productId={product.id} accent={product.accent} className={styles.art} />
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

        <p className={styles.specs} aria-hidden="true">
          <span>240GSM</span>
          <span>OVERSIZED</span>
          <span>200 UNITS</span>
          <span>{STATUS_LABEL[product.status]}</span>
        </p>

        <SizePicker
          sizes={product.sizes}
          selected={size}
          onSelect={setSize}
          name={product.name}
        />

        <button
          type="button"
          className={`btn ${size ? 'btn--primary' : 'btn--ghost'} ${styles.add}`}
          onClick={handleAdd}
          disabled={!size}
        >
          {justAdded ? 'Added ✓' : size ? 'Add to cart' : 'Select a size'}
        </button>
      </div>
    </article>
  )
}
