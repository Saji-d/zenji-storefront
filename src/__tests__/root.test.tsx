import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Root } from '../Root'

describe('production shell', () => {
  it('renders without an externally supplied router', () => {
    // Guards the blank-screen regression: App is router-dependent, so the
    // BrowserRouter must be provided by Root, exactly as main.tsx mounts it.
    window.history.pushState({}, '', '/')
    const { container } = render(<Root />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/wear your\s*story/i)
    // The primary nav is display:none under 900px and jsdom does not evaluate
    // media queries, so it is absent from the a11y tree here. Assert it was
    // rendered rather than dropped — that is the part this test guards.
    expect(container.querySelector('nav[aria-label="Primary"]')).not.toBeNull()
  })

  it('deep-links straight to a nested route', () => {
    window.history.pushState({}, '', '/drop/blue-flame')
    render(<Root />)

    expect(
      screen.getByRole('heading', { level: 1, name: /blue flame tee/i }),
    ).toBeInTheDocument()
  })
})
