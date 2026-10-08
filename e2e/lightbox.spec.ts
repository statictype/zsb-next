import { expect, test } from '@playwright/test'

// Dialog ids duplicated across Next's kept-alive (Activity-hidden) routes made Zag track
// a stale node, so clicks inside the open dialog dismissed it. Hence two soft
// navigations before opening the lightbox.

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

  const gallery = page.locator('[aria-label="Edition photo gallery"]')
  await gallery.scrollIntoViewIfNeeded()
  await gallery.locator('button:has(img)').first().click()

  const content = page.getByRole('dialog', { name: 'Image lightbox' })
  await expect(content).toBeVisible()
  const firstSrc = await content.locator('img').first().getAttribute('src')

  await content.getByRole('button', { name: 'Next image' }).click()
  await expect(content).toBeVisible()
  await expect
    .poll(async () => content.locator('img').first().getAttribute('src'))
    .not.toBe(firstSrc)
})
