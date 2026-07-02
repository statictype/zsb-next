// Selection state for one filter dimension (venue, type): a multi-select
// that's all-on by default. States are:
//   null      → every option selected (the default; serialized as no param so
//               the URL stays clean and is robust to the option list changing)
//   string[]  → exactly these slugs selected (an empty array means none — the
//               calendar shows nothing for that filter)
export type FilterSelection = string[] | null

export function isSelected(selection: FilterSelection, slug: string): boolean {
  return selection === null || selection.includes(slug)
}

// Toggle one option, given every available slug in canonical order. Collapses
// to `null` once everything ends up selected, so the default state always
// serializes to a clean URL. The result keeps the canonical order and drops
// any stale slugs no longer in the filter.
export function toggleSelection(
  selection: FilterSelection,
  slug: string,
  allSlugs: string[],
): FilterSelection {
  const set = new Set(selection === null ? allSlugs : selection)
  if (set.has(slug)) set.delete(slug)
  else set.add(slug)
  const next = allSlugs.filter((s) => set.has(s))
  return next.length === allSlugs.length ? null : next
}
