import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Route transition: a short, quiet cross-fade with a small rise.
 *
 * There is deliberately no full-bleed colour wipe here — a saturated panel
 * sweeping the viewport on every navigation is loud, and on a shopping
 * session it fires far more often than it reads as intentional.
 * Fixed layers (header, cart drawer, toasts) are mounted outside this
 * wrapper, so the transform never re-parents them.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  if (reduce) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.42, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
