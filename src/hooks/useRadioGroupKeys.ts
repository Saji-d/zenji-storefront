import { useRef, type KeyboardEvent } from 'react'
import type { Size } from '../types'

/**
 * WAI-ARIA radiogroup keyboard behaviour: arrow keys move selection,
 * Home/End jump to the ends. Roving tabindex is the caller's concern.
 */
export function useRadioGroupKeys(
  sizes: Size[],
  selected: Size | null,
  onSelect: (size: Size) => void,
) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const setRef = (i: number) => (el: HTMLButtonElement | null) => {
    refs.current[i] = el
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const idx = sizes.indexOf(selected ?? sizes[0])
    let next = -1
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % sizes.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + sizes.length) % sizes.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = sizes.length - 1
    if (next === -1) return
    e.preventDefault()
    onSelect(sizes[next])
    refs.current[next]?.focus()
  }

  return { setRef, onKeyDown }
}
