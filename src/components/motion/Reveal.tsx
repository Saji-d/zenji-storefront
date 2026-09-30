import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  /** render as a list item when used directly inside ol/ul */
  as?: 'div' | 'li'
  /** forwarded to the wrapper, e.g. CSS custom properties for grid placement */
  style?: CSSProperties
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Scroll-triggered reveal. Falls back to fully visible when
 * IntersectionObserver is unavailable and respects prefers-reduced-motion.
 *
 * Offset is small by design: a large travel distance on every block reads as
 * a template effect rather than as pacing.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = 'div',
  style,
}: RevealProps) {
  const reduce = useReducedMotion()
  const hasIO = typeof window !== 'undefined' && 'IntersectionObserver' in window
  const hidden = reduce || !hasIO ? false : { opacity: 0, y }
  const Tag = as === 'li' ? motion.li : motion.div

  return (
    <Tag
      className={className}
      style={style}
      initial={hidden}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}
