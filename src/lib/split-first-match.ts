export interface FirstMatchParts {
  before: string
  match: string
  after: string
}

/** Split a string around the first exact, case-sensitive match. */
export function splitFirstMatch(value: string, match: string): FirstMatchParts | null {
  if (match === '') return null

  const index = value.indexOf(match)
  if (index === -1) return null

  return {
    before: value.slice(0, index),
    match,
    after: value.slice(index + match.length),
  }
}
