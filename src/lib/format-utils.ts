// Assumes the last token is the surname. Particles ("van der") and double surnames
// are overridden by `sortName` in Sanity.
export function surnameSortKey(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length < 2) return name.trim()
  const last = parts[parts.length - 1]
  const rest = parts.slice(0, -1).join(' ')
  return `${last} ${rest}`
}
