'use client'

import { RiAlertLine, RiRefreshLine } from '@remixicon/react'
import Link from 'next/link'
import { Center, Stack, Text } from 'styled-system/jsx'
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

      <Stack className={styles.content} gap="2xl" alignItems="center">
        <Stack gap="xl" alignItems="center">
          <div className={styles.icon}>
            <RiAlertLine size={24} />
          </div>
          <Stack gap="md">
            <Text as="h1" variant="title">
              Something broke
            </Text>
            <Text as="p" variant="caption">
              An unexpected error occurred.
              <br />
              Try again or return to the homepage.
            </Text>
          </Stack>
        </Stack>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={reset}>
            <RiRefreshLine size={14} />
            Try Again
          </Button>
          <Button asChild variant="link">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </Stack>
    </Center>
  )
}
