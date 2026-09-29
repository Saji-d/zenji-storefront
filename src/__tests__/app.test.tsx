import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

function renderApp() {
  return render(<App />)
}

describe('storefront integration', () => {
  it('renders header, hero and six product cards', () => {
    renderApp()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/fearless/i)
    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(
      screen.getByRole('heading', { name: /the origin drop/i }),
    ).toBeInTheDocument()
  })

  it('adds a product after selecting a size and shows it in the cart', async () => {
    const user = userEvent.setup()
    renderApp()

    const addButtons = screen.getAllByRole('button', { name: /^select a size$/i })
    expect(addButtons[0]).toBeDisabled()

    // pick size M on the first card
    const card = screen.getAllByRole('article')[0]
    await user.click(within(card).getByRole('radio', { name: /^m$/i }))
    await user.click(within(card).getByRole('button', { name: /add to cart/i }))

    // cart badge shows 1
    expect(screen.getByRole('button', { name: /open cart, 1 item/i })).toBeInTheDocument()

    // open drawer and inspect the line
    await user.click(screen.getByRole('button', { name: /open cart, 1 item/i }))
    const dialog = screen.getByRole('dialog', { name: /shopping cart/i })
    expect(dialog).toBeVisible()
    expect(within(dialog).getByText(/blue flame tee/i)).toBeInTheDocument()
    expect(within(dialog).getByText(/subtotal/i)).toBeInTheDocument()
  })

  it('updates quantity and computes subtotal', async () => {
    const user = userEvent.setup()
    renderApp()

    const card = screen.getAllByRole('article')[0]
    await user.click(within(card).getByRole('radio', { name: /^m$/i }))
    await user.click(within(card).getByRole('button', { name: /add to cart/i }))

    await user.click(screen.getByRole('button', { name: /open cart, 1 item/i }))
    const dialog = screen.getByRole('dialog', { name: /shopping cart/i })

    await user.click(
      within(dialog).getByRole('button', { name: /increase quantity of blue flame tee/i }),
    )

    // 2 × A$33.99 = A$67.98
    expect(within(dialog).getAllByText(/67\.98/).length).toBeGreaterThan(0)
  })

  it('removes an item and shows the empty state', async () => {
    const user = userEvent.setup()
    renderApp()

    const card = screen.getAllByRole('article')[0]
    await user.click(within(card).getByRole('radio', { name: /^m$/i }))
    await user.click(within(card).getByRole('button', { name: /add to cart/i }))

    await user.click(screen.getByRole('button', { name: /open cart, 1 item/i }))
    const dialog = screen.getByRole('dialog', { name: /shopping cart/i })

    await user.click(
      within(dialog).getByRole('button', { name: /remove blue flame tee/i }),
    )
    expect(within(dialog).getByText(/_empty/i)).toBeInTheDocument()
  })

  it('persists the cart across remounts', async () => {
    const user = userEvent.setup()
    const { unmount } = renderApp()

    const card = screen.getAllByRole('article')[0]
    await user.click(within(card).getByRole('radio', { name: /^m$/i }))
    await user.click(within(card).getByRole('button', { name: /add to cart/i }))
    unmount()

    renderApp()
    expect(screen.getByRole('button', { name: /open cart, 1 item/i })).toBeInTheDocument()
  })
})
