import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

function renderApp() {
  return render(<App />)
}

/** add the first product in a given size via quick view */
async function addFirstProduct(user: ReturnType<typeof userEvent.setup>, size = 'm') {
  const card = screen.getAllByRole('article')[0]
  await user.click(within(card).getByRole('button', { name: new RegExp(`quick view`, 'i') }))

  const dialog = screen.getByRole('dialog')
  await user.click(within(dialog).getByRole('radio', { name: new RegExp(`^${size}$`, 'i') }))
  await user.click(within(dialog).getByRole('button', { name: /add to cart/i }))
  await user.keyboard('{Escape}')
}

describe('storefront integration', () => {
  it('renders header, hero and six product cards', () => {
    renderApp()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/fearless/i)
    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.getByRole('heading', { name: /the origin drop/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /lookbook/i })).toBeInTheDocument()
  })

  it('adds a product via quick view and shows it in the cart', async () => {
    const user = userEvent.setup()
    renderApp()

    await addFirstProduct(user, 'm')

    expect(
      screen.getByRole('button', { name: /open cart, 1 item/i }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open cart, 1 item/i }))
    const cart = screen.getByRole('dialog', { name: /shopping cart/i })
    expect(within(cart).getByText(/blue flame tee/i)).toBeInTheDocument()
    expect(within(cart).getByText(/subtotal/i)).toBeInTheDocument()
  })

  it('updates quantity and computes subtotal', async () => {
    const user = userEvent.setup()
    renderApp()

    await addFirstProduct(user, 'm')

    await user.click(screen.getByRole('button', { name: /open cart, 1 item/i }))
    const cart = screen.getByRole('dialog', { name: /shopping cart/i })

    await user.click(
      within(cart).getByRole('button', { name: /increase quantity of blue flame tee/i }),
    )
    // 2 × A$33.99 = A$67.98
    expect(within(cart).getAllByText(/67\.98/).length).toBeGreaterThan(0)
  })

  it('removes an item and shows the empty state', async () => {
    const user = userEvent.setup()
    renderApp()

    await addFirstProduct(user, 'm')

    await user.click(screen.getByRole('button', { name: /open cart, 1 item/i }))
    const cart = screen.getByRole('dialog', { name: /shopping cart/i })

    await user.click(
      within(cart).getByRole('button', { name: /remove blue flame tee/i }),
    )
    expect(within(cart).getByText(/_empty/i)).toBeInTheDocument()
  })

  it('persists the cart across remounts', async () => {
    const user = userEvent.setup()
    const { unmount } = renderApp()

    await addFirstProduct(user, 'm')
    unmount()

    renderApp()
    expect(screen.getByRole('button', { name: /open cart, 1 item/i })).toBeInTheDocument()
  })

  it('toggles wishlist state from quick view', async () => {
    const user = userEvent.setup()
    renderApp()

    const card = screen.getAllByRole('article')[0]
    await user.click(within(card).getByRole('button', { name: /quick view/i }))
    const dialog = screen.getByRole('dialog')

    const wish = within(dialog).getByRole('button', { name: /save blue flame tee to wishlist/i })
    await user.click(wish)
    expect(
      within(dialog).getByRole('button', { name: /remove blue flame tee from wishlist/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /wishlist, 1 item/i }),
    ).toBeInTheDocument()
  })
})
