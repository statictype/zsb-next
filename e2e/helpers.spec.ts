import { expect, test } from '@playwright/test'
import { openFullProgramme } from './helpers'

test('openFullProgramme waits for a streamed archive before opening it', async ({ page }) => {
  await page.setContent('<main id="app"></main>')
  await page.evaluate(() => {
    setTimeout(() => {
      const app = document.querySelector('#app')
      if (app) {
        app.innerHTML =
          '<details><summary><span>View full programme</span></summary><a href="/editions/2025/events/example">Example event</a></details>'
      }
    }, 100)
  })

  await openFullProgramme(page)

  await expect(page.getByRole('link', { name: 'Example event' })).toBeVisible()
})
