import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT) || 3000
const baseURL = `http://localhost:${PORT}`
const isCI = !!process.env.CI

export default defineConfig({
  testDir: './e2e',
  // Smoke layer is small; fail fast in CI, allow one retry to ride out a cold
  // first paint, and never let a stray `test.only` slip through CI.
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['list']] : 'list',
  // Each journey is a real client navigation — an RSC payload + a live Sanity
  // fetch, plus first-hit route compilation on the dev server — so the default
  // 5s/30s budgets are too tight on a slow connection. Be generous; correctness
  // failures still surface, they just get room to load first.
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Run against a production build. Locally we self-build; in CI the workflow
  // builds once as its own gate, so we only `start` here. Reuses a dev server
  // already listening on :3000 outside CI so local runs are quick.
  webServer: {
    command: isCI ? 'pnpm start' : 'pnpm build && pnpm start',
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
