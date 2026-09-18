import { defineSingleton } from '@site/_lib/singleton'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))

const OPTIONS = { perspective: 'published' as const }

function Shell({ title }: { title: string }) {
  return <h1>{title}</h1>
}

describe('defineSingleton', () => {
  it('renders the shell with what load resolved', async () => {
    const page = defineSingleton({
      load: async () => ({ title: 'Loaded' }),
      Shell,
      generateMetadata: async () => ({ title: 'Meta' }),
    })
    render(await page.render(OPTIONS))
    expect(screen.getByRole('heading', { name: 'Loaded' })).toBeInTheDocument()
    expect(page.fallback).toBeNull()
    expect(page.editionsNav).toBe(false)
  })

  it('turns an absent singleton into a 404', async () => {
    const page = defineSingleton({
      load: async () => null,
      Shell,
      generateMetadata: async () => ({}),
    })
    await expect(page.render(OPTIONS)).rejects.toThrow('NEXT_NOT_FOUND')
  })
})
