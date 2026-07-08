# Staff-level audit — zsb-next

*2026-07-07 · full-codebase read: all routes, components, data layer, schema, configs, scripts, CI, docs.*

*2026-07-07 review session: decisions locked inline as `> LOCKED` / `OUT OF SCOPE` / `ACCEPTED` blocks. Items **without** an explicit block are locked as written in the finding (single unambiguous fix, no decision needed). PR grouping at the bottom.*

Overall verdict up front: this is a genuinely strong codebase — the three-layer fetch discipline, total view-models, typegen flow, and test layering are above what most senior candidates ship. The findings below are mostly about the gap between "nothing is wrong" and "nothing can be questioned," plus a handful of carelessness signals that a reviewer would spot in the first hour.

---

## 1. Component architecture

**[MEDIUM] `Navigation` is a full client component for one piece of state** — `src/components/Navigation/Navigation.tsx:1`. The logo, desktop link list, and `NAV_ITEMS` are static; only the mobile toggle + dialog need `useState`. Since Navigation renders on every route (often from segment layouts), the whole nav ships as client JS.

**[MEDIUM] Navigation placement is inconsistent across routes.** Three mechanisms coexist: segment layouts (`about/layout.tsx`, `artists/layout.tsx`, `editions/layout.tsx`), inline in the page (`visit/page.tsx:20`, `(site)/page.tsx:83`), and — worst — *inside the cached draft-aware subtree* on press (`press/page.tsx:86`, rendered by `PressShell` inside `CachedPress`) and partners (`partners/page.tsx:72`). On press/partners in draft mode, the nav disappears with the `fallback={null}` while content streams. *(Verified: `Navigation` renders inside `PressShell` under `'use cache'`.)*

> **LOCKED (both items):** Mount `<Navigation />` once in `(site)/layout.tsx` (beside the Footer that already lives there); delete the three nav-only segment layouts and all five inline mounts. Drop the `activeId` prop entirely — a client `NavLinks` leaf derives active state from `usePathname()` (exact match for `/`, prefix otherwise) and sets `aria-current="page"`; the recipe already styles off that attribute (`Navigation.recipe.ts:105`), so zero CSS changes. Split the boundary: `Navigation` becomes a server shell (logo, desktop nav wrapper); client leaves are `NavLinks` (pathname → aria-current) and `MobileMenu` (`isOpen` + Dialog + Swap icon). The logo always links to `/` (drops the not-a-self-link-on-home nicety, keeping the logo fully server-rendered). Side effects: nav is structurally outside every cached shell (fixes the draft-mode bug by construction) and `not-found.tsx` gets site chrome for free.

**[LOW] `TypeChips` takes `CalendarEvent` but is called with `CalendarListEvent`** — `Calendar.tsx:274` vs `Calendar.tsx:301`. Works structurally, but it defeats the point of the `CalendarListEvent` render-boundary type (`types/edition.ts:91`). Type the param as the narrower `Pick<CalendarListEvent, 'key' | 'types'>`.

**[LOW] Verbatim duplicated css blocks in the two share buttons** — `shareIcon`/`shareCopied` in `CalendarShare.tsx:13-23` and `EventModal.tsx:17-26` are copy-pasted. Extract to a shared module (they already share `useShareLink`).

**[LOW] `role="button"` divs instead of `<button>`** — `GalleryCarousel.tsx:41`, `HomepageCarousel.tsx:22`. The manual `tabIndex`/`onKeyDown` reimplements what a native button gives free; an a11y-minded reviewer will ask why.

**[LOW] `ArtistsTable` keys rows by `name`** — `ArtistsTable.tsx:38`. Two artists with identical names (plausible in a 90-artist index) collide.

> **LOCKED (amended):** Project `{ _id, name }` in `ARTIST_NAMES_QUERY` and key rows by `_id` — name+index would trip the `react/no-array-index-key` rule we're enabling in the lint sweep.

**[LOW] `ThemeArtists` prop type quirk** — `ThemeArtists.tsx:13`: `Pick<Edition, ...> & { carousel?: Edition['carousel'] }`; `carousel` is already optional on `Edition`, so plain `Pick<..., 'carousel'>` says the same thing without the intersection.

**[LOW] Error boundaries:** `error.tsx` exists only under `(site)`; there's no `global-error.tsx`, and the root `not-found.tsx` renders without site chrome (no nav/footer).

