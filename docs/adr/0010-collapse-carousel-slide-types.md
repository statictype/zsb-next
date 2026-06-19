# Collapse the five carousel slide types into one with a layout enum

The current schema has five separate slide types — `slideFull`, `slideDuo`, `slideFeaturedPortrait`, `slideTrio`, `slideFeaturedStack` — each defined as its own `defineType` with the same shape (an array of N `carouselImage` items). The only difference is the layout name and the required image count.

We're collapsing these into one `carouselSlide` object with a `layout` enum (`'full' | 'duo' | 'featured-portrait' | 'trio' | 'featured-stack'`) and a length-validated `images` array whose required count is derived from the layout choice. The schema migration also relabels the rendered preview so the layout shows clearly in the array editor.

Why:

- **The five types model one concept.** A carousel slide is "a layout plus 1–3 images." Splitting the layout dimension into separate schema types treats each layout as a different *kind* of content, which it isn't.
- **The Studio "add to array" menu currently shows five options** that look almost identical in the dropdown. Editors have to remember which one is which; the preview can't help because the layouts aren't visually distinguishable from a thumbnail. One type with a layout selector is a single choice that's actually meaningful (and the selector can render labels with layout-specific icons or descriptions).
- **One schema type → one preview component → consistent thumbnails.** Today the previews are similar but defined in five places; any change to the preview shape has to be repeated. Collapsing means one definition.
- **Renderer side already discriminates on `layout`.** `src/sanity/lib/editions.ts` maps `_type → layout` via `SLIDE_LAYOUTS`; the runtime `CarouselSlide` union is keyed on `layout`, not `_type`. The five-type schema is a layer of indirection the runtime doesn't ask for.
- **Length validation moves from the schema definition to a single conditional** that reads `images.length` against the layout's required count. Same outcome, half the code.

Considered alternatives:

- **Keep the five types as-is.** Costs nothing right now, costs every edit forever. Skipped.
- **Keep five types but extract a shared `slideBody` object reused across them.** Reduces duplication slightly, leaves the editor-side "five identical options" problem unsolved. Skipped — fixes the wrong half.
- **Polymorphic union with `_type` discriminator.** Identical structurally to the current five-type design, just named differently. No editor improvement. Skipped.

Migration: write one `defineMigration` script that walks every `edition.carousel[]` item, derives the new `layout` from `_type`, renames `_type` to `carouselSlide`, leaves `images` untouched. Dry-run first, verify, then apply.

Reversibility: moderate. The collapsed shape is the more general one; expanding back to five types would be a second migration but trivially mechanical. The runtime `CarouselSlide` union doesn't change either way.
