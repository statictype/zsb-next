import { useState } from 'react'

export function useLightbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [index, setIndex] = useState(0)

  function open(i: number) {
    setIndex(i)
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }

  return { isOpen, index, setIndex, open, close }
}
