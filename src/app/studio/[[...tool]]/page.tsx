import { Studio } from '@studio/Studio'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

export { metadata, viewport } from 'next-sanity/studio'

// The metadata from next-sanity/studio reads request data, which under Cache Components makes the route dynamic.
// Awaiting cookies() inside Suspense keeps the static shell prerenderable.
async function DynamicStudio() {
  await cookies()
  return <Studio />
}

export default function StudioPage() {
  return (
    <Suspense>
      <DynamicStudio />
    </Suspense>
  )
}
