import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

function renderApp(initial = '/') {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <App />
    </MemoryRouter>,
  )
}

async function addFirstProduct(user: ReturnType<typeof userEvent.setup>, size = 'm') {
  const card = screen.getAllByRole('article')[0]
  await user.click(within(card).getByRole('button', { name: /quick view/i }))
  const dialog = screen.getByRole('dialog')
  await user.click(within(dialog).getByRole('radio', { name: new RegExp(`^${size}$`, 'i') }))
  await user.click(within(dialog).getByRole('button', { name: /add to cart/i }))
  await user.keyboard('{Escape}')
}

describe('storefront integration', () => {
  it('renders the home route with hero and drop teaser', () => {
    renderApp('/')
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/fearless/i)
    expect(screen.getByRole('heading', { name: /latest_drops/i })).toBeInTheDocument()
    expect(screen.getAllByRole('article').length).toBeGreaterThanOrEqual(3)
  })

  it('renders all navbar routes', () => {
    const routes: [string, RegExp][] = [
      ['/drop', /the_drop/i],
      ['/collection', /collections/i],
      ['/story', /our story/i],
      ['/faq', /^faq$/i],
      ['/wishlist', /wishlist/i],
      ['/cart', /^cart$/i],
      ['/nope', /signal.*lost/i],
    ]
    for (const [route, heading] of routes) {
      const { unmount } = renderApp(route)
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
      unmount()
    }
  })

  it('renders a PDP with gallery, sizes and related products', () => {
    renderApp('/drop/blue-flame')
    expect(screen.getByRole('heading', { level: 1, name: /blue flame tee/i })).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: /product views/i })).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: /size — blue flame tee/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /next in the arc/i })).toBeInTheDocument()
    expect(screen.getAllByRole('article').length).toBeGreaterThanOrEqual(3)
  })

  it('renders 404 for unknown products', () => {
    renderApp('/drop/does-not-exist')
    expect(screen.getByRole('heading', { name: /file not found/i })).toBeInTheDocument()
  })

  it('adds a product via quick view and shows it in the cart', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await addFirstProduct(user, 'm')
    expect(screen.getByRole('button', { name: /open cart, 1 item/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open cart, 1 item/i }))
    const cart = screen.getByRole('dialog', { name: /shopping cart/i })
    expect(within(cart).getByText(/blue flame tee/i)).toBeInTheDocument()
    expect(within(cart).getByText(/subtotal/i)).toBeInTheDocument()
  })

  it('updates quantity and computes subtotal', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await addFirstProduct(user, 'm')

    await user.click(screen.getByRole('button', { name: /open cart, 1 item/i }))
    const cart = screen.getByRole('dialog', { name: /shopping cart/i })
    await user.click(
      within(cart).getByRole('button', { name: /increase quantity of blue flame tee/i }),
    )
    expect(within(cart).getAllByText(/67\.98/).length).toBeGreaterThan(0)
  })

  it('removes an item and shows the empty state', async () => {
    const user = userEvent.setup()
    renderApp('/')
    await addFirstProduct(user, 'm')

    await user.click(screen.getByRole('button', { name: /open cart, 1 item/i }))
    const cart = screen.getByRole('dialog', { name: /shopping cart/i })
    await user.click(within(cart).getByRole('button', { name: /remove blue flame tee/i }))
    expect(within(cart).getByText(/_empty/i)).toBeInTheDocument()
  })

  it('persists the cart across remounts', async () => {
    const user = userEvent.setup()
    const { unmount } = renderApp('/')
    await addFirstProduct(user, 'm')
    unmount()
    renderApp('/')
    expect(screen.getByRole('button', { name: /open cart, 1 item/i })).toBeInTheDocument()
  })

  it('toggles wishlist state from quick view', async () => {
    const user = userEvent.setup()
    renderApp('/')
    const card = screen.getAllByRole('article')[0]
    await user.click(within(card).getByRole('button', { name: /quick view/i }))
    const dialog = screen.getByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: /save blue flame tee to wishlist/i }))
    expect(
      within(dialog).getByRole('button', { name: /remove blue flame tee from wishlist/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /wishlist, 1 item/i })).toBeInTheDocument()
  })

  it('shows only sale items on the marked-down collection', () => {
    renderApp('/collection/marked-down')
    const articles = screen.getAllByRole('article')
    expect(articles.length).toBeGreaterThan(0)
    expect(articles.length).toBeLessThan(9)
    for (const card of articles) {
      expect(within(card).getByText(/−15%/)).toBeInTheDocument()
    }
  })
})
