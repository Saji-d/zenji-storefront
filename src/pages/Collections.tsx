import { Link } from 'react-router-dom'
import { COLLECTIONS } from '../data/products'
import { SmartImage } from '../components/SmartImage'
import { Reveal } from '../components/motion/Reveal'
import styles from './Collections.module.css'

const COVERS: Record<string, string> = {
  'the-origin-drop': '/lookbook/look-1.webp',
  'marked-down': '/products/will-of-the-sun-1.webp',
  'final-units': '/products/limitless-1.webp',
}

export default function Collections() {
  return (
    <section className={styles.page} aria-labelledby="collections-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow">Archive index</p>
          <h1 id="collections-title" className={`display ${styles.title}`}>COLLECTIONS</h1>
          <p className={styles.lede}>
            Three ways into the archive. Every collection closes when the run closes.
          </p>
        </Reveal>

        <div className={styles.list}>
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}>
              <Link to={`/collection/${c.slug}`} className={styles.row}>
                <span className={styles.rowIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className={styles.rowMedia}>
                  <SmartImage src={COVERS[c.slug]} alt="" className={styles.rowImg} loading="lazy" />
                </div>
                <div className={styles.rowCopy}>
                  <h2 className={styles.rowTitle}>{c.title}</h2>
                  <p className={styles.rowSub}>{c.subtitle}</p>
                  <p className={styles.rowMeta}>
                    {c.count} DESIGN{c.count === 1 ? '' : 'S'} <span aria-hidden="true">//</span> NO RESTOCKS
                  </p>
                </div>
                <span className={styles.rowArrow} aria-hidden="true">→</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
