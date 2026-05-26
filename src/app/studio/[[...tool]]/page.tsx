import { Suspense } from 'react'
import { Studio } from './Studio'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return (
    <Suspense>
      <Studio />
    </Suspense>
  )
}
