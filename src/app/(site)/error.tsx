'use client'

import { RiAlertLine, RiArrowRightLine, RiRefreshLine } from '@remixicon/react'
import Link from 'next/link'
import { cx } from 'styled-system/css'
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
          <button type="button" onClick={reset} className={cx(styles.btn, styles.btnPrimary)}>
            <RiRefreshLine size={14} />
            Try Again
          </button>
          <Link href="/" className={styles.btn}>
            Return Home <RiArrowRightLine size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
