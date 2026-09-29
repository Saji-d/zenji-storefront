import styles from './Hero.module.css'
import { TeeArt } from './art/TeeArt'

interface HeroProps {
  onShopClick: () => void
}

const STATS = [
  { label: 'FABRIC', value: '240GSM' },
  { label: 'UNITS PER DROP', value: '200' },
  { label: 'RESTOCKS', value: 'NONE. EVER.' },
]

export function Hero({ onShopClick }: HeroProps) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className="eyebrow">Incoming transmission — The Origin Drop</p>
          <h1 id="hero-title" className={`display ${styles.title}`}>
            Worn by<br />
            the <span className={styles.accent}>fearless</span>
          </h1>
          <p className={styles.lede}>
            Heavyweight anime streetwear, cut oversized and printed once.
            Every drop is limited. When it&apos;s gone, it&apos;s gone for good.
          </p>
          <div className={styles.ctas}>
            <button type="button" className="btn btn--primary" onClick={onShopClick}>
              Shop the drop
            </button>
            <a className="btn btn--ghost" href="#story">
              The story →
            </a>
          </div>
          <dl className={styles.stats}>
            {STATS.map((s) => (
              <div className={styles.stat} key={s.label}>
                <dt className="eyebrow">{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.poster} aria-hidden="true">
          <div className={styles.frame}>
            <TeeArt productId="blue-flame-tee" accent="#6f9fd8" className={styles.art} />
          </div>
          <p className={styles.posterCaption}>
            _ORIGIN_DROP // 001 — BLUE FLAME
          </p>
        </div>
      </div>
    </section>
  )
}
