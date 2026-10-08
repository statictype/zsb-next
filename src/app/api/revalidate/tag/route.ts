import { revalidateTag } from 'next/cache'
import { after, type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { editionHref } from '@/lib/edition-href'
import { GALERIA_BELLER_PATH } from '@/lib/galeria-beller-href'
import { client } from '@/sanity/lib/client'
import { EDITION_SUMMARIES } from '@/sanity/lib/queries'

interface WebhookPayload {
  tags: string[]
}

/** Sanity webhook target. Filter, projection and secret are configured at sanity.io/manage; see docs/cms.md. */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      // Waits for the Sanity CDN to catch up; otherwise revalidation fetches a stale value.
      true,
    )

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }
    if (!Array.isArray(body?.tags) || body.tags.length === 0) {
      return new Response('Missing tags', { status: 400 })
    }

    // The default 'max' profile is stale-while-revalidate and would serve stale HTML to the next visitor.
    for (const tag of body.tags) {
      revalidateTag(tag, { expire: 0 })
    }
    after(() => warmAffectedPages(req.nextUrl.origin, body.tags))
    return NextResponse.json({ revalidated: body.tags })
  } catch (err) {
    console.error('Revalidation webhook failed:', err)
    return new Response('Internal server error', { status: 500 })
  }
}

/**
 * Re-fetches the pages composed from many document types, plus every live
 * edition page when an edition changed. Bodies are read to completion so the
 * render that refills the cache is not aborted. Runs inside `after()`.
 */
async function warmAffectedPages(origin: string, tags: string[]) {
  try {
    const paths = ['/', '/visit', '/editions', GALERIA_BELLER_PATH]
    if (tags.some((tag) => tag === 'edition' || tag.startsWith('edition:'))) {
      const rows = await client.fetch(EDITION_SUMMARIES.query)
      for (const row of rows) {
        if (row.status === 'live') paths.push(editionHref(row.year))
      }
    }
    await Promise.allSettled(
      paths.map(async (path) => {
        const res = await fetch(new URL(path, origin), { cache: 'no-store' })
        await res.text()
      }),
    )
  } catch (err) {
    console.error('Post-revalidation warming failed:', err)
  }
}
