import { useRef, type KeyboardEvent } from 'react'
import type { Size } from '../types'
import styles from './SizePicker.module.css'

interface SizePickerProps {
  sizes: Size[]
  selected: Size | null
  onSelect: (size: Size) => void
  name: string
}

const ALL_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

/**
 * Keyboard-friendly radio group: arrow keys move between sizes,
 * Space/Enter selects. Roving tabindex per WAI-ARIA radiogroup pattern.
 */
export function SizePicker({ sizes, selected, onSelect, name }: SizePickerProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])

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

  return (
    <div
      role="radiogroup"
      aria-label={`Select a size for ${name}`}
      className={styles.group}
    >
      {ALL_SIZES.filter((s) => sizes.includes(s)).map((size, i) => {
        const active = selected === size
        return (
          <button
            key={size}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active || (selected === null && i === 0) ? 0 : -1}
            className={`${styles.size} ${active ? styles.active : ''}`}
            onClick={() => onSelect(size)}
            onKeyDown={onKeyDown}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}
