'use client'

import { eventModal } from '@program/EventModal.recipe'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { Dialog } from '@/components/ui/Dialog/Dialog'

const s = eventModal()

export function EventModalShell({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <Dialog open onClose={() => router.back()} childTitle presentation="fullscreen">
      <div className={s.shell}>{children}</div>
    </Dialog>
  )
}
