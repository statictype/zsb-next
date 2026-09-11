export const WHEEL_STEP_PX = [340, 1100, 2600]
const WHEEL_GESTURE_MS = 140

export const wrapIndex = (index: number, length: number) => ((index % length) + length) % length

export function closestIndex(values: ArrayLike<number>, value: number, wrap: number) {
  let i = values.length
  let closest = Number.POSITIVE_INFINITY
  let index = 0
  while (i--) {
    let distance = Math.abs((values[i] ?? 0) - value)
    if (distance > wrap / 2) distance = wrap - distance
    if (distance < closest) {
      closest = distance
      index = i
    }
  }
  return index
}

export function nearestTarget(target: number, current: number, length: number) {
  if (Math.abs(target - current) <= length / 2) return target
  return target + (target > current ? -length : length)
}

export function isLoopable({
  loopWidth,
  frameWidth,
  widest,
}: {
  loopWidth: number
  frameWidth: number
  widest: number
}) {
  return loopWidth >= frameWidth + widest
}

export function loopStops({
  itemStarts,
  owners,
  offsets,
  inset,
  pixelsPerSecond,
}: {
  itemStarts: ArrayLike<number>
  owners: number[]
  offsets: number[]
  inset: number
  pixelsPerSecond: number
}) {
  const stops = new Float64Array(owners.length)
  owners.forEach((owner, page) => {
    stops[page] = ((itemStarts[owner] ?? 0) + (offsets[page] ?? 0) - inset) / pixelsPerSecond
  })
  return stops
}

export const wheelStepLimit = (pageCount: number) =>
  Math.min(WHEEL_STEP_PX.length, Math.max(1, Math.floor((pageCount - 1) / 2)))

export function wheelStepper(
  begin: () => number,
  commit: (index: number) => void,
  maxSteps: () => number,
) {
  let timer: ReturnType<typeof setTimeout> | undefined
  let base = 0
  let accumulated = 0
  let issued = 0
  let active = false
  return {
    push(delta: number) {
      if (!active) {
        active = true
        accumulated = 0
        issued = 0
        base = begin()
      }
      accumulated += delta
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        active = false
      }, WHEEL_GESTURE_MS)
      const magnitude = Math.abs(accumulated)
      const crossed = WHEEL_STEP_PX.filter((threshold) => magnitude >= threshold).length
      if (crossed === 0) return
      const steps = Math.min(crossed, maxSteps()) * Math.sign(accumulated)
      if (steps === issued) return
      issued = steps
      commit(base + steps)
    },
    dispose() {
      if (timer) clearTimeout(timer)
    },
  }
}
