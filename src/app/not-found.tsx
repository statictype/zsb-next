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
  bg: 'canvas',
  overflow: 'hidden',
  paddingBlock: 'xl',
  paddingInline: 'content',
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
  animation: 'glowDrift 12s ease-in-out infinite',
})

const glowPink = css({ bg: 'action', top: '20%', left: '15%' })
const glowChartreuse = css({
  bg: 'highlight',
  bottom: '10%',
  right: '10%',
  animationDelay: '-6s',
})

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
  opacity: '0',
  animation: 'fadeSlideUp {durations.entrance} {easings.expo} 0.1s forwards',
})

const divider = css({
  w: '48px',
  h: '2px',
  bg: 'highlight',
  marginTop: 'lg',
  marginInline: 'auto',
  marginBottom: 'xl',
  opacity: '0',
  animation: 'fadeSlideUp {durations.entrance} {easings.expo} 0.25s forwards',
})

const title = css({
  fontFamily: 'display',
  fontSize: 'lg',
  textTransform: 'uppercase',
  letterSpacing: 'label',
  color: 'white',
  marginBottom: 'md',
  opacity: '0',
  animation: 'fadeSlideUp {durations.entrance} {easings.expo} 0.35s forwards',
})

const subtitle = css({
  fontFamily: 'body',
  fontSize: 'sm',
  color: 'body',
  textTransform: 'uppercase',
  letterSpacing: 'label',
  marginBottom: '2xl',
  opacity: '0',
  animation: 'fadeSlideUp {durations.entrance} {easings.expo} 0.45s forwards',
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
  border: '1px solid token(colors.borderDark)',
  paddingBlock: '14px',
  paddingInline: '28px',
  opacity: '0',
  animation: 'fadeSlideUp {durations.entrance} {easings.expo} 0.55s forwards',
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
        <div className={code}>404</div>
        <div className={divider} />
        <h1 className={title}>This space is empty</h1>
        <p className={subtitle}>Like an exhibition between shows</p>
        <Link href="/" className={cta}>
          Return Home <RiArrowRightLine size={14} />
        </Link>
      </div>
    </div>
  )
}
