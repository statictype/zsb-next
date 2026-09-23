import { css, cx } from 'styled-system/css'
import type { SlideLoading } from '@/components/Carousel/useSlideLoading'
import { Figure, type FigureProps } from '@/components/Figure/Figure'

const placeholder = css({
  position: 'absolute',
  inset: '0',
  width: 'full',
  height: 'full',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
})

export function SlideFigure({
  loading,
  ...figure
}: Omit<FigureProps, 'loading'> & { loading: SlideLoading }) {
  if (loading === 'deferred') {
    const blur = figure.image?.blurDataURL
    return (
      <span
        aria-hidden
        className={cx(placeholder, figure.className)}
        style={{ ...figure.style, ...(blur ? { backgroundImage: `url("${blur}")` } : {}) }}
      />
    )
  }
  return <Figure {...figure} {...(loading === 'eager' ? { loading: 'eager' as const } : {})} />
}
