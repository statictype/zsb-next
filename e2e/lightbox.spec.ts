import { expect, test } from '@playwright/test'

// Regression: the lightbox arrows must navigate, not dismiss, after a soft
// navigation. Caller-chosen Dialog ids duplicated across Next's kept-alive
// (Activity-hidden) routes once made Zag track a stale node as the dialog
// content, so clicks inside the open dialog dismissed it as "outside" —
// which is why this journey soft-navigates twice before opening the lightbox.

test('edition gallery lightbox arrows survive a soft navigation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Accept' }).click()
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Editions' })
    .click()
  await page.waitForURL('/editions')
  await page.getByRole('link', { name: /202\d/ }).first().click()
  await page.waitForURL(/\/editions\/\d{4}/)

  const gallery = page.locator('[aria-label="Edition photo carousel"]')
  await gallery.scrollIntoViewIfNeeded()
  await gallery.locator('button:has(img)').first().click()

  const content = page.locator('[data-scope="dialog"][data-part="content"][data-state="open"]')
  await expect(content).toBeVisible()
  const firstSrc = await content.locator('img').first().getAttribute('src')

  await content.getByRole('button', { name: 'Next image' }).click()
  await expect(content).toBeVisible()
  await expect
    .poll(async () => content.locator('img').first().getAttribute('src'))
    .not.toBe(firstSrc)
})
