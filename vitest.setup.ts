// Cleanup is manual: Vitest globals are off, so RTL's auto-cleanup is not registered.
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

const dialogOpeners = new WeakMap<HTMLDialogElement, Element | null>()

Object.defineProperties(HTMLDialogElement.prototype, {
  showModal: {
    writable: true,
    value(this: HTMLDialogElement) {
      dialogOpeners.set(this, document.activeElement)
      this.setAttribute('open', '')
    },
  },
  close: {
    writable: true,
    value(this: HTMLDialogElement) {
      if (!this.hasAttribute('open')) return
      this.removeAttribute('open')
      const opener = dialogOpeners.get(this)
      if (opener instanceof HTMLElement) opener.focus()
      this.dispatchEvent(new Event('close'))
    },
  },
})

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return
  const dialogs = document.querySelectorAll('dialog[open]')
  dialogs[dialogs.length - 1]?.dispatchEvent(new Event('cancel', { cancelable: true }))
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
