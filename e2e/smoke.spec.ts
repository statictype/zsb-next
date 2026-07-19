import { expect, test } from '@playwright/test'
import { expectErrorClean, trackErrors } from '@e2e/helpers'

test.describe('site smoke', () => {
  test('2021 edition renders its archive link and is error-clean', async ({ page }) => {
    // 2021 is the inaugural online-only edition — now a Sanity `edition` like
    // every other year (migrated in ZSB-20, ADR 0018). It has no programme; its
    // off-site archive renders via the ExternalGallery "Open the Archive" link.
    const errors = trackErrors(page)
    const response = await page.goto('/editions/2021')
    expect(response?.status()).toBe(200)

    await expect(page.getByText('#digitalfield').first()).toBeVisible()
    await expect(page.getByText(/Sculpture didn.t stop/i).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Open the Archive/i })).toBeVisible()

    expectErrorClean(errors)
  })

  test('homepage renders the hero and links into the editions', async ({ page }) => {
    const errors = trackErrors(page)
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)

    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('a[href*="/editions/"]').first()).toBeVisible()

    expectErrorClean(errors)
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
