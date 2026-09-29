import styles from './Marquee.module.css'

const ITEMS = [
  'WEAR THE ARC',
  'NO RESTOCKS. EVER.',
  'NEW DROP LIVE',
  '240GSM HEAVYWEIGHT',
  'SHIPS AUSTRALIA-WIDE',
  'THE ORIGIN DROP',
]

export function Marquee() {
  return (
    <div className={styles.band} aria-hidden="true">
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <div className={styles.group} key={copy}>
            {ITEMS.map((item) => (
              <span className={styles.item} key={item}>
                {item}
                <span className={styles.sep}>✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
