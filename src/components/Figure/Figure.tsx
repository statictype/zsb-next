import { type ImageProps } from 'next/image'
import { FallbackImage } from '@/components/Figure/FallbackImage'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder'
import type { ImageData } from '@/types/edition'

export type FigurePassthroughProps = Pick<
  ImageProps,
  'className' | 'preload' | 'fetchPriority' | 'draggable' | 'style' | 'onClick' | 'loading'
>

export type FigureProps = {
  image?: ImageData | undefined
  sizes: string
} & FigurePassthroughProps

// Must render inside a `position: relative; overflow: hidden` frame.
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
