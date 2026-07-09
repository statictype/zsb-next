'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { FigurePassthroughProps } from '@/components/Figure/Figure'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder'

/**
 * Client core of {@link Figure}. Renders the `fill` next/image and, if the
 * source fails to load at runtime (CDN/optimizer error, a dead asset), swaps to
 * the neutral local placeholder instead of leaving the browser's broken-image
 * state. The split mirrors the fallback contract: `Figure` owns the *absent*-
 * image case (server, no JS); this owns the *load-failure* case (needs `onError`
 * + state, hence a client boundary). The placeholder is a local public asset, so
 * it still resolves even when remote image optimization is the thing failing.
 */
type FallbackImageProps = FigurePassthroughProps & {
  src: string
  alt: string
  sizes: string
  blurDataURL?: string | undefined
}

export function FallbackImage({ src, alt, sizes, blurDataURL, ...rest }: FallbackImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <Image src={PLACEHOLDER_IMAGE.src} alt={PLACEHOLDER_IMAGE.alt} fill sizes={sizes} {...rest} />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      onError={() => setFailed(true)}
      {...rest}
      {...(blurDataURL ? { placeholder: 'blur' as const, blurDataURL } : {})}
    />
  )
}
