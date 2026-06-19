// Component-project setup (jsdom). Registers jest-dom matchers and tears the
// DOM down between tests. Cleanup is manual because we run without Vitest
// globals (explicit imports), so RTL's auto-cleanup hook isn't wired up.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverStub {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

Object.defineProperty(globalThis, 'ResizeObserver', { value: ResizeObserverStub, writable: true })
Object.defineProperty(globalThis, 'IntersectionObserver', {
  value: IntersectionObserverStub,
  writable: true,
})
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
Object.defineProperty(HTMLElement.prototype, 'scrollTo', { value: vi.fn(), writable: true })
Object.defineProperty(HTMLElement.prototype, 'scrollBy', { value: vi.fn(), writable: true })
Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
  value: vi.fn(),
  writable: true,
})
Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
  value: vi.fn(),
  writable: true,
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
