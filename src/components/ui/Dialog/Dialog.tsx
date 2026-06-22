'use client'

import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { type ReactNode, useSyncExternalStore } from 'react'
import { cx } from 'styled-system/css'
import { dialog } from 'styled-system/recipes'

type AccessibleName = { title: ReactNode; ariaLabel?: never } | { title?: never; ariaLabel: string }

type DialogProps = AccessibleName & {
  id?: string | undefined
  open: boolean
  onClose: () => void
  presentation: 'panel' | 'fullscreen'
  children: ReactNode
  className?: string | undefined
}

const emptySubscribe = () => () => {}
const clientReady = () => true
const serverReady = () => false

/**
 * The site's modal shell. Ark remains private and owns modal behavior; callers
 * provide only controlled site state, an accessible name, and product content.
 */
export function Dialog({
  id,
  open,
  onClose,
  presentation,
  title,
  ariaLabel,
  children,
  className,
}: DialogProps) {
  const styles = dialog({ presentation })
  // An initially-open machine starts before its portalled content exists during
  // hydration, so Ark cannot install dismissal/focus effects. Hydrate closed,
  // then let Ark perform the real closed → open transition on the client.
  const readyForInteraction = useSyncExternalStore(emptySubscribe, clientReady, serverReady)

  return (
    <ArkDialog.Root
      {...(id ? { id } : {})}
      open={readyForInteraction && open}
      onOpenChange={(details) => {
        if (!details.open) onClose()
      }}
      lazyMount={false}
      unmountOnExit={false}
    >
      {readyForInteraction && (
        <Portal>
          <ArkDialog.Backdrop className={styles.backdrop} />
          <ArkDialog.Positioner className={cx(styles.positioner, className)}>
            <ArkDialog.Content
              className={styles.content}
              {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
            >
              {title !== undefined && (
                <ArkDialog.Title className={styles.title}>{title}</ArkDialog.Title>
              )}
              {children}
            </ArkDialog.Content>
          </ArkDialog.Positioner>
        </Portal>
      )}
    </ArkDialog.Root>
  )
}
