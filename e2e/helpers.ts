import { expect, type Page } from '@playwright/test'

const IGNORED_CONSOLE = [
  /React DevTools/i,
  /\[Fast Refresh\]/i,
  /favicon/i,
  // <SanityLive> opens a live-content SSE that the browser CORS-blocks on origins
  // outside the Studio allowlist (CI, preview ports).
  /api\.sanity\.io\/.+\/data\/live\/events/i,
  /Access-Control-Allow-Origin/i,
  // `/_next/image` re-fetches originals from Sanity on a cold cache and can time out,
  // surfacing as a 400. CI always starts with a cold cache.
  /\/_next\/image/i,
]

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

export function expectErrorClean(errors: string[]): void {
  expect(errors, `unexpected page errors:\n${errors.join('\n')}`).toEqual([])
}

export async function dismissCookies(page: Page): Promise<void> {
  const accept = page
    .getByRole('region', { name: /we use cookies/i })
    .getByRole('button', { name: /accept/i })
  if (await accept.isVisible().catch(() => false)) {
    await accept.click()
    await expect(accept).toBeHidden()
  }
}

export async function firstEditionHref(page: Page): Promise<string | null> {
  return page.locator('a[href]').evaluateAll((els) => {
    const hit = els
      .map((el) => el.getAttribute('href'))
      .find((h): h is string => !!h && /^\/editions\/\d+$/.test(h))
    return hit ?? null
  })
}

// Past editions fold the program behind a "Browse the full program" collapsible; live editions render it expanded.
export async function openFullProgram(page: Page): Promise<void> {
  const toggle = page.getByRole('button', { name: /browse the full program/i }).first()
  const eventLink = page.locator('a[href*="/events/"]:visible').first()

  // Cache Components can stream the Program after the load event, so an immediate
  // `isVisible() === false` does not prove there is no toggle.
  await expect
    .poll(async () => {
      if (await eventLink.isVisible().catch(() => false)) return 'expanded'
      if (await toggle.isVisible().catch(() => false)) return 'archive'
      return 'loading'
    })
    .not.toBe('loading')

  if (await toggle.isVisible().catch(() => false)) {
    await toggle.click()
    await expect(eventLink).toBeVisible()
  }
}

// Returns null when no edition has an announced program; program journeys then skip.
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
  for (const url of years.slice(0, 6)) {
    await page.goto(url)
    if ((await page.locator('a[href*="/events/"]').count()) > 0) return url
  }
  return null
}
