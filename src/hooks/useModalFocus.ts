import { useEffect, useRef } from 'react'

interface Options {
  open: boolean
  onClose: () => void
}

/**
 * Modal/drawer behaviour:
 *  - ESC closes from anywhere (focus may fall to <body> when content unmounts)
 *  - Tab is looped inside the panel while open
 *  - focus moves in on open and returns to the opener on close
 *  - focus that escapes the panel is pulled back in
 */
export function useModalFocus({ open, onClose }: Options) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

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

    focusables()[0]?.focus()

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

    const onFocusIn = () => {
      if (!panel.contains(document.activeElement)) focusables()[0]?.focus()
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
