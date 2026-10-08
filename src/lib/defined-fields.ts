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
