import Image, { type ImageProps } from 'next/image'
import shared from '@/components/Shared.module.css'
import type { ImageData } from '@/types/edition'

/**
 * The render mirror of {@link toImageData}: takes a runtime `ImageData` and
 * paints it with the house loading convention — a pulsing skeleton sibling, a
 * `fill` <Image>, and `placeholder="blur"` derived from the presence of
 * `blurDataURL`. Blur is therefore one decision, made here, instead of a
 * conditional spread copy-pasted at every call site.
 *
 * Contract: render this inside a `position: relative; overflow: hidden` frame.
 * The skeleton sits behind the image (inset:0) and the loaded image paints on
 * top of it; the caller's `className` should give the image an opaque
 * background so transparent areas don't reveal the pulse. Per-site visual
 * styling (object-fit, radius, transitions) stays in that `className`.
 */
type FigureProps = {
  image: ImageData
  sizes: string
} & Pick<ImageProps, 'className' | 'priority' | 'draggable' | 'style'>

export function Figure({ image, sizes, ...rest }: FigureProps) {
  return (
    <>
      <span aria-hidden className={shared.skeleton} />
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        {...rest}
        {...(image.blurDataURL
          ? { placeholder: 'blur' as const, blurDataURL: image.blurDataURL }
          : {})}
      />
    </>
  )
}
