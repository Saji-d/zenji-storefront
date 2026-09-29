import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  /** render as a list item when used directly inside ol/ul */
  as?: 'div' | 'li'
}

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Scroll-triggered reveal. Falls back to fully visible when
 * IntersectionObserver is unavailable and respects prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, y = 26, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion()
  const hasIO = typeof window !== 'undefined' && 'IntersectionObserver' in window
  const hidden = reduce || !hasIO ? false : { opacity: 0, y }
  const Tag = as === 'li' ? motion.li : motion.div

  return (
    <Tag
      className={className}
      initial={hidden}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: reduce ? 0 : 0.75, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}
