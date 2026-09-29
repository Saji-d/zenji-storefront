import { useEffect, useRef } from 'react'

interface Options {
  open: boolean
  onClose: () => void
}

/**
 * Drawer behaviour:
 *  - ESC closes from anywhere (not only while focus is inside the panel —
 *    focus can fall to <body> when e.g. the focused line item is removed)
 *  - Tab is looped inside the drawer while open
 *  - focus moves into the drawer on open (and is pulled back in if it falls out)
 *  - focus returns to the opener element on close
 */
export function useCartDrawer({ open, onClose }: Options) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  // capture opener on open, restore it on close
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null
      return
    }
    const prev = restoreFocusRef.current
    restoreFocusRef.current = null
    if (prev && document.contains(prev)) prev.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'))

    const focusFirst = () => focusables()[0]?.focus()
    focusFirst()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const list = focusables()
      if (list.length === 0) return
      const first = list[0]
      const last = list[list.length - 1]
      const active = document.activeElement

      // focus escaped the panel (should not normally happen) — pull it back
      if (!panel.contains(active)) {
        e.preventDefault()
        first.focus()
        return
      }
      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    // if focus falls out of the panel (e.g. the focused line is removed),
    // bring it back so the modal invariant holds
    const onFocusIn = () => {
      if (!panel.contains(document.activeElement)) focusFirst()
    }

    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('focusin', onFocusIn)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('focusin', onFocusIn)
    }
  }, [open, onClose])

  return { panelRef }
}
