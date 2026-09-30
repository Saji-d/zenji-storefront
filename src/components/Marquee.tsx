import { useReducedMotion } from 'framer-motion'
import styles from './Marquee.module.css'

interface MarqueeProps {
  /** The repeating phrase. Split on '◆' into beats. */
  phrase: string
  /** ghost = black band, white type, red 禅 */
  tone?: 'ghost'
  /** seconds for one full loop */
  duration?: number
  /** reverse = travel right-to-left */
  reverse?: boolean
  className?: string
}

/** Split the phrase into beats; empties are dropped so a trailing separator
    can never render a lone second 禅. */
function beats(phrase: string): string[] {
  return phrase
    .split('◆')
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Tickertape marquee.
 *
 * The separator is the 禅 mark itself: the band spells the label's rules and
 * every beat is closed with the glyph from the logotype, set with equal space
 * on both sides so the rhythm reads as structured rather than accidental.
 *
 * The track holds three copies of the phrase so the loop seam never shows at
 * any viewport width. The whole strip is presentational, so it is aria-hidden:
 * the phrase is decorative, not content.
 */
export function Marquee({
  phrase,
  /* the single tone is baked into the module css; the prop stays for callers */
  tone: _tone = 'ghost',
  duration = 28,
  reverse = false,
  className,
}: MarqueeProps) {
  const reduce = useReducedMotion()
  const items = beats(phrase)

  return (
    <div
      className={[styles.tape, styles.ghost, className ?? ''].join(' ')}
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
