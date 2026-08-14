import { openFullProgram } from '@e2e/helpers'
import { expect, test } from '@playwright/test'

test('openFullProgram waits for a streamed archive before opening it', async ({ page }) => {
  await page.setContent('<main id="app"></main>')
  await page.evaluate(() => {
    setTimeout(() => {
      const app = document.querySelector('#app')
      if (app) {
        app.innerHTML =
          '<div><button type="button" onclick="document.getElementById(\'program\').hidden = false">Browse the full program</button><div id="program" hidden><a href="/editions/2025/events/example">Example event</a></div></div>'
      }
    }, 100)
  })

  await openFullProgram(page)

  await expect(page.getByRole('link', { name: 'Example event' })).toBeVisible()
})