> **LOCKED:** Add a minimal static `global-error.tsx` (inline styles — it renders when the root layout crashes, so no styled-system guarantees). `not-found.tsx` gets nav automatically once Navigation mounts in `(site)/layout.tsx` — no separate work.

Genuinely exemplary, one line each: the `DraftAware` → `CachedX` → `Shell` triplet is a textbook cache/boundary seam; `RailPlacement` making "upcoming but linked" a compile error (`EditionRailCard.tsx:16`) is exactly the right use of a union; the Ark-stays-private primitive layer (`ui/`) is consistently enforced.

## 2. Null/undefined handling

This is the strongest area — invariants are established once (total view-models in the mappers, `notFound()` at the route, `requireImageData` for schema-required assets, `definedFields` for `exactOptionalPropertyTypes`), and leaves receive non-nullable props. Only nits:

**[LOW] Two `todayIso!` assertions in `Calendar.tsx:182,223`.** `live` implies `todayIso !== null`, but the compiler can't see it. Restructure (`const clock = todayIso; const live = clock !== null && !ended`) so narrowing flows, or bind `past` computation inside a `todayIso !== null` branch. Trivially removable assertions are the kind reviewers grep for.

**[LOW-MEDIUM] Partners CTA renders a broken `mailto:` when settings are missing** — `partners/page.tsx:68`: `mailto:${contactEmail ?? ''}`. Also `ctaHref.startsWith('http')` on line 147 is dead — `ctaHref` is always a mailto. *(Verified; note `contactEmail` is already schema-required — `siteSettings.ts:48` — so the gap is TS-level: the settings doc itself is nullable.)*

> **LOCKED:** Hide the entire CTA section when `contactEmail` is missing; delete the dead `startsWith('http')` target/rel spread.

**[LOW] `VisitData` stays nullable by design** (`types/edition.ts:237`) — documented in `staticPages.ts:46`, fine, but it's the one page type that leaks `| null` into a renderer; a reviewer will ask why Visit didn't get the total-view-model treatment.

> **ACCEPTED, no action** — the design is documented at the source; leaving as-is.

## 3. TypeScript rigor

