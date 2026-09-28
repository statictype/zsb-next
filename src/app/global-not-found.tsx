import { fontVariables } from '@app/_root/fonts'
import NotFound from '@site/not-found'
import type { Metadata } from 'next'
import '@app/globals.css'
import '@app/panda.css'

export const metadata: Metadata = {
  title: '404 — Page not found',
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <NotFound />
      </body>
    </html>
  )
}
