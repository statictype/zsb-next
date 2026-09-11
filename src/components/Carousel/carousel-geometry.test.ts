import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  closestIndex,
  isLoopable,
  loopStops,
  nearestTarget,
  wheelStepLimit,
  wheelStepper,
  wrapIndex,
} from '@/components/Carousel/carousel-geometry'

describe('wrapIndex', () => {
  it('wraps past either end', () => {
    expect(wrapIndex(-1, 5)).toBe(4)
    expect(wrapIndex(5, 5)).toBe(0)
    expect(wrapIndex(7, 5)).toBe(2)
  })
})

describe('closestIndex', () => {
  const stops = [0, 3, 6, 9]

  it('picks the nearest stop', () => {
    expect(closestIndex(stops, 4, 12)).toBe(1)
    expect(closestIndex(stops, 5, 12)).toBe(2)
  })

  it('measures distance the short way round the loop', () => {
    expect(closestIndex(stops, 11.5, 12)).toBe(0)
  })

  it('does not wrap when the wrap length is infinite', () => {
    expect(closestIndex(stops, 11.5, Number.POSITIVE_INFINITY)).toBe(3)
  })
})

describe('nearestTarget', () => {
  it('keeps a target within half the loop', () => {
    expect(nearestTarget(2, 0, 6)).toBe(2)
  })

  it('goes backwards past the start instead of forwards across the loop', () => {
    expect(nearestTarget(5, 0, 6)).toBe(-1)
  })

  it('goes forwards past the end instead of backwards across the loop', () => {
    expect(nearestTarget(0, 5, 6)).toBe(6)
  })
})

describe('isLoopable', () => {
  it('loops only when a wrapped slide re-enters outside the frame', () => {
    expect(isLoopable({ loopWidth: 1800, frameWidth: 1200, widest: 600 })).toBe(true)
    expect(isLoopable({ loopWidth: 1799, frameWidth: 1200, widest: 600 })).toBe(false)
  })
})

describe('loopStops', () => {
  it('rests each slide at the inset, the first at time zero', () => {
    const stops = loopStops({
      itemStarts: [40, 540, 1040],
      owners: [0, 1, 2],
      offsets: [0, 0, 0],
      inset: 40,
      pixelsPerSecond: 100,
    })
    expect([...stops]).toEqual([0, 5, 10])
  })

  it('adds a stop for every image inside a slide', () => {
    const stops = loopStops({
      itemStarts: [0, 900],
      owners: [0, 0, 0, 1],
      offsets: [0, 300, 600, 0],
      inset: 0,
      pixelsPerSecond: 100,
    })
    expect([...stops]).toEqual([0, 3, 6, 9])
  })
})

describe('wheelStepLimit', () => {
  it('allows one step per two extra pages, up to the threshold count', () => {
    expect(wheelStepLimit(2)).toBe(1)
    expect(wheelStepLimit(5)).toBe(2)
    expect(wheelStepLimit(20)).toBe(3)
  })
})

describe('wheelStepper', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('commits one step per threshold crossed within a gesture', () => {
    const commit = vi.fn()
    const stepper = wheelStepper(
      () => 4,
      commit,
      () => 3,
    )
    stepper.push(200)
    expect(commit).not.toHaveBeenCalled()
    stepper.push(200)
    expect(commit).toHaveBeenLastCalledWith(5)
    stepper.push(800)
    expect(commit).toHaveBeenLastCalledWith(6)
    expect(commit).toHaveBeenCalledTimes(2)
  })

  it('caps the steps and follows the scroll direction', () => {
    const commit = vi.fn()
    const stepper = wheelStepper(
      () => 4,
      commit,
      () => 1,
    )
    stepper.push(-3000)
    expect(commit).toHaveBeenCalledOnce()
    expect(commit).toHaveBeenCalledWith(3)
  })

  it('starts a new gesture from the current index after a pause', () => {
    let current = 0
    const commit = vi.fn((index: number) => {
      current = index
    })
    const stepper = wheelStepper(
      () => current,
      commit,
      () => 3,
    )
    stepper.push(400)
    vi.advanceTimersByTime(200)
    stepper.push(400)
    expect(commit.mock.calls).toEqual([[1], [2]])
  })
})
