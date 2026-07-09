'use client'

import { RiAlertLine, RiRefreshLine } from '@remixicon/react'
import Link from 'next/link'
import { Center, Text } from 'styled-system/jsx'
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
    <Center className={styles.page} flexDirection="column">
      <div className={styles.noise} />
      <div className={styles.glow} />

      <div className={styles.content}>
        <div className={styles.icon}>
          <RiAlertLine size={24} />
        </div>
        <Text as="h1" variant="title" className={styles.title}>
          Something broke
        </Text>
        <Text as="p" variant="caption" className={styles.message}>
          An unexpected error occurred.
          <br />
          Try again or return to the homepage.
        </Text>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={reset}>
            <RiRefreshLine size={14} />
            Try Again
          </Button>
          <Button asChild variant="link">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </Center>
  )
}
