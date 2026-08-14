import { RiArrowRightLine } from '@remixicon/react'
import Link from 'next/link'
import { css, cx } from 'styled-system/css'
import { Text } from 'styled-system/jsx'
import { Button } from '@/components/ui/Button/Button'

const page = css({
  minHeight: 'svh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'surface',
  paddingBlock: 'xl',
  paddingInline: 'gutter',
})

const content = css({
  textAlign: 'center',
  maxWidth: 'narrowColumn',
})

const code = css({
  color: 'heading',
})

const divider = css({
  width: '[48px]',
  height: '[2px]',
  background: 'highlight',
  marginTop: 'lg',
  marginInline: 'auto',
  marginBottom: 'xl',
})

const title = css({
  marginBottom: 'md',
})

const subtitle = css({
  marginBottom: '2xl',
})

const enter = css({ animationStyle: 'enter' })

export default function NotFound() {
  return (
    <div className={page}>
      <div className={cx(content, enter)}>
        <Text as="div" variant="display" className={code}>
          404
        </Text>
        <div className={divider} />
        <Text as="h1" variant="heading" className={title}>
          This space is empty
        </Text>
        <Text as="p" variant="label" className={subtitle}>
          Like an exhibition between shows
        </Text>
        <Button asChild variant="secondary" size="md">
          <Link href="/">
            Return Home <RiArrowRightLine size={14} />
          </Link>
        </Button>
      </div>
    </div>
  )
}
