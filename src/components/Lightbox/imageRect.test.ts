import { describe, expect, it } from 'vitest'
import { containRect } from '@/components/Lightbox/imageRect'

const container = { left: 100, top: 50, width: 800, height: 400 }

describe('containRect', () => {
  it('letterboxes an image wider than the container ratio', () => {
    expect(containRect({ width: 1600, height: 400 }, container)).toEqual({
      left: 100,
      top: 150,
      width: 800,
      height: 200,
    })
  })

  it('pillarboxes an image taller than the container ratio', () => {
    expect(containRect({ width: 400, height: 800 }, container)).toEqual({
      left: 400,
      top: 50,
      width: 200,
      height: 400,
    })
  })

  it('falls back to the container when the image has no intrinsic size', () => {
    expect(containRect({ width: 0, height: 0 }, container)).toEqual(container)
  })
})
