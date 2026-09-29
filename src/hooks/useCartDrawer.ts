import { useModalFocus } from './useModalFocus'

/** Cart drawer uses the shared modal focus behaviour. */
export function useCartDrawer(options: { open: boolean; onClose: () => void }) {
  return useModalFocus(options)
}
