# Absence handling refactor

Branch: `absence-handling`.

Resolve absence once, at the mapper boundary. Domain types never carry `| null`.
Defaults are applied once in the mapper, never re-applied with `??` in
components. Call sites never pass `undefined` to custom-component props.

This is not a rewrite of the domain layer. `src/types/edition.ts` and
`src/lib/defined-fields.ts` already implement most of these rules. The work is
bounded: one null-mirror domain type (`VisitData`), ~74 props carrying a
mechanical `| undefined`, two optional arrays, and a set of `??` re-defaults in
components. The principles below become a lint guard so it does not regress.

## Field rules

- **Display strings** (captions, labels, titles, descriptions): required
  `string`, default `''` in the mapper. Never optional.
- **Arrays**: required `T[]`, default `[]` in the mapper. Consumers iterate; an
  empty section is a `.length > 0` guard, not an `undefined` check. An array
  stays optional only if a consumer branches on `undefined` vs `[]` and does
  something other than "render nothing." No array in this codebase qualifies.
- **URLs**: optional `?: string`. Never a sentinel (`'#'`, homepage, `''`). A
  link that goes somewhere wrong is worse than no link.
- **Fallback-chain fields** (`ogImage` → hero): keep optional, document the
  chain.
- **Absence-branching fields** (`startTime`, where "no time" ≠ "00:00"): keep
  optional, justify in a comment.
- Every remaining `?:` must be earned: some consumer branches on absence. If
  every consumer defaults it, make it required and default in the mapper.

## Truly omit, never pass `undefined`

- Optional means the key is absent, never set to `undefined`. In mappers use
  conditional spreads or `definedFields` (`src/lib/defined-fields.ts`).
- Custom-component props: never `prop={x ? y : undefined}`. Both arms of a
  branch resolve to real values — `tone={isAnnounced ? 'muted' : 'highlight'}`.
  The `undefined` arm is replaced by the value the component would have fallen
  through to. For Panda variant props that value is the recipe's
  `defaultVariants`, not a component literal — read it from the recipe.
- Callers who do not branch omit the prop entirely and get the default.

## Carve-outs — `undefined` and `| null` are correct here

The sweep must not touch these.

- **React intrinsics**: `aria-*`, `data-*`, `style`. `x={cond ? val : undefined}`
  is idiomatic — `undefined` omits the attribute; a default would change DOM
  semantics.
- **Framework-typed values**: `usePathname(): string | null`, hydration-gated
  hooks (`useTodayIso`).
- **Internal React state / refs**: `useState<number | null>`, drag/axis
  sentinels in Carousel and Lightbox.
- **Absence-branching returns** ("none"/"not found"): `findEvent`,
  `derive-editions`, `editionWindow`, `splitFirstMatch`, `getHeroUpcoming`.
- **Raw-Sanity-facing helper inputs inside the data/mapping layer**:
  `edition-dates` date params, `venues` tree internals. They consume raw
  projections before normalization; `| null` is correct there.

## The `| undefined` triage — compiler-driven

74 props carry an explicit `| undefined`. It splits two ways: mechanical noise
on variant/config props (delete it) vs earned pass-through of a genuinely
optional domain field (keep it). The type checker partitions them; do not
eyeball.

Per prop:

1. Strip `| undefined` → `?: T`.
2. Add a component/recipe default if one is sensible.
3. Run `pnpm typecheck`. Each error is one decision:
   - Variant call site branching to `undefined` → rewrite to the real value.
   - Domain field passed straight through (`event.ticketUrl`) → earned; restore
     `?: T | undefined`. First ask: can the mapper give this field a required
     default (string → `''`, array → `[]`)? If yes, fix the mapper and the prop
     becomes plain `?: T`. Only fields whose absence is semantically real
     (`startTime`, `ticketUrl`, `image`, `blurDataURL`) stay earned.
4. If step 3 prints nothing, the `| undefined` was pure noise. Done, safely.

## Type structure (already in place; preserve)

- Discriminated unions over boolean soup (`CreditEntry` with `logo?: never`).
- Preserve `satisfies` clauses and `href?: never`-style constraints.
- Names match shapes: plural for arrays, singular for scalars.
- Comments explain why (fallback chains, ADR/ticket refs), not what.
- Derived fields stamped once in the data layer; flag components re-deriving.

## Concrete work items

### 1. `VisitData` — the only null-mirror domain type

Current: every field `?: T | null`; `mapVisit` applies `?? null`;
`VisitSection` re-applies `?? ''`/`?? []`. Absence resolved twice, stored
nowhere.

Target type (`src/types/edition.ts`):

```ts
export interface VisitData {
  venueName: string[]
  street: string
  city: string
  hoursLines: string[]
  amenities: Amenity[]
  transport: TransportRoute[]
  mapsUrl?: string   // URL, earned — VisitSection branches on presence
  image?: ImageData  // earned — Figure absorbs absence
}
```

- `mapVisit`: drop the `if (!page) return {}` special case; uniform
  `page.x ?? default`; conditional-spread `mapsUrl`/`image`.
