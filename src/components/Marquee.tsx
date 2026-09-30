import { useReducedMotion } from 'framer-motion'
import styles from './Marquee.module.css'

interface MarqueeProps {
  /** The repeating phrase. Split on '◆' into beats. */
  phrase: string
  /** accent = red band, ghost = outlined on ink, light = white band */
  tone?: 'accent' | 'ghost' | 'light'
  /** seconds for one full loop */
  duration?: number
  /** reverse = travel right-to-left */
  reverse?: boolean
  className?: string
}

/** Split the phrase into beats so every seam lands exactly like a loop point. */
function beats(phrase: string): string[] {
  return phrase.split('◆').map((s) => s.trim())
}

/**
 * Tickertape marquee, one row of the brand stack.
 *
 * The separator is the 禅 mark itself: the band spells the label's rules and
 * every beat is closed with the glyph from the logotype, so the strip reads as
 * branded punctuation rather than as a generic divider.
 *
 * The track holds three copies of the phrase so the loop seam never shows at
 * any viewport width. The whole strip is presentational, so it is aria-hidden:
 * the phrase is decorative, not content.
 */
export function Marquee({
  phrase,
  tone = 'accent',
  duration = 28,
  reverse = false,
  className,
}: MarqueeProps) {
  const reduce = useReducedMotion()
  const items = beats(phrase)
  const toneClass =
    tone === 'ghost' ? styles.ghost : tone === 'light' ? styles.light : styles.accent

  return (
    <div
      className={[styles.tape, toneClass, className ?? ''].join(' ')}
      aria-hidden="true"
      style={{ '--tape-duration': `${duration}s` } as React.CSSProperties}
      data-static={reduce || undefined}
    >
      <div className={styles.track} data-reverse={reverse || undefined}>
        {[0, 1, 2].map((copy) => (
          <span className={styles.copy} key={copy} aria-hidden={copy > 0 || undefined}>
            {items.map((item, i) => (
              <span className={styles.item} key={i}>
                {item}
                <span className={styles.sep}>禅</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
