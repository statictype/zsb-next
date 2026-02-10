import styles from './Marquee.module.css'

interface MarqueeProps {
  text: string
}

export function Marquee({ text }: MarqueeProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {text} {text}
      </div>
    </div>
  )
}
