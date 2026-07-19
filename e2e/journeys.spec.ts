import { expect, test } from '@playwright/test'
import {
  dismissCookies,
  expectErrorClean,
  findEditionWithEvents,
  firstEditionHref,
  openFullProgramme,
  trackErrors,
} from '@e2e/helpers'

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
    const href = await firstEditionHref(page)
    expect(href, 'the homepage should link to an edition').toBeTruthy()
    await page.locator(`a[href="${href}"]`).first().click()
    await expect(page).toHaveURL(/\/editions\/\d+/)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  })

  test('the editions index links through to an edition page', async ({ page }) => {
    await page.goto('/editions')
    await dismissCookies(page)
    const href = await firstEditionHref(page)
    expect(href, 'the editions index should link to an edition').toBeTruthy()
    await page.locator(`a[href="${href}"]`).first().click()
    await expect(page).toHaveURL(/\/editions\/\d+/)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  })

  test('the footer privacy link opens the privacy page', async ({ page }) => {
    await page.goto('/')
    await dismissCookies(page)
    // Scope to the footer landmark — the cookie banner also links to /privacy.
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: /privacy/i })
      .click()
    await expect(page).toHaveURL(/\/privacy$/)
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()
  })
})

// ---- Tier 3: key interactions (behavioral) ----------------------------------

test.describe('cookie consent', () => {
  test('the banner dismisses on Accept and stays dismissed after reload', async ({ page }) => {
    await page.goto('/')
    const banner = page.getByRole('region', { name: /we use cookies/i })
    await expect(banner).toBeVisible()

    await banner.getByRole('button', { name: /accept/i }).click()
    await expect(banner).toBeHidden()

    await page.reload()
    await expect(page.getByRole('region', { name: /we use cookies/i })).toHaveCount(0)
  })
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('contains focus, closes on Escape, and restores the menu trigger', async ({ page }) => {
    await page.goto('/')
    await dismissCookies(page)

    const opener = page.getByRole('button', { name: 'Open navigation' })
    await opener.click()
    const dialog = page.getByRole('dialog', { name: 'Site navigation' })
    await expect(dialog).toBeVisible()
    await expect
      .poll(() => dialog.evaluate((element) => element.contains(document.activeElement)))
      .toBe(true)

    await page.keyboard.press('Tab')
    await expect
      .poll(() => dialog.evaluate((element) => element.contains(document.activeElement)))
      .toBe(true)

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
    await expect(opener).toBeFocused()
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
    await openFullProgramme(page)

    // The calendar renders responsive layout variants; click the first event
    // link that's actually visible, not the first in DOM order (may be hidden).
    const eventLink = page.locator('a[href*="/events/"]:visible').first()
    await eventLink.scrollIntoViewIfNeeded()
    await eventLink.click()
    // The routed modal (ADR 0015): a dialog over the edition + the event URL.
    await expect(page).toHaveURL(/\/events\//)
    const back = page.getByRole('button', { name: /back to programme/i })
    await expect(back).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(back).toBeHidden()
    await expect(page).not.toHaveURL(/\/events\//)
  })

  test('a cold event URL dismisses up to its edition', async ({ page }) => {
    test.skip(!editionUrl, 'no edition with an announced programme in the dataset')
    await page.goto(editionUrl!)
    await dismissCookies(page)
    await openFullProgramme(page)

    const eventHref = await page.locator('a[href*="/events/"]').first().getAttribute('href')
    expect(eventHref).toBeTruthy()
    await page.goto(eventHref!)
    await dismissCookies(page)
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect
      .poll(() => dialog.evaluate((element) => element.contains(document.activeElement)))
      .toBe(true)

    await page.keyboard.press('Escape')
    await expect(page).toHaveURL(new RegExp(`${editionUrl!}/?$`))
    await expect(dialog).toBeHidden()
  })

  test('filtering the programme toggles state and Reset restores it', async ({ page }) => {
    test.skip(!editionUrl, 'no edition with an announced programme in the dataset')
    await page.goto(editionUrl!)
    await dismissCookies(page)
    await openFullProgramme(page)

    const filters = page.getByRole('group', { name: /filter the programme/i })
    test.skip((await filters.count()) === 0, 'this edition has no multi-option facets to filter by')

    const reset = filters.getByRole('button', { name: /^reset$/i })
    const chip = filters.getByRole('checkbox').first()
    // Count only visible event links — the calendar renders responsive variants.
    const eventCount = () => page.locator('a[href*="/events/"]:visible').count()

    await expect(reset).toBeDisabled()
    const before = await eventCount()

    await chip.press('Space')
    await expect(chip).not.toBeChecked()
    await expect(reset).toBeEnabled()
    // A single facet never *adds* events to the programme.
    await expect.poll(eventCount).toBeLessThanOrEqual(before)

    await reset.click()
    await expect(reset).toBeDisabled()
    await expect.poll(eventCount).toBe(before)
  })
})

test.describe('carousel', () => {
  test('dragging an interactive rail slide does not open its lightbox', async ({ page }) => {
    await page.goto('/press')
    await dismissCookies(page)

    const carousel = page.getByRole('region', { name: 'Media kit posters' })
    test.skip((await carousel.count()) === 0, 'the dataset has no media-kit carousel')
    const poster = carousel.getByRole('button', { name: /^open /i }).first()
    const box = await poster.boundingBox()
    test.skip(!box, 'the first media-kit poster is not visible')

    const start = { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 }
    await page.mouse.move(start.x, start.y)
    await page.mouse.down()
    await page.mouse.move(start.x - Math.min(140, box!.width / 2), start.y, { steps: 8 })
    await page.mouse.up()
    await expect(page.getByRole('dialog', { name: 'Image lightbox' })).toHaveCount(0)

    await poster.click()
    await expect(page.getByRole('dialog', { name: 'Image lightbox' })).toBeVisible()
  })
})
