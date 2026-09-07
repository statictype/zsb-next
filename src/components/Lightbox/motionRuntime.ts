export interface MotionRuntime {
  gsap: typeof import('gsap').gsap
  Flip: typeof import('gsap/Flip').Flip
}

let pending: Promise<MotionRuntime> | null = null

export function loadMotionRuntime(): Promise<MotionRuntime> {
  pending ??= Promise.all([import('gsap'), import('gsap/Flip')]).then(([core, flipModule]) => {
    const { gsap } = core
    const { Flip } = flipModule
    gsap.registerPlugin(Flip)
    return { gsap, Flip }
  })
  return pending
}
