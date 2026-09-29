import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCTS } from '../data/products'
import { useWishlist } from '../context/WishlistContext'
import type { Product } from '../types'
import { ProductCard } from '../components/ProductCard'
import { QuickView } from '../components/QuickView'
import { Reveal } from '../components/motion/Reveal'
import styles from './Shop.module.css'

export default function Wishlist() {
  const { ids } = useWishlist()
  const [quickView, setQuickView] = useState<Product | null>(null)
  const saved = PRODUCTS.filter((p) => ids.has(p.id))

  return (
    <section className={styles.page} aria-labelledby="wishlist-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">The watch list // ウィッシュリスト</p>
          <h1 id="wishlist-title" className={`display ${styles.title}`}>WISHLIST</h1>
          <p className={styles.lede}>
            Saved designs live here — until the run closes. No restocks means no second chances.
          </p>
        </Reveal>

        {saved.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyMark}>_NONE_SAVED</p>
            <p className={styles.emptyText}>
              Nothing on the watch list yet. Tap the heart on any design to file it here.
            </p>
            <Link to="/drop" className="btn btn--primary">Browse the drop →</Link>
          </div>
        ) : (
          <>
            <p className={styles.count} aria-live="polite">
              {saved.length} DESIGN{saved.length === 1 ? '' : 'S'} SAVED
            </p>
            <div className={styles.grid}>
              {saved.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.05}>
                  <ProductCard product={p} onQuickView={setQuickView} index={i} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}
