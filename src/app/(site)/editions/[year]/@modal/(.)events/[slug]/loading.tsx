import { eventLoading } from '@edition/events/[slug]/loading.recipe'
import { eventModal } from '@program/EventModal.recipe'
import { cx } from 'styled-system/css'
import { Stack } from 'styled-system/jsx'
import { DialogTitle } from '@/components/ui/Dialog/Dialog'

const s = eventLoading()
const m = eventModal()

export default function EventModalLoading() {
  return (
    <>
      <DialogTitle>Loading event</DialogTitle>
      <header className={m.chrome}>
        <div className={cx(s.bone, s.meta)} />
      </header>

      <div className={s.detail}>
        <div className={cx(s.bone, s.poster)} />
        <div className={s.column}>
          <div className={cx(s.bone, s.name)} />
          <div className={cx(s.bone, s.meta)} />
          <Stack gap="sm">
            <div className={cx(s.bone, s.line)} />
            <div className={cx(s.bone, s.line)} />
            <div className={cx(s.bone, s.line)} />
          </Stack>
        </div>
      </div>
    </>
  )
}
