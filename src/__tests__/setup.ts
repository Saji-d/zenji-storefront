import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll } from 'vitest'

beforeAll(() => {
  // jsdom lacks IntersectionObserver (framer-motion whileInView, section spy)
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
  globalThis.IntersectionObserver =
    IO as unknown as typeof IntersectionObserver

  // jsdom lacks matchMedia (framer-motion useReducedMotion)
  if (!globalThis.matchMedia) {
    globalThis.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent: () => false,
    })) as unknown as typeof matchMedia
  }
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})
