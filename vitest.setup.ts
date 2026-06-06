// Component-project setup (jsdom). Registers jest-dom matchers and tears the
// DOM down between tests. Cleanup is manual because we run without Vitest
// globals (explicit imports), so RTL's auto-cleanup hook isn't wired up.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
