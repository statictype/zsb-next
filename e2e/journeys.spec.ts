import { expect, test } from '@playwright/test'
import { dismissCookies, expectErrorClean, findEditionWithEvents, trackErrors } from './helpers'

// User-journey coverage for the pages reworked in the Panda migration. These are
// deliberately a black box: assertions go through accessible roles/names, text,
// URLs, and interaction outcomes — never slot names, generated class names,
// `data-*` internals, or computed styles — so a slot/component refactor can't
// break them while real regressions still surface.

// ---- Tier 1: every migrated route renders and is error-clean ----------------

const ROUTES = ['/', '/about', '/editions', '/partners', '/press', '/privacy', '/artists']

test.describe('routes render', () => {
  for (const route of ROUTES) {
    test(`${route} renders a heading and is error-clean`, async ({ page }) => {
      const errors = trackErrors(page)
      const response = await page.goto(route)
      expect(response?.status(), `${route} status`).toBe(200)

      // A non-empty <h1> proves the page composed (not a blank/crashed render).
      const h1 = page.getByRole('heading', { level: 1 }).first()
      await expect(h1).toBeVisible()
      await expect(h1).not.toBeEmpty()
      await expect(page.locator('main').first()).toBeVisible()

      expectErrorClean(errors)
    })
  }
})

// ---- Tier 2: navigation flows over the routing contract ---------------------

test.describe('navigation', () => {
  test('the homepage links through to an edition page', async ({ page }) => {
    await page.goto('/')
    await dismissCookies(page)
    await page.locator('a[href*="/editions/"]').first().click()
    await expect(page).toHaveURL(/\/editions\/\d+/)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  })

  test('the editions index links through to an edition page', async ({ page }) => {
    await page.goto('/editions')
    await dismissCookies(page)
    await page.locator('main a[href*="/editions/"]').first().click()
    await expect(page).toHaveURL(/\/editions\/\d+/)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  })

  test('the footer privacy link opens the privacy page', async ({ page }) => {
    await page.goto('/')
    await dismissCookies(page)
    await page
      .getByRole('link', { name: /privacy/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/privacy$/)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  })
})

// ---- Tier 3: key interactions (behavioral) ----------------------------------

test.describe('cookie consent', () => {
  test('the banner dismisses on Accept and stays dismissed after reload', async ({ page }) => {
    await page.goto('/')
    const banner = page.getByRole('dialog', { name: /cookie consent/i })
    await expect(banner).toBeVisible()

    await banner.getByRole('button', { name: /accept/i }).click()
    await expect(banner).toBeHidden()

    await page.reload()
    await expect(page.getByRole('dialog', { name: /cookie consent/i })).toHaveCount(0)
  })
})

test.describe('calendar', () => {
  let editionUrl: string | null = null

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    editionUrl = await findEditionWithEvents(page)
    await page.close()
  })

  test('opening an event shows its dialog and updates the URL; Escape closes it', async ({
    page,
  }) => {
    test.skip(!editionUrl, 'no edition with an announced programme in the dataset')
    await page.goto(editionUrl!)
    await dismissCookies(page)

    await page.locator('a[href*="/events/"]').first().click()
    // The routed modal (ADR 0015): a dialog over the edition + the event URL.
    await expect(page).toHaveURL(/\/events\//)
    const back = page.getByRole('button', { name: /back to programme/i })
    await expect(back).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(back).toBeHidden()
    await expect(page).not.toHaveURL(/\/events\//)
  })

  test('filtering the programme toggles state and Reset restores it', async ({ page }) => {
    test.skip(!editionUrl, 'no edition with an announced programme in the dataset')
    await page.goto(editionUrl!)
    await dismissCookies(page)

    const filters = page.getByRole('group', { name: /filter the programme/i })
    test.skip((await filters.count()) === 0, 'this edition has no multi-option facets to filter by')

    const reset = filters.getByRole('button', { name: /^reset$/i })
    const chip = filters.getByRole('button').filter({ hasNotText: /reset/i }).first()
    const eventCount = () => page.locator('a[href*="/events/"]').count()

    await expect(reset).toBeDisabled()
    const before = await eventCount()

    await chip.click()
    await expect(chip).toHaveAttribute('aria-pressed', 'true')
    await expect(reset).toBeEnabled()
    // A single facet never *adds* events to the programme.
    await expect.poll(eventCount).toBeLessThanOrEqual(before)

    await reset.click()
    await expect(reset).toBeDisabled()
    await expect.poll(eventCount).toBe(before)
  })
})
