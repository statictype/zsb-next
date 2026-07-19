import { revalidateTag } from 'next/cache'
import { after, type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { editionHref } from '@/lib/edition-href'
import { client } from '@/sanity/lib/client'
import { EDITION_YEARS_QUERY } from '@/sanity/lib/queries'

interface WebhookPayload {
  tags: string[]
}

/**
 * Sanity webhook target. Bust the HTML cache for any tag the publish
 * touched, then warm the affected pages so the refill happens on the
 * publisher's dime, not the first visitor's. Configure a GROQ-powered
 * webhook in sanity.io/manage with:
 *   URL:        https://sculpturedays.com/api/revalidate/tag
 *   Filter:     _type in ["edition", "artist", "organization", "venue",
 *               "venueType", "eventType", "siteSettings", "homepage",
 *               "aboutPage", "partnersPage", "visitPage", "privacyPage",
 *               "pressPage", "pressAppearance", "pressRelease"]
 *               (every document type in the schema — a type missing here
 *               fires no webhook at all, even if queries subscribe to it)
 *   Projection: { "tags": [_type, _type + ":" + _id] }
 *   Secret:     SANITY_REVALIDATE_SECRET (also set as a Vercel env var)
 *
 * The type-level tags only bust anything because every cached fetcher
 * subscribes to them via its query's `_TAGS` list (see `queries.ts`) —
 * without those, cache entries carry only opaque per-query sync tags the
 * webhook can never name. Pairs with the in-page sync-tag updates from
 * <SanityLive />, which handles freshness for visitors with the tab
 * already open. This route handles freshness for cold caches.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      // Wait for the Sanity CDN to catch up before revalidating; without
      // this we'd revalidate to a stale value.
      true,
    )

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }
    if (!Array.isArray(body?.tags) || body.tags.length === 0) {
      return new Response('Missing tags', { status: 400 })
    }

    // Webhook-driven invalidation should expire the cache entry
    // immediately. The default 'max' profile is stale-while-revalidate,
    // which would still serve stale HTML to the next visitor.
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
 * Re-fetch the busted pages so the next visitor gets a cache hit. The set is
 * fixed and tiny: the pages composed from many document types, plus every
 * live year's edition page when an edition changed (warming those also
 * refills the cached edition the year's event pages share). Bodies are read
 * to completion so the render — where the cache refill happens — isn't
 * aborted; runs inside `after()`, off the webhook's response path.
 */
async function warmAffectedPages(origin: string, tags: string[]) {
  try {
    const paths = ['/', '/visit', '/editions']
    if (tags.some((tag) => tag === 'edition' || tag.startsWith('edition:'))) {
      const rows = (await client.fetch(EDITION_YEARS_QUERY)) ?? []
      for (const row of rows) {
        if (row.year !== null && row.status === 'live') paths.push(editionHref(row.year))
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