- `mapAmenities` / `mapTransport`: return `[]`, not `| null`.
- `mapVisit`: narrow the param to non-null `VisitPage` (it is only ever called
  after `getVisitPage`'s `if (!raw) return null`).
- `VisitSection`: destructure straight from props; delete the `= {}` default and
  all `??`. `mapsUrl` keeps `{mapsUrl ? <a> : null}`. `image` → `<Figure>`.

`VisitPageData.faq` is already required `FaqEntry[]` (no type change); the only
faq edit is deleting the consumer `?? []` in item 2. Deletes ~14 `??`/`?? null`
sites total.

### 2. Visit route — honor the notFound contract, drop the empty fallback

Singletons are always defined; the empty-render path is a defensive anomaly.

- `visit/page.tsx`: `fallback={<VisitSection />}` → `fallback={null}`, matching
  every sibling page.
- `CachedVisit`: `if (!page) notFound()`, then `<VisitSection {...page.section} />`,
  `page.faq`, zero `??`.

**Site-wide principle:** `DraftAware` fallbacks are `null` or a dedicated
skeleton — never a data component rendered empty. Required view-models therefore
never need an empty-tolerant shape.

### 3. `events` and `carousel` on `Edition` — required `[]`

Every consumer already does `edition.events ?? []`; none branch on `undefined`.
"Has a program" is the separate `hasProgram` boolean; "program, no events yet"
is `hasProgram && events.length === 0`.

- `Edition.events: CalendarEvent[]`, `Edition.carousel: CarouselSlide[]`.
- `mapEvents` / `mapCarousel`: drop `return undefined`; return `[]`.
- Consumers: delete 6 `?? []`/`?? null`. `findEvent` → `edition?.events.find(...)`.
- `carousel` section guard: `{carousel.length > 0 && <GalleryCarousel .../>}`.

### 4. The 74 `| undefined` props

Apply the compiler-driven triage. Mechanical bulk is variant props (`size`,
`tone`, `layout`, `titleLevel`) and `className?: string | undefined`. `className`
on custom components: `?: string`, call sites pass `''` not `undefined`.

### 5. `Figure.image` — drop `| null`

`image: ImageData | null | undefined` → `image?: ImageData`. Keep `undefined`
(Figure is the generic absorber); domain images are never `null` post-refactor.

### 6. `PressAppearanceForJsonLd` (optional / deferred)

Consume the mapped `PressAppearance` domain type instead of the raw-nullable
mirror; keep only the url-presence branch.

## Do not

- Do not weaken discriminated unions into optional-field bags.
- Do not introduce sentinel values for absence.
- Do not inline mapper defaults into components.
- Do not add `| null` to domain types to mirror Sanity.
- Do not "fix" the carve-outs above.

## Enforcement (guard against regression)

Two rules. Type-aware linting is enabled (`projectService: true`).

1. **`@typescript-eslint/no-unnecessary-condition: error`.** Type-driven, zero
   false positives. Once a field is non-null, `field ?? ''` and `field?.x` on it
   are provably dead and fire. Catches the `??`/optional-chain half of the
   refactor and every future dead default. Measured blast radius before the
   refactor: ~29 firings across 13 files, all fixable — mostly mapper
   over-defense (raw fields the generated types already type non-null) plus a
   few genuinely-dead conditions.
2. **`no-restricted-syntax` banning `TSNullKeyword`, scoped to `src/types/**`.**
   Cheap, syntactic. Guards against a new nullable domain field that rule 1
   can't yet call "unnecessary."

Rule 1 does **not** catch mechanical `| undefined` on props (it can't tell
disease from earned pass-through). That stays the one-time compiler-driven
triage plus review.

## Sequencing

One PR, all commits on `absence-handling`. Type-aware lint is enabled from the
start so `pnpm typecheck` + `pnpm lint` form a two-oracle worklist: `tsc`
enumerates call sites that break when a `| undefined`/`| null` is dropped; the
lint rule flags every `??`/`?.` that a now-non-null field renders dead. "Lint +
typecheck green" is the definition of "this type change left no stale default."

Each commit stays green:

1. Enable `no-unnecessary-condition` + `projectService`; clear the ~29
   pre-existing firings. (Before any type change, so later red is
   refactor-introduced, not noise.)
2. `VisitData` slice (type + `mapVisit`/`mapAmenities`/`mapTransport` +
   `VisitSection` + visit route `notFound`/`fallback={null}`). **Add the
   `src/types` `| null` ban in this commit** — safe once the last null-mirror is
   gone; earlier it would fail on `VisitData`'s own nulls.
3. `events` / `carousel` → required `[]` (`mapEvents`/`mapCarousel` + consumers +
   `findEvent`).
4. `Figure.image` drops `| null`.
5. The 74 `| undefined` props — compiler-driven triage, in reviewable batches
   (e.g. by directory or component cluster).
6. `PressAppearanceForJsonLd` (optional / deferred).
