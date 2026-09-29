import type { Size } from '../types'
import { useRadioGroupKeys } from '../hooks/useRadioGroupKeys'
import styles from './SizePicker.module.css'

interface SizePickerProps {
  sizes: Size[]
  selected: Size | null
  onSelect: (size: Size) => void
  name: string
}

const ALL_SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

/** Keyboard-friendly radio group for card-level size selection. */
export function SizePicker({ sizes, selected, onSelect, name }: SizePickerProps) {
  const { setRef, onKeyDown } = useRadioGroupKeys(sizes, selected, onSelect)

  return (
    <div role="radiogroup" aria-label={`Select a size for ${name}`} className={styles.group}>
      {ALL_SIZES.filter((s) => sizes.includes(s)).map((size, i) => {
        const active = selected === size
        return (
          <button
            key={size}
            ref={setRef(i)}
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
