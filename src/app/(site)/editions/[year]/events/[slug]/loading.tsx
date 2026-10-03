import { eventLoading } from '@edition/events/[slug]/loading.recipe'
import { cx } from 'styled-system/css'
import { Stack } from 'styled-system/jsx'

const s = eventLoading({ shell: 'page' })

export default function EventLoading() {
  return (
    <div className={s.page}>
      <div className={cx(s.bone, s.crumb)} />

      <div className={s.detail}>
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
      </div>

      <div className={s.rail}>
        <div className={cx(s.bone, s.step)} />
        <div className={cx(s.bone, s.step)} />
      </div>
    </div>
  )
}
