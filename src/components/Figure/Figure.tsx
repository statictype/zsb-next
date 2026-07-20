import { type ImageProps } from 'next/image'
import { FallbackImage } from '@/components/Figure/FallbackImage'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder'
import type { ImageData } from '@/types/edition'

export type FigurePassthroughProps = Pick<
  ImageProps,
  'className' | 'priority' | 'draggable' | 'style' | 'onClick'
>

type FigureProps = {
  image: ImageData | null | undefined
  sizes: string
} & FigurePassthroughProps

/**
 * Renders a runtime `ImageData` as a `fill` <Image> with LQIP blur-up. A
 * missing image (or a runtime load failure, via {@link FallbackImage}) paints
 * the neutral local placeholder. Must render inside a
 * `position: relative; overflow: hidden` frame.
 */
export function Figure({ image, sizes, ...rest }: FigureProps) {
  const data = image ?? PLACEHOLDER_IMAGE
  return (
    <FallbackImage
      src={data.src}
      alt={data.alt}
      sizes={sizes}
      blurDataURL={data.blurDataURL}
      {...rest}
    />
  )
}
