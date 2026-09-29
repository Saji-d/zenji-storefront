import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Route transition: subtle rise + fade with an accent hairline that wipes
 * away on entry. Used once around the routed page outlet.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.42, ease: EASE }}
    >
      <motion.div
        aria-hidden="true"
        className="route-veil"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
      />
      {children}
    </motion.div>
  )
}
