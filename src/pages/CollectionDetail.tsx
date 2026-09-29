import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { COLLECTIONS, PRODUCTS } from '../data/products'
import type { Product } from '../types'
import { ProductCard } from '../components/ProductCard'
import { QuickView } from '../components/QuickView'
import { Reveal } from '../components/motion/Reveal'
import styles from './Shop.module.css'

/**
 * Collection titles are single underscore-joined tokens (THE_ORIGIN_DROP).
 * Give the renderer a break opportunity after each underscore so the heading
 * wraps on the word boundary instead of mid-syllable on narrow screens.
 */
function breakable(text: string) {
  return text.split('_').map((part, i, arr) => (
    <span key={part}>
      {part}
      {i < arr.length - 1 ? '_' : null}
      {i < arr.length - 1 ? <wbr /> : null}
    </span>
  ))
}

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
          <p className="eyebrow">_ERROR</p>
          <h1 className={`display ${styles.title}`}>FILE NOT FOUND</h1>
          <p className={styles.lede}>That collection does not exist in the archive.</p>
          <Link to="/collection" className="btn btn--primary">Back to collections →</Link>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.page} aria-labelledby="collection-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">
            <Link to="/collection" className={styles.crumb}>COLLECTIONS</Link>{' '}
            <span aria-hidden="true">//</span> {collection.slug}
          </p>
          <h1 id="collection-title" className={`display ${styles.title}`}>
            {breakable(collection.title)}
          </h1>
          <p className={styles.lede}>{collection.subtitle}</p>
        </Reveal>

        <p className={styles.count} aria-live="polite">
          {items.length} DESIGN{items.length === 1 ? '' : 'S'}
        </p>

        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} onQuickView={setQuickView} priority={i < 3} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </section>
  )
}
