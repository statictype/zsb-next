import { eventLoading } from '@edition/events/[slug]/loading.recipe'
import { EventModalLoadingChrome } from '@program/EventModal'
import { cx } from 'styled-system/css'
import { Stack } from 'styled-system/jsx'
import { DialogTitle } from '@/components/ui/Dialog/Dialog'

const s = eventLoading({ shell: 'modal' })

export default function EventModalLoading() {
  return (
    <>
      <DialogTitle>Loading event</DialogTitle>
      <EventModalLoadingChrome>
        <div className={cx(s.bone, s.meta)} />
      </EventModalLoadingChrome>

      <div className={s.layout}>
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
      <div className={s.actions}>
        <div className={cx(s.bone, s.action)} />
      </div>
    </>
  )
}
