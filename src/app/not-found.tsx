import { RiArrowRightLine } from '@remixicon/react'
import Link from 'next/link'
import { css, cx } from 'styled-system/css'

const page = css({
  position: 'relative',
  minH: '100svh',
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
  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 1) 100%)',
  pointerEvents: 'none',
})

const glow = css({
  position: 'absolute',
  w: '600px',
  h: '600px',
  borderRadius: 'circle',
  filter: 'blur(160px)',
  opacity: '0.12',
  pointerEvents: 'none',
})

const glowPink = css({ bg: 'action', top: '20%', left: '15%' })
const glowChartreuse = css({ bg: 'highlight', bottom: '10%', right: '10%' })

const content = css({
  position: 'relative',
  zIndex: '10',
  textAlign: 'center',
  maxW: '680px',
})

const code = css({
  fontFamily: 'display',
  fontSize: 'clamp(120px, 25vw, 280px)',
  lineHeight: 'display',
  color: 'white',
  letterSpacing: '-6px',
  animationDelay: '0.1s',
})

const divider = css({
  w: '48px',
  h: '2px',
  bg: 'highlight',
  marginTop: 'lg',
  marginInline: 'auto',
  marginBottom: 'xl',
  animationDelay: '0.25s',
})

const title = css({
  fontFamily: 'display',
  fontSize: 'lg',
  textTransform: 'uppercase',
  letterSpacing: 'label',
  color: 'white',
  marginBottom: 'md',
  animationDelay: '0.35s',
})

const subtitle = css({
  fontFamily: 'body',
  fontSize: 'sm',
  color: 'body',
  textTransform: 'uppercase',
  letterSpacing: 'label',
  marginBottom: '2xl',
  animationDelay: '0.45s',
})

const cta = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'sm',
  fontFamily: 'body',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'label',
  color: 'white',
  border: 'hairline',
  paddingBlock: '14px',
  paddingInline: '28px',
  animationDelay: '0.55s',
  transition:
    'color {durations.normal} {easings.quint}, border-color {durations.normal} {easings.quint}',
  '& svg': { transition: 'transform {durations.normal} {easings.quint}' },
  _hover: {
    borderColor: 'action',
    color: 'action',
    '& svg': { transform: 'translateX(4px)' },
  },
})

export default function NotFound() {
  return (
    <div className={page}>
      <div className={vignette} />
      <div className={cx(glow, glowPink)} />
      <div className={cx(glow, glowChartreuse)} />

      <div className={content}>
        <div className={cx(code, css({ animationStyle: 'enter' }))}>404</div>
        <div className={cx(divider, css({ animationStyle: 'enter' }))} />
        <h1 className={cx(title, css({ animationStyle: 'enter' }))}>This space is empty</h1>
        <p className={cx(subtitle, css({ animationStyle: 'enter' }))}>
          Like an exhibition between shows
        </p>
        <Link href="/" className={cx(cta, css({ animationStyle: 'enter' }))}>
          Return Home <RiArrowRightLine size={14} />
        </Link>
      </div>
    </div>
  )
}
