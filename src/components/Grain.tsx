import styles from './Grain.module.css'

/** Fixed film-grain overlay. Purely decorative. */
export function Grain() {
  return <div className={styles.grain} aria-hidden="true" />
}
