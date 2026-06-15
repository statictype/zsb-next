import { expect, type Page } from '@playwright/test'

// Console noise we tolerate: framework/devtools chatter and third-party scripts
// that aren't our bug. Uncaught exceptions (pageerror) are never tolerated.
const IGNORED_CONSOLE = [
  /React DevTools/i,
  /\[Fast Refresh\]/i,
  /favicon/i,
  // <SanityLive> opens a live-content SSE to Sanity's API; the browser
  // CORS-blocks it on origins not in the Studio's allowlist (CI, preview ports).
  /api\.sanity\.io\/.+\/data\/live\/events/i,
  /Access-Control-Allow-Origin/i,
  // Next's image optimizer (`/_next/image`) re-fetches every original from
  // Sanity when its on-disk cache is cold (fresh build / cleared `.next`) and
  // can time out on a slow upstream, surfacing as a 400 resource error. That's
  // an environmental/caching condition, not an app bug — CI always starts cold,
  // so we tolerate it here. Uncaught exceptions (pageerror) stay strict.
  /\/_next\/image/i,
]

/** Collect uncaught exceptions and (non-ignored) console errors for a page. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const haystack = `${msg.text()} ${msg.location()?.url ?? ''}`
    if (!IGNORED_CONSOLE.some((re) => re.test(haystack))) {
      errors.push(`console.error: ${msg.text()}`)
    }
  })
  return errors
}

/** Assert the page produced no uncaught exceptions or unexpected console errors. */
export function expectErrorClean(errors: string[]): void {
  expect(errors, `unexpected page errors:\n${errors.join('\n')}`).toEqual([])
}

/**
 * Dismiss the cookie-consent banner if it's showing, via its Accept button.
 * Drives the real UI (accessible name) so it stays valid through a refactor;
 * used to clear the overlay before exercising other interactions.
 */
export async function dismissCookies(page: Page): Promise<void> {
  const accept = page
    .getByRole('dialog', { name: /cookie consent/i })
    .getByRole('button', { name: /accept/i })
  if (await accept.isVisible().catch(() => false)) {
    await accept.click()
    await expect(accept).toBeHidden()
  }
}

/**
 * Find an edition whose page renders a calendar of events, by following the
 * `/editions/{year}` → `/editions/{year}/events/{slug}` route contract (ADR
 * 0015) rather than any markup. Returns the edition URL, or null if the dataset
 * has no edition with an announced programme (calendar journeys then skip).
 */
export async function findEditionWithEvents(page: Page): Promise<string | null> {
  await page.goto('/editions')
  const years: string[] = await page
    .locator('a[href]')
    .evaluateAll((els) =>
      Array.from(
        new Set(
          els
            .map((el) => el.getAttribute('href'))
            .filter((h): h is string => !!h && /^\/editions\/\d+$/.test(h)),
        ),
      ),
    )
  // Cap the crawl — newest editions come first, so a programme shows up fast.
  for (const url of years.slice(0, 6)) {
    await page.goto(url)
    if ((await page.locator('a[href*="/events/"]').count()) > 0) return url
  }
  return null
}