`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` all on; zero `any`, zero `@ts-ignore`, zero `console.*`, zero TODOs; discriminated unions (`CarouselSlide`, `CreditEntry`, `RailPlacement`, Dialog's `AccessibleName`), `satisfies` (`singleton.ts:21`, `EditionRailCard.tsx:24`), and typegen flowing query → `*_QUERY_RESULT` → mapper with no hand-written query types. This is the level the audit was looking for. Remaining casts:

**[MEDIUM] `staticPages-mappers.ts:158-159`**: `(page.amenities ?? null) as Amenity[] | null` and the `TransportRoute[]` cast. This is the one boundary where a schema edit (e.g. adding an icon option) flows to the renderer unchecked — the exact failure `carousel.ts`'s `asLayout` guard (line 12) was built to prevent. Fix: validate `icon` against the `IconKey` set the same way, and map fields explicitly instead of casting.

**[LOW] `privacy/page.tsx:36-37`**: `(value as { href?: string } | undefined)?.href`. Type the link mark via `PortableTextMarkComponentProps` with the generated link-mark type from `sanity.types.ts` instead of casting twice.

**[LOW] `api/revalidate/tag/route.ts:49`**: `(err as Error).message` — use `err instanceof Error ? err.message : String(err)`. Line 26's `parseBody<WebhookPayload>` is an assertion-by-generic, but the runtime `Array.isArray(body?.tags)` check on line 37 covers it — acceptable; a zod schema would make the intent explicit.

**[ACCEPTABLE, no action]** `slugs[i]!` (`editions-mappers.ts:72`) and `images[0]!` (`carousel.ts:52-56`) are length-proven and adjacent to their proofs; `Button.tsx:40`'s child cast is inherent to `asChild`. The `as CSSProperties` custom-property casts are the standard workaround.

## 4. Data layer & Sanity

**[HIGH] The sitemap emits URLs for upcoming editions, which 404.** `EDITION_YEARS_QUERY` (`queries.ts:206`) has no status filter; `sitemap.ts:40` builds an entry per year; but the page is gated `status != "upcoming"` (`queries.ts:256`), so while an upcoming edition exists — which is the steady state between editions — the sitemap advertises a 404 to crawlers. *(Verified, incl. all four `getAllEditionYears` call sites: sitemap, /editions, ArtistsBanner + /artists counts.)*

> **LOCKED:** `sitemap.ts` drops `getAllEditionYears()` and derives edition entries from `SITEMAP_QUERY.editions` — already status-filtered, already carries `_updatedAt`, so entries gain honest `lastModified` and the sitemap costs one fewer query. `EDITION_YEARS_QUERY` stays unfiltered for the count consumers (see the params/count item below).

**[MEDIUM] Event pages are missing from the sitemap.** `editions/[year]/events/[slug]` are canonical, prerendered URLs with their own metadata and OG images (ADR 0015), but `sitemap.ts` doesn't enumerate them even though `getAllEventParams()` already exists.

> **LOCKED:** Add them — map `getAllEventParams()` to entries, using the parent edition's `_updatedAt` (already in `SITEMAP_QUERY.editions`) as `lastModified`.

**[MEDIUM] `/editions` does N+1 full-edition fetches for card data** — `editions/page.tsx:36` fetches the complete `EDITION_BY_YEAR_QUERY` (events, credits, carousel, manifesto…) per year to render `theme/dateTape/heroImage`. The cache entries are shared with the edition pages, which is a real mitigation — but on a cold fill it's N heavy queries where one card-shaped projection would do.

> **LOCKED:** New `EDITION_CARDS_QUERY` projecting exactly the `EditionCardData` slice (`EditionCard.tsx:16` already declares it: year/theme/themeHighlight/dateTape-inputs/heroImage/thumbImage), status-filtered and year-desc ordered, plus a small mapper composing `dateTape`. `/editions` becomes one query and no longer consumes `getAllEditionYears`. Homepage's `EDITIONS_LIST_QUERY` stays separate — its rail cards are imageless, so merging would drag image payloads it doesn't need.

**[MEDIUM] `programCallout` is authored but never rendered.** The schema field (`edition.ts:222-251`) has full validation and editor-facing copy, but no query projects it and no component renders it.

> **OUT OF SCOPE (deferred):** The callout will become a banner linking to a dedicated program page, built as part of that future work — not part of this audit effort. No schema change or rendering work now.

**[MEDIUM] Dead query/data-layer exports.** `ARTISTS_QUERY` and `ARTIST_BY_SLUG_QUERY` (`queries.ts:176,193`) have no consumers (typegen dutifully generates their result types); `sanityFetchMetadata` and `sanityFetchStaticParams` (`live.ts:76,93`) are unused despite detailed doc comments claiming roles ("For use inside generateMetadata…") that the actual metadata paths don't use; `MasonryImage` (`types/edition.ts:168`) has no consumer; `surnameSortKey`/`bySurname` (`format-utils.ts:18-31`) are unused in `src` — and the backfill script carries its own copy of `surnameSortKey` (`scripts/sanity-backfill-artist-sortname.ts:24`) instead of importing it.

> **LOCKED (amended):** `ARTISTS_QUERY`/`ARTIST_BY_SLUG_QUERY` are **kept** — artist detail pages are planned work, not dead code. Delete `sanityFetchMetadata`, `sanityFetchStaticParams`, `MasonryImage`, and `bySurname`; keep `surnameSortKey` and have the backfill script import it instead of carrying its own copy.

**[MEDIUM] Presentation locations link to a route that doesn't exist** — `presentation.ts:59` sends editors to `/artists/${slug}`, but there is no artist detail route. Clicking it in the Presentation tool 404s.

> **OUT OF SCOPE (deferred):** The `/artists/{slug}` route is planned; the link stays pointed at the future route (known 404 in the Presentation tool until it ships).

**[LOW] Stale schema comment contradicts the current architecture** — `objects/event.ts:8-9`: "we don't deep-link a single one; sharing targets the filtered calendar view (ADR 0014)" — superseded by ADR 0015's per-event routes, which the same file's `slug` field exists for. Update the header.

**[LOW] Open redirect in draft-mode disable** — `api/draft-mode/disable/route.ts:10-11`: `new URL(to, url.origin)` with an absolute `?slug=https://evil.com` redirects off-site. No auth impact, but it's a free fix: accept only `to.startsWith('/') && !to.startsWith('//')`.

**[LOW] `Footer`'s year is module-scope** — `Footer.tsx:12`. Evaluated once per server process and baked into a cached render; both the stamp and © lag across a year boundary until the next revalidation. Bounded staleness, but computing inside `FooterShell` costs nothing.

Exemplary (one line each): the caching architecture is precisely the target — `defineLive` + `strict: true`, perspective resolved outside `'use cache'`, tag revalidation via webhook with `expire: 0`, `<SanityLive>` for open tabs; request dedup falls out of the shared `'use cache'` fetchers (settings fetched by Footer and edition body share one entry); env vars fail fast in `env.ts`/`token.ts` with `server-only` on the token; schema validation quality (`requiredWhenLive`, cross-field date checks, `isSubstringOf`, `ArtistEditionsField` reverse-reference panel) is well beyond typical.

## 5. Panda CSS

**[MEDIUM] `strictTokens` is not on, and isn't close.** ~140 raw px literals and 13 `rgba()`/gradient values across the `.recipe.ts` files (e.g. `Hero.recipe.ts:47,72`, `EditionTheme.recipe.ts:39`, `not-found.tsx:21`). Most are legitimately one-off art direction (scrims, masks, shadows), so I'd recommend **against** flipping it wholesale — but a reviewer will ask, so: tokenize the recurring shadows (the `0 30px 80px…` card/tape shadows appear in several recipes) and the brand-canvas rgba `rgba(14,11,16,…)` scrims (that's the `canvas` color hand-inlined), then state the remaining policy in the preset's comment block.

**[LOW] The shimmer/skeleton mechanism exists twice** — `components/skeleton.ts` and `loading.recipe.ts:44` build the same sweep with slightly different alphas (0.06 vs 0.03); the comment in `skeleton.ts` even cross-references the bones. Fold into one layer style.

**[LOW] The hairline-gradient-border mask trick is duplicated** — `Calendar.recipe.ts:191` and `GalleryCarousel.recipe.ts:52-53` carry the same `WebkitMask: linear-gradient(#fff 0 0) content-box…` incantation. Extract a shared utility.

No `staticCss` config (nothing to prune), `jsxStyleProps: 'none'` and `preflight: false` are documented decisions, recipe co-location (`Component.recipe.ts`) is uniform. Token architecture (single-anchor OKLCH gray ramp, role tokens, animation styles) is a portfolio piece.

## 6. App Router practices

**[LOW] `generateStaticParams` prerenders a 404 for upcoming editions** — `getAllEditionYearParams()` includes the upcoming year; the page and the OG image route then render nothing useful for it.

> **LOCKED:** `EDITION_YEARS_QUERY` projects `{ year, status }`; `getAllEditionYearParams` filters out upcoming (no more prerendered 404s); the banner/artists "N editions" counts keep current behavior (length of the full list, upcoming included) — one query serves both, each consumer explicit about which view it wants.

**[LOW] Draft-mode fallbacks are `null` on most pages** (`fallback={null}` in home/about/press/privacy/partners) while `/visit` passes a real shell and `/editions` passes `EditionsListShell`. Only editors see this, but the inconsistency is visible in the code. The edition route's `loading.tsx` skeleton is the model.

Otherwise this area is a showcase: partial prerender preserved by putting `useSearchParams` behind a Suspense boundary inside the cached body (`edition-content.tsx:91`), `Promise.all([props.params, getDynamicFetchOptions()])` in every `generateMetadata`, shared static-param enumerations between page and OG routes, honest `lastModified` in the sitemap, `sizes` on every image, LQIP-driven blur placeholders, fonts via `next/font`, webhook and draft-mode as route handlers (no misused server actions), self-contained OG rendering with the `asciiFold` tradeoff documented.

## 7. Public-repo polish

**[HIGH] A stale `package-lock.json` is tracked alongside `pnpm-lock.yaml`.** 39KB, last touched February, in a repo whose README says "Package manager is pnpm." This is the single loudest carelessness signal in the repo — it's the first thing a reviewer sees in the file listing. Delete it and add it to `.gitignore`.

**[MEDIUM] CI runs Node 22; `.nvmrc` and README say 24** — `.github/workflows/ci.yml:27,54` vs `.nvmrc`. Use `node-version-file: .nvmrc` in `setup-node` so it can't drift again.

**[MEDIUM] CI injects a secret nothing uses** — `NEXT_PUBLIC_BLOB_URL` (`ci.yml:47-48`) with a comment about "the legacy 2021 hero served from Blob"; zero references anywhere in the repo (2021 was migrated to Sanity per ZSB-20). Remove the env line and the comment.

**[MEDIUM] Three layers of dead lint-suppression config.** (a) `eslint.config.mjs:41-48` disables `react/no-array-index-key` for `MediaKit.tsx` and `Program.tsx` — files that no longer exist; (b) the rule isn't enabled in the base config at all (verified via `eslint --print-config`), so the whole override is a no-op; (c) ~16 `// biome-ignore lint/…` comments (`about/page.tsx:79`, `Credits.tsx` ×6, `VisitSection.tsx`, `partners/page.tsx`, `Lightbox.tsx` ×3, `JsonLd.tsx:9`…) are inert because `biome.json` has `"linter": { "enabled": false }`.

> **LOCKED:** Delete the stale per-file override and all inert biome-ignore comments. Enable the ESLint equivalents (`react/no-array-index-key`, `jsx-a11y/no-static-element-interactions`, `react/no-danger`); prefer *refactoring* violations away (e.g. key by content where items have stable identity); only where the pattern is legitimately unavoidable (truly static positional lists, JSON-LD's `dangerouslySetInnerHTML`) convert to `eslint-disable-next-line` keeping the original justification.

**[LOW] Retired ADR describes the live code** — `docs/adr/retired/0003-uselightbox-returns-jsx.md` argues *for* the fused `useLightbox` pattern, and `Lightbox.tsx:19` still implements exactly that. *(Verified: 3 live consumers — GalleryCarousel, HomepageCarousel, MediaKitStrip.)*

> **LOCKED:** The code is the drift — the hook-returns-JSX shape is retired for real. Refactor `Lightbox` to a fully controlled component: callers hold `useState<number | null>` (index = open at that image, `null` = closed) and render `<Lightbox images={…} index={…} onClose={…} onIndexChange={…} />`. Wrap-around/keyboard/swipe math stays *inside* the component (nav emits `onIndexChange`), so the 5-caller boilerplate ADR 0003 feared doesn't re-scatter. Add a one-line supersession note to the retired ADR.

**[LOW] `gsap` (full library) is a dependency for one elastic hover** — `PartnerBadge.tsx:14-29`. Two `gsap.to(scale)` calls that a CSS transition with a springy cubic-bezier (or a `linear()` easing) replicates. Cutting it removes a runtime dep and shrinks the client bundle of every page that renders the badge (home, partners, footer). `styled-components` looks unused but is Sanity Studio's peer dependency — worth a one-line comment in `package.json` reviewers can't misread.

> **LOCKED:** Replace with a CSS `linear()` spring easing (cubic-bezier fallback); drop the `gsap` dependency; user verifies the hover feel in the browser before merge. The `styled-components` peer-dep note goes in the README's CMS bullet, not `package.json` (a `"//"` key was rejected as hacky; removal is impossible — verified `sanity@5.28`, `@sanity/ui@3.2`, `next-sanity@13`, `@sanity/vision` all still declare it as a peer dependency).

**[LOW] `SANITY_API_WRITE_TOKEN` appears in `.env.example` but is only used by `scripts/`** — a comment in the example file distinguishing app vars from migration-script vars would prevent someone provisioning a write token for the app.

README, `.env.example`, CI structure (secret-free fast gate + build/e2e), pre-commit formatting hook, docs system (CONTEXT/cms/testing/ADRs/journal) are all genuinely strong — no padding needed; they're done.

---

## PR plan (locked 2026-07-07)

Ordered: hygiene lands first, lint rules land before the components they'd police, risk concentrates late. Each PR is independently revertable.

1. **Repo hygiene** — delete tracked `package-lock.json` + gitignore it; CI `setup-node` via `node-version-file: .nvmrc`; remove `NEXT_PUBLIC_BLOB_URL` env + comment from CI; `.env.example` comment splitting app vars from script-only vars (`SANITY_API_WRITE_TOKEN`); README note (CMS bullet) that `styled-components` is only the embedded Studio's peer dep; fix the stale `objects/event.ts` header comment (ADR 0014 → 0015). *(Discovered during implementation: `.env.example` was never actually tracked — the `.env*` gitignore pattern swallowed it, so the README referenced a file the remote didn't have. Fixed with `!.env.example` + `git add`.)*
2. **Lint sweep** — delete the stale `react/no-array-index-key` per-file override and all ~16 inert `biome-ignore` comments; enable `react/no-array-index-key`, `jsx-a11y/no-static-element-interactions`, `react/no-danger`; refactor violations where items have stable identity, `eslint-disable-next-line` (with the original justification) only where the pattern is unavoidable. Includes: `ARTIST_NAMES_QUERY` → `{ _id, name }` and `ArtistsTable` keyed by `_id`; `GalleryCarousel`/`HomepageCarousel` `role="button"` divs → native `<button>`.
3. **Navigation** — mount `<Navigation />` once in `(site)/layout.tsx`; delete `about/artists/editions` segment layouts and the 5 inline mounts; server shell + client `NavLinks` (`usePathname` → `aria-current`) + `MobileMenu` (state/Dialog/Swap); logo always links `/`; add minimal static `global-error.tsx`.
4. **SEO / data layer** — sitemap edition entries derived from `SITEMAP_QUERY.editions` (drops `getAllEditionYears` there, gains `lastModified`); add event-page entries via `getAllEventParams()` with parent edition `_updatedAt`; `EDITION_YEARS_QUERY` → `{ year, status }`, `getAllEditionYearParams` filters upcoming (counts unchanged); new `EDITION_CARDS_QUERY` + mapper for `/editions` (kills the N+1). `pnpm typegen` after.
5. **Type rigor & dead code** — delete `sanityFetchMetadata`, `sanityFetchStaticParams`, `MasonryImage`, `bySurname` (artist queries stay — detail pages are planned); backfill script imports `surnameSortKey`; `staticPages-mappers` `Amenity`/`TransportRoute` casts → `asLayout`-style runtime guards; privacy link mark typed via `PortableTextMarkComponentProps`; revalidate route `err instanceof Error`; remove the two `todayIso!` via narrowing; `TypeChips` param → `Pick<CalendarListEvent, …>`; `ThemeArtists` → plain `Pick`.
6. **Lightbox** — refactor to fully controlled component (callers hold `index | null`; wrap-around/keyboard/swipe stays inside, emitting `onIndexChange`); supersession note on retired ADR 0003.
7. **UI polish** — partners: hide CTA section without `contactEmail`, delete dead `startsWith('http')` spread; footer year computed in `FooterShell`; draft-mode disable open-redirect guard (`startsWith('/') && !startsWith('//')`); share-button css dedup (`CalendarShare`/`EventModal`); `PartnerBadge` gsap → CSS `linear()` spring, drop the `gsap` dependency (user verifies hover feel before merge).
8. **Panda tokens** — tokenize the recurring card/tape shadows and `rgba(14,11,16,…)` canvas scrims; state the raw-value policy in the preset comment block; fold the two skeleton/shimmer mechanisms into one layer style; extract the shared hairline-gradient-border mask utility. `pnpm panda codegen` after.

Deliberately **not** in any PR: `strictTokens` flip (recommended against), `programCallout` + Presentation artist links (deferred to the program-page / artist-pages work), `VisitData` nullability (accepted), the audit's "acceptable, no action" §3 items.

## Top 10 by impression-per-effort

*(Historical ranking from the original audit — superseded by the PR plan above where they differ: artist queries are kept, `programCallout` is deferred, Navigation/Lightbox scopes were widened.)*

1. **Delete the tracked `package-lock.json`** (+ gitignore). One minute; removes the loudest red flag.
2. **Fix the sitemap advertising 404s for upcoming editions** — derive edition entries from `SITEMAP_QUERY` (correctness + SEO, ~10 lines).
3. **Sweep the dead lint config**: eslint override for deleted files + all inert `biome-ignore` comments.
4. **Remove the unused CI secret `NEXT_PUBLIC_BLOB_URL`** and pin CI node via `node-version-file: .nvmrc`.
5. **Delete dead exports**: `ARTISTS_QUERY`, `ARTIST_BY_SLUG_QUERY`, `sanityFetchMetadata`, `sanityFetchStaticParams`, `MasonryImage`, `surnameSortKey`/`bySurname` (import the last one into the script instead).
6. **Split `Navigation` so only the mobile menu is client**, and standardize where Navigation mounts (fixes the press/partners cached-nav oddity in the same pass).
7. **Resolve `programCallout`**: render it or migrate it away — authored-but-invisible content is the worst kind of schema drift.
8. **Replace the `Amenity[]`/`TransportRoute[]` casts with an `asLayout`-style runtime guard** — the one typegen boundary currently on trust.
9. **Remove the two `todayIso!` assertions** via narrowing; with that, the repo's only non-proven assertions disappear.
10. **Drop `gsap` for a CSS spring** on `PartnerBadge` — a dependency-hygiene story you can tell in the PR description.

Smaller items worth batching into a "polish" commit: share-button css dedup, `TypeChips` prop type, `mailto:` guard on partners, open-redirect guard on draft-mode disable, footer year, presentation artist location, stale `event.ts` schema comment, retired-ADR-0003 status, event pages in the sitemap (or a comment), `ArtistsTable` keys.
