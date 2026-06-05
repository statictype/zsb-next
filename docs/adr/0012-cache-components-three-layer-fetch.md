# The three-layer fetch pattern is the cost of static-by-default + draft preview

`next.config.ts` sets `cacheComponents: true`. Under Cache Components, a
function carrying the `'use cache'` directive **may not read request data** —
`draftMode()`, `cookies()`, `headers()`, `searchParams`. A cache entry is shared
across requests, so reading per-request state inside it is forbidden (it would
either throw or serve one visitor's state to another).

But the site has a hard requirement that *does* depend on request data: editors
using the Presentation tool must preview **draft** content, which means reading
`draftMode()` + the perspective cookie. So the same page must be:

- **static-by-default** for the public (no request reads → fully cacheable), and
- **draft-aware** for editors (reads the request to pick a perspective).

These two pull in opposite directions across the `'use cache'` line. The only way
to satisfy both is to **split each page in two halves that sit on opposite sides
of the cache boundary**, and pass a small serializable value across:

| Layer | Reads | Cacheable | Job |
|-------|-------|-----------|-----|
| **Dynamic** | `draftMode()` + `cookies()` | no | resolve *which* perspective/stega this request wants |
| **Cached** | only its `options` arg | yes | fetch + render, keyed on those options |

`getDynamicFetchOptions()` (`src/sanity/lib/live.ts`) is the Dynamic layer: it
distills the request into `DynamicFetchOptions = { perspective, stega }` — a
serializable value the cache can key on instead of reading the request itself.
The public path short-circuits this entirely: with draft mode off, options are
statically `{ perspective: 'published', stega: false }`, so the page skips
straight to the Cached layer and is fully static. The Dynamic layer only runs
for an editor previewing drafts.

**This split is the cost, and it is structural, not incidental.** You cannot
read the request inside the render you want cached, so every draft-previewable
page is necessarily two functions. What follows is how we keep that cost from
multiplying into per-page boilerplate.

## Two seams absorb the repetition

The split is unavoidable; writing it out by hand 7 times is not.

- **`queryData(query, options, params?)`** (`live.ts`) is the single place
  `DynamicFetchOptions` meets `sanityFetch` — it threads `perspective` + `stega`
  onto the query and returns the data. Each fetcher collapses to a one-liner. It
  mirrors `sanityFetch`'s `<const QueryString>` generic so the literal query
  string keeps resolving to its generated result type (verified: a `number`
  probe errored with the real result type, not a silent `any`). It is
  **deliberately not `'use cache'` itself** — the directive stays on the named
  fetcher so the cache boundary and its sync-tags are unchanged.

- **`<DraftAware cached={…} fallback={…} />`** (`src/components/DraftAware/`)
  owns the Dynamic half: the `draftMode()` branch, the published-default
  short-circuit, the Suspense wrapper, and the options resolution. A page
  supplies only what is unique to it — its cached leaf and its fallback.

## Why the Cached leaf stays lexically in the page

`DraftAware` factors the Dynamic half but **not** the Cached leaf. Each page
keeps its own `async function CachedX({ options }) { 'use cache'; … }`.

This is intentional. `'use cache'` keys on the function's arguments **and its
closed-over variables**, all of which must be serializable. A generic harness
that hoisted the directive — e.g. a factory returning a `'use cache'` closure
that closed over the query string and a mapper function — would put a function
in the cache key. Functions aren't serializable, so that either breaks the key
or silently disables caching on the file. Keeping the directive lexical in the
page, closing over nothing but the serializable `options` prop, sidesteps the
hazard. `DraftAware` receives the leaf as a plain `(options) => ReactNode`
callback and invokes it *outside* any cache boundary (`DraftResolved` is not
cached), so passing the function is safe.

## Considered alternatives

- **`force-dynamic` / opt out of Cache Components.** Makes every page dynamic,
  killing the static-by-default win for the 99% of traffic that never previews a
  draft. Rejected — the split exists precisely so the public path stays static.
- **Read `draftMode()` inside the `'use cache'` body.** Illegal under Cache
  Components; the whole pattern exists to avoid it.
- **Factor the Cached leaf into the harness too** (one component owns both
  halves, `'use cache'` closing over the page's fetcher/render). Collapses the
  per-page leaf but reintroduces the closure-as-cache-key hazard above. Rejected.
- **A `createPage(fetcher, render)` factory returning the whole route.** Same
  closure problem, plus it hides the `'use cache'` directive from the file that
  owns it, making the cache boundary invisible at the page. Rejected in favour of
  a component that brokers the *Dynamic* half and leaves the cached leaf visible.

## Reversibility

High. `DraftAware` and `queryData` are thin and additive — inlining either back
into the pages is mechanical, and the `'use cache'` leaves never moved. The
underlying three-layer split is dictated by Cache Components, not by this ADR;
only the *factoring* of its boilerplate is ours to revisit.

See also: [ADR 0008](./0008-derive-edition-listings-from-status.md) (what the
fetchers return) and `docs/cms.md` → "How draft-mode-aware fetching works".
