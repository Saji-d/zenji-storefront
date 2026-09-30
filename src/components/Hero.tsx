import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import styles from './Hero.module.css'

const EASE = [0.22, 1, 0.36, 1] as const

/** How long a shot is held before the crossfade begins. Short holds keep the
 *  reel feeling alive; the first frame is what most visitors ever see. */
const HOLD_MS = 4200
/** Crossfade duration — slow enough to read as a dissolve, not a slideshow. */
const FADE_S = 1.1

/**
 * Campaign shots, ordered by how well each one holds a full-bleed frame.
 *
 * Every file in public/ is portrait (2:3 or 3:4), so a landscape hero always
 * crops to a vertical slice; `pos` biases the slice to keep the subject in
 * frame rather than defaulting to a dead centre crop. The first two are the
 * only 1800px-wide assets in the project and lead for that reason — the
 * remaining three are the largest lookbook files.
 */
const SHOTS = [
  { src: '/hero/hero-1.webp', w: 1800, h: 2700, pos: '50% 34%' },
  { src: '/hero/hero-2.webp', w: 1800, h: 2700, pos: '50% 38%' },
  { src: '/lookbook/look-2.webp', w: 1200, h: 1499, pos: '50% 30%' },
  { src: '/lookbook/look-4.webp', w: 1200, h: 1499, pos: '50% 32%' },
  { src: '/lookbook/look-3.webp', w: 1200, h: 1499, pos: '50% 28%' },
] as const

/**
 * Full-bleed campaign hero.
 *
 * Performance notes:
 *  - Shot 1 is a real <img> with fetchpriority=high, preloaded from index.html,
 *    and is mounted on the first render with no entrance animation, so it is
 *    the LCP element rather than a CSS background that cannot be prioritised.
 *  - The remaining shots are mounted in an idle callback *after* first paint.
 *    Holding them back keeps ~700kB of photography off the critical path while
 *    still being resident long before the first crossfade.
 *  - The advance timer is gated on the incoming shot's `load`, so a dissolve
 *    can never reveal an empty frame however slow the connection is.
 *
 * Art direction notes:
 *  - The photograph owns the entire viewport below the navbar. There is no
 *    side column and no ink panel; copy sits on the image over a corner veil
 *    that only darkens the quadrant it needs to.
 */
export function Hero() {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [mounted, setMounted] = useState<number[]>(() => [0])
  const [ready, setReady] = useState<boolean[]>(() => SHOTS.map(() => false))
  const [paused, setPaused] = useState(false)
  const holdTimer = useRef<number | null>(null)

  // Mount the rest of the reel once the browser is idle, so the first campaign
  // frame is competing for bandwidth with nothing but the bundle.
  useEffect(() => {
    if (reduce) return
    const mount = () => setMounted(SHOTS.map((_, i) => i))
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(mount, { timeout: 2500 })
      : window.setTimeout(mount, 1200)
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle as number)
      else window.clearTimeout(idle as number)
    }
  }, [reduce])

  // Only advance once the incoming frame is decoded.
  useEffect(() => {
    if (reduce || paused) return
    const next = (index + 1) % SHOTS.length
    if (!ready[next]) return
    const id = window.setTimeout(() => setIndex(next), HOLD_MS)
    holdTimer.current = id
    return () => window.clearTimeout(id)
  }, [index, ready, reduce, paused])

  return (
    <section
      className={styles.hero}
      aria-labelledby="hero-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={styles.media} aria-hidden="true">
        {SHOTS.map((shot, i) => {
          if (!mounted.includes(i)) return null
          const isActive = i === index
          return (
            <motion.img
              key={shot.src}
              className={styles.shot}
              src={shot.src}
              alt=""
              width={shot.w}
              height={shot.h}
              style={{ objectPosition: shot.pos }}
              /* Shot 1 must never wait on the network for a fade to start. */
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
              decoding="async"
              draggable={false}
              initial={false}
              onLoad={() =>
                setReady((prev) => (prev[i] ? prev : prev.map((r, k) => (k === i ? true : r))))
              }
              animate={{
                opacity: isActive ? 1 : 0,
                /* A barely-there push during the hold. Kept to 2%: the resting
                   frame stays near native resolution, and the overscan is only
                   there so a fractional edge can never show. */
                scale: isActive && !reduce ? [1, 1.02] : 1,
              }}
              transition={
                isActive
                  ? {
                      opacity: { duration: reduce ? 0 : FADE_S, ease: 'easeInOut' },
                      scale: { duration: reduce ? 0 : HOLD_MS / 1000, ease: 'linear' },
                    }
                  : { duration: 0 }
              }
            />
          )
        })}
        <div className={styles.veil} />
      </div>

      <div className={`container ${styles.content}`}>
        <motion.p
          className={`eyebrow ${styles.eyebrow}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          The Origin Drop
        </motion.p>
        <motion.h1
          id="hero-title"
          className={`statement ${styles.title}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.18, ease: EASE }}
        >
          Wear your
          <br />
          story.
        </motion.h1>

        <motion.p
          className={styles.lede}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        >
          Ten original designs, cut from heavyweight 240gsm cotton. One run, never
          reprinted.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
        >
          <Link to="/drop" className="btn btn--primary">
            Shop the drop
          </Link>
          <Link to="/lookbook" className={styles.ctaGhost}>
            View lookbook
          </Link>
        </motion.div>
      </div>

    </section>
  )
}
