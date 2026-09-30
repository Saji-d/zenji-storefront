import styles from './Wordmark.module.css'

interface WordmarkProps {
  /** Render at footer-signature scale. */
  large?: boolean
  className?: string
}

/**
 * The ZENJI logotype: the English wordmark with 禅 set beside it.
 *
 * Extracted from Header/Footer so the navbar, the footer signature and the
 * favicon all resolve to one typographic treatment. `aria-hidden` is set by
 * callers that already provide their own accessible name (the nav link labels
 * itself "ZENJI — home"), so the glyph sequence is never announced twice.
 */
export function Wordmark({ large = false, className }: WordmarkProps) {
  return (
    <span className={[styles.mark, large ? styles.lg : '', className ?? ''].join(' ')}>
      ZENJI<span className={styles.kanji}>禅</span>
    </span>
  )
}
