'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { FigurePassthroughProps } from '@/components/Figure/Figure'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder'

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
