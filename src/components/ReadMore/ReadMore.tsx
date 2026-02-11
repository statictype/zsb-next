'use client'

import { useState } from 'react'
import styles from './ReadMore.module.css'

interface ReadMoreProps {
  children: React.ReactNode
  dark?: boolean | undefined
}

export function ReadMore({ children, dark = false }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <div
        className={`${styles.expandable} ${expanded ? styles.isExpanded : ''} ${dark ? styles.dark : ''}`}
      >
        {children}
      </div>
      <button
        type="button"
        className={`${styles.btn} ${dark ? styles.btnDark : ''}`}
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span>{expanded ? 'Show less' : 'Read more'}</span>
        <span className={styles.icon}>+</span>
      </button>
    </>
  )
}
