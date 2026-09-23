import { useEffect, useId, useSyncExternalStore } from 'react'

const pending = new Set<string>()
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useReportPending(isPending: boolean) {
  const id = useId()
  useEffect(() => {
    if (!isPending) return
    pending.add(id)
    emit()
    return () => {
      pending.delete(id)
      emit()
    }
  }, [id, isPending])
}

export function useNavigationPending(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => pending.size > 0,
    () => false,
  )
}
