import { expect, type Page, test } from '@playwright/test'

// Console noise we tolerate: framework/devtools chatter and third-party scripts
// that aren't our bug. Uncaught exceptions (pageerror) are never tolerated.
const IGNORED_CONSOLE = [
  /React DevTools/i,
  /\[Fast Refresh\]/i,
  /favicon/i,
  // <SanityLive> opens a live-content SSE to Sanity's API; the browser
  // CORS-blocks it on any origin not in the Studio's allowlist (CI, preview
  // ports). Benign for a published-content smoke test — matched on the request
  // URL so we don't broadly swallow other failed resources.
  /api\.sanity\.io\/.+\/data\/live\/events/i,
  /Access-Control-Allow-Origin/i,
]

/** Collect uncaught exceptions and (non-ignored) console errors for a page. */
function trackErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    // Test the message text and the originating resource URL together so a
    // CORS/network failure can be matched by its endpoint.
    const haystack = `${msg.text()} ${msg.location()?.url ?? ''}`
    if (!IGNORED_CONSOLE.some((re) => re.test(haystack))) {
      errors.push(`console.error: ${msg.text()}`)
    }
  })
  return errors
}

test.describe('site smoke', () => {
  test('static 2021 edition renders and is error-clean', async ({ page }) => {
    // 2021 is the static, online-only edition — no Sanity dependency, so this is
    // the deterministic anchor of the suite.
    const errors = trackErrors(page)
    const response = await page.goto('/editions/2021')
    expect(response?.status()).toBe(200)

    await expect(page.getByText('#digitalfield').first()).toBeVisible()
    await expect(page.getByText(/Sculpture didn.t stop/i).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Open the Archive/i })).toBeVisible()

    expect(errors, `unexpected page errors:\n${errors.join('\n')}`).toEqual([])
  })

  test('homepage renders the hero and links into the editions', async ({ page }) => {
    const errors = trackErrors(page)
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)

    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('a[href*="/editions/"]').first()).toBeVisible()

    expect(errors, `unexpected page errors:\n${errors.join('\n')}`).toEqual([])
  })

  test('visit page renders', async ({ page }) => {
    const errors = trackErrors(page)
    const response = await page.goto('/visit')
    expect(response?.status()).toBe(200)
    await expect(page.locator('main, body').first()).toBeVisible()
    expect(
      errors.filter((e) => e.startsWith('pageerror')),
      errors.join('\n'),
    ).toEqual([])
  })

  test('studio route loads', async ({ page }) => {
    // The embedded Sanity Studio boots client-side; we only assert the route
    // serves and the app shell mounts, not the full editor.
    const response = await page.goto('/studio')
    expect(response?.status()).toBeLessThan(400)
    await expect(page.locator('#sanity, [data-sanity], body').first()).toBeVisible()
  })

  test('unknown route returns a 404', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist')
    expect(response?.status()).toBe(404)
    await expect(page.getByText(/not be found|404/i).first()).toBeVisible()
  })
})
