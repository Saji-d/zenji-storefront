import styles from './Marquee.module.css'

const ITEMS = ['EVERY DROP IS LORE', 'WEAR THE ARC', 'NO RESTOCKS. EVER.', 'THE ORIGIN DROP']

export function Marquee() {
  return (
    <div className={styles.band}>
      {/* first group is readable by AT; duplicate is hidden decoration */}
      <div className={styles.track}>
        <div className={styles.group}>
          {ITEMS.map((item) => (
            <span className={styles.item} key={item}>
              {item}
              <span className={styles.sep} aria-hidden="true">
                //
              </span>
            </span>
          ))}
        </div>
        <div className={styles.group} aria-hidden="true">
          {ITEMS.map((item) => (
            <span className={styles.item} key={item}>
              {item}
              <span className={styles.sep}>//</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
