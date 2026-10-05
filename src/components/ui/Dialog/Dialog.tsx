'use client'

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from 'styled-system/css'
import { dialog } from 'styled-system/recipes'

type AccessibleName =
  | { title: ReactNode; ariaLabel?: never; childTitle?: never }
  | { title?: never; ariaLabel: string; childTitle?: never }
  | { title?: never; ariaLabel?: never; childTitle: true }

type DialogProps = AccessibleName & {
  open: boolean
  onClose: () => void
  presentation: 'panel' | 'fullscreen'
  children: ReactNode
  className?: string | undefined
}

const DialogTitleId = createContext<string | undefined>(undefined)

export function DialogTitle({ children }: { children: ReactNode }) {
  const id = useContext(DialogTitleId)
  return (
    <h2 id={id} className={dialog().title}>
      {children}
    </h2>
  )
}

const emptySubscribe = () => () => {}
const clientReady = () => true
const serverReady = () => false

export function Dialog({
  open,
  onClose,
  presentation,
  title,
  ariaLabel,
  children,
  className,
}: DialogProps) {
  const styles = dialog({ presentation })
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const mounted = useSyncExternalStore(emptySubscribe, clientReady, serverReady)

  useLayoutEffect(() => {
    const element = ref.current
    if (!open || !element) return
    element.showModal()
    element.focus()
  }, [open, mounted])

  useEffect(() => {
    const element = ref.current
    if (!open || !element) return
    return () => element.close()
  }, [open, mounted])

  if (!mounted) return null

  return createPortal(
    <dialog
      ref={ref}
      className={cx(styles.root, className)}
      tabIndex={-1}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <DialogTitleId value={titleId}>
        <div className={styles.content}>
          {title !== undefined && <DialogTitle>{title}</DialogTitle>}
          {children}
        </div>
      </DialogTitleId>
    </dialog>,
    document.body,
  )
}
