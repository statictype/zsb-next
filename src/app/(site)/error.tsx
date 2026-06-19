'use client'

import { RiAlertLine, RiRefreshLine } from '@remixicon/react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button/Button'
import { errorPage } from './error.recipe'

const styles = errorPage()

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className={styles.page}>
      <div className={styles.noise} />
      <div className={styles.glow} />

      <div className={styles.content}>
        <div className={styles.icon}>
          <RiAlertLine size={24} />
        </div>
        <h1 className={styles.title}>Something broke</h1>
        <p className={styles.message}>
          An unexpected error occurred.
          <br />
          Try again or return to the homepage.
        </p>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={reset}>
            <RiRefreshLine size={14} />
            Try Again
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
