import { parseBody } from 'next-sanity/webhook'
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

interface WebhookPayload {
  tags: string[]
}

/**
 * Sanity webhook target. Bust the HTML cache for any tag the publish
 * touched. Configure a GROQ-powered webhook in sanity.io/manage with:
 *   URL:        https://zsb.app/api/revalidate/tag
 *   Filter:     _type in ["edition", "artist", "organization",
 *               "siteSettings", "homepage", "aboutPage", "partnersPage",
 *               "visitPage", "privacyPage", "pressAppearance",
 *               "pressRelease"]
 *   Projection: { "tags": [_type, _type + ":" + _id] }
 *   Secret:     SANITY_REVALIDATE_SECRET (also set as a Vercel env var)
 *
 * Pairs with the in-page sync-tag updates from <SanityLive />, which
 * handles freshness for visitors with the tab already open. This route
 * handles freshness for visitors hitting a cached HTML response.
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
    return NextResponse.json({ revalidated: body.tags })
  } catch (err) {
    return new Response((err as Error).message, { status: 500 })
  }
}
