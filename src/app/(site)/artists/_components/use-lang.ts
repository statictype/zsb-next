'use client'

import { useSyncExternalStore } from 'react'
import type { Lang } from '@/types/edition'

const STORAGE_KEY = 'zsb-lang'
const DEFAULT_LANG: Lang = 'ro'

const listeners = new Set<() => void>()
let memoryLang: Lang | undefined

function readStored(): Lang | undefined {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'ro' || stored === 'en' ? stored : undefined
  } catch {
    return undefined
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function getSnapshot(): Lang {
  return memoryLang ?? readStored() ?? DEFAULT_LANG
}

function getServerSnapshot(): Lang {
  return DEFAULT_LANG
}

function setLang(lang: Lang) {
  memoryLang = lang
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {}
  for (const listener of listeners) listener()
}

export function useLang(): [Lang, (lang: Lang) => void] {
  return [useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot), setLang]
}
