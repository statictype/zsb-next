import { Studio } from '@studio/Studio'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

export { metadata, viewport } from 'next-sanity/studio'

// The Studio is fully client-rendered, but its metadata (from
// next-sanity/studio) depends on request data, which under Cache
// Components forces the rest of the route to also be dynamic.
// We satisfy that constraint inside the Suspense boundary so the
// route doesn't block prerender of its static shell.
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
