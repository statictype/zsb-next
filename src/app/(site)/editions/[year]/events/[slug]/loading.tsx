import { eventLoading } from '@edition/events/[slug]/loading.recipe'
import { cx } from 'styled-system/css'
import { Stack } from 'styled-system/jsx'

const s = eventLoading()

export default function EventLoading() {
  return (
    <div className={s.page}>
      <div className={cx(s.bone, s.crumb)} />

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
          <div className={cx(s.bone, s.actions)} />
        </div>
      </div>
    </div>
  )
}
