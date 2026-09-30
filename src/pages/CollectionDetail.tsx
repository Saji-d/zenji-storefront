import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { COLLECTIONS, PRODUCTS } from '../data/products'
import type { Product } from '../types'
import { ProductCard } from '../components/ProductCard'
import { QuickView } from '../components/QuickView'
import { Reveal } from '../components/motion/Reveal'
import styles from './Shop.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

export default function CollectionDetail() {
  const { slug } = useParams()
  const [quickView, setQuickView] = useState<Product | null>(null)

  const collection = COLLECTIONS.find((c) => c.slug === slug)

  const items = useMemo(() => {
    if (!collection) return []
    switch (collection.slug) {
      case 'marked-down':
        return PRODUCTS.filter((p) => p.compareAt)
      case 'final-units':
        return PRODUCTS.filter((p) => p.status === 'last-units')
      default:
        return PRODUCTS
    }
  }, [collection])

  if (!collection) {
    return (
      <section className={styles.page}>
        <div className="container">
          <p className="eyebrow">404</p>
          <h1 className={`display ${styles.title}`}>Collection not found</h1>
          <p className={styles.lede}>
            This collection is not part of the current drop.
          </p>
          <Link to="/collection" className="btn btn--primary">
            Back to collections
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.page} aria-labelledby="collection-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">
            <Link to="/collection" className={styles.crumb}>
              Collections
            </Link>
          </p>
          <h1 id="collection-title" className={`display ${styles.title}`}>
            {collection.title}
          </h1>
          <p className={styles.lede}>{collection.subtitle}</p>
        </Reveal>

        <p className={styles.count} aria-live="polite">
          {items.length} design{items.length === 1 ? '' : 's'}
        </p>

        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: i * 0.03, ease: EASE }}
              >
                <ProductCard product={p} onQuickView={setQuickView} priority={i < 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}
