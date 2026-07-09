import { RiArrowRightLine } from '@remixicon/react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { css, cx } from 'styled-system/css'

const page = css({
  position: 'relative',
  minH: 'svh',
  display: 'flex',
  flexDir: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  bg: 'surface',
  overflow: 'hidden',
  paddingBlock: 'xl',
  paddingInline: 'gutter',
})

const vignette = css({
  position: 'absolute',
  inset: '0',
  background: '[radial-gradient(ellipse at center, transparent 40%, rgb(0 0 0 / 1) 100%)]',
  pointerEvents: 'none',
})

const glow = css({
  position: 'absolute',
  w: '[600px]',
  h: '[600px]',
  borderRadius: 'circle',
  filter: '[blur(160px)]',
  opacity: '0.12',
  pointerEvents: 'none',
})

const glowPink = css({ bg: 'action', top: '[20%]', left: '[15%]' })
const glowChartreuse = css({ bg: 'highlight', bottom: '[10%]', right: '[10%]' })

const content = css({
  position: 'relative',
  zIndex: '10',
  textAlign: 'center',
  maxW: '[680px]',
})

const code = css({
  fontFamily: 'display',
  fontSize: '[clamp(120px, 25vw, 280px)]',
  lineHeight: 'display',
  color: 'white',
  letterSpacing: '[-6px]',
})

const divider = css({
  w: '[48px]',
  h: '[2px]',
  bg: 'highlight',
  marginTop: 'lg',
  marginInline: 'auto',
  marginBottom: 'xl',
})

const title = css({
  fontFamily: 'display',
  fontSize: 'md',
  textTransform: 'uppercase',
  letterSpacing: 'label',
  color: 'white',
  marginBottom: 'md',
})

const subtitle = css({
  fontFamily: 'body',
  fontSize: 'sm',
  color: 'body',
  textTransform: 'uppercase',
  letterSpacing: 'label',
  marginBottom: '2xl',
})

const cta = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'sm',
  fontFamily: 'body',
  fontSize: 'xs',
  textTransform: 'uppercase',
  letterSpacing: 'label',
  color: 'white',
  border: 'hairline',
  paddingBlock: 'md',
  paddingInline: 'lg',
  transitionProperty: 'colors',
  transitionDuration: 'normal',
  transitionTimingFunction: 'quint',
  '& svg': {
    transitionProperty: '[transform]',
    transitionDuration: 'normal',
    transitionTimingFunction: 'quint',
  },
  _hover: {
    borderColor: 'action',
    color: 'action',
    '& svg': { transform: 'translateX(4px)' },
  },
})

const enter = css({ animationStyle: 'enter' })

// The entrance cascade rides the shared `enter` stagger (`--i` × 60ms),
// spaced two beats apart, instead of five bespoke delays.
const beat = (i: number) => ({ '--i': i }) as CSSProperties

export default function NotFound() {
  return (
    <div className={page}>
      <div className={vignette} />
      <div className={cx(glow, glowPink)} />
      <div className={cx(glow, glowChartreuse)} />

      <div className={content}>
        <div className={cx(code, enter)} style={beat(0)}>
          404
        </div>
        <div className={cx(divider, enter)} style={beat(2)} />
        <h1 className={cx(title, enter)} style={beat(4)}>
          This space is empty
        </h1>
        <p className={cx(subtitle, enter)} style={beat(6)}>
          Like an exhibition between shows
        </p>
        <Link href="/" className={cx(cta, enter)} style={beat(8)}>
          Return Home <RiArrowRightLine size={14} />
        </Link>
      </div>
    </div>
  )
}
