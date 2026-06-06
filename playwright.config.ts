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
  use: {
    baseURL,
    trace: 'on-first-retry',
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
