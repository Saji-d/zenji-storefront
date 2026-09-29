import styles from './Collection.module.css'
import { PRODUCTS } from '../data/products'
import { ProductCard } from './ProductCard'

export function Collection() {
  return (
    <section id="collection" className={styles.section} aria-labelledby="collection-title">
      <div className="container">
        <div className="section-head">
          <h2 id="collection-title" className="display">
            The Origin Drop
          </h2>
          <p className="eyebrow">06 designs // limited run // no restocks</p>
        </div>

        <ul className={styles.grid}>
          {PRODUCTS.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
