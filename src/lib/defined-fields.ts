// Build an object with genuinely-optional fields without the
// `...(x ? { x } : {})` spread dance that `exactOptionalPropertyTypes` forces.
// Pass every field as a flat literal — including the nullable ones straight from
// a Sanity projection — and `definedFields` drops the keys whose value is `null`
// or `undefined`, narrowing the type so the survivors are present. Falsy-but-real
// values (`''`, `0`, `false`, `[]`) are kept: this is for *semantically optional*
// fields (an event's image, a ticket URL), not for the data layer's soft-fail
// normalization (strings → `''`, arrays → `[]`), which the mappers do directly.

type IsNullable<V> = undefined extends V ? true : null extends V ? true : false

export type DefinedFields<T> = {
  [K in keyof T as IsNullable<T[K]> extends true ? never : K]: T[K]
} & {
  [K in keyof T as IsNullable<T[K]> extends true ? K : never]?: Exclude<T[K], null | undefined>
}

export function definedFields<T extends object>(obj: T): DefinedFields<T> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value != null) out[key] = value
  }
  return out as DefinedFields<T>
}
