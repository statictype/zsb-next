import { describe, expect, it } from 'vitest'
import { definedFields } from '@/lib/defined-fields'

describe('definedFields', () => {
  it('strips null and undefined keys', () => {
    expect(definedFields({ a: 1, b: null, c: undefined })).toEqual({ a: 1 })
  })

  it('keeps falsy-but-defined values ("", 0, false, [])', () => {
    expect(definedFields({ s: '', n: 0, b: false, arr: [] as number[] })).toEqual({
      s: '',
      n: 0,
      b: false,
      arr: [],
    })
  })

  it('returns a new object, never mutates the input', () => {
    const input = { a: 1, b: undefined }
    const out = definedFields(input)
    expect(out).not.toBe(input)
    expect(input).toEqual({ a: 1, b: undefined })
  })
})
